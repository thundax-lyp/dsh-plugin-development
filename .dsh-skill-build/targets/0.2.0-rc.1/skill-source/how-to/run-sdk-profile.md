# 从 TypeScript 驱动 SDK Profile

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。调用方拥有一个同版本 `@deepseek-ai/dsh` CLI 子进程，使用 `@deepseek-ai/dsh-sdk-client` 运行具名 Session 并在所有结果路径关闭它。此库运行于 Cordis 外；`sdk` Profile 中的 JSON-RPC server、Agent 和 LLM adapter 由子进程提供，见[SDK 入口](api-sdk-runtime.md)。实际模型运行还需部署者配置可用 provider 凭据。

## 实现步骤

在独立 TypeScript 包中保存如下文件。`package.json`：

```json
{
  "name": "demo-sdk-caller",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": { "build": "tsc -p tsconfig.json", "start": "node lib/index.js" },
  "dependencies": {
    "@deepseek-ai/dsh": "0.2.0-rc.1",
    "@deepseek-ai/dsh-sdk-client": "0.2.0-rc.1"
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
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "lib",
    "strict": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"]
}
```

`src/index.ts`：

```ts
import { resolve } from 'node:path'
import { DeepSeekHarness } from '@deepseek-ai/dsh-sdk-client'

const workdir = resolve(process.cwd())
const harness = new DeepSeekHarness({
  profile: 'sdk',
  cwd: workdir,
  dshHome: resolve(workdir, '.dsh-sdk-home'),
  provider: 'deepseek-official',
  model: 'deepseek-v4-flash',
})

try {
  const session = harness.session('demo-sdk-session')
  const result = await session.run('用一句话说明当前任务。', {
    onNotification(notification) {
      if (notification.method === 'session.status') {
        process.stderr.write(`${notification.method}\n`)
      }
    },
  })
  process.stdout.write(`${result.finalResponse}\n`)
  // `result.events` contains committed root Session events for audit/replay.
} finally {
  await harness.close()
}
```

运行 `npm install && npm run build && npm start`。固定 `sessionId` 使该实例可继续同一会话；多次 `run` 共用一个运行时。`onNotification` 是实时提示，规范审计数据来自 `result.events` 的已提交 Session 事件。`finalResponse` 是到下一个 idle 之间最后的助手文本，不能当作仅属于这条 prompt 的因果结果。

`close()` 在成功、模型失败、通知回调失败或外部取消后的 `finally` 中回收子进程。若需要中途放弃一个正在运行的轮次，关闭整个 Harness；协议没有单独的 prompt cancel。不要把无限期等候的 `run` 当成带默认业务截止时间，调用方应设计自身的进程级截止和失败处理。

## 验证与边界

编译上述三文件；在隔离 `DSH_HOME` 与已配置 provider 下检查握手、事件、最终文本及进程退出。再让 provider/route 不可用，检查初始化失败与清理；断开运行时检查 `TransportClosedError`。本次若只运行脚本化 JSON-RPC 对端，结果仅验证 SDK 客户端协议与关闭，不证明 LLM 或 Profile 组合。
