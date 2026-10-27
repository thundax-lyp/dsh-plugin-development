# ui-chat：snapshot 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-chat 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## ChatLocationNodeIndex client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatLocationNodeIndex`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatLocationNodeIndex {
    getTurn(turn: number): readonly string[];
    getStep(turn: number, step: number): readonly string[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `getTurn` | `getTurn(turn: number): readonly string[];` |
| `getStep` | `getStep(turn: number, step: number): readonly string[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## ChatNodeProcessSource client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatNodeProcessSource`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatNodeProcessSource {
    readonly getSnapshot: () => ChatTurnProcessPresentation | undefined;
    readonly subscribe: (listener: () => void) => () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `getSnapshot` | `readonly getSnapshot: () => ChatTurnProcessPresentation \| undefined;` |
| `subscribe` | `readonly subscribe: (listener: () => void) => () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ChatTurnProcessPresentation {
  readonly turn: number
  readonly spec: TurnProcessSpec

  readonly turnStarted: boolean
  readonly turnClosed: boolean
  readonly hasExternalProcess: boolean

  readonly hasInterleavedInput: boolean
  readonly compactAnswer: boolean
}
```

## ChatNodeSource client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatNodeSource`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatNodeSource {
    readonly getSnapshot: () => ChatConversationViewNode | undefined;
    readonly subscribe: (listener: () => void) => () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `getSnapshot` | `readonly getSnapshot: () => ChatConversationViewNode \| undefined;` |
| `subscribe` | `readonly subscribe: (listener: () => void) => () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## ChatNodeStore client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatNodeStore`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatNodeStore {
    get(key: string): ChatConversationViewNode | undefined;
    source(key: string): ChatNodeSource;
    bottomSource(key: string): ObservableSnapshot<boolean>;
    turnDataSource<Kind extends ChatNodeKind>(turn: number, kind: Kind): ObservableSnapshot<readonly ChatNodeDataMap[Kind][]>;
    processSource(key: string): ChatNodeProcessSource;
    values(): readonly ChatConversationViewNode[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `get` | `get(key: string): ChatConversationViewNode \| undefined;` |
| `source` | `source(key: string): ChatNodeSource;` |
| `bottomSource` | `bottomSource(key: string): ObservableSnapshot<boolean>;` |
| `turnDataSource` | `turnDataSource<Kind extends ChatNodeKind>(turn: number, kind: Kind): ObservableSnapshot<readonly ChatNodeDataMap[Kind][]>;` |
| `processSource` | `processSource(key: string): ChatNodeProcessSource;` |
| `values` | `values(): readonly ChatConversationViewNode[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ChatNodeSource {

  readonly getSnapshot: () => ChatConversationViewNode | undefined

  readonly subscribe: (listener: () => void) => () => void
}

export interface ChatNodeProcessSource {

  readonly getSnapshot: () => ChatTurnProcessPresentation | undefined

  readonly subscribe: (listener: () => void) => () => void
}

export interface ChatTurnProcessPresentation {
  readonly turn: number
  readonly spec: TurnProcessSpec

  readonly turnStarted: boolean
  readonly turnClosed: boolean
  readonly hasExternalProcess: boolean

  readonly hasInterleavedInput: boolean
  readonly compactAnswer: boolean
}
```

## ChatSnapshot client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatSnapshot {
    readonly order: readonly string[];
    readonly nodes: ChatNodeStore;
    readonly locations: ChatLocationNodeIndex;
    readonly navigation: ChatTurnNavigationIndex;
    readonly timeline: ConversationTimelineSnapshot;
    readonly legacy: LegacyConversationSlice;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `order` | `readonly order: readonly string[];` |
| `nodes` | `readonly nodes: ChatNodeStore;` |
| `locations` | `readonly locations: ChatLocationNodeIndex;` |
| `navigation` | `readonly navigation: ChatTurnNavigationIndex;` |
| `timeline` | `readonly timeline: ConversationTimelineSnapshot;` |
| `legacy` | `readonly legacy: LegacyConversationSlice;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ChatNodeStore {

  get(key: string): ChatConversationViewNode | undefined

  source(key: string): ChatNodeSource

  bottomSource(key: string): ObservableSnapshot<boolean>

  turnDataSource<Kind extends ChatNodeKind>(turn: number, kind: Kind): ObservableSnapshot<readonly ChatNodeDataMap[Kind][]>

  processSource(key: string): ChatNodeProcessSource

  values(): readonly ChatConversationViewNode[]
}

export interface ChatTurnNavigationIndex {

  items(): readonly TurnNavigationItem[]
}

export interface ChatLocationNodeIndex {

  getTurn(turn: number): readonly string[]

  getStep(turn: number, step: number): readonly string[]
}

export interface LegacyConversationSlice {
  readonly nodes: readonly ConversationNode[]
  readonly turnTimings: ReadonlyMap<number, { readonly startTime: number; readonly endTime?: number }>
  readonly turnEnds: ReadonlyMap<number, number>
  readonly partial: PartialAssistant | null
  readonly runningCalls: readonly RunningToolCall[]
}

export interface ChatNodeSource {

  readonly getSnapshot: () => ChatConversationViewNode | undefined

  readonly subscribe: (listener: () => void) => () => void
}

export interface ChatNodeProcessSource {

  readonly getSnapshot: () => ChatTurnProcessPresentation | undefined

  readonly subscribe: (listener: () => void) => () => void
}

export interface TurnNavigationItem {
  readonly turn: number

  readonly anchorKey: string

  readonly prompt: string

  readonly response: string
}

export interface ChatTurnProcessPresentation {
  readonly turn: number
  readonly spec: TurnProcessSpec

  readonly turnStarted: boolean
  readonly turnClosed: boolean
  readonly hasExternalProcess: boolean

  readonly hasInterleavedInput: boolean
  readonly compactAnswer: boolean
}
```

## ChatTurnNavigationIndex client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatTurnNavigationIndex`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatTurnNavigationIndex {
    items(): readonly TurnNavigationItem[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `items` | `items(): readonly TurnNavigationItem[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface TurnNavigationItem {
  readonly turn: number

  readonly anchorKey: string

  readonly prompt: string

  readonly response: string
}
```

## ChatTurnProcessPresentation client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatTurnProcessPresentation`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatTurnProcessPresentation {
    readonly turn: number;
    readonly spec: TurnProcessSpec;
    readonly turnStarted: boolean;
    readonly turnClosed: boolean;
    readonly hasExternalProcess: boolean;
    readonly hasInterleavedInput: boolean;
    readonly compactAnswer: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `turn` | `readonly turn: number;` |
| `spec` | `readonly spec: TurnProcessSpec;` |
| `turnStarted` | `readonly turnStarted: boolean;` |
| `turnClosed` | `readonly turnClosed: boolean;` |
| `hasExternalProcess` | `readonly hasExternalProcess: boolean;` |
| `hasInterleavedInput` | `readonly hasInterleavedInput: boolean;` |
| `compactAnswer` | `readonly compactAnswer: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## EMPTY_CHAT_SNAPSHOT client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `EMPTY_CHAT_SNAPSHOT`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const EMPTY_CHAT_SNAPSHOT: ChatSnapshot;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ChatSnapshot {
  readonly order: readonly string[]
  readonly nodes: ChatNodeStore
  readonly locations: ChatLocationNodeIndex
  readonly navigation: ChatTurnNavigationIndex
  readonly timeline: ConversationTimelineSnapshot
  readonly legacy: LegacyConversationSlice
}

export interface ChatNodeStore {

  get(key: string): ChatConversationViewNode | undefined

  source(key: string): ChatNodeSource

  bottomSource(key: string): ObservableSnapshot<boolean>

  turnDataSource<Kind extends ChatNodeKind>(turn: number, kind: Kind): ObservableSnapshot<readonly ChatNodeDataMap[Kind][]>

  processSource(key: string): ChatNodeProcessSource

  values(): readonly ChatConversationViewNode[]
}

export interface ChatTurnNavigationIndex {

  items(): readonly TurnNavigationItem[]
}

export interface ChatLocationNodeIndex {

  getTurn(turn: number): readonly string[]

  getStep(turn: number, step: number): readonly string[]
}

export interface LegacyConversationSlice {
  readonly nodes: readonly ConversationNode[]
  readonly turnTimings: ReadonlyMap<number, { readonly startTime: number; readonly endTime?: number }>
  readonly turnEnds: ReadonlyMap<number, number>
  readonly partial: PartialAssistant | null
  readonly runningCalls: readonly RunningToolCall[]
}

export interface ChatNodeSource {

  readonly getSnapshot: () => ChatConversationViewNode | undefined

  readonly subscribe: (listener: () => void) => () => void
}

export interface ChatNodeProcessSource {

  readonly getSnapshot: () => ChatTurnProcessPresentation | undefined

  readonly subscribe: (listener: () => void) => () => void
}

export interface TurnNavigationItem {
  readonly turn: number

  readonly anchorKey: string

  readonly prompt: string

  readonly response: string
}

export interface ChatTurnProcessPresentation {
  readonly turn: number
  readonly spec: TurnProcessSpec

  readonly turnStarted: boolean
  readonly turnClosed: boolean
  readonly hasExternalProcess: boolean

  readonly hasInterleavedInput: boolean
  readonly compactAnswer: boolean
}
```

## LegacyConversationSlice client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `LegacyConversationSlice`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface LegacyConversationSlice {
    readonly nodes: readonly ConversationNode[];
    readonly turnTimings: ReadonlyMap<number, {
        readonly startTime: number;
        readonly endTime?: number;
    }>;
    readonly turnEnds: ReadonlyMap<number, number>;
    readonly partial: PartialAssistant | null;
    readonly runningCalls: readonly RunningToolCall[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `nodes` | `readonly nodes: readonly ConversationNode[];` |
| `turnTimings` | `readonly turnTimings: ReadonlyMap<number, { readonly startTime: number; readonly endTime?: number; }>;` |
| `turnEnds` | `readonly turnEnds: ReadonlyMap<number, number>;` |
| `partial` | `readonly partial: PartialAssistant \| null;` |
| `runningCalls` | `readonly runningCalls: readonly RunningToolCall[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## TurnNavigationItem client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `TurnNavigationItem`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TurnNavigationItem {
    readonly turn: number;
    readonly anchorKey: string;
    readonly prompt: string;
    readonly response: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `turn` | `readonly turn: number;` |
| `anchorKey` | `readonly anchorKey: string;` |
| `prompt` | `readonly prompt: string;` |
| `response` | `readonly response: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。
