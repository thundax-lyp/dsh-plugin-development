# @deepseek-ai/dsh-sdk-client .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`dsh-sdk-client` 让 TypeScript 程序通过 stdio JSON-RPC 启动并驱动完整的 DeepSeek Harness 运行时。使用 `DeepSeekHarness` 可打开会话、发送文本或图像提示词、收集事件与通知流，并在运行时进入 idle 后取得最后提交的助手响应；使用 `HarnessClient` 可直接发送协议请求和订阅通知。调用方可以提供 `dshBin`；否则客户端解析同版本的 `@deepseek-ai/dsh` 可执行文件。客户端跨多次运行持有子进程，公开类型化的传输与协议错误，并在 `close()` 或 `await using` 时回收进程。它适用于调用方能够选择运行时 profile 和启动设置的场景。

- [公开对象组 1](api-core-dsh-sdk-client-root-1.md)。
- [公开对象组 2](api-core-dsh-sdk-client-root-2.md)。
- [公开对象组 3](api-core-dsh-sdk-client-root-3.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程) 给出装载和验证顺序。
