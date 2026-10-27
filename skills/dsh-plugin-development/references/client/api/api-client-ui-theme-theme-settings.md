# ui-theme：theme-settings 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

ThemeRuntime 由浏览器插件提供，不由消费者直接构造。getTheme 读稳定快照；register 注册主题并返回 disposer，重复 id 与 system id 抛错；移除当前主题回退默认偏好。overrideTokens 按 source 叠加 light/dark 值对，后注册层逐 token 覆盖，旧层 disposer 不会删除同 source 的新层。设置操作通过 Host settings scope 持久化；CSS tokens 本身不产生模型可见事实。

## FontFamilies client

入口 `@deepseek-ai/dsh-client-ui-theme/client`，公开符号 `FontFamilies`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type FontFamilies = Readonly<Record<FontRole, string>>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type FontRole = typeof FONT_ROLES[number]
```

## FontRole client

入口 `@deepseek-ai/dsh-client-ui-theme/client`，公开符号 `FontRole`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type FontRole = typeof FONT_ROLES[number];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

## FontSizes client

入口 `@deepseek-ai/dsh-client-ui-theme/client`，公开符号 `FontSizes`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type FontSizes = Readonly<Record<FontRole, number>>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type FontRole = typeof FONT_ROLES[number]
```

## ThemePreference client

入口 `@deepseek-ai/dsh-client-ui-theme/client`，公开符号 `ThemePreference`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ThemePreference = typeof THEME_PREFERENCES[number];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

## ThemeSettings client

入口 `@deepseek-ai/dsh-client-ui-theme/client`，公开符号 `ThemeSettings`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ThemeSettings {
    preference: ThemePreference;
    fontSize: number;
    codeFontSize: number;
    terminalFontSize: number;
    textFontFamily: string;
    codeFontFamily: string;
    terminalFontFamily: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `preference` | `preference: ThemePreference;` |
| `fontSize` | `fontSize: number;` |
| `codeFontSize` | `codeFontSize: number;` |
| `terminalFontSize` | `terminalFontSize: number;` |
| `textFontFamily` | `textFontFamily: string;` |
| `codeFontFamily` | `codeFontFamily: string;` |
| `terminalFontFamily` | `terminalFontFamily: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ThemePreference = typeof THEME_PREFERENCES[number]
```

## DEFAULT_FONT_SIZE root

入口 `@deepseek-ai/dsh-client-ui-theme`，公开符号 `DEFAULT_FONT_SIZE`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const DEFAULT_FONT_SIZE = 14;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

## DEFAULT_PREFERENCE root

入口 `@deepseek-ai/dsh-client-ui-theme`，公开符号 `DEFAULT_PREFERENCE`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const DEFAULT_PREFERENCE: ThemePreference;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ThemePreference = typeof THEME_PREFERENCES[number]
```

## FONT_SIZE_FIELD root

入口 `@deepseek-ai/dsh-client-ui-theme`，公开符号 `FONT_SIZE_FIELD`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const FONT_SIZE_FIELD = "fontSize";
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

## FONT_SIZE_MAX root

入口 `@deepseek-ai/dsh-client-ui-theme`，公开符号 `FONT_SIZE_MAX`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const FONT_SIZE_MAX = 22;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

## FONT_SIZE_MIN root

入口 `@deepseek-ai/dsh-client-ui-theme`，公开符号 `FONT_SIZE_MIN`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const FONT_SIZE_MIN = 10;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

## THEME_PREFERENCES root

入口 `@deepseek-ai/dsh-client-ui-theme`，公开符号 `THEME_PREFERENCES`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const THEME_PREFERENCES: readonly [
    "light",
    "dark",
    "system"
];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

## THEME_PREFERENCE_FIELD root

入口 `@deepseek-ai/dsh-client-ui-theme`，公开符号 `THEME_PREFERENCE_FIELD`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const THEME_PREFERENCE_FIELD = "preference";
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

## THEME_SETTINGS_NAMESPACE root

入口 `@deepseek-ai/dsh-client-ui-theme`，公开符号 `THEME_SETTINGS_NAMESPACE`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const THEME_SETTINGS_NAMESPACE = "ui-theme";
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

## ThemePreference root

入口 `@deepseek-ai/dsh-client-ui-theme`，公开符号 `ThemePreference`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ThemePreference = typeof THEME_PREFERENCES[number];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

## ThemeSettings root

入口 `@deepseek-ai/dsh-client-ui-theme`，公开符号 `ThemeSettings`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ThemeSettings {
    preference: ThemePreference;
    fontSize: number;
    codeFontSize: number;
    terminalFontSize: number;
    textFontFamily: string;
    codeFontFamily: string;
    terminalFontFamily: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `preference` | `preference: ThemePreference;` |
| `fontSize` | `fontSize: number;` |
| `codeFontSize` | `codeFontSize: number;` |
| `terminalFontSize` | `terminalFontSize: number;` |
| `textFontFamily` | `textFontFamily: string;` |
| `codeFontFamily` | `codeFontFamily: string;` |
| `terminalFontFamily` | `terminalFontFamily: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type ThemePreference = typeof THEME_PREFERENCES[number]
```
