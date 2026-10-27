# dsh-subagent-child-agent 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 child-agent 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-subagent.md)；本页逐项保留对象的参数、字段和判别分支。

## ChildComposition（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ChildComposition {
    readonly agentPreset?: string | undefined;
    readonly persona?: string | undefined;
    readonly toolFilter?: ToolRestriction | undefined;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`ChildComposition`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`agentPreset`、`persona`、`toolFilter`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## DelegatedPolicyOverrides（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface DelegatedPolicyOverrides {
    readonly permissionPreset: 'auto' | 'danger-full-access' | undefined;
    readonly sandboxMode: SandboxMode | undefined;
    readonly approvalPolicy: 'never' | undefined;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`DelegatedPolicyOverrides`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`approvalPolicy`、`permissionPreset`、`sandboxMode`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentDepthError（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentDepthError`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class SubagentDepthError extends Error {
    readonly attemptedDepth: number;
    readonly maxDepth: number;
    constructor(attemptedDepth: number, maxDepth: number);
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## appendDelegatedPolicyOverrides（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`appendDelegatedPolicyOverrides`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function appendDelegatedPolicyOverrides(childSession: Session, overrides: DelegatedPolicyOverrides): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## applyChildComposition（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`applyChildComposition`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function applyChildComposition(childCtx: Context, parent: Agent, composition: ChildComposition): void | Promise<void>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## captureDelegatedPolicyOverrides（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`captureDelegatedPolicyOverrides`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function captureDelegatedPolicyOverrides(parent: Agent): DelegatedPolicyOverrides;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## childSessionMeta（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`childSessionMeta`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function childSessionMeta(parent: Agent, childDepth: number, isSeeded: boolean, selectedPreset?: string): NonNullable<CreateAgentOptions['meta']>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## parentAgentOptionsForDelegation（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`parentAgentOptionsForDelegation`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function parentAgentOptionsForDelegation(parent: Agent): AgentOptions;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## resolveChildAgentOptions（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`resolveChildAgentOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function resolveChildAgentOptions(parent: Agent, requested: AgentOptions | undefined, childDepth: number): AgentOptions;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## resolveChildDepth（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`resolveChildDepth`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function resolveChildDepth(parent: Agent, maxDepth: number | undefined): number;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。
