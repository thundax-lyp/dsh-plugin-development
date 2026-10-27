# ui-conversation：assembler 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

会话内容、输入与呈现分别由注册表和标准 source 装配；SlotMap 的 owner props 只描述父级提供的数据，不等于可任意构造的运行时对象。读取 Session 投影与已持久结果后展示；不要在组件 render 期间提交消息或创建连接。自定义节点、视图、分组与输入命令须挂入各自的 definition registry，随插件清理。

## ConversationEventDefinitions client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationEventDefinitions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationEventDefinitions extends Partial<Pick<ConversationEventRegistry, 'forEvent'>> {
    entries(): readonly ConversationNodeDefinition[];
    fallbackEntry(): ConversationNodeDefinition | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `entries` | `entries(): readonly ConversationNodeDefinition[];` |
| `fallbackEntry` | `fallbackEntry(): ConversationNodeDefinition \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationGroupDefinitions client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationGroupDefinitions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationGroupDefinitions {
    entries(): readonly ConversationGroupDefinition[];
    forTarget(target: string): ConversationGroupDefinition | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `entries` | `entries(): readonly ConversationGroupDefinition[];` |
| `forTarget` | `forTarget(target: string): ConversationGroupDefinition \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationNodeAssembler client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationNodeAssembler`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class ConversationNodeAssembler implements ConversationViewSnapshotStore {
    constructor(eventDefinitions: ConversationEventDefinitions, viewDefinitions: ConversationViewDefinitions, groupDefinitions?: ConversationGroupDefinitions);
    openTurn(): number | undefined;
    replaceWindow(entries: readonly SessionEventLikeEntry[], hasMore: boolean): ConversationPublication;
    append(record: SessionEventLikeEntry): ConversationPublication;
    settleAssistant(attemptId: LlmAttemptId, entry?: SessionAssistantSettlementEntry): ConversationPublication;
    prepend(entries: readonly SessionEventLikeEntry[], hasMore: boolean): ConversationPublication;
    rebuildRegistry(): ConversationPublication;
    flush(): boolean;
    activateTarget(target: string): boolean;
    snapshot(target: string): unknown;
    get<Target extends Extract<keyof ConversationViewSnapshotMap, string>>(target: Target): ConversationViewSnapshotMap[Target] | undefined;
    grouped<Target extends string>(target: Target): ConversationGroupedView<ConversationGroupData<Target>> | undefined;
    activityTargets(): ReadonlySet<string>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `constructor` | `constructor(eventDefinitions: ConversationEventDefinitions, viewDefinitions: ConversationViewDefinitions, groupDefinitions?: ConversationGroupDefinitions);` |
| `openTurn` | `openTurn(): number \| undefined;` |
| `replaceWindow` | `replaceWindow(entries: readonly SessionEventLikeEntry[], hasMore: boolean): ConversationPublication;` |
| `append` | `append(record: SessionEventLikeEntry): ConversationPublication;` |
| `settleAssistant` | `settleAssistant(attemptId: LlmAttemptId, entry?: SessionAssistantSettlementEntry): ConversationPublication;` |
| `prepend` | `prepend(entries: readonly SessionEventLikeEntry[], hasMore: boolean): ConversationPublication;` |
| `rebuildRegistry` | `rebuildRegistry(): ConversationPublication;` |
| `flush` | `flush(): boolean;` |
| `activateTarget` | `activateTarget(target: string): boolean;` |
| `snapshot` | `snapshot(target: string): unknown;` |
| `get` | `get<Target extends Extract<keyof ConversationViewSnapshotMap, string>>(target: Target): ConversationViewSnapshotMap[Target] \| undefined;` |
| `grouped` | `grouped<Target extends string>(target: Target): ConversationGroupedView<ConversationGroupData<Target>> \| undefined;` |
| `activityTargets` | `activityTargets(): ReadonlySet<string>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationViewDefinitions client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationViewDefinitions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationViewDefinitions {
    entries(): readonly ConversationViewDefinition[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `entries` | `entries(): readonly ConversationViewDefinition[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。
