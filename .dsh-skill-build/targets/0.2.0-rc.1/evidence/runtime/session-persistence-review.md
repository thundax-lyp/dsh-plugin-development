# 0.2.0-rc.1 Session 日志与持久化审查

目标：`dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。此文件仅记录该 checkout 的源码、公开类型、测试线索与 docs 对照；未读取正式 Skill。

## 公开入口与调用者

- `packages/core/session/package.json` 的根导出与 `src/index.ts`：`Session`、`SessionStore`、事件与 header 类型，`SessionStore` 通过 Cordis 声明合并提供 `ctx.sessions`。`src/types.ts` 的 `SessionEventMap` 允许插件扩展。`src/index.ts` 的 `Session.append` 是同步接受和观察者通知，`deriveMessages` 从 surface 派生模型历史。
- `packages/core/session/src/surface.ts`：只有五种 `SurfaceEventType` 进入模型 surface；普通自定义事件不产生消息。`SessionMessageProjection` 是解释现有消息的高级扩展，不等于普通状态折叠。
- `packages/session/session-persistence/src/index.ts`、`handle.ts`：`ctx.sessionPersistence`、`create/open/stat/list/flush`、每 Session `read/append/flush/close` 及访问模式、可见性和耐久边界。`errors.ts` 定义公开拒绝类型；`storage-contract.ts` 是后端实现的验证函数。
- `packages/session/session-persistence-jsonl/src/index.ts`：具体后端要求 `root`，可选 `compression`；物理路径和压缩为后端实现，不上升为抽象 Service 契约。
- `packages/core/agent/src/index.ts`：`ctx.agents.create`/`resume` 的可选 `setup` 与返回 handle；`ResumeAgentOptions.resumeSessionId`。`packages/core/agent-loop/src/index.ts` 的 `createStoredSession`、`appendUnstoredSuffix`、`resumeWith` 显示 Agent 生命周期取得写所有权、存 seed、读取、补 `interruptedTurnClosers` 并发布。
- `packages/core/session/src/index.ts` 的 `SessionStore.create` 明确只是 fiber 所有的内存 Session；持久写入由 Agent loop 接线。`Session.eventAt`、`snapshotEvents`、`ownEvents` 有目标版 `@deprecated`，新插件不应写它们。

## 运行语义裁决

- Append-only 事件事实与模型 surface 分离；`request/header` 记录请求封套但不产生模型消息。`Session.append` 验证并快照 lossless JSON；观察者异常隔离。`deriveMessages` 返回不可修改的模型消息对象。
- 后端的 `append` 返回只保证同实例新读取观察至少该前缀；`flush` 才是跨崩溃耐久屏障。`close` 不可取消且写句柄会冲刷。读句柄可与 writer 并行；第二 writer 被拒绝。无后端时 Agent Session 非持久。
- `SessionPersistence.stat/list` 的 revision 仅在同后端实例、同 id 可比较，相等可视为未变；不能用作恢复游标。
- Agent resume 先 `open(id, 'write')` 排除竞争，再读取、修复未闭合 turn；只读观察不写回。未知必需事件与无法支持的格式应 fail-closed。
- `docs/subsystems/session.md` 与 `persistence.md` 对以上提供解释，但源码/公开类型是事实 owner。历史格式 docs 和 proposed note 不作为目标当前行为证明。

## 测试证据与未验证

定位：`packages/session/session-persistence/tests/contract.ts`、`live-write-contract.ts`、`packages/session/session-persistence-jsonl/tests/lease.two-process.e2e.ts`、`packages/session/session-checkpoint-policy/tests/crash-recovery.e2e.ts`，以及 `packages/core/session/tests/` 下的事件和 surface 测试。隔离消费项目 `evidence/tests/profile-consumer/session-fact.ts` 用已安装的目标版本包和仓库 TypeScript 编译器执行 `tsc -p tsconfig.session-fact.json`，退出码 0；这只验证事件声明合并与纯折叠代码类型。未运行上述仓库测试、完整独立插件包、真实 Agent turn、崩溃恢复或跨进程只读测试。发布验证中应明确这几条未覆盖路径。

## 裁决建议

- 纳入 `@deepseek-ai/dsh-session` 核心 `Session`、`SessionEventMap`/`SessionEvent`、`SessionHeader`、`SessionStore`、`SessionMessageProjection` 与 `@deepseek-ai/dsh-session-persistence` 核心 Service/handle。
- `@deepseek-ai/dsh-session-persistence-jsonl` 纳入可选随附后端，配置与装载单列；各历史格式迁移包为后端内部实现/格式兼容证据，不作为普通插件制作入口。
- 排除新插件使用 `Session.eventAt`、`snapshotEvents`、`ownEvents`，因为目标源码逐成员标记 `@deprecated`；其他 Session 成员仍需分别裁决，不能据此排除整个 `Session`。
- taskPath 候选：`rebuild-plugin-fact-from-session`，组合 `Session.append`、`SessionEventMap`、`SessionPersistence.open/read/close`、Agent resume 与 Tool 结果；路由为“持久事实/恢复/模型可见状态”。正文草稿在 `api-guardrails/session-log.md`、`session-persistence.md` 和 `how-to/rebuild-plugin-fact-from-session.md`。
