# @deepseek-ai/dsh-api-remotes ./client：公开对象 3

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-remotes 选型与组合](api-core-dsh-api-remotes-client-overview.md)。

为本应用选定的 Host Remote 能力提供双侧 BFF。Host 入口拥有转发事件名单并向 API Gateway 注册应用事件 source；Client 入口以运行时值形式导入生成的 `/remote` 产物，通过 `ctx.remote.$mount()` 挂载每项贡献，并重新导出对应的声明合并。Client 业务包依赖该外观，而不依赖 Gateway 实现或单独的 Remote 运行时入口。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## CordisInspectProviderManifest 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`CordisInspectProviderManifest`。

公开声明签名：

```text
export interface CordisInspectProviderManifest {
    id: string;
    description: string;
    methods: readonly CordisInspectMethodManifest[];
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## CordisInspectProviderView 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`CordisInspectProviderView`。

公开声明签名：

```text
export interface CordisInspectProviderView extends CordisInspectProviderManifest {
    platform: CordisInspectPlatform;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `description` | `description: string;` | [CordisInspectProviderManifest 权威声明](api-core-dsh-cordis-host-runner-root-2.md#cordisinspectprovidermanifest-公开契约) |
| `methods` | `methods: readonly CordisInspectMethodManifest[];` | [CordisInspectProviderManifest 权威声明](api-core-dsh-cordis-host-runner-root-2.md#cordisinspectprovidermanifest-公开契约) |

## CordisInspectQueryRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`CordisInspectQueryRequest`。

公开声明签名：

```text
export interface CordisInspectQueryRequest {
    requestId: CordisInspectRequestId;
    agentId: SessionId;
    provider: string;
    method: string;
    input?: JsonValue;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## CordisInspectQueryResolution 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`CordisInspectQueryResolution`。

公开声明签名：

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

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## CordisInspectQueryResolved 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`CordisInspectQueryResolved`。

公开声明签名：

```text
export interface CordisInspectQueryResolved {
    requestId: CordisInspectRequestId;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## CordisInspectRequestId 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`CordisInspectRequestId`。

公开声明签名：

```text
export type CordisInspectRequestId = Branded<'CordisInspectRequestId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## CordisInspectResolveAck 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`CordisInspectResolveAck`。

公开声明签名：

```text
export interface CordisInspectResolveAck {
    accepted: boolean;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## CordisRunDiagnostic 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`CordisRunDiagnostic`。

公开声明签名：

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

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
