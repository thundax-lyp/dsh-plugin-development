# @deepseek-ai/dsh-cordis-host-runner .：公开对象 3

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-cordis-host-runner 选型与组合](api-core-dsh-cordis-host-runner-root-overview.md)。

`dsh-cordis-host-runner` 提供运行时检查，并为程序调用方和浏览器控件保留进程内动态定义。Host 部分在 `node:vm` 中运行；浏览器部分使用 Client runner 和审批 UI。定义在重启后消失。Agent 通过 `tool-cordis` 发现 API，通过 Plugin Manager 安装持久化 bundle；没有模型工具创建动态定义。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## CordisInspectRequestId 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`CordisInspectRequestId`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type CordisInspectRequestId = Branded<'CordisInspectRequestId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisInspectResolveAck 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`CordisInspectResolveAck`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisInspectResolveAck {
    accepted: boolean;
}
```

成员检索：`accepted`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisRunDiagnostic 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`CordisRunDiagnostic`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisRunDiagnostic {
    phase: 'approval' | 'host-load' | 'host-apply' | 'client-load' | 'client-apply' | 'client-render';
    message: string;
    stack?: string;
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    pluginRunId: CordisDynamicPluginRunId;
}
```

成员检索：`message`、`packageId`、`phase`、`pluginId`、`pluginRunId`、`stack`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisRunStatus 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`CordisRunStatus`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type CordisRunStatus = 'awaiting-approval' | 'starting-host' | 'client-pending' | 'running' | 'waiting' | 'rejected' | 'failed' | 'cancelled' | 'stopped';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisClientSource 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisClientSource`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisClientSource {
    code: string;
    name: string;
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    pluginRunId: CordisDynamicPluginRunId;
}
```

成员检索：`code`、`name`、`packageId`、`pluginId`、`pluginRunId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisDefineReceipt 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisDefineReceipt`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisDefineReceipt {
    pluginId: CordisDynamicPluginId;
    packageId: CordisDynamicPackageId;
    name: string;
    purpose: string;
    hasHostHalf: boolean;
    hasClientHalf: boolean;
}
```

成员检索：`hasClientHalf`、`hasHostHalf`、`name`、`packageId`、`pluginId`、`purpose`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisDefineRequest 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisDefineRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisDefineRequest {
    sessionId: SessionId;
    plugin: {
        kind: 'new';
        idPrefix: string;
    } | {
        kind: 'existing';
        pluginId: CordisDynamicPluginId;
    };
    name: string;
    purpose: string;
    code: {
        host?: string;
        client?: string;
    };
}
```

成员检索：`code`、`name`、`plugin`、`purpose`、`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## DynamicCordisDefinition 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`DynamicCordisDefinition`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DynamicCordisDefinition {
    packageId: CordisDynamicPackageId;
    name: string;
    purpose: string;
    hostCode?: string;
    clientCode?: string;
}
```

成员检索：`clientCode`、`hostCode`、`name`、`packageId`、`purpose`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。
