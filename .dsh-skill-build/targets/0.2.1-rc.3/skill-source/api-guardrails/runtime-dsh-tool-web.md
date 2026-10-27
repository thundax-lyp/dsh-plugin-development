# @deepseek-ai/dsh-tool-web：搜索与抓取 Provider

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在搜索与抓取 Provider任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[搜索与抓取 Provider](api-runtime-web-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-web.md)。

## Config 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    search?: boolean;
    fetch?: boolean;
    searchMaxResults?: number;
    searchMaxQueries?: number;
    fetchTimeoutMs?: number;
    searchTimeoutMs?: number;
    fetchMaxOutputChars?: number;
}

export declare const Config: z<Config>;
```

成员检索：`fetch`、`fetchMaxOutputChars`、`fetchTimeoutMs`、`search`、`searchMaxQueries`、`searchMaxResults`、`searchTimeoutMs`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DEFAULT_FETCH_MAX_OUTPUT_CHARS 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `DEFAULT_FETCH_MAX_OUTPUT_CHARS`。`DEFAULT_FETCH_MAX_OUTPUT_CHARS` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_FETCH_MAX_OUTPUT_CHARS = 200000;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## DEFAULT_WEB_TOOL_TIMEOUT_MS 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `DEFAULT_WEB_TOOL_TIMEOUT_MS`。`DEFAULT_WEB_TOOL_TIMEOUT_MS` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_WEB_TOOL_TIMEOUT_MS = 30000;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## WEB_SEARCH_MAX_QUERIES 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `WEB_SEARCH_MAX_QUERIES`。`WEB_SEARCH_MAX_QUERIES` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const WEB_SEARCH_MAX_QUERIES = 4;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## WEB_SEARCH_MAX_RESULTS 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `WEB_SEARCH_MAX_RESULTS`。`WEB_SEARCH_MAX_RESULTS` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const WEB_SEARCH_MAX_RESULTS = 8;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## WebFetchMeta 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `WebFetchMeta`。`WebFetchMeta` 是搜索与抓取 Provider的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface WebFetchMeta {
    url: string;
    statusCode: number;
    truncated: boolean;
}
```

成员检索：`statusCode`、`truncated`、`url`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## WebSearchMeta 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `WebSearchMeta`。`WebSearchMeta` 是搜索与抓取 Provider的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface WebSearchMeta {
    sources: WebSource[];
    truncated: boolean;
    answer?: string;
}
```

成员检索：`answer`、`sources`、`truncated`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## apply 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `apply`。这是 Cordis 模块的 apply 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare function apply(ctx: Context, config: Config): void;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## applyWebFetchTool 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `applyWebFetchTool`。`applyWebFetchTool` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function applyWebFetchTool(ctx: Context, timeoutMs: number, maxOutputChars: number): void;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## applyWebSearchTool 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `applyWebSearchTool`。`applyWebSearchTool` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function applyWebSearchTool(ctx: Context, maxResults: number, maxQueries: number, timeoutMs: number, fetchEnabled: boolean): void;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## fetchMetaFromResult 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `fetchMetaFromResult`。`fetchMetaFromResult` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function fetchMetaFromResult(meta: unknown): WebFetchMeta | undefined;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## fetchMetaFromValue 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `fetchMetaFromValue`。`fetchMetaFromValue` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function fetchMetaFromValue(value: WebFetchResult, maxOutputChars: number): JsonValue;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## formatFetchOutput 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `formatFetchOutput`。`formatFetchOutput` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function formatFetchOutput(result: WebFetchResult, maxOutputChars: number): string;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## formatSearchOutput 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `formatSearchOutput`。`formatSearchOutput` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function formatSearchOutput(result: WebSearchResult): string;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## inject 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `inject`。这是 Cordis 模块的 inject 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const inject: string[];
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## name 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `name`。这是 Cordis 模块的 name 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const name = "tool-web";
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## parseFetchArgs 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `parseFetchArgs`。`parseFetchArgs` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function parseFetchArgs(args: {
    url: string;
}): {
    url: string;
};
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## presentFetchCall 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `presentFetchCall`。`presentFetchCall` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function presentFetchCall(args: {
    url: string;
}): GenericCallView;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## presentFetchResult 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `presentFetchResult`。`presentFetchResult` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function presentFetchResult(args: {
    url: string;
}, result: ToolResult): WebFetchResultView | undefined;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## presentSearchCall 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `presentSearchCall`。`presentSearchCall` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function presentSearchCall(args: WebSearchArgs): GenericCallView;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## presentSearchResult 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `presentSearchResult`。`presentSearchResult` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function presentSearchResult(args: WebSearchArgs, result: ToolResult): WebSearchResultView | undefined;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## searchMetaFromResult 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `searchMetaFromResult`。`searchMetaFromResult` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function searchMetaFromResult(meta: unknown): WebSearchMeta | undefined;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。

## searchMetaFromValue 契约

从 `@deepseek-ai/dsh-tool-web` 导入 `searchMetaFromValue`。`searchMetaFromValue` 是搜索与抓取 Provider的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function searchMetaFromValue(value: WebSearchResult): JsonValue;
```

本对象的注册/资源责任由[搜索与抓取 Provider](api-runtime-web-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-web.md)核对成功、拒绝与卸载结果。
