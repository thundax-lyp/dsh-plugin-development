# 七个高量核心包的 API 候选矩阵

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。机器裁决见 [high-volume-core-api-decisions.json](high-volume-core-api-decisions.json)，可用 [生成脚本](generate-high-volume-core-matrix.py) 从本次 `skill-source/api-surface.json` 重建。矩阵只含当前为 `pending` 的 entry、object、member；保留原始 ID、成员签名、源文件、裁决、author-facing owner/section 与源码语义理由，不改共享账本。

本次共 2,286 行：23 entry、793 object、1,470 member。`include` 29 行，`merge` 2,075 行，`exclude` 182 行。`include` 集中在 `dsh-typert-protocol` 根入口的 `TypertLookupMap`、`TypertLookupProvider`、`TypertLookupRegistry`、`TypertContextMap`、`TypertHostContextAdapter`、`TypertClientContextAdapter`、`TypertContextRegistry` 及其待裁决成员；已补 [Remote reference](../../skill-source/api-guardrails/remote-api.md#lookup-与-scoped-context-注册) 的公开注册、解析、覆盖和撤销语义。`./types` 同名 type-only 再导出仍作 `merge`，不复制事实。

| 包 | entry | object | member | 主要路由/排除边界 |
| --- | ---: | ---: | ---: | --- |
| `dsh-llm` | 7 | 232 | 450 | Provider、模型路由、重试计量；`./brand`、`./message`、`./assistant-stream` 合并，生成的 `./remote`/`./typert` 归 Remote assembly。 |
| `dsh-tools` | 3 | 113 | 384 | `defineTool` 和规范执行、纯展示投影；显式 `@internal` scheduler 与 fixture helper 排除。 |
| `dsh-session` | 2 | 96 | 171 | 事件日志、surface 投影、持久恢复；`./fork`/`./surface` 归对应 owner，已标 `@deprecated` 的成员排除。 |
| `dsh-typert-protocol` | 1 | 114 | 183 | Remote lookup/context adapter 纳入；生成 descriptor、codec、wire/registry 帧排除。 |
| `dsh-subagent` | 5 | 76 | 146 | Provider 与父 Agent 权限边界；`./internal` 排除，`./client` 为控制/展示类型再导出。 |
| `dsh-api-gateway` | 2 | 72 | 136 | Gateway/Client Remote 归应用组合；`./stream-protocol` 物理传输帧排除。 |
| `dsh-api-remotes` | 3 | 90 | 0 | 固定 Web BFF assembly 与 owner 包的 Client type-only 再导出，均合并到原 owner，不当动态注册表。 |

`merge` 的含义是归现有任务/owner，不表示可将每个类型别名或帧字段升为一个新插件任务。尤其 `dsh-llm.default` 是 `LlmRuntime` Service 别名，`dsh-api-remotes/client` 的大量符号是所选业务贡献的再导出，`dsh-tools` 的 `ToolRuntimeScheduler`/`ScheduledToolPreparation`/`ScheduledToolDispatch`/`TOOL_RUNTIME_SCHEDULER` 在 `packages/core/tools/src/index.ts` 明确为 `@internal`。`dsh-api-gateway/stream-protocol` 的 parse/project、端点和帧属于物理载体；业务 Remote 使用 Typert 声明和 Client assembly。

核查：运行生成脚本成功；逐行验证非排除 owner 文件和 section 存在、源文件在精确 checkout 存在、ID 无重复，均通过。此矩阵是精确源码/声明审查，没有新跑 Host/Client 编译或 Profile、Gateway、浏览器、Subagent 端到端运行；各专题已记录的独立验证边界仍适用。
