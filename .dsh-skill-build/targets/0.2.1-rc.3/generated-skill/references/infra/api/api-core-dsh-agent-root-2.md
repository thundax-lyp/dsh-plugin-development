# @deepseek-ai/dsh-agent .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-agent 选型与组合](api-core-dsh-agent-root-overview.md)。

使用 `dsh-agent` 创建或恢复实时 agent（智能体）、发送后续或 steering（中途引导）输入、注入面向模型的上下文、取消工作，并等待 agent 进入空闲状态。插件、UI、钩子与编排器还可以观察或拦截 agent 活动，并仅为一个 agent 应用能力而不影响其他 agent。当代码需要通过公开 `Agent` API 控制或扩展实时 agent 时，请选择本包。请将它与 `dsh-agent-loop` 等 agent 驱动器配合使用；本包本身不会创建模型请求。发起方归因仅存在于进程内，跨 worker、进程、持久队列与重启时必须显式传递。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## AgentSetupCommit 公开契约

commit只允许同步返回void，执行点在所有setup awaits落定之后且紧邻registry发布；用途是对可变provision状态做最终校验。throw阻止发布并回滚未公布scope，不能把返回Promise当成等待的commit。

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`AgentSetupCommit`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AgentSetupCommit {
    commit(): void;
}
```

成员检索：`commit`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## AgentStatus 公开契约

表示live Agent生命周期的状态值；观察agent/status获取状态变化。idle是当前活动静止，不是某条message的因果回执；忙碌/取消和耐久入队结果须结合inbox与Session事件，不通过单个状态字符串推断业务已完成。

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`AgentStatus`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type AgentStatus = 'idle' | 'running';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## AgentSubjectEvent 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`AgentSubjectEvent`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type AgentSubjectEvent = {
    [K in keyof Events]: Events[K] extends (this: Scoped<Agent>, ...args: infer P) => unknown ? P extends [
        infer Payload,
        ...unknown[]
    ] ? Payload extends {
        agent: Agent;
    } ? K : never : never : never;
}[keyof Events];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## AssistantStreamFrame 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`AssistantStreamFrame`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type AssistantStreamFrame = {
    readonly type: 'start';
    readonly attemptId: LlmAttemptId;
    readonly revision: number;
    readonly turn: number;
    readonly step: number;
} | {
    readonly type: 'chunk';
    readonly attemptId: LlmAttemptId;
    readonly revision: number;
    readonly index: number;
    readonly time: number;
    readonly chunk: StreamChunk;
} | {
    readonly type: 'end';
    readonly attemptId: LlmAttemptId;
    readonly revision: number;
    readonly index: number;
    readonly outcome: {
        readonly kind: 'committed';
        readonly eventType: 'assistant/message' | 'assistant/attempt';
        readonly seq: SessionSeq;
    } | {
        readonly kind: 'abandoned';
    };
};
```

成员检索：`attemptId`、`revision`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## CancelOptions 公开契约

keepInbox控制取消当前活动时是否保留待处理inbox；省略则清除排队和steering工作。取消不撤销已提交的Session事实或已经发生的外部副作用，同一活动的首个cause保持不变。

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`CancelOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CancelOptions {
    keepInbox?: boolean | undefined;
}
```

成员检索：`keepInbox`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## ConsumedWork 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`ConsumedWork`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ConsumedWork {
    readonly end?: SessionEvent<'turn/end'>;
    readonly droppedUnrun: boolean;
}
```

成员检索：`droppedUnrun`、`end`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## CreateAgentOptions 公开契约

sessionId是调用方给出的唯一live Agent/Session身份；parentAgent表达运行时owner关系，meta表达durable cwd、fork lineage、来源和深度。seed从seq0连续且数据可无损JSON，inheritedEventCount记录精确fork切点。signal仅创建期有效，成功句柄可见前解除该关联。setup在公布前接收(agentCtx,agent)，可注册子插件和scoped工具；不运行Agent。setup返回的同步commit紧邻公布点执行，任一步失败回滚且两个id不公布。

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`CreateAgentOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CreateAgentOptions {
    readonly sessionId: SessionId;
    readonly parentAgent?: Agent;
    readonly meta?: {
        readonly cwd?: string;
        readonly parentSession?: SessionId;
        readonly isSeeded?: boolean;
        readonly origin?: 'subagent';
        readonly delegationDepth?: number;
        readonly agentPreset?: string;
    };
    readonly inheritedEventCount?: SessionLogOffset;
    readonly seed?: readonly SessionEvent[];
    readonly agentOptions?: AgentOptions;
    readonly signal?: AbortSignal;
    readonly setup?: AgentSetup;
}
```

成员检索：`agentOptions`、`inheritedEventCount`、`meta`、`parentAgent`、`seed`、`sessionId`、`setup`、`signal`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## Inbox 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`Inbox`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Inbox {
    readonly nextTurn: readonly UserMessage[];
    readonly nextStep: readonly UserMessage[];
    clear(): void;
    append(target: InboxTarget, message: UserMessage): void;
    prepend(target: InboxTarget, message: UserMessage): void;
    replace(messageId: MessageId, newMessage: UserMessage): boolean;
    remove(messageId: MessageId): boolean;
    splice(target: InboxTarget, start: number, deleteCount: number, inserted: UserMessage[]): UserMessage[];
}
```

成员检索：`append`、`clear`、`nextStep`、`nextTurn`、`prepend`、`remove`、`replace`、`splice`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。
