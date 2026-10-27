# @deepseek-ai/dsh-session .：公开对象 7

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-session 选型与组合](api-core-dsh-session-root-overview.md)。

`dsh-session` 在仅追加的会话日志中记录每个模型可见事实，并从该记录派生模型历史。消费方可以检查、回放、fork 和刷新会话，同时保留历史事件；压缩（compaction）会在活跃对话中隐藏被取代的条目，但不会删除它们。除非添加持久化后端，否则会话仅保留在内存中；持久性检查点会等待配置的后端。agent 需要可重建的会话记录时请选择本包；它本身不调用模型。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## UserMessage 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`UserMessage`。

公开声明签名：

```text
export interface UserMessage extends MessageBase {
    readonly role: 'user';
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `content` | `readonly content: readonly ContentBlock[];` | 来自 `MessageBase` 的公开继承或联合分支 |
| `id` | `readonly id: MessageId;` | 来自 `MessageBase` 的公开继承或联合分支 |
| `source` | `readonly source: MessageSource;` | 来自 `MessageBase` 的公开继承或联合分支 |

## adoptSessionEvent 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`adoptSessionEvent`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function adoptSessionEvent<T extends SessionEvent>(event: T): T;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## appendPluginRecord 公开契约

这是向Session追加有类型plugin事实的辅助函数，按PluginRecordMap选payload。它遵守同一Session追加/校验边界，不能用于绕过事件规范或直接把任意运行对象持久化。observer失败不回滚已经提交的记录，耐久完成仍通过flush确认。

导入入口：`@deepseek-ai/dsh-session`；公开符号：`appendPluginRecord`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function appendPluginRecord<K extends Extract<keyof PluginRecordMap, PluginRecordType>>(session: Session, type: K, data: NoInfer<PluginRecordMap[K]>): SessionSeq;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## buildForkSeed 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`buildForkSeed`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function buildForkSeed(events: readonly SessionEvent[], boundary: SessionSeqType): SessionEvent[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## canonicalHeader 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`canonicalHeader`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function canonicalHeader(header: EpochHeader): EpochHeader;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## decodeSeqRanges 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`decodeSeqRanges`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function decodeSeqRanges(value: unknown, maxEntries?: number): SessionSeqType[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## deriveEventMessage 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`deriveEventMessage`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function deriveEventMessage(event: SessionEvent, projectedMessages?: ReadonlyMap<SessionSeq, Message>): Message | null;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。
