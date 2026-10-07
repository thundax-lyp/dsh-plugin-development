# Session 日志投影与持久缓存（Host）

## 适用范围与入口

在 `dsh-v0.2.0-rc.1`，`@deepseek-ai/dsh-session-projection` 根导出 `SessionProjectionRegistry`、`ProjectionDefinition` 和 checkpoint/快照类型，`./types` 导出可声明合并的 `SessionProjectionStateMap`、`SessionProjectionMap`。Host 插件向 `ctx.sessionProjections` 注册一个同步、纯的日志 fold：它把已提交 Session 事件重建成当前状态。若需要 Client 可见值，为同一键提供 `wire` view；Host-only 键只在 state map 中声明。`@deepseek-ai/dsh-session-projection-cache` 是可选的持久加速层，不能代替原始 Session 日志。

一个完整的插件骨架和安装顺序见[注册日志投影](how-to-register-session-projection.md)。需要保存不属于 Session 日志的独立领域记录时使用[存储域](api-storage-domain.md)。

## 契约与运行语义

`ProjectionDefinition<K,S>` 的 `key` 必须属于 `SessionProjectionStateMap`；有 Client view 的键还必须属于 `SessionProjectionMap`。`stateSchema: ZodType<S>` 验证持久 checkpoint，`init(header, inheritedEventCount): S` 初始化空日志，`apply(state, event): S` 在每个已提交事件上同步运行。对无关事件，返回**同一引用**以避免下游工作；不能在原对象上原地修改。状态必须是 plain JSON。`stateVersion` 是非负整数，改变状态字段或 fold 语义时应递增。可选 `wire` 包含 `viewSchema` 与 `view(state)`，须返回完整当前 Client 值；对象型 view 对未变化的可见值宜复用引用，change feed 用 `Object.is` 抑制通知。

`ctx.sessionProjections.register(definition): () => void` 是 effect-scoped 注册。相同键、相同版本的多 registrant 共享一个 unit 并引用计数；版本冲突失败。最后一个 disposer 或插件 fiber 卸载使键从快照消失。注册晚于事件或 Session 创建仍可在首次读取时从日志重折。registry 的 `session/event` 驱动只处理已提交事件，故投影变化属于日志派生状态。

| 读取与观察方法                                         | 签名和用途                                                                                                                               |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `stateOf(session, key)`                                | 返回当前 Host state 或 `undefined`；值是 live 引用，读者不可修改。                                                                       |
| `snapshot(session, keys?)`                             | 同步得到所有或选定 Client-visible keys 的 `ProjectionSnapshot`，`asOfSeq` 是共同日志水位，空日志为 `-1`。                                |
| `cachedSnapshot(session, keys?)`                       | 只读已物化 cells 的提示，可能落后，缺少时为 `undefined`；不能当完整基线。                                                                |
| `onChanged(listener)`                                  | effect-scoped 监听；对一个事件导致的 Client view 变更给出 `(session, key, value, seq)`。不是恢复日志。                                   |
| `checkpoint(session)`                                  | 每个已注册 unit 的分离拷贝 `{ ver, seq, val }`；用于派生缓存写入。                                                                       |
| `restoreFloor`、`viewCheckpoint`、`restore`、`hydrate` | 持久缓存消费者的低层恢复原语；版本不匹配、日志截短或无有效行时不得直接信任旧 checkpoint。应用插件通常经 Session 查询观察或缓存服务读取。 |

## 对象类型与成员

| 类型                        | 插件作者需要处理的成员                                                                                                                                         |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SessionProjectionStateMap` | 声明合并的 Host state 键到 JSON state 类型；Host-only 键只在此表。                                                                                             |
| `SessionProjectionMap`      | 声明合并的 Client 可见键到 wire JSON 类型；同键也必须在 state map。Client 类型侧可只导入 `./types`。                                                           |
| `ProjectionDefinition<K,S>` | 必填 `key`、`stateSchema`、`init`、`apply`、`stateVersion`；Client-facing unit 另有 `wire.viewSchema`、`wire.view`。函数同步，返回值保持 schema 与 JSON 约束。 |
| `ProjectionSnapshot`        | `asOfSeq: SessionSeqCursor`、`values: Partial<SessionProjectionMap>`。`values` 只含当前注册且选中的 Client keys。                                              |
| `ProjectionChangeListener`  | `(session: Session, key: Extract<keyof SessionProjectionMap,string>, value: unknown, seq: SessionSeq) => void`；回调来自提交后同步驱动。                       |
| `ProjectionCheckpointRow`   | `{ ver: number, seq: SessionSeqCursor, val: unknown }`；`ProjectionCheckpoint` 按 key 索引。                                                                   |

`SessionProjectionRegistry` 的公开成员分成注册 `register`、读取 `stateOf`/`snapshot`/`cachedSnapshot`、通知 `onChanged`、缓存序列化 `checkpoint`，以及恢复 `restoreFloor`/`viewCheckpoint`/`restore`/`hydrate`。上节给出各组的返回和日志水位边界；恢复成员只应由拥有缓存校验的组件调用。

`@deepseek-ai/dsh-session-projection-cache` 的 Host `Config` 必填 `writeEveryEvents: number`、`writeIntervalMs: number`，均为正数。它注入 `storageDomain`、`sessionProjections`、`sessions`，在 `session_projcache` per-record 领域存储版本与水位绑定的状态。基础 bundle 取 200 个事件/5000 ms 作为两项额外写入触发；Session 创建、`turn/end` 和 Session dispose 是不可配置的强制写点。缓存读取绑定 Session 生命周期身份、继承前缀与版本；不匹配的行缺席或被重折，不会变成权威事实。

## 生命周期与状态

投影 unit 的唯一事实源是 Session 事件。`register`/`onChanged` 属于注册插件 fiber；卸载后键应从 `snapshot` 消失，重新装载可从日志重建。缓存使用[存储域](api-storage-domain.md)打开派生 `session_projcache`，写入失败只丢失加速机会，下一次冷读取仍应从日志恢复。`viewCheckpoint` 是可滞后的零 IO 视图；要得到当前精确 cut，应使用带日志尾回放的恢复或 `ctx.sessionQuery.observeSession`，并释放其观察 lease。

不要直接编辑缓存文件、把 change feed 当持久事件，或把一个 UI 可见值视为模型已见事实。模型可见的状态变更必须有可重放的 Session 事件；`stateVersion` 只能使旧缓存失效，不能迁移或创造缺失日志。

## 失败、权限与边界

非法 `stateVersion`、版本冲突、schema 解析失败、fold 抛错会阻断对应注册或读取；`wire.view` 输出也由 `viewSchema` 校验。缓存损坏的 per-record 文档允许按其领域 policy 备份并跳过，但源 Session 日志损坏仍须在 Session 读取边界报错。查询插件仍需对跨 Session 读取做调用者授权；投影 registry 不提供鉴权。

`@deepseek-ai/dsh-session-stats` 和 `@deepseek-ai/dsh-session-turn-outline` 是两个固定的投影定义插件，分别登记统计和 turn outline；自有投影应通过本页 Registry 定义独立 key。

## 验证

在目标版本类型上编译声明合并和插件入口；用真实 Session append 事件验证无关事件保持状态、目标事件更新、卸载后 key 缺席、重新注册后从日志重建。缓存路径另测跨重启、版本升高和旧 checkpoint 缺席时的重折。本文例子的独立消费编译/行为结果见本次 evidence 记录；未运行的冷恢复与 Browser 观察不能由 TypeScript 编译代替。
