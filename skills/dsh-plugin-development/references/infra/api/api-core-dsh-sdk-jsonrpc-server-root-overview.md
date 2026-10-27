# @deepseek-ai/dsh-sdk-jsonrpc-server .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`dsh-sdk-jsonrpc-server` 通过 stdio 服务 SDK 协议格式（wire format），使进程外客户端能够驱动 harness agent（智能体）：它为每个 `sessionId` 打开一个会话、把用户提示词排入队列，并把每个会话事件与 agent 状态转换流式发回客户端。把它作为 `jsonrpc` 插件挂载到 Loader 组合中；外围插件树提供其余一切——agent、模型适配器、持久化与工具。Stdout 只承载 JSON-RPC 帧，因此部署不得组合 stdout logger。它通过 dispose（资源释放）根运行时并以 0 退出应答 `shutdown`；EOF 与信号退出归 app bin 负责。

- [公开对象组 1](api-core-dsh-sdk-jsonrpc-server-root-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程) 给出装载和验证顺序。
