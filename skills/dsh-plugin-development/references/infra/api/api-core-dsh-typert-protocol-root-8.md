# @deepseek-ai/dsh-typert-protocol .：公开对象 8

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-typert-protocol 选型与组合](api-core-dsh-typert-protocol-root-overview.md)。

借助 `dsh-typert-protocol`，业务包可以向 Remote 客户端暴露 Host 方法：用 `@Remote`（作用域接收者用 `@RemoteScope`）标记方法，把服务绑定到 wire 命名空间，并通过可合并扩展的协议映射把 Host 对象与作用域 Context 关联到 wire identity。生成产物、Host Gateway 与 Client API 消费同一套调用描述符、编解码器与提供方约定。调用持有的值把清理责任交给 Gateway，不另增引用计数。本包不注册任何 Cordis 服务，也不运行 TypeScript 分析。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## TypertRegistryListener 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRegistryListener`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertRegistryListener = (change: TypertRegistryChange) => void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRemoteCodecSpec 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteCodecSpec`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertRemoteCodecSpec extends Omit<Extract<TypertCodec, {
    readonly mode: 'strict';
}>, 'create'> {
    readonly create: () => ZodType;
}
```

成员检索：`create`、`decode`、`description`、`encode`、`jsonSchema`、`jsonSchemaError`、`mode`、`typeSymbol`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRemoteContribution 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteContribution`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertRemoteContribution {
    readonly package: string;
    readonly descriptors: readonly InvocationDescriptor[];
}
```

成员检索：`descriptors`、`package`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRemoteEvent 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteEvent`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertRemoteEvent = Extract<TypertForwardableEvent, keyof TypertRemoteEventSelection>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRemoteEventSelection 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteEventSelection`。

目标版本编译声明（省略源码注释与实现体）：

声明来源包 `@deepseek-ai/dsh-typert-protocol`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface TypertRemoteEventSelection {
}
```

声明来源包 `@deepseek-ai/dsh-api-remotes`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteEventSelection extends Record<ApiRemoteForwardedEvent, true> {
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRemoteInfo 公开契约

普通./remote生成的可挂载贡献，保留静态spec，首次descriptors/methods访问建立并缓存共享索引。methods只含直接方法，Context-only接收器留在descriptors与scoped声明。input视图、parser和projection各自懒缓存，不发网络、不激活Service。

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteInfo`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertRemoteInfo<Methods extends Readonly<Record<string, TypertRemoteMethod<object, unknown> | TypertRemoteMethod<object, unknown, 'stream', unknown>>> = Readonly<Record<string, TypertRemoteMethod<object, unknown> | TypertRemoteMethod<object, unknown, 'stream', unknown>>>> extends TypertRemoteContribution {
    readonly methods: Methods;
}
```

成员检索：`descriptors`、`methods`、`package`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRemoteInputOptions 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteInputOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertRemoteInputOptions {
    readonly strict?: boolean;
}
```

成员检索：`strict`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRemoteMap 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteMap`。

目标版本编译声明（省略源码注释与实现体）：

声明来源包 `@deepseek-ai/dsh-typert-protocol`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface TypertRemoteMap {
}
```

声明来源包 `@deepseek-ai/dsh-client-product-analytics`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'productAnalytics/enabled': () => Promise<RemoteResult<boolean>>;
    'productAnalytics/report': (event: ProductEvent) => Promise<RemoteResult<void>>;
    'productAnalytics/watchPolicy': (signal?: AbortSignal) => RemoteStreamHandle<boolean, never>;
}
```

声明来源包 `@deepseek-ai/dsh-plugin-manager`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'pluginManager/cancelInstall': (requestId: PluginInstallRequestId) => Promise<RemoteResult<PluginInstallCancellation>>;
    'pluginManager/inspect': (spec: string, options?: InspectOptions, signal?: AbortSignal) => Promise<RemoteResult<PluginSpecInspection>>;
    'pluginManager/installBundle': (spec: string, options?: InstallBundleOptions) => Promise<RemoteResult<ChangeResult>>;
    'pluginManager/listBundles': () => Promise<RemoteResult<BundleInfo[]>>;
    'pluginManager/listPlugins': () => Promise<RemoteResult<PluginInfo[]>>;
    'pluginManager/listVersionExemptions': () => Promise<RemoteResult<{
        exemptions: Record<string, string[]>;
        warnings: string[];
    }>>;
    'pluginManager/registries': () => Promise<RemoteResult<PluginRegistries>>;
    'pluginManager/removeBundle': (name: string) => Promise<RemoteResult<ChangeResult>>;
    'pluginManager/setBundleEnabled': (name: string, enabled: boolean) => Promise<RemoteResult<ChangeResult>>;
    'pluginManager/setPluginEnabled': (id: PluginEntryId, enabled: boolean) => Promise<RemoteResult<ChangeResult>>;
    'pluginManager/setVersionExemption': (packageVersion: string, runtimeVersion: string, enabled: boolean, acceptRisk?: boolean) => Promise<RemoteResult<ChangeResult>>;
    'pluginManager/waitForInstall': (requestId: PluginInstallRequestId) => Promise<RemoteResult<ChangeResult | null>>;
}
```

声明来源包 `@deepseek-ai/dsh-client-ui-plugin-manager`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'pluginRegistryProbe/fastest': () => Promise<RemoteResult<string | null>>;
}
```

