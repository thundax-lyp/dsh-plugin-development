# 领域 KV 存储与 Backend（Host）

## 适用范围与入口

在 `dsh-v0.2.0-rc.1`，`@deepseek-ai/dsh-storage` 提供 `ctx.storage` Backend 注册表和数据形态挂载点；`@deepseek-ai/dsh-storage-domain` 提供 `ctx.storageDomain`、`defineDomain`、`domainTable`、schema 验证、Durable KV handle 和 `domain/changed` 事件。普通领域插件定义 spec，调用 domain form，不直接访问底层 Backend。内置 `@deepseek-ai/dsh-storage-json` 注册名为 `json` 的文件 Backend；基础 bundle 将 domain 默认路由到 `json`，但自定义 Profile 必须核对实际装载。

此入口保存 Host 领域记录，例如工作区 sidecar。它本身不写 Session 日志，也不让模型看到事实。若一个状态应被 Agent 跨重启复原为模型可见上下文，应把规范事实写进 Session，再用[Session 投影](api-session-projection.md)折叠；仅写 domain 不满足这个要求。完整最小包见[持久化领域记录](how-to-persist-domain-records.md)。

## 契约与运行语义

`defineDomain(spec)` 在模块加载时验证 name/table 的安全格式、非负版本、`compatibleVersions`、layout 和 global 非 null schema。`domainTable<K,V>(zodSchema)` 建立一张表的值 schema 与编译期 key 类型。一个 `DomainSpec` 由 `name`、`version`、`tables` 必填，并可选 `layout: 'single' | 'per-record'`、`compatibleVersions`、`invalidRecords: 'backup-and-skip'`、`global: { schema, initial }`。`single` 默认整域文档，`per-record` 每键文档。`backup-and-skip` 仅适合可丢弃的派生记录且 Backend 支持备份单条文档；权威数据默认应在无效记录上报错。

`ctx.storageDomain.open(spec): Promise<Domain<S>>` 经 `Config.backend` 或 `routes[spec.name]` 选择 Backend，要求 `kv` facet，打开 unit，载入并用 zod 验证所有现有记录，成功后返回 caller-owned handle。同名 domain 正在打开或尚未完整关闭都会拒绝。调用方必须在自己的异步 disposer 中 `await domain.close()`；facility 卸载时会关闭遗漏的 handle，但不能替代消费插件明确归属。`ctx.storageDomain.get(name)` 是非类型化诊断入口，正常消费持有 `open` 的类型化 handle。

`Domain.table(name)` 返回稳定的 `KvTable<K,V>`：`get`、`entries`、`keys`、`size` 从已验证内存状态同步读取；`put` 整值覆盖、`delete`、`update` 在同域串行写链上先等 Backend 持久提交，再改内存并发出 `domain/changed`。`update` 的同步纯 transform 在排队位置看到最新值，缺键为 `missing-key`。`global.get/set` 仅在 spec 声明 global 时有意义，`initial` 未写入介质前只在内存提供；首次 `set` 才持久化。返回的记录是共享引用，不能原地改，应构造新值并调用 `put/update`。

## 对象类型与成员

