# 语言服务 Provider 与四类查询

## 对象关系

Lsp.registerProvider 一次验证 id 与所有 extensionToLanguage 路由，全部校验成功才发布。扩展名归一为小写带点，重复扩展或其他 provider 已占用均拒绝且不留下部分注册。query 按最终扩展名路由，.d.ts 使用 .ts，dotfile 无扩展。公开查询只有 goToDefinition/findReferences/goToImplementation/hover，没有任意 JSON-RPC 逃生接口。provider 拥有服务端通信，注册 disposer 同时释放全部扩展预留。

## 选型与使用

LSP_CONFLICT、LSP_INVALID_PROVIDER、LSP_UNAVAILABLE、LSP_MALFORMED_RESPONSE 和取消分开处理；不能对无 provider 的语言捏造空成功结果。

- [@deepseek-ai/dsh-lsp-stdio.](api-runtime-dsh-lsp-stdio.md)：模块和公开对象。
- [@deepseek-ai/dsh-lsp.](api-runtime-dsh-lsp.md)：模块和公开对象。
- [@deepseek-ai/dsh-tool-lsp.](api-runtime-dsh-tool-lsp.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-lsp.md)说明配置、调用和清理顺序。
