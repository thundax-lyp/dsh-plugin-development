# Plan mode 与 Todo 清单

## 适用范围与入口

本页锁定 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-plan-mode` 根导出 `PlanModeController`、`PlanModeConfig`、`EXIT_PLAN_MODE`、`PlanProjection` 等 Host 契约；`./types` 与 `./client` 是分离的类型入口。`@deepseek-ai/dsh-tool-todo` 根导出 `apply`、`Config` 和 `TodoItem`；`./client` 投射浏览器安全类型。二者都把协作状态写进 Session 日志与 projection：`plan/mode` 记录是否在 plan mode，`todo/write` 记录完整待办快照。它们没有替插件作者执行计划或持久调度未来触发；未来触发见 [Schedule](api-schedule.md)，后台执行见 [Jobs](api-jobs.md)。

## Plan mode 契约

`PlanModeController` 需要 `tools`、`systemPrompt`、`sessionProjections`；配置 `{ section: string }` 为非空部署 guidance，非法或额外键在装载时报错。可选的 Commands 服务存在时注册 `/plan` 与 `/plan off`。`ctx.planMode.get(agent)` 返回日志已生效的 `active` 及可能待提交的目标 `pending`；`set(agent, active)` 返回 `committed | queued | cancelled | noop`。空闲 turn 外切换立即追加 `plan/mode`；turn 中选择要等下一个被接纳的 `agent/pre-step` 才追加。失败追加会保留待提交选择以便下一次边界重试。Session projection 的浏览器值 `PlanProjection` 为 `{ active, pending: boolean }`，其中布尔 `pending` 表示确有未生效选择，和 Host `get()` 的可选目标值不同。

`PlanModeConfig.section` 是部署提供的指导文字；`EXIT_PLAN_MODE` 是内置退出工具名，外部插件可引用该常量识别工具，但它不注册另一个退出处理器。

`exit_plan_mode` 始终在工具目录中，但只有已激活 plan mode 的 Agent 可用；输入必须是以 `#` 标题开头的完整 Markdown plan。工具通过 user-questions 请求审阅：批准后只选择退出，下一次被接纳的 step 才提交日志；继续规划或用户关闭审阅不会退出。缺审阅通道时工具报错。Plan mode 指导文本是 prompt section，沙箱和审批规则独立执行，不能把 plan 状态当权限位。

Host 代码如需读取或选择计划状态，可使用以下目标声明可编译的切片；调用者须持有该 Agent 的合法引用，且目标组合已经装载 Plan mode。它不绕过用户审阅去伪造 `exit_plan_mode` 的结果。

```ts
import type { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-plan-mode'

export function requestPlanning(ctx: Context, agent: Agent) {
  const before = ctx.planMode.get(agent)
  const outcome = ctx.planMode.set(agent, true)
  return { before, outcome, after: ctx.planMode.get(agent) }
}
```

`set` 本身没有分配异步资源；调用方不应把 `queued` 解释为模式已经记录进 Session，也不应独自自动调用 `set(false)` 充当用户批准。

自定义 Profile 启用时，在 `tools`、`system-prompt`、`session-projection` 后插入该插件，并由部署者提供完整的非空规划指导 `section`。启动后在一个 Agent Session 调用 `/plan`，核查 `get(agent)` 的当前值与下一次被接纳 step 后的 `plan/mode` 事件；退出仍走 `exit_plan_mode` 的用户审阅。内置 base bundle 已有 `plan-mode` 行，不应重复插入同一 id。

## Todo 契约

`dsh-tool-todo.Config` 的公开 `allowParallelInProgress: boolean` 为必填；Loader 可在配置行填默认，直接构造配置仍须给此字段。

`dsh-tool-todo` 需要 `tools` 与 `sessionProjections`，配置 `allowParallelInProgress: boolean` 必填。它注册一个 `todo_write` 工具，模型每次必须提交**完整** `todos` 列表；每项只有 `content` 与 `status: pending | in_progress | completed`。工具 trim 内容、拒绝空内容和重复内容；并行配置为 false 时拒绝多个 `in_progress`。非 Agent caller 没有拥有者 Session，调用会报错。通过后只追加一次 `todo/write`，工具的唯一规范 JSON 结果含 `todos` 与各状态计数；渲染从这个结果纯函数生成。

```ts
import type { TodoItem } from '@deepseek-ai/dsh-tool-todo'

export const initialTodos: TodoItem[] = [
  { content: 'Inspect source', status: 'in_progress' },
  { content: 'Verify behavior', status: 'pending' },
]
```

`todos` projection 按最后一次完整写入折叠；第一次写入之前及后续 `turn/start` 之后为 `null`，`turn/end` 不清除刚完成的清单。因此该清单是当前 turn 的展示与计划状态，不是跨 turn 可执行队列。真实工作的完成事实应由业务服务/Session 事件承载；不能仅凭 UI 中的 todo 状态推断副作用已提交。需要独立 Client 读取时使用各包 `./client` 类型以及 Session projection 装配，不在 Client 直接导入 Host 服务值。

自定义 Profile 在 `tools` 和 `session-projection` 就绪后插入 `@deepseek-ai/dsh-tool-todo`，明确配置 `allowParallelInProgress`。内置 base bundle 已有 `tool-todo` 行且设为 `true`。在隔离 Session 调用 `todo_write` 传入完整列表，核查一次 `todo/write` 事件和返回计数；下一个 `turn/start` 后核查 projection 清空。插件卸载时工具登记随 fiber 清理；仍活跃 Session 的已提交日志不应被删除。

## 验证与边界

上述 Host 类型用法和 `TodoItem` 使用目标版声明编译通过。精确 checkout 的 plan/todo 源码与测试用于核查 projection 折叠、工具输入和生命周期。本章未运行独立 Agent 的 `/plan`、审阅 UI、`todo_write` 模型调用或浏览器 projection 装配；这些实际交互仍需在目标 Profile 核验。
