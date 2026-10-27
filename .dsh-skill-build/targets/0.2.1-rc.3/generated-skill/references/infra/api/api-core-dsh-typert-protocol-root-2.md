# @deepseek-ai/dsh-typert-protocol .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-typert-protocol 选型与组合](api-core-dsh-typert-protocol-root-overview.md)。

借助 `dsh-typert-protocol`，业务包可以向 Remote 客户端暴露 Host 方法：用 `@Remote`（作用域接收者用 `@RemoteScope`）标记方法，把服务绑定到 wire 命名空间，并通过可合并扩展的协议映射把 Host 对象与作用域 Context 关联到 wire identity。生成产物、Host Gateway 与 Client API 消费同一套调用描述符、编解码器与提供方约定。调用持有的值把清理责任交给 Gateway，不另增引用计数。本包不注册任何 Cordis 服务，也不运行 TypeScript 分析。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## RemoteAccessResource 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteAccessResource`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteAccessResource = {
    readonly kind: 'global';
} | {
    [Kind in TypertResourceKind]: {
        readonly kind: Kind;
        readonly id: TypertResourceId<TypertResourceMap[Kind]>;
    };
}[TypertResourceKind];
```

成员检索：`kind`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## RemoteAccessResourceKind 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteAccessResourceKind`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteAccessResourceKind = 'global' | TypertResourceKind;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## RemoteAccessResourceOf 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteAccessResourceOf`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteAccessResourceOf<K extends RemoteAccessResourceKind> = Extract<RemoteAccessResource, {
    readonly kind: K;
}>;
```

成员检索：`kind`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## RemoteDecoded 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteDecoded`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteDecoded<Value> = Value extends Uint8Array ? Uint8Array<ArrayBuffer> : Value extends string | number | boolean | bigint | symbol ? Value : Value extends object ? {
    [Key in keyof Value]: RemoteDecoded<Value[Key]>;
} : Value;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## RemoteError 公开契约

RemoteError 是唯一 Remote 失败载体，code 使用已声明的 <domain>/<reason>，details 按 code 判别。错误码合并在拥有抛出点的包；只有多个生产方共同产生时才移到最低共享域。抛出 new RemoteError(code,message,details,{cause})，跨副本识别用 remoteErrorOf，消费方分支按 code，不能依赖 instanceof。未分类的普通异常被 Gateway 折叠为 gateway/internal；carrier取消是 gateway/cancelled，不能创建一族子类代替 code 表。

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteError`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class RemoteError<Code extends RemoteErrorCode = RemoteErrorCode> extends Error {
    readonly code: Code;
    readonly details: RemoteErrorDetailsMap[Code];
    readonly isDSHRemoteError: true;
    constructor(code: Code, message: string, details: RemoteErrorDetailsMap[Code], options?: ErrorOptions);
}
```

成员检索：`code`、`details`、`isDSHRemoteError`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## RemoteErrorCode 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteErrorCode`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteErrorCode = keyof RemoteErrorDetailsMap;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## RemoteErrorDetailsMap 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteErrorDetailsMap`。

目标版本编译声明（省略源码注释与实现体）：

声明来源包 `@deepseek-ai/dsh-typert-protocol`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface RemoteErrorDetailsMap {
    'gateway/bad-request': {
        readonly issues?: readonly object[];
    };
    'gateway/cancelled': {};
    'gateway/internal': {};
}
```

声明来源包 `@deepseek-ai/dsh-llm`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'llm/model-discovery-rejected': {
        readonly settingsNs: string;
        readonly baseURL?: string;
    };
}
```

声明来源包 `@deepseek-ai/dsh-session`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'session/not-found': {
        readonly sessionId: SessionId;
    };
}
```

声明来源包 `@deepseek-ai/dsh-subagent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'subagent/invalid-time-zone': {
        readonly value: string;
    };
    'subagent/parent-unavailable': {
        readonly parentSessionId: SessionId;
    };
    'subagent/not-resumable': {
        readonly childSessionId: SessionId;
    };
    'subagent/unauthorized': {
        readonly childSessionId: SessionId;
    };
    'subagent/attachment-invalid': {
        readonly reason: string;
    };
    'subagent/delivery-unavailable': {
        readonly childSessionId: SessionId;
    };
}
```

声明来源包 `@deepseek-ai/dsh-experimental-api-speech-to-text`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'speech/invalid-audio': {
        readonly reason: string;
    };
    'speech/transcription-failed': {
        readonly reason: string;
    };
}
```

