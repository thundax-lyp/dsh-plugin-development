# 添加 DeepSeek 请求字段

## 适用与前置

目标 `dsh-v0.2.0-rc.1`。此 Host 插件只为明确接受 `dsh_example_tag` top-level 字段的自有 DeepSeek 兼容网关准备值；真实网关须先确认字段名、JSON schema 与隐私策略。Profile 先装载 `@deepseek-ai/dsh-deepseek-llm-api-extensions`，并使用官方 DeepSeek adapter。示例的 `accepted` 只是进程内观察计数，不可作为投递或模型可见事实。

创建如下文件。`package.json`：

```json
{
  "name": "dsh-deepseek-request-extension-consumer",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json"
  },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-deepseek-llm-api-extensions": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.9.0"
  }
}
```

`tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022", "module": "NodeNext", "moduleResolution": "NodeNext",
    "outDir": "lib", "rootDir": "src", "strict": true,
    "skipLibCheck": true, "types": ["node"]
  },
  "include": ["src/**/*.ts"]
}
```

`src/request-tag.ts`：

```ts
import { Context, Service } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-deepseek-llm-api-extensions'

declare module '@deepseek-ai/dsh-deepseek-llm-api-extensions/types' {
  interface DeepSeekLlmApiExtensionMap {
    dsh_example_tag: { readonly tag: string }
  }
}

declare module '@deepseek-ai/cordis' {
  interface Context { requestTag: RequestTag }
}

/** For a gateway that explicitly accepts the top-level dsh_example_tag field. */
export default class RequestTag extends Service {
  static inject = ['deepseekLlmApiExtensions']
  accepted = 0

  constructor(ctx: Context) {
    super(ctx, 'requestTag')
    ctx.effect(() => ctx.deepseekLlmApiExtensions.register('dsh_example_tag', {
      prepare: request => {
        request.signal.throwIfAborted()
        if (request.purpose !== undefined) return undefined
        return {
          value: { tag: 'plugin-example' },
          accept: () => { this.accepted += 1 },
        }
      },
    }), 'requestTag.field')
  }
}
```

Host 按顺序装载 Registry、官方 DeepSeek adapter 与 `RequestTag`。Registry 的 `prepare` 不等于发送成功；只有官方 adapter 收到 HTTP 2xx 才调用 `accept`。例子跳过 compaction 与 session-title 请求，避免辅助请求意外携带字段。插件卸载会释放字段所有权。运行 `npm install --ignore-scripts`、`npm run build` 检查精确版本公开声明。连接真实网关时还要在独立环境核对 HTTP body、非 2xx 不提交、取消和并发恢复。契约见[请求字段扩展](api-deepseek-request-extensions.md)。
