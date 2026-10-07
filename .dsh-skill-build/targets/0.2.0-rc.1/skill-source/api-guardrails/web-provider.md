# Web search and fetch providers

## 适用范围与入口

本页锁定 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-web` 在 Host Cordis 树安装 `ctx.web`，允许插件分别注册搜索与抓取 provider；`@deepseek-ai/dsh-tool-web` 把这两个能力暴露成模型可调用的 `web_search`、`web_fetch`。provider、service 和 tool 分属不同注册面。完整独立包、Profile patch 与工具调用路径见 [增加 Web provider](how-to-add-web-provider.md)。

已发布的 Base bundle 使用 `web` service、DeepSeek 搜索 provider、匿名 HTTP 抓取 provider 与 `tool-web`；Web app 在 Host 根行禁用 `tool-web`，再在 agent preset 中装载它。因此外部 provider 若要替换某项能力，除了注册自己的 ID，还要把 `web` 的 `searchProvider` 或 `fetchProvider` 配到自己的 ID。`DSH_WEB_SEARCH_PROVIDER` / `DSH_WEB_FETCH_PROVIDER` 是在未给对应 config 字段时采用的同一选择输入，不是另一个隐式优先级链。

## 最小 provider 示例

这个插件为固定的示例文档语料同时提供搜索和抓取。两项结果都由同一静态数据表生成，没有网络、凭证、后台任务或新的 Session 事实；真实服务端接入须另行处理鉴权、出站策略、限流、超时和 `AbortSignal`。

```ts
import type { Context } from '@deepseek-ai/cordis'
import { WebError, type WebFetchProvider, type WebSearchProvider } from '@deepseek-ai/dsh-web'

const pages = new Map([
  ['https://docs.example.test/install', 'Install the example corpus.'],
  ['https://docs.example.test/upgrade', 'Upgrade the example corpus.'],
])

const search: WebSearchProvider = {
  id: 'example-corpus',
  available: () => true,
  async search(request, signal) {
    signal?.throwIfAborted()
    const sources = [...pages.keys()].filter(url => url.includes(request.query.toLowerCase()))
      .map(url => ({ url, title: url.endsWith('install') ? 'Install' : 'Upgrade' }))
    return { sources, truncated: false }
  },
}

const fetch: WebFetchProvider = {
  id: 'example-corpus',
  available: () => true,
  async fetch(request, signal) {
    signal?.throwIfAborted()
    const content = pages.get(request.url)
    if (content === undefined) throw new WebError('URL is outside the example corpus', 'WEB_NOT_IN_CORPUS')
    return { url: request.url, statusCode: 200, body: { kind: 'text', content }, truncated: false }
  },
}

export const inject = ['web']

