# Webhook 规则与已验证投递

## 公开入口

目标 `dsh-v0.2.0-rc.1` 的 Host 插件从 `@deepseek-ai/dsh-webhook` 根入口使用 `WebhookRuntime`、`WebhookRule`、`WebhookRuleId`、`VerifiedWebhookDelivery` 与 `WebhookSessionRequest`。`WebhookRuntime` 是 Cordis Service，`ctx.webhookRuntime.register(rule)` 将规则挂在插件 effect 上。完整组合见 [GitHub Issue Webhook 创建 Session](how-to-create-session-from-github-webhook.md)。`@deepseek-ai/dsh-webhook-github` 是已发布的 GitHub HTTP 适配器；其公开 `Config` 使用 `source`、`path`、`secretEnv` 和 `maxBodyBytes`，并扩展 `WebhookEventMap.github`，使 `WebhookRule<'github'>` 获得 `{name,payload}` 事件类型。

## 规则契约

`register` 要求非空且全局唯一的 branded `id`、非空 `kind` 和 `run` 回调；同 ID 注册抛错。规则只接收相同 `kind` 的投递，`run(delivery,signal)` 返回 `null` 或一个 `WebhookSessionRequest`。投递在分发前被 JSON 快照并深冻结；回调必须自行验证事件专有字段。`dispatch` 是可信适配器入口，只接收**已经鉴权并解析**的投递，不是 HTTP 请求验证器；不要把未验证请求直接交给它。

非空请求只执行一个内置动作：创建 Workspace 支持的 root Session，再提交一条带 `kind:'webhook'`、provider/source/deliveryId/ruleId 的用户消息。请求必须含绝对且已存在的本地 `workspacePath`、非空 `title`、`prompt`、`agentPreset`、`permissionPreset`；可选 `model` 的 `provider`、`model` 非空，`maxTokens` 是正安全整数。runtime 先解析权限和 Agent preset，随后创建/关联 Workspace 与 Agent，再设置权限和标题，最后提交 prompt。提示内容会进入模型上下文，应把外部 payload 当作不可信数据，避免把事件字段当作开发者指令。

`dispatch` 在回调完成前返回，匹配的规则并发执行。异常被记录并隔离，调用方不能把返回值当作 Session 创建成功回执。`deliveryId` 进入消息来源，但运行时**不去重**；需要幂等的插件必须自行实现持久去重。注册 disposer 可等待：它从匹配表隐藏规则、abort `signal`、排空已启动回调。`run` 的异步副作用必须尊重取消；成功提交 prompt 后，Agent 转归通常的 Session 生命周期。创建中若关联 Workspace 或 Agent 后失败，runtime 尝试 detach/dispose 并记录回滚失败。

## GitHub 适配器与 Hooks 边界

内置 GitHub 适配器向 Host WebServer 注册精确 path，读取 `secretEnv` 的凭证引用并验证 GitHub 签名与请求体限制后才 dispatch。`GitHubWebhookEvent.payload` 是签名覆盖的 lossless JSON 对象，不是经具体事件 schema 验证的类型；例如 `issues.opened` 的 `action`、`issue`、`repository` 要在规则内检查。`source` 是已配置适配器实例名，可在规则中筛选。

`@deepseek-ai/dsh-hook-protocol` 公开 `CommandHook`、`HookDialect`、`runHook`、matcher 与日志辅助函数，属于 Hook 执行/协议库；根入口没有通用 `ctx.hooks.register` Service。`hooks-codex` 与 `hooks-claude-code` 分别实现自己的配置和映射，不应把某个 dialect 的内部执行流描述为通用 Webhook 注册 API。

## 对象类型与成员

| 公开对象                                | 可用成员与约束                                                                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `WebhookRuntime`                        | `register(rule)` effect 归属规则并返回异步 disposer；`dispatch(delivery)` 仅可信、已鉴权适配器调用，且不等待规则完成。    |
| 默认 `WebhookRuntime`                   | 根默认导出是具名 Service 的别名，不另建投递注册表。                                                                       |
| `WebhookRule<K>`                        | `id` 唯一、`kind` 只匹配同类型投递、`run(delivery,signal)` 返回单个 Session request 或 `null`；回调须响应取消。           |
| `WebhookRuleId`                         | branded 字符串构造器；不代替 `register` 的非空与唯一性检查。                                                              |
| `WebhookDeliveryId` / `WebhookSourceId` | 类型品牌区分一条外部投递和配置来源；适配器验证原请求后才填入，不是鉴权凭据，也不自动去重。                                |
| `WebhookEventOf<K>`                     | 从声明合并的 `WebhookEventMap` 取对应 kind 的事件值；规则仍须校验不可信 payload 的具体字段。                              |
| `WebhookModelSelection`                 | 必需 `provider`、`model`，可选正安全整数 `maxTokens?`；作为 `WebhookSessionRequest.model?` 的路由选择，不提供默认授权。   |
| `VerifiedWebhookDelivery<K>`            | `kind`、`source`、`deliveryId`、`event`、`receivedAt`；输入先通过适配器鉴权，再由 runtime 快照/冻结。                     |
| `WebhookEventMap`                       | 空的 provider 事件扩展接口；GitHub 适配器声明合并 `github`，不能从空映射推断其他 provider 已实现。                        |
| `WebhookSessionRequest`                 | `workspacePath`、`title`、`prompt`、`agentPreset`、`permissionPreset` 必需；`model` 可选，非空请求创建一条 root Session。 |
| `GitHubWebhookEvent`                    | `name` 为事件名，`payload` 是已签名 JSON 对象；事件专有字段仍由规则验证。                                                 |

## 来源与验证

事实依据：`packages/webhook/webhook/src/{index,types,session,brand}.ts`、`packages/webhook/webhook-github/src/{index,handler,types}.ts`，以及 runtime、Loader composition 测试；Hook 边界依据 `packages/hooks/hook-protocol/src/index.ts` 和两个 dialect 包入口。独立消费结果见 `evidence/runtime/webhook-rules-review.md`。
