# @deepseek-ai/dsh-api-session-controller ./client：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-session-controller 选型与组合](api-core-dsh-api-session-controller-client-overview.md)。

`@deepseek-ai/dsh-api-session-controller` 拥有 Host 的 `ctx.sessionController` 服务，以及生成的 Client `session`、`skills` 和 `fileReferences` Remote namespace。它提供 Session 生命周期与历史、Host generation 模型目录、人工后台任务终止、工作区路径打开、用户可调用 skill（技能）发现和 Agent（智能体）范围的文件引用。当 Client 需要按 Session 寻址的操作时，请通过 API Gateway 使用它。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## OpenState 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`OpenState`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type OpenState = 'cold' | 'loading' | 'open' | 'error';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PendingSubmission 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`PendingSubmission`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PendingSubmission {
    readonly requestId: SessionRequestId;
    readonly placement: PendingSubmissionPlacement;
    readonly time: number;
    readonly text: string;
    readonly attachments: readonly PendingSubmissionAttachment[];
}
```

成员检索：`attachments`、`placement`、`requestId`、`text`、`time`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PendingSubmissionAttachment 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`PendingSubmissionAttachment`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type PendingSubmissionAttachment = PendingSubmissionImageAttachment | PendingSubmissionFileAttachment;
```

成员检索：`type`、`value`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PendingSubmissionFileAttachment 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`PendingSubmissionFileAttachment`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PendingSubmissionFileAttachment {
    readonly type: 'file';
    readonly value: FileAttachmentRef;
}
```

成员检索：`type`、`value`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PendingSubmissionImage 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`PendingSubmissionImage`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PendingSubmissionImage {
    readonly previewUrl: string;
    readonly name?: string;
    readonly width?: number;
    readonly height?: number;
}
```

成员检索：`height`、`name`、`previewUrl`、`width`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PendingSubmissionImageAttachment 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`PendingSubmissionImageAttachment`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PendingSubmissionImageAttachment {
    readonly type: 'image';
    readonly value: PendingSubmissionImage;
}
```

成员检索：`type`、`value`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PendingSubmissionPlacement 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`PendingSubmissionPlacement`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type PendingSubmissionPlacement = 'transcript' | 'queued' | 'steering';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PendingSubmissionRetirement 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`PendingSubmissionRetirement`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type PendingSubmissionRetirement = {
    readonly reason: 'observed';
    readonly attachments: readonly (ImageAttachmentRef | FileAttachmentRef)[];
} | {
    readonly reason: 'failed';
};
```

成员检索：`reason`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
