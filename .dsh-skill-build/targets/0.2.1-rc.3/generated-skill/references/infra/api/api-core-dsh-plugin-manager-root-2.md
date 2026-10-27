# @deepseek-ai/dsh-plugin-manager .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-plugin-manager 选型与组合](api-core-dsh-plugin-manager-root-overview.md)。

管理当前 profile 的插件，无需手动编辑配置。启停单个插件条目、选择已安装的组合包，以及安装或删除外部组合包。在 YAML 中启用 HMR 时，配置变化立即生效；未启用 HMR 时，运行中的组合保留到重启。改动影响使用该 profile 的全部会话。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## InstallSpecKind 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`InstallSpecKind`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type InstallSpecKind = 'registry' | 'path' | 'git' | 'tarball';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## InvalidInstallSpecError 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`InvalidInstallSpecError`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class InvalidInstallSpecError extends Error {
    readonly spec: string;
    readonly reason: string;
    constructor(spec: string, reason: string);
}
```

成员检索：`reason`、`spec`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## ManagementError 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`ManagementError`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ManagementError {
    code: ReadOnlyReason | 'unknown-plugin' | 'invalid-spec' | 'already-installed' | 'ambiguous-install' | 'not-bundle' | 'not-removable' | 'stop-profile' | 'bundle-in-use' | 'stale-approval' | 'incompatible-version' | 'operation-error';
    diagnostic?: string;
    incompatible?: IncompatiblePlugin[];
}
```

成员检索：`code`、`diagnostic`、`incompatible`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## PackageResult 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`PackageResult`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PackageResult {
    exitCode: number;
    output: string;
    truncated: boolean;
    logPath: string;
    kind?: PluginInstallFailureKind;
    timedOut?: boolean;
    incompatible?: IncompatiblePlugin[];
}
```

成员检索：`exitCode`、`incompatible`、`kind`、`logPath`、`output`、`timedOut`、`truncated`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## ParsedInstallSpec 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`ParsedInstallSpec`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type ParsedInstallSpec = {
    readonly kind: 'registry';
    readonly spec: string;
    readonly name: string;
    readonly range?: string;
} | {
    readonly kind: 'path';
    readonly spec: string;
    readonly path: string;
} | {
    readonly kind: 'tarball';
    readonly spec: string;
    readonly path?: string;
    readonly host?: string;
} | {
    readonly kind: 'git';
    readonly spec: string;
    readonly host: string;
};
```

成员检索：`kind`、`spec`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## PluginChange 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`PluginChange`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PluginChange {
    readonly reason: 'plugin' | 'bundle' | 'install' | 'remove';
}
```

成员检索：`reason`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## PluginEntryId 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`PluginEntryId`。

公开声明签名：

```text
export type PluginEntryId = Branded<'PluginEntryId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## PluginInfo 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`PluginInfo`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type PluginInfo = PluginInventoryEntry & ({
    patchId: string;
    readOnlyReason?: never;
} | {
    patchId?: never;
    readOnlyReason: ReadOnlyReason;
});
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
