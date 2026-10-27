# @deepseek-ai/dsh-agent .：公开对象 4

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-agent 选型与组合](api-core-dsh-agent-root-overview.md)。

使用 `dsh-agent` 创建或恢复实时 agent（智能体）、发送后续或 steering（中途引导）输入、注入面向模型的上下文、取消工作，并等待 agent 进入空闲状态。插件、UI、钩子与编排器还可以观察或拦截 agent 活动，并仅为一个 agent 应用能力而不影响其他 agent。当代码需要通过公开 `Agent` API 控制或扩展实时 agent 时，请选择本包。请将它与 `dsh-agent-loop` 等 agent 驱动器配合使用；本包本身不会创建模型请求。发起方归因仅存在于进程内，跨 worker、进程、持久队列与重启时必须显式传递。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SessionStartSource 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`SessionStartSource`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionStartSource = 'startup' | 'resume' | 'clear' | 'compact';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## TurnBoundaryProjection 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`TurnBoundaryProjection`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TurnBoundaryProjection {
    readonly openTurnStartSeq: OptionalSessionSeq;
    readonly lastStepStartSeq: OptionalSessionSeq;
    readonly lastStepBoundary: {
        readonly kind: 'start' | 'end';
        readonly seq: SessionSeq;
    } | null;
    readonly lastTurn: number;
}
```

成员检索：`lastStepBoundary`、`lastStepStartSeq`、`lastTurn`、`openTurnStartSeq`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## agentCarrier 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`agentCarrier`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function agentCarrier(agent: Agent): Scoped<Agent>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## agentEvents 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`agentEvents`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function agentEvents(ctx: Context, agent: Agent, carrier?: Scoped<Agent>): AgentEventDispatch;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## assembleContextFor 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`assembleContextFor`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function assembleContextFor(agent: Agent, signal?: AbortSignal): AssembleContext;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## emitAgentEvent 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`emitAgentEvent`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function emitAgentEvent<K extends AgentSubjectEvent>(ctx: Context, agent: Agent, name: K, payload: PayloadRest<K>): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## foldConsumedWork 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`foldConsumedWork`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function foldConsumedWork(events: readonly SessionEvent[]): ConsumedWork;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。
