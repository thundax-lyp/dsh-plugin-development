# @deepseek-ai/dsh-cordis-client-runner ./client：公开对象 4

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-cordis-client-runner 选型与组合](api-core-dsh-cordis-client-runner-client-overview.md)。

`dsh-cordis-client-runner` 为程序调用方和现有浏览器控件运行进程内动态包的浏览器部分。它在请求获批或用户显式操作后加载定义，并在 Host 撤销运行时移除定义。页面刷新不会恢复定义。Creator UI 插件通过 Plugin Manager 使用已安装的 Client 模块。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## DynamicCordisLoadResult 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`DynamicCordisLoadResult`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type DynamicCordisLoadResult = {
    ok: true;
    pluginRunId: CordisDynamicPluginRunId;
    waitingFor?: string[];
} | ({
    ok: false;
    cause: DynamicCordisLoadErrorCause;
    error?: unknown;
} & CordisErrorDetails);
```

成员检索：`ok`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisPackage 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`DynamicCordisPackage`。

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

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisPackageRunner 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`DynamicCordisPackageRunner`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class DynamicCordisPackageRunner {
    constructor(env: DynamicCordisRunnerEnv);
    subscribe(fn: () => void): () => void;
    readonly renderFailures: CordisObservable<ReadonlyMap<CordisDynamicPluginId, DynamicCordisRenderFailure>>;
    getSnapshot(): readonly DynamicCordisLivePackage[];
    isLoaded(pluginId: CordisDynamicPluginId): boolean;
    load(half: DynamicCordisClientHalf): Promise<DynamicCordisLoadResult>;
    retract(pluginId: CordisDynamicPluginId, pluginRunId: CordisDynamicPluginRunId): void;
    dispose(): Promise<void>;
}
```

成员检索：`dispose`、`getSnapshot`、`isLoaded`、`load`、`renderFailures`、`retract`、`subscribe`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisRenderFailure 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`DynamicCordisRenderFailure`。

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

## DynamicCordisRunnerEnv 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`DynamicCordisRunnerEnv`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisRunnerEnv {
    ctx: Context;
    loader: Loader;
    modules: ClientModuleSystem;
    slots: SlotRegistry;
    invoke(pluginId: CordisDynamicPluginId, pluginRunId: CordisDynamicPluginRunId, method: string, args: unknown): Promise<unknown>;
    reportRenderFailure(agentId: SessionId, pluginId: CordisDynamicPluginId, pluginRunId: CordisDynamicPluginRunId, failure: DynamicCordisRenderFailure): void;
    reportGuardFailure(agentId: SessionId, pluginId: CordisDynamicPluginId, pluginRunId: CordisDynamicPluginRunId, failure: CordisErrorDetails): void;
}
```

成员检索：`ctx`、`invoke`、`loader`、`modules`、`reportGuardFailure`、`reportRenderFailure`、`slots`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisSlotLedgerRow 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`DynamicCordisSlotLedgerRow`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisSlotLedgerRow {
    slot: string;
    priority: number | undefined;
}
```

成员检索：`priority`、`slot`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisStyles 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`DynamicCordisStyles`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class DynamicCordisStyles {
    constructor(pluginId: CordisDynamicPluginId);
    insert(css: string): () => void;
    get count(): number;
    dispose(): void;
}
```

成员检索：`count`、`dispose`、`insert`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: Context): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。
