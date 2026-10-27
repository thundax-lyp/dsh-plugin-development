# ui-settings-account：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-settings-account 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## Config root

入口 `@deepseek-ai/dsh-client-ui-settings-account`，公开符号 `Config`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface Config extends ContactConfig {
    version: Volatile<1>;
    step: Volatile<OnboardingStep>;
    purpose?: Volatile<OnboardingPurpose | null | undefined>;
    process?: Volatile<OnboardingProcess | null | undefined>;
    completion?: Volatile<'completed' | 'skipped' | 'api-key' | null | undefined>;
    usage: Volatile<'compact' | 'detailed'>;
    developerTools: Volatile<boolean>;
}

export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    contactFormUrl: z<string, string, "defined">;
    contactSource: z<string, string, "defined">;
    bonusAckRetryDelayMs: z<number, number, "defined">;
    bonusAckRetryMaxDelayMs: z<number, number, "defined">;
    version: z<1, 1, "volatile-defined">;
    step: z<"welcome" | "credit" | "purpose" | "process" | "done", "welcome" | "credit" | "purpose" | "process" | "done", "volatile-defined">;
    purpose: z<"office" | "development" | "both" | null, "office" | "development" | "both" | null, "volatile">;
    process: z<"compact" | "standard" | "detailed" | null, "compact" | "standard" | "detailed" | null, "volatile">;
    completion: z<"completed" | "skipped" | "api-key" | null, "completed" | "skipped" | "api-key" | null, "volatile">;
    usage: z<"compact" | "detailed", "compact" | "detailed", "volatile-defined">;
    developerTools: z<boolean, boolean, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    contactFormUrl: z<string, string, "defined">;
    contactSource: z<string, string, "defined">;
    bonusAckRetryDelayMs: z<number, number, "defined">;
    bonusAckRetryMaxDelayMs: z<number, number, "defined">;
    version: z<1, 1, "volatile-defined">;
    step: z<"welcome" | "credit" | "purpose" | "process" | "done", "welcome" | "credit" | "purpose" | "process" | "done", "volatile-defined">;
    purpose: z<"office" | "development" | "both" | null, "office" | "development" | "both" | null, "volatile">;
    process: z<"compact" | "standard" | "detailed" | null, "compact" | "standard" | "detailed" | null, "volatile">;
    completion: z<"completed" | "skipped" | "api-key" | null, "completed" | "skipped" | "api-key" | null, "volatile">;
    usage: z<"compact" | "detailed", "compact" | "detailed", "volatile-defined">;
    developerTools: z<boolean, boolean, "volatile-defined">;
}>>, "plain">;
```

| 成员 | 公开声明 |
| --- | --- |
| `version` | `version: Volatile<1>;` |
| `step` | `step: Volatile<OnboardingStep>;` |
| `purpose` | `purpose?: Volatile<OnboardingPurpose \| null \| undefined>;` |
| `process` | `process?: Volatile<OnboardingProcess \| null \| undefined>;` |
| `completion` | `completion?: Volatile<'completed' \| 'skipped' \| 'api-key' \| null \| undefined>;` |
| `usage` | `usage: Volatile<'compact' \| 'detailed'>;` |
| `developerTools` | `developerTools: Volatile<boolean>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-account.md#接入-ui-settings-account) 在真实装载路径检验成功、失败与卸载。
