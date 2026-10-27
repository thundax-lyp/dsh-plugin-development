# 将业务事件显示成可重放的会话节点

## 接入 ui-conversation

目标结果：业务持久事件能按稳定身份映射为可重放的节点、View 或分组。

### 目标与前置

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。目标是让 Host 已持久记录的业务事实在 Chat 或其它 View 中稳定显示，刷新和分页后得到相同结果。使用 [节点定义与组装](../api/api-client-ui-conversation-conversation.md)、[视图协议](../api/api-client-ui-conversation-views.md)、[分组协议](../api/api-client-ui-conversation-groups.md)；相关运行对象详见 [Conversation 对象关系](../api/api-client-ui-conversation.md)。Host 生产者必须先拥有事实事件与稳定业务 id，不能先画界面再从浏览器内存补日志。

### 实现步骤

1. 给一项业务选择可跨进程的稳定 id。所有 start/progress/end 或等价事件都包含同一 id 与可重建的坐标；生产者拥有 SessionEventMap 的 type-only 声明与实际持久写入。Client 导入该声明，只读取 Session Controller 已加载的连续事件窗口，不开第二份历史流。
2. 定义 ConversationNodeDefinition：kind 是自己的节点类别，target 是实际已注册 View；match 对不相关事件返回 null，对相关事件返回独立可计算的 id 和 start/update 角色。不能把更新归给“最近一个未完成节点”。同一身份只由最早已加载 start 初始化 State，之后按 seq 确定性更新。
3. 实现 start/update 与 buildViewNode。展示 payload 由 State 派生，不能读取当前时间或 live-only 单例决定历史结果。只有 update、没有 start 的窗口保持 pending；需要无 start 也显示终态时，由业务终态或 checkpoint 事件保存足够的整体事实，不扫描无关事件猜测。
4. 需要 Turn/Step 的业务数据时，实现 buildLocationData 并声明对应 ConversationTurnDataMap/ConversationStepDataMap；需要 Chat 自定义 payload 时声明 ChatNodeDataMap，然后按其 kind 注册 conversation.chat.node keyed 组件。组件只读 node.data，不提交新的 Host 动作。
5. 在 Client apply 用 ctx.uiConversation.events.register 安装 definition，并通过 ctx.slots.inject 等待 renderer slot。组件 props 从 ChatNodeViewProps 等公开别名派生；完整包入口、factory、Profile 行与停用方法沿用 [独立 Client 包](../examples/example-client-overlay.md)，增加的 runtime requests 须逐一声明 external，只有 type imports 无需。
6. 新 View 另注册 View Definition，创建每 Session 一个增量 builder，定义 replace/apply/publish 与最终 snapshot。读 source 不等于激活 target：shell 选择 View 或首个 source subscription 才激活；取消订阅不会撤销已激活 target。不要在公共 assembler 中硬写 Chat fallback。
7. 分组属于可选任务：先有 View target，再注册 groups definition。每个 Session/target 独立 State；replace 必须提供完整 root entries 与 groups replacement，apply 可以只 upsert/remove。NodeKey/groupPart 在根与组内不能重复；分组不拥有原节点数据，不能把读函数保存进 State。

### 验证与完成边界

构造交错的两个业务 id，依次检查全量重放、分页晚到 start、只有 update、重复 start、实时与结算事件并存。比较最终节点与坐标数据，确认没有串写身份；刷新后只靠持久事件重建相同模型可见事实。取消/失败要有生产者记录的最终状态，不能只隐藏 loading。卸载 definition 时取消其 registry 贡献并触发相应 rebuild；View、group 与 keyed renderer 的生命周期都需验证。类型相容和单页演示不能证明分页、重连与历史语义。

相关对象契约：

- [`ArbitrateKey`、`ArbitrateOutcome`、`DraftInput`、`DraftReference` 等对象](../api/api-client-ui-conversation-draft-editor.md)。
- [`AssistantBlock`、`AssistantMessageNode`、`AssistantProviderMetadataView`、`AssistantRequestConfig` 等对象](../api/api-client-ui-conversation-records.md)。
- [`BeginCommandRequest`、`CommandClaim`、`ConsumeTokenRequest`、`DraftAttachmentId` 等对象](../api/api-client-ui-conversation-input.md)。
- [`ComposerAttachment`、`ComposerAttachmentsOwnerProps`、`ComposerAttachmentsProps`、`ComposerBarInjected` 等对象](../api/api-client-ui-conversation-slots.md)。
- [`ComposerBlock`、`ComposerBlocks`](../api/api-client-ui-conversation-composer-blocks.md)。
- [`Config`、`ConversationConfig`](../api/api-client-ui-conversation-apply.md)。
- [`ContextProducerView`、`ContextRole`、`KnownContextForm`](../api/api-client-ui-conversation-context-producer.md)。
- [`ConversationBinding`、`UiConversation`](../api/api-client-ui-conversation-assembly.md)。
- [`ConversationController`、`IConversation`、`UnsupportedImageMediaTypeError`](../api/api-client-ui-conversation-service.md)。
- [`ConversationDefinitionRegistry`](../api/api-client-ui-conversation-definition-registry.md)。
- [`ConversationEventDefinitions`、`ConversationGroupDefinitions`、`ConversationNodeAssembler`、`ConversationViewDefinitions`](../api/api-client-ui-conversation-assembler.md)。
- [`ConversationEventRegistry`](../api/api-client-ui-conversation-event-registry.md)。
- [`ConversationGroupRegistry`](../api/api-client-ui-conversation-group-registry.md)。
- [`ConversationKey`](../api/api-client-ui-conversation-locales.md)。
- [`ConversationLocationDataChange`、`ConversationLocationIndex`](../api/api-client-ui-conversation-location-index.md)。
- [`ConversationPhase`、`ConversationSnapshot`、`EMPTY_CONVERSATION_SNAPSHOT`、`conversationPhase`](../api/api-client-ui-conversation-snapshot.md)。
- [`ConversationPromptSnapshot`、`RequestInspectionSnapshot`、`RequestPromptChange`、`RequestPromptInspection` 等对象](../api/api-client-ui-conversation-request-inspection.md)。
- [`ConversationViewRegistry`](../api/api-client-ui-conversation-view-registry.md)。
- [`SystemPromptInspector`、`SystemPromptState`](../api/api-client-ui-conversation-system-prompt.md)。
- [`TodoItem`、`UserTextDataMap`、`UserTextFacts`、`Config`](../api/api-client-ui-conversation-index.md)。
- [`UserTextDocumentInput`、`UserTextEvaluator`、`UserTextId`、`UserTextNode` 等对象](../api/api-client-ui-conversation-user-text.md)。
- [`UserTextRegistry`](../api/api-client-ui-conversation-user-text-registry.md)。
- [`BUSY_ENTER_BEHAVIORS`、`BUSY_ENTER_FIELD`、`BusyEnterBehavior`、`CONVERSATION_SETTINGS_NAMESPACE` 等对象](../api/api-client-ui-conversation-submission-settings.md)。
