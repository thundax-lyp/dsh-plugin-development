# ui-trajectory：trajectory-contract 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-trajectory 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## TrajectoryContribution client

入口 `@deepseek-ai/dsh-client-ui-trajectory/client`，公开符号 `TrajectoryContribution`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type TrajectoryContribution = {
    readonly kind: 'system-prompt';
    readonly prompt: SystemPromptNode;
} | {
    readonly kind: 'node';
    readonly node: ConversationNode;
} | {
    readonly kind: 'assistant';
    readonly node?: AssistantMessageNode;
    readonly partial: TrajectoryPartialAssistant | null;
    readonly request?: Extract<RequestView, {
        purpose: 'assistant';
    }>;
} | {
    readonly kind: 'tool';
    readonly root: ToolCallBlock;
} | {
    readonly kind: 'request-header';
    readonly header: TrajectoryRequestHeaderState;
} | {
    readonly kind: 'compaction';
    readonly request: Extract<RequestView, {
        purpose: 'compaction';
    }>;
} | {
    readonly kind: 'session-end';
    readonly seq: number;
    readonly time: number;
} | {
    readonly kind: 'turn-end';
    readonly turn: number;
    readonly time: number;
    readonly error?: string;
    readonly errorCode?: string;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-trajectory.md#接入-ui-trajectory) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface TrajectoryRequestHeaderState {
  readonly seq: number
  readonly time: number
  readonly prompt: ConversationPromptSnapshot
  readonly change?: RequestPromptChange
  readonly location: ConversationLocation
}

export interface TrajectoryPartialAssistant extends PartialAssistant {
  readonly timing?: Pick<AssistantTiming, 'stepStartTime' | 'firstTokenTime'>
}
```

## TrajectoryConversationViewNode client

入口 `@deepseek-ai/dsh-client-ui-trajectory/client`，公开符号 `TrajectoryConversationViewNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TrajectoryConversationViewNode extends ConversationViewNode {
    readonly target: 'trajectory';
    readonly anchorSeq: number;
    readonly location: ConversationLocation;
    readonly data: TrajectoryContribution;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `target` | `readonly target: 'trajectory';` |
| `anchorSeq` | `readonly anchorSeq: number;` |
| `location` | `readonly location: ConversationLocation;` |
| `data` | `readonly data: TrajectoryContribution;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-trajectory.md#接入-ui-trajectory) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type TrajectoryContribution =
  | { readonly kind: 'system-prompt'; readonly prompt: SystemPromptNode }
  | {
    readonly kind: 'node'
    readonly node: ConversationNode
  }
  | {
    readonly kind: 'assistant'
    readonly node?: AssistantMessageNode
    readonly partial: TrajectoryPartialAssistant | null
    readonly request?: Extract<RequestView, { purpose: 'assistant' }>
  }
  | {
    readonly kind: 'tool'
    readonly root: ToolCallBlock
  }
  | {
    readonly kind: 'request-header'
    readonly header: TrajectoryRequestHeaderState
  }
  | {
    readonly kind: 'compaction'
    readonly request: Extract<RequestView, { purpose: 'compaction' }>
  }
  | {
    readonly kind: 'session-end'
    readonly seq: number
    readonly time: number
  }
  | {
    readonly kind: 'turn-end'
    readonly turn: number
    readonly time: number
    readonly error?: string
    readonly errorCode?: string
  }

export interface TrajectoryRequestHeaderState {
  readonly seq: number
  readonly time: number
  readonly prompt: ConversationPromptSnapshot
  readonly change?: RequestPromptChange
  readonly location: ConversationLocation
}

export interface TrajectoryPartialAssistant extends PartialAssistant {
  readonly timing?: Pick<AssistantTiming, 'stepStartTime' | 'firstTokenTime'>
}
```

## TrajectoryRequestHeaderState client

入口 `@deepseek-ai/dsh-client-ui-trajectory/client`，公开符号 `TrajectoryRequestHeaderState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TrajectoryRequestHeaderState {
    readonly seq: number;
    readonly time: number;
    readonly prompt: ConversationPromptSnapshot;
    readonly change?: RequestPromptChange;
    readonly location: ConversationLocation;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `seq` | `readonly seq: number;` |
| `time` | `readonly time: number;` |
| `prompt` | `readonly prompt: ConversationPromptSnapshot;` |
| `change` | `readonly change?: RequestPromptChange;` |
| `location` | `readonly location: ConversationLocation;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-trajectory.md#接入-ui-trajectory) 在真实装载路径检验成功、失败与卸载。

## TrajectorySnapshot client

入口 `@deepseek-ai/dsh-client-ui-trajectory/client`，公开符号 `TrajectorySnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TrajectorySnapshot {
    readonly systemPrompts?: readonly SystemPromptNode[];
    readonly eventNodes: readonly ConversationNode[];
    readonly eventLocations: ReadonlyMap<number, ConversationLocation>;
    readonly requests: readonly RequestView[];
    readonly callSchemas: ReadonlyMap<string, ConversationPromptSnapshot['tools'][number]>;
    readonly partial: TrajectoryPartialAssistant | null;
    readonly runningCalls: readonly RunningToolCall[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `systemPrompts` | `readonly systemPrompts?: readonly SystemPromptNode[];` |
| `eventNodes` | `readonly eventNodes: readonly ConversationNode[];` |
| `eventLocations` | `readonly eventLocations: ReadonlyMap<number, ConversationLocation>;` |
| `requests` | `readonly requests: readonly RequestView[];` |
| `callSchemas` | `readonly callSchemas: ReadonlyMap<string, ConversationPromptSnapshot['tools'][number]>;` |
| `partial` | `readonly partial: TrajectoryPartialAssistant \| null;` |
| `runningCalls` | `readonly runningCalls: readonly RunningToolCall[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-trajectory.md#接入-ui-trajectory) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface TrajectoryPartialAssistant extends PartialAssistant {
  readonly timing?: Pick<AssistantTiming, 'stepStartTime' | 'firstTokenTime'>
}
```

## UseTrajectory client

入口 `@deepseek-ai/dsh-client-ui-trajectory/client`，公开符号 `UseTrajectory`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UseTrajectory = SnapshotSelectorHook<TrajectorySnapshot>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-trajectory.md#接入-ui-trajectory) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface TrajectorySnapshot {

  readonly systemPrompts?: readonly SystemPromptNode[]
  readonly eventNodes: readonly ConversationNode[]
  readonly eventLocations: ReadonlyMap<number, ConversationLocation>
  readonly requests: readonly RequestView[]
  readonly callSchemas: ReadonlyMap<string, ConversationPromptSnapshot['tools'][number]>
  readonly partial: TrajectoryPartialAssistant | null
  readonly runningCalls: readonly RunningToolCall[]
}

export interface TrajectoryPartialAssistant extends PartialAssistant {
  readonly timing?: Pick<AssistantTiming, 'stepStartTime' | 'firstTokenTime'>
}
```
