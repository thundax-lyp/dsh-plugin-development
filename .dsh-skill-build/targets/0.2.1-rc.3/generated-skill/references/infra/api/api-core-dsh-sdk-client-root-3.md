# @deepseek-ai/dsh-sdk-client .：公开对象 3

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-sdk-client 选型与组合](api-core-dsh-sdk-client-root-overview.md)。

`dsh-sdk-client` 让 TypeScript 程序通过 stdio JSON-RPC 启动并驱动完整的 DeepSeek Harness 运行时。使用 `DeepSeekHarness` 可打开会话、发送文本或图像提示词、收集事件与通知流，并在运行时进入 idle 后取得最后提交的助手响应；使用 `HarnessClient` 可直接发送协议请求和订阅通知。调用方可以提供 `dshBin`；否则客户端解析同版本的 `@deepseek-ai/dsh` 可执行文件。客户端跨多次运行持有子进程，公开类型化的传输与协议错误，并在 `close()` 或 `await using` 时回收进程。它适用于调用方能够选择运行时 profile 和启动设置的场景。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## validatedSessionEvent 公开契约

导入入口：`@deepseek-ai/dsh-sdk-client`；公开符号：`validatedSessionEvent`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function validatedSessionEvent(value: unknown): SessionEvent;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。
