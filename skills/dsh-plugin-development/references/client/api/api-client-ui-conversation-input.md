# ui-conversation：input 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

会话内容、输入与呈现分别由注册表和标准 source 装配；SlotMap 的 owner props 只描述父级提供的数据，不等于可任意构造的运行时对象。读取 Session 投影与已持久结果后展示；不要在组件 render 期间提交消息或创建连接。自定义节点、视图、分组与输入命令须挂入各自的 definition registry，随插件清理。

## BeginCommandRequest client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `BeginCommandRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface BeginCommandRequest {
    readonly claim: CommandClaim;
    readonly span: TokenSpan;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `claim` | `readonly claim: CommandClaim;` |
| `span` | `readonly span: TokenSpan;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface CommandClaim {

  readonly name: string

  readonly token: string
  readonly hint?: string
  readonly attachments?: boolean

  submit(args: string, actx: Context, attachments: readonly SubmitAttachment[]): Promise<SubmitOutcome>
}

export type SubmitAttachment =
  | {
    readonly type: 'image'
    readonly mediaType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif'
    readonly data: string
    readonly name?: string
  }
  | { readonly type: 'file'; readonly receiptId: string }

export interface SubmitOutcome {
  readonly kind: 'success' | 'error'
  readonly text?: string
}
```

## CommandClaim client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `CommandClaim`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface CommandClaim {
    readonly name: string;
    readonly token: string;
    readonly hint?: string;
    readonly attachments?: boolean;
    submit(args: string, actx: Context, attachments: readonly SubmitAttachment[]): Promise<SubmitOutcome>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `name` | `readonly name: string;` |
| `token` | `readonly token: string;` |
| `hint` | `readonly hint?: string;` |
| `attachments` | `readonly attachments?: boolean;` |
| `submit` | `submit(args: string, actx: Context, attachments: readonly SubmitAttachment[]): Promise<SubmitOutcome>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SubmitAttachment =
  | {
    readonly type: 'image'
    readonly mediaType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif'
    readonly data: string
    readonly name?: string
  }
  | { readonly type: 'file'; readonly receiptId: string }

export interface SubmitOutcome {
  readonly kind: 'success' | 'error'
  readonly text?: string
}
```

