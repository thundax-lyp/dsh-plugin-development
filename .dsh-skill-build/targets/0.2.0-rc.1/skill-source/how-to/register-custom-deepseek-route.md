# 注册自有 DeepSeek Messages route

相关公开契约：[API 参考](api-llm-providers.md)。

## 目标与版本

目标精确版本 `dsh-v0.2.0-rc.1`。本例在 Host Profile 中注册名为 `example-messages` 的自有 route，复用 `@deepseek-ai/dsh-llm-deepseek` 的公开 `registerDeepSeekProvider`、配置解析和模型目录 helper。它使用已有 `ctx.credentials` 在**每次请求**解析引用；不把 API key 存在 Config、Session、目录或日志中。若只想使用官方固定 `deepseek-official` route，请按[内置路由](api-llm-builtins-retry-meter.md)配置，无需再注册第二个 route。

源码依据：目标 `packages/llm/llm-deepseek/src/{index,host,adapter,config,types}.ts`、`packages/llm/llm-deepseek-api-key/src/index.ts`。`registerDeepSeekProvider` 要求 `ctx.llm`、`options()`、`resolveAuth(connection)`，可选目录和显示名；helper 装配附件、FS、请求扩展、匿名用户 id，并为 route 注册持有句柄。`options()` 每次读取当前 Volatile，先用 `resolveAdapterOptions` 校验，再作为一次请求的连接快照。这里不添加自定义网络传输。

## 最小包

在一个新目录创建这些文件。`package.json` 中的版本来自本次隔离 npm consumer；列出的额外 devDependencies 是发布包运行时的 peer 依赖，使本地 smoke 可在纯 npm 目录加载。

`package.json`：

```json
{
  "name": "dsh-deepseek-route-consumer-rc1",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": [
    "lib",
    "cordis.patch.yml"
  ],
  "scripts": {
    "build": "tsc -p tsconfig.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-credentials": "0.2.0-rc.1",
    "@deepseek-ai/dsh-llm": "0.2.0-rc.1",
    "@deepseek-ai/dsh-llm-deepseek": "0.2.0-rc.1",
    "@deepseek-ai/schemastery": "3.18.4"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/cordis-plugin-loader": "1.0.5",
    "@deepseek-ai/dsh-anonymous-user-id": "0.2.0-rc.1",
    "@deepseek-ai/dsh-atomic-write": "0.2.0-rc.1",
    "@deepseek-ai/dsh-attachment": "0.2.0-rc.1",
    "@deepseek-ai/dsh-credentials": "0.2.0-rc.1",
    "@deepseek-ai/dsh-deepseek-llm-api-extensions": "0.2.0-rc.1",
    "@deepseek-ai/dsh-fs": "0.2.0-rc.1",
    "@deepseek-ai/dsh-home-paths": "0.2.0-rc.1",
    "@deepseek-ai/dsh-launch-environment": "0.2.0-rc.1",
    "@deepseek-ai/dsh-llm": "0.2.0-rc.1",
    "@deepseek-ai/dsh-llm-deepseek": "0.2.0-rc.1",
    "@deepseek-ai/dsh-timeout": "0.2.0-rc.1",
    "@deepseek-ai/schemastery": "3.18.4",
    "typescript": "6.0.3"
  }
}
```

`tsconfig.json`：

```json
{"compilerOptions":{"target":"ES2022","module":"NodeNext","moduleResolution":"NodeNext","rootDir":"src","outDir":"lib","declaration":true,"strict":true,"skipLibCheck":true},"include":["src/**/*.ts"]}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: example-messages
      name: dsh-deepseek-route-consumer-rc1
      config:
        apiKeyEnv: EXAMPLE_MESSAGES_API_KEY
```

`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import { LlmError, assertUsableApiKey } from '@deepseek-ai/dsh-llm'
import {
  deepSeekConfigFields, plainOptions, registerDeepSeekProvider,
  resolveAdapterOptions, catalogModelInfo,
  type Config as ProtocolConfig,
} from '@deepseek-ai/dsh-llm-deepseek'
import { credentialRef } from '@deepseek-ai/dsh-credentials'
import z from '@deepseek-ai/schemastery'

export interface Config extends ProtocolConfig {
  apiKeyEnv: string
}
export const Config = z.object({
  ...deepSeekConfigFields,
  apiKeyEnv: z.string().default('EXAMPLE_MESSAGES_API_KEY'),
})
export const name = 'example-deepseek-messages-route'
export const inject = ['llm']
const PROVIDER = 'example-messages'

export function apply(ctx: Context, config: Config): void {
  const options = () => resolveAdapterOptions(plainOptions(config))
  options() // Reject invalid deployment config before making the route visible.
  const keyRef = credentialRef(config.apiKeyEnv)
  registerDeepSeekProvider(ctx, PROVIDER, {
    options,
    providerName: 'Example Messages',
    resolveAuth: async () => {
      const hit = await ctx.get('credentials')?.resolve(keyRef)
      if (hit === undefined) throw new LlmError('Messages credential is missing', 'MISSING_CREDENTIAL')
      return { headers: { 'x-api-key': assertUsableApiKey(hit.value, 'example-messages', config.apiKeyEnv) } }
    },
    discoverModels: provider => Promise.resolve(
      options().models.map(model => catalogModelInfo(provider, model)),
    ),
  })
}
```

