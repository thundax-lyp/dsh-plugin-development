# Background Jobs

## 适用范围与入口

本页锁定 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-jobs` 根导出 `JobRegistry` 抽象服务、`JobId` 和公开类型；它不是可单独装载的实现。Host Profile 须装载 `@deepseek-ai/dsh-jobs-local` 才有进程内 `ctx.jobs`，并在目标 Agent 的组合中装载 `@deepseek-ai/dsh-tool-jobs`，由后者提供 `job_output`、`job_list`、`job_kill` 和启动前所需 controller。生产者只调用 `ctx.jobs.start()`，不要自己另建一份模型游标或任务登记表。

Job 用于同一进程内可取消、可观察的后台工作。它不是持久队列：`jobs-local` 的登记、输出 ring 和游标都在内存中；重启不能恢复未结束 job。需要按时间恢复触发的任务见 [Schedule](api-schedule.md)。

## 最小 Host 生产者

以下代码放在 Host 插件中。示例 worker 用短定时器代替真实操作，展示同步 starter、唯一的规范 JSON 工具结果、完成资源释放以及幂等取消。Profile 必须先装入上述 registry 与 controller；插件自身不能越过该门禁。`example` 是插件新增的 producer kind。

```ts
import type { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type { JobHooks, JobOutcome } from '@deepseek-ai/dsh-jobs'
import { defineTool } from '@deepseek-ai/dsh-tools'

declare module '@deepseek-ai/dsh-jobs/view' {
  interface JobKindMap { example: 'example' }
}

export const inject = ['jobs', 'tools']

function startExample(ctx: Context, agent: Agent) {
  return ctx.jobs.start({
    kind: 'example',
    label: 'Example background task',
    owner: agent.session.id,
    run(job): JobHooks {
      let closed = false
      let finish!: (outcome: JobOutcome) => void
      const done = new Promise<JobOutcome>(resolve => { finish = resolve })
      const timer = setTimeout(() => {
        if (closed) return
        closed = true
        job.append('Example finished\n', { channel: 'stdout' })
        finish({ status: 'completed', result: 'Done' })
      }, 100)
      return {
        cancel(reason) {
          if (closed) return
          closed = true
          clearTimeout(timer)
          finish(reason === undefined ? { status: 'killed' } : { status: 'killed', detail: reason })
        },
        done,
      }
    },
  })
}

export function apply(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'example_background_task',
    description: 'Start one short example background task.',
    parameters: {},
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: { jobId: { type: 'string', required: true } },
      },
      render: (_args, value) => [{ type: 'text', text: `Started ${value.jobId}` }],
    },
    execute(_args, exec) {
      if (!exec.agent) throw new Error('An owning agent is required')
      return Promise.resolve({ jobId: startExample(ctx, exec.agent) })
    },
  }))
}
```

真实 worker 的 `cancel` 必须同步、幂等并使 `done` 最终 settle；`done` 应在底层资源关闭后 resolve。若 starter 在 `run` 内部分配资源后抛错，生产者必须自行清理；注册表此时不会留下 job。若工作结果需要在恢复后的 Session 中成为模型可见事实，另行记录 Session 事件；进程内输出 ring 不能替代 Session 日志。普通模型工具只返回结构化 `jobId`，`render` 是纯文本投影。

## 公开对象与成员

`@deepseek-ai/dsh-tool-jobs.apply` 在所装载的 Agent scope 注册 `job_output`、`job_list`、`job_kill` 和 controller；卸载 fiber 撤销它们，生产者仍由 `ctx.jobs.start()` 管理。

| 对象                                    | 入口与语义                                                                                                                                                                   |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JobRegistry.start(spec)`               | 同步预检 controller、owner、kind、label、输出上限和并发上限后调用 `run(job)`；成功返回 `<kind>-N`。`owner` 是 Session id，省略时成为任何 caller 可访问的 unowned job。       |
| `JobSpec` / `JobHooks` / `JobHandle`    | `run` 同步返回 `{ cancel, done }`；`done` 为不应 reject 的 `Promise<JobOutcome>`。`job.append(text, { channel?, gapBefore? })` 与 `updateProgress(line)` 写入单一输出 ring。 |
| `list(caller?)`, `get(id, caller?)`     | 新鲜只读投影；`list` 按登记顺序返回 caller 拥有的和 unowned job，省略 caller 只看 unowned。`get` 不移动模型游标。                                                            |
| `read(id, caller?)`                     | 消费模型游标到当前总偏移；返回 `chunks`, `lossy`, 一次性的 terminal `result?` 和 job 投影。                                                                                  |
| `readAt(id, from, caller?)`             | 从绝对 UTF-8 字节偏移读取保留 ring，返回 `chunks`, `next`, `lossy`；不移动模型游标。                                                                                         |
| `kill(id, caller?, reason?)`            | 请求同步取消；live 时为 `requested`，终态为 `already-finished`。生产者取消抛错会向 caller 传播且不改变状态。                                                                 |
| `wait(id, timeoutMs, caller?, signal?)` | 等终态或正数有限超时；超时不取消 job，caller signal 只中止等待。                                                                                                             |
| `remove(id, caller?)`                   | 只能移除已结束记录；适合自行收集终态且从未把 id 交给模型的 foreground caller。                                                                                               |
| `events.subscribe(filter, listener)`    | effect 作用域订阅；过滤器为 `{ owner }` 或 `{ owners: 'scope' \| 'all' }`；`registered`、`progress`、`stopping`、`settled`、`removed`、`output` 事件在提交后发出。           |
| `attachController(name)`                | effect 作用域 controller；`tool-jobs` 已调用。自行实现 controller 时必须确保其 scope 覆盖 producer owner。                                                                   |

