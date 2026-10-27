# @deepseek-ai/dsh-session .：公开对象 8

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-session 选型与组合](api-core-dsh-session-root-overview.md)。

`dsh-session` 在仅追加的会话日志中记录每个模型可见事实，并从该记录派生模型历史。消费方可以检查、回放、fork 和刷新会话，同时保留历史事件；压缩（compaction）会在活跃对话中隐藏被取代的条目，但不会删除它们。除非添加持久化后端，否则会话仅保留在内存中；持久性检查点会等待配置的后端。agent 需要可重建的会话记录时请选择本包；它本身不调用模型。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## encodeSeqRanges 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`encodeSeqRanges`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function encodeSeqRanges(values: readonly SessionSeqType[]): EncodedSeq[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## foldRequestHeader 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`foldRequestHeader`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function foldRequestHeader(events: readonly SessionEvent[], from?: EpochHeader): EpochHeader | undefined;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## foldSurface 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`foldSurface`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function foldSurface(events: readonly SessionEvent[], projections?: readonly SessionMessageProjection[]): SurfaceFoldResult;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## headerEquals 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`headerEquals`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function headerEquals(a: EpochHeader, b: EpochHeader): boolean;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## interruptedTurnClosers 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`interruptedTurnClosers`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function interruptedTurnClosers(events: readonly SessionEvent[]): SessionEvent[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## isAppendSurfaceEvent 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`isAppendSurfaceEvent`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function isAppendSurfaceEvent(event: SessionEvent): event is SurfaceEvent & {
    surfaceOp: 'append';
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## isReplacementSurfaceEvent 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`isReplacementSurfaceEvent`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function isReplacementSurfaceEvent(event: SessionEvent): event is SurfaceEvent & {
    surfaceOp: Extract<SurfaceOp, {
        op: 'replace';
    }>;
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## isSurfaceEligibleType 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`isSurfaceEligibleType`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function isSurfaceEligibleType(type: string): boolean;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。
