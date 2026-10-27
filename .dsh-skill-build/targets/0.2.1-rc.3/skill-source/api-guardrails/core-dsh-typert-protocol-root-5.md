# @deepseek-ai/dsh-typert-protocol .：公开对象 5

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-typert-protocol 选型与组合](api-core-dsh-typert-protocol-root-overview.md)。

借助 `dsh-typert-protocol`，业务包可以向 Remote 客户端暴露 Host 方法：用 `@Remote`（作用域接收者用 `@RemoteScope`）标记方法，把服务绑定到 wire 命名空间，并通过可合并扩展的协议映射把 Host 对象与作用域 Context 关联到 wire identity。生成产物、Host Gateway 与 Client API 消费同一套调用描述符、编解码器与提供方约定。调用持有的值把清理责任交给 Gateway，不另增引用计数。本包不注册任何 Cordis 服务，也不运行 TypeScript 分析。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## TypertCodec 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertCodec`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertCodec<Value = unknown> = (TypertRemoteValue<Value> & {
    readonly mode: 'strict';
    readonly typeSymbol: string;
    readonly decode?: ((value: unknown) => unknown) | undefined;
    readonly encode?: ((value: unknown, writeBytes: (bytes: Uint8Array, path: readonly (string | number)[]) => null) => unknown) | undefined;
}) | {
    readonly mode: 'src-json';
};
```

成员检索：`mode`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertContext 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertContext`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertContext<Wire> {
    readonly [CONTEXT_WIRE]: Wire;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertContextMap 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertContextMap`。

目标版本编译声明（省略源码注释与实现体）：

声明来源包 `@deepseek-ai/dsh-typert-protocol`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface TypertContextMap {
}
```

声明来源包 `@deepseek-ai/dsh-agent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertContextMap {
    agent: TypertContext<SessionId>;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertContextRegistry 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertContextRegistry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertContextRegistry {
    registerHost<K extends StringKeyOf<TypertContextMap>>(key: K, adapter: TypertHostContextAdapter<TypertContextWire<TypertContextMap[K]>>): TypertDisposer;
    configureHost<K extends StringKeyOf<TypertContextMap>>(key: K, resolver: TypertHostContextResolver<TypertContextWire<TypertContextMap[K]>>): TypertDisposer;
    registerClient<K extends StringKeyOf<TypertContextMap>>(key: K, adapter: TypertClientContextAdapter<TypertContextWire<TypertContextMap[K]>>): TypertDisposer;
    getHost(key: string): TypertHostContextAdapter | undefined;
    getClient(key: string): TypertClientContextAdapter | undefined;
    subscribe(listener: TypertRegistryListener): TypertDisposer;
}
```

成员检索：`configureHost`、`getClient`、`getHost`、`registerClient`、`registerHost`、`subscribe`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertContextWire 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertContextWire`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertContextWire<ContextType> = ContextType extends TypertContext<infer Wire> ? Wire : never;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertDisposer 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertDisposer`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertDisposer = () => Promise<void>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertForwardableEvent 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertForwardableEvent`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertForwardableEvent = {
    [Event in keyof Events]: TypertForwardingMode<Event> extends never ? never : Event;
}[keyof Events];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertForwardableEventEntry 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertForwardableEventEntry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertForwardableEventEntry = {
    [Event in keyof Events]: TypertForwardingMode<Event> extends infer Mode ? Mode extends 'emit' ? {
        readonly event: Event;
        readonly mode: Mode;
        readonly resources?: TypertResourceReaders<TypertEventParameters<Event>>;
    } : Mode extends 'waterfall' ? {
        readonly event: Event;
        readonly mode: Mode;
    } : never : never;
}[keyof Events];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。
