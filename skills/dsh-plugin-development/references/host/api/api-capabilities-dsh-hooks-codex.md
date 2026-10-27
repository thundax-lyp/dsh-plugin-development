# @deepseek-ai/dsh-hooks-codex 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-hooks-codex` 在 agent（智能体）运行期间执行现有 Codex `hooks.json` 中的 command 钩子，让提示词与工具把关逻辑无需重写即可生效。它支持 5 个 Codex hook 点：会话开始、提示词提交、工具执行前后以及停止。钩子可以用模型可见的原因阻塞提示词或工具调用、添加对话上下文，或强制 agent 再执行一步。需要在 harness 中复用 Codex command 钩子时选择本包；超出这一受支持子集的行为应使用原生插件。

### 使用本包

每个钩子事件开始时，钩子进程及其载荷中的 `cwd` 均使用 Session 的当前工作目录。

挂载本包并把 `configPath` 指向你的 `hooks.json`，你已有的钩子就会在 agent 运行中的对应时刻开始触发。在第一个钩子生效之前无需其他设置。

#### 何时选择

当你持有 Codex `hooks.json`、且其中的 command 钩子需要把关提示词、工具与轮次时，使用它。没有 Codex 对应物的行为请跳过它：原生插件拥有完整的 harness API，而本桥接只运行参考工具的 command hook 子集。

#### 最小配置

```yaml
- name: '@deepseek-ai/dsh-hooks-codex'
  config:
    configPath: ./.codex/hooks.json
    model: deepseek-v4
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `configPath` | 必填 | Codex `hooks.json` 的路径 |
| `model` | `''` | 写入每个 payload 的模型名称（Codex 在每个事件中都包含 `model`） |
| `defaultTimeoutMs` | `600,000` | hook 未设置时的每 hook 超时（即 Codex 默认值） |
| `stderrSummaryMaxChars` | `500` | 持久化 `hook/result` stderr 摘要的字符上限 |

#### 你的钩子能做什么

| 你的钩子 | 运行时机 | 能做什么 |
|---|---|---|
| `SessionStart` | 会话开始时 | 附加该会话中模型可见的上下文 |
| `UserPromptSubmit` | agent 收到提示词时 | 阻塞提示词，或附加上下文 |
| `PreToolUse` | 工具运行前 | 阻塞工具 |
| `PostToolUse` | 工具运行后 | 带反馈阻塞结果，或附加上下文 |
| `Stop` | 运行即将停止时 | 带原因强制再执行一步 |

#### 钩子如何运行与失败

- 钩子在 agent 的 Session 当前目录中运行；`pwd`、载荷中的 `cwd` 与相对路径保持一致。
- 一份配置应用于整个进程：启动时只读取一次，相对 `configPath` 从启动进程的目录解析。
- 只运行同步 command 钩子；`async: true` 或非 command 钩子会被跳过并给出警告。
- 同一事件上的钩子按配置顺序逐个运行。
- 如果配置无法读取或解析，桥接会记录警告且不运行任何钩子——agent 仍会启动。
- 运行失败的钩子（命令错误或崩溃）会被记录，agent 继续运行。

-----

### 已知限制与延期工作

这些限制描述你的 Codex 钩子目前还无法通过本桥接做到的事情，以及行为与参考工具的差异。它们是当前包约束，而非任务积压。

- **不支持的 hook 事件（Codex 当前 10 项中的 5 项）**——`PermissionRequest`、`PreCompact`、`PostCompact`、`SubagentStart` 与 `SubagentStop`。这些事件的配置会在解析期间静默丢弃。比较基线是 Codex 官方 hook 参考。
- **`SessionStart` 只支持部分功能**——支持纯 stdout 与 JSON `additionalContext`，但 hook 脱离运行，因此上下文可能错过第一个请求。
- **`UserPromptSubmit` 只支持部分功能**——支持阻塞加纯 stdout 或 JSON 上下文，但不会强制执行通用 `systemMessage` 与 `{"continue": false}` 控制。
- **`PreToolUse` 只支持部分功能**——支持阻塞，但会忽略 `additionalContext`、`permissionDecision: "allow"` 与 `updatedInput`。每个工具都表示为 `tool_input: { command }`，因此非 shell 工具参数不会被如实公开给 hook。
- **`PostToolUse` 只支持部分功能**——支持阻塞反馈与 JSON `additionalContext`，但不会强制执行 `{"continue": false}`，非 shell 工具参数会缩减为 `{ command }`，结构化工具输出会在 `tool_response` 中展平为文本。
- **`Stop` 只支持部分功能**——阻塞会强制另一个模型轮次，但 `stop_hook_active` 始终为 `false`，`last_assistant_message` 始终为 `null`，且不会强制执行 `{"continue": false}`。因此，无条件阻塞 hook 会在每个步骤中强制 continuation，除非它自我限制。
- **通用 payload 与输出字段只支持部分功能**——每个已映射事件都报告静态配置的 `model` 与 `permission_mode: "default"`，而非当前 Codex 运行时值，且 `transcript_path` 永不填充：它始终为 `null`，因为持久化 seam 不暴露产物路径，且默认 zstd 压缩的会话日志无法被 hook 脚本读取。`systemMessage` 会被记录 + 警告但不呈现，`{"continue": false}` 会被记录但不会应用 Codex 的事件特定停止行为。
- **配置加载与执行只支持部分功能**——一个进程级 `configPath` 会在加载时解析；尚未实现 Codex 的活动用户层、项目层、会话层、系统／托管层与插件层、信任控制以及内联 `config.toml` hook 形态。只运行同步 `command` handler，`statusMessage` 与 `commandWindows` 等当前元数据会被忽略，匹配 handler 串行运行，而非使用 Codex 的并发启动语义。

## Config（.）

公开导入：`@deepseek-ai/dsh-hooks-codex`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    configPath: string;
    model?: string;
    defaultTimeoutMs?: number;
    stderrSummaryMaxChars?: number;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hooks-codex.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-hooks-codex`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hooks-codex.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-hooks-codex`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hooks-codex.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-hooks-codex`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "hooks-codex";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hooks-codex.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
