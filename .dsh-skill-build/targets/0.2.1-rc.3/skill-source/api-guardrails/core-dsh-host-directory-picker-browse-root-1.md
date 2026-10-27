# @deepseek-ai/dsh-host-directory-picker-browse .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-host-directory-picker-browse 选型与组合](api-core-dsh-host-directory-picker-browse-root-overview.md)。

无法触达 OS 选择器的用户仍能通过 `dsh-host-directory-picker-browse` 选择工作区目录：它基于 Node 标准库提供单层目录列举与子目录创建，宿主屏幕上不渲染任何东西——因此它能服务原生后端无法触及的远程客户端。列举只返回目录、按名称排序，跟随指向目录的符号链接，并携带宿主判定的 `hidden` 标志；创建不递归，且把名称校验为单个路径段。一行组合配置还会用应用内**选择工作区目录**对话框填满工作区流程的目录扩展位。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker-browse`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    maxEntries: number;
}
```

成员检索：`maxEntries`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## default 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker-browse`；公开符号：`default`。

目标版本编译声明（省略源码注释与实现体）：

```text
export default class BrowseDirectoryPicker extends DirectoryPicker {
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    capability(): DirectoryPickerCapability;
}
```

成员检索：`capability`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。
