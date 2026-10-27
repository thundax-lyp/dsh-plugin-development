# client-ui-cot-translation：types 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 client-ui-cot-translation 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## CotTranslationPreferences client

入口 `@deepseek-ai/dsh-experimental-client-ui-cot-translation/client`，公开符号 `CotTranslationPreferences`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface CotTranslationPreferences {
    provider: TranslationProvider;
    targetLanguage: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `provider` | `provider: TranslationProvider;` |
| `targetLanguage` | `targetLanguage: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-client-ui-cot-translation.md#接入-client-ui-cot-translation) 在真实装载路径检验成功、失败与卸载。

## CotTranslationPreferences types

入口 `@deepseek-ai/dsh-experimental-client-ui-cot-translation/types`，公开符号 `CotTranslationPreferences`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface CotTranslationPreferences {
    provider: TranslationProvider;
    targetLanguage: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `provider` | `provider: TranslationProvider;` |
| `targetLanguage` | `targetLanguage: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-client-ui-cot-translation.md#接入-client-ui-cot-translation) 在真实装载路径检验成功、失败与卸载。

## CotTranslationSnapshot types

入口 `@deepseek-ai/dsh-experimental-client-ui-cot-translation/types`，公开符号 `CotTranslationSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface CotTranslationSnapshot {
    maxTextChars: number;
    preferences: CotTranslationPreferences;
    availableProviders: readonly TranslationProvider[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `maxTextChars` | `maxTextChars: number;` |
| `preferences` | `preferences: CotTranslationPreferences;` |
| `availableProviders` | `availableProviders: readonly TranslationProvider[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-client-ui-cot-translation.md#接入-client-ui-cot-translation) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface CotTranslationPreferences {

  provider: TranslationProvider

  targetLanguage: string
}
```
