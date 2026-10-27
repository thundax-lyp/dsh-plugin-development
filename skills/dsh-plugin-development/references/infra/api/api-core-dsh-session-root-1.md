# @deepseek-ai/dsh-session .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-session 选型与组合](api-core-dsh-session-root-overview.md)。

`dsh-session` 在仅追加的会话日志中记录每个模型可见事实，并从该记录派生模型历史。消费方可以检查、回放、fork 和刷新会话，同时保留历史事件；压缩（compaction）会在活跃对话中隐藏被取代的条目，但不会删除它们。除非添加持久化后端，否则会话仅保留在内存中；持久性检查点会等待配置的后端。agent 需要可重建的会话记录时请选择本包；它本身不调用模型。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## AgentCancelCause 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`AgentCancelCause`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type AgentCancelCause = {
    readonly kind: 'user';
} | {
    readonly kind: 'parent';
} | {
    readonly kind: 'hook';
    readonly reason: string;
} | {
    readonly kind: 'disposed';
};
```

成员检索：`kind`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## AssistantMessage 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`AssistantMessage`。

公开声明签名：

```text
export interface AssistantMessage extends MessageBase {
    readonly role: 'assistant';
    readonly source: ModelMessageSource;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `content` | `readonly content: readonly ContentBlock[];` | 来自 `MessageBase` 的公开继承或联合分支 |
| `id` | `readonly id: MessageId;` | 来自 `MessageBase` 的公开继承或联合分支 |

## CreateSessionOptions 公开契约

创建选项承载可验证的创建header/meta和可选seed。cwd为绝对路径；fork seed必须连续且明确继承前缀。数据在异步setup前做snapshot，不能让调用方后续修改输入对象改变已经接纳的创建事实。不要把仅内存创建等同磁盘持久化。

导入入口：`@deepseek-ai/dsh-session`；公开符号：`CreateSessionOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CreateSessionOptions {
    readonly seed?: readonly SessionEvent[];
    readonly inheritedEventCount?: SessionLogOffset;
    readonly meta?: {
        readonly cwd?: string;
        readonly parentSession?: SessionId;
        readonly createdAt?: number;
        readonly isSeeded?: boolean;
        readonly origin?: 'subagent';
        readonly delegationDepth?: number;
        readonly agentPreset?: string;
    };
}
```

成员检索：`inheritedEventCount`、`meta`、`seed`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## DeveloperMessage 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`DeveloperMessage`。

公开声明签名：

```text
export interface DeveloperMessage extends MessageBase {
    readonly role: 'developer';
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

## EpochHeader 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`EpochHeader`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface EpochHeader {
    config: LlmCallConfig;
    adapterDefaults?: LlmCallConfigAdapterDefaults;
    tools?: ToolSchema[];
    system?: never;
}
```

成员检索：`adapterDefaults`、`config`、`system`、`tools`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## KNOWN_SESSION_EVENT_TYPES 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`KNOWN_SESSION_EVENT_TYPES`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const KNOWN_SESSION_EVENT_TYPES: ReadonlySet<string>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## OptionalSessionSeq 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`OptionalSessionSeq`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type OptionalSessionSeq = SessionSeq | null;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## PluginRecord 公开契约

插件耐久事实的类型化记录，payload必须是可无损JSON的数据。使用对应PluginRecordMap键保持读写一致；重复投影不重复追加同一业务副作用，恢复时从记录推导状态而非重放外部动作。

导入入口：`@deepseek-ai/dsh-session`；公开符号：`PluginRecord`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PluginRecord {
    readonly type: PluginRecordType;
    readonly seq: SessionSeq;
    readonly time: number;
    readonly data: unknown;
}
```

成员检索：`data`、`seq`、`time`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。
