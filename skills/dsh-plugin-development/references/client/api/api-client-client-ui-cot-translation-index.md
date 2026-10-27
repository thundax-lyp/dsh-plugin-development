# client-ui-cot-translation：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 client-ui-cot-translation 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## Config root

入口 `@deepseek-ai/dsh-experimental-client-ui-cot-translation`，公开符号 `Config`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface Config {
    provider: Volatile<CotTranslationPreferences['provider']>;
    targetLanguage: Volatile<string>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `provider` | `provider: Volatile<CotTranslationPreferences['provider']>;` |
| `targetLanguage` | `targetLanguage: Volatile<string>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-client-ui-cot-translation.md#接入-client-ui-cot-translation) 在真实装载路径检验成功、失败与卸载。

## default root

入口 `@deepseek-ai/dsh-experimental-client-ui-cot-translation`，公开符号 `default`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export default class CotTranslationController extends TypertRemoteService {
    static inject: string[];
    static Config: z<Schemastery.ObjectS<NoInfer<{
        provider: z<"google" | "bing" | "deepseek-account" | "deepseek-official", "google" | "bing" | "deepseek-account" | "deepseek-official", "volatile-defined">;
        targetLanguage: z<string, string, "volatile-defined">;
    }>>, Schemastery.ObjectT<NoInfer<{
        provider: z<"google" | "bing" | "deepseek-account" | "deepseek-official", "google" | "bing" | "deepseek-account" | "deepseek-official", "volatile-defined">;
        targetLanguage: z<string, string, "volatile-defined">;
    }>>, "plain">;
    constructor(ctx: Context, config: Config);
    limits(signal: AbortSignal): Promise<CotTranslationSnapshot>;
    translate(request: TranslationRequest, signal: AbortSignal): Promise<string>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `inject` | `static inject: string[];` |
| `Config` | `static Config: z<Schemastery.ObjectS<NoInfer<{ provider: z<"google" \| "bing" \| "deepseek-account" \| "deepseek-official", "google" \| "bing" \| "deepseek-account" \| "deepseek-official", "volatile-defined">; targetLanguage: z<string, string, "volatile-defined">; }>>, Schemastery.ObjectT<NoInfer<{ provider: z<"google" \| "bing" \| "deepseek-account" \| "deepseek-official", "google" \| "bing" \| "deepseek-account" \| "deepseek-official", "volatile-defined">; targetLanguage: z<string, string, "volatile-defined">; }>>, "plain">;` |
| `constructor` | `constructor(ctx: Context, config: Config);` |
| `limits` | `limits(signal: AbortSignal): Promise<CotTranslationSnapshot>;` |
| `translate` | `translate(request: TranslationRequest, signal: AbortSignal): Promise<string>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-client-ui-cot-translation.md#接入-client-ui-cot-translation) 在真实装载路径检验成功、失败与卸载。
