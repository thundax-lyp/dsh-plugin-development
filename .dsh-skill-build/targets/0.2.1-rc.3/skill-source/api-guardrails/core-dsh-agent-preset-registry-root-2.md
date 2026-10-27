# @deepseek-ai/dsh-agent-preset-registry .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-agent-preset-registry 选型与组合](api-core-dsh-agent-preset-registry-root-overview.md)。

通过声明式 preset 选择 Agent 的工具、提示词和技能。同一进程可以运行多种组合。配置失败会显示在列表中；现有 Agent 保留已经使用的组合。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## auditRows 公开契约

导入入口：`@deepseek-ai/dsh-agent-preset-registry`；公开符号：`auditRows`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function auditRows(tree: EntryTree): Promise<RowAudit>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。

## entryListProblem 公开契约

导入入口：`@deepseek-ai/dsh-agent-preset-registry`；公开符号：`entryListProblem`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function entryListProblem(rows: unknown, at?: string): string | undefined;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。

## leakedServices 公开契约

导入入口：`@deepseek-ai/dsh-agent-preset-registry`；公开符号：`leakedServices`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function leakedServices(ctx: Context, mount: Fiber): string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。
