# @deepseek-ai/dsh-web-deepseek-api：搜索与抓取 Provider

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在搜索与抓取 Provider任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[搜索与抓取 Provider](api-runtime-web-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-web.md)。

## Config 契约

从 `@deepseek-ai/dsh-web-deepseek-api` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    apiKey: Volatile<string | undefined>;
    apiKeyEnv: Volatile<string>;
    baseURL: Volatile<string>;
    count: Volatile<number>;
    sendOriginalQuestion: Volatile<boolean>;
}

export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    apiKey: z<string, string, "volatile">;
    apiKeyEnv: z<string, string, "volatile-defined">;
    baseURL: z<string, string, "volatile-defined">;
    count: z<number, number, "volatile-defined">;
    sendOriginalQuestion: z<boolean, boolean, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    apiKey: z<string, string, "volatile">;
    apiKeyEnv: z<string, string, "volatile-defined">;
    baseURL: z<string, string, "volatile-defined">;
    count: z<number, number, "volatile-defined">;
    sendOriginalQuestion: z<boolean, boolean, "volatile-defined">;
}>>, "plain">;
```

成员检索：`apiKey`、`apiKeyEnv`、`baseURL`、`count`、`sendOriginalQuestion`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DEEPSEEK_DEFAULT_COUNT 契约

从 `@deepseek-ai/dsh-web-deepseek-api` 导入 `DEEPSEEK_DEFAULT_COUNT`。`DEEPSEEK_DEFAULT_COUNT` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEEPSEEK_DEFAULT_COUNT = 10;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DEEPSEEK_FETCH_API_PROVIDER_ID 契约

从 `@deepseek-ai/dsh-web-deepseek-api` 导入 `DEEPSEEK_FETCH_API_PROVIDER_ID`。`DEEPSEEK_FETCH_API_PROVIDER_ID` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEEPSEEK_FETCH_API_PROVIDER_ID = "deepseek-fetch-api";
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DEEPSEEK_SEARCH_API_PROVIDER_ID 契约

从 `@deepseek-ai/dsh-web-deepseek-api` 导入 `DEEPSEEK_SEARCH_API_PROVIDER_ID`。`DEEPSEEK_SEARCH_API_PROVIDER_ID` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEEPSEEK_SEARCH_API_PROVIDER_ID = "deepseek-search-api";
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DEEPSEEK_WEB_API_BASE_URL 契约

从 `@deepseek-ai/dsh-web-deepseek-api` 导入 `DEEPSEEK_WEB_API_BASE_URL`。`DEEPSEEK_WEB_API_BASE_URL` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEEPSEEK_WEB_API_BASE_URL = "https://api.deepseek.com/v1/tools";
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DeepSeekFetchApiOptions 契约

从 `@deepseek-ai/dsh-web-deepseek-api` 导入 `DeepSeekFetchApiOptions`。`DeepSeekFetchApiOptions` 是搜索与抓取 Provider的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface DeepSeekFetchApiOptions extends DeepSeekWebAuth {
    baseURL: string;
}
```

成员检索：`baseURL`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DeepSeekFetchApiProvider 契约

从 `@deepseek-ai/dsh-web-deepseek-api` 导入 `DeepSeekFetchApiProvider`。`DeepSeekFetchApiProvider` 是搜索与抓取 Provider的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class DeepSeekFetchApiProvider implements WebFetchProvider {
    readonly id = "deepseek-fetch-api";
    constructor(resolveOptions: () => DeepSeekFetchApiOptions);
    available(): boolean;
    fetch(request: WebFetchRequest, signal?: AbortSignal): Promise<WebFetchResult>;
}
```

成员检索：`available`、`fetch`、`id`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DeepSeekSearchApiOptions 契约

从 `@deepseek-ai/dsh-web-deepseek-api` 导入 `DeepSeekSearchApiOptions`。`DeepSeekSearchApiOptions` 是搜索与抓取 Provider的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface DeepSeekSearchApiOptions extends DeepSeekWebAuth {
    baseURL: string;
    count: number;
    originalQuestion?: () => string | undefined;
}
```

成员检索：`baseURL`、`count`、`originalQuestion`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DeepSeekSearchApiProvider 契约

从 `@deepseek-ai/dsh-web-deepseek-api` 导入 `DeepSeekSearchApiProvider`。`DeepSeekSearchApiProvider` 是搜索与抓取 Provider的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class DeepSeekSearchApiProvider implements WebSearchProvider {
    readonly id = "deepseek-search-api";
    constructor(resolveOptions: () => DeepSeekSearchApiOptions);
    available(): boolean;
    search(request: WebSearchRequest, signal?: AbortSignal): Promise<WebSearchResult>;
}
```

成员检索：`available`、`id`、`search`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## apply 契约

从 `@deepseek-ai/dsh-web-deepseek-api` 导入 `apply`。这是 Cordis 模块的 apply 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare function apply(ctx: Context, config: Config): void;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## inject 契约

从 `@deepseek-ai/dsh-web-deepseek-api` 导入 `inject`。这是 Cordis 模块的 inject 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const inject: string[];
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## mapSearchResponse 契约

从 `@deepseek-ai/dsh-web-deepseek-api` 导入 `mapSearchResponse`。`mapSearchResponse` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function mapSearchResponse(response: unknown): WebSearchResult;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## name 契约

从 `@deepseek-ai/dsh-web-deepseek-api` 导入 `name`。这是 Cordis 模块的 name 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const name = "web-deepseek-api";
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。
