# @deepseek-ai/dsh-api-remotes ./client：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-remotes 选型与组合](api-core-dsh-api-remotes-client-overview.md)。

为本应用选定的 Host Remote 能力提供双侧 BFF。Host 入口拥有转发事件名单并向 API Gateway 注册应用事件 source；Client 入口以运行时值形式导入生成的 `/remote` 产物，通过 `ctx.remote.$mount()` 挂载每项贡献，并重新导出对应的声明合并。Client 业务包依赖该外观，而不依赖 Gateway 实现或单独的 Remote 运行时入口。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## ApprovalRequestId 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`ApprovalRequestId`。

公开声明签名：

```text
export type ApprovalRequestId = Branded<'ApprovalRequestId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## BundleInfo 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`BundleInfo`。

公开声明签名：

```text
export interface BundleInfo {
    name: string;
    official: boolean;
    availability: 'installation' | 'profile' | 'missing';
    installTarget?: {
        spec: string;
        version: string;
    };
    version?: string;
    meta?: PluginLocalizedMeta;
    description?: string;
    enabled: boolean;
    installed: boolean;
    source?: string;
    optional: boolean;
    removable: boolean;
    readOnlyReason?: ReadOnlyReason;
    error?: ManagementError;
    rows: BundleRowInfo[];
    overrides: string[];
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## BundleRowInfo 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`BundleRowInfo`。

公开声明签名：

```text
export interface BundleRowInfo {
    rowId: string;
    moduleName: string;
    meta?: PluginLocalizedMeta;
    entryId?: PluginEntryId;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## ChangeResult 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`ChangeResult`。

公开声明签名：

```text
export interface ChangeResult {
    changed: boolean;
    application: 'applied' | 'restart-required' | 'overridden' | 'failed' | 'cancelled';
    restartReason?: RestartReason;
    stage: 'install' | 'enable' | 'remove';
    target: string;
    enabled?: boolean;
    error?: ManagementError;
    warnings?: string[];
    packageResult?: PackageResult;
    bundle?: string;
    version?: string;
    pendingBuilds?: string[];
    approvedBuilds?: string[];
    registries?: Registry[];
    failedAt?: 'registry' | 'spec-host';
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## ClientRemote 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`ClientRemote`。

公开声明签名：

```text
export interface ClientRemote extends TypertClientRemote {
    $stream<Item>(options: RemoteStreamOptions<Item>): RemoteStream<Item>;
    readonly $host: RemoteHostFacts;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## ConnectionHandle 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`ConnectionHandle`。

公开声明签名：

```text
export interface ConnectionHandle {
    readonly interactions: ConnectionInteractions;
    readonly isLoopback: boolean;
    readonly generation: ConnectionGenerationState;
    readonly state: ConnectionStateSource;
    readonly rpc: ClientConnectionRpc;
    openWebSocket(path: string): ConnectionWebSocket;
    reconnect(): void;
    registerGenerationSource(source: ConnectionGenerationSource): () => void;
    start(sinks: ConnectionSinks, config?: ConnectionRecoveryConfig): ConnectionLoop;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## ConnectionSinks 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`ConnectionSinks`。

公开声明签名：

```text
export interface ConnectionSinks {
    onConnected?: (host: ConnectionHostInfo) => void;
    onStateChange?: (state: ConnectionState) => void;
    onReconnectRequested?: () => void;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
