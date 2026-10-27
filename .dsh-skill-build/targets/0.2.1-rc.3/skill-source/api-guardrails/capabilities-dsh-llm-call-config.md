# dsh-llm-call-config 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 call-config 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-llm.md)；本页逐项保留对象的参数、字段和判别分支。

## ConfigureCall（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ConfigureCall = (controls: Readonly<LlmCallControls>, model: Readonly<LlmResolvedModelInfo>) => LlmCallControls;
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ConfigureCall`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmCallConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmCallConfig extends LlmCallControls {
    provider: string;
    model: string;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmCallConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`maxTokens`、`model`、`provider`、`reasoningEffort`、`stop`、`temperature`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmCallConfigAdapterDefaults（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmCallConfigAdapterDefaults {
    reasoningEffort?: true;
    maxTokens?: true;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmCallConfigAdapterDefaults`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`maxTokens`、`reasoningEffort`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmCallControls（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmCallControls {
    reasoningEffort?: ReasoningEffortId;
    temperature?: number;
    maxTokens?: number;
    stop?: string[];
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmCallControls`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`maxTokens`、`reasoningEffort`、`stop`、`temperature`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## callConfigEquals（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`callConfigEquals`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function callConfigEquals(a: LlmCallConfig, b: LlmCallConfig): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## isAgentLoopRequest（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`isAgentLoopRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function isAgentLoopRequest(request: GenerateOptions): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## markAgentLoopRequest（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`markAgentLoopRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function markAgentLoopRequest<T extends GenerateOptions>(request: T): T;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。
