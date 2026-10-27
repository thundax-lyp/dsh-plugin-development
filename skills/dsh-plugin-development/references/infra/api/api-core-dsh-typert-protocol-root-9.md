# @deepseek-ai/dsh-typert-protocol .：公开对象 9

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-typert-protocol 选型与组合](api-core-dsh-typert-protocol-root-overview.md)。

借助 `dsh-typert-protocol`，业务包可以向 Remote 客户端暴露 Host 方法：用 `@Remote`（作用域接收者用 `@RemoteScope`）标记方法，把服务绑定到 wire 命名空间，并通过可合并扩展的协议映射把 Host 对象与作用域 Context 关联到 wire identity。生成产物、Host Gateway 与 Client API 消费同一套调用描述符、编解码器与提供方约定。调用持有的值把清理责任交给 Gateway，不另增引用计数。本包不注册任何 Cordis 服务，也不运行 TypeScript 分析。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## TypertRemoteMethod 公开契约

生成的直接端点描述符同时给input(options?)和invoke(remote,input,signal?)；保持namespace receiver、可选位置空位、signal，并转发原Promise或完整stream handle。input strict影响消费方parser，不修改Host dispatch；result是唯一结果codec/可选投影。

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteMethod`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertRemoteMethod<Input extends object, Output, Mode extends 'unary' | 'stream' = 'unary', Uplink = never, DecodedOutput = Output> = Omit<InvocationDescriptor, 'mode' | 'invocation' | 'result'> & (Mode extends 'stream' ? {
    readonly mode: 'stream';
} : {
    readonly mode?: never;
}) & {
    readonly invocation: {
        readonly kind: 'direct';
    };
    input(options?: TypertRemoteInputOptions): TypertRemoteValue<Input>;
    readonly result: Extract<TypertCodec<Output>, {
        readonly mode: 'strict';
    }>;
    invoke(remote: TypertClientRemote, input: Input, signal?: AbortSignal): Mode extends 'stream' ? RemoteStreamHandle<Output, Uplink> : Promise<RemoteResult<DecodedOutput>>;
};
```

成员检索：`cancellation`、`description`、`id`、`implementation`、`input`、`invocation`、`invoke`、`method`、`mode`、`namespace`、`parameters`、`result`、`scope`、`service`、`sourceLocation`、`uplink`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRemoteMethodSpec 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteMethodSpec`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertRemoteMethodSpec extends Omit<InvocationDescriptor, 'id' | 'namespace' | 'method' | 'parameters' | 'result'> {
    readonly parameters: readonly TypertRemoteParameterSpec[];
    readonly result: TypertRemoteCodecSpec;
}
```

成员检索：`cancellation`、`description`、`implementation`、`invocation`、`mode`、`parameters`、`result`、`scope`、`service`、`sourceLocation`、`uplink`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRemoteNamespace 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteNamespace`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertRemoteNamespace<Namespace extends string> = {
    [Endpoint in keyof TypertRemoteMap as Endpoint extends `${Namespace}/${infer Method}` ? Method : never]: TypertRemoteMap[Endpoint];
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRemoteNamespaceMap 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteNamespaceMap`。

目标版本编译声明（省略源码注释与实现体）：

声明来源包 `@deepseek-ai/dsh-typert-protocol`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface TypertRemoteNamespaceMap {
}
```

声明来源包 `@deepseek-ai/dsh-client-product-analytics`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'productAnalytics': TypertRemoteNamespace$70726f64756374416e616c7974696373;
}
```

声明来源包 `@deepseek-ai/dsh-plugin-manager`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'pluginManager': TypertRemoteNamespace$706c7567696e4d616e61676572;
}
```

声明来源包 `@deepseek-ai/dsh-client-ui-plugin-manager`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'pluginRegistryProbe': TypertRemoteNamespace$706c7567696e526567697374727950726f6265;
}
```

声明来源包 `@deepseek-ai/dsh-plugin-market`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'pluginMarket': TypertRemoteNamespace$706c7567696e4d61726b6574;
}
```

声明来源包 `@deepseek-ai/dsh-agent-preset-registry`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'agentPresets': TypertRemoteNamespace$6167656e7450726573657473;
}
```

声明来源包 `@deepseek-ai/dsh-user-questions`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'userQuestions': TypertRemoteNamespace$757365725175657374696f6e73;
}
```

声明来源包 `@deepseek-ai/dsh-commands`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'commands': TypertRemoteNamespace$636f6d6d616e6473;
}
```

声明来源包 `@deepseek-ai/dsh-api-settings-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'credentials': TypertRemoteNamespace$63726564656e7469616c73;
    'settings': TypertRemoteNamespace$73657474696e6773;
}
```

声明来源包 `@deepseek-ai/dsh-api-account-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'account': TypertRemoteNamespace$6163636f756e74;
}
```

