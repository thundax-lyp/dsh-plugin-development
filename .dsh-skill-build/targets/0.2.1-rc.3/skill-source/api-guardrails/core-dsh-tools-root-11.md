# @deepseek-ai/dsh-tools .：公开对象 11

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-tools 选型与组合](api-core-dsh-tools-root-overview.md)。

使用 `dsh-tools` 可向模型公开类型化能力、校验调用、执行允许／拒绝／询问策略，并在普通工具失败时返回最终结果而不中止当前轮次。通过 `mode` 选择原生 Function Calling（函数调用）或 PTC mode；单个 agent（智能体）可用 `presentAs` 覆盖默认值。工具作者使用 `defineTool` 声明类型化参数与输出、协作式超时、并行安全属性和可选 UI 展示。模型会看到每个获准工具声明的名称、描述与参数 schema；按 agent 设置的限制可缩小该可见集合。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## assertObjectJsonSchema 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`assertObjectJsonSchema`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function assertObjectJsonSchema(schema: unknown): asserts schema is ObjectJsonSchema;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## assertSupportedJsonSchema 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`assertSupportedJsonSchema`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function assertSupportedJsonSchema(schema: unknown): asserts schema is JsonSchemaNode;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## defineContentToolFixture 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`defineContentToolFixture`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function defineContentToolFixture<const S extends ParameterSchemaSpec>(options: ContentToolFixtureOptions<S>): ToolDefinition;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## defineTool 公开契约

`defineTool(options)` 接受 name、description、parameters、output 与 execute。parameters 的字段 spec 由函数编译成 JSON Schema 并推导 args；根参数对象是隐式开放对象。output.schema 校验每个成功返回值和策略替代值，render(args,value) 是 Native 内容的纯投影，presentationMeta 是可选的可重放 JSON 展示投影。execute(args,exec) 返回 Promise，exec.signal 是取消来源；timeoutMs 若提供须为正有限数且属于协作超时，不会强行终止任意外部副作用。isConcurrencySafe 是纯分类器，不能在分类时抢占资源。

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`defineTool`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function defineTool<const S extends ParameterSchemaSpec, const O extends ValueSchemaSpec>(options: DefineToolOptions<S, O>): ToolDefinition;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## jsonSchemaToPy 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`jsonSchemaToPy`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function jsonSchemaToPy(schema: unknown): string;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## jsonSchemaToTs 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`jsonSchemaToTs`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function jsonSchemaToTs(schema: unknown, indent?: number): string;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## parameterSchemaSpecToJsonSchema 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`parameterSchemaSpecToJsonSchema`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function parameterSchemaSpecToJsonSchema(spec: ParameterSchemaSpec): ParameterJsonSchema;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。
