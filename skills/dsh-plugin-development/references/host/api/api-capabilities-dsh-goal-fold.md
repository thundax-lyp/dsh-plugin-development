# dsh-goal-fold 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 fold 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-goal.md)；本页逐项保留对象的参数、字段和判别分支。

## decodeGoalChange（.）

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`decodeGoalChange`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function decodeGoalChange(value: unknown): GoalChangeMeta | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## foldGoal（.）

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`foldGoal`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function foldGoal(events: readonly SessionEvent[]): FoldedGoal;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## goalChangeRef（.）

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`goalChangeRef`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function goalChangeRef(change: GoalChangeMeta): GoalRef;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。
