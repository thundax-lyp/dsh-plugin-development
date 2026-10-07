# Session 日志、模型消息与恢复

## 适用范围与入口

目标为 `dsh-v0.2.0-rc.1`（`4878cdabd87d4041bdaff61d04c966883b9fd07a`）。Host 插件从 `@deepseek-ai/dsh-session` 使用 `Session`、`SessionEventMap`、`SessionEvent`、`SessionId`、`SessionSeq`、`SessionLogOffset`；`ctx.sessions` 是 `SessionStore`。本篇归属插件事件事实、模型可见历史和 Session 内存生命周期。持久后端的句柄契约见 [session-persistence.md](api-session-persistence.md)。

插件需要让事实跨请求重建时，应把完整、可序列化的事实写入 Session 日志，再以事件折叠状态；仅存插件实例变量会在恢复时丢失。模型可见内容还须经 `user/message`、`tool/result` 等有 `surfaceOp` 的现有消息入口产生；自定义日志事件本身不会成为模型消息。工具结果的规范形状见 [tools.md](api-tools.md)。

## 契约与运行语义

`SessionEventMap` 是声明合并表；插件可增添自己的事件类型和 payload。`session.append(type, data)` 同步接受事件、分配连续 `seq` 和时间，快照化 payload，并通知附着在 store 的观察者；它不等待 I/O。`data` 必须能无损 JSON 序列化，拒绝 `undefined`、非有限数、负零、循环对象、`Date`/`Map`/类实例等。已接受事件的观察者失败被记录并隔离，不回滚 append。`session.seq` 是下一个事件位置，即日志长度。`SessionEvent<T>` 的 `type` 判别 `data`；`seq` 和 `time` 属于事件封套。

日志事件的 `ignorable?: true` 是持久记录的兼容性标记，只适用于未来读者可以安全跳过的**未知**事件；未知必需事件会拒绝重建。不能把关系到业务状态、权限或模型输入的事件随意标为 ignorable。当前格式的读取仍校验已知事件。自定义扩展必须保证恢复进程加载相应类型和解释器；卸载会使依赖它的派生能力失效。

**对象类型与成员**

| 对象或成员                                                         | 声明与用途                                                        | 边界                                                                                          |
| ------------------------------------------------------------------ | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `SessionId(id: string)`                                            | 标记不透明 Session 身份；`SessionHeader.id`、Agent 与持久接口共用 | 字符串运行时值，不暗示持久事实                                                                |
| `SessionSeq(value: number)`                                        | 已有事件位置                                                      | 非负安全整数；不接受负零                                                                      |
| `SessionLogOffset(value: number)`                                  | 前缀长度、读取偏移或下一个事件位置                                | 可等于事件数；与 `SessionSeq` 语义不同                                                        |
| `Session.append<T>(type, data, ...opts)`                           | 返回被接受的 `SessionEvent<T>`                                    | 消息产生类型必须给 `SurfaceIntent`；普通日志类型不得给；同步拒绝非法数据或 surface            |
| `Session.seq`                                                      | 下一事件的 `SessionLogOffset`                                     | 不能当成最后一条事件的 `SessionSeq`                                                           |
| `Session.header`                                                   | 不可变 `SessionHeader`                                            | 元数据不在可重放事件日志内                                                                    |
| `Session.inheritedEventCount`、`firstLiveSeq`、`firstLifecycleSeq` | fork 继承 cut、当前生命周期边界                                   | 分清继承历史与本生命周期工作                                                                  |
| `Session.requestHeader()`、`requestContext()`                      | 最新请求封套和路由元数据折叠                                      | 未有对应事件时 `undefined`；属于请求状态，不等于模型消息                                      |
| `Session.deriveMessages()`                                         | 从 surface 派生模型消息历史                                       | 返回新数组，消息对象深冻结；替换可使旧节点不再可见                                            |
| `SessionStore.registerMessageProjection(projection)`               | 为插件自有的 `@messageProjection` 事件注册纯消息解释器            | 同类型只能有一个定义；返回 fiber 所有的异步 disposer；卸载后依赖该解释器的 Session 不再能派生 |

