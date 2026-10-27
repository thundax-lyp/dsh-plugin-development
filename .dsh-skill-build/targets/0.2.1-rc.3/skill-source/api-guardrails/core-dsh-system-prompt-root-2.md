# @deepseek-ai/dsh-system-prompt .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-system-prompt 选型与组合](api-core-dsh-system-prompt-root-overview.md)。

`dsh-system-prompt` 让 agent 在每个模型步骤收到一份有序系统提示词与可用工具 schema。需要添加提示词段、动态运行时事实、可复用变量或工具 schema，或者控制固定 harness 身份、部署 persona、运行时上下文和面向模型的工具顺序时，请使用本包。agent 作用域的贡献会遮蔽同名全局默认值，而不影响其他 agent。无效的完整提示词组合与未解析变量会使组装失败，不会向模型发送格式错误的提示词。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## PromptContextOrderName 公开契约

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`PromptContextOrderName`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type PromptContextOrderName = keyof typeof CONTEXT_ORDERS;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## PromptSection 公开契约

name是注册身份，order是有限数位置，text可静态或按上下文求值；interpolate:false原样保留花括号，complete:true声明精确完整提示词且有效条目只能有一个。外部插件可选有限order，无需冒用第一方集中名称。

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`PromptSection`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PromptSection {
    readonly name: string;
    readonly order: number;
    readonly text: string | ((context: AssembleContext) => string);
    readonly interpolate?: boolean;
    readonly complete?: boolean;
}
```

成员检索：`complete`、`interpolate`、`name`、`order`、`text`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## PromptSectionOrderName 公开契约

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`PromptSectionOrderName`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type PromptSectionOrderName = keyof typeof SECTION_ORDERS;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## SystemPrompt 公开契约

ctx.systemPrompt是有作用域的section、variable、context与tool schema registry。section顺序先order再name；局部同名贡献遮蔽全局，卸载后恢复。assemble求值，renderPrompt严格插值；未解析模板或多个complete段拒绝组装。refreshContext只刷新动态事实，suppressRuntimeContext不删除required事实。不要把context快照当成system段，也不在动态provider里执行未知外部副作用。

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`SystemPrompt`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class SystemPrompt extends Service {
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    section(section: PromptSection): () => void;
    getSectionOrder(name: PromptSectionOrderName): number;
    getContextOrder(name: PromptContextOrderName): number;
    context(context: PromptContext): () => void;
    suppressRuntimeContext(): () => void;
    tools(provider: (context: AssembleContext) => ToolProviderResult): () => void;
    variable(name: string, provider: (context: AssembleContext) => string | undefined): () => void;
    refreshContext(assembly: PromptAssembly, context?: AssembleContext): PromptAssembly;
    assemble(context?: AssembleContext): Promise<PromptAssembly>;
}
```

成员检索：`assemble`、`context`、`getContextOrder`、`getSectionOrder`、`refreshContext`、`section`、`suppressRuntimeContext`、`tools`、`variable`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## TOOL_ORDER_REST 公开契约

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`TOOL_ORDER_REST`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const TOOL_ORDER_REST = "<unlisted-tools>";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## ToolProviderResult 公开契约

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`ToolProviderResult`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ToolProviderResult {
    readonly schemas: readonly ToolSchema[];
    readonly knownNames?: readonly string[];
}
```

成员检索：`knownNames`、`schemas`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## joinContextSections 公开契约

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`joinContextSections`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function joinContextSections(sections: readonly ContextSnapshotSection[]): string;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。
