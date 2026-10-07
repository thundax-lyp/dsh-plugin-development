# SessionPersistence 与 SessionHandle

## 适用范围与入口

目标为 `dsh-v0.2.0-rc.1`。Host 插件通过 `@deepseek-ai/dsh-session-persistence` 的 `SessionPersistence` Service Definition 使用 `ctx.sessionPersistence`；`@deepseek-ai/dsh-session-persistence-jsonl` 是目标版本随附的可挂载后端。此页拥有存储句柄及耐久语义；Session 事件和模型历史见 [session-log.md](api-session-log.md)。实现新后端的完整契约还要对照目标版本共享后端 contract suite，不能仅实现方法名。

## 契约与运行语义

`SessionPersistence` 是抽象 Cordis Service，由后端注册。日志 append-only、`seq` 自零连续；不允许改写已提交事件。`create(header, options?)` 创建并取得独占写句柄，已存在的 id 拒绝；`open(id, 'read' | 'write', options?)` 打开既有日志，写句柄独占，读句柄不占写锁。`stat`/`list` 是不读正文的轻量观察；`flush()` 是当前 service 所有活跃写句柄的耐久屏障，失败汇总为 `AggregateError`，其他句柄仍会尝试冲刷。

**对象类型与成员**

| 对象或成员                                                    | 公开签名或字段                                                                                                                                                    | 生命周期与边界                                                                     |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `SessionPersistence.create`                                   | `(header: SessionHeader, options?: { signal?: AbortSignal; inheritedEventCount?: SessionLogOffset }): Promise<SessionHandle>`                                     | 返回 write handle；`header.isSeeded` 时 cut 必填，非 seeded 时省略或零；调用者关闭 |
| `SessionPersistence.open`                                     | `(id: SessionId, access: 'read' \| 'write', options?: { signal?: AbortSignal }): Promise<SessionHandle>`                                                          | read 可与 writer 并行；第二个 writer 拒绝                                          |
| `SessionPersistence.stat`                                     | `(id, options?: { signal?: AbortSignal }): Promise<SessionPersistenceSnapshot \| undefined>`                                                                      | 未找到为 `undefined`                                                               |
| `SessionPersistence.list`                                     | `(options?: { signal?: AbortSignal }): Promise<readonly SessionPersistenceSnapshot[]>`                                                                            | 不承诺顺序                                                                         |
| `SessionPersistence.flush`                                    | `(): Promise<void>`                                                                                                                                               | 所有当前 writer 的屏障；可能 `AggregateError`                                      |
| `SessionHandle.id`、`header`、`inheritedEventCount`、`access` | 只读身份、元数据、继承 cut、`'read' \| 'write'`                                                                                                                   | header 在 create/open 时固定；cut 不在事件日志内                                   |
| `SessionHandle.read`                                          | `(offset?: number, length?: number, options?: { signal?: AbortSignal }): Promise<{ eventState: 'detached' \| 'shared-frozen'; events: readonly SessionEvent[] }>` | 默认从零读余量；同一 handle 不后退；外层数组为调用者所有                           |
| `SessionHandle.append`                                        | `(events: readonly SessionEvent[], options?: { signal?: AbortSignal }): Promise<void>`                                                                            | batch 首 seq 等于当前尾；返回后同实例读取可见，尚非崩溃耐久                        |
| `SessionHandle.flush`                                         | `(options?: { signal?: AbortSignal }): Promise<void>`                                                                                                             | 返回后此前接受的 append 耐久，并使空 session 对其他进程可见                        |
| `SessionHandle.close`                                         | `(): Promise<void>`                                                                                                                                               | 幂等、不可取消；writer 冲刷剩余事件并释放所有权；`Symbol.asyncDispose` 委托它      |

`SessionPersistenceSnapshot` 有 `header` 与同实例、同 Session 才可比较的 opaque `revision`，以及可选 `eventCount`、`sizeBytes`。相等 revision 可当作日志未变化；不等不保证变化性质。不能把它当全局版本号、恢复游标或内容哈希。

`SessionHeader`、`SessionEvent` 来自 `@deepseek-ai/dsh-session`，由本包重导出 header。`SessionHandleReadResult.eventState` 表示事件值的所有权；不得因为对外层数组切片就推断内部值可变。后端读取必须拒绝未知必需事件和无法解释的格式；物理 torn tail 不交给读者，写路径首次 append 前处理有效前缀。

### 只读观察流程

插件仅查询历史时，使用 `ctx.sessionPersistence.open(id, 'read')`，在 `try/finally` 中 `await handle.close()`；按 `read(offset, length, { signal })` 分页，按 `seq` 和事件类型折叠自己拥有的事实。失去服务、取消、格式拒绝和内容损坏均应向调用方显式暴露。不要直接读 JSONL 路径；`SessionLocation` 只用于拒绝诊断。

`SessionAccess` 是通过 SessionPersistence 取得的单次访问句柄；调用方应在其生命周期内读写并释放，而非持有底层后端内部对象。

## 生命周期与状态

创建后同一后端实例马上可通过 `stat`/`list`/`open` 看见，但后端可延迟物理物化；在首个 append 或 flush 之前进程崩溃的 Session 可能从未持久存在。`append` 返回承诺本实例未来读取可见且顺序正确；`flush` 返回才承诺跨崩溃存活。`close` 必须 await，即使操作失败也要释放句柄。Agent loop 是其所创建 Agent Session 的 writer owner；插件不能绕过它另外申请同 id writer。

## 失败、权限与边界

公开错误包括 `SessionPersistenceNotFoundError`、`SessionAlreadyExistsError`、`SessionAlreadyOwnedError`、`SessionReadOnlyError`、`SessionOwnershipLostError`、`SessionHandleClosedError`、`SessionFormatUnsupportedError` 和 `SessionPersistenceCorruptionError`。区分不存在、所有权冲突、格式不支持和损坏；`SessionOwnershipLostError` 提示关闭旧句柄后再打开。`signal` 由对应操作处理，`close` 故意不可取消。恢复 Agent 的业务操作应走 `ctx.agents.resume`，由 loop 取得写所有权并补全中断 turn；只读句柄不会修复日志。

JSONL 后端的 `Config` 公开要求 `root: string`，`compression` 可选；运行时将 root 解析一次，默认压缩策略由后端设定。它是目标版本的一个实现，不把其文件格式或物理路径当作跨后端契约。后端插件开发需要实现本页全部语义并运行 `session-persistence/tests/contract.ts` 与 `live-write-contract.ts` 对应测试；这里未提供未验证的新后端骨架。

目标自带 `@deepseek-ai/dsh-session-persistence-jsonl` 作为固定 JSONL 物理后端，直接使用仓库生成的 Session 格式 catalog；它不是可注入任意迁移的注册表。`@deepseek-ai/dsh-session-checkpoint-policy` 在模型请求、工具副作用和已完成步骤前安排语义 flush；它依赖现有持久化、Session 和工具服务，不提供新的 writer SPI。

## 验证

已核对公开类型、JSONL 实现和 agent-loop 调用路径，事件折叠片段通过 TypeScript 检查；后端共享测试、跨进程崩溃测试和完整独立消费包尚未运行。对使用方应实际检查 read/write 所有权、append 后同实例读取、flush 后重启读取、关闭后拒绝、未知事件与格式拒绝。验证边界汇总到 source-map。
