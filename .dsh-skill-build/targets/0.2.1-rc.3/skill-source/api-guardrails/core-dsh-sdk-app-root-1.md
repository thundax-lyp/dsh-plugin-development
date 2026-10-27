# @deepseek-ai/dsh-sdk-app .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-sdk-app 选型与组合](api-core-dsh-sdk-app-root-overview.md)。

以 `dsh-base` 为基础的 SDK stdio 应用 `dsh` profile 组合包。它继承 base 默认禁用模块 HMR（热模块替换）的策略；其 patch 挂载应用自有的零选项命令提供方，并且只在该提供方接受调用后启动 `dsh-sdk-jsonrpc-server`。因此，`dsh --profile sdk --help` 会写出 help 并退出，不会占用 stdin 或 stdout。独立的 `sdk-minimal` bundle 复用同一个启动提供方，并提供自己的 profile 名称。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-sdk-app`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    profile?: string;
}

export declare const Config: z<Config>;
```

成员检索：`profile`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## SDK_APP_STARTUP_SERVICE 公开契约

导入入口：`@deepseek-ai/dsh-sdk-app`；公开符号：`SDK_APP_STARTUP_SERVICE`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const SDK_APP_STARTUP_SERVICE = "sdkAppStartup";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-sdk-app`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: Context, config?: Config): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## inject 公开契约

导入入口：`@deepseek-ai/dsh-sdk-app`；公开符号：`inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const inject: string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## name 公开契约

导入入口：`@deepseek-ai/dsh-sdk-app`；公开符号：`name`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const name = "sdk-app-startup";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。
