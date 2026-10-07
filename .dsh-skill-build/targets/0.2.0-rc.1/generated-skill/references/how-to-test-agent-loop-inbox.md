# 测试 AgentLoop 插件的 Inbox 行为

## 目标与依赖

在 `dsh-v0.2.0-rc.1` 使用公开的 `@deepseek-ai/dsh-agent-loop-testkit` 启动生产 AgentLoop 和前置服务，检验插件对真实 Agent Inbox 的操作及 Session 事件。此例没有模型调用；若插件还要处理模型回合，应另外注册受控 LLM adapter 并测试对应结果。安装精确版本 `@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/dsh-agent-loop-testkit@0.2.0-rc.1`、`@deepseek-ai/dsh-llm@0.2.0-rc.1`、`@deepseek-ai/dsh-session@0.2.0-rc.1`，并用 TypeScript NodeNext 编译。API 归属见[测试支持包](api-testing-support.md)。

```ts
import assert from 'node:assert/strict'
import { Context } from '@deepseek-ai/cordis'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { SessionId } from '@deepseek-ai/dsh-session'
import { mountAgentLoopTestDependencies, mountAgentLoopTestHarness } from '@deepseek-ai/dsh-agent-loop-testkit'

const ctx = new Context()
try {
  await mountAgentLoopTestDependencies(ctx)
  // 在此处装载依赖前置服务、且必须先于 AgentLoop 装载的待测 Host 插件。
  const harness = await mountAgentLoopTestHarness(ctx)
  const agent = await harness.create(SessionId('consumer-inbox'))
  const input = createUserMessage({
    content: [{ type: 'text', text: 'hello' }], source: { kind: 'user' },
  })
  agent.inbox.append('next-turn', input)
  assert.deepEqual(harness.claim(agent, 'next-turn', 1), [input])
  assert.deepEqual(agent.session.snapshotEvents().map(e => e.type),
    ['agent/inbox/spliced', 'agent/inbox/spliced'])
} finally { await ctx.fiber.dispose() }
```

测试插件可在 `mountAgentLoopTestDependencies` 之后、`mountAgentLoopTestHarness` 之前按其 `inject` 与生命周期装载。该 kit 不装业务 adapter，也不替调用方释放 Context；要覆盖权限拒绝、取消、恢复和模型可见内容，应对照插件所写 Session 事件与结果做额外断言。独立 rc.1 npm 消费测试已编译并在 Node 运行上例的创建、append、claim 和日志事件；不据此宣称模型回合测试通过。