声明来源包 `@deepseek-ai/dsh-plugin-market`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'pluginMarket/listIndexes': () => Promise<RemoteResult<MarketIndexSummary[]>>;
    'pluginMarket/search': (url: string, query: MarketQuery) => Promise<RemoteResult<MarketSearchResult>>;
    'pluginMarket/setIndexes': (urls: string[]) => Promise<RemoteResult<void>>;
}
```

声明来源包 `@deepseek-ai/dsh-agent-preset-registry`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'agentPresets/list': () => Promise<RemoteResult<AgentPresetRoster>>;
    'agentPresets/read': (agentPreset: string) => Promise<RemoteResult<AgentPresetDocument>>;
    'agentPresets/select': (agentId: SessionId, agentPreset: string) => Promise<RemoteResult<string>>;
}
```

声明来源包 `@deepseek-ai/dsh-user-questions`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'userQuestions/answer': (agentId: SessionId, callId: ToolCallId, answer: AskUserQuestionAnswer) => Promise<RemoteResult<boolean>>;
    'userQuestions/attachWait': (agentId: SessionId, callId: ToolCallId, signal?: AbortSignal) => RemoteStreamHandle<{
        remainingMs: number;
    }, never>;
}
```

声明来源包 `@deepseek-ai/dsh-commands`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'commands/execute': (agentId: SessionId, line: string, submittedAttachments: readonly CommandSubmitAttachment[], signal?: AbortSignal) => Promise<RemoteResult<CommandExecution | undefined>>;
    'commands/list': (agentId: SessionId) => Promise<RemoteResult<readonly CommandDescriptor[]>>;
}
```

声明来源包 `@deepseek-ai/dsh-api-settings-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'credentials/describe': (refs: string[]) => Promise<RemoteResult<Record<string, CredentialInfo>>>;
    'credentials/set': (ref: string, value: string) => Promise<RemoteResult<void>>;
    'credentials/unset': (ref: string) => Promise<RemoteResult<void>>;
    'settings/describe': () => Promise<RemoteResult<SettingsDescribeValue>>;
    'settings/mutate': (ns: string, ops: SettingsPathOpView[], expectedRevision: number | undefined) => Promise<RemoteResult<SettingsNamespaceView>>;
    'settings/openSettingsDocument': (signal?: AbortSignal) => Promise<RemoteResult<SettingsDocumentOpenValue>>;
    'settings/replace': (ns: string, section: Record<string, JsonValue>, expectedRevision: number | undefined) => Promise<RemoteResult<SettingsNamespaceView>>;
    'settings/update': (ns: string, patch: Record<string, JsonValue>, expectedRevision: number | undefined) => Promise<RemoteResult<SettingsNamespaceView>>;
}
```

