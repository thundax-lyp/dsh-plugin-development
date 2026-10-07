# 在插件中读取 Session Token 压力

## 任务与前置

目标 `dsh-v0.2.0-rc.1` 的 Host 已装载 `SessionProjectionRegistry` 与 `@deepseek-ai/dsh-token-meter`。以下插件在 Agent 准备新步骤时记录**当前 Session 的估算压力**，不改变 Agent 决策或模型上下文。测量是日志重放快照，可能按当前模型路由的图像定价重新计算，不能用于精确账单。详情见 [内置 LLM 路由、重试与 Token Meter](api-llm-builtins-retry-meter.md)。

## 完整 Host 插件

`package.json` 对 `@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/dsh-agent@0.2.0-rc.1` 与 `@deepseek-ai/dsh-token-meter@0.2.0-rc.1` 声明 peer/development dependency；用 NodeNext 编译 `src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-token-meter'

export const name = 'session-pressure-observer'
export const inject = ['tokenMeter']

export function apply(ctx: Context): void {
  ctx.on('agent/pre-step', ({ agent }, next) => {
    const pressure = ctx.tokenMeter.measure(agent.session)
    ctx.logger.info(`session ${agent.id}: estimated pressure ${pressure.totalTokens} tokens at log revision ${pressure.logRevision}`)
    return next()
  })
}
```

`ctx.on` 属于插件 fiber，卸载后不再观察新步骤；本例不拥有异步资源。若把压力用于裁剪、压缩或收费决策，应明确自己的阈值和日志事实归属，勿依赖日志之外的进程内估算。验证时先在新 Session 上 `measure`，应得 `baseline.kind:'none'`、`totalTokens:0`；写入模型可见消息后读数应随 surface 增长。Agent hook 的真实调用需在完整 Profile 中另行验证。