export function apply(ctx: Context): void {
  ctx.web.registerSearchProvider(search)
  ctx.web.registerFetchProvider(fetch)
}
```

同一字符串 ID 可分别用于 search 和 fetch，因为它们是两个独立 registry。`ctx.web.register*Provider` 将贡献归调用者 fiber 的 effect 所有，卸载时撤销；也返回可提前调用的幂等 disposer。两个 `available()` 都必须是廉价的本地判断，不做网络调用。示例仅在每次调用开始时检查 signal；真实长请求必须把 signal 继续传到网络操作，并在 abort 时停止工作。

## 公开类型与成员

| 对象/成员                                                     | 公开契约                                                                                                                                 | 运行语义                                                                                                                                                                                                  |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WebRuntimeConfig`                                            | `searchProvider?: string`, `fetchProvider?: string`                                                                                      | 每项能力独立选择 provider。指定的 ID 缺失或不可用即报错；未指定时仅在恰好一个可用 provider 时自动选择。                                                                                                   |
| 默认 `WebRuntime`                                             | 具名 Service 的别名，提供 `registerSearchProvider`、`registerFetchProvider`、`search`、`fetch`。                                         | 每个注册的 disposer 归贡献 fiber。                                                                                                                                                                        |
| `WebSearchRequest` / `WebSearchResult`                        | 请求 `query` 必需、`maxResults?` 可选；结果 `sources`、`truncated` 必需，`content?` 可选。                                               | service 只在返回时施加来源数上限；provider 可提前用上限减少外部费用。                                                                                                                                     |
| `WebFetchRequest` / `WebFetchResult`                          | 请求仅有 `url`；结果有最终 `url`、`statusCode`、`body`、`truncated`。                                                                    | 非 2xx 也是资源状态；`body` 只有 html/text 两种规范分支。                                                                                                                                                 |
| `WebRuntime.registerSearchProvider` / `registerFetchProvider` | 接受对应 provider，返回 `() => void`                                                                                                     | 同一能力内重复 ID 抛 `WEB_DUPLICATE_PROVIDER`；search/fetch 命名空间独立。                                                                                                                                |
| `WebSearchProvider`                                           | `id`, `available()`, `search(request, signal?)`                                                                                          | 请求有 `query`、可选 `maxResults`；结果有可选 `content`、`sources[]`、`truncated`。service 对过量 `sources` 再截断并设置 `truncated`。                                                                    |
| `WebSearchSource`                                             | `url` 必填；`title?`, `snippet?`, `publishedAt?` 可选                                                                                    | provider 不应编造缺失的标题或日期；tool 层会为缺标题 URL 用 hostname 作显示标签。                                                                                                                         |
| `WebFetchProvider`                                            | `id`, `available()`, `fetch({url}, signal?)`                                                                                             | 结果有最终 `url`、`statusCode`、`body`、`truncated`；非 2xx 响应是结果。`WebFetchBody` 只允许 `{kind:'html'                                                                                               | 'text',content}` 两种分支，不是可扩展接口。 |
| `ctx.web.search` / `ctx.web.fetch`                            | 选择 provider、转发 signal，返回标准结果                                                                                                 | search 在返回前执行 `maxResults` 上界；fetch 只转发。选择在每次执行时发生，不依赖注册顺序。                                                                                                               |
| `WebError`                                                    | 继承 `HarnessError`，持有开放字符串 `code` 和 `cause`                                                                                    | provider 可用自己的代码；调用者必须容忍未知 code。service 共用 `WEB_PROVIDER_UNAVAILABLE`、`WEB_PROVIDER_AMBIGUOUS`、`WEB_PROVIDER_CONFIGURED_MISSING`、`WEB_PROVIDER_CONFIGURED_UNAVAILABLE` 和重复 ID。 |
| `@deepseek-ai/dsh-tool-web`                                   | `Config` 的 `search?`, `fetch?`, `searchMaxResults?`, `searchMaxQueries?`, `searchTimeoutMs?`, `fetchTimeoutMs?`, `fetchMaxOutputChars?` | 启用项注册模型工具；默认结果数 8、查询数 4、两个工具预算各 30000 ms、抓取输出上界 200000 字符。数值配置需为正整数。                                                                                       |

`web_search` 的模型参数是 `{queries: string[]}`，会验证非空和查询数量、对完全重复字符串去重、按查询并行调用 `ctx.web.search`，合并去重 URL 后限制返回数。`web_fetch` 的模型参数是 `{url: string}`。两个工具用 `defineTool` 的单份规范 JSON 输出；`render` 从该值生成模型文本，`presentationMeta` 将卡片所需的结构化摘要写入 tool result，重放时 `presentResult` 从 meta 纯读取。模型不会控制工具超时字段；工具预算是部署配置，由 tool-call timeout policy 执行。启用工具而 provider 暂不可用时，工具仍可见，在执行时返回结构化错误。

## 失败、权限、清理与验证边界

provider 不是通用网络放行凭证。示例按固定 URL 表限制抓取；面向任意外部 URL 的实现必须在 provider 内保证 URL、重定向、目标地址和响应体边界。目标仓库的 `web-fetch-http` 实现是公开 HTTP(S) 抓取的安全参考；其他 provider 的授权和凭证仍归其拥有者。搜索结果和抓取内容是外部不可信数据，不能当模型指令；`tool-web` 在输出中附带此提示，调用方仍须保留来源 URL。

精确 rc.1 发布声明上的隔离 Host TypeScript 编译已通过。独立 Cordis 运行时通过真实 `ctx.tools.execute` 验证 `web_search`、`web_fetch`、service 截断、provider fiber 卸载，以及卸载后工具的结构化缺失错误。隔离 Web Profile 安装与 config dump 显示 provider ID 已覆盖 Base 选择，Web 服务在本地端口启动；本次没有在浏览器或模型会话中触发这两个工具，也没有验证真实网络后端、凭证或超时策略。
