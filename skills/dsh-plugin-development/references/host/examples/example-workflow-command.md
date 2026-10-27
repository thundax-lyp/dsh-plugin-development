# 完整示例：斜杠命令运行两项工作流委派

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`，Host 侧。用户输入 `/review-pair`，命令在接收 Agent 下启动工作流，等到两项子任务结束后向 UI 返回一个结果。依赖 [Commands](../api/api-capabilities-dsh-commands.md)、[Workflow](../api/api-capabilities-dsh-workflow.md)、[Subagent](../api/api-capabilities-dsh-subagent.md) 与 [PTC](../api/api-capabilities-dsh-ptc-runtime.md)。这是显式命令触发的编排，运行会使用所选模型并产生其正常费用。

## 文件清单

建立 `review-pair/`，包括 `package.json`、`tsconfig.json`、`src/index.ts`、`cordis.patch.yml`。

`package.json`：

```json
{
    "name": "dsh-review-pair",
    "version": "0.1.0",
    "type": "module",
    "exports": { ".": "./lib/index.js" },
    "files": ["lib", "cordis.patch.yml"],
    "engines": { "dsh": "0.2.1-rc.3" },
    "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
    "scripts": { "build": "tsc -p tsconfig.json" },
    "peerDependencies": {
        "@deepseek-ai/cordis": "~4.0.5",
        "@deepseek-ai/dsh-commands": "0.2.1-rc.3",
        "@deepseek-ai/dsh-workflow": "0.2.1-rc.3"
    },
    "devDependencies": {
        "@deepseek-ai/cordis": "~4.0.5",
        "@deepseek-ai/dsh-commands": "0.2.1-rc.3",
        "@deepseek-ai/dsh-workflow": "0.2.1-rc.3",
        "typescript": "~6.0.3"
    }
}
```

`tsconfig.json`：

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "strict": true,
        "skipLibCheck": true,
        "rootDir": "src",
        "outDir": "lib"
    },
    "include": ["src/**/*.ts"]
}
```

`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-commands'
import type { WorkflowRun } from '@deepseek-ai/dsh-workflow'

export const name = 'review-pair'
export const inject = ['commands', 'workflowEngine']

export function apply(ctx: Context): void {
  const active = new Set<WorkflowRun>()
  ctx.effect(() => async () => {
    const runs = [...active]
    for (const run of runs) run.cancel('贡献插件已卸载')
    await Promise.all(runs.map(run => run.dispose()))
  })
  ctx.commands.register({
    name: 'review-pair',
    description: '并行委派两个有界检查，并返回统一结果。',
    handler: async invocation => {
      const run = ctx.workflowEngine.start({
        parent: invocation.agent,
        signal: invocation.signal,
        meta: { name: 'review-pair', description: '执行两个独立检查' },
        maxTotalAgents: 2,
        script: `
const answers = await parallel([
  () => agent('只回答：检查甲完成'),
  () => agent('只回答：检查乙完成')
])
return { answers }
`
      })
      active.add(run)
      try {
        const result = await run.result
        if (result.stopReason !== 'completed') {
          return { kind: 'error', text: result.error ?? result.stopReason }
        }
        return { kind: 'success', text: JSON.stringify(result.value) }
      } finally {
        await run.dispose()
        active.delete(run)
      }
    }
  })
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: review-pair
      name: dsh-review-pair
```

## 构建和挂载

以下使用全新的隔离 home，以保证示例 Profile 同时具有基础服务与 Web UI。在当前 shell 先执行：

```sh
export DSH_HOME="$(mktemp -d)"
dsh --profile reviewdemo --from-default-profile web --dump-config
```

此初始化仅针对刚建立的空 home；对已有 Profile 使用 `--from-default-profile` 会替换其原有目录。后续安装、启动和卸载均在同一 shell 中执行。


在包目录运行 `pnpm install`、`pnpm build`。从父目录运行 `dsh plugin --profile reviewdemo add ./review-pair`，再运行 `dsh --profile reviewdemo`。目标基础 bundle 已提供 spawn subagent、Node PTC 与 workflow-ptc；自定义组合必须先提供 `fs`、`subprocess`、`sandbox`、`sandboxPolicy`、subagent provider 和工作流引擎。不要同时挂载两个 `workflowEngine` 实现。

选择有效模型和 workspace 后在 UI 输入 `/review-pair`。成功时直接 UI 结果包含两个答案。命令本身不向父模型发送用户消息；子级请求与结果由各自 Agent 的 Session 持久记录，workflow 生命周期可由其事件观察。命令结果使用一次 `JSON.stringify` 形成单份规范呈现，不再另造模型工具结果。

## 取消、失败和卸载

运行中取消 UI 请求，应由 invocation.signal 取消 run；handler 不将取消结果包装成 success。`result` 兑现后检查 stopReason，不能只判断 Promise 已 resolve。`finally` 的 dispose 等待进程和子级清理。引擎的普通 child 失败可在脚本中表现为 null，真实业务脚本应自行决定是否允许部分结果；本例只收集答案，不作成功内容验证。

从 Profile 移除本 bundle 并重启，确认 `/review-pair` 不再被发现。热卸载时 command 注册撤销；插件 effect 会取消自身 active 集合中的 run 并等待清理，UI 请求取消则通过 invocation.signal 结束。active 集合归当前插件 scope，不跨实例共享，也不持久化活对象。验证分别观察：声明编译、真实命令发现、两项子级归属、结果、取消后无活动子级，以及卸载后命令不可用。
