# @deepseek-ai/dsh-agent-default-model .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

为会话未指定模型的新 agent 提供共享默认 provider 和模型。Provider、模型和推理强度都是即时 Config 字段。保存的选择更新当前 profile patch，并用于后续读取；会话级选择仍由入口负责。

- [公开对象组 1](api-core-dsh-agent-default-model-root-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实) 给出装载和验证顺序。
