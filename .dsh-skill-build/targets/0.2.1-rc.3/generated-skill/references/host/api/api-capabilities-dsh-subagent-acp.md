# @deepseek-ai/dsh-subagent-acp 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

使用本包可将任务委派给运行在全新子进程中的 ACP 兼容 agent；子 agent 拥有独立的运行时、会话、模型和工具。每次运行只共享选定的工作目录，通过 ACP 发送任务，并返回子 agent 的最终答案或安全错误；中间消息和工具流量不会进入父级对话。权限提示由配置的策略自动应答，无需人工介入。当委派需要进程隔离或需要使用非 Harness ACP agent 时选择本包；当子 agent 必须共享父级能力时，选择进程内后端。

### 使用本包

当组合需要一个支持 Agent Client Protocol、完全隔离且在进程外运行的子 agent 时，挂载本提供方。常用路径是显式的：挂载 seam、挂载本提供方，并给出一个启动 ACP agent 的命令。

#### 何时选择

当子 agent 必须在独立进程中运行、拥有自己的运行时、模型和工具时选择此后端——例如来自其他项目的 ACP agent——或者你希望委派完全无法触及父 harness 时。当子 agent 必须共享父级组合或遵守父级强制执行的能力约束时，请选择进程内后端：本提供方不声明任何可选启动时能力，因此 seam 会拒绝要求 `agentPreset`、`agentOptions`、结构化输出或深度上限 的请求，而不是静默省略。

#### 配置

| 字段 | 默认值 | 含义 |
|---|---|---|
| `providerName` | `acp` | `ctx.subagents` 上的注册表名称 |
| `command` | 必填 | 每次运行时 spawn 的可执行文件（子 ACP agent） |
| `args` | `[]` | 命令参数 |
| `permission` | `reject` | 自动应答权限请求：拒绝，或选择第一个 `allow_once` 或 `allow_always` 选项（`allow`） |
| `env` | `{}` | 叠加在已清理凭据的父环境之上的显式子环境 |
| `disposeEofGraceMs` | `6000` | stdin EOF 之后、平台终止之前的宽限 |
| `disposeGraceMs` | `3000` | 失败后观察结构化进程事实的时限；在 POSIX 上也是 SIGTERM 到 SIGKILL 的宽限 |

DeepSeek Harness 子进程使用产品启动器和一个显式的绝对路径 `DSH_HOME`。隔离的 home 可防止嵌套运行时发现启动者个人的 profile 或凭据；通用 ACP 提供方不会把这一要求强加给非 DSH agent。

```yaml
- id: subagent-acp
  name: '@deepseek-ai/dsh-subagent-acp'
  config:
    providerName: acp
    command: dsh
    args: ['--profile', 'acp', '--patch', '/absolute/path/to/acp.patch.yml']
    permission: reject
    env:
      DSH_HOME: /absolute/path/to/isolated-child-home
      DEEPSEEK_API_KEY: !!js process.env.DEEPSEEK_API_KEY
```

#### 你会得到什么

成功的运行会把子 agent 最终的流式 assistant 文本作为结果输出返回。子 agent 的会话、模型与工具来自子进程自身——父级只提供任务与工作目录。停止原因把 `end_turn` 映射为 `completed`、`max_tokens` 映射为 `max-tokens`、`refusal` 映射为 `refusal`、`cancelled` 映射为 `aborted`，其余值映射为 `error`。已发布运行失败时，部分 assistant 文本保留在 `output`，安全的结构化详情则单独放在 `diagnostic`。

#### 失败与恢复

spawn、初始化或新建会话失败会在发布前拒绝，通常先证明 managed range 已经完全停稳。如果清理也失败，拒绝会保留有序、安全的启动与拆卸事实，但不会声称整个 range 已经停稳。非取消错误只暴露固定的提供方、阶段与类别事实；原始失败保留在内部 cause 链与 Host 诊断中。发布后，提示词、传输或进程提前退出会以携带安全诊断的 `error` 结算；本地取消则以不带失败详情的 `aborted` 结算。

#### 安全诊断

通用诊断使用固定的一行：`Subagent failure (provider: ACP; stage: <stage>; category: <category>; ...)`。可选的停止原因、退出码与信号只来自封闭协议或受管进程事实。stderr、异常文本、任务内容、工具输入、路径、环境值、凭据与协议载荷绝不会进入诊断；共享结果边界把诊断限制在 4096 个 UTF-8 字节内。请求过权限且未完成的运行可以增加一行固定的策略、工具种类与决定。成功运行和本地取消不包含该行。

-----

### 已知限制与延期工作

这些限制说明本后端何时不合适，或何时需要特别的运维注意。它们是当前包约束，不是通用 ACP 对比或任务积压。

- **每次运行使用全新进程**——没有进程池；每次委派都要付出完整的 spawn 与 ACP 握手成本。
- **仅支持本地工作区**——解析后的工作目录是交给同一台机器上子进程的本地路径；远程工作区映射尚未设计。
- **不支持可选启动时能力**——本提供方无法在远程进程内应用 `agentPreset`、`agentOptions`、`outputSchema` 或深度上限，因此 seam 会拒绝需要它们的请求。
- **只收集已提交的 `agent_message_chunk` 文本**——自动化服务器把推理（reasoning）、工具活动、计划和其他 trace 数据保留在子 agent 会话日志中，不通过 ACP 发出。
- **权限提示自动应答**（`permission: allow | reject`）——不会把子 agent 的 `session/request_permission` 呈现给人。

## Config（.）

公开导入：`@deepseek-ai/dsh-subagent-acp`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    providerName: string;
    command: string;
    args: string[];
    permission: PermissionPolicy;
    env: Record<string, string>;
    disposeEofGraceMs?: number;
    disposeGraceMs?: number;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-acp.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-subagent-acp`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-acp.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-subagent-acp`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-acp.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-subagent-acp`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "subagent-acp";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-acp.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
