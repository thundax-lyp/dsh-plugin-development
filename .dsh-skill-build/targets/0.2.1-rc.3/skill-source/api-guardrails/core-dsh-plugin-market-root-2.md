# @deepseek-ai/dsh-plugin-market .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-plugin-market 选型与组合](api-core-dsh-plugin-market-root-overview.md)。

`pluginMarket` 读取用户配置的插件市场索引，用 `dsh-plugin-market-index` 校验，并为每个条目标注 profile 中的安装状态、DSH 兼容性以及安装它所需的精确参数。Web 的发现标签页和 `plugin_market` agent 工具通过它读取；安装本身经由 `pluginManager.installBundle` 进行。格式及其理由见索引格式 Agent Note；Host 与 Web 的设计见发现 Agent Note。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## MarketSearchResult 公开契约

导入入口：`@deepseek-ai/dsh-plugin-market`；公开符号：`MarketSearchResult`。

目标版本编译声明（省略源码注释与实现体）：

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

成员检索：`description`、`entries`、`fetchedAt`、`metadata`、`nextOffset`、`title`、`total`、`url`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## MarketSort 公开契约

导入入口：`@deepseek-ai/dsh-plugin-market`；公开符号：`MarketSort`。

目标版本编译声明（省略源码注释与实现体）：

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

成员检索：`kind`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## default 公开契约

导入入口：`@deepseek-ai/dsh-plugin-market`；公开符号：`default`。

目标版本编译声明（省略源码注释与实现体）：

```text
export default class PluginMarket extends TypertRemoteService {
    static inject: string[];
    static Config: z<Schemastery.ObjectS<NoInfer<{
        indexes: z<NoInfer<string[]>, NoInfer<string[]>, "volatile-defined">;
        fetchTimeoutMs: z<number, number, "defined">;
        maxBytes: z<number, number, "defined">;
        cacheTtlMs: z<number, number, "defined">;
    }>>, Schemastery.ObjectT<NoInfer<{
        indexes: z<NoInfer<string[]>, NoInfer<string[]>, "volatile-defined">;
        fetchTimeoutMs: z<number, number, "defined">;
        maxBytes: z<number, number, "defined">;
        cacheTtlMs: z<number, number, "defined">;
    }>>, "plain">;
    constructor(ctx: Context, config: Config);
    listIndexes(): MarketIndexSummary[];
    setIndexes(urls: string[]): Promise<void>;
    search(url: string, query: MarketQuery): Promise<MarketSearchResult>;
    entry(url: string, name: string): Promise<MarketListingEntry | undefined>;
}
```

成员检索：`entry`、`listIndexes`、`search`、`setIndexes`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
