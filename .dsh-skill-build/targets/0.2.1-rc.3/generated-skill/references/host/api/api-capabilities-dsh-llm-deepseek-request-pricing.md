# dsh-llm-deepseek-request-pricing 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 request-pricing 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-llm-deepseek.md)；本页逐项保留对象的参数、字段和判别分支。

## DEFAULT_LOW_DETAIL_IMAGE_PIXEL_BUDGET（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`DEFAULT_LOW_DETAIL_IMAGE_PIXEL_BUDGET`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_LOW_DETAIL_IMAGE_PIXEL_BUDGET: number;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## DEFAULT_MAX_IMAGES_PER_REQUEST（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`DEFAULT_MAX_IMAGES_PER_REQUEST`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_MAX_IMAGES_PER_REQUEST = 600;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## DEFAULT_MAX_REQUEST_FILES_BYTES（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`DEFAULT_MAX_REQUEST_FILES_BYTES`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_MAX_REQUEST_FILES_BYTES: number;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## DEFAULT_REQUEST_IMAGE_MAX_BYTES（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`DEFAULT_REQUEST_IMAGE_MAX_BYTES`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_REQUEST_IMAGE_MAX_BYTES: number;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## REQUEST_IMAGE_MAX_DIMENSION（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`REQUEST_IMAGE_MAX_DIMENSION`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const REQUEST_IMAGE_MAX_DIMENSION = 4096;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## deepSeekImageRequestPricing（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`deepSeekImageRequestPricing`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function deepSeekImageRequestPricing(connection: DeepSeekConnectionOptions, model: string, resolveAccess?: ImageAttachmentAccessResolver): LlmImageRequestPricing;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## resolveRequestImageMaxBytes（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`resolveRequestImageMaxBytes`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function resolveRequestImageMaxBytes(model: DeepSeekCatalogModel): number;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## resolveRequestImageTarget（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`resolveRequestImageTarget`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function resolveRequestImageTarget(model: DeepSeekCatalogModel, source: Pick<ImageAttachmentRef, 'width' | 'height'>): ImageRequestTarget;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。
