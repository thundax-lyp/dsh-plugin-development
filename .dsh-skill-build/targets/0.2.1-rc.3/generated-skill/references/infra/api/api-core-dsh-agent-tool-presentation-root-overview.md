# @deepseek-ai/dsh-agent-tool-presentation .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

在 agent preset 中使用 `dsh-agent-tool-presentation`，可固定模型看到全部原生工具 schema，还是只有带生成 SDK 的 `run_code`。每个 preset 可独立选择，因此 native 与 PTC agent 可以共享同一进程，而不共享工具目录。选择 `ptc` 需要兼容的 PTC 运行时；没有该运行时的部署会在挂载时拒绝 preset，不会等到收到第一条提示词。使用本包时 `mode` 字段为必填；省略本包则沿用部署默认值。

- [公开对象组 1](api-core-dsh-agent-tool-presentation-root-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实) 给出装载和验证顺序。
