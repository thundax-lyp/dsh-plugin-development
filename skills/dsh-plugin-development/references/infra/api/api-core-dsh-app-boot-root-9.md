# @deepseek-ai/dsh-app-boot .：公开对象 9

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-app-boot 选型与组合](api-core-dsh-app-boot-root-overview.md)。

`dsh-app-boot` 是 `dsh` profile（包括 Python 运行时 wheel 包所含的 CLI（命令行界面））背后的共享 Loader 启动库。它加载环境层、组合 profile 组合包与 patch、启动每个插件，再返回运行中的应用，或指出失败插件与原因。产品应用使用 `dsh` launcher 而不发布单独 bin；直接配置 helper 只保留给低层嵌入方与测试。你还可以在启动前预览生效配置，按 profile 选择实时或仅启动时应用 patch，并让持有终端的应用在致命退出前恢复终端。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## prepareProfilePatches 公开契约

导入入口：`@deepseek-ai/dsh-app-boot`；公开符号：`prepareProfilePatches`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function prepareProfilePatches(ctx: Context, patches: PatchOptions[], parentURL: string, binName?: string): PatchOptions[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## readBundlePatches 公开契约

导入入口：`@deepseek-ai/dsh-app-boot`；公开符号：`readBundlePatches`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function readBundlePatches(binName: string, context: ProfileContext, initialProfile?: Profile): PatchOptions[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## readPluginMeta 公开契约

导入入口：`@deepseek-ai/dsh-app-boot`；公开符号：`readPluginMeta`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function readPluginMeta(specifier: string, parentURL: string): PluginLocalizedMeta | undefined;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## readProfilePatches 公开契约

导入入口：`@deepseek-ai/dsh-app-boot`；公开符号：`readProfilePatches`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function readProfilePatches(binName: string, context: ProfileContext, initialProfile?: Profile): PatchOptions[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
