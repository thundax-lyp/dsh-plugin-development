# SSH 远端执行世界组合

## 目标与入口

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。`@deepseek-ai/dsh-ssh` 的 `SshConnection` 是 Host 服务 `ctx.ssh`，由部署配置固定 `host`、远端绝对 `node`、已安装 helper 的绝对 `helper` 和 SHA-256 `helperHash`、远端 `workspace`；可选预装 PTC `bootstrapPath` 与 `bootstrapHash` 必须成对。`fs-ssh`、`subprocess-ssh`、`sandbox-ssh` 分别提供既有 `ctx.fs`、`ctx.subprocess`、`ctx.sandbox` 能力的远端实现。插件作者通常组合整套 provider，而不是调 `ctx.ssh.request` 的私有 helper method。

## 组合与生命周期

SSH 连接只在 POSIX client 启动，使用预配置 OpenSSH host alias、已验证的 helper digest 与版本；`ready` 完成后 provider 才可请求。连接不自动重连；连接丢失使活动操作失效。`request` 有取消与管理请求时限，取消不会重放可能已执行的远端变更；`connectStream` 仅接受 helper 颁发的 endpoint capability，返回暂停 socket，消费者先附着再恢复。卸载会终止 helper、远端管理资源、转发 socket 并等待清理。远端 `fs` 的 path/identity 属远端执行世界，不能用本机 `fs` 或本机路径字符串解释。

`fs-ssh` 的写操作由同一远端 `sandboxPolicy` 约束，`subprocess-ssh` 与 `sandbox-ssh` 应和它及 `ctx.ssh` 用同一个执行世界；将远端 subprocess 与本机 sandbox/FS 混合会破坏路径与权限假设。helper 协议是此版本内部 transport，`request(method,params,schema)` 公开可调用不等于任意 method 可供插件扩展。用户提供凭证/host alias、helper 安装和真实 SSH 握手需要独立部署验证；本轮未连接远端。此参考不提供不可验证的凭证或 helper 安装范例。

公开组合对象：`SshConnection` 持有 `ready`、远端 node 配置及可选 `bootstrapPath`；`SshFileSystem`、`SshSubprocessRuntime`、`SshSandboxProvider` 分别实现同一远端的 FS、进程和沙箱服务。完整部署步骤与取消、清理路径见[SSH 执行世界 HOW-TO](how-to-run-ssh-execution-world.md)。该 HOW-TO 已按目标版本声明编译，远端握手尚未运行。
