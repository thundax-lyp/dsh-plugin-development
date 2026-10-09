# Host 核心独立裁决建议

目标：`dsh-v0.2.0-rc.2` / `639ed015397290b3745d163aafe02ffee4aa3f84`。只使用本次目标 checkout 的代码、声明和教程；机器记录见 `recommendations.json`。这里是分组建议，不等于共享 `coverage.json`、`api-surface.json` 已裁决。

| 候选 ID | 公开入口与对象 | 主要证据（checkout 相对路径） | 任务 ID | 建议及理由 |
| --- | --- | --- | --- | --- |
| `export:@deepseek-ai/cordis:.`、`package:@deepseek-ai/cordis` | `Context`、`Plugin`、`Service`、`Fiber`、`RegistryService` | `vendor/cordis/package.json` 的包根 export；`vendor/cordis/src/index.ts` 的重导出；`context.ts`、`registry.ts`、`service.ts`、`fiber.ts`、`reflect.ts` 的实现；`docs/user/develop/framework/service.zh.md` 的组合路径 | `provide-host-service`、`register-host-tool` | 纳入。插件作者直接接收 `Context`，声明依赖、注册服务及工具；fiber 决定资源所有权。`Context` 生成声明合并了大量其他包的键，不能把全部键当作 Cordis 核心或默认已装载的服务。 |
| `export:@deepseek-ai/dsh-tools:.`、`package:@deepseek-ai/dsh-tools` | `defineTool`、`DefineToolOptions`、`ToolDefinition`、`ToolRuntime`、`ToolExecution`、`ToolRunContext`、`Config` | `packages/core/tools/package.json`、`src/index.ts`、`src/schema.ts`、`README.zh.md`、`docs/cookbook/adding-a-tool.zh.md`、`docs/user/develop/basic/tool.zh.md` | `register-host-tool` | 纳入。包根公开类型和实现共同定义注册、参数验证、规范结果、模型渲染、取消与注销。Web 卡片有独立 Client 路径，不能从 Host presenter 推出专用卡片已呈现。 |
| `export:@deepseek-ai/dsh-tool-todo:.` | 内置 Todo 工具 | `packages/todo/tool-todo/src/index.ts` | `register-host-tool` 的实现旁证 | 本组不作为基础 API owner。它演示 `inject = ['tools']`、`defineTool`、Session 投影与注册，但 Todo 的业务接口另行裁决。 |
| `export:@deepseek-ai/dsh-cordis-host-runner:.` | 动态 Host definition 与 Inspect | `packages/extensions/cordis-host-runner/src/index.ts`、包 README | 独立动态插件任务 | 不并入本组；该入口有独立的 Host/Client 审批、运行和会话边界，应由跨侧任务单独拥有。 |
| `export:@deepseek-ai/dsh-agent:.`、`package:@deepseek-ai/dsh-agent` | `Agent`、`AgentRegistry`、`AgentHandle`、创建/恢复选项 | `packages/core/agent/src/index.ts`、`runtime-types.ts`、包 README | `scope-agent-capability` | 纳入。插件可经 `agent.ctx` 限定注册；创建/恢复返回拆除句柄，但必须有驱动器工厂。 |
| `export:@deepseek-ai/dsh-agent-loop:.`、`package:@deepseek-ai/dsh-agent-loop` | `AgentLoop` 与启动配置 | `packages/core/agent-loop/src/index.ts`、包 README | `scope-agent-capability` 的装载前置 | 纳入。它是默认的实际 factory/driver，不能把仅有 AgentRegistry 误写成可创建 Agent。 |
| `export:@deepseek-ai/dsh-commands:.`、`package:@deepseek-ai/dsh-commands` | `CommandDefinition`、`CommandInvocation`、`CommandRuntime`、结果与 descriptor | `packages/interaction/commands/src/index.ts`、`types.ts` | `register-host-command` | 纳入。插件注册供 UI 执行的命令，生命周期写入 Session；模型工具不代替它。 |
| `export:@deepseek-ai/dsh-session:.`、`package:@deepseek-ai/dsh-session` | `Session`、`SessionStore`、事件映射 | `packages/core/session/src/index.ts`、`types.ts`、`surface.ts` | `record-host-session-fact` | 纳入。插件可追加可回放事实、组合投影与持久屏障；已弃用的同步事件读取成员不进入常规指南。 |
| `export:@deepseek-ai/dsh-session-projection:.`、`package:@deepseek-ai/dsh-session-projection` | `ProjectionDefinition`、`SessionProjectionRegistry` | `packages/session/session-projection/src/index.ts`、包 README | `record-host-session-fact` | 纳入。领域插件可把事件折叠成 Host 当前状态和可选 Client 快照；它与 Session message projection 是不同接口。 |
| `export:@deepseek-ai/dsh-llm:.`、`package:@deepseek-ai/dsh-llm` | `LlmAdapter`、`LlmRuntime`、注册句柄 | `packages/llm/llm/src/index.ts`、`docs/cookbook/adding-an-llm-adapter.zh.md` | `register-llm-adapter` | 纳入。自定义 provider route 和流式模型协议是公开扩展点；`StreamChunk` 联合与真实 wire 仍需单独验证。 |
| `export:@deepseek-ai/dsh-system-prompt:.`、`package:@deepseek-ai/dsh-system-prompt` | `SystemPrompt`、`PromptSection`、`PromptContext` | `packages/core/system-prompt/src/index.ts`、包 README | `register-host-prompt-section` | 纳入。段落、动态上下文和变量可按 Agent 作用域注册并随 fiber 清理。 |
| `export:@deepseek-ai/dsh-user-approval:.`、`package:@deepseek-ai/dsh-user-approval` | `ApprovalService`、`ApprovalRequest`、结果 | `packages/interaction/user-approval/src/index.ts`、包 README | `guard-host-tool-execution` | 纳入。仅 open turn 能审计批准请求；只有 `allowed-once` 是授权，文本提示不能代替执行门禁。 |
| `export:@deepseek-ai/dsh-credentials:.`、`package:@deepseek-ai/dsh-credentials` | `CredentialRef`、`CredentialKey`、`CredentialProvider` | `packages/credentials/credentials/package.json`、`src/index.ts`、`src/types.ts` | `manage-host-credential` | 纳入。插件可通过引用解析密钥，或按插件拥有的 key 存储并轮换记录；具体 provider 的装载须另查。 |
| `export:@deepseek-ai/dsh-authorization:.`、`package:@deepseek-ai/dsh-authorization` | `AuthorizationFlow`、`AuthorizationSession`、`AuthorizationService` | `packages/credentials/authorization/package.json`、`src/index.ts`、`src/types.ts` | `register-host-authorization-flow` | 纳入。插件公开注册人机授权 flow；必须调用本次 `session.commit(record)` 才能满足授权服务的提交确认。 |
| `export:@deepseek-ai/dsh-session-persistence:.`、`package:@deepseek-ai/dsh-session-persistence` | `SessionPersistence`、`SessionHandle`、`SessionPersistenceSnapshot` | `packages/session/session-persistence/package.json`、`src/index.ts`、`src/handle.ts` | `provide-session-persistence` | 纳入。第三方存储后端可实现 create/open/flush/stat/list 和单写者句柄契约；此处不假定默认 Profile 选择它。 |
| `export:@deepseek-ai/dsh-host-directory-picker:.`、`package:@deepseek-ai/dsh-host-directory-picker` | `DirectoryPicker`、能力判别联合、目录条目与错误 | `packages/host/directory-picker/package.json`、`src/index.ts`、`src/types.ts`、`README.zh.md` | `provide-directory-picker` | 纳入。第三方 Host backend 可提供 native 或 browse 能力；Web 消费端还需独立组合。 |
| `export:@deepseek-ai/dsh-compaction:.`、`package:@deepseek-ai/dsh-compaction` | `CompactionEngine`、触发、结果、checkpoint 标识 | `packages/compaction/compaction/package.json`、`src/index.ts`、`src/types.ts`、`README.md:49` | `provide-compaction-backend` | 纳入。公开抽象 Service 支持第三方摘要 backend，具体 backend 必须保证日志 bracket、surface 替换和恢复。 |
| `export:@deepseek-ai/dsh-session-title:.`、`package:@deepseek-ai/dsh-session-title` | `SessionTitleService`、`SessionTitleProvider`、输入与结果 | `packages/session/session-title/package.json`、`src/index.ts`、`README.md:55` | `register-session-title-provider` | 纳入。公开唯一异步标题 provider 注册，标题保存在 Session 日志并由 Client 投影展示。 |
| `export:@deepseek-ai/dsh-shell-env:.`、`package:@deepseek-ai/dsh-shell-env` | `ShellEnvRegistry`、`BashEnvContributor` 与变量声明 | `packages/shell/shell-env/package.json`、`src/index.ts`、`README.md:34` | `register-shell-environment-fact` | 纳入。插件可声明并按调用计算托管 `DSH_*` Shell 环境事实。 |
| `export:@deepseek-ai/dsh-jobs:.`、`package:@deepseek-ai/dsh-jobs` | JobRegistry、JobSpec、JobHandle | `packages/jobs/jobs/package.json`、`src/index.ts`、`README.md` | `register-background-job` | 纳入。抽象 Service 支持 producer 与可替换 registry；local backend 与控制工具是具体组合。 |
| `export:@deepseek-ai/dsh-subagent:.`、`package:@deepseek-ai/dsh-subagent` | SubagentRuntime、SubagentProvider、SubagentRun | `packages/subagent/subagent/package.json`、`src/index.ts`、`README.md` | `provide-subagent-backend` | 纳入。具名 provider 注册与 holder-owned run 是第三方扩展点；续接型由 runtime 管理。 |
| `export:@deepseek-ai/dsh-workflow:.`、`package:@deepseek-ai/dsh-workflow` | WorkflowEngine、WorkflowRun | `packages/workflow/workflow/package.json`、`src/index.ts`、`README.md` | `run-host-workflow` | 纳入。抽象引擎与程序化 start 对插件公开；具体 PTC 引擎另行组合。 |
| `export:@deepseek-ai/dsh-user-questions:.`、`package:@deepseek-ai/dsh-user-questions` | UserQuestionService、结构化问题与回答 | `packages/interaction/user-questions/package.json`、`src/index.ts`、`README.md` | `ask-user-question` | 纳入。问答 Service 与 scoped waterfall 支持工具和权限插件；root Agent 与续答边界明确。 |
| `export:@deepseek-ai/dsh-goal:.`、`package:@deepseek-ai/dsh-goal` | GoalService、GoalView、GoalRef | `packages/goal/goal/package.json`、`src/index.ts`、`README.md` | `manage-session-goal` | 纳入。持久目标状态机可由插件调用；轮次驱动是独立具体实现。 |
| `export:@deepseek-ai/dsh-scope:.`、`package:@deepseek-ai/dsh-scope` | createScope、Scope、ScopedLayers | `packages/core/scope/package.json`、`src/index.ts`、`README.md` | `register-scoped-contribution` | 纳入。公共库支持 Agent/分组作用域注册，只有 scope-aware API 会隔离。 |
| `export:@deepseek-ai/dsh-session-query:.`、`package:@deepseek-ai/dsh-session-query` | SessionQueryEngine、SessionObservation、过滤器 | `packages/session-query/session-query/package.json`、`src/index.ts`、`README.md` | `query-session-history` | 纳入。通用 live/cold 读取由抽象基类实现；第三方 backend 可实现两项全文搜索。 |

