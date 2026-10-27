# @deepseek-ai/dsh-agent-default-model .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-agent-default-model 选型与组合](api-core-dsh-agent-default-model-root-overview.md)。

为会话未指定模型的新 agent 提供共享默认 provider 和模型。Provider、模型和推理强度都是即时 Config 字段。保存的选择更新当前 profile patch，并用于后续读取；会话级选择仍由入口负责。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## AgentDefaultModelConfig 公开契约

导入入口：`@deepseek-ai/dsh-agent-default-model`；公开符号：`AgentDefaultModelConfig`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class AgentDefaultModelConfig extends Service {
    static Config: z<Schemastery.ObjectS<NoInfer<{
        provider: z<string, string, "volatile-defined">;
        model: z<string, string, "volatile-defined">;
        reasoningEffort: z<string, string, "volatile">;
    }>>, Schemastery.ObjectT<NoInfer<{
        provider: z<string, string, "volatile-defined">;
        model: z<string, string, "volatile-defined">;
        reasoningEffort: z<string, string, "volatile">;
    }>>, "plain">;
    constructor(ownerContext: Context, config: Config);
    currentSelection(): ModelSelection;
    saveSelection(next: ModelSelection): Promise<void>;
}
```

成员检索：`currentSelection`、`saveSelection`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-agent-default-model`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    provider: Volatile<string>;
    model: Volatile<string>;
    reasoningEffort: Volatile<string | undefined>;
}
```

成员检索：`model`、`provider`、`reasoningEffort`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。
