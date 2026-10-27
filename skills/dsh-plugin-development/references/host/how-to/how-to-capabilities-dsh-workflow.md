# 运行并可靠释放调用方拥有的编排操作指南

## 运行并可靠释放调用方拥有的编排

目标结果：运行并可靠释放调用方拥有的编排并观察结果及资源释放。

### 目标与前置

目标是让一个调用 Agent 拥有一次脚本编排，从子任务返回规范 JSON，并能取消和等待全部资源释放。

### 实现和使用步骤

1. 按[工作流命令完整包](../examples/example-workflow-command.md)创建调用入口。先确认 workflowEngine、subagents 和执行提供方可用；不要把抽象 WorkflowEngine 当作执行后端。
2. 准备纯 JavaScript 函数体和 JSON meta/args，传入真实 parent Agent。脚本以 return 产生最终 JSON；不把 meta 或 args 当代码执行。
3. 使用 agent、parallel、pipeline 等 hook 组合有界工作，给总子任务数和并发设定部署范围。普通 child 失败可得到 null，脚本必须决定业务是否允许部分结果。
4. start 返回的 WorkflowRun 由本次调用持有。传入 signal，在 try 内 await run.result 并检查 stopReason，在 finally 中 await run.dispose。
5. 安装 bundle 并通过显式命令或已授权的 workflow 工具触发；核对每个 child 的 parent 和 workspace，观察最终 UI/模型结果，结束后确认进程与 child 不再运行。

### 失败、取消与完成判据

无效 meta/脚本在 run 发布前拒绝；运行失败的 result 仍会兑现。只有 stopReason=completed 的 value 才作为成功输出。cancel 发起中止，dispose 才等待清理；不能在取消后把未完成结果当成功。

### 权威对象契约

- [api-capabilities-dsh-workflow](../api/api-capabilities-dsh-workflow.md)。
