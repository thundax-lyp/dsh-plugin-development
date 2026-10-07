# Skill Provider 与 SystemPrompt 扩展核查

## 目标与范围

- 精确 tag：`dsh-v0.2.0-rc.1`；checkout commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。
- 对象：Host 插件可用 `@deepseek-ai/dsh-skill`、`@deepseek-ai/dsh-system-prompt` 根入口，及两者在 AgentLoop 中的消费边界。
- 作者文档：`skill-source/api-guardrails/skill-providers.md`、`system-prompt-context.md`；`skill-source/how-to/how-to-register-skill-provider.md`、`how-to-contribute-runtime-context.md`。
- 隔离消费包：`evidence/tests/skill-context-consumer/`。

## 公开契约与候选账本

| 候选 ID | 公开成员或路径 | 来源与裁决 | 文档归属 |
| --- | --- | --- | --- |
| `skill.provider.registration` | `SkillRegistry.registerProvider`、`SkillProviderControl`、`SkillProvider` | `packages/skill/skill/src/index.ts`；同步注册，异步 list/get，控制信号和 invalidate，作用域及 effect 卸载；`skill.spec.ts` 核验 | `api-skill-providers.md` |
| `skill.provider.candidate` | `SkillCandidate`、`SkillProviderObservation`、`SkillLookupOptions` | 同源；候选校验、排名、scope、complete 缓存语义 | `api-skill-providers.md` |
| `skill.provider.definition` | `SkillDefinition`、`SkillResourceBase`、`SkillInvocationPolicy`、`renderSkillContent` | 同源；get 与内容渲染，调用受众独立 | `api-skill-providers.md` |
| `skill.runtime-registration` | `SkillRegistry.register`、`SkillRegistration` | 同源；单个运行中定义的替代路径、first-wins 冲突 | `api-skill-providers.md` |
| `system-prompt.section` | `SystemPrompt.section`、`PromptSection`、`getSectionOrder` | `packages/core/system-prompt/src/index.ts`；有序章节、complete、scope、disposer | `api-system-prompt-context.md` |
| `system-prompt.context` | `SystemPrompt.context`、`PromptContext`、`getContextOrder`、`suppressRuntimeContext` | 同源；动态 context 与 suppress，AgentLoop 的 Session snapshot 投影 | `api-system-prompt-context.md` |
| `system-prompt.variable-assembly` | `variable`、`assemble`、`PromptAssembly`、`AssembleContext`、`system-prompt/assemble`、`system-prompt/change` | 同源；严格变量和 waterfall；直接组装不提交 Session | `api-system-prompt-context.md` |
| `system-prompt.render` | `renderPrompt`、`renderContextSections`、`joinContextSections`、`renderContextSnapshot` | 同源与 `packages/core/agent-loop/src/agent.ts`/`runtime-context.ts`；渲染与持久化职责分离 | `api-system-prompt-context.md` |
| `system-prompt.tools` | `SystemPrompt.tools`、`ToolProviderResult` | 同源；供工具服务贡献 schema，权限不来自提示 | `api-system-prompt-context.md` |

内置 `agent-instructions`、`time-context`、`session-reference`、`file-reference-local` 的名字只用于指出具体内置组合路径；未将它们的私有实现列为通用插件接口。`ctx.systemPrompt.section/context` 与 `ctx.skills.registerProvider` 才是本专题给插件作者的公共注册面。

## 独立验证

在隔离消费包中以发布的 `@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/dsh-skill@0.2.0-rc.1`、`@deepseek-ai/dsh-system-prompt@0.2.0-rc.1` 安装依赖；执行 `npm run build`、`npm run smoke`、`npm pack --dry-run --json`。观察结果：TypeScript 声明编译通过；真实 Cordis service 中注册 provider、列出/读取定义、组装并渲染章节与 context、卸载后查询消失通过；pack 仅列 `lib`、patch 与 manifest 通过。该消费包用一个插件组合两条路径，HOW-TO 分别给出可独立复制的最小包。

本次没有启动 DSH Profile、AgentLoop 模型步、Session log 恢复或真实动态文件/网络 provider。AgentLoop snapshot 行为来自目标源码和既有行为测试定位，不把 service 级 smoke 当作端到端持久化证明。
