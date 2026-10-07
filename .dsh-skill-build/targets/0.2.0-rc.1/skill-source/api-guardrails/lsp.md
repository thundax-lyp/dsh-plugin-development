# LSP provider 注册与查询

## 目标版本和入口

目标为 `dsh-v0.2.0-rc.1`（commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`）。`@deepseek-ai/dsh-lsp` 默认导出 `Lsp` 服务，在 Host 提供 `ctx.lsp`；导出 `LspProviderId`、`LspError`、`finalExtension` 与 provider/query/result 类型。可运行的自定义 provider 见[注册 LSP provider](how-to-register-lsp-provider.md)。

## 契约

| 公开对象                               | 成员与约束                                                                                                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `LspService` / 默认 `Lsp`              | `registerProvider(provider): () => void` 原子占用 ID 和扩展名，disposer 同时释放；`query(request,signal?)` 路由并转发取消。默认导出只是具名 `Lsp` Service 的别名。 |
| `LspProvider`                          | `id: LspProviderId`、`extensionToLanguage`（小写前导点扩展名到 language id）、`query(request,signal?)`；provider 自己拥有文件访问、语言服务器、超时和取消。        |
| `LspOperation`                         | 闭合联合 `goToDefinition`、`findReferences`、`goToImplementation`、`hover`；不提供任意 JSON-RPC 操作。                                                             |
| `LspPosition` / `LspRange`             | `line`、`character` 为零基 UTF-16；range 的 `start`、`end` 为半开区间。                                                                                            |
| `LspQueryRequest` / `LspProviderQuery` | 调用方给 `operation`、`filePath`、`position`、`workspaceRoot`；后者由注册表另加 `languageId`，provider 不应依赖调用方自报语言。                                    |
| `LspLocation` / `LspHover`             | location 有 `uri`、`range`；hover 有 `contents` 和可选 `range`。URI 可指向不同执行世界，不能直接拼成本机路径。                                                     |
| `LspQueryResult`                       | `locations` 臂携带 `locations` 和 provider 规范化的 `resolvedWorkspaceUri`；`hover` 臂携带 `LspHover \| null`。调用方按 `kind` 判别并自行限制结果。                |

`Lsp` 是 `ctx.lsp` 的服务类型，`LspProviderId` 是 provider 身份，`LspError` 承载稳定错误码；`finalExtension(filePath)` 实现本服务使用的末段扩展名提取规则。

`ctx.lsp.registerProvider({id,extensionToLanguage,query})` 同时保留稳定 provider ID 与文件扩展名；非法映射或与现有 ID/扩展名冲突时整体失败，卸载调用方 fiber 或显式 disposer 释放全部保留项。扩展名规范化成小写前导点；仅文件名的最后一个扩展名参与路由，dotfile、无扩展名和无 provider 会得到 `LSP_UNAVAILABLE`。`ctx.lsp.query(request,signal?)` 根据扩展名选择 provider、注入注册表中的 `languageId`、原样转发取消信号。路由与注册先后无关。

请求必须给 `workspaceRoot`、`filePath`、零基 UTF-16 `position` 以及四选一 `operation`：`goToDefinition`、`findReferences`、`goToImplementation`、`hover`。provider 自行规范化和约束路径、限制工作区访问、实现取消并为缺乏能力的操作明确失败。`hover` 返回 `{kind:'hover',hover:...|null}`；导航返回 `{kind:'locations',locations,resolvedWorkspaceUri}`，其 URI 基于 provider 规范工作区，供调用方安全相对化。消费者负责超时和结果上限；服务不提供任意 JSON-RPC、进程或文档控制入口。

`@deepseek-ai/dsh-lsp-stdio` 是目标发布的真实语言服务器 provider 插件，按工作区惰性管理 stdio server；`@deepseek-ai/dsh-tool-lsp` 是模型工具消费者，把模型的一基光标转换为本服务零基光标，并施加工具层策略。自定义 provider 不应声称自己执行了语言服务器协议；下面示例仅为 `.note` 的本地 hover provider。

## 验证边界

独立消费包在目标 npm 声明下编译，并在真实 Cordis + fs-local + Lsp 中验证查询、unsupported operation、fiber 卸载后路由释放。未启动 stdio 语言服务器，未验证 tool-lsp 的模型调用链。
