# 创建并装载一个 LLM Adapter

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。以下独立 Host 包提供 `fixed-example/fixed-text` 本地固定文本模型，验证插件装载、Provider 注册、模型目录、chunk 协议和卸载。它不发 HTTP 请求，也不代表生产供应商；接真实供应商时需按 [LLM Provider 契约](api-llm-providers.md)补齐请求映射、公开 User-Agent、每请求凭证解析、流协议、错误与取消，并另做真实服务测试。Session 模型选择参见 [模型路由](api-llm-model-routing.md)。目标 Profile 要先挂载 `@deepseek-ai/dsh-llm`；base bundle 已挂载。

## 实现步骤

创建四个文件。`package.json`：

```json
{
  "name": "dsh-llm-adapter-consumer-rc1",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-llm": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-llm": "0.2.0-rc.1",
    "typescript": "6.0.3"
  }
}
```

`tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "lib",
    "declaration": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import { LlmAdapter, LlmError, type GenerateOptions, type LlmModelInfo, type StreamChunk } from '@deepseek-ai/dsh-llm'

class FixedTextAdapter extends LlmAdapter {
  override listModels(provider: string): Promise<readonly LlmModelInfo[]> {
    return Promise.resolve([{ provider, id: 'fixed-text', name: 'Fixed text' }])
  }

  override async * stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    if (options.model !== 'fixed-text') throw new LlmError('unknown model', 'MODEL_NOT_FOUND')
    if (options.messages.length || options.system !== undefined || options.tools?.length || options.toolHistory !== undefined
      || options.temperature !== undefined || options.maxTokens !== undefined || options.stop?.length
      || options.reasoningEffort !== undefined || options.sessionId !== undefined || options.purpose !== undefined) {
      throw new LlmError('this fixture does not support these options', 'UNSUPPORTED_OPTION')
    }
    options.signal?.throwIfAborted()
    const answer = 'Hello from fixed-text'
    yield { type: 'block-start', index: 0, blockType: 'text' }
    yield { type: 'text-delta', index: 0, text: answer }
    yield { type: 'block-end', index: 0, block: { type: 'text', text: answer } }
    yield { type: 'usage', usage: { inputTokens: 0, outputTokens: 0 } }
    yield { type: 'finish', reason: { kind: 'stop' } }
  }
}

export const name = 'llm-example'
export const inject = ['llm']

export function apply(ctx: Context): void {
  const stop = ctx.llm.registerAdapter(['fixed-example'], new FixedTextAdapter())
  ctx.effect(() => stop)
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: llm-example
      name: dsh-llm-adapter-consumer-rc1
```

在包目录运行 `npm install --ignore-scripts --no-audit --no-fund`、`npm run build`、`npm pack --dry-run --json`，确认 pack 有 `lib/index.js`、`lib/index.d.ts`、patch、manifest。将包用 `dsh plugin --profile <name> add ./dsh-llm-adapter-consumer-rc1` 加入目标 Profile，先用 `dsh --profile <name> --dump-config` 核对 `llm` 服务和本包的 Loader 行，再真实启动。注册句柄属于插件 fiber，卸载后 route 消失；示例不保存状态，重启会从插件装载重新注册。这个 fixture 只接受无消息的直接 Core 调用；要成为 Agent 可用的模型，必须实现实际输入、工具和参数映射。模型目录出现 route/model 不等于 Agent 请求可成功。

## 验证与完成边界

隔离 fixture 已通过独立声明编译、打包检查和纯 Cordis Context 的直接调用：`listProviders()` 返回 `fixed-example`，`listModels()` 返回 `fixed-text`，`ctx.llm.stream()` 依序产生 start/delta/end/usage/finish，fiber.dispose 后 provider 列表为空。真实 Profile 安装、Agent turn、Web 模型选择、取消与供应商请求均未运行。固定响应的 `usage` 仅适用于这个本地 fixture；接真实计费供应商时必须传递实际使用量，不能复制零值。请求带消息、工具或其它未实现参数时 fixture 抛 `UNSUPPORTED_OPTION`，真实 adapter 应逐项实现或保持明确拒绝。
