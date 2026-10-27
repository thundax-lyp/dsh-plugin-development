# @deepseek-ai/dsh-api-session-controller .：公开对象 8

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-session-controller 选型与组合](api-core-dsh-api-session-controller-root-overview.md)。

`@deepseek-ai/dsh-api-session-controller` 拥有 Host 的 `ctx.sessionController` 服务，以及生成的 Client `session`、`skills` 和 `fileReferences` Remote namespace。它提供 Session 生命周期与历史、Host generation 模型目录、人工后台任务终止、工作区路径打开、用户可调用 skill（技能）发现和 Agent（智能体）范围的文件引用。当 Client 需要按 Session 寻址的操作时，请通过 API Gateway 使用它。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SessionSearchRequest 公开契约

query是搜索文本；结果受Host上限与snippet截断约束。客户端呈现时使用hasMore标示未完全返回，不能把一个有限结果页当作完整无匹配证明。

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionSearchRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionSearchRequest {
    readonly query: string;
}
```

成员检索：`query`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionSearchValue 公开契约

items是当前有限搜索结果，hasMore标示存在更多结果而非服务错误。snippet有code-point限额，不能将其截断显示当完整原文用于后续业务改写。

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionSearchValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionSearchValue {
    readonly items: readonly SessionSearchItem[];
    readonly hasMore: boolean;
}
```

成员检索：`hasMore`、`items`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionSelectModelRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionSelectModelRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionSelectModelRequest extends ModelSelection {
    readonly sessionId: SessionId;
}
```

成员检索：`model`、`provider`、`reasoningEffort`、`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionSelectModelValue 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionSelectModelValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionSelectModelValue {
    readonly selected: ModelSelection;
}
```

成员检索：`selected`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionSkillCatalog 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionSkillCatalog`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class SessionSkillCatalog extends TypertRemoteService {
    static inject: string[];
    constructor(ctx: Context);
    list(request: SkillListRequest, signal: AbortSignal): Promise<SkillListValue>;
}
```

成员检索：`list`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionSummary 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionSummary`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionSummary {
    readonly agentAvailable: boolean;
    readonly formatStatus?: 'current' | 'migration-required';
    readonly sessionId: SessionId;
    readonly updatedAt: number;
    readonly running: boolean;
    readonly blank: boolean;
    readonly parentSessionId?: SessionId;
    readonly origin?: 'subagent';
    readonly cwd?: string;
    readonly projections?: SessionProjectionHints;
}
```

成员检索：`agentAvailable`、`blank`、`cwd`、`formatStatus`、`origin`、`parentSessionId`、`projections`、`running`、`sessionId`、`updatedAt`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionUpdateQueueRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionUpdateQueueRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionUpdateQueueRequest {
    readonly sessionId: SessionId;
    readonly itemId: MessageId;
    readonly action: QueueAction;
}
```

成员检索：`action`、`itemId`、`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionUpdateQueueValue 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionUpdateQueueValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionUpdateQueueValue {
    readonly accepted: true;
}
```

成员检索：`accepted`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
