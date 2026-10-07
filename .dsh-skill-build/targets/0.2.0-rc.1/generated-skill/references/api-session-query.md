# Session 历史查询与派生索引（Host）

## 适用范围与入口

在 `dsh-v0.2.0-rc.1`，`@deepseek-ai/dsh-session-query` 根导出 `SessionQueryEngine` 抽象服务、记录/过滤/观察类型及查询错误。只有装载具体后端才产生 Host `ctx.sessionQuery`；内置 `@deepseek-ai/dsh-session-query-sqlite` 提供它，并可选择开启 SQLite FTS5 全文检索。基础 bundle 装载该后端，但设 `openAt: never`，所以精确读取、过滤、追踪可用，全文检索默认不可用。

这是可信 Host 查询服务，**不做调用者鉴权**。若把它接到模型工具、Client Remote 或 HTTP 路由，插件作者须在服务调用前后限定调用者可见 Session。目标版本可选的 `@deepseek-ai/dsh-tool-session-query` 已实现基于调用 Agent `cwd` 的跨 Session 限制；[启用查询工具](how-to-query-session-history.md) 走这条路径。Session 原始日志与持久化所有权见 [Session 持久化](api-session-persistence.md)；本页只拥有查询与索引契约。

## 契约与运行语义

`SessionQueryEngine` 的精确操作由基础类实现，不需要 SQLite 检索启用：

| 方法                                                                                           | 参数与返回                                                  | 用途与边界                                                                                                               |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `observeSession(id, options?)`                                                                 | `Promise<SessionObservation>`                               | 精确 live 优先 cut；调用方取得 lease，须在 `finally` 用 `[Symbol.dispose]()` 释放。`projectionMode: 'none'` 不计算投影。 |
| `listSessions(signal?)`                                                                        | `Promise<SessionRecord[]>`                                  | 最新优先的逻辑 Session 记录，标记 live/persisted；并不验证调用者是否可读。                                               |
| `readSession(id)`                                                                              | `Promise<SessionLogSnapshot>`                               | 完整、重放校验的原始日志克隆，不把冷 Session 发布到 live store。                                                         |
| `filterSessions(filters, signal?)`                                                             | `Promise<SessionRecord[]>`                                  | 多子句 AND、同子句 values OR 的元数据过滤。                                                                              |
| `readTitle(id, signal?)`、`readTitleSnapshot(id, signal?)`、`readTitleSnapshots(ids, signal?)` | 标题或带 header 的标题观察；批量返回逐项 fulfilled/rejected | 标题由日志折叠；批量单项失败隔离，整体取消仍拒绝。                                                                       |
| `listEvents(id)`、`filterEvents(id, filters)`                                                  | 轻量事件记录或语义文本事件文档                              | `filterEvents` 的 `text` 是大小写不敏感、空白灵活的字面扫描，不是 FTS 排名。                                             |
| `readSurface(id)`                                                                              | `Promise<SessionSurfaceSnapshot>`                           | 当前模型历史 surface 与捕获上限；不同于全量原始日志。                                                                    |
| `readEvent({ sessionId, seq, before?, after? }, signal?)`                                      | `Promise<SessionEventWindow>`                               | 目标事件和有界相邻原始事件；`before/after` 默认 0，单侧不得超 `readWindowMax`。                                          |
| `traceSession(id, signal?)`、`traceEvent({ sessionId, seq }, signal?)`                         | lineage / 直接替换与引用关系                                | 追踪只根据一次逻辑语料观察，不自动越过缺失父 Session。                                                                   |

`searchSessions({ query, sessionFilters?, eventFilters?, limit?, cursor? }, { signal? }?)` 和 `searchEvents({ sessionId, query, filters?, limit?, cursor? }, { signal? }?)` 是基础类抽象方法，由 SQLite 后端实现。查询字符串被当作数据中的词/短语而非 FTS 语法，返回按相关性排序的页面和不透明 `nextCursor`。跨 Session 搜索按每个 Session 最强匹配事件分组；单 Session 搜索返回该 Session header 和事件页面。cursor 只用于相同规范化请求及同一索引代际；内容变化时 `SESSION_QUERY_STALE_CURSOR`，应重发首屏查询。

**对象类型与成员**

