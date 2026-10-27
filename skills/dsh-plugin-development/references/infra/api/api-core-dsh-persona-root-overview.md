# @deepseek-ai/dsh-persona .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`dsh-persona` 让单个 agent（智能体）拥有自己的人设：preset 挂载这一可组装的行来注册人设前缀与后缀段落，为该会话遮蔽部署级默认值。它还可以把前缀变成该会话的完整系统提示词、抑制所有其他段落，并可为该会话关闭可选运行时上下文。请把它挂在 preset 组装内部——全局挂载会与提示词注册表自身的人设注册相撞并明确报错。没有这一行，preset 能改变 agent 的工具，却永远改不了它的身份。

- [公开对象组 1](api-core-dsh-persona-root-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际) 给出装载和验证顺序。
