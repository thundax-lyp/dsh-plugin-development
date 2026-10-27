# @deepseek-ai/dsh-agent .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

使用 `dsh-agent` 创建或恢复实时 agent（智能体）、发送后续或 steering（中途引导）输入、注入面向模型的上下文、取消工作，并等待 agent 进入空闲状态。插件、UI、钩子与编排器还可以观察或拦截 agent 活动，并仅为一个 agent 应用能力而不影响其他 agent。当代码需要通过公开 `Agent` API 控制或扩展实时 agent 时，请选择本包。请将它与 `dsh-agent-loop` 等 agent 驱动器配合使用；本包本身不会创建模型请求。发起方归因仅存在于进程内，跨 worker、进程、持久队列与重启时必须显式传递。

- [公开对象组 1](api-core-dsh-agent-root-1.md)。
- [公开对象组 2](api-core-dsh-agent-root-2.md)。
- [公开对象组 3](api-core-dsh-agent-root-3.md)。
- [公开对象组 4](api-core-dsh-agent-root-4.md)。
- [公开对象组 5](api-core-dsh-agent-root-5.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实) 给出装载和验证顺序。
