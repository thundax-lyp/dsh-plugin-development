# ui-settings-models：store 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-settings-models 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## ModelsSettingsState client

入口 `@deepseek-ai/dsh-client-ui-settings-models/client`，公开符号 `ModelsSettingsState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ModelsSettingsState {
    status: 'idle' | 'loading' | 'ready' | 'error';
    error: string | null;
    credentialError: string | null;
    writable: boolean;
    rows: readonly ProviderRow[];
    namespaces: ReadonlyMap<string, SettingsNamespaceView>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `status` | `status: 'idle' \| 'loading' \| 'ready' \| 'error';` |
| `error` | `error: string \| null;` |
| `credentialError` | `credentialError: string \| null;` |
| `writable` | `writable: boolean;` |
| `rows` | `rows: readonly ProviderRow[];` |
| `namespaces` | `namespaces: ReadonlyMap<string, SettingsNamespaceView>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-models.md#接入-ui-settings-models) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ProviderRow {

  accountAvailable?: boolean

  entry: ProviderDirectoryEntry

  configured: boolean

  removable: boolean

  apiKeyEnv: string | undefined

  credential: CredentialInfo | undefined

  derivedCredential?: CredentialInfo

  credentialChecks?: Readonly<Record<string, CredentialInfo>>
}

export interface ProviderDirectoryEntry {
  readonly provider: string
  readonly displayName: string
  readonly settingsNs: string
  readonly settingsPath: readonly string[]
  readonly active: boolean
  readonly declared?: boolean
  readonly defaultBaseURL?: string
  readonly baseURLEnv?: readonly string[]
  readonly nativeAuth?: LlmNativeAuth
  readonly error?: string
}
```

## ProviderDirectoryEntry client

入口 `@deepseek-ai/dsh-client-ui-settings-models/client`，公开符号 `ProviderDirectoryEntry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ProviderDirectoryEntry {
    readonly provider: string;
    readonly displayName: string;
    readonly settingsNs: string;
    readonly settingsPath: readonly string[];
    readonly active: boolean;
    readonly declared?: boolean;
    readonly defaultBaseURL?: string;
    readonly baseURLEnv?: readonly string[];
    readonly nativeAuth?: LlmNativeAuth;
    readonly error?: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `provider` | `readonly provider: string;` |
| `displayName` | `readonly displayName: string;` |
| `settingsNs` | `readonly settingsNs: string;` |
| `settingsPath` | `readonly settingsPath: readonly string[];` |
| `active` | `readonly active: boolean;` |
| `declared` | `readonly declared?: boolean;` |
| `defaultBaseURL` | `readonly defaultBaseURL?: string;` |
| `baseURLEnv` | `readonly baseURLEnv?: readonly string[];` |
| `nativeAuth` | `readonly nativeAuth?: LlmNativeAuth;` |
| `error` | `readonly error?: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-models.md#接入-ui-settings-models) 在真实装载路径检验成功、失败与卸载。

## ProviderRow client

入口 `@deepseek-ai/dsh-client-ui-settings-models/client`，公开符号 `ProviderRow`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ProviderRow {
    accountAvailable?: boolean;
    entry: ProviderDirectoryEntry;
    configured: boolean;
    removable: boolean;
    apiKeyEnv: string | undefined;
    credential: CredentialInfo | undefined;
    derivedCredential?: CredentialInfo;
    credentialChecks?: Readonly<Record<string, CredentialInfo>>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `accountAvailable` | `accountAvailable?: boolean;` |
| `entry` | `entry: ProviderDirectoryEntry;` |
| `configured` | `configured: boolean;` |
| `removable` | `removable: boolean;` |
| `apiKeyEnv` | `apiKeyEnv: string \| undefined;` |
| `credential` | `credential: CredentialInfo \| undefined;` |
| `derivedCredential` | `derivedCredential?: CredentialInfo;` |
| `credentialChecks` | `credentialChecks?: Readonly<Record<string, CredentialInfo>>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-models.md#接入-ui-settings-models) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface ProviderDirectoryEntry {
  readonly provider: string
  readonly displayName: string
  readonly settingsNs: string
  readonly settingsPath: readonly string[]
  readonly active: boolean
  readonly declared?: boolean
  readonly defaultBaseURL?: string
  readonly baseURLEnv?: readonly string[]
  readonly nativeAuth?: LlmNativeAuth
  readonly error?: string
}
```
