# Browser Use 与 Computer Use Provider

## 两个独占能力槽

目标 `dsh-v0.2.0-rc.1` 的 `@deepseek-ai/dsh-browser-use` 与 `@deepseek-ai/dsh-computer-use` 分别提供 `BrowserUseRegistry` / `ComputerUseRegistry` service。Profile 先装载对应 registry，再装载最多一个 provider。`ctx.browserUse.register(BrowserUseProviderName(name))` 与 `ctx.computerUse.register(ComputerUseProviderName(name))` 只**预留独占 provider 名称**，返回精确异步 effect disposer；相同名字的第二次注册也抛错。`providerName` 包括资源正在关闭时仍占有的名称，只有工具停止受理、已有操作收敛、资源关停后才释放。品牌构造器只作类型标记，不验证字符串，也不创建浏览器/桌面工具。完整 Browser MCP provider 路径见 [接入 Browser MCP Provider](how-to-add-browser-mcp-provider.md)。

## 实际可用的 Browser 扩展

虽位于 `packages/experimental/`，已发布 `@deepseek-ai/dsh-experimental-browser-use-runtime` 根入口公开 `SessionResources<T>`，其 `/mcp` 入口公开 `mountSessionMcp`、`BrowserMcpConfig`、`validateBrowserMcpConfig`、`SessionMcpOptions`。这些是 rc.1 的真实 package exports，不是内部源码路径。

`mountSessionMcp(ctx,{name,exclusive,command,args,env?,toolCallTimeoutMs?})` 在插件作用域预留 Browser provider，注册 agent creation、工具执行与提示过滤 Hook。它为每个**活跃 Agent 激活**懒获取独立 MCP Client/浏览器连接，按同一 Session 串行操作；`exclusive:true` 将外部已存在的浏览器限制到一个活跃 Session。busy activation 不暴露该 browser 工具，其他 turn 可继续。卸载先关进程/连接与工具，再释放独占名称；browser 状态不随 Session 恢复转移。`command`/`args` 直接执行，不经 shell；`env` 是在 MCP client 净化环境基础上的显式覆盖。调用者要提供符合 MCP 工具协议、可关闭的服务器进程。

`SessionResources<T>` 是更底层的活跃 Agent 资源所有权原语：`available(agent)`、`get(agent,signal?)`、`run(agent,signal,operation)`、`dispose()`；`open` 必须在失败时回滚部分资源并返回 `{value,close}`，`close` 停止新操作、打断挂起工作并等待关闭。`exclusive` 的租约不得借 Session ID 复用；失败 close 会保留 entry 并拒绝 dispose，避免假称已释放独占资源。只有确需自己管理非 MCP 连接的 provider 才使用此层。

已发布的 `browser-use-playwright-mcp`、`browser-use-chrome-devtools-mcp`、`browser-use-stagehand-native` 是具体 provider；其工具、浏览器模式和外部运行时依赖由各包决定，不能从 registry 名称推断通用动作或默认装载。`BrowserMcpConfig` 支持 `mode:'launch'`（headless、可选 executablePath）或 `mode:'attach'`（endpoint），可选 toolCallTimeoutMs；`validateBrowserMcpConfig` 在资源取得前拒绝无效 attach URL。实际浏览器动作仍须新鲜状态确认，调用完成不自动证明网页目标达成。

## Computer Use 的边界

`@deepseek-ai/dsh-computer-use` registry 与 Browser registry 同形，但没有同一包中的通用桌面动作接口。已发布的 `experimental-computer-use-cua-driver-mcp` 根导出 `Config`，其字段配置和驱动启动须按该 provider 的实际声明及部署环境裁决。已发布 `experimental-computer-use-cua-driver-native` 与 `experimental-computer-use-cua-driver-mcp` 是具体 provider：它们在占用槽后通过 `ctx.tools.register` 暴露各自发现的工具，并为取消、异步操作与 driver shutdown 安排清理。作者可在自己的 provider 中组合独占注册、工具定义与驱动生命周期；不能只调用 `register()` 就宣称 computer use 已可用。桌面输入属于外部副作用，取消后先检查新鲜状态再决定重试。

## 对象类型与成员

| 对象                                                                    | 公开成员与用途                                                                                                                                                                    |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SessionResources<T>`                                                   | `available(agent)`、`get(agent, signal?)`、`run(agent, signal, operation)`、`dispose()` 管理活跃 Agent 连接；`get` 返回资源值，调用者需让拥有该对象的插件作用域执行 `dispose()`。 |
| `@deepseek-ai/dsh-experimental-computer-use-cua-driver-mcp` 的 `Config` | `command` 和 `args` 指定直接启动的可执行文件及参数；`toolCallTimeoutMs` 控制每次 MCP 调用超时；`reconnect` 是 MCP client 的重连策略。该配置只属于具体 CUA MCP provider。          |

`BrowserUseRegistry` 和 `ComputerUseRegistry` 分别是两个独占能力槽的注册服务类型。其 `providerName` 是当前提供方身份，`register` 在当前 scope 占用能力并返回撤销函数；同 scope 的第二个提供方会冲突。

## 证据和验证

基础服务与品牌：`packages/browser-use/browser-use/src/`、`packages/computer-use/computer-use/src/`；实验 Browser runtime：`packages/experimental/browser-use-runtime/src/index.ts`、`mcp.ts`；实际 provider：`packages/experimental/browser-use-*/src/index.ts` 与 `computer-use-cua-driver-*/src/index.ts`。对应 registry、resources、mcp tests 验证冲突、scope、资源释放。隔离消费验证见 `evidence/runtime/browser-computer-use-review.md`，真实浏览器/桌面驱动未由该 smoke 运行。
