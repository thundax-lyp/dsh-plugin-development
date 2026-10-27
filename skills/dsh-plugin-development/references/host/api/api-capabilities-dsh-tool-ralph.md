# @deepseek-ai/dsh-tool-ralph 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`ralph` 针对一个不可变目标运行由多个全新子 agent 组成的前台序列，每个 Round 只接收上一份有界报告与共享工作区状态。它会在 worker 报告完成或具体阻塞，或达到配置的 Round 上限时返回；这些报告不会得到独立验证。父级对话与先前子 agent 会话绝不会复制到新的 Round。仅当直接用户明确要求 Ralph 式全新 agent 迭代时使用它；普通的长期工作请使用 goal 工具，有界委派请使用 subagent 或工作流。

### 使用本包

`ralph` 工具运行固定的前台循环：每个 Round 一个全新子 agent 在共享工作区中处理不可变目标，只有一份有界的结构化报告跨越 Round。仅当直接用户明确要求 Ralph 循环或全新 agent 迭代执行时使用它。普通的长期同会话工作请使用 goal 工具；有界委派与扇出请使用普通 subagent 或 `workflow` 工具。

#### 调用工具

模型提交 `{ objective, maxRounds? }`，调用会阻塞到整个运行结算。部署配置中的 `maxRounds` 既是默认值，也是调用覆盖值的上限。终态结果为 `complete`、`blocked` 或 `budget-limited`，携带最后一份有界报告与已启动的 Round 数量；普通子 agent 失败会返回错误，其中标明失败的 Round，并在存在时保留上一次成功交接。

#### 每个 Round 看到什么

每个子 agent 只接收不可变目标、当前 Round 及其上限、一条「共享工作区是权威状态」指令与上一份结构化交接；父级对话与先前子 agent 会话绝不会作为种子。工作区是跨 Round 的长期记忆。报告携带状态（`continue`、`complete` 或 `blocked`）、非空摘要、证据、后续步骤与阻塞文本；无效或过大的报告会使工作流失败，而不会被截断或误认为上限耗尽。

#### 配置

| 字段 | 默认值 | 含义 |
|---|---|---|
| `subagentProvider` | `spawn` | 每个 Round 使用的全新结构化输出提供方。 |
| `maxRounds` | `256` | 一次 Ralph 运行的默认值和部署上限。 |
| `maxHandoffChars` | `16384` | 一份 Round 报告序列化后的最大字符数。 |
| `maxResultChars` | `16384` | 返回给父级的完整成功结果最大字符数。 |

-----

### 已知限制与延期工作

这些限制说明该工具尚未支持什么。它们是当前约束，不是任务积压。

- **完成由 worker 自行声明**——没有独立评估器或验证器判断目标是否完成；评估器策略与评估器驱动的延续均暂缓。评估器须先单独定义输入、工具访问、确定性检查、提供方选择、隔离与授权规则，才能认证完成或驱动延续。
- **仅支持前台**——没有 job id、后台收集、进程恢复检查点、调度器或基于挂钟时间的启动策略。
- **工作区是唯一的跨 Round 长期记忆**——一份有界报告作为显式交接，每个子 agent 结束后，未提交的对话推理都会消失。
- **一个 Round 对应一个全新子 agent**——Round 内没有扇出、模型或提供方切换、fork 上下文或由模型调用选择的提供方。
- **没有强制拒绝递归 Ralph**——结构性拒绝尚未实现；提示词引导不能强制禁止递归。
- **普通子 agent 失败会终止运行**——固定脚本报告失败的 Round 与上一次成功交接，但不会重试；致命的工作流基础设施失败可能在该状态返回前结束。
- **聚合工作量仅受 Round 数量限制**——token、价格与耗时预算均暂缓。

## Config（.）

公开导入：`@deepseek-ai/dsh-tool-ralph`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    subagentProvider?: string;
    maxRounds?: number;
    maxHandoffChars?: number;
    maxResultChars?: number;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-ralph.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-tool-ralph`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-ralph.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-tool-ralph`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-ralph.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-tool-ralph`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "tool-ralph";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-ralph.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
