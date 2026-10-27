# @deepseek-ai/dsh-tool-goal 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-tool-goal` 让模型读取持久 goal，并根据人类直接请求推断和创建长期 goal。创建、编辑、暂停或恢复要求该直接请求出现在顶层 agent（智能体）轮次中；完成或阻塞也可以在自主 Goal Round 中执行。更新必须使用先前读取到的精确 goal id 和 revision。`resume` 会重新启用 active-but-disarmed 或 blocked 的 goal，而持久的 paused goal 由用户通过 Web 或 `/goal resume` 恢复。自主阻塞要求同一条件持续达到可配置阈值，默认是连续三个 Round。

### 使用本包

当模型需要自行创建和更新持久 goal 时，把 `dsh-tool-goal` 挂在 goal 服务旁边。这些工具是 goal 表面面向模型的一半；`/goal` 命令是面向人类的一半，续行驱动器在自主 Round 结束时使用同一套工具完成或阻塞 goal。

#### 工具

三个工具都返回相同的紧凑 JSON——没有当前 goal 时为 `{ goal: null }`，否则返回 goal 的 id、revision、目标、phase、已开始 Round、Round 上限、可选的 blocker reason 与续行是否已启用——与 Native 调用方已经渲染的内容一致。

| 工具 | 作用 |
|---|---|
| `get_goal()` | 读取当前 goal；没有当前 goal 时返回 `null` |
| `create_goal(objective, max_goal_rounds?)` | 根据人类直接发起的顶层轮次创建一个 goal |
| `update_goal(goal_id, revision, action, objective?, max_goal_rounds?, blocked_reason?)` | 对精确 goal revision 执行 `edit`、`pause`、`resume`、`complete` 或 `blocked` |

在 `update_goal` 之前调用 `get_goal`，并复制精确的 `goal_id` 与 `revision`；所有调用都互斥，因此模型排序的批次能观察到更早变更及其新 revision。替换值只属于 `edit`；`blocked_reason` 只有在 `blocked` 时才必填，并以稳定代码 `model-reported` 持久化。严格 schema 下的空字符串和零填充值视为省略，而有意义的值仍限定到各自 action。

#### 配置

```yaml
- id: tool-goal
  name: '@deepseek-ai/dsh-tool-goal'
  config:
    blockedAfterConsecutiveRounds: 3
```

#### 权限规则

工具只为活跃驱动器内、处于开放轮次中的精确活跃调用 agent 执行。`create`、`edit`、`pause` 和 `resume` 还要求运行时根 agent 的当前轮次中存在人类直接消息——subagent 或非人类生产方不能创建或编辑 goal。`resume` 会在 goal 服务执行前拒绝持久的 paused goal；该状态只属于面向用户的恢复路径。`complete` 和 `blocked` 还接受完全一致的当前 Goal Round：来源为 goal 的 Round 可以立即完成 goal，但 `blocked` 调用在达到配置的连续 Round 数量之前会被机械拒绝——模型判断同一条件是否确实持续，并必须在 `blocked_reason` 中说明。人类直接请求可以立即停止 goal。

成功报告 `complete` 或 `blocked` 的自主 Round 还会在该步骤后结束物理轮次，模型会收到一条结束指令，要求向用户写出最终消息。人类直接变更绝不会触发这种停止：assistant 可以确认变更，循环仍可接收并发的人类 steering（中途引导）。

-----

### 已知限制与延期工作

这些限制说明 goal 工具何时不合适或需要特别注意。它们是当前包约束，不是任务积压。

- **语义意图仍由模型判断**——执行只能证明当前轮次包含一条人类直接发送的消息，无法证明请求是否足够重大而值得创建 goal。
- **阻塞条件是否相同仍由模型判断**——运行时强制统计互不重复的已准入 Goal Round，而不判断障碍在语义上是否等价；独立评估器的实现暂缓。
- **不负责调度或直接面向人类呈现**——这些工具只变更状态；同会话驱动器与 `dsh-command-goal` 是同一领域的独立消费方。
- **Goal Round 权限需要驱动器**——除非续行驱动器准入 goal 来源的用户轮次，否则自主 `complete`／`blocked` 路径不会启用；只挂载这个包不会创建这些轮次。
- **提示词注册与过滤相互独立**——某个范围可能隐藏工具，却保留指引，除非部署将两项注册限定在同一范围。

## Config（.）

公开导入：`@deepseek-ai/dsh-tool-goal`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    blockedAfterConsecutiveRounds?: number;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-goal.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-tool-goal`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-goal.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-tool-goal`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-goal.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-tool-goal`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "tool-goal";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-goal.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
