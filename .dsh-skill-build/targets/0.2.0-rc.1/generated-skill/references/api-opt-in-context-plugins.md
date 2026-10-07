# 可选时间与 tmux 上下文

## 装载边界

目标 `dsh-v0.2.0-rc.1` 的 `@deepseek-ai/dsh-time-context` 和 `@deepseek-ai/dsh-tmux-context` 是公开的 Host Cordis 插件，均声明 `inject = ['agents', 'sessionProjections']`。普通插件作者可在已有这两个 service 的 Profile 中添加这两行，给 Agent 的请求准备阶段追加模型可见、可恢复的上下文。完整组合见 [启用时间与 tmux 上下文](how-to-enable-opt-in-context.md)。它们不是 `SystemPrompt.context()` 的同类注册项；自定义通用上下文见 [系统提示与上下文](api-system-prompt-context.md)。

## 对象类型与成员

| 入口                                      | 公开成员及任务边界                                                                                                                                                                                                                |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@deepseek-ai/dsh-time-context`           | `name`、`inject`、`Config`、`apply(ctx, config)`。`Config.timeZone?` 是无浏览器唯一时区时使用的 IANA fallback；`refreshIntervalMs?` 默认 `600000`，`0` 允许每个合格 step 重新采样。无效时区或非安全、负数 interval 在装载时拒绝。 |
| `@deepseek-ai/dsh-time-context/invariant` | 公开 `name`、`inject = ['invariants']`、`apply(ctx)` 的 companion plugin；向 InvariantRegistry 注册该插件耐久读数的格式和位置校验。普通时间注入不要求它先装载，启用 Session invariant 审计时应与时间插件一同装载。                |
| `@deepseek-ai/dsh-tmux-context`           | `name`、`inject`、`Config.refreshIntervalMs?`、`apply(ctx, config)`。仅当当前进程真实处在 `$TMUX_PANE` 对应的 controlling tty 内且 `ctx.shell` 可查询时追加位置。缺环境、shell 或查询失败是无注入的成功路径。                     |

## 可恢复事实与失败路径

两者在 `agent/pre-step` waterfall 等待后续决议；下游拒绝或 signal 已取消时不产生注入。`time-context` 读取 open turn 的用户消息与 `clientTimeZone`，优先解析唯一浏览器时区，否则使用配置/进程 fallback，格式化当前时间和距上次相关事件的时长。`tmux-context` 在每 turn 的首个请求查询一次，验证 tty 并记录 session/window/pane/layout；状态未改变或 refresh floor 未到时不重复注入。两者产出的 `user/message` 带 `source.kind`、`form:'snapshot'` 和命名 section，只有 AgentLoop 将决议进入 Session 才成为持久事件，恢复后可由日志投影/扫描重建。直接调用注册函数或只观察计算出的 message 不等于事件已提交。

`tmux` 查询经 `ctx.shell` 执行，只作只读命令；拒绝、非零退出、abort 均不阻断 Agent 请求，拒绝时会记录 warning。这个插件不证明外部 tmux 会话持续存在。两个插件的注册均随其 Cordis fiber 卸载；不复用进程级缓存作为 Session 真相。

## 源码与验证

公开入口和行为：`packages/context/time-context/src/index.ts`、`request-zone.ts`、`tests/time-context.spec.ts`、`tests/time-context.e2e.ts`；`packages/context/tmux-context/src/index.ts` 及其 tests。隔离 npm 消费验证和未覆盖边界记于 `evidence/runtime/skill-bundled-context-review.md`。
