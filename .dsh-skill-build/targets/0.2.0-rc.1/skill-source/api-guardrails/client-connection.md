# Host 与 Client Connection

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1` 的 Host 侧从 `@deepseek-ai/dsh-client-connection` 根入口导入 `HostConnectionHandle`、`ConnectionFetchRoute`、`ConnectionRpcHandler` 等类型和 `API_PATH`；`ctx.connection` 由该 Host 插件提供，依赖 `credentials`，存在 `webServer` 时额外挂载受保护的 `/api`。Client 侧单独从 `@deepseek-ai/dsh-client-connection/client` 导入 `ConnectionHandle`、`installConnection` 和相关类型；不能在 Host 入口导入浏览器运行时代码。正式 Web Profile 同时装载双侧，前者只为插件扩展提供承载与服务，Gateway 才拥有 Remote 语义。WebServer 的原始路由见 [Web HTTP 入口](api-web-ingress.md)。

## 契约与运行语义

Host `ctx.connection.fetch.register(route)` 在共享 `/api` 下注册一个精确 Fetch route。`path` 必须是合法 `/api/<endpoint>`，`methods` 非空且不能重复，`requestBody` 为 `buffered` 或 `streaming`；handler 接受标准 `Request` 并返回 `Promise<Response>`。Connection 的 Web carrier 在调用前进行 Host/Origin 和 browser-session 检查；相同 path 重复注册抛错，返回异步 disposer，调用者需归入 fiber。这个入口适合浏览器原生下载、上传或流式响应；不需要再抢占 WebServer `/api` prefix。

`ctx.connection.rpc.handle(channel, handler)` 创建非 `/api` 的逻辑 RPC channel 及其 Web prefix route；channel 必须匹配单段绝对路径，保留的 `/api` 会拒绝。handler `(endpoint, payload, signal, peer) => Promise<ConnectionRpcHandlerResult>`，`peer` 是 admitted operator；调用者负责 endpoint/payload 校验、取消与规范结果。`ctx.connection.rpc.intercept('/api', matches, handler)` 只为共享 `/api` 的一个 interceptor 席位，匹配器同步判别 endpoint；重复占用抛错。`createSharedFetchHandler('/api')` 是已认证请求的调度器，不自行做门禁，不应当暴露为未经保护的新路由。

Host `connection/request` 是已认证 `/api` HTTP 请求的 Cordis waterfall：监听器接收 `(IncomingMessage, ServerResponse, next: () => Promise<void>)`，可在调用 `next()` 前后包装 bridge；若拦截，则自己持有并结束响应。这个事件不是独立认证入口，不覆盖 WebServer 其它原始路由。

原始 `WebRoute` 需要显式 `ctx.connection.admit(req)`；返回 `{ peer }` 或 `{ rejection: 401 | 403 }`。`requestRejection` 只给状态；`authorizeIndex` 只针对 frontend index 的初始 token/cookie 交换；`authenticatedUrl` 生成含进程启动 token 的初次导航 URL，不能把它记录为普通 API URL 或泄漏到模型/日志。Connection `/api` 中，Host 或 Origin 信任失败为 403，未认证为 401；`trustedHosts` 只能填规范 bare `host[:port]`，非 loopback 绑定需要显式信任部署 authority。Cookie 密钥保存在 credentials 的 `client-connection/browser-session` record，浏览器 session 是按 authority 签名且有有效期的 cookie。

Client 从 Cordis `ctx.get('connection')` 取得 service，按 `ConnectionHandle` 收窄后使用；该 `./client` 入口没有把 Client handle 声明合并为 Host 的 `ctx.connection` 类型。`handle.rpc.call(channel, endpoint, payload, signal?)` 返回 `Promise<ConnectionRpcResult<unknown>>`，逻辑错误在 `{ok:false,error}`，HTTP/网络/无效 envelope 等传输错误会 reject。Web caller 发 `POST` JSON envelope 并检查关联 rpcId；可选 `rpc.open` 只属于提供该能力的 carrier，浏览器流由 Gateway WebSocket mux 负责。Client 插件消费 `generation.getSnapshot()/subscribe`、`state.getSnapshot()/subscribe`，可调用 `reconnect()`；`connection/reset` 表示新 generation，应重取由 wire 派生的 cache。`registerGenerationSource` 和 `start` 只有单一 owner，正式组合由 Gateway 占用，普通插件不应重复启动 loop。`ClientTransportHooks` 用于 shell 自有 transport，`ownsHost` 只能由确实自有 Host 的 shell 声明，不能当权限提升开关。

## 对象类型与成员

| 对象                                        | 直接使用的成员与约束                                                                                                                                                                                                                                              |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ConnectionFetchRoute`                      | 必需 `path: string`、`methods: readonly ('GET' \| 'HEAD' \| 'POST')[]`、`requestBody: 'buffered' \| 'streaming'`、`fetch(request: Request): Promise<Response>`。buffered 受 `maxRequestBodyBytes` 限制；streaming 有 backpressure，无聚合 cap，handler 自行限制。 |
| `HostConnectionHandle`                      | `rpc`、`fetch`、`operator`；`admit(request)`、`requestRejection(request)`、`authorizeIndex(request,response)`、`authenticatedUrl(baseUrl)`、`createSharedFetchHandler('/api')`。只有前两者适合原始扩展路由的权限检查。                                            |
| `HostConnectionFetch` / `HostConnectionRpc` | `fetch.register(route)`；`rpc.handle(channel,handler)`、`rpc.intercept('/api',matches,handler)`。前者按完整 path/method 占位，后两者分别管理独立 channel 和共享 `/api` interceptor。                                                                              |
| `ConnectionRpcEndpointMatcher`              | `(endpoint: string) => boolean`，传给 `rpc.intercept` 限定该 interceptor 自己处理的 endpoint；应是无副作用的判定，不能把匹配结果当认证。                                                                                                                          |
| `ConnectionRpcHandlerResult`                | 成功 `{ok:true,value,attachments?}` 或失败 `{ok:false,error:{code,message,details}}`；attachments 每项含 `path` 与 `bytes`，仅成功分支。                                                                                                                          |
| `ConnectionConfig`                          | `recovery?`；`trustedHosts?: string[]` 默认空；`cookieMaxAgeDays?: number` 默认 30；`maxRequestBodyBytes?: number` 默认 300 MiB。schema 由 Loader 填默认。                                                                                                        |
| `ConnectionRecoveryConfig`                  | `backoffBaseMs?` 默认 500 ms，`backoffFactor?` 默认 2，`backoffMaxMs?` 默认 10000 ms，`generationReadyWarnMs?` 默认 3000 ms，`generationReadyTimeoutMs?` 默认 15000 ms；Client resolver 校验有限数及正数边界，实际重试延迟在 cap 的 50–100% 范围。                |
| `ConnectionHandle` (Client)                 | `isLoopback`、`generation`、`state`、`rpc`、`reconnect()`、`registerGenerationSource(source)`、`start(sinks,config?)`。普通插件读观察状态与 rpc；generation/loop 的注册由 carrier owner 控制。                                                                    |
| `ConnectionGeneration` / `ConnectionState`  | generation `{id:number,host:{home:string}}`；state 为 `connected`、`disconnected`、`connecting`。断开时 generation 为 `undefined`；Host home 只用于路径显示缩写。                                                                                                 |

