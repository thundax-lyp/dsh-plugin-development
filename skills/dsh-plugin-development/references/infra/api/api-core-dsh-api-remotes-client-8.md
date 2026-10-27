# @deepseek-ai/dsh-api-remotes ./client：公开对象 8

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-remotes 选型与组合](api-core-dsh-api-remotes-client-overview.md)。

为本应用选定的 Host Remote 能力提供双侧 BFF。Host 入口拥有转发事件名单并向 API Gateway 注册应用事件 source；Client 入口以运行时值形式导入生成的 `/remote` 产物，通过 `ctx.remote.$mount()` 挂载每项贡献，并重新导出对应的声明合并。Client 业务包依赖该外观，而不依赖 Gateway 实现或单独的 Remote 运行时入口。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## MarketListingVersion 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`MarketListingVersion`。

公开声明签名：

```text
export interface MarketListingVersion extends MarketVersion {
    readonly install: MarketInstallTarget;
    readonly compatibility: MarketCompatibility;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## MarketQuery 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`MarketQuery`。

公开声明签名：

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

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## MarketSearchResult 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`MarketSearchResult`。

公开声明签名：

```text
export interface MarketSearchResult {
    readonly url: string;
    readonly title: LocalizedText;
    readonly description?: LocalizedText;
    readonly metadata: MarketIndexMetadata;
    readonly fetchedAt: number;
    readonly entries: readonly MarketListingEntry[];
    readonly total: number;
    readonly nextOffset: number | null;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## MarketSort 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`MarketSort`。

公开声明签名：

```text
export type MarketSort = {
    readonly kind: 'index';
} | {
    readonly kind: 'relevance';
} | {
    readonly kind: 'published';
    readonly direction: 'asc' | 'desc';
} | {
    readonly kind: 'key';
    readonly id: string;
    readonly direction: 'asc' | 'desc';
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## MessageId 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`MessageId`。

公开声明签名：

```text
export declare function MessageId(id: string): MessageId;

export type MessageId = Branded<'MessageId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PackageResult 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`PackageResult`。

公开声明签名：

```text
export interface PackageResult {
    exitCode: number;
    output: string;
    truncated: boolean;
    logPath: string;
    kind?: PluginInstallFailureKind;
    timedOut?: boolean;
    incompatible?: IncompatiblePlugin[];
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PluginChange 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`PluginChange`。

公开声明签名：

```text
export interface PluginChange {
    readonly reason: 'plugin' | 'bundle' | 'install' | 'remove';
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PluginEntryId 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`PluginEntryId`。

公开声明签名：

```text
export type PluginEntryId = Branded<'PluginEntryId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
