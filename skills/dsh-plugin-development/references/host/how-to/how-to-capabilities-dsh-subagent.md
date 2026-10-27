# 启动受管理子任务并等待或中止执行操作指南

## 启动受管理子任务并等待或中止执行

目标结果：启动受管理子任务并等待或中止执行并观察结果及资源释放。

### 目标与前置

目标是在真实父 Agent 下启动受管理子任务，并按后端能力等待结果、发送消息或停止执行。

### 实现和使用步骤

1. 先按上下文需求选择 spawn 或 fork，再按运行位置选择 in-process 或外部 ACP/SDK/CLI 后端；核对 provider 公开能力，不向一次性外部后端发送继续消息。
2. 在父级所见 scope 注册 provider，保留 disposer。调用 startActivation 前准备 parent、prompt、provider、深度及输出约束；可继续任务还要求持久化和必要 runtime 服务。
3. 需要模型入口时配置 tool-subagent 的 provider、toolName、preset 和深度限制；只有明确请求大型编排时再采用[工作流完整包](../examples/example-workflow-command.md)。
4. 启动后核对返回 child identity 与父子归属。消息使用真实 sender/target 和已准入内容；interruptByParent 只控制对应直接子级。不要把 inbox acceptance 当成子级已处理完。
5. 父级结束时 drain 自己的子级/后代并等待 backend dispose。外部后端返回一次性最终结果，本地可继续后端通过持久描述冷恢复；不序列化活 Agent 对象。

### 失败、取消与完成判据

分别测试启动前取消、接受后取消、provider 不存在、深度超限及清理失败。委派时捕获父策略并把 approval 固定为 never；不要从子级调用人类 answerer 升权。真实子任务必须走所选 provider，空 provider map 或仅类型编译不能证明委派成功。

### 权威对象契约

- [api-capabilities-dsh-subagent-assistant-output](../api/api-capabilities-dsh-subagent-assistant-output.md)。
- [api-capabilities-dsh-subagent-child-agent](../api/api-capabilities-dsh-subagent-child-agent.md)。
- [api-capabilities-dsh-subagent-continuation-messages](../api/api-capabilities-dsh-subagent-continuation-messages.md)。
- [api-capabilities-dsh-subagent-control-types](../api/api-capabilities-dsh-subagent-control-types.md)。
- [api-capabilities-dsh-subagent-depth](../api/api-capabilities-dsh-subagent-depth.md)。
- [api-capabilities-dsh-subagent-descriptor](../api/api-capabilities-dsh-subagent-descriptor.md)。
- [api-capabilities-dsh-subagent-error](../api/api-capabilities-dsh-subagent-error.md)。
- [api-capabilities-dsh-subagent-list-children](../api/api-capabilities-dsh-subagent-list-children.md)。
- [api-capabilities-dsh-subagent-out-of-process](../api/api-capabilities-dsh-subagent-out-of-process.md)。
- [api-capabilities-dsh-subagent-projection-types](../api/api-capabilities-dsh-subagent-projection-types.md)。
- [api-capabilities-dsh-subagent-structured](../api/api-capabilities-dsh-subagent-structured.md)。
- [api-capabilities-dsh-subagent-types](../api/api-capabilities-dsh-subagent-types.md)。
- [api-capabilities-dsh-subagent](../api/api-capabilities-dsh-subagent.md)。
