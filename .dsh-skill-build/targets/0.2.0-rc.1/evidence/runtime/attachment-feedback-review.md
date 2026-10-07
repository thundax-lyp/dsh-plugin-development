# Attachment 与用户反馈核查

## 目标与来源

精确 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。附件来源 `packages/attachment/attachment/src/index.ts`、`types.ts`、`admission.ts` 与 `packages/attachment/attachment-local/src/`；反馈来源 `packages/feedback/command-feedback/src/`、`packages/feedback/message-feedback/src/`。行为参照各包 tests；没有从旧 Skill 借入事实。新作者文档为 `api-attachment-store.md`、`api-user-feedback.md`、`how-to-use-attachment-store.md`、`how-to-record-user-feedback.md`。

## 候选账本

| 候选 ID | 公开成员或任务 | 归属 |
| --- | --- | --- |
| `attachment.store` | `AttachmentStore` 抽象 service、`ctx.attachments`、必需图像方法、可选文件/request 方法 | `api-attachment-store.md` |
| `attachment.admission` | `saveImages`、`admitPromptContent`、`admitEncodedFile`、编码验证函数 | `api-attachment-store.md` |
| `attachment.refs-errors` | image/file/request ref、`AttachmentError` 与识别函数 | `api-attachment-store.md` |
| `attachment.local` | `LocalAttachmentStore` 本地后端及配置 | `api-attachment-store.md` |
| `feedback.session-record` | `recordFeedback`、`SessionFeedbackService.record`、`FeedbackRecord`、`FEEDBACK_CATEGORIES` | `api-user-feedback.md` |
| `feedback.message-cas` | `MessageFeedbackService.list/put/delete`、request/result/version/error 类型 | `api-user-feedback.md` |
| `feedback.committed` | `feedback/committed` 冷 mutation 通知及借用 `SessionInspection` | `api-user-feedback.md` |

`ui-attachment` 和 `ui-message-feedback` 是 Client UI 组合包，未冒充 Host service 扩展 API；Host/Client 入口及编译面要分别裁决。

## 隔离验证

消费包 `evidence/tests/attachment-feedback-consumer/` 使用已发布 rc.1 npm 声明，执行 `npm install --ignore-scripts --no-audit --no-fund`、`npm run build`、`npm run smoke`、`npm pack --dry-run --json` 均通过。真实 `LocalAttachmentStore` 在临时 `dshHome` 中保存、读取原样文件，并经测试隔离中的 chmod/篡改确认读取时拒绝不匹配 ref；插件卸载释放自定义两个 service，临时目录在 finally 中删除。`recordFeedback` 对真实 Session 追加了 trim 后的 log-only `feedback/record` 事件。pack 仅含 lib、patch、manifest。

首次 smoke 的测试篡改尝试直接写只读对象，收到 `EACCES`；测试修正为先在隔离临时对象 `chmod 0600` 后篡改，随后读取拒绝。此处篡改是验证完整性保护，不是生产写入路径。

未在隔离包运行图像解码/规范化、模型 request-image、浏览器上传、Session 附件 ref 恢复、持久化 flush、真实反馈 UI、`MessageFeedbackService` 冷 CAS 或 `feedback/committed` 监听。相关行为只按目标代码和现有 tests 文档化，不能把文件/Session 级 smoke 当作上述端到端证明。
