# ui-conversation：draft-editor 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

会话内容、输入与呈现分别由注册表和标准 source 装配；SlotMap 的 owner props 只描述父级提供的数据，不等于可任意构造的运行时对象。读取 Session 投影与已持久结果后展示；不要在组件 render 期间提交消息或创建连接。自定义节点、视图、分组与输入命令须挂入各自的 definition registry，随插件清理。

## ArbitrateKey client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ArbitrateKey`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ArbitrateKey = 'up' | 'down' | 'enter' | 'escape' | 'tab' | 'tabBack';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ArbitrateOutcome client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ArbitrateOutcome`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ArbitrateOutcome = 'consumed' | 'pick-highlighted' | 'pass';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## DraftInput client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `DraftInput`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DraftInput = string | DraftSnapshot;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface DraftSnapshot {
  readonly text: string
  readonly references: readonly DraftReference[]
  readonly command?: DraftCommand
}

export type DraftReference = Omit<Occurrence, 'occurrenceId'>

export interface DraftCommand {

  readonly token: string
}

export interface Occurrence {

  readonly occurrenceId: number

  readonly source: string

  readonly ref: string

  readonly offset: number

  readonly length: number

  readonly label: string

  readonly appearance?: ReferenceInsert['appearance']

  readonly clipboardText: string

  readonly invalid?: boolean
}

export interface ReferenceInsert {
  readonly source: string
  readonly ref: string
  readonly label: string
  readonly appearance?: 'session' | 'file' | 'folder'
  readonly clipboardText: string
}
```

## DraftReference client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `DraftReference`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DraftReference = Omit<Occurrence, 'occurrenceId'>;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface Occurrence {

  readonly occurrenceId: number

  readonly source: string

  readonly ref: string

  readonly offset: number

  readonly length: number

  readonly label: string

  readonly appearance?: ReferenceInsert['appearance']

  readonly clipboardText: string

  readonly invalid?: boolean
}

export interface ReferenceInsert {
  readonly source: string
  readonly ref: string
  readonly label: string
  readonly appearance?: 'session' | 'file' | 'folder'
  readonly clipboardText: string
}
```

## DraftSnapshot client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `DraftSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DraftSnapshot {
    readonly text: string;
    readonly references: readonly DraftReference[];
    readonly command?: DraftCommand;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `text` | `readonly text: string;` |
| `references` | `readonly references: readonly DraftReference[];` |
| `command` | `readonly command?: DraftCommand;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type DraftReference = Omit<Occurrence, 'occurrenceId'>

export interface DraftCommand {

  readonly token: string
}

export interface Occurrence {

  readonly occurrenceId: number

  readonly source: string

  readonly ref: string

  readonly offset: number

  readonly length: number

  readonly label: string

  readonly appearance?: ReferenceInsert['appearance']

  readonly clipboardText: string

  readonly invalid?: boolean
}

export interface ReferenceInsert {
  readonly source: string
  readonly ref: string
  readonly label: string
  readonly appearance?: 'session' | 'file' | 'folder'
  readonly clipboardText: string
}
```

## ReferenceInsert client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ReferenceInsert`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ReferenceInsert {
    readonly source: string;
    readonly ref: string;
    readonly label: string;
    readonly appearance?: 'session' | 'file' | 'folder';
    readonly clipboardText: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `source` | `readonly source: string;` |
| `ref` | `readonly ref: string;` |
| `label` | `readonly label: string;` |
| `appearance` | `readonly appearance?: 'session' \| 'file' \| 'folder';` |
| `clipboardText` | `readonly clipboardText: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## TokenSpan client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `TokenSpan`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TokenSpan {
    readonly start: number;
    readonly end: number;
    readonly draftRev: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `start` | `readonly start: number;` |
| `end` | `readonly end: number;` |
| `draftRev` | `readonly draftRev: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。
