# 在 Node PTC 中执行工作流与子任务操作指南

## 在 Node PTC 中执行工作流与子任务

目标结果：在 Node PTC 中执行工作流与子任务并观察结果及资源释放。

### 目标与前置

目标是把工作流编排交给 Node PTC 执行，同时保持调用 Agent 的目录、文件策略和取消归属。

### 实现和使用步骤

1. 先挂载 Node PTC provider、subagent runtime 与所选 provider，再挂载 workflow-ptc；base bundle 已提供该组合时不要重复添加服务。Python PTC 组合不兼容此 TypeScript 引擎。
2. 配置 provider、maxConcurrentAgents、maxTotalAgents 和 maxItemsPerCall；单次请求可以降低子任务总量，脚本 hook 不得扩大它。为 PTC maxPendingCalls 预留启动、等待和清理空间。
3. 用[完整工作流调用包](../examples/example-workflow-command.md)实际启动一次 run。引擎在开始时捕获 cwd 和文件策略，之后父级切目录不改变此 run 的环境。
4. 处理结果与取消时遵守 WorkflowRun 所有权；引擎使用 timeoutMs=null，不提供整体经过时间上限，最初同步片段仍受 syncTimeoutMs 约束。
5. 在当前文件策略下验证真实执行与取消；没有约束能力的 provider 只能用于 danger-full-access，read-only/workspace-write 应在执行前拒绝。

### 失败、取消与完成判据

失去进程、输出或控制预算超限都应表现为失败。Node isolation/VM 标记不代表网络隔离；实际强制事实取决于所选 sandbox/subprocess provider。取消后等待子任务与进程清理，再卸载引擎。

### 权威对象契约

- [api-capabilities-dsh-workflow-ptc](../api/api-capabilities-dsh-workflow-ptc.md)。
