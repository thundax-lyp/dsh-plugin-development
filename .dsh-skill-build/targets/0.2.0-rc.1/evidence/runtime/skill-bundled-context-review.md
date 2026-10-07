# Skill、Context 与实验包逐包裁决（rc.1）

目标 checkout：`dsh-v0.2.0-rc.1`，`4878cdabd87d4041bdaff61d04c966883b9fd07a`。以下仅按公开 package export、实现和组合清单判断插件作者可完成的任务。`experimental` 目录名不作为排除理由。

## 已验证的 Skill 与 Context 任务

| 候选 | 裁决与源码边界 |
| --- | --- |
| `dsh-skill-filesystem` | 纳入独立插件任务：指定自有根并调用 `apply` 注册 provider。`packages/skill/skill-filesystem/src/index.ts:50-87,134-180,243-268` 实现 `Config`、registry、默认/自定义根和 watcher；见 `api-skill-bundled-consumers.md` 与 `how-to-mount-skill-directory.md`。|
| `dsh-tool-skill` | 合并至上述组合路径：`packages/skill/tool-skill/src/index.ts:20-56,72-210` 注册模型工具和请求前 catalog，消费 `ctx.skills`；它自身不发现技能。base 与 standard preset 装载层不同，见下。|
| `dsh-skill-badge` | 合并至内置 provider 对照：`packages/skill/skill-badge/src/index.ts` 固定注册打包 `dsh-badge`；base patch 的行 `disabled: true`，不能宣称默认启用。|
| `dsh-skill-office` | 合并至内置 provider 对照：`packages/skill/skill-office/src/index.ts` 可装载三个打包技能，`assetRoot`/`node`/`cli` 有执行资源校验；sdk-app patch 装载，不是所有 Profile。|
| `dsh-time-context`、`./invariant` | 纳入可选上下文任务；插件本体 `packages/context/time-context/src/index.ts` 在 `agent/pre-step` 构造带来源的 snapshot，`src/invariant.ts` 是 `name/inject/apply` companion plugin，向 InvariantRegistry 注册耐久读数校验；见 `api-opt-in-context-plugins.md`、`how-to-enable-opt-in-context.md`。|
| `dsh-tmux-context` | 纳入同一可选上下文任务；`packages/context/tmux-context/src/index.ts` 要求真实 pane tty 且 `ctx.shell` 可查询，失败不注入；同上。|
| `dsh-tool-workspace-dependencies` | 独立的部署工具候选，不是 Skill Provider：`packages/skill/tool-workspace-dependencies/src/index.ts:10-56,82-150,240-` 公开 `Config.source/root`、`parsePrimaryRuntime`、`workspaceDependencyPaths`，`apply` 注册读取打包运行时的模型工具。需要有效 `runtime.json` 与真实 payload，不能用空目录声称工作；建议单独处理安装载体与读工具的任务。|
| `dsh-agent-instructions` | 现有 agent 指令生产者，不是通用 provider 注册面：`packages/context/agent-instructions/src/index.ts:32-44,84-` 导出 `Config`、`apply`、渲染函数并注入 session projection。base patch 已装载。若纳入应是“装载/调节指令文件采集”的独立任务，验证 Session 事件与恢复。|
| `dsh-file-reference`、`dsh-file-reference-local`（含 `./grammar`、`./types`、`./search`） | 有真实可扩展 service seam：抽象 `FileReferenceService.list(agent,query,signal)` 与本地实现 `LocalFileReferenceService`，见各自 `src/index.ts`。可选任务是实现自有搜索 backend 或在 Host/Client 组合中装载本地服务；必须分别验证取消、cwd 边界、Client mention 与只提供路径不读内容。尚未做隔离消费验证，建议作为独立任务。|
| `dsh-session-reference`（含 `./types`、`./remote`、`./typert`） | `packages/context/session-reference/src/index.ts:39-95` 有真实 `SessionReferenceResolver` Remote service、URI helper、预算/精确读取；可在已有 sessionQuery 的 Profile 装载，并让 Client 提交跨 Session 引用。不是第三方 provider registry；需要跨 Session 权限、精确快照、取消和持久消息验证。建议单独任务；本轮未做隔离消费。|

隔离消费者：`evidence/tests/skill-bundled-consumer/` 从 HOW-TO 原样抽取 package、tsconfig、patch、TS、SKILL.md，`npm install --ignore-scripts`、`npm run build` 成功，真实 Cordis + SkillRegistry 中注册、列出、`get` 正文、卸载后消失通过。`evidence/tests/opt-in-context-consumer/` 从 HOW-TO 抽取 patch，npm 安装目标发布包后真实 Cordis + AgentRegistry + SessionProjectionRegistry 下装载/卸载两个上下文插件通过。未运行完整 AgentLoop、Session 恢复、tmux 真环境、文件 watcher 变化；目标源码各自 tests/e2e 是行为定位，不当作本轮已执行结果。

## 实验包与组合清单逐包 disposition 候选

