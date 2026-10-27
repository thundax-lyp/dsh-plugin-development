# ui-message-feedback：controller 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-message-feedback 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## MessageFeedbackActionFailure client

入口 `@deepseek-ai/dsh-client-ui-message-feedback/client`，公开符号 `MessageFeedbackActionFailure`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface MessageFeedbackActionFailure {
    ok: false;
    error: {
        code: string;
        message: string;
    };
}
```

| 成员 | 公开声明 |
| --- | --- |
| `ok` | `ok: false;` |
| `error` | `error: { code: string; message: string; };` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-message-feedback.md#接入-ui-message-feedback) 在真实装载路径检验成功、失败与卸载。

## MessageFeedbackActionResult client

入口 `@deepseek-ai/dsh-client-ui-message-feedback/client`，公开符号 `MessageFeedbackActionResult`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type MessageFeedbackActionResult = {
    ok: true;
} | MessageFeedbackActionFailure;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-message-feedback.md#接入-ui-message-feedback) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface MessageFeedbackActionFailure {
  ok: false
  error: { code: string; message: string }
}
```

## MessageFeedbackStatus client

入口 `@deepseek-ai/dsh-client-ui-message-feedback/client`，公开符号 `MessageFeedbackStatus`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type MessageFeedbackStatus = 'cold' | 'loading' | 'ready' | 'error';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-message-feedback.md#接入-ui-message-feedback) 在真实装载路径检验成功、失败与卸载。

## MessageFeedbackView client

入口 `@deepseek-ai/dsh-client-ui-message-feedback/client`，公开符号 `MessageFeedbackView`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface MessageFeedbackView {
    status: MessageFeedbackStatus;
    items: ReadonlyMap<MessageId, MessageFeedbackItem>;
    error: string | null;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `status` | `status: MessageFeedbackStatus;` |
| `items` | `items: ReadonlyMap<MessageId, MessageFeedbackItem>;` |
| `error` | `error: string \| null;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-message-feedback.md#接入-ui-message-feedback) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type MessageFeedbackStatus = 'cold' | 'loading' | 'ready' | 'error'
```
