# dsh-llm-deepseek-listing-config 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 listing-config 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-llm-deepseek.md)；本页逐项保留对象的参数、字段和判别分支。

## DEFAULT_MODELS_MAX_AGE_MS（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`DEFAULT_MODELS_MAX_AGE_MS`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_MODELS_MAX_AGE_MS = 600000;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## DEFAULT_MODELS_TIMEOUT_MS（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`DEFAULT_MODELS_TIMEOUT_MS`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_MODELS_TIMEOUT_MS = 5000;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## ListingSettings（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ListingSettings extends ListingTiming {
    readonly url: string;
}
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`ListingSettings`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`maxAgeMs`、`timeoutMs`、`url`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## ListingTiming（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ListingTiming {
    readonly timeoutMs: number;
    readonly maxAgeMs: number;
}
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`ListingTiming`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`maxAgeMs`、`timeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## ModelListingConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ModelListingConfig {
    modelsTimeoutMs: Volatile<number>;
    modelsMaxAgeMs: Volatile<number>;
}
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`ModelListingConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`modelsMaxAgeMs`、`modelsTimeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## ModelListingOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ModelListingOptions {
    modelsTimeoutMs?: number;
    modelsMaxAgeMs?: number;
}
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`ModelListingOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`modelsMaxAgeMs`、`modelsTimeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## modelListingConfigFields（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`modelListingConfigFields`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const modelListingConfigFields: {
    modelsTimeoutMs: z<number, number, "volatile-defined">;
    modelsMaxAgeMs: z<number, number, "volatile-defined">;
};
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## resolveListingTiming（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`resolveListingTiming`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function resolveListingTiming(options: ModelListingOptions, owner: string): ListingTiming;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。
