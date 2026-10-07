# 挂载自定义名称的 SQLite Backend

## 适用任务

在 `dsh-v0.2.0-rc.1` 的 Host Profile 中，为某类领域记录提供独立的 SQLite 数据库和路由名称。此示例实现一个自有 Backend 插件的注册、依赖和清理路径；介质操作委托目标版本的 `SqliteStorageBackend`。若实现新的介质，须额外满足[Storage Backend SPI](api-session-format-storage-backend.md)的全部 `KvUnit` 契约。

## 依赖与完整骨架

独立消费包直接安装 `@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/dsh-storage@0.2.0-rc.1`、`@deepseek-ai/dsh-storage-domain@0.2.0-rc.1`、`@deepseek-ai/dsh-storage-sqlite@0.2.0-rc.1` 和 `zod@^4.4.3`；`zod` 是下方 schema import 的直接依赖，不能依靠 DSH 包的传递依赖。编译另需 TypeScript 和 Node 类型。隔离消费包的依赖清单如下：

```json
{
  "name": "demo-archive-backend",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-storage": "0.2.0-rc.1",
    "@deepseek-ai/dsh-storage-domain": "0.2.0-rc.1",
    "@deepseek-ai/dsh-storage-sqlite": "0.2.0-rc.1",
    "zod": "^4.4.3"
  },
  "devDependencies": { "typescript": "^5.9.0", "@types/node": "^22.0.0" }
}
```

```ts
import { Context } from '@deepseek-ai/cordis'
import Storage, { storageBackendServiceKey } from '@deepseek-ai/dsh-storage'
import { SqliteStorageBackend } from '@deepseek-ai/dsh-storage-sqlite'
import StorageDomain, { defineDomain, domainTable } from '@deepseek-ai/dsh-storage-domain'
import { z } from 'zod'

const spec = defineDomain({
  name: 'demo_notes', version: 1,
  tables: { notes: domainTable<string, { text: string }>(z.object({ text: z.string().min(1) })) },
})

async function mount(dbPath: string): Promise<Context> {
  const ctx = new Context()
  try {
    await ctx.plugin(Storage)
    await ctx.plugin({
      inject: ['storage'],
      apply: owner => {
        const backend = new SqliteStorageBackend({ path: dbPath, journalMode: 'wal' })
        owner.effect(() => {
          const unregister = owner.storage.backend.register('archive', backend)
          return async () => { unregister(); await backend.close() }
        }, 'archive-backend')
        owner.provide(storageBackendServiceKey('archive'), backend)
      },
    })
    await ctx.plugin(StorageDomain, { backend: 'archive' })
    return ctx
  } catch (error) {
    await ctx.fiber.dispose()
    throw error
  }
}

const ctx = await mount('/absolute/private/path/notes.sqlite')
try {
  const domain = await ctx.storageDomain.open(spec)
  try {
    await domain.table('notes').put('n1', { text: 'first' })
    const saved = domain.table('notes').get('n1')
    if (saved?.text !== 'first') throw new Error('write/read mismatch')
  } finally { await domain.close() }
} finally { await ctx.fiber.dispose() }
```

`dbPath` 应由 Host 配置确定并指向可信的私有目录；不要让模型输入直接成为路径。`mount` 的失败分支关闭部分装载的 fiber；正常分支先关闭 Domain，再卸载 Context，Backend effect 才注销名字并关闭数据库。Domain 版本不匹配时不要覆盖现有文件，应由该领域的所有者提供显式迁移。

## 验证

独立消费测试以隔离临时数据库运行同一组合，完成首次写、完全卸载、第二个 Context 重开并读取与更新。对真正新介质实现，还须在目标版本跑 `packages/storage/storage/tests/contract.ts`；只做本例不能宣称实现了通用 KV Backend 的故障和耐久契约。此领域数据不会自动成为 Session 模型事实。
