# 模型可见委派工具（Host）

## 适用范围与入口

在 `dsh-v0.2.0-rc.1` 中，`@deepseek-ai/dsh-tool-subagent` 根导出 `name`、`inject`、`Config`、`apply`，把一个命名 [Subagent Provider](api-subagent-provider.md) 绑定为模型工具。每个实例必须使用唯一 `toolName`。`@deepseek-ai/dsh-tool-subagent-control` 另行注册全局 `send_message` 与 `interrupt_agent`；其 `./list-agents` 子路径另行提供发现工具。工具属于 Host 插件注册，却在 Agent 模型轮次中可见；没有 `ctx.subagents`、`ctx.tools` 或活跃 Provider 时不能认为工具可用。

## 契约与运行语义

`tool-subagent` 的 `inject = ['tools', 'subagents', 'systemPrompt', 'sessionProjections']`。`apply(ctx, config, session?)` 按 `config.provider` 查询 Provider，校验选择配置，注册工具并随 Provider 注册/移除事件挂载或卸载；返回值为 `void`，注册和监听属于插件 fiber。缺席 Provider 时暂不注册模型工具，后续同名 Provider 出现可重新挂载。前台 one-shot 由内置工具 await `ctx.subagents.start()`、读取 `result` 并在成功或失败后 dispose；后台 one-shot 先经 `jobs` 建普通 Task，收集用作业工具；continuable 后台走 `startContinuable()`，返回稳定孩子 id 而不是立即结果。

模型调用输入至少有 `description: string` 与 `prompt: string`；按配置可有 `run_in_background` 和模型选择字段。规范 JSON 输出是判别联合：`{ kind: 'foreground', runId, output }`、`{ kind: 'background', jobId }`、`{ kind: 'continuable', subagentId }`。`render` 从规范结果生成纯文本；非 `completed` 停止原因作为错误工具结果，诊断与部分输出保持区分。`description` 是短显示标签，不替代给子 Agent 的完整 prompt。工具调用需要 `exec.agent`；非 Agent 调用失败。

## 对象类型与成员

`@deepseek-ai/dsh-tool-subagent/model-selection-settings` 的默认导出是具名 `SubagentModelSelectionConfig` Service 的别名，装载后提供 `ctx.subagentModelSelection.current()`。它返回脱离可变配置的 `SubagentModelSelectionSettings`：`enabled: boolean`、`allowedModels: AllowedModelRoute[]`。本子路径的 `Config.enabled` 与 `Config.allowedModels` 是 `Volatile` 部署默认；`current()` 重新读取并校验，启用却没有允许路由会失败。它只影响新 Session 的工具组合，不能修改既有子 Agent 的模型。`name` 是诊断名，不是模型工具名；`./invariant` 的 apply/inject/name 也只是可选检查插件装载元数据。

`@deepseek-ai/dsh-tool-subagent.name` 是插件诊断名；实例的模型工具名由 `Config.toolName` 决定，不能用这个导出常量替代唯一工具名。

`@deepseek-ai/dsh-tool-subagent` 的公开 `Config`：

| 字段                     | 类型与 Loader 默认                                                | 用途与约束                                                                                                           |
| ------------------------ | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `provider`               | 必填 `string`                                                     | `ctx.subagents` 注册名；缺席时工具等待此 Provider。                                                                  |
| `toolName`               | 可选 `string`；`subagent`                                         | 模型工具全局名；同一组合中的实例必须互异。                                                                           |
| `modelSelectionSettings` | 可选 `boolean`；`false`                                           | 需要额外装载 `@deepseek-ai/dsh-tool-subagent/model-selection-settings` Host 服务；Provider 必须支持 `agentOptions`。 |
| `enableRunInBackground`  | 可选 `boolean`；`true`                                            | false 时工具 schema 不暴露 `run_in_background`，强制后台请求也拒绝。                                                 |
| `backgroundMode`         | `one-shot` 或 `continuable`；默认 `one-shot`                      | one-shot 默认前台；continuable 默认后台且 Provider 必须有 `prepareContinuable`。                                     |
| `agentOptions`           | 可选 `AgentOptions`                                               | 子模型/参数覆盖；要求 Provider 的 `agentOptions` capability。                                                        |
| `persona`                | 可选 `string`                                                     | 子 Agent persona；要求 Provider 的 `persona` capability。                                                            |
| `toolFilter`             | 可选 `{ allow?: string[]; deny?: string[] }`                      | 子工具范围；要求 `toolFilter` capability；配置了空对象会装载失败。                                                   |
| `maxDepth`               | 非负安全整数或 `provider-managed`；省略时读取 Host 当前默认深度 1 | 数值要求 Provider `depthLimit`；`provider-managed` 由子部署自行限制递归。                                            |

`@deepseek-ai/dsh-tool-subagent-control` 根导出 `apply(ctx): void`，`inject = ['tools','subagents']`：`send_message({ agent_id, message })` 把文本交给直接父或 continuable 直接子，输出 `{ messageId: string }` 仅确认 inbox 接收；`interrupt_agent({ agent_id })` 以精确活跃调用 Agent 的祖先权限对活跃后代发取消，输出 `{ accepted: true }` 仅确认请求已接收。调用方不是 Agent 或权限不符会失败。这些工具不负责子 Agent 的恢复、身份或实际静止，归属服务见 [Subagent Provider](api-subagent-provider.md)。

## 生命周期与状态

Provider 注册与工具挂载分离。工具插件 effect 卸载释放工具及监听，Provider 移除会撤下绑定工具；已交付的 one-shot run 或 continuable 孩子按各自 owner 收尾。continuable 创建和 `send_message` 接收身份需要持久 Session 记录才能跨重启恢复；仅观察 UI 或事件不能重建模型可见事实。

## 失败、权限与边界

`maxDepth` 与 Provider 能力不匹配会在配置/装载或调用时明确失败，ACP 后端的正确选择是 `provider-managed`；这不自动强制子进程的深度上限。后台 one-shot 需要 `jobs` 与对应作业工具才能收集；continuable 需要 `agents` 服务及 Provider 创建能力。模型/Provider 切换预检失败、调用信号取消、Provider 热替换和无调用 Agent 都会阻止启动或产生失败工具结果。`send_message` 仅用于 continuable 邻接 Agent，不适用于 ACP one-shot 运行。

## 验证

在合成 Profile 中确认 Provider 与工具配置均生效，然后对前台、后台、Provider 暂时缺席、能力不匹配、取消及卸载分别调用。目标源码中的 `packages/subagent/tool-subagent/tests/tool-subagent.spec.ts` 覆盖这些分支，但本专题未执行；真实 Profile 组合与 ACP 握手仍待运行。`Config` 为直接配置路径，本页不提供 TypeScript 插件代码；[ACP 委派 HOW-TO](how-to-configure-acp-delegation.md) 给出配置、挂载和观察步骤。
