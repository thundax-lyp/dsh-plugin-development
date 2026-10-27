# @deepseek-ai/dsh-api-session-controller .：公开对象 6

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-session-controller 选型与组合](api-core-dsh-api-session-controller-root-overview.md)。

`@deepseek-ai/dsh-api-session-controller` 拥有 Host 的 `ctx.sessionController` 服务，以及生成的 Client `session`、`skills` 和 `fileReferences` Remote namespace。它提供 Session 生命周期与历史、Host generation 模型目录、人工后台任务终止、工作区路径打开、用户可调用 skill（技能）发现和 Agent（智能体）范围的文件引用。当 Client 需要按 Session 寻址的操作时，请通过 API Gateway 使用它。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SessionOpenWorkspacePathValue 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionOpenWorkspacePathValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionOpenWorkspacePathValue {
    readonly opened: true;
}
```

成员检索：`opened`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionPage 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionPage`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionPage {
    readonly records: readonly SessionHistoryRecord[];
    readonly hasMore: boolean;
}
```

成员检索：`hasMore`、`records`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionPageRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionPageRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionPageRequest {
    readonly address: SessionAddress;
    readonly throughSeq: number;
    readonly beforeSeq?: number;
    readonly maxMessages?: number;
    readonly turnWindow?: {
        readonly minMessages: number;
        readonly minTurns: number;
    };
}
```

成员检索：`address`、`beforeSeq`、`maxMessages`、`throughSeq`、`turnWindow`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionProjectionBaseline 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionProjectionBaseline`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionProjectionBaseline {
    readonly asOfSeq: number;
    readonly values: SessionProjectionValues;
}
```

成员检索：`asOfSeq`、`values`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionProjectionHints 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionProjectionHints`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionProjectionHints {
    readonly kind: 'cached' | 'sequenced';
    readonly asOfSeq: number;
    readonly values: SessionProjectionValues;
}
```

成员检索：`asOfSeq`、`kind`、`values`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionProjectionUpdate 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionProjectionUpdate`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionProjectionUpdate {
    readonly sessionId: SessionId;
    readonly key: string;
    readonly value: JsonValue;
    readonly seq: number;
}
```

成员检索：`key`、`seq`、`sessionId`、`value`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionProjectionValue 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionProjectionValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionProjectionValue = JsonValue;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionProjectionValues 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionProjectionValues`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionProjectionValues = Partial<SessionProjectionMap> & Readonly<Record<string, SessionProjectionValue>>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `imageLimits` | `imageLimits: ImageAttachmentLimits;` | 来自 `SessionProjectionMap` 的公开继承或联合分支 |
| `modelSelection` | `modelSelection: ModelSelectionProjection;` | 来自 `SessionProjectionMap` 的公开继承或联合分支 |
| `sessionListMetadata` | `sessionListMetadata: SessionListMetadata;` | 来自 `SessionProjectionMap` 的公开继承或联合分支 |
