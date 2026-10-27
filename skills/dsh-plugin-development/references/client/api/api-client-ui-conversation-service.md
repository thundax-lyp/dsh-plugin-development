# ui-conversation：service 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

会话内容、输入与呈现分别由注册表和标准 source 装配；SlotMap 的 owner props 只描述父级提供的数据，不等于可任意构造的运行时对象。读取 Session 投影与已持久结果后展示；不要在组件 render 期间提交消息或创建连接。自定义节点、视图、分组与输入命令须挂入各自的 definition registry，随插件清理。

## ConversationController client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationController`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class ConversationController extends Service implements IConversation {
    readonly input: SessionInputResolver;
    readonly blocks: ComposerBlocks;
    readonly fileUploads: SnapshotStore<Record<string, DraftFileUpload>>;
    constructor(ctx: Context, config: {
        input: SessionInputResolver;
        blocks: ComposerBlocks;
        maxConcurrentFileUploads: number;
    });
    send(text: string): Promise<void>;
    sendSession(session: SessionFace, text: string, attachmentIds: readonly DraftAttachmentId[], mode: InputSubmitMode, signal?: AbortSignal): Promise<SubmitOutcome>;
    createDrafts(sessionId: SessionId, files: readonly File[]): readonly ComposerAttachment[];
    retryFileUpload(sessionId: SessionId, id: DraftAttachmentId): void;
    rebindDraftFiles(sessionId: SessionId, ids: readonly DraftAttachmentId[]): void;
    resolveDraftAttachments(ids: readonly DraftAttachmentId[]): readonly ComposerAttachment[];
    serializeDraftAttachments(attachmentIds: readonly DraftAttachmentId[]): Promise<DraftAttachmentSerializationResult>;
    releaseDraftAttachment(id: DraftAttachmentId): void;
    releaseDraftAttachments(attachments: readonly ComposerAttachment[]): void;
    updateQueue(itemId: MessageId, action: QueueAction): Promise<void>;
    cancel(): Promise<void>;
    loadOlder(): Promise<void>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `input` | `readonly input: SessionInputResolver;` |
| `blocks` | `readonly blocks: ComposerBlocks;` |
| `fileUploads` | `readonly fileUploads: SnapshotStore<Record<string, DraftFileUpload>>;` |
| `constructor` | `constructor(ctx: Context, config: { input: SessionInputResolver; blocks: ComposerBlocks; maxConcurrentFileUploads: number; });` |
| `send` | `send(text: string): Promise<void>;` |
| `sendSession` | `sendSession(session: SessionFace, text: string, attachmentIds: readonly DraftAttachmentId[], mode: InputSubmitMode, signal?: AbortSignal): Promise<SubmitOutcome>;` |
| `createDrafts` | `createDrafts(sessionId: SessionId, files: readonly File[]): readonly ComposerAttachment[];` |
| `retryFileUpload` | `retryFileUpload(sessionId: SessionId, id: DraftAttachmentId): void;` |
| `rebindDraftFiles` | `rebindDraftFiles(sessionId: SessionId, ids: readonly DraftAttachmentId[]): void;` |
| `resolveDraftAttachments` | `resolveDraftAttachments(ids: readonly DraftAttachmentId[]): readonly ComposerAttachment[];` |
| `serializeDraftAttachments` | `serializeDraftAttachments(attachmentIds: readonly DraftAttachmentId[]): Promise<DraftAttachmentSerializationResult>;` |
| `releaseDraftAttachment` | `releaseDraftAttachment(id: DraftAttachmentId): void;` |
| `releaseDraftAttachments` | `releaseDraftAttachments(attachments: readonly ComposerAttachment[]): void;` |
| `updateQueue` | `updateQueue(itemId: MessageId, action: QueueAction): Promise<void>;` |
| `cancel` | `cancel(): Promise<void>;` |
| `loadOlder` | `loadOlder(): Promise<void>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## IConversation client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `IConversation`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface IConversation {
    readonly input: SessionInputResolver;
    readonly blocks: ComposerBlocks;
    send(text: string): Promise<void>;
    updateQueue(itemId: MessageId, action: QueueAction): Promise<void>;
    cancel(): Promise<void>;
    loadOlder(): Promise<void>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `input` | `readonly input: SessionInputResolver;` |
| `blocks` | `readonly blocks: ComposerBlocks;` |
| `send` | `send(text: string): Promise<void>;` |
| `updateQueue` | `updateQueue(itemId: MessageId, action: QueueAction): Promise<void>;` |
| `cancel` | `cancel(): Promise<void>;` |
| `loadOlder` | `loadOlder(): Promise<void>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## UnsupportedImageMediaTypeError client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `UnsupportedImageMediaTypeError`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class UnsupportedImageMediaTypeError extends Error {
    readonly mediaType: string;
    constructor(mediaType: string);
}
```

| 成员 | 公开声明 |
| --- | --- |
| `mediaType` | `readonly mediaType: string;` |
| `constructor` | `constructor(mediaType: string);` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。
