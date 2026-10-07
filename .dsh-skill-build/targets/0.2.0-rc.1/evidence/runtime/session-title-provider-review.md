# Session title provider 独立消费核查

- 精确源：`dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`；`packages/session/session-title/src/{index,types,normalize}.ts`、`tests/{provider,service-contracts,projection}.spec.ts`；相邻模型实现 `session-title-llm/src/index.ts`。
- 独立 npm 包 `evidence/tests/title-provider-consumer` 使用 rc.1 Session/Projection/Title/LLM 与 Cordis 4.0.4；`npm install --ignore-scripts --no-audit --no-fund` 和 `npm run smoke` 通过，输出 `session title provider and logged revision smoke passed`。
- 实际观察：真实 Session `user/message` seq 输入；显式 refresh 接受 provider 标题，`session/title` 事件含精确 seq/provider source；用户 rename 写 user source 后下一提示未自动覆盖；显式 refresh 重新生成；插件 fiber 卸载后可注册另一 provider。
- HOW-TO 的 manifest、tsconfig 和 TypeScript 代码块原样抽到 `howto-title-provider`，以精确 npm 声明 `tsc -p` 通过。
- 未验证：完整 Agent main request header 的自动时机、LLM provider、Web Remote 权限、Session 持久化/重启、长时异步 provider 的取消竞态。日志折叠事实由源码与目标测试支持，隔离 smoke 只覆盖进程内日志。

## parent 集成候选

- 包 `@deepseek-ai/dsh-session-title`：`SessionTitleService`、`SessionTitleProvider`、`SessionTitleProviderRequest`、`SessionTitleProviderResult`、`SessionTitleProviderId`、`SessionTitleSnapshot`。新 reference `api-guardrails/session-title.md`；任务 `how-to/how-to-register-session-title-provider.md`，heading `注册 Session 标题 provider`。
- `session-title-llm` 和 `session-title-all-prompts-llm` 是已发布策略实现，不是另一个抽象 provider 注册表；这轮没有将辅助 LLM 调用视为自定义 provider 必然行为。
