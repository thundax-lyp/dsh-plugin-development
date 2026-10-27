# @deepseek-ai/dsh-typert-protocol .：公开对象 4

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-typert-protocol 选型与组合](api-core-dsh-typert-protocol-root-overview.md)。

借助 `dsh-typert-protocol`，业务包可以向 Remote 客户端暴露 Host 方法：用 `@Remote`（作用域接收者用 `@RemoteScope`）标记方法，把服务绑定到 wire 命名空间，并通过可合并扩展的协议映射把 Host 对象与作用域 Context 关联到 wire identity。生成产物、Host Gateway 与 Client API 消费同一套调用描述符、编解码器与提供方约定。调用持有的值把清理责任交给 Gateway，不另增引用计数。本包不注册任何 Cordis 服务，也不运行 TypeScript 分析。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## RemoteStreamHandle 公开契约

Client下行可异步迭代，另外拥有send/end/dispose控制同一逻辑流的上行与生命周期。提前终止消费、组件卸载或cancel时dispose；send发的每项必须符合生成的uplink codec。one-way stream不凭空有可发送的In类型。

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteStreamHandle`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteStreamHandle<Out, In> extends AsyncIterable<Out> {
    send(item: In): void;
    end(): void;
    dispose(): void;
}
```

成员检索：`dispose`、`end`、`send`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## RemoteUplinkWindow 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteUplinkWindow`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteUplinkWindow {
    readonly maxBytes: number;
    readonly frameOverheadBytes: number;
}
```

成员检索：`frameOverheadBytes`、`maxBytes`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## RemoteWireArgs 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteWireArgs`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteWireArgs<Args extends unknown[]> = {
    [Index in keyof Args]: RemoteWireValue<Args[Index]>;
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## RemoteWireValue 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`RemoteWireValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteWireValue<Value> = Value extends TypertLookupHost<TypertLookupEntry> ? TypertWireForHost<Value, TypertLookupEntry> : Value;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TYPERT_OWNED_VALUE 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TYPERT_OWNED_VALUE`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const TYPERT_OWNED_VALUE: unique symbol;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertClientContextAdapter 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertClientContextAdapter`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertClientContextAdapter<Wire = unknown> {
    identity(ctx: Context): Wire | undefined;
    resolve(id: Wire): Context | TypertOwnedValue<Context> | undefined;
}
```

成员检索：`identity`、`resolve`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertClientEventListener 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertClientEventListener`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertClientEventListener<Event extends TypertRemoteEvent> = unknown extends ThisParameterType<Events[Event]> ? Events[Event] : TypertScopedClientEventListener<Event>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertClientRemote 公开契约

协议最小Client界面只有$mount和$on，业务namespace由生成声明合并。$mount的disposer归调用owner，$on的事件键集由TypertRemoteEventSelection收窄；传输socket和event carrier由Gateway私有持有。

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertClientRemote`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertClientRemote extends TypertRemoteNamespaceMap {
    $mount(contribution: TypertRemoteContribution): Promise<TypertDisposer>;
    $on<Event extends TypertRemoteEvent>(event: Event, listener: TypertClientEventListener<Event>): () => void;
}
```

成员检索：`$mount`、`$on`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。
