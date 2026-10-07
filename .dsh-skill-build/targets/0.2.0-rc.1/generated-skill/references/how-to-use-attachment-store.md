# 在 Host 插件中接收并读取附件

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。本例封装部署已装载的 `ctx.attachments`，把外部提供的文件字节持久化后返回 `FileAttachmentRef`，读回时按 ref 验证。附件契约见 [附件存储](api-attachment-store.md)。外部调用方仍须按自己的权限和请求限制控制谁可以上传。

`package.json`：

```json
{
  "name": "example-file-ingest",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-attachment": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-attachment": "0.2.0-rc.1",
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
    - id: example-file-ingest
      name: example-file-ingest
```

`src/index.ts`：

```ts
import { Context, Service } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-attachment'
import type { FileAttachmentRef } from '@deepseek-ai/dsh-attachment'

declare module '@deepseek-ai/cordis' {
  interface Context { fileIngest: FileIngest }
}

export class FileIngest extends Service {
  static inject = ['attachments']

  constructor(ctx: Context) { super(ctx, 'fileIngest') }

  save(data: Uint8Array, name: string): Promise<FileAttachmentRef> {
    return this.ctx.attachments.saveFile({ data, name })
  }

  async read(ref: FileAttachmentRef, signal?: AbortSignal): Promise<Uint8Array> {
    const chunks: Uint8Array[] = []
    let size = 0
    for await (const chunk of this.ctx.attachments.readFileStream(ref, signal)) {
      chunks.push(chunk)
      size += chunk.byteLength
    }
    const bytes = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength }
    return bytes
  }
}

export const name = 'example-file-ingest'
export const inject = ['attachments']
export function apply(ctx: Context): void { ctx.plugin(FileIngest) }
```

Profile 先装载一个实现 `AttachmentStore` 的 service（base bundle 的本地实现或部署后端），再装载该插件。调用 `ctx.fileIngest.save()` **完成后**才将返回 ref 放入所属 Session 事件；失败时不追加事件。示例 `read` 为小文件演示，生产大文件应直接把 `readFileStream` 的有界 chunk 传给下游，不能全量收集。若部署后端未实现原样文件方法会返回 `ATTACHMENT_FILES_UNSUPPORTED`；插件卸载不会删除已持久化对象。

隔离消费包 `evidence/tests/attachment-feedback-consumer/` 使用实际 `LocalAttachmentStore` 的临时根目录保存、读取与篡改检测；结果见 `evidence/runtime/attachment-feedback-review.md`。它没有覆盖浏览器上传、图像规范化、模型 request image 或 Session 引用恢复。
