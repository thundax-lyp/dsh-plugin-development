# @deepseek-ai/dsh-scope .：公开对象 3

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-scope 选型与组合](api-core-dsh-scope-root-overview.md)。

`dsh-scope` 让插件作者能够为每个 agent 或分组提供隔离的贡献集合与统一生命周期。子作用域继承祖先贡献，且较近的定义优先；祖先作用域可以观察后代活动，这两种关系均不反向成立。释放作用域会移除它拥有的一切。按 agent 或分组隔离必须脱离 agent loop（智能体循环）与 preset 工作时，请使用这个零依赖库。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## scopeTarget 公开契约

保留base原Cordis filter，再允许未标记监听器全局接收；有tag监听器只能匹配dispatch key或其祖先。祖先监听器可观察后代事件，后代监听器不能收到向祖先dispatch的事件。返回carrier不暴露base属性，原subject在payload中传递。

导入入口：`@deepseek-ai/dsh-scope`；公开符号：`scopeTarget`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function scopeTarget<T extends object>(base: T, key: ScopeKey | undefined): Scoped<T>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。
