# 使用 Experimental Agent Teams

相关公开契约：[API 参考](api-experimental-agent-team.md)。

## Profile 组合

目标 `dsh-v0.2.0-rc.1`。在已初始化且含 `@deepseek-ai/dsh-base` 的隔离 Profile 中，安装 `@deepseek-ai/dsh-experimental-agent-team-profile@0.2.0-rc.1`。这个包的 `cordis.patch.yml` 是在 base 后应用的有序层，不能只装其空根入口而期待 Team 服务。实际安装命令由目标版本的 `dsh plugin --profile <name> add @deepseek-ai/dsh-experimental-agent-team-profile` 执行；Web Profile 同时加载 `ui-agent-team` 的 Client 入口，headless 仅使用 Host/模型工具。

## Host 插件完整调用骨架

以下函数由已获人类明确请求的 Host Team 命令调用，收到的 `caller` 必须是当前 live Team 成员。它创建共享任务并用返回的最新 revision 认领；失败直接向调用方报告，不盲目重试覆盖并发更改。消费项目安装 `@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/dsh-agent@0.2.0-rc.1` 和 `@deepseek-ai/dsh-experimental-agent-team@0.2.0-rc.1`。

```ts
import type { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type { TeamTaskView } from '@deepseek-ai/dsh-experimental-agent-team'
import type {} from '@deepseek-ai/dsh-experimental-agent-team'

export async function createAndClaimTeamTask(
  ctx: Context, caller: Agent, subject: string, description: string,
): Promise<TeamTaskView> {
  if (!ctx.agentTeams.tryMembership(caller)) throw new Error('Caller is not a Team member')
  const created = await ctx.agentTeams.createTask(caller, { subject, description })
  return ctx.agentTeams.updateTask(caller, {
    taskId: created.id, expectedRevision: created.revision, action: 'claim',
  })
}
```

新任务创建成功后若认领失败，任务仍持久存在；调用方应显示其 ID 并读取当前任务再决定如何处理，不能重复创建同名任务。`createTask`/`updateTask` 由服务写 Lead Session 事件；本函数不额外持有资源。若扩展为消息/teammate 启动，向每次操作传有效取消信号，并区分 durable queued 收据与最终回复。

## 验证

对精确发布声明编译上述骨架；用 isolated DSH_HOME/临时 Profile 验证 patch 行禁用与注入、真实 Lead/teammate、任务创建/认领、旧 revision 拒绝、冷恢复和卸载。Config 验证或单个 TypeScript 编译不能证明 Team 生命周期、权限或 UI。
