# ui-conversation：groups 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

会话内容、输入与呈现分别由注册表和标准 source 装配；SlotMap 的 owner props 只描述父级提供的数据，不等于可任意构造的运行时对象。读取 Session 投影与已持久结果后展示；不要在组件 render 期间提交消息或创建连接。自定义节点、视图、分组与输入命令须挂入各自的 definition registry，随插件清理。

## ConversationGroupContext client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationGroupContext`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationGroupContext<State> {
    readonly state: State;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `state` | `readonly state: State;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationGroupData client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationGroupData`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationGroupData<Target extends string> = Target extends keyof ConversationGroupDataMap ? ConversationGroupDataMap[Target] : never;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConversationGroupDataMap {}
```

## ConversationGroupDataMap client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationGroupDataMap`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

同名接口还包含声明合并：以下后续声明分别来自 `@deepseek-ai/dsh-client-ui-conversation`、`@deepseek-ai/dsh-client-ui-chat`。只有消费编译面实际导入相应包声明时，这些字段才加入类型；运行时还须由相应包声明 slot 或提供业务数据。不能由类型合并推定这些能力已在当前 Profile 挂载。

```text
export interface ConversationGroupDataMap {
}

interface ConversationGroupDataMap {
    chat: ProcessGroupData;
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationGroupDefinition client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationGroupDefinition`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationGroupDefinition<Node extends ConversationViewNode = ConversationViewNode, State = unknown, Data = unknown> {
    readonly kind: string;
    readonly target: string;
    create(): State;
    update(context: ConversationGroupContext<State>, input: ConversationGroupInput<Node>): State;
    buildGroups(context: ConversationGroupContext<State>): GroupUpdate<Data> | null;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `readonly kind: string;` |
| `target` | `readonly target: string;` |
| `create` | `create(): State;` |
| `update` | `update(context: ConversationGroupContext<State>, input: ConversationGroupInput<Node>): State;` |
| `buildGroups` | `buildGroups(context: ConversationGroupContext<State>): GroupUpdate<Data> \| null;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface GroupUpdate<Data> {

  readonly entries?: readonly RenderEntry[]
  readonly groups:
    | { readonly kind: 'replace'; readonly snapshots: readonly GroupSnapshot<Data>[] }
    | {
      readonly kind: 'apply'
      readonly upserts: readonly GroupSnapshot<Data>[]
      readonly removes: readonly GroupKey[]
    }
}

export type ConversationGroupInput<Node> = GroupInputNodes<Node> & (
  | { readonly kind: 'replace' }
  | {
    readonly kind: 'apply'
    readonly changes: readonly NodeChange<Node>[]
    readonly changedTurns: readonly number[]

    readonly changedTurnOrders: readonly number[]
  }
)

export interface ConversationGroupContext<State> {
  readonly state: State
}

export type GroupKey = Branded<'ConversationGroupKey'>

export type RenderEntry = NodeReference | GroupReference

export interface GroupSnapshot<Data> {
  readonly key: GroupKey
  readonly data: Data
  readonly members: readonly NodeReference[]
}

export interface NodeChange<Node> {
  readonly previous: Node | undefined
  readonly current: Node
}

interface GroupInputNodes<Node> {
  readonly order: readonly NodeKey[]

  readonly readNode: (key: NodeKey) => Node | undefined

  readonly readTurn: (turn: number) => readonly NodeKey[]

  readonly readPosition: (key: NodeKey) => GroupNodePosition | undefined
  readonly timeline: ConversationTimelineSnapshot
}

export type NodeKey = Branded<'ConversationNodeKey'>

export interface NodeReference {
  readonly kind: 'node'
  readonly key: NodeKey
  readonly groupPart?: string
}

export interface GroupReference {
  readonly kind: 'group'
  readonly key: GroupKey
}

export interface GroupNodePosition {
  readonly turn: number | undefined
  readonly previous: NodeKey | undefined
  readonly next: NodeKey | undefined
}
```

## ConversationGroupInput client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationGroupInput`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationGroupInput<Node> = GroupInputNodes<Node> & ({
    readonly kind: 'replace';
} | {
    readonly kind: 'apply';
    readonly changes: readonly NodeChange<Node>[];
    readonly changedTurns: readonly number[];
    readonly changedTurnOrders: readonly number[];
});
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface NodeChange<Node> {
  readonly previous: Node | undefined
  readonly current: Node
}

export interface GroupNodePosition {
  readonly turn: number | undefined
  readonly previous: NodeKey | undefined
  readonly next: NodeKey | undefined
}

interface GroupInputNodes<Node> {
  readonly order: readonly NodeKey[]

  readonly readNode: (key: NodeKey) => Node | undefined

  readonly readTurn: (turn: number) => readonly NodeKey[]

  readonly readPosition: (key: NodeKey) => GroupNodePosition | undefined
  readonly timeline: ConversationTimelineSnapshot
}

