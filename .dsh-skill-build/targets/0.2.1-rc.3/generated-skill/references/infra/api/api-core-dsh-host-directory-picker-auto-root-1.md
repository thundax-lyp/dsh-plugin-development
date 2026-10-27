# @deepseek-ai/dsh-host-directory-picker-auto .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-host-directory-picker-auto 选型与组合](api-core-dsh-host-directory-picker-auto-root-overview.md)。

`dsh-host-directory-picker-auto` 为每次启动选出正确的目录选择交互：它在启动时一次性判定宿主处境，并把匹配的后端——原生或浏览——连同其 browser 半侧一起，作为真实的 Loader 条目挂进内存根树。判定是一次纯函数的启动时采样：`native` 要求无远程 authority 信任、仅回环绑定、非 SSH 启动与可服务的显示会话；任何含糊情形都判定为处处可用的 `browse`。固定某种交互就是直接组合那个后端。挂载的能力在服务生命周期内保持稳定，符合 seam 的要求。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## BACKEND_PACKAGES 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker-auto`；公开符号：`BACKEND_PACKAGES`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const BACKEND_PACKAGES: Record<DirectoryPickerBackendKind, string>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## DirectoryPickerBackendKind 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker-auto`；公开符号：`DirectoryPickerBackendKind`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type DirectoryPickerBackendKind = 'native' | 'browse';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## DirectoryPickerEnv 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker-auto`；公开符号：`DirectoryPickerEnv`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type DirectoryPickerEnv = Readonly<Partial<Record<'DISPLAY' | 'WAYLAND_DISPLAY', string>>>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## DirectoryPickerHostFacts 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker-auto`；公开符号：`DirectoryPickerHostFacts`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DirectoryPickerHostFacts {
    bindHost: HttpServerConfig['host'];
    allowsRemoteAuthorities: boolean;
    platform: NodeJS.Platform;
    ssh: boolean;
    env: DirectoryPickerEnv;
    linuxChooser: boolean;
}
```

成员检索：`allowsRemoteAuthorities`、`bindHost`、`env`、`linuxChooser`、`platform`、`ssh`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## SURFACE_PACKAGES 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker-auto`；公开符号：`SURFACE_PACKAGES`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const SURFACE_PACKAGES: Record<DirectoryPickerBackendKind, string>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker-auto`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: Context): Promise<void>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## canExecute 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker-auto`；公开符号：`canExecute`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function canExecute(candidate: string): boolean;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## hasLinuxChooserBinary 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker-auto`；公开符号：`hasLinuxChooserBinary`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function hasLinuxChooserBinary(pathValue: string | undefined, isExecutable: (candidate: string) => boolean): boolean;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。
