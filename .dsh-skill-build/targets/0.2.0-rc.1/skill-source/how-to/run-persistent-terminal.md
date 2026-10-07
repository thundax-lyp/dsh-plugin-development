# 在插件中运行有 owner 的持久 Terminal

## 目标与前置

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。本例的 Host 插件为当前 live Agent 开一个本机 PTY，发送固定检查命令，然后关闭会话；输出由工具框架写进 Session 的规范工具结果。PTY 注册、owner、发送和关闭契约见 [Terminal API](api-terminal.md)。普通一次性命令优先用 Shell；需要保留 cwd、环境或交互 stdin 时才用 Terminal。

目标 Profile 的 Host 服务按依赖装载。`terminal-bash` 通过 `subprocess-local` 起本机 PTY；`sandbox-policy` 每次按 Agent 的 Session 解析模式。以下片段示范 macOS/Linux 的 `shell` backend，工作区需为本机绝对路径；生产环境选择 `workspace-write` 时还要装载 `sandbox-local`。`danger-full-access` 仅限部署者明确选择，不能由模型自动提升。

```yaml
- id: session-projection
  name: '@deepseek-ai/dsh-session-projection'
- id: sandbox-policy
  name: '@deepseek-ai/dsh-sandbox-policy'
  config:
    mode: workspace-write
    workspaceRoot: !!js process.cwd()
- id: sandbox
  name: '@deepseek-ai/dsh-sandbox-local'
- id: subprocess
  name: '@deepseek-ai/dsh-subprocess-local'
- id: pty
  name: '@deepseek-ai/dsh-terminal'
- id: terminal-bash
  name: '@deepseek-ai/dsh-terminal-bash'
- id: terminal-tools
  name: '@deepseek-ai/dsh-tool-terminal'
```

该片段之外还需 Profile 的 `agents`、`tools`、`systemPrompt`、Session 和模型执行链。标准 `tool-terminal` 在此组合上提供 `terminal_open`、`terminal_send`、`terminal_read`、`terminal_signal`、`terminal_close`、`terminal_list`；后台 `terminal_send` 还需 Jobs 能力。若要单个记住状态的 `bash` 工具，装 `tool-bash-persistent`，它自己管理 owner→PTY 和超时重置；Windows 可用同一 `terminal-bash` 的 `shellDialect: pwsh` 加 `tool-pwsh-persistent`，并使用 Windows 对应的 subprocess/sandbox Provider。不要把 macOS/Linux 的 `/bin/bash` 示例直接用于 Windows。

## 实现步骤

在独立包安装 `@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/dsh-terminal@0.2.0-rc.1`、`@deepseek-ai/dsh-sandbox-policy@0.2.0-rc.1`、`@deepseek-ai/dsh-tools@0.2.0-rc.1`。Host TypeScript 用 `NodeNext` 模块解析、ES2022、strict。`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-terminal'
import type {} from '@deepseek-ai/dsh-sandbox-policy'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'demo-terminal-proof'
export const inject = ['tools', 'terminals', 'sandboxPolicy']

export function apply(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'demo_terminal_proof',
    description: 'Check one owned persistent shell and close it.',
    parameters: {},
    output: {
      schema: {
        type: 'object', additionalProperties: false,
        properties: {
          waitReason: { type: 'string', required: true },
          viewport: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
    },
    execute: async (_args, exec) => {
      const owner = exec.agent
      if (owner === undefined) throw new Error('live Agent required')
      const policy = ctx.sandboxPolicy.resolve({ session: owner.session })
      const created = await ctx.terminals.spawn(owner, {
        type: 'shell', cwd: policy.workspaceRoot,
      }, exec.signal)
      try {
        const operation = ctx.terminals.startSend(owner, created.sessionId, {
          text: 'printf "terminal-ready\\n"', submit: true, signal: exec.signal,
        })
        const result = await operation.done
        return { waitReason: result.waitReason, viewport: result.viewport }
      } finally {
        await ctx.terminals.kill(owner, created.sessionId)
      }
    },
  }))
}
```

调用者的 exact live `Agent` 是 owner；不能从 Session ID 拼一个 Agent 或把 `TerminalSessionId` 当跨 Agent authority。`spawn` 可能在真正 PTY 启动前被取消，服务会清理未发布资源。发布后，一次 `startSend` 在同会话独占；`done` 的 `inferred_idle` 或 `timeout` 只表示本次等待停止，不能推断前台命令退出。`finally` 的 `kill` 等待后端关闭；插件 fiber 卸载或 Agent 卸载也会清理残留会话。若清理失败，不能把本次调用报成成功。`render` 只根据规范 JSON 生成文本，不读 PTY 或远端服务。

## 验证与边界

对精确 rc.1 发布声明编译此插件，再在隔离 Profile 检查固定结果、Session 工具日志、同 owner 两次发送的状态、取消、Agent 卸载及重复名称错误。独立 PTY fixture 在 macOS 真实 node-pty/bash 下通过了两次发送、变量持久、scrollback、取消、显式 kill、owner scope 卸载和活动清空；插件示例已类型编译，但未通过完整 Agent ToolRuntime/Session 调度。PTY 是进程内资源，不从 Session 日志恢复；要恢复模型可见输出，应使用工具结果而非 scrollback。
