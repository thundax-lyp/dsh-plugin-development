# 如何注册受保护的 Host HTTP 路由

## 目标与前置

在 `dsh-v0.2.0-rc.1` Web Profile 中添加 `GET /probe`，先经过该 Profile 已装载的 Connection 浏览器身份与 Host/Origin 检查，再返回 JSON。Host 包使用 `@deepseek-ai/dsh-host-webserver` 的 `WebRoute` 与 `@deepseek-ai/dsh-client-connection` 的 `ctx.connection.admit`；两项 API 的完整契约分别见 [Web HTTP 入口](api-web-ingress.md) 与 [Host Connection](api-client-connection.md)。本例只展示只读、无业务状态的 route；敏感写操作仍须做业务授权、输入约束和 CSRF 设计。

正式 Web bundle 已有 `webserver`、`connection` 行，且 `connection` 依赖 `credentials`，所以插件只需在这些服务之后挂载。独立消费包需 Node 22.19+ 或 24+、TypeScript 6，并将三个包锁到以下精确版本；不能引用上游 monorepo 的内部源码路径。

## 实现步骤

1. 创建下列独立包。`cordis.patch.yml` 的 `insert` 行让 bundle 加载 Host 插件；消费项目把这个包选入自己的 Web Profile/bundle，并确保服务依赖可解析。该 patch 只写插件行，不改既有 Web 配置。

`package.json`：

```json
{
  "name": "dsh-web-ingress-consumer-rc1",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-host-webserver": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-connection": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-host-webserver": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-connection": "0.2.0-rc.1",
    "@types/node": "^22.19.0",
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
    "rootDir": "src",
    "outDir": "lib",
    "declaration": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: example-protected-probe
      name: dsh-web-ingress-consumer-rc1
```

2. 写 `src/index.ts`。门禁先于 method 与任何业务处理；Connection 的拒绝状态原样返回。`ctx.effect` 把 route 绑定到插件 fiber，避免卸载后遗留路径。

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-host-webserver'
import type {} from '@deepseek-ai/dsh-client-connection'
import type { WebRoute } from '@deepseek-ai/dsh-host-webserver'

export const name = 'example-protected-probe'
export const inject = ['webServer', 'connection']

export function apply(ctx: Context): void {
  const route: WebRoute = {
    kind: 'exact',
    path: '/probe',
    handler(req, res) {
      const admission = ctx.connection.admit(req)
      if ('rejection' in admission) {
        res.writeHead(admission.rejection, { 'content-type': 'text/plain; charset=utf-8' })
        res.end(admission.rejection === 401 ? 'unauthorized' : 'forbidden')
        return
      }
      if (req.method !== 'GET') {
        res.writeHead(405, { allow: 'GET' })
        res.end()
        return
      }
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify({ ok: true }))
    },
  }
  ctx.effect(() => ctx.webServer.register(route), 'example: protected probe')
}
```

3. 执行 `npm install && npm run build && npm pack --dry-run`。消费项目按自己的 bundle 装载流程选入此包及 patch，再启动目标 Web Profile；正式 Web Profile 中 `webserver` 和 `connection` 已分别由 Web bundle 的同名行提供。检查 Loader fiber 没有因缺少 service、重复 exact route 或监听失败而 FAILED。用该 Web 应用启动 URL 完成 Connection 的初次 token/cookie 交换；携带浏览器 cookie 请求 `/probe` 应返回 `200 {"ok":true}`。未认证请求应 401，Host/Origin 不被信任应 403，已认证 POST 应 405。卸载插件后 `/probe` 不再命中本插件；正式 Web SPA fallback 可能返回自己的响应，因此不要要求一定是 404。

## 验证与完成边界

隔离 fixture 的 `npm run build`、pack dry-run 与运行中 WebServer/Connection 请求验证了公开声明、实际 token→cookie 交换、未认证 401、跨站与不可信 Host 403、认证后 JSON 200、方法 405 和卸载后不再命中；它使用仅保存当前进程记录的凭证替身，不能证明凭证持久化。正式 Web Profile 的 Loader、真实浏览器、LAN 暴露与 SPA fallback 卸载行为仍需在消费项目逐项运行。这个 route 没有异步任务或持久事实，所以无需取消信号或 Session 恢复；增加流或写操作时必须补齐客户端断开、资源清理和业务记录。
