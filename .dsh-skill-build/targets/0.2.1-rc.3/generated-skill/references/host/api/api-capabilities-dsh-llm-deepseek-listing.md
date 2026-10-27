# dsh-llm-deepseek-listing 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 listing 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-llm-deepseek.md)；本页逐项保留对象的参数、字段和判别分支。

## ClientRequirement（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ClientRequirement = {
    readonly kind: 'none';
} | {
    readonly kind: 'min-version';
    readonly version: string;
} | {
    readonly kind: 'invalid';
};
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`ClientRequirement`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`kind`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## LISTING_TIMEOUT（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`LISTING_TIMEOUT`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const LISTING_TIMEOUT = "MODEL_LISTING_TIMEOUT";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## ListedCapabilities（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ListedCapabilities = {
    readonly usable: true;
    readonly facts: ListedFacts;
} | {
    readonly usable: false;
    readonly reason: string;
};
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`ListedCapabilities`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`usable`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## ListedFacts（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ListedFacts {
    readonly inputModalities: readonly ModelModality[];
    readonly contextWindow?: number;
    readonly maxOutputTokens?: number;
    readonly systemPromptUpdate?: 'in-history' | 'leading-only';
    readonly toolUpdate?: 'in-history' | 'addition-only' | 'leading-only';
}
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`ListedFacts`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`contextWindow`、`inputModalities`、`maxOutputTokens`、`systemPromptUpdate`、`toolUpdate`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## ListingEntry（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ListingEntry {
    readonly id: string;
    readonly name?: string;
    readonly requirement: ClientRequirement;
    readonly capabilities: ListedCapabilities;
}
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`ListingEntry`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`capabilities`、`id`、`name`、`requirement`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## ModelListing（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ModelListing {
    readonly entries: readonly ListingEntry[];
    readonly skipped: number;
}
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`ModelListing`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`entries`、`skipped`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## modelListingURL（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`modelListingURL`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function modelListingURL(baseURL: string): string;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## parseModelListing（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`parseModelListing`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function parseModelListing(body: unknown): ModelListing;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## requestModelListing（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`requestModelListing`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function requestModelListing(url: string, headers: Readonly<Record<string, string>>, signal: AbortSignal): Promise<ModelListing>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。
