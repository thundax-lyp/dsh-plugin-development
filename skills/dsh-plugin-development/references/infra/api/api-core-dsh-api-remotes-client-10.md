# @deepseek-ai/dsh-api-remotes ./client：公开对象 10

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-remotes 选型与组合](api-core-dsh-api-remotes-client-overview.md)。

为本应用选定的 Host Remote 能力提供双侧 BFF。Host 入口拥有转发事件名单并向 API Gateway 注册应用事件 source；Client 入口以运行时值形式导入生成的 `/remote` 产物，通过 `ctx.remote.$mount()` 挂载每项贡献，并重新导出对应的声明合并。Client 业务包依赖该外观，而不依赖 Gateway 实现或单独的 Remote 运行时入口。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## PluginRegistries 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`PluginRegistries`。

公开声明签名：

```text
export interface PluginRegistries {
    readonly registry: Registry;
    readonly fallbackRegistries: readonly string[];
    readonly resolved: string | null;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PluginSpecInspection 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`PluginSpecInspection`。

公开声明签名：

```text
export type PluginSpecInspection = {
    readonly status: 'accepted';
    readonly kind: InstallSpecKind;
    readonly name?: string;
    readonly version?: string;
    readonly description?: string;
    readonly bundle: boolean | null;
    readonly registry: Registry;
    readonly host?: string;
} | {
    readonly status: 'refused';
    readonly problem: PluginInspectProblem;
    readonly reason: string;
    readonly registries?: Registry[];
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## ReadOnlyReason 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`ReadOnlyReason`。

公开声明签名：

```text
export type ReadOnlyReason = 'management-required' | 'unaddressable';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## Registry 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`Registry`。

公开声明签名：

```text
export type Registry = string | null;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteErrorCode 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`RemoteErrorCode`。

公开声明签名：

```text
export type RemoteErrorCode = keyof RemoteErrorDetailsMap;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteErrorDetailsMap 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`RemoteErrorDetailsMap`。

公开声明签名：

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

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `cotTranslation/failed` | `'cotTranslation/failed': Record<string, never>;` | 来自 `RemoteErrorDetailsMap` 的公开继承或联合分支 |

## RemoteFailure 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`RemoteFailure`。

公开声明签名：

```text
export type RemoteFailure = {
    [Code in RemoteErrorCode]: import('./remote-error.ts').RemoteError<Code>;
}[RemoteErrorCode];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteHostFacts 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`RemoteHostFacts`。

公开声明签名：

```text
export interface RemoteHostFacts {
    readonly home: string | undefined;
    readonly isLoopback: boolean;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
