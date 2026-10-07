# DeepSeek Account 与模型认证裁决

目标：`dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。

## 源码与候选

| 包 | 公开面及处置 | 具体证据 |
| --- | --- | --- |
| `@deepseek-ai/dsh-deepseek-account` | 根入口抽象 `DeepSeekAccount` Service，固定 `ctx.deepseekAccount`；类型与 `isRunningAccountTask`、`installAccountTaskCancellation`、header/locale helper。独立作者可继承类提供替代实现；不存在多 provider 注册 API。 | `src/index.ts` 的全部抽象方法及 `Service` 构造，`src/types.ts` 的无凭证视图/通知。 |
| `@deepseek-ai/dsh-deepseek-account-platform` | `PlatformAccount` 默认/命名导出及 `Config`，现成账号 Provider。 | `src/index.ts` 的 `static inject`、`authorization.registerFlow`、grant issuer 检查、`resolveToken` origin 限制、取消/签出/卸载；`package.json` root exports。 |
| `@deepseek-ai/dsh-llm-deepseek-account` | `name`、`inject`、`Config`、`apply`；固定 `deepseek-account` 模型 route，非泛用注册接口。 | `src/index.ts` 注册目录和适配器，每次 request 从 `ctx.get('deepseekAccount')?.resolveToken(baseURL)` 取凭证；未登录 `ACCOUNT_SIGN_IN_REQUIRED`，401 `ACCOUNT_TOKEN_INVALID` 并有条件 `rejectToken`，配额映射。`src/config.ts` 复用无 API-key 字段的协议配置。 |

新增参考 `api-guardrails/deepseek-account-auth.md`；配置任务 HOW-TO `how-to-configure-deepseek-account-model.md`。一般模型 Provider 注册仍归 `api-guardrails/llm-providers.md`，一般授权/凭证分别归已有专题。候选任务 `configure-deepseek-account-model-route`、`implement-deepseek-account-service`（后者须完整实现专有接口，不能将测试 probe 作为可交付实现）。成员映射：`DeepSeekAccount`、`PlatformSession`、其 root types/helpers；`PlatformAccount`、`Config`；Account LLM route 的 `name/inject/Config/apply`。

## 独立发布包验证

`evidence/tests/deepseek-account-auth-consumer/` 从 npm 安装上述三个 rc.1 包、`@deepseek-ai/dsh-llm@0.2.0-rc.1`、Cordis 4.0.4、TypeScript 6.0.3。`ProbeAccount` 是**明确不完整**的测试类，除 origin 绑定的 `resolveToken` 和 `rejectToken` 外，其余方法抛错；只用于验证扩展并装载抽象 Service 的公开路径。

- `npm install --ignore-scripts --no-audit --no-fund`：通过。
- `npm run build`：通过，独立 Host 编译 `DeepSeekAccount` subclass、Platform concrete class 与账号模型插件公开导出。
- `npm run smoke`：通过，真实 Cordis 装载 Probe Service 与固定模型插件；模型 route/catalog 出现，token 缺失时模型目录为空，插件卸载后 route 消失。测试还确认实际 `PlatformAccount` 继承 `DeepSeekAccount`。
- `npm pack --dry-run --json`：通过。

未运行 Platform PKCE 浏览器流程、凭证持久化、签出/401/配额真实请求、Host HTTP 回调、Agent Session 或模型网络请求。Probe 的其他方法故意不可用，因此 smoke 仅证明 Service 注册与模型目录组合，不能证明独立账号 Provider 已实现。
