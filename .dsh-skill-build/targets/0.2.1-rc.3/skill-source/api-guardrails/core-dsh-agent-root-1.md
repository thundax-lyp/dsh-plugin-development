# @deepseek-ai/dsh-agent .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-agent 选型与组合](api-core-dsh-agent-root-overview.md)。

使用 `dsh-agent` 创建或恢复实时 agent（智能体）、发送后续或 steering（中途引导）输入、注入面向模型的上下文、取消工作，并等待 agent 进入空闲状态。插件、UI、钩子与编排器还可以观察或拦截 agent 活动，并仅为一个 agent 应用能力而不影响其他 agent。当代码需要通过公开 `Agent` API 控制或扩展实时 agent 时，请选择本包。请将它与 `dsh-agent-loop` 等 agent 驱动器配合使用；本包本身不会创建模型请求。发起方归因仅存在于进程内，跨 worker、进程、持久队列与重启时必须显式传递。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Agent 公开契约

这是公开的live Agent句柄；id与session身份一致，session是耐久事实owner，ctx是Agent作用域、卸载后拒绝新注册。send显式选择target与wakeup，followup/steer/inject是固定路由别名，不代表任意消息已经执行。cancel在当前活动上保留首个cause，默认清除排队和steering工作，keepInbox保留待处理项；没有活动时不为未来工作预先设置取消。whenIdle等整个Agent活动静止，包括当前driver退出前替换的新活动，不保证某个特定message结算。只持有Agent不拥有销毁能力；创建者持有AgentHandle。

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`Agent`。

目标版本编译声明（省略源码注释与实现体）：

声明来源包 `@deepseek-ai/dsh-agent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface Agent {
    readonly id: SessionId;
}
```

声明来源包 `@deepseek-ai/dsh-agent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Agent {
    readonly options: AgentOptions;
    readonly session: Session;
    readonly inbox: Inbox;
    readonly status: AgentStatus;
    readonly ctx: Context;
    cancel(cause: AgentCancelCause, options?: CancelOptions): void;
    whenIdle(): Promise<void>;
    runMaintenance<T>(task: (signal: AbortSignal) => Promise<T>): Promise<T>;
    send(message: UserMessage, target: InboxTarget, wakeup: boolean): void;
    followup(message: UserMessage): void;
    steer(message: UserMessage): void;
    inject(message: UserMessage): void;
}
```

成员检索：`cancel`、`ctx`、`followup`、`id`、`inbox`、`inject`、`options`、`runMaintenance`、`send`、`session`、`status`、`steer`、`whenIdle`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## AgentCancelCause 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`AgentCancelCause`。

公开声明签名：

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

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## AgentEventDispatch 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`AgentEventDispatch`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AgentEventDispatch {
    emit<K extends AgentSubjectEvent>(name: K, payload: PayloadRest<K>): void;
    serial<K extends AgentSubjectEvent>(name: K, payload: PayloadRest<K>): Promise<Awaited<Return<Events[K]>>>;
    waterfall<K extends AgentSubjectEvent>(name: K, payload: PayloadRest<K>, ...rest: Tail<K>): Return<Events[K]>;
}
```

成员检索：`emit`、`serial`、`waterfall`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## AgentFactory 公开契约

这是registry委派的创建/恢复接口，具体loop provider经setFactory注册。消费插件仍调用ctx.agents以保持loop可替换；factory接收caller Context与options，不从parentAgent暗推调用方作用域，provider卸载负责停止其创建的live handles。

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`AgentFactory`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AgentFactory {
    createAgent(ownerCtx: Context, options: CreateAgentOptions): Promise<AgentHandle>;
    resume(ownerCtx: Context, options: ResumeAgentOptions): Promise<AgentHandle>;
}
```

成员检索：`createAgent`、`resume`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## AgentHandle 公开契约

create/resume返回拥有型句柄，agent是可调用对象，dispose是销毁能力；get(id)只返回裸Agent，不能据此取得另一owner的销毁权。dispose停止loop并等待退出、注销Agent、从store移除Session，最后拆除其scoped world。factory provider也是结构owner，provider卸载会停止其全部live handles。配置创建Agent归loop fiber，不另向任意消费方暴露销毁句柄。

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`AgentHandle`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AgentHandle {
    agent: Agent;
    dispose(): Promise<void>;
}
```

成员检索：`agent`、`dispose`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## AgentOptions 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`AgentOptions`。

目标版本编译声明（省略源码注释与实现体）：

声明来源包 `@deepseek-ai/dsh-agent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface AgentOptions {
    provider?: string;
    model?: string;
    reasoningEffort?: ReasoningEffortId;
    maxTokens?: number;
}
```

声明来源包 `@deepseek-ai/dsh-subagent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface AgentOptions {
    subagentDepth?: number;
}
```

成员检索：`maxTokens`、`model`、`provider`、`reasoningEffort`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## AgentRegistry 公开契约

`ctx.agents` 是活跃注册与工厂委派入口，具体创建和驱动由 loop 实现。create 的 sessionId 同时作为活跃 Agent 与 Session 身份；meta.cwd 必须绝对路径，durable seed 在异步 setup 前校验和快照。setup 在公布前装配工具、prompt、restriction、监听器和子插件，不驱动 Agent；可返回同步 commit 在最终公布点重验可变条件。setup throw、commit throw、创建取消或 owner disposal 均回滚未公布作用域。成功返回的 handle 持有创建的生命周期，调用方最终 dispose。

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`AgentRegistry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class AgentRegistry extends Service {
    constructor(ctx: Context);
    currentInitiator(): Agent | undefined;
    requireInitiator(): Agent;
    withInitiator<T>(agent: Agent, operation: () => T): T;
    withoutInitiator<T>(operation: () => T): T;
    setFactory(factory: AgentFactory): () => void;
    create(options: CreateAgentOptions): Promise<AgentHandle>;
    resume(options: ResumeAgentOptions): Promise<AgentHandle>;
    register(agent: Agent): ReturnType<Context['effect']>;
    enter(agent: Agent, owner: Agent | undefined): () => void;
    announce(agent: Agent, source: SessionStartSource, signal?: AbortSignal): Promise<void>;
    get(id: SessionId): Agent | undefined;
    isOwnedBy(id: SessionId, owner: Agent): boolean;
    list(): Agent[];
    roots(): Agent[];
}
```

成员检索：`announce`、`create`、`currentInitiator`、`enter`、`get`、`isOwnedBy`、`list`、`register`、`requireInitiator`、`resume`、`roots`、`setFactory`、`withInitiator`、`withoutInitiator`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## AgentSetup 公开契约

此回调装配未发布的Agent世界，返回void或AgentSetupCommit，也可异步。所有经agentCtx注册的scope资源先于session/created、agent/created和第一次prompt assembly存在。异步setup落定后才运行可选同步commit；回调不是Agent driver，不应在未公布阶段发送并驱动轮次。

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`AgentSetup`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type AgentSetup = (agentCtx: Context, agent: Agent) => AgentSetupCommit | Promise<AgentSetupCommit | void> | void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。
