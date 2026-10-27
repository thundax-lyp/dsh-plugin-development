# ui-chat：chat-nodes 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-chat 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## AssistantChatData client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `AssistantChatData`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface AssistantChatData {
    readonly status: 'running' | 'settled' | 'interrupted';
    readonly turn: number;
    readonly step: number;
    readonly blocks: readonly AssistantBlock[];
    readonly time: number;
    readonly usage?: unknown;
    readonly finalNode?: AssistantMessageNode;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `status` | `readonly status: 'running' \| 'settled' \| 'interrupted';` |
| `turn` | `readonly turn: number;` |
| `step` | `readonly step: number;` |
| `blocks` | `readonly blocks: readonly AssistantBlock[];` |
| `time` | `readonly time: number;` |
| `usage` | `readonly usage?: unknown;` |
| `finalNode` | `readonly finalNode?: AssistantMessageNode;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## ChatConversationViewNode client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatConversationViewNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatConversationViewNode extends ConversationViewNode {
    readonly target: 'chat';
    readonly anchorSeq: number;
    readonly location: ConversationLocation;
    readonly visibility: 'visible' | 'hidden';
    readonly groupTree?: ChatGroupTree | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `target` | `readonly target: 'chat';` |
| `anchorSeq` | `readonly anchorSeq: number;` |
| `location` | `readonly location: ConversationLocation;` |
| `visibility` | `readonly visibility: 'visible' \| 'hidden';` |
| `groupTree` | `readonly groupTree?: ChatGroupTree \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## ChatNode client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ChatNode<Kind extends ChatNodeKind = ChatNodeKind> = {
    [RegisteredKind in Kind]: ChatConversationViewNode & {
        readonly kind: RegisteredKind;
        readonly data: ChatNodeDataMap[RegisteredKind];
    };
}[Kind];
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ChatConversationViewNode extends ConversationViewNode {
  readonly target: 'chat'
  readonly anchorSeq: number
  readonly location: ConversationLocation
  readonly visibility: 'visible' | 'hidden'

  readonly groupTree?: ChatGroupTree | undefined
}

export interface ChatNodeDataMap {}

export type ChatNodeKind = Extract<keyof ChatNodeDataMap, string>
```

## ChatNodeKind client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatNodeKind`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ChatNodeKind = Extract<keyof ChatNodeDataMap, string>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ChatNodeDataMap {}
```

## FinalAssistantChatData client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `FinalAssistantChatData`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type FinalAssistantChatData = AssistantChatData & {
    readonly finalNode: AssistantMessageNode;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface AssistantChatData {
  readonly status: 'running' | 'settled' | 'interrupted'
  readonly turn: number
  readonly step: number
  readonly blocks: readonly AssistantBlock[]
  readonly time: number
  readonly usage?: unknown
  readonly finalNode?: AssistantMessageNode
}
```

## ManualCompactionChatData client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ManualCompactionChatData`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ManualCompactionChatData {
    readonly command: CommandNode;
    readonly compaction: CompactionSummaryNode | null;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `command` | `readonly command: CommandNode;` |
| `compaction` | `readonly compaction: CompactionSummaryNode \| null;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## RetryChatData client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `RetryChatData`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface RetryChatData {
    readonly attempts: readonly ModelRetryNode[];
    readonly current: ModelRetryNode;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `attempts` | `readonly attempts: readonly ModelRetryNode[];` |
| `current` | `readonly current: ModelRetryNode;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## ToolChatData client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ToolChatData`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ToolChatData {
    readonly root: ToolCallBlock;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `root` | `readonly root: ToolCallBlock;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## TurnProcessChatData client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `TurnProcessChatData`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TurnProcessChatData {
    readonly turn: number;
    readonly controlAnchorSeq: number;
    readonly processStartSeq: number;
    readonly answerAnchorSeq: number | null;
    readonly answerStep: number | null;
    readonly inlineReasoning: boolean;
    readonly messageCount: number;
    readonly toolCallCount: number;
    readonly subagentCount: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `turn` | `readonly turn: number;` |
| `controlAnchorSeq` | `readonly controlAnchorSeq: number;` |
| `processStartSeq` | `readonly processStartSeq: number;` |
| `answerAnchorSeq` | `readonly answerAnchorSeq: number \| null;` |
| `answerStep` | `readonly answerStep: number \| null;` |
| `inlineReasoning` | `readonly inlineReasoning: boolean;` |
| `messageCount` | `readonly messageCount: number;` |
| `toolCallCount` | `readonly toolCallCount: number;` |
| `subagentCount` | `readonly subagentCount: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## TurnTailChatData client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `TurnTailChatData`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TurnTailChatData {
    readonly turn: number;
    readonly seq: number;
    readonly time: number;
    readonly closing: FinalAssistantChatData | null;
    readonly branchUnavailable: boolean;
    readonly tokenUsage?: TurnTokenUsage;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `turn` | `readonly turn: number;` |
| `seq` | `readonly seq: number;` |
| `time` | `readonly time: number;` |
| `closing` | `readonly closing: FinalAssistantChatData \| null;` |
| `branchUnavailable` | `readonly branchUnavailable: boolean;` |
| `tokenUsage` | `readonly tokenUsage?: TurnTokenUsage;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type FinalAssistantChatData = AssistantChatData & {
  readonly finalNode: AssistantMessageNode
}

export interface TurnTokenUsage {

  readonly uncachedInputTokens: number
  readonly outputTokens: number

  readonly totalTokens: number

  readonly cacheReadTokens?: number

  readonly cacheWriteTokens?: number

  readonly reasoningTokens?: number

  readonly routes?: readonly TurnTokenUsageRoute[]
}

export interface AssistantChatData {
  readonly status: 'running' | 'settled' | 'interrupted'
  readonly turn: number
  readonly step: number
  readonly blocks: readonly AssistantBlock[]
  readonly time: number
  readonly usage?: unknown
  readonly finalNode?: AssistantMessageNode
}

export interface TurnTokenUsageRoute {
  readonly provider: string
  readonly model: string
}
```

## isRunningTool client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `isRunningTool`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function isRunningTool(block: ToolCallBlock): block is RunningToolCall;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## isSettledTool client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `isSettledTool`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function isSettledTool(block: ToolCallBlock): block is Extract<ToolCallBlock, {
    kind: 'tool-result';
}>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。