`SessionEventMap` 中 `turn/start`、`turn/end`、`step/start`、`step/end`、`assistant/attempt`、`request/header` 和自定义普通日志事件是 log-only。`SurfaceEventType` 限定 `system/message`、`developer/message`、`user/message`、`assistant/message`、`tool/result`。后者的 append 必须带 `surfaceOp: 'append'` 或合法 `replace` 范围；除 assistant 消息以外可以引用完整、较早的 `sourceEventSeqs`。`replace` 阴影覆盖模型 surface，原日志不改写。`deriveMessages()` 是模型历史，不是用户看到的原始对话审计。

`SessionHeader` 的必需字段为 `version`、`id`、`createdAt`、`isSeeded`；可选 `cwd`、`parentSession`、`origin: 'subagent'`、`delegationDepth`、`agentPreset`。`version` 由当前 `SESSION_FORMAT_VERSION` 标记。`SessionStore.create(id?, { seed?, inheritedEventCount?, meta? })` 创建 fiber 所有的内存 Session；`meta` 只接收上述创建字段中的 `cwd`、`parentSession`、`createdAt`、`isSeeded`、`origin`、`delegationDepth`、`agentPreset`。seed/fork 要连续、可验证，继承 cut 必须准确。**单独 `ctx.sessions.create()` 不接通持久化**；Agent 生命周期的创建/恢复负责写句柄和日志接线。

`Session.eventAt()`、`snapshotEvents()`、`ownEvents()` 在目标源码明确标为 `@deprecated`，新插件不要调用。需要持久只读观察时走 [SessionHandle.read](api-session-persistence.md#契约与运行语义)；需要状态读取时优先用具体投影服务，而不是扫描日志。已有使用这些旧成员的目标源码不构成新插件推荐。

### 消息投影边界

`SessionMessageProjection` 的 `type` 指向声明中带 `@messageProjection` 的插件事件；`project(event, context)` 必须同步且纯，先验证完整持久决定，再返回以原始事件 `SessionSeq` 为键的**新**消息值，不修改输入。`context` 给出当前模型节点序列、候选之前的连续事件窗口、`baseSeq` 与已经投影的消息。注册与恢复顺序是契约的一部分：依赖解释器的 Session 在 live、restore、fork 时都需要它。普通状态折叠或工具结果记录不需要此高级入口。

## 生命周期与状态

Session 日志是事件事实来源；`deriveMessages()` 可从同一事件序列重建模型消息。Agent loop 对已装载持久后端的 Agent Session 持有写句柄，启动时存储未发布的 seed，随后路由 live 事件；没有挂载 `ctx.sessionPersistence` 时仅有内存 Session。需要崩溃后存在的事实，除了 append，还须由适当的 checkpoint/`flush` 完成耐久边界，见 [session-persistence.md](api-session-persistence.md)。

崩溃中断的尾部 turn 由 Agent resume 在取得写所有权后追加 `interruptedTurnClosers`（缺失的工具错误、step/end、turn/end）；只读观察可在内存中平衡，但不得写回。插件应从已持久的业务事件折叠，而非推断“上次调用必已完成”。

## 失败、权限与边界

调用 `Session.append` 并不等于持久落盘或模型可见；调用 `deriveMessages` 不等于获得原始用户审计记录。持久读取可因未来格式、未知必需事件或损坏失败。插件自有的状态事件必须在读者恢复时仍可解释；事件 schema 演化应维护向后兼容或显式迁移。

## 验证

在精确版本上对类型声明、`append` 校验、surface 投影与 agent-loop 写入/恢复源码完成静态核查；隔离的事件折叠片段通过目标发布声明的 TypeScript 检查。完整独立插件包、真实 Agent turn、崩溃重启或模型请求尚未运行。至少应验证：日志事件写入后同一 Session 可折叠；恢复后结果相同；非法 payload 拒绝；若需模型可见，下一次请求的派生历史含规范消息；后端 `flush` 后重启仍在。具体验证边界汇总到 source-map。
