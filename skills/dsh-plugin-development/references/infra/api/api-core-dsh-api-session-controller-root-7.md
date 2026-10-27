# @deepseek-ai/dsh-api-session-controller .：公开对象 7

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-session-controller 选型与组合](api-core-dsh-api-session-controller-root-overview.md)。

`@deepseek-ai/dsh-api-session-controller` 拥有 Host 的 `ctx.sessionController` 服务，以及生成的 Client `session`、`skills` 和 `fileReferences` Remote namespace。它提供 Session 生命周期与历史、Host generation 模型目录、人工后台任务终止、工作区路径打开、用户可调用 skill（技能）发现和 Agent（智能体）范围的文件引用。当 Client 需要按 Session 寻址的操作时，请通过 API Gateway 使用它。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SessionProjectionsRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionProjectionsRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionProjectionsRequest {
    readonly sessionId: SessionId;
}
```

成员检索：`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionProjectionsValue 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionProjectionsValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionProjectionsValue = (SessionProjectionBaseline & {
    readonly kind: 'sequenced';
}) | {
    readonly kind: 'migration-required';
    readonly values: SessionProjectionValues;
} | null;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionPromptRequest 公开契约

requestId由Client铸造并持久到确切接纳的user message；sessionId指定目标，mode为queue或steer。content必须至少有一个非空白text part或attachment，不能发送纯空输入。clientTimeZone是可选时区提示，非法值按领域码拒绝。输入接纳回执不保证模型轮次完成。

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionPromptRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionPromptRequest {
    readonly requestId: SessionRequestId;
    readonly sessionId: SessionId;
    readonly mode: 'queue' | 'steer';
    readonly content: readonly PromptContentPart[];
    readonly clientTimeZone?: string;
}
```

成员检索：`clientTimeZone`、`content`、`mode`、`requestId`、`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionPromptValue 公开契约

accepted:true只确认prompt已进入目标Agent inbox，不含模型最终响应。要跟踪执行，使用durable回执、Session事件或等待相应活动边界；未知网络结果先查requestId对应的持久消息，避免重复发送。

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionPromptValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionPromptValue {
    readonly accepted: true;
}
```

成员检索：`accepted`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionRenameRequest 公开契约

sessionId选择目标，title为待标准化标题。业务校验失败使用session/title-invalid而非静默接受空标题；确认成功后用返回的normalized title和seq更新本地视图。

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionRenameRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionRenameRequest {
    readonly sessionId: SessionId;
    readonly title: string;
}
```

成员检索：`sessionId`、`title`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionRenameValue 公开契约

title是Host规范化后的持久标题，seq是提交该变更的事件位置。它是完成提交证据，不应以发起请求时的本地title覆盖该规范值。

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionRenameValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionRenameValue {
    readonly title: string;
    readonly seq: number;
}
```

成员检索：`seq`、`title`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionRequestId 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionRequestId`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionRequestId = Branded<'session-request-id'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionSearchItem 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionSearchItem`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionSearchItem {
    readonly sessionId: SessionId;
    readonly snippet: string;
}
```

成员检索：`sessionId`、`snippet`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
