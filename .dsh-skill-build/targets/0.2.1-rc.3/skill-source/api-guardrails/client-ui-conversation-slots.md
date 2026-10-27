# ui-conversation：slots 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

会话内容、输入与呈现分别由注册表和标准 source 装配；SlotMap 的 owner props 只描述父级提供的数据，不等于可任意构造的运行时对象。读取 Session 投影与已持久结果后展示；不要在组件 render 期间提交消息或创建连接。自定义节点、视图、分组与输入命令须挂入各自的 definition registry，随插件清理。

## ComposerAttachment client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ComposerAttachment`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ComposerAttachment = ComposerImageAttachment | ComposerFileAttachment;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ComposerImageAttachment {
  kind: 'image'
  id: DraftAttachmentId
  file: File
  previewUrl: string

  width?: number

  height?: number
}

export interface ComposerFileAttachment {
  kind: 'file'
  id: DraftAttachmentId
  file: File
}
```

## ComposerAttachmentsOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ComposerAttachmentsOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ComposerAttachmentsOwnerProps {
    attachments: readonly ComposerAttachment[];
    canAcceptDrop: boolean;
    onAddFiles: (files: readonly File[], directories?: ReadonlySet<File>) => void;
    onRemoveAttachment: (id: DraftAttachmentId) => void;
    uploads: DraftFileUploads;
    onRetryFile: (id: DraftAttachmentId) => void;
    dropLimits?: {
        readonly count: number;
        readonly size: string;
    } | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `attachments` | `attachments: readonly ComposerAttachment[];` |
| `canAcceptDrop` | `canAcceptDrop: boolean;` |
| `onAddFiles` | `onAddFiles: (files: readonly File[], directories?: ReadonlySet<File>) => void;` |
| `onRemoveAttachment` | `onRemoveAttachment: (id: DraftAttachmentId) => void;` |
| `uploads` | `uploads: DraftFileUploads;` |
| `onRetryFile` | `onRetryFile: (id: DraftAttachmentId) => void;` |
| `dropLimits` | `dropLimits?: { readonly count: number; readonly size: string; } \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ComposerAttachment = ComposerImageAttachment | ComposerFileAttachment

export interface ComposerImageAttachment {
  kind: 'image'
  id: DraftAttachmentId
  file: File
  previewUrl: string

  width?: number

  height?: number
}

export interface ComposerFileAttachment {
  kind: 'file'
  id: DraftAttachmentId
  file: File
}

export type DraftFileUpload =
  | { readonly status: 'uploading'; readonly loaded: number; readonly total?: number }
  | { readonly status: 'ready'; readonly receiptId: FileUploadReceiptId; readonly file: FileAttachmentRef }
  | { readonly status: 'error'; readonly message: string }

export type DraftFileUploads = Readonly<Record<string, DraftFileUpload>>
```

## ComposerAttachmentsProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ComposerAttachmentsProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ComposerAttachmentsProps = PropsRuntime<'conversation.input.attachments'> & PropsLocale<'conversation'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `inputActions` | `inputActions: InputActions \| undefined;` | 来自 `SessionMaybeStandardProps` 的公开继承或联合分支 |
| `useConversation` | `useConversation: MaybeSnapshotSelectorHook<ConversationSnapshot>;` | 来自 `SessionMaybeStandardProps` 的公开继承或联合分支 |
| `useInput` | `useInput: MaybeSnapshotSelectorHook<InputState>;` | 来自 `SessionMaybeStandardProps` 的公开继承或联合分支 |
| `useWorkspaces` | `useWorkspaces: SnapshotSelectorHook<WorkspaceSnapshot>;` | 来自 `GlobalStandardProps` 的公开继承或联合分支 |

## ComposerBarInjected client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ComposerBarInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ComposerBarInjected {
    keyboard: ComposerKeyboard | undefined;
    addFiles: ((files: readonly File[], directories?: ReadonlySet<File>) => string | null) | undefined;
    removeAttachment: ((id: DraftAttachmentId) => void) | undefined;
    resolveDraftAttachments: ((ids: readonly DraftAttachmentId[]) => readonly ComposerAttachment[]) | undefined;
    retryFileUpload: ((id: DraftAttachmentId) => void) | undefined;
    toggleCommandMenu: ((selection: EditSelection) => void) | undefined;
    stop: (() => void) | undefined;
    hooks: {
        stopShortcut: ObservableSnapshot<readonly string[]>;
        busyEnter: ObservableSnapshot<BusyEnterBehavior>;
        fileUploads: ObservableSnapshot<DraftFileUploads>;
        notices: ObservableSnapshot<InputNotice | null>;
        lexicon: ObservableSnapshot<ReadonlyMap<'/' | '@', readonly string[]>>;
        menuLauncher: ObservableSnapshot<string | null>;
    };
}
```

