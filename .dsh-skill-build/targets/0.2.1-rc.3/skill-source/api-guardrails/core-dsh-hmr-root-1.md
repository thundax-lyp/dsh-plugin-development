# @deepseek-ai/dsh-hmr .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-hmr 选型与组合](api-core-dsh-hmr-root-overview.md)。

在应用运行期间重载插件源码和配置。模块替换、Include 刷新与 profile 配置变更共用一个队列。包安装在该队列之外执行。`ctx.hmr` 保留现有 Cordis HMR 的配置和事件。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## HmrConfig 公开契约

导入入口：`@deepseek-ai/dsh-hmr`；公开符号：`HmrConfig`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface HmrConfig extends ChokidarOptions {
    base?: string;
    root: string[];
    debounce: number;
    ignored: string[];
}
```

成员检索：`base`、`debounce`、`ignored`、`root`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## PendingModule 公开契约

导入入口：`@deepseek-ai/dsh-hmr`；公开符号：`PendingModule`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PendingModule {
    url: string;
    reason: 'host-module' | 'unmanaged-plugin' | 'module-comparison';
}
```

成员检索：`reason`、`url`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## ProfileReconciliation 公开契约

导入入口：`@deepseek-ai/dsh-hmr`；公开符号：`ProfileReconciliation`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ProfileReconciliation {
    warnings: string[];
    pending: PendingModule[];
    restartReason?: 'module-comparison' | 'package-moved';
}
```

成员检索：`pending`、`restartReason`、`warnings`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## Reload 公开契约

导入入口：`@deepseek-ai/dsh-hmr`；公开符号：`Reload`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Reload {
    filename: string;
    modules: ReloadModules;
    runtime?: Plugin.Runtime | undefined;
}
```

成员检索：`filename`、`modules`、`runtime`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## default 公开契约

导入入口：`@deepseek-ai/dsh-hmr`；公开符号：`default`。

公开声明签名：

```text
declare class Hmr extends Service {
    config: HmrConfig;
    static Config: z<HmrConfig>;
    baseDir: string;
    runExclusive<T>(operation: () => Promise<T>): Promise<T>;
    watchConfig(filename: string, refresh: () => Promise<void>): Promise<() => Promise<void>>;
    constructor(ctx: Context, config: HmrConfig);
    [Service.init](): AsyncGenerator<() => Promise<void>, void, unknown>;
    getOuterStack: () => string[];
    getLinked(url: string): Promise<string[]>;
    reconcileProfile(requiredIds?: readonly string[]): Promise<ProfileReconciliation>;
}

declare namespace Hmr {
    type Config = HmrConfig;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
