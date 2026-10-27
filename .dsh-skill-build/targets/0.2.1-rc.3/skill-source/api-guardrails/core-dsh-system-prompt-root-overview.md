# @deepseek-ai/dsh-system-prompt .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`dsh-system-prompt` 让 agent 在每个模型步骤收到一份有序系统提示词与可用工具 schema。需要添加提示词段、动态运行时事实、可复用变量或工具 schema，或者控制固定 harness 身份、部署 persona、运行时上下文和面向模型的工具顺序时，请使用本包。agent 作用域的贡献会遮蔽同名全局默认值，而不影响其他 agent。无效的完整提示词组合与未解析变量会使组装失败，不会向模型发送格式错误的提示词。

- [公开对象组 1](api-core-dsh-system-prompt-root-1.md)。
- [公开对象组 2](api-core-dsh-system-prompt-root-2.md)。
- [公开对象组 3](api-core-dsh-system-prompt-root-3.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具) 给出装载和验证顺序。
