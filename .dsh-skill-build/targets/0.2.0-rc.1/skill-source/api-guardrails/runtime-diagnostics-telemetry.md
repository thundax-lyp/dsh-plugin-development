# 运行时不变量与 Telemetry 扩展

## 公开入口

目标 `dsh-v0.2.0-rc.1` 提供两类插件作者入口：`@deepseek-ai/dsh-invariants` 的包归属运行时检查，以及 `@deepseek-ai/dsh-session-telemetry` 的 Session 事件捕获、redaction waterfall 与后端契约。普通产品事件另由 `@deepseek-ai/dsh-host-product-telemetry-otel` 的 `ctx.productTelemetry.emit()` 发送到独立 OTel channel。完整最小例子见 [注册运行时检查与 Telemetry 脱敏](how-to-add-runtime-diagnostics.md)。

## 包归属不变量

`InvariantRegistry.register(packageName, installer)` 预留完整 npm 包名；同名第二次注册抛错，即使配置筛选未启用安装。`installer(childCtx, fail)` 可同步或异步安装启动检查与事件监听，`fail(message)` 抛带 `code:'INVARIANT'`、`packageName` 的 `InvariantError`。`installer.inject` 可声明 child fiber 的 service 依赖。返回 disposer 撤销该注册；child context 随注册关闭。安装失败应释放 child 和名称预留。配置 `enabled` 默认 true，`package_allowlist`/`package_blocklist` 是区分大小写的 JS 正则来源，blocklist 在 allowlist 后排除；无效、空白或重复 regex 在装载时失败。服务注册应只检查该包实际拥有的契约，避免借不变量改写业务流或保存用户数据。

## Session Telemetry 捕获

`SessionTelemetryBackend` 是 `ctx.sessionTelemetry` 唯一 service：实现 `sharing: 'full'|'feedback-only'|'disabled'`、**同步非阻塞** `emit(record)`、可选 `flush()`、异步 `shutdown()`。实现通常在 constructor 中组合 `SessionTelemetryCoordinator(ctx, sink, {capture?:'live'|'on-demand',includeHistory?})`。`live` 监听 Session create/event/dispose、flush 和 agent/error，并采纳已活跃 Session；`on-demand` 仅由调用者 `captureSession(session,throughSeq?)` 从规范日志读取。一个规范 Session event 对应一个 `ledger` record；`ops` 仅供 agent-error/shutdown 信号，没有 event seq 身份。记录的 `sourceEvent`、`attributes`、`body` 是 coordinator 的副本；handoff cursor 表示已交给后端，不保证外部送达。后端队列、失败、丢弃与 shutdown deadline 自行负责，捕获错误在 coordinator 内隔离并记录 warning。

`session-telemetry/record` 是**同步** waterfall 和部署脱敏扩展点；callback `(record,next) => SessionTelemetryRecord`。`next()` 原样透传且没有内置脱敏规则；监听者返回新 record，不能原地修改输入。抛错使这一条记录在捕获侧封闭丢弃，不改规范 Session 日志，也不打断 AgentLoop。多层规则需先 `next()` 再覆盖返回值；在 `live` 的 append 时或 `on-demand` 的捕获时执行。部署必须根据自己的数据政策显式安装规则，不能因为装载 OTel 就假定 body 已经脱敏。保留 `sourceEvent` 与身份字段时仍可识别 Session；要降低关联性须检查 `attributes` 和 `sourceEvent` 的暴露用途。

已发布 `@deepseek-ai/dsh-session-telemetry-otel` 是一个具体后端，模式只有 `FEEDBACK_ONLY`（默认）与 `DISABLED`：前者只在本 Session 明确反馈后读取规范日志并上传到配置的 HTTP(S) OTLP endpoint；后者不建 SDK exporter。它的 `emit()` 直接调用会丢弃记录，不能把它当通用 full-capture service。该包自己验证 endpoint、batch 和 shutdown 选项；`sharing` 描述部署选择，不是网络送达证明。普通事件的 `ctx.productTelemetry.emit(OTelEventRecord)` 只接受调用者选定的 eventName、摘要、时间和标量属性；入队不代表 collector/warehouse 已确认，队列满可能丢弃。`@deepseek-ai/dsh-otel` 的 `createEventReporter`/`createSessionLogReporter` 返回调用者拥有的独立 channel，必须在 fiber 卸载时 drain。

## 对象类型与成员

| 公开对象                                  | 可用成员与边界                                                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `InvariantRegistry`                       | `register(packageName, installer)` 保留包归属检查，返回精确 disposer；不能注册同名第二份。                                            |
| 默认 `InvariantRegistry`                  | 根入口的默认导出是上述具名 Service 的别名，不产生第二个注册面。                                                                       |
| `dsh-invariants.Config`                   | `enabled?`、`package_allowlist?`、`package_blocklist?` 选择检查贡献；regex 来源区分大小写，非法表达式阻止装载。                       |
| `InvariantInstaller` / `InvariantFailure` | installer `(childCtx,fail)` 可异步安装检查，可声明 `inject?`；`fail(message): never` 抛带包名的违规错误。注册关闭要释放 child scope。 |
| `InvariantError`                          | `code:'INVARIANT'` 与 `packageName` 供故障分类；检查失败不应吞掉。                                                                    |
| `SessionTelemetryBackend`                 | `sharing` 声明捕获/分享模式；`emit` 同步非阻塞入队、`flush` 可选、`shutdown` 异步排空。后端仍负责交付和丢弃策略。                     |
| `SessionTelemetryCoordinator`             | `captureSession(session,throughSeq?)` 从规范日志按需捕获；live 模式由 coordinator 监听生命周期。                                      |
| `SessionTelemetryRecord`                  | `channel`、`sourceEvent`、`time`、`severity`、`attributes`、`body` 是待脱敏的一条快照；`sourceEvent` 保留源事件身份。                 |
| `OTelEventRecord`                         | `eventName`、`timestamp`、`severityNumber`、`attributes`、`body` 是普通产品 OTel channel 的调用者选择字段，不等于 Session 事件记录。  |

## 证据与边界

`packages/runtime-diagnostics/invariants/src/index.ts`；`packages/session/session-telemetry/src/index.ts`、`coordinator.ts`；`packages/session/session-telemetry-otel/src/index.ts`；`packages/telemetry/otel/src/`；`packages/host/product-telemetry-otel/src/index.ts` 及各包 tests。隔离消费验证见 `evidence/runtime/runtime-telemetry-review.md`；无外部 collector 送达测试。
