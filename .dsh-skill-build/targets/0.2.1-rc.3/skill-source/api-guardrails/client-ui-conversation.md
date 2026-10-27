# ui-conversation：插件接入

## 对象关系

会话内容、输入与呈现分别由注册表和标准 source 装配；SlotMap 的 owner props 只描述父级提供的数据，不等于可任意构造的运行时对象。读取 Session 投影与已持久结果后展示；不要在组件 render 期间提交消息或创建连接。自定义节点、视图、分组与输入命令须挂入各自的 definition registry，随插件清理。

## 选型与使用

- [apply 对象契约](api-client-ui-conversation-apply.md)。
- [assembler 对象契约](api-client-ui-conversation-assembler.md)。
- [assembly 对象契约](api-client-ui-conversation-assembly.md)。
- [composer-blocks 对象契约](api-client-ui-conversation-composer-blocks.md)。
- [context-producer 对象契约](api-client-ui-conversation-context-producer.md)。
- [conversation 对象契约](api-client-ui-conversation-conversation.md)。
- [definition-registry 对象契约](api-client-ui-conversation-definition-registry.md)。
- [draft-editor 对象契约](api-client-ui-conversation-draft-editor.md)。
- [event-registry 对象契约](api-client-ui-conversation-event-registry.md)。
- [group-registry 对象契约](api-client-ui-conversation-group-registry.md)。
- [groups 对象契约](api-client-ui-conversation-groups.md)。
- [index 对象契约](api-client-ui-conversation-index.md)。
- [input 对象契约](api-client-ui-conversation-input.md)。
- [locales 对象契约](api-client-ui-conversation-locales.md)。
- [location-index 对象契约](api-client-ui-conversation-location-index.md)。
- [records 对象契约](api-client-ui-conversation-records.md)。
- [request-inspection 对象契约](api-client-ui-conversation-request-inspection.md)。
- [service 对象契约](api-client-ui-conversation-service.md)。
- [slots 对象契约](api-client-ui-conversation-slots.md)。
- [snapshot 对象契约](api-client-ui-conversation-snapshot.md)。
- [submission-settings 对象契约](api-client-ui-conversation-submission-settings.md)。
- [system-prompt 对象契约](api-client-ui-conversation-system-prompt.md)。
- [user-text 对象契约](api-client-ui-conversation-user-text.md)。
- [user-text-registry 对象契约](api-client-ui-conversation-user-text-registry.md)。
- [view-registry 对象契约](api-client-ui-conversation-view-registry.md)。
- [views 对象契约](api-client-ui-conversation-views.md)。

完整操作见 [接入 ui-conversation](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation)。
