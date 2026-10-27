# @deepseek-ai/dsh-cordis-host-runner .：公开对象 4

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-cordis-host-runner 选型与组合](api-core-dsh-cordis-host-runner-root-overview.md)。

`dsh-cordis-host-runner` 提供运行时检查，并为程序调用方和浏览器控件保留进程内动态定义。Host 部分在 `node:vm` 中运行；浏览器部分使用 Client runner 和审批 UI。定义在重启后消失。Agent 通过 `tool-cordis` 发现 API，通过 Plugin Manager 安装持久化 bundle；没有模型工具创建动态定义。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## DynamicCordisHandler 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisHandler`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type DynamicCordisHandler = (args: unknown) => Promise<unknown>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisHostHalfResult 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisHostHalfResult`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type DynamicCordisHostHalfResult = {
    ok: true;
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    pluginRunId: CordisDynamicPluginRunId;
    waitingFor: readonly string[];
    startedHere: boolean;
} | ({
    ok: false;
} & CordisErrorDetails);
```

成员检索：`ok`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisInventoryPackage 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisInventoryPackage`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisInventoryPackage {
    packageId: CordisDynamicPackageId;
    name: string;
    purpose: string;
    hasHostHalf: boolean;
    hasClientHalf: boolean;
}
```

成员检索：`hasClientHalf`、`hasHostHalf`、`name`、`packageId`、`purpose`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisInventoryRow 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisInventoryRow`。

目标版本编译声明（省略源码注释与实现体）：

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

成员检索：`activeRun`、`agentId`、`currentPackageId`、`latestRun`、`nextPackageId`、`packages`、`pluginId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisInvokeResult 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisInvokeResult`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type DynamicCordisInvokeResult = {
    ok: true;
    value: JsonValue;
} | ({
    ok: false;
    code: 'plugin-not-running' | 'stale-run' | 'method-not-found' | 'handler-error';
} & CordisErrorDetails);
```

成员检索：`ok`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisPackage 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisPackage`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisPackage {
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    pluginRunId: CordisDynamicPluginRunId;
    name: string;
}
```

成员检索：`name`、`packageId`、`pluginId`、`pluginRunId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisPackageInspection 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisPackageInspection`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisPackageInspection extends DynamicCordisReference {
    code: {
        host?: string;
        client?: string;
    };
}
```

成员检索：`activeRun`、`code`、`currentPackageId`、`latestRun`、`name`、`nextPackageId`、`packageId`、`pluginId`、`purpose`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisPlugin 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisPlugin`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisPlugin {
    pluginId: CordisDynamicPluginId;
    sessionId: SessionId;
    packages: Map<CordisDynamicPackageId, DynamicCordisDefinition>;
    approvedClientPackages: Set<CordisDynamicPackageId>;
    clientVersionUpdatesApproved: boolean;
    currentPackageId?: CordisDynamicPackageId;
    nextPackageId?: CordisDynamicPackageId;
    run?: DynamicCordisRun;
    latestRun?: DynamicCordisRunAttempt;
}
```

成员检索：`approvedClientPackages`、`clientVersionUpdatesApproved`、`currentPackageId`、`latestRun`、`nextPackageId`、`packages`、`pluginId`、`run`、`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。