Config 的 `apiKeyEnv` 只是凭证引用名，先用 `credentialRef` 校验，再由 `ctx.credentials.resolve` 在请求时取值。没有 Credential service 或未配置该引用时抛 `MISSING_CREDENTIAL`；没有环境变量回退。`resolveAdapterOptions` 的默认 endpoint 是公开 Messages API；部署到自有兼容 gateway 时显式设置 `baseURL` 并只从受信任 Profile 提供。`models` 是选择器目录，调用最终由 adapter 和服务端校验。`discoverModels` 只读连接快照，不取凭证也不联网。

## 装载、取消与卸载

先装载 `@deepseek-ai/dsh-llm` 和需要的 Credentials provider，再由 Loader 装载本插件的裸包名行。示例 Profile patch 中只含 `apiKeyEnv` 引用；实际 secret 要由 Credentials provider 管理。`registerDeepSeekProvider` 的注册句柄属于当前 Cordis fiber，插件卸载会释放 route；不能把它迁移到进程全局变量或手动调用 `apply` 后丢失 fiber。重复 provider id 导致装载失败，原有 route 不被覆盖。

调用 `ctx.llm.stream` 时传 `GenerateOptions.signal`；DeepSeek adapter 将它与消费者取消合并，并传入附件准备、Files API 与 fetch。预先取消会在认证和网络前拒绝。异步凭证解析回调本身没有 signal 参数，正在等待中的 Credentials provider read 不保证立即中止；adapter 在 read 后及网络前再次检查 signal。插件卸载时应停止新的调用并等待/取消自有上层请求；本例没有后台任务、定时器或额外 disposer。

`resolveAuth(connection)` 收到与本次 `options()` 一致的连接快照；不要在回调中重新读取 endpoint 或缓存跨请求 header。失败时保留规范 `LlmError` code，避免将 secret 写进 message。若要页面显示这个 route，可另注册 `ctx.llm.registerConfigurableProviders` 目录并持有 disposer；本例不宣称提供 Settings 卡片。

## 可复现验证

在包目录运行：

```sh
npm install --ignore-scripts --legacy-peer-deps --no-audit --no-fund
npm run build
node smoke.mjs
npm pack --dry-run --json
```

`smoke.mjs`：

```js
import assert from 'node:assert/strict'
import { Context } from '@deepseek-ai/cordis'
import LlmRuntime from '@deepseek-ai/dsh-llm'
import * as plugin from './lib/index.js'

const ctx = new Context()
await ctx.plugin(LlmRuntime)
const fiber = await ctx.plugin(plugin, { apiKeyEnv: 'EXAMPLE_MESSAGES_API_KEY' })
assert.deepEqual(ctx.llm.listProviders(), [{ id: 'example-messages', name: 'Example Messages' }])
const models = await ctx.llm.listModels('example-messages')
assert.ok(models.length > 0)
assert.equal(models[0].provider, 'example-messages')
const cancel = new AbortController()
cancel.abort()
const chunks = []
for await (const chunk of ctx.llm.stream({
  provider: 'example-messages', model: models[0].id, messages: [], signal: cancel.signal,
})) chunks.push(chunk)
assert.equal(chunks.at(-1)?.type, 'finish')
assert.equal(chunks.at(-1)?.reason.kind, 'aborted')
let networkCalls = 0
const priorFetch = globalThis.fetch
globalThis.fetch = async () => { networkCalls += 1; throw new Error('network must stay unused') }
try {
  const refused = []
  for await (const chunk of ctx.llm.stream({
    provider: 'example-messages', model: models[0].id,
    messages: [{ role: 'user', content: [{ type: 'text', text: 'hello' }] }],
  })) refused.push(chunk)
  assert.equal(refused.at(-1)?.type, 'finish')
  assert.equal(refused.at(-1)?.reason.kind, 'error')
  assert.equal(refused.at(-1)?.reason.failure.code, 'MISSING_CREDENTIAL')
  assert.equal(networkCalls, 0)
} finally {
  globalThis.fetch = priorFetch
}
await fiber.dispose()
assert.deepEqual(ctx.llm.listProviders(), [])
console.log('registered, listed, pre-cancelled without network, disposed')
```

它通过真实 Cordis/LLM 注册目录、预先取消和缺失凭证错误，并将 `fetch` 替换为抛错函数确认整个流程没有网络请求。卸载 fiber 后 `listProviders()` 为空。该 smoke 没有配置真实凭证、发出真实 Messages 请求、检验文件上传、网络超时或中途取消；这些需要带受控 endpoint 的独立集成测试。
