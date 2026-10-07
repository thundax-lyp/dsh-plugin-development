# 在 Host 插件中使用目录选择能力

## 任务与前置

目标 `dsh-v0.2.0-rc.1`。在可信 Host 操作中，按已装载 backend 的能力展示 native 选择或 browse 列表。调用方须先验证用户对 Host 文件路径的访问权，并把传入的 AbortSignal 绑定请求/连接生命周期。Profile 应装载 `directory-picker-native` 或 `directory-picker-browse`，连同对应 Client UI；远程连接通常选 browse。本例仅提供 Host 适配 Service，不自动创建 Workspace。

创建以下文件：

`package.json`：

```json
{
  "name": "dsh-host-platform-consumer",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json"
  },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-host-directory-picker": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.9.0"
  }
}
```

`tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022", "module": "NodeNext", "moduleResolution": "NodeNext",
    "outDir": "lib", "rootDir": "src", "strict": true,
    "skipLibCheck": true, "types": ["node"]
  },
  "include": ["src/**/*.ts"]
}
```

`src/explore.ts`：

```ts
import { Context, Service } from '@deepseek-ai/cordis'
import type { DirectoryListing } from '@deepseek-ai/dsh-host-directory-picker'

export type StartResult =
  | { kind: 'selected'; path: string | null }
  | { kind: 'browse'; listing: DirectoryListing }
  | { kind: 'unavailable' }

declare module '@deepseek-ai/cordis' {
  interface Context { directoryExplorer: DirectoryExplorer }
}

/** Host adapter. Call only after the caller has permission to choose a workspace. */
export default class DirectoryExplorer extends Service {
  static inject = ['directoryPicker']
  constructor(ctx: Context) { super(ctx, 'directoryExplorer') }

  async start(signal: AbortSignal): Promise<StartResult> {
    signal.throwIfAborted()
    const capability = this.ctx.directoryPicker.capability()
    switch (capability.kind) {
      case 'native': return { kind: 'selected', path: await capability.pick(signal) }
      case 'browse': return { kind: 'browse', listing: await capability.list(undefined, signal) }
      default: return { kind: 'unavailable' }
    }
  }

  async list(path: string, signal: AbortSignal): Promise<DirectoryListing> {
    signal.throwIfAborted()
    const capability = this.ctx.directoryPicker.capability()
    if (capability.kind !== 'browse') throw new Error('browse capability is unavailable')
    return capability.list(path, signal)
  }

  async createDirectory(parent: string, name: string): Promise<string> {
    const capability = this.ctx.directoryPicker.capability()
    if (capability.kind !== 'browse') throw new Error('browse capability is unavailable')
    return capability.createDirectory(parent, name)
  }
}
```

Host 装载所选 `DirectoryPicker` backend 后装载 `DirectoryExplorer`。调用 `ctx.directoryExplorer.start(signal)`：native 返回选中的绝对路径或 `null`，browse 返回首层列表；之后用 `list(absolutePath,signal)` 浏览或 `createDirectory(parent,name)` 创建子目录。只有用户完成选择后，可信入口才可把得到的路径交给 `ctx.workspaceRegistry.create(path)`；不要把单次列表当作操作员最终选择。运行 `npm install --ignore-scripts` 与 `npm run build` 检查目标版本类型。完整能力与路径边界见[Host 目录选择](api-host-platform.md)。
