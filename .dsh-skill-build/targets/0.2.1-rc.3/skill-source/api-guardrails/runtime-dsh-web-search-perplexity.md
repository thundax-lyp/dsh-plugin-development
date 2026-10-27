# @deepseek-ai/dsh-web-search-perplexity：搜索与抓取 Provider

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在搜索与抓取 Provider任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[搜索与抓取 Provider](api-runtime-web-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-web.md)。

## Config 契约

从 `@deepseek-ai/dsh-web-search-perplexity` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    apiKey?: string;
    baseURL?: string;
    model?: string;
    maxTokens?: number;
    searchRecency?: 'day' | 'week' | 'month' | 'year';
}

export declare const Config: z<Config>;
```

成员检索：`apiKey`、`baseURL`、`maxTokens`、`model`、`searchRecency`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## PERPLEXITY_DEFAULT_BASE_URL 契约

从 `@deepseek-ai/dsh-web-search-perplexity` 导入 `PERPLEXITY_DEFAULT_BASE_URL`。`PERPLEXITY_DEFAULT_BASE_URL` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const PERPLEXITY_DEFAULT_BASE_URL = "https://api.perplexity.ai";
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## PERPLEXITY_DEFAULT_MAX_TOKENS 契约

从 `@deepseek-ai/dsh-web-search-perplexity` 导入 `PERPLEXITY_DEFAULT_MAX_TOKENS`。`PERPLEXITY_DEFAULT_MAX_TOKENS` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const PERPLEXITY_DEFAULT_MAX_TOKENS = 1024;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## PERPLEXITY_DEFAULT_MODEL 契约

从 `@deepseek-ai/dsh-web-search-perplexity` 导入 `PERPLEXITY_DEFAULT_MODEL`。`PERPLEXITY_DEFAULT_MODEL` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const PERPLEXITY_DEFAULT_MODEL = "sonar";
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## PERPLEXITY_PROVIDER_ID 契约

从 `@deepseek-ai/dsh-web-search-perplexity` 导入 `PERPLEXITY_PROVIDER_ID`。`PERPLEXITY_PROVIDER_ID` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const PERPLEXITY_PROVIDER_ID = "perplexity";
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## PerplexityRecency 契约

从 `@deepseek-ai/dsh-web-search-perplexity` 导入 `PerplexityRecency`。`PerplexityRecency` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type PerplexityRecency = 'day' | 'week' | 'month' | 'year';
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## PerplexitySearchProvider 契约

从 `@deepseek-ai/dsh-web-search-perplexity` 导入 `PerplexitySearchProvider`。`PerplexitySearchProvider` 是搜索与抓取 Provider的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class PerplexitySearchProvider implements WebSearchProvider {
    readonly id = "perplexity";
    constructor(options: PerplexitySearchProviderOptions);
    available(): boolean;
    search(request: WebSearchRequest, signal?: AbortSignal): Promise<WebSearchResult>;
}
```

成员检索：`available`、`id`、`search`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## PerplexitySearchProviderOptions 契约

从 `@deepseek-ai/dsh-web-search-perplexity` 导入 `PerplexitySearchProviderOptions`。`PerplexitySearchProviderOptions` 是搜索与抓取 Provider的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface PerplexitySearchProviderOptions {
    apiKey: string;
    baseURL: string;
    model: string;
    maxTokens: number;
    searchRecency?: PerplexityRecency;
}
```

成员检索：`apiKey`、`baseURL`、`maxTokens`、`model`、`searchRecency`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## apply 契约

从 `@deepseek-ai/dsh-web-search-perplexity` 导入 `apply`。这是 Cordis 模块的 apply 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare function apply(ctx: Context, config: Config): void;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## inject 契约

从 `@deepseek-ai/dsh-web-search-perplexity` 导入 `inject`。这是 Cordis 模块的 inject 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const inject: string[];
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## name 契约

从 `@deepseek-ai/dsh-web-search-perplexity` 导入 `name`。这是 Cordis 模块的 name 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const name = "web-search-perplexity";
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。
