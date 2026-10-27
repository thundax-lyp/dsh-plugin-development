# @deepseek-ai/dsh-api-session-controller .：公开对象 4

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-session-controller 选型与组合](api-core-dsh-api-session-controller-root-overview.md)。

`@deepseek-ai/dsh-api-session-controller` 拥有 Host 的 `ctx.sessionController` 服务，以及生成的 Client `session`、`skills` 和 `fileReferences` Remote namespace。它提供 Session 生命周期与历史、Host generation 模型目录、人工后台任务终止、工作区路径打开、用户可调用 skill（技能）发现和 Agent（智能体）范围的文件引用。当 Client 需要按 Session 寻址的操作时，请通过 API Gateway 使用它。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SessionControlFrame 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionControlFrame`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionControlFrame = {
    readonly type: 'baseline';
    readonly value: SessionControlBaseline;
} | ({
    readonly type: 'projection';
} & SessionProjectionUpdate);
```

成员检索：`type`、`value`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionController 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionController`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class SessionController extends TypertRemoteService {
    static inject: string[];
    static Config: z<Config, ResolvedConfig>;
    constructor(ctx: Context, config: Config, internals?: SessionControllerInternals);
    resolveAgent(sessionId: SessionId): Promise<ApiSessionAgentResult>;
    inspect(sessionId: SessionId, signal?: AbortSignal): Promise<SessionInspection>;
    list(_request: SessionListRequest, signal: AbortSignal): Promise<SessionListValue>;
    search(request: SessionSearchRequest, signal: AbortSignal): Promise<SessionSearchValue>;
    create(request: SessionCreateRequest): Promise<SessionCreateValue>;
    selectModel(request: SessionSelectModelRequest): Promise<SessionSelectModelValue>;
    initializeDefaultModel(): Promise<void>;
    modelCatalog(): Promise<ModelCatalog>;
    canOpenWorkspacePath(): boolean;
    workspaceDesktop(): {
        name: string;
        available: boolean;
        fileManager: 'finder' | 'explorer' | 'directory' | null;
    };
    openWorkspacePath(request: SessionOpenWorkspacePathRequest, signal: AbortSignal): Promise<SessionOpenWorkspacePathValue>;
    workspacePathApplications(request: {
        readonly path: string;
    }, signal: AbortSignal): Promise<readonly SessionWorkspacePathApplication[]>;
    rename(request: SessionRenameRequest): Promise<SessionRenameValue>;
    fork(request: SessionForkRequest): Promise<SessionForkValue>;
    prompt(request: SessionPromptRequest, signal: AbortSignal): Promise<SessionPromptValue>;
    attachment(request: SessionAttachmentRequest): Promise<SessionAttachmentValue>;
    updateQueue(request: SessionUpdateQueueRequest): Promise<SessionUpdateQueueValue>;
    cancel(request: SessionCancelRequest): SessionCancelValue;
    page(request: SessionPageRequest, signal: AbortSignal): Promise<SessionPage>;
    follow(request: SessionFollowRequest, signal: AbortSignal): AsyncIterable<SessionFollowFrame>;
    projections(request: SessionProjectionsRequest, signal: AbortSignal): Promise<SessionProjectionsValue>;
    control(signal: AbortSignal): AsyncIterable<SessionControlFrame>;
}
```

成员检索：`attachment`、`canOpenWorkspacePath`、`cancel`、`control`、`create`、`follow`、`fork`、`initializeDefaultModel`、`inspect`、`list`、`modelCatalog`、`openWorkspacePath`、`page`、`projections`、`prompt`、`rename`、`resolveAgent`、`search`、`selectModel`、`updateQueue`、`workspaceDesktop`、`workspacePathApplications`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionControllerInternals 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionControllerInternals`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionControllerInternals {
    readonly openPath?: (path: string, signal: AbortSignal) => Promise<void>;
    readonly fileApplications?: typeof nativeFileApplications;
    readonly openFileApplication?: typeof openNativeFileApplication;
    readonly revealPath?: (path: string, signal: AbortSignal) => Promise<void>;
    readonly canOpenPath?: () => boolean;
}
```

成员检索：`canOpenPath`、`fileApplications`、`openFileApplication`、`openPath`、`revealPath`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionCreateRequest 公开契约

workspaceId与cwd互斥；未选Workspace时cwd决定独立Session目录。sessionId可请求复用仍空白且可复用的Session，或提供未存储的新身份；实际返回id可能不同，必须使用SessionCreateValue。agentPreset选择声明过preset并替换复用Session记录；省略使用配置默认。

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionCreateRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionCreateRequest {
    readonly workspaceId?: WorkspaceId;
    readonly cwd?: string;
    readonly sessionId?: SessionId;
    readonly agentPreset?: string;
}
```

成员检索：`agentPreset`、`cwd`、`sessionId`、`workspaceId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionCreateValue 公开契约

sessionId是实际创建或复用后的身份，可能不同于请求值；agentPreset仅在部署有preset roster时给出。后续prompt、订阅与持久恢复使用此返回身份，不继续假设请求中的id被接纳。

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionCreateValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionCreateValue {
    readonly sessionId: SessionId;
    readonly agentPreset?: string;
}
```

成员检索：`agentPreset`、`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionEventEntry 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionEventEntry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionEventEntry {
    readonly type: 'event';
    readonly event: SessionWireEvent;
}
```

成员检索：`event`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionFileReferences 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionFileReferences`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class SessionFileReferences extends TypertRemoteService {
    static inject: string[];
    constructor(ctx: Context);
    list(agent: Agent, query: string, signal: AbortSignal): Promise<FileReferenceCandidate[]>;
}
```

成员检索：`list`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionFollowFrame 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionFollowFrame`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionFollowFrame = {
    readonly type: 'snapshot';
    readonly header: SessionWireHeader;
    readonly cursor: number;
    readonly records: readonly SessionHistoryRecord[];
    readonly hasMore: boolean;
    readonly projections: SessionProjectionBaseline;
    readonly assistantStream?: SessionAssistantStreamBaseline;
} | SessionEventEntry | {
    readonly type: 'assistant-stream';
    readonly frame: SessionAssistantStreamFrame;
};
```

成员检索：`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
