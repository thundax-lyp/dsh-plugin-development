# Session 格式边界与自定义 Storage Backend

## 目标与路由

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。本页裁决两个容易混淆的公开入口：Session 历史格式迁移和 Host 领域 KV Backend。插件作者可通过 `@deepseek-ai/dsh-storage` 注册自有 Backend，或在 Profile 中选择 `@deepseek-ai/dsh-storage-sqlite`；完整可运行组合见[挂载自定义名称的 SQLite Backend](how-to-mount-storage-backend.md)。领域记录的 spec、schema、读写见[领域 KV 存储](api-storage-domain.md)；Session 日志本身的读写见[SessionPersistence](api-session-persistence.md)。

## Session 格式迁移归属

`@deepseek-ai/dsh-session-format` 公开 `SessionFormatMigration`、`SessionFormatCodec`、`createSessionFormatChain`、`createSessionFormatCatalog` 等纯构建原语。`@deepseek-ai/dsh-session-format-catalog` 的 `generated.ts` 静态导入 V0→V1、V1→V2、V2→V3、V3→V4 四条相邻边和各版本 codec，构造当前版本 4 的 catalog。`@deepseek-ai/dsh-session-persistence-jsonl` 直接导入该 catalog 做物理 JSONL 读写及恢复；没有 Cordis 事件、注册表或 Profile 配置把插件提供的新迁移并入这个生产 catalog。`createSessionFormatCatalogWithChildren` 只是 V3→V4 的父 Session 子项证据特化，不是通用插件注册。

因此，自定义 Session 事件不应通过自行注册一个历史格式迁移实现。当前版本 Session 事件和模型可见事实应按 Session API 写入；历史格式或格式版本转换属于 DSH 仓库发布时维护的兼容性工作。公开纯函数可以供离线转换工具研究，但不代表运行中 JSONL 后端会采用其自建 catalog。V0→V4 边包是这条固定链的实现，不单列普通插件开发任务。

## Storage Backend SPI

`@deepseek-ai/dsh-storage` 提供 `ctx.storage.backend.register(name, backend): () => void` 和 `storageBackendServiceKey(name)`。`StorageBackend` 持有一个介质，公开可选 `kv?: KvFacet` 与幂等异步 `close()`。`KvFacet.open(descriptor)` 返回 `KvUnit`，负责 `loadAll`、原子耐久的 `putRecord`/`deleteRecord`、可选 `backupRecord`、`setGlobal`、`close`。同名 unit 未关闭就再次 open 必须拒绝；已写入的介质版本与 descriptor 不匹配必须拒绝，不能静默升级。Backend 不负责领域 schema 或多次调用的串行化；`storage-domain` 层负责这两项。完整规范和目标版本共享 contract suite 位于 `packages/storage/storage/src/backend.ts`、`tests/contract.ts`。

Backend 插件注入 `storage`，注册时提供 `storage.backend.<name>` lifecycle key，以便 `storage-domain` 等 data form 在激活时等到 Backend。effect 清理要先调用注册 disposer，再 `await backend.close()` 排空并释放介质；注册 disposer 本身不关介质。`storage-domain` 的 `Config.backend`/`routes` 决定每个领域使用哪个名字，查找失败会明确报 `backend-not-found`。

内置 `@deepseek-ai/dsh-storage-sqlite` 注册名 `sqlite`，公开 `Config.path`（必填，`:memory:` 只用于测试）与 `journalMode`（`wal` 默认，亦可 `delete`、`truncate`、`persist`）。它用一份 SQLite 数据库装多个 unit，行内保存 JSON，关闭时收束 unit 与数据库。`SqliteStorageBackend` 也公开，可由自定义包装插件实例化并注册另一个名字；这展示 provider 装载路径，但不会证明独立新介质实现满足 Backend 契约。`@deepseek-ai/dsh-storage-json` 是另一个内置 Backend；不要把它的文件目录、backup 行为或每记录布局推给 SQLite。

## 验证与限制

已在独立 npm 包对精确 rc.1 声明编译，并实际注册自定义 Backend 名称 `archive`，让 StorageDomain 写入、关闭 Context 后以新 Context 重新打开 SQLite 文件并读取/更新。该测试验证注册、路由、单进程关闭重开和基本耐久路径。它未验证新介质实现、崩溃一致性、并发进程、文件权限、全部 journal mode 或完整 contract suite。若开发真正的新 Backend，必须跑共享 contract suite 并针对目标介质测试故障、版本、并发与清理。
