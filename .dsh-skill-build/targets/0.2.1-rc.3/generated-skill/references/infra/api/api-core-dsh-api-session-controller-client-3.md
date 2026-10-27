# @deepseek-ai/dsh-api-session-controller ./client：公开对象 3

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-session-controller 选型与组合](api-core-dsh-api-session-controller-client-overview.md)。

`@deepseek-ai/dsh-api-session-controller` 拥有 Host 的 `ctx.sessionController` 服务，以及生成的 Client `session`、`skills` 和 `fileReferences` Remote namespace。它提供 Session 生命周期与历史、Host generation 模型目录、人工后台任务终止、工作区路径打开、用户可调用 skill（技能）发现和 Agent（智能体）范围的文件引用。当 Client 需要按 Session 寻址的操作时，请通过 API Gateway 使用它。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## ProjectionValueStore 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`ProjectionValueStore`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class ProjectionValueStore {
    faceOf(key: string): ObservableSnapshot<unknown>;
    get(key: string): unknown;
    seqOf(key: string): SessionSeqCursor | undefined;
    values(): Readonly<Partial<SessionProjectionMap>>;
    subscribeAny(listener: () => void): () => void;
    apply(key: string, value: unknown, seq: SessionSeqCursor): void;
    applyCached(values: Readonly<Record<string, unknown>>): void;
    seed(baseline: ProjectionsBaseline): void;
    clear(): void;
}
```

成员检索：`apply`、`applyCached`、`clear`、`faceOf`、`get`、`seed`、`seqOf`、`subscribeAny`、`values`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## ProjectionsBaseline 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`ProjectionsBaseline`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ProjectionsBaseline {
    asOfSeq: SessionSeqCursor;
    values: Readonly<Record<string, unknown>>;
}
```

成员检索：`asOfSeq`、`values`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## ProjectionsFace 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`ProjectionsFace`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ProjectionsFace {
    faceOf(key: string): ObservableSnapshot<unknown>;
}
```

成员检索：`faceOf`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PromptError 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`PromptError`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PromptError {
    readonly op: 'send' | 'stop';
    readonly error: RemoteFailure;
}
```

成员检索：`error`、`op`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## Session 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`Session`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class Session implements SessionFace {
    readonly sessionId: SessionId;
    readonly projections: ProjectionValueStore;
    readonly eventSource: MutableSessionEventSource;
    constructor(sessionId: SessionId, remote: SessionRemotes, options?: SessionOptions);
    bindScope(actx: Context): void;
    unbindScope(): void;
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
    command(line: string): Promise<RemoteResult<{
        matched: boolean;
    }>>;
    open(): Promise<void>;
    loadOlder(): Promise<void>;
    loadThrough(seq: SessionSeq): Promise<void>;
    resync(): Promise<void>;
    subscribe(listener: () => void): () => void;
    getSnapshot(): SessionSnapshot;
    handleRunning(running: boolean): void;
    configureSubagent(address: SubagentAddress | undefined, parentAvailable?: boolean): void;
    handleSubagentParentAvailable(available: boolean): void;
    handleBlank(blank: boolean): void;
    handleRemoved(): void;
    handleAgentError(message: string): void;
    dispose(): Promise<void>;
}
```

成员检索：`beginSubmission`、`bindScope`、`cancel`、`command`、`configureSubagent`、`dispose`、`eventSource`、`getSnapshot`、`handleAgentError`、`handleBlank`、`handleRemoved`、`handleRunning`、`handleSubagentParentAvailable`、`loadOlder`、`loadThrough`、`open`、`projections`、`prompt`、`readAttachment`、`rename`、`resync`、`sessionId`、`subscribe`、`unbindScope`、`updateQueue`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionAssistantSettlementEntry 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionAssistantSettlementEntry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionAssistantSettlementEntry {
    readonly type: 'event';
    readonly event: SessionEvent<'assistant/message'> | SessionEvent<'assistant/attempt'>;
}
```

成员检索：`event`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