声明来源包 `@deepseek-ai/dsh-api-account-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'account/ackBonusNotified': (accountId: AccountUserId, orderId: AccountBonusOrderId, client: AccountClientMetadata) => Promise<RemoteResult<boolean>>;
    'account/cancelSignIn': (attemptId: SignInAttemptId) => Promise<RemoteResult<AccountView>>;
    'account/getBalance': (client: AccountClientMetadata) => Promise<RemoteResult<AccountDetails['balance'] | null>>;
    'account/getProfile': (client: AccountClientMetadata) => Promise<RemoteResult<AccountDetails['profile'] | null>>;
    'account/getState': () => Promise<RemoteResult<AccountView>>;
    'account/getUnnotifiedBonuses': (client: AccountClientMetadata) => Promise<RemoteResult<AccountBonusBatch | null>>;
    'account/hasRunningAccountTasks': () => Promise<RemoteResult<boolean>>;
    'account/signOut': (client: AccountClientMetadata) => Promise<RemoteResult<AccountView>>;
    'account/startSignIn': (client: AccountClientMetadata, callbackOrigin: string, loginSource: 'web' | 'desktop') => Promise<RemoteResult<AccountView>>;
    'account/watch': (signal?: AbortSignal) => RemoteStreamHandle<AccountView, never>;
    'account/watchExpiry': (signal?: AbortSignal) => RemoteStreamHandle<'session-expired', never>;
}
```

声明来源包 `@deepseek-ai/dsh-goal`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'goals/clear': (agentId: SessionId, ref: GoalRef) => Promise<RemoteResult<GoalRef>>;
    'goals/complete': (agentId: SessionId, ref: GoalRef) => Promise<RemoteResult<GoalView>>;
    'goals/create': (agentId: SessionId, request: CreateGoalRequest) => Promise<RemoteResult<CreateGoalResult>>;
    'goals/edit': (agentId: SessionId, ref: GoalRef, request: EditGoalRequest) => Promise<RemoteResult<GoalView>>;
    'goals/get': (agentId: SessionId) => Promise<RemoteResult<GoalView | undefined>>;
    'goals/pause': (agentId: SessionId, ref: GoalRef) => Promise<RemoteResult<GoalView>>;
    'goals/resume': (agentId: SessionId, ref: GoalRef) => Promise<RemoteResult<GoalView>>;
}
```

声明来源包 `@deepseek-ai/dsh-schedule`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'schedule/catalog': () => Promise<RemoteResult<ScheduleCatalogEntry[]>>;
    'schedule/delete': (request: ScheduleDeleteRequest, signal?: AbortSignal) => Promise<RemoteResult<ScheduleDeleteResult>>;
    'schedule/history': (request: ScheduleDeliveryHistoryRequest) => Promise<RemoteResult<ScheduleDeliveryHistoryResult>>;
    'schedule/list': (request: ScheduleListRequest) => Promise<RemoteResult<ScheduleRecord[]>>;
    'schedule/update': (request: ScheduleUpdateRequest, signal?: AbortSignal) => Promise<RemoteResult<ScheduleUpdateResult>>;
}
```

声明来源包 `@deepseek-ai/dsh-office-to-pdf`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'officeToPdf/generation': (signal?: AbortSignal) => Promise<RemoteResult<OfficeToPdfGeneration>>;
    'officeToPdf/render': (workspaceFileScopeId: SessionId, path: string, priority: OfficeToPdfPriority, signal?: AbortSignal) => Promise<RemoteResult<RemoteDecoded<RenderedDocumentBytes>>>;
}
```

声明来源包 `@deepseek-ai/dsh-llm`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'llm/discoverModels': (settingsNs: string, request: LlmModelDiscoveryRequest, signal?: AbortSignal) => Promise<RemoteResult<LlmDiscoveredModel[]>>;
    'llm/listConfigurableProviders': () => Promise<RemoteResult<LlmConfigurableProvider[]>>;
    'llm/listProviders': () => Promise<RemoteResult<LlmProviderInfo[]>>;
}
```

