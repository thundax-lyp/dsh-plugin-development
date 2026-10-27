# @deepseek-ai/dsh-agent-loop .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`dsh-agent-loop` 创建全新 agent 或恢复持久化会话，随后通过模型请求、流式响应、工具执行和持久会话历史驱动每个轮次。标准 agent 组合应挂载本包；声明式条目会在启动时启动 agent，公开的 `ctx.agents` API 则支持以编程方式创建和恢复 agent。`maxParallelToolCalls` 限制同时运行的并行安全调用数量，独占调用保留顺序。取消会保留已经流式交付给用户的文本。只有标准的「调用模型、运行工具、重复」生命周期无法满足需求时，才应选择自定义 `Agent` 实现。

- [公开对象组 1](api-core-dsh-agent-loop-root-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实) 给出装载和验证顺序。
