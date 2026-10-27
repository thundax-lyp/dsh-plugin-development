# @deepseek-ai/dsh-typert-registry .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-typert-registry 选型与组合](api-core-dsh-typert-registry-root-overview.md)。

`dsh-typert-registry` 让生成的 Typert 产物在运行时可按需查询：每个包的反射、惰性 Zod schema factory 与 Remote 调用描述符都保存在稳定键下。消费方首次请求 schema 时才会物化并缓存它。注册是原子且按 fiber 作用域的：贡献要么整体落地要么完全不落地，并在注册组件卸载时自动撤销。同一服务还托管 Remote 调用所经由的 lookup 与作用域 Context 提供方注册表。它不执行 TypeScript 分析，也不生成 schema；这些由生成器与 loader 负责。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## TypertPackageModel 公开契约

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`TypertPackageModel`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertPackageModel {
    readonly services: readonly TypertServiceModel[];
    readonly events: readonly TypertEventModel[];
    readonly objects: readonly TypertObjectModel[];
}
```

成员检索：`events`、`objects`、`services`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertPackageRecord 公开契约

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`TypertPackageRecord`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertPackageRecord {
    readonly package: string;
    readonly face: TypertFace;
    readonly key: string;
    readonly model: TypertPackageModel;
}
```

成员检索：`face`、`key`、`model`、`package`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertRegistry 公开契约

现成生成贡献的进程内索引，注册归调用fiber；Host local descriptor使Gateway获得严格codec，卸载后记录definition-unavailable，不能悄悄退回宽松源码猜测。Client装配也消费生成contribution；读取metadata不会激活Host Service或发网络。

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`TypertRegistry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class TypertRegistry extends Service implements TypertRegistryContract {
    constructor(ctx: Context);
    get local(): TypertLocalRegistry;
    get remotes(): TypertRemoteRegistry;
    get lookups(): TypertLookupRegistry;
    get contexts(): TypertContextRegistry;
    get resources(): TypertResourceRegistry;
    register(contribution: TypertContribution): TypertDisposer;
    get(key: string): TypertSchemaRecord | undefined;
    resolve(key: string): TypertSchemaRecord;
    list(filter?: TypertSchemaFilter): TypertSchemaRecord[];
    getPackage(packageName: string, face?: TypertFace): TypertPackageRecord | undefined;
    listPackages(filter?: TypertPackageFilter): TypertPackageRecord[];
    toJSONSchema(key: string, params?: z.core.ToJSONSchemaParams): z.core.JSONSchema.BaseSchema;
}
```

成员检索：`contexts`、`get`、`getPackage`、`list`、`listPackages`、`local`、`lookups`、`register`、`remotes`、`resolve`、`resources`、`toJSONSchema`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertSchemaFactory 公开契约

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`TypertSchemaFactory`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertSchemaFactory {
    readonly name: string;
    readonly create: () => z.ZodType;
}
```

成员检索：`create`、`name`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertSchemaFilter 公开契约

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`TypertSchemaFilter`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertSchemaFilter {
    readonly package?: string;
    readonly face?: TypertFace;
}
```

成员检索：`face`、`package`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertSchemaRecord 公开契约

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`TypertSchemaRecord`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertSchemaRecord {
    readonly name: string;
    readonly schema: z.ZodType;
    readonly package: string;
    readonly face: TypertFace;
    readonly key: string;
}
```

成员检索：`face`、`key`、`name`、`package`、`schema`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertServiceModel 公开契约

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`TypertServiceModel`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertServiceModel extends TypertDocumentation {
    readonly key: string;
    readonly exportName: string;
    readonly members: readonly TypertMemberModel[];
    readonly types: readonly TypertTypeModel[];
}
```

成员检索：`description`、`exportName`、`jsDoc`、`key`、`members`、`summary`、`tags`、`types`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertTypeModel 公开契约

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`TypertTypeModel`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertTypeModel {
    readonly name: string;
    readonly declaration: string;
}
```

成员检索：`declaration`、`name`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。
