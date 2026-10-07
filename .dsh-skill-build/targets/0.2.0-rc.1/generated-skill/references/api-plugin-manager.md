# 当前 Profile 的插件与 Bundle 管理

## 适用范围与入口

目标版本为 `dsh-v0.2.0-rc.1`。已运行的 Host 插件需要读取或改变**当前 Profile** 的 Cordis 行和 bundle 选择时，使用 `@deepseek-ai/dsh-plugin-manager` 提供的 `ctx.pluginManager` 服务；Web 通过该服务的 Typert Remote，Creator 模式的 Agent 通过 `@deepseek-ai/dsh-plugin-manager/tools` 注册的 `plugin_manager` 工具。独立 bundle 的声明和 CLI 装载归 [Bundle 与 Profile 装载边界](api-profile-bundle.md)；从包交付到实际观察的顺序见[在 Profile 中管理 Bundle](how-to-manage-profile-bundles.md)。

`@deepseek-ai/dsh-base` 插入管理服务行，工具行默认禁用；预设可以选择启用工具。Web bundle 插入 Plugins 页面。不要仅因安装了管理包就假设工具或页面已在所选 Profile 激活。Host 服务要求 Loader 和 `profileContext`；它只操作所属 Profile，修改影响该 Profile 的所有 Session。安装的 Host 代码在进程中运行。`plugin_manager` 工具的每次调用，包括读取，都要求 `danger-full-access` 或本次调用获批；批准不会改变 Session 权限模式。独立 Host 插件可通过 `inject = ['pluginManager']` 请求服务；服务缺席时其行等待注入。

## 契约与运行语义

`PluginManager` 默认导出是 `TypertRemoteService`，服务名为 `pluginManager`。Host 侧 `ctx.pluginManager` 的主要公开方法如下；每个变更返回 `Promise<ChangeResult>`，调用方应同时检查 `changed`、`stage`、`application`、`error` 和必要的 `packageResult`，不能以 Promise resolve 等同成功。

| 方法                                                                        | 参数、返回                                                                | 当前 Profile 行为                                                                                  |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `listPlugins()`                                                             | `Promise<PluginInfo[]>`                                                   | 当前 Loader 行及可写的 `patchId`；保护行或无法唯一定位的行带 `readOnlyReason`。                    |
| `setPluginEnabled(id, enabled)`                                             | `PluginEntryId`, `boolean` → `Promise<ChangeResult>`                      | 用清单给的 `entryId` 写 Profile patch 的 `disabled` 覆盖；更高层覆盖可能产生 `overridden`。        |
| `listBundles()`                                                             | `Promise<BundleInfo[]>`                                                   | 已安装、由 DSH 安装提供及已选择但损坏的 bundle；`enabled` 只代表保存的选择，不保证已装载。         |
| `setBundleEnabled(name, enabled)`                                           | 包名、`boolean` → `Promise<ChangeResult>`                                 | 改 `dsh.profile.bundles`；禁用保留依赖，重新启用将其追加到末尾，可能改变覆盖顺序。                 |
| `registries()`                                                              | `Promise<PluginRegistries>`                                               | 配置的首选、回退以及 pnpm 当前使用的 registry。                                                    |
| `inspect(spec, options?, signal?)`                                          | spec、`InspectOptions?`、`AbortSignal?` → `Promise<PluginSpecInspection>` | 安装前检查 registry 或绝对目录；Git 和 tarball 只确认形式与主机，不能预先证明是 bundle。           |
| `installBundle(spec, options?)`                                             | spec、`InstallBundleOptions?` → `Promise<ChangeResult>`                   | pnpm 安装、bundle 与 DSH peer 验证、默认选择，再按 HMR 条件应用；`enabled: false` 仍执行兼容检查。 |
| `waitForInstall(requestId)`                                                 | `PluginInstallRequestId` → `Promise<ChangeResult \| null>`                | 等待仍在进行的安装；`null` 不证明已成功或取消，已结束结果不保留。                                  |
| `cancelInstall(requestId)`                                                  | `PluginInstallRequestId` → `Promise<PluginInstallCancellation>`           | 在 `installing` 可取消并等文件恢复；`applying` 为 `too-late`。                                     |
| `removeBundle(name)`                                                        | 包名 → `Promise<ChangeResult>`                                            | 仅移除 Profile 自己拥有的可移除依赖，先撤销选择并卸载，再运行 pnpm remove。                        |
| `listVersionExemptions()`                                                   | 同步 `{ exemptions, warnings }`                                           | 读取精确包版本与运行时版本的已授权兼容例外。                                                       |
| `setVersionExemption(packageVersion, runtimeVersion, enabled, acceptRisk?)` | 精确版本对 → `Promise<ChangeResult>`                                      | 授权或撤销兼容例外；授权须明确接受该精确版本对的风险。                                             |