声明来源包 `@deepseek-ai/dsh-goal`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'goals': TypertRemoteNamespace$676f616c73;
}
```

声明来源包 `@deepseek-ai/dsh-schedule`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'schedule': TypertRemoteNamespace$7363686564756c65;
}
```

声明来源包 `@deepseek-ai/dsh-office-to-pdf`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'officeToPdf': TypertRemoteNamespace$6f6666696365546f506466;
}
```

声明来源包 `@deepseek-ai/dsh-llm`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'llm': TypertRemoteNamespace$6c6c6d;
}
```

声明来源包 `@deepseek-ai/dsh-host-plugin-inventory`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'pluginInventory': TypertRemoteNamespace$706c7567696e496e76656e746f7279;
}
```

声明来源包 `@deepseek-ai/dsh-message-feedback`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'messageFeedback': TypertRemoteNamespace$6d657373616765466565646261636b;
}
```

声明来源包 `@deepseek-ai/dsh-permission-presets`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'permissionPresets': TypertRemoteNamespace$7065726d697373696f6e50726573657473;
}
```

声明来源包 `@deepseek-ai/dsh-command-feedback`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'sessionFeedback': TypertRemoteNamespace$73657373696f6e466565646261636b;
}
```

声明来源包 `@deepseek-ai/dsh-client-file-upload`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'fileUploads': TypertRemoteNamespace$66696c6555706c6f616473;
}
```

声明来源包 `@deepseek-ai/dsh-session-reference`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'sessionReferenceResolver': TypertRemoteNamespace$73657373696f6e5265666572656e63655265736f6c766572;
}
```

声明来源包 `@deepseek-ai/dsh-subagent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'subagents': TypertRemoteNamespace$7375626167656e7473;
}
```

声明来源包 `@deepseek-ai/dsh-api-session-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'fileReferences': TypertRemoteNamespace$66696c655265666572656e636573;
    'session': TypertRemoteNamespace$73657373696f6e;
    'skills': TypertRemoteNamespace$736b696c6c73;
}
```

声明来源包 `@deepseek-ai/dsh-api-job-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'job': TypertRemoteNamespace$6a6f62;
}
```

声明来源包 `@deepseek-ai/dsh-api-workspace-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'directoryPicker': TypertRemoteNamespace$6469726563746f72795069636b6572;
    'workspace': TypertRemoteNamespace$776f726b7370616365;
}
```

声明来源包 `@deepseek-ai/dsh-api-workspace-files`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'workspaceFiles': TypertRemoteNamespace$776f726b737061636546696c6573;
}
```

声明来源包 `@deepseek-ai/dsh-api-terminal-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'terminal': TypertRemoteNamespace$7465726d696e616c;
}
```

声明来源包 `@deepseek-ai/dsh-cordis-host-runner`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteNamespaceMap {
    'dynamicCordisRunner': TypertRemoteNamespace$64796e616d6963436f7264697352756e6e6572;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRemoteParameterSpec 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteParameterSpec`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertRemoteParameterSpec extends Omit<InvocationParameterDescriptor, 'wire' | 'codec'> {
    readonly wire?: string;
    readonly codec: TypertRemoteCodecSpec;
    readonly strictCodec: TypertRemoteCodecSpec;
}
```

成员检索：`acceptsUndefined`、`codec`、`description`、`lookup`、`name`、`source`、`strictCodec`、`wire`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRemoteRegistry 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteRegistry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertRemoteRegistry {
    register(contribution: TypertRemoteContribution): TypertDisposer;
    get(endpoint: string): InvocationDescriptor | undefined;
    list(): readonly InvocationDescriptor[];
    subscribe(listener: TypertRegistryListener): TypertDisposer;
}
```

成员检索：`get`、`list`、`register`、`subscribe`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRemoteScopeApi 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteScopeApi`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertRemoteScopeApi<ContextKey extends string> = {
    [Namespace in TypertRemoteScopeNamespaceKey<ContextKey>]: TypertRemoteScopeNamespace<Namespace, ContextKey>;
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRemoteScopeMap 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteScopeMap`。

目标版本编译声明（省略源码注释与实现体）：

声明来源包 `@deepseek-ai/dsh-typert-protocol`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface TypertRemoteScopeMap {
}
```

声明来源包 `@deepseek-ai/dsh-agent-preset-registry`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteScopeMap {
    'agent:agentPresets/select': (agentPreset: string) => Promise<RemoteResult<string>>;
}
```

