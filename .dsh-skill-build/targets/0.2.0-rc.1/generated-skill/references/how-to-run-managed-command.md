# 在 Host 插件中运行受管命令

## 适用与前置

目标 `dsh-v0.2.0-rc.1`。此例接收可信入口已经核准的精确 argv、执行世界 cwd 与取消信号；它不是把模型文字直接送进 shell 的工具。Profile 先装载一个 `ctx.subprocess` provider，例如本机 `@deepseek-ai/dsh-subprocess-local`。返回结果是 Host 值；若供模型使用，调用方须形成唯一规范工具 JSON 并写入 Session 日志，不能把本地 stdout 缓冲当作可恢复事实。

创建以下文件。`package.json`：

```json
{
  "name": "dsh-subprocess-consumer",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json"
  },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-subprocess": "0.2.0-rc.1",
    "@deepseek-ai/dsh-subprocess-local": "0.2.0-rc.1"
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

`src/run-cli.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-subprocess'

export interface CommandResult {
  exitCode: number | null
  signal: NodeJS.Signals | null
  stdout: string
  stderr: string
  stdoutTruncated: boolean
  stderrTruncated: boolean
}

/** Run a trusted exact argv; caller owns authorization and cancellation. */
export async function runCli(
  ctx: Context, argv: readonly string[], cwd: string, signal: AbortSignal,
): Promise<CommandResult> {
  signal.throwIfAborted()
  const handle = ctx.subprocess.spawn({
    argv, cwd, signal, graceMs: 3_000,
    stdio: {
      stdin: 'ignore',
      stdout: { maxBytes: 64_000 },
      stderr: { maxBytes: 64_000 },
    },
  })
  try {
    const outcome = await handle.done
    const stdout = handle.collected.stdout?.readFrom(0)
    const stderr = handle.collected.stderr?.readFrom(0)
    return {
      exitCode: outcome.exitCode, signal: outcome.signal,
      stdout: stdout?.text ?? '', stderr: stderr?.text ?? '',
      stdoutTruncated: stdout?.lossy ?? false, stderrTruncated: stderr?.lossy ?? false,
    }
  } finally {
    handle.terminate()
    await handle.waitForExit()
  }
}
```

调用前用 `ctx.subprocess.resolveExecutable(command)` 在同一执行世界查找程序，然后用 `[resolved, ...args]` 调 `runCli(ctx,argv,cwd,signal)`。调用者要在权限门禁后约束 argv/cwd、将 signal 绑定请求或插件生命周期，并检查 `exitCode`、`signal` 及两个 `*Truncated`。示例只保留每路 64 KB 尾部，不提供全量输出；需要可恢复全流应在 collect spec 增加有界 `spill` 并处理 `spillPath`。示例 `finally` 触发 terminate 并等待受管范围退出，失败也进入清理路径。运行 `npm install --ignore-scripts`、`npm run build` 验证目标公开声明。详见[Subprocess 契约](api-subprocess.md)。
