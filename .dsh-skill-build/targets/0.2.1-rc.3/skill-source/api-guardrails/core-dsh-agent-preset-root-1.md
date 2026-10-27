# @deepseek-ai/dsh-agent-preset .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-agent-preset 选型与组合](api-core-dsh-agent-preset-root-overview.md)。

在普通 Cordis YAML 中定义 Agent 的子插件列表。可同时声明多个 preset，由会话选择。声明会提前加载，修改只影响之后创建的 Agent。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-agent-preset`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type Config = PresetDefinition;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。

## default 公开契约

导入入口：`@deepseek-ai/dsh-agent-preset`；公开符号：`default`。

目标版本编译声明（省略源码注释与实现体）：

```text
export default class AgentPreset {
    static inject: string[];
    static readonly [EntryGroup.key] = true;
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    [Service.init](): AsyncGenerator<() => Promise<void>, void, unknown>;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。
