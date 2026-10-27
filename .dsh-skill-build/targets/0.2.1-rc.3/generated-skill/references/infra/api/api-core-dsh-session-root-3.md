# @deepseek-ai/dsh-session .：公开对象 3

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-session 选型与组合](api-core-dsh-session-root-overview.md)。

`dsh-session` 在仅追加的会话日志中记录每个模型可见事实，并从该记录派生模型历史。消费方可以检查、回放、fork 和刷新会话，同时保留历史事件；压缩（compaction）会在活跃对话中隐藏被取代的条目，但不会删除它们。除非添加持久化后端，否则会话仅保留在内存中；持久性检查点会等待配置的后端。agent 需要可重建的会话记录时请选择本包；它本身不调用模型。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SessionEvent 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionEvent`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionEvent<T extends SessionEventType = SessionEventType> = {
    [K in SessionEventType]: {
        type: K;
        seq: SessionSeq;
        time: number;
        data: SessionEventMap[K];
        ignorable?: true;
    } & (K extends SurfaceEventType ? SurfaceIntent<K> : {
        surfaceOp?: never;
        sourceEventSeqs?: never;
    });
}[T];
```

成员检索：`data`、`ignorable`、`seq`、`sourceEventSeqs`、`surfaceOp`、`time`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SessionEventMap 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionEventMap`。

目标版本编译声明（省略源码注释与实现体）：

声明来源包 `@deepseek-ai/dsh-session`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface SessionEventMap {
    'turn/start': {
        turn: number;
    };
    'turn/end': {
        turn: number;
        reason: TurnEndReason;
    };
    'step/start': {
        turn: number;
        step: number;
    };
    'step/end': {
        turn: number;
        step: number;
    };
    'user/message': UserMessage;
    'developer/message': {
        turn: number;
        step: number;
        message: DeveloperMessage;
        headerSeq?: SessionSeq;
    };
    'system/message': {
        turn: number;
        step: number;
        message: SystemMessage;
    };
    'assistant/message': {
        turn: number;
        step: number;
        message: AssistantMessage;
        stream: AssistantStreamRecord[];
        usage?: TokenUsage;
        interrupted?: true;
    };
    'assistant/attempt': {
        turn: number;
        step: number;
        stream: AssistantStreamRecord[];
    };
    'tool/call': {
        turn: number;
        step: number;
        callId: ToolCallId;
        name: string;
        arguments: string;
    };
    'tool/result': {
        turn: number;
        step: number;
        message: ToolResultMessage;
        error?: {
            name: string;
            code: string;
            reason?: string;
        };
        meta?: JsonValue;
    };
    'request/header': {
        header: EpochHeader;
        reason: RequestHeaderReason;
        startsSeries?: true;
    };
    'request/context': RequestContext;
    'session/end-seed': {
        inherited?: true;
    };
}
```

声明来源包 `@deepseek-ai/dsh-agent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'agent/inbox/spliced': {
        target: InboxTarget;
        start: number;
        removedCount?: number;
        inserted: UserMessage[];
        outcome?: 'canceled';
    };
}
```

声明来源包 `@deepseek-ai/dsh-tools`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'tool/ptc-dispatch-start': PtcDispatchStartEventData;
    'tool/ptc-dispatch': PtcDispatchEventData;
}
```

声明来源包 `@deepseek-ai/dsh-user-approval`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'approval/asked': {
        id: ApprovalRequestId;
        toolName: string;
        callId?: ToolCallId;
        reason?: string;
    };
    'approval/decided': {
        id: ApprovalRequestId;
        outcome: ApprovalOutcome;
    };
}
```

