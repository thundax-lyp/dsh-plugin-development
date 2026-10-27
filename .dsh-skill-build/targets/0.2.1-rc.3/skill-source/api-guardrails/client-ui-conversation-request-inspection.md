# ui-conversation：request-inspection 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

会话内容、输入与呈现分别由注册表和标准 source 装配；SlotMap 的 owner props 只描述父级提供的数据，不等于可任意构造的运行时对象。读取 Session 投影与已持久结果后展示；不要在组件 render 期间提交消息或创建连接。自定义节点、视图、分组与输入命令须挂入各自的 definition registry，随插件清理。

## ConversationPromptSnapshot client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationPromptSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationPromptSnapshot {
    config: AssistantRequestConfig;
    system: string;
    tools: readonly ToolSchema[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `config` | `config: AssistantRequestConfig;` |
| `system` | `system: string;` |
| `tools` | `tools: readonly ToolSchema[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## RequestInspectionSnapshot client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `RequestInspectionSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface RequestInspectionSnapshot {
    requests: readonly RequestView[];
    callSchemas: ReadonlyMap<string, ToolSchema>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `requests` | `requests: readonly RequestView[];` |
| `callSchemas` | `callSchemas: ReadonlyMap<string, ToolSchema>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type RequestView = AssistantRequestView | CompactionRequestView

interface AssistantRequestView extends RequestViewBase {
  purpose: 'assistant'
  turn: number

  step: number

  prompt?: ConversationPromptSnapshot

  promptChange?: RequestPromptChange

  retry?: number
  maxRetries?: number
  retryDelayMs?: number
}

interface CompactionRequestView extends RequestViewBase {
  purpose: 'compaction'

  turn: number | null

  step: 0

  replacementSeq?: number

  summary?: readonly ContentBlock[]

  rawOutput?: readonly ContentBlock[]
}

export interface ConversationPromptSnapshot {

  config: AssistantRequestConfig

  system: string

  tools: readonly ToolSchema[]
}

export interface RequestPromptChange {

  seq: number

  time: number

  kind: 'initial' | 'system' | 'tools' | 'system-and-tools'

  previous?: ConversationPromptSnapshot
}

interface RequestViewBase {

  startSeq: number
  startedAt: number
  completedAt: number | null
  status: 'running' | 'complete' | 'error'

  error?: string

  errorCode?: string
  providerMetadata?: AssistantProviderMetadataView
  requestConfig?: AssistantRequestConfig
  usage?: unknown

  resultSeq?: number
}
```

## RequestPromptChange client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `RequestPromptChange`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface RequestPromptChange {
    seq: number;
    time: number;
    kind: 'initial' | 'system' | 'tools' | 'system-and-tools';
    previous?: ConversationPromptSnapshot;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `seq` | `seq: number;` |
| `time` | `time: number;` |
| `kind` | `kind: 'initial' \| 'system' \| 'tools' \| 'system-and-tools';` |
| `previous` | `previous?: ConversationPromptSnapshot;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConversationPromptSnapshot {

  config: AssistantRequestConfig

  system: string

  tools: readonly ToolSchema[]
}
```

## RequestPromptInspection client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `RequestPromptInspection`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface RequestPromptInspection {
    prompt: ConversationPromptSnapshot;
    change?: RequestPromptChange;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `prompt` | `prompt: ConversationPromptSnapshot;` |
| `change` | `change?: RequestPromptChange;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConversationPromptSnapshot {

  config: AssistantRequestConfig

  system: string

  tools: readonly ToolSchema[]
}

export interface RequestPromptChange {

  seq: number

  time: number

  kind: 'initial' | 'system' | 'tools' | 'system-and-tools'

  previous?: ConversationPromptSnapshot
}
```

## RequestPromptInspector client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `RequestPromptInspector`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type RequestPromptInspector = (previous: ConversationPromptSnapshot | undefined, event: SessionEvent<'request/header'>, system: SystemPromptNode | undefined) => RequestPromptInspection;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConversationPromptSnapshot {

  config: AssistantRequestConfig

  system: string

  tools: readonly ToolSchema[]
}

export interface SystemPromptNode {

  seq: number

  time: number

  turn: number

  step: number

  text: string

  update: boolean
}

export interface RequestPromptInspection {

  prompt: ConversationPromptSnapshot

  change?: RequestPromptChange
}

export interface RequestPromptChange {

  seq: number

  time: number

  kind: 'initial' | 'system' | 'tools' | 'system-and-tools'

  previous?: ConversationPromptSnapshot
}
```

## RequestView client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `RequestView`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type RequestView = AssistantRequestView | CompactionRequestView;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
interface AssistantRequestView extends RequestViewBase {
  purpose: 'assistant'
  turn: number

  step: number

  prompt?: ConversationPromptSnapshot

  promptChange?: RequestPromptChange

  retry?: number
  maxRetries?: number
  retryDelayMs?: number
}

interface CompactionRequestView extends RequestViewBase {
  purpose: 'compaction'

  turn: number | null

  step: 0

  replacementSeq?: number

  summary?: readonly ContentBlock[]

  rawOutput?: readonly ContentBlock[]
}

export interface ConversationPromptSnapshot {

  config: AssistantRequestConfig

  system: string

  tools: readonly ToolSchema[]
}

export interface RequestPromptChange {

  seq: number

  time: number

  kind: 'initial' | 'system' | 'tools' | 'system-and-tools'

  previous?: ConversationPromptSnapshot
}

interface RequestViewBase {

  startSeq: number
  startedAt: number
  completedAt: number | null
  status: 'running' | 'complete' | 'error'

  error?: string

  errorCode?: string
  providerMetadata?: AssistantProviderMetadataView
  requestConfig?: AssistantRequestConfig
  usage?: unknown

  resultSeq?: number
}
```

## SystemPromptNode client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `SystemPromptNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SystemPromptNode {
    seq: number;
    time: number;
    turn: number;
    step: number;
    text: string;
    update: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `seq` | `seq: number;` |
| `time` | `time: number;` |
| `turn` | `turn: number;` |
| `step` | `step: number;` |
| `text` | `text: string;` |
| `update` | `update: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## inspectRequestPrompt client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `inspectRequestPrompt`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function inspectRequestPrompt(previous: ConversationPromptSnapshot | undefined, event: SessionEvent<'request/header'>, system: SystemPromptNode | undefined): RequestPromptInspection;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface ConversationPromptSnapshot {

  config: AssistantRequestConfig

  system: string

  tools: readonly ToolSchema[]
}

export interface SystemPromptNode {

  seq: number

  time: number

  turn: number

  step: number

  text: string

  update: boolean
}

export interface RequestPromptInspection {

  prompt: ConversationPromptSnapshot

  change?: RequestPromptChange
}

export interface RequestPromptChange {

  seq: number

  time: number

  kind: 'initial' | 'system' | 'tools' | 'system-and-tools'

  previous?: ConversationPromptSnapshot
}
```
