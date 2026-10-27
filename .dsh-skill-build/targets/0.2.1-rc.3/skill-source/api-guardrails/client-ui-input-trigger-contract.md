# ui-input-trigger：contract 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

输入触发器区分检测、候选、选择和提交。匹配源、选中值与文本插入在 controller 中仲裁；检测不应发送业务请求。候选加载失败、输入变化和取消需要使用各调用给定的 signal/结果分支，不能让陈旧菜单结果提交到新输入。

## DetectTrigger client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `DetectTrigger`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DetectTrigger = (draft: string, caret: number, guard: TriggerGuard) => TriggerHit | null;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface TriggerHit {
  readonly trigger: TriggerChar

  readonly query: string

  readonly quoted: boolean

  readonly position: TriggerPosition

  readonly span: TokenSpan
}
```

## ExactMatch client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `ExactMatch`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ExactMatch = (groups: MenuState['groups'], source: string, name: string) => InputTriggerCandidate | null;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface MenuState {
  readonly open: boolean
  readonly hit: TriggerHit | null

  readonly generation: number
  readonly groups: readonly {
    readonly source: string

    readonly showGroupTitle?: boolean
    readonly status: 'pending' | 'ready'
    readonly items: readonly InputTriggerCandidate[]
  }[]
  readonly highlight: { readonly source: string; readonly index: number } | null
}

export interface TriggerHit {
  readonly trigger: TriggerChar

  readonly query: string

  readonly quoted: boolean

  readonly position: TriggerPosition

  readonly span: TokenSpan
}
```

## InputTriggerServiceContract client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `InputTriggerServiceContract`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface InputTriggerServiceContract {
    registerSource(src: InputTriggerSource): () => void;
    sessionOf(actx: ClientContext): InputTriggerController;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `registerSource` | `registerSource(src: InputTriggerSource): () => void;` |
| `sessionOf` | `sessionOf(actx: ClientContext): InputTriggerController;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

## MenuEvent client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `MenuEvent`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type MenuEvent = {
    readonly type: 'hit';
    readonly hit: TriggerHit | null;
} | {
    readonly type: 'source-settled';
    readonly generation: number;
    readonly source: string;
    readonly items?: readonly InputTriggerCandidate[];
} | {
    readonly type: 'source-failed';
    readonly generation: number;
    readonly source: string;
} | {
    readonly type: 'move';
    readonly dir: 1 | -1;
} | {
    readonly type: 'hover';
    readonly source: string;
    readonly index: number;
} | {
    readonly type: 'close';
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface TriggerHit {
  readonly trigger: TriggerChar

  readonly query: string

  readonly quoted: boolean

  readonly position: TriggerPosition

  readonly span: TokenSpan
}
```

## MenuReduce client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `MenuReduce`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type MenuReduce = (state: MenuState, ev: MenuEvent) => MenuState;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface MenuState {
  readonly open: boolean
  readonly hit: TriggerHit | null

  readonly generation: number
  readonly groups: readonly {
    readonly source: string

    readonly showGroupTitle?: boolean
    readonly status: 'pending' | 'ready'
    readonly items: readonly InputTriggerCandidate[]
  }[]
  readonly highlight: { readonly source: string; readonly index: number } | null
}

export type MenuEvent =
  | { readonly type: 'hit'; readonly hit: TriggerHit | null }
  | { readonly type: 'source-settled'; readonly generation: number; readonly source: string; readonly items?: readonly InputTriggerCandidate[] }
  | { readonly type: 'source-failed'; readonly generation: number; readonly source: string }
  | { readonly type: 'move'; readonly dir: 1 | -1 }
  | { readonly type: 'hover'; readonly source: string; readonly index: number }
  | { readonly type: 'close' }

export interface TriggerHit {
  readonly trigger: TriggerChar

  readonly query: string

  readonly quoted: boolean

  readonly position: TriggerPosition

  readonly span: TokenSpan
}
```

## MenuState client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `MenuState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface MenuState {
    readonly open: boolean;
    readonly hit: TriggerHit | null;
    readonly generation: number;
    readonly groups: readonly {
        readonly source: string;
        readonly showGroupTitle?: boolean;
        readonly status: 'pending' | 'ready';
        readonly items: readonly InputTriggerCandidate[];
    }[];
    readonly highlight: {
        readonly source: string;
        readonly index: number;
    } | null;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `open` | `readonly open: boolean;` |
| `hit` | `readonly hit: TriggerHit \| null;` |
| `generation` | `readonly generation: number;` |
| `groups` | `readonly groups: readonly { readonly source: string; readonly showGroupTitle?: boolean; readonly status: 'pending' \| 'ready'; readonly items: readonly InputTriggerCandidate[]; }[];` |
| `highlight` | `readonly highlight: { readonly source: string; readonly index: number; } \| null;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface TriggerHit {
  readonly trigger: TriggerChar

  readonly query: string

  readonly quoted: boolean

  readonly position: TriggerPosition

  readonly span: TokenSpan
}
```

## TriggerHit client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `TriggerHit`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TriggerHit {
    readonly trigger: TriggerChar;
    readonly query: string;
    readonly quoted: boolean;
    readonly position: TriggerPosition;
    readonly span: TokenSpan;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `trigger` | `readonly trigger: TriggerChar;` |
| `query` | `readonly query: string;` |
| `quoted` | `readonly quoted: boolean;` |
| `position` | `readonly position: TriggerPosition;` |
| `span` | `readonly span: TokenSpan;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。
