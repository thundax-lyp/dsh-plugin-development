# Client 文件上传与 Session 提交

## 入口与职责

目标为 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-client-file-upload/client` 安装 `ctx.fileUpload`，供自定义 Client composer 把浏览器文件上传到某个 Session 的暂存区；`@deepseek-ai/dsh-client-file-upload` 根入口在 Host 装载文件路由、receipt staging 和命令解析器。上传成功返回 `receiptId` 与耐久 `FileAttachmentRef`，但这一步尚未把文件加进 Session 对话；调用 Session `prompt` 且 Host 接受后才形成模型可见的提交。完整路径见 [从 Client 上传并提交文件](how-to-upload-and-submit-file.md)。底层 Host 附件 provider 见 [附件存储](api-attachment-store.md)。

## 对象类型与成员

| 对象/成员                                                            | 精确语义                                                                                                                                  |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `FileUploadService.upload(sessionId,data,name?,signal?,onProgress?)` | Client `ctx.fileUpload`；`data` 接受 `Blob                                                                                                | Uint8Array | ReadableStream<Uint8Array>`，返回 `Promise<RemoteResult<FileUploadValue>>`。调用者拥有当前操作的 `AbortController`。 |
| `FileUploadProgress.loaded`, `.total?`                               | Blob/stream 背景载体的单调字节进度；`total` 可无。精确字节 Remote fallback 不承诺进度回调。                                               |
| `FileUploadValue.receiptId`, `.file`                                 | `receiptId` 为 Host mint 的单次暂存 authority；`file` 是耐久 `FileAttachmentRef`，用于 UI 预览/元数据，不可拿来代替 prompt 中的 receipt。 |
| `FileUploadReceiptId`                                                | brand 类型；不可自行构造或跨 Session/Agent 复用。                                                                                         |
| `EncodedFileUploadRequest.data`, `.name?`                            | `./types` 子路径的 Remote fallback wire 数据：规范 base64 与可选文件名。常规 Client 消费者调用 `upload`，不手写此编码。                   |
| `ClientFileUploadHooks.fetch`                                        | 另一个执行上下文拥有 Host 的 shell 可在 Cordis boot 前提供自定义上传 transport；普通 Web Profile 使用背景 Worker。                        |
| Host `FileUploads.registerAgentResolver`                             | 专门为 Host Agent/命令环境注册唯一 receipt resolver；不是多 provider 插槽，普通 Client 插件不替换。                                       |

`Blob` 和 `ReadableStream` 使用背景 Worker 的同源 HTTP 路由；`Uint8Array` 使用生成 Remote 的 base64 fallback。`upload` 返回 `ok: false` 表示业务错误；HTTP 状态、Worker、解析等失败可直接 reject。`AbortSignal` 对背景 Worker 会终止活跃请求，对 Remote fallback 向下传递。`onProgress` 只更新视图，不等于 Host 已提交。

## 组合、生命周期与失败

Client 插件依赖 `fileUpload` 和 `sessions`；Profile 同时需要 Host 文件上传服务、附件持久服务、Client file-upload 半边、Session controller。自定义 UI 应在用户选择文件后保留目标 Session 身份，以 `ctx.sessions.using(sessionId, { source, signal }, callback)` 持有同一 Client generation；等待 `reference.ready` 后上传，再把 `{ type: 'file', receiptId }` 作为 `reference.binding.session.prompt([...], 'queue' | 'steer', signal)` 的内容。`source` 是插件自己通过 `SessionReferenceSourceMap` 声明的标签。Host 只在接受后把 receipt 对应的耐久文件 ref 写入 Session 路径；上传暂存成功而 prompt 失败不能声称附件已提交。

组件卸载、换文件或取消时 abort 自己的操作，`using` 在成功、失败或取消后释放 Session reference。Host 端 receipt 由目标 Agent/Session 范围校验、观察到接受或队列消费时退休；调用者不能手动伪造清理。目标版本 `SessionFace.prompt` 对 subagent 的 file part 明确返回 `subagent/attachment-invalid`，因此示例限定普通 Session。文件大小、类型及权限仍受 Host route 与附件服务约束。普通图片由 Conversation composer 的既有 image 提交流程处理，本文聚焦原样文件。

abort 只取消仍在进行的 Client 传输/等待；若 Host 已接受 prompt，稍后的 UI abort 不会撤销 Session 事件。此时应以 Session 日志/投影核对最终事实，不能从组件显示的取消状态推断 Host 未提交。

`./remote` 与 `./typert` 是此服务的生成 wire 产物，不是第二套插件注册 API；`./types` 是浏览器安全类型。Host 根入口的 `registerAgentResolver` 只适用于自己组装 Host Agent 的高级场景，不能与预置 service 争夺唯一所有权。

## 验证

完整 Client 示例在 `evidence/tests/client-store-upload-consumer/src/upload-and-submit.tsx` 对精确 `0.2.0-rc.1` 发布声明通过 TSX 编译。另一个隔离 Web Profile/Chrome probe 显示了自定义文件输入，但 Chrome 扩展在 `fileChooser.setFiles` 阶段缺少本地 file URL 权限，未把测试文件交给页面。随后独立 Host 协议 fixture 使用同 Profile 的认证 HTTP route 上传 46 字节文件，取得 receipt；`session/prompt` 接受后，`session/page` 在同一记录中回读唯一文字和相同耐久 file ref。因浏览器文件选择被拦，Worker、UI 进度、取消 race 与重连仍未验证；Host 协议成功不代表这些浏览器路径通过。
