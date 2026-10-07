# 从 Client 上传并提交文件

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。任务是在普通 Session header 选一个文件，上传并把其 receipt 提交到该 Session。上传 API 与失败边界见 [Client 文件上传](api-client-file-upload.md)，独立 Client 包的构建和 Loader 装载见 [构建并装载 Web Client 插件](how-to-build-and-load-web-client-plugin.md)。

## 实现步骤

1. Profile 装载附件存储、Host file-upload、Session controller、Client file-upload、renderer、Conversation 与本包的 `./client`。本包根入口供 Host Loader 的裸包名行使用：`src/index.ts` 可以是 `export function apply(): void {}`。`package.json` 至少导出构建后的 `.` 与 `./client`，并声明 `"dsh": { "client": { "platform": "web" } }`；具体 `dsh.client` 格式、lazy-CJS build 与装载检查按 Client 模块 HOW-TO 执行。
2. 给自己的 Session retain 用途扩展 `SessionReferenceSourceMap`。组件从 slot props 取 `sessionId`，把 Cordis 服务调用留在 `apply` 提供的注入函数中。以下 TSX 是一个完整的 Client 半边：

```tsx
import { useEffect, useRef, useState } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type {} from '@deepseek-ai/dsh-api-session-controller/client'
import type {} from '@deepseek-ai/dsh-client-file-upload/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type { InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'

declare module '@deepseek-ai/dsh-api-session-controller/client' {
  interface SessionReferenceSourceMap {
    exampleUpload: unknown
  }
}

interface UploadInjected {
  submitFile(sessionId: SessionId, file: File, signal: AbortSignal): Promise<void>
}

type UploadProps = PropsRuntime<'conversation.session.header.actions'> & InjectFace<UploadInjected>

function UploadButton({ sessionId, submitFile }: UploadProps) {
  const [status, setStatus] = useState('Choose a file')
  const operation = useRef<AbortController | null>(null)
  useEffect(() => () => { operation.current?.abort() }, [])
  return <label>
    <span>{status}</span>
    <input type="file" onChange={event => {
      const file = event.currentTarget.files?.[0]
      if (file === undefined) return
      operation.current?.abort()
      const controller = new AbortController()
      operation.current = controller
      setStatus('Uploading')
      void submitFile(sessionId, file, controller.signal).then(
        () => { if (!controller.signal.aborted) setStatus('Submitted') },
        (error: unknown) => { if (!controller.signal.aborted) setStatus(error instanceof Error ? error.message : 'Upload failed') },
      )
    }} />
  </label>
}

export const inject = ['slots', 'sessions', 'fileUpload']

export function apply(ctx: Context): void {
  const submitFile: UploadInjected['submitFile'] = (sessionId, file, signal) =>
    ctx.sessions.using(sessionId, { source: 'exampleUpload', signal }, async reference => {
      await reference.ready
      const staged = await ctx.fileUpload.upload(sessionId, file, file.name, signal)
      if (!staged.ok) throw staged.error
      const accepted = await reference.binding.session.prompt([
        { type: 'file', receiptId: staged.value.receiptId },
        { type: 'text', text: `Please review ${file.name}.` },
      ], 'queue', signal)
      if (!accepted.ok) throw accepted.error
    })

  ctx.slots.inject('conversation.session.header.actions', () =>
    ctx.slots.register({
      name: 'conversation.session.header.actions',
      id: 'example-upload-and-submit',
      order: 120,
      inject: (): UploadInjected => ({ submitFile }),
    }, UploadButton))
}
```

3. 对精确版本声明分别编译 Host 和 Client；Client bundle 必须满足 `__ModuleLoader__.load` 协议。打开普通 Session，选择文件，观察上传进度/错误并等待 `prompt` 返回 `ok: true`。在 Session 日志中确认文件引用和请求文字；只看到 `FileUploadValue` 不算完成。
4. 测试选择另一文件、离开页面和禁用插件时的取消：组件 abort 当前请求，`ctx.sessions.using` 释放引用，slot 注册随 fiber 撤销。再测试业务错误、HTTP/Worker reject 与 prompt 失败；这三种都不得显示 `Submitted`。若 abort 与 Host 接受相撞，以 Session 日志判定最终事实，不能把 UI 取消当成撤回。subagent file part 在目标实现中不被接受，UI 应先禁用或明确报告。

本代码对精确发布声明已通过 Client TSX 编译；隔离 Web Profile 已显示自定义文件输入，但 Chrome 扩展在选择本地测试文件时缺少 file URL 权限，尚未完成浏览器输入/Worker 路径。独立 Host 协议 fixture 则使用同一 Profile 的认证上传 route 完成 staged receipt、`session/prompt` 接受和 `session/page` 耐久 file ref 回读。若产品需要显示真实字节进度，可向 `upload` 第五参传 `onProgress`；仅 Blob/stream 背景路径报告该进度，`Uint8Array` Remote fallback 不承诺它。
