# @deepseek-ai/dsh-cordis-host-runner .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-cordis-host-runner 选型与组合](api-core-dsh-cordis-host-runner-root-overview.md)。

`dsh-cordis-host-runner` 提供运行时检查，并为程序调用方和浏览器控件保留进程内动态定义。Host 部分在 `node:vm` 中运行；浏览器部分使用 Client runner 和审批 UI。定义在重启后消失。Agent 通过 `tool-cordis` 发现 API，通过 Plugin Manager 安装持久化 bundle；没有模型工具创建动态定义。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## CordisInspectMethodManifest 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`CordisInspectMethodManifest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisInspectMethodManifest {
    name: string;
    description: string;
    inputSchema: JsonValue;
    outputSchema: JsonValue;
}
```

成员检索：`description`、`inputSchema`、`name`、`outputSchema`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisInspectPlatform 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`CordisInspectPlatform`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type CordisInspectPlatform = 'host' | 'client';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisInspectProviderManifest 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`CordisInspectProviderManifest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisInspectProviderManifest {
    id: string;
    description: string;
    methods: readonly CordisInspectMethodManifest[];
}
```

成员检索：`description`、`id`、`methods`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisInspectProviderView 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`CordisInspectProviderView`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisInspectProviderView extends CordisInspectProviderManifest {
    platform: CordisInspectPlatform;
}
```

成员检索：`description`、`id`、`methods`、`platform`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisInspectQueryRequest 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`CordisInspectQueryRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisInspectQueryRequest {
    requestId: CordisInspectRequestId;
    agentId: SessionId;
    provider: string;
    method: string;
    input?: JsonValue;
}
```

成员检索：`agentId`、`input`、`method`、`provider`、`requestId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisInspectQueryResolution 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`CordisInspectQueryResolution`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type CordisInspectQueryResolution = {
    ok: true;
    data: JsonValue;
} | {
    ok: false;
    reason: 'provider-missing' | 'method-missing' | 'invalid-input' | 'provider-error' | 'cancelled';
    message: string;
};
```

成员检索：`ok`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisInspectQueryResolved 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`CordisInspectQueryResolved`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CordisInspectQueryResolved {
    requestId: CordisInspectRequestId;
}
```

成员检索：`requestId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisInspectRegistryService 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner`；公开符号：`CordisInspectRegistryService`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class CordisInspectRegistryService extends Service {
    constructor(ctx: Context, clientQueryTimeoutMs: number);
    register(registration: HostCordisInspectProviderRegistration): () => void;
    syncClientManifest(providers: readonly CordisInspectProviderManifest[]): void;
    list(): CordisInspectProviderView[];
    query(platform: CordisInspectPlatform, providerId: string, methodName: string, input: JsonValue | undefined, agent: Agent, signal: AbortSignal): Promise<JsonValue>;
    resolveClientQuery(agent: Agent, requestId: CordisInspectRequestId, resolution: CordisInspectQueryResolution): CordisInspectResolveAck;
}
```

成员检索：`list`、`query`、`register`、`resolveClientQuery`、`syncClientManifest`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。