## ConsumeTokenRequest client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConsumeTokenRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConsumeTokenRequest {
    readonly guard: {
        readonly kind: 'span';
        readonly span: TokenSpan;
    } | {
        readonly kind: 'bare-token';
        readonly token: string;
    };
}
```

| 成员 | 公开声明 |
| --- | --- |
| `guard` | `readonly guard: { readonly kind: 'span'; readonly span: TokenSpan; } \| { readonly kind: 'bare-token'; readonly token: string; };` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## DraftAttachmentId client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `DraftAttachmentId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DraftAttachmentId = Branded<'DraftAttachmentId'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## DraftInitializationOptions client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `DraftInitializationOptions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DraftInitializationOptions {
    readonly prompt?: string;
    readonly clearPreviousDraft?: boolean;
    readonly whenDraftExists?: 'replace' | 'append' | 'keep';
}
```

| 成员 | 公开声明 |
| --- | --- |
| `prompt` | `readonly prompt?: string;` |
| `clearPreviousDraft` | `readonly clearPreviousDraft?: boolean;` |
| `whenDraftExists` | `readonly whenDraftExists?: 'replace' \| 'append' \| 'keep';` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## DraftInitializationResult client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `DraftInitializationResult`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DraftInitializationResult = 'applied' | 'preserved' | 'blocked';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## InputActions client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `InputActions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface InputActions {
    captureInsertion(): TokenSpan;
    insertText(text: string, span: TokenSpan): boolean;
    setDraft(text: string): void;
    persistDraft(): void;
    addAttachments(ids: readonly DraftAttachmentId[]): boolean;
    removeAttachment(id: DraftAttachmentId): void;
    pruneAttachments(ids: readonly DraftAttachmentId[]): void;
    submit(): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `captureInsertion` | `captureInsertion(): TokenSpan;` |
| `insertText` | `insertText(text: string, span: TokenSpan): boolean;` |
| `setDraft` | `setDraft(text: string): void;` |
| `persistDraft` | `persistDraft(): void;` |
| `addAttachments` | `addAttachments(ids: readonly DraftAttachmentId[]): boolean;` |
| `removeAttachment` | `removeAttachment(id: DraftAttachmentId): void;` |
| `pruneAttachments` | `pruneAttachments(ids: readonly DraftAttachmentId[]): void;` |
| `submit` | `submit(): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type DraftAttachmentId = Branded<'DraftAttachmentId'>
```

## InputState client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `InputState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface InputState {
    readonly draft: string;
    readonly attachmentIds: readonly DraftAttachmentId[];
    readonly draftRev: number;
    readonly phase: 'plain' | 'adjudicating' | 'claimed' | 'submitting';
    readonly claim?: {
        readonly name: string;
        readonly token: string;
        readonly hint?: string;
        readonly attachments?: boolean;
    };
    readonly occurrences: readonly Occurrence[];
    readonly queue: InboxState['next-turn'];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `draft` | `readonly draft: string;` |
| `attachmentIds` | `readonly attachmentIds: readonly DraftAttachmentId[];` |
| `draftRev` | `readonly draftRev: number;` |
| `phase` | `readonly phase: 'plain' \| 'adjudicating' \| 'claimed' \| 'submitting';` |
| `claim` | `readonly claim?: { readonly name: string; readonly token: string; readonly hint?: string; readonly attachments?: boolean; };` |
| `occurrences` | `readonly occurrences: readonly Occurrence[];` |
| `queue` | `readonly queue: InboxState['next-turn'];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type DraftAttachmentId = Branded<'DraftAttachmentId'>
```

## InsertReferenceRequest client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `InsertReferenceRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface InsertReferenceRequest {
    readonly reference: ReferenceInsert;
    readonly span: TokenSpan;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `reference` | `readonly reference: ReferenceInsert;` |
| `span` | `readonly span: TokenSpan;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## InsertTextRequest client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `InsertTextRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface InsertTextRequest {
    readonly text: string;
    readonly span: TokenSpan;
    readonly continue?: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `text` | `readonly text: string;` |
| `span` | `readonly span: TokenSpan;` |
| `continue` | `readonly continue?: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## PickOutcome client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `PickOutcome`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PickOutcome = {
    readonly claim: CommandClaim;
} | {
    readonly insert: ReferenceInsert;
} | {
    readonly text: string;
    readonly continue?: boolean;
} | 'handled' | undefined;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface CommandClaim {

  readonly name: string

  readonly token: string
  readonly hint?: string
  readonly attachments?: boolean

  submit(args: string, actx: Context, attachments: readonly SubmitAttachment[]): Promise<SubmitOutcome>
}

export type SubmitAttachment =
  | {
    readonly type: 'image'
    readonly mediaType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif'
    readonly data: string
    readonly name?: string
  }
  | { readonly type: 'file'; readonly receiptId: string }

export interface SubmitOutcome {
  readonly kind: 'success' | 'error'
  readonly text?: string
}
```

## SessionInput client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `SessionInput`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SessionInput extends InputTarget {
    setDraft(text: string): void;
    addAttachments(ids: readonly DraftAttachmentId[]): boolean;
    removeAttachment(id: DraftAttachmentId): boolean;
    pruneAttachments(ids: readonly DraftAttachmentId[]): void;
    submit(mode?: InputSubmitMode, source?: 'click' | 'enter'): void;
    notify(level: 'info' | 'error', text: string): void;
    focus(): void;
    readonly state: SnapshotStore<InputState>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `setDraft` | `setDraft(text: string): void;` |
| `addAttachments` | `addAttachments(ids: readonly DraftAttachmentId[]): boolean;` |
| `removeAttachment` | `removeAttachment(id: DraftAttachmentId): boolean;` |
| `pruneAttachments` | `pruneAttachments(ids: readonly DraftAttachmentId[]): void;` |
| `submit` | `submit(mode?: InputSubmitMode, source?: 'click' \| 'enter'): void;` |
| `notify` | `notify(level: 'info' \| 'error', text: string): void;` |
| `focus` | `focus(): void;` |
| `state` | `readonly state: SnapshotStore<InputState>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface CommandClaim {

  readonly name: string

  readonly token: string
  readonly hint?: string
  readonly attachments?: boolean

  submit(args: string, actx: Context, attachments: readonly SubmitAttachment[]): Promise<SubmitOutcome>
}

export type DraftAttachmentId = Branded<'DraftAttachmentId'>

export interface InputTarget {

  beginCommand(claim: CommandClaim, span: TokenSpan): boolean

  insertReference(ref: ReferenceInsert, span: TokenSpan): boolean
}

export interface InputState {

  readonly draft: string

  readonly attachmentIds: readonly DraftAttachmentId[]

  readonly draftRev: number
  readonly phase: 'plain' | 'adjudicating' | 'claimed' | 'submitting'

  readonly claim?: { readonly name: string; readonly token: string; readonly hint?: string; readonly attachments?: boolean }

  readonly occurrences: readonly Occurrence[]

  readonly queue: InboxState['next-turn']
}

export type SubmitAttachment =
  | {
    readonly type: 'image'
    readonly mediaType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif'
    readonly data: string
    readonly name?: string
  }
  | { readonly type: 'file'; readonly receiptId: string }

export interface SubmitOutcome {
  readonly kind: 'success' | 'error'
  readonly text?: string
}
```

## SessionInputResolver client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `SessionInputResolver`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SessionInputResolver {
    for(actx: Context): SessionInput;
    requestDraftInitialization(binding: SessionBinding, options: DraftInitializationOptions): DraftInitializationResult;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `for` | `for(actx: Context): SessionInput;` |
| `requestDraftInitialization` | `requestDraftInitialization(binding: SessionBinding, options: DraftInitializationOptions): DraftInitializationResult;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SessionInput extends InputTarget {

  setDraft(text: string): void

  addAttachments(ids: readonly DraftAttachmentId[]): boolean

  removeAttachment(id: DraftAttachmentId): boolean

  pruneAttachments(ids: readonly DraftAttachmentId[]): void

  submit(mode?: InputSubmitMode, source?: 'click' | 'enter'): void

  notify(level: 'info' | 'error', text: string): void


  focus(): void

  readonly state: SnapshotStore<InputState>
}

export interface DraftInitializationOptions {
  readonly prompt?: string

  readonly clearPreviousDraft?: boolean

  readonly whenDraftExists?: 'replace' | 'append' | 'keep'
}

export type DraftInitializationResult = 'applied' | 'preserved' | 'blocked'

export interface InputState {

  readonly draft: string

  readonly attachmentIds: readonly DraftAttachmentId[]

  readonly draftRev: number
  readonly phase: 'plain' | 'adjudicating' | 'claimed' | 'submitting'

  readonly claim?: { readonly name: string; readonly token: string; readonly hint?: string; readonly attachments?: boolean }

  readonly occurrences: readonly Occurrence[]

  readonly queue: InboxState['next-turn']
}

export type DraftAttachmentId = Branded<'DraftAttachmentId'>

export interface InputTarget {

  beginCommand(claim: CommandClaim, span: TokenSpan): boolean

  insertReference(ref: ReferenceInsert, span: TokenSpan): boolean
}

export interface CommandClaim {

  readonly name: string

  readonly token: string
  readonly hint?: string
  readonly attachments?: boolean

  submit(args: string, actx: Context, attachments: readonly SubmitAttachment[]): Promise<SubmitOutcome>
}

export type SubmitAttachment =
  | {
    readonly type: 'image'
    readonly mediaType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif'
    readonly data: string
    readonly name?: string
  }
  | { readonly type: 'file'; readonly receiptId: string }

export interface SubmitOutcome {
  readonly kind: 'success' | 'error'
  readonly text?: string
}
```

## SubmitAttachment client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `SubmitAttachment`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SubmitAttachment = {
    readonly type: 'image';
    readonly mediaType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';
    readonly data: string;
    readonly name?: string;
} | {
    readonly type: 'file';
    readonly receiptId: string;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## SubmitOutcome client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `SubmitOutcome`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SubmitOutcome {
    readonly kind: 'success' | 'error';
    readonly text?: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `readonly kind: 'success' \| 'error';` |
| `text` | `readonly text?: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。
