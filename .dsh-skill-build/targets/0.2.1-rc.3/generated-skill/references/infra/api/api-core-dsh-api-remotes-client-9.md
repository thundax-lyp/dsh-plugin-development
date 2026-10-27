# @deepseek-ai/dsh-api-remotes ./client：公开对象 9

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-remotes 选型与组合](api-core-dsh-api-remotes-client-overview.md)。

为本应用选定的 Host Remote 能力提供双侧 BFF。Host 入口拥有转发事件名单并向 API Gateway 注册应用事件 source；Client 入口以运行时值形式导入生成的 `/remote` 产物，通过 `ctx.remote.$mount()` 挂载每项贡献，并重新导出对应的声明合并。Client 业务包依赖该外观，而不依赖 Gateway 实现或单独的 Remote 运行时入口。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## PluginInfo 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`PluginInfo`。

公开声明签名：

```text
export type PluginInfo = PluginInventoryEntry & ({
    patchId: string;
    readOnlyReason?: never;
} | {
    patchId?: never;
    readOnlyReason: ReadOnlyReason;
});
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PluginInspectProblem 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`PluginInspectProblem`。

公开声明签名：

```text
export type PluginInspectProblem = 'invalid-spec' | 'already-installed' | 'not-found' | 'not-a-package' | 'not-a-bundle' | 'network' | 'unknown';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PluginInstallCancellation 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`PluginInstallCancellation`。

公开声明签名：

```text
export interface PluginInstallCancellation {
    readonly status: 'cancelled' | 'too-late' | 'not-running';
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PluginInstallFailureKind 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`PluginInstallFailureKind`。

公开声明签名：

```text
export type PluginInstallFailureKind = 'pnpm-missing' | 'timeout' | 'not-found' | 'no-matching-version' | 'network' | 'disk-full' | 'permission' | 'build-blocked' | 'integrity' | 'unknown';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PluginInstallLogChunk 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`PluginInstallLogChunk`。

公开声明签名：

```text
export interface PluginInstallLogChunk {
    readonly requestId?: PluginInstallRequestId;
    readonly jobId: string;
    readonly argv: readonly string[];
    readonly cwd: string;
    readonly stream: 'stdout' | 'stderr';
    readonly text: string;
    readonly exitCode?: number | null;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PluginInstallProgress 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`PluginInstallProgress`。

公开声明签名：

```text
export interface PluginInstallProgress {
    readonly requestId: PluginInstallRequestId;
    readonly phase: 'installing' | 'cancelling' | 'applying';
    readonly attempt?: {
        readonly registry: Registry;
        readonly index: number;
        readonly total: number;
    };
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PluginInstallRequestId 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`PluginInstallRequestId`。

公开声明签名：

```text
export type PluginInstallRequestId = Branded<'PluginInstallRequestId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## PluginInventorySnapshot 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`PluginInventorySnapshot`。

公开声明签名：

```text
export interface PluginInventorySnapshot {
    readonly managementAvailable?: boolean;
    readonly entries: readonly PluginInventoryEntry[];
    readonly agentPresets?: readonly AgentPresetPluginGroup[];
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
