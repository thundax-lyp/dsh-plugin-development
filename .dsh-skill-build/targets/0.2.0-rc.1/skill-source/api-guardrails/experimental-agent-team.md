# Experimental Agent Teams

## 入口、版本与组合

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-experimental-agent-team` 的 `TeamService` 提供 Host `ctx.agentTeams`，把 roster、mailbox 和共享任务状态写入 Team Lead 的 exact live Session 日志；它是**可选实验包**，不属于默认 Profile。第三方 Host 插件可在已经组成 Team 的 Profile 内消费服务。可发布的组合层 `@deepseek-ai/dsh-experimental-agent-team-profile/cordis.patch.yml` 必须在 `dsh-base` 之后应用，禁用四个重叠的普通 subagent 工具行，插入 Team 服务、`tool-agent-team` 和 `ui-agent-team`；见[使用 Agent Teams](how-to-use-experimental-agent-team.md)。

`@deepseek-ai/dsh-experimental-tool-agent-team` 注册模型可见的 `spawn_teammate`、Team 范围 `list_agents`/`send_message`/`interrupt_agent`、等待和任务板工具；它的政策文本明确要求用户请求 Team/teammates 后才创建。`@deepseek-ai/dsh-experimental-client-ui-agent-team` 的 Host `apply` 为空，浏览器入口显示成员与任务；headless 不需浏览器 UI。组合层的源码根入口为空，运行内容是 patch 文件。Workflow 仍可使用底层 Provider 创建 fresh 子代理；Team 工具的可见性由具体 Agent scope 决定。

## Host 服务对象与成员

| 对象                                     | 成员与边界                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TeamService` / `ctx.agentTeams`         | `membership(agent)`、`tryMembership(agent)`、`listMembers(agent)`；`spawnTeammate(caller,request)` 仅 Lead；`sendMessage(caller,request)` 可在成员间发送；`createTask/getTask/listTasks/updateTask` 管共享任务；`waitForChange(caller,timeout,signal)`、`interrupt(caller,targetName)`。每次操作使用精确 live Agent 作为权限凭据。 |
| `SpawnTeammateRequest`                   | 不可复用的 name、description、prompt、`context:'fresh'                                                                                                                                                                                                                                                                             | 'fork'`、Provider 名和 signal；返回成员行，失败成员仍占名字。 |
| `SendTeamMessageResult`                  | `messageId` 与 `accepted`/`queued`；queued 已入 Lead 日志，不应重发。                                                                                                                                                                                                                                                              |
| `TeamTaskView` / `UpdateTeamTaskRequest` | 任务有 `id/revision/status/ownerName/blockedBy/writeScopes/ready` 等；更新必须提交 `expectedRevision`，过期 CAS 拒绝。writeScopes 只是重叠警告，不锁文件。                                                                                                                                                                         |
| `TeamWaitResult`                         | 仅 `timedOut`；等待不唤醒 inactive 成员，超时/变化后需重新读取 roster/task。                                                                                                                                                                                                                                                       |
| `Config`                                 | `maxMembers/maxTasks/maxPendingMessagesPerMember/maxMessageBytes/disposalTimeoutMs` 都为正安全整数；默认分别 16/256/64/65536/5000，Profile patch 对 maxMembers 明确设为 8。                                                                                                                                                        |

## 生命周期、权限与恢复

Team 的成员、任务、消息入队/送达使用 Lead Session 的 `team/member`、`team/task`、`team/message/queued`、`team/message/delivered` 规范事件；恢复由日志与持久子 Session 目录驱动，不能只凭当前内存 roster。`sendMessage` 持久化后可立即接受或暂时排队；`interrupt` 只取消当前 turn，不清除 inbox 或任务所有者。Team 共享同一工作目录与文件系统，writeScopes 不提供并发锁；Host 插件需要协调实际写入与检查最终 diff。

服务检查 Team 成员身份和 Lead 专属动作，但不把第三方 Host 路由的请求者自动映射为已授权人类。自定义 Remote/工具须先判定用户是否请求 Team 协作，并通过精确 Agent 身份调用。Profile 卸载须等待服务运行资源清理；缺少持久 Session/Projection/Subagent 依赖时不能把服务视为可用。实验包 API 不承诺跨后续版本稳定。

## 验证

目标源码 `packages/experimental/agent-team/src/index.ts`、`src/{roster,mailbox,task-board,types}.ts`、`agent-team-profile/cordis.patch.yml`、`tool-agent-team/src/index.ts`、`client-ui-agent-team/src/index.ts`。隔离声明编译与 Config smoke 只能验证入口/配置；完整验证要在精确 Profile 中创建 Lead、fresh/fork teammate、发送与冷恢复、任务 CAS、取消/卸载和 Web UI。
