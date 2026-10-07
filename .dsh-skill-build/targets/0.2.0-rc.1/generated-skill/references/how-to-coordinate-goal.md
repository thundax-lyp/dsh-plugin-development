# 在可信 Host 命令中协调 Goal

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。本例包装当前 live Agent 的 `ctx.goals.create` 与 `pause`，让调用方使用最新 revision 进行 CAS。调用入口必须已经验证人类对该 Session 的操作权限；这个 Service 不注册模型工具，也不替代 `tool-goal` 的直接人类请求约束。Profile 需装载 `agents`、`session-projection`、`goal`，续行另需 `goal-round-driver`。契约见[Goal 状态](api-goal.md)。

## 实现步骤

在独立 Host 插件包中保存以下文件。`package.json`：

```json
{
  "name": "demo-goal-coordinator",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./lib/index.js",
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-agent": "0.2.0-rc.1",
    "@deepseek-ai/dsh-goal": "0.2.0-rc.1"
  },
  "devDependencies": { "typescript": "^5.9.0" }
}
```

`tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "lib",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

`src/index.ts`：

```ts
import { Context, Service } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type { GoalRef, GoalView } from '@deepseek-ai/dsh-goal'

declare module '@deepseek-ai/cordis' {
  interface Context { demoGoals: DemoGoalCoordinator }
}

export class DemoGoalCoordinator extends Service {
  static inject = ['agents', 'goals']
  constructor(ctx: Context) { super(ctx, 'demoGoals') }

  start(agent: Agent, objective: string): GoalView {
    if (this.ctx.agents.get(agent.id) !== agent) throw new Error('agent is not live')
    return this.ctx.goals.create(agent, { objective, maxGoalRounds: 2 })
  }

  pause(agent: Agent, ref: GoalRef): GoalView {
    if (this.ctx.agents.get(agent.id) !== agent) throw new Error('agent is not live')
    return this.ctx.goals.pause(agent, ref)
  }
}

export default DemoGoalCoordinator
```

运行 `npm install && npm run build`，将包装载在上述服务之后。可信调用方从已授权 Session 解析**精确 live Agent**，调用 `ctx.demoGoals.start(agent, objective)`，保存返回的 `{id, revision}`；暂停时传该 ref。其他变更可能先提交，收到 `GOAL_STALE_REVISION` 时应重新 `get(agent)` 并请上层决定是否重试，不能自动覆盖新目标。GoalService 会同步 append `goal/change`，由 Session 日志投影重建。Service 由插件 fiber 所有，卸载不持有额外进程或观察器；它也不自行驱动 Agent。

## 验证与边界

用真实 Session、Projection 和 Agent registry 验证创建为 revision 1/active，暂停为 revision 2/paused，且产生两条 `goal/change`；旧 ref 必须拒绝。重启后 phase 可恢复，但 activation 是进程内状态，必须由获准的 resume 重 arm。自动续行、持久化 flush、权限和用户可见工具结果需在完整 Profile 单独验收。本次隔离消费 smoke 验证了前两条事件与相位，不证明 round driver。
