# @deepseek-ai/dsh-typert-loader .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-typert-loader 选型与组合](api-core-dsh-typert-loader-root-overview.md)。

挂载 `dsh-typert-loader` 后，Loader 组合中每个挂载的包都会自动把其生成的 Typert 反射与 schema factory 贡献给运行时注册表——并在包或本插件卸载时自动撤销。没有该导出的包会被跳过，因此在任何 Loader 组合中挂载它都是安全的。显式 `packages` 用于覆盖嵌套在另一 Loader 配置项之下的插件，这些插件的 fiber 不携带可解析的包说明符。它是仅支持 Node 的插件，需要配置树解析锚点才能解析包。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-typert-loader`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    packages?: string[];
}

export declare const Config: z<Config>;
```

成员检索：`packages`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TYPERT_HOST_EXPORT 公开契约

导入入口：`@deepseek-ai/dsh-typert-loader`；公开符号：`TYPERT_HOST_EXPORT`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const TYPERT_HOST_EXPORT = "./typert";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-typert-loader`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: Context, config: Config): Promise<void>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## inject 公开契约

导入入口：`@deepseek-ai/dsh-typert-loader`；公开符号：`inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const inject: string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## name 公开契约

导入入口：`@deepseek-ai/dsh-typert-loader`；公开符号：`name`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const name = "typert-loader";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## validateTypertManifest 公开契约

导入入口：`@deepseek-ai/dsh-typert-loader`；公开符号：`validateTypertManifest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function validateTypertManifest(pkgName: string, exported: unknown): TypertContribution;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。