`task:docs/user/develop/basic/tool.zh.md:1` 与 `task:docs/cookbook/adding-a-tool.zh.md:1` 对应 `register-host-tool`；前者给实际 Web patch 装载和调用，后者给工具作者的 schema、结果、取消与展示约束。`provide-host-service` 来自 `docs/user/develop/framework/service.zh.md` 的公开教程；自动标题队列可能没有覆盖该页，需作为人工任务补入。

## 本组已核查的边界

- `Service` 构造时注册，随其 provider fiber 卸载；Consumer 的 `inject` 是运行条件，类型声明合并本身不会创建服务。
- `ToolRuntime.register` 同一层重名和保留名 `run_code` 会失败；返回精确 disposer，并被所属 fiber 收集。
- `defineTool` 的成功路径只有一个规范值；`output.render` 是该值的模型内容投影。输入无效、工具抛错或输出无效都有失败通道。
- `exec.signal` 必填且属于调用方；工具需要协作取消。`ptc` 模式的模型直呼普通工具名不走常规工具分发。
- 本组 example 只覆盖源码 checkout 的本地 `--patch` 路径；独立 npm bundle 的打包与安装属于另一个操作任务。

## 第二批子路径去向

所选包另外有 49 个公开子路径，每个候选 ID 和具体理由都列在 `recommendations.json.relatedEntryAudit`。`./types` 是 type-only 消费面，需核查与包根导出的差异及 Client 编译侧；`./remote`、`./typert` 需要生成前置和跨侧消费验证；`./invariant` 是包级不变式伴生入口，交给 invariants 组合主题；`./fork`、`./surface`、`./assistant-stream` 与 `./message` 仍可能用于真实插件任务，当前保留为待审候选，未作为“内部”整批排除。

