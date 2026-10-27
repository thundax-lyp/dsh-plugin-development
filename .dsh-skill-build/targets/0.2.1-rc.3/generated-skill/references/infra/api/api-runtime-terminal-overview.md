# 持久终端后端与会话

## 对象关系

TerminalSessionService 注册 backend 后才可按 type 创建会话。会话精确绑定创建它的 Agent 对象，不能因获知 id 就跨 Agent 操作。一次只允许一个 send；同步预留避免后台 job 发布前并发发送。stdin_read、inferred_idle、timeout、session_exit 是不同等待结果。spawn 先保留未发布资源，成功后发布；取消、owner 或 service 卸载必须等待 setup/rollback 与进程树清理。进程内会话不跨 Host 重启恢复。

## 选型与使用

NO_BACKEND、NO_SESSION、FOREIGN_SESSION、SEND_ACTIVE、OWNER_NOT_LIVE 必须分别处理；TerminalBackendCleanupError 代表资源清理仍失败，不能向用户报告已关闭。

- [@deepseek-ai/dsh-terminal-bash.](api-runtime-dsh-terminal-bash.md)：模块和公开对象。
- [@deepseek-ai/dsh-terminal.](api-runtime-dsh-terminal.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-terminal.md)说明配置、调用和清理顺序。
