# 模型 Shell 的受管环境变量扩展

## 入口与目标

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。`@deepseek-ai/dsh-shell-env` 公开 `ShellEnvRegistry`（`ctx.shellEnv`）、`BashEnvContributor`、`BashEnvVariable`、`BashEnvVariableInfo` 与 `Config.dshHome`。它供插件为每次模型 shell 工具执行注入可信、可枚举的 `DSH_*` 环境事实；模型工具 `tool-bash`、`tool-pwsh` 消费快照。完整注册和卸载例见[提供模型 Shell 环境事实](how-to-contribute-shell-environment.md)。Shell 命令执行契约见[Shell 工具](api-shell-tool.md)。

## 对象与成员

`name = 'shell-env'`、空 `inject` 和 `apply(ctx, config)` 是本包的 Cordis 插件装载面；`Config.dshHome` 可选，只设置内置 Home 解析。`BashEnvVariable` 的 `description` 是每个声明键的模型可见说明，不承载该键的运行时值。

`BashEnvContributor` 必须声明非空唯一 `name`、完整的 `variables` 键及每键非空 `description`，并实现同步 `resolve(execution: ToolExecution)`。可声明的键须为 `DSH_` 加大写字母开头的 `[A-Z0-9_]*` 后缀；`DSH_HOME`、`DSH_SHELL`、`DSH_SESSION_ID`、`DSH_PROFILE`、`DSH_PROFILE_DIR` 等内置键不可抢占。`resolve` 只返回本 contributor 已声明键的字符串子集，未知键或非字符串立即失败。`BashEnvVariableInfo` 是 `list()` 输出的 `{contributor,key,description}`；列表只含插件贡献，不含注册表内置键。

`ShellEnvRegistry.register(contributor): () => void` 在调用插件 fiber 内登记唯一贡献者和键所有权；显式 disposer 或 fiber 卸载撤回贡献。`list()` 枚举声明而不运行 resolver；`collect(execution)` 每次 shell 工具调用重建并冻结有序 `DshEnvironment`，包含 `DSH_HOME`/`DSH_SHELL`，若有 live agent/profile 再加入身份与路径事实，最后按 contributor 名排序调用各 `resolve`。resolver 抛错会使该次 collect 失败，不能当作空贡献吞掉。注册时不会缓存值，故须把 resolver 写成同步、廉价且不泄露凭据的函数。

`Config.dshHome?` 只控制内置 `DSH_HOME` 的解析。普通 ambient `DSH_*` 在 shell executor 中被丢弃，受管快照在每次工具调用重新注入；不能借本注册表向模型 shell 传秘密。若 shell 执行器直接由另一个 API 调用而非 `tool-bash`/`tool-pwsh`，调用方是否使用 `shellEnv.collect` 取决于自己的组合，不能由注册成功推断已注入该进程。`ctx.shellEnv` 也不提供 Session 日志持久化；模型需跨重启看见的规范事实应由 Session 事件拥有。

## 验证边界

独立 rc.1 npm 消费包已编译并在真实 Cordis registry 上验证声明列举、一次 `collect`、内置 `DSH_HOME` 和 contributor fiber 卸载后消失。测试给 `collect` 传无 Agent 的结构桩，未调用模型 shell 工具、子进程、Profile 身份或 Session 恢复。
