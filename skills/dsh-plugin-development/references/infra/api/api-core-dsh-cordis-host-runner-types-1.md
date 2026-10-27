# @deepseek-ai/dsh-cordis-host-runner ./types：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-cordis-host-runner 选型与组合](api-core-dsh-cordis-host-runner-types-overview.md)。

`dsh-cordis-host-runner` 提供运行时检查，并为程序调用方和浏览器控件保留进程内动态定义。Host 部分在 `node:vm` 中运行；浏览器部分使用 Client runner 和审批 UI。定义在重启后消失。Agent 通过 `tool-cordis` 发现 API，通过 Plugin Manager 安装持久化 bundle；没有模型工具创建动态定义。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## ApprovalRequestId 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner/types`；公开符号：`ApprovalRequestId`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type ApprovalRequestId = Branded<'ApprovalRequestId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisDynamicPackageId 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner/types`；公开符号：`CordisDynamicPackageId`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type CordisDynamicPackageId = Branded<'CordisDynamicPackageId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisDynamicPluginId 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner/types`；公开符号：`CordisDynamicPluginId`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type CordisDynamicPluginId = Branded<'CordisDynamicPluginId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。

## CordisDynamicPluginRunId 公开契约

导入入口：`@deepseek-ai/dsh-cordis-host-runner/types`；公开符号：`CordisDynamicPluginRunId`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type CordisDynamicPluginRunId = Branded<'CordisDynamicPluginRunId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包)。
