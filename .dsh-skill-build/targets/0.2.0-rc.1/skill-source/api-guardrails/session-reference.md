# 跨 Session 引用快照

## 入口与任务

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-session-reference` 的 `SessionReferenceResolver` 提供 `ctx.sessionReferenceResolver`；Host UI 可调用 `listCandidates(agent,query,limit,signal)` 展示同一存储域的历史 Session，或在接受直接消息前用 `prepare(agent,content,references,signal)` 生成只读引用上下文。完整候选消费见[列出 Session 引用](how-to-list-session-references.md)。这与文件 `@` 引用是不同服务。

## 对象与语义

| 对象                                                  | 成员与边界                                                                                                                                                                                                                                            |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SessionReferenceResolver`                            | `listCandidates` 排除当前 Agent，按 cwd 亲近性排序，标题来自 live projection 或冷缓存；`@Remote('candidates') remoteExportCandidates` 附加规范 mention；`prepare` 精确读取源 Session surface，按字节/模型上下文预算生成 `PreparedReferencedMessage`。 |
| `SessionReferenceCandidate`                           | `sessionId`、`label`、可选 `displayTitle/cwd`、`sameWorkspace`、`createdAt`；候选是时间点元数据，不代表源内容已读取。                                                                                                                                 |
| `SessionReferenceInput` / `PreparedReferencedMessage` | 输入源 Session id/可选标签；返回 detached `content` 与可选聚合 `additionalContext`。                                                                                                                                                                  |
| `SessionReferenceSource`                              | 被接受快照记录来源 Session、captured seq/格式代际、保留与省略统计；是模型可重建的消息 source。                                                                                                                                                        |
| `Config` / `SessionReferenceError`                    | 引用数、候选数、字节和上下文比例上限；非法引用、读取和取消有稳定错误码。                                                                                                                                                                              |

## 权限与恢复

候选列表只读元数据，Remote/Host 路由仍须在调用前确认请求者可查看目标和候选 Session。`prepare` 的源快照是不受信任背景资料，不能提升为系统指令；接受消息时要把返回的 `additionalContext` 纳入 owning Session 的规范消息/上下文流程。服务自身不替外层做跨用户授权。标题可能只来自冷 checkpoint，首次访问旧 Session 时以 id 回退。`prepare` 使用精确读和源格式/seq，在输出中保留截断与 omission；恢复不应重新用当前源 Session 内容覆盖历史快照。

## 验证

目标源码 `packages/context/session-reference/src/index.ts`、`src/types.ts`、`src/projection.ts`、`src/uri.ts`。隔离编译候选消费；完整 Profile 应含 sessionQuery、投影缓存和源日志，验证权限、源 Session 变更、截断/泄露边界、取消和恢复消息事实。
