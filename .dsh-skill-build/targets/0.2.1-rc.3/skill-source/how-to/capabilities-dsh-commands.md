# 为用户注册直接执行的斜杠命令操作指南

## 为用户注册直接执行的斜杠命令

目标结果：为用户注册直接执行的斜杠命令并观察结果及资源释放。

### 目标与前置

目标是在用户输入面提供一个直接执行的命令，其结果出现在 UI，且不会自动变成模型输入。

### 实现和使用步骤

1. 参考[工作流命令完整包](../examples/example-workflow-command.md)建立 Host bundle，声明 commands 注入，注册不带斜杠的小写名称、description 和 handler。
2. 明确 rawInput 的解析；它保留命令名后原始空白。需要附件才声明 input.attachments，并决定哪些子命令接受它。没有接纳附件的分支应返回 error 让 UI 保留原件。
3. 将有资源的执行归当前 invocation 和插件 scope：传递 invocation.signal，跟踪正在运行的活对象，在插件 effect 中取消并等待清理。注册返回值负责撤回命令发现，不自动停止已外逃副作用。
4. 构建并安装 bundle，在 Web 输入 `/review-pair` 或自己的命令；检查 list/find 和实际 dispatch。命令审计应有相同 commandId 的 run/done 对，不重复写一份模型工具结果。
5. 若命令需要让 Agent 接收内容，显式调用该 Agent 的公开输入路径；直接返回 success.text 只产生 UI 输出。跨 Agent 的局部命令挂在对应 agent context，避免覆盖其他 agent 的全局行为。

### 失败、取消与完成判据

测试未知命令、非法输入、附件拒绝和取消。handler 的 error 是预期失败通道；卸载后命令从目录消失且自身运行资源结束。只有领域事件已拥有 payload 时才关闭 recordInput，否则保留输入审计。

### 权威对象契约

- [api-capabilities-dsh-commands](../api/api-capabilities-dsh-commands.md)。
