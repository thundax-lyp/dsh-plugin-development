# 增加一个固定 Git 状态工具

## 目标与装载

目标 `dsh-v0.2.0-rc.1`。本例在 Host 插件中注册一个不接受任意命令参数的 `demo_git_status`，通过已装载的 `ctx.shell` 执行固定 `git status --short`。Profile 需先有 `systemPrompt`、`tools`、`subprocess` 和一个 shell Provider（例如 `bash-local`；部署者可选择 sandbox Provider）。`ctx.shell` 与工具输出契约见[Shell 执行能力](api-shell-tool.md)。

## 实现步骤

在独立插件包中保存下列文件。`package.json`：

```json
{
  "name": "demo-git-status-tool",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./lib/index.js",
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-shell": "0.2.0-rc.1",
    "@deepseek-ai/dsh-tools": "0.2.0-rc.1"
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
import { defineTool } from '@deepseek-ai/dsh-tools'
import type {} from '@deepseek-ai/dsh-shell'

export const name = 'demo-git-status-tool'
export const inject = ['tools', 'shell']

export function apply(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'demo_git_status',
    description: 'Read the current workspace Git status.',
    parameters: {},
    output: {
      schema: {
        type: 'object', additionalProperties: false,
        properties: {
          exitCode: { required: true, oneOf: [{ type: 'integer' }, { type: 'null' }] },
          stdout: { type: 'string', required: true },
          stderr: { type: 'string', required: true },
          timedOut: { type: 'boolean', required: true },
          aborted: { type: 'boolean', required: true },
        },
      },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
    },
    execute: async (_args, exec) => {
      const cwd = exec.agent?.session.header.cwd
      if (!cwd) throw new Error('demo_git_status requires a Session workspace cwd')
      const run = await ctx.shell.execute(ctx.shell.resolve({
        command: 'git status --short', workdir: cwd, timeoutMs: 10_000, signal: exec.signal,
      }))
      const result = await run.result()
      return {
        exitCode: result.exitCode,
        stdout: result.stdout.text,
        stderr: result.stderr.text,
        timedOut: result.timedOut,
        aborted: result.aborted,
      }
    },
  }))
}
```

运行 `npm install && npm run build` 后，在目标 Profile 中装载此包。一个调用只有一份规范 JSON 结果；`render` 不做额外 IO，可从相同值重放模型文本。`exec.signal`、有限超时与 `await run.result()` 让取消、失败和正常结束都等到进程停稳；非零退出返回 `exitCode`，调用方不能把它当作成功。工具注册属于当前 fiber，卸载后工具名消失。

## 验证与边界

从带可信 Session `cwd` 的 Agent 调用，核对 Git 输出、退出码、模型文本及 Session 工具结果；无 cwd 应明确失败。测试取消/超时、无 Git 仓库的非零退出、Provider 卸载与沙箱拒绝。固定命令只是减少输入面，访问权限仍由工具执行策略与 Backend confinement 决定。本次隔离 smoke 实际编译、执行固定命令并检查卸载注销，但直接调用 definition，未覆盖完整 ToolRuntime 权限与调度。
