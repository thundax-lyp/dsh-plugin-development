# @deepseek-ai/dsh-tools .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-tools 选型与组合](api-core-dsh-tools-root-overview.md)。

使用 `dsh-tools` 可向模型公开类型化能力、校验调用、执行允许／拒绝／询问策略，并在普通工具失败时返回最终结果而不中止当前轮次。通过 `mode` 选择原生 Function Calling（函数调用）或 PTC mode；单个 agent（智能体）可用 `presentAs` 覆盖默认值。工具作者使用 `defineTool` 声明类型化参数与输出、协作式超时、并行安全属性和可选 UI 展示。模型会看到每个获准工具声明的名称、描述与参数 schema；按 agent 设置的限制可缩小该可见集合。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## ArrayValueSchemaSpec 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ArrayValueSchemaSpec`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ArrayValueSchemaSpec extends ValueSchemaAnnotations {
    type: 'array';
    items?: ValueSchemaSpec;
}
```

成员检索：`default`、`description`、`examples`、`items`、`title`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## BooleanValueSchemaSpec 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`BooleanValueSchemaSpec`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface BooleanValueSchemaSpec extends ValueSchemaAnnotations {
    type: 'boolean';
    enum?: readonly boolean[];
    const?: boolean;
}
```

成员检索：`const`、`default`、`description`、`enum`、`examples`、`title`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## CodeRunFailedError 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`CodeRunFailedError`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class CodeRunFailedError extends HarnessError {
    constructor(message: string);
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    mode?: ToolPresentationMode;
    maxParallelSubCalls?: number;
}
```

成员检索：`maxParallelSubCalls`、`mode`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## ContentToolFixtureOptions 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`ContentToolFixtureOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type ContentToolFixtureOptions<S extends ParameterSchemaSpec> = Omit<DefineToolOptions<S, typeof CONTENT_VALUE_SCHEMA>, 'output' | 'execute'> & {
    execute(args: import('./schema.ts').InferArgs<S>, exec: ToolRunContext): Promise<ContentBlock[]>;
};
```

成员检索：`execute`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## DefineToolOptions 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`DefineToolOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DefineToolOptions<S extends ParameterSchemaSpec, O extends ValueSchemaSpec> {
    readonly name: string;
    readonly description: string;
    readonly parameters: S;
    readonly output: {
        readonly schema: O;
        render(args: InferArgs<S>, value: InferValue<NoInfer<O>>): ContentBlock[];
        presentationMeta?(args: InferArgs<S>, value: InferValue<NoInfer<O>>): JsonValue;
    };
    readonly deferLoading?: true;
    readonly timeoutMs?: number;
    isConcurrencySafe?(args: InferArgs<S>): boolean;
    execute(args: InferArgs<S>, exec: ToolRunContext): Promise<InferValue<NoInfer<O>>>;
    projectContent?(exec: Readonly<ToolExecution>, result: Readonly<ToolExecutionResult>): ContentBlock[] | undefined;
    finalizeContent?(exec: Readonly<ToolExecution>, result: Readonly<ToolExecutionResult>): ContentBlock[] | undefined;
    presentCall?(args: InferArgs<S>): ToolCallView | undefined;
    presentResult?(args: InferArgs<S>, result: ToolResult): ToolResultView | undefined;
}
```

成员检索：`deferLoading`、`description`、`execute`、`finalizeContent`、`isConcurrencySafe`、`name`、`output`、`parameters`、`presentCall`、`presentResult`、`projectContent`、`timeoutMs`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## DiffCallView 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`DiffCallView`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DiffCallView {
    card: 'diff';
    title: string;
    diffs: FileDiff[];
    locations?: FileLocation[];
}
```

成员检索：`card`、`diffs`、`locations`、`title`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## DiffResultView 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`DiffResultView`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DiffResultView {
    card: 'diff';
    title?: string;
    diffs: FileDiff[];
}
```

成员检索：`card`、`diffs`、`title`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。
