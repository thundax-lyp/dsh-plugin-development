# @deepseek-ai/dsh-session-projection：Session 耐久句柄、格式与只读投影

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在Session 耐久句柄、格式与只读投影任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-session.md)。

## ProjectionChangeListener 契约

从 `@deepseek-ai/dsh-session-projection` 导入 `ProjectionChangeListener`。`ProjectionChangeListener` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type ProjectionChangeListener = (session: Session, key: Extract<keyof SessionProjectionMap, string>, value: unknown, seq: SessionSeq) => void;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## ProjectionCheckpoint 契约

从 `@deepseek-ai/dsh-session-projection` 导入 `ProjectionCheckpoint`。`ProjectionCheckpoint` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type ProjectionCheckpoint = Record<string, ProjectionCheckpointRow>;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## ProjectionCheckpointRow 契约

从 `@deepseek-ai/dsh-session-projection` 导入 `ProjectionCheckpointRow`。`ProjectionCheckpointRow` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ProjectionCheckpointRow {
    ver: number;
    seq: SessionSeqCursor;
    val: unknown;
}
```

成员检索：`seq`、`val`、`ver`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## ProjectionDefinition 契约

从 `@deepseek-ai/dsh-session-projection` 导入 `ProjectionDefinition`。`ProjectionDefinition` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ProjectionDefinition<K extends keyof SessionProjectionStateMap, S extends SessionProjectionStateMap[K] = SessionProjectionStateMap[K]> {
    key: K;
    stateSchema: ZodType<S>;
    init(header: SessionHeader, inheritedEventCount: SessionLogOffset): NoInfer<S>;
    apply(state: NoInfer<S>, event: SessionEvent): NoInfer<S>;
    wire?: K extends keyof SessionProjectionMap ? {
        viewSchema: ZodType<SessionProjectionMap[K]>;
        view(state: NoInfer<S>): SessionProjectionMap[K];
    } : never;
    stateVersion: number;
}
```

成员检索：`apply`、`init`、`key`、`stateSchema`、`stateVersion`、`wire`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## ProjectionSnapshot 契约

从 `@deepseek-ai/dsh-session-projection` 导入 `ProjectionSnapshot`。`ProjectionSnapshot` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ProjectionSnapshot {
    asOfSeq: SessionSeqCursor;
    values: Partial<SessionProjectionMap>;
}
```

成员检索：`asOfSeq`、`values`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionProjectionMap 契约

从 `@deepseek-ai/dsh-session-projection` 导入 `SessionProjectionMap`。`SessionProjectionMap` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

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

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionProjectionRegistry 契约

从 `@deepseek-ai/dsh-session-projection` 导入 `SessionProjectionRegistry`。`SessionProjectionRegistry` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionProjectionRegistry extends Service {
    constructor(ctx: Context);
    register<K extends keyof SessionProjectionMap, S extends SessionProjectionStateMap[K]>(definition: Omit<ProjectionDefinition<K, S>, 'wire'> & {
        wire: NonNullable<ProjectionDefinition<K, S>['wire']>;
    }): () => void;
    register<K extends Exclude<keyof SessionProjectionStateMap, keyof SessionProjectionMap>, S extends SessionProjectionStateMap[K]>(definition: Omit<ProjectionDefinition<K, S>, 'wire'>): () => void;
    onChanged(listener: ProjectionChangeListener): () => void;
    stateOf<K extends keyof SessionProjectionStateMap>(session: Session, key: K): SessionProjectionStateMap[K] | undefined;
    snapshot(session: Session, keys?: readonly Extract<keyof SessionProjectionMap, string>[]): ProjectionSnapshot;
    cachedSnapshot(session: Session, keys?: readonly Extract<keyof SessionProjectionMap, string>[]): ProjectionSnapshot | undefined;
    checkpoint(session: Session): ProjectionCheckpoint;
    restoreFloor(checkpoint: ProjectionCheckpoint): SessionLogOffset | undefined;
    viewCheckpoint(checkpoint: ProjectionCheckpoint, keys?: readonly Extract<keyof SessionProjectionMap, string>[]): Partial<SessionProjectionMap>;
    restore(checkpoint: ProjectionCheckpoint, events: readonly SessionEvent[], baseSeq: SessionLogOffset, header: SessionHeader, inheritedEventCount: SessionLogOffset): {
        snapshot: ProjectionSnapshot;
        checkpoint: ProjectionCheckpoint;
    };
    hydrate(session: Session, checkpoint: ProjectionCheckpoint, events: readonly SessionEvent[], baseSeq: SessionLogOffset): ProjectionSnapshot;
}
```

