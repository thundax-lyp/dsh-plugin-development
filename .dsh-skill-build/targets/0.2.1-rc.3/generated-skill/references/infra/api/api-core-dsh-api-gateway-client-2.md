# @deepseek-ai/dsh-api-gateway ./client：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-gateway 选型与组合](api-core-dsh-api-gateway-client-overview.md)。

为 Host 与 Client 两侧的 Cordis 环境提供 Typert RPC endpoint。Host 入口提供 `ctx.typertGateway`，`@deepseek-ai/dsh-api-gateway/client` 则提供 `ctx.remote`；两者使用同一份生成的 `InvocationDescriptor` 约定，并将业务选择交给 API Remotes。Connection 承载一元调用的请求关联、信任和响应 envelope，Gateway 则拥有多路复用的 Remote 流，每条流都在同一条逻辑流上携带从 Client 到 Host 的上行（uplink）。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## RemoteStream 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway/client`；公开符号：`RemoteStream`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class RemoteStream<Item> implements AsyncIterable<RemoteStreamItem<Item>> {
    constructor(connection: Pick<ConnectionHandle, 'generation'>, options: RemoteStreamOptions<Item>);
    get signal(): AbortSignal;
    restart(): void;
    dispose(): Promise<void>;
    [Symbol.asyncIterator](): AsyncIterator<RemoteStreamItem<Item>>;
}
```

成员检索：`dispose`、`restart`、`signal`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteStreamCarrierError 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway/client`；公开符号：`RemoteStreamCarrierError`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class RemoteStreamCarrierError extends Error {
    constructor(message: string, options?: ErrorOptions);
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteStreamFactory 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway/client`；公开符号：`RemoteStreamFactory`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteStreamFactory {
    $stream<Item>(options: RemoteStreamOptions<Item>): RemoteStream<Item>;
}
```

成员检索：`$stream`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteStreamItem 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway/client`；公开符号：`RemoteStreamItem`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteStreamItem<Item> {
    readonly generation: number;
    readonly value: Item;
    readonly signal: AbortSignal;
    accept(): void;
}
```

成员检索：`accept`、`generation`、`signal`、`value`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteStreamOptions 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway/client`；公开符号：`RemoteStreamOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteStreamOptions<Item> {
    readonly name: string;
    readonly open: (signal: AbortSignal) => AsyncIterable<Item>;
    readonly ended: (accepted: boolean) => Error;
    readonly carrierFailed?: (error: RemoteStreamCarrierError) => void;
}
```

成员检索：`carrierFailed`、`ended`、`name`、`open`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway/client`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: Context): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## cancelledFailure 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway/client`；公开符号：`cancelledFailure`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function cancelledFailure(endpoint: string, cause: unknown): Extract<RemoteResult<never>, {
    readonly ok: false;
}>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