## 生命周期与状态

Host 注册句柄属于注册者 fiber，`ctx.effect` 在卸载时等待异步 disposer；进行中的请求继续完成，撤销只阻止后续请求命中。Connection service 自己持有 operator Peer，并在卸载时销毁。Client generation 来源由 Gateway 挂载；source 必须先接好增量监听再调用 `ready`，收到 abort 后停止并释放资源。断线、超时和手动 reconnect 会撤销当前 generation；消费者在新 generation 上重取 wire cache，长流自管 resume 和 baseline。Connection 不替业务对象写 Session 日志。

## 失败、权限与边界

错误的 `trustedHosts` 在加载时失败。Fetch route 无 method 所有权时回退到共享 dispatch，未匹配最终 404；RPC 请求方法、content-type、envelope 或 endpoint 不合法会被拒绝。`ctx.connection.fetch` 的 Web 路由只有当 `webServer` service 存在才物理可达，其他 carrier 需自己组装受保护的 handler。Client `rpc.call` 对拒绝的 HTTP 抛 transport error，业务失败为 result union；插件应分别处理。Host/Origin fence、cookie 并不自动为插件建立业务角色权限；需要更细的授权要在 handler 中检查。[注册受保护 HTTP 路由](how-to-register-authenticated-http-route.md) 展示原始路径的显式 admission。

## 验证

公开 Host/Client exports、实际桥接和门禁见 `packages/client/connection/src/{index,rpc,rpc-host,browser-auth,api-request-trust}.ts` 与 `src/client/{index,rpc,connection}.ts`，行为测试见 `packages/client/connection/tests`；正式 Web Profile 行在 `packages/bundle/web-app/cordis.patch.yml`。隔离 HTTP 示例的实测范围见 `evidence/runtime/web-ingress-review.md`；没有据此声称真实 Profile 或浏览器恢复已跑通。
