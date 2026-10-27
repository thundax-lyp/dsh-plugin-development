# @deepseek-ai/dsh-api-session-controller ./client：公开对象 5

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-session-controller 选型与组合](api-core-dsh-api-session-controller-client-overview.md)。

`@deepseek-ai/dsh-api-session-controller` 拥有 Host 的 `ctx.sessionController` 服务，以及生成的 Client `session`、`skills` 和 `fileReferences` Remote namespace。它提供 Session 生命周期与历史、Host generation 模型目录、人工后台任务终止、工作区路径打开、用户可调用 skill（技能）发现和 Agent（智能体）范围的文件引用。当 Client 需要按 Session 寻址的操作时，请通过 API Gateway 使用它。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SessionEventStream 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionEventStream`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class SessionEventStream extends RemoteJournalStream<SessionJournalPage, SessionHistoryRecord, number, ClientSessionPageRequest, SessionAssistantStreamFrame> {
    constructor(remote: SessionRemotes, address: SessionAddress, options: SessionEventStreamOptions);
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionEventStreamOptions 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionEventStreamOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionEventStreamOptions {
    readonly publish: (change: SessionJournalChange) => void;
    readonly carrierFailed?: (error: RemoteStreamCarrierError) => void;
    readonly failed: (error: unknown) => void;
}
```

成员检索：`carrierFailed`、`failed`、`publish`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionEventWindow 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionEventWindow`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionEventWindow {
    readonly entries: readonly SessionEventLikeEntry[];
    readonly hasMore: boolean;
    readonly revision: number;
    readonly change: SessionEventChange;
}
```

成员检索：`change`、`entries`、`hasMore`、`revision`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionFace 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionFace`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionFace = ISession & ObservableSnapshot<SessionSnapshot>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `beginSubmission` | `beginSubmission(input: BeginSubmissionInput): SubmissionHandle;` | [ISession 权威声明](api-core-dsh-api-session-controller-client-1.md#isession-公开契约) |
| `cancel` | `cancel(): Promise<RemoteResult<{ accepted: true; }>>;` | [ISession 权威声明](api-core-dsh-api-session-controller-client-1.md#isession-公开契约) |
| `command` | `command(line: string): Promise<RemoteResult<{ matched: boolean; }>>;` | [ISession 权威声明](api-core-dsh-api-session-controller-client-1.md#isession-公开契约) |
| `loadOlder` | `loadOlder(): Promise<void>;` | [ISession 权威声明](api-core-dsh-api-session-controller-client-1.md#isession-公开契约) |
| `loadThrough` | `loadThrough(seq: SessionSeq): Promise<void>;` | [ISession 权威声明](api-core-dsh-api-session-controller-client-1.md#isession-公开契约) |
| `projections` | `readonly projections: ProjectionsFace;` | [ISession 权威声明](api-core-dsh-api-session-controller-client-1.md#isession-公开契约) |
| `prompt` | `prompt(content: PromptContentPart[], mode: 'queue' \| 'steer', signal?: AbortSignal, requestId?: SessionRequestId): Promise<RemoteResult<{ accepted: true; }>>;` | [ISession 权威声明](api-core-dsh-api-session-controller-client-1.md#isession-公开契约) |
| `readAttachment` | `readAttachment(attachmentId: AttachmentIdType): Promise<RemoteResult<{ attachment: ImageAttachmentRef; data: Uint8Array; }>>;` | [ISession 权威声明](api-core-dsh-api-session-controller-client-1.md#isession-公开契约) |
| `rename` | `rename(title: string): Promise<RemoteResult<{ title: string; seq: SessionSeq; }>>;` | [ISession 权威声明](api-core-dsh-api-session-controller-client-1.md#isession-公开契约) |
| `sessionId` | `readonly sessionId: SessionId;` | [ISession 权威声明](api-core-dsh-api-session-controller-client-1.md#isession-公开契约) |
| `updateQueue` | `updateQueue(itemId: MessageId, action: QueueAction): Promise<RemoteResult<{ accepted: true; }>>;` | [ISession 权威声明](api-core-dsh-api-session-controller-client-1.md#isession-公开契约) |

## SessionForkError 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionForkError`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class SessionForkError extends Error {
    readonly rpcError: RemoteFailure;
    readonly sourceSessionId: SessionId;
    readonly name = "SessionForkError";
    constructor(rpcError: RemoteFailure, sourceSessionId: SessionId);
}
```

成员检索：`name`、`rpcError`、`sourceSessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionJournalChange 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionJournalChange`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionJournalChange = {
    readonly type: 'replace' | 'prepend';
    readonly page: SessionJournalPage;
    readonly entries: readonly SessionEventLikeEntry[];
    readonly hasMore: boolean;
} | {
    readonly type: 'append';
    readonly entry: SessionLiveEventEntry;
} | {
    readonly type: 'assistant-stream';
    readonly frame: SessionAssistantStreamFrame;
};
```

成员检索：`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionListPhase 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionListPhase`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionListPhase = 'pending' | 'ready';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionListSnapshot 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionListSnapshot`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionListSnapshot {
    items: readonly SessionListEntry[];
    state: 'idle' | 'loading' | 'error';
    phase: SessionListPhase;
    error: RemoteFailure | null;
    projectionsBySession: Readonly<Record<SessionId, SessionProjectionSnapshot>>;
}
```

成员检索：`error`、`items`、`phase`、`projectionsBySession`、`state`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
