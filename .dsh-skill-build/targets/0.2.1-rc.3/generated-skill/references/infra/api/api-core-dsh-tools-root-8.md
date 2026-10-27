# @deepseek-ai/dsh-tools .：公开对象 8

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-tools 选型与组合](api-core-dsh-tools-root-overview.md)。

使用 `dsh-tools` 可向模型公开类型化能力、校验调用、执行允许／拒绝／询问策略，并在普通工具失败时返回最终结果而不中止当前轮次。通过 `mode` 选择原生 Function Calling（函数调用）或 PTC mode；单个 agent（智能体）可用 `presentAs` 覆盖默认值。工具作者使用 `defineTool` 声明类型化参数与输出、协作式超时、并行安全属性和可选 UI 展示。模型会看到每个获准工具声明的名称、描述与参数 schema；按 agent 设置的限制可缩小该可见集合。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## ToolExecutionFailure 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ToolExecutionFailure`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ToolExecutionFailure {
    readonly isError: true;
    readonly error: ToolFailure;
    readonly value?: never;
    readonly content: ContentBlock[];
    readonly meta?: JsonValue;
    readonly additionalContexts?: UserMessage[];
    readonly concludesTurn?: never;
}
```

成员检索：`additionalContexts`、`concludesTurn`、`content`、`error`、`isError`、`meta`、`value`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## ToolExecutionInput 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ToolExecutionInput`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ToolExecutionInput {
    readonly callId: ToolCallId;
    readonly rootCallId?: ToolCallId;
    readonly name: string;
    readonly schema?: ToolSchema;
    readonly arguments: unknown;
    readonly agent?: Agent;
    readonly parent?: ToolExecutionToken;
    readonly signal: AbortSignal;
}
```

成员检索：`agent`、`arguments`、`callId`、`name`、`parent`、`rootCallId`、`schema`、`signal`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## ToolExecutionMode 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ToolExecutionMode`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type ToolExecutionMode = {
    kind: 'parallel';
} | {
    kind: 'exclusive';
};
```

成员检索：`kind`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## ToolExecutionResult 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ToolExecutionResult`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type ToolExecutionResult = ToolExecutionSuccess | ToolExecutionFailure;
```

成员检索：`additionalContexts`、`concludesTurn`、`content`、`error`、`isError`、`meta`、`value`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## ToolExecutionSuccess 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ToolExecutionSuccess`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ToolExecutionSuccess {
    readonly isError: false;
    readonly value: JsonValue;
    readonly content: ContentBlock[];
    readonly error?: never;
    readonly meta?: JsonValue;
    readonly additionalContexts?: UserMessage[];
    readonly concludesTurn?: true;
}
```

成员检索：`additionalContexts`、`concludesTurn`、`content`、`error`、`isError`、`meta`、`value`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## ToolExecutionToken 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ToolExecutionToken`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type ToolExecutionToken = symbol & {
    readonly [toolExecutionTokenBrand]: true;
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## ToolFailure 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ToolFailure`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ToolFailure {
    message: string;
    info?: ToolErrorInfo;
}
```

成员检索：`info`、`message`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## ToolGuard 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ToolGuard`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type ToolGuard = (execution: Readonly<ToolExecution>) => string | undefined;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。
