# @deepseek-ai/dsh-client-ui-cordis ./client：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-client-ui-cordis 选型与组合](api-core-dsh-client-ui-cordis-client-overview.md)。

`dsh-client-ui-cordis` 渲染历史生成插件卡片，并为进程内定义提供控制面板。用户可以操作程序消费者提供的定义；重启后持久化卡片仍可读取，但不会重建定义。新建 Creator 插件使用 Plugin Manager。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## ApprovalRequestId 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`ApprovalRequestId`。

公开声明签名：

```text
export type ApprovalRequestId = Branded<'ApprovalRequestId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisActionResult 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`CordisActionResult`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type CordisActionResult = {
    readonly ok: true;
} | {
    readonly ok: false;
    readonly message: string;
};
```

成员检索：`ok`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisActionRowProps 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`CordisActionRowProps`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type CordisActionRowProps = ToolCallViewProps & PropsLocale<'cordis'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisCardFace 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`CordisCardFace`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisCardFace {
    hooks: {
        inventory: CordisInventory;
        loaded: HostObservable<readonly DynamicCordisLivePackage[]>;
    };
}
```

成员检索：`hooks`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisDefineRowProps 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`CordisDefineRowProps`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type CordisDefineRowProps = ToolCallViewProps & InjectFace<CordisCardFace> & PropsLocale<'cordis'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisDynamicPackageId 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`CordisDynamicPackageId`。

公开声明签名：

```text
export type CordisDynamicPackageId = Branded<'CordisDynamicPackageId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisDynamicPluginId 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`CordisDynamicPluginId`。

公开声明签名：

```text
export type CordisDynamicPluginId = Branded<'CordisDynamicPluginId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisDynamicPluginRunId 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`CordisDynamicPluginRunId`。

公开声明签名：

```text
export type CordisDynamicPluginRunId = Branded<'CordisDynamicPluginRunId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。
