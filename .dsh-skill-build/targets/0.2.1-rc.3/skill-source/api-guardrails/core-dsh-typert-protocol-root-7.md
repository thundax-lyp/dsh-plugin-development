# @deepseek-ai/dsh-typert-protocol .：公开对象 7

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-typert-protocol 选型与组合](api-core-dsh-typert-protocol-root-overview.md)。

借助 `dsh-typert-protocol`，业务包可以向 Remote 客户端暴露 Host 方法：用 `@Remote`（作用域接收者用 `@RemoteScope`）标记方法，把服务绑定到 wire 命名空间，并通过可合并扩展的协议映射把 Host 对象与作用域 Context 关联到 wire identity。生成产物、Host Gateway 与 Client API 消费同一套调用描述符、编解码器与提供方约定。调用持有的值把清理责任交给 Gateway，不另增引用计数。本包不注册任何 Cordis 服务，也不运行 TypeScript 分析。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## TypertLookupMap 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertLookupMap`。

目标版本编译声明（省略源码注释与实现体）：

声明来源包 `@deepseek-ai/dsh-typert-protocol`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface TypertLookupMap {
}
```

声明来源包 `@deepseek-ai/dsh-session`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertLookupMap {
    session: TypertLookup<Session, SessionId>;
}
```

声明来源包 `@deepseek-ai/dsh-agent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertLookupMap {
    agent: TypertLookup<Agent, SessionId>;
}
```

声明来源包 `@deepseek-ai/dsh-api-workspace-files`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertLookupMap {
    workspaceFileScope: TypertLookup<WorkspaceFileScope, SessionId>;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertLookupProvider 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertLookupProvider`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertLookupProvider<Host = unknown, Wire = unknown> {
    readonly parameter: string;
    readonly wire: string;
    readonly resource?: TypertResourceKindFor<Wire>;
    readonly hostTypeSymbol: string;
    readonly wireTypeSymbol: string;
    resolve(id: Wire): Host | undefined | Promise<Host | undefined>;
}
```

成员检索：`hostTypeSymbol`、`parameter`、`resolve`、`resource`、`wire`、`wireTypeSymbol`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertLookupRegistry 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertLookupRegistry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertLookupRegistry {
    register<K extends StringKeyOf<TypertLookupMap>>(key: K, provider: TypertLookupProvider<TypertLookupHost<TypertLookupMap[K]>, TypertLookupWire<TypertLookupMap[K]>>): TypertDisposer;
    configure<K extends StringKeyOf<TypertLookupMap>>(key: K, resolver: TypertLookupResolver<TypertLookupHost<TypertLookupMap[K]>, TypertLookupWire<TypertLookupMap[K]>>): TypertDisposer;
    get(key: string): TypertLookupProvider | undefined;
    definitions(): readonly TypertLookupDefinition[];
    keys(): readonly string[];
    subscribe(listener: TypertRegistryListener): TypertDisposer;
}
```

成员检索：`configure`、`definitions`、`get`、`keys`、`register`、`subscribe`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertLookupResolver 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertLookupResolver`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertLookupResolver<Host = unknown, Wire = unknown> = (id: Wire) => Host | undefined | Promise<Host | undefined>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertLookupWire 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertLookupWire`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertLookupWire<Lookup> = Lookup extends TypertLookup<infer _Host, infer Wire> ? Wire : never;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertOwnedValue 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertOwnedValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertOwnedValue<Value> extends Disposable {
    readonly [TYPERT_OWNED_VALUE]: true;
    readonly value: Value;
}
```

成员检索：`value`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRegistryChange 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRegistryChange`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertRegistryChange {
    readonly kind: 'local' | 'remote' | 'lookup' | 'host-context' | 'client-context' | 'resource';
    readonly key: string;
}
```

成员检索：`key`、`kind`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRegistryContract 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`TypertRegistryContract`。

目标版本编译声明（省略源码注释与实现体）：

声明来源包 `@deepseek-ai/dsh-typert-protocol`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface TypertRegistryContract {
    readonly local: TypertLocalRegistry;
    readonly remotes: TypertRemoteRegistry;
    readonly lookups: TypertLookupRegistry;
    readonly contexts: TypertContextRegistry;
    readonly resources: TypertResourceRegistry;
}
```

声明来源包 `@deepseek-ai/dsh-typert-registry`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertRegistryContract {
    register(contribution: TypertContribution): TypertDisposer;
    get(key: string): TypertSchemaRecord | undefined;
    resolve(key: string): TypertSchemaRecord;
    list(filter?: TypertSchemaFilter): TypertSchemaRecord[];
    getPackage(packageName: string, face?: TypertFace): TypertPackageRecord | undefined;
    listPackages(filter?: TypertPackageFilter): TypertPackageRecord[];
    toJSONSchema(key: string, params?: z.core.ToJSONSchemaParams): z.core.JSONSchema.BaseSchema;
}
```

成员检索：`contexts`、`local`、`lookups`、`remotes`、`resources`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。
