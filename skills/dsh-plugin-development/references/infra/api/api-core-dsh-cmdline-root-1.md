# @deepseek-ai/dsh-cmdline .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-cmdline 选型与组合](api-core-dsh-cmdline-root-overview.md)。

`dsh-cmdline` 让应用从启动器 flag 之后原样留下的参数中解析自己的 flag、`--help` 与错误。解析值可以覆盖配置默认值，而无需改写配置。应用还可以通过启动器的关停路径请求进程退出。适用于拥有自有命令行界面的应用 bin。它不增加提示词、schema 或模型可见内容。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## AppExit 公开契约

导入入口：`@deepseek-ai/dsh-cmdline`；公开符号：`AppExit`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AppExit {
    (code: number): void;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## AppReady 公开契约

导入入口：`@deepseek-ai/dsh-cmdline`；公开符号：`AppReady`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AppReady {
    onReady(listener: () => void): () => void;
}
```

成员检索：`onReady`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## AppStdin 公开契约

导入入口：`@deepseek-ai/dsh-cmdline`；公开符号：`AppStdin`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AppStdin {
    readonly readableEnded: boolean;
    once(event: 'end', listener: () => void): unknown;
    off(event: 'end', listener: () => void): unknown;
}
```

成员检索：`off`、`once`、`readableEnded`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## CmdlineArgs 公开契约

导入入口：`@deepseek-ai/dsh-cmdline`；公开符号：`CmdlineArgs`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CmdlineArgs {
    get(): readonly string[];
}
```

成员检索：`get`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## CmdlineHost 公开契约

导入入口：`@deepseek-ai/dsh-cmdline`；公开符号：`CmdlineHost`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CmdlineHost {
    args: readonly string[];
    exit: AppExit;
    ready?: AppReady;
}
```

成员检索：`args`、`exit`、`ready`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## exitOnStdinEnd 公开契约

导入入口：`@deepseek-ai/dsh-cmdline`；公开符号：`exitOnStdinEnd`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function exitOnStdinEnd(ctx: Context, label: string): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## parseCmdline 公开契约

导入入口：`@deepseek-ai/dsh-cmdline`；公开符号：`parseCmdline`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function parseCmdline(ctx: Context, program: Command): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
