# Sandbox / SSH HOW-TO 独立核查

目标：`dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。新 HOW-TO：`skill-source/how-to/confine-local-process.md`、`run-ssh-execution-world.md`。隔离消费包：`evidence/tests/sandbox-local-consumer/`，从 npm 安装目标 rc.1 包，不依赖目标 checkout 的 workspace TypeScript 路径。

## 源码裁决

- `packages/sandbox/sandbox/src/index.ts`：`SandboxProvider.confine(argv, SandboxPolicy, signal?)` 返回 `ConfinedArgv`；`SandboxPolicy` 只能是 `read-only` 或 `workspace-write`。`danger-full-access` 由调用方显式分支。
- `packages/sandbox/sandbox-policy/src/index.ts`：`ctx.sandboxPolicy.resolve({session?, mode?})` 按每次调用解析；`SessionProjectionRegistry` 是注入前置，Session cwd 优于配置的回退 root。
- `packages/sandbox/sandbox-local/src/index.ts`：macOS 使用 Seatbelt；本机 Provider 包装 argv，调用者必须执行；无 backend fail closed。取消信号在包装前检查。
- `packages/ssh/ssh/src/index.ts`：SSH 配置要求已装 helper 的绝对路径和小写 SHA-256；`ready` 核对 helper digest；POSIX client、非重连；dispose 管理远端清理。
- `packages/ssh/fs-ssh/src/index.ts`、`subprocess-ssh/src/index.ts`、`sandbox-ssh/src/index.ts`：远端 FS/进程/Sandbox 应同组装载。目标 `packages/ssh/ssh/tests/live.e2e.ts` 需要 `DSH_SSH_TEST_CONFIG` 指向真实远端配置。

## 独立消费与运行

执行 `npm install --ignore-scripts --no-audit --no-fund`，再安装四个 SSH Provider 包，实际退出码均 0。把两篇 HOW-TO 的 TypeScript fenced block 原样抽取到 `src/howto-local.ts`、`src/howto-ssh.ts`。第一次 `npm run build` 失败，因为 `SandboxExecutionPolicy.mode` 联合类型没有通过局部条件判断自动窄化为 `SandboxPolicy.mode`；文档修正为 `{ ...policy, mode: 'workspace-write' }` 后重新抽取，`npm run build` 退出 0。SSH HOW-TO 仅类型编译，未运行。

`npm run smoke` 退出 0，在 macOS 真实 Seatbelt 下观察：`workspace-write` 工作区内写入状态 0、文件存在、`enforcement: full`；工作区外写入状态 1、stderr 含 `EPERM: operation not permitted`、文件不存在；`read-only` 对工作区写入状态 1、同样 EPERM、文件不存在；调用前已取消的 signal 被 Provider 拒绝。`node lib/howto-local.js` 也退出 0。fixture 在 `finally` 卸载 Cordis fiber 并删除自身创建的两个目录，运行后没有留下测试文件。

## 未覆盖边界

未执行 Linux bwrap/Landlock、Windows ACL、Session 模式日志和 Agent 工具链；本机 smoke 是直接 Cordis 组合与进程效果，不是完整 Profile 起动。未提供真实 SSH alias、凭证、服务器和远端 helper，因此 SSH 的握手、digest、远端 FS/进程/沙箱效果、取消及卸载清理未运行。SSH 编译只确认 published 声明接受 HOW-TO 的调用面，不能证明远端环境就绪。SSH cleanup 示例在连接丢失时只记录唯一文件路径供恢复，不宣称远端删除成功。
