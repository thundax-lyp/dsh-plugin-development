# @deepseek-ai/dsh-host-directory-picker-native .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-host-directory-picker-native 选型与组合](api-core-dsh-host-directory-picker-native-root-overview.md)。

坐在宿主屏幕前的操作者通过原生 OS 选择器选择工作区目录：`dsh-host-directory-picker-native` 每次选择打开一个平台目录选择器，并解析出所选绝对路径（取消时为 `null`）。macOS 驱动带标准「编辑」菜单的脚本化 AppKit 面板，Linux 使用 Zenity 并以 KDialog 回退，Windows 在 spawn 的子进程中打开现代 `IFileOpenDialog`。只有操作者坐在宿主屏幕前时才可用——远程部署应组合浏览后端。一行组合配置还会在工作区流程中注册匹配的浏览器侧交互，因此同时选择两侧。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## DirectoryPickerInternals 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker-native`；公开符号：`DirectoryPickerInternals`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DirectoryPickerInternals {
    platform?: NodeJS.Platform;
    run?: DirectoryPickerRunner;
    pickWin32Dialog?: (signal: AbortSignal) => Promise<string | null>;
}
```

成员检索：`pickWin32Dialog`、`platform`、`run`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## DirectoryPickerRunner 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker-native`；公开符号：`DirectoryPickerRunner`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type DirectoryPickerRunner = NativeCommandRunner;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## default 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker-native`；公开符号：`default`。

目标版本编译声明（省略源码注释与实现体）：

```text
export default class NativeDirectoryPicker extends DirectoryPicker {
    capability(): DirectoryPickerCapability;
}
```

成员检索：`capability`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## pickNativeDirectory 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker-native`；公开符号：`pickNativeDirectory`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function pickNativeDirectory(signal: AbortSignal, internals?: DirectoryPickerInternals): Promise<string | null>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。
