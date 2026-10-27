# dsh-llm-deepseek-config 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 config 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-llm-deepseek.md)；本页逐项保留对象的参数、字段和判别分支。

## Config（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

公开声明（保留类型空间与值空间）：

```text
export interface Config {
    baseURL: Volatile<string | undefined>;
    thinking: Volatile<'enabled' | 'disabled' | undefined>;
    reasoningEffort: Volatile<'off' | 'low' | 'high' | 'max' | undefined>;
    maxTokens: Volatile<number>;
    defaultContextWindow: Volatile<number>;
    models: Volatile<DeepSeekCatalogModel[]>;
    streamIdleTimeoutMs: Volatile<number>;
    maxRequestFilesBytes: Volatile<number>;
    maxInlineRequestImageBytes: Volatile<number>;
    maxImagesPerRequest: Volatile<number>;
    imageOffloadByteQuantum: Volatile<number>;
    inlineImageOffloadByteQuantum: Volatile<number>;
    imageOffloadCountQuantum: Volatile<number>;
    filesApiTimeoutMs: Volatile<number>;
    fileExpiresAfterSeconds: Volatile<number>;
    fileRefreshMarginSeconds: Volatile<number>;
    fileQuotaCleanupBatch: Volatile<number>;
    retryPolicy: Volatile<RetryPolicyConfig | undefined>;
}

export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    baseURL: z<string, string, "volatile">;
    thinking: z<"enabled" | "disabled", "enabled" | "disabled", "volatile">;
    reasoningEffort: z<"low" | "off" | "high" | "max", "low" | "off" | "high" | "max", "volatile">;
    maxTokens: z<number, number, "volatile-defined">;
    defaultContextWindow: z<number, number, "volatile-defined">;
    models: z<NoInfer<DeepSeekCatalogModel[]>, NoInfer<DeepSeekCatalogModel[]>, "volatile-defined">;
    streamIdleTimeoutMs: z<number, number, "volatile-defined">;
    maxRequestFilesBytes: z<number, number, "volatile-defined">;
    maxInlineRequestImageBytes: z<number, number, "volatile-defined">;
    maxImagesPerRequest: z<number, number, "volatile-defined">;
    imageOffloadByteQuantum: z<number, number, "volatile-defined">;
    inlineImageOffloadByteQuantum: z<number, number, "volatile-defined">;
    imageOffloadCountQuantum: z<number, number, "volatile-defined">;
    filesApiTimeoutMs: z<number, number, "volatile-defined">;
    fileExpiresAfterSeconds: z<number, number, "volatile-defined">;
    fileRefreshMarginSeconds: z<number, number, "volatile-defined">;
    fileQuotaCleanupBatch: z<number, number, "volatile-defined">;
    retryPolicy: z<NoInfer<RetryPolicyConfig>, NoInfer<RetryPolicyConfig>, "volatile">;
}>>, Schemastery.ObjectT<NoInfer<{
    baseURL: z<string, string, "volatile">;
    thinking: z<"enabled" | "disabled", "enabled" | "disabled", "volatile">;
    reasoningEffort: z<"low" | "off" | "high" | "max", "low" | "off" | "high" | "max", "volatile">;
    maxTokens: z<number, number, "volatile-defined">;
    defaultContextWindow: z<number, number, "volatile-defined">;
    models: z<NoInfer<DeepSeekCatalogModel[]>, NoInfer<DeepSeekCatalogModel[]>, "volatile-defined">;
    streamIdleTimeoutMs: z<number, number, "volatile-defined">;
    maxRequestFilesBytes: z<number, number, "volatile-defined">;
    maxInlineRequestImageBytes: z<number, number, "volatile-defined">;
    maxImagesPerRequest: z<number, number, "volatile-defined">;
    imageOffloadByteQuantum: z<number, number, "volatile-defined">;
    inlineImageOffloadByteQuantum: z<number, number, "volatile-defined">;
    imageOffloadCountQuantum: z<number, number, "volatile-defined">;
    filesApiTimeoutMs: z<number, number, "volatile-defined">;
    fileExpiresAfterSeconds: z<number, number, "volatile-defined">;
    fileRefreshMarginSeconds: z<number, number, "volatile-defined">;
    fileQuotaCleanupBatch: z<number, number, "volatile-defined">;
    retryPolicy: z<NoInfer<RetryPolicyConfig>, NoInfer<RetryPolicyConfig>, "volatile">;
}>>, "plain">;
```

同名导出同时提供类型与运行时值；使用 `import type` 引入配置类型，使用普通 `import` 引入运行时 schema，不能当作文本常量。

