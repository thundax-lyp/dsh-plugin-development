# Hook 桥接与 Guard 逐包裁决

目标：`dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。只使用目标 checkout 的 package root 导出、运行时和测试定位；未以历史 Skill 或 README 覆盖源码。

| 包 | 公开成员与任务处置 | 代码与失败/权限证据 |
| --- | --- | --- |
| `@deepseek-ai/dsh-hook-protocol` | 根导出 `CommandHook`、`HookDialect`、`HookOutput`、`MatcherGroup`、`MatcherMode`、`matcherDiagnostic`、`matchesMatcher`、`parseHookOutput`、`DEFAULT_HOOK_TIMEOUT_MS`、`runHook`、`RunHookOptions`、`RunHookResult`、`mergeHookOutputs`、`MergedDecision`、`MergedHookOutcome`、`appendHookInvoked`、`appendHookResult`、`DEFAULT_STDERR_SUMMARY_MAX_CHARS`、`summarizeStderr`、`HookInvocation`、`HookResultRecord`、`createDetachedRuns`、`DetachedRuns`。辅助库，不存在 Cordis `apply`/Service；适合自建方言桥接器的底层构件，不能把它路由为“注册 Hook”现成任务。 | `src/index.ts` 完整导出；`runner.ts` 通过 shell 的 `resolve/execute`、signal/timeout 运行，基础设施异常转成无 exit code 的非阻断 outcome；`codec.ts` exit 2 阻断，其他非零退出非阻断；`merge.ts` deny > ask > allow；`events.ts` 是 log-only 审计。 |
| `@deepseek-ai/dsh-hooks-codex` | 根导出 `name`、`inject`、`Config`、`apply`，可作为现成 Host plugin 装载；任务是“配置 Codex command hook”，而非给 TypeScript 插件提供新的注册器。 | `src/index.ts` 加载时读一次 `configPath`；`src/config.ts` 支持五个事件和正则 matcher，只运行同步 command；无效配置告警后零注册；`PreToolUse` 只兑现 deny，不兑现 allow/ask/updatedInput；Stop 阻断可继续循环，尚无限制。 |
| `@deepseek-ai/dsh-hooks-claude-code` | 同上四个根成员，现成 Host plugin，任务是“配置 Claude Code command hook”。 | `src/index.ts` 支持七个事件和方言环境；`src/config.ts` 处理 matcher；`PreToolUse` 可映射 ask 到 DSH ApprovalService，受后者权限/回答者控制；`updatedInput` 只告警忽略；读/解析失败时零注册；Stop 的自动循环上限尚未实现。 |
| `@deepseek-ai/dsh-repeat-tool-reminder` | 根导出 `name`、`Config`、`apply`；可配置现成 advisory 策略，不是通用 guard 注册 API。 | `src/index.ts` 在 post-execute 追加带来源的提醒、不拒绝工具；按 Agent WeakMap 保存连续计数，user pre-step 重置；阈值和预览长度加载时验证，非法抛错。 |
| `@deepseek-ai/dsh-tool-call-timeout-policy` | 根导出 `TOOL_TIMEOUT`、`name`、`inject`、`apply`；可装载现成 timeout 策略，不是通用 guard 注册 API。 | `src/index.ts` 注入 `tools`，只在工具声明 `timeoutMs` 时包装 `tools/execute`，通过 `deadline` 与 `timeoutOf` 区分自身超时，`finally` 恢复原 signal；结果为规范 `ToolExecutionResult` 错误。工具不合作时不能强制完成。 |

原生插件对工具拒绝/审批/包装的公开入口已归 `api-guardrails/tool-policy-hooks.md` 与其 HOW-TO，避免重复。与 Hook bridge 的关系见新增 `api-guardrails/hook-bridges-guards.md`。所选完整任务为 `how-to-configure-codex-pretool-hook.md`。

## 独立验证

`evidence/tests/hook-bridge-guard-consumer/` 仅从 npm 安装目标版本的上述五个包、`@deepseek-ai/cordis@4.0.4` 和 TypeScript 6.0.3。`hooks.json` 与 `pre-tool-check.mjs` 直接取自 HOW-TO 代码块。

- `npm install --ignore-scripts --no-audit --no-fund`：通过。
- `npm run build`：通过；独立 Host 消费者对所有五包的根导出进行声明编译。
- `npm run smoke`：通过；Codex 脚本的 allow/exit 2 通道、Claude 脚本的 `ask` 与事件名不匹配丢弃、发布版 matcher/codec/merge 行为、两个 bridge 和两个 Guard 的 Cordis 装载及卸载成功。`shell`、`sessionProjections`、`tools` 在该 smoke 中为空壳，仅用于注册而非执行真实 Agent turn。
- `npm pack --dry-run --json`：通过，见 fixture 的 `pack-dry-run.json`。

未运行真实 Agent/Tool turn、真实 shell executor、Claude bridge 到审批服务的事件映射、审批 UI、实际 timeout 或 Session log 重建。上述路径只依据目标源码与目标包测试，不能由隔离装载 smoke 外推为端到端行为。

## 账本候选

Reference：`api-guardrails/hook-bridges-guards.md`；HOW-TO：`how-to-configure-codex-pretool-hook.md`、`how-to-configure-claude-pretool-approval-hook.md`、`how-to-configure-repeat-tool-reminder.md`、`how-to-enable-tool-timeout-policy.md`。Task 候选 `configure-codex-command-hook`、`configure-claude-code-command-hook`、`configure-repeat-tool-reminder`、`apply-tool-timeout-policy`。`hook-protocol` helper 可作为 bridge 作者 API 候选，但不另立普通“注册 Hook”任务；新的原生策略任务映射既有 `tool-policy-hooks.md`。所有候选均需按 root 导出与具体插件功能映射，不将 `./src/*` export pattern 当作发布时可靠的深路径入口（package `files` 不包含源 `.ts`）。
