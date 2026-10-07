# DeepSeek 请求字段扩展核查

- 精确源：`dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`，`packages/llm/deepseek-llm-api-extensions/src/{index,types}.ts`；消费端 `packages/llm/llm-deepseek/src/{host,request-extensions,adapter}.ts`，集成测试 `packages/llm/llm-deepseek/tests/extensions.spec.ts`。
- 独立 npm 包：`evidence/tests/deepseek-request-extension-consumer`，安装精确 rc.1 包和 Cordis 4.0.4；`npm install --ignore-scripts --no-audit --no-fund` 与 `npm run smoke` 通过，输出 `DeepSeek request extension registry smoke passed`。
- 实际观察：字段类型声明合并、注册、准备冻结、accept 多次调用只提交一次、auxiliary purpose 省略、重复字段拒绝、插件 fiber 卸载后字段消失、已取消请求拒绝。
- HOW-TO 的 manifest、tsconfig 与 TypeScript 代码块原样抽到 `howto-request-field`，以精确 npm 声明单独 `tsc -p` 通过。
- 官方 adapter 源码和目标测试显示扩展进入 Messages body，HTTP 2xx 后、首个 stream chunk 前 accept；准备/接受失败映射 `REQUEST_EXTENSION`，序列化失败的扩展被省略且不接受。这里只做代码与现有测试核查，未独立启动官方 adapter HTTP mock 或真实网关。
- 未验证：真实 DeepSeek/兼容网关对自定义字段的接受、完整 Agent turn、重启恢复、并发交付事实。自定义字段需要独立网关协议支持。

## parent 集成候选

- API 包 `@deepseek-ai/dsh-deepseek-llm-api-extensions`：`DeepSeekLlmApiExtensionRegistry`、`DeepSeekLlmApiExtensionMap`、`DeepSeekLlmApiExtensionProvider`、`DeepSeekLlmApiExtensionRequest`、`PreparedDeepSeekLlmApiExtensions`。新 reference `api-guardrails/deepseek-request-extensions.md`；任务 `how-to/how-to-add-deepseek-request-field.md`，heading `添加 DeepSeek 请求字段`。
- 已有 `llm-providers.md` 与 `llm-model-routing.md` 覆盖通用 Adapter 和 Session 路由，此轮不重复。该扩展属官方 DeepSeek adapter 特定请求字段，不是所有 LLM Provider 的通用 hook。
