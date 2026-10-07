# Terminal task path 与本机 PTY 核查

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。新 HOW-TO：`skill-source/how-to/run-persistent-terminal.md`；隔离消费包：`evidence/tests/terminal-pty-consumer/`。未修改共享账本或正式 Skill。

## 源码与组合

- `packages/terminal/terminal/src/index.ts`：`ctx.terminals` 由 `TerminalSessionService` 提供；`spawn` 的 owner 必须为注册的同一 live Agent；`startSend` 同会话独占；`kill` 等待 backend close；owner scope/服务卸载清理。
- `packages/terminal/terminal-bash/src/{index,config}.ts`：注入 `terminals`、`sandboxPolicy`、`sessionProjections`、`subprocess`；本机 PTY 默认 type `shell`、bash `/bin/bash --noprofile --norc -i`，另支持 pwsh 方言。模式不是 backend 配置，而是每次从 owner Session 解析。受限模式必须有同执行世界 `ctx.sandbox`；有活跃 PTY 时拒绝切换 Session sandbox mode。
- `packages/terminal/tool-terminal/src/index.ts`：标准模型工具 `terminal_open/send/read/signal/close/list`，后台 send 另接 Jobs；`packages/shell/tool-bash-persistent/src/index.ts`、`tool-pwsh-persistent/src/index.ts` 是单工具 owner→PTY 的另一消费面，分别注册 `bash` 和 `pwsh`。
- `packages/bundle/sdk-minimal/cordis.patch.yml` 有真实 Profile 装载前例：sandbox、session-projection、sandbox-policy、subprocess、pty、terminal-bash，然后是工具与 Agent。HOW-TO 片段按此依赖列出 Host 服务。

## 独立发布包验证

隔离目录从 npm 安装目标 rc.1 Cordis、Agent、Session、Terminal、terminal-bash、Sandbox Policy、Session Projection、Subprocess Local 与 Tools。npm 提示 `node-pty`、`koffi` 和 subprocess helper 的 install script 未获 allow-scripts 许可；本机可用预构建 `darwin-arm64` node-pty，实际 PTY smoke 仍运行成功。本轮未执行那些脚本。

HOW-TO 的 `src/index.ts` TypeScript 块原样抽取到 `src/plugin.ts`，`npm run build` 退出 0。独立 `npm run smoke` 再次编译并以真实 macOS PTY 执行，退出 0：`shell` backend 注册；两次发送均 `stdin_read`，第二次输出 `proof=ready`，scrollback 保留；显式 `kill` 后 owner list 和 activity 为空；对 `sleep 60` 的 operation `cancel()` 在本次运行得到 `stdin_read` 而非 timeout，随后关闭；另一 PTY 在 owner scope 卸载后自动清理。fixture 的 `finally` 释放根 fiber 并删除自有临时目录。

## 未覆盖边界

未实际运行完整 DSH Profile、ToolRuntime 调用或 Session 日志回放；`plugin.ts` 只做目标声明编译，规范 JSON 工具结果的持久性仍由完整 Agent 链验证。未执行 `tool-terminal` 六工具或持久 `bash`/`pwsh` 的用户调用，也未跑 Windows pwsh、Linux PTY 或受限模式下的本机 sandbox 组合。取消结果 `stdin_read` 只说明本次长命令被中止并恢复 prompt，不能证明所有前台进程组时序；实际命令完成与否需另按后端结果判定。
