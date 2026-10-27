# @deepseek-ai/dsh-api-session-controller ./client：公开对象 8

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-session-controller 选型与组合](api-core-dsh-api-session-controller-client-overview.md)。

`@deepseek-ai/dsh-api-session-controller` 拥有 Host 的 `ctx.sessionController` 服务，以及生成的 Client `session`、`skills` 和 `fileReferences` Remote namespace。它提供 Session 生命周期与历史、Host generation 模型目录、人工后台任务终止、工作区路径打开、用户可调用 skill（技能）发现和 Agent（智能体）范围的文件引用。当 Client 需要按 Session 寻址的操作时，请通过 API Gateway 使用它。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## UseProjection 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`UseProjection`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type UseProjection = {
    <K extends Extract<keyof SessionProjectionMap, string>>(key: K): SessionProjectionMap[K] | undefined;
    <K extends Extract<keyof SessionProjectionMap, string>, S>(key: K, selector: (value: SessionProjectionMap[K] | undefined) => S, eq?: (a: S, b: S) => boolean): S;
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: Context): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## createScope 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`createScope`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function createScope(ctx: Context, key: SessionId): AgentScopeHandle;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## createSessionControlStream 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`createSessionControlStream`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function createSessionControlStream(remote: SessionRemotes, options: SessionControlStreamOptions): SessionControlStream;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## inject 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const inject: string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## scopeOf 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller/client`；公开符号：`scopeOf`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function scopeOf(ctx: Context): SessionId | undefined;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
