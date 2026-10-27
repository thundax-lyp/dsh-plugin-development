# @deepseek-ai/dsh-subagent-dsh-sdk 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-subagent-dsh-sdk` 在全新的 DeepSeek Harness 子进程中运行每个委派任务，子进程拥有自己的 profile、会话、模型路由与工具。父级提供任务与工作目录，每个子进程使用其已配置的运行时，并与父级对话保持隔离。父级只会收到子进程最终的 assistant 文本或安全错误；中间消息与工具流量保留在子进程内。当委派需要完整的 Harness 运行时而不是共享进程内状态时，选择此后端，并接受每次运行都要启动新进程的成本。

### 使用本包

当委派应以完整 Harness 运行时在独立进程中运行时，挂载本提供方。常用路径是显式的：挂载 seam、挂载本提供方，按需配置 `dshBin`，并选择子级 `profile` 与有序 `patches`。

#### 何时选择

当子进程必须是完整的 harness 对等体——拥有自己的组合、会话持久化、模型路由与工具——而不是共享父进程的 agent 时，选择此后端。当子进程必须共享父级组合或遵守父级强制的非路由能力时，请选择进程内后端：本提供方接受 agent 路由选项，但会拒绝独立 preset、结构化输出或深度上限，而不是静默省略。

提供方声明 `agentOptions: true`，同时保持 `agentPreset`/`outputSchema`/`depthLimit` 为 false，并且 `inheritsParentContext: false`。不可变的 `agentRouteDefaults` 会在模型覆盖与确切路由预检前，把配置的 provider／model 基线公开给 `dsh-tool-subagent`；后端在 activation 启动时应用同一份配置默认值，包括 `maxTokens`。agent 路由值通过显式白名单跨越 SDK 协议；子进程仍是另一进程里的全新运行时，子进程使用所选有效目录，而其 Session 保留父级起始目录。基于本提供方的 `dsh-tool-subagent` 部署应设置 `maxDepth: 'provider-managed'`——子 harness 拥有自己的递归预算。

#### 配置

| 字段 | 默认值 | 含义 |
|---|---|---|
| `providerName` | `dsh-sdk` | `ctx.subagents` 上的注册表名称 |
| `dshBin` | SDK 依赖 | 显式 dsh CLI（命令行界面）模块，在插件加载时解析并校验；省略则使用 SDK 依赖 |
| `profile` | `sdk` | 具名子 profile |
| `patches` | `[]` | 每次启动的有序 profile patch 文件，在插件加载时解析并校验 |
| `dshHome` | 必填 | 每个嵌套子进程的绝对隔离 Harness home |
| `provider` | `deepseek-official` | 写入子进程 `initialize` 的提供方路由 |
| `model` | `deepseek-v4-flash` | 写入子进程 `initialize` 的模型 |
| `maxTokens` | 适配器／提供方路由默认值 | 写入子进程 `initialize` 的单次请求输出 token 上限 |
| `env` | `{}` | 叠加在已清理凭据的父环境之上的显式子环境 |
| `shutdownTimeoutMs` | `1000` | dispose（资源释放）期间协议 `shutdown` 交换的时限 |
| `disposeEofGraceMs` | `6000` | stdin EOF 之后、平台终止之前的宽限 |
| `disposeGraceMs` | `3000` | 终止后的退出确认宽限 |

请求 `agentOptions` 会分别覆盖 `provider`、`model` 与 `maxTokens`。`reasoningEffort` 没有提供方实例默认值：请求省略时保持缺省，由所选子模型解析自身默认值。面向模型的 subagent 工具可在每次调用时选择提供方／模型／推理强度；`maxTokens` 仍由工具配置或本提供方默认值在部署侧控制。

```yaml
- id: subagent-dsh-sdk
  name: '@deepseek-ai/dsh-subagent-dsh-sdk'
  config:
    providerName: dsh-sdk
    profile: sdk
    patches: ['./profiles/research-child.cordis.yml']
    dshHome: !!js dshHomePath('children')
    maxTokens: 49152
    env:
      DEEPSEEK_API_KEY: !!js process.env.DEEPSEEK_API_KEY
- id: tool-subagent
  name: '@deepseek-ai/dsh-tool-subagent'
  config: { provider: dsh-sdk, toolName: subagent, maxDepth: 'provider-managed' }
```

#### 你会得到什么

成功的运行会把子进程最终的 assistant 文本（或取消后累积的部分文本）作为结果输出返回。子进程的模型路由、工具与会话来自子运行时自身——父级提供任务、工作目录与 `initialize` 路由。子进程最后一个持久化 `turn/end` 会映射进 seam 词汇：`completed` 与 `max-tokens` 原样通过，`blocked` 变为 `refusal`，意外终态或缺少终态变为 `error`。`aborted` 结果保持中止；只有子进程侧 `disposed` 原因会附加 `child-disposed` 诊断。

#### 失败与恢复

配置的 SDK 运行时必须实现 `session/wait`；不支持该请求的运行时会报告执行失败。请一并更新提供方与单独配置的 `dshBin` 运行时。已取消的请求会在路径解析或 spawn 之前失败。路由、spawn、握手或发布前取消失败通常只在子进程被回收后拒绝；如果初始化与清理均失败，有序安全事实会保留两项失败，而不会宣称已完全停稳。子运行时在发布后失败时会通过运行本身结算，而不是拒绝；部分输出与安全诊断保持分离。诊断只公开提供方、`initialize`、`session-run` 或 `shutdown` 阶段，以及固定类别。SDK 消息、stderr、路径、任务内容、环境值、凭据和协议载荷绝不会复制到诊断中。

-----

### 已知限制与延期工作

这些限制说明本后端何时不合适，或何时需要特别的运维注意。它们是当前包约束，不是通用 SDK 对比或任务积压。

- **每次运行都使用全新的运行时进程**——不使用进程池；harness 运行时需要启动完整的插件树，因此每次运行的 spawn 成本高于 ACP 后端通常使用的子进程。
- **不支持路由之外的启动时能力**——父级可以选择子 agent 路由，但无法在子进程内强制执行 `agentPreset`、`outputSchema` 或深度限制；应改为配置所选子 profile 及其有序 patch。
- **子任务转录保留在子进程自己的会话根目录中**——父日志保留外部任务身份与完整结果；流式 `session.event` 通道用于提取输出，不用于复制子任务转录。
- **仅支持本地子进程**——解析出的工作目录是本地路径；远程运行时需要独立的后端。

## Config（.）

公开导入：`@deepseek-ai/dsh-subagent-dsh-sdk`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    providerName: string;
    dshBin?: string;
    profile: string;
    patches: string[];
    dshHome: string;
    provider: string;
    model: string;
    maxTokens?: number;
    env: Record<string, string>;
    shutdownTimeoutMs?: number;
    disposeEofGraceMs?: number;
    disposeGraceMs?: number;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-dsh-sdk.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-subagent-dsh-sdk`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-dsh-sdk.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-subagent-dsh-sdk`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-dsh-sdk.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-subagent-dsh-sdk`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "subagent-dsh-sdk";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-dsh-sdk.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