声明来源包 `@deepseek-ai/dsh-user-approval`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'approval/policy': {
        policy: ApprovalPolicy;
        source?: 'delegation';
    };
}
```

声明来源包 `@deepseek-ai/dsh-subagent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'subagent/catalog': SubagentCatalogEvent;
}
```

声明来源包 `@deepseek-ai/dsh-subagent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'subagent/descriptor': SubagentDescriptorData;
}
```

声明来源包 `@deepseek-ai/dsh-commands`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'command/run': {
        commandId: CommandId;
        name: string;
        args?: string;
        source: CommandSource;
    };
    'command/done': {
        commandId: CommandId;
        kind: 'success' | 'error';
        text?: string;
        sourceEventSeq?: import('@deepseek-ai/dsh-session/types').SessionSeq;
    };
}
```

声明来源包 `@deepseek-ai/dsh-tool-workflow`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'tool-workflow/run-start': ToolWorkflowRunStartData;
    'tool-workflow/agent-start': ToolWorkflowAgentStartData;
    'tool-workflow/agent-end': ToolWorkflowAgentEndData;
    'tool-workflow/run-end': ToolWorkflowRunEndData;
}
```

声明来源包 `@deepseek-ai/dsh-compaction`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'compaction/start': {
        compactionId: CompactionId;
        sourceCommandId?: CommandId;
        turn: number | null;
    };
    'compaction/summary': {
        compactionId: CompactionId;
        sourceCommandId?: CommandId;
        summary: ContentBlock[];
        shadowedRange: {
            start: SessionSeq;
            end: SessionSeq;
        };
        shadowedSeqs: SessionSeq[];
        shadowedTokenCount: number;
        provider: string;
        model: string;
        maxTokens?: number;
        usage?: TokenUsage;
    } & ({
        rawOutput: ContentBlock[];
        llmStreamCall: true;
    } | {
        rawOutput?: ContentBlock[];
        llmStreamCall?: never;
    });
    'compaction/end': {
        compactionId: CompactionId;
        sourceCommandId?: CommandId;
        turn: number | null;
        error?: string;
    };
    'compaction/prune': {
        shadowedRange: {
            start: SessionSeq;
            end: SessionSeq;
        };
        shadowedSeqs: SessionSeq[];
        shadowedTokenCount: number;
    };
}
```

声明来源包 `@deepseek-ai/dsh-session-title`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'session/title': SessionTitleEventData;
}
```

声明来源包 `@deepseek-ai/dsh-session-title-llm`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'session/title-llm-request': SessionTitleLlmRequestEventData;
}
```

声明来源包 `@deepseek-ai/dsh-hook-protocol`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'hook/invoked': {
        turn: number;
        point: string;
        dialect: HookDialect;
        matcher?: string;
        handlerId: string;
    };
    'hook/result': {
        turn: number;
        point: string;
        handlerId: string;
        decision: string;
        exitCode?: number;
        stderrSummary?: string;
        durationMs: number;
    };
}
```

声明来源包 `@deepseek-ai/dsh-goal`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'goal/change': GoalChangeMeta;
}
```

声明来源包 `@deepseek-ai/dsh-permission-presets`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'permission/preset': {
        preset: string;
    };
}
```

声明来源包 `@deepseek-ai/dsh-experimental-agent-team`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'team/member': {
        version: 2;
        teamId: TeamId;
        member: TeamMemberSnapshot;
    };
    'team/task': {
        version: 2;
        teamId: TeamId;
        task: TeamTaskSnapshot;
    };
    'team/message/queued': {
        version: 2;
        teamId: TeamId;
        message: TeamMessageSnapshot;
    };
    'team/message/delivered': {
        version: 2;
        teamId: TeamId;
        messageId: TeamMessageId;
        targetId: SessionId;
    };
}
```

声明来源包 `@deepseek-ai/dsh-plan-mode`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'plan/mode': {
        active: boolean;
    };
}
```

声明来源包 `@deepseek-ai/dsh-llm-retry`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'llm/retry': LlmRetryEventData;
    'llm/retry-started': LlmRetryStartedEventData;
}
```

声明来源包 `@deepseek-ai/dsh-compaction-image-offload`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'image/offload': {
        targets: ImageOffloadTarget[];
    };
}
```

声明来源包 `@deepseek-ai/dsh-schedule`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'schedule/change': ScheduleChange;
}
```

