# 持有并释放一次 Workflow 运行

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。本例由可信 Host 插件对一个 live Agent 启动固定脚本，等待结果并在所有路径释放 `WorkflowRun`。Profile 必须已有 `agents`、`workflow-ptc`、`subagents`、Node TypeScript `ptcRuntime`、`sandboxPolicy`；脚本和 subagent provider 均受部署策略约束。接口见[Workflow 与 Agent loop](api-workflow-agent-loop.md)。

## 实现步骤

在独立 Host 插件包中保存以下文件。`package.json`：

```json
{
  "name": "demo-workflow-coordinator",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./lib/index.js",
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-agent": "0.2.0-rc.1",
    "@deepseek-ai/dsh-workflow": "0.2.0-rc.1"
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
import type { WorkflowResult } from '@deepseek-ai/dsh-workflow'

declare module '@deepseek-ai/cordis' {
  interface Context { demoWorkflow: DemoWorkflowCoordinator }
}

export class DemoWorkflowCoordinator extends Service {
  static inject = ['agents', 'workflowEngine']
  constructor(ctx: Context) { super(ctx, 'demoWorkflow') }

  async inspect(agent: Agent, signal?: AbortSignal): Promise<WorkflowResult> {
    if (this.ctx.agents.get(agent.id) !== agent) throw new Error('agent is not live')
    const run = this.ctx.workflowEngine.start({
      parent: agent,
      meta: { name: 'demo-inspect', description: 'Return a bounded inspection result.' },
      script: 'return { inspected: true }',
      ...(signal === undefined ? {} : { signal }),
      maxTotalAgents: 1,
    })
    try {
      return await run.result
    } finally {
      await run.dispose()
    }
  }
}

export default DemoWorkflowCoordinator
```

运行 `npm install && npm run build`，然后由已授权的 Host 命令传入该 Session 的 live Agent。`start` 可同步拒绝非法请求，成功后 holder 必须 `finally` dispose，即使 `result` 返回 error/cancelled。上层只有在 `stopReason === 'completed'` 时使用 `value`；若要让父 Agent 之后看见结论，应由 owning tool/command 把规范 JSON 结果写入 Session，而不是只留在 `workflow/end` 观察事件。脚本固定且无 `agent()` 调用；仍需有效 provider 路由，因为该实现启动前校验 Provider。

## 验证与边界

隔离编译、替身 WorkflowEngine 验证 holder 等待/释放；再在完整目标 Profile 中运行真正的 `workflow-ptc`，检查脚本结果、start/end 配对、取消、进程退出与子 Agent 清理。注入一个语法错误和中止信号，分别检查发布前失败与 cancelled 结果。本文的替身测试只核验调用方所有权，不证明 PTC、沙箱或模型结果。
