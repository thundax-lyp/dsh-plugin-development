# dsh-llm-deepseek-listing-cache 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 listing-cache 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-llm-deepseek.md)；本页逐项保留对象的参数、字段和判别分支。

## ListingCacheDependencies（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ListingCacheDependencies {
    readonly credential: (url: string) => Promise<string | undefined>;
    readonly load: (url: string, credential: string, signal: AbortSignal) => Promise<ModelListing>;
    readonly now: () => number;
    readonly info: (message: string) => void;
    readonly warn: (message: string) => void;
}
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`ListingCacheDependencies`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`credential`、`info`、`load`、`now`、`warn`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## ListingView（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ListingView {
    readonly authenticated: boolean;
    readonly listing: ModelListing | undefined;
}
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`ListingView`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`authenticated`、`listing`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## ModelListingCache（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`ModelListingCache`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class ModelListingCache {
    constructor(dependencies: ListingCacheDependencies);
    current(): ListingView;
    view(settings: ListingSettings, signal?: AbortSignal): Promise<ListingView>;
    invalidate(): void;
    dispose(): void;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这是调用方持有的运行时对象。按上文公开使用路径结束任务；取消和释放不同于业务成功，等待异步清理后才能认定资源已退出。跨进程恢复须读取业务拥有的持久数据，不能序列化此活对象。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。
