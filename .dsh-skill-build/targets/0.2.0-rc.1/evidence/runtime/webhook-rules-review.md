# Webhook 规则与 Hooks 入口核查

目标：`dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。

## 源码裁决

- `packages/webhook/webhook/package.json` 根导出、`src/index.ts` 与 `src/types.ts` 确认 `WebhookRuntime` Service、branded 规则注册/异步 disposer、JSON 快照冻结、同 kind 并发 fire-and-forget dispatch、回调异常隔离与非空结果创建 Session。
- `src/session.ts` 确认 request 字段验证、Preset/Workspace/Agent/Session 顺序、webhook 消息来源、创建失败的 detach/dispose 回滚。`WebhookDeliveryId` 没有去重状态。
- `packages/webhook/webhook-github/src/{index,handler,types}.ts` 确认 GitHub 适配器负责精确 Host 路由、Credential secret、签名验证、body 上限，再发送 `{name,payload}` 的已验证投递；具体事件字段需要规则检查。
- `packages/hooks/hook-protocol/src/index.ts` 是协议函数库，无通用 Cordis Hook 注册 Service。其他 dialect 包的具体行为不能泛化为所有 Hook 插件入口。
- `packages/webhook/webhook/tests/{runtime,loader-composition}.spec.ts` 提供规则生命周期、重复 ID、取消和 Loader 装载行为的目标源码内测试证据；本次未重新运行这些测试。

## 隔离消费

`evidence/tests/webhook-rule-consumer/` 仅依赖 npm 已发布 `@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/dsh-webhook@0.2.0-rc.1`、`@deepseek-ai/dsh-webhook-github@0.2.0-rc.1` 与 TypeScript 6.0.3。HOW-TO 的完整 TypeScript 块直接复制成 `src/index.ts`。

- `npm install --ignore-scripts --no-audit --no-fund`：通过。
- `npm run build`：通过，独立 Host TypeScript 声明编译。
- `npm run smoke`：通过。对匹配、事件 action/source 筛选、request 构造、已取消 signal、真实 Cordis Service 装载、规则 effect 注册/卸载后的 dispatch 路径执行检查。此 smoke 的非空 request 是直接调用纯规则得到的，未执行 Session 创建。
- `npm pack --dry-run --json`：通过，验证可打包的插件形态。

未运行真实 GitHub HTTP 签名投递、外部 WebServer、完整 Agent/Workspace Session 创建、模型调用、跨进程持久去重或生产 Host Profile。HTTP 适配器行为依据目标实现与目标测试，不能从本次隔离 smoke 推断实际网络部署成功。验证时传给 Cordis 的服务依赖是空壳，仅用于未创建 Session 的生命周期路径。

## 账本候选

专题 reference：`api-guardrails/webhook-rules.md`。完整任务 HOW-TO：`how-to-create-session-from-github-webhook.md`。候选公开成员：`@deepseek-ai/dsh-webhook` 的 `WebhookRuntime`、`WebhookRule`、`WebhookRuleId`、`WebhookEventMap`、`WebhookEventOf`、`VerifiedWebhookDelivery`、`WebhookSessionRequest`、`WebhookModelSelection`、`WebhookSourceId`、`WebhookDeliveryId`；`@deepseek-ai/dsh-webhook-github` 的 `name`、`inject`、`Config`、`apply`、`GitHubWebhookEvent`、`GitHubJsonObject`；`@deepseek-ai/dsh-hook-protocol` 的执行与 matcher helper 应作为非注册库入口独立裁决。建议 task 候选：`register-webhook-rule`、`create-session-from-verified-github-webhook`、`dispose-webhook-rule`；`dispatch` 仅路由给已鉴权适配器作者，不作为原始 HTTP 直接消费任务。