| 包或公开子入口 | 候选裁决与插件作者任务证据 |
| --- | --- |
| `dsh-experimental-agent-team`（`./types`、`./invariant`、`./client`） | 真实公开 `TeamService`、团队 ID/错误和跨侧类型，`src/index.ts:30-56,270`；可完成多 Agent 团队任务，但需 Agent/Session/Subagent 持久生命周期的完整验证。建议独立 Team 专题，不能因实验名排除。|
| `dsh-experimental-agent-team-profile` | `src/index.ts` 仅 `export {}`；`cordis.patch.yml` 关闭四个直接 subagent tool、插入 Team service/tool/UI。作为 Team 专题的组合清单合并，不能单独映射为空根入口。|
| `dsh-experimental-tool-agent-team` | `src/index.ts:12-25,402-` 是 Team service 的模型工具 facade；与 Team service 合并，不能把工具单独装载成团队能力。|
| `dsh-experimental-client-ui-agent-team`（`./client`） | 根 `apply():void {}`、`./client` 提供 UI 模块；与 Team Profile 路径合并，Host 根不提供独立服务。|
| `dsh-experimental-speech-to-text`（`./types`、`./wave`） | `src/index.ts:12-96` 公开可注册 recognizer 的 `SpeechToText` service、取消/卸载语义；有自定义转录 provider 任务。建议独立语音专题，需真实录音/WAV、取消、选择及跨侧验证。|
| `dsh-experimental-api-speech-to-text`（`./types`、`./remote`、`./typert`） | `src/index.ts:10-105` 是认证、限额、取消的 Client Remote controller，组合至上述语音任务；`remote/typert` 是生成的跨侧面，不是另一个 provider。|
| `dsh-experimental-speech-to-text-sensevoice`（`./worker`） | `src/index.ts` 是具体本地 recognizer，依赖 subprocess/dataRoot；作为语音任务的 provider 实例，不能推断每个部署默认有模型资源。|
| `dsh-experimental-client-ui-voice-input`（`./client`）、`dsh-experimental-voice-input-bundle` | 根 UI plugin 空 `apply`；bundle 的 `cordis.patch.yml` 明确组合 service、SenseVoice、API、UI。合并语音任务；bundle 根 `export {}` 无独立 API。|
| `dsh-experimental-auto-review` | `src/index.ts:124-126,678-` 是固定 `approval/llm/permissionPresets/sessions/tools` 消费插件，无公开 provider registry；`cordis.patch.yml` 只插入它。可作为显式安装的策略功能，不应将其内部 hook 当通用审批 API。建议与审批策略专题合并。|
| `dsh-experimental-browser-use-chrome-devtools-mcp`、`...playwright-mcp`、`...stagehand-native`（`./worker`） | 各自 `src/index.ts` 公开插件 `name/inject/Config/apply`，是 BrowserUse 的具体 provider。已有 `api-browser-computer-use.md` 与 Browser MCP HOW-TO；`worker` 是 provider 执行载体，非独立 Cordis 扩展任务。|
| `dsh-experimental-computer-use-cua-driver-native` | `src/index.ts` 公开具体 ComputerUse provider 与空配置 schema；与既有 ComputerUse registry 文档合并，真实桌面 driver 未在已有隔离 smoke 运行。|
| `dsh-experimental-inspector`（`./client`） | `src/index.ts:12-74` 公开 `startInspector`/options/`InspectorService`，依赖 `webServer`；`cordis.patch.yml` 明确需要 Web server，`cordis.source.patch.yml` 是源码 demo overlay。可形成可控的诊断端点任务，需 HTTP/WebSocket、权限与卸载验证；建议独立专题，不能把 demo source patch 当生产安装路径。|
| `dsh-experimental-ptc-runtime-python` | `src/index.ts:42-` 公开具体 `PythonPtcRuntime` 及配置/协议辅助；已有 `api-ptc-runtime.md` 专题。合并 PTC task，真正 Python/进程隔离待该专题验证。|
| `dsh-experimental-schedule-bundle` | `src/index.ts` 仅 `export {}`；patch 插入 time-context、schedule、UI，合并 Schedule 任务。不能凭空根入口推断 service。|
| `dsh-experimental-webworker-packer`、`...webworker-runtime`（`./client`、`./worker`） | 根公开 build/VFS/Node shim/worker runtime 的大量底层符号（各 `src/index.ts`）；它们面向 runtime/载体作者，未找到可直接完成普通 Cordis Host/Client 插件任务的 `name/inject/apply` 或 service slot。建议从本 Skill 的普通插件任务排除，保留逐入口证据；若将来要求写 worker runtime 扩展，再单独建专题。|

组合清单：`agent-team-profile`、`auto-review`、`inspector`、`schedule-bundle`、`voice-input-bundle` 的 patch 如上分别归 Team、审批、Inspector、Schedule、Voice。`packages/preset/agent-preset/skills/cordis-plugin-development/templates/{decoration,mcp}/cordis.patch.yml` 是技能模板示例，属于 preset 生成器素材，不应作为已发布默认 Profile；`packages/subagent/subagent-{claude-code,codex}/cordis.patch.yml` 是各 provider 安装 patch，归 Subagent provider 专题。普通 Profile 层事实应从实际选用的 base/Web/sdk patch 组合推导，不把这些可选 patch 全部叠加为默认。