声明来源包 `@deepseek-ai/dsh-host-plugin-inventory`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'pluginInventory/list': () => Promise<RemoteResult<PluginInventorySnapshot>>;
}
```

声明来源包 `@deepseek-ai/dsh-message-feedback`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'messageFeedback/delete': (request: MessageFeedbackDeleteRequest) => Promise<RemoteResult<MessageFeedbackDeleteResult>>;
    'messageFeedback/list': (request: MessageFeedbackListRequest) => Promise<RemoteResult<MessageFeedbackListResult>>;
    'messageFeedback/put': (request: MessageFeedbackPutRequest) => Promise<RemoteResult<MessageFeedbackPutResult>>;
}
```

声明来源包 `@deepseek-ai/dsh-permission-presets`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'permissionPresets/catalog': () => Promise<RemoteResult<PermissionCatalog>>;
}
```

声明来源包 `@deepseek-ai/dsh-command-feedback`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'sessionFeedback/record': (request: SessionFeedbackRecordRequest) => Promise<RemoteResult<SessionFeedbackRecordResult>>;
}
```

声明来源包 `@deepseek-ai/dsh-client-file-upload`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'fileUploads/upload': (agentId: SessionId, request: EncodedFileUploadRequest, signal?: AbortSignal) => Promise<RemoteResult<FileUploadValue>>;
}
```

声明来源包 `@deepseek-ai/dsh-session-reference`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'sessionReferenceResolver/candidates': (agentId: SessionId, query: string, signal?: AbortSignal) => Promise<RemoteResult<SessionReferenceMentionCandidate[]>>;
}
```

声明来源包 `@deepseek-ai/dsh-subagent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'subagents/interruptByParent': (childSessionId: SessionId, parentSessionId: SessionId, mode: 'continuable') => Promise<RemoteResult<SubagentInterruptReceipt>>;
    'subagents/prompt': (request: SubagentPromptRequest, signal?: AbortSignal) => Promise<RemoteResult<SubagentPromptReceipt>>;
}
```

声明来源包 `@deepseek-ai/dsh-api-session-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'fileReferences/list': (agentId: SessionId, query: string, signal?: AbortSignal) => Promise<RemoteResult<FileReferenceCandidate[]>>;
    'session/attachment': (request: SessionAttachmentRequest) => Promise<RemoteResult<SessionAttachmentValue>>;
    'session/cancel': (request: SessionCancelRequest) => Promise<RemoteResult<SessionCancelValue>>;
    'session/canOpenWorkspacePath': () => Promise<RemoteResult<boolean>>;
    'session/control': (signal?: AbortSignal) => RemoteStreamHandle<SessionControlFrame, never>;
    'session/create': (request: SessionCreateRequest) => Promise<RemoteResult<SessionCreateValue>>;
    'session/follow': (request: SessionFollowRequest, signal?: AbortSignal) => RemoteStreamHandle<SessionFollowFrame, never>;
    'session/fork': (request: SessionForkRequest) => Promise<RemoteResult<SessionForkValue>>;
    'session/initializeDefaultModel': () => Promise<RemoteResult<void>>;
    'session/list': (_request: SessionListRequest, signal?: AbortSignal) => Promise<RemoteResult<SessionListValue>>;
    'session/modelCatalog': () => Promise<RemoteResult<ModelCatalog>>;
    'session/openWorkspacePath': (request: SessionOpenWorkspacePathRequest, signal?: AbortSignal) => Promise<RemoteResult<SessionOpenWorkspacePathValue>>;
    'session/page': (request: SessionPageRequest, signal?: AbortSignal) => Promise<RemoteResult<SessionPage>>;
    'session/projections': (request: SessionProjectionsRequest, signal?: AbortSignal) => Promise<RemoteResult<SessionProjectionsValue>>;
    'session/prompt': (request: SessionPromptRequest, signal?: AbortSignal) => Promise<RemoteResult<SessionPromptValue>>;
    'session/rename': (request: SessionRenameRequest) => Promise<RemoteResult<SessionRenameValue>>;
    'session/search': (request: SessionSearchRequest, signal?: AbortSignal) => Promise<RemoteResult<SessionSearchValue>>;
    'session/selectModel': (request: SessionSelectModelRequest) => Promise<RemoteResult<SessionSelectModelValue>>;
    'session/updateQueue': (request: SessionUpdateQueueRequest) => Promise<RemoteResult<SessionUpdateQueueValue>>;
    'session/workspacePathApplications': (request: {
        readonly path: string;
    }, signal?: AbortSignal) => Promise<RemoteResult<readonly SessionWorkspacePathApplication[]>>;
    'skills/list': (request: SkillListRequest, signal?: AbortSignal) => Promise<RemoteResult<SkillListValue>>;
}
```

