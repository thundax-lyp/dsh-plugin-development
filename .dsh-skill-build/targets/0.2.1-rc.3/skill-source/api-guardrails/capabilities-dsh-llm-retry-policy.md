# dsh-llm-retry-policy 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 retry-policy 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-llm.md)；本页逐项保留对象的参数、字段和判别分支。

## AlwaysRetryPolicyConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface AlwaysRetryPolicyConfig {
    mode: 'always';
    backoff?: BackoffConfig;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`AlwaysRetryPolicyConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`backoff`、`mode`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## BackoffConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface BackoffConfig {
    initialDelayMs?: number;
    maxDelayMs?: number;
    jitterRatio?: number;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`BackoffConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`initialDelayMs`、`jitterRatio`、`maxDelayMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## NormalRetryPolicyConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface NormalRetryPolicyConfig {
    mode: 'normal';
    maxRetries?: number;
    retryableCodes?: string[];
    backoff?: BackoffConfig;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`NormalRetryPolicyConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`backoff`、`maxRetries`、`mode`、`retryableCodes`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ResolvedAlwaysRetryPolicy（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ResolvedAlwaysRetryPolicy extends ResolvedRetryBackoff {
    readonly mode: 'always';
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ResolvedAlwaysRetryPolicy`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`initialDelayMs`、`jitterRatio`、`maxDelayMs`、`mode`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ResolvedNormalRetryPolicy（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ResolvedNormalRetryPolicy extends ResolvedRetryBackoff {
    readonly mode: 'normal';
    readonly maxRetries: number;
    readonly retryableCodes: readonly string[];
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ResolvedNormalRetryPolicy`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`initialDelayMs`、`jitterRatio`、`maxDelayMs`、`maxRetries`、`mode`、`retryableCodes`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ResolvedRetryBackoff（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ResolvedRetryBackoff {
    readonly initialDelayMs: number;
    readonly maxDelayMs: number;
    readonly jitterRatio: number;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ResolvedRetryBackoff`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`initialDelayMs`、`jitterRatio`、`maxDelayMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ResolvedRetryPolicy（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ResolvedRetryPolicy = ResolvedNormalRetryPolicy | ResolvedAlwaysRetryPolicy;
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ResolvedRetryPolicy`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`initialDelayMs`、`jitterRatio`、`maxDelayMs`、`mode`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## RetryPolicyConfig（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type RetryPolicyConfig = NormalRetryPolicyConfig | AlwaysRetryPolicyConfig;
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`RetryPolicyConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`backoff`、`mode`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## RetryPolicySchema（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`RetryPolicySchema`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const RetryPolicySchema: z<RetryPolicyConfig>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## resolveRetryPolicy（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`resolveRetryPolicy`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function resolveRetryPolicy(config: RetryPolicyConfig | undefined, path: string): ResolvedRetryPolicy;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。
