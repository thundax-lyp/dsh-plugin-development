# @deepseek-ai/dsh-tools .：公开对象 10

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-tools 选型与组合](api-core-dsh-tools-root-overview.md)。

使用 `dsh-tools` 可向模型公开类型化能力、校验调用、执行允许／拒绝／询问策略，并在普通工具失败时返回最终结果而不中止当前轮次。通过 `mode` 选择原生 Function Calling（函数调用）或 PTC mode；单个 agent（智能体）可用 `presentAs` 覆盖默认值。工具作者使用 `defineTool` 声明类型化参数与输出、协作式超时、并行安全属性和可选 UI 展示。模型会看到每个获准工具声明的名称、描述与参数 schema；按 agent 设置的限制可缩小该可见集合。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## ToolRuntime 公开契约

Host `ctx.tools` 的提供方，硬依赖 systemPrompt。`register(definition)` 的注册和返回 disposer 归调用插件 fiber；`restrict(filter)` 限制当前作用域的可见/可执行工具。`get(name,scope?)` 查询不证明模型在当前 mode 可以直接调用；native、PTC 与混合暴露由当前配置决定。`execute(input)` 经 pre/guard/around/post/result 管道归一化结果；调用方提供 callId/name/arguments/signal，不能直接调用 definition.execute 绕过校验与策略。异步 gate 观察 signal，框架等 Promise 落定再复核取消；模型可见内容必须进 Session 的标准结果路径。

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ToolRuntime`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class ToolRuntime extends Service {
    static inject: string[];
    static Config: z<Config>;
    readonly [TOOL_RUNTIME_SCHEDULER]: ToolRuntimeScheduler;
    constructor(ctx: Context, config?: Config);
    presentAs(mode: ToolPresentationMode): () => void;
    register(definition: ToolDefinition): () => void;
    restrict(filter: ToolRestriction): () => void;
    guard(guard: ToolGuard): () => void;
    get(name: string, scope?: ScopeKey): ToolDefinition | undefined;
    schemas(scope?: ScopeKey): ToolSchema[];
    executionMode(exec: ToolExecutionInput): ToolExecutionMode;
    execute(exec: ToolExecutionInput): Promise<ToolExecutionResult>;
}
```

成员检索：`execute`、`executionMode`、`get`、`guard`、`presentAs`、`register`、`restrict`、`schemas`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## ToolRuntimeScheduler 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ToolRuntimeScheduler`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ToolRuntimeScheduler {
    prepare(exec: ToolExecutionInput): Promise<ScheduledToolPreparation>;
    dispatch(exec: ToolRunContext): Promise<ScheduledToolDispatch>;
    finalize(exec: ToolRunContext, result: ToolExecutionResult): Promise<ToolExecutionResult>;
    finish(exec: ToolRunContext, result: ToolExecutionResult): ToolExecutionResult;
}
```

成员检索：`dispatch`、`finalize`、`finish`、`prepare`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## ValueSchemaAnnotations 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ValueSchemaAnnotations`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ValueSchemaAnnotations {
    description?: string;
    title?: string;
    default?: JsonValue;
    examples?: JsonValue;
}
```

成员检索：`default`、`description`、`examples`、`title`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## ValueSchemaSpec 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ValueSchemaSpec`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type ValueSchemaSpec = StringValueSchemaSpec | NumberValueSchemaSpec | IntegerValueSchemaSpec | BooleanValueSchemaSpec | NullValueSchemaSpec | ArrayValueSchemaSpec | ObjectValueSchemaSpec | JsonValueSchemaSpec | OneOfValueSchemaSpec;
```

成员检索：`default`、`description`、`examples`、`title`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## WebFetchResultView 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`WebFetchResultView`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WebFetchResultView {
    card: 'web';
    kind: 'fetch';
    title?: string;
    url: string;
    statusCode: number;
    truncated: boolean;
}
```

成员检索：`card`、`kind`、`statusCode`、`title`、`truncated`、`url`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## WebResultView 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`WebResultView`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type WebResultView = WebSearchResultView | WebFetchResultView;
```

成员检索：`card`、`kind`、`title`、`truncated`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## WebSearchResultView 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`WebSearchResultView`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WebSearchResultView {
    card: 'web';
    kind: 'search';
    title?: string;
    sources: WebSource[];
    answer?: string;
    truncated: boolean;
}
```

成员检索：`answer`、`card`、`kind`、`sources`、`title`、`truncated`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## WebSource 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`WebSource`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WebSource {
    url: string;
    title?: string;
    snippet?: string;
    publishedAt?: string;
}
```

成员检索：`publishedAt`、`snippet`、`title`、`url`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。
