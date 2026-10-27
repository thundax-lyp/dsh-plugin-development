# @deepseek-ai/dsh-hooks-claude-code 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-hooks-claude-code` 在 agent（智能体）运行期间执行你现有 Claude Code `hooks.json` 或 settings 文件中的 command 钩子，无需重写。受支持的钩子会在会话、提示词、工具、停止或 subagent 到达对应时刻时运行。它们可以带模型可见的原因阻塞提示词或工具调用、添加对话上下文，或强制模型再执行一个轮次。需要在 harness 中复用 Claude Code command 钩子时选择本包；没有 Claude Code 对应物的行为应使用原生插件。

### 使用本包

每个钩子事件开始时，钩子进程及其载荷中的 `cwd` 均使用 Session 的当前工作目录。未配置 `projectDir` 时，`CLAUDE_PROJECT_DIR` 同样使用该目录。`SubagentStop` 在子智能体释放后读取其最终已提交的目录；它不能恢复缺失目录或修改该 Session，停止钩子失败时会发出警告。

挂载本包并把 `configPath` 指向你的钩子配置，你已有的钩子就会在 agent 运行中的对应时刻开始触发。在第一个钩子生效之前无需其他设置。

#### 何时选择

当你持有 Claude Code `hooks.json`（或 `hooks` key 存放配置的 settings 文件）、且其中的 command 钩子需要把关提示词、工具与轮次时，使用它。没有 Claude Code 对应物的行为请跳过它：原生插件拥有完整的 harness API，而本桥接只运行参考工具的 command hook 子集。

#### 最小配置

