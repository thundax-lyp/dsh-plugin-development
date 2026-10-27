# Shell 命令、期限与持久执行句柄

## 对象关系

先 ShellExecutor.resolve(request) 再 execute(spec)，不能将未解析 request 当 spec。foreground 由调用者 await result 决定，并不是不同的 spawn。onExpiry:none 不设截止，调用者等待超时后 handle 仍可用；kill 才在到期终止。result 在普通非零退出、超时和 abort 时返回描述结果，基础设施失败才 reject。done 在进程 close 后结算且不拒绝，生成失败由读取路径及 result 保留。ShellProcess.readOutput 是增量消费，与 subprocess 的 offset 读取不同。执行器单独 reload 不一定结束进程，subprocess 组合卸载拥有最终停止责任。

## 选型与使用

准备阶段超时可以返回已结算且无输出的 handle；准备失败或发布前取消会 reject。检查 timedOut、aborted、exit code，不把 Promise fulfilled 等同于命令成功。

- [@deepseek-ai/dsh-bash-local.](api-runtime-dsh-bash-local.md)：模块和公开对象。
- [@deepseek-ai/dsh-bash-sandbox.](api-runtime-dsh-bash-sandbox.md)：模块和公开对象。
- [@deepseek-ai/dsh-pwsh-local.](api-runtime-dsh-pwsh-local.md)：模块和公开对象。
- [@deepseek-ai/dsh-pwsh-sandbox.](api-runtime-dsh-pwsh-sandbox.md)：模块和公开对象。
- [@deepseek-ai/dsh-shell-env.](api-runtime-dsh-shell-env.md)：模块和公开对象。
- [@deepseek-ai/dsh-shell.](api-runtime-dsh-shell.md)：模块和公开对象。
- [@deepseek-ai/dsh-tool-bash-persistent.](api-runtime-dsh-tool-bash-persistent.md)：模块和公开对象。
- [@deepseek-ai/dsh-tool-bash.](api-runtime-dsh-tool-bash.md)：模块和公开对象。
- [@deepseek-ai/dsh-tool-pwsh-persistent.](api-runtime-dsh-tool-pwsh-persistent.md)：模块和公开对象。
- [@deepseek-ai/dsh-tool-pwsh.](api-runtime-dsh-tool-pwsh.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-shell.md)说明配置、调用和清理顺序。
