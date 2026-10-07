# 剩余核心与工作流包的插件作者裁决

目标：`dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`。此表依据精确 checkout 的包导出、`src/index.ts`、所列实现和测试。`included` 表示存在插件作者可执行的任务；`merged` 表示已由另一专题承接；`excluded` 仅表示不建立独立作者任务，不表示包未发布。

| 包 | 裁决 | 具体依据与任务归属 |
| --- | --- | --- |
| `@deepseek-ai/dsh-agent` | merged | `packages/core/agent/src/index.ts` 导出 Agent registry、factory、scoped dispatch；Agent 创建/消费见 `api-guardrails/workflow-agent-loop.md` 与 `agent-presets-persona.md`。 |
| `@deepseek-ai/dsh-agent-loop` | merged | `packages/core/agent-loop/src/index.ts` 的 `AgentLoop extends Service implements AgentFactory` 是具体 factory；Profile 装载/turn 生命周期已在 workflow-agent-loop 任务承接。 |
| `@deepseek-ai/dsh-agent-tool-presentation` | merged | `packages/core/agent-tool-presentation/src/index.ts` 的 `apply` 注入 `tools`，配置每种 Agent 的工具呈现；这是内置适配 Profile 组件，合并至工具/Agent preset 组合，不另建 SPI。 |
| `@deepseek-ai/dsh-scope` | merged | `packages/core/scope/src/index.ts` 的 `bindScopeParent`、`scopeChainOf` 和 scoped stores 是底层作用域原语；归 `api-guardrails/tools.md` 的 scoped 生命周期，不当成独立业务任务。 |
| `@deepseek-ai/dsh-session` | merged | `packages/core/session/src/index.ts` 导出 Session、事件和 surface fold；事件写入与恢复见 `api-guardrails/session-log.md`。 |
| `@deepseek-ai/dsh-system-prompt` | merged | `packages/core/system-prompt/src/index.ts` 导出 section/context registry 和组装类型；见 `api-guardrails/system-prompt-context.md`。 |
| `@deepseek-ai/dsh-tools` | merged | `packages/core/tools/src/index.ts` 导出 `defineTool`、registry 和执行类型；见 `api-guardrails/tools.md` 及模型工具 HOW-TO。 |
| `@deepseek-ai/dsh-command-goal` | merged | `packages/goal/command-goal/src/index.ts` 注入 `commands`、`goals` 并实现内置人类命令；Goal 服务消费见 `api-guardrails/goal.md`。命令的授权语义不可外推给直接服务调用。 |
| `@deepseek-ai/dsh-goal` | included | `packages/goal/goal/src/index.ts` 的 Goal service、projection 与 `goal/change`；已有 `api-guardrails/goal.md`、协调 Goal HOW-TO。 |
| `@deepseek-ai/dsh-goal-round-driver` | merged | `packages/goal/goal-round-driver/src/index.ts` 监听 Goal/Agent/Session 并实施续行策略；并入 Goal 生命周期，不暴露通用 driver SPI。 |
| `@deepseek-ai/dsh-tool-goal` | merged | `packages/goal/tool-goal/src/index.ts` 注册内置 Goal 模型工具与策略；其 `apply` 是 Profile 组合，不代表直接服务调用拥有同样的权限。 |
| `@deepseek-ai/dsh-tool-present` | merged | `packages/deliverables/tool-present/src/index.ts` 注册内置 `present` 工具，验证现有 regular file 并在成功工具结果后追加 `deliverables/presented`；插件自定义工具仍归工具文档，展示交付并非新的通用 SPI。 |
| `@deepseek-ai/dsh-workspace-changes` | included | `packages/deliverables/workspace-changes/src/index.ts` 提供 `ctx.workspaceChanges` 和 `workspace/changes` 事件；`src/types.ts` 公开 `summary/diff`。见新增 `api-guardrails/workspace-changes.md` 与 `how-to/read-workspace-changes.md`。 |
| `@deepseek-ai/dsh-office-to-pdf` | included | `packages/document/office-to-pdf/src/index.ts` 提供 `ctx.officeToPdf.convert/render/getGeneration`；`src/types.ts` 定义延迟读源和结果。见新增 `api-guardrails/office-to-pdf.md` 与 `how-to/convert-office-document.md`。 |
| `@deepseek-ai/dsh-fs` | included | `packages/fs/fs/src/index.ts` 为抽象文件系统服务；自定义政策和消费边界见 `api-guardrails/filesystem-policy.md`。 |
| `@deepseek-ai/dsh-fs-local` | merged | `packages/fs/fs-local/src/index.ts` 的 `LocalFileSystem` 是本机具体 provider；并入文件系统政策/Profile 组合。 |
| `@deepseek-ai/dsh-fs-sandbox` | merged | `packages/fs/fs-sandbox/src/index.ts` 的 `SandboxedFileSystem extends LocalFileSystem` 为具体隔离 provider；并入文件系统政策/沙箱组合。 |
| `@deepseek-ai/dsh-tool-fs` | merged | `packages/fs/tool-fs/src/index.ts` 注册内置读写文件工具；自定义工具与 FS 权限分别归 `tools.md` / `filesystem-policy.md`。 |
| `@deepseek-ai/dsh-tool-fs-search` | merged | `packages/fs/tool-fs-search/src/index.ts` 注册内置 glob/grep 工具并使用 subprocess；未发现单独可替换的搜索 provider SPI。 |
| `@deepseek-ai/dsh-tool-str-replace-editor` | merged | `packages/fs/tool-str-replace-editor/src/index.ts` 注册内置编辑工具；其 sandbox policy 组合已由文件系统/沙箱专题承接，不把内置工具细节变成独立 API。 |
| `@deepseek-ai/dsh-tool-ralph` | merged | `packages/workflow/tool-ralph/src/index.ts` 是基于 workflow engine/subagents 的内置模型工具；并入 workflow/ACP 的组合边界。 |
| `@deepseek-ai/dsh-tool-workflow` | merged | `packages/workflow/tool-workflow/src/index.ts` 注册内置 workflow 模型工具；自有运行任务见 workflow HOW-TO。 |
| `@deepseek-ai/dsh-workflow` | included | `packages/workflow/workflow/src/index.ts` 导出 WorkflowEngine、run 和事件错误契约；见 `api-guardrails/workflow-agent-loop.md` 与自有 workflow HOW-TO。 |
| `@deepseek-ai/dsh-workflow-ptc` | merged | `packages/workflow/workflow-ptc/src/index.ts` 的 `PtcWorkflowEngine` 是具体实现；按 workflow engine 组合，不把 PTC 内部 realm/materialize 当独立用户任务。 |

## 验证与未运行项

本轮完成目标源码静态核查和专题文档写入。隔离脚本 `evidence/tests/office-to-pdf-consumer/smoke.mjs` 执行 `node smoke.mjs` 得到 `PASS office-to-pdf mount, pre-read input bound, cleanup`：真实 Cordis 装载成功，`bytes=5` 大于配置上限 4 时在读取回调前以 `input-too-large` 拒绝，随后 fiber 清理。从两篇 HOW-TO 原样提取 TypeScript 代码到同一隔离 fixture 的 `office.ts` 和 `workspace.ts`，安装 `@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/dsh-office-to-pdf@0.2.0-rc.1`、`@deepseek-ai/dsh-workspace-changes@0.2.0-rc.1`、`@deepseek-ai/dsh-session@0.2.0-rc.1` 及 TypeScript，`./node_modules/.bin/tsc -p tsconfig.json` exit 0。未运行真实 LibreOffice 转换、Agent turn/Git/文件工具 Session Profile 或 Client UI；因此不能宣称这些运行路径已验证。精确 tag 的 `packages/document/office-to-pdf/tests/provider.spec.ts` 用 mock converter，不能替代真实引擎验证。
