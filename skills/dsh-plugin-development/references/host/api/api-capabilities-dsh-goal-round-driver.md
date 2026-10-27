# @deepseek-ai/dsh-goal-round-driver 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-goal-round-driver` 会在同一会话内自动继续 active goal，但前提是 agent（智能体）已空闲、续行已启用且配置的 Round 额度仍有剩余。每个 Round 都让模型获得另一次推进目标的机会；只有进入模型历史的 goal Round 才消耗额度，额度耗尽时会记录 blocker。驱动器本身没有配置：goal 定义 Round 上限，`dsh-tool-goal` 定义重复受阻后何时停止续行。若任务需要无人值守的多轮推进，应与 `dsh-goal` 和 `dsh-tool-goal` 一起挂载；若每一步都需要人工 steering（中途引导），则不要挂载。

### 使用本包

当 active 的 goal 应在无人干预的情况下持续推进时，挂载 `dsh-goal-round-driver`。它与 goal 服务和 goal 工具组合使用：服务拥有状态，工具让模型控制状态，本包负责调度轮次。

#### 组合方式

把驱动器挂载在 goal 服务与 goal 工具旁边；驱动器本身不需要任何配置。

```yaml
- id: goal
  name: '@deepseek-ai/dsh-goal'

- id: tool-goal
  name: '@deepseek-ai/dsh-tool-goal'

- id: goal-round-driver
  name: '@deepseek-ai/dsh-goal-round-driver'
```

`maxGoalRounds` 属于 goal 定义，面向模型的阻塞阈值属于 `dsh-tool-goal`；在驱动器中重复任一数值都可能产生分歧策略。

#### 每轮做什么

当对应的活跃 agent 处于 idle，且存在 active、已启用续行、仍有容量的 goal 时，驱动器会排入一条 goal-round 提示词。它点明以 JSON 引用的目标、Round 编号与上限，并告诉模型以当前工作区、工具结果和持久状态为准。被接纳的 Round 会开启独立请求序列，因此 Chat 会在 goal 消息之前渲染其自包含请求 header。该 Round 以 goal 来源的用户消息进入历史；只有进入步骤的 goal 消息消耗上限，人类消息和陈旧预留不会消耗。goal 生命周期变更仍必须通过 `dsh-tool-goal` 的独立权限检查。

#### 何时停止续行

Round 只在整个 agent 进入 idle 时启动；加载了子 agent 服务时，还要等该 agent 仍在推进的后代全部结束后才启动；完成、暂停和阻塞会阻止续行；宿主发起的暂停还会中止正在运行的轮次，而模型在自己轮次内发起的暂停会正常结束。编辑只会通过修订栅栏使进行中的 Round 失效，驱动器会继续新修订。驱动器也会在以下情况自行停止：轮次因 max tokens 结束、持久性写入失败、agent 被取消、插件卸载，或 Round 上限耗尽——上限耗尽时它会以稳定代码 `round-limit` 记录一个 blocker。取消绝不会自动重启 Round：Round 已在进行的 goal 会在下一次 idle 时被暂停；与 goal 尝试无关的取消只会停用续行。agent 进入 idle 时仍在排队的 Round 提示会从收件箱移除，后续人类输入不会排在它后面等待；被取消的轮次属于其他工作时，续行会被停用而不是暂停。

#### resume、fork 或卸载之后

把驱动器挂载到现有 agent 上绝不会启用任何 goal 的续行；会话 resume 或 fork 后，active 的 goal 会保持停用续行，直到用户明确授权 resume——驱动器绝不会自行复活工作。卸载插件会取消进行中的 Round，并确保不再启动后续 Round。

-----

### 已知限制与延期工作

这些限制说明驱动器何时不合适或需要特别注意。它们是当前包约束，不是任务积压。

- **没有独立评估器**——面向模型的 goal 策略会判断证据是否足以完成，以及 blocker 在语义上是否未变；评估器支持的认证仍保持暂缓。
- **只在同一会话执行**——此包有意不 spawn 新 agent、不 fork 会话前缀，也不实现 Ralph 风格的独立尝试；该工作流属于单独的插件层。
- **已接受队列的卸载竞态**——Cordis 插件卸载是异步的。已经被 agent inbox 接受的 goal 提示词可以在卸载开始前启动并消耗其 Round；teardown 随后会取消请求、停用 goal 的续行并等待完全停稳。不会再启动后续 Round。
- **只有 Round 上限，不是资源预算**——token、货币、时间与提供方配额策略保持独立。对应的会话事件不会归属于 goal 消息，也不会映射为 goal 阻塞代码。
- **异常情况不自动重试**——暂时性的提供方与持久化失败需要之后由用户授权 resume，而不会采用隐式重试策略。

## apply（.）

公开导入：`@deepseek-ai/dsh-goal-round-driver`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal-round-driver.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-goal-round-driver`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal-round-driver.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-goal-round-driver`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "goal-round-driver";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal-round-driver.md)。

## renderGoalRoundPrompt（.）

公开导入：`@deepseek-ai/dsh-goal-round-driver`；公开符号：`renderGoalRoundPrompt`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function renderGoalRoundPrompt(goal: GoalView, round: number): ContentBlock[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal-round-driver.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
