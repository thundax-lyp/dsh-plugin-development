# ACP 子进程委派后端（Host）

## 适用范围与入口

`@deepseek-ai/dsh-subagent-acp` 根导出的 Cordis 插件 `name`、`inject`、`Config`、`apply` 把一个命名 Provider 注册到 [Subagent 服务](api-subagent-provider.md)。它在 Host 为每次 **one-shot** 委派启动一个独立 ACP Agent 子进程。父进程只把任务和选定工作目录传过去；孩子自己的进程决定模型、工具、Session 与权限。该后端不在基础 bundle 默认挂载，需要明确在 Profile 中装载。如何配置见 [配置 ACP 委派](how-to-configure-acp-delegation.md)。

不要把本包与 `@deepseek-ai/dsh-acp` 混淆：后者是将 DSH Agent 作为 ACP stdio **服务器** 的另一插件，`acp` Profile 使用它。本包作为 ACP **客户端** 驱动一个子进程。外部 ACP Agent 是否兼容，还须按其实际协议和行为验证。

## 契约与运行语义

插件 `inject = ['subagents', 'subprocess']`，其 `apply(ctx, config)` 在装载时注册一个 `AcpProvider`。`providerName` 默认 `acp`；该 Provider 的 `inheritsParentContext = false`，五项 one-shot capability 都是 `false`，也没有 `prepareContinuable`。因此：

- `tool-subagent` 配置 `maxDepth: provider-managed`，否则默认 Host 深度上限要求 `depthLimit`，装载时会报错。递归限制须由子 ACP Agent 的部署自行负责。
- 不给此工具配置 `agentOptions`、`persona`、`toolFilter`、`modelSelectionSettings: true` 或 `backgroundMode: continuable`。这些能力在 Provider 挂载验证或启动时被拒绝。
- `backgroundMode: one-shot` 可使用前台结果，或在允许 `run_in_background` 时使用普通 Task 收集；这不是可通过 `send_message` 恢复对话的 continuable 孩子。

启动时若未配置 `cwd`，从父 Session header 读取工作目录，缺失或不可进入则在发布前失败；显式 `cwd` 在装载时相对进程启动目录解析并验证目录可进入，空串拒绝。ACP 初始化与新会话成功之后才发布 run。后端将委派 prompt 中的文本块送入 ACP，非文本块不会作为子 Agent prompt 传递。发布前失败由后端负责清理；发布后结果以 `stopReason` 和可选安全诊断交给持有者，持有者最终 `dispose()`。父 Session 不继承子 Session 日志，不应把子进程内部工具执行当作可从父日志重建的事实；父侧模型可见的委派结果仍走委派工具的规范输出。

## 对象类型与成员

`name = 'subagent-acp'` 是 Cordis 插件身份，`inject = ['subagents', 'subprocess']` 是装载依赖，`apply(ctx, config)` 是 Profile 装载时的注册函数。这三项是已发布插件的组合入口，不是供外部实现的独立 ACP 协议扩展接口。

`Config` 是 Host 插件输入，经 Schemastery 在 Loader 路径补默认值：

| 字段                | 类型与默认                          | 含义及失败边界                                                                                     |
| ------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------- |
| `providerName`      | `string`；`acp`                     | `ctx.subagents` 注册名；冲突时注册失败。                                                           |
| `command`           | 必填 `string`                       | 每次运行启动的 ACP Agent 可执行文件；spawn/handshake 失败不发布 run。                              |
| `args`              | `string[]`；`[]`                    | 传给 `command` 的参数。                                                                            |
| `cwd`               | 可选 `string`；省略时父 Session cwd | 子进程和 ACP 会话目录；明确空串、非目录、不可进入目录会失败。                                      |
| `permission`        | `reject` 或 `allow`；默认 `reject`  | 自动拒绝，或选择首个 `allow_once` / `allow_always` 选项；不会向人展示审批。                        |
| `env`               | `Record<string, string>`；`{}`      | 叠加到已擦除凭据形状的父环境上的显式子进程变量。凭据须由部署显式传入，避免把父环境透传当作已授权。 |
| `disposeEofGraceMs` | 可选 `number`；Loader 默认 `6000`   | 发 EOF 后等待子进程自行静止的窗口，须是 `0 < n <= MAX_TIMER_DELAY_MS` 的有限数。                   |
| `disposeGraceMs`    | 可选 `number`；Loader 默认 `3000`   | 失败观察和终止升级宽限，同样受正有限数与定时器上限约束。                                           |

## 生命周期与状态

每次 start 创建独立子进程与 ACP 会话，成功返回才转移 run 归属。`dispose()` 幂等，先尝试 EOF 协作退出，再按宽限进行进程终止升级。注册此 Provider 的 Cordis effect 卸载时停止接受新 run；已发布 run 仍需持有者释放。ACP 子会话独立持久化与否由子 Agent 部署决定；父服务不提供它的 continuable 恢复。

## 失败、权限与边界

配置错误、父工作目录缺失、spawn/initialize/newSession 失败发生在发布前。发布后的 prompt/transport/早退故障通常成为 `stopReason: 'error'`，取消成为 `aborted`；可保留部分 assistant 文本。后端诊断刻意限制在固定类别/阶段信息，不含 stderr、环境变量、原始协议包或任务内容。`permission: allow` 会自动批准子进程请求的可用允许选项，只有在部署明确接受该策略时使用；这与 DSH 父进程的工具权限不共用。

## 验证

先检查 Profile 合成配置中存在 Provider 与绑定工具两行，再由真实父 Agent 发出一次委派，观察子进程启动、前台结果与父侧规范工具结果；分别用无效命令、无 cwd、取消信号和 Profile 卸载验证失败与清理。目标版本有 ACP 后端单元测试和 Loader 组合测试，但本专题没有运行真实独立消费 Profile 或外部 ACP Agent 握手；协议互通仍是独立验证项。
