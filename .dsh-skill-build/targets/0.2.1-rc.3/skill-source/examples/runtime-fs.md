# 读取后按版本更新文件

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`，Host 侧。完整包结构和 `dsh.bundle.patch` 配置使用[独立 Service 包](example-core-service.md)的文件清单；把包名换为 `local-file-note`，删除其自定义 Service 代码，使用下列完整入口。依赖固定 `@deepseek-ai/cordis@4.0.5`，增加 peer/dev 依赖 `@deepseek-ai/dsh-fs@0.2.1-rc.3`。本插件不注册模型工具，不把文件内容自动送入模型。

## src/index.ts

```ts
import type { Context } from '@deepseek-ai/cordis'
import { FsError } from '@deepseek-ai/dsh-fs'

export const name = 'local-file-note'
export const inject = ['fs']

export async function apply(ctx: Context) {
  const controller = new AbortController()
  const active = new Set<Promise<unknown>>()
  ctx.effect(() => async () => {
    controller.abort(new Error('插件已卸载'))
    await Promise.allSettled([...active])
  })
  const operation = (async () => {
    const target = await ctx.fs.resolve('plugin-note.txt', { signal: controller.signal })
    const info = await ctx.fs.stat(target, controller.signal)
    if (info && info.type !== 'file') throw new Error('目标不是常规文件')
    const previous = info ? await ctx.fs.readText(target, controller.signal) : ''
    const expected = info
      ? { kind: 'replaceIfVersion' as const, version: info.version }
      : { kind: 'createIfAbsent' as const }
    const result = await ctx.fs.writeText(
      target,
      previous + '来自插件的一行\n',
      expected,
      controller.signal,
    )
    ctx.logger.info('文件更新完成：%s；操作：%s', target.displayPath, result.operation)
  })()
  active.add(operation)
  try {
    await operation
  } catch (error: unknown) {
    if (controller.signal.aborted) return
    if (error instanceof FsError) ctx.logger.warn('文件更新被拒绝：%s', error.code)
    else ctx.logger.error(error)
    throw error
  } finally {
    active.delete(operation)
  }
}
```

`apply` 在依赖已满足后立即启动并等待这一项操作；失败会拒绝插件初始化，卸载主动取消并等待已启动操作。它保存的是文件，不是 Session 日志；如果模型需要引用更新结果，应由工具将规范结果追加到其所属 Session 后渲染，不能让日志打印冒充模型可见事实。

## 配套 patch 与执行

新自定义 Profile 的 base 组合已经提供 `fs-sandbox`，本例只 insert `local-file-note` 并复用该 `fs` 服务，不再追加 `fs-local`；选择 Profile cwd 中策略允许写入的路径。只有手工建立的独立空组合才用 `@deepseek-ai/dsh-fs-local` 作为唯一后端，基础定义包本身是抽象 provider。需要把现有后端替换为本地裸后端时，必须先停用 `id: fs-sandbox` 再 insert 本地后端，并明确这会改变执行边界；本例无需做此替换。运行 `pnpm run build`、`dsh plugin --profile development add .`，重启未启用 HMR 的 Profile。在 Profile 的 cwd 检查 `plugin-note.txt` 新增一行以及日志中的 operation；通过另一个进程在读取与写入之间改文件，预期 `FS_STALE_VERSION` 且不覆盖外部内容。对目录路径预期显式拒绝。卸载期间不再启动操作，等待 active 集合清空。

完整字段和观察保护的区别见 [FileSystem](../api/api-runtime-dsh-fs.md#filesystem-契约)。本例显式传 expected，不依赖 fs-observation-policy；裸 provider 的无条件写入不能替代这里的版本保护。
