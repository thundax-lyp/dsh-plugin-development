# @deepseek-ai/dsh-session .：公开对象 5

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-session 选型与组合](api-core-dsh-session-root-overview.md)。

`dsh-session` 在仅追加的会话日志中记录每个模型可见事实，并从该记录派生模型历史。消费方可以检查、回放、fork 和刷新会话，同时保留历史事件；压缩（compaction）会在活跃对话中隐藏被取代的条目，但不会删除它们。除非添加持久化后端，否则会话仅保留在内存中；持久性检查点会等待配置的后端。agent 需要可重建的会话记录时请选择本包；它本身不调用模型。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SessionStore 公开契约

SessionStore 注册为 `ctx.sessions`，拥有活跃 Session 与追加日志，不等同于磁盘持久化 provider。`create` 公布 Session，`prepare` 用于未发布准备；`get/list` 返回运行中索引。session/created 的同步 throw 可 veto 并触发配对 disposal，异步 rejection 只记录不能撤销同步发布。session/event 是提交后的通知，observer 失败不使已提交 append 失败。`flush(session)` 通过可等待的 session/flush 并行检查点驱动 persistence，不可将普通通知等同耐久确认。

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionStore`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class SessionStore extends Service {
    get messageProjections(): readonly SessionMessageProjection[];
    registerMessageProjection(projection: SessionMessageProjection): () => Promise<void>;
    constructor(ctx: Context);
    create(id?: SessionId, options?: CreateSessionOptions): Session;
    prepare(id?: SessionId, options?: PrepareSessionOptions): Session;
    enter(session: Session): () => void;
    announce(session: Session): void;
    flush(session: Session): Promise<boolean>;
    get(id: SessionId): Session | undefined;
    list(): Session[];
    fork(source: SessionForkSource, boundary?: SessionSeq, childSessionId?: SessionId): Session;
}
```

成员检索：`announce`、`create`、`enter`、`flush`、`fork`、`get`、`list`、`messageProjections`、`prepare`、`registerMessageProjection`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SessionSurface 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionSurface`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionSurface {
    readonly nodes: readonly SessionSeq[];
    readonly replaceGeneration: number;
    readonly contentGeneration: number;
}
```

成员检索：`contentGeneration`、`nodes`、`replaceGeneration`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SurfaceEvent 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SurfaceEvent`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SurfaceEvent = SessionEvent<SurfaceEventType>;
```

成员检索：`data`、`ignorable`、`seq`、`sourceEventSeqs`、`surfaceOp`、`time`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SurfaceEventType 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SurfaceEventType`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SurfaceEventType = 'system/message' | 'developer/message' | 'user/message' | 'assistant/message' | 'tool/result';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SurfaceFoldReplacement 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SurfaceFoldReplacement`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SurfaceFoldReplacement {
    seq: SessionSeq;
    start: SessionSeq;
    end: SessionSeq;
    shadowedSeqs: SessionSeq[];
}
```

成员检索：`end`、`seq`、`shadowedSeqs`、`start`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SurfaceFoldResult 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SurfaceFoldResult`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SurfaceFoldResult {
    nodes: SessionSeq[];
    replacements: SurfaceFoldReplacement[];
    projectedMessages: ReadonlyMap<SessionSeq, Message>;
}
```

成员检索：`nodes`、`projectedMessages`、`replacements`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SurfaceIntent 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SurfaceIntent`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SurfaceIntent<T extends SurfaceEventType = SurfaceEventType> = {
    surfaceOp: SurfaceOp;
} & (T extends 'assistant/message' ? {
    sourceEventSeqs?: never;
} : {
    sourceEventSeqs?: SessionSeq[];
});
```

成员检索：`sourceEventSeqs`、`surfaceOp`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SurfaceOp 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SurfaceOp`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SurfaceOp = 'append' | {
    op: 'replace';
    startSeq: SessionSeq;
    endSeq: SessionSeq;
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。
