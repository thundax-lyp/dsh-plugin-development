# @deepseek-ai/dsh-sdk-protocol .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`dsh-sdk-protocol` 让 DeepSeek Harness 运行时与其 SDK 客户端通过按换行分帧的字节流交换 JSON-RPC 2.0 消息：一个传输类，加上协议两端共同使用的具名请求、结果与通知类型。服务端是 `dsh-sdk-jsonrpc-server` 插件；客户端是 TypeScript 的 `dsh-sdk-client` 与 Python SDK（后者复现这些结构但不导入它们）。当你实现或调试协议某一端时使用本包：分帧规则、方法名、载荷类型与错误语义都在这里。它是纯库——无插件、无配置、无注册。

- [公开对象组 1](api-core-dsh-sdk-protocol-root-1.md)。
- [公开对象组 2](api-core-dsh-sdk-protocol-root-2.md)。
- [公开对象组 3](api-core-dsh-sdk-protocol-root-3.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程) 给出装载和验证顺序。