`PluginManager.Config` 的公开可选字段为 `pnpmCommand?: string`、`outputBytes?: number`、`lockWaitMs?: number`、`inspectTimeoutMs?: number`、`githubConnectionTimeoutMs?: number`、`idleTimeoutMs?: number`、`registry?: string`、`fallbackRegistries?: string[]`。运行时 schema 分别默认 `pnpm`、`16384` 字节、`120000`、`20000`、`5000`、`600000` 毫秒，以及 `['https://registry.npmmirror.com/']`；`registry` 缺席使用 pnpm 所配置者。管理服务的包操作优先使用应用启动器提供的 `profileContext.packageManager`，否则使用上述 `pnpmCommand`。回退 registry 仅用于其他 registry 无法到达、超时或缺少该包/版本等可由 registry 改变的失败；显式私有 registry 不自动回退公开源。

独立 Host 插件要在加载时读取本 Profile 的 bundle 选择，可以用以下完整入口；它只读取一次清单，不占有持续资源，因而无需 disposer。打包、声明 `dsh.bundle.patch`、安装及实际观察仍按相邻 HOW-TO 执行。`@deepseek-ai/dsh-plugin-manager` 需要作为该包的 Host peer 与开发声明依赖提供：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-plugin-manager'

export const inject = ['pluginManager']

