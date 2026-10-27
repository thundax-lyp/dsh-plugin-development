# @deepseek-ai/dsh-host-open-in-app .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-host-open-in-app 选型与组合](api-core-dsh-host-open-in-app-root-overview.md)。

将 `dsh-host-open-in-app` 与其浏览器配套包一起使用，让用户能在已安装的编辑器、Git GUI、终端或文件管理器中打开 workspace 目录。本包提供固定的应用目录，并只显示主机能够验证的条目；新安装的应用在重启后出现，而检测到启动器缺失时会移除对应条目。请求须通过部署的浏览器认证与主机来源信任检查。检测与启动命令使用可配置的期限，且不会把继承的凭据传给启动的应用。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-host-open-in-app`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    readonly probeTimeoutMs: number;
    readonly iconTimeoutMs: number;
    readonly launchWatchMs: number;
}

export declare const Config: z<Config>;
```

成员检索：`iconTimeoutMs`、`launchWatchMs`、`probeTimeoutMs`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## OPEN_IN_APP_APPS_PATH 公开契约

导入入口：`@deepseek-ai/dsh-host-open-in-app`；公开符号：`OPEN_IN_APP_APPS_PATH`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const OPEN_IN_APP_APPS_PATH = "/open-in-app/apps";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## OPEN_IN_APP_APPS_ROUTE 公开契约

导入入口：`@deepseek-ai/dsh-host-open-in-app`；公开符号：`OPEN_IN_APP_APPS_ROUTE`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const OPEN_IN_APP_APPS_ROUTE: string;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## OPEN_IN_APP_ICON_PREFIX_PATH 公开契约

导入入口：`@deepseek-ai/dsh-host-open-in-app`；公开符号：`OPEN_IN_APP_ICON_PREFIX_PATH`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const OPEN_IN_APP_ICON_PREFIX_PATH = "/open-in-app/icon";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## OPEN_IN_APP_ICON_PREFIX_ROUTE 公开契约

导入入口：`@deepseek-ai/dsh-host-open-in-app`；公开符号：`OPEN_IN_APP_ICON_PREFIX_ROUTE`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const OPEN_IN_APP_ICON_PREFIX_ROUTE: string;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## OPEN_IN_APP_OPEN_PATH 公开契约

导入入口：`@deepseek-ai/dsh-host-open-in-app`；公开符号：`OPEN_IN_APP_OPEN_PATH`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const OPEN_IN_APP_OPEN_PATH = "/open-in-app/open";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## OPEN_IN_APP_OPEN_ROUTE 公开契约

导入入口：`@deepseek-ai/dsh-host-open-in-app`；公开符号：`OPEN_IN_APP_OPEN_ROUTE`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const OPEN_IN_APP_OPEN_ROUTE: string;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## OpenInAppAppsPayload 公开契约

导入入口：`@deepseek-ai/dsh-host-open-in-app`；公开符号：`OpenInAppAppsPayload`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface OpenInAppAppsPayload {
    readonly apps: readonly string[];
}
```

成员检索：`apps`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。
