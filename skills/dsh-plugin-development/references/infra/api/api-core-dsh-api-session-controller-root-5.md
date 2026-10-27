# @deepseek-ai/dsh-api-session-controller .：公开对象 5

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-session-controller 选型与组合](api-core-dsh-api-session-controller-root-overview.md)。

`@deepseek-ai/dsh-api-session-controller` 拥有 Host 的 `ctx.sessionController` 服务，以及生成的 Client `session`、`skills` 和 `fileReferences` Remote namespace。它提供 Session 生命周期与历史、Host generation 模型目录、人工后台任务终止、工作区路径打开、用户可调用 skill（技能）发现和 Agent（智能体）范围的文件引用。当 Client 需要按 Session 寻址的操作时，请通过 API Gateway 使用它。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SessionFollowRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionFollowRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionFollowRequest extends Pick<SessionPageRequest, 'maxMessages' | 'turnWindow'> {
    readonly address: SessionAddress;
    readonly assistantStream?: true;
}
```

成员检索：`address`、`assistantStream`、`maxMessages`、`turnWindow`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionForkRequest 公开契约

sessionId为源；atSeq是包含该事件在内的精确source seq，省略选择最近完成turn前缀。allowMigration默认true；false要求Host先检查所需迁移，不能静默以不兼容格式fork。fork只继承耐久前缀，不复制运行中的外部进程资源。

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionForkRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionForkRequest {
    readonly sessionId: SessionId;
    readonly atSeq?: number;
    readonly allowMigration?: boolean;
}
```

成员检索：`allowMigration`、`atSeq`、`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionForkValue 公开契约

返回新fork Session身份；后续操作使用新id，不修改源Session。不要把源atSeq误当新会话日志偏移或重新编号已有闭合事件。

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionForkValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionForkValue {
    readonly sessionId: SessionId;
}
```

成员检索：`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionHistoryRecord 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionHistoryRecord`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionHistoryRecord = SessionEventEntry;
```

成员检索：`event`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionListMetadata 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionListMetadata`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionListMetadata {
    readonly blank: boolean;
    readonly lastPromptAt: number | null;
}
```

成员检索：`blank`、`lastPromptAt`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionListRequest 公开契约

cursor可省略，表达列表分页边界，不是SessionSeq；按返回契约处理分页，不把当前live Agent列表冒充完整持久目录。

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionListRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionListRequest {
    readonly cursor?: string;
}
```

成员检索：`cursor`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionListValue 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionListValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionListValue {
    readonly items: readonly SessionSummary[];
}
```

成员检索：`items`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionOpenWorkspacePathRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionOpenWorkspacePathRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionOpenWorkspacePathRequest {
    readonly action?: 'reveal';
    readonly application?: string;
    readonly path: string;
}
```

成员检索：`action`、`application`、`path`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
