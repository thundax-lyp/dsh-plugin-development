# @deepseek-ai/dsh-host-directory-picker .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-host-directory-picker 选型与组合](api-core-dsh-host-directory-picker-root-overview.md)。

web GUI 让操作者通过 OS 选择器或应用内浏览器选择工作区目录。操作者能接触宿主屏幕时使用原生选项；远程客户端或需要在应用内列举和创建目录时使用浏览选项。消费方会获得交互类型，并能呈现匹配的工作流。目录选择仅限 GUI 宿主，不会影响 agent loop（智能体循环）。浏览工作流一次只公开一棵目录树；不支持多根目录。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## DirectoryPickerNativeCapability 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker`；公开符号：`DirectoryPickerNativeCapability`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DirectoryPickerNativeCapability {
    kind: 'native';
    pick(signal: AbortSignal): Promise<string | null>;
}
```

成员检索：`kind`、`pick`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。
