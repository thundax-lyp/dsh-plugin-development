# @deepseek-ai/dsh-agent-preset .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

在普通 Cordis YAML 中定义 Agent 的子插件列表。可同时声明多个 preset，由会话选择。声明会提前加载，修改只影响之后创建的 Agent。

- [公开对象组 1](api-core-dsh-agent-preset-root-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际) 给出装载和验证顺序。
