# 接入自有 Browser MCP Provider

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。此 Host 插件将一个已安装、使用 stdio 的 Browser MCP server 按活跃 Agent/Session 装载，并为外部已存在浏览器预留独占槽。公开契约见 [Browser/Computer Use Provider](api-browser-computer-use.md)。MCP server 可替换，但必须提供真实浏览器动作、正确工具 Schema 和关闭语义。

`package.json`：

```json
{
  "name": "example-browser-mcp-provider",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-experimental-browser-use-runtime": "0.2.0-rc.1",
    "@deepseek-ai/dsh-browser-use": "0.2.0-rc.1",
    "@deepseek-ai/dsh-agent": "0.2.0-rc.1",
    "@deepseek-ai/dsh-tools": "0.2.0-rc.1",
    "@deepseek-ai/dsh-system-prompt": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-experimental-browser-use-runtime": "0.2.0-rc.1",
    "@deepseek-ai/dsh-browser-use": "0.2.0-rc.1",
    "@deepseek-ai/dsh-agent": "0.2.0-rc.1",
    "@deepseek-ai/dsh-tools": "0.2.0-rc.1",
    "@deepseek-ai/dsh-system-prompt": "0.2.0-rc.1",
    "typescript": "6.0.3"
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
    "declaration": true,
    "outDir": "lib",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

`cordis.patch.yml`（部署把 command/args 换成自己已安装的 stdio MCP server 启动命令）：

```yaml
- insert:
    - id: example-browser-mcp-provider
      name: example-browser-mcp-provider
      config:
        command: node
        args: [browser-mcp-server.js]
        exclusive: true
```

`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-browser-use'
import type {} from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-tools'
import type {} from '@deepseek-ai/dsh-system-prompt'
import { mountSessionMcp } from '@deepseek-ai/dsh-experimental-browser-use-runtime/mcp'

export interface Config {
  command: string
  args: string[]
  exclusive: boolean
  toolCallTimeoutMs?: number
}

export const name = 'example-browser-mcp-provider'
export const inject = ['browserUse', 'agents', 'tools', 'systemPrompt']

export function apply(ctx: Context, config: Config): void {
  if (!config.command || !Array.isArray(config.args)) throw new Error('MCP command and args are required')
  mountSessionMcp(ctx, {
    name: 'example-browser',
    command: config.command,
    args: config.args,
    exclusive: config.exclusive,
    ...(config.toolCallTimeoutMs === undefined ? {} : { toolCallTimeoutMs: config.toolCallTimeoutMs }),
  })
}
```

Profile 先装载 `browserUse`、`agents`、`tools`、`systemPrompt`，再装载本插件；同一 Profile 不能同时装载另一个 Browser provider。外部 MCP server 的安装、浏览器可执行文件、登录状态和访问权限由部署管理。插件卸载由 `mountSessionMcp` 关每个活跃连接、等待操作并释放 slot；不要在自己的 `dispose` 中先释放 `browserUse.register()`。恢复 Session 会取得新激活资源，不复用先前页面句柄。`exclusive:false` 适合每 Session 各自启动独立实例；接入同一已存在浏览器须 `exclusive:true`。

隔离消费包 `evidence/tests/browser-computer-consumer/` 对发布声明编译并验证两个 registry 的独占、插件卸载及本 wrapper 注册；不启动 MCP server、Chromium 或桌面 CUA driver。真实端到端 Browser 运行要在目标 Profile 使用部署提供的 MCP server 验证工具发现、Session 隔离、取消与关停；记录边界见 `evidence/runtime/browser-computer-use-review.md`。
