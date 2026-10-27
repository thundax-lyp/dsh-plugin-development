# @deepseek-ai/dsh-typert-protocol .：公开对象 10

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-typert-protocol 选型与组合](api-core-dsh-typert-protocol-root-overview.md)。

借助 `dsh-typert-protocol`，业务包可以向 Remote 客户端暴露 Host 方法：用 `@Remote`（作用域接收者用 `@RemoteScope`）标记方法，把服务绑定到 wire 命名空间，并通过可合并扩展的协议映射把 Host 对象与作用域 Context 关联到 wire identity。生成产物、Host Gateway 与 Client API 消费同一套调用描述符、编解码器与提供方约定。调用持有的值把清理责任交给 Gateway，不另增引用计数。本包不注册任何 Cordis 服务，也不运行 TypeScript 分析。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## TypertRemoteScopeNamespace 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteScopeNamespace`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertRemoteScopeNamespace<Namespace extends string, ContextKey extends string = string> = {
    [Endpoint in keyof TypertRemoteScopeMap as Endpoint extends `${ContextKey}:${Namespace}/${infer Method}` ? Method : never]: TypertRemoteScopeMap[Endpoint];
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRemoteService 公开契约

Host 业务 Service 的便捷基类：protected constructor(ctx,serviceKey,options?) 调用 Cordis Service 并将同一 key 绑定为 Typert namespace（可显式覆盖 namespace）。公开 typertRemote 是冻结绑定，由 Gateway 读取；仅 new 此类不代表远端端点完成装配。第一个绑定为根 Context 建立 invocation accessor，非 Remote 调用时读取 undefined，调用派生 Context 上才有本次 invocation，不能跨异步调用缓存另一个请求的身份。

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteService`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare abstract class TypertRemoteService<out T = never> extends Service<T> {
    readonly typertRemote: TypertGatewayBinding<this>;
}
```

成员检索：`typertRemote`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRemoteSpec 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteSpec`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertRemoteSpec {
    readonly package: string;
    readonly methods: Readonly<Record<`${string}/${string}`, TypertRemoteMethodSpec>>;
}
```

成员检索：`methods`、`package`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRemoteValue 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRemoteValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertRemoteValue<Value = unknown> {
    readonly create: () => TypertSchema<Value>;
    readonly description?: string | undefined;
    readonly jsonSchema?: Readonly<Record<string, unknown>> | undefined;
    readonly jsonSchemaError?: string | undefined;
}
```

成员检索：`create`、`description`、`jsonSchema`、`jsonSchemaError`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertResource 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertResource`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertResource<Id> {
    readonly [RESOURCE_ID]: Id;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertResourceDeclaration 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertResourceDeclaration`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertResourceDeclaration {
    readonly field: string;
}
```

成员检索：`field`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertResourceEntry 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertResourceEntry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertResourceEntry extends TypertResourceDeclaration {
    readonly kind: string;
}
```

成员检索：`field`、`kind`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertResourceId 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertResourceId`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertResourceId<Resource> = Resource extends TypertResource<infer Id> ? Id : never;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。
