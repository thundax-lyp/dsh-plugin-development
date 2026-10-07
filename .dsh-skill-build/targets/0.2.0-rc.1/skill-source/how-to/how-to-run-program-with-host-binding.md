# 运行带 Host binding 的程序

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。本例提供受限只读 `catalog.lookup`，由可信调用方决定程序来源与运行授权。Profile 先装载 FS、Subprocess、Sandbox、Session projections、Sandbox policy，再装载 Node PTC Runtime。生产环境应配置经平台验证的限制模式；隔离 smoke 为验证进程/API 使用 `danger-full-access`，它不提供文件保护。若程序结果给模型，调用方须把唯一规范 JSON 工具结果及失败状态写入 Session 日志。

创建以下文件。`package.json`：

```json
{
  "name": "dsh-ptc-consumer",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json"
  },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-ptc-runtime": "0.2.0-rc.1",
    "@deepseek-ai/dsh-ptc-runtime-node": "0.2.0-rc.1",
    "@deepseek-ai/dsh-fs-local": "0.2.0-rc.1",
    "@deepseek-ai/dsh-subprocess-local": "0.2.0-rc.1",
    "@deepseek-ai/dsh-sandbox-local": "0.2.0-rc.1",
    "@deepseek-ai/dsh-sandbox-policy": "0.2.0-rc.1",
    "@deepseek-ai/dsh-session-projection": "0.2.0-rc.1"
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

`src/catalog-run.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type { PtcRunResult } from '@deepseek-ai/dsh-ptc-runtime'
import type {} from '@deepseek-ai/dsh-ptc-runtime'

const DATA: Readonly<Record<string, { title: string }>> = {
  alpha: { title: 'First record' },
}

/** Caller owns program admission, authorization, and Session result logging. */
export async function runCatalogProgram(
  ctx: Context, program: string, cwd: string, signal: AbortSignal,
): Promise<PtcRunResult> {
  const spec = ctx.ptcRuntime.resolve({
    program, cwd, timeoutMs: 5_000, signal,
    bindings: [{
      global: 'catalog',
      errorClass: { name: 'CatalogError', memberNameProperty: 'itemId' },
      functions: {
        lookup: async args => {
          if (typeof args !== 'object' || args === null || Array.isArray(args)) throw new Error('expected object')
          const id = (args as { id?: unknown }).id
          if (typeof id !== 'string') throw new Error('id must be a string')
          const item = DATA[id]
          if (item === undefined) throw new Error('record unavailable')
          return { id, title: item.title }
        },
      },
    }],
  })
  return ctx.ptcRuntime.run(spec)
}
```

在已验证的 Host 调用里传入绝对执行世界 `cwd` 和归请求生命周期所有的 `AbortSignal`，调用 `runCatalogProgram(ctx,program,cwd,signal)`。函数逐次验证 `lookup` 的 JSON 参数，拒绝未知记录；请求先由 provider `resolve` 得到有界 5 秒 deadline，再 `run`。检查 `result.error`，不能把 Promise resolve 当成功；成功的 `result.value` 与 `result.logs` 由调用方按单一结果 schema 输出。程序停止不取消已开始的外部 Host 工作；若 binding 改为网络或有副作用操作，另给其取消/回滚与权限路径。运行 `npm install --ignore-scripts`、`npm run build` 验证目标声明。完整契约见[PTC Runtime](api-ptc-runtime.md)。
