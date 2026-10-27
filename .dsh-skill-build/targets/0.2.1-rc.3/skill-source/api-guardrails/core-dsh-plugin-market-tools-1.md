# @deepseek-ai/dsh-plugin-market ./tools：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-plugin-market 选型与组合](api-core-dsh-plugin-market-tools-overview.md)。

`pluginMarket` 读取用户配置的插件市场索引，用 `dsh-plugin-market-index` 校验，并为每个条目标注 profile 中的安装状态、DSH 兼容性以及安装它所需的精确参数。Web 的发现标签页和 `plugin_market` agent 工具通过它读取；安装本身经由 `pluginManager.installBundle` 进行。格式及其理由见索引格式 Agent Note；Host 与 Web 的设计见发现 Agent Note。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-plugin-market/tools`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: Context): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## inject 公开契约

导入入口：`@deepseek-ai/dsh-plugin-market/tools`；公开符号：`inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const inject: string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
