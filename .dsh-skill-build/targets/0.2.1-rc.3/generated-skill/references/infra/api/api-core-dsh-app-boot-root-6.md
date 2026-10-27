# @deepseek-ai/dsh-app-boot .：公开对象 6

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-app-boot 选型与组合](api-core-dsh-app-boot-root-overview.md)。

`dsh-app-boot` 是 `dsh` profile（包括 Python 运行时 wheel 包所含的 CLI（命令行界面））背后的共享 Loader 启动库。它加载环境层、组合 profile 组合包与 patch、启动每个插件，再返回运行中的应用，或指出失败插件与原因。产品应用使用 `dsh` launcher 而不发布单独 bin；直接配置 helper 只保留给低层嵌入方与测试。你还可以在启动前预览生效配置，按 profile 选择实时或仅启动时应用 patch，并让持有终端的应用在致命退出前恢复终端。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SkippedBundle 公开契约

导入入口：`@deepseek-ai/dsh-app-boot`；公开符号：`SkippedBundle`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SkippedBundle {
    packageName: string;
    reason: string;
}
```

成员检索：`packageName`、`reason`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## StartupError 公开契约

导入入口：`@deepseek-ai/dsh-app-boot`；公开符号：`StartupError`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class StartupError extends Error {
    readonly entries: readonly StartupEntryDiagnostic[];
    startup?: {
        configurationPath: string;
        messages: readonly StartupLogRecord[];
    };
    constructor(message: string, entries: readonly StartupEntryDiagnostic[]);
}
```

成员检索：`entries`、`startup`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## boot 公开契约

导入入口：`@deepseek-ai/dsh-app-boot`；公开符号：`boot`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function boot(binName: string, absoluteConfigPath: string, patches?: PatchOptions[], prepare?: (ctx: Context) => Promise<void> | void, bareModuleBaseUrl?: string): Promise<Context>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## bundlePatchFiles 公开契约

导入入口：`@deepseek-ai/dsh-app-boot`；公开符号：`bundlePatchFiles`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function bundlePatchFiles(bundle: DshBundleManifest): string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## bundlePatchPaths 公开契约

导入入口：`@deepseek-ai/dsh-app-boot`；公开符号：`bundlePatchPaths`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function bundlePatchPaths(packageDir: string, bundle: DshBundleManifest): string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## composeEntries 公开契约

导入入口：`@deepseek-ai/dsh-app-boot`；公开符号：`composeEntries`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function composeEntries(layers: readonly PatchOptions[][], warn?: (message: string) => void): EntryOptions[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
