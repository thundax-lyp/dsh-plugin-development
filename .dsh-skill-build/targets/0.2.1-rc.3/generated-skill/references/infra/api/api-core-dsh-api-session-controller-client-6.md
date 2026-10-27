# @deepseek-ai/dsh-api-session-controller ./client：公开对象 6

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-session-controller 选型与组合](api-core-dsh-api-session-controller-client-overview.md)。

`@deepseek-ai/dsh-api-session-controller` 拥有 Host 的 `ctx.sessionController` 服务，以及生成的 Client `session`、`skills` 和 `fileReferences` Remote namespace。它提供 Session 生命周期与历史、Host generation 模型目录、人工后台任务终止、工作区路径打开、用户可调用 skill（技能）发现和 Agent（智能体）范围的文件引用。当 Client 需要按 Session 寻址的操作时，请通过 API Gateway 使用它。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SessionListState 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionListState`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionListState {
    ids: SessionId[];
    byId: Record<SessionId, SessionSummary>;
    phase: SessionListPhase;
    projectionsBySession: Readonly<Record<SessionId, SessionProjectionSnapshot>>;
}
```

成员检索：`byId`、`ids`、`phase`、`projectionsBySession`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionLiveEventEntry 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionLiveEventEntry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionLiveEventEntry = Extract<SessionEventLikeEntry, {
    readonly type: 'event';
}>;
```

成员检索：`event`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionProjectionMap 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionProjectionMap`。

公开声明签名：

声明来源包 `@deepseek-ai/dsh-session-projection`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface SessionProjectionMap {
}
```

声明来源包 `@deepseek-ai/dsh-agent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionMap {
    inbox: InboxWireState;
}
```

声明来源包 `@deepseek-ai/dsh-subagent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionMap {
    subagentCatalog: SubagentCatalogEntry[];
    subagentTiming: SubagentTimingProjection;
    subagent: SubagentIdentityProjection | null;
}
```

声明来源包 `@deepseek-ai/dsh-user-questions`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionMap {
    userQuestions: UserQuestionProjectionView;
}
```

声明来源包 `@deepseek-ai/dsh-session-title`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionMap {
    title: string | null;
}
```

声明来源包 `@deepseek-ai/dsh-goal`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionMap {
    goal: GoalProjection | null;
}
```

声明来源包 `@deepseek-ai/dsh-permission-presets`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionMap {
    permissions: PermissionSelection;
}
```

声明来源包 `@deepseek-ai/dsh-experimental-agent-team`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionMap {
    agentTeam: TeamProjection;
}
```

声明来源包 `@deepseek-ai/dsh-token-meter`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionMap {
    tokenUsage: TokenUsageProjection;
    contextPressure: ContextPressureProjection;
    contextBreakdown: ContextBreakdownProjection;
}
```

声明来源包 `@deepseek-ai/dsh-plan-mode`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionMap {
    plan: PlanProjection;
}
```

声明来源包 `@deepseek-ai/dsh-agent-preset-registry`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionMap {
    agentPreset: string | null;
}
```

声明来源包 `@deepseek-ai/dsh-api-session-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionMap {
    sessionListMetadata: SessionListMetadata;
    imageLimits: ImageAttachmentLimits;
    modelSelection: ModelSelectionProjection;
}
```

声明来源包 `@deepseek-ai/dsh-tool-todo`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionMap {
    todos: TodoItem[] | null;
}
```

声明来源包 `@deepseek-ai/dsh-session-stats`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionMap {
    sessionStats: SessionStatsProjection;
}
```

声明来源包 `@deepseek-ai/dsh-session-turn-outline`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionMap {
    turnOutline: readonly TurnOutlineEntry[];
}
```

声明来源包 `@deepseek-ai/dsh-working-directory`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionMap {
    workingDirectory: string | null;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionProjectionSnapshot 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionProjectionSnapshot`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionProjectionSnapshot {
    readonly values: Readonly<Partial<SessionProjectionMap>>;
    readonly state: 'idle' | 'loading' | 'ready' | 'migration-required' | 'error';
    readonly error: RemoteFailure | null;
}
```

成员检索：`error`、`state`、`values`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionReference 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionReference`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionReference extends Disposable {
    readonly sessionId: SessionId;
    readonly binding: SessionBinding;
    readonly ready: Promise<SessionBinding>;
    release(): void;
}
```

成员检索：`binding`、`ready`、`release`、`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionReferenceSource 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionReferenceSource`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionReferenceSource = Extract<keyof SessionReferenceSourceMap, string>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionReferenceSourceMap 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionReferenceSourceMap`。

目标版本编译声明（省略源码注释与实现体）：

声明来源包 `@deepseek-ai/dsh-api-session-controller`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface SessionReferenceSourceMap {
    controllerOperation: unknown;
    gateway: unknown;
}
```

声明来源包 `@deepseek-ai/dsh-client-ui-session`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionReferenceSourceMap {
    mainView: unknown;
}
```

成员检索：`controllerOperation`、`gateway`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionRemote 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`SessionRemote`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionRemote = ClientRemote['session'];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