## Session 与 LLM 子路径复核

- `export:@deepseek-ai/dsh-session:./fork` 只导出包根已重导出的 `buildForkSeed`；正常插件任务是 `SessionStore.fork`，其验证 live source/边界并设置 inherited cut。裁决为 merged，任务 `fork-host-session`。
- `export:@deepseek-ai/dsh-session:./surface` 的投影、`foldSurface` 等常规对象由包根重导出；额外 `SurfaceManager` 与两个 validator 是 Session 内部增量/append 校验辅助，不作为普通插件注册入口。裁决为 merged，任务 `register-session-message-projection`。
- `export:@deepseek-ai/dsh-llm:./assistant-stream` 和 `./message` 的全部对象由根入口 `export *` 重导出；按主题导航到 `api-host-llm-message.md`，任务 `replay-assistant-stream`。
- `export:@deepseek-ai/dsh-subagent:./client` 是独立 Client-safe 地址、投影和 prompt/interrupt 类型面，由 Client 组文档 `api-client-subagent.md` 拥有。

## 尚未完成的范围

本组已覆盖这些 Host 包的高价值入口，但尚未逐成员展开 Agent 事件、LLM `StreamChunk` 全部分支、Session fork/surface 辅助、工具策略决策联合、每个 type-only/Remote 子路径及其他 Host 包。`Context` 的声明合并成员多；本组已给常见服务键分配 owner，`remote`、`slots`、`settings`、`storage`、`clientModules` 仍需对应分组核查，不能整批归入 Cordis 基础页。Service 示例尚未在独立消费包与真实 Profile 中装载；API 与 example 草稿未运行 Host TypeScript 编译或 Web 操作，不能报告为运行验证通过。`register-host-tool` 的独立本地场景已经实际执行包解析、注册、调用与卸载；它不等于 Profile 装载或 Agent 真实使用效果。

`package:@deepseek-ai/dsh-goal-round-driver` 是具体自动轮次调度插件：只消费 Goal/Agent 事件，无 provider 注册或可替换抽象类，故不单列第三方扩展 seam；它是 `manage-session-goal` 的可选组合后端，未否认其产品功能。
