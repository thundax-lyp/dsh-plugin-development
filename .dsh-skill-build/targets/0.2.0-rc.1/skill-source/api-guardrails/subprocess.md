# Subprocess 执行世界与受管进程

## 目标与公开入口

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。`@deepseek-ai/dsh-subprocess` 默认导出抽象 `SubprocessRuntime` 服务（`ctx.subprocess`）与 `SubprocessSpawnSpec`、`SubprocessHandle`、`SubprocessOutcome` 等类型。`@deepseek-ai/dsh-subprocess-local` 是本机实现；`@deepseek-ai/dsh-subprocess-ssh` 是远端执行世界实现。Host 插件可消费此服务运行可信精确 argv，完整例见[运行受管命令](how-to-run-managed-command.md)。

## 调用契约

抽象 `SubprocessRuntime` 由目标执行世界的 provider 实现；已发布的 `LocalSubprocessRuntime` 负责本机执行。`SubprocessSpawnSpec` 是一次启动输入，`SubprocessHandle` 是返回的受管进程，`SubprocessOutcome` 只记录直接进程的退出事实。

`resolveExecutable(command,env?,signal?)` 在 provider 的执行世界解析绝对路径或 PATH 裸名；带分隔符相对路径拒绝。`terminalEnvironment(signal?)` 报告 provider 平台和可用默认 shell，但不替调用者选择 shell。`spawn(spec)` 同步返回受管句柄；spec 必须明确 `argv`、执行世界的 `cwd`、每个 stdin/stdout/stderr disposition、正有限 `graceMs`，可带 `signal` 和显式 `env`。argv 不经过 shell 字符串解释。`stdio` 可选 `'pipe'` 原始流、`'inherit'` 或有界 collect；collect 使用非消费式 `readFrom(offset)`，可给 `spill.maxBytes` 保存完整流。没有 spill 时超出内存 cap 只保留尾部，`lossy/truncated` 必须向调用者报告。

`handle.done` 只给直接命令 exitCode/signal，不包含超时/取消分类或收集的输出；调用者从自己持有的 signal 和 collect reader 判断。`terminate()` 启动 provider 的受管范围清理，`waitForExit(signal?)` 等待同一范围真正清空，可返回 false 表示等待信号先中止。调用方不应只等 `done` 就认为所有后代消失；Service 卸载会终止并等待剩余受管进程。`spawnTerminal` 另负责真实 PTY、前台进程组、信号与整体会话退出；不能从普通管道 spawn 推导终端语义。

环境来自 `scrubbedParentEnv()`：隐式删除 credential-shaped 键及 `DSH_*`，保留 PATH/HOME/locale 和代理相关事实；spec 的显式 `env` 在其后合并，故调用者显式传入秘密属于有意授权，不能用默认 scrub 为之背书。插件必须校验可执行文件、cwd、参数、权限和输出如何进入模型；Subprocess 服务本身不是 shell/授权或 Session 日志。与 FS/Sandbox/PTC 组合时应同属一个执行世界，尤其远端路径不按本机路径解释。

## 验证边界

精确 npm 包隔离编译并在本机 LocalSubprocessRuntime 实际执行 Node argv：验证标准输出/错误、退出码、受管范围等待和隐式环境清理。未验证 POSIX/Linux/Windows 的全部后代 containment、真实 PTY、SSH provider、输出 spill、工具权限与模型 Session 记录。
