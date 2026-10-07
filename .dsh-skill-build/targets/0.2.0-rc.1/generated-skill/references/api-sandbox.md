# 文件作用域 Sandbox 与策略解析

## 目标与入口

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。`@deepseek-ai/dsh-sandbox` 默认导出抽象 `SandboxProvider`（`ctx.sandbox`），公开 `SandboxMode`、`SandboxPolicy`、`ConfinedArgv`、`SandboxUnavailableError`、升级词汇及路径辅助函数。`@deepseek-ai/dsh-sandbox-policy` 默认导出 `SandboxPolicyService`（`ctx.sandboxPolicy`），由部署默认值、Session 记录的 `sandbox/mode` 和已批准的调用覆盖按优先级解析执行策略；`sandbox-local` 是本机实现，`sandbox-ssh` 是远端执行世界的实现。

## 调用和语义

`ctx.sandboxPolicy.resolve({session?,mode?})` 得到当前调用的完整 `{mode,workspaceRoot,sessionId?}`；Session 的 cwd 是工作区写边界，配置 root 只给无 Session/cwd 的回退。`read-only`、`workspace-write` 是可限制模式，`danger-full-access` 明确绕过文件沙箱。`ctx.sandbox.confine(argv,policy,signal?)` 只接受可限制模式，按原样 argv 包装，返回 `ConfinedArgv`：runner argv、`full|partial` 强度、本 backend 的 denialSignatures 和结构化 runnerFailureRules。调用者必须实际执行返回 argv，并按本 backend 方言区分 runner 故障与被阻止的文件效果。无可用 backend 要 fail closed，抛 `SANDBOX_UNAVAILABLE`，不能静默无沙箱执行。

对象归属：`SandboxProvider` 提供 `confine`；`SandboxPolicy` 描述本次模式与工作区；`SandboxPolicyService` 提供逐次 `resolve`；`LocalSandboxProvider` 是本机 backend。完整进程和清理骨架见[本机 Sandbox HOW-TO](how-to-confine-local-process.md)，其隔离 macOS Seatbelt 运行结果见 `evidence/runtime/sandbox-ssh-how-to-review.md`。

该服务只约束同执行世界进程的文件效果，不表示网络或进程可见性边界；远端执行不能把本地 `sandbox-local` 与远端 subprocess 混用。模型工具的升级路径必须由真实用户批准，不能把模型提出更宽模式当作批准。`sandbox/mode` 写入 Session 日志才能在恢复后重建；`resolve` 的当前值需在每次执行边界读取。完整文件权限/升级/OS runner 验证需目标 Profile 和平台执行；本轮仅源码核查，没有把静态检查记为执行通过。
