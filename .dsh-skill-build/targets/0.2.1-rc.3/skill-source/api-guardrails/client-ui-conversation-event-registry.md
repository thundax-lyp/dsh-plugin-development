# ui-conversation：event-registry 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

会话内容、输入与呈现分别由注册表和标准 source 装配；SlotMap 的 owner props 只描述父级提供的数据，不等于可任意构造的运行时对象。读取 Session 投影与已持久结果后展示；不要在组件 render 期间提交消息或创建连接。自定义节点、视图、分组与输入命令须挂入各自的 definition registry，随插件清理。

## ConversationEventRegistry client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationEventRegistry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class ConversationEventRegistry extends ConversationDefinitionRegistry<ConversationNodeDefinition> {
    register(definition: ConversationNodeDefinitionInput): () => void;
    registerFallback(input: ConversationNodeDefinitionInput): () => void;
    fallbackEntry(): ConversationNodeDefinition | undefined;
    forEvent(type: string): ReadonlySet<ConversationEventRoute>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `register` | `register(definition: ConversationNodeDefinitionInput): () => void;` |
| `registerFallback` | `registerFallback(input: ConversationNodeDefinitionInput): () => void;` |
| `fallbackEntry` | `fallbackEntry(): ConversationNodeDefinition \| undefined;` |
| `forEvent` | `forEvent(type: string): ReadonlySet<ConversationEventRoute>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface ConversationEventRoute {
  readonly definition: ConversationNodeDefinition
  readonly match: ConversationMatchHandler
}
```
