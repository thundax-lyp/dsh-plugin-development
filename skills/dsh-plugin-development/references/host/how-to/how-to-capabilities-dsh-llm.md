# 实现注册并调用模型提供方操作指南

## 实现注册并调用模型提供方

目标结果：实现注册并调用模型提供方并观察结果及资源释放。

### 目标与前置

目标是交付一个有明确 provider 路由、模型目录、流终态和卸载行为的 Host 提供方。消费项目固定 DSH 为 `0.2.1-rc.3`。

### 实现和使用步骤

1. 按[本地提供方完整包](../examples/example-local-llm.md)创建 package、TS 构建配置、入口和 bundle patch；先用无外部 I/O 的 adapter 走通装载，再换成真实 provider wire。
2. 实现 `LlmAdapter.stream`，把 provider 输出转换成规范 `StreamChunk`。先明确哪些 GenerateOptions 可实现；不支持的选项要拒绝。需要 Web 模型选择时实现 `listModels`，每项包含 provider、id 和 name。
3. 在声明 `inject: ['llm']` 的插件 `apply` 中注册 provider 路由。注册 handle 属于当前插件 scope；动态设置变更用 handle.replace 原子替换，卸载使用其 disposer，不能向裸全局 map 注册。
4. 按 example 的隔离 home 初始化 Web Profile，构建并安装 bundle。在模型目录选择自己的路由并发起一次调用；另在服务层迭代 stream，确认一个 terminal finish。
5. 接入真实 HTTP/SDK 时传递 signal、加入 attribution headers、映射稳定失败码；将 replayState 限制为恢复 provider 协议必需的无损 JSON。模型可见请求必须可由 Session 重建，不在 waterfall 中秘密改写。

### 失败、取消与完成判据

分别验证正常文本、预先取消、进行中取消、不支持选项和重复路由。真实网络失败由 runtime 形成 error/aborted terminal；不要以 Promise 未 reject 就判断成功。热卸载贡献插件后路由撤回，重新调用得到 NO_ADAPTER。独立编译、Profile 激活、GUI 目录可选和完整流顺序是四个不同判据。

### 权威对象契约

- [api-capabilities-dsh-llm-api-key](../api/api-capabilities-dsh-llm-api-key.md)。
- [api-capabilities-dsh-llm-assembler](../api/api-capabilities-dsh-llm-assembler.md)。
- [api-capabilities-dsh-llm-assistant-stream](../api/api-capabilities-dsh-llm-assistant-stream.md)。
- [api-capabilities-dsh-llm-attribution](../api/api-capabilities-dsh-llm-attribution.md)。
- [api-capabilities-dsh-llm-brand](../api/api-capabilities-dsh-llm-brand.md)。
- [api-capabilities-dsh-llm-call-config](../api/api-capabilities-dsh-llm-call-config.md)。
- [api-capabilities-dsh-llm-content](../api/api-capabilities-dsh-llm-content.md)。
- [api-capabilities-dsh-llm-error](../api/api-capabilities-dsh-llm-error.md)。
- [api-capabilities-dsh-llm-message](../api/api-capabilities-dsh-llm-message.md)。
- [api-capabilities-dsh-llm-retry-policy](../api/api-capabilities-dsh-llm-retry-policy.md)。
- [api-capabilities-dsh-llm-types](../api/api-capabilities-dsh-llm-types.md)。
- [api-capabilities-dsh-llm](../api/api-capabilities-dsh-llm.md)。