| 类型                           | 公开成员与约束                                                                                                                                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineDomain` / `domainTable` | 前者验证 `DomainSpec` 并返回可打开的类型化描述符；后者从值 Zod schema 建立表定义，key 的泛型只约束 TypeScript 调用方。                                                                                              |
| `Storage`                      | `backend: BackendRegistry`；`mount(form, facility)` effect 安装表单，`form(form)`/`domain` 解析已挂载表单。Hub 本身不进行 IO。                                                                                      |
| `BackendRegistry`              | `register(name, backend): () => void`、`get(name)`、`names()`；Backend 插件拥有 `backend.close()`，注册 disposer 只移除名称。                                                                                       |
| `StorageBackend`               | 可选 `kv?: KvFacet` 和幂等 `close(): Promise<void>`；一个 Backend 拥有一个介质。                                                                                                                                    |
| `KvFacet` / `KvUnit`           | `open(descriptor)` 返回 unit；unit 有 `loadAll`、`putRecord`、`deleteRecord`、可选 `backupRecord`、`setGlobal`、`close`。这一层只处理不透明 JSON，不做领域 schema 或多调用串行化。                                  |
| `DomainFacility.Config`        | `backend: string` 必填；`routes?: Record<string,string>` Loader 默认 `{}`，按域名覆盖。命名 Backend 不存在时 `open` 报错。                                                                                          |
| `DomainSpec`                   | `name`、`version`、`tables`；可选 `layout`、`compatibleVersions`、`invalidRecords`、`global`。名字匹配 `^[a-z][a-z0-9_]*$`。                                                                                        |
| `DomainGlobalSpec<G>`          | `schema: ZodType<G>`、`initial: G`；schema 不能接受 `null`，因为介质用 null 表示尚未写入。                                                                                                                          |
| `DomainTableSpec<K,V>`         | `valueSchema: ZodType<V>`，phantom `__key?: K` 仅供 TypeScript 推导，介质键仍是字符串。                                                                                                                             |
| `Domain<S>`                    | `name`、`global`（无声明时类型为 `never`）、`table(name)`、幂等异步 `close()`。开始关闭即拒绝新写，已有写排空后关 unit 并释放名称；完全关闭后读也拒绝。                                                             |
| `DomainFacility.closeAll()`    | Facility 卸载时排空并关闭仍开启的 domain；消费插件仍应自行在所属 fiber 中关闭其 `Domain<S>`，不要以 facility 清理代替所有权。                                                                                       |
| `KvTable<K,V>`                 | `get`、`entries`、`keys`、`size`；`put(key,value): Promise<void>`、`delete(key): Promise<boolean>`、`update(key,fn): Promise<V>`。`delete` 缺键返回 false，无写无事件。                                             |
| `DomainChanged`                | 判别 `operation: 'put' \| 'deleted'`，共同字段 `domain/table/key`；put 有新 `value`，delete 无值。global 的 table/key 均为空串。                                                                                    |
| `DomainError`                  | `code: 'already-open' \| 'facet-unsupported' \| 'invalid-record' \| 'missing-key' \| 'closed'`；无效记录的 `detail` 给出 table/key。Backend 的 `StorageError` 如 `backend-not-found`、`version-mismatch` 原样透传。 |

`@deepseek-ai/dsh-storage-json` 的 `Config.root: string` 必填且无 cwd 默认值；该 Backend 在配置 root 下用 atomic rewrite 存单文件或 per-record 文件树。`@deepseek-ai/dsh-storage-sqlite` 是另一个公开 Backend，是否选用及其配置应独立核查，不能从 JSON 行推断相同介质语义。

**精确 API 对象与成员**

Backend 作者通过 `ctx.storage.backend.register(name, backend)` 安装介质，并以 `storageBackendServiceKey(name)` 声明其 Cordis 生命周期依赖，避免 domain 在注册前打开；注册 disposer 仅撤销名字，介质仍须由 owner 调用 `StorageBackend.close()` 排空。`BackendRegistry.get`/`names` 只读取当前注册表。`StorageForms` 是 declaration merging 的表单映射，form provider 对自己的 `mount` disposer 负责。`UNIT_NAME_RE` 约束 unit/table 名；`KvUnitDescriptor` 的 `name`/`version`/`tables`/`hasGlobal` 是介质身份，`layout` 与 `compatibleVersions` 控制可读格式，不授予静默迁移。`StorageError.code` 属于 `StorageErrorCode` 判别；调用方按代码处理 backend-not-found、version-mismatch、closed 等失败，而非匹配消息。

| 对象/导出                  | 纳入的成员                                                                                                                                                                     | 调用边界                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| `BackendRegistry`          | `BackendRegistry.get`, `BackendRegistry.names`, `BackendRegistry.register`                                                                                                     | 命名介质注册、解析及可用名称列表。      |
| `KvFacet`                  | `KvFacet.open`                                                                                                                                                                 | 打开一个 KV unit 的介质能力。           |
| `KvUnit`                   | `KvUnit.backupRecord`, `KvUnit.close`, `KvUnit.deleteRecord`, `KvUnit.loadAll`, `KvUnit.putRecord`, `KvUnit.setGlobal`                                                         | 不透明 JSON 的 durable 单调用读写接口。 |
| `KvUnitDescriptor`         | `KvUnitDescriptor.compatibleVersions`, `KvUnitDescriptor.hasGlobal`, `KvUnitDescriptor.layout`, `KvUnitDescriptor.name`, `KvUnitDescriptor.tables`, `KvUnitDescriptor.version` | unit 身份、表、布局及兼容版本声明。     |
| `StorageBackend`           | `StorageBackend.close`, `StorageBackend.kv`                                                                                                                                    | 可选 KV facet 与幂等关闭。              |
| `storageBackendServiceKey` | —                                                                                                                                                                              | 命名 Backend 的生命周期 service key。   |
| `StorageError`             | `StorageError.code`, `StorageError.name`                                                                                                                                       | 稳定 code 加 Error name/message。       |
| `StorageErrorCode`         | —                                                                                                                                                                              | Backend/Hub 失败代码联合类型。          |
| `StorageForms`             | —                                                                                                                                                                              | 表单挂载的声明合并扩展点。              |
| `UNIT_NAME_RE`             | —                                                                                                                                                                              | 安全 unit/table 名校验正则。            |

## 生命周期与状态

所有写入的提交点在 Backend durability 完成后；拒绝的写不改变内存。`domain/changed` 是提交后的本进程通知，不是跨进程重播日志；通知监听器抛错只记录警告，不回滚已提交写。插件 fiber 卸载时先关闭自己持有的 domain handle，等待写链排空，之后 Backend 层才可关闭介质。Domain format version 不匹配不会自动迁移，必须由领域拥有者提供显式迁移流程。

存储域可作为某插件的权威非 Session 状态，但 `session_projcache` 只是日志投影的派生优化。若选 `invalidRecords: 'backup-and-skip'`，跳过坏记录会损失该条缓存；对用户原始数据使用此策略会丢失权威事实，不能作为通用容错开关。

## 失败、权限与边界

`open` 会因 Backend 未注册、kv 不支持、版本不兼容或记录 schema 无效而失败。写入不在 domain 层重跑 zod；插件应在接受外部输入时校验，重开时仍以 spec schema 检验持久记录。`per-record` 的键在 Backend 路径上还必须满足安全字符限制。Domain 本身不提供用户鉴权、跨进程变更推送、多表事务或模型展示；自建 Remote/工具必须分别处理权限与模型结果。

## 验证

在目标版本声明上编译 spec/插件；用隔离 JSON root 做 `put`、`update`、`delete`、关闭重开，并断言值、`domain/changed` 顺序及无效记录错误。另测 Backend 写失败不改内存、卸载排空、版本不匹配不自动迁移。编译与单进程操作不能证明跨进程通知或 Session 模型恢复。本专题的实际运行范围在 evidence 中逐项记录。