声明来源包 `@deepseek-ai/dsh-command-feedback`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'feedback/record': FeedbackRecord;
}
```

声明来源包 `@deepseek-ai/dsh-message-feedback`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'feedback/message-put': MessageFeedbackPut;
    'feedback/message-delete': MessageFeedbackDelete;
}
```

声明来源包 `@deepseek-ai/dsh-api-session-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'model/selection': ModelSelection;
}
```

声明来源包 `@deepseek-ai/dsh-tool-todo`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'todo/write': {
        todos: TodoItem[];
    };
}
```

声明来源包 `@deepseek-ai/dsh-agent-preset-registry`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'agent-preset/selected': {
        agentPreset: string;
    };
}
```

声明来源包 `@deepseek-ai/dsh-jobs`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'job/registered': JobRegisteredData;
    'job/settled': JobSettledData;
}
```

声明来源包 `@deepseek-ai/dsh-sandbox-policy`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'sandbox/mode': {
        mode: SandboxMode;
        source?: 'delegation';
    };
}
```

声明来源包 `@deepseek-ai/dsh-session-log-deepseek`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'session-log-deepseek/delivery-accepted': {
        sessionId: import('@deepseek-ai/dsh-session/types').SessionId;
        sessionFormatVersion?: number;
        throughSeq: import('@deepseek-ai/dsh-session/types').SessionSeq;
    };
}
```

声明来源包 `@deepseek-ai/dsh-tool-present`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'deliverables/presented': {
        turn: number;
        callId: ToolCallId;
        files: PresentedFile[];
    };
}
```

声明来源包 `@deepseek-ai/dsh-web-search-deepseek`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'web/deepseek-search-llm-request': DeepSeekSearchLlmRequest;
}
```

声明来源包 `@deepseek-ai/dsh-working-directory`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'working-directory/change': {
        cwd: string;
    };
}
```

声明来源包 `@deepseek-ai/dsh-workspace-changes`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionEventMap {
    'workspace/changes': {
        turn: number;
    };
}
```

成员检索：`assistant/attempt`、`assistant/message`、`developer/message`、`request/context`、`request/header`、`session/end-seed`、`step/end`、`step/start`、`system/message`、`tool/call`、`tool/result`、`turn/end`、`turn/start`、`user/message`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SessionEventType 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionEventType`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionEventType = keyof SessionEventMap;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SessionForkError 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionForkError`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class SessionForkError extends Error {
    readonly code: SessionForkErrorCode;
    constructor(message: string, code: SessionForkErrorCode);
}
```

成员检索：`code`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SessionForkErrorCode 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionForkErrorCode`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionForkErrorCode = 'SESSION_NOT_FOUND' | 'SESSION_NOT_LIVE' | 'SESSION_ALREADY_EXISTS' | 'INVALID_BOUNDARY';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SessionForkSource 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionForkSource`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionForkSource = Session | SessionId;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SessionHeader 公开契约

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionHeader`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionHeader {
    readonly version: typeof SESSION_FORMAT_VERSION;
    readonly id: SessionId;
    readonly createdAt: number;
    readonly cwd?: string;
    readonly parentSession?: SessionId;
    readonly isSeeded: boolean;
    readonly origin?: 'subagent';
    readonly delegationDepth?: number;
    readonly agentPreset?: string;
}
```

成员检索：`agentPreset`、`createdAt`、`cwd`、`delegationDepth`、`id`、`isSeeded`、`origin`、`parentSession`、`version`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## SessionId 公开契约

品牌化的会话身份；同一live Agent/Session共享此id。编译品牌帮助防止混淆，并不验证会话存在、ownership或跨进程权限；运行时存在性与授权由store、controller和Peer资源判定。

导入入口：`@deepseek-ai/dsh-session`；公开符号：`SessionId`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function SessionId(id: string): SessionId;

export type SessionId = Branded<'SessionId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。
