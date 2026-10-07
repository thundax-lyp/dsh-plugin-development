# 插件实时 Config 与设置表单

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1` 的 Host 插件用 `@deepseek-ai/schemastery` 的 `Config` schema 声明可编辑字段，`@deepseek-ai/cordis` 的 `Volatile<T>` 表示运行中可读取的值。`@deepseek-ai/dsh-settings` 根导出 `SettingsForms`、`SettingsDescriptor`、`SettingsPathOp`、`SettingsConflictError`，`./types` 给 Client 安全 wire 类型。base bundle 挂载 `settings` 与 `configEditor`；Web 设置页面还需 web-app bundle 的 Client/Remote 行。Profile 入口参见 [Bundle 与 Profile](api-profile-bundle.md)。

## 契约与运行语义

插件导出 `Config` schema，`.volatile()` 的字段可进入实时设置。消费插件在操作开始时调用对应 `config.field.get()`；同一操作需要一致参数时缓存本次快照，而非长期缓存。`role('secret')` 字段在表单响应中被移除，凭证引用应使用 [凭证入口](api-credentials.md)。

`ctx.settings.describe({ redactSecrets: true })` 读取活动 Profile 的表单描述，包含插件入口 id、schema、当前值、revision、base/user 层及 `secrets`；远端读始终启用秘密遮蔽。`update(ns, patch, expectedRevision?)` 将字段递归合并；`replace(ns, section, expectedRevision?)` 以继承 base 为底替换实时字段；`mutate(ns, ops, expectedRevision?)` 对具体路径 `set`/`unset`，适合只见到遮蔽值的 UI，因为整段 replace 可能清除不可见秘密。所有写入只接受 JSON 形状的值，只允许 volatile 路径，经完整 Config 校验及 Profile patch 写入；revision 不符抛 `SettingsConflictError`，不能盲目覆盖。

## 对象类型与成员

| 成员                                            | 类型与插件任务                                                                                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `SettingsForms.configure(presentation, owner?)` | `{ auto?: boolean }` 控制实例是否自动生成页，默认 auto 为 true；`owner` 默认当前 fiber；返回 disposer，同实例重复注册抛错。          |
| `writable`、`documentPath`、`prepareDocument()` | Host 表单服务的可写状态、原生 Profile patch 路径与异步取得该路径；路径不可穿过 Client wire。                                         |
| `describe(options?)`                            | `SettingsDescriptor[]`；按活动入口 id 映射，revision 随原始配置变动增加。`options.redactSecrets?` 在 Host 可选；远端必须为 true。    |
| `update/replace/mutate`                         | `Promise<void>`；`ns: string` 是 Profile entry id，`expectedRevision?: number` 为并发保护。                                          |
| `SettingsPathOp`                                | `{ op: 'set'; path: readonly string[]; value: unknown }` 或 `{ op: 'unset'; path: readonly string[] }`；unset 数组下标会移除该元素。 |
| `SettingsNamespaceView`                         | Client 安全形式：`ns`、`schema`、`value`、`revision`、`secrets` 等；JSON 值而非任意对象。                                            |

`SettingsDescriptor` 的 `autoGenerate: boolean`、`schema: unknown`、`value: unknown`、`revision: number`、`applies: 'live'` 必需，`base?`、`user?`、`secrets?` 可选。`SettingsConflictError` 有固定 `code: 'SETTINGS_CONFLICT'`、`expected`、`actual`。`settings/document-updated(ns, revision)` 是变更后重读信号，而非携带值的通知。

**精确 API 对象与成员**

`SettingsDescribeOptions.redactSecrets` 只控制 Host `describe` 的遮蔽；跨 Remote 必须开启。`redactSecrets` 返回的 `RedactedValue` 包含被遮蔽的 `value` 和 `secrets`，其中每个 `RedactedSecret` 仅有 `path` 与是否已设置的 `set`，没有秘密值。`@deepseek-ai/dsh-settings/types` 的 `SettingsDescribeValue` 提供 Client `writable`、`hasDocument`、`namespaces`；每个 `SettingsNamespaceView` 是 JSON 安全表单视图。Client 用 `SettingsPathOpView` 的 `op`/`path` 对遮蔽值做路径修改，而不是回传完整秘密字段。根 `SettingsNamespace` 与 `./types` 同名类型均代表 Profile entry id；这些 Client 类型不授予 Host `ctx.settings` 访问权限。

| 对象/导出                       | 纳入的成员                                                                                                | 调用边界                                 |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `RedactedSecret`                | `RedactedSecret.path`, `RedactedSecret.set`                                                               | 被移除秘密字段的路径与配置状态。         |
| `RedactedValue`                 | `RedactedValue.secrets`, `RedactedValue.value`                                                            | 遮蔽后的值及各秘密槽位状态。             |
| `SettingsDescribeOptions`       | `SettingsDescribeOptions.redactSecrets`                                                                   | Host 读取是否遮蔽秘密的选项。            |
| `SettingsNamespace`             | —                                                                                                         | Profile entry 的名义 id 类型。           |
| `./types SettingsDescribeValue` | `SettingsDescribeValue.hasDocument`, `SettingsDescribeValue.namespaces`, `SettingsDescribeValue.writable` | Client 表单列表与写入能力视图。          |
| `./types SettingsNamespace`     | —                                                                                                         | Profile entry 的名义 id 类型。           |
| `./types SettingsPathOpView`    | `SettingsPathOpView.op`, `SettingsPathOpView.path`                                                        | Client 路径 set/unset 的 JSON 安全类型。 |
| `./types SettingsSecretView`    | `SettingsSecretView.path`, `SettingsSecretView.set`                                                       | Client 秘密槽位的路径和布尔状态。        |

## 生命周期与状态

`configure` 的 disposer 要交给拥有插件的 effect；卸载时页策略撤销。用户设置持久在 Profile patch，实时值经 Loader 更新；恢复以 Profile 配置重建，不靠组件内存。`SettingsForms` 需要 `configEditor`、`profileContext`，构造时可能迁移旧设置文档；普通新插件不能把旧文件当成当前写入路径。

## 失败、权限与边界

不存在、无 schema 或无 volatile 字段的入口拒绝写入；非 volatile 路径、无效 JSON 形状和 Config 校验失败也拒绝。设置表单的秘密遮蔽不等于凭证 Provider 的存储和轮换；需要持久秘密时使用凭证服务。`replace` 仅适合拥有完整字段视图的 Host 调用，遮蔽 UI 用 `mutate`。直接通过 `ctx.settings` 操作属于 Host；Client 需经已挂载的生成 Remote，不能把 Host 服务导入浏览器。

## 验证

源码：`packages/settings/settings/src/{index,types,redact,schema}.ts`；操作教程：`docs/cookbook/adding-a-settings-card.md`。检查一条实际 Profile 的 entry id、表单页、修改后 Profile patch、下一次操作的 `.get()`、重启还原、revision 冲突、卸载。独立消费包的 Host/Client 声明编译、lazy factory 注册和打包已运行，见 `evidence/runtime/settings-ui-review.md`；真实浏览器保存、revision 冲突和重启还原尚未运行。
