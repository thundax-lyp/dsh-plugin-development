# @deepseek-ai/dsh-typert-protocol .：公开对象 3

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-typert-protocol 选型与组合](api-core-dsh-typert-protocol-root-overview.md)。

借助 `dsh-typert-protocol`，业务包可以向 Remote 客户端暴露 Host 方法：用 `@Remote`（作用域接收者用 `@RemoteScope`）标记方法，把服务绑定到 wire 命名空间，并通过可合并扩展的协议映射把 Host 对象与作用域 Context 关联到 wire identity。生成产物、Host Gateway 与 Client API 消费同一套调用描述符、编解码器与提供方约定。调用持有的值把清理责任交给 Gateway，不另增引用计数。本包不注册任何 Cordis 服务，也不运行 TypeScript 分析。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## RemoteInvocation 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteInvocation`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteInvocation {
    readonly request: {
        readonly namespace: string;
        readonly method: string;
        readonly args: Readonly<Record<string, unknown>>;
    };
    readonly service: string;
    readonly peer: PeerScope;
    readonly signal: AbortSignal;
    readonly uplinkWindow?: RemoteUplinkWindow | undefined;
    uplink<In = unknown>(): AsyncIterable<In>;
}
```

成员检索：`peer`、`request`、`service`、`signal`、`uplink`、`uplinkWindow`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## RemoteInvocationMarker 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteInvocationMarker`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteInvocationMarker = {
    readonly kind: 'direct';
} | {
    readonly kind: 'context';
    readonly context: string;
};
```

成员检索：`kind`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## RemoteMethodMarker 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteMethodMarker`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteMethodMarker {
    readonly method: string;
    readonly exportName?: string;
    readonly mode?: 'stream';
    readonly invocation: RemoteInvocationMarker;
    readonly resources?: Readonly<Record<string, TypertResourceReader>>;
}
```

成员检索：`exportName`、`invocation`、`method`、`mode`、`resources`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## RemoteMethodOptions 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteMethodOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteMethodOptions<WireArgs extends readonly unknown[] = never> extends RemoteScopeOptions<WireArgs> {
    readonly mode?: 'stream';
}
```

成员检索：`mode`、`name`、`resources`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## RemoteResult 公开契约

判别式结果：ok:true携value，ok:false携真实RemoteError的失败union。先分支再读字段，按error.code收窄details；caller abort被归一为gateway/cancelled。不要通过instanceof识别跨独立bundle的失败。

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteResult`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteResult<T> = {
    readonly ok: true;
    readonly value: T;
} | {
    readonly ok: false;
    readonly error: RemoteFailure;
};
```

成员检索：`ok`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## RemoteScope 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteScope`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function RemoteScope(key: Extract<keyof TypertContextMap, string>, name?: string): RemoteMethodDecorator;

export declare function RemoteScope<This extends object, Args extends unknown[], Result>(key: Extract<keyof TypertContextMap, string>, options: NoInfer<RemoteScopeOptions<RemoteWireArgs<Args>>>): RemoteTypedMethodDecorator<This, Args, Result>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## RemoteScopeOptions 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteScopeOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteScopeOptions<WireArgs extends readonly unknown[] = never> {
    readonly name?: string;
    readonly resources?: TypertResourceReaders<WireArgs>;
}
```

成员检索：`name`、`resources`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## RemoteStream 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteStream`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteStream<Out, In = never> = AsyncIterable<Out> & {
    readonly [STREAM_UPLINK]?: In;
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。
