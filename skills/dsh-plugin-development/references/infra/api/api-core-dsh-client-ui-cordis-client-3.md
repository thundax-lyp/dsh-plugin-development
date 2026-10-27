# @deepseek-ai/dsh-client-ui-cordis ./client：公开对象 3

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-client-ui-cordis 选型与组合](api-core-dsh-client-ui-cordis-client-overview.md)。

`dsh-client-ui-cordis` 渲染历史生成插件卡片，并为进程内定义提供控制面板。用户可以操作程序消费者提供的定义；重启后持久化卡片仍可读取，但不会重建定义。新建 Creator 插件使用 Plugin Manager。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## CordisToolViewKey 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`CordisToolViewKey`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type CordisToolViewKey = `${CordisDynamicPluginId}.${CordisDynamicPackageId}`;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisToolViewOwnerProps 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`CordisToolViewOwnerProps`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisToolViewOwnerProps {
    readonly pluginId: CordisDynamicPluginId;
    readonly packageId: CordisDynamicPackageId;
    readonly pluginRunId: CordisDynamicPluginRunId;
}
```

成员检索：`packageId`、`pluginId`、`pluginRunId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisInventoryRow 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`DynamicCordisInventoryRow`。

公开声明签名：

```text
export interface DynamicCordisInventoryRow {
    pluginId: CordisDynamicPluginId;
    agentId: SessionId;
    packages: readonly DynamicCordisInventoryPackage[];
    currentPackageId?: CordisDynamicPackageId;
    nextPackageId?: CordisDynamicPackageId;
    activeRun?: {
        pluginRunId: CordisDynamicPluginRunId;
        packageId: CordisDynamicPackageId;
    };
    latestRun?: DynamicCordisRunAttempt;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisPackage 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`DynamicCordisPackage`。

公开声明签名：

```text
export interface DynamicCordisPackage {
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    pluginRunId: CordisDynamicPluginRunId;
    name: string;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisRetracted 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`DynamicCordisRetracted`。

公开声明签名：

```text
export interface DynamicCordisRetracted {
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    pluginRunId: CordisDynamicPluginRunId;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: ClientContext): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## inject 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const inject: string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。