声明来源包 `@deepseek-ai/dsh-api-job-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'job/follow': (request: JobFollowRequest, signal?: AbortSignal) => RemoteStreamHandle<JobFollowFrame, never>;
    'job/kill': (request: JobKillRequest) => Promise<RemoteResult<JobKillValue>>;
    'job/list': (request: JobListRequest, signal?: AbortSignal) => RemoteStreamHandle<JobListFrame, never>;
}
```

声明来源包 `@deepseek-ai/dsh-api-workspace-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'directoryPicker/createDirectory': (path: string, name: string) => Promise<RemoteResult<string>>;
    'directoryPicker/list': (path: string | undefined, signal?: AbortSignal) => Promise<RemoteResult<DirectoryListing>>;
    'directoryPicker/pick': (signal?: AbortSignal) => Promise<RemoteResult<string | null>>;
    'workspace/archiveSession': (request: WorkspaceArchiveSessionRequest) => Promise<RemoteResult<WorkspaceArchiveValue>>;
    'workspace/create': (request: WorkspaceCreateRequest) => Promise<RemoteResult<WorkspaceCreateValue>>;
    'workspace/delete': (request: WorkspaceDeleteRequest) => Promise<RemoteResult<WorkspaceDeleteValue>>;
    'workspace/follow': (signal?: AbortSignal) => RemoteStreamHandle<WorkspaceFollowFrame, never>;
    'workspace/initializeDefault': (signal?: AbortSignal) => Promise<RemoteResult<WorkspaceValue | undefined>>;
    'workspace/insertBefore': (request: WorkspaceInsertBeforeRequest) => Promise<RemoteResult<WorkspaceOrderValue>>;
    'workspace/insertSessionBefore': (request: WorkspaceInsertSessionBeforeRequest) => Promise<RemoteResult<WorkspaceValue>>;
    'workspace/pinSession': (request: WorkspacePinSessionRequest) => Promise<RemoteResult<WorkspacePinValue>>;
    'workspace/rename': (request: WorkspaceRenameRequest) => Promise<RemoteResult<WorkspaceValue>>;
    'workspace/unarchiveSession': (request: WorkspaceUnarchiveSessionRequest) => Promise<RemoteResult<WorkspaceArchiveValue>>;
    'workspace/unpinSession': (request: WorkspaceUnpinSessionRequest) => Promise<RemoteResult<WorkspacePinValue>>;
}
```

