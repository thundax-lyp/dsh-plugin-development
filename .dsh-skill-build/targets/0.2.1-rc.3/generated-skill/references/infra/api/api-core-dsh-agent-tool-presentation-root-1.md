# @deepseek-ai/dsh-agent-tool-presentation .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-agent-tool-presentation 选型与组合](api-core-dsh-agent-tool-presentation-root-overview.md)。

在 agent preset 中使用 `dsh-agent-tool-presentation`，可固定模型看到全部原生工具 schema，还是只有带生成 SDK 的 `run_code`。每个 preset 可独立选择，因此 native 与 PTC agent 可以共享同一进程，而不共享工具目录。选择 `ptc` 需要兼容的 PTC 运行时；没有该运行时的部署会在挂载时拒绝 preset，不会等到收到第一条提示词。使用本包时 `mode` 字段为必填；省略本包则沿用部署默认值。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-agent-tool-presentation`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    mode: ToolPresentationMode;
}

export declare const Config: z<Config>;
```

成员检索：`mode`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-agent-tool-presentation`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: Context, config: Config): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## inject 公开契约

导入入口：`@deepseek-ai/dsh-agent-tool-presentation`；公开符号：`inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const inject: string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## name 公开契约

导入入口：`@deepseek-ai/dsh-agent-tool-presentation`；公开符号：`name`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const name = "tool-presentation";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。