| 成员 | 公开声明 |
| --- | --- |
| `keyboard` | `keyboard: ComposerKeyboard \| undefined;` |
| `addFiles` | `addFiles: ((files: readonly File[], directories?: ReadonlySet<File>) => string \| null) \| undefined;` |
| `removeAttachment` | `removeAttachment: ((id: DraftAttachmentId) => void) \| undefined;` |
| `resolveDraftAttachments` | `resolveDraftAttachments: ((ids: readonly DraftAttachmentId[]) => readonly ComposerAttachment[]) \| undefined;` |
| `retryFileUpload` | `retryFileUpload: ((id: DraftAttachmentId) => void) \| undefined;` |
| `toggleCommandMenu` | `toggleCommandMenu: ((selection: EditSelection) => void) \| undefined;` |
| `stop` | `stop: (() => void) \| undefined;` |
| `hooks` | `hooks: { stopShortcut: ObservableSnapshot<readonly string[]>; busyEnter: ObservableSnapshot<BusyEnterBehavior>; fileUploads: ObservableSnapshot<DraftFileUploads>; notices: ObservableSnapshot<InputNotice \| null>; lexicon: ObservableSnapshot<ReadonlyMap<'/' \| '@', readonly string[]>>; menuLauncher: ObservableSnapshot<string \| null>; };` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ComposerAttachment = ComposerImageAttachment | ComposerFileAttachment

export interface ComposerImageAttachment {
  kind: 'image'
  id: DraftAttachmentId
  file: File
  previewUrl: string

  width?: number

  height?: number
}

export interface ComposerFileAttachment {
  kind: 'file'
  id: DraftAttachmentId
  file: File
}

export type DraftFileUpload =
  | { readonly status: 'uploading'; readonly loaded: number; readonly total?: number }
  | { readonly status: 'ready'; readonly receiptId: FileUploadReceiptId; readonly file: FileAttachmentRef }
  | { readonly status: 'error'; readonly message: string }

export type DraftFileUploads = Readonly<Record<string, DraftFileUpload>>
```

## ComposerBarOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ComposerBarOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ComposerBarOwnerProps {
    variant: 'hero' | 'composer';
    blocked?: {
        readonly reason: string;
    };
    disabled?: boolean;
    workspacePickerOpen?: boolean;
    onRequestWorkspace?: () => void;
    placeholder?: string;
    accessory?: ReactNode;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `variant` | `variant: 'hero' \| 'composer';` |
| `blocked` | `blocked?: { readonly reason: string; };` |
| `disabled` | `disabled?: boolean;` |
| `workspacePickerOpen` | `workspacePickerOpen?: boolean;` |
| `onRequestWorkspace` | `onRequestWorkspace?: () => void;` |
| `placeholder` | `placeholder?: string;` |
| `accessory` | `accessory?: ReactNode;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ComposerBarProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ComposerBarProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ComposerBarProps = PropsRuntime<'conversation.composer.bar'> & PropsRenderSlots<'conversation.input.attachments' | 'conversation.input.overlay' | 'conversation.input.permission' | 'conversation.input.left' | 'conversation.input.plan' | 'conversation.input.right' | 'conversation.input.model' | 'conversation.input.activity' | 'conversation.composer.dock'> & InjectFace<ComposerBarInjected> & PropsLocale<'conversation'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ComposerBarInjected {
  keyboard: ComposerKeyboard | undefined

  addFiles: ((files: readonly File[], directories?: ReadonlySet<File>) => string | null) | undefined
  removeAttachment: ((id: DraftAttachmentId) => void) | undefined
  resolveDraftAttachments: ((ids: readonly DraftAttachmentId[]) => readonly ComposerAttachment[]) | undefined

  retryFileUpload: ((id: DraftAttachmentId) => void) | undefined
  toggleCommandMenu: ((selection: EditSelection) => void) | undefined
  stop: (() => void) | undefined
  hooks: {

    stopShortcut: ObservableSnapshot<readonly string[]>

    busyEnter: ObservableSnapshot<BusyEnterBehavior>

    fileUploads: ObservableSnapshot<DraftFileUploads>
    notices: ObservableSnapshot<InputNotice | null>
    lexicon: ObservableSnapshot<ReadonlyMap<'/' | '@', readonly string[]>>
    menuLauncher: ObservableSnapshot<string | null>
  }
}

