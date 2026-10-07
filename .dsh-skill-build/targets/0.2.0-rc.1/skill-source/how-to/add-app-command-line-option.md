# 给应用插件添加命令行选项

## 目标与前置

在 `dsh-v0.2.0-rc.1` 中，应用可消费 launcher 转交的参数并向其他 Loader 行提供已经验证的 `exampleCli` 服务。Host 直接安装 `@deepseek-ai/dsh-cmdline@0.2.0-rc.1`、`@deepseek-ai/cordis@4.0.4`、`commander@^15.0.0`；`commander` 是下方 `Command` import 的直接依赖。类型编译安装 TypeScript 与 Node 类型。Profile 安装/装载包的步骤见[Bundle 与 Profile](api-profile-bundle.md)，命令行契约见[应用命令行参数](api-cmdline.md)。此例的 `provideCmdline` 只在隔离验证中模拟 launcher；实际 DSH launcher 已提供服务。

## 完整 Host 插件与隔离验证

隔离消费包的 `package.json`：

```json
{
  "name": "demo-app-command-line",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": { "build": "tsc -p tsconfig.json", "check": "node lib/index.js" },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-cmdline": "0.2.0-rc.1",
    "commander": "^15.0.0"
  },
  "devDependencies": { "typescript": "^5.9.3", "@types/node": "^24.0.0" }
}
```

`src/index.ts`：

```ts
import { Context } from '@deepseek-ai/cordis'
import { Command } from 'commander'
import { parseCmdline, provideCmdline } from '@deepseek-ai/dsh-cmdline'

declare module '@deepseek-ai/cordis' {
  interface Context {
    exampleCli: { port: number }
  }
}

export const inject = ['cmdlineArgs']

export function apply(ctx: Context): void {
  const command = new Command('example')
  command.option('--port <port>', 'listen port', '3080')
  command.action((options: { port: string }) => {
    const port = Number(options.port)
    if (!Number.isSafeInteger(port) || port < 1 || port > 65535) command.error('port out of range')
    ctx.provide('exampleCli', { port })
  })
  parseCmdline(ctx, command)
}

const root = new Context()
let exitCode: number | undefined
provideCmdline(root, { args: ['--port', '4217'], exit: code => { exitCode = code } })
const fiber = root.plugin({ inject, apply })
await fiber
if (root.get('exampleCli')?.port !== 4217 || exitCode !== undefined) throw new Error('CLI service mismatch')
await fiber.dispose()
if (root.get('exampleCli') !== undefined) throw new Error('CLI service leaked after dispose')
await root.fiber.dispose()
```

`tsconfig.json` 使用 `module`/`moduleResolution: NodeNext`、`target: ES2022`、`strict: true`。执行 `npm install --ignore-scripts`、`npm run build`、`npm run check`，预期服务端口为 4217，卸载后查询为 `undefined`。实际插件包把上段 `root` 及其后内容移到隔离测试文件，入口只导出 `inject`/`apply`；将它作为稳定 ID 的 Loader row 放入 bundle patch。

## 失败与清理

无 launcher 服务时 `parseCmdline` 抛出启动错误；help、version、语法或 action 拒绝请求有界退出。不要在验证所有选项前启动网络、stdio 或异步任务。若 action 创建其他资源，在当前 fiber 的 `ctx.effect` 中明确取消并等待；此例只提供同步服务，无额外异步资源。需要模型在恢复后知道选项影响的结果时，由具体业务插件另记 Session 事件。
