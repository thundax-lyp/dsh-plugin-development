# 读取 Host 插件清单

相关公开契约：[API 参考](api-host-plugin-inventory.md)。

## 任务与依赖

目标 `dsh-v0.2.0-rc.1`。安装 `@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/cordis-plugin-loader@1.0.5`、`@deepseek-ai/dsh-host-plugin-inventory@0.2.0-rc.1`。在 Host Profile 中先装载 Loader；需要 Remote API 时另装载 Gateway。以下例子只在可信本机进程打印模块名和阶段；若把结果传给远程 Client，须先做 Profile 查看授权。

```ts
import { Context } from '@deepseek-ai/cordis'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import { readPluginInventory } from '@deepseek-ai/dsh-host-plugin-inventory'

const ctx = new Context()
try {
  await ctx.plugin(Loader)
  const snapshot = await readPluginInventory(ctx)
  for (const entry of snapshot.entries) {
    ctx.logger.info('%s: %s', entry.moduleName, entry.fiberPhase ?? 'not running')
  }
} finally {
  await ctx.fiber.dispose()
}
```

`finally` 在装载、读取或日志失败时释放 Fiber。调用方只读取快照，无需注销观察器；如果长期显示状态，应按产品刷新周期重新调用 `list`，并在关闭页面或插件卸载时取消自己的轮询器。`entryId` 只标识已有 Loader entry，不能据此绕过插件管理授权。

## 验证

对精确 npm 声明编译并真实运行示例，确认 `list` 返回数组；再在隔离 Loader 加入一个禁用 entry，验证 `enabled:false`、`fiberPhase:null`。不要把这项 smoke 当成真实 Profile 的授权或跨重启保证。