export type ComposerAttachment = ComposerImageAttachment | ComposerFileAttachment

export interface ComposerImageAttachment {
  kind: 'image'
  id: DraftAttachmentId
  file: File
  previewUrl: string

  width?: number

  height?: number
}

export interface ComposerFileAttachment {
  kind: 'file'
  id: DraftAttachmentId
  file: File
}

export type DraftFileUploads = Readonly<Record<string, DraftFileUpload>>

export type DraftFileUpload =
  | { readonly status: 'uploading'; readonly loaded: number; readonly total?: number }
  | { readonly status: 'ready'; readonly receiptId: FileUploadReceiptId; readonly file: FileAttachmentRef }
  | { readonly status: 'error'; readonly message: string }
```


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `inputActions` | `inputActions: InputActions \| undefined;` | 来自 `SessionMaybeStandardProps` 的公开继承或联合分支 |
| `useConversation` | `useConversation: MaybeSnapshotSelectorHook<ConversationSnapshot>;` | 来自 `SessionMaybeStandardProps` 的公开继承或联合分支 |
| `useInput` | `useInput: MaybeSnapshotSelectorHook<InputState>;` | 来自 `SessionMaybeStandardProps` 的公开继承或联合分支 |
| `useWorkspaces` | `useWorkspaces: SnapshotSelectorHook<WorkspaceSnapshot>;` | 来自 `GlobalStandardProps` 的公开继承或联合分支 |

## ComposerChainProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ComposerChainProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ComposerChainProps {
    sessionId: SessionId | undefined;
    session: SessionSnapshot | undefined;
    pendingInteraction: SessionPendingInteraction | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `sessionId` | `sessionId: SessionId \| undefined;` |
| `session` | `session: SessionSnapshot \| undefined;` |
| `pendingInteraction` | `pendingInteraction: SessionPendingInteraction \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ComposerFileAttachment client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ComposerFileAttachment`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ComposerFileAttachment {
    kind: 'file';
    id: DraftAttachmentId;
    file: File;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `kind: 'file';` |
| `id` | `id: DraftAttachmentId;` |
| `file` | `file: File;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ComposerImageAttachment client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ComposerImageAttachment`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ComposerImageAttachment {
    kind: 'image';
    id: DraftAttachmentId;
    file: File;
    previewUrl: string;
    width?: number;
    height?: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `kind: 'image';` |
| `id` | `id: DraftAttachmentId;` |
| `file` | `file: File;` |
| `previewUrl` | `previewUrl: string;` |
| `width` | `width?: number;` |
| `height` | `height?: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConvViewOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConvViewOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConvViewOwnerProps {
    inspectCall: ((callId: string) => void) | undefined;
    viewRequest: import('./views.ts').ConversationViewRequest | null;
    openView: (view: string, focus: string) => void;
    completeViewRequest: () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `inspectCall` | `inspectCall: ((callId: string) => void) \| undefined;` |
| `viewRequest` | `viewRequest: import('./views.ts').ConversationViewRequest \| null;` |
| `openView` | `openView: (view: string, focus: string) => void;` |
| `completeViewRequest` | `completeViewRequest: () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConvViewProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConvViewProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConvViewProps = PropsRuntime<'conversation.view'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `inputActions` | `inputActions: InputActions;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |
| `useConversation` | `useConversation: UseConversation;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |
| `useInput` | `useInput: SnapshotSelectorHook<InputState>;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |
| `useWorkspaces` | `useWorkspaces: SnapshotSelectorHook<WorkspaceSnapshot>;` | 来自 `GlobalStandardProps` 的公开继承或联合分支 |

## ConversationContentInputProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationContentInputProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationContentInputProps {
    variant: 'main' | 'embedded';
    phase: 'settling' | 'hero' | 'active';
    hero: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `variant` | `variant: 'main' \| 'embedded';` |
| `phase` | `phase: 'settling' \| 'hero' \| 'active';` |
| `hero` | `hero: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationContentProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationContentProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationContentProps = FactoryComponentPropsOf<'conversation.content'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `inputActions` | `inputActions: InputActions \| undefined;` | 来自 `SessionMaybeStandardProps` 的公开继承或联合分支 |
| `useConversation` | `useConversation: MaybeSnapshotSelectorHook<ConversationSnapshot>;` | 来自 `SessionMaybeStandardProps` 的公开继承或联合分支 |
| `useInput` | `useInput: MaybeSnapshotSelectorHook<InputState>;` | 来自 `SessionMaybeStandardProps` 的公开继承或联合分支 |
| `useWorkspaces` | `useWorkspaces: SnapshotSelectorHook<WorkspaceSnapshot>;` | 来自 `GlobalStandardProps` 的公开继承或联合分支 |

## ConversationHeaderActionOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationHeaderActionOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationHeaderActionOwnerProps {
    children?: never;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `children` | `children?: never;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationHeaderCornerOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationHeaderCornerOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationHeaderCornerOwnerProps {
    children?: never;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `children` | `children?: never;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationHeaderLineageOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationHeaderLineageOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationHeaderLineageOwnerProps {
    lineageSessionId: SessionId;
    displayTitle: string;
    openTitle?: () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `lineageSessionId` | `lineageSessionId: SessionId;` |
| `displayTitle` | `displayTitle: string;` |
| `openTitle` | `openTitle?: () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationInjected client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationInjected {
    selectWorkspace: (workspaceId: WorkspaceId) => Promise<void>;
    hooks: {
        composerBlock: ObservableSnapshot<ComposerBlock | undefined>;
    };
}
```

| 成员 | 公开声明 |
| --- | --- |
| `selectWorkspace` | `selectWorkspace: (workspaceId: WorkspaceId) => Promise<void>;` |
| `hooks` | `hooks: { composerBlock: ObservableSnapshot<ComposerBlock \| undefined>; };` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationSessionHeaderInjected client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationSessionHeaderInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationSessionHeaderInjected {
    readonly hooks: {
        readonly conversationViews: ObservableSnapshot<readonly ViewTab[]>;
        readonly entryPins: ObservableSnapshot<readonly string[]>;
        readonly entryActions: ObservableSnapshot<boolean>;
    };
    setPinned: (id: string, pinned: boolean) => void;
    open: (sessionId: SessionId) => void;
    selectView: (view: string) => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `readonly hooks: { readonly conversationViews: ObservableSnapshot<readonly ViewTab[]>; readonly entryPins: ObservableSnapshot<readonly string[]>; readonly entryActions: ObservableSnapshot<boolean>; };` |
| `setPinned` | `setPinned: (id: string, pinned: boolean) => void;` |
| `open` | `open: (sessionId: SessionId) => void;` |
| `selectView` | `selectView: (view: string) => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationSessionHeaderSlotProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationSessionHeaderSlotProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationSessionHeaderSlotProps = PropsRuntime<'conversation.session.header'> & PropsRenderSlots<'conversation.session.header.lineage' | 'conversation.session.header.actions' | 'conversation.session.header.utilities' | 'conversation.session.header.corner' | 'conversation.session.header.views.actions'> & PropsStore<ConversationStore> & InjectFace<ConversationSessionHeaderInjected> & PropsLocale<'conversation'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConversationSessionHeaderInjected {

  readonly hooks: {
    readonly conversationViews: ObservableSnapshot<readonly ViewTab[]>

    readonly entryPins: ObservableSnapshot<readonly string[]>

    readonly entryActions: ObservableSnapshot<boolean>
  }

  setPinned: (id: string, pinned: boolean) => void

  open: (sessionId: SessionId) => void

  selectView: (view: string) => void
}

export type ConversationStore = ReturnType<typeof createConversationStore>
```


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `inputActions` | `inputActions: InputActions;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |
| `useConversation` | `useConversation: UseConversation;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |
| `useInput` | `useInput: SnapshotSelectorHook<InputState>;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |
| `useWorkspaces` | `useWorkspaces: SnapshotSelectorHook<WorkspaceSnapshot>;` | 来自 `GlobalStandardProps` 的公开继承或联合分支 |

## ConversationSessionInjected client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationSessionInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationSessionInjected {
    readonly hooks: {
        readonly conversationViews: ObservableSnapshot<readonly ViewTab[]>;
        readonly inspectCall: ObservableSnapshot<ConvViewOwnerProps['inspectCall']>;
    };
    bindDraftPersistence: (write: (draft: DraftSnapshot) => void) => () => void;
    openView: (view: string, focus: string) => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `readonly hooks: { readonly conversationViews: ObservableSnapshot<readonly ViewTab[]>; readonly inspectCall: ObservableSnapshot<ConvViewOwnerProps['inspectCall']>; };` |
| `bindDraftPersistence` | `bindDraftPersistence: (write: (draft: DraftSnapshot) => void) => () => void;` |
| `openView` | `openView: (view: string, focus: string) => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConvViewOwnerProps {

  inspectCall: ((callId: string) => void) | undefined

  viewRequest: import('./views.ts').ConversationViewRequest | null

  openView: (view: string, focus: string) => void

  completeViewRequest: () => void
}
```

## ConversationSessionSlotProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationSessionSlotProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationSessionSlotProps = PropsRuntime<'conversation.session'> & PropsRenderSlots<'conversation.view'> & PropsStore<ConversationStore> & InjectFace<ConversationSessionInjected>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConversationSessionInjected {

  readonly hooks: {
    readonly conversationViews: ObservableSnapshot<readonly ViewTab[]>
    readonly inspectCall: ObservableSnapshot<ConvViewOwnerProps['inspectCall']>
  }

  bindDraftPersistence: (write: (draft: DraftSnapshot) => void) => () => void

  openView: (view: string, focus: string) => void
}

export type ConversationStore = ReturnType<typeof createConversationStore>

export interface ConvViewOwnerProps {

  inspectCall: ((callId: string) => void) | undefined

  viewRequest: import('./views.ts').ConversationViewRequest | null

  openView: (view: string, focus: string) => void

  completeViewRequest: () => void
}
```


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `inputActions` | `inputActions: InputActions;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |
| `useConversation` | `useConversation: UseConversation;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |
| `useInput` | `useInput: SnapshotSelectorHook<InputState>;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |
| `useWorkspaces` | `useWorkspaces: SnapshotSelectorHook<WorkspaceSnapshot>;` | 来自 `GlobalStandardProps` 的公开继承或联合分支 |

## ConversationSlotProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationSlotProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationSlotProps = PropsRuntime<'main.conversation'> & PropsRenderSlots<'conversation.header'> & PropsRenderFactories;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `inputActions` | `inputActions: InputActions \| undefined;` | 来自 `SessionMaybeStandardProps` 的公开继承或联合分支 |
| `useConversation` | `useConversation: MaybeSnapshotSelectorHook<ConversationSnapshot>;` | 来自 `SessionMaybeStandardProps` 的公开继承或联合分支 |
| `useInput` | `useInput: MaybeSnapshotSelectorHook<InputState>;` | 来自 `SessionMaybeStandardProps` 的公开继承或联合分支 |
| `useWorkspaces` | `useWorkspaces: SnapshotSelectorHook<WorkspaceSnapshot>;` | 来自 `GlobalStandardProps` 的公开继承或联合分支 |

## ConversationStore client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationStore`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationStore = ReturnType<typeof createConversationStore>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationViewActionEntry client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationViewActionEntry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationViewActionEntry {
    readonly id: string;
    readonly label: string;
    readonly pinned: boolean;
    readonly active?: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `readonly id: string;` |
| `label` | `readonly label: string;` |
| `pinned` | `readonly pinned: boolean;` |
| `active` | `readonly active?: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationViewActionsOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationViewActionsOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationViewActionsOwnerProps {
    readonly entries: readonly ConversationViewActionEntry[];
    readonly onOpen: (id: string) => void;
    readonly onPinnedChange: (id: string, pinned: boolean) => void;
    readonly onDismiss: () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `entries` | `readonly entries: readonly ConversationViewActionEntry[];` |
| `onOpen` | `readonly onOpen: (id: string) => void;` |
| `onPinnedChange` | `readonly onPinnedChange: (id: string, pinned: boolean) => void;` |
| `onDismiss` | `readonly onDismiss: () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConversationViewActionEntry {

  readonly id: string

  readonly label: string

  readonly pinned: boolean

  readonly active?: boolean
}
```

## ConversationViewsProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationViewsProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationViewsProps = FactoryLocalComponentPropsOf<'conversation.content', 'views'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `inputActions` | `inputActions: InputActions;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |
| `useConversation` | `useConversation: UseConversation;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |
| `useInput` | `useInput: SnapshotSelectorHook<InputState>;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |
| `useWorkspaces` | `useWorkspaces: SnapshotSelectorHook<WorkspaceSnapshot>;` | 来自 `GlobalStandardProps` 的公开继承或联合分支 |

## ConversationWidthControlsInputProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationWidthControlsInputProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationWidthControlsInputProps {
    container: HTMLDivElement | null;
    phase: ConversationContentInputProps['phase'];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `container` | `container: HTMLDivElement \| null;` |
| `phase` | `phase: ConversationContentInputProps['phase'];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConversationContentInputProps {
  variant: 'main' | 'embedded'
  phase: 'settling' | 'hero' | 'active'
  hero: boolean
}
```

## ConversationWidthControlsProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationWidthControlsProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationWidthControlsProps = FactoryLocalComponentPropsOf<'conversation.content', 'widthControls'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `useWorkspaces` | `useWorkspaces: SnapshotSelectorHook<WorkspaceSnapshot>;` | 来自 `GlobalStandardProps` 的公开继承或联合分支 |

## DraftFileUpload client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `DraftFileUpload`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DraftFileUpload = {
    readonly status: 'uploading';
    readonly loaded: number;
    readonly total?: number;
} | {
    readonly status: 'ready';
    readonly receiptId: FileUploadReceiptId;
    readonly file: FileAttachmentRef;
} | {
    readonly status: 'error';
    readonly message: string;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## DraftFileUploads client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `DraftFileUploads`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DraftFileUploads = Readonly<Record<string, DraftFileUpload>>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type DraftFileUpload =
  | { readonly status: 'uploading'; readonly loaded: number; readonly total?: number }
  | { readonly status: 'ready'; readonly receiptId: FileUploadReceiptId; readonly file: FileAttachmentRef }
  | { readonly status: 'error'; readonly message: string }
```

## EmptyWorkspaceOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `EmptyWorkspaceOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface EmptyWorkspaceOwnerProps {
    open: boolean;
    anchorRef?: RefObject<HTMLElement>;
    selectedId?: WorkspaceId | undefined;
    onPick: (workspaceId: WorkspaceId) => void;
    onClose: () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `open` | `open: boolean;` |
| `anchorRef` | `anchorRef?: RefObject<HTMLElement>;` |
| `selectedId` | `selectedId?: WorkspaceId \| undefined;` |
| `onPick` | `onPick: (workspaceId: WorkspaceId) => void;` |
| `onClose` | `onClose: () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## HeroAgentPresetOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `HeroAgentPresetOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface HeroAgentPresetOwnerProps {
    children?: never;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `children` | `children?: never;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## HeroBrandMarkOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `HeroBrandMarkOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface HeroBrandMarkOwnerProps {
    size: number;
    className?: string | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `size` | `size: number;` |
| `className` | `className?: string \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## InputControlOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `InputControlOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface InputControlOwnerProps {
    locked: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `locked` | `locked: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## InputZone client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `InputZone`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface InputZone {
    readonly session: SessionSnapshot;
    readonly input: InputState;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `session` | `readonly session: SessionSnapshot;` |
| `input` | `readonly input: InputState;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## MessageImageLabels client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `MessageImageLabels`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface MessageImageLabels {
    image: string;
    open: string;
    openNamed: (label: string) => string;
    loading: string;
    loadFailed: string;
    lightbox: ImageLightboxLabels;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `image` | `image: string;` |
| `open` | `open: string;` |
| `openNamed` | `openNamed: (label: string) => string;` |
| `loading` | `loading: string;` |
| `loadFailed` | `loadFailed: string;` |
| `lightbox` | `lightbox: ImageLightboxLabels;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## MessageImageLoader client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `MessageImageLoader`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type MessageImageLoader = ((attachment: ImageAttachmentRef) => Promise<string>) & {
    peek?: (attachment: ImageAttachmentRef) => string | undefined;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## MessageImageSource client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `MessageImageSource`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type MessageImageSource = {
    readonly attachment: ImageAttachmentRef;
    readonly label?: string;
} | {
    readonly preview: {
        readonly url: string;
        readonly name?: string;
        readonly width?: number;
        readonly height?: number;
    };
};
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## MessageImagesContentInput client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `MessageImagesContentInput`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface MessageImagesContentInput extends MessageImagesOwnerProps {
    readonly labels?: MessageImageLabels;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `labels` | `readonly labels?: MessageImageLabels;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type MessageImageSource =
  | {
    readonly attachment: ImageAttachmentRef

    readonly label?: string
  }
  | {
    readonly preview: {

      readonly url: string
      readonly name?: string

      readonly width?: number

      readonly height?: number
    }
  }

export type MessageImageLoader = ((attachment: ImageAttachmentRef) => Promise<string>) & {
  peek?: (attachment: ImageAttachmentRef) => string | undefined
}

export interface MessageImagesOwnerProps {

  images: readonly MessageImageSource[]

  loadImage: MessageImageLoader

  align: 'start' | 'end'

  compact?: boolean

  thumbnail?: boolean
}

export interface MessageImageLabels {

  image: string

  open: string

  openNamed: (label: string) => string

  loading: string

  loadFailed: string

  lightbox: ImageLightboxLabels
}
```

## MessageImagesOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `MessageImagesOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface MessageImagesOwnerProps {
    images: readonly MessageImageSource[];
    loadImage: MessageImageLoader;
    align: 'start' | 'end';
    compact?: boolean;
    thumbnail?: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `images` | `images: readonly MessageImageSource[];` |
| `loadImage` | `loadImage: MessageImageLoader;` |
| `align` | `align: 'start' \| 'end';` |
| `compact` | `compact?: boolean;` |
| `thumbnail` | `thumbnail?: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type MessageImageSource =
  | {
    readonly attachment: ImageAttachmentRef

    readonly label?: string
  }
  | {
    readonly preview: {

      readonly url: string
      readonly name?: string

      readonly width?: number

      readonly height?: number
    }
  }

export type MessageImageLoader = ((attachment: ImageAttachmentRef) => Promise<string>) & {
  peek?: (attachment: ImageAttachmentRef) => string | undefined
}
```

## UseConversation client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `UseConversation`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UseConversation = SnapshotSelectorHook<ConversationSnapshot>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## UseConversationViews client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `UseConversationViews`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UseConversationViews = SnapshotSelectorHook<readonly ViewTab[]>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## UserTextInjected client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `UserTextInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface UserTextInjected {
    hooks: {
        userTextRevision: ObservableSnapshot<number>;
    };
    createUserTextEvaluator: () => UserTextEvaluator;
    reportTransformFailure: (error: unknown) => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `hooks: { userTextRevision: ObservableSnapshot<number>; };` |
| `createUserTextEvaluator` | `createUserTextEvaluator: () => UserTextEvaluator;` |
| `reportTransformFailure` | `reportTransformFailure: (error: unknown) => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## UserTextInput client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `UserTextInput`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface UserTextInput extends UserTextDocumentInput {
    readonly interactive?: boolean;
    readonly ellipsis?: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `interactive` | `readonly interactive?: boolean;` |
| `ellipsis` | `readonly ellipsis?: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## UserTextNodeOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `UserTextNodeOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface UserTextNodeOwnerProps {
    readonly raw: string;
    readonly interactive: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `raw` | `readonly raw: string;` |
| `interactive` | `readonly interactive: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## UserTextNodeProps client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `UserTextNodeProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UserTextNodeProps<Id extends UserTextId = UserTextId> = PropsRuntime<'conversation.user.text.node', Id>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。



继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `inputActions` | `inputActions: InputActions;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |
| `useConversation` | `useConversation: UseConversation;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |
| `useInput` | `useInput: SnapshotSelectorHook<InputState>;` | 来自 `SessionStandardProps` 的公开继承或联合分支 |
| `useWorkspaces` | `useWorkspaces: SnapshotSelectorHook<WorkspaceSnapshot>;` | 来自 `GlobalStandardProps` 的公开继承或联合分支 |
