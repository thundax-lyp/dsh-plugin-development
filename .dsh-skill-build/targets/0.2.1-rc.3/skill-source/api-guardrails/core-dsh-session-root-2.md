# @deepseek-ai/dsh-session .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-session 选型与组合](api-core-dsh-session-root-overview.md)。

`dsh-session` 在仅追加的会话日志中记录每个模型可见事实，并从该记录派生模型历史。消费方可以检查、回放、fork 和刷新会话，同时保留历史事件；压缩（compaction）会在活跃对话中隐藏被取代的条目，但不会删除它们。除非添加持久化后端，否则会话仅保留在内存中；持久性检查点会等待配置的后端。agent 需要可重建的会话记录时请选择本包；它本身不调用模型。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## PluginRecordMap 公开契约

由拥有插件记录格式的包通过声明合并扩展，键决定plugin record的类型化payload。这里只声明领域事实，追加使用公开Session API；模型可见状态必须由日志重建，不在map里放Service或运行资源。新的格式与迁移责任归记录owner。

导入入口：`@deepseek-ai/dsh-session`；公开符号：`PluginRecordMap`。

目标版本编译声明（省略源码注释与实现体）：

声明来源包 `@deepseek-ai/dsh-session`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface PluginRecordMap {
}
```

声明来源包 `@deepseek-ai/dsh-experimental-translator`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface PluginRecordMap {
    'plugin:translator/request': TranslationRequestRecord;
    'plugin:translator/result': TranslationResultRecord;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## PluginRecordType 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`PluginRecordType`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type PluginRecordType = `plugin:${string}`;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## PrepareSessionOptions 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`PrepareSessionOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type PrepareSessionOptions = (CreateSessionOptions & {
    readonly eventState?: undefined;
}) | RestoredSessionOptions;
```

成员检索：`eventState`、`inheritedEventCount`、`meta`、`seed`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## RequestContext 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`RequestContext`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RequestContext {
    provider: string;
    model: string;
    contextWindow?: number;
    systemPromptUpdate?: SystemPromptUpdate;
}
```

成员检索：`contextWindow`、`model`、`provider`、`systemPromptUpdate`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## RequestHeaderReason 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`RequestHeaderReason`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RequestHeaderReason = 'initial' | 'resume' | 'change' | 'series';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## RestoredSessionOptions 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`RestoredSessionOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RestoredSessionOptions {
    readonly seed: SessionEvent[];
    readonly meta: SessionHeader;
    readonly inheritedEventCount: SessionLogOffset;
    readonly eventState: SessionSeedEventState;
}
```

成员检索：`eventState`、`inheritedEventCount`、`meta`、`seed`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SESSION_FORMAT_VERSION 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SESSION_FORMAT_VERSION`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const SESSION_FORMAT_VERSION = 4;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## Session 公开契约

Session 的日志是模型可见事实来源，追加数据应为可无损 JSON 且满足事件类型。SessionSeq 是事件序号，SessionLogOffset 是日志边界位置，二者不能互换。fork 的 seed 要求从 seq 0 连续且精确保留继承前缀，不能重新编号已关闭 turn/step。工具中断恢复要区分未执行与结果未知，不能把未知结果当成安全重试依据。Session 的持久化、物化消息和活跃 Agent 是不同责任，不能通过复制某一个内存对象完成持久恢复。

导入入口：`@deepseek-ai/dsh-session`；公开符号：`Session`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class Session {
    get surface(): SessionSurface;
    readonly header: SessionHeader;
    readonly inheritedEventCount: SessionLogOffset;
    get id(): SessionId;
    readonly firstLiveSeq: SessionLogOffset;
    readonly firstLifecycleSeq: SessionLogOffset;
    static create(id: SessionId, seed?: readonly SessionEvent[], header?: SessionHeader, inheritedEventCount?: SessionLogOffset, projections?: readonly SessionMessageProjection[]): Session;
    static fromRestore(id: SessionId, seed: readonly SessionEvent[], header: SessionHeader, inheritedEventCount: SessionLogOffset, eventState: SessionSeedEventState, projections?: readonly SessionMessageProjection[]): Session;
    isOwnSeq(seq: SessionSeq): boolean;
    get seq(): SessionLogOffset;
    append<T extends SessionEventType>(type: T, data: SessionEventMap[T], ...opts: T extends SurfaceEventType ? [
        opts: SurfaceIntent<T>
    ] : [
    ]): SessionEvent<T>;
    requestHeader(): EpochHeader | undefined;
    requestContext(): RequestContext | undefined;
    toolHistory(): ToolHistory;
    deriveMessages(): Message[];
    deriveEventMessage(event: SessionEvent): Message | null;
}
```

成员检索：`append`、`deriveEventMessage`、`deriveMessages`、`firstLifecycleSeq`、`firstLiveSeq`、`header`、`id`、`inheritedEventCount`、`isOwnSeq`、`requestContext`、`requestHeader`、`seq`、`surface`、`toolHistory`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。
