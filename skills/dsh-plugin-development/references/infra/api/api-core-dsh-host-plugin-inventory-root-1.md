# @deepseek-ai/dsh-host-plugin-inventory .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-host-plugin-inventory 选型与组合](api-core-dsh-host-plugin-inventory-root-overview.md)。

客户端可以调用 `pluginInventory/list`，按加载顺序展示宿主的当前插件，包括每个条目的标识符、模块标识、有效启用状态、存活阶段与可用的展示文本。部署组合了 agent preset roster 时，还会报告各预设的元数据、健康状态与压平后的插件组合；没有 roster 时，预设数据缺席。每次响应都是供展示和诊断使用的只读即时快照：它不能修改插件，也不提供历史或变更订阅。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## AgentPresetPluginGroup 公开契约

导入入口：`@deepseek-ai/dsh-host-plugin-inventory`；公开符号：`AgentPresetPluginGroup`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AgentPresetPluginGroup {
    readonly id: string;
    readonly name?: string;
    readonly isDefault: boolean;
    readonly broken?: string;
    readonly rows: readonly AgentPresetPluginRow[];
}
```

成员检索：`broken`、`id`、`isDefault`、`name`、`rows`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## AgentPresetPluginRow 公开契约

导入入口：`@deepseek-ai/dsh-host-plugin-inventory`；公开符号：`AgentPresetPluginRow`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AgentPresetPluginRow {
    readonly entryId: string | null;
    readonly moduleName: string;
    readonly meta?: PluginLocalizedMeta;
    readonly enabled: PresetPluginEnablement;
    readonly condition?: string;
    readonly fiberPhase: PluginFiberPhase;
}
```

成员检索：`condition`、`enabled`、`entryId`、`fiberPhase`、`meta`、`moduleName`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## PluginEntryId 公开契约

导入入口：`@deepseek-ai/dsh-host-plugin-inventory`；公开符号：`PluginEntryId`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type PluginEntryId = Branded<'PluginEntryId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## PluginFiberPhase 公开契约

导入入口：`@deepseek-ai/dsh-host-plugin-inventory`；公开符号：`PluginFiberPhase`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type PluginFiberPhase = 'pending' | 'loading' | 'active' | 'failed' | 'unloading' | null;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## PluginInventoryEntry 公开契约

导入入口：`@deepseek-ai/dsh-host-plugin-inventory`；公开符号：`PluginInventoryEntry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PluginInventoryEntry {
    readonly entryId: PluginEntryId;
    readonly moduleName: string;
    readonly meta?: PluginLocalizedMeta;
    readonly enabled: boolean;
    readonly fiberPhase: PluginFiberPhase;
}
```

成员检索：`enabled`、`entryId`、`fiberPhase`、`meta`、`moduleName`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## PluginInventoryGateway 公开契约

导入入口：`@deepseek-ai/dsh-host-plugin-inventory`；公开符号：`PluginInventoryGateway`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class PluginInventoryGateway extends TypertRemoteService {
    static inject: string[];
    constructor(ctx: Context);
    list(): Promise<PluginInventorySnapshot>;
}
```

成员检索：`list`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## PluginInventorySnapshot 公开契约

导入入口：`@deepseek-ai/dsh-host-plugin-inventory`；公开符号：`PluginInventorySnapshot`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PluginInventorySnapshot {
    readonly managementAvailable?: boolean;
    readonly entries: readonly PluginInventoryEntry[];
    readonly agentPresets?: readonly AgentPresetPluginGroup[];
}
```

成员检索：`agentPresets`、`entries`、`managementAvailable`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## PresetPluginEnablement 公开契约

导入入口：`@deepseek-ai/dsh-host-plugin-inventory`；公开符号：`PresetPluginEnablement`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type PresetPluginEnablement = boolean | 'conditional';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。
