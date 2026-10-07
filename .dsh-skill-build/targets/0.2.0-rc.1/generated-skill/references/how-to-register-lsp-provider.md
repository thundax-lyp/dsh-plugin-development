# 注册工作区内的 LSP provider

## 适用与前置

目标精确版本 `0.2.0-rc.1`。在空目录创建如下 `package.json` 与 `tsconfig.json`，再创建 `src/` 下的文件。

```json
{
  "name": "dsh-workspace-lsp-consumer",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json"
  },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-fs": "0.2.0-rc.1",
    "@deepseek-ai/dsh-fs-local": "0.2.0-rc.1",
    "@deepseek-ai/dsh-lsp": "0.2.0-rc.1",
    "@deepseek-ai/dsh-session": "0.2.0-rc.1",
    "@deepseek-ai/dsh-workspace": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.9.0"
  }
}
```

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "lib",
    "rootDir": "src",
    "strict": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"]
}
```

## `src/note-lsp.ts`

```ts
import type { Context } from '@deepseek-ai/cordis'
import { LspError, LspProviderId } from '@deepseek-ai/dsh-lsp'
import type { LspProvider } from '@deepseek-ai/dsh-lsp'
import type {} from '@deepseek-ai/dsh-fs'

export const name = 'demo-note-lsp'
export const inject = ['fs', 'lsp']

export function apply(ctx: Context): void {
  const provider: LspProvider = {
    id: LspProviderId('demo-note'),
    extensionToLanguage: { '.note': 'plaintext' },
    async query(request, signal) {
      if (request.operation !== 'hover') {
        throw new LspError('demo-note supports hover only', 'LSP_UNSUPPORTED_OPERATION')
      }
      const root = await ctx.fs.resolve(request.workspaceRoot, signal ? { signal } : {})
      const target = await ctx.fs.resolve(request.filePath, {
        cwd: request.workspaceRoot,
        ...(signal ? { signal } : {}),
      })
      if (!ctx.fs.contains(root, target)) throw new Error('file is outside workspace')
      const lines = (await ctx.fs.readText(target, signal)).split(/\r?\n/)
      const line = lines[request.position.line]
      if (line === undefined || request.position.character >= line.length) return { kind: 'hover', hover: null }
      return {
        kind: 'hover',
        hover: {
          contents: line,
          range: {
            start: { line: request.position.line, character: 0 },
            end: { line: request.position.line, character: line.length },
          },
        },
      }
    },
  }
  ctx.lsp.registerProvider(provider)
}
```

## 挂载与查询

Host 先挂载 `LocalFileSystem`（配置 cwd），再挂载 `Lsp`，最后挂载此插件模块。调用 `ctx.lsp.query({operation:'hover',filePath:'sample.note',position:{line:0,character:1},workspaceRoot:root},signal)`。示例只接管 `.note`；目标版本服务自动把该 route 的 `languageId:'plaintext'` 加到 provider 请求。插件 fiber 卸载时路由释放。先在本目录运行 `npm install --ignore-scripts`、`npm run build`。

## 边界

此 provider 根据文件系统读一行，仅演示公开注册契约；它不是 stdio language server。示例拒绝越界路径，未做通用权限体系；可信调用方仍需对工作区和文件读取做授权。仅支持 hover，其他语义操作明确抛 `LSP_UNSUPPORTED_OPERATION`。取消信号传给 fs；长任务应另做超时。参考[LSP 契约](api-lsp.md)。
