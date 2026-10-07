# 列出 Session 引用候选

相关公开契约：[API 参考](api-session-reference.md)。

## 任务

在 Host UI 中为一个已授权 live Agent 提供历史 Session 自动补全。Profile 必须装载 Agent、Session Query 和 `@deepseek-ai/dsh-session-reference@0.2.0-rc.1`；Host 消费包使用该精确版本的声明。

```ts
import type { Context } from '@deepseek-ai/cordis'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { SessionReferenceCandidate } from '@deepseek-ai/dsh-session-reference/types'
import type {} from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-session-reference'

export async function listSessionReferences(
  ctx: Context, agentId: SessionId, query: string, signal: AbortSignal,
): Promise<SessionReferenceCandidate[]> {
  signal.throwIfAborted()
  const agent = ctx.agents.get(agentId)
  if (agent === undefined) throw new Error('Agent is not live')
  return ctx.sessionReferenceResolver.listCandidates(agent, query, 20, signal)
}
```

在调用前检查用户对目标 Agent 和返回候选存储域的访问权，并在连接关闭时取消。用户选择后使用 `formatSessionReferenceMention` 写入正常消息草稿；接受直接消息前调用 `prepare` 获取额外上下文，再按产品消息流程提交。列表不读取源日志，不可把候选标题当成已核实内容。

## 验证

精确声明编译，再以两个真实 Session 的隔离 Profile 验证自我排除、cwd 排序、标题回退、取消与权限。若只是本函数编译通过，不能宣称 `prepare` 的快照和恢复已验证。
