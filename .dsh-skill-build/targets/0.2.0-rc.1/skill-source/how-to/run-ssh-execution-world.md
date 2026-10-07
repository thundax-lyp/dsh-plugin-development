# 组合 SSH 远端执行世界

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。这是一套部署者配置的远端文件、进程、Sandbox Provider。`@deepseek-ai/dsh-ssh` 的连接配置不是模型参数；远端 host alias、凭证、known host、Node、已构建 helper 与绝对工作区路径须由部署者准备。公开服务与边界见 [SSH API](api-ssh.md)。本章给出可填入真实部署值的 Profile 和验证顺序；无远端服务器时不能声称握手或文件效果已验证。

本机与远端均需 Linux/macOS；本机 OpenSSH 要支持连接复用和 Unix socket 转发，服务器须允许转发。先在部署者控制的远端安装同一 rc.1 构建的 bundled helper 及其运行依赖，确保 Node/helper 不在工作区或可写临时根内。预配 SSH alias 的 user/key/known host；服务启用 `BatchMode`、严格 host key 检查，启动时不会交互询问密码。对**远端实际安装的 helper entry** 计算小写 SHA-256，写入 `helperHash`。PTC 不使用时不填 `bootstrapPath`/`bootstrapHash`；使用时两者成对配置。

## 实现步骤

将以下 Host Profile 片段中的环境变量设为实际绝对远端值。`sessionProjections` 先于 policy，policy 和 SSH 连接先于三个 Provider；其他 Host 服务按应用 Profile 另行装载。

```yaml
- id: session-projections
  name: '@deepseek-ai/dsh-session-projection'
- id: sandbox-policy
  name: '@deepseek-ai/dsh-sandbox-policy'
  config:
    mode: workspace-write
    workspaceRoot: !!js process.env.DSH_REMOTE_WORKSPACE
- id: ssh
  name: '@deepseek-ai/dsh-ssh'
  config:
    host: !!js process.env.DSH_SSH_ALIAS
    node: !!js process.env.DSH_REMOTE_NODE
    helper: !!js process.env.DSH_REMOTE_HELPER
    helperHash: !!js process.env.DSH_REMOTE_HELPER_SHA256
    workspace: !!js process.env.DSH_REMOTE_WORKSPACE
- id: fs
  name: '@deepseek-ai/dsh-fs-ssh'
- id: subprocess
  name: '@deepseek-ai/dsh-subprocess-ssh'
- id: sandbox
  name: '@deepseek-ai/dsh-sandbox-ssh'
```

启动前先用同一 alias 独立检查 `ssh -o BatchMode=yes -o StrictHostKeyChecking=yes <alias> /absolute/node -v`、远端 helper 路径及摘要。完整 Profile 加载时等待 `ctx.ssh.ready`；失败则停止这套执行世界，不改挂本地 `fs`、`subprocess` 或 `sandbox` 来掩盖失败。以下是装载上述 Profile 后，一个 Host 插件内部可调用的最小检查函数；调用者传入已经初始化的 `ctx` 和一次操作的取消信号。它用远端 FS 写入，再以**远端** Node、cwd 和 Sandbox 读取同一个唯一文件。

```ts
import { randomUUID } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-ssh'
import type {} from '@deepseek-ai/dsh-fs-ssh'
import type {} from '@deepseek-ai/dsh-subprocess-ssh'
import type {} from '@deepseek-ai/dsh-sandbox-ssh'
import type {} from '@deepseek-ai/dsh-sandbox-policy'

export async function checkRemoteWorld(ctx: Context, signal: AbortSignal): Promise<void> {
  await ctx.ssh.ready
  signal.throwIfAborted()
  const root = ctx.sandboxPolicy.workspaceRoot // 配置为远端绝对路径
  const path = `${root}/sandbox-check-${randomUUID()}.txt`
  const file = await ctx.fs.resolve(path, { signal })
  const policy = ctx.sandboxPolicy.resolve() // Session 内改用 resolve({ session })
  if (policy.mode !== 'workspace-write') throw new Error('check needs workspace-write')
  try {
    await ctx.fs.writeText(file, 'remote-ok', { kind: 'createIfAbsent' }, signal, policy)
    const argv = [ctx.ssh.nodeExecutable, '-e',
      'process.stdout.write(require("node:fs").readFileSync(process.argv[1], "utf8"))', path]
    const confined = await ctx.sandbox.confine(argv, { ...policy, mode: 'workspace-write' }, signal)
    const child = ctx.subprocess.spawn({
      argv: confined.argv, cwd: root, signal, graceMs: 500,
      stdio: { stdin: 'ignore', stdout: { maxBytes: 1024 }, stderr: { maxBytes: 1024 } },
    })
    const result = await child.done
    await child.waitForExit()
    if (result.exitCode !== 0 || child.collected.stdout?.readFrom(0).text !== 'remote-ok') {
      throw new Error(`remote check failed: ${result.exitCode}`)
    }
  } finally {
    // 清理采用独立、有限时限的信号；原操作取消仍须尝试撤销自己创建的文件。
    const cleanupSignal = AbortSignal.timeout(5_000)
    try {
      const cleanupArgv = await ctx.sandbox.confine([
        ctx.ssh.nodeExecutable, '-e',
        'require("node:fs").rmSync(process.argv[1], {force:true})', path,
      ], { ...policy, mode: 'workspace-write' }, cleanupSignal)
      const cleanup = ctx.subprocess.spawn({
        argv: cleanupArgv.argv, cwd: root, signal: cleanupSignal, graceMs: 500,
        stdio: { stdin: 'ignore', stdout: { maxBytes: 1024 }, stderr: { maxBytes: 1024 } },
      })
      const outcome = await cleanup.done
      await cleanup.waitForExit()
      if (outcome.exitCode !== 0) throw new Error(`remote cleanup failed: ${path}`)
    } catch (error) {
      // 连接中断时可能无法知道远端效果；把 path 留给部署日志与人工恢复。
      console.error('remote cleanup uncertain', path, error)
    }
  }
}
```

生产插件应在 Session 中记录策略、工具 JSON 结果及清理失败。断连时远端效果无法确认，需用记录的唯一路径恢复。远端路径和本机路径即使字面相同也不可互换。连接卸载应等待 `ctx.ssh.dispose()`；取消并不回滚已发生的远端写入，也不自动重连或重放。

## 验证与边界

在**可丢弃的远端工作区**做最小接受：`ctx.ssh.ready` 完成；远端 `ctx.fs` 写读一个带唯一名称的文件；远端 `ctx.sandbox.confine` 包装读取并由 `ctx.subprocess.spawn` 执行；只读写入被拒绝；取消进程并等待停稳；卸载后转发连接与 helper 清理。每一步留存实际结果和 Session 日志中的策略/工具结果。目标源码有 `DSH_SSH_TEST_CONFIG` 门控的真实远端 e2e 测试，但本轮没有服务器配置，因此这条接受路径未运行。当前仅本机 Sandbox 执行过；SSH 类型、连接握手、helper 摘要和远端清理仍待目标环境验证。
