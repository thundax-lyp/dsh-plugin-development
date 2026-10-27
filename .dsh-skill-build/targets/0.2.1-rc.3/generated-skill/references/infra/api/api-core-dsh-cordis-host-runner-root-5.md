# @deepseek-ai/dsh-cordis-host-runner .：公开对象 5

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-cordis-host-runner 选型与组合](api-core-dsh-cordis-host-runner-root-overview.md)。

`dsh-cordis-host-runner` 提供运行时检查，并为程序调用方和浏览器控件保留进程内动态定义。Host 部分在 `node:vm` 中运行；浏览器部分使用 Client runner 和审批 UI。定义在重启后消失。Agent 通过 `tool-cordis` 发现 API，通过 Plugin Manager 安装持久化 bundle；没有模型工具创建动态定义。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## DynamicCordisPluginInspection 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisPluginInspection`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisPluginInspection extends DynamicCordisReference {
    packages: Array<{
        packageId: CordisDynamicPackageId;
        name: string;
        purpose: string;
        hasHostHalf: boolean;
        hasClientHalf: boolean;
    }>;
}
```

成员检索：`activeRun`、`currentPackageId`、`latestRun`、`name`、`nextPackageId`、`packageId`、`packages`、`pluginId`、`purpose`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisReference 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisReference`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisReference {
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    name: string;
    purpose: string;
    currentPackageId?: CordisDynamicPackageId;
    nextPackageId?: CordisDynamicPackageId;
    activeRun?: {
        pluginRunId: CordisDynamicPluginRunId;
        packageId: CordisDynamicPackageId;
    };
    latestRun?: DynamicCordisRunAttempt;
}
```

成员检索：`activeRun`、`currentPackageId`、`latestRun`、`name`、`nextPackageId`、`packageId`、`pluginId`、`purpose`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisRenderFailure 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisRenderFailure`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisRenderFailure {
    slot: string;
    message: string;
    stack?: string;
    abdicated: boolean;
}
```

成员检索：`abdicated`、`message`、`slot`、`stack`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisRequestResolved 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisRequestResolved`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisRequestResolved {
    requestId: ApprovalRequestId;
    outcome: RequestRunOutcome;
}
```

成员检索：`outcome`、`requestId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisResolveAck 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisResolveAck`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisResolveAck {
    accepted: boolean;
}
```

成员检索：`accepted`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisRetracted 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisRetracted`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisRetracted {
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    pluginRunId: CordisDynamicPluginRunId;
}
```

成员检索：`packageId`、`pluginId`、`pluginRunId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisRun 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisRun`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisRun {
    pluginRunId: CordisDynamicPluginRunId;
    packageId: CordisDynamicPackageId;
    fiber?: Fiber;
    handlers: Map<string, DynamicCordisHandler>;
    handlerDisposers: (() => void)[];
    reportedRuntimeErrors: Set<string>;
    renderFailure?: DynamicCordisRenderFailure;
    startedForRequest?: ApprovalRequestId;
}
```

成员检索：`fiber`、`handlerDisposers`、`handlers`、`packageId`、`pluginRunId`、`renderFailure`、`reportedRuntimeErrors`、`startedForRequest`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisRunAttempt 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisRunAttempt`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisRunAttempt {
    pluginRunId: CordisDynamicPluginRunId;
    packageId: CordisDynamicPackageId;
    mode: CordisDynamicRunMode;
    status: CordisRunStatus;
    approvalRequestId?: ApprovalRequestId;
    requiresApproval?: boolean;
    host: CordisHalfState;
    client: CordisHalfState;
    error?: CordisRunDiagnostic;
}
```

成员检索：`approvalRequestId`、`client`、`error`、`host`、`mode`、`packageId`、`pluginRunId`、`requiresApproval`、`status`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。
