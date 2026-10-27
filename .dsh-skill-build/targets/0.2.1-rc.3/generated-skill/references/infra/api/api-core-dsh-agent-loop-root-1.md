# @deepseek-ai/dsh-agent-loop .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-agent-loop 选型与组合](api-core-dsh-agent-loop-root-overview.md)。

`dsh-agent-loop` 创建全新 agent 或恢复持久化会话，随后通过模型请求、流式响应、工具执行和持久会话历史驱动每个轮次。标准 agent 组合应挂载本包；声明式条目会在启动时启动 agent，公开的 `ctx.agents` API 则支持以编程方式创建和恢复 agent。`maxParallelToolCalls` 限制同时运行的并行安全调用数量，独占调用保留顺序。取消会保留已经流式交付给用户的文本。只有标准的「调用模型、运行工具、重复」生命周期无法满足需求时，才应选择自定义 `Agent` 实现。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## AgentLoop 公开契约

导入入口：`@deepseek-ai/dsh-agent-loop`；公开符号：`AgentLoop`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class AgentLoop extends Service implements AgentFactory {
    static inject: string[];
    static Config: z<{
        agents?: Config['agents'];
        maxParallelToolCalls?: number;
    }, Config>;
    readonly config: Config;
    constructor(ctx: Context, config: Config);
    create(id: SessionId, options?: AgentOptions, meta?: Pick<SessionHeader, 'cwd'>): Promise<Agent>;
    createAgent(ownerCtx: Context, options: CreateAgentOptions): Promise<AgentHandle>;
    resume(ownerCtx: Context, options: ResumeAgentOptions): Promise<AgentHandle>;
}
```

成员检索：`config`、`create`、`createAgent`、`resume`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## CONFIGURED_AGENT_IDENTITIES_KEY 公开契约

导入入口：`@deepseek-ai/dsh-agent-loop`；公开符号：`CONFIGURED_AGENT_IDENTITIES_KEY`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const CONFIGURED_AGENT_IDENTITIES_KEY = "configuredAgentIdentities";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-agent-loop`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    maxParallelToolCalls: Volatile<number>;
    agents: (AgentOptions & {
        id: string;
        sessionId?: SessionId;
        cwd?: string;
        resumeSessionId?: SessionId;
    })[];
}
```

成员检索：`agents`、`maxParallelToolCalls`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## ConfiguredAgentIdentities 公开契约

导入入口：`@deepseek-ai/dsh-agent-loop`；公开符号：`ConfiguredAgentIdentities`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ConfiguredAgentIdentities extends Readonly<Record<string, LauncherAgentIdentity>> {
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## DEFAULT_MAX_PARALLEL_TOOL_CALLS 公开契约

导入入口：`@deepseek-ai/dsh-agent-loop`；公开符号：`DEFAULT_MAX_PARALLEL_TOOL_CALLS`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const DEFAULT_MAX_PARALLEL_TOOL_CALLS = 10;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## LauncherAgentIdentity 公开契约

导入入口：`@deepseek-ai/dsh-agent-loop`；公开符号：`LauncherAgentIdentity`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface LauncherAgentIdentity {
    id: SessionId;
    resume: boolean;
}
```

成员检索：`id`、`resume`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## turnBoundaryProjectionDefinition 公开契约

导入入口：`@deepseek-ai/dsh-agent-loop`；公开符号：`turnBoundaryProjectionDefinition`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const turnBoundaryProjectionDefinition: {
    key: "turnBoundary";
    stateVersion: number;
    stateSchema: zod.ZodType<TurnBoundaryProjection, unknown, zod.core.$ZodTypeInternals<TurnBoundaryProjection, unknown>>;
    init: () => {
        openTurnStartSeq: null;
        lastStepStartSeq: null;
        lastStepBoundary: null;
        lastTurn: number;
    };
    apply: (state: NoInfer<TurnBoundaryProjection>, event: import("@deepseek-ai/dsh-session").SessionEvent) => TurnBoundaryProjection;
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。
