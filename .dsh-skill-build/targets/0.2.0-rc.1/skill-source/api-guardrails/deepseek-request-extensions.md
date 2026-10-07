# 官方 DeepSeek 请求字段扩展

## 目标与入口

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。`@deepseek-ai/dsh-deepseek-llm-api-extensions` 默认导出 `DeepSeekLlmApiExtensionRegistry`，服务名 `ctx.deepseekLlmApiExtensions`；`./types` 提供 `DeepSeekLlmApiExtensionMap` 与 provider/request/prepared 类型。这个入口只由目标官方 `llm-deepseek` adapter 的 Messages 请求集成，普通 `LlmAdapter` 和 `llm-pi-ai` 不自动读取。完整示例见[添加 DeepSeek 请求字段](how-to-add-deepseek-request-field.md)。

## 字段所有权与准备

| 对象                                   | 公开成员与边界                                                                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 默认 `DeepSeekLlmApiExtensionRegistry` | 具名 Registry Service 的别名；`register(field,provider)` 返回所属 fiber 的撤销函数，`prepare(request)` 形成一次调用的冻结字段。 |
| `DeepSeekLlmApiExtensionProvider`      | `prepare(request)` 可返回 `undefined` 或 `PreparedDeepSeekLlmApiExtension`；每次请求重新计算并响应取消。                        |
| `DeepSeekLlmApiExtensionRequest`       | `body` 是尚未合并扩展的只读 base JSON，另有 `sessionId?`、`purpose?`、`signal`；不能原地修改 body。                             |
| `PreparedDeepSeekLlmApiExtension<T>`   | `value` 是可复制的 JSON 字段值，`accept?()` 只在 HTTP 2xx 后调用；有副作用时须幂等。                                            |
| `PreparedDeepSeekLlmApiExtensions`     | `fields` 是聚合且冻结的字段表，`accept(): Promise<void>` 是一次请求的幂等接受动作，不是 Session 成功记录。                      |

插件先声明合并 `DeepSeekLlmApiExtensionMap`，再调用 `register(field,provider)`。field 必须是非空、已 trim 的 top-level 名，同名重复注册失败；注册与调用方 fiber effect 一起释放。`provider.prepare(request)` 每次收到尚未合并扩展字段的序列化 base body、可选 `sessionId` 和 `purpose`（`compaction` 或 `session-title`）以及请求 `signal`，可返回 `undefined` 省略本次字段，或 `{value,accept?}`。value 必须是可 structuredClone 的 JSON；注册表复制并深冻结，不能保留可修改的别名。准备失败或取消发生于 HTTP dispatch 前；注册表即使 provider 忽略取消也会停止等待，但 provider 应主动停止自身 I/O。

`prepare()` 汇总同一次请求所有 provider，返回冻结 `fields` 和幂等 `accept()`。官方 adapter 检查 extension field 不与 base body 键冲突，序列化并请求 `/messages`；仅收到 HTTP 2xx 后调用接受回调，且在产生 stream chunk 前等待完成。非 2xx 不接受；若合并体序列化失败，adapter 改发 base body、记录省略并跳过接受。接受回调的失败会聚合并映射为 `REQUEST_EXTENSION`，不会撤销服务器已经接受的请求。因此有交付后状态的插件要让 `accept` 幂等、可恢复，不应把本地计数当作可靠交付日志。

`DeepSeekLlmApiExtensionRegistry` 是官方 Adapter 的字段扩展服务；插件通过其注册器贡献自己的请求字段，并持有返回的撤销函数，不能直接修改全局请求对象。

## 配置、安全与生命周期

字段名称和值必须与使用的 DeepSeek 兼容网关约定；官方服务不保证接受自定义未知字段。不要把秘密、未经授权的 Session 信息或任意用户输入拼进扩展。插件应在可信 Host Profile 中装载 Registry、官方 DeepSeek adapter 和自己的 provider；目标 adapter 对 registry 是可选依赖，未装载时发送原请求。多个请求并行时 provider.prepare 可能同时执行；若字段有可消费状态，由插件处理并发、HTTP 2xx 后接受、失败重试和恢复。注册表本身不把 provider 状态写进 Session 日志。

`@deepseek-ai/dsh-session-log-deepseek` 是官方 DeepSeek 请求扩展水位的 Session history 组合插件；它注入 `deepseekLlmApiExtensions` 与 `sessions`，不代替第三方请求字段的注册入口。

## 验证边界

独立 npm 消费包在 Cordis 中验证声明合并、注册、准备、复制冻结、幂等接受、purpose 省略、冲突、取消和卸载。目标源码的官方 adapter 集成及其测试确认 HTTP 时序；本轮未对真实网关发请求，也未运行完整 Agent turn。
