# 运行时不变量与 Telemetry 核查

## 目标与证据

精确 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。公开入口与语义对照 `packages/runtime-diagnostics/invariants/src/index.ts`、`packages/session/session-telemetry/src/index.ts`/`coordinator.ts`、`packages/session/session-telemetry-otel/src/index.ts`、`packages/telemetry/otel/src/index.ts`/`event-log.ts`、`packages/host/product-telemetry-otel/src/index.ts` 及各包 tests。新文档 `api-runtime-diagnostics-telemetry.md` 与 `how-to-add-runtime-diagnostics.md`。

## 候选账本

| 候选 ID | 公开成员 | 归属 |
| --- | --- | --- |
| `diagnostics.invariants` | `InvariantRegistry.register`、`InvariantInstaller`、`InvariantFailure`、`InvariantError`、配置选择 | `api-runtime-diagnostics-telemetry.md` |
| `telemetry.session.backend` | `SessionTelemetryBackend`、`SessionTelemetrySink`、`SessionTelemetryRecord`、`SessionTelemetrySharingStatus` | `api-runtime-diagnostics-telemetry.md` |
| `telemetry.session.coordinator` | `SessionTelemetryCoordinator`、`captureSession`、capture/history 配置 | `api-runtime-diagnostics-telemetry.md` |
| `telemetry.session.redaction` | `session-telemetry/record` 同步 waterfall | `api-runtime-diagnostics-telemetry.md` |
| `telemetry.session.otel` | `OpenTelemetrySessionBackend`、`SessionTelemetryMode`、配置 | `api-runtime-diagnostics-telemetry.md` |
| `telemetry.otel.channels` | `OTel.createEventReporter/createSessionLogReporter`、各自 reporter | `api-runtime-diagnostics-telemetry.md` |
| `telemetry.product` | `ProductTelemetry.emit`、`ProductTelemetryRecord` | `api-runtime-diagnostics-telemetry.md` |

`SessionTelemetryMode` 仅 FEEDBACK_ONLY/DISABLED，不能凭 `sharing` union 的 `full` 推出已发布 OTel 后端支持全量上传。`session-telemetry/record` 没有内置规则；作者政策必须显式装载。`InvariantRegistry.register` 的 disposer 属于注册调用方，示例使用自己的 `ctx.effect` 绑定卸载；registry 管理其 child fiber。

## 独立验证

隔离消费包 `evidence/tests/runtime-telemetry-consumer/` 安装目标 rc.1 发布声明并通过 `npm run build`、`npm run smoke`、`npm pack --dry-run --json`。smoke 使用真实 `InvariantRegistry`、一个符合公开抽象类的内存 backend、真实 `Session` 和 `SessionTelemetryCoordinator(capture:'on-demand')`：验证 Session 原日志保持私有文字，向 backend 的副本 body 改写为 `{redacted:true}`，插件卸载后同一 Session 下一条 capture 重新透传。没有外部网络或 collector。

未启动已发布 OTel exporter、未测试 SDK 批处理/丢弃/网络送达，也未验证 `live` AgentLoop 捕获、HMR cursor 或产品 analytics channel。`npm pack` 只证明包内容与声明存在，不证明部署 endpoint 授权或隐私政策充分。
