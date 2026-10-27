# @deepseek-ai/dsh-agent-preset-registry .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

通过声明式 preset 选择 Agent 的工具、提示词和技能。同一进程可以运行多种组合。配置失败会显示在列表中；现有 Agent 保留已经使用的组合。

- [公开对象组 1](api-core-dsh-agent-preset-registry-root-1.md)。
- [公开对象组 2](api-core-dsh-agent-preset-registry-root-2.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际) 给出装载和验证顺序。
