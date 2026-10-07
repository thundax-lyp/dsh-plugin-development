# 配置 pi-ai gateway 与 DeepSeek 包清单贡献

相关公开契约：[API 参考](api-llm-builtins-retry-meter.md)。

## 任务与前置

目标精确 tag `dsh-v0.2.0-rc.1`。两个独立的 Host Profile 装载任务：`@deepseek-ai/dsh-llm-pi-ai` 把一个自声明 `openai-completions` gateway 注册为 LLM route；`@deepseek-ai/dsh-plugin-package-inventory-deepseek` 在**官方 DeepSeek Messages 请求**中贡献 `dsh_plugin_packages`。第一项依赖 `ctx.llm`；第二项依赖 `agents`、`loader` 与 `deepseekLlmApiExtensions`。本例把 endpoint 指向未开放的 loopback 端口并不设置凭证，smoke 不联网；部署时应换成受信任的 OpenAI Completions 兼容服务地址，由 Credentials provider 存储 `EXAMPLE_GATEWAY_API_KEY`。

源码边界：`packages/llm/llm-pi-ai/src/{index,config,auth}.ts`、`packages/llm/plugin-package-inventory-deepseek/src/index.ts`。自声明 pi-ai route 要有 `api`、`baseURL` 与非空 `models`；`apiKeyEnv` 是引用名，每次请求解析，缺失时 `MISSING_CREDENTIAL`，不回退环境发现。`Config.providers` 是 Volatile 字典，route 增删和注册时 retry policy 变化由插件原子替换；目录不是网络请求。包清单只读活动 Loader entry 和可选 Agent standing preset，不罗列所有依赖。

## Profile 配置

在 Profile patch 中添加 pi-ai 行：

```yaml
- id: llm
  name: '@deepseek-ai/dsh-llm-pi-ai'
  config:
    providers:
      example-gateway:
        displayName: Example Gateway
        api: openai-completions
        baseURL: http://127.0.0.1:9/v1
        apiKeyEnv: EXAMPLE_GATEWAY_API_KEY
        models:
          - id: example-model
            name: Example Model
            contextWindow: 8192
            maxTokens: 2048
```

这里 `id: llm` 是示例 entry id。若 Profile 已有 `llm` entry，应修改现有行或使用其他唯一 id，不能让两个不同插件共享 id。先装载 `@deepseek-ai/dsh-llm`；需真实请求时还应装载 Credentials provider 并写入所引用的 secret。`example-gateway` 是 route id；用户按 `example-gateway/example-model` 选择。`models` 目录是建议，实际请求仍由 adapter/endpoint 验证。运行时更新 providers 会影响下一次调用；正在进行的请求沿已捕获的连接事实完成或取消。

在同一 Profile 已装载 Loader、Agent registry 与 DeepSeek extension registry 后，可添加内置清单行：

```yaml
- id: plugin-package-inventory
  name: '@deepseek-ai/dsh-plugin-package-inventory-deepseek'
  config:
    enabled: true
```

`enabled` 默认为 true；设为 false 则不注册字段。它只作用于官方 DeepSeek Messages adapter 请求，pi-ai 的 gateway 请求不会自动携带此字段。贡献字段在每次请求的 extension `prepare` 时重新取活动 Loader entry；插件卸载由 Cordis fiber 释放注册。若同一字段已有其他 provider，重复注册失败；不要同时注册两份 `dsh_plugin_packages`。

## 独立消费者包

将以下文件放入一个空目录。`package.json` 的额外包是目标发布物的运行 peer，使 npm smoke 可加载所有 module；实际 DSH Profile 已按自己的 bundle 提供这些基础服务。

`package.json`：

```json
{
  "name": "dsh-pi-ai-inventory-consumer-rc1",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/cordis-plugin-loader": "1.0.5",
    "@deepseek-ai/dsh-agent": "0.2.0-rc.1",
    "@deepseek-ai/dsh-agent-preset-registry": "0.2.0-rc.1",
    "@deepseek-ai/dsh-attachment": "0.2.0-rc.1",
    "@deepseek-ai/dsh-authorization": "0.2.0-rc.1",
    "@deepseek-ai/dsh-credentials": "0.2.0-rc.1",
    "@deepseek-ai/dsh-deepseek-llm-api-extensions": "0.2.0-rc.1",
    "@deepseek-ai/dsh-fs": "0.2.0-rc.1",
    "@deepseek-ai/dsh-launch-environment": "0.2.0-rc.1",
    "@deepseek-ai/dsh-llm": "0.2.0-rc.1",
    "@deepseek-ai/dsh-llm-pi-ai": "0.2.0-rc.1",
    "@deepseek-ai/dsh-plugin-package-inventory-deepseek": "0.2.0-rc.1",
    "@deepseek-ai/dsh-session": "0.2.0-rc.1",
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

`src/config.ts`：

```ts
import { Config as PiConfig, type Options as PiOptions } from '@deepseek-ai/dsh-llm-pi-ai'
import { Config as InventoryConfig } from '@deepseek-ai/dsh-plugin-package-inventory-deepseek'

