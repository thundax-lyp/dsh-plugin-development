# @deepseek-ai/dsh-api-session-controller ./client：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-session-controller 选型与组合](api-core-dsh-api-session-controller-client-overview.md)。

`@deepseek-ai/dsh-api-session-controller` 拥有 Host 的 `ctx.sessionController` 服务，以及生成的 Client `session`、`skills` 和 `fileReferences` Remote namespace。它提供 Session 生命周期与历史、Host generation 模型目录、人工后台任务终止、工作区路径打开、用户可调用 skill（技能）发现和 Agent（智能体）范围的文件引用。当 Client 需要按 Session 寻址的操作时，请通过 API Gateway 使用它。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## AgentContext 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`AgentContext`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type AgentContext = Omit<Context, 'remote'> & {
    readonly remote: ClientRemote & TypertRemoteScopeApi<'agent'>;
};
```

成员检索：`remote`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## AgentScopeHandle 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`AgentScopeHandle`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AgentScopeHandle {
    ctx: AgentContext;
    fiber: Fiber;
}
```

成员检索：`ctx`、`fiber`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## AssistantLiveChunkEvent 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`AssistantLiveChunkEvent`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AssistantLiveChunkEvent {
    readonly type: 'assistant/live-chunk';
    readonly seq: number;
    readonly time: number;
    readonly data: {
        readonly attemptId: LlmAttemptId;
        readonly turn: number;
        readonly step: number;
        readonly chunk: StreamChunk;
    };
}
```

成员检索：`data`、`seq`、`time`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## BeginSubmissionInput 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`BeginSubmissionInput`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface BeginSubmissionInput {
    readonly mode: 'queue' | 'steer';
    readonly text: string;
    readonly attachments: readonly PendingSubmissionAttachment[];
    readonly onRetire?: (retirement: PendingSubmissionRetirement) => void;
}
```

成员检索：`attachments`、`mode`、`onRetire`、`text`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## ClientSessionPageRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`ClientSessionPageRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type ClientSessionPageRequest = Omit<SessionPageRequest, 'address' | 'throughSeq'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## ISession 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`ISession`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ISession {
    readonly sessionId: SessionId;
    readonly projections: ProjectionsFace;
    beginSubmission(input: BeginSubmissionInput): SubmissionHandle;
    prompt(content: PromptContentPart[], mode: 'queue' | 'steer', signal?: AbortSignal, requestId?: SessionRequestId): Promise<RemoteResult<{
        accepted: true;
    }>>;
    readAttachment(attachmentId: AttachmentIdType): Promise<RemoteResult<{
        attachment: ImageAttachmentRef;
        data: Uint8Array;
    }>>;
    updateQueue(itemId: MessageId, action: QueueAction): Promise<RemoteResult<{
        accepted: true;
    }>>;
    cancel(): Promise<RemoteResult<{
        accepted: true;
    }>>;
    rename(title: string): Promise<RemoteResult<{
        title: string;
        seq: SessionSeq;
    }>>;
    loadOlder(): Promise<void>;
    loadThrough(seq: SessionSeq): Promise<void>;
    command(line: string): Promise<RemoteResult<{
        matched: boolean;
    }>>;
}
```

成员检索：`beginSubmission`、`cancel`、`command`、`loadOlder`、`loadThrough`、`projections`、`prompt`、`readAttachment`、`rename`、`sessionId`、`updateQueue`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## ISessions 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`ISessions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ISessions {
    readonly list: ObservableSnapshot<SessionListState>;
    retain(target: SessionTarget, options: SessionRetainOptions): SessionReference;
    using<T>(target: SessionTarget, options: SessionRetainOptions, operation: (reference: SessionReference) => T | Promise<T>): Promise<T>;
    retainInfo(id: SessionId): ObservableSnapshot<SessionRetainInfo>;
    readonly searchResultLimit: number;
    create(opts?: {
        workspaceId?: WorkspaceId;
        cwd?: string;
        sessionId?: SessionId;
        agentPreset?: string;
    }): Promise<SessionId>;
    subagentAddress(id: SessionId): SubagentAddress | undefined;
    refreshProjections(sessionId: SessionId): Promise<void>;
    refresh(): Promise<void>;
    search(query: string, signal: AbortSignal): Promise<RemoteResult<{
        items: SessionSearchResultItem[];
        hasMore: boolean;
    }>>;
    fork(opts: {
        sessionId: SessionId;
        atSeq?: number;
        increaseTitle?: boolean;
        onCreated?: (childId: SessionId) => void;
        allowMigration?: boolean;
    }): Promise<SessionId>;
    scope(id: SessionId): AgentContext | undefined;
    scopeOf(ctx: Context): SessionId | undefined;
    sessionOf(ctx: Context): SessionFace | undefined;
    binding(id: SessionId): SessionBinding | undefined;
}
```

成员检索：`binding`、`create`、`fork`、`list`、`refresh`、`refreshProjections`、`retain`、`retainInfo`、`scope`、`scopeOf`、`search`、`searchResultLimit`、`sessionOf`、`subagentAddress`、`using`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## MutableSessionEventSource 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`MutableSessionEventSource`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class MutableSessionEventSource implements SessionEventSource {
    getSnapshot(): SessionEventWindow;
    subscribe(listener: () => void): () => void;
    replace(entries: readonly SessionEventLikeEntry[], hasMore: boolean): void;
    prepend(entries: readonly SessionEventLikeEntry[], hasMore: boolean): void;
    append(entry: SessionEventLikeEntry): void;
    settleAssistant(attemptId: LlmAttemptId, entry?: SessionAssistantSettlementEntry): void;
}
```

成员检索：`append`、`getSnapshot`、`prepend`、`replace`、`settleAssistant`、`subscribe`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
