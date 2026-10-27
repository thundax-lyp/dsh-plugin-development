# ui-chat：slots 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-chat 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## AssistantActionOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `AssistantActionOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface AssistantActionOwnerProps {
    messageId: MessageId;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `messageId` | `messageId: MessageId;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## ChatFileMentions client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatFileMentions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatFileMentions {
    forClosing(owner: TurnTailOwnerProps, sessionId: SessionId): MarkdownFileMentions | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `forClosing` | `forClosing(owner: TurnTailOwnerProps, sessionId: SessionId): MarkdownFileMentions \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface TurnTailOwnerProps {
  turn: TurnLocation
  seq: number
  openFile: (path: string) => void
}
```

## ChatFlowDataInjected client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatFlowDataInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ChatFlowDataInjected = Pick<ChatViewInjected, 'hooks' | 'keyedHooks'>;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ChatViewInjected {
  hooks: {

    presentation: ObservableSnapshot<ChatPresentationPolicy>
  }
  keyedHooks: {

    chatNode: (key: string) => ChatNodeSource

    chatNodeBottom: (key: string) => ObservableSnapshot<boolean>

    chatNodeProcess: (key: string) => ChatNodeProcessSource

    chatGroup: (key: string) => ObservableSnapshot<GroupSnapshot<ConversationGroupData<'chat'>> | undefined> | undefined
  }

  openExternalLink: (url: string) => void
  openFile: (path: string, options?: OpenFileOptions) => Promise<void>
  loadOlder: () => void

  loadThrough: (seq: SessionSeq) => Promise<void>
  loadImage: MessageImageLoader
  chatScroll: {
    save: (position: ChatScrollPosition | null) => void
    read: () => ChatScrollPosition | null
  }
  forkAt: (seq: number) => void
  fileMentions: (owner: TurnTailOwnerProps) => MarkdownFileMentions | undefined
}

export interface OpenFileOptions {

  readonly line?: number
}

export interface TurnTailOwnerProps {
  turn: TurnLocation
  seq: number
  openFile: (path: string) => void
}

export interface ChatScrollPosition {
  readonly anchorKey: string
  readonly anchorTop: number
  readonly scrollTop: number
}
```

## ChatFlowHookContext client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatFlowHookContext`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatFlowHookContext {
    readonly motion: FlowMotionRows;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `motion` | `readonly motion: FlowMotionRows;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## ChatFlowInjected client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatFlowInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatFlowInjected {
    hooks: {
        groupAction: SlotHookFactory<'conversation.chat.flow', UseGroupAction>;
        groupHeaderAction: SlotHookFactory<'conversation.chat.flow', UseGroupHeaderAction>;
    };
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `hooks: { groupAction: SlotHookFactory<'conversation.chat.flow', UseGroupAction>; groupHeaderAction: SlotHookFactory<'conversation.chat.flow', UseGroupHeaderAction>; };` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type UseGroupAction = (hidden: boolean, reveal: () => void) => RefObject<HTMLDivElement>

export type UseGroupHeaderAction = (ref: RefObject<HTMLElement | null>, hidden: boolean) => void
```

## ChatFlowOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatFlowOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatFlowOwnerProps extends Pick<ChatNodeOwnerProps, 'cwd' | 'openFile' | 'inspectCall' | 'forkAt' | 'loadImage' | 'fileMentions'> {
    readonly entries: readonly RenderEntry[];
    readonly pendingInputs: readonly (PendingSubmission | InboxState['next-step'][number])[];
    readonly lastInputTurn: number | undefined;
    readonly deferCollapse: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `entries` | `readonly entries: readonly RenderEntry[];` |
