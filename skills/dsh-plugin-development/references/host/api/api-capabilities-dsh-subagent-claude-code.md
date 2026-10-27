# @deepseek-ai/dsh-subagent-claude-code 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

当委派任务应在父工作区中以全新、无人值守的 Claude Code 会话运行时，安装这个 Profile Bundle。每次运行接受一个自包含文本任务，并返回最终答案或安全的失败诊断；推理、工具通信、stderr、用量信息和工作区差异不会进入父 Session。Claude 原生设置与身份验证继续是权威来源，而 Profile 配置选择模型、环境和 `permissionMode`。针对平台锁定的运行时仅在需要时启动，并且绝不会回退到宿主 `claude` 可执行文件。当隔离和真实 Claude Code 行为比续接或提示更重要时，选择本包。

### 使用本包

当任务需要在父工作区中运行全新的原生 Claude Code 会话时，在 Web 或 Desktop 插件页启用 **Claude Code 子智能体**。

#### 安装 Bundle

官方条目可离线显示。启用时，普通 bundle 安装器会安装当前 DSH 安装对应的目标并选择其配置层。此层注册提供方，并为所有智能体添加全局工具 `subagent_claude_code`；实际委派前不会启动原生进程。安装器提示需要重启时，请重启应用。

关闭只会取消选择配置层，保留已安装的包。移除是独立的包操作。启用或关闭会在运行中的 Host 注册或移除该全局工具，正在运行的智能体会在下一次请求时看到变化。

此层只插入 Host 条目，因此任何配置（包括随附的 headless、SDK 和 ACP）都可以选择它。原有仅提供方用法请遵循升级指南。

#### 配置

| 字段 | 默认值 | 含义 |
|---|---|---|
| `providerName` | `claude-code` | `ctx.subagents` 上的非空注册名称；每个已挂载实例都需要唯一值 |
| `model` | Claude 原生设置 | 为本提供方实例的每次运行固定的可选非空模型名称；省略时不发送 SDK 覆盖 |
| `env` | `{}` | 叠加在已清理凭据的父环境之上的显式 SDK/CLI 环境 |
| `permissionMode` | `dontAsk` | 为本提供方实例的每次运行固定的原生非交互权限策略 |
| `disposeGraceMs` | `3000` | 共享 managed-range owner 各终止层级之间的宽限 |

| `permissionMode` 值 | 原生行为 |
|---|---|
| `dontAsk` | 不弹出提示，直接拒绝尚未获授权的操作 |
| `acceptEdits` | 接受文件编辑；其余权限提示由无人值守回调拒绝 |
| `auto` | 由 Claude Code 原生分类器允许或拒绝权限请求 |
| `plan` | 使用原生规划模式，拒绝执行审批，并把完整计划作为最终答案返回 |
| `bypassPermissions` | 显式设置 SDK 的危险确认并跳过权限检查 |

#### 暴露工具

Bundle 将 `tool-subagent-claude-code` 作为 Host 条目插入，因此 `subagent_claude_code` 是所有预设（包括 minimal）都可见的全局工具。后续用户补丁可以按 id 配置或禁用该行。预设自行注册的同名工具会为其智能体遮蔽该全局工具。若要不选择 bundle 层而挂载提供方和工具，在 `cordis.patch.yml` 中插入相同的条目：

```yaml
- insert:
    - id: subagent-claude-code
      name: '@deepseek-ai/dsh-subagent-claude-code'
    - id: tool-subagent-claude-code
      name: '@deepseek-ai/dsh-tool-subagent'
      config:
        provider: claude-code
        toolName: subagent_claude_code
        maxDepth: provider-managed
```

工具接受任务后返回 child id；任务完成后向父 agent 发送结果通知。外部 activation 只执行一次，不支持追加输入或恢复对话。

#### 你会得到什么

完成通知包含 Claude Code 的最终答案，或停止原因与可选的安全诊断。父会话还独立保存外部任务的身份和完整终态结果；无需创建本地子 Session。产品推理、工具活动、原始 stderr 与工作区差异不会进入父会话。

#### 失败与恢复

省略 optional dependencies、当前平台不受支持或所选载荷缺失的安装会让提供方保持休眠，并在第一次委派时于 SDK 启动边界报告安全的 `query-start` / `unknown` 失败事实；不存在宿主 CLI 回退。原始产品错误只保留在内部 cause 链与提供方 Host 日志中。被取消的运行以 `aborted` 结算。

-----

### 已知限制与延期工作

这些限制说明本提供方何时不合适，或何时需要特别的运维注意。它们是当前包约束，不是通用 Claude Code 对比或任务积压。

- **每次运行均新建一个 query 和一个进程**——不支持续接、恢复、池化、进度流或产品会话持久化。
- **静态选择实例**——Profile 配置项固定提供方名称、可选模型与工具绑定；调用无法动态选择或修改提供方与模型，而且每个公开工具都需要唯一的 `toolName`。
- **宿主设置有意保持权威**——省略 `model` 时由项目与用户设置选择模型；原生设置始终保留其余工具和行为，本提供方不提供经过筛选或与宿主环境隔离的生产模式。
- **身份验证与账户状态仍由原生机制管理**——Bundle 会提供 CLI，但不会创建账户、登录或改写 Claude 设置；配置与身份验证失败会公开其生命周期阶段与安全的 `unknown` 回退，而不会增加单独的公开分类。
- **委派时必须存在 SDK 平台载荷**——省略 optional dependencies 的安装、不受支持的平台以及缺失或损坏的载荷都会在第一次 query 时失败；不会回退到宿主 CLI。
- **没有人工交互路径**——`AskUserQuestion` 被禁用，权限提示会被拒绝，MCP elicitation 会被拒绝，阻塞对话会以拒绝方式失败而不会挂起。
- **assistant 载荷仅包含最终文本**——失败运行还可公开独立的安全诊断；推理、中间消息、工具通信、用量、stderr 与工作区差异不会进入父 Session。任务身份与终态结果保存在父日志中。
- **没有可选的共享能力**——对于本提供方，共享服务会拒绝 `agentPreset`、`agentOptions`、输出 schema 和 harness 深度强制约束。
- **没有按实际经过时间触发的超时或副作用回滚**——长时间运行的工作由调用方取消，且取消前已更改的文件或外部系统不会恢复原状。

## Config（.）

公开导入：`@deepseek-ai/dsh-subagent-claude-code`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    providerName?: string;
    model?: string;
    env?: Record<string, string>;
    permissionMode?: ClaudeCodePermissionMode;
    disposeGraceMs?: number;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-claude-code.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-subagent-claude-code`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-claude-code.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-subagent-claude-code`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-claude-code.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-subagent-claude-code`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "subagent-claude-code";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-claude-code.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
