# ui-conversation：location-index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

会话内容、输入与呈现分别由注册表和标准 source 装配；SlotMap 的 owner props 只描述父级提供的数据，不等于可任意构造的运行时对象。读取 Session 投影与已持久结果后展示；不要在组件 render 期间提交消息或创建连接。自定义节点、视图、分组与输入命令须挂入各自的 definition registry，随插件清理。

## ConversationLocationDataChange client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationLocationDataChange`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationLocationDataChange {
    readonly owner: string;
    readonly previous: ConversationLocationData | null;
    readonly next: ConversationLocationData | null;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `owner` | `readonly owner: string;` |
| `previous` | `readonly previous: ConversationLocationData \| null;` |
| `next` | `readonly next: ConversationLocationData \| null;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationLocationIndex client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationLocationIndex`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class ConversationLocationIndex {
    snapshot(): ConversationTimelineSnapshot;
    takeChangedTurns(): readonly number[];
    replaceData(entries: readonly {
        readonly owner: string;
        readonly data: ConversationLocationData;
    }[]): boolean;
    applyData(changes: readonly ConversationLocationDataChange[]): boolean;
    publishData(): void;
    locationOf(event: SessionEventLike): ConversationLocation;
    rebuild(entries: readonly SessionEventLikeEntry[]): ReadonlySet<number>;
    appendBoundary(event: SessionEvent): ReadonlySet<number>;
    appendNonBoundary(event: SessionEventLike): void;
    removeAssistantTransients(events: readonly AssistantLiveChunkEvent[]): void;
    insertAssistantSettlement(event: SessionEvent<'assistant/message'> | SessionEvent<'assistant/attempt'>): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `snapshot` | `snapshot(): ConversationTimelineSnapshot;` |
| `takeChangedTurns` | `takeChangedTurns(): readonly number[];` |
| `replaceData` | `replaceData(entries: readonly { readonly owner: string; readonly data: ConversationLocationData; }[]): boolean;` |
| `applyData` | `applyData(changes: readonly ConversationLocationDataChange[]): boolean;` |
| `publishData` | `publishData(): void;` |
| `locationOf` | `locationOf(event: SessionEventLike): ConversationLocation;` |
| `rebuild` | `rebuild(entries: readonly SessionEventLikeEntry[]): ReadonlySet<number>;` |
| `appendBoundary` | `appendBoundary(event: SessionEvent): ReadonlySet<number>;` |
| `appendNonBoundary` | `appendNonBoundary(event: SessionEventLike): void;` |
| `removeAssistantTransients` | `removeAssistantTransients(events: readonly AssistantLiveChunkEvent[]): void;` |
| `insertAssistantSettlement` | `insertAssistantSettlement(event: SessionEvent<'assistant/message'> \| SessionEvent<'assistant/attempt'>): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface ConversationLocationDataChange {
  readonly owner: string
  readonly previous: ConversationLocationData | null
  readonly next: ConversationLocationData | null
}
```
