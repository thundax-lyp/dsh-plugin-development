# @deepseek-ai/dsh-tools .：公开对象 5

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-tools 选型与组合](api-core-dsh-tools-root-overview.md)。

使用 `dsh-tools` 可向模型公开类型化能力、校验调用、执行允许／拒绝／询问策略，并在普通工具失败时返回最终结果而不中止当前轮次。通过 `mode` 选择原生 Function Calling（函数调用）或 PTC mode；单个 agent（智能体）可用 `presentAs` 覆盖默认值。工具作者使用 `defineTool` 声明类型化参数与输出、协作式超时、并行安全属性和可选 UI 展示。模型会看到每个获准工具声明的名称、描述与参数 schema；按 agent 设置的限制可缩小该可见集合。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## PtcDispatchStartEventData 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`PtcDispatchStartEventData`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PtcDispatchStartEventData {
    rootCallId: ToolCallId;
    parentCallId: ToolCallId;
    subCallId: ToolCallId;
    name: string;
    arguments: unknown;
}
```

成员检索：`arguments`、`name`、`parentCallId`、`rootCallId`、`subCallId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## RUN_CODE_NAME 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`RUN_CODE_NAME`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const RUN_CODE_NAME = "run_code";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## ReadFileLine 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ReadFileLine`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ReadFileLine {
    number: number;
    text: string;
}
```

成员检索：`number`、`text`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## ReadResultView 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ReadResultView`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ReadResultView {
    card: 'read';
    title?: string;
    path: string;
    offset: number;
    lines: ReadFileLine[];
    totalLines: number;
    lang?: string;
    content?: ContentBlock[];
}
```

成员检索：`card`、`content`、`lang`、`lines`、`offset`、`path`、`title`、`totalLines`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## ScheduledToolDispatch 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ScheduledToolDispatch`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type ScheduledToolDispatch = {
    kind: 'post-result';
    result: ToolExecutionResult;
} | {
    kind: 'final-result';
    result: ToolExecutionResult;
};
```

成员检索：`kind`、`result`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## ScheduledToolPreparation 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ScheduledToolPreparation`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type ScheduledToolPreparation = {
    kind: 'dispatch';
    exec: ToolRunContext;
} | {
    kind: 'post-result';
    exec: ToolRunContext;
    result: ToolExecutionResult;
} | {
    kind: 'final-result';
    exec: ToolRunContext;
    result: ToolExecutionResult;
};
```

成员检索：`exec`、`kind`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## SearchFileMatches 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`SearchFileMatches`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SearchFileMatches {
    path: string;
    matches: SearchLineMatch[];
}
```

成员检索：`matches`、`path`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## SearchLineMatch 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`SearchLineMatch`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SearchLineMatch {
    lineNumber: number;
    line: string;
}
```

成员检索：`line`、`lineNumber`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。