声明来源包 `@deepseek-ai/dsh-user-questions`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteScopeMap {
    'agent:userQuestions/answer': (callId: ToolCallId, answer: AskUserQuestionAnswer) => Promise<RemoteResult<boolean>>;
    'agent:userQuestions/attachWait': (callId: ToolCallId, signal?: AbortSignal) => RemoteStreamHandle<{
        remainingMs: number;
    }, never>;
}
```

声明来源包 `@deepseek-ai/dsh-commands`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteScopeMap {
    'agent:commands/execute': (line: string, submittedAttachments: readonly CommandSubmitAttachment[], signal?: AbortSignal) => Promise<RemoteResult<CommandExecution | undefined>>;
    'agent:commands/list': () => Promise<RemoteResult<readonly CommandDescriptor[]>>;
}
```

声明来源包 `@deepseek-ai/dsh-goal`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteScopeMap {
    'agent:goals/clear': (ref: GoalRef) => Promise<RemoteResult<GoalRef>>;
    'agent:goals/complete': (ref: GoalRef) => Promise<RemoteResult<GoalView>>;
    'agent:goals/create': (request: CreateGoalRequest) => Promise<RemoteResult<CreateGoalResult>>;
    'agent:goals/edit': (ref: GoalRef, request: EditGoalRequest) => Promise<RemoteResult<GoalView>>;
    'agent:goals/get': () => Promise<RemoteResult<GoalView | undefined>>;
    'agent:goals/pause': (ref: GoalRef) => Promise<RemoteResult<GoalView>>;
    'agent:goals/resume': (ref: GoalRef) => Promise<RemoteResult<GoalView>>;
}
```

声明来源包 `@deepseek-ai/dsh-client-file-upload`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteScopeMap {
    'agent:fileUploads/upload': (request: EncodedFileUploadRequest, signal?: AbortSignal) => Promise<RemoteResult<FileUploadValue>>;
}
```

声明来源包 `@deepseek-ai/dsh-session-reference`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteScopeMap {
    'agent:sessionReferenceResolver/candidates': (query: string, signal?: AbortSignal) => Promise<RemoteResult<SessionReferenceMentionCandidate[]>>;
}
```

声明来源包 `@deepseek-ai/dsh-api-session-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteScopeMap {
    'agent:fileReferences/list': (query: string, signal?: AbortSignal) => Promise<RemoteResult<FileReferenceCandidate[]>>;
}
```

声明来源包 `@deepseek-ai/dsh-api-terminal-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteScopeMap {
    'agent:terminal/attach': (id: WebTerminalId, signal?: AbortSignal) => RemoteStreamHandle<TerminalFrame, TerminalInput>;
    'agent:terminal/close': (id: WebTerminalId) => Promise<RemoteResult<void>>;
    'agent:terminal/create': (request: TerminalCreateRequest, signal?: AbortSignal) => Promise<RemoteResult<WebTerminalInfo>>;
    'agent:terminal/environment': (signal?: AbortSignal) => Promise<RemoteResult<TerminalEnvironment>>;
    'agent:terminal/rename': (id: WebTerminalId, title: string) => Promise<RemoteResult<void>>;
    'agent:terminal/shells': (signal?: AbortSignal) => Promise<RemoteResult<TerminalShell[]>>;
}
```

声明来源包 `@deepseek-ai/dsh-cordis-host-runner`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRemoteScopeMap {
    'agent:dynamicCordisRunner/getClientCode': (pluginId: CordisDynamicPluginId, pluginRunId: CordisDynamicPluginRunId) => Promise<RemoteResult<DynamicCordisClientSource>>;
    'agent:dynamicCordisRunner/reportClientGuardFailure': (pluginId: CordisDynamicPluginId, pluginRunId: CordisDynamicPluginRunId, failure: CordisErrorDetails) => Promise<RemoteResult<null>>;
    'agent:dynamicCordisRunner/reportRenderFailure': (pluginId: CordisDynamicPluginId, pluginRunId: CordisDynamicPluginRunId, failure: DynamicCordisRenderFailure) => Promise<RemoteResult<null>>;
    'agent:dynamicCordisRunner/resolveInspectQuery': (requestId: CordisInspectRequestId, resolution: CordisInspectQueryResolution) => Promise<RemoteResult<CordisInspectResolveAck>>;
    'agent:dynamicCordisRunner/runHostHalf': (pluginId: CordisDynamicPluginId, packageId: CordisDynamicPackageId, mode: CordisDynamicRunMode, requestId: ApprovalRequestId | null, approveFutureVersions: boolean) => Promise<RemoteResult<DynamicCordisHostHalfResult>>;
    'agent:dynamicCordisRunner/settleUserRun': (pluginId: CordisDynamicPluginId, resolution: DynamicCordisRunResolution) => Promise<RemoteResult<DynamicCordisRunResponse>>;
    'agent:dynamicCordisRunner/stopFromPanel': (pluginId: CordisDynamicPluginId) => Promise<RemoteResult<DynamicCordisStopResponse>>;
    'agent:dynamicCordisRunner/undefineFromPanel': (pluginId: CordisDynamicPluginId) => Promise<RemoteResult<DynamicCordisUndefineReceipt>>;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。
