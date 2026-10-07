# Terminal / Host platform 独立核查

- 精确 checkout：`dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`。
- 源：`packages/host/directory-picker/src/{index,types}.ts`、`directory-picker-{native,browse,auto}`、`open-in-app/src/{index,shared,catalog}.ts`；`packages/terminal/terminal/src/{index,types}.ts`、`terminal-bash/src/index.ts`、`tool-terminal/src/index.ts`。
- 独立消费包：`evidence/tests/host-platform-consumer`；`npm install --ignore-scripts --no-audit --no-fund` 成功，`npm run smoke` 的 npm rc.1 声明编译 + Cordis 实际运行成功，输出 `directory picker consumer and terminal registration smoke passed`。
- 覆盖：browse 能力消费、list/create 路由、错误传播、caller abort；Terminal backend type 注册/冲突/释放。Terminal smoke 使用只会失败的测试 backend，未启动 PTY。
- HOW-TO 的 `package.json`、`tsconfig.json` 和 TypeScript 代码块原样抽取到隔离 `howto-directory-picker`，目标 npm 声明 `tsc -p` 通过。
- 未覆盖：真实 native chooser、auto Profile 与 Client UI、open-in-app HTTP/认证与系统启动、完整 Terminal Agent owner/spawn/send/kill、进程恢复；不能从此 smoke 推断这些功能通过。

## parent 集成候选

- 包 `@deepseek-ai/dsh-host-directory-picker`：`DirectoryPicker`、`DirectoryPickerCapability`、`DirectoryPickerCapabilities`、`DirectoryPickerError`、`DirectoryListing`；reference `api-guardrails/host-platform.md`，任务 `how-to/how-to-use-directory-picker.md`，heading `在 Host 插件中使用目录选择能力`。
- 包 `@deepseek-ai/dsh-terminal`：`TerminalSessionService`、`TerminalBackend`、`TerminalBackendSession`、`TerminalError`；reference `api-guardrails/terminal.md`。本轮没有声称完整自定义 PTY HOW-TO；只有注册 seam smoke。
- `@deepseek-ai/dsh-host-open-in-app`：固定目录和路由，无 app 注册点；在 `host-platform.md` 作为边界说明，不增加自定义 app 任务。
