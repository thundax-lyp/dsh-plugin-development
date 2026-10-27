# @deepseek-ai/dsh-cordis-client-runner ./client：公开对象 3

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-cordis-client-runner 选型与组合](api-core-dsh-cordis-client-runner-client-overview.md)。

`dsh-cordis-client-runner` 为程序调用方和现有浏览器控件运行进程内动态包的浏览器部分。它在请求获批或用户显式操作后加载定义，并在 Host 撤销运行时移除定义。页面刷新不会恢复定义。Creator UI 插件通过 Plugin Manager 使用已安装的 Client 模块。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## CordisRunnerFace 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`CordisRunnerFace`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisRunnerFace {
    readonly activeRuns: CordisObservable<ReadonlyMap<CordisDynamicPluginId, CordisRunActivity>>;
    readonly lastRunError: CordisObservable<ReadonlyMap<CordisDynamicPluginId, CordisRunFailure>>;
    readonly renderFailures: CordisObservable<ReadonlyMap<CordisDynamicPluginId, DynamicCordisRenderFailure>>;
    reconcileApprovals(rows: readonly DynamicCordisInventoryRow[]): void;
    approve(requestId: ApprovalRequestId, approveFutureVersions: boolean): Promise<void>;
    decline(requestId: ApprovalRequestId): Promise<void>;
    startUserRun(request: CordisUserRunRequest): Promise<void>;
    subscribe(fn: () => void): () => void;
    getSnapshot(): readonly DynamicCordisLivePackage[];
    isLoaded(pluginId: CordisDynamicPluginId): boolean;
}
```

成员检索：`activeRuns`、`approve`、`decline`、`getSnapshot`、`isLoaded`、`lastRunError`、`reconcileApprovals`、`renderFailures`、`startUserRun`、`subscribe`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisUserRunRequest 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`CordisUserRunRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisUserRunRequest {
    agentId: SessionId;
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    mode: CordisDynamicRunMode;
    hasClientHalf: boolean;
}
```

成员检索：`agentId`、`hasClientHalf`、`mode`、`packageId`、`pluginId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisClientHalf 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`DynamicCordisClientHalf`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisClientHalf {
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    pluginRunId: CordisDynamicPluginRunId;
    agentId: SessionId;
    name: string;
    code: string;
}
```

成员检索：`agentId`、`code`、`name`、`packageId`、`pluginId`、`pluginRunId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisClosureEnv 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`DynamicCordisClosureEnv`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisClosureEnv {
    invoke(method: string, args: unknown): Promise<unknown>;
    noteError(message: string): void;
}
```

成员检索：`invoke`、`noteError`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisEvaluatedPlugin 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`DynamicCordisEvaluatedPlugin`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisEvaluatedPlugin {
    name?: string;
    inject?: string[];
    apply: (ctx: unknown, config?: unknown) => unknown;
}
```

成员检索：`apply`、`inject`、`name`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisGuardEnv 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`DynamicCordisGuardEnv`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisGuardEnv {
    pkg: DynamicCordisPackage;
    ledger: DynamicCordisSlotLedgerRow[];
    claim(component: unknown): void;
    allocatePriority(): number;
    reportFailure(error: Error): void;
}
```

成员检索：`allocatePriority`、`claim`、`ledger`、`pkg`、`reportFailure`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisLivePackage 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`DynamicCordisLivePackage`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisLivePackage {
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    pluginRunId: CordisDynamicPluginRunId;
    name: string;
    slots: string[];
    styleCount: number;
}
```

成员检索：`name`、`packageId`、`pluginId`、`pluginRunId`、`slots`、`styleCount`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisLoadErrorCause 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`DynamicCordisLoadErrorCause`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type DynamicCordisLoadErrorCause = 'evaluate' | 'module-import' | 'activate';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。
