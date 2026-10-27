# 完整示例：本地脚本模型提供方

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`，运行在 Host。此包只产生本地固定文本，用于离线验证注册、流协议与卸载；连接真实 provider 时另外实现 wire 序列化、认证、取消和 attribution headers。契约见 [LLM](../api/api-capabilities-dsh-llm.md)。

## 文件与依赖

建立 `local-llm/`，包含 `package.json`、`tsconfig.json`、`src/index.ts`、`cordis.patch.yml`。不需要 Client export 或 Remote 生成。

`package.json`：

```json
{
    "name": "dsh-local-scripted-llm",
    "version": "0.1.0",
    "type": "module",
    "exports": { ".": "./lib/index.js" },
    "files": ["lib", "cordis.patch.yml"],
    "engines": { "dsh": "0.2.1-rc.3" },
    "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
    "scripts": { "build": "tsc -p tsconfig.json" },
    "peerDependencies": {
        "@deepseek-ai/cordis": "~4.0.5",
        "@deepseek-ai/dsh-llm": "0.2.1-rc.3"
    },
    "devDependencies": {
        "@deepseek-ai/cordis": "~4.0.5",
        "@deepseek-ai/dsh-llm": "0.2.1-rc.3",
        "typescript": "~6.0.3"
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
        "strict": true,
        "skipLibCheck": true,
        "outDir": "lib",
        "rootDir": "src"
    },
    "include": ["src/**/*.ts"]
}
```

`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import { LlmAdapter, type GenerateOptions, type LlmModelInfo, type StreamChunk } from '@deepseek-ai/dsh-llm'

class LocalAdapter extends LlmAdapter {
  override async listModels(provider: string): Promise<readonly LlmModelInfo[]> {
    return [{ provider, id: 'local-fixed', name: '本地固定文本' }]
  }

  override async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    if (options.stop !== undefined || options.temperature !== undefined || options.maxTokens !== undefined || options.reasoningEffort !== undefined) {
      yield { type: 'finish', reason: { kind: 'error', failure: { code: 'UNSUPPORTED_OPTION', message: '本地固定提供方不接受生成控制参数' } } }
      return
    }
    if (options.signal?.aborted) {
      yield { type: 'finish', reason: { kind: 'aborted', failure: { code: 'ABORTED', message: '调用已取消' } } }
      return
    }
    yield { type: 'block-start', index: 0, blockType: 'text' }
    yield { type: 'text-delta', index: 0, text: '离线提供方已接入' }
    yield { type: 'block-end', index: 0, block: { type: 'text', text: '离线提供方已接入' } }
    yield { type: 'finish', reason: { kind: 'stop' } }
  }
}

export const name = 'local-scripted-llm'
export const inject = ['llm']
export function apply(ctx: Context): void {
  ctx.llm.registerAdapter(['local-scripted'], new LocalAdapter())
}
```

这里没有虚构 token usage；没有真实 provider 用量时不发 usage。每个 block 都有一致 index，finish 后立即结束。生成器无网络、文件或计时器资源，注册 handle 由 Cordis effect 在插件卸载时回收。

`cordis.patch.yml`：

```yaml
- insert:
    - id: local-scripted-llm
      name: dsh-local-scripted-llm
```

## 构建、装载与调用

以下使用全新的隔离 home，以保证示例 Profile 同时具有基础服务与 Web UI。在当前 shell 先执行：

```sh
export DSH_HOME="$(mktemp -d)"
dsh --profile localdemo --from-default-profile web --dump-config
```

此初始化仅针对刚建立的空 home；对已有 Profile 使用 `--from-default-profile` 会替换其原有目录。后续安装、启动和卸载均在同一 shell 中执行。


在包目录运行 `pnpm install`、`pnpm build`。从父目录运行 `dsh plugin --profile localdemo add ./local-llm`；该 profile 的基础组合需提供 `llm`。然后运行 `dsh --profile localdemo`。在 Web 模型选择器选 `local-scripted / local-fixed`，提交任意文本，应得到“离线提供方已接入”。它是新模型调用的响应，不能冒充上一次结果的持久重放。若客户端显式发送生成控制参数，本例会返回 `UNSUPPORTED_OPTION`；清除这些参数后验证固定响应，不静默忽略参数。

独立注册验证可以在装载 `LlmRuntime` 的 Cordis context 上调用 `ctx.llm.listProviders()`，再遍历 `ctx.llm.stream({ provider: 'local-scripted', model: 'local-fixed', messages: [] })`，断言仅有一次 finish 且为 stop。用预先 aborted 的 signal 再调用，应得到 aborted finish。尝试重复注册同一 provider，应得到 `DUPLICATE_ADAPTER`，第一次注册继续可用。

## 卸载与完成判据

从 Profile 运行 `dsh plugin --profile localdemo remove dsh-local-scripted-llm` 并重启，确认目录中不再有该 provider。热卸载时释放贡献插件 fiber 后也应立即撤回路由；再次调用返回 `NO_ADAPTER` terminal failure。这个小插件没有自有持久状态，恢复验证由调用它的 Agent/Session 承担。编译、Profile 加载、模型选择、取消和卸载应分别记录结果。
