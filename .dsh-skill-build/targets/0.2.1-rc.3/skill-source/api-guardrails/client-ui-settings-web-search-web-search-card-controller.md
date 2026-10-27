# ui-settings-web-search：web-search-card-controller 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-settings-web-search 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## WebApiSettings client

入口 `@deepseek-ai/dsh-client-ui-settings-web-search/client`，公开符号 `WebApiSettings`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WebApiSettings {
    apiKeyEnv?: string;
    baseURL?: string;
    count?: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `apiKeyEnv` | `apiKeyEnv?: string;` |
| `baseURL` | `baseURL?: string;` |
| `count` | `count?: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-web-search.md#接入-ui-settings-web-search) 在真实装载路径检验成功、失败与卸载。

## WebProviderSelection client

入口 `@deepseek-ai/dsh-client-ui-settings-web-search/client`，公开符号 `WebProviderSelection`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WebProviderSelection {
    searchProvider?: string;
    fetchProvider?: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `searchProvider` | `searchProvider?: string;` |
| `fetchProvider` | `fetchProvider?: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-web-search.md#接入-ui-settings-web-search) 在真实装载路径检验成功、失败与卸载。

## WebSearchCardFace client

入口 `@deepseek-ai/dsh-client-ui-settings-web-search/client`，公开符号 `WebSearchCardFace`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WebSearchCardFace extends SettingsFormActions {
    hooks: {
        webSearchCard: SnapshotStore<WebSearchCardState>;
    };
    setSearchApi: (enabled: boolean) => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `hooks: { webSearchCard: SnapshotStore<WebSearchCardState>; };` |
| `setSearchApi` | `setSearchApi: (enabled: boolean) => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-web-search.md#接入-ui-settings-web-search) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface WebSearchCardState extends SettingsFormShell {

  apiSwitchAvailable: boolean

  apiSwitchBlocked: boolean

  useSearchApi: boolean

  baseURL: SettingsFieldState

  maxUses: SettingsFieldState

  count: SettingsFieldState

  apiKey: SettingsFieldState

  apiKeyConfigured: boolean

  apiKeyWritable: boolean
}
```

## WebSearchCardScopes client

入口 `@deepseek-ai/dsh-client-ui-settings-web-search/client`，公开符号 `WebSearchCardScopes`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WebSearchCardScopes {
    web: SettingsFormScope<WebProviderSelection>;
    messages: SettingsFormScope<WebSearchSettings>;
    api: SettingsFormScope<WebApiSettings>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `web` | `web: SettingsFormScope<WebProviderSelection>;` |
| `messages` | `messages: SettingsFormScope<WebSearchSettings>;` |
| `api` | `api: SettingsFormScope<WebApiSettings>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-web-search.md#接入-ui-settings-web-search) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface WebProviderSelection {

  searchProvider?: string

  fetchProvider?: string
}

export interface WebSearchSettings {

  apiKeyEnv?: string

  baseURL?: string

  maxUses?: number
}

export interface WebApiSettings {

  apiKeyEnv?: string

  baseURL?: string

  count?: number
}
```

## WebSearchCardState client

入口 `@deepseek-ai/dsh-client-ui-settings-web-search/client`，公开符号 `WebSearchCardState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WebSearchCardState extends SettingsFormShell {
    apiSwitchAvailable: boolean;
    apiSwitchBlocked: boolean;
    useSearchApi: boolean;
    baseURL: SettingsFieldState;
    maxUses: SettingsFieldState;
    count: SettingsFieldState;
    apiKey: SettingsFieldState;
    apiKeyConfigured: boolean;
    apiKeyWritable: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `apiSwitchAvailable` | `apiSwitchAvailable: boolean;` |
| `apiSwitchBlocked` | `apiSwitchBlocked: boolean;` |
| `useSearchApi` | `useSearchApi: boolean;` |
| `baseURL` | `baseURL: SettingsFieldState;` |
| `maxUses` | `maxUses: SettingsFieldState;` |
| `count` | `count: SettingsFieldState;` |
| `apiKey` | `apiKey: SettingsFieldState;` |
| `apiKeyConfigured` | `apiKeyConfigured: boolean;` |
| `apiKeyWritable` | `apiKeyWritable: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-web-search.md#接入-ui-settings-web-search) 在真实装载路径检验成功、失败与卸载。

## WebSearchSettings client

入口 `@deepseek-ai/dsh-client-ui-settings-web-search/client`，公开符号 `WebSearchSettings`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WebSearchSettings {
    apiKeyEnv?: string;
    baseURL?: string;
    maxUses?: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `apiKeyEnv` | `apiKeyEnv?: string;` |
| `baseURL` | `baseURL?: string;` |
| `maxUses` | `maxUses?: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-web-search.md#接入-ui-settings-web-search) 在真实装载路径检验成功、失败与卸载。
