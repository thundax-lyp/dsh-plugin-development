# ui-tool：slots 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

工具 UI 读取工具调用与规范结果，仅负责纯展示。工具 execute 的模型结果由 Host 工具契约负责；不要为 UI 另造一份工具 JSON 结果，也不要由组件改变 Session 日志。按运行、已结算等 phase 判别 props 后渲染。

## StartedToolCallViewProps client

入口 `@deepseek-ai/dsh-client-ui-tool/client`，公开符号 `StartedToolCallViewProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type StartedToolCallViewProps = Exclude<ToolCallViewProps, {
    readonly phase: 'preparing';
}>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-tool.md#接入-ui-tool) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ToolCallViewProps = PropsRuntime<'tool.call.toolview'>
```

## ToolCallCommonProps client

入口 `@deepseek-ai/dsh-client-ui-tool/client`，公开符号 `ToolCallCommonProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ToolCallCommonProps {
    useDisclosure: UseDisclosure;
    callId: string;
    toolName: string;
    cwd?: string | undefined;
    home?: string | undefined;
    openFile: (path: string, options?: OpenFileOptions) => void;
    loadImage: MessageImageLoader;
    inspect?: (() => void) | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `useDisclosure` | `useDisclosure: UseDisclosure;` |
| `callId` | `callId: string;` |
| `toolName` | `toolName: string;` |
| `cwd` | `cwd?: string \| undefined;` |
| `home` | `home?: string \| undefined;` |
| `openFile` | `openFile: (path: string, options?: OpenFileOptions) => void;` |
| `loadImage` | `loadImage: MessageImageLoader;` |
| `inspect` | `inspect?: (() => void) \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-tool.md#接入-ui-tool) 在真实装载路径检验成功、失败与卸载。

## ToolCallOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-tool/client`，公开符号 `ToolCallOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ToolCallOwnerProps = ToolCallCommonProps & ToolCallPhaseProps;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-tool.md#接入-ui-tool) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ToolCallCommonProps {

  useDisclosure: UseDisclosure

  callId: string

  toolName: string

  cwd?: string | undefined

  home?: string | undefined

  openFile: (path: string, options?: OpenFileOptions) => void

  loadImage: MessageImageLoader

  inspect?: (() => void) | undefined
}

export type ToolCallPhaseProps =
  | { readonly phase: 'preparing'; readonly block: PreparingToolCall }
  | { readonly phase: 'start'; readonly block: StartedToolCall }
  | { readonly phase: 'result'; readonly block: ToolResultNode }
```

## ToolCallPhaseProps client

入口 `@deepseek-ai/dsh-client-ui-tool/client`，公开符号 `ToolCallPhaseProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ToolCallPhaseProps = {
    readonly phase: 'preparing';
    readonly block: PreparingToolCall;
} | {
    readonly phase: 'start';
    readonly block: StartedToolCall;
} | {
    readonly phase: 'result';
    readonly block: ToolResultNode;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-tool.md#接入-ui-tool) 在真实装载路径检验成功、失败与卸载。

## ToolCallViewProps client

入口 `@deepseek-ai/dsh-client-ui-tool/client`，公开符号 `ToolCallViewProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ToolCallViewProps = PropsRuntime<'tool.call.toolview'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-tool.md#接入-ui-tool) 在真实装载路径检验成功、失败与卸载。

## ToolHostInfoInjected client

入口 `@deepseek-ai/dsh-client-ui-tool/client`，公开符号 `ToolHostInfoInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ToolHostInfoInjected = {
    hooks: {
        hostInfo: HostObservable<RemoteHostFacts>;
    };
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-tool.md#接入-ui-tool) 在真实装载路径检验成功、失败与卸载。

## ToolTreeProps client

入口 `@deepseek-ai/dsh-client-ui-tool/client`，公开符号 `ToolTreeProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ToolTreeProps = PropsRuntime<'conversation.chat.node', 'tool-call'> & PropsRenderSlots<'tool.call.toolview'> & PropsLocale<'conversation'> & InjectFace<ToolHostInfoInjected>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-tool.md#接入-ui-tool) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ToolHostInfoInjected = {
  hooks: {

    hostInfo: HostObservable<RemoteHostFacts>
  }
}
```

## UserQuestionPanels client

入口 `@deepseek-ai/dsh-client-ui-tool/client`，公开符号 `UserQuestionPanels`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface UserQuestionPanels {
    reveal(sessionId: SessionIdOf, callId: string): boolean;
    review(sessionId: SessionIdOf, callId: string, record: UserQuestionRecord): boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `reveal` | `reveal(sessionId: SessionIdOf, callId: string): boolean;` |
| `review` | `review(sessionId: SessionIdOf, callId: string, record: UserQuestionRecord): boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-tool.md#接入-ui-tool) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface UserQuestionRecord {

  readonly questions: readonly AskUserQuestionItem[]

  readonly answers: readonly AskUserQuestionAnswerItem[]
}
```

## UserQuestionRecord client

入口 `@deepseek-ai/dsh-client-ui-tool/client`，公开符号 `UserQuestionRecord`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface UserQuestionRecord {
    readonly questions: readonly AskUserQuestionItem[];
    readonly answers: readonly AskUserQuestionAnswerItem[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `questions` | `readonly questions: readonly AskUserQuestionItem[];` |
| `answers` | `readonly answers: readonly AskUserQuestionAnswerItem[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-tool.md#接入-ui-tool) 在真实装载路径检验成功、失败与卸载。
