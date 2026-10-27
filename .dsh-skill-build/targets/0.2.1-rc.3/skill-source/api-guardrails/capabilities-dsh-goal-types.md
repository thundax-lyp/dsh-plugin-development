# dsh-goal-types 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 types 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-goal.md)；本页逐项保留对象的参数、字段和判别分支。

## CreateGoalRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CreateGoalRequest {
    readonly objective: string;
    readonly maxGoalRounds?: number;
}
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`CreateGoalRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`maxGoalRounds`、`objective`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## CreateGoalResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CreateGoalResult {
    readonly ref: GoalRef;
}
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`CreateGoalResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`ref`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## EditGoalRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface EditGoalRequest {
    readonly objective?: string;
    readonly maxGoalRounds?: number;
}
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`EditGoalRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`maxGoalRounds`、`objective`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalActivation（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type GoalActivation = 'armed' | 'disarmed';
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`GoalActivation`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalActivationChanged（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface GoalActivationChanged {
    readonly sessionId: SessionId;
    readonly goal?: {
        readonly id: GoalId;
        readonly revision: number;
        readonly activation: GoalActivation;
    };
}
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`GoalActivationChanged`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`goal`、`sessionId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalBlockReason（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface GoalBlockReason {
    readonly code: string;
    readonly message: string;
}
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`GoalBlockReason`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`code`、`message`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalPhase（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type GoalPhase = 'active' | 'paused' | 'blocked' | 'complete';
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`GoalPhase`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalProjection（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface GoalProjection {
    readonly goal: GoalSnapshot;
    readonly roundsStarted: number;
    readonly createdAt: number;
    readonly updatedAt: number;
}
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`GoalProjection`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`createdAt`、`goal`、`roundsStarted`、`updatedAt`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalProjectionState（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface GoalProjectionState {
    readonly current: GoalProjection | null;
    readonly seenGoalIds: GoalId[];
    readonly failure: string | null;
}
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`GoalProjectionState`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`current`、`failure`、`seenGoalIds`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalRef（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface GoalRef {
    readonly id: GoalId;
    readonly revision: number;
}
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`GoalRef`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`id`、`revision`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalSnapshot（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface GoalSnapshot extends GoalRef {
    readonly objective: string;
    readonly phase: GoalPhase;
    readonly blockedReason?: GoalBlockReason;
    readonly maxGoalRounds: number;
}
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`GoalSnapshot`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`blockedReason`、`id`、`maxGoalRounds`、`objective`、`phase`、`revision`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalView（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface GoalView extends GoalSnapshot {
    readonly roundsStarted: number;
    readonly createdAt: number;
    readonly updatedAt: number;
    readonly activation: GoalActivation;
}
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`GoalView`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`activation`、`blockedReason`、`createdAt`、`id`、`maxGoalRounds`、`objective`、`phase`、`revision`、`roundsStarted`、`updatedAt`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalId（./types）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type GoalId = Branded<'GoalId'>;
```

公开导入：`@deepseek-ai/dsh-goal/types`；公开符号：`GoalId`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。