声明来源包 `@deepseek-ai/dsh-api-workspace-files`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'workspaceFiles/changes': (workspaceFileScopeId: SessionId, path: string, signal?: AbortSignal) => RemoteStreamHandle<WorkspaceFileWatchFrame, never>;
    'workspaceFiles/list': (workspaceFileScopeId: SessionId, path: string, signal?: AbortSignal) => Promise<RemoteResult<WorkspaceDirectoryListing>>;
    'workspaceFiles/read': (workspaceFileScopeId: SessionId, path: string, range: WorkspaceFileRange, signal?: AbortSignal) => Promise<RemoteResult<WorkspaceFileText>>;
    'workspaceFiles/readBytes': (workspaceFileScopeId: SessionId, path: string, options: WorkspaceByteReadOptions, signal?: AbortSignal) => Promise<RemoteResult<RemoteDecoded<WorkspaceFileBytes>>>;
    'workspaceFiles/stat': (workspaceFileScopeId: SessionId, path: string, signal?: AbortSignal) => Promise<RemoteResult<WorkspaceFileStat>>;
}
```

声明来源包 `@deepseek-ai/dsh-api-terminal-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'terminal/attach': (agentId: SessionId, id: WebTerminalId, signal?: AbortSignal) => RemoteStreamHandle<TerminalFrame, TerminalInput>;
    'terminal/close': (agentId: SessionId, id: WebTerminalId) => Promise<RemoteResult<void>>;
    'terminal/create': (agentId: SessionId, request: TerminalCreateRequest, signal?: AbortSignal) => Promise<RemoteResult<WebTerminalInfo>>;
    'terminal/environment': (agentId: SessionId, signal?: AbortSignal) => Promise<RemoteResult<TerminalEnvironment>>;
    'terminal/list': (sessionId: SessionId) => Promise<RemoteResult<WebTerminalInfo[]>>;
    'terminal/rename': (agentId: SessionId, id: WebTerminalId, title: string) => Promise<RemoteResult<void>>;
    'terminal/retain': (sessionId: SessionId, id: WebTerminalId, signal?: AbortSignal) => RemoteStreamHandle<TerminalRetentionFrame, never>;
    'terminal/shells': (agentId: SessionId, signal?: AbortSignal) => Promise<RemoteResult<TerminalShell[]>>;
}
```

声明来源包 `@deepseek-ai/dsh-cordis-host-runner`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteMap {
    'dynamicCordisRunner/getClientCode': (agentId: SessionId, pluginId: CordisDynamicPluginId, pluginRunId: CordisDynamicPluginRunId) => Promise<RemoteResult<DynamicCordisClientSource>>;
    'dynamicCordisRunner/inventory': () => Promise<RemoteResult<DynamicCordisInventoryRow[]>>;
    'dynamicCordisRunner/invoke': (pluginId: CordisDynamicPluginId, pluginRunId: CordisDynamicPluginRunId, method: string, args: JsonValue) => Promise<RemoteResult<DynamicCordisInvokeResult>>;
    'dynamicCordisRunner/reportClientGuardFailure': (agentId: SessionId, pluginId: CordisDynamicPluginId, pluginRunId: CordisDynamicPluginRunId, failure: CordisErrorDetails) => Promise<RemoteResult<null>>;
    'dynamicCordisRunner/reportRenderFailure': (agentId: SessionId, pluginId: CordisDynamicPluginId, pluginRunId: CordisDynamicPluginRunId, failure: DynamicCordisRenderFailure) => Promise<RemoteResult<null>>;
    'dynamicCordisRunner/resolveInspectQuery': (agentId: SessionId, requestId: CordisInspectRequestId, resolution: CordisInspectQueryResolution) => Promise<RemoteResult<CordisInspectResolveAck>>;
    'dynamicCordisRunner/resolveRequestRun': (requestId: ApprovalRequestId, resolution: DynamicCordisRunResolution) => Promise<RemoteResult<DynamicCordisResolveAck>>;
    'dynamicCordisRunner/runHostHalf': (agentId: SessionId, pluginId: CordisDynamicPluginId, packageId: CordisDynamicPackageId, mode: CordisDynamicRunMode, requestId: ApprovalRequestId | null, approveFutureVersions: boolean) => Promise<RemoteResult<DynamicCordisHostHalfResult>>;
    'dynamicCordisRunner/settleUserRun': (agentId: SessionId, pluginId: CordisDynamicPluginId, resolution: DynamicCordisRunResolution) => Promise<RemoteResult<DynamicCordisRunResponse>>;
    'dynamicCordisRunner/stopFromPanel': (agentId: SessionId, pluginId: CordisDynamicPluginId) => Promise<RemoteResult<DynamicCordisStopResponse>>;
    'dynamicCordisRunner/syncInspectManifest': (providers: readonly CordisInspectProviderManifest[]) => Promise<RemoteResult<null>>;
    'dynamicCordisRunner/undefineFromPanel': (agentId: SessionId, pluginId: CordisDynamicPluginId) => Promise<RemoteResult<DynamicCordisUndefineReceipt>>;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。
