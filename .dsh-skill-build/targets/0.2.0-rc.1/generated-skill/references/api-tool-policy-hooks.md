# 工具执行策略 Hook 与审批请求

## 适用范围

目标 `dsh-v0.2.0-rc.1` 的 Host 插件通过 `@deepseek-ai/dsh-tools` 导出的 Cordis `Events` 注册工具流水线 Hook；`ctx.tools.guard()` 注册不可被后续放行覆盖的同步拒绝规则。此处只讨论策略和观察，不重复 [工具定义与规范输出](api-tools.md)。完整最小插件见 [给工具添加执行策略](how-to-add-tool-execution-policy.md)。

## 执行顺序与成员

| 公开扩展点               | 可做的事                                                                                                                                           | 结果边界                                                                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `tools/pre-execute`      | `ctx.on(name, async (exec,next) => PreToolDecision)`；`allow` 或 `next()`、`deny`、`cancel`、`ask`。异步门禁观察 `exec.signal`。                   | 已解析参数和调用身份不可改写；`ask` 交 ApprovalService，只在 `allowed-once` 时允许本次调用。缺服务、无 agent、无回答者均封闭为拒绝。 |
| `ctx.tools.guard(guard)` | 同步读取 `Readonly<ToolExecution>`，返回拒绝理由或 `undefined`；全局或 `agent.ctx` scope。                                                         | 在 pre/ask 后、body 前检查；任一匹配 guard 拒绝后不能被其他 guard 放行。返回精确 effect disposer。                                   |
| `tools/execute`          | around-dispatch waterfall；`next()` 返回规范 `ToolExecutionResult`。                                                                               | 只可在 delegated lifetime 更换 `exec.signal`；registry 仍融合原调用者取消信号，身份不可改；包装器需完成并恢复信号。                  |
| `tools/post-execute`     | 收到 dispatch 成功或失败及 `Readonly<ToolExecutionResult>`；返回 `accept`（可替换单一 `content` 或 `value`，可附加上下文）或 `block`（错误反馈）。 | 已派发的外部副作用不可撤销；pre 拒绝也进入 post，部分 pipeline 内部失败可跳过。                                                      |
| `tools/result`           | 观察最终深度冻结且可无损 JSON 化的结果；listener 异常被隔离。                                                                                      | 只观察，不能更改返回或补授权。                                                                                                       |
| `tools/ptc-dispatch-log` | 改写一条已完成 `run_code` 子调用的**持久日志副本**内容。                                                                                           | 程序已获得完整值，模型也不直接看到这份子调用副本；异常回退原内容。                                                                   |

`ToolExecutionInput` 包含 `callId`、`name`、已解析 `arguments`、必需 `signal`，可带 `agent`、`parent`、`rootCallId` 和 PTC `schema`；registry 增加 token 和 root id 成为 `ToolExecution`。`PreToolDecision` 的 `deny` 可带 `reason` 和 `ToolErrorInfo`；`ask` 可带审计 `reason` 和本地化 `displayReason`，不是隐式持久授权。所有 Hook 按 `exec.agent` 进行 scope 过滤；全局注册作用于所有调用，`agent.ctx` 的注册只作用该 agent。每个 `ctx.on`/guard disposer 由插件 fiber 拥有，卸载取消新调用上的影响。不要将 `TOOL_RUNTIME_SCHEDULER` 当成插件扩展点，它标为内部调度 API。

## ApprovalService 组合

`@deepseek-ai/dsh-user-approval` 根入口公开 `ApprovalService`、`ApprovalRequest`、`ApprovalOutcome`、`ApprovalPolicy` 和 `setApprovalPolicy`。部署 Profile 装载 `ApprovalService` 后，策略 `ask` 默认路由 `approval/request` waterfall 给所属 Agent 的回答者；回答者仅应处理自己拥有的 agent，不认识时委托 `next()`。`ApprovalOutcome` 仅 `'allowed-once'`、`'rejected'`、`'cancelled'`、`'unavailable'`；只有第一个放行当前请求。无回答者或回答者抛错返回 unavailable；请求 signal abort 返回 cancelled，迟到回答丢弃。`policy:'never'` 在进入回答者前确定拒绝。请求必须在 Agent 的 open turn 中，`approval/asked` 与 `approval/decided` 成对写 Session；`setApprovalPolicy(session, policy)` 是有日志的会话覆盖，`ApprovalService.setPolicy(agent, policy)` 还注入下一步模型可见通知。不能从工具 Hook 中自造批准结果或绕过审计。

## 对象类型与成员

| 公开对象          | 可用成员与边界                                                                                                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ApprovalService` | `config.policy` 是部署默认 ask/never；`overrideOf(session)` 只读 Session 日志中的覆盖，不应用默认值；`setPolicy(agent,policy)` 持久改写当前 Agent 政策并通知下一模型步；`request(req)` 仅在 open turn 中产生配对审计并返回封闭的 outcome。 |
| `ApprovalRequest` | `agent` 与 `toolName` 必需；`callId?` 指向已展示的调用，`reason?` 是提问原因，`displayReason?` 只供本地化展示，`signal?` 撤回等待；参数不复制工具调用的全部内容。                                                                          |
| `ApprovalPolicy`  | 仅 `ask` 或 `never`；`never` 在调用回答者前拒绝。                                                                                                                                                                                          |
| `ApprovalOutcome` | `allowed-once`、`rejected`、`cancelled`、`unavailable`；只有第一项允许本次执行。                                                                                                                                                           |

## 失败与验证

`pre-execute` 中的 await 不能被 registry 直接抛弃；异步门禁必须响应 signal 并自行收敛。`deny` 和 guard 拒绝阻止 body，仍产生规范工具失败。`post-execute` 的 `block` 发生在 dispatch 后，应清楚说明已有副作用。工具的规范 JSON `value`、纯渲染和模型可见上下文仍由工具定义与 Session 管道负责。

公开事件、类型及流水线：`packages/core/tools/src/index.ts`；审批服务与审计：`packages/interaction/user-approval/src/index.ts`；行为测试：`packages/core/tools/tests/tools.spec.ts`、`scoped.spec.ts`，以及 `packages/interaction/user-approval/tests/`。隔离 Host 消费验证见 `evidence/runtime/tool-policy-review.md`。
