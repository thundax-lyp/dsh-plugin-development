# ui-chat：process-groups 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-chat 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## ProcessActivity client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ProcessActivity`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ProcessActivity = 'read' | 'readImage' | 'search' | 'write' | 'edit' | 'commands' | 'code' | 'webSearch' | 'webFetch' | 'subagents' | 'plan' | 'questions' | 'tools';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## ProcessActivitySummary client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ProcessActivitySummary`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ProcessActivitySummary {
    readonly counts: readonly {
        readonly kind: ProcessActivity;
        readonly count: number;
    }[];
    readonly running: ProcessActivity | undefined;
    readonly runningDetail: string;
    readonly preparing?: true;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `counts` | `readonly counts: readonly { readonly kind: ProcessActivity; readonly count: number; }[];` |
| `running` | `readonly running: ProcessActivity \| undefined;` |
| `runningDetail` | `readonly runningDetail: string;` |
| `preparing` | `readonly preparing?: true;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ProcessActivity = 'read' | 'readImage' | 'search' | 'write' | 'edit' | 'commands' | 'code'
  | 'webSearch' | 'webFetch' | 'subagents' | 'plan' | 'questions' | 'tools'
```

## ProcessGroupData client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ProcessGroupData`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ProcessGroupData {
    readonly turn: number;
    readonly closed: boolean;
    readonly summary: ProcessActivitySummary;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `turn` | `readonly turn: number;` |
| `closed` | `readonly closed: boolean;` |
| `summary` | `readonly summary: ProcessActivitySummary;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface ProcessActivitySummary {
  readonly counts: readonly { readonly kind: ProcessActivity; readonly count: number }[]
  readonly running: ProcessActivity | undefined
  readonly runningDetail: string

  readonly preparing?: true
}

export type ProcessActivity = 'read' | 'readImage' | 'search' | 'write' | 'edit' | 'commands' | 'code'
  | 'webSearch' | 'webFetch' | 'subagents' | 'plan' | 'questions' | 'tools'
```
