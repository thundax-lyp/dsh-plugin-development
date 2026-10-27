# 完整示例：接入本地加法 MCP 服务器

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。Host 的 `dsh-mcp-client` 启动受信本地服务器并把它的工具注册到模型；此例无网络调用，不需要 Client 代码或 Remote 声明。连接及代际规则见 [MCP client](../api/api-capabilities-dsh-mcp-client.md)。MCP 服务器运行在宿主上，其权限由启动环境决定。

## 本地服务器

建立 `mcp-add-server/package.json`：

```json
{
    "name": "local-mcp-add-server",
    "version": "0.1.0",
    "private": true,
    "type": "module",
    "dependencies": {
        "@modelcontextprotocol/server": "2.2.0",
        "@modelcontextprotocol/node": "2.0.0",
        "zod": "4.4.3"
    }
}
```

建立 `mcp-add-server/server.mjs`：

```js
import { McpServer } from '@modelcontextprotocol/server'
import { serveStdio } from '@modelcontextprotocol/server/stdio'
import { z } from 'zod'

function createServer() {
  const server = new McpServer(
    { name: 'local-add', version: '0.1.0' },
    { capabilities: { tools: { listChanged: true } } }
  )
  server.registerTool('add', {
    description: '计算两个数的和。',
    inputSchema: z.object({ a: z.number(), b: z.number() })
  }, async ({ a, b }) => ({
    content: [{ type: 'text', text: String(a + b) }]
  }))
  server.registerTool('refuse', {
    description: '用于检查规范错误结果。',
    inputSchema: z.object({})
  }, async () => ({
    content: [{ type: 'text', text: '该测试操作被拒绝' }],
    isError: true
  }))
  return server
}
serveStdio(createServer)
```

运行 `pnpm install`。用 `pwd` 取得服务器目录的绝对路径，后面的 `SERVER_DIRECTORY` 替换成该路径。不要在 stdout 写调试日志，因为 stdio transport 将其视为协议字节。

## 配置 bundle

建立 `mcp-add-bundle/package.json`：

```json
{
    "name": "dsh-local-mcp-add-bundle",
    "version": "0.1.0",
    "type": "module",
    "files": ["cordis.patch.yml"],
    "engines": { "dsh": "0.2.1-rc.3" },
    "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
}
```

建立 `mcp-add-bundle/cordis.patch.yml`，替换服务器绝对目录：

```yaml
- insert:
    - id: local-mcp-add
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        transport: stdio
        serverName: localadd
        command: node
        args: ['SERVER_DIRECTORY/server.mjs']
        cwd: SERVER_DIRECTORY
        failOnStartupError: true
        toolCallTimeoutMs: 10000
        reconnect:
          enabled: true
          initialDelayMs: 100
          maxDelayMs: 1000
          maxAttempts: 3
```

`dsh` 安装随附 MCP client，但没有默认 MCP server。配置不复制 adapter，不需要单独导入其私有 connection 实现。`command` 和 `args` 直接传给进程，不能依赖 shell 展开。

## 装载、调用与恢复

以下使用全新的隔离 home，以保证示例 Profile 同时具有基础服务与 Web UI。在当前 shell 先执行：

```sh
export DSH_HOME="$(mktemp -d)"
dsh --profile mcpdemo --from-default-profile web --dump-config
```

此初始化仅针对刚建立的空 home；对已有 Profile 使用 `--from-default-profile` 会替换其原有目录。后续安装、启动和卸载均在同一 shell 中执行。


从 bundle 的父目录运行 `dsh plugin --profile mcpdemo add ./mcp-add-bundle`，运行 `dsh --profile mcpdemo`。向模型明确请求调用 `mcp__localadd__add`，参数 `{ "a": 2, "b": 3 }`，观察规范文本结果 `5`。调用 `mcp__localadd__refuse` 应保留 `isError`，不能伪装成成功。

启动时服务器缺失或协议错误应阻断此实例激活，因为已设置 `failOnStartupError: true`。运行中停止服务器进程，确认旧工具 generation 被撤回或进入重连，再恢复服务器，确认新 generation 可调用。每次重连都启动新的 stdio server，不能把先前 transport 活对象继续复用。

调用取消会向 SDK 请求传递取消；本例加法立即返回，没有长任务可观察的取消窗口。验证真正慢调用时增加服从 request signal 的服务器任务；不能把快速成功当作取消通过。

## 清理与完成判据

卸载实例时 transport 关闭、服务器子进程结束、命名空间工具和服务器 instructions 一并撤回，backoff 不得继续启动进程。执行 `dsh plugin --profile mcpdemo remove dsh-local-mcp-add-bundle`，重启后确认工具不可见。接入成功同时要求真实工具发现、一次返回 5、一次规范错误、连接中断恢复和最终无残留子进程；仅 YAML 解析或 API 类型检查不足以证明这些行为。
