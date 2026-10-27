# @deepseek-ai/dsh-plugin-manager .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-plugin-manager 选型与组合](api-core-dsh-plugin-manager-root-overview.md)。

管理当前 profile 的插件，无需手动编辑配置。启停单个插件条目、选择已安装的组合包，以及安装或删除外部组合包。在 YAML 中启用 HMR 时，配置变化立即生效；未启用 HMR 时，运行中的组合保留到重启。改动影响使用该 profile 的全部会话。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## BundleInfo 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`BundleInfo`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface BundleInfo {
    name: string;
    official: boolean;
    availability: 'installation' | 'profile' | 'missing';
    installTarget?: {
        spec: string;
        version: string;
    };
    version?: string;
    meta?: PluginLocalizedMeta;
    description?: string;
    enabled: boolean;
    installed: boolean;
    source?: string;
    optional: boolean;
    removable: boolean;
    readOnlyReason?: ReadOnlyReason;
    error?: ManagementError;
    rows: BundleRowInfo[];
    overrides: string[];
}
```

成员检索：`availability`、`description`、`enabled`、`error`、`installTarget`、`installed`、`meta`、`name`、`official`、`optional`、`overrides`、`readOnlyReason`、`removable`、`rows`、`source`、`version`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## BundleRowInfo 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`BundleRowInfo`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface BundleRowInfo {
    rowId: string;
    moduleName: string;
    meta?: PluginLocalizedMeta;
    entryId?: PluginEntryId;
}
```

成员检索：`entryId`、`meta`、`moduleName`、`rowId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## ChangeResult 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`ChangeResult`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ChangeResult {
    changed: boolean;
    application: 'applied' | 'restart-required' | 'overridden' | 'failed' | 'cancelled';
    restartReason?: RestartReason;
    stage: 'install' | 'enable' | 'remove';
    target: string;
    enabled?: boolean;
    error?: ManagementError;
    warnings?: string[];
    packageResult?: PackageResult;
    bundle?: string;
    version?: string;
    pendingBuilds?: string[];
    approvedBuilds?: string[];
    registries?: Registry[];
    failedAt?: 'registry' | 'spec-host';
}
```

成员检索：`application`、`approvedBuilds`、`bundle`、`changed`、`enabled`、`error`、`failedAt`、`packageResult`、`pendingBuilds`、`registries`、`restartReason`、`stage`、`target`、`version`、`warnings`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    pnpmCommand?: string;
    outputBytes?: number;
    lockWaitMs?: number;
    inspectTimeoutMs?: number;
    githubConnectionTimeoutMs?: number;
    idleTimeoutMs?: number;
    registry?: string;
    fallbackRegistries?: string[];
}
```

成员检索：`fallbackRegistries`、`githubConnectionTimeoutMs`、`idleTimeoutMs`、`inspectTimeoutMs`、`lockWaitMs`、`outputBytes`、`pnpmCommand`、`registry`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## IncompatiblePlugin 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`IncompatiblePlugin`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface IncompatiblePlugin {
    name: string;
    version: string;
    runtimeVersion: string;
    requirements: Record<string, string>;
}
```

成员检索：`name`、`requirements`、`runtimeVersion`、`version`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## InspectOptions 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`InspectOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface InspectOptions {
    readonly registry?: Registry;
}
```

成员检索：`registry`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## InstallBundleOptions 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`InstallBundleOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface InstallBundleOptions {
    enabled?: boolean;
    saveExact?: boolean;
    requestId?: PluginInstallRequestId;
    approvedBuilds?: string[];
    registry?: Registry;
}
```

成员检索：`approvedBuilds`、`enabled`、`registry`、`requestId`、`saveExact`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## InstallFailureFacts 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`InstallFailureFacts`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface InstallFailureFacts {
    readonly log: string;
    readonly cause?: unknown;
    readonly timedOut?: boolean;
}
```

成员检索：`cause`、`log`、`timedOut`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
