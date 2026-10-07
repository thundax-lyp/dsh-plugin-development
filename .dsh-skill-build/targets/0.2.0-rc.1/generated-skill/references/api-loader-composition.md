# Loader 配置行、Include 与分组

## 适用范围与入口

目标版本 `dsh-v0.2.0-rc.1` 的 Host 组合使用 `@deepseek-ai/cordis-plugin-loader` 导出的 `EntryOptions`、`EntryTree`、`Loader`、`Group`，以及 `@deepseek-ai/cordis-plugin-include` 导出的 `PatchOptions`、`applyEntryPatches`、`entryListSchema`、`Include`。Loader 和 Include 的 default 导出分别是同名类；`@deepseek-ai/cordis-plugin-group` 的 default 导出是 Loader 包中的同一个 `Group` 类。它们是配置层与 Loader 的公开入口，插件包仍要先按 [Bundle 与 Profile](api-profile-bundle.md)声明并安装。上游包 README 中的 `@cordisjs/*` 旧示例名不能代替本目标版本的实际 `@deepseek-ai/*` package exports。

通常的独立插件作者写 `cordis.patch.yml` 和包 manifest，让 DSH CLI 装载；只有嵌入式 Host、配置编辑器或诊断插件才直接调用 `ctx.loader`。`dsh --dump-config` 使用与实际 Include 相同的 `entryListSchema` 和 `applyEntryPatches`，可用于检查层合成，但 dump 不启动 fiber。

## 配置行与 patch 语义

发布包的 `package.json` 可按 `@deepseek-ai/dsh-package-manifest` 的公开类型填写；这些是作者声明，Loader 各读取方仍须验证 JSON 并补自己的默认值。`DshPackageManifest` 的 `name`、`version` 必需，可有 `description?`、相对本包的 `icon?`、`private?`、`dependencies?`、`peerDependencies?`、`engines?` 和 `dsh?`。`icon` 由读取方按 realpath 约束在包内，只接受 SVG/PNG/JPEG/WebP 且至多 256 KiB，不能用外部 URL 绕过。`DshEnginesManifest.dsh?` 是目标版本的 SemVer 范围，另有 `node?`、`npm?` 与其它引擎键；仅声明不会强制每个读取方执行兼容门禁。`DshManifest` 下可有 `manifestVersion?: 1`、`bundle?`、`profile?`、`client?`，分别描述不同包角色。`LocalizedText` 是原文或带必需 `en` 回退的语言字典；`PluginLocalizedMeta` 是 Loader 验证后的展示/诊断结果，不能当作 `package.json` 的直接字段。源码契约见 `packages/util/package-manifest/src/types.ts`。

`EntryOptions` 是 Loader 树中的一行。`id: string` 在所在树内稳定；`name: string` 是可导入模块或 `cordis:` builtin；`config?` 交给插件的 Config；`disabled?` 为真时不启动该行；`inject?` 声明该行额外的依赖或 intercept 配置；`group?` 指示 `config` 是子行数组。由 `config/isolate.ts` 的声明合并还可使用 `intercept?: Dict | null` 和 `isolate?: Dict<true | string> | null`：前者将服务配置交给子 scope，后者让服务在本行局部 realm（`true`）或同标签共享 realm（字符串）中解析。不要将自有服务的 isolation 标签误加到需要从 base 继承的 `tools`、`timer` 等依赖上，否则子行会失去该提供者。

`PatchOptions` 支持 `insert?: EntryOptions[]`，以及 `id?`、`name?`、`config?`、`group?`、`disabled?`、`inject?`、`intercept?`、`isolate?`。无 `id` 的 `insert` 追加到根；带 `id` 的 `insert` 追加到匹配 group 的 `config`。非插入 patch 必须有 `id`；未找到目标、目标不是 group 或给出的 `name` 与现有行不符时，警告并跳过该 patch。每层顺序应用；新插入的行可被同一序列里后面的 patch 按 `id` 找到。patch 覆盖行字段，`config` 是整值替换而非深合并。`applyEntryPatches(data, patches, warn)` 返回脱离输入的结果，不原地改动原始 entry 列表。

`entryListSchema` 使 YAML `!!js` 标量解析成 `{ __jsExpr: string }` 形状的 `JsExpr`；`isJsExpr(value)` 可在配置工具中识别它。Loader 在目标行激活时按其 context 求值。它是运行时代码表达式，不能当成普通字符串或安全的数据模板；配置文件的信任边界由持有该 Profile 的用户和 Host 管理。Group/Include 是树载体，其子行的表达式留到各自 fiber 激活时求值。有关 Profile patch 的加载优先级见 [Bundle 与 Profile](api-profile-bundle.md)。

编程式配置编辑器的运行时对象是 `EntryTree`、`EntryGroup` 和 `Entry`。`EntryTree.entries()` 遍历本树及子树，`resolve(id)` 和 `resolveGroup(id)` 查找行或组，找不到或类型不符会抛错；`create(options, parent?, position?)`、`update(id, options, parent?, position?)`、`remove(id)` 修改树并调用所属树的 `write()`，其中 `await()` 等待当前导入及 fiber 生命周期任务沉静。`EntryGroup.create(options)`、`remove(id)`、`update(config)`、`stop()` 管理该组的子行；`Entry.options` 是原始配置，`init()` 导入并应用插件，`refresh()` 只在未激活且未禁用时启动，`update()` 合并配置并按需重启或提交 volatile 值。直接调用这些对象时应由嵌入式 Host 负责错误、并发更新和持久化，不要把返回的 entry id 当成插件激活成功的证据。

