# Subprocess 独立消费核查

- 精确源：`dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`；`packages/subprocess/subprocess/src/{index,types}.ts`，本机实现 `packages/subprocess/subprocess-local/src/{index,spawn,output}.ts`。
- 隔离 npm 包 `evidence/tests/subprocess-consumer` 使用 `@deepseek-ai/dsh-subprocess` 和 `@deepseek-ai/dsh-subprocess-local@0.2.0-rc.1`、Cordis 4.0.4；`npm install --ignore-scripts --no-audit --no-fund` 和 `npm run smoke` 均通过，输出 `subprocess managed argv smoke passed`。
- 真实观察：`resolveExecutable(process.execPath)`、受管 Node 子进程 stdout/stderr collect、exit 0/7、`terminate()` 与 `waitForExit()`；通过 fixture 环境值确认隐式 `DSH_*` 与 `*SECRET*` 均未传入 child。没有打印用户环境变量值。
- HOW-TO 的 manifest、tsconfig 和 TypeScript 代码块原样抽至 `howto-managed-command`，目标 npm 声明 `tsc -p` 通过；原样抽取先发现缺少 `dsh-subprocess` 的类型 augmentation 导入，已补入示例。
- 未运行：完整进程树逃逸/各平台 containment、PTY、SSH、收集输出 spill、超时/abort 的不同故障路径、真实 Profile 与模型工具入站权限。测试执行成功不证明所有子进程可约束。

## parent 集成候选

- API 包 `@deepseek-ai/dsh-subprocess`：`SubprocessRuntime`、`SubprocessSpawnSpec`、`SubprocessHandle`、`SubprocessOutputReader`、`SubprocessTerminalHandle`、`scrubbedParentEnv`。新 reference `api-guardrails/subprocess.md`，任务 `how-to/how-to-run-managed-command.md`，heading `在 Host 插件中运行受管命令`。
- PTC runtime 是相邻的程序执行 seam：公开 `PtcRuntime.resolve/run`，Node provider 依赖 FS/Subprocess/Sandbox/SandboxPolicy；本轮未把其内部 binding transport 记为已验证任务，不为它写无运行证据的完整示例。
