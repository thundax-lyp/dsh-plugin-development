# @deepseek-ai/dsh-cordis-client-runner ./client：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-cordis-client-runner 选型与组合](api-core-dsh-cordis-client-runner-client-overview.md)。

`dsh-cordis-client-runner` 为程序调用方和现有浏览器控件运行进程内动态包的浏览器部分。它在请求获批或用户显式操作后加载定义，并在 Host 撤销运行时移除定义。页面刷新不会恢复定义。Creator UI 插件通过 Plugin Manager 使用已安装的 Client 模块。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## ApprovalRequestId 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`ApprovalRequestId`。

公开声明签名：

```text
export type ApprovalRequestId = Branded<'ApprovalRequestId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## ClientCordisInspectHost 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`ClientCordisInspectHost`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ClientCordisInspectHost {
    sync(providers: readonly CordisInspectProviderManifest[]): Promise<void>;
    resolve(sessionId: SessionId, requestId: CordisInspectRequestId, resolution: CordisInspectQueryResolution): Promise<void>;
}
```

成员检索：`resolve`、`sync`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## ClientCordisInspectProviderRegistration 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`ClientCordisInspectProviderRegistration`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ClientCordisInspectProviderRegistration {
    manifest: CordisInspectProviderManifest;
    query(method: string, input: JsonValue | undefined, context: ClientCordisInspectQueryContext): Promise<JsonValue>;
}
```

成员检索：`manifest`、`query`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## ClientCordisInspectQueryContext 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`ClientCordisInspectQueryContext`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ClientCordisInspectQueryContext {
    signal: AbortSignal;
    sessionId: SessionId;
}
```

成员检索：`sessionId`、`signal`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## ClientCordisInspectRegistry 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`ClientCordisInspectRegistry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class ClientCordisInspectRegistry {
    constructor(host: ClientCordisInspectHost);
    register(registration: ClientCordisInspectProviderRegistration): () => void;
    publish(): void;
    query(request: CordisInspectQueryRequest): Promise<void>;
    close(requestId: CordisInspectRequestId): void;
}
```

成员检索：`close`、`publish`、`query`、`register`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## ClientTimerService 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`ClientTimerService`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class ClientTimerService extends Service {
    constructor(ctx: Context);
    timeout(callback: () => void, delay: number): () => void;
    timeout(delay: number): Promise<void>;
    interval(callback: () => void, delay: number): () => void;
    interval<R = any>(delay: number): AsyncIterableIterator<void, R, void>;
    throttle<F extends (...args: any[]) => void>(callback: F, delay: number, noTrailing?: boolean): WithDispose<F>;
    debounce<F extends (...args: any[]) => void>(callback: F, delay: number): WithDispose<F>;
}
```

成员检索：`debounce`、`interval`、`throttle`、`timeout`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisDynamicPackageId 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`CordisDynamicPackageId`。

公开声明签名：

```text
export type CordisDynamicPackageId = Branded<'CordisDynamicPackageId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisDynamicPluginId 公开契约

导入入口：`@deepseek-ai/dsh-cordis-client-runner/client`；公开符号：`CordisDynamicPluginId`。

公开声明签名：

```text
export type CordisDynamicPluginId = Branded<'CordisDynamicPluginId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。