`@deepseek-ai/cordis-plugin-group` 的 `default` 是 `Group` 别名；`Group.update()` 更新后代，`stop()` 停止它们。`Include.filename` 是从相对配置路径解析出的本地文件；`refresh()` 读新文件，解析失败保留上次可用树；`write()` 仅安排写入，`stop()` 冲刷写队列并停止子行。`Loader.builtins` 保存 `cordis:` 入口，`locate(fiber?)` 返回所属配置行 id，`unwrapExports(exports)` 规范化模块导出；根树的 `write()` 不持久化，`exit()` 是给 Host 覆写的重启钩子。这些 Loader 方法是 Host 组合和诊断入口，普通插件发布路径仍以 manifest 与 patch 为准。

### 对象类型与成员

`@deepseek-ai/cordis-plugin-group` 的 `default` 是 Loader 的 `Group` 类别名；用它声明嵌套配置行，不会注册额外服务。

| 公开对象           | 插件作者用到的成员或签名                                                                                                                                  | 所有权、结果与失败                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `Loader.Config`    | `baseUrl?: string`                                                                                                                                        | 设置相对模块和配置路径的基址；未设置时由 Host 的 `ctx.baseUrl` 决定。                         |
| `Loader.Intercept` | `await?: boolean`                                                                                                                                         | 请求依赖 `loader` 的插件在 loader entry 任务沉静前等待；不是整个应用启动审计的替代。          |
| `Loader`           | `ctx.loader: Loader`; `builtins`；`locate(fiber?)`；`unwrapExports(exports)`                                                                              | Loader 拥有根 EntryTree；`cordis:` 名称通过 `builtins` 查找，`locate` 返回所属 entry id。     |
| `EntryGroup`       | `data: EntryOptions[]`; `create(options)`; `remove(id)`; `update(config)`; `stop()`                                                                       | 子行运行时 owner；嵌入式 Host 直接操作时负责写回和错误处理，普通 bundle 作者编辑 patch。      |
| `EntryTree`        | `create(options, parent?, position?)`; `update(id, options, parent?, position?)`; `remove(id)`; `resolve(id)`; `resolveGroup(id)`; `entries()`; `await()` | `create` 返回生成或指定的 id；`resolve` 找不到时抛错；`await` 等待导入与 fiber 生命周期任务。 |
| `Entry`            | `id`、`options`、`fiber?`、`disabled`、`refresh()`、`update()`、`init()`                                                                                  | 运行中的配置行；`id` 对子树用 `:` 前缀；`fiber` 可能不存在，不能从行存在推断激活。            |
| `Include.Config`   | `path: string`; `initial?`; `patches?: PatchOptions[]`; `enableLogs?: boolean`                                                                            | 只能直接读取 YAML/JSON 文件；`initial` 只在文件不存在时创建。                                 |
| `Include`          | `filename`; `refresh()`; `stop()`; `write()`                                                                                                              | 文件支持热刷新与排队写入；无效新文件保留上次可用树并告警；停止时冲刷写入。                    |
| `Group`            | `config: EntryOptions[]`; `EntryGroup.update()` / `stop()`                                                                                                | Group 本身承载子行；禁用 group 行会使其后代不运行。                                           |

`Loader` 根树的 `write()` 是空操作；持久写入由文件支撑的 `Include` 负责。`Loader.exit()` 只是供 Host 覆写的重启钩子，不保证一般插件调用就退出进程。`ModuleLoader*`、`ModuleJob`、`Realm` 等同包导出的 Node 内部兼容和隔离实现类型虽可被源码解析到，却不是编写 bundle patch 所需的稳定契约；本 reference 不指导插件直接操纵它们。

## 生命周期与失败边界

`EntryTree` 导入插件模块后创建 fiber；`disabled` 行或其祖先组禁用时不启动。配置变更可触发更新/重启；被声明为 volatile 的配置在条件满足时原位提交，否则走普通生命周期。Include 初次读取现存但无效文件会报错，不能当作文件缺失而用 `initial` 覆盖；热刷新时不可读或解析失败则记录告警并保留上次运行树。`write()` 只是排入写队列，关闭或需要持久结果时应等待其冲刷完成。

DSH Host 在 `app-boot/src/index.ts` 初始化 Loader，并以 `cordis:include` 挂载根配置，将 `cordis:group` 注册为 builtin；最终启动还执行独立的激活审计。插件作者在 patch 中选择 `cordis:group` 时不必发布 group 包，但换成非 DSH Host 时须由该 Host 提供同名 builtin 或显式依赖实际包。

## 验证

目标导出、配置行、patch、Include 读写和 DSH Host 组合来源见 [source-map](../maintenance/source-map.md)。先通过 `dsh --profile <name> --dump-config` 检查层顺序、目标 `id`、Group 子行、整值 `config` 与 skip 警告，再实际启动并观察目标 fiber 是否激活；禁用或移除后重启观察其缺失。隔离消费 Profile 已用 [Group 组合任务](how-to-nest-plugin-under-group.md)验证原行禁用、子行挂载及工具直接调用。Include 文件热刷新、`isolate` realm 转移与 Loader 编程 API 的消费项目验证仍待运行。
