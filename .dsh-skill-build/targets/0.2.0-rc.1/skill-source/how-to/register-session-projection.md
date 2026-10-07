# 为 Session 事件注册一个 Host 投影

## 目标与前置

目标版本 `dsh-v0.2.0-rc.1`。本例注册 `demo/turn-count`，从已提交的 `turn/end` 事件折叠出完成回合数，并把数字作为 Client 可见 view。投影属于当前插件的 Cordis fiber；卸载后自动取消注册。Session 日志是唯一权威来源，[投影缓存](api-session-projection.md)只加速重新折叠。

## 实现步骤

在一个独立的 Host 插件包中保存下列文件。`@deepseek-ai/cordis` 的版本与目标 bundle 对齐；部署时应复用 Profile 已有的 `session-projection` 和 `session` 服务。

`package.json`：

```json
{
  "name": "demo-turn-count",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./lib/index.js",
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-session-projection": "0.2.0-rc.1",
    "zod": "^4.4.3"
  },
  "devDependencies": { "typescript": "^5.9.0" }
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
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type { ProjectionDefinition } from '@deepseek-ai/dsh-session-projection'
import { z } from 'zod'

declare module '@deepseek-ai/dsh-session-projection/types' {
  interface SessionProjectionStateMap {
    'demo/turn-count': number
  }

  interface SessionProjectionMap {
    'demo/turn-count': number
  }
}

export const turnCountProjection = {
  key: 'demo/turn-count',
  stateVersion: 1,
  stateSchema: z.number().int().nonnegative(),
  init: () => 0,
  apply: (count, event) =>
    event.type === 'turn/end' ? count + 1 : count,
  wire: {
    viewSchema: z.number().int().nonnegative(),
    view: count => count,
  },
} satisfies ProjectionDefinition<'demo/turn-count', number>

export const name = 'demo-turn-count'
export const inject = ['sessionProjections']

export function apply(ctx: Context): void {
  ctx.sessionProjections.register(turnCountProjection)
}
```

## 装载与验证

运行 `npm install && npm run build`，把构建后的包加入 Host Profile，确保 `session-projection` 先提供 `ctx.sessionProjections`。插件的 `inject` 会阻止缺服务时启动；`register` 在当前 fiber 上登记 disposer，无额外定时器、文件或手动关闭资源。

向 Session append 一个 `turn/start` 和一个 `turn/end`，再读 `ctx.sessionProjections.snapshot(session).values['demo/turn-count']`，预期从 `0` 变 `1`。无关事件保持同一 state；卸载插件后该键不在快照，重新装载会从现有 Session 日志重建。若 fold 语义改变，应递增 `stateVersion`，让旧 checkpoint 失效；不要修改缓存来补造日志。取消、插件启动失败或 fiber 卸载均由 Cordis effect 处理注册清理。

本次隔离消费包实际编译并验证了单进程 append/快照；卸载重装、缓存冷恢复和 Browser view 仍需在目标 Profile 中验收。
