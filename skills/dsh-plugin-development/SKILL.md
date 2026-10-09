---
name: dsh-plugin-development
description: 为 @deepseek-ai/dsh-agent@0.2.0-rc.2 开发 Cordis 包和插件时，按任务查找公开入口、完整示例与验证方法。
---

# DSH Plugin Development

## 适用范围

本 Skill 面向 `@deepseek-ai/dsh-agent@0.2.0-rc.2` 的插件作者。先确认消费项目所用的 DSH 包版本；版本不一致时停止套用具体 API 签名和装载步骤，重新核查该版本的公开声明。文中区分目标版本已经实现的行为、仓库门禁、基于公开原语的开发建议与外部协议要求。

## 插件形态

插件可同时交付多种能力。下表按使用者能调用或观察的结果分类；function、object、class 是 Cordis 模块写法，Host、Client、Remote 是运行侧或通信边界。

| 形态 | 能力与呈现 | 装载与使用 |
| --- | --- | --- |
| 模型工具 | Agent 在模型步骤中调用工具；规范结果进入 Session，展示由纯渲染契约决定。 | 在 Host 插件中向 `ctx.tools` 注册，按[工具任务](references/how-to-host-tool.md)编写并验证调用与卸载。 |
| Service 与 Provider | 向其他插件提供可注入的领域能力；没有独立 UI，消费方调用 Service 后才观察到结果。 | 按[服务任务](references/how-to-host-service.md)定义接口、装载 Provider，并让消费方声明依赖。 |
| Web Client 界面扩展 | 在已有 Web 页面或 slot 呈现可见内容；用户通过对应页面交互。 | 装载 Client 模块并按[界面任务](references/how-to-client-slot-contribution.md)注册可见扩展。 |
| 外部触发入口 | 外部请求触发 Host 中的受控行为，结果由调用方或 Session 观察。 | 按[Webhook 任务](references/how-to-infra-webhook.md)配置入口、验证请求与清理。 |
| 配置组合 | 将上述插件加入 Profile 或 bundle，并控制启用、参数与顺序；效果在对应消费者中呈现。 | 按[组合任务](references/how-to-infra-profile-bundle.md)安装、装载并核验生效配置。 |

Remote 是 Host 与 Client 之间的调用方式，不单独构成用户可见的插件形态；需要跨侧通信时再读[Remote 任务](references/how-to-client-remote-call.md)。

## 开发任务

先从下表选择想完成的结果，再按 HOW-TO 执行；API 页提供对象契约，example 提供较长的完整代码。

