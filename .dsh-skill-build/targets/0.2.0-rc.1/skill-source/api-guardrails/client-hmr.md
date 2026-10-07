# Web Client 插件图热重载

## 何时使用与装载侧

目标版本的 `@deepseek-ai/dsh-client-hmr` 是 Web 插件图同步机制，和 Host Profile 配置监视的 [DSH HMR](api-host-hmr.md)分属两条路径。`packages/bundle/web-app/cordis.patch.yml` 在 Host 树中挂载包根入口；包 manifest 的 `dsh.client` 元数据声明 Web Client 插件，并注入 `@deepseek-ai/dsh-client-modules`。`./client` 子路径是浏览器半边的 Cordis 插件。普通 Client UI 插件作者不需要手写 SSE；需要先把自己的 Client 包、构建物和 Host 图注册到 Client Modules，再由此机制通知已打开的页面。

开发时 `pnpm run dev:web` 启动构建监视；构建器在同包 chunk 写完后更新入口 `lib/client.js`。Host 侧按 `pollIntervalMs` 读取图中各 Client bundle 的文件元数据，发现已发布的新修订后调用 `clientModules.rebuilt(id)`。它还通过 `/plugins/events` SSE 推送完整图或单包 `rebuilt` 事件。浏览器侧 `EventSource` 接收后交给 `ctx.modules.entries.sync(graph)` 或 `reload(id, rev)`；具体旧 fiber 清理、代码预取、重新激活由 Client Modules 所有。前端只观察到改动并不能证明 Host fiber 也已重启。

## 公开契约

| 导出或对象                                      | 插件作者需要的边界                                                                                                                                    |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 根 `name`、`inject`、`apply(ctx, config)`       | Host 插件需要 `clientModules` 与 `webServer`；自身在 `ctx.effect` 中注册图监听、轮询器和 SSE 路由，卸载时关闭订阅、定时器与连接。                     |
| 根 `Config.pollIntervalMs?`                     | schema 默认 `500` 毫秒，必须至少为 `1`；作用于 Host 的 Client bundle stat 轮询。                                                                      |
| `PluginsEventFrame.type`                        | 判别字段为 `"graph" \| "rebuilt"`；`graph` 分支含 `graph: WebBootGraph`，`rebuilt` 分支含 `id: string` 和 `rev: string`。共享类型不等于信任网络输入。 |
| `EVENTS_ENDPOINT`                               | Host 的精确 SSE 路径 `/plugins/events`；浏览器使用文档相对的路由形式。                                                                                |
| `./client` 的 `name`、`inject`、`apply(ctx)`    | 浏览器插件依赖 `modules`，监听 SSE，解析 JSON 与帧 envelope；异常记录到 Client logger，卸载时关闭 `EventSource`。                                     |
| `./invariant` 的 `name`、`inject`、`apply(ctx)` | 可选的包所有权检查伴随插件，要求 `invariants` 服务；普通 Client UI 插件不直接调用它。                                                                 |

Host SSE 新连接收到当前图；之后图变化和 bundle 重建分开发帧。浏览器会丢弃未知类型，记录格式错误，完整图的字段再由 Client Modules 解析。构建失败不会产生可用的新 bundle；下载失败时旧插件继续服务，旧 fiber 清理后导入或激活失败则不恢复旧 bundle。重新装载会重建插件内部 React 状态；Session、工作区与连接状态属于其他层。这个包不直接添加模型工具、消息或 token。

`PluginsEventFrame.type` 是插件变更事件判别字段；Client 收到事件后应按该类型更新可见状态，并在模块卸载时撤销监听。

## 验证与限制

先核对 Web 组合的 Host `client-hmr` 行、目标包的 `dsh.client` manifest 和产物 `lib/client.js`。启动 Web 与构建监视，修改自有 Client 插件，观察 Host 图修订、`/plugins/events` 的 `rebuilt` 帧、页面中旧组件清理及新组件激活；再禁用插件并观察图同步。`curl` 或 SSE 收到帧只证明传输，不证明浏览器激活成功。目标仓库有 Host 轮询与 Client 控制器测试；本次创建没有运行独立 Client 插件的端到端热更，因此上述消费端观察仍待验证。
