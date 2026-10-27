# ui-chat：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-chat 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## AssistantBlock client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `AssistantBlock`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [AssistantBlock 权威契约](api-client-ui-conversation-records.md#assistantblock-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `kind` | `kind: 'text';` | [AssistantBlock 权威声明](api-client-ui-conversation-records.md#assistantblock-client) |
| `kind` | `kind: 'reasoning';` | [AssistantBlock 权威声明](api-client-ui-conversation-records.md#assistantblock-client) |
| `kind` | `kind: 'image';` | [AssistantBlock 权威声明](api-client-ui-conversation-records.md#assistantblock-client) |
| `kind` | `kind: 'tool-call';` | [AssistantBlock 权威声明](api-client-ui-conversation-records.md#assistantblock-client) |
| `kind` | `kind: 'other';` | [AssistantBlock 权威声明](api-client-ui-conversation-records.md#assistantblock-client) |

## AssistantMessageNode client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `AssistantMessageNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [AssistantMessageNode 权威契约](api-client-ui-conversation-records.md#assistantmessagenode-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `blocks` | `blocks: readonly AssistantBlock[];` | [AssistantMessageNode 权威声明](api-client-ui-conversation-records.md#assistantmessagenode-client) |
| `interrupted` | `interrupted?: true;` | [AssistantMessageNode 权威声明](api-client-ui-conversation-records.md#assistantmessagenode-client) |
| `kind` | `kind: 'assistant';` | [AssistantMessageNode 权威声明](api-client-ui-conversation-records.md#assistantmessagenode-client) |
| `messageId` | `messageId?: MessageId;` | [AssistantMessageNode 权威声明](api-client-ui-conversation-records.md#assistantmessagenode-client) |
| `providerMetadata` | `providerMetadata?: AssistantProviderMetadataView;` | [AssistantMessageNode 权威声明](api-client-ui-conversation-records.md#assistantmessagenode-client) |
| `requestConfig` | `requestConfig?: AssistantRequestConfig;` | [AssistantMessageNode 权威声明](api-client-ui-conversation-records.md#assistantmessagenode-client) |
| `seq` | `seq: number;` | [AssistantMessageNode 权威声明](api-client-ui-conversation-records.md#assistantmessagenode-client) |
| `step` | `step: number;` | [AssistantMessageNode 权威声明](api-client-ui-conversation-records.md#assistantmessagenode-client) |
| `time` | `time: number;` | [AssistantMessageNode 权威声明](api-client-ui-conversation-records.md#assistantmessagenode-client) |
| `timing` | `timing?: AssistantTiming;` | [AssistantMessageNode 权威声明](api-client-ui-conversation-records.md#assistantmessagenode-client) |
| `turn` | `turn: number;` | [AssistantMessageNode 权威声明](api-client-ui-conversation-records.md#assistantmessagenode-client) |
| `usage` | `usage?: unknown;` | [AssistantMessageNode 权威声明](api-client-ui-conversation-records.md#assistantmessagenode-client) |

## AssistantProviderMetadataView client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `AssistantProviderMetadataView`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [AssistantProviderMetadataView 权威契约](api-client-ui-conversation-records.md#assistantprovidermetadataview-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `model` | `model: string;` | [AssistantProviderMetadataView 权威声明](api-client-ui-conversation-records.md#assistantprovidermetadataview-client) |

## AssistantRequestConfig client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `AssistantRequestConfig`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [AssistantRequestConfig 权威契约](api-client-ui-conversation-records.md#assistantrequestconfig-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `maxTokens` | `maxTokens?: number;` | [AssistantRequestConfig 权威声明](api-client-ui-conversation-records.md#assistantrequestconfig-client) |
| `model` | `model: string;` | [AssistantRequestConfig 权威声明](api-client-ui-conversation-records.md#assistantrequestconfig-client) |
| `provider` | `provider: string;` | [AssistantRequestConfig 权威声明](api-client-ui-conversation-records.md#assistantrequestconfig-client) |
| `purpose` | `purpose?: string;` | [AssistantRequestConfig 权威声明](api-client-ui-conversation-records.md#assistantrequestconfig-client) |
| `reasoningEffort` | `reasoningEffort?: string;` | [AssistantRequestConfig 权威声明](api-client-ui-conversation-records.md#assistantrequestconfig-client) |
| `stop` | `stop?: readonly string[];` | [AssistantRequestConfig 权威声明](api-client-ui-conversation-records.md#assistantrequestconfig-client) |
| `temperature` | `temperature?: number;` | [AssistantRequestConfig 权威声明](api-client-ui-conversation-records.md#assistantrequestconfig-client) |
| `thinking` | `thinking?: string;` | [AssistantRequestConfig 权威声明](api-client-ui-conversation-records.md#assistantrequestconfig-client) |

## AssistantTiming client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `AssistantTiming`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [AssistantTiming 权威契约](api-client-ui-conversation-records.md#assistanttiming-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `completedTime` | `completedTime: number;` | [AssistantTiming 权威声明](api-client-ui-conversation-records.md#assistanttiming-client) |
| `firstTokenTime` | `firstTokenTime: number \| null;` | [AssistantTiming 权威声明](api-client-ui-conversation-records.md#assistanttiming-client) |
| `stepStartTime` | `stepStartTime: number \| null;` | [AssistantTiming 权威声明](api-client-ui-conversation-records.md#assistanttiming-client) |

## ChatNodeDataMap client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatNodeDataMap`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatNodeDataMap {
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## CommandNode client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `CommandNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [CommandNode 权威契约](api-client-ui-conversation-records.md#commandnode-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `args` | `args: string \| null;` | [CommandNode 权威声明](api-client-ui-conversation-records.md#commandnode-client) |
| `commandId` | `commandId: CommandId;` | [CommandNode 权威声明](api-client-ui-conversation-records.md#commandnode-client) |
| `kind` | `kind: 'command';` | [CommandNode 权威声明](api-client-ui-conversation-records.md#commandnode-client) |
| `name` | `name: string \| null;` | [CommandNode 权威声明](api-client-ui-conversation-records.md#commandnode-client) |
| `outcome` | `outcome: { kind: 'success' \| 'error'; text?: string; sourceEventSeq?: number; } \| null;` | [CommandNode 权威声明](api-client-ui-conversation-records.md#commandnode-client) |
| `seq` | `seq: number;` | [CommandNode 权威声明](api-client-ui-conversation-records.md#commandnode-client) |
| `time` | `time: number;` | [CommandNode 权威声明](api-client-ui-conversation-records.md#commandnode-client) |

## CompactionSummaryNode client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `CompactionSummaryNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [CompactionSummaryNode 权威契约](api-client-ui-conversation-records.md#compactionsummarynode-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `kind` | `kind: 'compaction';` | [CompactionSummaryNode 权威声明](api-client-ui-conversation-records.md#compactionsummarynode-client) |
| `seq` | `seq: number;` | [CompactionSummaryNode 权威声明](api-client-ui-conversation-records.md#compactionsummarynode-client) |
| `shadowedItemCount` | `shadowedItemCount: number \| null;` | [CompactionSummaryNode 权威声明](api-client-ui-conversation-records.md#compactionsummarynode-client) |
| `shadowedTokenCount` | `shadowedTokenCount: number \| null;` | [CompactionSummaryNode 权威声明](api-client-ui-conversation-records.md#compactionsummarynode-client) |
| `summaryEventSeq` | `summaryEventSeq: number \| null;` | [CompactionSummaryNode 权威声明](api-client-ui-conversation-records.md#compactionsummarynode-client) |
| `time` | `time: number;` | [CompactionSummaryNode 权威声明](api-client-ui-conversation-records.md#compactionsummarynode-client) |

## ContextMessageNode client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ContextMessageNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ContextMessageNode 权威契约](api-client-ui-conversation-records.md#contextmessagenode-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `content` | `content: readonly ContentBlock[];` | [ContextMessageNode 权威声明](api-client-ui-conversation-records.md#contextmessagenode-client) |
| `form` | `form: KnownContextForm \| null;` | [ContextMessageNode 权威声明](api-client-ui-conversation-records.md#contextmessagenode-client) |
| `kind` | `kind: 'context';` | [ContextMessageNode 权威声明](api-client-ui-conversation-records.md#contextmessagenode-client) |
| `producer` | `producer: ContextProducerView;` | [ContextMessageNode 权威声明](api-client-ui-conversation-records.md#contextmessagenode-client) |
| `seq` | `seq: number;` | [ContextMessageNode 权威声明](api-client-ui-conversation-records.md#contextmessagenode-client) |
| `source` | `source: unknown;` | [ContextMessageNode 权威声明](api-client-ui-conversation-records.md#contextmessagenode-client) |
| `time` | `time: number;` | [ContextMessageNode 权威声明](api-client-ui-conversation-records.md#contextmessagenode-client) |

## ContextProducerView client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ContextProducerView`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ContextProducerView 权威契约](api-client-ui-conversation-context-producer.md#contextproducerview-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `label` | `label: string \| null;` | [ContextProducerView 权威声明](api-client-ui-conversation-context-producer.md#contextproducerview-client) |
| `role` | `role: ContextRole;` | [ContextProducerView 权威声明](api-client-ui-conversation-context-producer.md#contextproducerview-client) |

## ContextRole client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ContextRole`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ContextRole 权威契约](api-client-ui-conversation-context-producer.md#contextrole-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## ConversationNode client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ConversationNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ConversationNode 权威契约](api-client-ui-conversation-records.md#conversationnode-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `kind` | `kind: 'assistant';` | [AssistantMessageNode 权威声明](api-client-ui-conversation-records.md#assistantmessagenode-client) |
| `kind` | `kind: 'command';` | [CommandNode 权威声明](api-client-ui-conversation-records.md#commandnode-client) |
| `kind` | `kind: 'compaction';` | [CompactionSummaryNode 权威声明](api-client-ui-conversation-records.md#compactionsummarynode-client) |
| `kind` | `kind: 'context';` | [ContextMessageNode 权威声明](api-client-ui-conversation-records.md#contextmessagenode-client) |
| `kind` | `kind: 'user';` | [UserMessageNode 权威声明](api-client-ui-conversation-records.md#usermessagenode-client) |
| `kind` | `kind: 'steering';` | [SteeringMessageNode 权威声明](api-client-ui-conversation-records.md#steeringmessagenode-client) |
| `kind` | `kind: 'model-retry';` | [ModelRetryNode 权威声明](api-client-ui-conversation-records.md#modelretrynode-client) |
| `kind` | `kind: 'turn-error';` | [TurnErrorNode 权威声明](api-client-ui-conversation-records.md#turnerrornode-client) |
| `kind` | `kind: 'turn-max-tokens';` | [TurnMaxTokensNode 权威声明](api-client-ui-conversation-records.md#turnmaxtokensnode-client) |
| `kind` | `kind: 'tool-result';` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `kind` | `kind: 'unknown';` | [UnknownSurfaceNode 权威声明](api-client-ui-conversation-records.md#unknownsurfacenode-client) |
| `seq` | `seq: number;` | [AssistantMessageNode 权威声明](api-client-ui-conversation-records.md#assistantmessagenode-client) |
| `seq` | `seq: number;` | [CommandNode 权威声明](api-client-ui-conversation-records.md#commandnode-client) |
| `seq` | `seq: number;` | [CompactionSummaryNode 权威声明](api-client-ui-conversation-records.md#compactionsummarynode-client) |
| `seq` | `seq: number;` | [ContextMessageNode 权威声明](api-client-ui-conversation-records.md#contextmessagenode-client) |
| `seq` | `seq: number;` | [UserMessageNode 权威声明](api-client-ui-conversation-records.md#usermessagenode-client) |
| `seq` | `seq: number;` | [SteeringMessageNode 权威声明](api-client-ui-conversation-records.md#steeringmessagenode-client) |
| `seq` | `seq: number;` | [ModelRetryNode 权威声明](api-client-ui-conversation-records.md#modelretrynode-client) |
| `seq` | `seq: number;` | [TurnErrorNode 权威声明](api-client-ui-conversation-records.md#turnerrornode-client) |
| `seq` | `seq: number;` | [TurnMaxTokensNode 权威声明](api-client-ui-conversation-records.md#turnmaxtokensnode-client) |
| `seq` | `seq: number;` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `seq` | `seq: number;` | [UnknownSurfaceNode 权威声明](api-client-ui-conversation-records.md#unknownsurfacenode-client) |
| `time` | `time: number;` | [AssistantMessageNode 权威声明](api-client-ui-conversation-records.md#assistantmessagenode-client) |
| `time` | `time: number;` | [CommandNode 权威声明](api-client-ui-conversation-records.md#commandnode-client) |
| `time` | `time: number;` | [CompactionSummaryNode 权威声明](api-client-ui-conversation-records.md#compactionsummarynode-client) |
| `time` | `time: number;` | [ContextMessageNode 权威声明](api-client-ui-conversation-records.md#contextmessagenode-client) |
| `time` | `time: number;` | [UserMessageNode 权威声明](api-client-ui-conversation-records.md#usermessagenode-client) |
| `time` | `time: number;` | [SteeringMessageNode 权威声明](api-client-ui-conversation-records.md#steeringmessagenode-client) |
| `time` | `time: number;` | [ModelRetryNode 权威声明](api-client-ui-conversation-records.md#modelretrynode-client) |
| `time` | `time: number;` | [TurnErrorNode 权威声明](api-client-ui-conversation-records.md#turnerrornode-client) |
| `time` | `time: number;` | [TurnMaxTokensNode 权威声明](api-client-ui-conversation-records.md#turnmaxtokensnode-client) |
| `time` | `time: number;` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `time` | `time: number;` | [UnknownSurfaceNode 权威声明](api-client-ui-conversation-records.md#unknownsurfacenode-client) |

## ConversationPromptSnapshot client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ConversationPromptSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ConversationPromptSnapshot 权威契约](api-client-ui-conversation-request-inspection.md#conversationpromptsnapshot-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `config` | `config: AssistantRequestConfig;` | [ConversationPromptSnapshot 权威声明](api-client-ui-conversation-request-inspection.md#conversationpromptsnapshot-client) |
| `system` | `system: string;` | [ConversationPromptSnapshot 权威声明](api-client-ui-conversation-request-inspection.md#conversationpromptsnapshot-client) |
| `tools` | `tools: readonly ToolSchema[];` | [ConversationPromptSnapshot 权威声明](api-client-ui-conversation-request-inspection.md#conversationpromptsnapshot-client) |

## KnownContextForm client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `KnownContextForm`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [KnownContextForm 权威契约](api-client-ui-conversation-context-producer.md#knowncontextform-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## ModelRetryNode client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ModelRetryNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ModelRetryNode 权威契约](api-client-ui-conversation-records.md#modelretrynode-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `kind` | `kind: 'model-retry';` | [ModelRetryNode 权威声明](api-client-ui-conversation-records.md#modelretrynode-client) |
| `retryState` | `retryState: 'scheduled' \| 'started' \| 'cancelled';` | [ModelRetryNode 权威声明](api-client-ui-conversation-records.md#modelretrynode-client) |
| `seq` | `seq: number;` | [ModelRetryNode 权威声明](api-client-ui-conversation-records.md#modelretrynode-client) |
| `time` | `time: number;` | [ModelRetryNode 权威声明](api-client-ui-conversation-records.md#modelretrynode-client) |

## PartialAssistant client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `PartialAssistant`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [PartialAssistant 权威契约](api-client-ui-conversation-records.md#partialassistant-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `blocks` | `blocks: readonly AssistantBlock[];` | [PartialAssistant 权威声明](api-client-ui-conversation-records.md#partialassistant-client) |
| `step` | `step: number;` | [PartialAssistant 权威声明](api-client-ui-conversation-records.md#partialassistant-client) |
| `turn` | `turn: number;` | [PartialAssistant 权威声明](api-client-ui-conversation-records.md#partialassistant-client) |

## PreparingToolCall client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `PreparingToolCall`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [PreparingToolCall 权威契约](api-client-ui-conversation-records.md#preparingtoolcall-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `args` | `args: ToolArgs;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `callId` | `callId: string;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `name` | `name: string;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `parentCallId` | `parentCallId?: string;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `phase` | `readonly phase: 'preparing';` | [PreparingToolCall 权威声明](api-client-ui-conversation-records.md#preparingtoolcall-client) |
| `step` | `step: number;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `subCalls` | `subCalls: readonly ToolCallBlock[];` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `time` | `time: number;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `turn` | `turn: number;` | 来自 `ToolCallHead` 的公开继承或联合分支 |

## RequestInspectionSnapshot client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `RequestInspectionSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [RequestInspectionSnapshot 权威契约](api-client-ui-conversation-request-inspection.md#requestinspectionsnapshot-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `callSchemas` | `callSchemas: ReadonlyMap<string, ToolSchema>;` | [RequestInspectionSnapshot 权威声明](api-client-ui-conversation-request-inspection.md#requestinspectionsnapshot-client) |
| `requests` | `requests: readonly RequestView[];` | [RequestInspectionSnapshot 权威声明](api-client-ui-conversation-request-inspection.md#requestinspectionsnapshot-client) |

## RequestPromptChange client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `RequestPromptChange`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [RequestPromptChange 权威契约](api-client-ui-conversation-request-inspection.md#requestpromptchange-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `kind` | `kind: 'initial' \| 'system' \| 'tools' \| 'system-and-tools';` | [RequestPromptChange 权威声明](api-client-ui-conversation-request-inspection.md#requestpromptchange-client) |
| `previous` | `previous?: ConversationPromptSnapshot;` | [RequestPromptChange 权威声明](api-client-ui-conversation-request-inspection.md#requestpromptchange-client) |
| `seq` | `seq: number;` | [RequestPromptChange 权威声明](api-client-ui-conversation-request-inspection.md#requestpromptchange-client) |
| `time` | `time: number;` | [RequestPromptChange 权威声明](api-client-ui-conversation-request-inspection.md#requestpromptchange-client) |

## RequestView client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `RequestView`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [RequestView 权威契约](api-client-ui-conversation-request-inspection.md#requestview-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `completedAt` | `completedAt: number \| null;` | 来自 `RequestViewBase` 的公开继承或联合分支 |
| `error` | `error?: string;` | 来自 `RequestViewBase` 的公开继承或联合分支 |
| `errorCode` | `errorCode?: string;` | 来自 `RequestViewBase` 的公开继承或联合分支 |
| `providerMetadata` | `providerMetadata?: AssistantProviderMetadataView;` | 来自 `RequestViewBase` 的公开继承或联合分支 |
| `purpose` | `purpose: 'assistant';` | 来自 `AssistantRequestView` 的公开继承或联合分支 |
| `purpose` | `purpose: 'compaction';` | 来自 `CompactionRequestView` 的公开继承或联合分支 |
| `requestConfig` | `requestConfig?: AssistantRequestConfig;` | 来自 `RequestViewBase` 的公开继承或联合分支 |
| `resultSeq` | `resultSeq?: number;` | 来自 `RequestViewBase` 的公开继承或联合分支 |
| `startSeq` | `startSeq: number;` | 来自 `RequestViewBase` 的公开继承或联合分支 |
| `startedAt` | `startedAt: number;` | 来自 `RequestViewBase` 的公开继承或联合分支 |
| `status` | `status: 'running' \| 'complete' \| 'error';` | 来自 `RequestViewBase` 的公开继承或联合分支 |
| `step` | `step: number;` | 来自 `AssistantRequestView` 的公开继承或联合分支 |
| `step` | `step: 0;` | 来自 `CompactionRequestView` 的公开继承或联合分支 |
| `turn` | `turn: number;` | 来自 `AssistantRequestView` 的公开继承或联合分支 |
| `turn` | `turn: number \| null;` | 来自 `CompactionRequestView` 的公开继承或联合分支 |
| `usage` | `usage?: unknown;` | 来自 `RequestViewBase` 的公开继承或联合分支 |

## RunningToolCall client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `RunningToolCall`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [RunningToolCall 权威契约](api-client-ui-conversation-records.md#runningtoolcall-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `args` | `args: ToolArgs;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `callId` | `callId: string;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `name` | `name: string;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `parentCallId` | `parentCallId?: string;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `phase` | `readonly phase: 'preparing';` | [PreparingToolCall 权威声明](api-client-ui-conversation-records.md#preparingtoolcall-client) |
| `phase` | `readonly phase: 'start';` | [StartedToolCall 权威声明](api-client-ui-conversation-records.md#startedtoolcall-client) |
| `step` | `step: number;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `subCalls` | `subCalls: readonly ToolCallBlock[];` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `time` | `time: number;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `turn` | `turn: number;` | 来自 `ToolCallHead` 的公开继承或联合分支 |

## StartedToolCall client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `StartedToolCall`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [StartedToolCall 权威契约](api-client-ui-conversation-records.md#startedtoolcall-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `args` | `args: ToolArgs;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `argsRaw` | `readonly argsRaw: string;` | [StartedToolCall 权威声明](api-client-ui-conversation-records.md#startedtoolcall-client) |
| `callId` | `callId: string;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `name` | `name: string;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `parentCallId` | `parentCallId?: string;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `phase` | `readonly phase: 'start';` | [StartedToolCall 权威声明](api-client-ui-conversation-records.md#startedtoolcall-client) |
| `step` | `step: number;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `subCalls` | `subCalls: readonly ToolCallBlock[];` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `time` | `time: number;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `turn` | `turn: number;` | 来自 `ToolCallHead` 的公开继承或联合分支 |

## SteeringMessageNode client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `SteeringMessageNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [SteeringMessageNode 权威契约](api-client-ui-conversation-records.md#steeringmessagenode-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `content` | `content: readonly ContentBlock[];` | [SteeringMessageNode 权威声明](api-client-ui-conversation-records.md#steeringmessagenode-client) |
| `kind` | `kind: 'steering';` | [SteeringMessageNode 权威声明](api-client-ui-conversation-records.md#steeringmessagenode-client) |
| `messageId` | `messageId: MessageId;` | [SteeringMessageNode 权威声明](api-client-ui-conversation-records.md#steeringmessagenode-client) |
| `seq` | `seq: number;` | [SteeringMessageNode 权威声明](api-client-ui-conversation-records.md#steeringmessagenode-client) |
| `source` | `source: unknown;` | [SteeringMessageNode 权威声明](api-client-ui-conversation-records.md#steeringmessagenode-client) |
| `time` | `time: number;` | [SteeringMessageNode 权威声明](api-client-ui-conversation-records.md#steeringmessagenode-client) |

## ToolArgs client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ToolArgs`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ToolArgs 权威契约](api-client-ui-conversation-records.md#toolargs-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## ToolCallBlock client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ToolCallBlock`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ToolCallBlock 权威契约](api-client-ui-conversation-records.md#toolcallblock-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `args` | `args: ToolArgs;` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `args` | `args: ToolArgs;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `callId` | `callId: string;` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `callId` | `callId: string;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `name` | `name: string;` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `name` | `name: string;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `parentCallId` | `parentCallId?: string;` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `parentCallId` | `parentCallId?: string;` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `subCalls` | `subCalls: readonly ToolCallBlock[];` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `subCalls` | `subCalls: readonly ToolCallBlock[];` | 来自 `ToolCallHead` 的公开继承或联合分支 |
| `time` | `time: number;` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `time` | `time: number;` | 来自 `ToolCallHead` 的公开继承或联合分支 |

## ToolResultNode client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ToolResultNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ToolResultNode 权威契约](api-client-ui-conversation-records.md#toolresultnode-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `args` | `args: ToolArgs;` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `call` | `call: { name: string; argsRaw: string; } \| null;` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `callId` | `callId: string;` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `callTime` | `callTime: number \| null;` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `content` | `content: readonly ContentBlock[];` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `error` | `error?: { name: string; code: string; reason?: string; };` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `isError` | `isError: boolean;` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `kind` | `kind: 'tool-result';` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `meta` | `meta?: unknown;` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `name` | `name: string;` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `parentCallId` | `parentCallId?: string;` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `seq` | `seq: number;` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `subCalls` | `subCalls: readonly ToolCallBlock[];` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |
| `time` | `time: number;` | [ToolResultNode 权威声明](api-client-ui-conversation-records.md#toolresultnode-client) |

## TurnErrorNode client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `TurnErrorNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [TurnErrorNode 权威契约](api-client-ui-conversation-records.md#turnerrornode-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `code` | `code?: string;` | [TurnErrorNode 权威声明](api-client-ui-conversation-records.md#turnerrornode-client) |
| `kind` | `kind: 'turn-error';` | [TurnErrorNode 权威声明](api-client-ui-conversation-records.md#turnerrornode-client) |
| `message` | `message: string;` | [TurnErrorNode 权威声明](api-client-ui-conversation-records.md#turnerrornode-client) |
| `seq` | `seq: number;` | [TurnErrorNode 权威声明](api-client-ui-conversation-records.md#turnerrornode-client) |
| `step` | `step: number;` | [TurnErrorNode 权威声明](api-client-ui-conversation-records.md#turnerrornode-client) |
| `time` | `time: number;` | [TurnErrorNode 权威声明](api-client-ui-conversation-records.md#turnerrornode-client) |

## TurnMaxTokensNode client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `TurnMaxTokensNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [TurnMaxTokensNode 权威契约](api-client-ui-conversation-records.md#turnmaxtokensnode-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `kind` | `kind: 'turn-max-tokens';` | [TurnMaxTokensNode 权威声明](api-client-ui-conversation-records.md#turnmaxtokensnode-client) |
| `seq` | `seq: number;` | [TurnMaxTokensNode 权威声明](api-client-ui-conversation-records.md#turnmaxtokensnode-client) |
| `step` | `step: number;` | [TurnMaxTokensNode 权威声明](api-client-ui-conversation-records.md#turnmaxtokensnode-client) |
| `time` | `time: number;` | [TurnMaxTokensNode 权威声明](api-client-ui-conversation-records.md#turnmaxtokensnode-client) |

## UnknownSurfaceNode client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `UnknownSurfaceNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [UnknownSurfaceNode 权威契约](api-client-ui-conversation-records.md#unknownsurfacenode-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `data` | `data: unknown;` | [UnknownSurfaceNode 权威声明](api-client-ui-conversation-records.md#unknownsurfacenode-client) |
| `kind` | `kind: 'unknown';` | [UnknownSurfaceNode 权威声明](api-client-ui-conversation-records.md#unknownsurfacenode-client) |
| `seq` | `seq: number;` | [UnknownSurfaceNode 权威声明](api-client-ui-conversation-records.md#unknownsurfacenode-client) |
| `time` | `time: number;` | [UnknownSurfaceNode 权威声明](api-client-ui-conversation-records.md#unknownsurfacenode-client) |
| `type` | `type: string;` | [UnknownSurfaceNode 权威声明](api-client-ui-conversation-records.md#unknownsurfacenode-client) |

## UserMessageNode client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `UserMessageNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [UserMessageNode 权威契约](api-client-ui-conversation-records.md#usermessagenode-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `content` | `content: readonly ContentBlock[];` | [UserMessageNode 权威声明](api-client-ui-conversation-records.md#usermessagenode-client) |
| `kind` | `kind: 'user';` | [UserMessageNode 权威声明](api-client-ui-conversation-records.md#usermessagenode-client) |
| `seq` | `seq: number;` | [UserMessageNode 权威声明](api-client-ui-conversation-records.md#usermessagenode-client) |
| `source` | `source: unknown;` | [UserMessageNode 权威声明](api-client-ui-conversation-records.md#usermessagenode-client) |
| `time` | `time: number;` | [UserMessageNode 权威声明](api-client-ui-conversation-records.md#usermessagenode-client) |

## Config root

入口 `@deepseek-ai/dsh-client-ui-chat`，公开符号 `Config`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface Config {
    transcriptView: Volatile<ChatSettings['transcriptView']>;
    collapseTiming: Volatile<CollapseTiming>;
    performanceUsage: Volatile<PerformanceUsageMode>;
    linkOpening: Volatile<LinkOpening>;
}

export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    transcriptView: z<"compact" | "standard" | "detailed" | "verbose" | "normal" | "expanded", "compact" | "standard" | "detailed" | "verbose" | "normal" | "expanded", "volatile">;
    collapseTiming: z<"completion" | "next-input", "completion" | "next-input", "volatile-defined">;
    performanceUsage: z<"compact" | "detailed", "compact" | "detailed", "volatile-defined">;
    linkOpening: z<"sidebar" | "new-tab", "sidebar" | "new-tab", "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    transcriptView: z<"compact" | "standard" | "detailed" | "verbose" | "normal" | "expanded", "compact" | "standard" | "detailed" | "verbose" | "normal" | "expanded", "volatile">;
    collapseTiming: z<"completion" | "next-input", "completion" | "next-input", "volatile-defined">;
    performanceUsage: z<"compact" | "detailed", "compact" | "detailed", "volatile-defined">;
    linkOpening: z<"sidebar" | "new-tab", "sidebar" | "new-tab", "volatile-defined">;
}>>, "plain">;
```

| 成员 | 公开声明 |
| --- | --- |
| `transcriptView` | `transcriptView: Volatile<ChatSettings['transcriptView']>;` |
| `collapseTiming` | `collapseTiming: Volatile<CollapseTiming>;` |
| `performanceUsage` | `performanceUsage: Volatile<PerformanceUsageMode>;` |
| `linkOpening` | `linkOpening: Volatile<LinkOpening>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。
