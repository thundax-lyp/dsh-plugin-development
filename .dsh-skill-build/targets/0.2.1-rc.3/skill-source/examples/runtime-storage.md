# 插件拥有一个持久 Domain

Host 侧，适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。使用[独立 Service 包](example-core-service.md)的 `package.json`、`tsconfig.json` 和 bundle patch，包名改为 `local-domain-note`，入口替换如下。增加 peer/dev 依赖 `@deepseek-ai/dsh-storage-domain@0.2.1-rc.3` 和 `zod@4.4.3`；Cordis 固定 `4.0.5`。

## src/index.ts

```ts
import type { Context } from '@deepseek-ai/cordis'
import { defineDomain, domainTable } from '@deepseek-ai/dsh-storage-domain'
import { z } from 'zod'

export const name = 'local-domain-note'
export const inject = ['storageDomain']
const spec = defineDomain({
  name: 'local_domain_note',
  version: 1,
  tables: { notes: domainTable(z.object({ text: z.string() })) },
})

export async function apply(ctx: Context) {
  await ctx.effect(async () => {
    const domain = await ctx.storageDomain.open(spec)
    try {
      const notes = domain.table('notes')
      const prior = notes.get('welcome')
      if (!prior) await notes.put('welcome', { text: '你好，DSH' })
      ctx.logger.info('持久记录：%s', notes.get('welcome')?.text)
    } catch (error) {
      await domain.close()
      throw error
    }
    return () => domain.close()
  })
}
```

`open` 返回的 handle 属于本插件 effect。初始化后续操作失败时先关闭；正常卸载时等待 close 排空已接受写入。读取返回的对象不可原地修改；更新用 put 或纯函数 update。schema 的 version 变更不是数据迁移实现。

## 后端与验证

新自定义 Profile 的 base 已提供 `storage`、`storage-json` 和 `storage-domain`；安装本例只 insert `local-domain-note` 并复用现成 stack，不重复插入这三项，也不为演示更改共享 JSON 存储根。以下清单仅供手工创建的独立空组合使用，与示例插件一起装配；不要追加到已有 base：

```yaml
- name: '@deepseek-ai/dsh-storage'
- name: '@deepseek-ai/dsh-storage-json'
  config:
    root: /tmp/dsh-domain-demo
- name: '@deepseek-ai/dsh-storage-domain'
  config:
    backend: json
```

独立空组合的 `root` 必须由部署者显式选择，这里仅是本地演示路径；base-backed Profile 使用其既有 DSH_HOME 存储根。构建并执行 `dsh plugin --profile development add .` 后启动 Profile，观察欢迎记录。停用再启用后必须读到相同记录；卸载应允许同名 domain 再次打开。重复打开同名 domain 应报 already-open；存储失败不得更新内存视图或发成功通知。测试完停用插件后再由操作者决定是否删除演示数据。

[DomainFacility 与 Domain 契约](../api/api-runtime-dsh-storage-domain.md)定义精确关闭与记录语义；[Storage](../api/api-runtime-dsh-storage.md)定义后端注册责任。Domain 不会自动产生模型可见 Session 事件。
