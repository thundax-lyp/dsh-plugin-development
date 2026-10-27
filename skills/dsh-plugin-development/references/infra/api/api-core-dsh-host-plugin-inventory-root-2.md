# @deepseek-ai/dsh-host-plugin-inventory .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-host-plugin-inventory 选型与组合](api-core-dsh-host-plugin-inventory-root-overview.md)。

客户端可以调用 `pluginInventory/list`，按加载顺序展示宿主的当前插件，包括每个条目的标识符、模块标识、有效启用状态、存活阶段与可用的展示文本。部署组合了 agent preset roster 时，还会报告各预设的元数据、健康状态与压平后的插件组合；没有 roster 时，预设数据缺席。每次响应都是供展示和诊断使用的只读即时快照：它不能修改插件，也不提供历史或变更订阅。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## pluginEntryId 公开契约

导入入口：`@deepseek-ai/dsh-host-plugin-inventory`；公开符号：`pluginEntryId`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function pluginEntryId(value: string): PluginEntryId;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## readPluginInventory 公开契约

导入入口：`@deepseek-ai/dsh-host-plugin-inventory`；公开符号：`readPluginInventory`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function readPluginInventory(ctx: Context): Promise<PluginInventorySnapshot>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。
