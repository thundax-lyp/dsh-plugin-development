# @deepseek-ai/dsh-api-remotes ./client：公开对象 11

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-remotes 选型与组合](api-core-dsh-api-remotes-client-overview.md)。

为本应用选定的 Host Remote 能力提供双侧 BFF。Host 入口拥有转发事件名单并向 API Gateway 注册应用事件 source；Client 入口以运行时值形式导入生成的 `/remote` 产物，通过 `ctx.remote.$mount()` 挂载每项贡献，并重新导出对应的声明合并。Client 业务包依赖该外观，而不依赖 Gateway 实现或单独的 Remote 运行时入口。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## RemoteResult 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`RemoteResult`。

公开声明签名：

```text
export type RemoteResult<T> = {
    readonly ok: true;
    readonly value: T;
} | {
    readonly ok: false;
    readonly error: RemoteFailure;
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RequestRunOutcome 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`RequestRunOutcome`。

公开声明签名：

```text
export type RequestRunOutcome = 'approved' | 'completed' | 'rejected' | 'cancelled' | 'failed';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RestartReason 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`RestartReason`。

公开声明签名：

```text
export type RestartReason = 'no-hmr' | 'package-moved' | 'host-module' | 'unmanaged-plugin' | 'module-comparison';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RpcId 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`RpcId`。

公开声明签名：

```text
export declare function RpcId(id: string): RpcId;

export type RpcId = Branded<'rpc-id'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RpcRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`RpcRequest`。

公开声明签名：

```text
export interface RpcRequest<P> {
    readonly rpcId: RpcId;
    readonly payload: P;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RpcResponse 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`RpcResponse`。

公开声明签名：

```text
export interface RpcResponse<T> {
    readonly rpcId: RpcId;
    readonly result: RpcResult<T>;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RpcResult 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`RpcResult`。

公开声明签名：

```text
export type RpcResult<T> = ConnectionRpcResult<T>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `ok` | `readonly ok: false;` | [ConnectionRpcResult 权威声明](../../client/api/api-client-connection-rpc.md#connectionrpcresult-client) |
| `ok` | `readonly ok: true;` | [ConnectionRpcResult 权威声明](../../client/api/api-client-connection-rpc.md#connectionrpcresult-client) |

## SessionId 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`SessionId`。

公开声明签名：

```text
export declare function SessionId(id: string): SessionId;

export type SessionId = Branded<'SessionId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
