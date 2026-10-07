# Workspace activity 与 LSP 独立消费验证

- 精确源：`dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`，`packages/workspace/workspace/src/index.ts` 与 `types.ts`、`packages/lsp/lsp/src/index.ts` 与 `types.ts`、`packages/lsp/tool-lsp/src/index.ts`。
- 独立包：`evidence/tests/workspace-lsp-consumer`，从 npm 安装目标精确版本及 `@deepseek-ai/cordis@4.0.4`，未从 checkout 私有路径导入。
- 执行：`npm install --ignore-scripts --no-audit --no-fund` → 成功；`npm run smoke` → TypeScript 编译成功，真实 Cordis/Fs/Lsp 运行输出 `workspace activity and LSP provider smoke passed`。
- 观察：`.note` hover 路由、unsupported operation code、fiber 卸载后 `LSP_UNAVAILABLE`；活动 waterfall 含 review 项、stop 事件发 abort、任务结算后活动消失。
- 两份 HOW-TO 的 `package.json`、`tsconfig.json` 与 TypeScript 代码块分别原样抽取到 `howto-workspace` / `howto-lsp`，均由目标版本 npm 声明 `tsc -p` 编译通过。
- 未运行：完整 WorkspaceRegistry + storage-domain 的 archive 写入与恢复；真实 stdio language server、tool-lsp 交互、权限入口；这些不能由事件/Lsp seam smoke 推断。

## parent 集成候选

- API 包：`@deepseek-ai/dsh-workspace` / `WorkspaceRegistry`、`Workspace`、`SessionActivity`、`SessionActivityKindMap`、两个事件；路由 `api-guardrails/workspace.md`，任务 `how-to/how-to-contribute-workspace-activity.md`，任务 heading `向工作区归档报告插件活动`。
- API 包：`@deepseek-ai/dsh-lsp` / `Lsp`、`LspService`、`LspProvider`、`LspQueryRequest`、`LspQueryResult`、`LspError`；路由 `api-guardrails/lsp.md`，任务 `how-to/how-to-register-lsp-provider.md`，heading `注册工作区内的 LSP provider`。
- `@deepseek-ai/dsh-lsp-stdio` 与 `@deepseek-ai/dsh-tool-lsp` 是相邻真实产品插件；此轮仅说明其与 provider seam 的关系，不将它们的完整 Profile 操作记为已验证任务。
