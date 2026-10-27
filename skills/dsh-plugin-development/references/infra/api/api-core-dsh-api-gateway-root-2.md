# @deepseek-ai/dsh-api-gateway .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-gateway 选型与组合](api-core-dsh-api-gateway-root-overview.md)。

为 Host 与 Client 两侧的 Cordis 环境提供 Typert RPC endpoint。Host 入口提供 `ctx.typertGateway`，`@deepseek-ai/dsh-api-gateway/client` 则提供 `ctx.remote`；两者使用同一份生成的 `InvocationDescriptor` 约定，并将业务选择交给 API Remotes。Connection 承载一元调用的请求关联、信任和响应 envelope，Gateway 则拥有多路复用的 Remote 流，每条流都在同一条逻辑流上携带从 Client 到 Host 的上行（uplink）。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## TypertGatewayWireStream 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway`；公开符号：`TypertGatewayWireStream`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertGatewayWireStream {
    readonly open: (endpoint: string, payload: unknown, uplink: AsyncIterable<unknown>, peer: PeerScope, signal: AbortSignal) => Promise<AsyncIterable<unknown>>;
    readonly failure: (error: unknown) => {
        readonly code: string;
        readonly message: string;
        readonly details: object;
    };
}
```

成员检索：`failure`、`open`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TypertRemoteEventContext 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway`；公开符号：`TypertRemoteEventContext`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertRemoteEventContext {
    readonly value: Context;
    readonly subject: object;
    readonly agentId: string;
}
```

成员检索：`agentId`、`subject`、`value`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TypertRemoteEventDispatch 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway`；公开符号：`TypertRemoteEventDispatch`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertRemoteEventDispatch = TypertRemoteEventFrame | TypertRemoteEventInvocation;
```

成员检索：`event`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TypertRemoteEventFrame 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway`；公开符号：`TypertRemoteEventFrame`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertRemoteEventFrame {
    readonly event: string;
    readonly args: readonly unknown[];
    readonly resources?: Readonly<Record<string, TypertResourceReader>>;
}
```

成员检索：`args`、`event`、`resources`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TypertRemoteEventInvocation 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway`；公开符号：`TypertRemoteEventInvocation`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertRemoteEventInvocation {
    readonly event: string;
    readonly request: object;
    readonly context: TypertRemoteEventContext;
    readonly resolve: (outcome: TypertRemoteEventOutcome) => void;
    readonly reject: (reason: unknown) => void;
}
```

成员检索：`context`、`event`、`reject`、`request`、`resolve`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TypertRemoteEventOutcome 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway`；公开符号：`TypertRemoteEventOutcome`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertRemoteEventOutcome = {
    readonly kind: 'result';
    readonly value: unknown;
} | {
    readonly kind: 'next';
};
```

成员检索：`kind`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TypertRemoteEventSource 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway`；公开符号：`TypertRemoteEventSource`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertRemoteEventSource = (signal: AbortSignal) => AsyncIterable<TypertRemoteEventDispatch>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
