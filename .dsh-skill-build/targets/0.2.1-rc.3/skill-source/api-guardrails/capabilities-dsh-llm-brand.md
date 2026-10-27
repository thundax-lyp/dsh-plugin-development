# dsh-llm-brand 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 brand 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-llm.md)；本页逐项保留对象的参数、字段和判别分支。

## LlmAttemptId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type LlmAttemptId = Branded<'LlmAttemptId'>;

export declare function LlmAttemptId(id: string): LlmAttemptId;
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmAttemptId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

同名类型与构造函数均由本包公开导出。构造函数仅把原字符串标记为相应品牌，不验证其存在性、内容或权限；类型注解使用类型空间，构造值使用值空间。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## MessageId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type MessageId = Branded<'MessageId'>;

export declare function MessageId(id: string): MessageId;
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`MessageId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

同名类型与构造函数均由本包公开导出。构造函数仅把原字符串标记为相应品牌，不验证其存在性、内容或权限；类型注解使用类型空间，构造值使用值空间。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ProviderRequestId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ProviderRequestId = Branded<'ProviderRequestId'>;

export declare function ProviderRequestId(id: string): ProviderRequestId;
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ProviderRequestId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

同名类型与构造函数均由本包公开导出。构造函数仅把原字符串标记为相应品牌，不验证其存在性、内容或权限；类型注解使用类型空间，构造值使用值空间。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ReasoningEffortId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ReasoningEffortId = Branded<'ReasoningEffortId'>;

export declare function ReasoningEffortId(id: string): ReasoningEffortId;
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ReasoningEffortId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

同名类型与构造函数均由本包公开导出。构造函数仅把原字符串标记为相应品牌，不验证其存在性、内容或权限；类型注解使用类型空间，构造值使用值空间。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ToolCallId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ToolCallId = Branded<'ToolCallId'>;

export declare function ToolCallId(id: string): ToolCallId;
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ToolCallId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

同名类型与构造函数均由本包公开导出。构造函数仅把原字符串标记为相应品牌，不验证其存在性、内容或权限；类型注解使用类型空间，构造值使用值空间。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。
