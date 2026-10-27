# ui-plugin-manager：manager-store 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-plugin-manager 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## PluginManagerFace client

入口 `@deepseek-ai/dsh-client-ui-plugin-manager/client`，公开符号 `PluginManagerFace`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PluginManagerFace {
    resolveText: (text: LocalizedText) => string;
    configForm: ConfigForms['get'];
    hooks: {
        configurations: SettingsDescribeFace;
        pluginManager: SnapshotStore<PluginManagerState>;
        configLedger: HostObservable<ConfigLedger>;
        pluginTabs: HostObservable<readonly PluginTab[]>;
    };
    ensure: () => void;
    refresh: () => void;
    openInstall: () => void;
    installFrom: (target: PluginTabInstall) => void;
    closeInstall: () => void;
    editInstallSpec: (text: string) => void;
    runInstall: () => void;
    toggleRegistryOptions: () => void;
    chooseRegistry: (choice: RegistryChoice) => void;
    changeRegistry: () => void;
    useGithubMirror: () => void;
    approveBuildsAndRetry: () => void;
    cancelInstall: () => void;
    reconcileInstall: () => void;
    toggleInstallDetails: () => void;
    enableInstalled: () => void;
    clearHighlight: () => void;
    setEnabled: (packageName: string, enabled: boolean) => void;
    update: (packageName: string) => void;
    uninstall: (packageName: string) => void;
    confirm: () => void;
    cancelConfirm: () => void;
    setRowEnabled: (entryId: PluginEntryId, enabled: boolean) => void;
    dismissNotice: () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `resolveText` | `resolveText: (text: LocalizedText) => string;` |
| `configForm` | `configForm: ConfigForms['get'];` |
| `hooks` | `hooks: { configurations: SettingsDescribeFace; pluginManager: SnapshotStore<PluginManagerState>; configLedger: HostObservable<ConfigLedger>; pluginTabs: HostObservable<readonly PluginTab[]>; };` |
| `ensure` | `ensure: () => void;` |
| `refresh` | `refresh: () => void;` |
| `openInstall` | `openInstall: () => void;` |
| `installFrom` | `installFrom: (target: PluginTabInstall) => void;` |
| `closeInstall` | `closeInstall: () => void;` |
| `editInstallSpec` | `editInstallSpec: (text: string) => void;` |
| `runInstall` | `runInstall: () => void;` |
| `toggleRegistryOptions` | `toggleRegistryOptions: () => void;` |
| `chooseRegistry` | `chooseRegistry: (choice: RegistryChoice) => void;` |
| `changeRegistry` | `changeRegistry: () => void;` |
| `useGithubMirror` | `useGithubMirror: () => void;` |
| `approveBuildsAndRetry` | `approveBuildsAndRetry: () => void;` |
| `cancelInstall` | `cancelInstall: () => void;` |
| `reconcileInstall` | `reconcileInstall: () => void;` |
| `toggleInstallDetails` | `toggleInstallDetails: () => void;` |
| `enableInstalled` | `enableInstalled: () => void;` |
| `clearHighlight` | `clearHighlight: () => void;` |
| `setEnabled` | `setEnabled: (packageName: string, enabled: boolean) => void;` |
| `update` | `update: (packageName: string) => void;` |
| `uninstall` | `uninstall: (packageName: string) => void;` |
| `confirm` | `confirm: () => void;` |
| `cancelConfirm` | `cancelConfirm: () => void;` |
| `setRowEnabled` | `setRowEnabled: (entryId: PluginEntryId, enabled: boolean) => void;` |
| `dismissNotice` | `dismissNotice: () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-plugin-manager.md#接入-ui-plugin-manager) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type RegistryChoice =
  | { readonly kind: 'offered'; readonly registry: Registry }
  | { readonly kind: 'custom'; readonly url: string }

export interface PluginManagerState {

  readonly status: 'idle' | 'loading' | 'ready' | 'error' | 'unavailable'

  readonly refreshStatus: 'idle' | 'refreshing' | 'failed'
  readonly packages: readonly PackageView[]

  readonly busy: readonly string[]
  readonly notice: ManagerNotice | null
  readonly install: InstallState
  readonly confirm: ConfirmState | null

  readonly highlight: string | null
}

export type ManagerNotice =
  | { readonly kind: 'restart'; readonly packageName: string; readonly reason: RestartReason | undefined; readonly seq: number }
  | { readonly kind: 'overridden'; readonly packageName: string; readonly seq: number }
  | { readonly kind: 'cancelled'; readonly seq: number }
  | { readonly kind: 'refresh-failed'; readonly seq: number }
  | { readonly kind: 'install'; readonly outcome: 'done' | 'failed' | 'unconfirmed' | 'applying' | 'unknown'; readonly seq: number }
  | {
    readonly kind: 'failed'

    readonly action: FailedAction

    readonly code?: ManagementError['code']

    readonly reason: string

    readonly incompatible?: readonly IncompatiblePlugin[]
    readonly packageName?: string
    readonly seq: number
  }

export interface PackageView {
  readonly name: string

  readonly official: boolean

  readonly availability: BundleInfo['availability']

  readonly installTarget?: NonNullable<BundleInfo['installTarget']>
  readonly version?: string
  readonly description?: string

  readonly meta?: PluginLocalizedMeta

  readonly installed: boolean

  readonly source?: string

  readonly optional: boolean

  readonly removable: boolean

  readonly enabled: boolean

  readonly readOnlyReason?: ReadOnlyReason

  readonly error?: ManagementError
  readonly rows: readonly PackageRow[]
}

export interface InstallState {
  readonly open: boolean

  readonly spec: string

  readonly mirrorRecovery?: boolean

  readonly confirmed?: { readonly title: string; readonly version: string }

  readonly registries: PluginRegistries | null

  readonly registry: RegistryChoice

  readonly registryOpen: boolean

  readonly registryError: boolean

  readonly attempts: { readonly registries: readonly Registry[]; readonly total: number } | null
  readonly phase: 'idle' | 'checking' | 'starting' | 'running' | 'cancelling' | 'applying' | 'unconfirmed' | 'unknown' | 'done' | 'failed'

  readonly requestId?: PluginInstallRequestId

  readonly inputError: InstallInputError | null

  readonly subject: InstallSubject | null

  readonly runs: readonly InstallRun[]

  readonly detailsOpen: boolean

  readonly installed: string | null

  readonly installedVersion: string | null

  readonly restartRequired: boolean

  readonly restartReason?: RestartReason

  readonly failure: {
    readonly reason: string
    readonly code?: ManagementError['code']

    readonly incompatible?: readonly IncompatiblePlugin[]
    readonly kind?: PluginInstallFailureKind

    readonly failedAt?: 'registry' | 'spec-host'
    readonly pendingBuilds?: readonly string[]
    readonly uncertainty?: 'result' | 'cancellation' | 'acceptance'
  } | null

  readonly approvedBuilds: readonly string[]

  readonly enabling: boolean
}

export interface ConfirmState {
  readonly action: 'uninstall'
  readonly packageName: string
}

export type FailedAction = 'enable' | 'disable' | 'uninstall' | 'rowEnable' | 'rowDisable'

export interface PackageRow {

  readonly entryId?: PluginEntryId

  readonly rowId: string

  readonly moduleName: string

  readonly meta?: PluginLocalizedMeta

  readonly enabled: boolean

  readonly phase: PluginInfo['fiberPhase']

  readonly readOnlyReason?: ReadOnlyReason
}

export type InstallSubject = Extract<PluginSpecInspection, { status: 'accepted' }> & {
  readonly spec: string

  readonly selection?: boolean

  readonly saveExact?: boolean
}

export interface InstallInputError {

  readonly problem: PluginInspectProblem | 'shipped'
  readonly reason: string

  readonly registries?: readonly Registry[]
}

export interface InstallRun {
  readonly jobId: string

  readonly command: string

  readonly cwd: string

  readonly output: string

  readonly exitCode?: number | null
}
```
