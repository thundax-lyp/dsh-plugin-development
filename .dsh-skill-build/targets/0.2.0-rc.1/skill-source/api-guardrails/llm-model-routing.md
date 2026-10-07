# Agent 模型选择与路由

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-agent` 根导出 `ModelSelection`、`ModelSelectionRef` 与 `installModelSelection`，供 Agent 入口把当前模型绑定到 prompt assembly 和请求配置。`@deepseek-ai/dsh-agent-default-model` 根导出 `AgentDefaultModelConfig`，提供新 Agent 默认 provider/model/可选 reasoning effort。Web Session 选择经 `@deepseek-ai/dsh-api-session-controller` 的 `selectModel` Remote；该包的 `./types` 包含 wire 类型。Provider 注册和目录详见 [LLM Provider](api-llm-providers.md)，配置表单和凭证详见 [设置](api-settings.md)、[凭证](api-credentials.md)。

## 契约与运行语义

`ModelSelection` 必需 `provider: string`、`model: string`，可选 `reasoningEffort: ReasoningEffortId`；同名的 Session wire 类型把 effort 作为 `string`。`installModelSelection(agentCtx, ref)` 在 Agent scoped context 注册三个 listener，返回 disposer；在 prompt assembly 时快照 `ref.current` 到 `ref.assembled`，后续 `agent/request` 采用同一选择，并清除继承而本次未指定的 effort。并发切换只影响后续 step，不把一次 assembly 分成两个 route。provider/model 切换会在下一次实际入站请求前增加可从 Session 重建的 user-role notice；仅 effort 改变或不发送请求不加 notice。请求 header 记录前失败会在下次重试该 notice。

`AgentDefaultModelConfig.Config` 的三个字段是 `Volatile`：provider/model 为必需字符串，reasoningEffort 可省略。`currentSelection()` 每次读取现值；`saveSelection(next)` 在有配置编辑器时按顺序提交 Profile 默认项，无编辑器/entry 时维持组合值而不写文件。它影响未来新 Session/未指定的 Agent，不等于修改现有 Session 的已选择路由。

Web Session 的 `selectModel({sessionId, provider, model, reasoningEffort?})` 先要求 provider 已注册、该 model 出现在当前 `listModels()`，再通过 `ctx.llm.resolveCallConfig()` 校验和补齐精确模型选项；然后把 `model/selection` 追加到该 Session，并异步保存默认项。返回 `{ selected }` 不等待默认持久化，保存失败只记录警告，Session 选择仍成立。`modelCatalog()` 将已注册 provider 的成功非空模型组、默认项、失败组和可路由 provider id 提供给界面；一个 provider 目录失败不清空别的组。`modelAvailable` 是 GUI 入口的目录门禁，而直接 `ctx.llm.stream()` 的核心路由不依赖目录成员资格。

## 对象类型与成员

| 对象                           | 公开成员与状态                                                                                                                                           |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ModelSelection` (`dsh-agent`) | `provider`、`model` 必需；`reasoningEffort?` 是 adapter-owned `ReasoningEffortId`。                                                                      |
| `ModelSelectionRef`            | `current: ModelSelection \| undefined` 可由入口更新；`assembled` 为本步已捕获快照；所有者在 Agent scope 卸载时调用 `installModelSelection` 的 disposer。 |
| `AgentDefaultModelConfig`      | `currentSelection(): ModelSelection`；`saveSelection(next): Promise<void>`；Config 三个 `Volatile` 字段。                                                |
| `SessionSelectModelRequest`    | `sessionId: SessionId` 加 `provider`、`model`、`reasoningEffort?`。                                                                                      |
| `SessionSelectModelValue`      | `selected: ModelSelection`，Host 规范化后值。                                                                                                            |
| `ModelSelectionProjection`     | `lastUsed: ModelSelection \| null` 为最新请求 header；`next: ModelSelection \| null` 是 pending 或 lastUsed。                                            |
| `ModelCatalog`                 | `default`、`routableProviders`、`groups`、`failures`；模型条目可携带 effort 名称/默认值。                                                                |

## 生命周期与状态

Session Controller 的 `modelSelection` projection 折叠 `model/selection` 意图与 `request/header` 实际使用：pending 代表尚未消费的选择，匹配的 header 消费它；`next` 回退到 lastUsed。创建或恢复 Agent 时，入口优先取 pending，若无则取最近 header，再无则取当前默认服务配置。持久状态来自 Session 日志和 Profile patch，不能仅靠 `ModelSelectionRef.current` 跨重启。Adapter 解析的默认 effort 不当作显式会话选择恢复。

## 失败、权限与边界

Session Controller 将不可用 provider/model、目录异常、无效 effort 等映射为 `session/model-unavailable` Remote 错误；Session 选择和默认保存是两个不同提交时点，后者可失败。GUI 目录可隐藏没有可列模型的 provider；新增 adapter 若需可被用户选择，必须提供非空、有效且可解析的模型目录。凭证缺失可使实际请求失败，即使目录中出现模型。Agent 作用域监听器的 disposer 必须随 Agent 生命周期释放；不要自行追加 `model/selection` 后绕过入口的可用性校验与缓存更新。

## 验证

源码：`packages/core/agent/src/model-selection.ts`、`packages/core/agent-default-model/src/index.ts`、`packages/api/session-controller/src/{agent,commands,catalog,model-selection-projection,types}.ts`。测试线索：`packages/core/agent/tests/model-selection.spec.ts`、`packages/api/session-controller/tests` 的模型选择用例。需在目标 Profile 中核对实际 provider 目录、一次 Session 选择、下一请求 header、notice、重启投影及默认保存故障；这些行为验证尚未运行。
