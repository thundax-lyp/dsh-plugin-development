# 在 Host 插件中持久化领域记录

## 目标与前置

目标版本 `dsh-v0.2.0-rc.1`。本例在 JSON Backend 保存一条 `demo_notes` 领域记录。Profile 需依次装载 `storage`、`storage-json` 和 `storage-domain`，且 `storage-domain` 配置 `backend: json`。自定义 Profile 要给 JSON Backend 一个由部署者拥有的绝对 `root` 路径。接口详见[存储域与 Backend](api-storage-domain.md)。

## 实现步骤

在独立 Host 插件包中保存下列文件。`package.json`：

```json
{
  "name": "demo-domain-notes",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./lib/index.js",
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-storage-domain": "0.2.0-rc.1",
    "zod": "^4.4.3"
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
import type { Context } from '@deepseek-ai/cordis'
import { defineDomain, domainTable } from '@deepseek-ai/dsh-storage-domain'
import { z } from 'zod'

const noteSpec = defineDomain({
  name: 'demo_notes',
  version: 1,
  tables: {
    notes: domainTable<string, { text: string }>(
      z.object({ text: z.string().min(1) }),
    ),
  },
})

export const name = 'demo-domain-notes'
export const inject = ['storageDomain']

export async function apply(ctx: Context): Promise<void> {
  const domain = await ctx.storageDomain.open(noteSpec)
  try {
    ctx.effect(() => () => domain.close(), 'demoNotes.close')
    // Replace this startup write with an authorized application command.
    await domain.table('notes').put('example', { text: 'ready' })
  } catch (error) {
    await domain.close()
    throw error
  }
}
```

运行 `npm install && npm run build`，再把包加入 Host Profile。`open` 是异步资源获取；若注册 effect 或初始写入失败，`catch` 关闭 handle，插件卸载时 disposer 等待已接受的写入并关闭它。调用业务命令时先对外部输入做授权与 schema 校验，再调用 `put`、`update` 或 `delete`；示例启动写入只用于演示提交点。`put` 完成后再读取或通知，不能先改返回的 live 引用。

## 验证与边界

用隔离 JSON root 写入、关闭、重新 `open(noteSpec)`，检查 `table('notes').get('example')?.text` 为 `ready`；`update` 应构造新记录，`delete` 缺键应返回 `false`。观察 `domain/changed` 只能证明本进程已提交的变更通知。把 `version` 改成不兼容值或在磁盘注入不合法记录时，`open` 应失败，而非静默迁移。

这类 domain 记录本身不会成为 Agent 可从 Session 日志重建的模型事实。若 Agent 需要跨重启看到变更，应由拥有该业务语义的调用方同时写规范 Session 事件，再用投影或历史查询重建；不要用 `domain/changed` 当持久日志。本次隔离消费包已验证写入、更新、关闭重开、删除及通知顺序；失败注入、Profile 卸载和跨进程恢复仍需单独验收。
