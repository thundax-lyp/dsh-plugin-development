# Schedule 与持久提醒

## 适用范围与入口

本页锁定 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-schedule` 的 Host 根导出 `ScheduleService`、`ScheduleRecord`/请求与结果类型、规则构造与解析函数，以及 `registerScheduleTools`；`./client` 是浏览器安全的类型导出。Host Profile 装载服务后使用 `ctx.schedule`。该服务依赖 `agents`、`sessions`、`tools`、`storageDomain`、`sessionController`、`sessionPersistence`；缺任一项不能把独立示例视为可运行。它为各 live 根 Agent 注册 `schedule_create`、`schedule_list`、`schedule_delete`、`schedule_update` 四个模型工具。

Schedule 的记录保存在 Host storage domain，绑定原 Session id。读取、修改和删除不激活 Session；到期交付才通过 Session controller 恢复原 Session，将 `schedule` 来源的消息入队、等待 Session 持久化，然后结束一次性任务或推进循环任务。入队和任务行写入不是原子事务，崩溃窗口可重复交付。Schedule 是未来触发；立即运行且需要输出 ring/取消的工作见 [Jobs](api-jobs.md)。

## 最小 Host 调用

下面是已有 Host 插件/服务调用 `ctx.schedule` 的完整一次性创建与删除切片。`sessionId` 必须来自目标 Session 本身，不能用任意 id 猜测归属。可把调用放在你自己的 tool 的 `execute` 中，传入 `exec.agent.session.id` 和 `exec.signal`；若只需模型提醒能力，直接装载内置 Schedule 工具即可，无须注册同名工具。

```ts
import type { Context } from '@deepseek-ai/cordis'
import type { SessionId } from '@deepseek-ai/dsh-session'
import type { ScheduleRecord } from '@deepseek-ai/dsh-schedule'

export async function createReminder(
  ctx: Context,
  sessionId: SessionId,
  signal: AbortSignal,
): Promise<ScheduleRecord> {
  return ctx.schedule.create(sessionId, {
    title: 'Review results',
    prompt: 'Review the results and report the next action.',
    after_seconds: 3600,
  }, signal)
}

export async function deleteReminder(
  ctx: Context,
  sessionId: SessionId,
  record: ScheduleRecord,
): Promise<boolean> {
  const result = await ctx.schedule.delete({ sessionId, id: record.id })
  return result.deleted
}
```

`create` 在写入前检查 signal，包括排队等待后；写入开始后的取消不回滚已持久化记录。调用方应把返回的 `id` 存在自己的持久事实中或交给内置管理工具；不要把进程变量当作提醒身份。删除移除任务行及其历史，已经入队的消息不被撤回。Host 调用失败应向自己的工具结果报告，不要把创建失败渲染成已安排。

## 服务成员与规则

| 成员                                                                     | 请求与结果                               | 语义                                                                                                                                                   |
| ------------------------------------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `create(sessionId, request, signal?)`                                    | `ScheduleCreateRequest → ScheduleRecord` | `title`、`prompt` 必填；恰好选择一个 `after_seconds`、`at`、`every_seconds`、`daily`、`weekly`、`cron`。生成全局唯一 `schedule-*` id，写 Host domain。 |
| `list({ sessionId })`                                                    | `ScheduleRecord[]`                       | 只列该 Session 的 active 任务，存储顺序；不激活 Agent。                                                                                                |
| `catalog()`                                                              | `ScheduleCatalogEntry[]`                 | 所有 active/inactive 任务及原 Session 绑定、状态和可用的末次交付，按目标时间/id 排序。                                                                 |
| `history({ sessionId, id, limit, before? })`                             | `ScheduleDeliveryHistoryResult`          | 读取保存的交付回执；`limit` 为 1–100 安全整数，`before` 是排他的消息 id 游标。保留窗口由配置限制。                                                     |
| `update({ sessionId, id, expected, change?, title?, prompt? }, signal?)` | `ScheduleUpdateResult`                   | 完整 `expected` 乐观比较；冲突/未知/已结束返回 `updated:false`，无写入。省略字段保留原值。                                                             |
| `delete({ sessionId, id }, signal?)`                                     | `ScheduleDeleteResult`                   | 所有权匹配才删除，未命中返回 `deleted:false, code:'schedule_not_found'`。                                                                              |

`after` 与 `at` 是一次性；`every` 是固定间隔，最低 60 秒；`daily`、`weekly`、`cron` 使用显式 IANA 时区。daily/weekly 的本地时间间隙跳过该日期，重叠时选择较早的瞬间。循环任务如果服务停机错过多次，只贡献最新一次错过的发生，并推进未来目标；同一 Session 同一轮到期的循环任务合并一条消息。`ScheduleRecord` 保存 committed `scheduledAt`；`ScheduleView` 另添 `state: scheduled | overdue` 和 `deliveryMode: host`，不要把二者混为一型。

`ScheduleService` 是 `ctx.schedule` 的公开服务类型；调度定义、触发和撤销由该服务持有，插件卸载时必须清理自己注册的任务。

## 生命周期、冲突与权限

Host 在启动时扫描 active 行并重装定时器，ended 行不重启；只有明确删除才移除记录。交付失败保留行并记录失败，不使用通用重试循环。`schedule/changed` 是提交后的通知，不是事务参与者。服务关闭时等待已接纳工作再关闭 storage。active 提醒构成 Session archive activity；archive stop 会删除该 Session 的 active 行。历史 Session 的 `schedule/change` 三类旧事件仍可读，但不自动迁移为 Host 行；遇到 active 历史提醒时只警告用户重新创建。

`ScheduleService` 的 Host `list`/`delete` 等方法本身依赖 caller 提供正确 `sessionId`。插件作者若把这些方法暴露到自己的 API/工具，必须在该边界核验调用者 Session，不能把任意 `sessionId` 或 `catalog()` 结果无条件开放。模型内置工具由服务按 exact Agent 作用域注册，已校验调用 Agent 与 Session 绑定。

## 验证

最小 Host 调用以目标版公开声明通过 TypeScript 编译。在隔离 Cordis 宿主中，使用 JSON storage/domain 和占位 Session controller 实际调用 `create`、`list`、`catalog`、`delete`；创建后可见 active 行，删除后行消失，未来提醒没有激活 Session。精确 checkout 的 Schedule 服务、domain/runtime 和测试用于核查其余 selector、交付与更新冲突。本章未运行到期交付、进程重启、时区 DST 或实际模型工具调用；这几项不能由上述 smoke 代替。
