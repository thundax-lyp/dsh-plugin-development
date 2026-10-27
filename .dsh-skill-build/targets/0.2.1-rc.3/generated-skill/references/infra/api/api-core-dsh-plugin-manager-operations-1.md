# @deepseek-ai/dsh-plugin-manager ./operations：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-plugin-manager 选型与组合](api-core-dsh-plugin-manager-operations-overview.md)。

管理当前 profile 的插件，无需手动编辑配置。启停单个插件条目、选择已安装的组合包，以及安装或删除外部组合包。在 YAML 中启用 HMR 时，配置变化立即生效；未启用 HMR 时，运行中的组合保留到重启。改动影响使用该 profile 的全部会话。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## PackageOperationContext 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/operations`；公开符号：`PackageOperationContext`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PackageOperationContext {
    profile: string;
    dir?: string;
    installAnchor: string;
    cwd: string;
    home?: string;
}
```

成员检索：`cwd`、`dir`、`home`、`installAnchor`、`profile`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## PackageOperationOptions 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/operations`；公开符号：`PackageOperationOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PackageOperationOptions {
    command?: string;
    args?: readonly string[];
    env?: Readonly<Record<string, string>>;
    execution: 'cli' | 'service';
    signal?: AbortSignal;
    outputBytes: number;
    onOutput?: (text: string, stream: 'stdout' | 'stderr') => void;
    activateNewBundles?: boolean;
    lockWaitMs?: number;
    idleTimeoutMs?: number;
    lookupTimeoutMs?: number;
}
```

成员检索：`activateNewBundles`、`args`、`command`、`env`、`execution`、`idleTimeoutMs`、`lockWaitMs`、`lookupTimeoutMs`、`onOutput`、`outputBytes`、`signal`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## PackageViewOptions 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/operations`；公开符号：`PackageViewOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PackageViewOptions {
    command?: string;
    args?: readonly string[];
    env?: Readonly<Record<string, string>>;
    signal?: AbortSignal;
    timeoutMs: number;
    registry?: Registry;
}
```

成员检索：`args`、`command`、`env`、`registry`、`signal`、`timeoutMs`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## PackageViewResult 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/operations`；公开符号：`PackageViewResult`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PackageViewResult {
    exitCode: number | null;
    stdout: string;
    stderr: string;
    timedOut: boolean;
    cause?: unknown;
}
```

成员检索：`cause`、`exitCode`、`stderr`、`stdout`、`timedOut`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## anchorPathSpec 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/operations`；公开符号：`anchorPathSpec`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function anchorPathSpec(argument: string, cwd: string): string;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## bundleManifest 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/operations`；公开符号：`bundleManifest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function bundleManifest(name: string, dir: string, anchor: string): ProfileManifest | undefined;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## readProfileRegistry 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/operations`；公开符号：`readProfileRegistry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function readProfileRegistry(dir: string, options: {
    command?: string;
    args?: readonly string[];
    env?: Readonly<Record<string, string>>;
    timeoutMs: number;
}): Promise<string | null>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## readProfileVersionExemptions 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/operations`；公开符号：`readProfileVersionExemptions`。

公开声明签名：

```text
export declare function readProfileVersionExemptions(profileDir: string): Record<string, string[]>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