<!-- BEGIN GENERATED TASK NAVIGATION -->
<!-- prettier-ignore -->
| 用户任务 | 起点 |
| --- | --- |
| 注册一个可取消的 Agent Tool | [让 Agent 调用一个可取消的模型工具](references/how-to-host-tool.md#让-agent-调用一个可取消的模型工具) |
| 贡献 Client 命令 UI | [贡献 Client 命令 UI](references/how-to-client-command-ui.md#贡献-client-命令-ui) |
| 让可回放的 Session 事件在 Chat 中显示 | [让可回放的 Session 事件在 Chat 中显示](references/how-to-client-conversation-node.md#让可回放的-session-事件在-chat-中显示) |
| 给文件后缀注册独立的预览 renderer | [给文件后缀注册独立的预览 renderer](references/how-to-client-document-preview.md#给文件后缀注册独立的预览-renderer) |
| 为 `@file` 提供 Host 发现后端 | [为 `@file` 提供 Host 发现后端](references/how-to-client-file-reference-provider.md#为-file-提供-host-发现后端) |
| 注册一个 `/` 或 `@` 来源 | [注册一个 `/` 或 `@` 来源](references/how-to-client-input-trigger.md#注册一个--或--来源) |
| 给 slot 组件提供可切换文案与命令 | [给 slot 组件提供可切换文案与命令](references/how-to-client-locale-shortcuts.md#给-slot-组件提供可切换文案与命令) |
| 发布 Host Remote 供 Client 调用 | [发布 Host Remote 供 Client 调用](references/how-to-client-publish-remote.md#发布-host-remote-供-client-调用) |
| 在 Client 读取 `@file` 与 `@session` 候选 | [在 Client 读取 `@file` 与 `@session` 候选](references/how-to-client-reference-candidates.md#在-client-读取-file-与-session-候选) |
| 从 Client 调用已装载的 Remote namespace | [从 Client 调用已装载的 Remote namespace](references/how-to-client-remote-call.md#从-client-调用已装载的-remote-namespace) |
| 注册一个按地址读取的 Resource Provider | [注册一个按地址读取的 Resource Provider](references/how-to-client-resource-provider.md#注册一个按地址读取的-resource-provider) |
| Host 服务命名空间时显示可编辑 Web 卡片 | [Host 服务命名空间时显示可编辑 Web 卡片](references/how-to-client-settings-card.md#host-服务命名空间时显示可编辑-web-卡片) |
| 左栏全局面板贡献 | [左栏全局面板贡献](references/how-to-client-sidebar-panel.md#左栏全局面板贡献) |
| 贡献右侧栏 Tab | [贡献右侧栏 Tab](references/how-to-client-sidebar-tab.md#贡献右侧栏-tab) |
| 在已有页面的 slot 显示插件内容 | [在已有页面的 slot 显示插件内容](references/how-to-client-slot-contribution.md#在已有页面的-slot-显示插件内容) |
| Client 子 Agent 导航与控制 | [Client 子 Agent 导航与控制](references/how-to-client-subagent-navigation.md#client-子-agent-导航与控制) |
| 让 Web 扩展遵守主题与多语言样式 | [让 Web 扩展遵守主题与多语言样式](references/how-to-client-theme-ui.md#让-web-扩展遵守主题与多语言样式) |
| 为自己的工具名注册 Tool View | [为自己的工具名注册 Tool View](references/how-to-client-tool-view.md#为自己的工具名注册-tool-view) |
| 向指定 Session 上传浏览器文件 | [向指定 Session 上传浏览器文件](references/how-to-client-upload-file.md#向指定-session-上传浏览器文件) |
| 让一个 Client UI 包随 Profile 在浏览器出现 | [让一个 Client UI 包随 Profile 在浏览器出现](references/how-to-client-web-package.md#让一个-client-ui-包随-profile-在浏览器出现) |
| 消费逐轮 Workspace 变更摘要 | [消费逐轮 Workspace 变更摘要](references/how-to-client-workspace-changes.md#消费逐轮-workspace-变更摘要) |
| 导航 Workspace 与 Session | [导航 Workspace 与 Session](references/how-to-client-workspace-navigation.md#导航-workspace-与-session) |
| Host Registry 操作 | [Host Registry 操作](references/how-to-client-workspace-registry.md#host-registry-操作) |
| 只为一个 Agent 注册能力 | [只为一个 Agent 注册能力](references/how-to-host-agent-scope.md#只为一个-agent-注册能力) |
| 注册一个由交互界面执行的命令 | [注册一个由交互界面执行的命令](references/how-to-host-command.md#注册一个由交互界面执行的命令) |
| 挂载或实现压缩 backend | [挂载或实现压缩 backend](references/how-to-host-compaction.md#挂载或实现压缩-backend) |
| 保存插件凭据并注册授权流程 | [保存插件凭据并注册授权流程](references/how-to-host-credentials.md#保存插件凭据并注册授权流程) |
| 接入可替换的目录选择后端 | [接入可替换的目录选择后端](references/how-to-host-directory-picker.md#接入可替换的目录选择后端) |
| 从插件管理一项跨轮次目标 | [从插件管理一项跨轮次目标](references/how-to-host-goal.md#从插件管理一项跨轮次目标) |
| 注册可被 Agent 收取的长任务 | [注册可被 Agent 收取的长任务](references/how-to-host-jobs.md#注册可被-agent-收取的长任务) |
| 接入一个新的 LLM Provider | [接入一个新的 LLM Provider](references/how-to-host-llm-adapter.md#接入一个新的-llm-provider) |
| 记录一次模型流并可重复回放 | [记录一次模型流并可重复回放](references/how-to-host-llm-message.md#记录一次模型流并可重复回放) |
| 实现并挂载一个 Session 存储后端 | [实现并挂载一个 Session 存储后端](references/how-to-host-persistence.md#实现并挂载一个-session-存储后端) |
| 注册一个提示词段并限制工具执行 | [注册一个提示词段并限制工具执行](references/how-to-host-prompt-policy.md#注册一个提示词段并限制工具执行) |
| 为 Agent 隔离插件注册与事件 | [为 Agent 隔离插件注册与事件](references/how-to-host-scope.md#为-agent-隔离插件注册与事件) |
| 提供并消费一个 Host Service | [提供并消费一个 Host Service](references/how-to-host-service.md#提供并消费一个-host-service) |
| 为插件记录可恢复的领域事实 | [为插件记录可恢复的领域事实](references/how-to-host-session-event.md#为插件记录可恢复的领域事实) |
| 从精确日志边界创建子 Session | [从精确日志边界创建子 Session](references/how-to-host-session-fork.md#从精确日志边界创建子-session) |
| 查询历史或实现全文搜索 backend | [查询历史或实现全文搜索 backend](references/how-to-host-session-query.md#查询历史或实现全文搜索-backend) |
| 让插件事件改变模型可见消息 | [让插件事件改变模型可见消息](references/how-to-host-session-surface.md#让插件事件改变模型可见消息) |
| 注册一个自定义标题 provider | [注册一个自定义标题 provider](references/how-to-host-session-title.md#注册一个自定义标题-provider) |
| 为模型 Shell 调用贡献环境事实 | [为模型 Shell 调用贡献环境事实](references/how-to-host-shell-env.md#为模型-shell-调用贡献环境事实) |
| 组合或调用具名委派 provider | [组合或调用具名委派 provider](references/how-to-host-subagent.md#组合或调用具名委派-provider) |
| 在工具中取得结构化回答 | [在工具中取得结构化回答](references/how-to-host-user-questions.md#在工具中取得结构化回答) |
| 从插件运行一次编排脚本 | [从插件运行一次编排脚本](references/how-to-host-workflow.md#从插件运行一次编排脚本) |
| 为自定义 Profile 解析应用参数 | [为自定义 Profile 解析应用参数](references/how-to-infra-app-args.md#为自定义-profile-解析应用参数) |
| 给 Web Profile 添加具名 HTTP 路由 | [给 Web Profile 添加具名 HTTP 路由](references/how-to-infra-http-route.md#给-web-profile-添加具名-http-路由) |
| 给插件组合装载包拥有的不变式检查 | [给插件组合装载包拥有的不变式检查](references/how-to-infra-invariants.md#给插件组合装载包拥有的不变式检查) |
| 让插件配置在运行中安全更新 | [让插件配置在运行中安全更新](references/how-to-infra-live-config.md#让插件配置在运行中安全更新) |
| 保存插件自有记录并在重启后读取 | [保存插件自有记录并在重启后读取](references/how-to-infra-persistence.md#保存插件自有记录并在重启后读取) |
| 制作可安装的 Profile 组合包 | [制作可安装的 Profile 组合包](references/how-to-infra-profile-bundle.md#制作可安装的-profile-组合包) |
| 在 Profile 中安装并检查组合包 | [在 Profile 中安装并检查组合包](references/how-to-infra-profile-bundle.md#在-profile-中安装并检查组合包) |
| 从插件调用 Spill 与附件存储 | [从插件调用 Spill 与附件存储](references/how-to-infra-provider-artifacts.md#从插件调用-spill-与附件存储) |
| 选择并装载一个 Browser use provider | [选择并装载一个 Browser use provider](references/how-to-infra-provider-browser-use.md#选择并装载一个-browser-use-provider) |
| 选择并装载一个 Computer use provider | [选择并装载一个 Computer use provider](references/how-to-infra-provider-computer-use.md#选择并装载一个-computer-use-provider) |
| 通过 ShellExecutor 运行受限命令 | [通过 ShellExecutor 运行受限命令](references/how-to-infra-provider-execution.md#通过-shellexecutor-运行受限命令) |
| 在 Host 插件中通过 ctx.fs 读取文件 | [在 Host 插件中通过 ctx.fs 读取文件](references/how-to-infra-provider-fs.md#在-host-插件中通过-ctxfs-读取文件) |
| 为文件扩展名注册 LSP provider | [为文件扩展名注册 LSP provider](references/how-to-infra-provider-lsp.md#为文件扩展名注册-lsp-provider) |
| 注册具名 MCP 资源 provider | [注册具名 MCP 资源 provider](references/how-to-infra-provider-mcp-resources.md#注册具名-mcp-资源-provider) |
| 在 Host 插件中运行带 binding 的程序 | [在 Host 插件中运行带 binding 的程序](references/how-to-infra-provider-ptc.md#在-host-插件中运行带-binding-的程序) |
| 注册虚拟 Agent Skill | [注册虚拟 Agent Skill](references/how-to-infra-provider-skill.md#注册虚拟-agent-skill) |
| 注册语音转写 provider | [注册语音转写 provider](references/how-to-infra-provider-speech.md#注册语音转写-provider) |
| 在 Agent 作用域中使用持久 PTY | [在 Agent 作用域中使用持久 PTY](references/how-to-infra-provider-terminal.md#在-agent-作用域中使用持久-pty) |
| 注册可用的 Web 搜索 provider | [注册可用的 Web 搜索 provider](references/how-to-infra-provider-web.md#注册可用的-web-搜索-provider) |
| 让可信外部事件创建一次 Agent 会话 | [让可信外部事件创建一次 Agent 会话](references/how-to-infra-webhook.md#让可信外部事件创建一次-agent-会话) |

<!-- END GENERATED TASK NAVIGATION -->

## 关键对象索引

知道对象名时从下表直达其唯一权威 API 小节。

<!-- BEGIN GENERATED OBJECT INDEX -->
<!-- prettier-ignore -->
| 关键对象 | 权威契约 |
| --- | --- |
| ActionSpec (export:@deepseek-ai/dsh-client-ui-commands:./client:ActionSpec) | [`ActionSpec`](references/api-client-commands.md#actionspec) |
| activeAtToken (export:@deepseek-ai/dsh-file-reference:./grammar:activeAtToken) | [`activeAtToken`](references/api-client-references.md#activeattoken) |
| AdapterRegistrationHandle (export:@deepseek-ai/dsh-llm:.:AdapterRegistrationHandle) | [AdapterRegistrationHandle](references/api-host-llm.md#adapterregistrationhandle) |
| Agent (export:@deepseek-ai/dsh-agent:.:Agent) | [Agent](references/api-host-agent.md#agent) |
| AgentHandle (export:@deepseek-ai/dsh-agent:.:AgentHandle) | [AgentHandle](references/api-host-agent.md#agenthandle) |
| AgentLoop (export:@deepseek-ai/dsh-agent-loop:.:AgentLoop) | [AgentLoop](references/api-host-agent.md#agentloop) |
| AgentRegistry (export:@deepseek-ai/dsh-agent:.:AgentRegistry) | [AgentRegistry](references/api-host-agent.md#agentregistry) |
| AppExit (export:@deepseek-ai/dsh-cmdline:.:AppExit) | [AppExit](references/api-infra-cmdline.md#appexit) |
| ApprovalOutcome (export:@deepseek-ai/dsh-user-approval:.:ApprovalOutcome) | [ApprovalOutcome](references/api-host-prompt-policy.md#approvaloutcome) |
| ApprovalRequest (export:@deepseek-ai/dsh-user-approval:.:ApprovalRequest) | [ApprovalRequest](references/api-host-prompt-policy.md#approvalrequest) |
| ApprovalService (export:@deepseek-ai/dsh-user-approval:.:ApprovalService) | [ApprovalService](references/api-host-prompt-policy.md#approvalservice) |
| AskUserQuestionAnswer (export:@deepseek-ai/dsh-user-questions:.:AskUserQuestionAnswer) | [AskUserQuestionAnswer](references/api-host-user-questions.md#askuserquestionanswer) |
| AskUserQuestionRequest (export:@deepseek-ai/dsh-user-questions:.:AskUserQuestionRequest) | [AskUserQuestionRequest](references/api-host-user-questions.md#askuserquestionrequest) |
| AssistantStreamAccumulator (export:@deepseek-ai/dsh-llm:.:AssistantStreamAccumulator) | [AssistantStreamAccumulator](references/api-host-llm-message.md#assistantstreamaccumulator) |
| AssistantStreamRecord (export:@deepseek-ai/dsh-llm:.:AssistantStreamRecord) | [AssistantStreamRecord](references/api-host-llm-message.md#assistantstreamrecord) |
| AttachmentStore (export:@deepseek-ai/dsh-attachment:.:AttachmentStore) | [AttachmentStore](references/api-infra-provider-artifacts.md#attachmentstore) |
| AuthorizationFlow (export:@deepseek-ai/dsh-authorization:.:AuthorizationFlow) | [AuthorizationFlow](references/api-host-credentials.md#authorizationflow) |
| AuthorizationService (export:@deepseek-ai/dsh-authorization:.:AuthorizationService) | [AuthorizationService](references/api-host-credentials.md#authorizationservice) |
| AuthorizationSession (export:@deepseek-ai/dsh-authorization:.:AuthorizationSession) | [AuthorizationSession](references/api-host-credentials.md#authorizationsession) |
| BashEnvContributor (export:@deepseek-ai/dsh-shell-env:.:BashEnvContributor) | [BashEnvContributor](references/api-host-shell-env.md#bashenvcontributor) |
| BashEnvVariable (export:@deepseek-ai/dsh-shell-env:.:BashEnvVariable) | [BashEnvVariable](references/api-host-shell-env.md#bashenvvariable) |
| BashEnvVariableInfo (export:@deepseek-ai/dsh-shell-env:.:BashEnvVariableInfo) | [BashEnvVariableInfo](references/api-host-shell-env.md#bashenvvariableinfo) |
| bindScopeParent (export:@deepseek-ai/dsh-scope:.:bindScopeParent) | [bindScopeParent](references/api-host-scope.md#bindscopeparent) |
| BrowserMcpAttachConfig (export:@deepseek-ai/dsh-experimental-browser-use-runtime:./mcp:BrowserMcpAttachConfig) | [BrowserMcpAttachConfig](references/api-infra-provider-browser-use.md#browsermcpattachconfig) |
| BrowserMcpConfig (export:@deepseek-ai/dsh-experimental-browser-use-runtime:./mcp:BrowserMcpConfig) | [BrowserMcpConfig](references/api-infra-provider-browser-use.md#browsermcpconfig) |
| BrowserMcpLaunchConfig (export:@deepseek-ai/dsh-experimental-browser-use-runtime:./mcp:BrowserMcpLaunchConfig) | [BrowserMcpLaunchConfig](references/api-infra-provider-browser-use.md#browsermcplaunchconfig) |
| BrowserUseProviderName (export:@deepseek-ai/dsh-browser-use:./brand:BrowserUseProviderName) | [BrowserUseProviderName](references/api-infra-provider-browser-use.md#browseruseprovidername) |
| BrowserUseRegistry (export:@deepseek-ai/dsh-browser-use:.:BrowserUseRegistry) | [BrowserUseRegistry](references/api-infra-provider-browser-use.md#browseruseregistry) |
| buildForkSeed (export:@deepseek-ai/dsh-session:.:buildForkSeed) | [buildForkSeed](references/api-host-session-surface.md#buildforkseed) |
| Button (export:@deepseek-ai/dsh-client-ui-primitives:.:Button) | [`Button`](references/api-client-shared-ui.md#button) |
| ChatNode (export:@deepseek-ai/dsh-client-ui-chat:./client:ChatNode) | [`ChatNode`](references/api-client-conversation.md#chatnode) |
| ChatNodeDataMap (export:@deepseek-ai/dsh-client-ui-chat:./client:ChatNodeDataMap) | [`ChatNodeDataMap`](references/api-client-conversation.md#chatnodedatamap) |
| ClientModuleRegistry (export:@deepseek-ai/dsh-client-modules:.:ClientModuleRegistry) | [`ClientModuleRegistry`](references/api-client-modules.md#clientmoduleregistry) |
| ClientModuleSystem (export:@deepseek-ai/dsh-client-modules:./client:ClientModuleSystem) | [`ClientModuleSystem`](references/api-client-modules.md#clientmodulesystem) |
| ClientRemote (export:@deepseek-ai/dsh-api-remotes:./client:ClientRemote) | [`ClientRemote`](references/api-client-remote.md#clientremote) |
| CmdlineArgs (export:@deepseek-ai/dsh-cmdline:.:CmdlineArgs) | [CmdlineArgs](references/api-infra-cmdline.md#cmdlineargs) |
| CommandContribution (export:@deepseek-ai/dsh-client-ui-commands:./client:CommandContribution) | [`CommandContribution`](references/api-client-commands.md#commandcontribution) |
| CommandDecoration (export:@deepseek-ai/dsh-client-ui-commands:./client:CommandDecoration) | [`CommandDecoration`](references/api-client-commands.md#commanddecoration) |
| CommandDefinition (export:@deepseek-ai/dsh-commands:.:CommandDefinition) | [CommandDefinition](references/api-host-commands.md#commanddefinition) |
| CommandDescriptor (export:@deepseek-ai/dsh-commands:.:CommandDescriptor) | [CommandDescriptor](references/api-host-commands.md#commanddescriptor) |
| CommandInvocation (export:@deepseek-ai/dsh-commands:.:CommandInvocation) | [CommandInvocation](references/api-host-commands.md#commandinvocation) |
| CommandResult (export:@deepseek-ai/dsh-commands:.:CommandResult) | [CommandResult](references/api-host-commands.md#commandresult) |
| CommandRuntime (export:@deepseek-ai/dsh-commands:.:CommandRuntime) | [CommandRuntime](references/api-host-commands.md#commandruntime) |
| CommandUiContract (export:@deepseek-ai/dsh-client-ui-commands:./client:CommandUiContract) | [`CommandUiContract`](references/api-client-commands.md#commanduicontract) |
| CommandUiRuntime (export:@deepseek-ai/dsh-client-ui-commands:./client:CommandUiRuntime) | [`CommandUiRuntime`](references/api-client-commands.md#commanduiruntime) |
| CommandUiSpec (export:@deepseek-ai/dsh-client-ui-commands:./client:CommandUiSpec) | [`CommandUiSpec`](references/api-client-commands.md#commanduispec) |
| compactCheckpointSource (export:@deepseek-ai/dsh-compaction:.:compactCheckpointSource) | [compactCheckpointSource](references/api-host-compaction.md#compactcheckpointsource) |
| CompactionEngine (export:@deepseek-ai/dsh-compaction:.:CompactionEngine) | [CompactionEngine](references/api-host-compaction.md#compactionengine) |
| CompactionResult (export:@deepseek-ai/dsh-compaction:.:CompactionResult) | [CompactionResult](references/api-host-compaction.md#compactionresult) |
| CompactionTrigger (export:@deepseek-ai/dsh-compaction:.:CompactionTrigger) | [CompactionTrigger](references/api-host-compaction.md#compactiontrigger) |
| ComposedProps (export:@deepseek-ai/dsh-client-ui-slots:.:ComposedProps) | [`ComposedProps`](references/api-client-slots.md#composedprops) |
| ComputerUseProviderName (export:@deepseek-ai/dsh-computer-use:./brand:ComputerUseProviderName) | [ComputerUseProviderName](references/api-infra-provider-computer-use.md#computeruseprovidername) |
| ComputerUseRegistry (export:@deepseek-ai/dsh-computer-use:.:ComputerUseRegistry) | [ComputerUseRegistry](references/api-infra-provider-computer-use.md#computeruseregistry) |
| Config (export:@deepseek-ai/dsh-agent-loop:.:Config) | [AgentLoop Config](references/api-host-agent.md#agentloop-config) |
| Config (export:@deepseek-ai/dsh-invariants:.:Config) | [Config](references/api-infra-invariants.md#config) |
| Config (export:@deepseek-ai/dsh-tools:.:Config) | [Config](references/api-host-tools.md#config) |
| Config (export:@deepseek-ai/dsh-webhook-github:.:Config) | [Config](references/api-infra-webhook.md#config) |
| ConfigEditor (export:@deepseek-ai/dsh-config-editor:.:ConfigEditor) | [ConfigEditor](references/api-infra-live-config.md#configeditor) |
| ConfigForm (export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigForm) | [`ConfigForm<T>`](references/api-client-settings.md#configform) |
| ConfigForms (export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigForms) | [`ConfigForms`](references/api-client-settings.md#configforms) |
| ConfigFormSnapshot (export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigFormSnapshot) | [`ConfigFormSnapshot<T>`](references/api-client-settings.md#configformsnapshot) |
| ConfinedArgv (export:@deepseek-ai/dsh-sandbox:.:ConfinedArgv) | [ConfinedArgv](references/api-infra-provider-execution.md#confinedargv) |
| Context (export:@deepseek-ai/cordis:.:Context) | [Context](references/api-host-cordis.md#context) |
| ConversationEventRegistry (export:@deepseek-ai/dsh-client-ui-conversation:./client:ConversationEventRegistry) | [`ConversationEventRegistry`](references/api-client-conversation.md#conversationeventregistry) |
| ConversationNodeDefinition (export:@deepseek-ai/dsh-client-ui-conversation:./client:ConversationNodeDefinition) | [`ConversationNodeDefinition<State>`](references/api-client-conversation.md#conversationnodedefinition) |
| ConversationViewBuilder (export:@deepseek-ai/dsh-client-ui-conversation:./client:ConversationViewBuilder) | [`ConversationViewBuilder<Node, Snapshot>`](references/api-client-conversation.md#conversationviewbuilder) |
| ConversationViewDefinition (export:@deepseek-ai/dsh-client-ui-conversation:./client:ConversationViewDefinition) | [`ConversationViewDefinition<Node, Snapshot>`](references/api-client-conversation.md#conversationviewdefinition) |
| CreateAgentOptions (export:@deepseek-ai/dsh-agent:.:CreateAgentOptions) | [CreateAgentOptions](references/api-host-agent.md#createagentoptions) |
| createClientModuleSystem (export:@deepseek-ai/dsh-client-modules:./client:createClientModuleSystem) | [`createClientModuleSystem`](references/api-client-modules.md#createclientmodulesystem) |
| CreateGoalRequest (export:@deepseek-ai/dsh-goal:.:CreateGoalRequest) | [CreateGoalRequest](references/api-host-goal.md#creategoalrequest) |
| createMessage (export:@deepseek-ai/dsh-llm:.:createMessage) | [createMessage](references/api-host-llm-message.md#createmessage) |
| createScope (export:@deepseek-ai/dsh-scope:.:createScope) | [createScope](references/api-host-scope.md#createscope) |
| createSnapshotStore (export:@deepseek-ai/dsh-client-store:.:createSnapshotStore) | [`createSnapshotStore`](references/api-client-services.md#createsnapshotstore) |
| CredentialKey (export:@deepseek-ai/dsh-credentials:.:CredentialKey) | [CredentialKey](references/api-host-credentials.md#credentialkey) |
| CredentialProvider (export:@deepseek-ai/dsh-credentials:.:CredentialProvider) | [CredentialProvider](references/api-host-credentials.md#credentialprovider) |
| CredentialRef (export:@deepseek-ai/dsh-credentials:.:CredentialRef) | [CredentialRef](references/api-host-credentials.md#credentialref) |
| default (export:@deepseek-ai/dsh-experimental-speech-to-text:.:default) | [SpeechToText default](references/api-infra-provider-speech.md#speechtotext-default) |
| defineStore (export:@deepseek-ai/dsh-client-store:.:defineStore) | [`defineStore`](references/api-client-services.md#definestore) |
| defineTool (export:@deepseek-ai/dsh-tools:.:defineTool) | [defineTool](references/api-host-tools.md#definetool) |
| DefineToolOptions (export:@deepseek-ai/dsh-tools:.:DefineToolOptions) | [DefineToolOptions](references/api-host-tools.md#definetooloptions) |
| DirectoryEntry (export:@deepseek-ai/dsh-host-directory-picker:.:DirectoryEntry) | [DirectoryEntry](references/api-host-directory-picker.md#directoryentry) |
| DirectoryListing (export:@deepseek-ai/dsh-host-directory-picker:.:DirectoryListing) | [DirectoryListing](references/api-host-directory-picker.md#directorylisting) |
| DirectoryPicker (export:@deepseek-ai/dsh-host-directory-picker:.:DirectoryPicker) | [DirectoryPicker](references/api-host-directory-picker.md#directorypicker) |
| DirectoryPickerCapabilities (export:@deepseek-ai/dsh-host-directory-picker:.:DirectoryPickerCapabilities) | [DirectoryPickerCapabilities](references/api-host-directory-picker.md#directorypickercapabilities) |
| DirectoryPickerCapability (export:@deepseek-ai/dsh-host-directory-picker:.:DirectoryPickerCapability) | [DirectoryPickerCapability](references/api-host-directory-picker.md#directorypickercapability) |
| DirectoryPickerError (export:@deepseek-ai/dsh-host-directory-picker:.:DirectoryPickerError) | [DirectoryPickerError](references/api-host-directory-picker.md#directorypickererror) |
| DocumentContent (export:@deepseek-ai/dsh-client-ui-sidebar-documentpreview:./client:DocumentContent) | [`DocumentContent`](references/api-client-preview.md#documentcontent) |
| DocumentLoadMode (export:@deepseek-ai/dsh-client-ui-sidebar-documentpreview:./client:DocumentLoadMode) | [`DocumentLoadMode`](references/api-client-preview.md#documentloadmode) |
| DocumentPreviewDefinition (export:@deepseek-ai/dsh-client-ui-sidebar-documentpreview:./client:DocumentPreviewDefinition) | [`DocumentPreviewDefinition`](references/api-client-preview.md#documentpreviewdefinition) |
| DocumentPreviewProps (export:@deepseek-ai/dsh-client-ui-sidebar-documentpreview:./client:DocumentPreviewProps) | [`DocumentPreviewProps`](references/api-client-preview.md#documentpreviewprops) |
| Domain (export:@deepseek-ai/dsh-storage-domain:.:Domain) | [Domain](references/api-infra-storage-domain.md#domain) |
| DomainFacility (export:@deepseek-ai/dsh-storage-domain:.:DomainFacility) | [DomainFacility](references/api-infra-storage-domain.md#domainfacility) |
| DomainSpec (export:@deepseek-ai/dsh-storage-domain:.:DomainSpec) | [DomainSpec](references/api-infra-storage-domain.md#domainspec) |
| DshBundleManifest (export:@deepseek-ai/dsh-package-manifest:.:DshBundleManifest) | [DshBundleManifest](references/api-infra-profile-manifest.md#dshbundlemanifest) |
| DshProfileManifest (export:@deepseek-ai/dsh-package-manifest:.:DshProfileManifest) | [DshProfileManifest](references/api-infra-profile-manifest.md#dshprofilemanifest) |
| expandAssistantStream (export:@deepseek-ai/dsh-llm:.:expandAssistantStream) | [expandAssistantStream](references/api-host-llm-message.md#expandassistantstream) |
| Fiber (export:@deepseek-ai/cordis:.:Fiber) | [Fiber](references/api-host-cordis.md#fiber) |
| FileReferenceCandidate (export:@deepseek-ai/dsh-file-reference:.:FileReferenceCandidate) | [`FileReferenceCandidate`](references/api-client-references.md#filereferencecandidate) |
| FileReferenceService (export:@deepseek-ai/dsh-file-reference:.:FileReferenceService) | [`FileReferenceService`](references/api-client-references.md#filereferenceservice) |
| FileSearchConfig (export:@deepseek-ai/dsh-file-reference-local:./search:FileSearchConfig) | [`FileSearchConfig`](references/api-client-references.md#filesearchconfig) |
| FileSystem (export:@deepseek-ai/dsh-fs:.:FileSystem) | [FileSystem](references/api-infra-provider-fs.md#filesystem) |
| FileUploadProgress (export:@deepseek-ai/dsh-client-file-upload:./client:FileUploadProgress) | [`FileUploadProgress`](references/api-client-services.md#fileuploadprogress) |
| FileUploadService (export:@deepseek-ai/dsh-client-file-upload:./client:FileUploadService) | [`FileUploadService`](references/api-client-services.md#fileuploadservice) |
| foldSurface (export:@deepseek-ai/dsh-session:.:foldSurface) | [foldSurface](references/api-host-session-surface.md#foldsurface) |
| formatFileMention (export:@deepseek-ai/dsh-file-reference:./grammar:formatFileMention) | [`formatFileMention`](references/api-client-references.md#formatfilemention) |
| FsError (export:@deepseek-ai/dsh-fs:.:FsError) | [FsError](references/api-infra-provider-fs.md#fserror) |
| FsInfo (export:@deepseek-ai/dsh-fs:.:FsInfo) | [FsInfo](references/api-infra-provider-fs.md#fsinfo) |
| FsTarget (export:@deepseek-ai/dsh-fs:.:FsTarget) | [FsTarget](references/api-infra-provider-fs.md#fstarget) |
| GoalRef (export:@deepseek-ai/dsh-goal:.:GoalRef) | [GoalRef](references/api-host-goal.md#goalref) |
| GoalService (export:@deepseek-ai/dsh-goal:.:GoalService) | [GoalService](references/api-host-goal.md#goalservice) |
| GoalView (export:@deepseek-ai/dsh-goal:.:GoalView) | [GoalView](references/api-host-goal.md#goalview) |
| ILayout (export:@deepseek-ai/dsh-client-ui-layout:./client:ILayout) | [`ILayout`](references/api-client-sidebar.md#ilayout) |
| InputTriggerCandidate (export:@deepseek-ai/dsh-client-ui-input-trigger:./client:InputTriggerCandidate) | [`InputTriggerCandidate`](references/api-client-interaction.md#inputtriggercandidate) |
| InputTriggerServiceContract (export:@deepseek-ai/dsh-client-ui-input-trigger:./client:InputTriggerServiceContract) | [`InputTriggerServiceContract`](references/api-client-interaction.md#inputtriggerservicecontract) |
| InputTriggerSource (export:@deepseek-ai/dsh-client-ui-input-trigger:./client:InputTriggerSource) | [`InputTriggerSource`](references/api-client-interaction.md#inputtriggersource) |
| InvariantError (export:@deepseek-ai/dsh-invariants:.:InvariantError) | [InvariantError](references/api-infra-invariants.md#invarianterror) |
| InvariantInstaller (export:@deepseek-ai/dsh-invariants:.:InvariantInstaller) | [InvariantInstaller](references/api-infra-invariants.md#invariantinstaller) |
| InvariantRegistry (export:@deepseek-ai/dsh-invariants:.:InvariantRegistry) | [InvariantRegistry](references/api-infra-invariants.md#invariantregistry) |
| ISidebarRight (export:@deepseek-ai/dsh-client-ui-sidebar-right:./client:ISidebarRight) | [`ISidebarRight`](references/api-client-sidebar.md#isidebarright) |
| isRemoteFailure (export:@deepseek-ai/dsh-api-gateway:./client:isRemoteFailure) | [`isRemoteFailure`](references/api-client-remote.md#isremotefailure) |
| JobHandle (export:@deepseek-ai/dsh-jobs:.:JobHandle) | [JobHandle](references/api-host-jobs.md#jobhandle) |
| JobHooks (export:@deepseek-ai/dsh-jobs:.:JobHooks) | [JobHooks](references/api-host-jobs.md#jobhooks) |
| JobRegistry (export:@deepseek-ai/dsh-jobs:.:JobRegistry) | [JobRegistry](references/api-host-jobs.md#jobregistry) |
| JobSpec (export:@deepseek-ai/dsh-jobs:.:JobSpec) | [JobSpec](references/api-host-jobs.md#jobspec) |
| JobView (export:@deepseek-ai/dsh-jobs:.:JobView) | [JobView](references/api-host-jobs.md#jobview) |
| KvTable (export:@deepseek-ai/dsh-storage-domain:.:KvTable) | [KvTable](references/api-infra-storage-domain.md#kvtable) |
| LayoutController (export:@deepseek-ai/dsh-client-ui-layout:./client:LayoutController) | [`LayoutController`](references/api-client-sidebar.md#layoutcontroller) |
| LlmAdapter (export:@deepseek-ai/dsh-llm:.:LlmAdapter) | [LlmAdapter](references/api-host-llm.md#llmadapter) |
| LlmRuntime (export:@deepseek-ai/dsh-llm:.:LlmRuntime) | [LlmRuntime](references/api-host-llm.md#llmruntime) |
| LocaleNamespaceMap (export:@deepseek-ai/dsh-client-ui-slots:.:LocaleNamespaceMap) | [`LocaleNamespaceMap`](references/api-client-services.md#localenamespacemap) |
| LocaleRuntime (export:@deepseek-ai/dsh-client-locale:./client:LocaleRuntime) | [`LocaleRuntime`](references/api-client-services.md#localeruntime) |
| LocalFileReferenceService (export:@deepseek-ai/dsh-file-reference-local:.:LocalFileReferenceService) | [`LocalFileReferenceService`](references/api-client-references.md#localfilereferenceservice) |
| Lsp (export:@deepseek-ai/dsh-lsp:.:Lsp) | [Lsp](references/api-infra-provider-lsp.md#lsp) |
| LspProvider (export:@deepseek-ai/dsh-lsp:.:LspProvider) | [LspProvider](references/api-infra-provider-lsp.md#lspprovider) |
| LspProviderId (export:@deepseek-ai/dsh-lsp:.:LspProviderId) | [LspProviderId](references/api-infra-provider-lsp.md#lspproviderid) |
| LspProviderQuery (export:@deepseek-ai/dsh-lsp:.:LspProviderQuery) | [LspProviderQuery](references/api-infra-provider-lsp.md#lspproviderquery) |
| LspQueryRequest (export:@deepseek-ai/dsh-lsp:.:LspQueryRequest) | [LspQueryRequest](references/api-infra-provider-lsp.md#lspqueryrequest) |
| LspQueryResult (export:@deepseek-ai/dsh-lsp:.:LspQueryResult) | [LspQueryResult](references/api-infra-provider-lsp.md#lspqueryresult) |
| ManualCompactionError (export:@deepseek-ai/dsh-compaction:.:ManualCompactionError) | [ManualCompactionError](references/api-host-compaction.md#manualcompactionerror) |
| McpResourceProvider (export:@deepseek-ai/dsh-mcp-resources:.:McpResourceProvider) | [McpResourceProvider](references/api-infra-provider-mcp-resources.md#mcpresourceprovider) |
| McpResourceRequest (export:@deepseek-ai/dsh-mcp-resources:.:McpResourceRequest) | [McpResourceRequest](references/api-infra-provider-mcp-resources.md#mcpresourcerequest) |
| McpResourceRuntime (export:@deepseek-ai/dsh-mcp-resources:.:McpResourceRuntime) | [McpResourceRuntime](references/api-infra-provider-mcp-resources.md#mcpresourceruntime) |
| Menu (export:@deepseek-ai/dsh-client-ui-primitives:.:Menu) | [`Menu`](references/api-client-shared-ui.md#menu) |
| MenuSurface (export:@deepseek-ai/dsh-client-ui-primitives:.:MenuSurface) | [`MenuSurface`](references/api-client-shared-ui.md#menusurface) |
| Message (export:@deepseek-ai/dsh-llm:.:Message) | [Message](references/api-host-llm-message.md#message) |
| mountSessionMcp (export:@deepseek-ai/dsh-experimental-browser-use-runtime:./mcp:mountSessionMcp) | [mountSessionMcp](references/api-infra-provider-browser-use.md#mountsessionmcp) |
| OwnedSessionResource (export:@deepseek-ai/dsh-experimental-browser-use-runtime:.:OwnedSessionResource) | [OwnedSessionResource](references/api-infra-provider-browser-use.md#ownedsessionresource) |
| parseCmdline (export:@deepseek-ai/dsh-cmdline:.:parseCmdline) | [parseCmdline](references/api-infra-cmdline.md#parsecmdline) |
| Plugin (export:@deepseek-ai/cordis:.:Plugin) | [Plugin](references/api-host-cordis.md#plugin) |
| PluginConfigViewProps (export:@deepseek-ai/dsh-client-ui-plugin-manager:./client:PluginConfigViewProps) | [`PluginConfigViewProps`](references/api-client-settings.md#pluginconfigviewprops) |
| PluginDetailProps (export:@deepseek-ai/dsh-client-ui-plugin-manager:./client:PluginDetailProps) | [`PluginDetailProps`](references/api-client-settings.md#plugindetailprops) |
| PluginManager (export:@deepseek-ai/dsh-plugin-manager:.:PluginManager) | [PluginManager](references/api-infra-profile-runtime.md#pluginmanager) |
| PluginsSubject (export:@deepseek-ai/dsh-client-ui-plugin-manager:./client:PluginsSubject) | [`PluginsSubject`](references/api-client-settings.md#pluginssubject) |
| PopupSelectSpec (export:@deepseek-ai/dsh-client-ui-commands:./client:PopupSelectSpec) | [`PopupSelectSpec`](references/api-client-commands.md#popupselectspec) |
| PostToolDecision (export:@deepseek-ai/dsh-tools:.:PostToolDecision) | [PostToolDecision](references/api-host-prompt-policy.md#posttooldecision) |
| PreToolDecision (export:@deepseek-ai/dsh-tools:.:PreToolDecision) | [PreToolDecision](references/api-host-prompt-policy.md#pretooldecision) |
| Profile (export:@deepseek-ai/dsh-app-boot:.:Profile) | [Profile](references/api-infra-profile-runtime.md#profile) |
| ProjectionDefinition (export:@deepseek-ai/dsh-session-projection:.:ProjectionDefinition) | [ProjectionDefinition](references/api-host-session.md#projectiondefinition) |
| PromptContext (export:@deepseek-ai/dsh-system-prompt:.:PromptContext) | [PromptContext](references/api-host-prompt-policy.md#promptcontext) |
| PromptSection (export:@deepseek-ai/dsh-system-prompt:.:PromptSection) | [PromptSection](references/api-host-prompt-policy.md#promptsection) |
| PropsRenderFactories (export:@deepseek-ai/dsh-client-ui-slots:.:PropsRenderFactories) | [`PropsRenderFactories`](references/api-client-slots.md#propsrenderfactories) |
| PropsRenderSlots (export:@deepseek-ai/dsh-client-ui-slots:.:PropsRenderSlots) | [`PropsRenderSlots`](references/api-client-slots.md#propsrenderslots) |
| PropsRuntime (export:@deepseek-ai/dsh-client-ui-slots:.:PropsRuntime) | [`PropsRuntime`](references/api-client-slots.md#propsruntime) |
| PropsStore (export:@deepseek-ai/dsh-client-ui-slots:.:PropsStore) | [`PropsStore`](references/api-client-slots.md#propsstore) |
| PtcBindingNamespace (export:@deepseek-ai/dsh-ptc-runtime:.:PtcBindingNamespace) | [PtcBindingNamespace](references/api-infra-provider-ptc.md#ptcbindingnamespace) |
| PtcRunRequest (export:@deepseek-ai/dsh-ptc-runtime:.:PtcRunRequest) | [PtcRunRequest](references/api-infra-provider-ptc.md#ptcrunrequest) |
| PtcRunResult (export:@deepseek-ai/dsh-ptc-runtime:.:PtcRunResult) | [PtcRunResult](references/api-infra-provider-ptc.md#ptcrunresult) |
| PtcRuntime (export:@deepseek-ai/dsh-ptc-runtime:.:PtcRuntime) | [PtcRuntime](references/api-infra-provider-ptc.md#ptcruntime) |
| RegisterFactory (export:@deepseek-ai/dsh-client-ui-slots:.:RegisterFactory) | [`RegisterFactory`](references/api-client-slots.md#registerfactory) |
| RegistryService (export:@deepseek-ai/cordis:.:RegistryService) | [RegistryService](references/api-host-cordis.md#registryservice) |
| Remote (export:@deepseek-ai/dsh-typert-protocol:.:Remote) | [`Remote`](references/api-client-remote.md#remote) |
| RemoteError (export:@deepseek-ai/dsh-typert-protocol:.:RemoteError) | [`RemoteError`](references/api-client-remote.md#remoteerror) |
| RemoteErrorDetailsMap (export:@deepseek-ai/dsh-typert-protocol:.:RemoteErrorDetailsMap) | [`RemoteErrorDetailsMap`](references/api-client-remote.md#remoteerrordetailsmap) |
| RemoteResult (export:@deepseek-ai/dsh-typert-protocol:.:RemoteResult) | [`RemoteResult<T>`](references/api-client-remote.md#remoteresult) |
| RemoteScope (export:@deepseek-ai/dsh-typert-protocol:.:RemoteScope) | [`RemoteScope`](references/api-client-remote.md#remotescope) |
| ResourceProvider (export:@deepseek-ai/dsh-client-resources:./client:ResourceProvider) | [`ResourceProvider<P>`](references/api-client-services.md#resourceprovider) |
| Resources (export:@deepseek-ai/dsh-client-resources:./client:Resources) | [`Resources`](references/api-client-services.md#resources) |
| ResourceSnapshot (export:@deepseek-ai/dsh-client-resources:./client:ResourceSnapshot) | [`ResourceSnapshot<Value>`](references/api-client-services.md#resourcesnapshot) |
| ResumeAgentOptions (export:@deepseek-ai/dsh-agent:.:ResumeAgentOptions) | [ResumeAgentOptions](references/api-host-agent.md#resumeagentoptions) |
| runPluginCommand (export:@deepseek-ai/dsh-plugin-manager:./operations:runPluginCommand) | [runPluginCommand](references/api-infra-package-operations.md#runplugincommand) |
| SandboxProvider (export:@deepseek-ai/dsh-sandbox:.:SandboxProvider) | [SandboxProvider](references/api-infra-provider-execution.md#sandboxprovider) |
| SaveTextSpill (export:@deepseek-ai/dsh-spill:.:SaveTextSpill) | [SaveTextSpill](references/api-infra-provider-artifacts.md#savetextspill) |
| Scope (export:@deepseek-ai/dsh-scope:.:Scope) | [Scope](references/api-host-scope.md#scope) |
| ScopedLayers (export:@deepseek-ai/dsh-scope:.:ScopedLayers) | [ScopedLayers](references/api-host-scope.md#scopedlayers) |
| scopeTarget (export:@deepseek-ai/dsh-scope:.:scopeTarget) | [scopeTarget](references/api-host-scope.md#scopetarget) |
| SelectConfirmation (export:@deepseek-ai/dsh-client-ui-commands:./client:SelectConfirmation) | [`SelectConfirmation`](references/api-client-commands.md#selectconfirmation) |
| SelectOption (export:@deepseek-ai/dsh-client-ui-commands:./client:SelectOption) | [`SelectOption`](references/api-client-commands.md#selectoption) |
| SelectOptionGroup (export:@deepseek-ai/dsh-client-ui-commands:./client:SelectOptionGroup) | [`SelectOptionGroup`](references/api-client-commands.md#selectoptiongroup) |
| Service (export:@deepseek-ai/cordis:.:Service) | [Service](references/api-host-cordis.md#service) |
| Session (export:@deepseek-ai/dsh-session:.:Session) | [Session](references/api-host-session.md#session) |
| SessionEvent (export:@deepseek-ai/dsh-session:.:SessionEvent) | [SessionEvent](references/api-host-session.md#sessionevent) |
| SessionEventMap (export:@deepseek-ai/dsh-session:.:SessionEventMap) | [SessionEventMap](references/api-host-session.md#sessioneventmap) |
| SessionEventResultFilter (export:@deepseek-ai/dsh-session-query:.:SessionEventResultFilter) | [SessionEventResultFilter](references/api-host-session-query.md#sessioneventresultfilter) |
| SessionHandle (export:@deepseek-ai/dsh-session-persistence:.:SessionHandle) | [SessionHandle](references/api-host-persistence.md#sessionhandle) |
| SessionMcpOptions (export:@deepseek-ai/dsh-experimental-browser-use-runtime:./mcp:SessionMcpOptions) | [SessionMcpOptions](references/api-infra-provider-browser-use.md#sessionmcpoptions) |
| SessionMessageProjection (export:@deepseek-ai/dsh-session:.:SessionMessageProjection) | [SessionMessageProjection](references/api-host-session-surface.md#sessionmessageprojection) |
| SessionMessageProjectionContext (export:@deepseek-ai/dsh-session:.:SessionMessageProjectionContext) | [SessionMessageProjectionContext](references/api-host-session-surface.md#sessionmessageprojectioncontext) |
| SessionObservation (export:@deepseek-ai/dsh-session-query:.:SessionObservation) | [SessionObservation](references/api-host-session-query.md#sessionobservation) |
| SessionPersistence (export:@deepseek-ai/dsh-session-persistence:.:SessionPersistence) | [SessionPersistence](references/api-host-persistence.md#sessionpersistence) |
| SessionPersistenceSnapshot (export:@deepseek-ai/dsh-session-persistence:.:SessionPersistenceSnapshot) | [SessionPersistenceSnapshot](references/api-host-persistence.md#sessionpersistencesnapshot) |
| SessionProjectionRegistry (export:@deepseek-ai/dsh-session-projection:.:SessionProjectionRegistry) | [SessionProjectionRegistry](references/api-host-session.md#sessionprojectionregistry) |
| SessionQueryEngine (export:@deepseek-ai/dsh-session-query:.:SessionQueryEngine) | [SessionQueryEngine](references/api-host-session-query.md#sessionqueryengine) |
| SessionQueryError (export:@deepseek-ai/dsh-session-query:.:SessionQueryError) | [SessionQueryError](references/api-host-session-query.md#sessionqueryerror) |
| SessionReferenceMentionCandidate (export:@deepseek-ai/dsh-session-reference:.:SessionReferenceMentionCandidate) | [`SessionReferenceMentionCandidate`](references/api-client-references.md#sessionreferencementioncandidate) |
| SessionReferenceResolver (export:@deepseek-ai/dsh-session-reference:.:SessionReferenceResolver) | [`SessionReferenceResolver`](references/api-client-references.md#sessionreferenceresolver) |
| SessionResourceOptions (export:@deepseek-ai/dsh-experimental-browser-use-runtime:.:SessionResourceOptions) | [SessionResourceOptions](references/api-infra-provider-browser-use.md#sessionresourceoptions) |
| SessionResources (export:@deepseek-ai/dsh-experimental-browser-use-runtime:.:SessionResources) | [SessionResources](references/api-infra-provider-browser-use.md#sessionresources) |
| SessionResultFilter (export:@deepseek-ai/dsh-session-query:.:SessionResultFilter) | [SessionResultFilter](references/api-host-session-query.md#sessionresultfilter) |
| SessionStore (export:@deepseek-ai/dsh-session:.:SessionStore) | [SessionStore](references/api-host-session.md#sessionstore) |
| SessionTitleProvider (export:@deepseek-ai/dsh-session-title:.:SessionTitleProvider) | [SessionTitleProvider](references/api-host-session-title.md#sessiontitleprovider) |
| SessionTitleProviderId (export:@deepseek-ai/dsh-session-title:.:SessionTitleProviderId) | [SessionTitleProviderId](references/api-host-session-title.md#sessiontitleproviderid) |
| SessionTitleProviderRequest (export:@deepseek-ai/dsh-session-title:.:SessionTitleProviderRequest) | [SessionTitleProviderRequest](references/api-host-session-title.md#sessiontitleproviderrequest) |
| SessionTitleProviderResult (export:@deepseek-ai/dsh-session-title:.:SessionTitleProviderResult) | [SessionTitleProviderResult](references/api-host-session-title.md#sessiontitleproviderresult) |
| SessionTitleService (export:@deepseek-ai/dsh-session-title:.:SessionTitleService) | [SessionTitleService](references/api-host-session-title.md#sessiontitleservice) |
| SettingsConflictError (export:@deepseek-ai/dsh-settings:.:SettingsConflictError) | [SettingsConflictError](references/api-infra-live-config.md#settingsconflicterror) |
| SettingsDescriptor (export:@deepseek-ai/dsh-settings:.:SettingsDescriptor) | [SettingsDescriptor](references/api-infra-live-config.md#settingsdescriptor) |
| SettingsForms (export:@deepseek-ai/dsh-settings:.:SettingsForms) | [SettingsForms](references/api-infra-live-config.md#settingsforms) |
| SettingsPathOp (export:@deepseek-ai/dsh-settings:.:SettingsPathOp) | [SettingsPathOp](references/api-infra-live-config.md#settingspathop) |
| SettingsSchemaService (export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsSchemaService) | [`SettingsSchemaService`](references/api-client-settings.md#settingsschemaservice) |
| ShellEnvRegistry (export:@deepseek-ai/dsh-shell-env:.:ShellEnvRegistry) | [ShellEnvRegistry](references/api-host-shell-env.md#shellenvregistry) |
| ShellExecution (export:@deepseek-ai/dsh-shell:.:ShellExecution) | [ShellExecution](references/api-infra-provider-execution.md#shellexecution) |
| ShellExecutor (export:@deepseek-ai/dsh-shell:.:ShellExecutor) | [ShellExecutor](references/api-infra-provider-execution.md#shellexecutor) |
| ShortcutCommand (export:@deepseek-ai/dsh-client-shortcuts:./client:ShortcutCommand) | [`ShortcutCommand`](references/api-client-services.md#shortcutcommand) |
| Shortcuts (export:@deepseek-ai/dsh-client-shortcuts:./client:Shortcuts) | [`Shortcuts`](references/api-client-services.md#shortcuts) |
| SidebarBrandMarkOwnerProps (export:@deepseek-ai/dsh-client-ui-sidebar:./client:SidebarBrandMarkOwnerProps) | [`SidebarBrandMarkOwnerProps`](references/api-client-sidebar.md#sidebarbrandmarkownerprops) |
| SidebarPanelMetadata (export:@deepseek-ai/dsh-client-ui-sidebar:./client:SidebarPanelMetadata) | [`SidebarPanelMetadata`](references/api-client-sidebar.md#sidebarpanelmetadata) |
| SidebarRightTabClaim (export:@deepseek-ai/dsh-client-ui-sidebar-right:./client:SidebarRightTabClaim) | [`SidebarRightTabClaim`](references/api-client-sidebar.md#sidebarrighttabclaim) |
| SidebarRightTabDefinition (export:@deepseek-ai/dsh-client-ui-sidebar-right:./client:SidebarRightTabDefinition) | [`SidebarRightTabDefinition`](references/api-client-sidebar.md#sidebarrighttabdefinition) |
| SidebarRightTabInjected (export:@deepseek-ai/dsh-client-ui-sidebar-right:./client:SidebarRightTabInjected) | [`SidebarRightTabInjected`](references/api-client-sidebar.md#sidebarrighttabinjected) |
| SidebarRightTabParamsMap (export:@deepseek-ai/dsh-client-ui-sidebar-right:./client:SidebarRightTabParamsMap) | [`SidebarRightTabParamsMap`](references/api-client-sidebar.md#sidebarrighttabparamsmap) |
| SidebarRightTabPriority (export:@deepseek-ai/dsh-client-ui-sidebar-right:./client:SidebarRightTabPriority) | [`SidebarRightTabPriority`](references/api-client-sidebar.md#sidebarrighttabpriority) |
| SkillCandidate (export:@deepseek-ai/dsh-skill:.:SkillCandidate) | [SkillCandidate](references/api-infra-provider-skill.md#skillcandidate) |
| SkillDefinition (export:@deepseek-ai/dsh-skill:.:SkillDefinition) | [SkillDefinition](references/api-infra-provider-skill.md#skilldefinition) |
| SkillProvider (export:@deepseek-ai/dsh-skill:.:SkillProvider) | [SkillProvider](references/api-infra-provider-skill.md#skillprovider) |
| SkillRegistry (export:@deepseek-ai/dsh-skill:.:SkillRegistry) | [SkillRegistry](references/api-infra-provider-skill.md#skillregistry) |
| SlotCore (export:@deepseek-ai/dsh-client-ui-slots:.:SlotCore) | [`SlotCore`](references/api-client-slots.md#slotcore) |
| SlotEntryDef (export:@deepseek-ai/dsh-client-ui-slots:.:SlotEntryDef) | [`SlotEntryDef`](references/api-client-slots.md#slotentrydef) |
| SlotFactoryMap (export:@deepseek-ai/dsh-client-ui-slots:.:SlotFactoryMap) | [`SlotFactoryMap`](references/api-client-slots.md#slotfactorymap) |
| SlotKind (export:@deepseek-ai/dsh-client-ui-slots:.:SlotKind) | [`SlotKind`](references/api-client-slots.md#slotkind) |
| SlotMap (export:@deepseek-ai/dsh-client-ui-slots:.:SlotMap) | [`SlotMap`](references/api-client-slots.md#slotmap) |
| SlotRegistry (export:@deepseek-ai/dsh-client-ui-renderer:./client:SlotRegistry) | [`SlotRegistry`](references/api-client-slots.md#slotregistry) |
| SlotScope (export:@deepseek-ai/dsh-client-ui-slots:.:SlotScope) | [`SlotScope`](references/api-client-slots.md#slotscope) |
| SpeechProvider (export:@deepseek-ai/dsh-experimental-speech-to-text:.:SpeechProvider) | [SpeechProvider](references/api-infra-provider-speech.md#speechprovider) |
| SpillRef (export:@deepseek-ai/dsh-spill:.:SpillRef) | [SpillRef](references/api-infra-provider-artifacts.md#spillref) |
| SpillStore (export:@deepseek-ai/dsh-spill:.:SpillStore) | [SpillStore](references/api-infra-provider-artifacts.md#spillstore) |
| Storage (export:@deepseek-ai/dsh-storage:.:Storage) | [Storage](references/api-infra-storage.md#storage) |
| StorageError (export:@deepseek-ai/dsh-storage:.:StorageError) | [StorageError](references/api-infra-storage.md#storageerror) |
| SubagentAddress (export:@deepseek-ai/dsh-subagent:./client:SubagentAddress) | [`SubagentAddress`](references/api-client-subagent.md#subagentaddress) |
| SubagentCatalogEntry (export:@deepseek-ai/dsh-subagent:./client:SubagentCatalogEntry) | [`SubagentCatalogEntry`](references/api-client-subagent.md#subagentcatalogentry) |
| SubagentCatalogRow (export:@deepseek-ai/dsh-subagent:./client:SubagentCatalogRow) | [`SubagentCatalogRow`](references/api-client-subagent.md#subagentcatalogrow) |
| SubagentIdentityProjection (export:@deepseek-ai/dsh-subagent:./client:SubagentIdentityProjection) | [`SubagentIdentityProjection`](references/api-client-subagent.md#subagentidentityprojection) |
| SubagentInterruptReceipt (export:@deepseek-ai/dsh-subagent:./client:SubagentInterruptReceipt) | [`SubagentInterruptReceipt`](references/api-client-subagent.md#subagentinterruptreceipt) |
| SubagentListEntry (export:@deepseek-ai/dsh-subagent:./client:SubagentListEntry) | [`SubagentListEntry`](references/api-client-subagent.md#subagentlistentry) |
| SubagentPromptReceipt (export:@deepseek-ai/dsh-subagent:./client:SubagentPromptReceipt) | [`SubagentPromptReceipt`](references/api-client-subagent.md#subagentpromptreceipt) |
| SubagentPromptRequest (export:@deepseek-ai/dsh-subagent:./client:SubagentPromptRequest) | [`SubagentPromptRequest`](references/api-client-subagent.md#subagentpromptrequest) |
| SubagentProvider (export:@deepseek-ai/dsh-subagent:.:SubagentProvider) | [SubagentProvider](references/api-host-subagent.md#subagentprovider) |
| SubagentRun (export:@deepseek-ai/dsh-subagent:.:SubagentRun) | [SubagentRun](references/api-host-subagent.md#subagentrun) |
| SubagentRuntime (export:@deepseek-ai/dsh-subagent:.:SubagentRuntime) | [SubagentRuntime](references/api-host-subagent.md#subagentruntime) |
| SubagentStartRequest (export:@deepseek-ai/dsh-subagent:.:SubagentStartRequest) | [SubagentStartRequest](references/api-host-subagent.md#subagentstartrequest) |
| SubagentTimingProjection (export:@deepseek-ai/dsh-subagent:./client:SubagentTimingProjection) | [`SubagentTimingProjection`](references/api-client-subagent.md#subagenttimingprojection) |
| SubprocessHandle (export:@deepseek-ai/dsh-subprocess:.:SubprocessHandle) | [SubprocessHandle](references/api-infra-provider-execution.md#subprocesshandle) |
| SubprocessRuntime (export:@deepseek-ai/dsh-subprocess:.:SubprocessRuntime) | [SubprocessRuntime](references/api-infra-provider-execution.md#subprocessruntime) |
| SurfaceFoldResult (export:@deepseek-ai/dsh-session:.:SurfaceFoldResult) | [SurfaceFoldResult](references/api-host-session-surface.md#surfacefoldresult) |
| SystemPrompt (export:@deepseek-ai/dsh-system-prompt:.:SystemPrompt) | [SystemPrompt](references/api-host-prompt-policy.md#systemprompt) |
| Tag (export:@deepseek-ai/dsh-client-ui-primitives:.:Tag) | [`Tag`](references/api-client-shared-ui.md#tag) |
| TerminalBackend (export:@deepseek-ai/dsh-terminal:.:TerminalBackend) | [TerminalBackend](references/api-infra-provider-terminal.md#terminalbackend) |
| TerminalBackendSession (export:@deepseek-ai/dsh-terminal:.:TerminalBackendSession) | [TerminalBackendSession](references/api-infra-provider-terminal.md#terminalbackendsession) |
| TerminalSessionService (export:@deepseek-ai/dsh-terminal:.:TerminalSessionService) | [TerminalSessionService](references/api-infra-provider-terminal.md#terminalsessionservice) |
| ThemeDefinition (export:@deepseek-ai/dsh-client-ui-theme:./client:ThemeDefinition) | [`ThemeDefinition`](references/api-client-shared-ui.md#themedefinition) |
| ThemeRuntime (export:@deepseek-ai/dsh-client-ui-theme:./client:ThemeRuntime) | [`ThemeRuntime`](references/api-client-shared-ui.md#themeruntime) |
| ThemeSnapshot (export:@deepseek-ai/dsh-client-ui-theme:./client:ThemeSnapshot) | [`ThemeSnapshot`](references/api-client-shared-ui.md#themesnapshot) |
| ThemeTokenOverrides (export:@deepseek-ai/dsh-client-ui-theme:./client:ThemeTokenOverrides) | [`ThemeTokenOverrides`](references/api-client-shared-ui.md#themetokenoverrides) |
| TimedUserQuestionResult (export:@deepseek-ai/dsh-user-questions:.:TimedUserQuestionResult) | [TimedUserQuestionResult](references/api-host-user-questions.md#timeduserquestionresult) |
| ToolCallOwnerProps (export:@deepseek-ai/dsh-client-ui-tool:./client:ToolCallOwnerProps) | [`ToolCallOwnerProps`](references/api-client-interaction.md#toolcallownerprops) |
| ToolCallViewProps (export:@deepseek-ai/dsh-client-ui-tool:./client:ToolCallViewProps) | [`ToolCallViewProps`](references/api-client-interaction.md#toolcallviewprops) |
| ToolDefinition (export:@deepseek-ai/dsh-tools:.:ToolDefinition) | [ToolDefinition](references/api-host-tools.md#tooldefinition) |
| ToolExecution (export:@deepseek-ai/dsh-tools:.:ToolExecution) | [ToolExecution](references/api-host-tools.md#toolexecution) |
| ToolGuard (export:@deepseek-ai/dsh-tools:.:ToolGuard) | [ToolGuard](references/api-host-prompt-policy.md#toolguard) |
| ToolRunContext (export:@deepseek-ai/dsh-tools:.:ToolRunContext) | [ToolRunContext](references/api-host-tools.md#toolruncontext) |
| ToolRuntime (export:@deepseek-ai/dsh-tools:.:ToolRuntime) | [ToolRuntime](references/api-host-tools.md#toolruntime) |
| Transcript (export:@deepseek-ai/dsh-experimental-speech-to-text:.:Transcript) | [Transcript](references/api-infra-provider-speech.md#transcript) |
| typertPlugin (export:@deepseek-ai/dsh-typert-generator:./tsdown:typertPlugin) | [typertPlugin](references/api-client-typert-build.md#typertplugin) |
| TypertPluginOptions (export:@deepseek-ai/dsh-typert-generator:./tsdown:TypertPluginOptions) | [TypertPluginOptions](references/api-client-typert-build.md#typertpluginoptions) |
| TypertRemoteService (export:@deepseek-ai/dsh-typert-protocol:.:TypertRemoteService) | [`TypertRemoteService`](references/api-client-remote.md#typertremoteservice) |
| UiConversation (export:@deepseek-ai/dsh-client-ui-conversation:./client:UiConversation) | [`UiConversation`](references/api-client-conversation.md#uiconversation) |
| UiSession (export:@deepseek-ai/dsh-client-ui-session:./client:UiSession) | [`UiSession`](references/api-client-conversation.md#uisession) |
| UiWorkspace (export:@deepseek-ai/dsh-client-ui-workspace:./client:UiWorkspace) | [`UiWorkspace`](references/api-client-sidebar.md#uiworkspace) |
| UseResource (export:@deepseek-ai/dsh-client-resources:./client:UseResource) | [`UseResource`](references/api-client-services.md#useresource) |
| UserQuestionService (export:@deepseek-ai/dsh-user-questions:.:UserQuestionService) | [UserQuestionService](references/api-host-user-questions.md#userquestionservice) |
| validateBrowserMcpConfig (export:@deepseek-ai/dsh-experimental-browser-use-runtime:./mcp:validateBrowserMcpConfig) | [validateBrowserMcpConfig](references/api-infra-provider-browser-use.md#validatebrowsermcpconfig) |
| VerifiedWebhookDelivery (export:@deepseek-ai/dsh-webhook:.:VerifiedWebhookDelivery) | [VerifiedWebhookDelivery](references/api-infra-webhook.md#verifiedwebhookdelivery) |
| WebFetchProvider (export:@deepseek-ai/dsh-web:.:WebFetchProvider) | [WebFetchProvider](references/api-infra-provider-web.md#webfetchprovider) |
| WebFetchRequest (export:@deepseek-ai/dsh-web:.:WebFetchRequest) | [WebFetchRequest](references/api-infra-provider-web.md#webfetchrequest) |
| WebFetchResult (export:@deepseek-ai/dsh-web:.:WebFetchResult) | [WebFetchResult](references/api-infra-provider-web.md#webfetchresult) |
| WebhookRule (export:@deepseek-ai/dsh-webhook:.:WebhookRule) | [WebhookRule](references/api-infra-webhook.md#webhookrule) |
| WebhookRuntime (export:@deepseek-ai/dsh-webhook:.:WebhookRuntime) | [WebhookRuntime](references/api-infra-webhook.md#webhookruntime) |
| WebhookSessionRequest (export:@deepseek-ai/dsh-webhook:.:WebhookSessionRequest) | [WebhookSessionRequest](references/api-infra-webhook.md#webhooksessionrequest) |
| WebRoute (export:@deepseek-ai/dsh-host-webserver:.:WebRoute) | [WebRoute](references/api-infra-webserver.md#webroute) |
| WebRuntime (export:@deepseek-ai/dsh-web:.:WebRuntime) | [WebRuntime](references/api-infra-provider-web.md#webruntime) |
| WebRuntimeConfig (export:@deepseek-ai/dsh-web:.:WebRuntimeConfig) | [WebRuntimeConfig](references/api-infra-provider-web.md#webruntimeconfig) |
| WebSearchProvider (export:@deepseek-ai/dsh-web:.:WebSearchProvider) | [WebSearchProvider](references/api-infra-provider-web.md#websearchprovider) |
| WebSearchRequest (export:@deepseek-ai/dsh-web:.:WebSearchRequest) | [WebSearchRequest](references/api-infra-provider-web.md#websearchrequest) |
| WebSearchResult (export:@deepseek-ai/dsh-web:.:WebSearchResult) | [WebSearchResult](references/api-infra-provider-web.md#websearchresult) |
| WebServer (export:@deepseek-ai/dsh-host-webserver:.:WebServer) | [WebServer](references/api-infra-webserver.md#webserver) |
| WebUpgradeRoute (export:@deepseek-ai/dsh-host-webserver:.:WebUpgradeRoute) | [WebUpgradeRoute](references/api-infra-webserver.md#webupgraderoute) |
| WorkflowEngine (export:@deepseek-ai/dsh-workflow:.:WorkflowEngine) | [WorkflowEngine](references/api-host-workflow.md#workflowengine) |
| WorkflowError (export:@deepseek-ai/dsh-workflow:.:WorkflowError) | [WorkflowError](references/api-host-workflow.md#workflowerror) |
| WorkflowResult (export:@deepseek-ai/dsh-workflow:.:WorkflowResult) | [WorkflowResult](references/api-host-workflow.md#workflowresult) |
| WorkflowRun (export:@deepseek-ai/dsh-workflow:.:WorkflowRun) | [WorkflowRun](references/api-host-workflow.md#workflowrun) |
| WorkflowStartRequest (export:@deepseek-ai/dsh-workflow:.:WorkflowStartRequest) | [WorkflowStartRequest](references/api-host-workflow.md#workflowstartrequest) |
| Workspace (export:@deepseek-ai/dsh-workspace:.:Workspace) | [`Workspace`](references/api-client-workspace-data.md#workspace) |
| WorkspaceChanges (export:@deepseek-ai/dsh-workspace-changes:./types:WorkspaceChanges) | [`WorkspaceChanges`](references/api-client-workspace-data.md#workspacechanges) |
| WorkspaceChangesSummary (export:@deepseek-ai/dsh-workspace-changes:./types:WorkspaceChangesSummary) | [`WorkspaceChangesSummary`](references/api-client-workspace-data.md#workspacechangessummary) |
| WorkspaceFileDiff (export:@deepseek-ai/dsh-workspace-changes:./types:WorkspaceFileDiff) | [`WorkspaceFileDiff`](references/api-client-workspace-data.md#workspacefilediff) |
| WorkspaceFileSearch (export:@deepseek-ai/dsh-file-reference-local:./search:WorkspaceFileSearch) | [`WorkspaceFileSearch`](references/api-client-references.md#workspacefilesearch) |
| WorkspaceId (export:@deepseek-ai/dsh-workspace:.:WorkspaceId) | [`WorkspaceId`](references/api-client-workspace-data.md#workspaceid) |
| WorkspaceRegistry (export:@deepseek-ai/dsh-workspace:.:WorkspaceRegistry) | [`WorkspaceRegistry`](references/api-client-workspace-data.md#workspaceregistry) |

<!-- END GENERATED OBJECT INDEX -->

## 术语与边界

- **插件形态**说明能力由谁使用、在哪里可观察；**模块写法**说明 Cordis 怎样调用 `apply` 或构造 Service；**运行侧**说明代码在 Host 或 Client 执行。
- **Service Definition**声明契约，**Provider**实现契约，**Consumer**调用契约；只有具备实际消费路径的组合才算可用能力。参见 [Service API](references/api-host-cordis.md)。
- **Profile**选择和叠加 bundle、插件及 patch；**bundle**提供可继续覆盖的配置行。参见 [Profile 契约](references/api-infra-profile-manifest.md)。
- **Remote**跨 Host 与 Client 传输公开契约；它不替代任一侧的包导出、生成声明或真实装载。参见 [Remote 契约](references/api-client-remote.md)。

## 关键词索引

| 查找词 | 先读 |
| --- | --- |
| Cordis、`Context`、`Service`、`ctx.effect` | [Host 生命周期与服务](references/api-host-cordis.md) |
| `ctx.tools`、`defineTool`、模型工具结果 | [工具契约](references/api-host-tools.md) |
| `dsh.client`、Client 模块、bundle | [Client 装载](references/api-client-modules.md) |
| slot、Web 页面、渲染 | [Client slot](references/api-client-slots.md) |
| Remote、Typert、跨侧调用 | [Remote 契约](references/api-client-remote.md) |
| Profile、bundle、patch、插件安装 | [Profile 契约](references/api-infra-profile-manifest.md) |
| 配置表单、状态持久化、webhook | [配置](references/api-infra-live-config.md)、[存储](references/api-infra-storage.md)、[Webhook](references/api-infra-webhook.md) |

## 跨主题不变量

- 每项注册和异步资源都有明确的 owner、失败、取消与卸载清理路径；插件卸载后不得保留其注册。
- 模型能看到的事实须能从 Session 日志重建；临时 Client 展示不能代替持久事实。
- 模型工具返回一份规范 JSON 结果，展示函数只从该结果产生视图；不要让渲染承担副作用。
- 以目标版本的包导出、公开类型、运行时与门禁核查签名和行为；仓库内置示例或默认 Profile 不自动证明外部插件可独立使用。

## 完成边界

按所选 HOW-TO 核查包依赖、Host/Client 编译面、公开装载入口、一次可观察调用以及失败、取消和卸载。类型检查只证明代码与声明相容；要宣称插件可用，还需在目标 Profile 或消费项目中验证实际行为。
