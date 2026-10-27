# @deepseek-ai/dsh-api-remotes ./client：公开对象 4

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-remotes 选型与组合](api-core-dsh-api-remotes-client-overview.md)。

为本应用选定的 Host Remote 能力提供双侧 BFF。Host 入口拥有转发事件名单并向 API Gateway 注册应用事件 source；Client 入口以运行时值形式导入生成的 `/remote` 产物，通过 `ctx.remote.$mount()` 挂载每项贡献，并重新导出对应的声明合并。Client 业务包依赖该外观，而不依赖 Gateway 实现或单独的 Remote 运行时入口。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## CordisRunStatus 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`CordisRunStatus`。

公开声明签名：

```text
export type CordisRunStatus = 'awaiting-approval' | 'starting-host' | 'client-pending' | 'running' | 'waiting' | 'rejected' | 'failed' | 'cancelled' | 'stopped';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## CredentialInfo 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`CredentialInfo`。

公开声明签名：

```text
export interface CredentialInfo {
    configured: boolean;
    source?: string;
    writable: boolean;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## DynamicCordisClientSource 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`DynamicCordisClientSource`。

公开声明签名：

```text
export interface DynamicCordisClientSource {
    code: string;
    name: string;
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    pluginRunId: CordisDynamicPluginRunId;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## DynamicCordisHostHalfResult 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`DynamicCordisHostHalfResult`。

公开声明签名：

```text
export type DynamicCordisHostHalfResult = {
    ok: true;
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    pluginRunId: CordisDynamicPluginRunId;
    waitingFor: readonly string[];
    startedHere: boolean;
} | ({
    ok: false;
} & CordisErrorDetails);
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## DynamicCordisInventoryRow 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`DynamicCordisInventoryRow`。

公开声明签名：

```text
export interface DynamicCordisInventoryRow {
    pluginId: CordisDynamicPluginId;
    agentId: SessionId;
    packages: readonly DynamicCordisInventoryPackage[];
    currentPackageId?: CordisDynamicPackageId;
    nextPackageId?: CordisDynamicPackageId;
    activeRun?: {
        pluginRunId: CordisDynamicPluginRunId;
        packageId: CordisDynamicPackageId;
    };
    latestRun?: DynamicCordisRunAttempt;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## DynamicCordisInvokeResult 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`DynamicCordisInvokeResult`。

公开声明签名：

```text
export type DynamicCordisInvokeResult = {
    ok: true;
    value: JsonValue;
} | ({
    ok: false;
    code: 'plugin-not-running' | 'stale-run' | 'method-not-found' | 'handler-error';
} & CordisErrorDetails);
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## DynamicCordisPackage 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`DynamicCordisPackage`。

公开声明签名：

```text
export interface DynamicCordisPackage {
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    pluginRunId: CordisDynamicPluginRunId;
    name: string;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## DynamicCordisRequestResolved 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`DynamicCordisRequestResolved`。

公开声明签名：

```text
export interface DynamicCordisRequestResolved {
    requestId: ApprovalRequestId;
    outcome: RequestRunOutcome;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