`JobSpec` 的 `kind`、`label`、可选 `owner`、同步 `run` 定义任务所有权；可选 `output` 是 pull source，`outputLimitBytes` 控制输出预算。`JobHooks.cancel(reason)` 必须同步且幂等，`done` 最终给出 `JobOutcome`。`JobOutcome.status` 是 `completed`、`killed` 或 `failed`，`result`/`detail` 是终态附加信息，不能把它们当成持久 Session 事实。

`JobStatus` 为 `running → stopping? → completed | killed | failed`。同一 Job 只有一次终态。`JobView.output.total/earliest` 是绝对字节坐标；超过 retention 时旧输出会被丢弃，reader 看到 `lossy`。`stdout`/`stderr` 是模型可读流；`log` 是观察者叙述。`JobEvent.settled` 在等待者释放后发出，`awaited` 表示已有活跃 waiter 收到了终态。

## 所有权、失败与卸载

`jobs-local` 默认每个 exact owner 或 unowned bucket 最多 10 个活跃 job、每个 live ring 保留 256 KiB、settled ring 保留 16 KiB、pull source 轮询 150 ms；均可通过其配置调整。owner 的 Agent 或服务销毁会取消 live job 并等待遵守协议的 producer；取消抛错时只能强制结束登记记录，不能声称底层工作已停止。已结束记录留到 owner/service 销毁或显式 `remove`。id 可预测，访问控制依赖 caller Session id 而非 id 保密。单个注册表可服务多个组合，controller 和 `{ owners: 'scope' }` 都按组合 scope 判断。

## 验证

独立消费包对上面插件代码使用目标版声明通过 Host TypeScript 编译。在隔离 Cordis 宿主中，实际执行了 `example_background_task`，观察到 completed、输出文本及只交付一次的 result；第二个 job 经内置 `job_kill` 进入 killed，并保留取消原因。源码与上游 `jobs-local` / `tool-jobs` 行为测试支持其余状态、游标、owner 和 controller 语义。尚未在完整 Profile 中运行模型轮次、长时间真实工作、卸载中止或进程重启恢复。
