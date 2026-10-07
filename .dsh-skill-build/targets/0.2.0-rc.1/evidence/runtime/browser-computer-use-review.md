# Browser / Computer Use Provider 核查

## 精确目标

`dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。对照目标 checkout 的 `packages/browser-use/browser-use/src/`、`packages/computer-use/computer-use/src/`、`packages/experimental/browser-use-runtime/src/`、具体 Browser/CUA provider 的 `src/index.ts` 与各 package exports/tests。作者文件：`api-browser-computer-use.md`、`how-to-add-browser-mcp-provider.md`、`how-to-compose-computer-use-driver.md`。目录名 `experimental` 不是排除理由：browser-use-runtime 根入口及 `/mcp`、两个 CUA driver provider 均在目标 npm package exports 中公开。

## 候选账本

| 候选 ID | 公开入口 | 归属 |
| --- | --- | --- |
| `browser-use.registry` | `BrowserUseRegistry.register/providerName`、`BrowserUseProviderName` | `api-browser-computer-use.md` |
| `computer-use.registry` | `ComputerUseRegistry.register/providerName`、`ComputerUseProviderName` | `api-browser-computer-use.md` |
| `browser-use.resources` | `SessionResources`、`OwnedSessionResource`、`SessionResourceOptions` | `api-browser-computer-use.md` |
| `browser-use.mcp` | `/mcp` 的 `mountSessionMcp`、`SessionMcpOptions`、`BrowserMcpConfig`、`validateBrowserMcpConfig` | `api-browser-computer-use.md` |
| `computer-use.cua-provider` | 已发布 native/MCP provider 的 `apply`、`Config` 组合路径 | `api-browser-computer-use.md` |

基础 registry 仅预留独占能力槽，不提供网页/桌面操作。具体工具来自 provider 的 MCP 或原生 driver 发现，不能把可注册性当作工具可用性。`SessionResources` 是真实对外导出的 lifecycle 原语，但一般 Browser MCP provider 可直接使用 `mountSessionMcp`。

## 独立验证与限制

隔离消费包 `evidence/tests/browser-computer-consumer/` 安装目标 rc.1 发布声明，`npm run build` 对 Browser MCP wrapper 与 CUA MCP 组合代码均通过；`npm run smoke` 装载真实 Cordis BrowserUse、ComputerUse、SystemPrompt、ToolRuntime、AgentRegistry，安装 Browser wrapper（未创建 Agent，因而未启动外部 MCP server），确认 `providerName`、第二 provider 注册拒绝和卸载后释放；ComputerUse registry 的独占与 disposer 同样通过；`npm pack --dry-run --json` 通过。Prettier、JSON 块检查另行执行。

没有启动实际 Browser MCP server、Chromium、Cua Driver、Agent Session、模型工具调用或桌面输入。因而没有端到端验证工具发现、浏览器隔离、取消、截图/元素新鲜度和失败恢复；这些运行规则按目标代码与已有 tests 文档化，不由本次 registry smoke 证明。
