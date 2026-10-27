# @deepseek-ai/dsh-plugin-manager ./registry：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-plugin-manager 选型与组合](api-core-dsh-plugin-manager-registry-overview.md)。

管理当前 profile 的插件，无需手动编辑配置。启停单个插件条目、选择已安装的组合包，以及安装或删除外部组合包。在 YAML 中启用 HMR 时，配置变化立即生效；未启用 HMR 时，运行中的组合保留到重启。改动影响使用该 profile 的全部会话。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## NPMMIRROR_REGISTRY 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/registry`；公开符号：`NPMMIRROR_REGISTRY`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const NPMMIRROR_REGISTRY = "https://registry.npmmirror.com/";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## OFFICIAL_NPM_REGISTRY 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/registry`；公开符号：`OFFICIAL_NPM_REGISTRY`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const OFFICIAL_NPM_REGISTRY = "https://registry.npmjs.org/";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## REGISTRY_URL 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/registry`；公开符号：`REGISTRY_URL`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const REGISTRY_URL: RegExp;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## attributeFailure 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/registry`；公开符号：`attributeFailure`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function attributeFailure(kind: PluginInstallFailureKind, log: string, spec: ParsedInstallSpec): 'registry' | 'spec-host' | 'other';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## normalizeRegistry 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/registry`；公开符号：`normalizeRegistry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function normalizeRegistry(url: string): string;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## registryPlan 公开契约

导入入口：`@deepseek-ai/dsh-plugin-manager/registry`；公开符号：`registryPlan`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function registryPlan(requested: Registry | undefined, configured: PluginRegistries): Registry[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