声明来源包 `@deepseek-ai/dsh-plugin-market`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'plugin-market/invalid-index-url': {
        readonly url: string;
        readonly reason: string;
    };
    'plugin-market/unknown-index': {
        readonly url: string;
    };
    'plugin-market/fetch-failed': {
        readonly url: string;
        readonly reason: string;
    };
    'plugin-market/invalid-index': {
        readonly url: string;
        readonly path: string;
        readonly reason: string;
    };
    'plugin-market/invalid-query': {
        readonly field: string;
        readonly reason: string;
    };
    'plugin-market/settings-unavailable': Record<string, never>;
}
```

声明来源包 `@deepseek-ai/dsh-api-gateway`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'gateway/ambiguous-endpoint': TypertGatewayFaultDetails;
    'gateway/arguments-invalid': TypertGatewayFaultDetails;
    'gateway/binding-invalid': TypertGatewayFaultDetails;
    'gateway/context-failed': TypertGatewayFaultDetails;
    'gateway/context-not-found': TypertGatewayFaultDetails;
    'gateway/context-unavailable': TypertGatewayFaultDetails;
    'gateway/definition-unavailable': TypertGatewayFaultDetails;
    'gateway/input-invalid': TypertGatewayFaultDetails;
    'gateway/interactions-forbidden': TypertGatewayFaultDetails;
    'gateway/invocation-unavailable': TypertGatewayFaultDetails;
    'gateway/lookup-failed': TypertGatewayFaultDetails;
    'gateway/lookup-not-found': TypertGatewayFaultDetails;
    'gateway/lookup-unavailable': TypertGatewayFaultDetails;
    'gateway/method-unavailable': TypertGatewayFaultDetails;
    'gateway/peer-disposed': TypertGatewayFaultDetails;
    'gateway/protocol': TypertGatewayFaultDetails;
    'gateway/provider-mismatch': TypertGatewayFaultDetails;
    'gateway/result-invalid': TypertGatewayFaultDetails;
    'gateway/service-unavailable': TypertGatewayFaultDetails;
    'gateway/signature-invalid': TypertGatewayFaultDetails;
    'gateway/uplink-overflow': TypertGatewayFaultDetails;
}
```

声明来源包 `@deepseek-ai/dsh-agent-preset-registry`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'agent-preset/not-found': {
        readonly agentPreset: string;
        readonly available: readonly string[];
    };
    'agent-preset/invalid': {
        readonly agentPreset: string;
        readonly reason: string;
    };
    'agent-preset/locked': {
        readonly sessionId: SessionId;
        readonly agentPreset: string;
    };
}
```

声明来源包 `@deepseek-ai/dsh-api-settings-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'settings/rejected': {
        readonly ns: string;
    };
    'settings/conflict': {
        readonly ns: string;
        readonly expected: number;
        readonly actual: number;
    };
    'credential/rejected': {
        readonly ref: string;
    };
}
```

声明来源包 `@deepseek-ai/dsh-api-workspace-files`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'workspace-file/watch-unsupported': {
        readonly path: string;
    };
    'workspace-file/not-found': {
        readonly path: string;
    };
    'workspace-file/outside-workspace': {
        readonly path: string;
    };
    'workspace-file/too-large': {
        readonly path: string;
        readonly limit: number;
    };
    'workspace-file/not-text': {
        readonly path: string;
    };
    'workspace-file/not-regular-file': {
        readonly path: string;
        readonly kind: 'directory' | 'symlink' | 'other';
    };
    'workspace-file/not-directory': {
        readonly path: string;
        readonly kind: 'file' | 'symlink' | 'other';
    };
}
```

