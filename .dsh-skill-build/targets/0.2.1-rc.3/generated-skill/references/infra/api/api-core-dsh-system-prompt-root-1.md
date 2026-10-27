# @deepseek-ai/dsh-system-prompt .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-system-prompt 选型与组合](api-core-dsh-system-prompt-root-overview.md)。

`dsh-system-prompt` 让 agent 在每个模型步骤收到一份有序系统提示词与可用工具 schema。需要添加提示词段、动态运行时事实、可复用变量或工具 schema，或者控制固定 harness 身份、部署 persona、运行时上下文和面向模型的工具顺序时，请使用本包。agent 作用域的贡献会遮蔽同名全局默认值，而不影响其他 agent。无效的完整提示词组合与未解析变量会使组装失败，不会向模型发送格式错误的提示词。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## AssembleContext 公开契约

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`AssembleContext`。

目标版本编译声明（省略源码注释与实现体）：

声明来源包 `@deepseek-ai/dsh-system-prompt`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface AssembleContext {
    scope?: ScopeKey;
    signal?: AbortSignal;
}
```

声明来源包 `@deepseek-ai/dsh-agent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface AssembleContext {
    agent?: Agent;
}
```

成员检索：`scope`、`signal`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## AssembledContext 公开契约

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`AssembledContext`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AssembledContext {
    name: string;
    text: string;
    interpolate?: boolean;
}
```

成员检索：`interpolate`、`name`、`text`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## AssembledSection 公开契约

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`AssembledSection`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AssembledSection {
    name: string;
    text: string;
    interpolate?: boolean;
}
```

成员检索：`interpolate`、`name`、`text`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    includeHarnessIdentity?: boolean;
    includeRuntimeContext?: boolean;
    personaPrefix?: string;
    personaSuffix?: string;
    toolOrder?: string[];
}
```

成员检索：`includeHarnessIdentity`、`includeRuntimeContext`、`personaPrefix`、`personaSuffix`、`toolOrder`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## PERSONA_PREFIX_SECTION 公开契约

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`PERSONA_PREFIX_SECTION`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const PERSONA_PREFIX_SECTION = "deployment:persona-prefix";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## PERSONA_SUFFIX_SECTION 公开契约

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`PERSONA_SUFFIX_SECTION`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const PERSONA_SUFFIX_SECTION = "deployment:persona-suffix";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## PromptAssembly 公开契约

组装阶段的可变协作结果，包含已求值但尚未严格插值的段、有序工具schema与变量值。waterfall追加项要自己保证确定性；不得把正在构造的assembly共享给并行请求作为全局缓存。

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`PromptAssembly`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PromptAssembly {
    sections: AssembledSection[];
    contexts: AssembledContext[];
    tools: ToolSchema[];
    variables: Record<string, string | undefined>;
}
```

成员检索：`contexts`、`sections`、`tools`、`variables`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## PromptContext 公开契约

运行时动态事实贡献；按order确定顺序，required贡献不会被suppressRuntimeContext屏蔽。与system section不同，它由loop作为带来源user快照进入历史，必须由事实owner提供，并在实际组装时刷新。

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`PromptContext`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PromptContext {
    readonly name: string;
    readonly order: number;
    readonly text: string | ((context: AssembleContext) => string);
    readonly interpolate?: boolean;
    readonly required?: boolean;
}
```

成员检索：`interpolate`、`name`、`order`、`required`、`text`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。
