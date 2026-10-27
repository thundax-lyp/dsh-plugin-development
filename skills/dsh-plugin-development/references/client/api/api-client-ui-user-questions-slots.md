# ui-user-questions：slots 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-user-questions 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## PendingQuestion client

入口 `@deepseek-ai/dsh-client-ui-user-questions/client`，公开符号 `PendingQuestion`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class PendingQuestion {
    readonly kind: 'question' | 'plan-review';
    readonly key: string;
    readonly sessionId: SessionId;
    readonly questions: readonly AskUserQuestionItem[];
    readonly callId: ToolCallId | undefined;
    readonly review: readonly AskUserQuestionAnswerItem[] | undefined;
    readonly dismissal: 'hide' | 'cancel';
    constructor(sessionId: SessionId, questions: readonly AskUserQuestionItem[], callId?: ToolCallId, siblings?: () => readonly string[], review?: readonly AskUserQuestionAnswerItem[]);
    static keyOf(sessionId: SessionId, callId: string): string;
    liveKeys(): readonly string[];
    readonly subscribe: (listener: () => void) => (() => void);
    readonly snapshot: () => QuestionCardSnapshot;
    readonly getSnapshot: () => QuestionCardSnapshot;
    attachWaterfall(channel: QuestionWaterfallChannel): void;
    detachWaterfall(channel: QuestionWaterfallChannel): void;
    hasWaterfall(): boolean;
    attachRpc(channel: QuestionRpcChannel): void;
    attachSeat(seat: QuestionSeat): void;
    setState(state: UserQuestionState): void;
    takeTime(): void;
    holdFocus(now?: number): void;
    releaseFocus(now?: number): void;
    engage(now?: number): void;
    timeout(): void;
    delegate(): void;
    close(): void;
    answer(answer: QuestionAnswer): Promise<void>;
    dismiss(): Promise<void>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `readonly kind: 'question' \| 'plan-review';` |
| `key` | `readonly key: string;` |
| `sessionId` | `readonly sessionId: SessionId;` |
| `questions` | `readonly questions: readonly AskUserQuestionItem[];` |
| `callId` | `readonly callId: ToolCallId \| undefined;` |
| `review` | `readonly review: readonly AskUserQuestionAnswerItem[] \| undefined;` |
| `dismissal` | `readonly dismissal: 'hide' \| 'cancel';` |
| `constructor` | `constructor(sessionId: SessionId, questions: readonly AskUserQuestionItem[], callId?: ToolCallId, siblings?: () => readonly string[], review?: readonly AskUserQuestionAnswerItem[]);` |
| `keyOf` | `static keyOf(sessionId: SessionId, callId: string): string;` |
| `liveKeys` | `liveKeys(): readonly string[];` |
| `subscribe` | `readonly subscribe: (listener: () => void) => (() => void);` |
| `snapshot` | `readonly snapshot: () => QuestionCardSnapshot;` |
| `getSnapshot` | `readonly getSnapshot: () => QuestionCardSnapshot;` |
| `attachWaterfall` | `attachWaterfall(channel: QuestionWaterfallChannel): void;` |
| `detachWaterfall` | `detachWaterfall(channel: QuestionWaterfallChannel): void;` |
| `hasWaterfall` | `hasWaterfall(): boolean;` |
| `attachRpc` | `attachRpc(channel: QuestionRpcChannel): void;` |
| `attachSeat` | `attachSeat(seat: QuestionSeat): void;` |
| `setState` | `setState(state: UserQuestionState): void;` |
| `takeTime` | `takeTime(): void;` |
| `holdFocus` | `holdFocus(now?: number): void;` |
| `releaseFocus` | `releaseFocus(now?: number): void;` |
| `engage` | `engage(now?: number): void;` |
| `timeout` | `timeout(): void;` |
| `delegate` | `delegate(): void;` |
| `close` | `close(): void;` |
| `answer` | `answer(answer: QuestionAnswer): Promise<void>;` |
| `dismiss` | `dismiss(): Promise<void>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-user-questions.md#接入-ui-user-questions) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface QuestionWaterfallChannel {

  readonly deadline: number | undefined

  resolve(answer: QuestionAnswer): void

  reject(code: Exclude<QuestionRejectionCode, 'ASK_ABORTED'>): void

  delegate(): void
}

export interface QuestionRpcChannel {

  answer(answer: QuestionAnswer): Promise<boolean>
}

export interface QuestionSeat {

  hide(): void
}

export interface QuestionCardSnapshot {

  readonly state: UserQuestionState

  readonly waitState: 'counting' | 'focused' | 'editing' | 'waiting' | 'continued'

  readonly countdown: { readonly remainingMs: number; readonly running: boolean } | undefined

  readonly channel: 'waterfall' | 'rpc' | 'none'

  readonly closed: boolean
}

export type QuestionAnswer = AskUserQuestionAnswer

export type QuestionRejectionCode = 'ASK_ABORTED' | 'ASK_CANCELLED' | 'ASK_TIMED_OUT'
```

## PlanReview client

入口 `@deepseek-ai/dsh-client-ui-user-questions/client`，公开符号 `PlanReview`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PlanReview {
    id: string;
    question: string;
    plan: string;
    callId?: ToolCallId;
    approve: QuestionOption;
    decline?: QuestionOption;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `id: string;` |
| `question` | `question: string;` |
| `plan` | `plan: string;` |
| `callId` | `callId?: ToolCallId;` |
| `approve` | `approve: QuestionOption;` |
| `decline` | `decline?: QuestionOption;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-user-questions.md#接入-ui-user-questions) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
type QuestionOption = NonNullable<QuestionItem['options']>[number]

type QuestionItem = AskUserQuestionItem
```

## QuestionAnswer client

入口 `@deepseek-ai/dsh-client-ui-user-questions/client`，公开符号 `QuestionAnswer`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type QuestionAnswer = AskUserQuestionAnswer;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-user-questions.md#接入-ui-user-questions) 在真实装载路径检验成功、失败与卸载。

## QuestionComposerProps client

入口 `@deepseek-ai/dsh-client-ui-user-questions/client`，公开符号 `QuestionComposerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type QuestionComposerProps = PropsRuntime<'conversation.composer'> & PropsStore<ReturnType<typeof createQuestionDraftStore>> & PropsRenderSlots<'conversation.plan-review.actions'> & InjectFace<{
    keyedHooks: {
        questionCard: (key: string) => PendingQuestion | undefined;
    };
}> & {
    matched: QuestionWait;
} & PropsLocale<'question'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-user-questions.md#接入-ui-user-questions) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type QuestionWait = PendingQuestion
```

## QuestionWait client

入口 `@deepseek-ai/dsh-client-ui-user-questions/client`，公开符号 `QuestionWait`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type QuestionWait = PendingQuestion;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-user-questions.md#接入-ui-user-questions) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface QuestionWaterfallChannel {

  readonly deadline: number | undefined

  resolve(answer: QuestionAnswer): void

  reject(code: Exclude<QuestionRejectionCode, 'ASK_ABORTED'>): void

  delegate(): void
}

export interface QuestionRpcChannel {

  answer(answer: QuestionAnswer): Promise<boolean>
}

export interface QuestionSeat {

  hide(): void
}

export interface QuestionCardSnapshot {

  readonly state: UserQuestionState

  readonly waitState: 'counting' | 'focused' | 'editing' | 'waiting' | 'continued'

  readonly countdown: { readonly remainingMs: number; readonly running: boolean } | undefined

  readonly channel: 'waterfall' | 'rpc' | 'none'

  readonly closed: boolean
}

export type QuestionAnswer = AskUserQuestionAnswer

export type QuestionRejectionCode = 'ASK_ABORTED' | 'ASK_CANCELLED' | 'ASK_TIMED_OUT'
```


类型别名的成员索引：`attachRpc`、`attachSeat`、`attachWaterfall`、`callId`、`detachWaterfall`、`dismiss`、`dismissal`、`engage`、`getSnapshot`、`hasWaterfall`、`holdFocus`、`key`、`kind`、`liveKeys`、`releaseFocus`、`review`、`sessionId`、`setState`、`snapshot`、`takeTime`、`timeout`。`QuestionWait` 是 [PendingQuestion 实例的类型别名](api-client-ui-user-questions-slots.md#pendingquestion-client)，不是同名 slot props 的静态字段；类型导入不会创建 wait 实例，其状态和清理由提问交互 owner 管理。
