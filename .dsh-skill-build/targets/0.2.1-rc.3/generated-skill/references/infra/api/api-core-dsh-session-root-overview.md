# @deepseek-ai/dsh-session .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`dsh-session` 在仅追加的会话日志中记录每个模型可见事实，并从该记录派生模型历史。消费方可以检查、回放、fork 和刷新会话，同时保留历史事件；压缩（compaction）会在活跃对话中隐藏被取代的条目，但不会删除它们。除非添加持久化后端，否则会话仅保留在内存中；持久性检查点会等待配置的后端。agent 需要可重建的会话记录时请选择本包；它本身不调用模型。

- [公开对象组 1](api-core-dsh-session-root-1.md)。
- [公开对象组 2](api-core-dsh-session-root-2.md)。
- [公开对象组 3](api-core-dsh-session-root-3.md)。
- [公开对象组 4](api-core-dsh-session-root-4.md)。
- [公开对象组 5](api-core-dsh-session-root-5.md)。
- [公开对象组 6](api-core-dsh-session-root-6.md)。
- [公开对象组 7](api-core-dsh-session-root-7.md)。
- [公开对象组 8](api-core-dsh-session-root-8.md)。
- [公开对象组 9](api-core-dsh-session-root-9.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实) 给出装载和验证顺序。
