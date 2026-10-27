# @deepseek-ai/dsh-plugin-market .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-plugin-market 选型与组合](api-core-dsh-plugin-market-root-overview.md)。

`pluginMarket` 读取用户配置的插件市场索引，用 `dsh-plugin-market-index` 校验，并为每个条目标注 profile 中的安装状态、DSH 兼容性以及安装它所需的精确参数。Web 的发现标签页和 `plugin_market` agent 工具通过它读取；安装本身经由 `pluginManager.installBundle` 进行。格式及其理由见索引格式 Agent Note；Host 与 Web 的设计见发现 Agent Note。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-plugin-market`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    indexes: Volatile<string[]>;
    fetchTimeoutMs: number;
    maxBytes: number;
    cacheTtlMs: number;
}
```

成员检索：`cacheTtlMs`、`fetchTimeoutMs`、`indexes`、`maxBytes`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## MarketCompatibility 公开契约

导入入口：`@deepseek-ai/dsh-plugin-market`；公开符号：`MarketCompatibility`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type MarketCompatibility = {
    readonly compatible: true;
} | {
    readonly compatible: false;
    readonly runtimeVersion: string;
    readonly requirements: Readonly<Record<string, string>>;
    readonly exempted: boolean;
};
```

成员检索：`compatible`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## MarketIndexSummary 公开契约

导入入口：`@deepseek-ai/dsh-plugin-market`；公开符号：`MarketIndexSummary`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface MarketIndexSummary {
    readonly url: string;
    readonly title?: LocalizedText;
    readonly description?: LocalizedText;
    readonly error?: string;
}
```

成员检索：`description`、`error`、`title`、`url`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## MarketInstallation 公开契约

导入入口：`@deepseek-ai/dsh-plugin-market`；公开符号：`MarketInstallation`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface MarketInstallation {
    readonly status: MarketInstallationStatus;
    readonly installedVersion?: string;
}
```

成员检索：`installedVersion`、`status`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## MarketInstallationStatus 公开契约

导入入口：`@deepseek-ai/dsh-plugin-market`；公开符号：`MarketInstallationStatus`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type MarketInstallationStatus = 'not-installed' | 'installed' | 'update-available' | 'different-version' | 'provided';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## MarketListingEntry 公开契约

导入入口：`@deepseek-ai/dsh-plugin-market`；公开符号：`MarketListingEntry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface MarketListingEntry extends Omit<MarketPlugin, 'versions'> {
    readonly versions: readonly MarketListingVersion[];
    readonly defaultVersion?: string;
    readonly installation: MarketInstallation;
}
```

成员检索：`defaultVersion`、`installation`、`versions`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## MarketListingVersion 公开契约

导入入口：`@deepseek-ai/dsh-plugin-market`；公开符号：`MarketListingVersion`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface MarketListingVersion extends MarketVersion {
    readonly install: MarketInstallTarget;
    readonly compatibility: MarketCompatibility;
}
```

成员检索：`compatibility`、`install`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## MarketQuery 公开契约

导入入口：`@deepseek-ai/dsh-plugin-market`；公开符号：`MarketQuery`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface MarketQuery {
    readonly text?: string;
    readonly category?: string;
    readonly labels?: readonly string[];
    readonly sort: MarketSort;
    readonly offset: number;
    readonly limit: number;
    readonly refresh?: boolean;
    readonly fetchedAt?: number;
}
```

成员检索：`category`、`fetchedAt`、`labels`、`limit`、`offset`、`refresh`、`sort`、`text`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
