# Workflow 运行句柄与 Agent loop 组合

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-workflow` 是 Host `ctx.workflowEngine` 服务定义；已发布实现 `workflow-ptc` 在受管理的 Node PTC 进程执行脚本并通过配置的 subagent provider 运行 `agent()`。Host 插件可对一个已存在的 live Agent 启动并拥有一次 WorkflowRun，见[持有 Workflow 运行](how-to-own-workflow-run.md)。`@deepseek-ai/dsh-agent` 的 `ctx.agents` 创建/恢复入口由 `agent-loop` 提供 factory；插件通常使用 live Agent 或在可信生命周期所有者中调用 `create`，不替换具体循环实现。

## Workflow 对象与成员

| 对象                            | 契约                                                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `WorkflowEngine.start(request)` | 同步校验脚本、meta、provider/上限并返回 `WorkflowRun`；无效请求可在发布前抛 `WorkflowError`。                                              |
| `WorkflowStartRequest`          | `script`、JSON `meta`、必填 `parent: Agent`；可选 JSON `args`、`subagentProvider`、`maxTotalAgents`、`signal`。                            |
| `WorkflowRun`                   | `id`、`meta`、永不拒绝的 `result`、`cancel(reason?)`、幂等异步 `dispose()`；持有者必须在 finally 等待释放脚本与子 Agent。                  |
| `WorkflowResult`                | `stopReason` 为 completed/cancelled/error；只在 completed 时把 `value` 当结果，失败说明在 `error`；`agentsStarted` 为接受过的子 Agent 数。 |
| `WorkflowError`                 | `fatal` 表示应终止当前 Workflow 的引擎错误；调用方仍须释放已持有的 `WorkflowRun`。                                                         |
| `workflow/*` 事件               | start/end 配对，phase/log 为观察，agent-start/agent-end 按 seq 配对。`workflow/end` 不含 result value；监听器失败被引擎包含并记录。        |

`workflow-ptc` 需要 `subagents`、Node TypeScript `ptcRuntime`、`sandboxPolicy`；其配置控制 provider、并发与总数、组合器条目上限、初始同步片段超时。脚本可用 `agent()`、`parallel()`、`pipeline()`、`phase()`、`log()`；meta/args 是数据而非脚本里的导出。子 Agent 普通失败向脚本给 `null`，fatal `WorkflowError`、解析/资源失败终止运行。没有总 wall-clock 截止，调用方可用 AbortSignal 和 `dispose()` 取消并等待 quiescence。观察事件不是持久日志；若结果应进父 Agent 模型上下文，由 owning tool/command 写规范 Session 结果，不能只依赖 progress event。

## Agent loop 的公开组合边界

`ctx.agents.create({sessionId,meta?,agentOptions?,signal?,setup?})` 和 `resume({resumeSessionId,...})` 由已装载的 `agent-loop` factory 实现，返回只有持有者可 dispose 的 `AgentHandle`。`setup(agentCtx,agent)` 在 Agent/Session 发布前组合 scoped tools、prompt 与子插件，可返回同步 `commit()` 做发布前最后校验；失败回滚，不应在 setup 中驱动 Agent。`resume` 还需 Session persistence。`ctx.agents.get(id)` 只返回 Agent，不转移 handle 所有权。`withInitiator` 只传递当前可信 initiator 归属，不证明 live 身份或授权。

`CreateAgentOptions` 的 `sessionId` 必填；`parentAgent?` 表示 live 运行时父 Agent，`meta?` 记录可验证 cwd、parentSession、isSeeded、origin、delegationDepth、agentPreset。fork 时 `seed?` 是连续的事件前缀，`inheritedEventCount?` 必须与 seeded cut 一致。`ResumeAgentOptions` 以 `resumeSessionId` 取代新建 id/seed，仍可带 `parentAgent?`、`agentOptions?`、`signal?`、`setup?`。`AgentOptions` 的 `provider?`、`model?`、`reasoningEffort?`、`maxTokens?` 选择每次模型请求；不覆盖持久 Session 事实。`AgentSetup` 是未发布 scope 的组合回调，可返回 `AgentSetupCommit` 的同步 `commit()`；只有创建/恢复成功后，`AgentHandle.agent` 才供驱动，拥有者最终 `await AgentHandle.dispose()`。`AgentFactory` 与 `AgentRegistry.setFactory` 由 loop provider 持有，普通消费插件不替换 factory。

Workflow 的 parent 必须是调用方已授权且确认为同一 live Agent 的对象。脚本在子进程执行，所选 sandbox Provider 决定真实文件隔离；脚本里的 VM 不单独构成安全边界。自定义插件在运行前做 Agent/用户授权、资源上限和脚本来源校验，结束时 `finally` dispose，不把 PTC/子 Agent 失败的部分结果渲染成成功。

## 验证

声明编译与拥有者句柄测试只是服务消费验证。完整工作流需在已装载 subagent、PTC、sandbox 的 Profile 中运行，观察开始/结束配对、取消、子 Agent 清理、权限和父 Session 结果；Agent 创建还需单独验证 setup、rollback、persistence resume。不得把替身 WorkflowEngine 的返回视为 `workflow-ptc` 运行证明。
