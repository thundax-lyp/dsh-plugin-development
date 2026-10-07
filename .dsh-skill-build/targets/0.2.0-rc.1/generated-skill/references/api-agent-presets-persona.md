# Agent Preset 与范围内 Persona

## 公开入口

目标 `dsh-v0.2.0-rc.1` 的 `@deepseek-ai/dsh-agent-preset-registry` 提供 `AgentPresetRegistry` Service，`ctx.agentPresets.register(PresetDefinition)` 是独立插件作者提交 preset 的注册入口。`@deepseek-ai/dsh-agent-preset` 是声明式 Cordis row，将配置交给该注册入口；`@deepseek-ai/dsh-persona` 是只应作为 Agent preset 子 row 装载的 persona。完整配置任务见 [声明带 Persona 的 Agent Preset](how-to-declare-agent-preset-persona.md)。三包都是已发布 root 入口；不能把目录中的技能文件或预设示例当作通用 API。

`PresetDefinition` 包含必需的非空 `id` 和 `plugins` 子 entry 列表，可带 `name`、`description`、`order`。Registry 需要 `loader`、`sessionProjections`；`register` 异步激活一个独立 scope，返回异步 disposer。重复 ID/空 ID 拒绝；子 entry 无效或装载失败会在 roster 中留下 `broken` 诊断，`resolve` 可读到，但 `mount`、`acquireScope` 无法使用。`list` 返回按 order/id 排序的声明，`remoteExportList` 标记默认项；`defaultId` 读取配置中的当前选择。不要在 Host row 自己激活过程中调用需要等待 Host Loader settle 的 `list/resolve`，可能形成等待环。

预设修订有租约：卸载定义后旧 Agent 仍保留正在使用的 revision，最后使用者释放后才回收；新 Agent 不再选择已撤销 ID。`mount(ctx,id?)` 只适用于未发布 Agent 的 scoped context，`composeFrom` 让子 Agent 继承父 scope；`select(agent,id)` 仅在 Session 首个 turn 前允许，成功后写入持久 `agent-preset/selected` 事件，已开始对话返回 `agent-preset/locked`。`serviceFor` 读取某 Agent 私有 preset group 内的服务，不应从全局 Context 猜测该服务。`readDocument` 是声明视图，包含子 plugin 配置；其中可能有受保护配置，需按宿主访问控制暴露。

`dsh-persona` 根入口导出 `name`、`inject`、`Config`、`apply` 和 persona section 常量；配置 `prefix` 必需，`suffix` 可选，`complete` 可把 prefix 变成完整 system prompt，`includeRuntimeContext:false` 抑制动态上下文。它向 `systemPrompt` 注册与部署 persona 同名的两个 section，以 Agent scope 的注册遮蔽部署默认。直接在全局 scope 挂载会和 SystemPrompt 自有 section 冲突并失败。Prompt 模板的 `{{…}}` 只插值已注册变量；空 suffix 会遮蔽部署 suffix。Session 事实与插件可见上下文的持久性仍由各服务自己的日志/投影负责；改变 persona 不是改变历史对话。

`AgentPresetRegistry.defaultId` 是当前配置选定的默认 preset ID；调用方仍需通过 `resolve` 或 `mount` 检查这个 ID 对应的声明状态。

## 对象类型与成员

`AgentPresetRegistry.defaultId` 是当前配置的默认 preset ID；需再经 `resolve` 或 `mount` 验证声明可用。

| 公开对象                  | 可用成员与边界                                                                                                                                                                                                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AgentPresetRegistry`     | `register`、`list`、`resolve`、`remoteExportList`、`readDocument` 管理声明/目录；`mount`、`composeFrom`、`composedPreset`、`serviceFor` 操作 Agent scope；`select` 首轮前持久选择；`recompose` 仅空 Agent，`acquireScope` 提供修订租约，`compositionInventory` 给可诊断的子 row 视图。 |
| `PresetDefinition`        | `id`、`plugins` 必需，可选 `name`、`description`、`order`；子 entry 由 Loader 解析并装入隔离 scope。                                                                                                                                                                                   |
| `AgentPreset`             | 根导出元数据 `id`、可选 `name`、`description`、`order`、`broken`；`broken` 表示声明存在但无法组装。                                                                                                                                                                                    |
| `dsh-agent-preset.Config` | 与 `PresetDefinition` 同形，供声明式 row 使用；`plugins` 是子插件列表。                                                                                                                                                                                                                |
| `dsh-persona.Config`      | `prefix` 必需；`suffix`、`complete`、`includeRuntimeContext` 可选；只在 Agent scope 使用。                                                                                                                                                                                             |

源码：`packages/preset/agent-preset-registry/src/{index,definition,mount,preset,session}.ts`、`agent-preset/src/index.ts`、`persona/src/index.ts` 及测试。独立发布包验证见 `evidence/runtime/agent-presets-persona-review.md`。
