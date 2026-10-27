# ui-conversation：records 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

会话内容、输入与呈现分别由注册表和标准 source 装配；SlotMap 的 owner props 只描述父级提供的数据，不等于可任意构造的运行时对象。读取 Session 投影与已持久结果后展示；不要在组件 render 期间提交消息或创建连接。自定义节点、视图、分组与输入命令须挂入各自的 definition registry，随插件清理。

## AssistantBlock client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `AssistantBlock`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type AssistantBlock = {
    kind: 'text';
    text: string;
} | {
    kind: 'reasoning';
    text: string;
} | {
    kind: 'image';
    attachment: ImageAttachmentRef;
} | {
    kind: 'tool-call';
    callId: string;
    name: string;
    argsRaw: string;
} | {
    kind: 'other';
    block: unknown;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## AssistantMessageNode client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `AssistantMessageNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface AssistantMessageNode {
    kind: 'assistant';
    seq: number;
    messageId?: MessageId;
    time: number;
    turn: number;
    step: number;
    blocks: readonly AssistantBlock[];
    usage?: unknown;
    providerMetadata?: AssistantProviderMetadataView;
    requestConfig?: AssistantRequestConfig;
    timing?: AssistantTiming;
    interrupted?: true;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `kind: 'assistant';` |
| `seq` | `seq: number;` |
| `messageId` | `messageId?: MessageId;` |
| `time` | `time: number;` |
| `turn` | `turn: number;` |
| `step` | `step: number;` |
| `blocks` | `blocks: readonly AssistantBlock[];` |
| `usage` | `usage?: unknown;` |
| `providerMetadata` | `providerMetadata?: AssistantProviderMetadataView;` |
| `requestConfig` | `requestConfig?: AssistantRequestConfig;` |
| `timing` | `timing?: AssistantTiming;` |
| `interrupted` | `interrupted?: true;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface AssistantRequestConfig {
  provider: string
  model: string
  purpose?: string
  thinking?: string
  reasoningEffort?: string
  temperature?: number
  maxTokens?: number
  stop?: readonly string[]
}

export interface AssistantProviderMetadataView {
  provider: string
  model: string
}

export type AssistantBlock =
  | { kind: 'text'; text: string }
  | { kind: 'reasoning'; text: string }
  | { kind: 'image'; attachment: ImageAttachmentRef }
  | { kind: 'tool-call'; callId: string; name: string; argsRaw: string }
  | { kind: 'other'; block: unknown }

export interface AssistantTiming {

  stepStartTime: number | null

  firstTokenTime: number | null

  completedTime: number
}
```

## AssistantProviderMetadataView client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `AssistantProviderMetadataView`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface AssistantProviderMetadataView {
    provider: string;
    model: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `provider` | `provider: string;` |
| `model` | `model: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## AssistantRequestConfig client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `AssistantRequestConfig`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface AssistantRequestConfig {
    provider: string;
    model: string;
    purpose?: string;
    thinking?: string;
    reasoningEffort?: string;
    temperature?: number;
    maxTokens?: number;
    stop?: readonly string[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `provider` | `provider: string;` |
| `model` | `model: string;` |
| `purpose` | `purpose?: string;` |
| `thinking` | `thinking?: string;` |
| `reasoningEffort` | `reasoningEffort?: string;` |
| `temperature` | `temperature?: number;` |
| `maxTokens` | `maxTokens?: number;` |
| `stop` | `stop?: readonly string[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## AssistantTiming client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `AssistantTiming`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface AssistantTiming {
    stepStartTime: number | null;
    firstTokenTime: number | null;
    completedTime: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `stepStartTime` | `stepStartTime: number \| null;` |
| `firstTokenTime` | `firstTokenTime: number \| null;` |
| `completedTime` | `completedTime: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## CommandNode client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `CommandNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface CommandNode {
    kind: 'command';
    seq: number;
    time: number;
    commandId: CommandId;
    name: string | null;
    args: string | null;
    outcome: {
        kind: 'success' | 'error';
        text?: string;
        sourceEventSeq?: number;
    } | null;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `kind: 'command';` |
| `seq` | `seq: number;` |
| `time` | `time: number;` |
| `commandId` | `commandId: CommandId;` |
| `name` | `name: string \| null;` |
| `args` | `args: string \| null;` |
| `outcome` | `outcome: { kind: 'success' \| 'error'; text?: string; sourceEventSeq?: number; } \| null;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## CompactionSummaryNode client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `CompactionSummaryNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface CompactionSummaryNode {
    kind: 'compaction';
    seq: number;
    time: number;
    summary: string | null;
    summaryEventSeq: number | null;
    shadowedItemCount: number | null;
    shadowedTokenCount: number | null;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `kind: 'compaction';` |
| `seq` | `seq: number;` |
| `time` | `time: number;` |
| `summary` | `summary: string \| null;` |
| `summaryEventSeq` | `summaryEventSeq: number \| null;` |
| `shadowedItemCount` | `shadowedItemCount: number \| null;` |
| `shadowedTokenCount` | `shadowedTokenCount: number \| null;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ContextMessageNode client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ContextMessageNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ContextMessageNode {
    kind: 'context';
    seq: number;
    time: number;
    content: readonly ContentBlock[];
    source: unknown;
    producer: ContextProducerView;
    form: KnownContextForm | null;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `kind: 'context';` |
| `seq` | `seq: number;` |
| `time` | `time: number;` |
| `content` | `content: readonly ContentBlock[];` |
| `source` | `source: unknown;` |
| `producer` | `producer: ContextProducerView;` |
| `form` | `form: KnownContextForm \| null;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationNode client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationNode = UserMessageNode | AssistantMessageNode | SteeringMessageNode | ContextMessageNode | ModelRetryNode | TurnErrorNode | TurnMaxTokensNode | ToolResultNode | CommandNode | CompactionSummaryNode | UnknownSurfaceNode;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface UserMessageNode {
  kind: 'user'
  seq: number

  time: number
  content: readonly ContentBlock[]
  source: unknown
}

export interface AssistantMessageNode {
  kind: 'assistant'
  seq: number

  messageId?: MessageId

  time: number
  turn: number
  step: number
  blocks: readonly AssistantBlock[]
  usage?: unknown
  providerMetadata?: AssistantProviderMetadataView
  requestConfig?: AssistantRequestConfig

  timing?: AssistantTiming

  interrupted?: true
}

export interface SteeringMessageNode {
  kind: 'steering'

  messageId: MessageId
  seq: number

  time: number
  content: readonly ContentBlock[]
  source: unknown
}

export interface ContextMessageNode {
  kind: 'context'
  seq: number

  time: number
  content: readonly ContentBlock[]
  source: unknown

  producer: ContextProducerView

  form: KnownContextForm | null
}

export type ModelRetryNode = LlmRetryEventData & {
  kind: 'model-retry'
  seq: number

  time: number

  retryState: 'scheduled' | 'started' | 'cancelled'
}

export interface TurnErrorNode {
  kind: 'turn-error'

  seq: number

  time: number
  turn: number
  step: number

  message: string

  code?: string
}

export interface TurnMaxTokensNode {
  kind: 'turn-max-tokens'

  seq: number

  time: number
  turn: number
  step: number
}

export interface ToolResultNode {
  kind: 'tool-result'
  seq: number

  time: number
  callId: string

  parentCallId?: string

  name: string

  args: ToolArgs

  call: { name: string; argsRaw: string } | null

  callTime: number | null
  content: readonly ContentBlock[]
  isError: boolean
  error?: { name: string; code: string; reason?: string }
  meta?: unknown

  subCalls: readonly ToolCallBlock[]
}

export interface CompactionSummaryNode {
  kind: 'compaction'

  seq: number

  time: number

  summary: string | null

  summaryEventSeq: number | null

  shadowedItemCount: number | null

  shadowedTokenCount: number | null
}

export interface UnknownSurfaceNode {
  kind: 'unknown'
  seq: number

  time: number
  type: string
  data: unknown
}

export interface CommandNode {
  kind: 'command'

  seq: number

  time: number

  commandId: CommandId

  name: string | null

  args: string | null

  outcome: {
    kind: 'success' | 'error'
    text?: string

    sourceEventSeq?: number
  } | null
}

export type ToolArgs = PartialArguments

export type ToolCallBlock = RunningToolCall | ToolResultNode

export interface AssistantRequestConfig {
  provider: string
  model: string
  purpose?: string
  thinking?: string
  reasoningEffort?: string
  temperature?: number
  maxTokens?: number
  stop?: readonly string[]
}

export interface AssistantProviderMetadataView {
  provider: string
  model: string
}

export type AssistantBlock =
  | { kind: 'text'; text: string }
  | { kind: 'reasoning'; text: string }
  | { kind: 'image'; attachment: ImageAttachmentRef }
  | { kind: 'tool-call'; callId: string; name: string; argsRaw: string }
  | { kind: 'other'; block: unknown }

export interface AssistantTiming {

  stepStartTime: number | null

  firstTokenTime: number | null

  completedTime: number
}

export type RunningToolCall = PreparingToolCall | StartedToolCall

export interface PreparingToolCall extends ToolCallHead {
  readonly phase: 'preparing'
}

export interface StartedToolCall extends ToolCallHead {
  readonly phase: 'start'
  readonly argsRaw: string
}

interface ToolCallHead {
  callId: string

  parentCallId?: string
  name: string
  turn: number
  step: number

  time: number

  subCalls: readonly ToolCallBlock[]

  args: ToolArgs
}
```

## ModelRetryNode client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ModelRetryNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ModelRetryNode = LlmRetryEventData & {
    kind: 'model-retry';
    seq: number;
    time: number;
    retryState: 'scheduled' | 'started' | 'cancelled';
};
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## PartialAssistant client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `PartialAssistant`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PartialAssistant {
    turn: number;
    step: number;
    blocks: readonly AssistantBlock[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `turn` | `turn: number;` |
| `step` | `step: number;` |
| `blocks` | `blocks: readonly AssistantBlock[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type AssistantBlock =
  | { kind: 'text'; text: string }
  | { kind: 'reasoning'; text: string }
  | { kind: 'image'; attachment: ImageAttachmentRef }
  | { kind: 'tool-call'; callId: string; name: string; argsRaw: string }
  | { kind: 'other'; block: unknown }
```

## PreparingToolCall client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `PreparingToolCall`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PreparingToolCall extends ToolCallHead {
    readonly phase: 'preparing';
}
```

| 成员 | 公开声明 |
| --- | --- |
| `phase` | `readonly phase: 'preparing';` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
interface ToolCallHead {
  callId: string

  parentCallId?: string
  name: string
  turn: number
  step: number

  time: number

  subCalls: readonly ToolCallBlock[]

  args: ToolArgs
}

export type ToolArgs = PartialArguments

export type ToolCallBlock = RunningToolCall | ToolResultNode

export interface ToolResultNode {
  kind: 'tool-result'
  seq: number

  time: number
  callId: string

  parentCallId?: string

  name: string

  args: ToolArgs

  call: { name: string; argsRaw: string } | null

  callTime: number | null
  content: readonly ContentBlock[]
  isError: boolean
  error?: { name: string; code: string; reason?: string }
  meta?: unknown

  subCalls: readonly ToolCallBlock[]
}

export type RunningToolCall = PreparingToolCall | StartedToolCall

export interface StartedToolCall extends ToolCallHead {
  readonly phase: 'start'
  readonly argsRaw: string
}
```

## RunningToolCall client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `RunningToolCall`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type RunningToolCall = PreparingToolCall | StartedToolCall;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface PreparingToolCall extends ToolCallHead {
  readonly phase: 'preparing'
}

export interface StartedToolCall extends ToolCallHead {
  readonly phase: 'start'
  readonly argsRaw: string
}

export type ToolCallBlock = RunningToolCall | ToolResultNode

export interface ToolResultNode {
  kind: 'tool-result'
  seq: number

  time: number
  callId: string

  parentCallId?: string

  name: string

  args: ToolArgs

  call: { name: string; argsRaw: string } | null

  callTime: number | null
  content: readonly ContentBlock[]
  isError: boolean
  error?: { name: string; code: string; reason?: string }
  meta?: unknown

  subCalls: readonly ToolCallBlock[]
}

interface ToolCallHead {
  callId: string

  parentCallId?: string
  name: string
  turn: number
  step: number

  time: number

  subCalls: readonly ToolCallBlock[]

  args: ToolArgs
}

export type ToolArgs = PartialArguments
```

## StartedToolCall client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `StartedToolCall`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface StartedToolCall extends ToolCallHead {
    readonly phase: 'start';
    readonly argsRaw: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `phase` | `readonly phase: 'start';` |
| `argsRaw` | `readonly argsRaw: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
interface ToolCallHead {
  callId: string

  parentCallId?: string
  name: string
  turn: number
  step: number

  time: number

  subCalls: readonly ToolCallBlock[]

  args: ToolArgs
}

export type ToolArgs = PartialArguments

export type ToolCallBlock = RunningToolCall | ToolResultNode

export interface ToolResultNode {
  kind: 'tool-result'
  seq: number

  time: number
  callId: string

  parentCallId?: string

  name: string

  args: ToolArgs

  call: { name: string; argsRaw: string } | null

  callTime: number | null
  content: readonly ContentBlock[]
  isError: boolean
  error?: { name: string; code: string; reason?: string }
  meta?: unknown

  subCalls: readonly ToolCallBlock[]
}

export type RunningToolCall = PreparingToolCall | StartedToolCall

export interface PreparingToolCall extends ToolCallHead {
  readonly phase: 'preparing'
}
```

## SteeringMessageNode client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `SteeringMessageNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SteeringMessageNode {
    kind: 'steering';
    messageId: MessageId;
    seq: number;
    time: number;
    content: readonly ContentBlock[];
    source: unknown;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `kind: 'steering';` |
| `messageId` | `messageId: MessageId;` |
| `seq` | `seq: number;` |
| `time` | `time: number;` |
| `content` | `content: readonly ContentBlock[];` |
| `source` | `source: unknown;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ToolArgs client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ToolArgs`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ToolArgs = PartialArguments;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ToolCallBlock client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ToolCallBlock`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ToolCallBlock = RunningToolCall | ToolResultNode;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ToolResultNode {
  kind: 'tool-result'
  seq: number

  time: number
  callId: string

  parentCallId?: string

  name: string

  args: ToolArgs

  call: { name: string; argsRaw: string } | null

  callTime: number | null
  content: readonly ContentBlock[]
  isError: boolean
  error?: { name: string; code: string; reason?: string }
  meta?: unknown

  subCalls: readonly ToolCallBlock[]
}

export type ToolArgs = PartialArguments

export type RunningToolCall = PreparingToolCall | StartedToolCall

export interface PreparingToolCall extends ToolCallHead {
  readonly phase: 'preparing'
}

export interface StartedToolCall extends ToolCallHead {
  readonly phase: 'start'
  readonly argsRaw: string
}

interface ToolCallHead {
  callId: string

  parentCallId?: string
  name: string
  turn: number
  step: number

  time: number

  subCalls: readonly ToolCallBlock[]

  args: ToolArgs
}
```

## ToolResultNode client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ToolResultNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ToolResultNode {
    kind: 'tool-result';
    seq: number;
    time: number;
    callId: string;
    parentCallId?: string;
    name: string;
    args: ToolArgs;
    call: {
        name: string;
        argsRaw: string;
    } | null;
    callTime: number | null;
    content: readonly ContentBlock[];
    isError: boolean;
    error?: {
        name: string;
        code: string;
        reason?: string;
    };
    meta?: unknown;
    subCalls: readonly ToolCallBlock[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `kind: 'tool-result';` |
| `seq` | `seq: number;` |
| `time` | `time: number;` |
| `callId` | `callId: string;` |
| `parentCallId` | `parentCallId?: string;` |
| `name` | `name: string;` |
| `args` | `args: ToolArgs;` |
| `call` | `call: { name: string; argsRaw: string; } \| null;` |
| `callTime` | `callTime: number \| null;` |
| `content` | `content: readonly ContentBlock[];` |
| `isError` | `isError: boolean;` |
| `error` | `error?: { name: string; code: string; reason?: string; };` |
| `meta` | `meta?: unknown;` |
| `subCalls` | `subCalls: readonly ToolCallBlock[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ToolArgs = PartialArguments

export type ToolCallBlock = RunningToolCall | ToolResultNode

export type RunningToolCall = PreparingToolCall | StartedToolCall

export interface PreparingToolCall extends ToolCallHead {
  readonly phase: 'preparing'
}

export interface StartedToolCall extends ToolCallHead {
  readonly phase: 'start'
  readonly argsRaw: string
}

interface ToolCallHead {
  callId: string

  parentCallId?: string
  name: string
  turn: number
  step: number

  time: number

  subCalls: readonly ToolCallBlock[]

  args: ToolArgs
}
```

## TurnErrorNode client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `TurnErrorNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TurnErrorNode {
    kind: 'turn-error';
    seq: number;
    time: number;
    turn: number;
    step: number;
    message: string;
    code?: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `kind: 'turn-error';` |
| `seq` | `seq: number;` |
| `time` | `time: number;` |
| `turn` | `turn: number;` |
| `step` | `step: number;` |
| `message` | `message: string;` |
| `code` | `code?: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## TurnMaxTokensNode client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `TurnMaxTokensNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TurnMaxTokensNode {
    kind: 'turn-max-tokens';
    seq: number;
    time: number;
    turn: number;
    step: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `kind: 'turn-max-tokens';` |
| `seq` | `seq: number;` |
| `time` | `time: number;` |
| `turn` | `turn: number;` |
| `step` | `step: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## UnknownSurfaceNode client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `UnknownSurfaceNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface UnknownSurfaceNode {
    kind: 'unknown';
    seq: number;
    time: number;
    type: string;
    data: unknown;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `kind: 'unknown';` |
| `seq` | `seq: number;` |
| `time` | `time: number;` |
| `type` | `type: string;` |
| `data` | `data: unknown;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## UserMessageNode client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `UserMessageNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface UserMessageNode {
    kind: 'user';
    seq: number;
    time: number;
    content: readonly ContentBlock[];
    source: unknown;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `kind: 'user';` |
| `seq` | `seq: number;` |
| `time` | `time: number;` |
| `content` | `content: readonly ContentBlock[];` |
| `source` | `source: unknown;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。
