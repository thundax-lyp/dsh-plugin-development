# @deepseek-ai/dsh-api-remotes ./client：公开对象 7

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-remotes 选型与组合](api-core-dsh-api-remotes-client-overview.md)。

为本应用选定的 Host Remote 能力提供双侧 BFF。Host 入口拥有转发事件名单并向 API Gateway 注册应用事件 source；Client 入口以运行时值形式导入生成的 `/remote` 产物，通过 `ctx.remote.$mount()` 挂载每项贡献，并重新导出对应的声明合并。Client 业务包依赖该外观，而不依赖 Gateway 实现或单独的 Remote 运行时入口。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## LlmNativeAuth 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`LlmNativeAuth`。

公开声明签名：

```text
export interface LlmNativeAuth {
    env: readonly string[];
    oauth: boolean;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## LlmProviderInfo 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`LlmProviderInfo`。

公开声明签名：

```text
export interface LlmProviderInfo {
    id: string;
    name: string;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## ManagementError 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`ManagementError`。

公开声明签名：

```text
export interface ManagementError {
    code: ReadOnlyReason | 'unknown-plugin' | 'invalid-spec' | 'already-installed' | 'ambiguous-install' | 'not-bundle' | 'not-removable' | 'stop-profile' | 'bundle-in-use' | 'stale-approval' | 'incompatible-version' | 'operation-error';
    diagnostic?: string;
    incompatible?: IncompatiblePlugin[];
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## MarketCompatibility 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`MarketCompatibility`。

公开声明签名：

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

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## MarketIndexSummary 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`MarketIndexSummary`。

公开声明签名：

```text
export interface MarketIndexSummary {
    readonly url: string;
    readonly title?: LocalizedText;
    readonly description?: LocalizedText;
    readonly error?: string;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## MarketInstallation 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`MarketInstallation`。

公开声明签名：

```text
export interface MarketInstallation {
    readonly status: MarketInstallationStatus;
    readonly installedVersion?: string;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## MarketInstallationStatus 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`MarketInstallationStatus`。

公开声明签名：

```text
export type MarketInstallationStatus = 'not-installed' | 'installed' | 'update-available' | 'different-version' | 'provided';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## MarketListingEntry 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`MarketListingEntry`。

公开声明签名：

```text
export interface MarketListingEntry extends Omit<MarketPlugin, 'versions'> {
    readonly versions: readonly MarketListingVersion[];
    readonly defaultVersion?: string;
    readonly installation: MarketInstallation;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
