# locale：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

LocaleRuntime 管理字典与语言偏好。插件把自己的中英字典注册到唯一 namespace，并通过 bind 得到翻译函数；组件以 locale 声明让 renderer 注入 t，不能依赖 primitives 读取应用语言。字典注册返回清理入口，必须随插件退出释放。

## COMMON_NS client

入口 `@deepseek-ai/dsh-client-locale/client`，公开符号 `COMMON_NS`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const COMMON_NS = "common";
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-locale.md#接入-locale) 在真实装载路径检验成功、失败与卸载。

## FALLBACK_LOCALE client

入口 `@deepseek-ai/dsh-client-locale/client`，公开符号 `FALLBACK_LOCALE`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const FALLBACK_LOCALE: BuiltInLocaleId;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-locale.md#接入-locale) 在真实装载路径检验成功、失败与卸载。

## LanguageRegistration client

入口 `@deepseek-ai/dsh-client-locale/client`，公开符号 `LanguageRegistration`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface LanguageRegistration {
    id: LocaleId;
    label: string;
    fallback: LocaleId;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `id: LocaleId;` |
| `label` | `label: string;` |
| `fallback` | `fallback: LocaleId;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-locale.md#接入-locale) 在真实装载路径检验成功、失败与卸载。

## LocaleDefinition client

入口 `@deepseek-ai/dsh-client-locale/client`，公开符号 `LocaleDefinition`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface LocaleDefinition {
    readonly id: LocaleId;
    readonly label: string;
    readonly fallback?: LocaleId;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `readonly id: LocaleId;` |
| `label` | `readonly label: string;` |
| `fallback` | `readonly fallback?: LocaleId;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-locale.md#接入-locale) 在真实装载路径检验成功、失败与卸载。

## LocaleDict client

入口 `@deepseek-ai/dsh-client-locale/client`，公开符号 `LocaleDict`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type LocaleDict = Record<string, string>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-locale.md#接入-locale) 在真实装载路径检验成功、失败与卸载。

## LocaleRuntime client

入口 `@deepseek-ai/dsh-client-locale/client`，公开符号 `LocaleRuntime`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class LocaleRuntime {
    constructor(ctx: ClientContext, host?: ConfigForm<LocaleSettings>, bootstrap?: LocaleBootstrap | undefined);
    getLocale(): LocaleSnapshot;
    resolveText(text: LocalizedText): string;
    getSnapshot(): LocaleSnapshot;
    subscribe(fn: () => void): () => void;
    setLocale(id: string): void;
    addLanguage(input: LanguageRegistration): () => void;
    register<N extends Extract<keyof LocaleNamespaceMap, string>>(ns: N, dicts: Record<BuiltInLocaleId, LocaleDictOf<N>>): () => void;
    register(ns: string, locale: string, dict: LocaleDict): () => void;
    bind<N extends Extract<keyof LocaleNamespaceMap, string>>(ns: N): TranslateNS<N>;
    bind(ns: string): Translate;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `constructor` | `constructor(ctx: ClientContext, host?: ConfigForm<LocaleSettings>, bootstrap?: LocaleBootstrap \| undefined);` |
| `getLocale` | `getLocale(): LocaleSnapshot;` |
| `resolveText` | `resolveText(text: LocalizedText): string;` |
| `getSnapshot` | `getSnapshot(): LocaleSnapshot;` |
| `subscribe` | `subscribe(fn: () => void): () => void;` |
| `setLocale` | `setLocale(id: string): void;` |
| `addLanguage` | `addLanguage(input: LanguageRegistration): () => void;` |
| `register` | `register<N extends Extract<keyof LocaleNamespaceMap, string>>(ns: N, dicts: Record<BuiltInLocaleId, LocaleDictOf<N>>): () => void;` |
| `register` | `register(ns: string, locale: string, dict: LocaleDict): () => void;` |
| `bind` | `bind<N extends Extract<keyof LocaleNamespaceMap, string>>(ns: N): TranslateNS<N>;` |
| `bind` | `bind(ns: string): Translate;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-locale.md#接入-locale) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type LocaleDict = Record<string, string>

export interface LanguageRegistration {

  id: LocaleId

  label: string

  fallback: LocaleId
}

export interface LocaleSnapshot {

  active: LocaleId

  locales: readonly LocaleDefinition[]

  revision: number
}

export interface LocaleDefinition {

  readonly id: LocaleId

  readonly label: string

  readonly fallback?: LocaleId
}
```

## LocaleSnapshot client

入口 `@deepseek-ai/dsh-client-locale/client`，公开符号 `LocaleSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface LocaleSnapshot {
    active: LocaleId;
    locales: readonly LocaleDefinition[];
    revision: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `active` | `active: LocaleId;` |
| `locales` | `locales: readonly LocaleDefinition[];` |
| `revision` | `revision: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-locale.md#接入-locale) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface LocaleDefinition {

  readonly id: LocaleId

  readonly label: string

  readonly fallback?: LocaleId
}
```

## SETTINGS_NS client

入口 `@deepseek-ai/dsh-client-locale/client`，公开符号 `SETTINGS_NS`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const SETTINGS_NS = "settings.locale";
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-locale.md#接入-locale) 在真实装载路径检验成功、失败与卸载。

## Translate client

入口 `@deepseek-ai/dsh-client-locale/client`，公开符号 `Translate`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [Translate 权威契约](api-client-ui-slots-index.md#translate-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-locale.md#接入-locale) 在真实装载路径检验成功、失败与卸载。

## TranslateNS client

入口 `@deepseek-ai/dsh-client-locale/client`，公开符号 `TranslateNS`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [TranslateNS 权威契约](api-client-ui-slots-index.md#translatens-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-locale.md#接入-locale) 在真实装载路径检验成功、失败与卸载。

## Config root

入口 `@deepseek-ai/dsh-client-locale`，公开符号 `Config`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface Config {
    preference: Volatile<string | undefined>;
}

export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    preference: z<string, string, "volatile">;
}>>, Schemastery.ObjectT<NoInfer<{
    preference: z<string, string, "volatile">;
}>>, "plain">;
```

| 成员 | 公开声明 |
| --- | --- |
| `preference` | `preference: Volatile<string \| undefined>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-locale.md#接入-locale) 在真实装载路径检验成功、失败与卸载。
