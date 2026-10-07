# 内置 LLM route、Retry 与 Token Meter 逐包裁决

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。源码以包 root 导出、运行时和测试为准；内置实现不直接提升为通用插件契约。

| 包 | 插件作者任务处置与主要公开成员 | 目标源码证据 |
| --- | --- | --- |
| `dsh-llm-deepseek` | 官方 Messages adapter 构件库，`DeepSeekAdapter`、`Config`/选项解析、`registerDeepSeekProvider`、model/file helpers；可供特定 DeepSeek 协议插件组合，不是可直接装载的 Cordis plugin。一般新 route 用 `dsh-llm` 的 `LlmAdapter`/`ctx.llm.registerAdapter`。 | `src/index.ts` 只转出构件，`src/host.ts` 用 llm registry 注册，`src/adapter.ts` 实际请求与流。 |
| `dsh-llm-deepseek-api-key` | 固定 `deepseek-official` route 的装载与配置任务，root `name/inject/Config/apply/plainOptions/resolveAdapterOptions` 和选项类型；不可用它注册任意 Provider ID。 | `src/index.ts` 从 Credentials Service 或受信任启动环境解析 `apiKeyEnv`，缺 key 为 `MISSING_CREDENTIAL`；注册目录与 adapter；`src/config.ts` 同代解析协议和凭证引用。 |
| `dsh-llm-deepseek-account` | 固定 `deepseek-account` route；root `name/inject/Config/apply`；已归 `api-guardrails/deepseek-account-auth.md`。 | `src/index.ts` 逐请求从账号 Service 取 token；未登录目录为空；401/配额映射。 |
| `dsh-llm-pi-ai` | 多 route 现成 Provider 插件，root `name/inject/Config/apply/PiAiAdapter` 及配置/认证/协议 helper；配置现成路由已归 `api-guardrails/llm-providers.md`，避免重复新 task。 | `src/index.ts` 注册目录/route 与配置更替；`src/config.ts` 校验 catalog/自定义 route；`src/auth.ts` 凭证边界。 |
| `dsh-llm-retry` | Host function plugin，root `name/inject/Config/apply/RetryId`、retry event types；任务是装载执行器并在 provider 配置 retryPolicy。 | `src/index.ts` `agent/request-error`、durable `llm/retry`/`llm/retry-started`、取消/卸载 drain；`dsh-llm/src/retry-policy.ts` 拥有策略 schema/解析。 |
| `dsh-token-meter` | `TokenMeter` Service（root default/named、`TokenMeasurement` 等类型），任务是插件读取 `ctx.tokenMeter.measure(session)`/`estimateMessage`；没有注册自定义 meter provider 的入口。 | `src/index.ts` 依赖 SessionProjectionRegistry 并重放日志、返回冻结测量；`src/types.ts` 对象字段；tests 覆盖投影/估算。 |
| `dsh-plugin-package-inventory-deepseek` | root `name/inject/Config/apply`；`enabled` 配置官方 DeepSeek request 的 `dsh_plugin_packages` 扩展，仅适合需要该官方字段的 Profile。 | `src/index.ts` 按活动 Loader entry 与 Agent standing preset 查 package manifest；不包括未装载依赖/无 Loader 身份的 fiber；field 服务来自 `dsh-deepseek-llm-api-extensions`。字段注册 seam 已归 `api-guardrails/deepseek-request-extensions.md`。 |
| `dsh-deepseek-llm-api-extensions` | 可供第三方请求字段 Provider 注册；已归 `api-guardrails/deepseek-request-extensions.md`，不在此重复成员或 HOW-TO。 | `src/index.ts` 的 `DeepSeekLlmApiExtensionRegistry.register/prepare`。 |

新参考：`api-guardrails/llm-builtins-retry-meter.md`；任务 HOW-TO：`how-to-configure-deepseek-api-key-retry.md`、`how-to-read-session-token-pressure.md`。候选任务 `configure-official-deepseek-api-key-route`、`configure-provider-request-retry`、`read-session-token-pressure`。`TokenMeter` 的结果是读模型、不是新权威事件；retry 是 Agent 级恢复，不覆盖直接 LLM 调用。

## 独立发布包验证

`evidence/tests/llm-builtins-consumer/` 从 npm 安装 rc.1 的 LLM/DeepSeek/API-key/Account/pi-ai/retry/meter/session/projection 包及 Cordis 4.0.4、TypeScript 6.0.3。Token Meter HOW-TO 的完整 TS 块复制为 `src/index.ts`；初次编译发现 `agent/pre-step` 的声明需要显式 `@deepseek-ai/dsh-agent` 类型副作用导入，已修正 HOW-TO、fixture 和依赖。

- `npm install --ignore-scripts --no-audit --no-fund`：通过。
- `npm run build`：通过，独立 Host TypeScript 声明编译。
- `npm run smoke`：通过，真实 Cordis 装载 LlmRuntime、SessionStore、ProjectionRegistry、TokenMeter、官方/账号/pi-ai route、Retry 和示例 observer；官方/账号 route 可见、官方 route 的 `maxRetries:2` 可查、未登录账号目录为空、空 Session 读数为冻结的 zero baseline、卸载后 routes 消失。还检查将 `retryPolicy` 放到 retry 插件自身会报配置错误。
- `npm pack --dry-run --json`：通过。

未运行真实模型网络请求、Agent 失败重试/等待/取消、Credentials 持久读取、pi-ai 非空配置请求、图像定价、Session 有内容的重放测量或 Client 模型选择 UI。上述运行路径仅用于验证公开装配与生命周期；更深语义依据目标源码/测试。
