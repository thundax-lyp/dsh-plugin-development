# 命令 Hook 桥接与内置 Guard

## 入口与归属

目标 `dsh-v0.2.0-rc.1` 公开 `@deepseek-ai/dsh-hooks-codex`、`@deepseek-ai/dsh-hooks-claude-code` 两个可装载的 Cordis function plugin。二者从各自 `Config.configPath` 读取一次进程级 JSON 配置，将受支持的 command hooks 映射到 Agent/Tool 的公开事件。`@deepseek-ai/dsh-hook-protocol` 根入口是二者共享的纯协议库，提供 `runHook`、`parseHookOutput`、`matchesMatcher`、`mergeHookOutputs`、事件日志与 detached-run helper；它本身没有可装载 `apply` 或 `ctx.hooks` Service。原生 TypeScript 插件直接使用 [工具执行策略 Hook](api-tool-policy-hooks.md) 中的 `ctx.on`、`ctx.tools.guard`，不需要通过命令 Hook 协议。桥接器的完整任务见 [配置 Codex PreToolUse 命令 Hook](how-to-configure-codex-pretool-hook.md) 与 [配置 Claude Code PreToolUse 审批 Hook](how-to-configure-claude-pretool-approval-hook.md)。

## 两个桥接器

| 包                      | 公开接入                                                                                                                                                  | 实际范围                                                                                                                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dsh-hooks-codex`       | `name`、`inject`、`Config`、`apply`，依赖 `shell` 和 `sessionProjections`。配置 `configPath`、可选 `model`、`defaultTimeoutMs`、`stderrSummaryMaxChars`。 | `SessionStart`、`UserPromptSubmit`、`PreToolUse`、`PostToolUse`、`Stop`；matcher 始终正则；只运行同步 command；stdin 为无结尾换行的 snake_case JSON。`PreToolUse` 只承认阻断，不映射 allow/ask/输入改写。 |
| `dsh-hooks-claude-code` | 同样的入口和依赖。配置 `configPath`、可选 `pluginRoot`、`projectDir`、`defaultTimeoutMs`、`stderrSummaryMaxChars`。                                       | 上述五点加 `SubagentStart`/`SubagentStop`；纯字母数字、下划线和竖线 matcher 用文字交替，其余按正则；stdin 和环境依该方言构造，支持 `PreToolUse` 的 ask，但 `updatedInput` 只告警并忽略。                  |

两者都在插件加载时读配置；读取/JSON/解析错误会告警并注册零个 Hook，不是启动失败。非 command 或不支持的异步项被跳过并告警；不要把“插件装载成功”当作 Hook 已生效。Command 在 Agent Session workspace 里通过 `ctx.shell` 执行，遵守取消、超时与 shell 的凭证 scrub。`runHook` 遇执行基础设施错误返回无 exit code 的非阻断结果；exit 2 用 stderr 作为阻断原因，其他非零退出不阻断。聚合顺序 `deny > ask > allow`，但每个桥接器在各扩展点上选择能兑现的决定。`continue:false` 的 stop 结果在此版本仍仅有日志，没有通用运行级 halt。`Stop` 阻断会 steer 继续；两桥接器均未实现自动循环上限，Hook 必须自行避免永久续行。

`hook/invoked` 与 `hook/result` 仅是 Session 内 log-only 的配对审计事件，不构成模型可见上下文。桥接器只在特定映射点把 `additionalContext` 形成带来源的用户消息；Command 输出不能假定自动展示给模型。插件卸载时 Cordis listener 清除，detached SessionStart/子代理运行由 effect drain；Hook 进程应响应取消。

## Guard 包的处置

`@deepseek-ai/dsh-repeat-tool-reminder` 与 `@deepseek-ai/dsh-tool-call-timeout-policy` 均是已发布的可装载 Cordis function plugin（根入口 `name`、`apply`；前者有 `Config`，后者有 `inject` 和 `TOOL_TIMEOUT`）。它们是内置策略实例，**不提供新的通用 Guard 注册框架**。前者在 `tools/post-execute` 统计每个 Agent 相同工具与规范参数的连续调用，到阈值后添加带来源的模型可见提醒，不拒绝/改写调用；默认阈值 `[3,5,8]`，空/重复/小于 2 的阈值或非法预览长度在加载时失败。配置步骤见 [重复工具调用提醒](how-to-configure-repeat-tool-reminder.md)。后者依赖 `tools`，读取工具定义的 `timeoutMs`，通过 `tools/execute` 包装，临时替换并恢复 `exec.signal`，只有自身 deadline 超时才返回含 `TOOL_TIMEOUT` 的规范错误结果；工具必须合作处理 signal 并完成清理，不能由包装器强制中断任意不合作任务。部署步骤见 [Web 工具协作式超时](how-to-enable-tool-timeout-policy.md)。

## 对象类型与成员

| 包的公开对象                                | 配置/成员与边界                                                                                                                                 |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `dsh-hooks-codex.Config`                    | 必需 `configPath`；可选 `model`、`defaultTimeoutMs`、`stderrSummaryMaxChars`。配置文件只在装载时读取。                                          |
| `dsh-hooks-claude-code.Config`              | 必需 `configPath`；可选 `pluginRoot`、`projectDir`、`defaultTimeoutMs`、`stderrSummaryMaxChars`。`pluginRoot`/`projectDir` 用于命令替换与环境。 |
| `dsh-repeat-tool-reminder.Config`           | 可选 `thresholds`、`include`、`exclude`、`argumentsPreviewChars`；第一项决定提醒次数，后两项按工具名通配筛选，最后一项只限制展示预览。          |
| `dsh-tool-call-timeout-policy.TOOL_TIMEOUT` | 稳定字符串错误码；策略只在它自身的 deadline 触发且下游收敛后返回同码错误，不是可以注册新 guard 的方法。                                         |

若目标是新的拒绝/审批/超时策略，使用公开 `tools/pre-execute`、`ctx.tools.guard`、`tools/execute` 和 `tools/post-execute` 扩展点，并按 [工具执行策略 Hook](api-tool-policy-hooks.md) 的权限审计路径实现。不要通过深路径导入桥接器内部 `src/config.ts` 或复制内置 Guard 私有状态机作为稳定 API。

## 来源与验证

目标源码：`packages/hooks/{hook-protocol,hooks-codex,hooks-claude-code}/src/`、`packages/guard/{repeat-tool-reminder,timeout-policy}/src/index.ts`，对应 `package.json` 和测试。逐包裁决、独立包消费与限制见 `evidence/runtime/hook-bridges-guards-review.md`。
