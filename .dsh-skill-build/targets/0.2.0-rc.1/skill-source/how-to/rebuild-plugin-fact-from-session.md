# 从 Session 日志重建插件事实

## 目标与前置

任务：插件一次业务操作完成后，重启或恢复 Session 仍能判断该操作的**已确认结果**，并让下一次模型调用看到需要的结果。目标版本为 `dsh-v0.2.0-rc.1`。需使用 [Session 日志契约](api-session-log.md)；若要跨进程存活，还需装载 [SessionPersistence 后端](api-session-persistence.md) 并满足 flush/checkpoint。工具规范结果与模型可见渲染由 [tools.md](api-tools.md) 负责。

## 实现步骤

1. 为本插件声明 `SessionEventMap` 中独有的事件名和完整结果 payload。payload 只放可序列化、足以重建的事实；`status: 'done'` 一类结论应携带对应 ID 与实际结果。记录失败或未完成时，使用独立的明确状态，不从“没有 done 事件”推断成功。
2. 在**真实业务提交完成后**调用持有的 `agent.session.append('plugin/operation', completeState)`。在模型工具中，工具自己的规范 JSON 结果和 `renderResultForAssistant` 负责本轮可见性；自定义 `plugin/operation` 是 log-only，不会自动变成消息。不可把易变的插件内存缓存当作持久事实。
3. 读者用判别式 `switch (event.type)`，按 `seq` 顺序从自有事件折叠当前状态。live Session 可在注册的投影/服务中折叠；冷读用 `ctx.sessionPersistence.open(id, 'read')`、`read`，始终 `await close()`。不要使用目标版本标记废弃的 `Session.snapshotEvents`、`eventAt`、`ownEvents` 新建扫描逻辑。
4. 在必须跨崩溃存活的业务确认边界，由生命周期 owner 或调用方确保 `flush` 成功；如果只有 `Session.append` 或后端 `append` 已返回，只能声明同进程可见。由 Agent loop 创建的 Session 写句柄归 Agent loop 所有，插件不要再 `open(id, 'write')` 与之争夺。
5. Agent 恢复走 `ctx.agents.resume({ resumeSessionId, setup })` 的公开入口：setup 重新注册插件所需工具、投影与 prompt，loop 会在取得写所有权后修复未闭合 turn。只读重建不会修复磁盘。setup 的装配取决于所在 Profile，不能把“记录存在”推断成插件重新安装或工具自动恢复。

### 事件与折叠骨架（Host）

以下代码只展示本任务的事件声明和纯折叠函数；实际插件包、Tool 的 `execute`、`Agent` 来源与 Profile 挂载需按 [注册模型工具](how-to-register-model-tool.md) 的完整包骨架连接。此片段已在隔离消费项目中对安装的 `0.2.0-rc.1` 包通过 TypeScript 检查；它仍不是完整的独立插件包或运行时验证。

```ts
import type { SessionEvent } from '@deepseek-ai/dsh-session'

declare module '@deepseek-ai/dsh-session/types' {
  interface SessionEventMap {
    'example/operation-state': {
      operationId: string
      status: 'done' | 'failed'
      result: string
    }
  }
}

type OperationState = Readonly<{
  status: 'done' | 'failed'
  result: string
}>

export function foldOperationState(events: readonly SessionEvent[]): ReadonlyMap<string, OperationState> {
  const states = new Map<string, OperationState>()
  for (const event of events) {
    if (event.type !== 'example/operation-state') continue
    states.set(event.data.operationId, {
      status: event.data.status,
      result: event.data.result,
    })
  }
  return states
}
```

写入位置应在业务操作完成且结果已经确定后：`agent.session.append('example/operation-state', { operationId, status: 'done', result })`。如果业务操作失败，写 `status: 'failed'` 和可供恢复的错误摘要；取消时是否写事件取决于是否有已确认的外部副作用。对不可重试的外部副作用，还需外部幂等键或回读协议，Session 日志本身不能证明外部系统恰好执行一次。

## 验证与完成边界

事件声明合并与折叠片段已在隔离消费项目对安装的目标版本包完成 TypeScript 检查。还应在真实 Profile 中触发业务操作，检查一条对应事件与工具规范结果，重启后 cold read fold 得到同一状态，下一次模型请求看到工具结果或明确注入的消息。另测非法 JSON payload、取消、flush 失败、插件卸载和恢复时缺少解释器；这些运行路径尚未验证。
