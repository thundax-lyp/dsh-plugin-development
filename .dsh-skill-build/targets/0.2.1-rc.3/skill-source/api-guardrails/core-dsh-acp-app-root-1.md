# @deepseek-ai/dsh-acp-app .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-acp-app 选型与组合](api-core-dsh-acp-app-root-overview.md)。

以 `dsh-base` 为基础的纯自动化 ACP stdio 应用 `dsh` profile 组合包。它继承 base 禁用模块 HMR（热模块替换）的策略；其 patch 设置 coding agent（编程智能体）persona 与默认模型路由、挂载应用自有的零选项命令提供方，并且只在该提供方接受调用后启动 `dsh-acp`。因此，`dsh --profile acp --help` 会写出 help 并退出，不会占用 stdin 或 stdout。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## ACP_APP_STARTUP_SERVICE 公开契约

导入入口：`@deepseek-ai/dsh-acp-app`；公开符号：`ACP_APP_STARTUP_SERVICE`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const ACP_APP_STARTUP_SERVICE = "acpAppStartup";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-acp-app`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: Context): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## inject 公开契约

导入入口：`@deepseek-ai/dsh-acp-app`；公开符号：`inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const inject: string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## name 公开契约

导入入口：`@deepseek-ai/dsh-acp-app`；公开符号：`name`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const name = "acp-app-startup";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
