# ui-chat：chat-settings 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-chat 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## TranscriptViewMode client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `TranscriptViewMode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type TranscriptViewMode = typeof TRANSCRIPT_VIEW_MODES[number];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## CHAT_SETTINGS_NAMESPACE root

入口 `@deepseek-ai/dsh-client-ui-chat`，公开符号 `CHAT_SETTINGS_NAMESPACE`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const CHAT_SETTINGS_NAMESPACE = "ui-chat";
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## ChatSettings root

入口 `@deepseek-ai/dsh-client-ui-chat`，公开符号 `ChatSettings`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChatSettings {
    transcriptView?: TranscriptViewMode | typeof LEGACY_TRANSCRIPT_VIEW_MODE | typeof LEGACY_EXPANDED_TRANSCRIPT_VIEW_MODE | null;
    collapseTiming?: CollapseTiming;
    performanceUsage: PerformanceUsageMode;
    linkOpening: LinkOpening;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `transcriptView` | `transcriptView?: TranscriptViewMode \| typeof LEGACY_TRANSCRIPT_VIEW_MODE \| typeof LEGACY_EXPANDED_TRANSCRIPT_VIEW_MODE \| null;` |
| `collapseTiming` | `collapseTiming?: CollapseTiming;` |
| `performanceUsage` | `performanceUsage: PerformanceUsageMode;` |
| `linkOpening` | `linkOpening: LinkOpening;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type CollapseTiming = typeof COLLAPSE_TIMINGS[number]

export type TranscriptViewMode = typeof TRANSCRIPT_VIEW_MODES[number]

export type PerformanceUsageMode = typeof PERFORMANCE_USAGE_MODES[number]

export type LinkOpening = 'sidebar' | 'new-tab'
```

## DEFAULT_TRANSCRIPT_VIEW_MODE root

入口 `@deepseek-ai/dsh-client-ui-chat`，公开符号 `DEFAULT_TRANSCRIPT_VIEW_MODE`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const DEFAULT_TRANSCRIPT_VIEW_MODE: TranscriptViewMode;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type TranscriptViewMode = typeof TRANSCRIPT_VIEW_MODES[number]
```

## LEGACY_EXPANDED_TRANSCRIPT_VIEW_MODE root

入口 `@deepseek-ai/dsh-client-ui-chat`，公开符号 `LEGACY_EXPANDED_TRANSCRIPT_VIEW_MODE`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const LEGACY_EXPANDED_TRANSCRIPT_VIEW_MODE = "expanded";
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## LEGACY_TRANSCRIPT_VIEW_MODE root

入口 `@deepseek-ai/dsh-client-ui-chat`，公开符号 `LEGACY_TRANSCRIPT_VIEW_MODE`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const LEGACY_TRANSCRIPT_VIEW_MODE = "normal";
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## TRANSCRIPT_VIEW_FIELD root

入口 `@deepseek-ai/dsh-client-ui-chat`，公开符号 `TRANSCRIPT_VIEW_FIELD`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const TRANSCRIPT_VIEW_FIELD = "transcriptView";
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## TRANSCRIPT_VIEW_MODES root

入口 `@deepseek-ai/dsh-client-ui-chat`，公开符号 `TRANSCRIPT_VIEW_MODES`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const TRANSCRIPT_VIEW_MODES: readonly [
    "compact",
    "standard",
    "detailed",
    "verbose"
];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

## TranscriptViewMode root

入口 `@deepseek-ai/dsh-client-ui-chat`，公开符号 `TranscriptViewMode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type TranscriptViewMode = typeof TRANSCRIPT_VIEW_MODES[number];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。
