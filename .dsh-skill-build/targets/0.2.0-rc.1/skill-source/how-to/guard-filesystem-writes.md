# 在默认观察策略前保护只读目录

## 目标与装载

目标 `dsh-v0.2.0-rc.1`。本例为一个由部署者指定的目录拦截文件工具的写/编辑 intent；其他路径继续交给 `fs-observation-policy` 的读后版本检查。它是 Host 插件，不是 Backend 沙箱。Profile 中依次装载 `fs` Provider、此插件、`fs-observation-policy`、`tool-fs`，确保包装器先收到两个单槽 waterfall 事件。参考[文件系统策略契约](api-filesystem-policy.md)。

## 实现步骤

在独立插件包中保存以下文件。`package.json`：

```json
{
  "name": "demo-readonly-tree",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./lib/index.js",
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-fs": "0.2.0-rc.1",
    "@deepseek-ai/schemastery": "3.18.4"
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
import { FsError } from '@deepseek-ai/dsh-fs'
import Schema from '@deepseek-ai/schemastery'

export const name = 'demo-readonly-tree'
export const inject = ['fs']
export const Config = Schema.object({ root: Schema.string().required() })

export async function apply(ctx: Context, config: { root: string }): Promise<void> {
  const root = await ctx.fs.resolve(config.root)
  const guard = (target: Awaited<ReturnType<typeof ctx.fs.resolve>>): void => {
    if (ctx.fs.contains(root, target)) {
      throw new FsError(`writes under ${root.displayPath} are disabled`, 'FS_PERMISSION_DENIED')
    }
  }
  ctx.on('fs/write-intent', async (target, _actor, next) => {
    guard(target)
    return next()
  })
  ctx.on('fs/edit-intent', async (target, _actor, next) => {
    guard(target)
    return next()
  })
}
```

执行 `npm install && npm run build`。在 Profile 配置该插件的 `root` 为部署者拥有的绝对目录。`ctx.fs.resolve` 与 `ctx.fs.contains` 保持 Backend 身份一致，符号链接别名由 Backend 解析；不要用字符串前缀比较显示路径。`next()` 只在目录外调用，使默认观察策略仍负责新鲜度。两个监听器属于本插件 fiber，卸载自动清理；`apply` 解析 root 失败时没有已注册资源。

## 验证与边界

在目标 Profile 读取受保护目录内的文件后尝试写/编辑，均预期 `FS_PERMISSION_DENIED`；目录外文件在未读编辑时仍应被观察策略以 `FS_NOT_OBSERVED` 拒绝，读取后方可防护编辑。卸载本插件后检查只读限制消失，但观察策略仍有效。执行路径仍需独立的工具调用者授权和 `fs-sandbox`/操作系统隔离。本文隔离 smoke 仅验证了 intent 拒绝和身份解析，尚未通过完整 `tool-fs` 或 Profile 运行上述验收。