| `pendingInputs` | `readonly pendingInputs: readonly (PendingSubmission \| InboxState['next-step'][number])[];` |
| `lastInputTurn` | `readonly lastInputTurn: number \| undefined;` |
| `deferCollapse` | `readonly deferCollapse: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface OpenFileOptions {

  readonly line?: number
}

export interface TurnTailOwnerProps {
  turn: TurnLocation
  seq: number
  openFile: (path: string) => void
}

export interface ChatNodeOwnerProps {

  groupPart?: string
  cwd?: string | undefined
  openFile: (path: string, options?: OpenFileOptions) => void
  inspectCall: ((callId: ToolCallId) => void) | undefined
  forkAt: (seq: number) => void

  loadImage: MessageImageLoader
  fileMentions: (owner: TurnTailOwnerProps) => MarkdownFileMentions | undefined

  turnProcess?: TurnProcessOwnerProps | undefined
}

export interface TurnProcessOwnerProps {

  readonly hasContent: boolean
  readonly spec: TurnProcessSpec
  readonly foldable: boolean
  readonly open: boolean
  setOpen(open: boolean): void
}
```

## ChatFlowSlotProps client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatFlowSlotProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ChatFlowSlotProps = PropsRuntime<'conversation.chat.flow'> & PropsRenderSlots<'conversation.chat.node'> & PropsRenderFactories & PropsStore<ChatStore> & InjectFace<ChatFlowDataInjected> & PropsLocale<'chat'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ChatStore = ReturnType<typeof createChatStore>

export type ChatFlowDataInjected = Pick<ChatViewInjected, 'hooks' | 'keyedHooks'>

export interface ChatViewInjected {
  hooks: {

    presentation: ObservableSnapshot<ChatPresentationPolicy>
  }
  keyedHooks: {

    chatNode: (key: string) => ChatNodeSource

    chatNodeBottom: (key: string) => ObservableSnapshot<boolean>

    chatNodeProcess: (key: string) => ChatNodeProcessSource

    chatGroup: (key: string) => ObservableSnapshot<GroupSnapshot<ConversationGroupData<'chat'>> | undefined> | undefined
  }

  openExternalLink: (url: string) => void
  openFile: (path: string, options?: OpenFileOptions) => Promise<void>
  loadOlder: () => void

  loadThrough: (seq: SessionSeq) => Promise<void>
  loadImage: MessageImageLoader
  chatScroll: {
    save: (position: ChatScrollPosition | null) => void
    read: () => ChatScrollPosition | null
  }
  forkAt: (seq: number) => void
  fileMentions: (owner: TurnTailOwnerProps) => MarkdownFileMentions | undefined
}

export interface OpenFileOptions {

  readonly line?: number
}

export interface TurnTailOwnerProps {
  turn: TurnLocation
  seq: number
  openFile: (path: string) => void
}

export interface ChatScrollPosition {
  readonly anchorKey: string
  readonly anchorTop: number
  readonly scrollTop: number
}
```


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `useChat` | `useChat: UseChat;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |

## ChatNodeHookContext client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatNodeHookContext`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatNodeHookContext {
    readonly turnData: ConversationLocationDataStore<ConversationTurnDataMap> | undefined;
    readonly disclosureReset: ObservableSnapshot<number>;
    readonly useGroupAction: UseGroupAction;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `turnData` | `readonly turnData: ConversationLocationDataStore<ConversationTurnDataMap> \| undefined;` |
| `disclosureReset` | `readonly disclosureReset: ObservableSnapshot<number>;` |
| `useGroupAction` | `readonly useGroupAction: UseGroupAction;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type UseGroupAction = (hidden: boolean, reveal: () => void) => RefObject<HTMLDivElement>
```

## ChatNodeInjected client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatNodeInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatNodeInjected {
    hooks: {
        turnData: SlotHookFactory<'conversation.chat.node', UseChatNodeTurnData>;
        disclosure: SlotHookFactory<'conversation.chat.node', UseDisclosure>;
        groupAction: SlotHookFactory<'conversation.chat.node', UseGroupAction>;
    };
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `hooks: { turnData: SlotHookFactory<'conversation.chat.node', UseChatNodeTurnData>; disclosure: SlotHookFactory<'conversation.chat.node', UseDisclosure>; groupAction: SlotHookFactory<'conversation.chat.node', UseGroupAction>; };` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type UseChatNodeTurnData = <Key extends Extract<keyof ConversationTurnDataMap, string>>(
  key: Key,
) => Readonly<ConversationTurnDataMap[Key]> | undefined

