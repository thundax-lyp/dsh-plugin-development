# Web HTTP 入口与路由所有权

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1` 的 Host 插件从 `@deepseek-ai/dsh-host-webserver` 根入口使用 `WebServer`、`WebRoute`、`WebUpgradeRoute` 和 `Config`。`ctx.webServer` 是已装载的 Cordis service；插件声明 `inject = ['webServer']` 后才能注册。该 service 只负责 Node HTTP 路由、upgrade、压缩和 index 注入，不提供认证或静态文件服务。要复用 Web 应用的浏览器身份与 Host/Origin 检查，结合 [Host Connection](api-client-connection.md) 的 `ctx.connection.admit`，或把 Fetch 路由直接注册到 `ctx.connection.fetch`。完整组合见 [注册受保护 HTTP 路由](how-to-register-authenticated-http-route.md)。

## 契约与运行语义

`ctx.webServer.register({ kind, path, handler })` 注册 HTTP handler；exact 先于 prefix，多个 prefix 选最长路径。prefix `/probe` 只匹配 `/probe` 和 `/probe/...`。`path` 取绝对 pathname 且无末尾 `/`。handler 持有整个响应，包括结束、流式发送和客户端断开处理；WebServer 不替插件处理 method、body、身份、CSRF、跨域或内容类型。重复 `(kind, path)` 同步抛错，注册返回同步 disposer。`registerUpgrade({path,handler})` 只按 exact pathname 匹配；handler 自己负责协议协商和 socket 生命周期，重复 path 抛错。未匹配 upgrade 直接销毁 socket。

`registerFallback(handler)` 只有一个席位；正式 Web bundle 的静态文件 owner 占用该席位，扩展插件不应争用。未匹配 HTTP 请求在没有 fallback 时返回 404。`tapIndex(transform)` 在结构化注入后按注册顺序变换 HTML；`webserver/index-inject` 每次 `renderIndex` 或注入收集时收到新的可变 `IndexInjection[]`，监听器追加当前数据。`renderIndexInjections(html, rows)` 是同包公开纯函数。原始 HTML/script/style 注入必须由插件处理转义与可信内容，不能把请求参数直接插入。

一个无需 Connection 的原始 route 可以独立注册，但它的安全策略全由调用者负责；此处推荐只在已加载 Connection 的 Web 组合中使用 `admit`。WebServer `host: '0.0.0.0'` 会暴露到可达网卡，不能把 loopback 假设迁移到所有接口。正式 Web Profile 把 `webserver` 配在 `connection` 前，并在 connection 配置中注入 `webRuntime.trustedHosts`；不要从内部 bundle 路由推断额外的通用插件 API。

## 对象类型与成员

| 对象              | 成员、类型与语义                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WebRoute`        | `kind: 'exact' \| 'prefix'`、`path: string`、`handler(req: IncomingMessage, res: ServerResponse): void \| Promise<void>` 均必填；无默认 method 或认证。                                                                                                                                                                                                                                                                                                  |
| `WebUpgradeRoute` | `path: string`、`handler(req: IncomingMessage, socket: Duplex, head: Buffer): void \| Promise<void>` 均必填；handler 接管 socket。                                                                                                                                                                                                                                                                                                                       |
| `Config`          | `host: '127.0.0.1' \| '0.0.0.0'`、`port: number` 必填，port 为 0 时 OS 选端口；`compression?: 'none' \| 'gzip'` 默认 none；`compressionLevel?: number` 0–9 默认 1；`compressionThresholdBytes?: number` 默认 1024。Loader schema 填默认；手写构造调用必须给完整预期配置。                                                                                                                                                                                |
| `WebServer`       | `host` 为配置 bind literal，`port` 是监听后的实际端口；`register`、`registerUpgrade`、`registerFallback`、`tapIndex` 返回同步 disposer；`collectIndexInjections(): IndexInjection[]`、`applyIndexTaps(html): string`、`renderIndex(html): string` 由 index 响应 owner 调用。                                                                                                                                                                             |
| `IndexInjection`  | 判别式 union：`{kind:'global', name:string, value:unknown}` 在 head 设置全局值；`{kind:'script', placement:'head'\|'body', text:string}`；`{kind:'script-src', placement, src:string}`；`{kind:'script-preload', src:string}` 在 head 加预载；`{kind:'style', text:string}` 在 head 加样式；`{kind:'html', placement, html:string}` 加原始片段。`placement` 必填的分支使用 `IndexInjectionPlacement`。监听器每次收集时构造当前行，不能依赖旧数组持久化。 |

## 生命周期与状态

WebServer service 激活时监听；bind 失败使 fiber 初始化失败。插件用 `ctx.effect(() => ctx.webServer.register(route), label)` 把 route 的 disposer 归给插件 fiber，卸载即释放路由。长连接和 SSE handler 仍需自己在请求关闭/取消时停止业务资源。服务销毁时关闭 HTTP 连接并销毁跟踪的 upgrade socket。路由本身不产生 Session 持久事实；业务动作若需要恢复，应由业务层写入自己的持久状态。

## 失败、权限与边界

handler 抛错时 WebServer 记 warning；尚未发送头时回 400，已发送头时销毁响应。插件应把业务异常映射为自己的准确 HTTP 状态，不依赖这个最后兜底。请求权限须在读取 body 或产生副作用前判断；Connection 的浏览器 cookie、Host/Origin 门禁只自动覆盖它自有 `/api` 路由，不自动覆盖另一个 `webServer.register` route。HTTP upgrade 同理需要显式门禁。`0.0.0.0` 配置需要部署方确认网络与 trusted host 策略；WebServer 本身不实现 TLS。

## 验证

公开导出、匹配优先级、dispose、错误与连接关闭证据在 `packages/host/webserver/src/index.ts` 及 `packages/host/webserver/tests/webserver.spec.ts`；正式组合见 `packages/bundle/web-app/cordis.patch.yml`。隔离消费者的编译与 HTTP 实测记录见创建工作区 `evidence/runtime/web-ingress-review.md`。它不代表正式 Web Profile、浏览器 token 交换、LAN 或 upgrade 路径已验证。
