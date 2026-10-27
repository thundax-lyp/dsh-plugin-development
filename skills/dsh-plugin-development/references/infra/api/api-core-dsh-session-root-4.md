# @deepseek-ai/dsh-session .：公开对象 4

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-session 选型与组合](api-core-dsh-session-root-overview.md)。

`dsh-session` 在仅追加的会话日志中记录每个模型可见事实，并从该记录派生模型历史。消费方可以检查、回放、fork 和刷新会话，同时保留历史事件；压缩（compaction）会在活跃对话中隐藏被取代的条目，但不会删除它们。除非添加持久化后端，否则会话仅保留在内存中；持久性检查点会等待配置的后端。agent 需要可重建的会话记录时请选择本包；它本身不调用模型。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SessionLogOffset 公开契约

Session日志边界位置，表示从起点算的事件数量或切点；它可以指向末尾而不对应实际事件。切prefix、恢复游标和fork继承数用此类型，不与事件seq互换。

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionLogOffset`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function SessionLogOffset(value: number): SessionLogOffset;

export type SessionLogOffset = BrandedNumber<'SessionLogOffset'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SessionMessageProjection 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionMessageProjection`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionMessageProjection<T extends SessionEventType = SessionEventType> {
    type: T;
    project(event: SessionEvent<T>, context: SessionMessageProjectionContext): ReadonlyMap<SessionSeq, Message>;
}
```

成员检索：`project`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SessionMessageProjectionContext 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionMessageProjectionContext`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionMessageProjectionContext {
    nodes: readonly SessionSeq[];
    events: readonly SessionEvent[];
    baseSeq: SessionLogOffset;
    messages: ReadonlyMap<SessionSeq, Message>;
}
```

成员检索：`baseSeq`、`events`、`messages`、`nodes`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SessionPreparation 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionPreparation`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class SessionPreparation implements Disposable {
    readonly session: Session;
    static create(session: Session, options?: SessionPreparationOptions): SessionPreparation;
    [Symbol.dispose](): void;
}
```

成员检索：`session`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SessionPreparationOptions 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionPreparationOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionPreparationOptions {
    readonly release?: () => void;
}
```

成员检索：`release`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SessionSeedEventState 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionSeedEventState`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionSeedEventState = 'detached' | 'shared-frozen';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SessionSeq 公开契约

单条Session事件的零基序号；表示具体事件，不是日志末尾边界。与SessionLogOffset分开，不把某事件seq直接当成已消费事件数量或fork前缀长度。

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionSeq`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function SessionSeq(value: number): SessionSeq;

export type SessionSeq = BrandedNumber<'SessionSeq'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SessionSeqCursor 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionSeqCursor`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionSeqCursor = SessionSeq | -1;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。
