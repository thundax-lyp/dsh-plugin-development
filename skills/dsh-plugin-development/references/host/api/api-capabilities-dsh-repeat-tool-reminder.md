# @deepseek-ai/dsh-repeat-tool-reminder 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

本包帮助模型跳出以相同参数反复调用同一工具却没有进展的循环。达到配置的重复次数时，它会要求模型检查上一次结果并改变方法或结束任务。提醒只是建议，绝不会阻止或延迟合理的重复调用。每个 agent 的重复分别跟踪，新的用户消息会清除计数。`dsh` 基础组合包默认启用本包，并在重复 3、5、8 次时提醒。

### 使用本包

当模型应当自行发现自己在相同工具调用上循环时，挂载此插件。无需学习或接线：`dsh` 基础组合包已经运行它，默认值适用于大多数会话——想更早、更晚或在更少的工具上收到提醒时，调优下面的阈值与工具范围即可。

#### 何时选择

当模型长时间自主工作、且卡住的循环是你想用建议而非强制来打破的失败模式时，选择它。当相同的重复是合理且必须不受打扰地运行时——guard 只会提醒，提醒只是重复调用之后的一条小消息——以及必须捕获近似变体时（因为只有精确重复——同一工具、同一参数且与属性顺序无关——才会被检测到），避免使用它。

#### 设置阈值与范围

想改变提醒何时触发或覆盖哪些工具时，用配置挂载插件：

```yaml
- name: '@deepseek-ai/dsh-repeat-tool-reminder'
  config:
    thresholds: [3, 5, 8]        # remind at 3, 5, and 8 consecutive repeats
    include: []                  # track every tool; list patterns to track only some
    exclude: [todo_write]        # never track these tools
    argumentsPreviewChars: 500   # cap on arguments shown in the detailed reminder
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `thresholds` | `[3, 5, 8]` | 触发提醒的重复次数 |
| `include` | `[]` | 只跟踪这些工具；空表示所有工具 |
| `exclude` | `[]` | 绝不跟踪这些工具；对它们的调用既不计数也不重置 |
| `argumentsPreviewChars` | `500` | 详细提醒中显示多少字符的重复参数 |

#### 你会得到什么

按默认值，以相同参数重复同一调用的模型会在第三次重复时收到简短提醒——先分析上一次结果再调用——并在第五次和第八次收到详细提醒，列出工具与重复参数，使其决定改变方法、收集更多证据还是结束任务。新的用户消息会清零计数，因此全新指令绝不会被当作循环。提醒出现在重复调用的结果之后、归属于插件，模型像阅读任何其他消息一样阅读它。

-----

### 已知限制与延期工作

这些限制说明 guard 何时不合适。它们是当前包约束，不是任务积压。

- **仅精确匹配检测**——规范化是深度键排序，因此近似变体（稍作修改的路径、值内多余的空白）会绕过链；在没有需求证据前，不采用模糊匹配。
- **压缩（compaction）不会重置链**——跨越压缩检查点的链会继续计数。
- **仅提供建议**——尚未实现高阈值时升级为阻止形式，但 `PostToolDecision` 已支持阻止。
- **subagent 之间不共享链**——链始终按 agent 隔离；父 agent 与其 subagent 重复相同调用也绝不合并。
- **合理的幂等轮询超过阈值后仍会收到提醒**——可通过 `thresholds`／`exclude` 配置释放压力。
- **超过最高阈值后链不再提醒**——提醒只在精确达到所配置的次数时触发，超过后不会继续发送。

## Config（.）

公开导入：`@deepseek-ai/dsh-repeat-tool-reminder`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    thresholds?: number[];
    include?: string[];
    exclude?: string[];
    argumentsPreviewChars?: number;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-repeat-tool-reminder.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-repeat-tool-reminder`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-repeat-tool-reminder.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-repeat-tool-reminder`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "repeat-tool-reminder";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-repeat-tool-reminder.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
