# `dsh-v0.2.0-rc.1` Host HMR 裁决

- 精确 commit：`4878cdabd87d4041bdaff61d04c966883b9fd07a`。
- `packages/boot/hmr/package.json` 发布 `@deepseek-ai/dsh-hmr` 根入口；`packages/boot/hmr/src/index.ts` 公开默认 Host Service、`HmrConfig`、`Reload`，通过声明合并给 `Context` 增加 `hmr` 及两个事件。
- `packages/bundle/base/cordis.patch.yml` 插入 `hmr` 行，Profile 场景启用，`root: []`。`apps/cli/tests/profile-hmr.spec.ts` 核查 base/web、headless/sdk/acp、sdk-minimal 的组合差异。这是仓库测试证据，不是本次运行结果。
- `packages/boot/hmr/src/index.ts` 构造时检查 Loader 的 Node 内部模块图；`runExclusive` 串行并拒绝嵌套或已释放服务；`watchConfig` 包裹 `watch-config.ts` 的绝对路径 watcher，disposer 等待清理；Profile manifest 与两级 patch 的重组在应用就绪后运行。`root: []` 不取消独立配置 watch。
- `vendor/hmr/src/index.ts` 是仍发布的 Cordis HMR 服务，没有 DSH 的 Profile 配置 watch/事务路径；其公开入口待单独裁决。`packages/client/hmr` 是另一侧的浏览器模块图机制，本轮未裁决。
- 目标 checkout 没有 `node_modules`，本轮没有运行仓库 HMR 测试。隔离 `profile-consumer` 已安装发布的 `@deepseek-ai/dsh@0.2.0-rc.1`；`evidence/tests/profile-consumer/hmr-profile-smoke.mjs` 对它的 `demo` Profile patch 做原子写入、改值和还原，实际输出记录在 `hmr-probe.result`：`active: first`、`disposed: first`、`active: second`、`disposed: second`。脚本在 `finally` 中还原 patch 并向进程发 SIGINT。此观察只覆盖 Profile 自身 patch 的热重组，不覆盖 manifest 或源码模块热更。
