# Shell 执行能力与自定义模型工具

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-shell` 定义 Host `ctx.shell`，`bash-local`、`pwsh-local` 或其 sandbox 变体提供一个执行器；`tool-bash`、`tool-pwsh` 是已有模型工具。插件作者可在已装载的执行器上实现新的受限工具，复用 `ctx.tools.register(defineTool(...))` 的规范结果契约；见[添加固定命令工具](how-to-add-shell-tool.md)。不要同时装载两个 `ctx.shell` Provider。

## 公开对象与成员

| 入口                          | 语义                                                                                                                                                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ShellExecutor` / `ctx.shell` | `resolve(ShellExecRequest): ShellExecSpec` 应用实现的默认值与上限；`execute(spec): Promise<ShellExecution>` 在准备/发布后返回 handle；`sandboxMode` 表示默认 confinement 事实或 `undefined`。              |
| `ShellExecRequest`            | `command`；可选 `workdir`、`timeoutMs`、`onExpiry`、`stdoutMaxBytes`、`signal`、`stdin`、`env`、受控 `dshEnv`、已解析 sandbox policy。普通环境经过 subprocess 凭据清洗后合并；调用方不能伪造托管 `DSH_*`。 |
| `ShellExecution`              | `done` 永不拒绝，`readOutput()` 增量且可能 lossy，`observed` 有非消费 offset reader，`kill()` 幂等；`result()` 在进程关闭后给前台 `ShellRunResult`。                                                       |
| `ShellRunResult`              | `exitCode`、`signal`、`timedOut`、`aborted`、`timeoutMs`、有截断/溢出路径的 `stdout`/`stderr`，可能有 `sandbox` 事实。非零退出与超时/取消是正常结果，不是基础设施异常。                                    |
| `tool-bash` Config            | `enableRunInBackground`、`promoteOnTimeout`；有 `jobs` 时后台调用及超时提升可用，无 registry 时前台超时杀进程。                                                                                            |

前台调用应传 `exec.signal`、设置有限超时，`await execution.result()` 到进程停稳后才返回一份规范 JSON 值。渲染使用纯函数；不能把未持久化的实时 stdout 当成已提交模型事实。Backend 所拥有的进程范围在 `ctx.subprocess` 组合卸载时被杀并 join；单独重载 shell 执行器不保证杀掉已归属该范围的后台进程。若工具需要后台句柄、job id、等待/停止语义，须组合 `@deepseek-ai/dsh-jobs`，不能自己把一个进程 handle ID 当成持久 Job。

`@deepseek-ai/dsh-bash-sandbox`、`dsh-pwsh-sandbox` 与 `dsh-pwsh-local` 是三种具体 `ShellExecutor` 提供方，前两者通过 `ctx.sandbox` 包装命令，后者用本机 PowerShell/subprocess。Profile 只应选择与平台和 policy 匹配的一种 `ctx.shell` 提供方。`@deepseek-ai/dsh-tool-pwsh` 是消费 `ctx.shell` 与 `ctx.shellEnv` 的模型工具，不是新的 executor registry；新增自有 Shell 行仍按本页的 Executor 与工具所有权组合。

## 权限、失败与恢复

普通 `bash-local` 不提供沙箱；`bash-sandbox`/`pwsh-sandbox` 由部署配置和平台能力强制策略。`tool-bash` 的升级字段只在相应沙箱 Provider 与 policy service 都存在时生效。自定义工具必须在执行前自行限制命令形态、工作目录、调用者身份和可选升级权限，不能因为复用了 `ctx.shell` 就默认获得现有 `bash` 工具的审批规则。固定命令示例仍要求可信 Session `cwd`，并让配置的 shell Provider 处理取消/超时。

模型工具输出有且只有一份规范 JSON 值；`output.render` 从该值生成可见文本。工具注册归插件 fiber，卸载即移除；执行中的异步工作仍须等待 quiescence 或传播取消。失败测试要分别覆盖 spawn 失败、非零退出、超时、取消、沙箱拒绝和 Provider 卸载。

## 验证

以目标 tag 声明编译并在隔离子进程 Backend 中运行固定命令，检查结果、取消和卸载；另在实际 Profile 验证 Agent scope、工具可见性、审批与沙箱。直接执行 `ToolDefinition.execute` 的单进程 smoke 不能证明完整 ToolRuntime 调度和权限管线。
