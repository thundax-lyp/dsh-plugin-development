# @deepseek-ai/dsh-time-context 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-time-context` 给模型一只时钟：在符合条件的步骤上，它追加一条持久、带来源的读数，包含当前时间、附加到当前开放请求的浏览器时区，以及自前一条模型可见消息以来的经过时长。它帮助模型按用户的浏览器时区解释未明确限定时区的日期与时间；时区来源混杂或缺失时，它告诉模型去询问。随发行版交付的 Web 组合不含该行；`standard`、`cordis` 与 `ptc` 声明它。读数默认采用 10 分钟的最小间隔；`refreshIntervalMs: 0` 会在每个符合条件的步骤注入。

### 使用本包

当模型需要按用户所在时区解释未限定的日期与时间，且请求本地浏览器时区可用或已配置的回退值可接受时，挂载此插件。每次注入都是持久历史中额外的一条 user 角色消息；当按步骤读数超出对话需要时，用 `refreshIntervalMs` 调度。随发行版交付的 Web 组合不含宿主 `time-context` 行，由 `standard`、`cordis` 与 `ptc` preset 把它声明在消费它的提醒工具旁，而 `minimal` 两者都不声明。

#### 模型能得到什么

每条注入读数包含三行：带数字偏移与 IANA 时区、形如 ISO 的时间戳，该请求的浏览器时区策略，以及以紧凑整秒单位表示的经过时长。第 1 步从最新一条先前模型可见消息起测量；后续步骤从同一轮次中前一个 time-context 事件起测量。缺少基线时报告 `unavailable`，挂钟时间倒退时把经过时长钳制为零。

#### 配置

最小挂载无需任何配置。正的 `refreshIntervalMs` 会抑制距最近一次注入不足该毫秒数的注入；省略时采用 600000 毫秒（10 分钟），设为 `0` 时，每个信号尚未中止且将进入步骤的合格 pre-step 都会注入。

```yaml
- name: '@deepseek-ai/dsh-time-context'
  config:
    timeZone: Asia/Shanghai
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `timeZone` | 进程时区 | 当前开放轮次没有唯一浏览器时区时的显示回退时区 |
| `refreshIntervalMs` | `600000`（10 分钟） | 同一会话中两次持久注入之间的最小毫秒数 |

#### 选择时区

当当前开放轮次只包含一个经 Host 校验的浏览器时区时，时间戳按该请求本地时区格式化。浏览器来源信息缺失或混杂时，配置的 `timeZone` 格式化显示；省略它则在插件加载时解析一次 Node 进程时区，每个显式回退值都经 `Intl.DateTimeFormat` 校验。解析后的指令告诉模型按所选时区解释未限定的日期与时间；来源信息混杂或不可用时，则要求用户澄清。

-----

### 已知限制与延期工作

这些限制说明时钟上下文何时不合适。它们是当前包约束。

- **仅限提示词来源信息**：浏览器时区上下文用于指导自然语言解释，但不会悄然填入另一工具所要求的时区字段。
- **混合轮次会询问**：如果同一个开放轮次包含来自不同浏览器时区的提示词，模型会收到要求澄清的指令，而不会猜测哪个时区拥有未限定的时间。
- **回退值不代表用户权威**：浏览器来源信息缺失或混杂时，配置或进程时区用于格式化时钟，但面向模型的策略仍要求澄清。
- **整秒显示**：时间戳与持续时间省略亚秒精度，尽管持久事件时间保留毫秒。
- **压缩之间的历史成本**：设为 `0` 时，每次合格尝试都会保留一条读数；正数间隔可以降低但无法消除该成本，也可能使后续请求缺少新鲜的浏览器时区指导。

## Config（.）

公开导入：`@deepseek-ai/dsh-time-context`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    timeZone?: string;
    refreshIntervalMs?: number;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-time-context.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-time-context`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-time-context.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-time-context`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-time-context.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-time-context`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "time-context";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-time-context.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
