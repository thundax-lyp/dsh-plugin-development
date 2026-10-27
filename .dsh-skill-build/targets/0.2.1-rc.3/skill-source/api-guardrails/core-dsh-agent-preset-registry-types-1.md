# @deepseek-ai/dsh-agent-preset-registry ./types：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-agent-preset-registry 选型与组合](api-core-dsh-agent-preset-registry-types-overview.md)。

通过声明式 preset 选择 Agent 的工具、提示词和技能。同一进程可以运行多种组合。配置失败会显示在列表中；现有 Agent 保留已经使用的组合。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## AgentPresetDocument 公开契约

导入入口：`@deepseek-ai/dsh-agent-preset-registry/types`；公开符号：`AgentPresetDocument`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AgentPresetDocument {
    readonly agentPreset: string;
    readonly content: string;
    readonly name?: string;
    readonly description?: string;
}
```

成员检索：`agentPreset`、`content`、`description`、`name`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。

## AgentPresetRoster 公开契约

导入入口：`@deepseek-ai/dsh-agent-preset-registry/types`；公开符号：`AgentPresetRoster`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AgentPresetRoster {
    readonly presets: readonly AgentPresetRow[];
}
```

成员检索：`presets`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。

## AgentPresetRow 公开契约

导入入口：`@deepseek-ai/dsh-agent-preset-registry/types`；公开符号：`AgentPresetRow`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AgentPresetRow {
    readonly id: string;
    readonly isDefault: boolean;
    readonly name?: string;
    readonly description?: string;
    readonly broken?: string;
}
```

成员检索：`broken`、`description`、`id`、`isDefault`、`name`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。
