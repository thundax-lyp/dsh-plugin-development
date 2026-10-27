# @deepseek-ai/dsh-api-session-controller ./client：公开对象 4

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-session-controller 选型与组合](api-core-dsh-api-session-controller-client-overview.md)。

`@deepseek-ai/dsh-api-session-controller` 拥有 Host 的 `ctx.sessionController` 服务，以及生成的 Client `session`、`skills` 和 `fileReferences` Remote namespace。它提供 Session 生命周期与历史、Host generation 模型目录、人工后台任务终止、工作区路径打开、用户可调用 skill（技能）发现和 Agent（智能体）范围的文件引用。当 Client 需要按 Session 寻址的操作时，请通过 API Gateway 使用它。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SessionBinding 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionBinding`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionBinding {
    readonly sessionId: SessionId;
    readonly session: SessionFace;
    readonly eventSource: SessionEventSource;
    readonly ctx: AgentContext;
}
```

成员检索：`ctx`、`eventSource`、`session`、`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionControlStream 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionControlStream`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionControlStream = RemoteSnapshotStream<SessionControlBaselineFrame, SessionControlDeltaFrame>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionControlStreamOptions 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionControlStreamOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionControlStreamOptions {
    readonly accept: (frame: SessionControlFrame) => void;
    readonly carrierFailed?: (error: RemoteStreamCarrierError) => void;
    readonly failed: (error: unknown) => void;
}
```

成员检索：`accept`、`carrierFailed`、`failed`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionCreateError 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionCreateError`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class SessionCreateError extends Error {
    readonly rpcError: RemoteFailure;
    readonly requestedSessionId: SessionId | undefined;
    readonly name = "SessionCreateError";
    constructor(rpcError: RemoteFailure, requestedSessionId: SessionId | undefined);
}
```

成员检索：`name`、`requestedSessionId`、`rpcError`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionEventChange 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionEventChange`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionEventChange = {
    readonly kind: 'replace';
    readonly entries: readonly SessionEventLikeEntry[];
} | {
    readonly kind: 'prepend';
    readonly entries: readonly SessionEventLikeEntry[];
} | {
    readonly kind: 'append';
    readonly entries: readonly SessionEventLikeEntry[];
} | {
    readonly kind: 'settle-assistant';
    readonly attemptId: LlmAttemptId;
    readonly entry?: SessionAssistantSettlementEntry;
};
```

成员检索：`kind`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionEventLike 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionEventLike`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionEventLike = SessionEvent | AssistantLiveChunkEvent;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `data` | `data: SessionEventMap[K];` | [SessionEvent 权威声明](api-core-dsh-session-root-3.md#sessionevent-公开契约) |
| `data` | `readonly data: { readonly attemptId: LlmAttemptId; readonly turn: number; readonly step: number; readonly chunk: StreamChunk; };` | [AssistantLiveChunkEvent 权威声明](api-core-dsh-api-session-controller-client-1.md#assistantlivechunkevent-公开契约) |
| `seq` | `seq: SessionSeq;` | [SessionEvent 权威声明](api-core-dsh-session-root-3.md#sessionevent-公开契约) |
| `seq` | `readonly seq: number;` | [AssistantLiveChunkEvent 权威声明](api-core-dsh-api-session-controller-client-1.md#assistantlivechunkevent-公开契约) |
| `time` | `time: number;` | [SessionEvent 权威声明](api-core-dsh-session-root-3.md#sessionevent-公开契约) |
| `time` | `readonly time: number;` | [AssistantLiveChunkEvent 权威声明](api-core-dsh-api-session-controller-client-1.md#assistantlivechunkevent-公开契约) |

## SessionEventLikeEntry 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionEventLikeEntry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionEventLikeEntry = {
    readonly type: 'event';
    readonly event: SessionEvent;
} | {
    readonly type: 'transient';
    readonly event: AssistantLiveChunkEvent;
};
```

成员检索：`event`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionEventSource 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionEventSource`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionEventSource = ObservableSnapshot<SessionEventWindow>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
