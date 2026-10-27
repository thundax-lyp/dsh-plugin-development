# @deepseek-ai/dsh-typert-protocol .：公开对象 6

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-typert-protocol 选型与组合](api-core-dsh-typert-protocol-root-overview.md)。

借助 `dsh-typert-protocol`，业务包可以向 Remote 客户端暴露 Host 方法：用 `@Remote`（作用域接收者用 `@RemoteScope`）标记方法，把服务绑定到 wire 命名空间，并通过可合并扩展的协议映射把 Host 对象与作用域 Context 关联到 wire identity。生成产物、Host Gateway 与 Client API 消费同一套调用描述符、编解码器与提供方约定。调用持有的值把清理责任交给 Gateway，不另增引用计数。本包不注册任何 Cordis 服务，也不运行 TypeScript 分析。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## TypertGatewayBinding 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertGatewayBinding`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertGatewayBinding<Service extends object = object> {
    readonly service: Service;
    readonly serviceKey: string;
    readonly namespace: string;
}
```

成员检索：`namespace`、`service`、`serviceKey`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertGatewayBindingOptions 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertGatewayBindingOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertGatewayBindingOptions {
    readonly namespace?: string;
}
```

成员检索：`namespace`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertHostContextAdapter 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertHostContextAdapter`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertHostContextAdapter<Wire = unknown> {
    readonly wire: string;
    readonly wireTypeSymbol: string;
    readonly resource?: TypertResourceKindFor<Wire>;
    resolve(id: Wire): Context | undefined | Promise<Context | undefined>;
}
```

成员检索：`resolve`、`resource`、`wire`、`wireTypeSymbol`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertHostContextResolver 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertHostContextResolver`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertHostContextResolver<Wire = unknown> = (id: Wire) => Context | undefined | Promise<Context | undefined>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertLocalRegistry 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertLocalRegistry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertLocalRegistry {
    get(endpoint: string): InvocationDescriptor | undefined;
    hasSeen(endpoint: string): boolean;
    list(): readonly InvocationDescriptor[];
    subscribe(listener: TypertRegistryListener): TypertDisposer;
}
```

成员检索：`get`、`hasSeen`、`list`、`subscribe`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertLookup 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertLookup`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertLookup<Host, Wire> {
    readonly [LOOKUP_HOST]: Host;
    readonly [LOOKUP_WIRE]: Wire;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertLookupDefinition 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertLookupDefinition`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertLookupDefinition {
    readonly key: string;
    readonly parameter: string;
    readonly wire: string;
    readonly hostTypeSymbol: string;
    readonly wireTypeSymbol: string;
}
```

成员检索：`hostTypeSymbol`、`key`、`parameter`、`wire`、`wireTypeSymbol`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertLookupHost 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertLookupHost`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertLookupHost<Lookup> = Lookup extends TypertLookup<infer Host, infer _Wire> ? Host : never;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。