```yaml
- name: '@deepseek-ai/dsh-hooks-claude-code'
  config:
    configPath: ./.claude/hooks.json
    pluginRoot: ./.claude/plugins/my-plugin
    projectDir: .
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `configPath` | 必填 | `hooks.json` 或 `hooks` key 存放配置的 settings 文件路径 |
| `pluginRoot` | — | 替换命令字符串中的 `${CLAUDE_PLUGIN_ROOT}` |
| `projectDir` | 会话工作区 | 替换 `${CLAUDE_PROJECT_DIR}` 并设置 `CLAUDE_PROJECT_DIR` 环境变量 |
| `defaultTimeoutMs` | `600,000` | hook 未设置时的每 hook 超时（即 Claude Code 默认值） |
| `stderrSummaryMaxChars` | `500` | 持久化 `hook/result` stderr 摘要的字符上限 |

#### 你的钩子能做什么

| 你的钩子 | 运行时机 | 能做什么 |
|---|---|---|
| `SessionStart` | 会话开始时 | 附加该会话中模型可见的上下文 |
| `UserPromptSubmit` | agent 收到提示词时 | 阻塞提示词，或附加上下文 |
| `PreToolUse` | 工具运行前 | 阻塞工具，或在运行前请求批准 |
| `PostToolUse` | 工具运行后 | 带反馈阻塞结果，或附加上下文 |
| `Stop` | 运行即将停止时 | 带原因强制再执行一步 |
| `SubagentStart` | subagent 启动时 | 向仍在运行的 subagent 附加上下文（仅限同进程） |
| `SubagentStop` | subagent 结束时 | 只观测——不能阻塞或添加上下文 |

#### 钩子如何运行与失败

- 钩子在 agent 的 Session 当前目录中运行；`pwd`、载荷中的 `cwd` 与相对路径保持一致。
- 命令字符串中的 `${CLAUDE_PLUGIN_ROOT}` 与 `${CLAUDE_PROJECT_DIR}` 会按你的配置替换，且每个钩子进程都会设置 `CLAUDE_PROJECT_DIR`。
- 一份配置应用于整个进程：启动时只读取一次，相对 `configPath` 从启动进程的目录解析。
- 同一事件上的钩子按配置顺序逐个运行。
- 如果配置无法读取或解析，桥接会记录警告且不运行任何钩子——agent 仍会启动。
- 运行失败的钩子（命令错误或崩溃）会被记录，agent 继续运行。

-----

### 已知限制与延期工作

这些限制描述你的 Claude Code 钩子目前还无法通过本桥接做到的事情，以及行为与参考工具的差异。它们是当前包约束，而非任务积压。

- **不支持的 hook 事件（Claude Code 当前 30 项中的 23 项）**——`Setup`、`InstructionsLoaded`、`UserPromptExpansion`、`MessageDisplay`、`PermissionRequest`、`PostToolUseFailure`、`PostToolBatch`、`PermissionDenied`、`Notification`、`TaskCreated`、`TaskCompleted`、`StopFailure`、`TeammateIdle`、`ConfigChange`、`CwdChanged`、`FileChanged`、`WorktreeCreate`、`WorktreeRemove`、`PreCompact`、`PostCompact`、`SessionEnd`、`Elicitation` 与 `ElicitationResult`。这些事件的配置会在配置组解析前被忽略，因此不支持的事件既不会使配置失效，也不会注册 hook。比较基线是 Claude Code 官方 hook 事件参考。
- **`SessionStart` 只支持部分功能**——会消费 JSON `additionalContext`，但不支持纯 stdout 上下文、`initialUserMessage`、`sessionTitle`、`watchPaths`、`reloadSkills` 与 `CLAUDE_ENV_FILE`。hook 脱离运行，因此上下文可能错过第一个请求，payload 会省略 `model`、`agent_type` 与 `session_title` 等可选字段。
- **`UserPromptSubmit` 只支持部分功能**——支持阻塞与 JSON `additionalContext`，但不支持纯 stdout 上下文、`sessionTitle` 与 `suppressOriginalPrompt`。除非被覆盖，否则桥接还会使用自身 600 秒默认值，而非 Claude Code 的事件特定 30 秒 command 超时。
- **`PostToolUse` 只支持部分功能**——支持阻塞反馈与 JSON `additionalContext`，但不支持 `updatedToolOutput` 与 `updatedMCPToolOutput`，`tool_response` 会展平为文本。
- **`SubagentStart` 与 `SubagentStop` 只支持部分功能**——两者均报告常量 `agent_type` `general-purpose`，并在 Claude Code 报告父会话的位置使用 child 会话 id。Start 上下文是尽力而为，且只能到达仍在运行的同进程 child；stop 只观测，无法阻塞 subagent 或向其提供上下文。Stop 省略 `agent_transcript_path`、`last_assistant_message`、`background_tasks` 与 `session_crons`，并始终报告 `stop_hook_active: false`。
- **`Stop` 只支持部分功能**——阻塞会强制另一个模型轮次，但 `stop_hook_active` 始终为 `false`，会省略 `last_assistant_message`、`background_tasks` 与 `session_crons`，且未实现连续阻塞上限。因此，无条件阻塞 hook 会在每个步骤中强制 continuation，除非它自我限制。
- **通用 payload 与输出字段只支持部分功能**——已映射事件会省略 Claude Code 原本会提供的 `prompt_id`、`permission_mode` 与 `effort`，且 `transcript_path` 永不填充：它始终为空字符串，因为持久化 seam 不暴露产物路径，且默认使用 Zstandard 压缩的会话日志无法被 hook 脚本读取。`systemMessage` 会被记录 + 警告但不呈现；`{"continue": false}` 会被记录但不会停止运行；`suppressOutput`、`stopReason` 与 `terminalSequence` 不会被应用。
- **Handler 与配置只支持部分功能**——只运行 shell 形态 command handler。会跳过 `http`、`mcp_tool`、`prompt` 与 `agent` handler；`args`、`async`、`asyncRewake`、`shell`、`if`、`once` 与 `statusMessage` 等 command handler 选项不会被遵循。匹配 handler 串行运行且不去重，而 Claude Code 会并行运行并对相同 handler 去重。一个进程级 `configPath` 会在加载时解析一次；尚未实现 Claude Code 的分层项目、用户、插件与策略发现以及实时重新加载。

## Config（.）

公开导入：`@deepseek-ai/dsh-hooks-claude-code`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    configPath: string;
    pluginRoot?: string;
    projectDir?: string;
    defaultTimeoutMs?: number;
    stderrSummaryMaxChars?: number;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hooks-claude-code.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-hooks-claude-code`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hooks-claude-code.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-hooks-claude-code`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hooks-claude-code.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-hooks-claude-code`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "hooks-claude-code";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hooks-claude-code.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
