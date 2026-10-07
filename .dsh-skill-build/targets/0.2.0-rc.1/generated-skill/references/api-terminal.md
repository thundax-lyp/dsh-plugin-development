# Terminal PTY backend 与 owner 作用域

## 目标与对象

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。`@deepseek-ai/dsh-terminal` 默认导出 `TerminalSessionService`（`ctx.terminals`），并导出 `TerminalBackend`、`TerminalBackendSession`、`TerminalBackendSpawnSpec`、`TerminalSendOperation` 等类型，以及 `TerminalError`、`TerminalBackendCleanupError`、`TerminalSessionId`。注册 `registerBackend({type,spawn})` 保留非空且唯一的 backend type，返回释放注册的 disposer，注册也受调用 fiber 的 effect 生命周期管理。`listBackends()` 返回当前 type。目标发布的 `@deepseek-ai/dsh-terminal-bash` 是实际本地 PTY backend；`@deepseek-ai/dsh-tool-terminal` 提供模型工具消费者。

## owner、会话和操作

`TerminalBackendSpawnSpec` 是传给 backend 的 owner/cwd/name/type 输入；`TerminalBackendSession` 承担真实 PTY 读写和关闭；`TerminalSendOperation` 是一次发送的取消、完成与增量输出句柄。`TerminalError` 是会话 API 的有代码错误，和同时保留 setup/cleanup 失败的 `TerminalBackendCleanupError` 区分。

`TerminalSessionService.registerBackend` 接收 `{type,spawn}` 并返回注册 disposer；`listBackends` 列出当前 type，二者须在拥有注册的插件 fiber 中使用。

`TerminalErrorCode` 的稳定值是 `DUPLICATE_BACKEND`、`DUPLICATE_NAME`、`FOREIGN_SESSION`、`NO_BACKEND`、`NO_SESSION`、`OWNER_NOT_LIVE`、`SEND_ACTIVE`、`SERVICE_DISPOSING`；调用方按 `TerminalError.code` 处理，不能从错误文字推断状态。

`spawn(owner,{type,name?,cwd?},signal?)` 要求 owner 是 `ctx.agents` 注册的同一 live Agent 对象，backend 的异步 `spawn` 完成且 owner 仍 live 才发布会话；失败或取消会回滚未发布资源。backend 必须实现可取消 setup，并在失败时清理部分资源，清理也失败时用 `TerminalBackendCleanupError` 传递两个错误。`TerminalSessionId` 由注册表发放，不能由插件按任意字符串推断所有权。

`startSend(owner,id,{text,submit,signal?})` 每会话只允许一个 active operation，返回 `done`、增量 `readOutput()` 和 `cancel()`；`read` 提供有界 scrollback，`signal` 仅对 backend 确认的前台进程组发允许信号，`kill` 等待 backend close，`list` 仅显示同一 owner，会话名只在 owner 内唯一。`hasOwnerActivity(owner)` 包含未发布 spawn，供活动门禁。Agent 卸载与 Terminal service 卸载均等待 backend 清理。全部会话是进程内 PTY 资源，不从 Session 日志恢复；若把输出提供给模型，应通过模型工具写入规范 Session 结果，不能把 scrollback 当持久事实。

| 请求/结果类型                                                     | 字段与边界                                                                                                                        |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `TerminalSpawnRequest` / `TerminalSpawnResult`                    | 输入 `type`、可选 `name`/`cwd`；成功返回会话快照及初始有界输出 `motd`。                                                           |
| `TerminalSendRequest` / `TerminalSendRead` / `TerminalSendResult` | 输入 `text`、`submit`、可选 `signal`；增量为 `delta`/`truncated`；完成含 `viewport`、`waitReason`、`sessionStatus`、`truncated`。 |
| `TerminalReadRequest` / `TerminalReadResult`                      | 可选 `offset`/`count` 请求保留的 scrollback；返回 `text`、`totalLines`、`lineBegin`、`lineEnd`、`truncated`。                     |
| `TerminalSessionSnapshot` / `TerminalSessionStatus`               | 快照含 `sessionId`、可选 `name`/`pid`、`type`、`status`；状态是 `running` 或带 `exitCode`/`signal` 的 `exited`。                  |
| `TerminalSignal` / `TerminalSignalResult`                         | 只允许 `SIGINT`、`SIGTERM`、`SIGKILL`、`SIGTSTP`、`SIGHUP`；交付后结果有 `delivered: true` 和 `targetPgid`。                      |
| `TerminalWaitReason`                                              | `stdin_read`、`inferred_idle`、`timeout`、`session_exit`；它不是任意子进程退出码。                                                |

## 可用任务与边界

Host 插件可实现新 `TerminalBackend` 并注册，但必须提供真实 PTY/进程组、缓冲限制、取消和清理语义；一个只返回内存文本的 stub 不是终端后端。本轮独立消费 smoke 只验证公开注册、冲突和释放，不声称真实 PTY 或 Agent 会话。插件作者需要本地 shell 时应先组合已发布 `terminal-bash` 与 `tool-terminal`；自定义后端开发须按上述完整契约另做 OS/取消/卸载验证。
