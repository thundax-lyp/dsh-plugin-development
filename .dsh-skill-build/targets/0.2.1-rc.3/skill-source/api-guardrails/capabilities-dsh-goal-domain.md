# dsh-goal-domain 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 domain 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-goal.md)；本页逐项保留对象的参数、字段和判别分支。

## FoldedGoal（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface FoldedGoal {
    readonly goal?: GoalSnapshot;
    readonly roundsStarted: number;
    readonly createdAt?: number;
    readonly updatedAt?: number;
    readonly lastRef?: GoalRef;
}
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`FoldedGoal`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`createdAt`、`goal`、`lastRef`、`roundsStarted`、`updatedAt`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalChangeMeta（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type GoalChangeMeta = GoalSnapshotChangeMeta | GoalClearChangeMeta;
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`GoalChangeMeta`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`kind`、`operation`、`version`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalChanged（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface GoalChanged {
    readonly operation: GoalOperation;
    readonly ref: GoalRef;
    readonly goal?: GoalView;
}
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`GoalChanged`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`goal`、`operation`、`ref`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalClearChangeMeta（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface GoalClearChangeMeta {
    readonly kind: 'goal/change';
    readonly version: 1;
    readonly operation: 'clear';
    readonly cleared: GoalRef;
    readonly clearedAt: number;
}
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`GoalClearChangeMeta`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`cleared`、`clearedAt`、`kind`、`operation`、`version`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalErrorCode（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type GoalErrorCode = 'GOAL_AGENT_NOT_LIVE' | 'GOAL_NOT_FOUND' | 'GOAL_ALREADY_EXISTS' | 'GOAL_STALE_REVISION' | 'GOAL_INVALID_OBJECTIVE' | 'GOAL_INVALID_MAX_ROUNDS' | 'GOAL_INVALID_BLOCK_REASON' | 'GOAL_INVALID_EDIT' | 'GOAL_INVALID_TRANSITION';
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`GoalErrorCode`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalMessageSource（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface GoalMessageSource {
    readonly kind: 'goal';
    readonly goalId: GoalId;
    readonly revision: number;
    readonly round: number;
}
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`GoalMessageSource`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`goalId`、`kind`、`revision`、`round`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalOperation（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type GoalOperation = 'create' | 'edit' | 'pause' | 'resume' | 'complete' | 'block' | 'clear';
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`GoalOperation`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalSnapshotChangeMeta（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface GoalSnapshotChangeMeta {
    readonly kind: 'goal/change';
    readonly version: 1;
    readonly operation: Exclude<GoalOperation, 'clear'>;
    readonly goal: GoalSnapshot;
    readonly roundsStarted: number;
    readonly createdAt: number;
    readonly updatedAt: number;
}
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`GoalSnapshotChangeMeta`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`createdAt`、`goal`、`kind`、`operation`、`roundsStarted`、`updatedAt`、`version`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。
