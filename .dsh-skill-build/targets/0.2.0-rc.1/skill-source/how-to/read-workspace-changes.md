# 读取顶层 turn 的工作区变化

相关公开契约：[API 参考](api-workspace-changes.md)。

## 任务与装载

目标 `dsh-v0.2.0-rc.1`。Host Profile 先装载 `@deepseek-ai/dsh-subprocess`，再装载 `@deepseek-ai/dsh-workspace-changes`。以下消费插件只在已拥有的 Session 事件上读取摘要；通过 Remote 暴露时，应在调用此插件前核验请求者对该 Session 的访问权。

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-session'
import type {} from '@deepseek-ai/dsh-workspace-changes'

export const inject = ['workspaceChanges']

export function apply(ctx: Context): void {
  ctx.on('session/event', (session, event) => {
    if (event.type !== 'workspace/changes') return
    const summary = ctx.workspaceChanges.summary(session.id, event.seq)
    if (summary === undefined) return // Session/provider has already been disposed.
    ctx.logger.info('Turn %d changed %d files', summary.turn, summary.total)
    // For a file selected by an authorized caller, obtain a cancellable comparison:
    // await ctx.workspaceChanges.diff(session.id, event.seq, index, signal)
  })
}
```

此例没有创建异步资源；Cordis 取消注册其事件监听器。若要按需提供 diff，调用方持有 `AbortController`，停止请求时 abort，卸载插件时取消未完成请求。`diff` 的 `index` 必须来自同一 `summary.files`，按 `kind` 分支渲染；`undefined` 表示记录已失效，不可用当前文件内容冒充 turn 结束时的比较。

## 验证

在目标 Profile 的临时 Git 仓库中打开真实顶层 Session 和 turn，修改文本文件，观察 `workspace/changes` 事件并读取 summary/diff；再 dispose Session，确认 `summary` 与 `diff` 返回 `undefined`。另测无 Git 情况的文件工具捕获和 binary/oversized。未运行这些观察时只报告声明编译，不宣称端到端成功。