| 类型                        | 插件作者会使用的字段与判别                                                                                                                                                                                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SessionRecord`             | `header: SessionHeader`、`live: boolean`、`persisted: boolean`；live 优先的克隆记录。                                                                                                                                                                                                             |
| `SessionObservation`        | `source` 为 `live` 或 `prepared`；`header`、`inheritedEventCount`、惰性 `events`、`cursor`，可选 `revision`/`projections`；`retain()` 产生另一份需释放的 lease。                                                                                                                                  |
| `SessionObservationOptions` | `signal?: AbortSignal`；`projectionMode` 为 `all` 或 `none`，默认计算可用投影。                                                                                                                                                                                                                   |
| `SessionLogSnapshot`        | `session` header、`inheritedEventCount`、完整 `events`。                                                                                                                                                                                                                                          |
| `SessionSurfaceSnapshot`    | 同一观察下的 `session`、`inheritedEventCount`、`capturedThroughSeq` 和当前 `events`。                                                                                                                                                                                                             |
| `SessionEventWindow`        | `session`、`inheritedEventCount`、目标 `target`、窗口 `events`，以及含端点 `startSeq`/`endSeq`；窗口来自一次完整重放，不代表读取后 Session 不会增长。                                                                                                                                             |
| `SessionEventRecord`        | `sessionId`、`seq`、`type`、`time`；`surface` 为 `current`、`shadowed` 或 `log-only`；`SessionEventSearchDocument` 另有 `text`，搜索命中另有纯文本 `snippet`。                                                                                                                                    |
| `SessionResultFilter`       | `id`/`cwd`/`parent`/`availability` 的 `values`，或 `created-at` 的含端点 `from/to`。`cwd`、`parent` 可含 `null`；availability 为 `live` 或 `persisted`。                                                                                                                                          |
| `SessionEventResultFilter`  | `seq`/`time` 含端点范围，`type`/`surface` 的 values，或 `{ kind: 'text', text }`。全文检索预过滤只接受非 text 子集。                                                                                                                                                                              |
| `SessionSearchPage<T>`      | `items: readonly T[]`、可选 `nextCursor`；`SessionEventSearchPage` 另带 `session` header。                                                                                                                                                                                                        |
| `SessionQueryError`         | `code: SessionQueryErrorCode`；常见有 `SESSION_QUERY_ABORTED`、`SESSION_QUERY_SESSION_NOT_FOUND`、`SESSION_QUERY_CORRUPT_SESSION`、`SESSION_QUERY_SOURCE_CONFLICT`、`SESSION_QUERY_INVALID_FILTER`、`SESSION_QUERY_SEARCH_DISABLED`、`SESSION_QUERY_INDEX_FAILED`、`SESSION_QUERY_STALE_CURSOR`。 |

`@deepseek-ai/dsh-session-query-sqlite` 的 `Config` 必填 `path: string`，专用派生索引路径或 `:memory:`。可选 `openAt: 'startup' | 'first-search' | 'never'`（默认 startup）、`journalMode: 'wal' | 'delete' | 'truncate' | 'persist'`（默认 wal）、`defaultLimit`（20）、`maxLimit`（100）、`snippetChars`（240）、`readWindowMax`（50）、`persistedReadConcurrency`（4）、`preparedSessionCacheSize`（5）。`defaultLimit <= maxLimit`，页大小与缓存/并发值均须正整数。`openAt: never` 的查询服务仍在，但两种全文检索均明确抛 `SESSION_QUERY_SEARCH_DISABLED`。

可选 `@deepseek-ai/dsh-tool-session-query` 在 `apply` 中一次注册五个模型工具，并增加共同的 system prompt 指引。它们在工具层使用调用 Agent 的 `cwd` 做授权；`maxSearchResults` 和 `searchTimeoutMs` 控制搜索上限与超时，需为正整数。工具统一返回文本结果，不暴露服务的分页 cursor。

| 工具                   | 输入重点                                 | 结果                                                           |
| ---------------------- | ---------------------------------------- | -------------------------------------------------------------- |
| `session_search`       | 查询词及搜索条件                         | 先前 Session 中每个 Session 的最强事件匹配；排除当前 Session。 |
| `session_event_search` | 已授权 Session 与查询词                  | 单 Session 的历史事件匹配；当前 Session 排除正在执行的步骤。   |
| `session_trace`        | 已授权 Session id                        | 可见的祖先和后代关系。                                         |
| `session_event_trace`  | Session id 与事件 `seq`                  | 目标事件的替换与引用关系。                                     |
| `session_event_read`   | Session id、`seq`、可选 `before`/`after` | 完整目标事件及有界邻接事件摘要。                               |

`SessionEventReadRequest` 用 `sessionId`、`seq` 与可选 `before`/`after` 指定有界原始事件窗口。`SessionEventSearchRequest` 包含 `sessionId`、`query`、可选 `filters`/`limit`/`cursor`；`SessionEventSearchHit` 给出命中事件和摘要。`SessionSearchRequest` 包含 `query`、可选 `sessionFilters`、`eventFilters`、`limit`、`cursor`；`SessionSearchHit.bestMatch` 是该 Session 的最强事件匹配。`OpenAt` 与 `JournalMode` 是 SQLite Config 的启动时机和日志模式类型别名，使用前述允许的字面值，不是可注册策略。`SqliteSessionQueryEngine` 是内置实现类，其 `config` 为该配置快照，`close` 释放索引句柄，`searchSessions`/`searchEvents` 实现基础类抽象全文检索；一般插件通过 `SessionQueryEngine` 服务调用，不直接 new 这个类。

`@deepseek-ai/dsh-tool-session-query.inject` 声明查询服务、工具和 Agent 上下文依赖；Profile 缺少这些 service 时，该工具插件不能激活。

## 生命周期与状态

精确查询 live 优先；若目标未附着且持久化可用，读取冷日志并在内存中平衡中断轮次，不回写源数据。`observeSession` 的冷准备缓存按持久化实例与 revision 匹配，活跃 lease 不会被 LRU 淘汰，必须释放。SQLite 索引是可重建的派生数据库，和权威 Session 持久化目录分开；每次搜索先协调持久与 live 观察，再查询。同一路径只能由一个进程的服务实例拥有；插件 fiber 卸载等待已接收操作静止后关闭数据库。

`@deepseek-ai/dsh-session-projection` 把已提交事件交给注册的同步纯 fold，供 `observeSession(...).projections` 或快照读取。`@deepseek-ai/dsh-session-projection-cache` 把投影状态按 `stateVersion`、seq 和 Session 生命周期身份存为加速 checkpoint；该缓存不是 Session 事实源，缺失或版本不合会从日志重折。内置基础 bundle 同时装载 registry、`storage`、`storage-json`、`storage-domain` 和投影缓存；缓存的 `writeEveryEvents: 200`、`writeIntervalMs: 5000` 是该 bundle 的配置，不是查询服务的默认 API。自定义投影定义与存储域注册是另外的插件任务，不能以查询结果替代对其 fold 和持久格式的验证。

## 失败、权限与边界

服务没有 caller identity；按请求的 `id`/`cwd` 过滤是查询条件，不构成授权检查，返回后的 header 也应再校验。模型工具的授权取自 `exec.agent`：跨 Session 只允许精确相等的 cwd，无 cwd 的调用者只能看自己；该授权属于工具层，不属于 `ctx.sessionQuery`。未经鉴权的 Remote 直接暴露服务会泄漏历史。

读取失败按 `SessionQueryError.code` 区分缺失、持久化失败、源冲突、损坏、非法过滤等。SQLite 打开或协调失败使用 `_INDEX_FAILED`，关闭后不能继续搜索。`openAt: first-search` 将打开失败移到首个查询，`never` 从不打开 SQLite。取消在异步边界被观察，已经在 JS 线程执行的同步 SQLite statement 无法立即中断。精确读取大日志可能有完整重放成本；列表仅取轻量元数据。

## 验证

检查真实 Profile 最终树中是否挂载 SQLite 后端，确认 `openAt` 后分别验证 `readEvent`、`filterEvents` 与 `searchSessions`。对 `observeSession` 用 `finally` 释放 lease；对搜索分页用旧 cursor 在相关语料变化后断言 `_STALE_CURSOR`。对模型可见路径还须测试同 cwd 成功、异 cwd 拒绝、缺 cwd 仅自身、取消与卸载。目标源码有 query、SQLite、工具和投影缓存测试；本专题只审查源码，未运行真实 Profile/索引/跨重启测试。
