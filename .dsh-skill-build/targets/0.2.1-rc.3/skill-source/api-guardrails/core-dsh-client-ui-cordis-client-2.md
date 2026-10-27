# @deepseek-ai/dsh-client-ui-cordis ./client：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-client-ui-cordis 选型与组合](api-core-dsh-client-ui-cordis-client-overview.md)。

`dsh-client-ui-cordis` 渲染历史生成插件卡片，并为进程内定义提供控制面板。用户可以操作程序消费者提供的定义；重启后持久化卡片仍可读取，但不会重建定义。新建 Creator 插件使用 Plugin Manager。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## CordisDynamicPort 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`CordisDynamicPort`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisDynamicPort {
    stop(sessionId: SessionId, pluginId: CordisDynamicPluginId): Promise<CordisActionResult>;
    remove(sessionId: SessionId, pluginId: CordisDynamicPluginId): Promise<CordisActionResult>;
    inventory(): Promise<readonly DynamicCordisInventoryRow[]>;
}
```

成员检索：`inventory`、`remove`、`stop`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisInventoryRow 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`CordisInventoryRow`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type CordisInventoryRow = DynamicCordisInventoryRow;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisKey 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`CordisKey`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type CordisKey = keyof typeof zh;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisPanelFace 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`CordisPanelFace`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisPanelFace {
    hooks: {
        inventory: CordisInventory;
        activeRuns: HostObservable<ReadonlyMap<CordisDynamicPluginId, CordisRunActivity>>;
        runErrors: HostObservable<ReadonlyMap<CordisDynamicPluginId, CordisRunFailure>>;
        renderFailures: HostObservable<ReadonlyMap<CordisDynamicPluginId, DynamicCordisRenderFailure>>;
        loaded: HostObservable<readonly DynamicCordisLivePackage[]>;
    };
    onApprove(requestId: ApprovalRequestId, approveFutureVersions: boolean): Promise<void>;
    onDecline(requestId: ApprovalRequestId): Promise<void>;
    onRun(request: CordisUserRunRequest): Promise<void>;
    onStop(sessionId: SessionId, pluginId: CordisDynamicPluginId): Promise<CordisActionResult>;
    onRemove(sessionId: SessionId, pluginId: CordisDynamicPluginId): Promise<CordisActionResult>;
    onRefresh(): void;
}
```

成员检索：`hooks`、`onApprove`、`onDecline`、`onRefresh`、`onRemove`、`onRun`、`onStop`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisRunCardFace 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`CordisRunCardFace`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisRunCardFace extends CordisCardFace {
    hooks: CordisCardFace['hooks'] & {
        runCards: CordisRunCardStore;
        activeRuns: HostObservable<ReadonlyMap<CordisDynamicPluginId, CordisRunActivity>>;
    };
    onObserveRunCard(pointer: CordisRunCardPointer): void;
}
```

成员检索：`hooks`、`onObserveRunCard`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisRunCardPointer 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`CordisRunCardPointer`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisRunCardPointer {
    readonly key: CordisToolViewKey;
    readonly callId: string;
    readonly seq: number;
    readonly pluginRunId: CordisDynamicPluginRunId;
}
```

成员检索：`callId`、`key`、`pluginRunId`、`seq`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisRunCardStore 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`CordisRunCardStore`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisRunCardStore extends HostObservable<ReadonlyMap<CordisToolViewKey, CordisRunCardPointer>> {
    observe(pointer: CordisRunCardPointer): void;
}
```

成员检索：`observe`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisRunRowProps 公开契约

导入入口：`@deepseek-ai/dsh-client-ui-cordis/client`；公开符号：`CordisRunRowProps`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type CordisRunRowProps = ToolCallViewProps & InjectFace<CordisRunCardFace> & PropsRenderSlots<'tool.view.cordis'> & PropsLocale<'cordis'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。