export const providerOptions = {
  providers: {
    'example-gateway': {
      displayName: 'Example Gateway',
      api: 'openai-completions',
      baseURL: 'http://127.0.0.1:9/v1',
      apiKeyEnv: 'EXAMPLE_GATEWAY_API_KEY',
      models: [{ id: 'example-model', name: 'Example Model', contextWindow: 8192, maxTokens: 2048 }],
    },
  },
} satisfies PiOptions

export const parsedProvider = PiConfig(providerOptions)
export const parsedInventory = InventoryConfig({ enabled: true })
```

`pi-ai.patch.yml` 与 `inventory.patch.yml` 使用上文配置。无网络的 `smoke-pi-ai.mjs`：

```js
import assert from 'node:assert/strict'
import { Context } from '@deepseek-ai/cordis'
import LlmRuntime from '@deepseek-ai/dsh-llm'
import * as PiAi from '@deepseek-ai/dsh-llm-pi-ai'
import { providerOptions } from './lib/config.js'

const ctx = new Context()
await ctx.plugin(LlmRuntime)
const fiber = await ctx.plugin(PiAi, providerOptions)
assert.deepEqual(ctx.llm.listProviders(), [{ id: 'example-gateway', name: 'Example Gateway' }])
const models = await ctx.llm.listModels('example-gateway')
assert.deepEqual(models.map(({ provider, id }) => ({ provider, id })), [{ provider: 'example-gateway', id: 'example-model' }])
let networkCalls = 0
const oldFetch = globalThis.fetch
globalThis.fetch = async () => { networkCalls++; throw new Error('network must stay unused') }
try {
  const chunks = []
  for await (const chunk of ctx.llm.stream({
    provider: 'example-gateway', model: 'example-model',
    messages: [{ role: 'user', content: [{ type: 'text', text: 'hello' }] }],
  })) chunks.push(chunk)
  assert.equal(chunks.at(-1)?.type, 'finish')
  assert.equal(chunks.at(-1)?.reason.kind, 'error')
  assert.equal(chunks.at(-1)?.reason.failure.code, 'MISSING_CREDENTIAL')
  assert.equal(networkCalls, 0)
} finally { globalThis.fetch = oldFetch }
await fiber.dispose()
assert.deepEqual(ctx.llm.listProviders(), [])
console.log('pi-ai configured route, model, missing credential, no network, disposed')
```

`smoke-inventory.mjs`：

```js
import assert from 'node:assert/strict'
import { Context } from '@deepseek-ai/cordis'
import Extensions from '@deepseek-ai/dsh-deepseek-llm-api-extensions'
import * as Inventory from '@deepseek-ai/dsh-plugin-package-inventory-deepseek'

const ctx = new Context()
ctx.provide('agents', { get: () => undefined })
ctx.provide('loader', { entries: () => [] })
await ctx.plugin(Extensions)
const signal = new AbortController().signal
const disabled = await ctx.plugin(Inventory, { enabled: false })
assert.deepEqual(Object.keys((await ctx.deepseekLlmApiExtensions.prepare({ signal })).fields), [])
await disabled.dispose()
const enabled = await ctx.plugin(Inventory, { enabled: true })
const fields = (await ctx.deepseekLlmApiExtensions.prepare({ signal })).fields
assert.deepEqual(fields.dsh_plugin_packages, { version: 1, packages: [] })
await enabled.dispose()
assert.deepEqual(Object.keys((await ctx.deepseekLlmApiExtensions.prepare({ signal })).fields), [])
console.log('inventory disabled, enabled empty-loader field, disposed')
```

执行：

```sh
npm install --ignore-scripts --no-audit --no-fund
npm run build
node smoke-pi-ai.mjs
node smoke-inventory.mjs
```

pi-ai smoke 用真实 Cordis 和 LLM registry，检查 route、模型目录、缺凭证失败与卸载，`fetch` 计数确保没有网络。Inventory smoke 用真实 Cordis 和 extension registry，但 Loader/Agent 是空 stub，因此只验证 enabled 开关、空包清单字段及卸载；真实活动包身份、Agent preset 合并和 Messages wire payload 仍需 Profile 集成测试。smoke 不配置 secret；不要把示例测试 endpoint 用于生产。完整验证记录位于创建工作区的 `evidence/runtime/pi-ai-inventory-profile-review.md`。
