# ui-approval：slots 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-approval 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## ApprovalComposerProps client

入口 `@deepseek-ai/dsh-client-ui-approval/client`，公开符号 `ApprovalComposerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ApprovalComposerProps = PropsRuntime<'conversation.composer'> & PropsRenderSlots<'conversation.approval.detail'> & {
    matched: PendingApproval;
} & PropsLocale<'approval'> & ApprovalInjected;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-approval.md#接入-ui-approval) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ApprovalInjected {

  resolveReason(reason: NonNullable<ApprovalPresentationRequest['displayReason']>): string
}

export interface ApprovalPresentationRequest {

  readonly toolName: string

  readonly callId?: ToolCallId

  readonly reason?: string

  readonly displayReason?: { readonly en: string; readonly [locale: string]: string }

  readonly signal?: AbortSignal
}
```

## ApprovalDecision client

入口 `@deepseek-ai/dsh-client-ui-approval/client`，公开符号 `ApprovalDecision`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ApprovalDecision = 'allowed-once' | 'rejected';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-approval.md#接入-ui-approval) 在真实装载路径检验成功、失败与卸载。

## ApprovalDetailOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-approval/client`，公开符号 `ApprovalDetailOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ApprovalDetailOwnerProps {
    callId: ToolCallId;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `callId` | `callId: ToolCallId;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-approval.md#接入-ui-approval) 在真实装载路径检验成功、失败与卸载。

## ApprovalPresentationRequest client

入口 `@deepseek-ai/dsh-client-ui-approval/client`，公开符号 `ApprovalPresentationRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ApprovalPresentationRequest {
    readonly toolName: string;
    readonly callId?: ToolCallId;
    readonly reason?: string;
    readonly displayReason?: {
        readonly en: string;
        readonly [locale: string]: string;
    };
    readonly signal?: AbortSignal;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `toolName` | `readonly toolName: string;` |
| `callId` | `readonly callId?: ToolCallId;` |
| `reason` | `readonly reason?: string;` |
| `displayReason` | `readonly displayReason?: { readonly en: string; readonly [locale: string]: string; };` |
| `signal` | `readonly signal?: AbortSignal;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-approval.md#接入-ui-approval) 在真实装载路径检验成功、失败与卸载。

## PendingApproval client

入口 `@deepseek-ai/dsh-client-ui-approval/client`，公开符号 `PendingApproval`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class PendingApproval {
    readonly sessionId: SessionId;
    readonly kind: 'approval';
    readonly key: string;
    readonly toolName: string;
    readonly callId: ToolCallId | undefined;
    readonly reason: string | undefined;
    readonly displayReason: ApprovalPresentationRequest['displayReason'];
    readonly result: Promise<ApprovalDecision>;
    constructor(sessionId: SessionId, request: ApprovalPresentationRequest);
    get answerable(): boolean;
    answer(outcome: ApprovalDecision): Promise<void>;
    delegate(): void;
    isDelegation(reason: unknown): boolean;
    abort(reason: unknown): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `sessionId` | `readonly sessionId: SessionId;` |
| `kind` | `readonly kind: 'approval';` |
| `key` | `readonly key: string;` |
| `toolName` | `readonly toolName: string;` |
| `callId` | `readonly callId: ToolCallId \| undefined;` |
| `reason` | `readonly reason: string \| undefined;` |
| `displayReason` | `readonly displayReason: ApprovalPresentationRequest['displayReason'];` |
| `result` | `readonly result: Promise<ApprovalDecision>;` |
| `constructor` | `constructor(sessionId: SessionId, request: ApprovalPresentationRequest);` |
| `answerable` | `get answerable(): boolean;` |
| `answer` | `answer(outcome: ApprovalDecision): Promise<void>;` |
| `delegate` | `delegate(): void;` |
| `isDelegation` | `isDelegation(reason: unknown): boolean;` |
| `abort` | `abort(reason: unknown): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-approval.md#接入-ui-approval) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type ApprovalDecision = 'allowed-once' | 'rejected'
```
