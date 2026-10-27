# @deepseek-ai/dsh-persona .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-persona 选型与组合](api-core-dsh-persona-root-overview.md)。

`dsh-persona` 让单个 agent（智能体）拥有自己的人设：preset 挂载这一可组装的行来注册人设前缀与后缀段落，为该会话遮蔽部署级默认值。它还可以把前缀变成该会话的完整系统提示词、抑制所有其他段落，并可为该会话关闭可选运行时上下文。请把它挂在 preset 组装内部——全局挂载会与提示词注册表自身的人设注册相撞并明确报错。没有这一行，preset 能改变 agent 的工具，却永远改不了它的身份。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-persona`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    prefix: string;
    suffix?: string;
    complete?: boolean;
    includeRuntimeContext?: boolean;
}

export declare const Config: z<Config>;
```

成员检索：`complete`、`includeRuntimeContext`、`prefix`、`suffix`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。

## PERSONA_PREFIX_SECTION 公开契约

导入入口：`@deepseek-ai/dsh-persona`；公开符号：`PERSONA_PREFIX_SECTION`。

公开声明签名：

```text
export declare const PERSONA_PREFIX_SECTION = "deployment:persona-prefix";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。

## PERSONA_SUFFIX_SECTION 公开契约

导入入口：`@deepseek-ai/dsh-persona`；公开符号：`PERSONA_SUFFIX_SECTION`。

公开声明签名：

```text
export declare const PERSONA_SUFFIX_SECTION = "deployment:persona-suffix";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-persona`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: Context, config: Config): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。

## inject 公开契约

导入入口：`@deepseek-ai/dsh-persona`；公开符号：`inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const inject: string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。

## name 公开契约

导入入口：`@deepseek-ai/dsh-persona`；公开符号：`name`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const name = "persona";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。
