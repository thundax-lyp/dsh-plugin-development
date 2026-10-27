# 本地脚本化 Web Provider

Host 侧，适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。采用[独立 Service 包](example-core-service.md)的文件清单，包名改为 `local-search`，增加 peer/dev 依赖 `@deepseek-ai/dsh-web@0.2.1-rc.3`，入口完整替换如下。本例只返回固定本地数据，不发网络请求。

## src/index.ts

```ts
import type { Context } from '@deepseek-ai/cordis'
import type { WebSearchProvider } from '@deepseek-ai/dsh-web'

export const name = 'local-search'
export const inject = ['web']

export async function apply(ctx: Context) {
  const provider: WebSearchProvider = {
    id: 'local-search',
    available: () => true,
    async search(request, signal) {
      signal?.throwIfAborted()
      return {
        sources: [
          { url: 'https://example.invalid/one', title: request.query },
          { url: 'https://example.invalid/two', title: '第二条本地数据' },
        ],
        truncated: false,
      }
    },
  }
  ctx.web.registerSearchProvider(provider)
  const result = await ctx.web.search({ query: '本地测试', maxResults: 1 })
  if (result.sources.length !== 1 || !result.truncated) {
    throw new Error('结果上限未生效')
  }
  ctx.logger.info('本地搜索结果：%s', result.sources[0]?.title)
}
```

注册随调用 fiber 绑定，卸载会撤销 provider。真实 provider 若创建连接或后台操作，须在自己的 effect 中停止并等待它们；注册表的 disposer 不替它关闭外部资源。available 只做廉价本地检查，真正请求在 search 内透传 signal。

## 装载、调用与卸载

新自定义 Profile 的 base 已提供 `id: web`。本例将包的 `cordis.patch.yml` 完整写为下面两项：覆盖既有选择配置并保留 `fetchProvider: http`，只 insert 自己的 provider，不重复插入 WebRuntime。

```yaml
- id: web
  config:
    searchProvider: local-search
    fetchProvider: http
- insert:
    - id: local-search
      name: local-search
```

手工创建的独立空组合须先自行提供 WebRuntime，不能把上述对既有 id 的覆盖当插入。构建并执行 `dsh plugin --profile development add .`。本例在同一个插件 owner 内，先同步完成 provider 注册，再执行一次本地校验调用；Loader 并发加载条目，不能用 YAML 列表先后保证另一个消费插件初始化时 provider 已注册。外部消费插件应在实际调用时处理 provider 缺失，若初始化必须调用，提供方须在注册完成后发布专用的 readiness 服务并由消费方注入。

卸载 provider 后同一固定选择应报 `WEB_PROVIDER_CONFIGURED_MISSING`；不配置 id 且同时有两个可用 provider 应报 `WEB_PROVIDER_AMBIGUOUS`。预先取消 signal 不应启动真实工作。真实搜索结果通过工具自己的规范 JSON 结果和纯渲染进入模型，本 provider 不自行追加另一份文本结果。

[WebRuntime](../api/api-runtime-dsh-web.md#webruntime-契约)拥有选择规则与上限语义。
