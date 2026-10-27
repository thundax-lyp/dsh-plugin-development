# @deepseek-ai/dsh-web-search-deepseek：搜索与抓取 Provider

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在搜索与抓取 Provider任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[搜索与抓取 Provider](api-runtime-web-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-web.md)。

## Config 契约

从 `@deepseek-ai/dsh-web-search-deepseek` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    apiKey: Volatile<string | undefined>;
    apiKeyEnv: Volatile<string>;
    baseURL: Volatile<string | undefined>;
    model: Volatile<string>;
    apiVersion: Volatile<string>;
    maxTokens: Volatile<number>;
    maxUses: Volatile<number>;
}

export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    apiKey: z<string, string, "volatile">;
    apiKeyEnv: z<string, string, "volatile-defined">;
    baseURL: z<string, string, "volatile">;
    model: z<string, string, "volatile-defined">;
    apiVersion: z<string, string, "volatile-defined">;
    maxTokens: z<number, number, "volatile-defined">;
    maxUses: z<number, number, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    apiKey: z<string, string, "volatile">;
    apiKeyEnv: z<string, string, "volatile-defined">;
    baseURL: z<string, string, "volatile">;
    model: z<string, string, "volatile-defined">;
    apiVersion: z<string, string, "volatile-defined">;
    maxTokens: z<number, number, "volatile-defined">;
    maxUses: z<number, number, "volatile-defined">;
}>>, "plain">;
```

成员检索：`apiKey`、`apiKeyEnv`、`apiVersion`、`baseURL`、`maxTokens`、`maxUses`、`model`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DEEPSEEK_DEFAULT_API_VERSION 契约

从 `@deepseek-ai/dsh-web-search-deepseek` 导入 `DEEPSEEK_DEFAULT_API_VERSION`。`DEEPSEEK_DEFAULT_API_VERSION` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEEPSEEK_DEFAULT_API_VERSION = "2023-06-01";
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DEEPSEEK_DEFAULT_BASE_URL 契约

从 `@deepseek-ai/dsh-web-search-deepseek` 导入 `DEEPSEEK_DEFAULT_BASE_URL`。`DEEPSEEK_DEFAULT_BASE_URL` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEEPSEEK_DEFAULT_BASE_URL = "https://api.deepseek.com/anthropic/v1";
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DEEPSEEK_DEFAULT_MAX_TOKENS 契约

从 `@deepseek-ai/dsh-web-search-deepseek` 导入 `DEEPSEEK_DEFAULT_MAX_TOKENS`。`DEEPSEEK_DEFAULT_MAX_TOKENS` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEEPSEEK_DEFAULT_MAX_TOKENS = 4096;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DEEPSEEK_DEFAULT_MAX_USES 契约

从 `@deepseek-ai/dsh-web-search-deepseek` 导入 `DEEPSEEK_DEFAULT_MAX_USES`。`DEEPSEEK_DEFAULT_MAX_USES` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEEPSEEK_DEFAULT_MAX_USES = 5;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DEEPSEEK_DEFAULT_MODEL 契约

从 `@deepseek-ai/dsh-web-search-deepseek` 导入 `DEEPSEEK_DEFAULT_MODEL`。`DEEPSEEK_DEFAULT_MODEL` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEEPSEEK_DEFAULT_MODEL = "deepseek-v4-flash";
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DEEPSEEK_PROVIDER_ID 契约

从 `@deepseek-ai/dsh-web-search-deepseek` 导入 `DEEPSEEK_PROVIDER_ID`。`DEEPSEEK_PROVIDER_ID` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEEPSEEK_PROVIDER_ID = "deepseek-official";
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DeepSeekSearchLlmRequest 契约

从 `@deepseek-ai/dsh-web-search-deepseek` 导入 `DeepSeekSearchLlmRequest`。`DeepSeekSearchLlmRequest` 是搜索与抓取 Provider的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface DeepSeekSearchLlmRequest {
    readonly endpoint: string;
    readonly apiVersion: string;
    readonly body: {
        readonly model: string;
        readonly max_tokens: number;
        readonly messages: readonly [
            {
                readonly role: 'user';
                readonly content: readonly [
                    {
                        readonly type: 'text';
                        readonly text: string;
                    }
                ];
            }
        ];
        readonly tools: readonly [
            {
                readonly type: 'web_search_20250305';
                readonly name: 'web_search';
                readonly max_uses: number;
            }
        ];
        readonly thinking?: {
            readonly type: 'disabled';
        };
    };
}
```

成员检索：`apiVersion`、`body`、`endpoint`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DeepSeekSearchProvider 契约

从 `@deepseek-ai/dsh-web-search-deepseek` 导入 `DeepSeekSearchProvider`。`DeepSeekSearchProvider` 是搜索与抓取 Provider的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class DeepSeekSearchProvider implements WebSearchProvider {
    readonly id = "deepseek-official";
    constructor(resolveOptions: () => DeepSeekSearchProviderOptions);
    available(): boolean;
    search(request: WebSearchRequest, signal?: AbortSignal): Promise<WebSearchResult>;
}
```

成员检索：`available`、`id`、`search`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DeepSeekSearchProviderOptions 契约

从 `@deepseek-ai/dsh-web-search-deepseek` 导入 `DeepSeekSearchProviderOptions`。`DeepSeekSearchProviderOptions` 是搜索与抓取 Provider的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface DeepSeekSearchProviderOptions {
    resolveAccountToken?: (endpoint: string) => Promise<string | undefined>;
    apiKey?: string;
    resolveApiKey?: () => Promise<string | undefined>;
    apiKeyEnv?: CredentialRef;
    baseURL: string;
    model: string;
    apiVersion: string;
    maxTokens: number;
    maxUses: number;
    recordRequest?: (request: DeepSeekSearchLlmRequest) => void;
}
```

成员检索：`apiKey`、`apiKeyEnv`、`apiVersion`、`baseURL`、`maxTokens`、`maxUses`、`model`、`recordRequest`、`resolveAccountToken`、`resolveApiKey`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## WEB_SEARCH_DEEPSEEK_SETTINGS_NAMESPACE 契约

从 `@deepseek-ai/dsh-web-search-deepseek` 导入 `WEB_SEARCH_DEEPSEEK_SETTINGS_NAMESPACE`。`WEB_SEARCH_DEEPSEEK_SETTINGS_NAMESPACE` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const WEB_SEARCH_DEEPSEEK_SETTINGS_NAMESPACE = "web-search-deepseek";
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## apply 契约

从 `@deepseek-ai/dsh-web-search-deepseek` 导入 `apply`。这是 Cordis 模块的 apply 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare function apply(ctx: Context, config: Config): void;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## inject 契约

从 `@deepseek-ai/dsh-web-search-deepseek` 导入 `inject`。这是 Cordis 模块的 inject 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const inject: string[];
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## name 契约

从 `@deepseek-ai/dsh-web-search-deepseek` 导入 `name`。这是 Cordis 模块的 name 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const name = "web-search-deepseek";
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。
