# Sandbox / SSH / Spill 候选核查

目标 checkout：`dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`。

## 源与验证

- Spill：`packages/spill/spill/src/{index,types}.ts`、`spill-local/src/{index,store,cleanup}.ts`、`spill-policy/src/index.ts`。隔离 npm 消费包 `evidence/tests/spill-consumer` 以 rc.1 安装；`npm install --ignore-scripts --no-audit --no-fund` 与 `npm run smoke` 通过，输出 `spill-local save and private artifact smoke passed`。实际检查完整文本、UTF-8 bytes、检索提示、0600 文件、同名不碰撞。
- HOW-TO 的 manifest、tsconfig 与 TypeScript 代码块原样抽至 `howto-save-large-report`，使用精确 npm 声明 `tsc -p` 通过。
- Sandbox：`packages/sandbox/sandbox/src/{index,escalation,roots,diagnostics}.ts`、`sandbox-policy/src/{index,session-mode}.ts`，`sandbox-local` 与 `ssh/sandbox-ssh` 的 provider 源。只作公开成员与组合源码核查；未启动 OS runner，未验证 denied/升级真实路径。
- SSH：`packages/ssh/ssh/src/index.ts`、`fs-ssh/src/index.ts`、`subprocess-ssh/src/index.ts`、`sandbox-ssh/src/index.ts`。只作源码和发布包导出核查；无远端 helper/凭证/host，未跑 SSH 握手或操作。
- 未运行 Spill 自动策略的工具结果替换、Session 恢复、保留期清理或远端 Spill；本地 spill 写入不能代表这些通过。

## parent 集成候选

- `@deepseek-ai/dsh-spill`：`SpillStore`、`SaveTextSpill`、`SpillRef`、`SpillLocator`，reference `api-guardrails/spill.md`；任务 `how-to/how-to-save-large-report.md`，heading `保存插件大文本`。
- `@deepseek-ai/dsh-sandbox` / `@deepseek-ai/dsh-sandbox-policy`：`SandboxProvider`、`SandboxPolicyService`、`SandboxPolicy`、`ConfinedArgv`、`SandboxUnavailableError`，reference `api-guardrails/sandbox.md`。本轮未给未经目标平台运行验证的完整执行 HOW-TO。
- `@deepseek-ai/dsh-ssh` 与三项 ssh provider：`SshConnection`、`ctx.ssh` 及同世界 `ctx.fs`/`ctx.subprocess`/`ctx.sandbox`，reference `api-guardrails/ssh.md`。真实部署前需 helper、凭证、远端隔离检验，不把私有 RPC 当稳定插件扩展。
