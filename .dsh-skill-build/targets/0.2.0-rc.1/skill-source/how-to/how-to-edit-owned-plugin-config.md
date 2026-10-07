# 编辑自有插件 Config

## 目标与前置

在装有 Loader、`profileContext`、`configEditor` 的 Host Profile 中，为本包自有的 `example-target` entry 提供一个受信任管理 service，将 `limit` 写入当前 Profile patch，并读取新的实时值。公开边界见 [ConfigEditor](api-config-editor.md)。管理 service 的调用者必须是 Host 受信任路径；不要把它直接暴露给任意浏览器请求。

## 实现步骤

`package.json`：

```json
{
  "name": "example-owned-config-admin",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "exports": {
    ".": { "types": "./lib/index.d.ts", "default": "./lib/index.js" },
    "./target": { "types": "./lib/target.d.ts", "default": "./lib/target.js" }
  },
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-config-editor": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-config-editor": "0.2.0-rc.1",
    "@deepseek-ai/schemastery": "3.18.4",
    "typescript": "6.0.3"
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
    "declaration": true,
    "rootDir": "src",
    "outDir": "lib",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: example-target
      name: example-owned-config-admin/target
      config:
        limit: 10
    - id: example-config-admin
      name: example-owned-config-admin
```

`src/target.ts`：

```ts
import { Context, Service, type Volatile } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'

declare module '@deepseek-ai/cordis' {
  interface Context { exampleTarget: ExampleTarget }
}

export interface Config { limit: Volatile<number> }

export default class ExampleTarget extends Service {
  static Config = z.object({ limit: z.number().min(1).default(10).volatile() })

  constructor(ctx: Context, private readonly config: Config) {
    super(ctx, 'exampleTarget')
  }

  get limit(): number { return this.config.limit.get() }
}
```

`src/index.ts`：

```ts
import { Context, Service } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-config-editor'
import type {} from './target.js'

declare module '@deepseek-ai/cordis' {
  interface Context { exampleConfigAdmin: ExampleConfigAdmin }
}

export default class ExampleConfigAdmin extends Service {
  static inject = ['configEditor', 'exampleTarget']

  constructor(ctx: Context) {
    super(ctx, 'exampleConfigAdmin')
  }

  async setLimit(limit: number): Promise<void> {
    if (!Number.isSafeInteger(limit) || limit < 1) throw new RangeError('limit must be a positive safe integer')
    const entry = this.ctx.configEditor.entries().find(row => row.options.id === 'example-target')
    if (!entry) throw new Error('example-target is not an active Profile entry')
    await this.ctx.configEditor.edit(entry, current => ({ ...current, limit }))
  }
}
```

装载此 bundle 后，由受信任 Host 代码调用 `await ctx.exampleConfigAdmin.setLimit(7)`。确认 `ctx.exampleTarget.limit === 7`，当前 Profile 的 `cordis.patch.yml` 有 `example-target` 的 override，重启后仍为 7；无效 `0` 或目标 entry 卸载应拒绝且不写入。该例只接受固定 entry id 与一个正整数，不暴露任意 raw Config 编辑接口。`edit` 的持久事实在 Profile patch；读新值应走目标服务下一次 `.get()`，不是管理 service 的进程内缓存。
