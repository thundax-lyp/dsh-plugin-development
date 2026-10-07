# 将插件模型加入 Session 选择路径

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。已装载、能处理 Agent 请求的 Adapter route 要出现在 Web 模型选择器中，用户选择后下一次 Agent 请求使用相同 provider/model/effort，并能在恢复时重建。需要 [Provider 契约](api-llm-providers.md)、[模型路由](api-llm-model-routing.md) 和 [Bundle/Profile](api-profile-bundle.md)。固定文本 fixture 的完整 Host 包与编译步骤见 [创建 Adapter](how-to-add-llm-adapter.md)，但它拒绝 Agent 消息，仅用于注册与直接调用验证。Web 路径另需 web-app bundle 的 Session Controller、Model Selection Client 及 Remote 装配。

## 实现步骤

1. Adapter 注册目标 provider route，`listModels(route)` 返回非空且每项 `provider` 与 route 一致、id/name 非空；`resolveModel` 对可选 id 返回精确 provider/id 和需要的 capacity、reasoning 能力。为新 Session 配置默认值时，base bundle 的 `agent-default-model` 行有 `provider`/`model` Config；应改为实际可用的 route/model 并确保 Provider 行在最终 Profile 中启用。目录可见不等于凭证可用；外部 Provider 在每次请求前仍要解析凭证。
2. 在 Web 已挂载的 Session 中，通过 Session Controller 的 `modelCatalog()` 读取可用组，从其中选一个实际可处理 Agent 消息的 provider/model，再调用 `selectModel({sessionId, provider, model})`。该 Remote 先校验目录成员和模型选项，成功将 `model/selection` 写入 Session；返回的 selected 是规范化选择。Client 应订阅或重读 `modelSelection` projection：`next` 是下次请求的选项，`lastUsed` 是最近已持久记录的请求使用值。若仅改默认值，现有 Session 不会自动改为该 route。
3. 发起下一次 Agent 请求。Agent scope 中 `installModelSelection` 在组装时捕获本次选择，`request/header` 记录实际调用；投影见到匹配 header 后清除 pending。与前次 provider/model 不同时，下一次入站请求加入模型切换 notice。仅 effort 改变不追加 notice。进程重启后从 Session 日志重建 pending/lastUsed，再由入口挂载监听器；不能将 Client 内存当成持久事实。
4. 失败时：目录没有此 id、目录读取失败或 effort 不合法，`selectModel` 返回 `session/model-unavailable`；不要写原始 `model/selection` 绕开门禁。默认项保存异步失败时，当前 Session 仍已切换，未来新 Session 可能继续使用旧默认值，需要提示用户重新检查配置。卸载 Adapter 后目录变化，旧 Session 的历史选择保留但下一次请求须处理 route 不可用。

## 验证与完成边界

当前只对固定文本 Adapter 做了独立 Host 编译、Core 注册/stream/卸载 smoke；尚未在完整 Profile 或 Web Session Controller 执行本 HOW-TO。Session 任务必须换成真正处理 Agent 消息的 Adapter，再验收 `modelCatalog()`、选择、投影的 pending/lastUsed、下一次 `request/header`、重启恢复、卸载后的不可用错误和默认保存失败告警。直接 LLM Core 流测试不能替代 Session/UI 路由验证。
