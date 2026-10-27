# @deepseek-ai/dsh-web：搜索与抓取 Provider

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在搜索与抓取 Provider任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[搜索与抓取 Provider](api-runtime-web-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-web.md)。

## WebError 契约

从 `@deepseek-ai/dsh-web` 导入 `WebError`。`WebError` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare class WebError extends HarnessError {
}
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## WebFetchBody 契约

从 `@deepseek-ai/dsh-web` 导入 `WebFetchBody`。封闭判别联合：html 或 text；调用方必须处理全部分支。响应状态是 fetch result 的一部分，非 2xx 不必抛出。

```text
export type WebFetchBody = {
    readonly kind: 'html';
    readonly content: string;
} | {
    readonly kind: 'text';
    readonly content: string;
};
```

成员检索：`content`、`kind`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## WebFetchProvider 契约

从 `@deepseek-ai/dsh-web` 导入 `WebFetchProvider`。id 在 fetch registry 唯一，available 只做本地检查，fetch 返回描述性 HTTP 结果并透传 signal。

```text
export interface WebFetchProvider {
    readonly id: string;
    available(): boolean;
    fetch(request: WebFetchRequest, signal?: AbortSignal): Promise<WebFetchResult>;
}
```

成员检索：`available`、`fetch`、`id`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## WebFetchRequest 契约

从 `@deepseek-ai/dsh-web` 导入 `WebFetchRequest`。`WebFetchRequest` 是搜索与抓取 Provider的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface WebFetchRequest {
    readonly url: string;
}
```

成员检索：`url`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## WebFetchResult 契约

从 `@deepseek-ai/dsh-web` 导入 `WebFetchResult`。`WebFetchResult` 是搜索与抓取 Provider的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface WebFetchResult {
    readonly url: string;
    readonly statusCode: number;
    readonly body: WebFetchBody;
    readonly truncated: boolean;
}
```

成员检索：`body`、`statusCode`、`truncated`、`url`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## WebRuntime 契约

从 `@deepseek-ai/dsh-web` 导入 `WebRuntime`。Host Service，Config 提供 volatile searchProvider/fetchProvider。每次调用选择后端，不用注册顺序；provider 自己实现真实 IO 与 signal。

```text
export declare class WebRuntime extends Service {
    static Config: z<Schemastery.ObjectS<NoInfer<{
        searchProvider: z<string, string, "volatile">;
        fetchProvider: z<string, string, "volatile">;
    }>>, Schemastery.ObjectT<NoInfer<{
        searchProvider: z<string, string, "volatile">;
        fetchProvider: z<string, string, "volatile">;
    }>>, "plain">;
    constructor(ctx: Context, config: WebRuntimeConfig);
    registerSearchProvider(provider: WebSearchProvider): () => void;
    registerFetchProvider(provider: WebFetchProvider): () => void;
    search(request: WebSearchRequest, signal?: AbortSignal): Promise<WebSearchResult>;
    fetch(request: WebFetchRequest, signal?: AbortSignal): Promise<WebFetchResult>;
}
```

成员检索：`fetch`、`registerFetchProvider`、`registerSearchProvider`、`search`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## WebRuntimeConfig 契约

从 `@deepseek-ai/dsh-web` 导入 `WebRuntimeConfig`。`WebRuntimeConfig` 是搜索与抓取 Provider的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface WebRuntimeConfig {
    readonly searchProvider: Volatile<string | undefined>;
    readonly fetchProvider: Volatile<string | undefined>;
}
```

成员检索：`fetchProvider`、`searchProvider`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## WebSearchProvider 契约

从 `@deepseek-ai/dsh-web` 导入 `WebSearchProvider`。id 唯一，available 为便宜的本地能力检查，不做网络请求；search 执行真实请求并透传 signal。

```text
export interface WebSearchProvider {
    readonly id: string;
    available(): boolean;
    search(request: WebSearchRequest, signal?: AbortSignal): Promise<WebSearchResult>;
}
```

成员检索：`available`、`id`、`search`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## WebSearchRequest 契约

从 `@deepseek-ai/dsh-web` 导入 `WebSearchRequest`。`WebSearchRequest` 是搜索与抓取 Provider的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface WebSearchRequest {
    readonly query: string;
    readonly maxResults?: number;
}
```

成员检索：`maxResults`、`query`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## WebSearchResult 契约

从 `@deepseek-ai/dsh-web` 导入 `WebSearchResult`。`WebSearchResult` 是搜索与抓取 Provider的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface WebSearchResult {
    readonly content?: string;
    readonly sources: readonly WebSearchSource[];
    readonly truncated: boolean;
}
```

成员检索：`content`、`sources`、`truncated`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## WebSearchSource 契约

从 `@deepseek-ai/dsh-web` 导入 `WebSearchSource`。`WebSearchSource` 是搜索与抓取 Provider的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface WebSearchSource {
    readonly url: string;
    readonly title?: string;
    readonly snippet?: string;
    readonly publishedAt?: string;
}
```

成员检索：`publishedAt`、`snippet`、`title`、`url`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。
