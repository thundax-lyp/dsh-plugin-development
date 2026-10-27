# @deepseek-ai/dsh-scope .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`dsh-scope` 让插件作者能够为每个 agent 或分组提供隔离的贡献集合与统一生命周期。子作用域继承祖先贡献，且较近的定义优先；祖先作用域可以观察后代活动，这两种关系均不反向成立。释放作用域会移除它拥有的一切。按 agent 或分组隔离必须脱离 agent loop（智能体循环）与 preset 工作时，请使用这个零依赖库。

- [公开对象组 1](api-core-dsh-scope-root-1.md)。
- [公开对象组 2](api-core-dsh-scope-root-2.md)。
- [公开对象组 3](api-core-dsh-scope-root-3.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实) 给出装载和验证顺序。
