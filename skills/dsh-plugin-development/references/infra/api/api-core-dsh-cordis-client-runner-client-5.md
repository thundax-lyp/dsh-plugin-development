# @deepseek-ai/dsh-cordis-client-runner ./client：公开对象 5

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-cordis-client-runner 选型与组合](api-core-dsh-cordis-client-runner-client-overview.md)。

`dsh-cordis-client-runner` 为程序调用方和现有浏览器控件运行进程内动态包的浏览器部分。它在请求获批或用户显式操作后加载定义，并在 Host 撤销运行时移除定义。页面刷新不会恢复定义。Creator UI 插件通过 Plugin Manager 使用已安装的 Client 模块。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## dynamicCordisContext 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`dynamicCordisContext`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function dynamicCordisContext(ctx: Context, env: DynamicCordisGuardEnv): Context;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## evaluateClientHalf 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`evaluateClientHalf`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function evaluateClientHalf(pluginId: CordisDynamicPluginId, clientCode: string, env: DynamicCordisClosureEnv, styles: DynamicCordisStyles): Promise<DynamicCordisEvaluatedPlugin | ((ctx: unknown) => unknown)>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## inject 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const inject: string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## isDynamicCordisPlugin 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`isDynamicCordisPlugin`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function isDynamicCordisPlugin(value: unknown): value is DynamicCordisEvaluatedPlugin | ((ctx: unknown) => unknown);
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## name 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`name`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const name = "cordis-client-runner";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。