成员检索：`cachedSnapshot`、`checkpoint`、`hydrate`、`onChanged`、`register`、`restore`、`restoreFloor`、`snapshot`、`stateOf`、`viewCheckpoint`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionProjectionStateMap 契约

从 `@deepseek-ai/dsh-session-projection` 导入 `SessionProjectionStateMap`。`SessionProjectionStateMap` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

声明来源包 `@deepseek-ai/dsh-session-projection`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface SessionProjectionStateMap {
}
```

声明来源包 `@deepseek-ai/dsh-agent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    inbox: InboxState;
}
```

声明来源包 `@deepseek-ai/dsh-agent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    turnBoundary: TurnBoundaryProjection;
}
```

声明来源包 `@deepseek-ai/dsh-subagent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    subagentCatalog: SubagentCatalogState;
}
```

声明来源包 `@deepseek-ai/dsh-user-questions`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    userQuestions: UserQuestionProjectionState;
}
```

声明来源包 `@deepseek-ai/dsh-session-title`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    title: string | null;
    titleInput: TitleInputState;
}
```

声明来源包 `@deepseek-ai/dsh-goal`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    goal: GoalProjectionState;
}
```

声明来源包 `@deepseek-ai/dsh-harness-dev-context`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    harnessDevLegacyPrompt: LegacyPrompt;
}
```

声明来源包 `@deepseek-ai/dsh-permission-presets`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    permissions: PermissionProjectionState;
}
```

声明来源包 `@deepseek-ai/dsh-experimental-agent-team`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    agentTeam: TeamProjectionState;
}
```

声明来源包 `@deepseek-ai/dsh-token-meter`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    tokenUsage: TokenUsageState;
    contextPressure: ContextPressureState;
}
```

声明来源包 `@deepseek-ai/dsh-token-meter`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    contextBreakdown: ContextBreakdownState;
}
```

声明来源包 `@deepseek-ai/dsh-plan-mode`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    plan: PlanUnitState;
}
```

声明来源包 `@deepseek-ai/dsh-llm-retry`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    llmRetry: LlmRetryState;
}
```

声明来源包 `@deepseek-ai/dsh-time-context`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    timeContext: TimeContextProjection;
}
```

声明来源包 `@deepseek-ai/dsh-tmux-context`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    tmuxContext: TmuxContextState;
}
```

声明来源包 `@deepseek-ai/dsh-agent-preset-registry`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    agentPreset: string | null;
}
```

声明来源包 `@deepseek-ai/dsh-api-session-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    sessionListMetadata: SessionListMetadata;
    imageLimits: null;
    modelSelection: ModelSelectionProjectionState;
}
```

声明来源包 `@deepseek-ai/dsh-tool-todo`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    todos: TodoItem[] | null;
}
```

声明来源包 `@deepseek-ai/dsh-sandbox-policy`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    sandboxMode: SandboxModeState;
}
```

声明来源包 `@deepseek-ai/dsh-session-turn-outline`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    turnOutline: TurnOutlineState;
}
```

声明来源包 `@deepseek-ai/dsh-working-directory`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionProjectionStateMap {
    workingDirectory: string | null;
}
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。