| 成员 | 公开类型 |
| --- | --- |
| `baseURL` | `baseURL: Volatile<string &#124; undefined>;` |
| `defaultContextWindow` | `defaultContextWindow: Volatile<number>;` |
| `fileExpiresAfterSeconds` | `fileExpiresAfterSeconds: Volatile<number>;` |
| `fileQuotaCleanupBatch` | `fileQuotaCleanupBatch: Volatile<number>;` |
| `fileRefreshMarginSeconds` | `fileRefreshMarginSeconds: Volatile<number>;` |
| `filesApiTimeoutMs` | `filesApiTimeoutMs: Volatile<number>;` |
| `imageOffloadByteQuantum` | `imageOffloadByteQuantum: Volatile<number>;` |
| `imageOffloadCountQuantum` | `imageOffloadCountQuantum: Volatile<number>;` |
| `inlineImageOffloadByteQuantum` | `inlineImageOffloadByteQuantum: Volatile<number>;` |
| `maxImagesPerRequest` | `maxImagesPerRequest: Volatile<number>;` |
| `maxInlineRequestImageBytes` | `maxInlineRequestImageBytes: Volatile<number>;` |
| `maxRequestFilesBytes` | `maxRequestFilesBytes: Volatile<number>;` |
| `maxTokens` | `maxTokens: Volatile<number>;` |
| `models` | `models: Volatile<DeepSeekCatalogModel[]>;` |
| `reasoningEffort` | `reasoningEffort: Volatile<'off' &#124; 'low' &#124; 'high' &#124; 'max' &#124; undefined>;` |
| `retryPolicy` | `retryPolicy: Volatile<RetryPolicyConfig &#124; undefined>;` |
| `streamIdleTimeoutMs` | `streamIdleTimeoutMs: Volatile<number>;` |
| `thinking` | `thinking: Volatile<'enabled' &#124; 'disabled' &#124; undefined>;` |

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## Options（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type Options = {
    [K in keyof Config]?: Config[K] extends Volatile<infer T> ? Exclude<T, undefined> : never;
};
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`Options`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`baseURL`、`defaultContextWindow`、`fileExpiresAfterSeconds`、`fileQuotaCleanupBatch`、`fileRefreshMarginSeconds`、`filesApiTimeoutMs`、`imageOffloadByteQuantum`、`imageOffloadCountQuantum`、`inlineImageOffloadByteQuantum`、`maxImagesPerRequest`、`maxInlineRequestImageBytes`、`maxRequestFilesBytes`、`maxTokens`、`models`、`reasoningEffort`、`retryPolicy`、`streamIdleTimeoutMs`、`thinking`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## PUBLIC_BASE_URL（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`PUBLIC_BASE_URL`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const PUBLIC_BASE_URL = "https://api.deepseek.com/anthropic";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## ResolvedDeepSeekOptions（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ResolvedDeepSeekOptions = DeepSeekConnectionOptions;
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`ResolvedDeepSeekOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## catalogModelFields（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`catalogModelFields`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const catalogModelFields: {
    name: z<string, string, "plain">;
    description: z<string, string, "plain">;
    contextWindow: z<number, number, "plain">;
    maxTokens: z<number, number, "plain">;
    imagePixelBudget: z<number | "low", number | "low", "plain">;
    imageMaxBytes: z<number, number, "plain">;
    systemPromptUpdate: z<"in-history", "in-history", "plain">;
    toolUpdate: z<"in-history" | "addition-only", "in-history" | "addition-only", "plain">;
};
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## deepSeekConfigFields（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`deepSeekConfigFields`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

公开声明（保留类型空间与值空间）：

```text
export declare const deepSeekConfigFields: {
    baseURL: z<string, string, "volatile">;
    thinking: z<"enabled" | "disabled", "enabled" | "disabled", "volatile">;
    reasoningEffort: z<"low" | "off" | "high" | "max", "low" | "off" | "high" | "max", "volatile">;
    maxTokens: z<number, number, "volatile-defined">;
    defaultContextWindow: z<number, number, "volatile-defined">;
    models: z<NoInfer<DeepSeekCatalogModel[]>, NoInfer<DeepSeekCatalogModel[]>, "volatile-defined">;
    streamIdleTimeoutMs: z<number, number, "volatile-defined">;
    maxRequestFilesBytes: z<number, number, "volatile-defined">;
    maxInlineRequestImageBytes: z<number, number, "volatile-defined">;
    maxImagesPerRequest: z<number, number, "volatile-defined">;
    imageOffloadByteQuantum: z<number, number, "volatile-defined">;
    inlineImageOffloadByteQuantum: z<number, number, "volatile-defined">;
    imageOffloadCountQuantum: z<number, number, "volatile-defined">;
    filesApiTimeoutMs: z<number, number, "volatile-defined">;
    fileExpiresAfterSeconds: z<number, number, "volatile-defined">;
    fileRefreshMarginSeconds: z<number, number, "volatile-defined">;
    fileQuotaCleanupBatch: z<number, number, "volatile-defined">;
    retryPolicy: z<NoInfer<RetryPolicyConfig>, NoInfer<RetryPolicyConfig>, "volatile">;
};
```

这是上方声明的公开对象；按实际类型使用，不把它当作文本常量。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## isBuiltInCatalog（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`isBuiltInCatalog`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function isBuiltInCatalog(models: readonly DeepSeekCatalogModel[]): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## plainOptions（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`plainOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function plainOptions(config: Config): Options;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## resolveAdapterOptions（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`resolveAdapterOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function resolveAdapterOptions(config: Options, environment?: LaunchEnvironmentSnapshot): ResolvedDeepSeekOptions;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。
