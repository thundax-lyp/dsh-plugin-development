# @deepseek-ai/dsh-api-session-controller .：公开对象 3

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-session-controller 选型与组合](api-core-dsh-api-session-controller-root-overview.md)。

`@deepseek-ai/dsh-api-session-controller` 拥有 Host 的 `ctx.sessionController` 服务，以及生成的 Client `session`、`skills` 和 `fileReferences` Remote namespace。它提供 Session 生命周期与历史、Host generation 模型目录、人工后台任务终止、工作区路径打开、用户可调用 skill（技能）发现和 Agent（智能体）范围的文件引用。当 Client 需要按 Session 寻址的操作时，请通过 API Gateway 使用它。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SessionAssistantStreamAttempt 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionAssistantStreamAttempt`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionAssistantStreamAttempt {
    readonly attemptId: LlmAttemptId;
    readonly startedAfterSeq: SessionSeqCursor;
    readonly turn: number;
    readonly step: number;
    readonly nextIndex: number;
    readonly stream: readonly JsonValue[];
}
```

成员检索：`attemptId`、`nextIndex`、`startedAfterSeq`、`step`、`stream`、`turn`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionAssistantStreamBaseline 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionAssistantStreamBaseline`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionAssistantStreamBaseline {
    readonly revision: number;
    readonly activeAttempt?: SessionAssistantStreamAttempt;
}
```

成员检索：`activeAttempt`、`revision`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionAssistantStreamFrame 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionAssistantStreamFrame`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionAssistantStreamFrame = {
    readonly type: 'start';
    readonly attemptId: LlmAttemptId;
    readonly revision: number;
    readonly startedAfterSeq: SessionSeqCursor;
    readonly turn: number;
    readonly step: number;
} | {
    readonly type: 'chunk';
    readonly attemptId: LlmAttemptId;
    readonly revision: number;
    readonly index: number;
    readonly time: number;
    readonly chunk: JsonValue;
} | {
    readonly type: 'end';
    readonly attemptId: LlmAttemptId;
    readonly revision: number;
    readonly index: number;
    readonly outcome: {
        readonly kind: 'committed';
        readonly eventType: 'assistant/message' | 'assistant/attempt';
        readonly seq: number;
    } | {
        readonly kind: 'abandoned';
    };
};
```

成员检索：`attemptId`、`revision`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionAttachmentRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionAttachmentRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionAttachmentRequest {
    readonly sessionId: SessionId;
    readonly attachmentId: AttachmentIdType;
}
```

成员检索：`attachmentId`、`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionAttachmentValue 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionAttachmentValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionAttachmentValue {
    readonly attachment: ImageAttachmentRef;
    readonly data: string;
}
```

成员检索：`attachment`、`data`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionCancelRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionCancelRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionCancelRequest {
    readonly sessionId: SessionId;
}
```

成员检索：`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionCancelValue 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionCancelValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionCancelValue {
    readonly accepted: true;
}
```

成员检索：`accepted`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionControlBaseline 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionControlBaseline`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionControlBaseline {
    readonly projections: Readonly<Record<SessionId, SessionProjectionBaseline>>;
}
```

成员检索：`projections`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
