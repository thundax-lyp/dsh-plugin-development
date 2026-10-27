# @deepseek-ai/dsh-system-prompt .：公开对象 3

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-system-prompt 选型与组合](api-core-dsh-system-prompt-root-overview.md)。

`dsh-system-prompt` 让 agent 在每个模型步骤收到一份有序系统提示词与可用工具 schema。需要添加提示词段、动态运行时事实、可复用变量或工具 schema，或者控制固定 harness 身份、部署 persona、运行时上下文和面向模型的工具顺序时，请使用本包。agent 作用域的贡献会遮蔽同名全局默认值，而不影响其他 agent。无效的完整提示词组合与未解析变量会使组装失败，不会向模型发送格式错误的提示词。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## renderContextSections 公开契约

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`renderContextSections`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function renderContextSections(assembly: PromptAssembly): ContextSnapshotSection[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## renderContextSnapshot 公开契约

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`renderContextSnapshot`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function renderContextSnapshot(assembly: PromptAssembly): string;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。

## renderPrompt 公开契约

渲染已组装段：除interpolate:false外执行严格{{variable}}插值，删除空段，用空行连接。未知变量、已注册但无值或畸形完整模板都会throw；这发生在模型请求前，不以空字符串掩盖配置错误。

导入入口：`@deepseek-ai/dsh-system-prompt`；公开符号：`renderPrompt`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function renderPrompt(assembly: PromptAssembly): string;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具)。
