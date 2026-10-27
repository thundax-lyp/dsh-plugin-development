# @deepseek-ai/dsh-typert-registry .：公开对象 3

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-typert-registry 选型与组合](api-core-dsh-typert-registry-root-overview.md)。

`dsh-typert-registry` 让生成的 Typert 产物在运行时可按需查询：每个包的反射、惰性 Zod schema factory 与 Remote 调用描述符都保存在稳定键下。消费方首次请求 schema 时才会物化并缓存它。注册是原子且按 fiber 作用域的：贡献要么整体落地要么完全不落地，并在注册组件卸载时自动撤销。同一服务还托管 Remote 调用所经由的 lookup 与作用域 Context 提供方注册表。它不执行 TypeScript 分析，也不生成 schema；这些由生成器与 loader 负责。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## typertEndpoint 公开契约

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`typertEndpoint`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function typertEndpoint(descriptor: Pick<InvocationDescriptor, 'namespace' | 'method'>): string;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## typertKey 公开契约

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`typertKey`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function typertKey(packageName: string, name: string): string;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## typertPackageKey 公开契约

导入入口：`@deepseek-ai/dsh-typert-registry`；公开符号：`typertPackageKey`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function typertPackageKey(packageName: string, face: TypertFace): string;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。
