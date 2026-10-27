# @deepseek-ai/dsh-plugin-manager .：公开对象 3

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-plugin-manager 选型与组合](api-core-dsh-plugin-manager-root-overview.md)。

管理当前 profile 的插件，无需手动编辑配置。启停单个插件条目、选择已安装的组合包，以及安装或删除外部组合包。在 YAML 中启用 HMR 时，配置变化立即生效；未启用 HMR 时，运行中的组合保留到重启。改动影响使用该 profile 的全部会话。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## PluginInspectProblem 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`PluginInspectProblem`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type PluginInspectProblem = 'invalid-spec' | 'already-installed' | 'not-found' | 'not-a-package' | 'not-a-bundle' | 'network' | 'unknown';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## PluginInstallCancellation 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`PluginInstallCancellation`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PluginInstallCancellation {
    readonly status: 'cancelled' | 'too-late' | 'not-running';
}
```

成员检索：`status`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## PluginInstallFailureKind 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`PluginInstallFailureKind`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type PluginInstallFailureKind = 'pnpm-missing' | 'timeout' | 'not-found' | 'no-matching-version' | 'network' | 'disk-full' | 'permission' | 'build-blocked' | 'integrity' | 'unknown';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## PluginInstallLogChunk 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`PluginInstallLogChunk`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PluginInstallLogChunk {
    readonly requestId?: PluginInstallRequestId;
    readonly jobId: string;
    readonly argv: readonly string[];
    readonly cwd: string;
    readonly stream: 'stdout' | 'stderr';
    readonly text: string;
    readonly exitCode?: number | null;
}
```

成员检索：`argv`、`cwd`、`exitCode`、`jobId`、`requestId`、`stream`、`text`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## PluginInstallProgress 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`PluginInstallProgress`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PluginInstallProgress {
    readonly requestId: PluginInstallRequestId;
    readonly phase: 'installing' | 'cancelling' | 'applying';
    readonly attempt?: {
        readonly registry: Registry;
        readonly index: number;
        readonly total: number;
    };
}
```

成员检索：`attempt`、`phase`、`requestId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## PluginInstallRequestId 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`PluginInstallRequestId`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type PluginInstallRequestId = Branded<'PluginInstallRequestId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## PluginManager 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`PluginManager`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class PluginManager extends TypertRemoteService {
    static inject: string[];
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    listVersionExemptions(): {
        exemptions: Record<string, string[]>;
        warnings: string[];
    };
    setVersionExemption(packageVersion: string, runtimeVersion: string, enabled: boolean, acceptRisk?: boolean): Promise<ChangeResult>;
    listPlugins(): Promise<PluginInfo[]>;
    listBundles(): Promise<BundleInfo[]>;
    registries(): Promise<PluginRegistries>;
    inspect(spec: string, options?: InspectOptions, signal?: AbortSignal): Promise<PluginSpecInspection>;
    setPluginEnabled(id: PluginEntryId, enabled: boolean): Promise<ChangeResult>;
    setBundleEnabled(name: string, enabled: boolean): Promise<ChangeResult>;
    installBundle(spec: string, options?: InstallBundleOptions): Promise<ChangeResult>;
    waitForInstall(requestId: PluginInstallRequestId): Promise<ChangeResult | null>;
    cancelInstall(requestId: PluginInstallRequestId): Promise<PluginInstallCancellation>;
    removeBundle(name: string): Promise<ChangeResult>;
}
```

成员检索：`cancelInstall`、`inspect`、`installBundle`、`listBundles`、`listPlugins`、`listVersionExemptions`、`registries`、`removeBundle`、`setBundleEnabled`、`setPluginEnabled`、`setVersionExemption`、`waitForInstall`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## PluginRegistries 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager`；公开符号：`PluginRegistries`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PluginRegistries {
    readonly registry: Registry;
    readonly fallbackRegistries: readonly string[];
    readonly resolved: string | null;
}
```

成员检索：`fallbackRegistries`、`registry`、`resolved`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
