# 注册 Session 标题 provider

## 适用与前置

目标 `dsh-v0.2.0-rc.1`。示例从最新真实用户提示中取前三个词，不调用 LLM。Host Profile 先装载 SessionStore、SessionProjectionRegistry 与 `SessionTitleService`（配置正整数 `fallbackMaxWords`、`fallbackMaxBytes`、`maxTitleBytes`），再装载本插件；同一组合只能有一个标题 provider。用户触发 rename/refresh 时，入口先核对该 Session 的操作权限。Provider 的 `messageSeqs` 必须来自请求快照，不能自造。

创建以下文件。`package.json`：

```json
{
  "name": "dsh-title-provider-consumer",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json"
  },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-session": "0.2.0-rc.1",
    "@deepseek-ai/dsh-session-projection": "0.2.0-rc.1",
    "@deepseek-ai/dsh-session-title": "0.2.0-rc.1",
    "@deepseek-ai/dsh-llm": "0.2.0-rc.1"
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

`src/title-provider.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import { SessionTitleProviderId } from '@deepseek-ai/dsh-session-title'

export const name = 'demo-session-title'
export const inject = ['sessionTitle']

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.sessionTitle.register({
    id: SessionTitleProviderId('demo-first-words'),
    automatic: 'all-prompts',
    async generate(request) {
      request.signal.throwIfAborted()
      const newest = request.messages.at(-1)
      if (newest === undefined) throw new Error('no eligible human title input')
      const title = newest.text.trim().split(/\s+/).slice(0, 3).join(' ')
      return { title, messageSeqs: [newest.seq] }
    },
  }), 'demo-session-title.provider')
}
```

插件 fiber 拥有注册 disposer；`ctx.effect` 保证卸载时取消并等待正在运行的标题生成。`generate` 先检查取消，选用 `request.messages` 中确实存在的 seq，交给服务规范化并写 `session/title`。此例同步计算标题，若替换成外部 I/O，必须把 `request.signal` 转交请求并处理超时与失败。`automatic:'all-prompts'` 表示服务在主请求路由可用时调度；调用 `ctx.sessionTitle.refresh(session,signal)` 是可信入口的显式生成，不依赖自动时机。运行 `npm install --ignore-scripts`、`npm run build` 验证目标声明。契约见[标题 provider](api-session-title.md)。
