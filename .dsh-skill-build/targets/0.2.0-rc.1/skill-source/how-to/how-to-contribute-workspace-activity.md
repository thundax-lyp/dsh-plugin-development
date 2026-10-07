# 向工作区归档报告插件活动

## 适用与前置

目标精确版本 `0.2.0-rc.1`。在空目录创建如下 `package.json` 与 `tsconfig.json`，再创建 `src/` 下的文件。

```json
{
  "name": "dsh-workspace-lsp-consumer",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json"
  },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-fs": "0.2.0-rc.1",
    "@deepseek-ai/dsh-fs-local": "0.2.0-rc.1",
    "@deepseek-ai/dsh-lsp": "0.2.0-rc.1",
    "@deepseek-ai/dsh-session": "0.2.0-rc.1",
    "@deepseek-ai/dsh-workspace": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.9.0"
  }
}
```

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "lib",
    "rootDir": "src",
    "strict": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"]
}
```

## `src/activity.ts`

```ts
import { Context, Service } from '@deepseek-ai/cordis'
import type { SessionId } from '@deepseek-ai/dsh-session'
import type { SessionActivity } from '@deepseek-ai/dsh-workspace'

declare module '@deepseek-ai/dsh-workspace/types' {
  interface SessionActivityKindMap { review: true }
}
declare module '@deepseek-ai/cordis' {
  interface Context { demoReviews: DemoReviews }
}

export class DemoReviews extends Service {
  private readonly tasks = new Map<SessionId, Map<string, { label: string; abort: AbortController; done: Promise<void> }>>()

  constructor(ctx: Context) {
    super(ctx, 'demoReviews')
    ctx.on('workspace/session-activity', async ({ sessionId }, next) => {
      const rest = await next()
      const own = this.tasks.get(sessionId)
      if (!own?.size) return rest
      const activity: SessionActivity = { kind: 'review', items: [...own].map(([id, task]) => ({ id, label: task.label })) }
      return [activity, ...rest]
    })
    ctx.on('workspace/session-stop', ({ sessionId }) => {
      for (const task of this.tasks.get(sessionId)?.values() ?? []) task.abort.abort('session archived')
    })
    ctx.effect(() => async () => {
      const pending = [...this.tasks.values()].flatMap(group => [...group.values()])
      for (const task of pending) task.abort.abort('plugin unloaded')
      await Promise.allSettled(pending.map(task => task.done))
    }, 'demoReviews.stop')
  }

  start(sessionId: SessionId, id: string, label: string, work: (signal: AbortSignal) => Promise<void>): Promise<void> {
    const group = this.tasks.get(sessionId) ?? new Map()
    if (group.has(id)) throw new Error(`review task ${id} already exists`)
    this.tasks.set(sessionId, group)
    const abort = new AbortController()
    const done = Promise.resolve().then(() => work(abort.signal)).finally(() => {
      group.delete(id)
      if (group.size === 0) this.tasks.delete(sessionId)
    })
    group.set(id, { label, abort, done })
    return done
  }
}

export default DemoReviews
```

## 挂载、使用与验证

Host 先挂载 `DemoReviews`，然后用可信入口中的已授权 `SessionId` 调 `ctx.demoReviews.start(id,taskId,label,work)`。`work` 必须响应 `AbortSignal` 并自行把模型应见的结果或失败写入 Session 日志；本例只演示活动所有权。若 session 被归档且调用方选择 `stopActivity:true`，事件使该任务取消；无此选项时上报的活动阻止归档。Cordis fiber 卸载也会取消并等待任务结束。任务 ID 在同一 Session 内不能重复；失败原样传回调用者，注册表自动在 `finally` 移除。先在本目录运行 `npm install --ignore-scripts`、`npm run build`。

## 限制

这里没有注册持久工作；进程中断时任务表丢失。恢复须从插件自己的 durable Session 事实重新决定；不能仅凭 `SessionActivity` 恢复。`workspace/session-stop` 表示发起停止，完整归档返回不等待所有工作结算。参考[Workspace 契约](api-workspace.md)。
