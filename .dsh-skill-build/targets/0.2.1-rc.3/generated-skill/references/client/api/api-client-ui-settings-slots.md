# ui-settings：slots 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

ConfigForms 是浏览器读取与编辑 Host 配置的入口。通过 namespace/entryId 取得表单，订阅不可变 snapshot，再使用 set/mutate 提交；Host 验证成功才接受持久值。配置无效或 revision 不匹配应保留错误与重新读取，不能把本地表单 staging 当已保存状态。

## SettingsGeneralItemOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-settings/client`，公开符号 `SettingsGeneralItemOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SettingsGeneralItemOwnerProps {
    children?: never;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `children` | `children?: never;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings.md#接入-ui-settings) 在真实装载路径检验成功、失败与卸载。

## SettingsHeaderOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-settings/client`，公开符号 `SettingsHeaderOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SettingsHeaderOwnerProps {
    children?: never;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `children` | `children?: never;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings.md#接入-ui-settings) 在真实装载路径检验成功、失败与卸载。

## SettingsLauncherOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-settings/client`，公开符号 `SettingsLauncherOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SettingsLauncherOwnerProps {
    wide: boolean;
    settingsOpen: boolean;
    settingsShortcut?: {
        readonly keys: readonly string[];
        readonly aria?: string | undefined;
    };
    openSettings: () => void;
    openOnboarding: (id: string) => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `wide` | `wide: boolean;` |
| `settingsOpen` | `settingsOpen: boolean;` |
| `settingsShortcut` | `settingsShortcut?: { readonly keys: readonly string[]; readonly aria?: string \| undefined; };` |
| `openSettings` | `openSettings: () => void;` |
| `openOnboarding` | `openOnboarding: (id: string) => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings.md#接入-ui-settings) 在真实装载路径检验成功、失败与卸载。

## SettingsOnboardingOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-settings/client`，公开符号 `SettingsOnboardingOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SettingsOnboardingOwnerProps {
    stepId: string;
    explicit?: boolean;
    complete: () => void;
    openSection: (id: string) => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `stepId` | `stepId: string;` |
| `explicit` | `explicit?: boolean;` |
| `complete` | `complete: () => void;` |
| `openSection` | `openSection: (id: string) => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings.md#接入-ui-settings) 在真实装载路径检验成功、失败与卸载。

## SettingsPluginsTabOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-settings/client`，公开符号 `SettingsPluginsTabOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SettingsPluginsTabOwnerProps {
    children?: never;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `children` | `children?: never;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings.md#接入-ui-settings) 在真实装载路径检验成功、失败与卸载。

## SettingsSectionOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-settings/client`，公开符号 `SettingsSectionOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SettingsSectionOwnerProps {
    close: () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `close` | `close: () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings.md#接入-ui-settings) 在真实装载路径检验成功、失败与卸载。

## SettingsTriggerOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-settings/client`，公开符号 `SettingsTriggerOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SettingsTriggerOwnerProps {
    wide: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `wide` | `wide: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings.md#接入-ui-settings) 在真实装载路径检验成功、失败与卸载。
