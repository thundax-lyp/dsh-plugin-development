# @deepseek-ai/dsh-typert-registry .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-typert-registry 选型与组合](api-core-dsh-typert-registry-root-overview.md)。

`dsh-typert-registry` 让生成的 Typert 产物在运行时可按需查询：每个包的反射、惰性 Zod schema factory 与 Remote 调用描述符都保存在稳定键下。消费方首次请求 schema 时才会物化并缓存它。注册是原子且按 fiber 作用域的：贡献要么整体落地要么完全不落地，并在注册组件卸载时自动撤销。同一服务还托管 Remote 调用所经由的 lookup 与作用域 Context 提供方注册表。它不执行 TypeScript 分析，也不生成 schema；这些由生成器与 loader 负责。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## TypertContribution 公开契约

一份具有package与face身份的生成贡献，包含schema、model与invocations。由构建器生成并随包发布；运行期registry只登记已有数据，不运行TypeScript分析或从函数.toString恢复类型。不能手写弱codec假装通过严格生成。

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`TypertContribution`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertContribution {
    readonly package: string;
    readonly face: TypertFace;
    readonly schemas: readonly TypertSchemaFactory[];
    readonly model: TypertPackageModel;
    readonly invocations: readonly InvocationDescriptor[];
}
```

成员检索：`face`、`invocations`、`model`、`package`、`schemas`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertDocTag 公开契约

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`TypertDocTag`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertDocTag {
    readonly name: string;
    readonly argument?: string;
    readonly comment?: string;
    readonly text: string;
}
```

成员检索：`argument`、`comment`、`name`、`text`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertDocumentation 公开契约

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`TypertDocumentation`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertDocumentation {
    readonly description?: string;
    readonly summary?: string;
    readonly tags: readonly TypertDocTag[];
    readonly jsDoc?: string;
}
```

成员检索：`description`、`jsDoc`、`summary`、`tags`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertEventModel 公开契约

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`TypertEventModel`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertEventModel extends TypertDocumentation {
    readonly name: string;
    readonly mode?: string;
    readonly signature: string;
}
```

成员检索：`description`、`jsDoc`、`mode`、`name`、`signature`、`summary`、`tags`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertFace 公开契约

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`TypertFace`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TypertFace = 'host' | 'client';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertMemberModel 公开契约

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`TypertMemberModel`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertMemberModel {
    readonly kind: 'property' | 'method' | 'getter' | 'setter' | 'call' | 'construct' | 'index';
    readonly name: string;
    readonly signature: string;
    readonly summary?: string;
    readonly jsDoc?: string;
}
```

成员检索：`jsDoc`、`kind`、`name`、`signature`、`summary`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertObjectModel 公开契约

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`TypertObjectModel`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertObjectModel extends TypertDocumentation {
    readonly name: string;
    readonly exportName: string;
    readonly members: readonly TypertMemberModel[];
    readonly types: readonly TypertTypeModel[];
}
```

成员检索：`description`、`exportName`、`jsDoc`、`members`、`name`、`summary`、`tags`、`types`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## TypertPackageFilter 公开契约

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`TypertPackageFilter`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TypertPackageFilter {
    readonly package?: string;
    readonly face?: TypertFace;
}
```

成员检索：`face`、`package`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。