export type UseDisclosure = () => {
  readonly expanded: boolean

  readonly setExpanded: (open: boolean) => void
  readonly toggle: () => void
}

export type UseGroupAction = (hidden: boolean, reveal: () => void) => RefObject<HTMLDivElement>
```

## ChatNodeOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatNodeOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatNodeOwnerProps {
    groupPart?: string;
    cwd?: string | undefined;
    openFile: (path: string, options?: OpenFileOptions) => void;
    inspectCall: ((callId: ToolCallId) => void) | undefined;
    forkAt: (seq: number) => void;
    loadImage: MessageImageLoader;
    fileMentions: (owner: TurnTailOwnerProps) => MarkdownFileMentions | undefined;
    turnProcess?: TurnProcessOwnerProps | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `groupPart` | `groupPart?: string;` |
| `cwd` | `cwd?: string \| undefined;` |
| `openFile` | `openFile: (path: string, options?: OpenFileOptions) => void;` |
| `inspectCall` | `inspectCall: ((callId: ToolCallId) => void) \| undefined;` |
| `forkAt` | `forkAt: (seq: number) => void;` |
| `loadImage` | `loadImage: MessageImageLoader;` |
| `fileMentions` | `fileMentions: (owner: TurnTailOwnerProps) => MarkdownFileMentions \| undefined;` |
| `turnProcess` | `turnProcess?: TurnProcessOwnerProps \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface OpenFileOptions {

  readonly line?: number
}

export interface TurnTailOwnerProps {
  turn: TurnLocation
  seq: number
  openFile: (path: string) => void
}

export interface TurnProcessOwnerProps {

  readonly hasContent: boolean
  readonly spec: TurnProcessSpec
  readonly foldable: boolean
  readonly open: boolean
  setOpen(open: boolean): void
}
```

## ChatNodeViewProps client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatNodeViewProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ChatNodeViewProps<Kind extends ChatNodeKind = ChatNodeKind> = PropsRuntime<'conversation.chat.node', Kind> & PropsLocale<'chat'> & PropsRenderFactories;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `useChat` | `useChat: UseChat;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |

## ChatScrollPosition client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatScrollPosition`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatScrollPosition {
    readonly anchorKey: string;
    readonly anchorTop: number;
    readonly scrollTop: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `anchorKey` | `readonly anchorKey: string;` |
| `anchorTop` | `readonly anchorTop: number;` |
| `scrollTop` | `readonly scrollTop: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## ChatStore client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatStore`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ChatStore = ReturnType<typeof createChatStore>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## ChatViewInjected client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatViewInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatViewInjected {
    hooks: {
        presentation: ObservableSnapshot<ChatPresentationPolicy>;
    };
    keyedHooks: {
        chatNode: (key: string) => ChatNodeSource;
        chatNodeBottom: (key: string) => ObservableSnapshot<boolean>;
        chatNodeProcess: (key: string) => ChatNodeProcessSource;
        chatGroup: (key: string) => ObservableSnapshot<GroupSnapshot<ConversationGroupData<'chat'>> | undefined> | undefined;
    };
    openExternalLink: (url: string) => void;
    openFile: (path: string, options?: OpenFileOptions) => Promise<void>;
    loadOlder: () => void;
    loadThrough: (seq: SessionSeq) => Promise<void>;
    loadImage: MessageImageLoader;
    chatScroll: {
        save: (position: ChatScrollPosition | null) => void;
        read: () => ChatScrollPosition | null;
    };
    forkAt: (seq: number) => void;
    fileMentions: (owner: TurnTailOwnerProps) => MarkdownFileMentions | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `hooks: { presentation: ObservableSnapshot<ChatPresentationPolicy>; };` |
