# SystemPrompt 章节与运行上下文

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1` 的 Host 插件从 `@deepseek-ai/dsh-system-prompt` 根入口使用 `SystemPrompt`、`PromptSection`、`PromptContext`、`AssembleContext`、`PromptAssembly` 和渲染函数。base bundle 装载 `ctx.systemPrompt`；自定义 Profile 应先装载 service，贡献插件声明 `inject = ['systemPrompt']`。本文拥有系统提示章节、变量和动态上下文的公开 API 契约；完整包见 [贡献模型上下文](how-to-contribute-runtime-context.md)。

## 选择持久化边界

`ctx.systemPrompt.section()` 贡献 system-role 提示文字，适合稳定的行为指导；`ctx.systemPrompt.context()` 贡献随组装变化的模型可见运行上下文。AgentLoop 在每个模型步渲染 `renderContextSections(assembly)`，经 `RuntimeContextProjection` 写入 Session 中 `user/message`、`source.kind='runtime-context'`、`source.form='snapshot'` 的事件；内容变化才新增快照，变空时写清除标记，恢复可从 Session 日志重建。直接调用 `assemble()` 或渲染函数只计算结果，**不会自己写 Session**。如某事实必须成为任务历史，应使用负责该事实的 Session 写入路径，不把它只留在进程内 callback 中。

内置 `agent-instructions`、`time-context`、`session-reference` 是各自的功能包和工作流，不是 `SystemPrompt` 的注册类别。前两者在 `agent/pre-step` 等路径产生模型可见消息；文件引用插件有自己的解析/提示路径。组合时保持各包自身的所有权；自定义通用提示章节和运行快照使用本文公开注册面。

## 公开成员

| 成员                                              | 输入与语义                                                                                                                                                                                                       |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SystemPrompt`                                    | 固定 `ctx.systemPrompt` Service；下列注册、组装和作用域成员由它提供，不是可多次注册的 Provider 槽。                                                                                                              |
| `ctx.systemPrompt.section(PromptSection)`         | 必需 `name`、有限 `order`、`text: string \| (AssembleContext => string)`；可选 `interpolate`（默认 true）、`complete`（默认 false）。按 order 升序，同序按 code-unit 名字排序。返回精确 Cordis effect disposer。 |
| `ctx.systemPrompt.context(PromptContext)`         | 必需 `name`、有限 `order`、`text`；空文本不贡献模型快照。返回 disposer。                                                                                                                                         |
| `ctx.systemPrompt.variable(name, provider)`       | 名称匹配 `[a-z][a-z0-9_]*`；provider 每次组装返回 `string \| undefined`。返回 disposer。                                                                                                                         |
| `ctx.systemPrompt.assemble(context?)`             | 异步得到 `{sections,contexts,tools,variables}`；`AssembleContext` 有可选 `scope`、`signal`，也可由插件扩展字段。组装本身不提交 Session。                                                                         |
| `renderPrompt(assembly)`                          | 严格替换章节中的 `{{name}}`，过滤空章节，双换行连接；未知、未定义或畸形引用抛错。`interpolate:false` 保留字面量。                                                                                                |
| `renderContextSections(assembly)`                 | 严格替换变量，返回非空 `{name,text}` 项；`joinContextSections(sections)` 生成带当前快照标记的模型文字；`renderContextSnapshot(assembly)` 是组合便利函数。                                                        |
| `getSectionOrder(name)` / `getContextOrder(name)` | 获取仓库中央分配的已导出位置名称对应数值；插件自己的位置可使用有限数值。                                                                                                                                         |
| `suppressRuntimeContext()`                        | 当前 scope 中隐藏全部动态 context，返回 disposer；不改变拥有或执行事实的服务，也不关闭静态 section。                                                                                                             |
| `tools(provider)`                                 | 每次组装贡献 `{schemas,knownNames?}`；主要供工具服务使用，工具执行权限不由提示文字授予。                                                                                                                         |

同层的 `section`、`context`、`variable` 名称重复抛错；近 scope 的同名项遮蔽远 scope 与全局项。注册和卸载发 `system-prompt/change`。section 的 `complete:true` 表示该作用域的唯一完整 system prompt；多个有效 complete 项使组装失败，waterfall 无法替换其最终章节。`system-prompt/assemble` 是专家 waterfall，当前返回值会影响章节、上下文、工具和变量；需要明确生命周期与作用域，普通贡献优先用注册方法。`system-prompt/change` 是无 scope 过滤的通知，观察者应重新组装自己的 scope。

## 失败、权限与清理

注册放在插件 `apply` 中，disposer 由 Cordis fiber 管理；插件卸载撤销贡献。callback 应同步、确定且无副作用，因为每个模型步都可能调用；动态值更新后通知使用者所需的服务事件，但不要把 `system-prompt/change` 误当作 Session 记录。提示文字不赋予文件、网络或工具权限，真实权限由对应服务强制。`includeRuntimeContext:false` 和 `suppressRuntimeContext()` 只隐藏快照文字，不能代替策略执行。

## 证据与验证

公开导出、注册、组装与渲染：`packages/core/system-prompt/src/index.ts`；行为测试：`packages/core/system-prompt/tests/system-prompt.spec.ts`。AgentLoop 写入与恢复：`packages/core/agent-loop/src/agent.ts`、`runtime-context.ts`。隔离消费包对发布声明编译并执行 service 级组装、渲染、卸载 smoke，记录于创建工作区 `evidence/runtime/skill-context-review.md`；真实 AgentLoop/Profile/Session 恢复未在该隔离测试中运行。