export async function apply(ctx: Context): Promise<void> {
  const bundles = await ctx.pluginManager.listBundles()
  const selected = bundles.filter(bundle => bundle.enabled && bundle.error === undefined)
  ctx.logger.info('selected loadable bundles: %s', selected.map(bundle => bundle.name).join(', '))
}
```

这里的 `selected` 仍只是管理视图中的可读取选择；它不替代目标插件的运行调用、Client 同步或 Session 恢复验证。若要长期监听 `plugin-manager/changed`，把监听注册在同一个 Cordis context 下，并在卸载时由该 scope 释放；该事件不会重放进程启动前的变化。

`plugin_manager` 工具提供 `list_plugins`、`list_bundles`、`set_plugin`、`set_bundle`、`install_bundle`、`remove_bundle`、`list_version_exemptions` 和 `set_version_exemption`。列表使用 `offset`、`limit` 分页，`limit` 必须为 1–100，默认 25；工具输出是单份 JSON 字符串，省略仅供 UI 使用的 `meta`。工具的 `approvedBuilds` 只可填此前结果的 `pendingBuilds` 且须先获用户对脚本的明确批准；`acceptRisk` 只可用于用户已接受该插件与 DSH 精确版本对风险的授权。工具本身的批准与这两项独立。

管理记录的公开字段按用途读取：`BundleInfo` 的 `description`、`installed`、`optional`、`removable`、`overrides` 和 `rows` 描述 bundle 及其当前行；每个 `BundleRowInfo` 用 `rowId`、`moduleName` 与可选运行入口关联。`ChangeResult.target` 指本次操作目标，`failedAt?` 指失败阶段，不能只凭 `changed` 推断已运行。`ManagementError` 的 `code`、`diagnostic?`、`incompatible?` 用于稳定分类；`PackageResult` 的 `exitCode`、`kind?`、`timedOut?`、`truncated`、`logPath`、`incompatible?` 保留安装进程证据，超时即使退出码为零也不算成功。`PluginInstallCancellation.status` 的 cancelled/too-late/not-running 不等同于安装结果；`PluginInstallLogChunk` 的 `jobId?`、`argv?`、`cwd?`、`stream`、`exitCode?` 是进程日志片段；`PluginInstallProgress.phase` 和 `attempt?` 是过程通知。`PluginRegistries.resolved` 是当前选择的 registry；`PluginSpecInspection.status` 区分 accepted/refused。逐类型完整成员和不变量见下一表，所有这些视图都不能取代目标插件的实际装载观察。

### 对象类型与成员

以下类型从 `@deepseek-ai/dsh-plugin-manager` 或其 `/types` 子路径导入，Host 和 Remote 的数据记录含义相同。`PluginInfo` 扩展 `@deepseek-ai/dsh-host-plugin-inventory/types` 的 `PluginInventoryEntry`；基础清单字段由该入口的 reference 拥有，本页只说明管理附加字段。

| 对象                        | 需要读取或构造的成员                                                                                                                                                                    | 约束                                                                                                                                          |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `PluginInfo`                | `patchId: string` 或 `readOnlyReason: 'management-required' \| 'unaddressable'`，二者互斥                                                                                               | 仅有 `patchId` 才能作为可写 Profile 行；调用 `setPluginEnabled` 仍传 `entryId`。                                                              |
| `BundleInfo`                | `name`, `version?`, `description?`, `meta?`, `enabled`, `installed`, `optional`, `removable`, `readOnlyReason?`, `error?`, `rows`, `overrides`                                          | `rows` 的 `entryId?` 只在当前 Loader 中找到唯一行时存在；损坏 bundle 的 `error` 与已保存的 `enabled` 可同时存在。                             |
| `BundleRowInfo`             | `rowId`, `moduleName`, `meta?`, `entryId?`                                                                                                                                              | `rowId` 是 bundle patch 声明的 id；`entryId` 是当前运行行的身份。                                                                             |
| `InstallBundleOptions`      | `enabled?: boolean`, `requestId?: PluginInstallRequestId`, `approvedBuilds?: string[]`, `registry?: string \| null`                                                                     | 未写 `enabled` 默认为启用；可取消的调用由调用方生成唯一 request id。                                                                          |
| `PluginSpecInspection`      | `status: 'accepted'` 时有 `kind`, `bundle: boolean \| null`, `registry`, 可选 `name`, `version`, `description`, `host`；`status: 'refused'` 时有 `problem`, `reason`, 可选 `registries` | `bundle: null` 是无法在安装前确定，不能解释为 false。                                                                                         |
| `ChangeResult`              | `changed`, `application`, `stage`, `target`, `enabled?`, `error?`, `warnings?`, `packageResult?`, `bundle?`, `pendingBuilds?`, `approvedBuilds?`, `registries?`, `failedAt?`            | `application` 为 `applied`、`restart-required`、`overridden`、`failed` 或 `cancelled`；`changed` 表示 Profile 文件变化，可与失败同时为 true。 |
| `PackageResult`             | `exitCode`, `output`, `truncated`, `logPath`, `kind?`, `timedOut?`, `incompatible?`                                                                                                     | `output` 受截断上限约束；完整诊断在 `logPath`。超时即使退出码 0 也不算成功。                                                                  |
| `ManagementError`           | `code`, `diagnostic?`, `incompatible?`                                                                                                                                                  | `incompatible-version` 携带每包 `name`, `version`, `runtimeVersion`, 不满足的 `peers`。                                                       |
| `PluginInstallCancellation` | `status: 'cancelled' \| 'too-late' \| 'not-running'`                                                                                                                                    | `not-running` 不能推断先前安装结果。                                                                                                          |

`PluginRegistries` 有只读 `registry: string | null`、`fallbackRegistries: readonly string[]` 和 `resolved: string | null`。`InspectOptions.registry` 可指定首选 registry。`PluginInstallProgress` 包含 `requestId`、`phase` 以及 `installing` 时的 `attempt: { registry, index, total }`。`PluginInstallLogChunk` 包含可选 `requestId`、`jobId`、`argv`、`cwd`、`stream`、`text`，最后一块可带 `exitCode`。Host Cordis 事件 `plugin-manager/install-state`、`plugin-manager/install-log` 和 `plugin-manager/changed` 是通知，不是持久安装记录；`changed` 仅由管理服务操作发出，外部 HMR 文件刷新不会发出。

## 生命周期与状态

Profile 的 `package.json`、`pnpm-lock.yaml`、`cordis.patch.yml`、`pnpm-workspace.yaml` 和兼容例外文件持久保存；运行中的 Loader fiber 与 HMR 组合只属于当前进程。管理服务在其 Cordis effect 释放时取消并等待自己启动的包操作。开启 HMR 的 Profile 通过互斥重组应用变更；未开启 HMR 的结果为 `restart-required`，当前进程尚未载入新代码。即使开启 HMR，替换已有包的 JS 模块代际也需要重启进程。

失败或取消的安装恢复原有 `package.json` 与 `pnpm-lock.yaml`，下载物与 pnpm store 文件可以留下；构建脚本批准写入的 `pnpm-workspace.yaml` 不随之回滚。移除失败保留已完成的撤选或包操作，须读回清单判定剩余状态。管理变更结果不自动写入 Agent Session；若业务逻辑需要在恢复后知道管理结果，必须让自己的 Session 事件或日志记录足够事实。

## 失败、权限与边界

保护管理组件、同 id 多义行、安装拥有的 bundle 不可随意改动；无 HMR 时，正在被当前进程使用的 bundle 不能由服务移除，应停止 Profile 并使用 CLI。包的 DSH peer 不兼容会阻断安装与启动，即使 `enabled: false`；例外只适用于精确 `package-name@version` 与精确 DSH 运行时版本，不批准依赖构建脚本。安装操作的 `stage` 从 `install` 进入 `enable`，后段失败时依赖仍可能已安装。列表、管理结果只证明 Host 侧；Web 页面同步结果需要单独观察。

## 验证

先通过 `listBundles` 与 `listPlugins` 获取真实包名和 `entryId`，再执行目标操作并核对完整 `ChangeResult`，重新读取清单，最后测试新能力或卸载后的缺失。CLI 路径先 `dsh --profile <name> --dump-config` 检查层，再启动 Profile；dump 不能证明 fiber 已运行。目标源码的服务方法、结果类型、工具权限与行为测试路径记在本专题证据账本；本页为精确源码裁决，未把仓库测试的存在冒充本次已运行验证。
