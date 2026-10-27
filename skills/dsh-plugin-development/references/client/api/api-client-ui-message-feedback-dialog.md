# ui-message-feedback：dialog 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-message-feedback 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## FeedbackDialogState client

入口 `@deepseek-ai/dsh-client-ui-message-feedback/client`，公开符号 `FeedbackDialogState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface FeedbackDialogState {
    readonly target: FeedbackDialogTarget | null;
    readonly category: FeedbackCategory | null;
    readonly text: string;
    readonly submitting: boolean;
    readonly failure: string | null;
    readonly toast: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `target` | `readonly target: FeedbackDialogTarget \| null;` |
| `category` | `readonly category: FeedbackCategory \| null;` |
| `text` | `readonly text: string;` |
| `submitting` | `readonly submitting: boolean;` |
| `failure` | `readonly failure: string \| null;` |
| `toast` | `readonly toast: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-message-feedback.md#接入-ui-message-feedback) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type FeedbackDialogTarget =
  | { readonly kind: 'session' }
  | { readonly kind: 'message'; readonly messageId: MessageId; readonly rating: MessageFeedbackRating }
```

## FeedbackDialogTarget client

入口 `@deepseek-ai/dsh-client-ui-message-feedback/client`，公开符号 `FeedbackDialogTarget`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type FeedbackDialogTarget = {
    readonly kind: 'session';
} | {
    readonly kind: 'message';
    readonly messageId: MessageId;
    readonly rating: MessageFeedbackRating;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-message-feedback.md#接入-ui-message-feedback) 在真实装载路径检验成功、失败与卸载。

## FeedbackSubmit client

入口 `@deepseek-ai/dsh-client-ui-message-feedback/client`，公开符号 `FeedbackSubmit`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type FeedbackSubmit = (target: FeedbackDialogTarget, entry: FeedbackRecord) => Promise<MessageFeedbackActionResult>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-message-feedback.md#接入-ui-message-feedback) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type FeedbackDialogTarget =
  | { readonly kind: 'session' }
  | { readonly kind: 'message'; readonly messageId: MessageId; readonly rating: MessageFeedbackRating }
```
