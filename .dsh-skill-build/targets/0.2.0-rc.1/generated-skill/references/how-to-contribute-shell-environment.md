# 提供模型 Shell 环境事实

## 目标和依赖

在 `dsh-v0.2.0-rc.1` 为模型 `bash`/`pwsh` 工具增加一个非秘密的 `DSH_DEMO_CONTEXT`，每次执行时由 `ctx.shellEnv` 重新求值。安装 `@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/dsh-shell-env@0.2.0-rc.1`、`@deepseek-ai/dsh-tools@0.2.0-rc.1`；实际 Profile 还需装载相应 shell executor 与模型工具。规则见[模型 Shell 环境变量扩展](api-shell-env.md)。

```ts
import { Context } from '@deepseek-ai/cordis'
import * as ShellEnv from '@deepseek-ai/dsh-shell-env'
import type { ToolExecution } from '@deepseek-ai/dsh-tools'

const ctx = new Context()
try {
  await ctx.plugin(ShellEnv, { dshHome: '/test/dsh' })
  const owner = await ctx.plugin({
    inject: ['shellEnv'],
    apply(child) {
      child.shellEnv.register({
        name: 'demo',
        variables: { DSH_DEMO_CONTEXT: { description: 'Public demo context' } },
        resolve: () => ({ DSH_DEMO_CONTEXT: 'demo-only' }),
      })
    },
  })
  try {
    const names = ctx.shellEnv.list().map(item => item.key)
    if (names.join(',') !== 'DSH_DEMO_CONTEXT') throw new Error('contribution missing')
    const values = ctx.shellEnv.collect({} as ToolExecution)
    if (values.DSH_DEMO_CONTEXT !== 'demo-only') throw new Error('wrong value')
  } finally { await owner.dispose() }
  if (ctx.shellEnv.collect({} as ToolExecution).DSH_DEMO_CONTEXT !== undefined)
    throw new Error('contribution leaked')
} finally { await ctx.fiber.dispose() }
```

`{} as ToolExecution` 仅供无 Agent 的 registry 隔离测试，不适用于生产工具调用；真实 shell 工具将其实际 `ToolExecution` 传入 `collect`。插件需要 Agent 相关值时检查 `execution.agent` 是否存在，不要从可控文本猜 Session 身份。选择 `DSH_*` 键时先与内置和其他插件声明去重；返回值供模型 shell 进程看见，绝不能包含凭据。独立 npm 测试已验证上述注册/撤回路径；真正的环境注入还要在所用 shell Provider、模型工具和 Profile 中起命令检查。