| `keyedHooks` | `keyedHooks: { chatNode: (key: string) => ChatNodeSource; chatNodeBottom: (key: string) => ObservableSnapshot<boolean>; chatNodeProcess: (key: string) => ChatNodeProcessSource; chatGroup: (key: string) => ObservableSnapshot<GroupSnapshot<ConversationGroupData<'chat'>> \| undefined> \| undefined; };` |
| `openExternalLink` | `openExternalLink: (url: string) => void;` |
| `openFile` | `openFile: (path: string, options?: OpenFileOptions) => Promise<void>;` |
| `loadOlder` | `loadOlder: () => void;` |
| `loadThrough` | `loadThrough: (seq: SessionSeq) => Promise<void>;` |
| `loadImage` | `loadImage: MessageImageLoader;` |
| `chatScroll` | `chatScroll: { save: (position: ChatScrollPosition \| null) => void; read: () => ChatScrollPosition \| null; };` |
| `forkAt` | `forkAt: (seq: number) => void;` |
| `fileMentions` | `fileMentions: (owner: TurnTailOwnerProps) => MarkdownFileMentions \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface OpenFileOptions {

  readonly line?: number
}

export interface TurnTailOwnerProps {
  turn: TurnLocation
  seq: number
  openFile: (path: string) => void
}

export interface ChatScrollPosition {
  readonly anchorKey: string
  readonly anchorTop: number
  readonly scrollTop: number
}
```

## ChatViewSlotProps client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ChatViewSlotProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ChatViewSlotProps = PropsRuntime<'conversation.view'> & PropsRenderSlots<'conversation.chat.flow'> & PropsStore<ChatStore> & InjectFace<ChatViewInjected> & PropsLocale<'chat'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ChatStore = ReturnType<typeof createChatStore>

export interface ChatViewInjected {
  hooks: {

    presentation: ObservableSnapshot<ChatPresentationPolicy>
  }
  keyedHooks: {

    chatNode: (key: string) => ChatNodeSource

    chatNodeBottom: (key: string) => ObservableSnapshot<boolean>

    chatNodeProcess: (key: string) => ChatNodeProcessSource

    chatGroup: (key: string) => ObservableSnapshot<GroupSnapshot<ConversationGroupData<'chat'>> | undefined> | undefined
  }

  openExternalLink: (url: string) => void
  openFile: (path: string, options?: OpenFileOptions) => Promise<void>
  loadOlder: () => void

  loadThrough: (seq: SessionSeq) => Promise<void>
  loadImage: MessageImageLoader
  chatScroll: {
    save: (position: ChatScrollPosition | null) => void
    read: () => ChatScrollPosition | null
  }
  forkAt: (seq: number) => void
  fileMentions: (owner: TurnTailOwnerProps) => MarkdownFileMentions | undefined
}

export interface OpenFileOptions {

  readonly line?: number
}

export interface TurnTailOwnerProps {
  turn: TurnLocation
  seq: number
  openFile: (path: string) => void
}

export interface ChatScrollPosition {
  readonly anchorKey: string
  readonly anchorTop: number
  readonly scrollTop: number
}
```


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `useChat` | `useChat: UseChat;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |

## CommandRowOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `CommandRowOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface CommandRowOwnerProps {
    node: CommandNode;
    compaction?: CompactionSummaryNode;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `node` | `node: CommandNode;` |