export type NodeKey = Branded<'ConversationNodeKey'>
```

## ConversationGroupedView client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationGroupedView`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationGroupedView<Data> {
    readonly entries: readonly RenderEntry[];
    groupSource(key: GroupKey): ObservableSnapshot<GroupSnapshot<Data> | undefined>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `entries` | `readonly entries: readonly RenderEntry[];` |
| `groupSource` | `groupSource(key: GroupKey): ObservableSnapshot<GroupSnapshot<Data> \| undefined>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type GroupKey = Branded<'ConversationGroupKey'>

export type RenderEntry = NodeReference | GroupReference

export interface GroupSnapshot<Data> {
  readonly key: GroupKey
  readonly data: Data
  readonly members: readonly NodeReference[]
}

export interface NodeReference {
  readonly kind: 'node'
  readonly key: NodeKey
  readonly groupPart?: string
}

export interface GroupReference {
  readonly kind: 'group'
  readonly key: GroupKey
}

export type NodeKey = Branded<'ConversationNodeKey'>
```

## GroupKey client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `GroupKey`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type GroupKey = Branded<'ConversationGroupKey'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## GroupNodePosition client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `GroupNodePosition`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface GroupNodePosition {
    readonly turn: number | undefined;
    readonly previous: NodeKey | undefined;
    readonly next: NodeKey | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `turn` | `readonly turn: number \| undefined;` |
| `previous` | `readonly previous: NodeKey \| undefined;` |
| `next` | `readonly next: NodeKey \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type NodeKey = Branded<'ConversationNodeKey'>
```

## GroupReference client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `GroupReference`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface GroupReference {
    readonly kind: 'group';
    readonly key: GroupKey;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `readonly kind: 'group';` |
| `key` | `readonly key: GroupKey;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type GroupKey = Branded<'ConversationGroupKey'>
```

## GroupSnapshot client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `GroupSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface GroupSnapshot<Data> {
    readonly key: GroupKey;
    readonly data: Data;
    readonly members: readonly NodeReference[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `key` | `readonly key: GroupKey;` |
| `data` | `readonly data: Data;` |
| `members` | `readonly members: readonly NodeReference[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type GroupKey = Branded<'ConversationGroupKey'>

export interface NodeReference {
  readonly kind: 'node'
  readonly key: NodeKey
  readonly groupPart?: string
}

export type NodeKey = Branded<'ConversationNodeKey'>
```

## GroupUpdate client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `GroupUpdate`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface GroupUpdate<Data> {
    readonly entries?: readonly RenderEntry[];
    readonly groups: {
        readonly kind: 'replace';
        readonly snapshots: readonly GroupSnapshot<Data>[];
    } | {
        readonly kind: 'apply';
        readonly upserts: readonly GroupSnapshot<Data>[];
        readonly removes: readonly GroupKey[];
    };
}
```

| 成员 | 公开声明 |
| --- | --- |
| `entries` | `readonly entries?: readonly RenderEntry[];` |
| `groups` | `readonly groups: { readonly kind: 'replace'; readonly snapshots: readonly GroupSnapshot<Data>[]; } \| { readonly kind: 'apply'; readonly upserts: readonly GroupSnapshot<Data>[]; readonly removes: readonly GroupKey[]; };` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type GroupKey = Branded<'ConversationGroupKey'>

export type RenderEntry = NodeReference | GroupReference

export interface GroupSnapshot<Data> {
  readonly key: GroupKey
  readonly data: Data
  readonly members: readonly NodeReference[]
}

export interface NodeReference {
  readonly kind: 'node'
  readonly key: NodeKey
  readonly groupPart?: string
}

export interface GroupReference {
  readonly kind: 'group'
  readonly key: GroupKey
}

export type NodeKey = Branded<'ConversationNodeKey'>
```

## NodeChange client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `NodeChange`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface NodeChange<Node> {
    readonly previous: Node | undefined;
    readonly current: Node;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `previous` | `readonly previous: Node \| undefined;` |
| `current` | `readonly current: Node;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## NodeKey client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `NodeKey`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type NodeKey = Branded<'ConversationNodeKey'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## NodeReference client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `NodeReference`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface NodeReference {
    readonly kind: 'node';
    readonly key: NodeKey;
    readonly groupPart?: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `readonly kind: 'node';` |
| `key` | `readonly key: NodeKey;` |
| `groupPart` | `readonly groupPart?: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type NodeKey = Branded<'ConversationNodeKey'>
```

## RenderEntry client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `RenderEntry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type RenderEntry = NodeReference | GroupReference;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface NodeReference {
  readonly kind: 'node'
  readonly key: NodeKey
  readonly groupPart?: string
}

export interface GroupReference {
  readonly kind: 'group'
  readonly key: GroupKey
}

export type NodeKey = Branded<'ConversationNodeKey'>

export type GroupKey = Branded<'ConversationGroupKey'>
```
