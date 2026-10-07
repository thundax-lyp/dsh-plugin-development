# rc.1 Inspector localhost 运行验证

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。公开入口和行为对应 `packages/experimental/inspector/src/index.ts`、`src/host/plugin.ts`、`src/host/bridge/controller.ts`、`src/worker/bridge/endpoint.ts`。`cordis.patch.yml` 是可安装 bundle；`cordis.source.patch.yml` 是 repo demo 的 TS 源入口 overlay。

`evidence/tests/inspector-consumer/` 从 `how-to-enable-experimental-inspector.md` 原样抽取 package 与 patch；另以目标 npm 发布包运行 `smoke.mjs`。`npm install --ignore-scripts --no-audit --no-fund` 通过。`node smoke.mjs` 实际启动 loopback Worker，验证 `/json/version` 返回 CDP 协议信息，`/ingest` 缺 protocol token 为 403、正确 token 但未授权 Origin 为 403、正确 token 与精确授权 Origin 为 101；`close()` 后旧 HTTP 端口连接失败。随后以真实 Cordis Context 加一个仅满足注入名的 `webServer` stub，装载根 Inspector 插件，确认 `ctx.inspector` 可见，fiber 卸载后 service 撤销；运行均通过。

该验证没有装载真实 WebServer，也没有验证 `webserver/index-inject`、Client 脚本、真实浏览器 CDP 操作或 fetch 捕获。`/devtools/page/<target>` 的路由源码没有 ingest token/Origin 检查；此项是源码核查结论，尚未对该 WebSocket 执行浏览器端权限测试。`clientOrigins` 只覆盖 `/ingest`，不能把它描述为整个 Inspector 的访问控制。
