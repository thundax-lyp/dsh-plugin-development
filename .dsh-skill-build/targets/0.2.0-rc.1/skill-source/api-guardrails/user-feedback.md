# Session 与消息级用户反馈

## 两种公开路径

目标 `dsh-v0.2.0-rc.1` 有两种独立反馈：`@deepseek-ai/dsh-command-feedback` 的 Session 级 remark，以及 `@deepseek-ai/dsh-message-feedback` 的最终 assistant message 评级。前者可用 `/feedback` 命令或 `ctx.sessionFeedback.record` Host Remote；后者可用 `ctx.messageFeedback.list/put/delete` Host Remote。消息级反馈不是任务执行指令，也不会进入模型历史。完整例子见 [记录用户反馈](how-to-record-user-feedback.md)。

## Session 级 remark

`recordFeedback(session,{text?,category?})` 同步追加 `feedback/record` log-only 事件；文字去两端空白，空白成为缺席字段，没有文字和分类仍可记录一次请求。`SessionFeedbackService.record({sessionId,text?,category?})` 对**已加载的 live Session** 调用同一行为，返回 `{ok:true,value:{recorded:true}}` 或 `session-not-found`，确认只表示事件已追加，不证明刷盘。`FEEDBACK_CATEGORIES` 是固定 durable ID 列表，显示标签由各客户端本地化。`command-feedback.apply` 安装 service 并注册全局 `/feedback` 命令，命令要求非空文字且 `recordInput:false`。调用者应基于用户实际提交记录，不自动把模型或工具输出当作用户反馈。

## 消息级评级

`MessageFeedbackService` 需要 `sessionPersistence` 与 `sessions`，配置 `maxNoteBytes` 为正安全整数。`list({sessionId})` 返回不可变当前项；`put({sessionId,messageId,rating,note?,category?,ifVersion})` 对最终、append-origin assistant message 做 CAS，创建时 `ifVersion:null`，修改需带已观察到的 version；相同值 no-op 并保留版本。`delete({sessionId,messageId,ifVersion})` 删除已有项需版本，已缺席则成功 `{absent:true}`。稳定业务失败包括 `session-not-found`、`target-not-found`、`version-conflict`、`note-blank`、`note-too-large`；调用方应把冲突的 `current` 返回给用户决定，不能盲目覆盖。评级 `positive|negative`，note 按 UTF-8 字节数限制。

消息级服务对 live Session 使用所属 Session，对 cold Session 在持久化层串行读/比较/追加/flush；`feedback/message-put` 与 `feedback/message-delete` 是 log-only 事件。`feedback/committed` 只通知已提交的 cold mutation，传入借用的只读 `SessionInspection`；观察者在释放写所有权前运行，不能递归等待同一 Session 的 message-feedback 操作，要转交则先深拷贝。服务卸载等待已受理 mutation 排空。fork 继承的反馈属于父 Session；不要把继承的 message id 误标为当前 Session 的 target。

## 对象类型与成员

| 公开对象                                                                                        | 可用成员与边界                                                                                                                 |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `apply` (`@deepseek-ai/dsh-command-feedback`)                                                   | Host 插件装载入口，注册 `SessionFeedbackService` 与 `/feedback` 命令；由 Profile/Loader 持有卸载。                             |
| `FEEDBACK_CATEGORIES`                                                                           | Session 级 remark 的固定 durable category ID 列表；标签由 UI 本地化。                                                          |
| `recordFeedback`                                                                                | 对 live `Session` 同步追加 `feedback/record` log-only 事件；不负责刷盘或模型调用。                                             |
| `SessionFeedbackService`                                                                        | `record` 是 Host Remote，按已加载 Session ID 追加 remark；找不到目标返回业务失败。                                             |
| `FeedbackCategory` / `FeedbackRecord`                                                           | 前者是固定 durable category ID 联合；后者的可选 `text`、`category` 是 `feedback/record` 事件内容，均缺席仍可记录一次用户请求。 |
| `SessionFeedbackRecordRequest`                                                                  | `sessionId` 指向 live Session；可选 `text` 与 `category` 由 Host 验证和规范化。                                                |
| `SessionFeedbackRecordResult` / `SessionFeedbackRecordValue` / `SessionFeedbackSessionNotFound` | 结果以 `ok` 区分；成功 `value.recorded: true` 仅确认追加，失败 `error.code: 'session-not-found'` 并带回 `sessionId`。          |
| `MessageFeedbackService`                                                                        | `list` 读最终 assistant message 评级，`put`/`delete` 按 `ifVersion` 执行 CAS 和持久化；调用者处理冲突。                        |

`@deepseek-ai/dsh-message-feedback/types` 是给生成的 Remote Client 使用的纯类型入口。`MessageFeedbackListRequest` 只有 `sessionId`；`MessageFeedbackPutRequest` 含 `sessionId`、`messageId`、`rating`、可选 `note`/`category` 和 `ifVersion: MessageFeedbackVersion | null`；`MessageFeedbackDeleteRequest` 含两种 ID 及非空 `ifVersion`。`MessageFeedbackRating` 仅为 `positive | negative`，`MessageFeedbackVersion` 是只可比较的 opaque token。

| 返回/值类型                                                  | 关键成员与处理                                                                                                                                  |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `MessageFeedbackItem`                                        | `messageId`、`rating`、可选 `note`/`category`、`version`、Host 指定的 `createdAt`/`updatedAt`；列表返回新鲜的只读快照。                         |
| `MessageFeedbackListResult` / `MessageFeedbackListValue`     | `ok: true` 时 `value.items` 为当前项数组；失败仅可能为 `session-not-found`。                                                                    |
| `MessageFeedbackPutResult`                                   | 成功的 `value` 是完整 `MessageFeedbackItem`；失败包含 session/target 缺失、版本冲突及 note 校验错误。                                           |
| `MessageFeedbackDeleteResult` / `MessageFeedbackDeleteValue` | 成功为 `{ absent: true }`，包括目标本来不存在；失败为 Session 缺失或版本冲突。                                                                  |
| `MessageFeedbackFailure`                                     | `code` 为 `session-not-found`、`target-not-found`、`version-conflict`、`note-blank`、`note-too-large`；版本冲突的 `current` 是权威项或 `null`。 |

## 审计和验证边界

两种反馈都不启动模型工作；Session 级 `recordFeedback` 只追加，消息级 `put/delete` 要求明确持久化确认。客户端通过 Typert Remote 类型消费，不要把 Host runtime 模块打入浏览器。真实 Client UI 组合由对应 UI 插件负责，不是此 Host service 自动生成。

代码与测试：`packages/feedback/command-feedback/src/index.ts`、`types.ts` 和 tests；`packages/feedback/message-feedback/src/index.ts`、`types.ts` 和 tests。隔离消费验证见 `evidence/runtime/attachment-feedback-review.md`。
