# @deepseek-ai/dsh-api-remotes ./client：公开对象 5

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-remotes 选型与组合](api-core-dsh-api-remotes-client-overview.md)。

为本应用选定的 Host Remote 能力提供双侧 BFF。Host 入口拥有转发事件名单并向 API Gateway 注册应用事件 source；Client 入口以运行时值形式导入生成的 `/remote` 产物，通过 `ctx.remote.$mount()` 挂载每项贡献，并重新导出对应的声明合并。Client 业务包依赖该外观，而不依赖 Gateway 实现或单独的 Remote 运行时入口。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## DynamicCordisResolveAck 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`DynamicCordisResolveAck`。

公开声明签名：

```text
export interface DynamicCordisResolveAck {
    accepted: boolean;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## DynamicCordisRetracted 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`DynamicCordisRetracted`。

公开声明签名：

```text
export interface DynamicCordisRetracted {
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    pluginRunId: CordisDynamicPluginRunId;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## DynamicCordisRunAttempt 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`DynamicCordisRunAttempt`。

公开声明签名：

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

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## DynamicCordisRunRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`DynamicCordisRunRequest`。

公开声明签名：

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

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## DynamicCordisRunResolution 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`DynamicCordisRunResolution`。

公开声明签名：

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

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## DynamicCordisRunResponse 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`DynamicCordisRunResponse`。

公开声明签名：

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

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## DynamicCordisStopResponse 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`DynamicCordisStopResponse`。

公开声明签名：

```text
export type DynamicCordisStopResponse = {
    ok: true;
} | {
    ok: false;
    reason: 'plugin-missing' | 'not-running';
    message: string;
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## DynamicCordisUndefineReceipt 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`DynamicCordisUndefineReceipt`。

公开声明签名：

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

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
