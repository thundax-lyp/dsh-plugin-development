# 搜索与抓取 Provider

## 对象关系

WebRuntime 分开注册 search/fetch provider，重复 id 拒绝。每次执行读取选择配置；指定 provider 必须已注册且 available；未指定时恰好一个可用 provider 才自动选择，多于一个报歧义，绝不按注册顺序选。search 对 maxResults 做结果上限，超出设置 truncated；fetch 的非 2xx 是描述性结果而不是必然 throw。register 返回 disposer 且随调用 fiber 清理。自定义 provider 要透传 signal；本地测试用脚本化 provider，不发外部请求。

## 选型与使用

WEB_DUPLICATE_PROVIDER、WEB_PROVIDER_CONFIGURED_MISSING、WEB_PROVIDER_CONFIGURED_UNAVAILABLE、WEB_PROVIDER_AMBIGUOUS、WEB_PROVIDER_UNAVAILABLE 均为不同组合错误；修复配置后再请求，不隐式换服务。

- [@deepseek-ai/dsh-tool-web.](api-runtime-dsh-tool-web.md)：模块和公开对象。
- [@deepseek-ai/dsh-web-deepseek-api.](api-runtime-dsh-web-deepseek-api.md)：模块和公开对象。
- [@deepseek-ai/dsh-web-fetch-http.](api-runtime-dsh-web-fetch-http.md)：模块和公开对象。
- [@deepseek-ai/dsh-web-search-deepseek.](api-runtime-dsh-web-search-deepseek.md)：模块和公开对象。
- [@deepseek-ai/dsh-web-search-exa.](api-runtime-dsh-web-search-exa.md)：模块和公开对象。
- [@deepseek-ai/dsh-web-search-perplexity.](api-runtime-dsh-web-search-perplexity.md)：模块和公开对象。
- [@deepseek-ai/dsh-web.](api-runtime-dsh-web.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-web.md)说明配置、调用和清理顺序。