| `compaction` | `compaction?: CompactionSummaryNode;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## CommandRowProps client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `CommandRowProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type CommandRowProps = PropsRuntime<'conversation.chat.commandview'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `useChat` | `useChat: UseChat;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |

## MessageImagesProps client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `MessageImagesProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type MessageImagesProps = PropsRuntime<'conversation.chat.user.images' | 'conversation.chat.message.images'> & PropsRenderFactories;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `useChat` | `useChat: UseChat;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |

## OpenFileOptions client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `OpenFileOptions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface OpenFileOptions {
    readonly line?: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `line` | `readonly line?: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## PresentationInjected client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `PresentationInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PresentationInjected {
    hooks: {
        presentation: ObservableSnapshot<ChatPresentationPolicy>;
    };
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `hooks: { presentation: ObservableSnapshot<ChatPresentationPolicy>; };` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## QuotaNoticeCode client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `QuotaNoticeCode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type QuotaNoticeCode = 'QUOTA' | 'ACCOUNT_QUOTA';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## QuotaNoticeHostProps client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `QuotaNoticeHostProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type QuotaNoticeHostProps = PropsRuntime<'shell.overlay'> & PropsLocale<'chat'> & PropsRenderSlots<'shell.quota-notice'> & InjectFace<QuotaNoticeInjected>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface QuotaNoticeInjected {
  hooks: {

    notice: HostObservable<QuotaNoticeState | null>
  }

  dismissNotice: () => void

  keepNoticeOpen: () => () => void
}

export interface QuotaNoticeState {

  code: QuotaNoticeCode

  seq: number
}

export type QuotaNoticeCode = 'QUOTA' | 'ACCOUNT_QUOTA'
```

## QuotaNoticeInjected client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `QuotaNoticeInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface QuotaNoticeInjected {
    hooks: {
        notice: HostObservable<QuotaNoticeState | null>;
    };
    dismissNotice: () => void;
    keepNoticeOpen: () => () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `hooks: { notice: HostObservable<QuotaNoticeState \| null>; };` |
| `dismissNotice` | `dismissNotice: () => void;` |
| `keepNoticeOpen` | `keepNoticeOpen: () => () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface QuotaNoticeState {

  code: QuotaNoticeCode

  seq: number
}

export type QuotaNoticeCode = 'QUOTA' | 'ACCOUNT_QUOTA'
```

## QuotaNoticeOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `QuotaNoticeOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface QuotaNoticeOwnerProps {
    code: QuotaNoticeCode;
    message: string;
    dismiss: () => void;
    keepOpen: () => () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `code` | `code: QuotaNoticeCode;` |
| `message` | `message: string;` |
| `dismiss` | `dismiss: () => void;` |
| `keepOpen` | `keepOpen: () => () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type QuotaNoticeCode = 'QUOTA' | 'ACCOUNT_QUOTA'
```

## QuotaNoticeState client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `QuotaNoticeState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface QuotaNoticeState {
    code: QuotaNoticeCode;
    seq: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `code` | `code: QuotaNoticeCode;` |
| `seq` | `seq: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type QuotaNoticeCode = 'QUOTA' | 'ACCOUNT_QUOTA'
```

## ReasoningBodyOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ReasoningBodyOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ReasoningBodyOwnerProps {
    readonly text: string;
    readonly running: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `text` | `readonly text: string;` |
| `running` | `readonly running: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## ReasoningContentInput client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ReasoningContentInput`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ReasoningContentInput extends ReasoningBodyOwnerProps {
    readonly labels?: MarkdownLabels;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `labels` | `readonly labels?: MarkdownLabels;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ReasoningBodyOwnerProps {

  readonly text: string

  readonly running: boolean
}
```

## TurnProcessOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `TurnProcessOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TurnProcessOwnerProps {
    readonly hasContent: boolean;
    readonly spec: TurnProcessSpec;
    readonly foldable: boolean;
    readonly open: boolean;
    setOpen(open: boolean): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hasContent` | `readonly hasContent: boolean;` |
| `spec` | `readonly spec: TurnProcessSpec;` |
| `foldable` | `readonly foldable: boolean;` |
| `open` | `readonly open: boolean;` |
| `setOpen` | `setOpen(open: boolean): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## TurnTailOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `TurnTailOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TurnTailOwnerProps {
    turn: TurnLocation;
    seq: number;
    openFile: (path: string) => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `turn` | `turn: TurnLocation;` |
| `seq` | `seq: number;` |
| `openFile` | `openFile: (path: string) => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## UseChat client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `UseChat`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UseChat = SnapshotSelectorHook<ChatSnapshot>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## UseChatNodeTurnData client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `UseChatNodeTurnData`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UseChatNodeTurnData = <Key extends Extract<keyof ConversationTurnDataMap, string>>(key: Key) => Readonly<ConversationTurnDataMap[Key]> | undefined;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## UseDisclosure client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `UseDisclosure`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UseDisclosure = () => {
    readonly expanded: boolean;
    readonly setExpanded: (open: boolean) => void;
    readonly toggle: () => void;
};
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## UseGroupAction client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `UseGroupAction`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UseGroupAction = (hidden: boolean, reveal: () => void) => RefObject<HTMLDivElement>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## UseGroupHeaderAction client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `UseGroupHeaderAction`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UseGroupHeaderAction = (ref: RefObject<HTMLElement | null>, hidden: boolean) => void;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## UsePresentation client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `UsePresentation`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UsePresentation = SnapshotSelectorHook<ChatPresentationPolicy>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## UserContentAttachment client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `UserContentAttachment`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UserContentAttachment = {
    readonly type: 'image';
    readonly image: MessageImageSource;
} | {
    readonly type: 'file';
    readonly file: FileAttachmentRef;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## UserContentData client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `UserContentData`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface UserContentData {
    readonly text: string;
    readonly attachments: readonly UserContentAttachment[];
    readonly extraBlocks: readonly unknown[];
    readonly referenceLabels?: readonly string[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `text` | `readonly text: string;` |
| `attachments` | `readonly attachments: readonly UserContentAttachment[];` |
| `extraBlocks` | `readonly extraBlocks: readonly unknown[];` |
| `referenceLabels` | `readonly referenceLabels?: readonly string[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type UserContentAttachment =
  | { readonly type: 'image'; readonly image: MessageImageSource }
  | { readonly type: 'file'; readonly file: FileAttachmentRef }
```

## UserContentInput client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `UserContentInput`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface UserContentInput extends Pick<ChatNodeOwnerProps, 'loadImage'>, Pick<UserTextInput, 'interactive' | 'ellipsis'> {
    readonly content: UserContentData;
    readonly facts: Readonly<Partial<UserTextFacts>>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `content` | `readonly content: UserContentData;` |
| `facts` | `readonly facts: Readonly<Partial<UserTextFacts>>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface ChatNodeOwnerProps {

  groupPart?: string
  cwd?: string | undefined
  openFile: (path: string, options?: OpenFileOptions) => void
  inspectCall: ((callId: ToolCallId) => void) | undefined
  forkAt: (seq: number) => void

  loadImage: MessageImageLoader
  fileMentions: (owner: TurnTailOwnerProps) => MarkdownFileMentions | undefined

  turnProcess?: TurnProcessOwnerProps | undefined
}

export interface UserContentData {
  readonly text: string
  readonly attachments: readonly UserContentAttachment[]

  readonly extraBlocks: readonly unknown[]

  readonly referenceLabels?: readonly string[]
}

export interface TurnProcessOwnerProps {

  readonly hasContent: boolean
  readonly spec: TurnProcessSpec
  readonly foldable: boolean
  readonly open: boolean
  setOpen(open: boolean): void
}

export interface OpenFileOptions {

  readonly line?: number
}

export interface TurnTailOwnerProps {
  turn: TurnLocation
  seq: number
  openFile: (path: string) => void
}

export type UserContentAttachment =
  | { readonly type: 'image'; readonly image: MessageImageSource }
  | { readonly type: 'file'; readonly file: FileAttachmentRef }
```
