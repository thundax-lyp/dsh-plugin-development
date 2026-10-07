# 关键词索引

本索引只指向唯一权威契约，具体签名、失败和验证见目标 reference。

| 包、符号或关键词                                                                                                                                             | 权威 reference                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| `@deepseek-ai/cordis`、`Context`、`Plugin`、`Service`、`Fiber`、`Inject`、effect                                                                             | [Cordis 插件与生命周期](api-cordis-core.md)     |
| `@deepseek-ai/dsh-tools`、`defineTool`、`ToolRuntime`、规范结果、PTC                                                                                         | [模型工具契约](api-tools.md)                    |
| `@deepseek-ai/dsh`、`DshBundleManifest`、`DshProfileManifest`、Profile、bundle                                                                               | [Bundle 与 Profile](api-profile-bundle.md)      |
| `@deepseek-ai/cordis-plugin-timer`、`TimerService`、timeout、interval                                                                                        | [Timer](api-timer.md)                           |
| `@deepseek-ai/cordis-plugin-loader`、`@deepseek-ai/cordis-plugin-include`、`@deepseek-ai/cordis-plugin-group`、`EntryOptions`、`PatchOptions`、Group、`!!js` | [Loader 配置](api-loader-composition.md)        |
| `@deepseek-ai/dsh-hmr`、`HmrConfig`、`ctx.hmr`、`runExclusive`、`watchConfig`、`hmr/reload`、热重载                                                          | [Host HMR](api-host-hmr.md)                     |
| `@deepseek-ai/dsh-client-hmr`、`PluginsEventFrame`、`EVENTS_ENDPOINT`、`pollIntervalMs`、`/plugins/events`、Web Client 热更                                  | [Client HMR](api-client-hmr.md)                 |
| `@deepseek-ai/dsh-typert-protocol`、`@deepseek-ai/dsh-api-gateway`、`@deepseek-ai/dsh-api-remotes`、`@Remote`、`RemoteResult`、`ctx.remote`、Typert          | [Remote API](api-remote-api.md)                 |
| `@deepseek-ai/dsh-client-modules`、`DshClientManifest`、`ClientBundleRegistration`、`ClientModuleRegistry`、`dsh.client`、`./client`                         | [Client 模块装载](api-client-modules.md)        |
| `@deepseek-ai/dsh-plugin-manager`、`PluginManager`、`ChangeResult`、`plugin_manager`、Bundle 管理                                                            | [插件管理](api-plugin-manager.md)               |
| `@deepseek-ai/dsh-session`、`Session`、`SessionEventMap`、`deriveMessages`、事件事实                                                                         | [Session 日志](api-session-log.md)              |
| `@deepseek-ai/dsh-session-persistence`、`SessionPersistence`、`flush`、writer lease                                                                          | [Session 持久化](api-session-persistence.md)    |
| `@deepseek-ai/dsh-client-ui-slots`、`@deepseek-ai/dsh-client-ui-renderer/client`、`SlotRegistry`、`SlotMap`、`ctx.slots`                                     | [Client Slots](api-client-slots.md)             |
| `@deepseek-ai/dsh-client-resources/client`、`ResourceProtocolMap`、`ResourceProvider`、`useResource`                                                         | [Client resources](api-client-resources.md)     |
| `@deepseek-ai/dsh-credentials`、`@deepseek-ai/dsh-credentials-local`、`CredentialProvider`、`CredentialRef`、`CredentialKey`                                 | [凭证](api-credentials.md)                      |
| `@deepseek-ai/dsh-authorization`、`AuthorizationService`、`AuthorizationFlow`、`registerFlow`                                                                | [授权流程](api-authorization.md)                |
| `@deepseek-ai/dsh-settings`、`SettingsForms`、`SettingsPathOp`、volatile Config                                                                              | [设置表单](api-settings.md)                     |
| `@deepseek-ai/dsh-permission-presets`、`PermissionPresetService`、`PresetSpec`、`custom`、`auto`                                                             | [执行权限预设](api-permission-presets.md)       |
| `@deepseek-ai/dsh-session-query`、`@deepseek-ai/dsh-session-query-sqlite`、`SessionQueryEngine`、`session_search`、FTS                                       | [Session 查询](api-session-query.md)            |
| `@deepseek-ai/dsh-subagent`、`SubagentRuntime`、`SubagentProvider`、`SubagentRun`、continuable                                                               | [Subagent Provider](api-subagent-provider.md)   |
| `@deepseek-ai/dsh-subagent-acp`、`AcpProvider`、ACP 子进程、`provider-managed`                                                                               | [ACP 后端](api-subagent-acp.md)                 |
| `@deepseek-ai/dsh-tool-subagent`、`@deepseek-ai/dsh-tool-subagent-control`、`send_message`、`interrupt_agent`                                                | [委派工具](api-subagent-tools.md)               |
| `@deepseek-ai/dsh-llm`、`LlmAdapter`、`LlmRuntime`、`GenerateOptions`、`StreamChunk`                                                                         | [LLM Provider](api-llm-providers.md)            |
| `ModelSelection`、`ModelSelectionRef`、`installModelSelection`、`@deepseek-ai/dsh-agent-default-model`、`modelCatalog`                                       | [模型路由](api-llm-model-routing.md)            |
| `@deepseek-ai/dsh-session-projection`、`SessionProjectionRegistry`、`ProjectionDefinition`、`sessionProjcache`                                               | [Session 投影](api-session-projection.md)       |
| `@deepseek-ai/dsh-storage`、`@deepseek-ai/dsh-storage-domain`、`@deepseek-ai/dsh-storage-json`、`Domain`、`KvTable`                                          | [Storage Domain](api-storage-domain.md)         |
| `@deepseek-ai/dsh-host-webserver`、`WebServer`、`WebRoute`、`registerUpgrade`、`tapIndex`                                                                    | [Web ingress](api-web-ingress.md)               |
| `@deepseek-ai/dsh-client-connection`、`HostConnectionHandle`、`ConnectionHandle`、`admit`、`/api`                                                            | [Connection](api-client-connection.md)          |
| `@deepseek-ai/dsh-sdk-client`、`DeepSeekHarness`、`session.run`、JSON-RPC、`sdk` Profile                                                                     | [SDK 入口](api-sdk-runtime.md)                  |
| `@deepseek-ai/dsh-mcp-client`、`@deepseek-ai/dsh-mcp-resources`、`serverName`、`mcp__`                                                                       | [MCP 客户端](api-mcp-client.md)                 |
| `@deepseek-ai/dsh-jobs`、`dsh-jobs-local`、`dsh-tool-jobs`、`JobRegistry`、`job_output`、`job_kill`                                                          | [Jobs](api-jobs.md)                             |
| `@deepseek-ai/dsh-schedule`、`ScheduleService`、`schedule_create`、`schedule_delete`                                                                         | [Schedule](api-schedule.md)                     |
| `@deepseek-ai/dsh-plan-mode`、`@deepseek-ai/dsh-tool-todo`、`PlanModeController`、`todo_write`                                                               | [Plan/Todo](api-planning.md)                    |
| `@deepseek-ai/dsh-client-ui-settings`、`ConfigForms`、`ConfigForm`、`SettingsFormModel`、`SettingsForm`、`plugins.row.config`                                | [Client 表单](api-client-settings-forms.md)     |
| `@deepseek-ai/dsh-fs`、`fs/write-intent`、`fs/edit-intent`、`fs-observation-policy`、`FS_PERMISSION_DENIED`                                                  | [Filesystem 策略](api-filesystem-policy.md)     |
| `@deepseek-ai/dsh-shell`、`@deepseek-ai/dsh-bash-local`、`ctx.shell`、`dsh-tool-bash`                                                                        | [Shell](api-shell-tool.md)                      |
| `@deepseek-ai/dsh-skill`、`SkillRegistry`、`SkillProvider`、`SkillCandidate`、`registerProvider`                                                             | [Skill Provider](api-skill-providers.md)        |
| `@deepseek-ai/dsh-system-prompt`、`SystemPrompt.section`、`context`、`assemble`、`PromptSection`                                                             | [SystemPrompt](api-system-prompt-context.md)    |
| `@deepseek-ai/dsh-goal`、`GoalService`、`goal/change`、revision CAS                                                                                          | [Goal](api-goal.md)                             |
| `@deepseek-ai/dsh-workflow`、`WorkflowEngine`、`WorkflowRun`、`workflow-ptc`                                                                                 | [Workflow](api-workflow-agent-loop.md)          |
| `tools/pre-execute`、`ToolRuntime.guard`、`tools/execute`、`tools/post-execute`、`ApprovalService`                                                           | [工具策略 Hook](api-tool-policy-hooks.md)       |
| `@deepseek-ai/dsh-client-ui-conversation`、`ConversationNodeDefinition`、`ChatNodeDataMap`、`conversation.chat.node`                                         | [Conversation nodes](api-conversation-nodes.md) |
| `@deepseek-ai/dsh-scope`、`ScopeKey`、`ScopedLayers`、`NamedEntries`、scope 覆盖注册                                                                         | [Scope 注册表](api-scope-registry.md)           |
| `@deepseek-ai/dsh-loader-smoke`、`runLoaderSmoke`、`resolveExampleLaunch`、独立 Loader Profile smoke                                                         | [Loader smoke](api-loader-smoke-profile.md)     |
