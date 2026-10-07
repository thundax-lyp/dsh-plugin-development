# 用本机 Sandbox Provider 限制一个进程

## 目标与前置

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。本例把 `sandbox-policy` 的一次解析结果传给 `sandbox-local`，执行它返回的 argv，并验证 `workspace-write` 允许工作区内写入、拒绝工作区外写入。文件作用域、返回值和强度语义见[Sandbox API](api-sandbox.md)。示例在 macOS/Linux/POSIX 进程上使用 Node；Windows 部署须用本机对应进程运行方式和 ACL backend 验证。

Profile 的相应 Host 段按此顺序装载，工作区必须为执行机器上的绝对路径；`sandbox-policy` 的 `sessionProjections` 注入需要先装载。实际 Profile 还要装入应用所需的 Session、Agent 与工具服务。

```yaml
- id: session-projections
  name: '@deepseek-ai/dsh-session-projection'
- id: sandbox-policy
  name: '@deepseek-ai/dsh-sandbox-policy'
  config:
    mode: workspace-write
    workspaceRoot: !!js process.cwd()
- id: sandbox
  name: '@deepseek-ai/dsh-sandbox-local'
```

## 实现步骤

在独立包安装 `@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/dsh-sandbox@0.2.0-rc.1`、`@deepseek-ai/dsh-sandbox-local@0.2.0-rc.1`、`@deepseek-ai/dsh-sandbox-policy@0.2.0-rc.1`、`@deepseek-ai/dsh-session-projection@0.2.0-rc.1`，以及 `typescript@^5.9.0` 和 `@types/node@^22`。`tsconfig.json` 使用 `module`/`moduleResolution: NodeNext`、`target: ES2022`、`strict: true`。下面的完整 `src/main.ts` 可独立运行；应用插件内可将 `run` 放进 `apply(ctx)`，由现有 Profile 提供 `ctx`，并把调用方的 `AbortSignal` 传入。

```ts
import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { Context } from '@deepseek-ai/cordis'
import LocalSandboxProvider from '@deepseek-ai/dsh-sandbox-local'
import SandboxPolicyService from '@deepseek-ai/dsh-sandbox-policy'
import SessionProjectionRegistry from '@deepseek-ai/dsh-session-projection'

const execFileAsync = promisify(execFile)
const workspace = await mkdtemp(join(homedir(), 'dsh-sandbox-example-'))
const ctx = new Context()
try {
  await ctx.plugin(SessionProjectionRegistry)
  await ctx.plugin(SandboxPolicyService, { mode: 'workspace-write', workspaceRoot: workspace })
  await ctx.plugin(LocalSandboxProvider, {})
  const policy = ctx.sandboxPolicy.resolve() // 实际 Session 调用：resolve({ session })
  if (policy.mode !== 'workspace-write') throw new Error('unexpected policy')
  const target = join(workspace, 'proof.txt')
  const signal = AbortSignal.timeout(10_000)
  const argv = [process.execPath, '-e',
    'require("node:fs").writeFileSync(process.argv[1], "ok")', target]
  const confined = await ctx.sandbox.confine(argv, { ...policy, mode: 'workspace-write' }, signal)
  if (confined.enforcement !== 'full') throw new Error('full confinement required here')
  await execFileAsync(confined.argv[0]!, confined.argv.slice(1), { signal, timeout: 10_000 })
  if (await readFile(target, 'utf8') !== 'ok') throw new Error('missing proof')
} finally {
  await ctx.fiber.dispose()
  await rm(workspace, { recursive: true, force: true })
}
```

在现有插件中，`ctx.sandboxPolicy.resolve({ session: exec.agent.session })` 应在**每次**执行边界调用，不能缓存部署默认值；Session 的 cwd 会成为该调用的工作区根。若解析到 `danger-full-access`，调用者显式跳过 `confine`，也须确认更宽模式已经获用户批准。`read-only` 和 `workspace-write` 必须执行返回的 `confined.argv`，绝不能退回原 argv。进程完成前保留注册作用域；取消信号同时传给 `confine` 和进程；卸载时等待或终止自己启动的进程，再释放插件 fiber。进程非零退出时用返回的 `runnerFailureRules` 与 `denialSignatures` 区分 runner 启动失败和文件拒绝，不能单凭退出码判断。

## 验证与边界

`npm run build && node lib/main.js` 后，检查 `proof.txt` 曾被创建，并分别尝试工作区外写入与 `read-only` 写入；两者应退出非零且文件不存在。隔离 fixture 的 macOS Seatbelt 实跑显示工作区内写入成功，外部及只读写入均返回 EPERM，取消前置信号被观察到。此例只约束同一执行世界的文件效果，网络和进程可见性不在该模式内。Linux 的 bwrap/Landlock、Windows ACL，以及 Session 日志/完整工具调用需在各自 Profile 独立验证。
