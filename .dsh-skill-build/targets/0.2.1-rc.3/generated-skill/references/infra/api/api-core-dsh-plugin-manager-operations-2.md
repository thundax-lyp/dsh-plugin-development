# @deepseek-ai/dsh-plugin-manager ./operations：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-plugin-manager 选型与组合](api-core-dsh-plugin-manager-operations-overview.md)。

管理当前 profile 的插件，无需手动编辑配置。启停单个插件条目、选择已安装的组合包，以及安装或删除外部组合包。在 YAML 中启用 HMR 时，配置变化立即生效；未启用 HMR 时，运行中的组合保留到重启。改动影响使用该 profile 的全部会话。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## registryArguments 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/operations`；公开符号：`registryArguments`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function registryArguments(registry: Registry): string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## runPluginCommand 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/operations`；公开符号：`runPluginCommand`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function runPluginCommand(context: PackageOperationContext, args: readonly string[], options: PackageOperationOptions): Promise<PackageResult>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## runProfilePnpm 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/operations`；公开符号：`runProfilePnpm`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function runProfilePnpm(context: PackageOperationContext, args: readonly string[], options: PackageOperationOptions): Promise<PackageResult>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## saveManifest 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/operations`；公开符号：`saveManifest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function saveManifest(dir: string, manifest: ProfileManifest): Promise<void>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## setProfileVersionExemption 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/operations`；公开符号：`setProfileVersionExemption`。

公开声明签名：

```text
export declare function setProfileVersionExemption(profileDir: string, packageVersion: string, runtimeVersion: string, enabled: boolean, acceptRisk: boolean): Promise<void>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## viewProfilePackage 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/operations`；公开符号：`viewProfilePackage`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function viewProfilePackage(dir: string, spec: string, options: PackageViewOptions): Promise<PackageViewResult>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
