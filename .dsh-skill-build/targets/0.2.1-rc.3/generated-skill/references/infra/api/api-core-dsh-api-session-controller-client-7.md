# @deepseek-ai/dsh-api-session-controller ./client：公开对象 7

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-session-controller 选型与组合](api-core-dsh-api-session-controller-client-overview.md)。

`@deepseek-ai/dsh-api-session-controller` 拥有 Host 的 `ctx.sessionController` 服务，以及生成的 Client `session`、`skills` 和 `fileReferences` Remote namespace。它提供 Session 生命周期与历史、Host generation 模型目录、人工后台任务终止、工作区路径打开、用户可调用 skill（技能）发现和 Agent（智能体）范围的文件引用。当 Client 需要按 Session 寻址的操作时，请通过 API Gateway 使用它。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SessionRetainInfo 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionRetainInfo`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionRetainInfo {
    readonly referenceCount: number;
    readonly retainedBy: Readonly<Partial<Record<SessionReferenceSource, number>>>;
}
```

成员检索：`referenceCount`、`retainedBy`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionRetainOptions 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionRetainOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionRetainOptions {
    readonly source: SessionReferenceSource;
    readonly signal?: AbortSignal | undefined;
}
```

成员检索：`signal`、`source`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionSearchResultItem 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionSearchResultItem`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionSearchResultItem {
    sessionId: SessionId;
    snippet: string;
}
```

成员检索：`sessionId`、`snippet`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionSnapshot 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionSnapshot`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionSnapshot {
    readonly sessionId: SessionId;
    readonly pendingSubmissions: readonly PendingSubmission[];
    readonly running: boolean;
    readonly subagent: {
        readonly address: SubagentAddress;
        readonly parentAvailable?: boolean;
    } | null;
    readonly removed: boolean;
    readonly openState: OpenState;
    readonly openError: RemoteFailure | null;
    readonly hasMore: boolean;
    readonly loadingOlder: boolean;
    readonly promptError: PromptError | null;
    readonly blank: boolean;
    readonly lastAgentError: string | null;
    readonly promptAttempted: boolean;
    readonly awaitingFirstTurn: boolean;
}
```

成员检索：`awaitingFirstTurn`、`blank`、`hasMore`、`lastAgentError`、`loadingOlder`、`openError`、`openState`、`pendingSubmissions`、`promptAttempted`、`promptError`、`removed`、`running`、`sessionId`、`subagent`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionSummary 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionSummary`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionSummary {
    id: SessionId;
    title?: string;
    displayTitle: string;
    cwd?: string;
    parentId?: SessionId;
    origin?: 'subagent';
    formatStatus?: SessionListEntry['formatStatus'];
    running: boolean;
    readonly retainedBy: SessionRetainInfo['retainedBy'];
    blank: boolean;
    updatedAt: number;
    projectionValues?: Readonly<Partial<SessionProjectionMap>>;
}
```

成员检索：`blank`、`cwd`、`displayTitle`、`formatStatus`、`id`、`origin`、`parentId`、`projectionValues`、`retainedBy`、`running`、`title`、`updatedAt`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionTarget 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionTarget`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionTarget = SessionId | SubagentAddress;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionTransientEventEntry 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionTransientEventEntry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionTransientEventEntry = Extract<SessionEventLikeEntry, {
    readonly type: 'transient';
}>;
```

成员检索：`event`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SubmissionHandle 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SubmissionHandle`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SubmissionHandle {
    readonly requestId: SessionRequestId;
    abandon(): void;
}
```

成员检索：`abandon`、`requestId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
