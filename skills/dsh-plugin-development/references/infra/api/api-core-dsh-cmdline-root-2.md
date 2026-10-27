# @deepseek-ai/dsh-cmdline .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-cmdline 选型与组合](api-core-dsh-cmdline-root-overview.md)。

`dsh-cmdline` 让应用从启动器 flag 之后原样留下的参数中解析自己的 flag、`--help` 与错误。解析值可以覆盖配置默认值，而无需改写配置。应用还可以通过启动器的关停路径请求进程退出。适用于拥有自有命令行界面的应用 bin。它不增加提示词、schema 或模型可见内容。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## provideCmdline 公开契约

导入入口：`@deepseek-ai/dsh-cmdline`；公开符号：`provideCmdline`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function provideCmdline(ctx: Context, host: CmdlineHost): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
