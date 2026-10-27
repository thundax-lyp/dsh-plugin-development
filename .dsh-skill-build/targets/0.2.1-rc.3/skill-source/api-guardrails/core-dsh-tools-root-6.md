# @deepseek-ai/dsh-tools .：公开对象 6

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-tools 选型与组合](api-core-dsh-tools-root-overview.md)。

使用 `dsh-tools` 可向模型公开类型化能力、校验调用、执行允许／拒绝／询问策略，并在普通工具失败时返回最终结果而不中止当前轮次。通过 `mode` 选择原生 Function Calling（函数调用）或 PTC mode；单个 agent（智能体）可用 `presentAs` 覆盖默认值。工具作者使用 `defineTool` 声明类型化参数与输出、协作式超时、并行安全属性和可选 UI 展示。模型会看到每个获准工具声明的名称、描述与参数 schema；按 agent 设置的限制可缩小该可见集合。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SearchMatchesResultView 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`SearchMatchesResultView`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SearchMatchesResultView {
    card: 'search';
    shape: 'matches';
    title?: string;
    files: SearchFileMatches[];
    truncated: boolean;
    total: number;
}
```

成员检索：`card`、`files`、`shape`、`title`、`total`、`truncated`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## SearchPathsResultView 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`SearchPathsResultView`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SearchPathsResultView {
    card: 'search';
    shape: 'paths';
    title?: string;
    paths: string[];
    truncated: boolean;
    total: number;
}
```

成员检索：`card`、`paths`、`shape`、`title`、`total`、`truncated`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## SearchResultView 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`SearchResultView`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SearchResultView = SearchMatchesResultView | SearchPathsResultView;
```

成员检索：`card`、`shape`、`title`、`total`、`truncated`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## StringValueSchemaSpec 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`StringValueSchemaSpec`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface StringValueSchemaSpec extends ValueSchemaAnnotations {
    type: 'string';
    enum?: readonly string[];
    const?: string;
}
```

成员检索：`const`、`default`、`description`、`enum`、`examples`、`title`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## TOOL_ABORTED 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`TOOL_ABORTED`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const TOOL_ABORTED = "ABORTED";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## TOOL_ABORTED_BEFORE_DISPATCH 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`TOOL_ABORTED_BEFORE_DISPATCH`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const TOOL_ABORTED_BEFORE_DISPATCH = "ABORTED_BEFORE_DISPATCH";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## TOOL_RUNTIME_SCHEDULER 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`TOOL_RUNTIME_SCHEDULER`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const TOOL_RUNTIME_SCHEDULER: unique symbol;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## TerminalCallView 公开契约

导入入口：`@deepseek-ai/dsh-tools`；公开符号：`TerminalCallView`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TerminalCallView {
    card: 'terminal';
    title: string;
    description?: string;
    cwd?: string;
}
```

成员检索：`card`、`cwd`、`description`、`title`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。
