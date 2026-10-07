# 应用插件的命令行参数

## 适用范围与入口

本页锁定 `dsh-v0.2.0-rc.1`、commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。`@deepseek-ai/dsh-cmdline` 让 DSH launcher 将自己的 `--profile`、`--patch` 等选项之后的原始参数交给应用插件。应用插件可以用 `commander` 声明自己的 flag，再把解析结果作为自有 Cordis 服务提供给下游行。完整示例见[提供应用命令行选项](how-to-add-app-command-line-option.md)。普通无命令行的 Host 插件不需要此入口。

## 公开对象与成员

| 入口                                     | 契约和所有权                                                                                                                                                                                                           |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CmdlineArgs.get()`                      | `ctx.cmdlineArgs` 中的只读、按 argv 原顺序保存的应用参数快照。由 launcher 在 Loader 树挂载前通过 `provideCmdline` 提供。                                                                                               |
| `parseCmdline(ctx, program)`             | 用应用自己的 Commander `Command` 解析快照。program 或子命令必须至少声明一个 action；成功时 action 同步运行。语法、help、version 或 action 中的 `program.error()` 请求 `ctx.appExit(code)`。非 Commander 异常继续抛出。 |
| `provideCmdline(ctx, host: CmdlineHost)` | 嵌入式 launcher 的启动入口；`host.args`、`host.exit` 必需，`host.ready` 可选。普通应用插件消费服务，不再次提供。                                                                                                       |
| `AppExit`                                | 请求在 Loader 树清理后按退出码结束；不是直接 `process.exit`。                                                                                                                                                          |
| `AppReady.onReady(listener)`             | 启动成功提交后调用，返回取消待运行监听的 disposer。                                                                                                                                                                    |
| `exitOnStdinEnd(ctx, label)`             | 只供已接受调用的 stdio 应用使用；stdin EOF 需等成功启动后再请求有界退出，effect 清理监听。Web/普通 CLI 插件无需调用。                                                                                                  |

应用 command action 先验证参数，再 `ctx.provide()` 自己拥有的服务；`program.error()` 之前发生的副作用不会自动回滚。子插件通过 `inject` 依赖这份服务，并可在 Loader `!!js` 表达式中读取。Help、version 和失败解析不会发布服务，也不应启动传输。插件卸载时，Cordis 负责撤销由该 fiber 提供的服务。`parseCmdline` 本身不负责保存 Profile 配置或 Agent Session 事实。

## 验证与边界

独立 npm 消费包使用精确版本的 `@deepseek-ai/dsh-cmdline@0.2.0-rc.1`、`@deepseek-ai/cordis@4.0.4` 和 Commander；TypeScript 编译及 Node/Cordis 运行通过：`--port 4217` 被应用 action 解析并提供服务，卸载后服务不可读。未在完整 DSH Profile、真实 launcher、帮助与错误退出、stdio EOF 或 Client UI 中运行。依据 `packages/boot/cmdline/src/index.ts` 的导出、注释与实现，以及该包测试。
