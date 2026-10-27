# 受管理子进程与原始输出

## 对象关系

SubprocessRuntime 不补默认值，spawn 输入必须完整提供 argv、cwd、环境、stdio 和终止宽限。resolveExecutable 只接受绝对路径或 PATH 名，含分隔符的相对路径因基准不明拒绝。spawn 同步返回 handle，预先取消或非法参数可同步抛错；done 记录退出也可因基础设施错误拒绝。collect 输出以 offset 非消费读取，pipe 是调用者拥有的原始流。terminate 与 waitForExit 针对后端管理范围；释放 provider 时终止并等待仍运行的进程。spawnTerminal 负责真实 terminal 分配与整个会话停止，shell ready 判断由终端消费者负责。

## 选型与使用

取消后还须等待管理范围静止再释放调用资源。scrubbedParentEnv 清除敏感名称与全部 DSH_*，显式 env 随后覆盖；不要把此名称启发式当成凭证隔离证明。远程 fs/subprocess 必须使用同一执行世界。

- [@deepseek-ai/dsh-subprocess-local.](api-runtime-dsh-subprocess-local.md)：模块和公开对象。
- [@deepseek-ai/dsh-subprocess-local./output](api-runtime-dsh-subprocess-local--output.md)：子路径对象。
- [@deepseek-ai/dsh-subprocess-local./runner](api-runtime-dsh-subprocess-local--runner.md)：子路径对象。
- [@deepseek-ai/dsh-subprocess.](api-runtime-dsh-subprocess.md)：模块和公开对象。
- [@deepseek-ai/dsh-subprocess./control](api-runtime-dsh-subprocess--control.md)：子路径对象。
- [@deepseek-ai/dsh-win32-process.](api-runtime-dsh-win32-process.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-subprocess.md)说明配置、调用和清理顺序。
