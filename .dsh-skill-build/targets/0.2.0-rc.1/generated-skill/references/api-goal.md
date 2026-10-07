# 同一 Session 的 Goal 状态与续行边界

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-goal` 提供 `ctx.goals`，通过当前 live Agent 的 Session `goal/change` 事件保存目标状态，投影键 `goal` 由日志重建。`goal-round-driver` 是自动续行策略，`tool-goal` 是模型可见操作面；Host 插件可对经授权的 live Agent 调用 GoalService，完整最小包见[协调 Goal 状态](how-to-coordinate-goal.md)。服务调用本身不是人类授权检查，自定义 Remote/工具必须显式执行授权。

## 对象与行为

| 公开对象                    | 成员与边界                                                                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GoalService` / `ctx.goals` | `get(agent)`、`create(agent,request)`、`edit(agent,ref,request)`、`pause`、`resume`、`complete`、`block(agent,ref,reason)`、`clear`、`disarm`；要求 `ctx.agents.get(agent.id) === agent`。 |
| `GoalRef`                   | `{id,revision}` 比较并交换凭据；每次 durable 变更递增 revision，旧 ref 报 `GOAL_STALE_REVISION`。                                                                                          |
| `GoalView`                  | 当前 `GoalSnapshot`、`roundsStarted`、时间戳及进程内 `activation`。phase 为 `active`/`paused`/`blocked`/`complete`；activation 为 `armed`/`disarmed`。                                     |
| `GoalProjection`            | Client/Session 投影只含 durable phase、revision、rounds 等，不含 activation；当前值可为 `null`。                                                                                           |
| `GoalError`                 | 带稳定 code，例如非法目标、已有目标、旧 revision、无 live Agent、非法状态转移或轮次上限。                                                                                                  |

`create` 规范化非空 objective，缺省轮次上限由配置 `defaultMaxGoalRounds`（默认 256）决定；创建时 phase 为 active 并 arm。`pause` 从 active 转 paused 且 disarm；`resume` 可从 active/disarmed、paused、blocked 重 arm，但轮次预算耗尽前需先编辑上限；`complete` disarm；`block` 需要稳定小写短横线 code 和非空 reason；`clear` 写 tombstone。`disarm` 只改变进程内自动续行权，不增加 durable revision。每次 durable 变更 append 一条规范 `goal/change`，因此模型可见状态可从 Session 日志重建。

## 所有权、恢复与权限

`goal-round-driver` 仅在 active 且 armed、Agent 空闲并满足持久化 checkpoint 后预留下一轮；Agent/插件卸载时 disarm 以免无主续行。恢复的 Session 投影能复原 phase/ref，但新进程的 activation 初始 disarmed，必须由人类授权的 resume 再启用。Host 不应把 active phase 误认成当前仍获准自动运行。

`tool-goal` 有自己的直接人类请求约束、更新策略与模型输出；直接调 `ctx.goals` 会绕开这些工具层规则。公开插件只应在明确拥有该命令的可信入口中变更目标，校验目标 Agent 的身份与调用者权限，并用最新 ref 处理并发更新。不要从名称或目标文字推断用户授权。目标的行为事实来自 `goal/change`，进程内续行状态来自 activation 事件，二者不可互换。

## 验证

目标版本声明编译；用真实 Session/Projection/Agent registry 验证 create→pause 的两条 committed `goal/change`、revision 和 stale CAS；另在完整 Agent loop/driver Profile 验证 checkpoint、重启 disarm、续行取消和权限入口。只跑领域服务不证明自动 Agent 续行。
