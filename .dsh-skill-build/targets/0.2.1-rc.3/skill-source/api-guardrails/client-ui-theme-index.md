# ui-theme：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

ThemeRuntime 由浏览器插件提供，不由消费者直接构造。getTheme 读稳定快照；register 注册主题并返回 disposer，重复 id 与 system id 抛错；移除当前主题回退默认偏好。overrideTokens 按 source 叠加 light/dark 值对，后注册层逐 token 覆盖，旧层 disposer 不会删除同 source 的新层。设置操作通过 Host settings scope 持久化；CSS tokens 本身不产生模型可见事实。

## SETTINGS_NS client

入口 `@deepseek-ai/dsh-client-ui-theme/client`，公开符号 `SETTINGS_NS`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const SETTINGS_NS = "settings.theme";
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

## ThemeDefinition client

入口 `@deepseek-ai/dsh-client-ui-theme/client`，公开符号 `ThemeDefinition`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ThemeDefinition {
    id: string;
    colorScheme: 'light' | 'dark';
    tokens: ThemeTokens;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `id: string;` |
| `colorScheme` | `colorScheme: 'light' \| 'dark';` |
| `tokens` | `tokens: ThemeTokens;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ThemeTokens = Record<string, string>
```

## ThemeRuntime client

入口 `@deepseek-ai/dsh-client-ui-theme/client`，公开符号 `ThemeRuntime`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class ThemeRuntime {
    constructor(ctx: ClientContext, host: ConfigForm<ThemeSettings>);
    getTheme(): ThemeSnapshot;
    exportInspectTokens(): ThemeTokenInspection[];
    setTheme(id: string): void;
    setFontSize(role: FontRole, px: number): void;
    setFontFamily(role: FontRole, value: string): void;
    register(definition: ThemeDefinition): () => void;
    overrideTokens(source: string, tokens: ThemeTokenOverrides): () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `constructor` | `constructor(ctx: ClientContext, host: ConfigForm<ThemeSettings>);` |
| `getTheme` | `getTheme(): ThemeSnapshot;` |
| `exportInspectTokens` | `exportInspectTokens(): ThemeTokenInspection[];` |
| `setTheme` | `setTheme(id: string): void;` |
| `setFontSize` | `setFontSize(role: FontRole, px: number): void;` |
| `setFontFamily` | `setFontFamily(role: FontRole, value: string): void;` |
| `register` | `register(definition: ThemeDefinition): () => void;` |
| `overrideTokens` | `overrideTokens(source: string, tokens: ThemeTokenOverrides): () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ThemeTokenOverrides = Record<string, ThemeTokenModes>

export interface ThemeDefinition {

  id: string

  colorScheme: 'light' | 'dark'

  tokens: ThemeTokens
}

export interface ThemeSnapshot {

  preference: ThemePreference

  fontSizes: FontSizes

  fontFamilies: FontFamilies

  active: ThemeDefinition

  themes: readonly ThemeDefinition[]

  revision: number
}

export interface ThemeTokenInspection {

  name: string

  description: string

  valueType: string

  requiresLightAndDark: boolean

  cssVariable?: string
}

export type ThemeTokens = Record<string, string>

export interface ThemeTokenModes {

  light: string

  dark: string
}
```

## ThemeSnapshot client

入口 `@deepseek-ai/dsh-client-ui-theme/client`，公开符号 `ThemeSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ThemeSnapshot {
    preference: ThemePreference;
    fontSizes: FontSizes;
    fontFamilies: FontFamilies;
    active: ThemeDefinition;
    themes: readonly ThemeDefinition[];
    revision: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `preference` | `preference: ThemePreference;` |
| `fontSizes` | `fontSizes: FontSizes;` |
| `fontFamilies` | `fontFamilies: FontFamilies;` |
| `active` | `active: ThemeDefinition;` |
| `themes` | `themes: readonly ThemeDefinition[];` |
| `revision` | `revision: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ThemeDefinition {

  id: string

  colorScheme: 'light' | 'dark'

  tokens: ThemeTokens
}

export type ThemeTokens = Record<string, string>
```

## ThemeTokenInspection client

入口 `@deepseek-ai/dsh-client-ui-theme/client`，公开符号 `ThemeTokenInspection`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ThemeTokenInspection {
    name: string;
    description: string;
    valueType: string;
    requiresLightAndDark: boolean;
    cssVariable?: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `name` | `name: string;` |
| `description` | `description: string;` |
| `valueType` | `valueType: string;` |
| `requiresLightAndDark` | `requiresLightAndDark: boolean;` |
| `cssVariable` | `cssVariable?: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

## ThemeTokenModes client

入口 `@deepseek-ai/dsh-client-ui-theme/client`，公开符号 `ThemeTokenModes`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ThemeTokenModes {
    light: string;
    dark: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `light` | `light: string;` |
| `dark` | `dark: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

## ThemeTokenOverrides client

入口 `@deepseek-ai/dsh-client-ui-theme/client`，公开符号 `ThemeTokenOverrides`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ThemeTokenOverrides = Record<string, ThemeTokenModes>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ThemeTokenModes {

  light: string

  dark: string
}
```

## ThemeTokens client

入口 `@deepseek-ai/dsh-client-ui-theme/client`，公开符号 `ThemeTokens`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ThemeTokens = Record<string, string>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

## Config root

入口 `@deepseek-ai/dsh-client-ui-theme`，公开符号 `Config`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface Config {
    preference: Volatile<ThemePreference>;
    fontSize: Volatile<number>;
    codeFontSize: Volatile<number>;
    terminalFontSize: Volatile<number>;
    textFontFamily: Volatile<string>;
    codeFontFamily: Volatile<string>;
    terminalFontFamily: Volatile<string>;
}

export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    preference: z<"light" | "dark" | "system", "light" | "dark" | "system", "volatile-defined">;
    fontSize: z<number, number, "volatile">;
    codeFontSize: z<number, number, "volatile">;
    terminalFontSize: z<number, number, "volatile">;
    textFontFamily: z<string, string, "volatile-defined">;
    codeFontFamily: z<string, string, "volatile-defined">;
    terminalFontFamily: z<string, string, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    preference: z<"light" | "dark" | "system", "light" | "dark" | "system", "volatile-defined">;
    fontSize: z<number, number, "volatile">;
    codeFontSize: z<number, number, "volatile">;
    terminalFontSize: z<number, number, "volatile">;
    textFontFamily: z<string, string, "volatile-defined">;
    codeFontFamily: z<string, string, "volatile-defined">;
    terminalFontFamily: z<string, string, "volatile-defined">;
}>>, "plain">;
```

| 成员 | 公开声明 |
| --- | --- |
| `preference` | `preference: Volatile<ThemePreference>;` |
| `fontSize` | `fontSize: Volatile<number>;` |
| `codeFontSize` | `codeFontSize: Volatile<number>;` |
| `terminalFontSize` | `terminalFontSize: Volatile<number>;` |
| `textFontFamily` | `textFontFamily: Volatile<string>;` |
| `codeFontFamily` | `codeFontFamily: Volatile<string>;` |
| `terminalFontFamily` | `terminalFontFamily: Volatile<string>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。
