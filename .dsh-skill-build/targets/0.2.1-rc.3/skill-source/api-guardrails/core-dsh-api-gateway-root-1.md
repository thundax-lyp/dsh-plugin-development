# @deepseek-ai/dsh-api-gateway .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-gateway 选型与组合](api-core-dsh-api-gateway-root-overview.md)。

为 Host 与 Client 两侧的 Cordis 环境提供 Typert RPC endpoint。Host 入口提供 `ctx.typertGateway`，`@deepseek-ai/dsh-api-gateway/client` 则提供 `ctx.remote`；两者使用同一份生成的 `InvocationDescriptor` 约定，并将业务选择交给 API Remotes。Connection 承载一元调用的请求关联、信任和响应 envelope，Gateway 则拥有多路复用的 Remote 流，每条流都在同一条逻辑流上携带从 Client 到 Host 的上行（uplink）。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    readonly websocketHeartbeatIntervalMs?: number;
    readonly streamInboxBytes?: number;
}
```

成员检索：`streamInboxBytes`、`websocketHeartbeatIntervalMs`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## InvokeRemoteRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway`；公开符号：`InvokeRemoteRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface InvokeRemoteRequest {
    readonly namespace: string;
    readonly method: string;
    readonly args: Readonly<Record<string, unknown>>;
    readonly uplink?: AsyncIterable<unknown>;
    readonly uplinkWindow?: RemoteUplinkWindow | undefined;
    readonly peer: PeerScope;
    readonly signal?: AbortSignal;
}
```

成员检索：`args`、`method`、`namespace`、`peer`、`signal`、`uplink`、`uplinkWindow`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteEventHostInfo 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway`；公开符号：`RemoteEventHostInfo`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteEventHostInfo {
    readonly home: string;
}
```

成员检索：`home`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TypertGateway 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway`；公开符号：`TypertGateway`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertGateway {
    readonly wireStream: TypertGatewayWireStream;
    hasLiveClient(): boolean;
    registerRemoteEvents(source: TypertRemoteEventSource, host: RemoteEventHostInfo): () => Promise<void>;
    invoke(request: InvokeRemoteRequest): Promise<unknown>;
    stream(request: InvokeRemoteRequest): Promise<AsyncIterable<unknown>>;
}
```

成员检索：`hasLiveClient`、`invoke`、`registerRemoteEvents`、`stream`、`wireStream`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TypertGatewayError 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway`；公开符号：`TypertGatewayError`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class TypertGatewayError extends RemoteError<TypertGatewayErrorCode> {
    readonly endpoint: string;
    readonly field: string | undefined;
    constructor(code: TypertGatewayErrorCode, endpoint: string, message: string, options?: GatewayErrorOptions);
}
```

成员检索：`endpoint`、`field`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TypertGatewayErrorCode 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway`；公开符号：`TypertGatewayErrorCode`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertGatewayErrorCode = 'gateway/ambiguous-endpoint' | 'gateway/arguments-invalid' | 'gateway/binding-invalid' | 'gateway/context-failed' | 'gateway/context-not-found' | 'gateway/context-unavailable' | 'gateway/definition-unavailable' | 'gateway/input-invalid' | 'gateway/interactions-forbidden' | 'gateway/invocation-unavailable' | 'gateway/lookup-failed' | 'gateway/lookup-not-found' | 'gateway/lookup-unavailable' | 'gateway/method-unavailable' | 'gateway/peer-disposed' | 'gateway/protocol' | 'gateway/provider-mismatch' | 'gateway/result-invalid' | 'gateway/service-unavailable' | 'gateway/signature-invalid' | 'gateway/uplink-overflow';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TypertGatewayFaultDetails 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway`；公开符号：`TypertGatewayFaultDetails`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertGatewayFaultDetails {
    readonly endpoint: string;
    readonly field?: string;
}
```

成员检索：`endpoint`、`field`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TypertGatewayService 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway`；公开符号：`TypertGatewayService`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class TypertGatewayService extends Service implements TypertGateway {
    static inject: string[];
    static Config: z<Config>;
    readonly wireStream: TypertGatewayWireStream;
    constructor(ctx: Context, config: Config);
    hasLiveClient(): boolean;
    registerRemoteEvents(source: TypertRemoteEventSource, host: RemoteEventHostInfo): () => Promise<void>;
    invoke(request: InvokeRemoteRequest): Promise<unknown>;
    stream(request: InvokeRemoteRequest): Promise<AsyncIterable<unknown>>;
}
```

成员检索：`hasLiveClient`、`invoke`、`registerRemoteEvents`、`stream`、`wireStream`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
