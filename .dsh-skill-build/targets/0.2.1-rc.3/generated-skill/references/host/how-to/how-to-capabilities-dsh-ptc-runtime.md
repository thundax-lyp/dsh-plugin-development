# 实现有显式结果与错误的程序执行提供方操作指南

## 实现有显式结果与错误的程序执行提供方

目标结果：实现有显式结果与错误的程序执行提供方并观察结果及资源释放。

### 目标与前置

目标是消费或实现一个有显式解析、执行结果和 owner 释放的程序运行接口。

### 实现和使用步骤

1. 为消费选择 Node 或 Python 等实际 provider，确认 language、programFormat 和支持的 sandboxMode；这些描述不授予权限。
2. 构造程序与异步 bindings，调用 resolve 补齐并验证 cwd、deadline 与 sandbox，再把返回 spec 交给 run。名称使用跨语言标识符并避开保留全局。
3. 处理 result.value/logs 与 result.error.kind；程序异常属于结果，错误使用接口则可能 reject，两者不能合并成一个成功文本。
4. 需要 retained memory 时为一个逻辑 owner 复用同一对象身份，禁止重叠执行，在 finally 或 owner 卸载时 await release(owner)。无 owner 的执行使用临时环境。
5. 通过实际 provider 执行一个只调用本地 binding 并返回 JSON 的程序，再检查 timeout、abort、非法输出和释放；工作流消费者的完整调用例见[工作流示例](../examples/example-workflow-command.md)。

### 失败、取消与完成判据

约束证据来自 result.sandbox，不能从返回值、language 或 isolation 推断。重启或 release 后 retained memory 丢失，Session 只保留 consumer 记录的模型可见程序与结果。Node 与 Python 的能力不同，应分别验证。

### 权威对象契约

- [api-capabilities-dsh-ptc-runtime](../api/api-capabilities-dsh-ptc-runtime.md)。
