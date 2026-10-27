# @deepseek-ai/dsh-cordis-client-runner ./client：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-cordis-client-runner 选型与组合](api-core-dsh-cordis-client-runner-client-overview.md)。

`dsh-cordis-client-runner` 为程序调用方和现有浏览器控件运行进程内动态包的浏览器部分。它在请求获批或用户显式操作后加载定义，并在 Host 撤销运行时移除定义。页面刷新不会恢复定义。Creator UI 插件通过 Plugin Manager 使用已安装的 Client 模块。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## CordisDynamicPluginRunId 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`CordisDynamicPluginRunId`。

公开声明签名：

```text
export type CordisDynamicPluginRunId = Branded<'CordisDynamicPluginRunId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisObservable 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`CordisObservable`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisObservable<T> {
    getSnapshot(): T;
    subscribe(fn: () => void): () => void;
}
```

成员检索：`getSnapshot`、`subscribe`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisRunActivity 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`CordisRunActivity`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type CordisRunActivity = {
    phase: 'awaiting-approval';
    requestId: ApprovalRequestId;
    agentId: SessionId;
    packageId: CordisDynamicPackageId;
    mode: CordisDynamicRunMode;
    name: string;
    purpose: string;
} | {
    phase: 'orchestrating';
    agentId: SessionId;
    packageId: CordisDynamicPackageId;
    mode: CordisDynamicRunMode;
};
```

成员检索：`agentId`、`mode`、`packageId`、`phase`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisRunFailure 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`CordisRunFailure`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisRunFailure {
    packageId: CordisDynamicPackageId;
    reason: 'host-half-failed' | 'client-half-failed';
    message: string;
    stack?: string;
}
```

成员检索：`message`、`packageId`、`reason`、`stack`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisRunHostSeam 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`CordisRunHostSeam`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisRunHostSeam {
    runHostHalf(agentId: SessionId, pluginId: CordisDynamicPluginId, packageId: CordisDynamicPackageId, mode: CordisDynamicRunMode, requestId: ApprovalRequestId | null, approveFutureVersions: boolean): Promise<DynamicCordisHostHalfResult>;
    getClientCode(agentId: SessionId, pluginId: CordisDynamicPluginId, pluginRunId: CordisDynamicPluginRunId): Promise<DynamicCordisClientSource>;
    resolveRequestRun(requestId: ApprovalRequestId, resolution: DynamicCordisRunResolution): Promise<DynamicCordisResolveAck>;
    settleUserRun(agentId: SessionId, pluginId: CordisDynamicPluginId, resolution: DynamicCordisRunResolution): Promise<DynamicCordisRunResponse>;
}
```

成员检索：`getClientCode`、`resolveRequestRun`、`runHostHalf`、`settleUserRun`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisRunOrchestrator 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`CordisRunOrchestrator`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class CordisRunOrchestrator {
    constructor(env: CordisRunOrchestratorEnv);
    readonly activeRuns: CordisObservable<ReadonlyMap<CordisDynamicPluginId, CordisRunActivity>>;
    readonly lastRunError: CordisObservable<ReadonlyMap<CordisDynamicPluginId, CordisRunFailure>>;
    open(request: CordisRunRequest): void;
    reconcileApprovals(rows: readonly DynamicCordisInventoryRow[]): void;
    close(requestId: ApprovalRequestId): void;
    approve(requestId: ApprovalRequestId, approveFutureVersions: boolean): Promise<void>;
    decline(requestId: ApprovalRequestId): Promise<void>;
    startUserRun(request: CordisUserRunRequest): Promise<void>;
}
```

成员检索：`activeRuns`、`approve`、`close`、`decline`、`lastRunError`、`open`、`reconcileApprovals`、`startUserRun`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisRunOrchestratorEnv 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`CordisRunOrchestratorEnv`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisRunOrchestratorEnv {
    runner: DynamicCordisPackageRunner;
    host: CordisRunHostSeam;
}
```

成员检索：`host`、`runner`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisRunRequest 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`CordisRunRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisRunRequest {
    requestId: ApprovalRequestId;
    agentId: SessionId;
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    mode: CordisDynamicRunMode;
    name: string;
    purpose: string;
    requiresApproval: boolean;
}
```

成员检索：`agentId`、`mode`、`name`、`packageId`、`pluginId`、`purpose`、`requestId`、`requiresApproval`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。
