# @deepseek-ai/dsh-cordis-host-runner .：公开对象 6

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-cordis-host-runner 选型与组合](api-core-dsh-cordis-host-runner-root-overview.md)。

`dsh-cordis-host-runner` 提供运行时检查，并为程序调用方和浏览器控件保留进程内动态定义。Host 部分在 `node:vm` 中运行；浏览器部分使用 Client runner 和审批 UI。定义在重启后消失。Agent 通过 `tool-cordis` 发现 API，通过 Plugin Manager 安装持久化 bundle；没有模型工具创建动态定义。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## DynamicCordisRunRequest 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisRunRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisRunRequest {
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

## DynamicCordisRunResolution 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisRunResolution`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type DynamicCordisRunResolution = {
    ok: true;
    pluginRunId: CordisDynamicPluginRunId;
    waitingFor?: readonly string[];
} | {
    ok: false;
    reason: 'rejected' | 'host-half-failed' | 'client-half-failed';
    pluginRunId?: CordisDynamicPluginRunId;
    startedHere?: boolean;
    message?: string;
    stack?: string;
};
```

成员检索：`ok`、`pluginRunId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisRunResponse 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisRunResponse`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type DynamicCordisRunResponse = {
    ok: true;
    status: 'awaiting-approval' | 'starting' | 'running';
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    pluginRunId: CordisDynamicPluginRunId;
    waitingFor: readonly string[];
    clientWaitingFor?: readonly string[];
    currentPackageId?: CordisDynamicPackageId;
    nextPackageId?: CordisDynamicPackageId;
    mode: CordisDynamicRunMode;
} | {
    ok: false;
    reason: 'plugin-missing' | 'package-missing' | 'invalid-mode' | 'transition-in-flight' | 'host-half-failed' | 'client-half-failed' | 'rejected' | 'cancelled' | 'not-running';
    message: string;
    stack?: string;
};
```

成员检索：`ok`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisRunnerService 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisRunnerService`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class DynamicCordisRunnerService extends TypertRemoteService {
    static inject: string[];
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    define(request: DynamicCordisDefineRequest): DynamicCordisDefineReceipt;
    undefine(agent: Agent, pluginId: CordisDynamicPluginId): Promise<DynamicCordisUndefineReceipt>;
    undefineFromPanel(agent: Agent, pluginId: CordisDynamicPluginId): Promise<DynamicCordisUndefineReceipt>;
    run(agent: Agent, pluginId: CordisDynamicPluginId, packageId: CordisDynamicPackageId, mode: CordisDynamicRunMode, signal?: AbortSignal): Promise<DynamicCordisRunResponse>;
    runHostHalf(agent: Agent, pluginId: CordisDynamicPluginId, packageId: CordisDynamicPackageId, mode: CordisDynamicRunMode, requestId: ApprovalRequestId | null, approveFutureVersions: boolean): Promise<DynamicCordisHostHalfResult>;
    getClientCode(agent: Agent, pluginId: CordisDynamicPluginId, pluginRunId: CordisDynamicPluginRunId): DynamicCordisClientSource;
    resolveRequestRun(requestId: ApprovalRequestId, resolution: DynamicCordisRunResolution): Promise<DynamicCordisResolveAck>;
    settleUserRun(agent: Agent, pluginId: CordisDynamicPluginId, resolution: DynamicCordisRunResolution): Promise<DynamicCordisRunResponse>;
    stop(agent: Agent, pluginId: CordisDynamicPluginId): Promise<DynamicCordisStopResponse>;
    stopFromPanel(agent: Agent, pluginId: CordisDynamicPluginId): Promise<DynamicCordisStopResponse>;
    syncInspectManifest(providers: readonly CordisInspectProviderManifest[]): null;
    resolveInspectQuery(agent: Agent, requestId: CordisInspectRequestId, resolution: CordisInspectQueryResolution): CordisInspectResolveAck;
    inventory(): DynamicCordisInventoryRow[];
    snapshot(agent: Agent): DynamicCordisSnapshotRow[];
    reference(agent: Agent, pluginId: CordisDynamicPluginId): DynamicCordisReference | undefined;
    listPlugins(agent: Agent): DynamicCordisPluginInspection[];
    inspectPlugin(agent: Agent, pluginId: CordisDynamicPluginId): DynamicCordisPluginInspection;
    inspectPackage(agent: Agent, pluginId: CordisDynamicPluginId, packageId: CordisDynamicPackageId): DynamicCordisPackageInspection;
    reportRenderFailure(agent: Agent, pluginId: CordisDynamicPluginId, pluginRunId: CordisDynamicPluginRunId, failure: DynamicCordisRenderFailure): Promise<null>;
    reportClientGuardFailure(agent: Agent, pluginId: CordisDynamicPluginId, pluginRunId: CordisDynamicPluginRunId, failure: CordisErrorDetails): Promise<null>;
    invoke(pluginId: CordisDynamicPluginId, pluginRunId: CordisDynamicPluginRunId, method: string, args: JsonValue): Promise<DynamicCordisInvokeResult>;
}
```

成员检索：`define`、`getClientCode`、`inspectPackage`、`inspectPlugin`、`inventory`、`invoke`、`listPlugins`、`reference`、`reportClientGuardFailure`、`reportRenderFailure`、`resolveInspectQuery`、`resolveRequestRun`、`run`、`runHostHalf`、`settleUserRun`、`snapshot`、`stop`、`stopFromPanel`、`syncInspectManifest`、`undefine`、`undefineFromPanel`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisSnapshotRow 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisSnapshotRow`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisSnapshotRow {
    pluginId: CordisDynamicPluginId;
    currentPackageId?: CordisDynamicPackageId;
    nextPackageId?: CordisDynamicPackageId;
    packages: Array<{
        packageId: CordisDynamicPackageId;
        name: string;
        purpose: string;
        hasHostHalf: boolean;
        hasClientHalf: boolean;
    }>;
    activeRun?: {
        pluginRunId: CordisDynamicPluginRunId;
        packageId: CordisDynamicPackageId;
        fiber?: Fiber;
        handlers: string[];
        renderFailure?: DynamicCordisRenderFailure;
    };
    latestRun?: DynamicCordisRunAttempt;
}
```

成员检索：`activeRun`、`currentPackageId`、`latestRun`、`nextPackageId`、`packages`、`pluginId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisStopResponse 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisStopResponse`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type DynamicCordisStopResponse = {
    ok: true;
} | {
    ok: false;
    reason: 'plugin-missing' | 'not-running';
    message: string;
};
```

成员检索：`ok`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisUndefineReceipt 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisUndefineReceipt`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type DynamicCordisUndefineReceipt = {
    ok: true;
    wasRunning: boolean;
} | {
    ok: false;
    reason: 'plugin-missing';
    message: string;
};
```

成员检索：`ok`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## HostCordisInspectProviderRegistration 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`HostCordisInspectProviderRegistration`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface HostCordisInspectProviderRegistration {
    manifest: CordisInspectProviderManifest;
    query(method: string, input: JsonValue | undefined, context: HostCordisInspectQueryContext): Promise<JsonValue>;
}
```

成员检索：`manifest`、`query`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。
