# 增加 Web 搜索与抓取 provider

## 目标与前置

在 `dsh-v0.2.0-rc.1` 中给一个固定文档语料提供搜索和抓取，让现有 `web_search`、`web_fetch` 模型工具通过 `ctx.web` 访问它。示例用两条本地静态文档，没有外网请求和凭证；这样可以实际验证 service、provider、tool 的装配与卸载。接入真实网络后端时，需保持同样的结果类型，并在 provider 内实现授权、出站限制、超时、响应限制和取消。公开成员、选择规则与错误边界见 [Web search and fetch providers](api-web-provider.md)。

目标 Web Profile 的 Base bundle 已有 `web` service 和 `tool-web`，Web app 会在 agent preset 中装载工具。Base 已配置 DeepSeek 搜索与 HTTP 抓取的 provider ID，故下面的 patch 同时把两项选择改为 `example-corpus`；仅插入新 provider 行会得到 `WEB_PROVIDER_CONFIGURED_MISSING` 或继续使用旧 provider。

## 建立包

新建 `dsh-example-corpus-web/`，写入以下五个文件。`package.json`：

```json
{
  "name": "dsh-example-corpus-web",
  "version": "0.0.1",
  "type": "module",
  "exports": { ".": "./lib/index.js" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
    "@deepseek-ai/dsh-web": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-llm": "0.2.0-rc.1",
    "@deepseek-ai/dsh-web": "0.2.0-rc.1",
    "@deepseek-ai/dsh-tools": "0.2.0-rc.1",
    "@deepseek-ai/dsh-tool-web": "0.2.0-rc.1",
    "@deepseek-ai/dsh-system-prompt": "0.2.0-rc.1",
    "typescript": "6.0.3"
  },
  "scripts": { "build": "tsc -p tsconfig.json" },
  "files": ["lib/index.js", "cordis.patch.yml"]
}
```

`tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "skipLibCheck": true,
    "outDir": "lib",
    "rootDir": "src"
  },
  "include": ["src/**/*.ts"]
}
```

`cordis.patch.yml`：

```yaml
- id: web
  config:
    searchProvider: example-corpus
    fetchProvider: example-corpus
- insert:
    - id: example-corpus-web
      name: dsh-example-corpus-web
```

`src/index.ts`：

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

在包根另存 `smoke.mjs`，用真实工具 registry 调用两个模型工具，无需模型凭证：

```js
import assert from 'node:assert/strict'
import { Context } from '@deepseek-ai/cordis'
import { ToolCallId } from '@deepseek-ai/dsh-llm'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import ToolRuntime from '@deepseek-ai/dsh-tools'
import WebRuntime from '@deepseek-ai/dsh-web'
import * as ToolWeb from '@deepseek-ai/dsh-tool-web'
import * as ExampleCorpus from './lib/index.js'

const ctx = new Context()
await ctx.plugin(SystemPrompt)
await ctx.plugin(ToolRuntime)
await ctx.plugin(WebRuntime, { searchProvider: 'example-corpus', fetchProvider: 'example-corpus' })
const providerFiber = await ctx.plugin(ExampleCorpus)
await ctx.plugin(ToolWeb, { search: true, fetch: true })

const search = await ctx.tools.execute({
  signal: new AbortController().signal,
  callId: ToolCallId('example-search'),
  name: 'web_search',
  arguments: { queries: ['install'] },
})
assert.equal(search.isError, false)
assert.match(search.content.map(block => block.type === 'text' ? block.text : '').join(''), /Install/)

const fetch = await ctx.tools.execute({
  signal: new AbortController().signal,
  callId: ToolCallId('example-fetch'),
  name: 'web_fetch',
  arguments: { url: 'https://docs.example.test/install' },
})
assert.equal(fetch.isError, false)
assert.match(fetch.content.map(block => block.type === 'text' ? block.text : '').join(''), /Install the example corpus/)

const direct = await ctx.web.search({ query: 'docs.example.test', maxResults: 1 })
assert.equal(direct.sources.length, 1)
assert.equal(direct.truncated, true)
await assert.rejects(ctx.web.search({ query: 'install' }, AbortSignal.abort(new Error('cancelled'))), /cancelled/)
await assert.rejects(ctx.web.fetch({ url: 'https://outside.example.test/' }), { code: 'WEB_NOT_IN_CORPUS' })

await providerFiber.dispose()
await assert.rejects(ctx.web.search({ query: 'install' }), { code: 'WEB_PROVIDER_CONFIGURED_MISSING' })
const removedTool = await ctx.tools.execute({
  signal: new AbortController().signal,
  callId: ToolCallId('example-removed'),
  name: 'web_search',
  arguments: { queries: ['install'] },
})
assert.equal(removedTool.isError, true)
assert.equal(removedTool.error?.info?.code, 'WEB_PROVIDER_CONFIGURED_MISSING')
```

`smoke.mjs` 是开发验证文件，不在发布包 `files` 内。直接 `ctx.web.search` 的截断断言验证 service 防止 provider 过量返回；`ctx.tools.execute` 验证 tool 的规范结果、格式化和卸载后结构化错误。工具仍注册时卸载 provider，下一次执行才报错，符合运行时选择规则。

## 编译、验证和装入 Profile

在包目录运行：

```sh
npm install
npm run build
node smoke.mjs
npm pack --dry-run
```

dry-run 应只发布 `lib/index.js`、`cordis.patch.yml` 和 manifest。切到包的父目录，用独立 `DSH_HOME` 安装到基于 `web` 的 Profile：

```sh
export DSH_HOME="$PWD/web-corpus-home"
dsh --profile web-corpus-smoke --from-default-profile web --dump-config
dsh plugin --profile web-corpus-smoke add "$PWD/dsh-example-corpus-web"
dsh --profile web-corpus-smoke --dump-config
dsh --profile web-corpus-smoke --no-open
```

第二次 dump 的 `web` 行应是 `searchProvider: example-corpus` 和 `fetchProvider: example-corpus`，并出现 `example-corpus-web` Loader 行。Web app 根部 `tool-web` 行仍可能显示 `disabled: true`；目标 agent preset 内另有启用的 `tool-web` 行。服务启动说明 Profile 可启动；要确认模型会话里的工具可见与实际调用，仍需在该 Profile 创建 Session 并查看对应 `tool/call`、`tool/result`。本例的静态内容仅用于装配验证，不应作为真实网络搜索结果呈现给最终用户。

需要卸载时运行 `dsh plugin --profile web-corpus-smoke remove dsh-example-corpus-web`，确认 config dump 中 provider 行与选择覆盖都消失。Cordis fiber 撤销注册；若工具仍启用，下次调用因 Base 恢复原有选择而路由回原 provider。独立 `smoke.mjs` 则把 service 明确固定在 `example-corpus`，因此卸载后得到 configured-missing 错误。两种配置下的卸载结果不同，不应混写。

## 失败与边界

重复 ID、指定 ID 缺失、不可用或未指定时多个 provider 可用都会明确失败，不能借注册顺序兜底。非 2xx fetch 响应仍应返回带状态码的结果；无法安全获取或表示内容时抛 `WebError`。实际网络 provider 应将 `signal` 传到请求、在取消时释放连接，并限制目标、重定向和响应大小。外部页面内容不能当作指令；工具输出会保留来源信息供 Session 重放和引用。

本例的独立 `npm install`、TS 编译、工具调用、卸载检查、pack dry-run 和隔离 Profile 配置/启动均已执行。未验证浏览器中的模型会话、真实网络后端、超时策略、凭证轮换、Profile 在线 HMR 或冷重启后的工具调用。
