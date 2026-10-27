# dsh-subagent-descriptor 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 descriptor 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-subagent.md)；本页逐项保留对象的参数、字段和判别分支。

## ContinuableSubagentDescriptorData（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ContinuableSubagentDescriptorData extends SubagentDescriptorBase {
    readonly mode: 'continuable';
    readonly label: string;
    readonly agentProvider?: string;
    readonly agentModel?: string;
    readonly agentReasoningEffort?: ReasoningEffortId;
    readonly persona?: string;
    readonly toolFilter?: ToolRestriction;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`ContinuableSubagentDescriptorData`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`agentModel`、`agentProvider`、`agentReasoningEffort`、`label`、`mode`、`persona`、`provider`、`toolFilter`、`version`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## ContinuableSubagentDescriptorInput（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ContinuableSubagentDescriptorInput = Omit<ContinuableSubagentDescriptorData, 'version'>;
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`ContinuableSubagentDescriptorInput`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`agentModel`、`agentProvider`、`agentReasoningEffort`、`label`、`mode`、`persona`、`provider`、`toolFilter`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## OneShotSubagentDescriptorData（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface OneShotSubagentDescriptorData extends SubagentDescriptorBase {
    readonly mode: 'one-shot';
    readonly label?: string;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`OneShotSubagentDescriptorData`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`label`、`mode`、`provider`、`version`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SUBAGENT_DESCRIPTOR_VERSION（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SUBAGENT_DESCRIPTOR_VERSION`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const SUBAGENT_DESCRIPTOR_VERSION = 3;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentDescriptorData（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SubagentDescriptorData = OneShotSubagentDescriptorData | ContinuableSubagentDescriptorData;
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentDescriptorData`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`label`、`mode`、`provider`、`version`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## foldSubagentDescriptor（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`foldSubagentDescriptor`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function foldSubagentDescriptor(events: readonly SessionEvent[]): SubagentDescriptorData | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## snapshotSubagentDescriptor（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`snapshotSubagentDescriptor`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function snapshotSubagentDescriptor(input: ContinuableSubagentDescriptorInput): ContinuableSubagentDescriptorData;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。
