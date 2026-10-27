# @deepseek-ai/dsh-typert-protocol .：公开对象 12

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-typert-protocol 选型与组合](api-core-dsh-typert-protocol-root-overview.md)。

借助 `dsh-typert-protocol`，业务包可以向 Remote 客户端暴露 Host 方法：用 `@Remote`（作用域接收者用 `@RemoteScope`）标记方法，把服务绑定到 wire 命名空间，并通过可合并扩展的协议映射把 Host 对象与作用域 Context 关联到 wire identity。生成产物、Host Gateway 与 Client API 消费同一套调用描述符、编解码器与提供方约定。调用持有的值把清理责任交给 Gateway，不另增引用计数。本包不注册任何 Cordis 服务，也不运行 TypeScript 分析。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## isRemoteJsonValue 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`isRemoteJsonValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function isRemoteJsonValue(value: unknown): boolean;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## isRemoteUplinkItem 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`isRemoteUplinkItem`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function isRemoteUplinkItem(value: unknown): boolean;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## isTypertOwnedValue 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`isTypertOwnedValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function isTypertOwnedValue(value: unknown): value is TypertOwnedValue<unknown>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## isTypertRemoteMethod 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`isTypertRemoteMethod`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function isTypertRemoteMethod(descriptor: InvocationDescriptor): descriptor is Method;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## isTypertRemoteSegment 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`isTypertRemoteSegment`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function isTypertRemoteSegment(value: string): boolean;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## principalOf 公开契约

只在Remote invocation存在且principal为非owner时返回该JSON身份；owner或非Remote调用返回undefined。它不解析wire token，不把可持久化principal当凭据；需要记录发起者的领域事实只在返回有值时写字段。

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`principalOf`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function principalOf(invocation: RemoteInvocation | undefined): Principal | undefined;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## remoteErrorOf 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`remoteErrorOf`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function remoteErrorOf(value: unknown): RemoteFailure | undefined;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## remoteMethods 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`remoteMethods`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function remoteMethods(service: object): readonly RemoteMethodMarker[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。
