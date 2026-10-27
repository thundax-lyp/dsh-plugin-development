# ui-message-feedback：slots 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-message-feedback 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## FeedbackDialogInjected client

入口 `@deepseek-ai/dsh-client-ui-message-feedback/client`，公开符号 `FeedbackDialogInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface FeedbackDialogInjected {
    hooks: {
        dialog: HostObservable<FeedbackDialogState>;
    };
    edit: (draft: Partial<Pick<FeedbackDialogState, 'category' | 'text'>>) => void;
    submit: () => Promise<void>;
    dismiss: () => void;
    dismissFailure: () => void;
    dismissToast: (seq: number) => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `hooks: { dialog: HostObservable<FeedbackDialogState>; };` |
| `edit` | `edit: (draft: Partial<Pick<FeedbackDialogState, 'category' \| 'text'>>) => void;` |
| `submit` | `submit: () => Promise<void>;` |
| `dismiss` | `dismiss: () => void;` |
| `dismissFailure` | `dismissFailure: () => void;` |
| `dismissToast` | `dismissToast: (seq: number) => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-message-feedback.md#接入-ui-message-feedback) 在真实装载路径检验成功、失败与卸载。

## FeedbackDialogProps client

入口 `@deepseek-ai/dsh-client-ui-message-feedback/client`，公开符号 `FeedbackDialogProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type FeedbackDialogProps = InjectFace<FeedbackDialogInjected> & PropsLocale<'feedback'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-message-feedback.md#接入-ui-message-feedback) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface FeedbackDialogInjected {
  hooks: {

    dialog: HostObservable<FeedbackDialogState>
  }

  edit: (draft: Partial<Pick<FeedbackDialogState, 'category' | 'text'>>) => void

  submit: () => Promise<void>

  dismiss: () => void

  dismissFailure: () => void

  dismissToast: (seq: number) => void
}
```

## MessageFeedbackActionProps client

入口 `@deepseek-ai/dsh-client-ui-message-feedback/client`，公开符号 `MessageFeedbackActionProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type MessageFeedbackActionProps = PropsRuntime<'conversation.chat.assistant-actions'> & InjectFace<MessageFeedbackInjected> & PropsLocale<'feedback'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-message-feedback.md#接入-ui-message-feedback) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface MessageFeedbackInjected {
  hooks: {

    feedback: HostObservable<MessageFeedbackView>
  }

  ensure: () => Promise<MessageFeedbackActionResult>

  current: (messageId: MessageId) => MessageFeedbackItem | undefined

  retract: (messageId: MessageId, rating: MessageFeedbackRating) => Promise<MessageFeedbackActionResult>

  openDialog: (messageId: MessageId, rating: MessageFeedbackRating) => void
}
```

## MessageFeedbackInjected client

入口 `@deepseek-ai/dsh-client-ui-message-feedback/client`，公开符号 `MessageFeedbackInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface MessageFeedbackInjected {
    hooks: {
        feedback: HostObservable<MessageFeedbackView>;
    };
    ensure: () => Promise<MessageFeedbackActionResult>;
    current: (messageId: MessageId) => MessageFeedbackItem | undefined;
    retract: (messageId: MessageId, rating: MessageFeedbackRating) => Promise<MessageFeedbackActionResult>;
    openDialog: (messageId: MessageId, rating: MessageFeedbackRating) => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `hooks: { feedback: HostObservable<MessageFeedbackView>; };` |
| `ensure` | `ensure: () => Promise<MessageFeedbackActionResult>;` |
| `current` | `current: (messageId: MessageId) => MessageFeedbackItem \| undefined;` |
| `retract` | `retract: (messageId: MessageId, rating: MessageFeedbackRating) => Promise<MessageFeedbackActionResult>;` |
| `openDialog` | `openDialog: (messageId: MessageId, rating: MessageFeedbackRating) => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-message-feedback.md#接入-ui-message-feedback) 在真实装载路径检验成功、失败与卸载。
