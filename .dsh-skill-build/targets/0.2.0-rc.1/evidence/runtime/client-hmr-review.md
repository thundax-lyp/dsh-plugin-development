# `dsh-v0.2.0-rc.1` Web Client HMR 裁决

- 精确 commit：`4878cdabd87d4041bdaff61d04c966883b9fd07a`。
- `packages/client/hmr/package.json` 发布根、`./client`、`./invariant` 三个入口，manifest 的 `dsh.client` 指定 Web Client 和 `dsh-client-modules` 注入。
- `packages/client/hmr/src/index.ts` 是 Host 侧：依赖 `clientModules` 与 `webServer`，按 bundle 文件元数据轮询并发布 `rebuilt`，通过精确 SSE 路由提供图及重建通知；watch、图订阅、路由和连接均在 effect disposer 中清理。
- `packages/client/hmr/src/client/index.ts` 是浏览器侧：EventSource 消息经 JSON 与 envelope 检查后进入 Client Modules 的图同步或条目重载；EventSource 在 effect 卸载时关闭。`src/events.ts` 定义帧分支和端点。
- `packages/client/hmr/src/invariant.ts` 是单独的可选 companion，检测包所有权对应的 watcher 资源残留。它不是普通 UI 插件的手工调用面。
- `packages/bundle/web-app/cordis.patch.yml` 明确挂载 Host `client-hmr`。包 README 的页面行为描述仍需和 Client Modules 的实现、浏览器测试及独立消费结果核对；本轮未执行这些测试。