声明来源包 `@deepseek-ai/dsh-office-to-pdf`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'document-render/failed': {
        readonly reason: OfficeToPdfErrorCode;
    };
}
```

声明来源包 `@deepseek-ai/dsh-workspace`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'workspace/not-found': {
        readonly workspaceId: WorkspaceId;
    };
}
```

声明来源包 `@deepseek-ai/dsh-api-session-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'session/provider-credentials-unavailable': Record<string, never>;
    'session/provider-models-unavailable': {
        readonly provider: string;
    };
    'session/model-unavailable': {
        readonly provider: string;
        readonly model: string;
    };
    'session/conflict': {
        readonly sessionId: SessionId;
        readonly requestedCwd: string;
        readonly existingCwd?: string;
    };
    'session/projections-unavailable': Record<string, never>;
    'session/writer-held': {
        readonly sessionId: SessionId;
    };
    'session/agent-busy': {
        readonly reason: string;
    };
    'session/invalid-time-zone': {
        readonly value: string;
    };
    'session/workspace-attach-failed': {
        readonly sessionId: SessionId;
        readonly workspaceId: string;
    };
    'agent-preset/conflict': {
        readonly sessionId: SessionId;
        readonly requestedPreset: string;
    };
    'session/attachment-invalid': {
        readonly reason: string;
    };
    'session/queue-item-not-found': {
        readonly itemId: MessageId;
    };
    'session/steer-unavailable': {
        readonly itemId: MessageId;
    };
    'session/title-invalid': {
        readonly sessionId: SessionId;
    };
    'session/fork-unavailable': {
        readonly sessionId: SessionId;
    };
    'session/migration-required': {
        readonly sessionId: SessionId;
    };
    'subagent/not-found': {
        readonly parentSessionId: SessionId;
        readonly childSessionId: SessionId;
    };
    'subagent/catalog-diagnostic': {
        readonly parentSessionId: SessionId;
        readonly childSessionId: SessionId;
        readonly reason: 'corrupt' | 'unsupported' | 'unavailable';
    };
}
```

声明来源包 `@deepseek-ai/dsh-api-job-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'job/not-found': {
        readonly sessionId: SessionId;
        readonly jobId: JobId;
    };
}
```

声明来源包 `@deepseek-ai/dsh-api-workspace-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'workspace/invalid-path': {
        readonly path: string;
    };
    'workspace/name-conflict': {
        readonly name: string;
    };
    'workspace/session-active': {
        readonly sessionId: SessionId;
        readonly activity: readonly SessionActivity[];
    };
    'workspace/move-invalid': {
        readonly workspaceId: WorkspaceId;
        readonly sessionId: SessionId;
        readonly beforeSessionId?: SessionId;
    };
    'directory-picker/unavailable': {
        readonly capability: string;
    };
    'directory-picker/unreadable': {
        readonly path: string;
    };
    'directory-picker/exists': {
        readonly path: string;
    };
    'directory-picker/create-failed': {
        readonly path: string;
    };
}
```

声明来源包 `@deepseek-ai/dsh-api-terminal-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'terminal/unavailable': Record<string, never>;
    'terminal/control-unavailable': {
        readonly reason: 'read-only' | 'not-running';
    };
    'terminal/limit-reached': {
        readonly limit: number;
    };
}
```

声明来源包 `@deepseek-ai/dsh-api-remote-access`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'remote-access/denied': RemoteAccessDeniedDetails;
}
```

声明来源包 `@deepseek-ai/dsh-api-terminal-controller`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'terminal/view': {
        readonly issue: TerminalViewIssue;
    };
}
```

声明来源包 `@deepseek-ai/dsh-api-workspace-files`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface RemoteErrorDetailsMap {
    'workspace-file/unsupported-address': {
        readonly address: string;
    };
    'workspace-file/unknown-workspace': {
        readonly address: string;
    };
}
```

成员检索：`gateway/bad-request`、`gateway/cancelled`、`gateway/internal`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## RemoteFailure 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteFailure`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteFailure = {
    [Code in RemoteErrorCode]: import('./remote-error.ts').RemoteError<Code>;
}[RemoteErrorCode];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。
