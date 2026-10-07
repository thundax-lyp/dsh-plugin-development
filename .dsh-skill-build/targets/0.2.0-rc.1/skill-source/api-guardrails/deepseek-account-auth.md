# DeepSeek Account 服务与模型认证

## 三个公开包的角色

目标 `dsh-v0.2.0-rc.1` 的 `@deepseek-ai/dsh-deepseek-account` 根入口导出抽象 `DeepSeekAccount` Cordis Service、Account 的 Client 安全视图/身份类型和任务取消辅助函数。它提供固定服务键 `ctx.deepseekAccount`，没有 `registerAccountProvider()` 多实例注册表。独立作者可继承完整抽象类提供**替代实现**，但必须兑现登录、状态、profile、余额、通知、token、watch 和卸载等全部契约；仅实现 `resolveToken` 的测试替身不是可交付 Provider。Base Profile 已装载 `@deepseek-ai/dsh-deepseek-account-platform` 的 `PlatformAccount`，后者是一个具体 PKCE 实现，注册授权 flow、管理凭证记录并提供 Host-only token。安装与选择模型的操作见 [配置 DeepSeek Account 模型路由](how-to-configure-deepseek-account-model.md)。一般第三方模型 Provider 的新增入口仍是 [LLM Provider 适配器](api-llm-providers.md)。

`@deepseek-ai/dsh-llm-deepseek-account` 是**已实现的固定** `deepseek-account` LLM route；根入口 `name`、`inject`、`Config`、`apply`。它从 `ctx.deepseekAccount.resolveToken(connection.baseURL)` 为每次请求获取凭证，不从 API-key 环境变量兜底；无账号 Service、未登录或目标 URL 不被账号允许时为 `ACCOUNT_SIGN_IN_REQUIRED`。它将 token 放进 Host 出站请求的 `x-dsh-auth-token`，绝不能把它带到 Client、Session、模型上下文或不受信任端点。`Config` 复用 DeepSeek 协议设置，但没有 `apiKeyEnv`；`models` 是可发现目录，未登录时 `listModels('deepseek-account')` 返回空目录。插件装载通过 `ctx.llm.registerConfigurableProviders` 登记设置目录，并经 `registerDeepSeekProvider` 注册适配器 route；卸载由 Cordis effect 移除。

## 平台账号实现的边界

`PlatformAccount` 的根入口还公开 `Config`。部署配置包括 `platformOrigin`、`inferenceOrigin`、请求超时、浏览器开发代理选项和 Host-only header；默认 inference origin 为 `https://api.deepseek.com`。初始化读取 `deepseek-account-platform/default` grant 并验证 issuer；不匹配的旧 grant 会移除。`resolveToken(url)` 只允许配置的 inference origin，且签出/无有效 grant 时返回 `undefined`。`startSignIn` 经 `AuthorizationService` 的浏览器 flow 发起，`cancelSignIn` 只取消指定尝试；`signOut` 先移除本地 grant，远端撤销后台重试不恢复凭证。账号服务的 `watch(signal)` 和 `getState()` 返回无秘密的视图；`getPlatformSession()` 仅 Host 消费。

LLM 认证错误边界：401 将当前捕获 token 映射为 `ACCOUNT_TOKEN_INVALID`，并调用 `rejectToken(token)` 只删除仍匹配的 grant；配额错误映射为 `ACCOUNT_QUOTA_EXCEEDED`。删除失败不能覆盖原推理错误。`deepseek-account/signed-out` 和 `deepseek-account/session-expired` 可驱动当前账号任务取消，不能据此取消其他 Provider 的请求。自己的 LLM route 不应借用该账号 token，除非实现者能证明 URL 授权、身份与泄漏边界；常规第三方认证使用 [凭证 Provider](api-credentials.md) 的引用与每次解析。

## 独立 Provider 能力裁决

- **新增模型 route：可行。** 使用 `ctx.llm.registerAdapter` 注册自己的 provider id；认证由该 adapter 自己处理。本组账号包不是通用认证注册 API。
- **替换 DeepSeek Account Service：类型上可行，任务面完整且专有。** 扩展 `DeepSeekAccount` 并作为 Cordis Service 装载，不能与默认 `PlatformAccount` 同时拥有固定服务键。必须实现全部抽象方法、凭证与授权生命周期；本专题不把空壳 subclass 当成可用登录 Provider。
- **配置现成账号模型：可行。** 装载 `PlatformAccount` 与 `llm-deepseek-account`，用户经浏览器登录后才使目录和请求可用。账号认证只适用于该 Provider 授权的 inference origin。

## 对象类型与成员

| 公开对象          | 可用成员与职责                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DeepSeekAccount` | 固定键抽象 Service。`getState`、`watch` 供安全状态订阅；`getProfile`、`getBalance`、`getUnnotifiedBonuses`、`ackBonusNotified` 处理平台数据；`startSignIn`、`cancelSignIn`、`signOut` 管理本地授权生命周期；`resolveToken`、`rejectToken`、`getPlatformSession`、`getDeviceIdentity` 仅由可信 Host 消费。替代实现必须覆盖全部成员。                                                           |
| `PlatformAccount` | 上述成员的官方具体实现；装载时 `Config` 决定 Platform/inference origin 与请求期限。其 public 方法承袭 `DeepSeekAccount`：`getState`、`watch`、`getProfile`、`getBalance`、`getUnnotifiedBonuses`、`ackBonusNotified`、`startSignIn`、`cancelSignIn`、`signOut`、`resolveToken`、`rejectToken`、`getPlatformSession`、`getDeviceIdentity`；不能把它当成可任意 URL 分发 token 的通用 Provider。 |

源码：`packages/credentials/deepseek-account/src/{index,types,account-tasks}.ts`、`deepseek-account-platform/src/index.ts`、`packages/llm/llm-deepseek-account/src/{index,config}.ts`、DeepSeek adapter 的 `host.ts` 与 account-routing/provider tests。独立发布包检查见 `evidence/runtime/deepseek-account-auth-review.md`。
