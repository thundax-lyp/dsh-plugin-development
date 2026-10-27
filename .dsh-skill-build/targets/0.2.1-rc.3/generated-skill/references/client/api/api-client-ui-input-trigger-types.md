# ui-input-trigger：types 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

输入触发器区分检测、候选、选择和提交。匹配源、选中值与文本插入在 controller 中仲裁；检测不应发送业务请求。候选加载失败、输入变化和取消需要使用各调用给定的 signal/结果分支，不能让陈旧菜单结果提交到新输入。

## CandidateRequest client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `CandidateRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface CandidateRequest {
    readonly query: string;
    readonly quoted?: boolean;
    readonly position: TriggerPosition;
    readonly drilled: boolean;
    readonly signal: AbortSignal;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `query` | `readonly query: string;` |
| `quoted` | `readonly quoted?: boolean;` |
| `position` | `readonly position: TriggerPosition;` |
| `drilled` | `readonly drilled: boolean;` |
| `signal` | `readonly signal: AbortSignal;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type TriggerPosition = 'leading' | 'inline'
```

## ClientSessionContext client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `ClientSessionContext`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ClientSessionContext {
    readonly sessionId: SessionId;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `sessionId` | `readonly sessionId: SessionId;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

## HeaderRequest client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `HeaderRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface HeaderRequest {
    readonly query: string;
    readonly quoted?: boolean;
    readonly drilled: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `query` | `readonly query: string;` |
| `quoted` | `readonly quoted?: boolean;` |
| `drilled` | `readonly drilled: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

## InputTriggerCandidate client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `InputTriggerCandidate`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface InputTriggerCandidate {
    readonly name: string;
    readonly label?: string;
    readonly description?: string;
    readonly icon?: InputTriggerCandidateIcon | ComponentType<IconProps>;
    readonly hint?: string;
    readonly section?: string;
    readonly value?: string;
    readonly drill?: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `name` | `readonly name: string;` |
| `label` | `readonly label?: string;` |
| `description` | `readonly description?: string;` |
| `icon` | `readonly icon?: InputTriggerCandidateIcon \| ComponentType<IconProps>;` |
| `hint` | `readonly hint?: string;` |
| `section` | `readonly section?: string;` |
| `value` | `readonly value?: string;` |
| `drill` | `readonly drill?: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type InputTriggerCandidateIcon = 'file' | 'folder' | 'session'
```

## InputTriggerCrumb client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `InputTriggerCrumb`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface InputTriggerCrumb {
    readonly label: string;
    readonly value: string;
    readonly current?: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `label` | `readonly label: string;` |
| `value` | `readonly value: string;` |
| `current` | `readonly current?: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

## InputTriggerPick client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `InputTriggerPick`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface InputTriggerPick {
    readonly candidate: InputTriggerCandidate;
    readonly session: ClientSessionContext;
    readonly position: TriggerPosition;
    readonly via: PickVia;
    readonly action: PickAction;
    readonly span: TokenSpan;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `candidate` | `readonly candidate: InputTriggerCandidate;` |
| `session` | `readonly session: ClientSessionContext;` |
| `position` | `readonly position: TriggerPosition;` |
| `via` | `readonly via: PickVia;` |
| `action` | `readonly action: PickAction;` |
| `span` | `readonly span: TokenSpan;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ClientSessionContext {
  readonly sessionId: SessionId
}

export type TriggerPosition = 'leading' | 'inline'

export type PickVia = 'menu' | 'space' | 'enter'

export type PickAction = 'pick' | 'drill'

export interface InputTriggerCandidate {

  readonly name: string

  readonly label?: string
  readonly description?: string

  readonly icon?: InputTriggerCandidateIcon | ComponentType<IconProps>
  readonly hint?: string

  readonly section?: string

  readonly value?: string

  readonly drill?: boolean
}

export type InputTriggerCandidateIcon = 'file' | 'folder' | 'session'
```

## InputTriggerSource client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `InputTriggerSource`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface InputTriggerSource {
    readonly trigger: TriggerChar;
    readonly name: string;
    readonly order?: number;
    readonly showGroupTitle?: boolean;
    candidates(session: ClientSessionContext, req: CandidateRequest): Promise<readonly InputTriggerCandidate[]>;
    header?(session: ClientSessionContext, req: HeaderRequest): readonly InputTriggerCrumb[] | undefined;
    onPick(pick: InputTriggerPick): PickOutcome;
    matchSpace?(session: ClientSessionContext, token: string): PickOutcome;
    matchEnter?(session: ClientSessionContext, line: string, signal: AbortSignal, envelope: SubmitEnvelope): Promise<PickOutcome>;
    matchClaim?(session: ClientSessionContext, token: string, signal: AbortSignal): Promise<CommandClaim | undefined>;
    warm?(session: ClientSessionContext): void;
    lexicon?(session: ClientSessionContext): readonly string[] | undefined;
    subscribeLexicon?(session: ClientSessionContext, listener: () => void): () => void;
    openReference?(session: ClientSessionContext, reference: Pick<ReferenceInsert, 'ref' | 'appearance'>): boolean;
    readonly codec?: ReferenceCodec;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `trigger` | `readonly trigger: TriggerChar;` |
| `name` | `readonly name: string;` |
| `order` | `readonly order?: number;` |
| `showGroupTitle` | `readonly showGroupTitle?: boolean;` |
| `candidates` | `candidates(session: ClientSessionContext, req: CandidateRequest): Promise<readonly InputTriggerCandidate[]>;` |
| `header` | `header?(session: ClientSessionContext, req: HeaderRequest): readonly InputTriggerCrumb[] \| undefined;` |
| `onPick` | `onPick(pick: InputTriggerPick): PickOutcome;` |
| `matchSpace` | `matchSpace?(session: ClientSessionContext, token: string): PickOutcome;` |
| `matchEnter` | `matchEnter?(session: ClientSessionContext, line: string, signal: AbortSignal, envelope: SubmitEnvelope): Promise<PickOutcome>;` |
| `matchClaim` | `matchClaim?(session: ClientSessionContext, token: string, signal: AbortSignal): Promise<CommandClaim \| undefined>;` |
| `warm` | `warm?(session: ClientSessionContext): void;` |
| `lexicon` | `lexicon?(session: ClientSessionContext): readonly string[] \| undefined;` |
| `subscribeLexicon` | `subscribeLexicon?(session: ClientSessionContext, listener: () => void): () => void;` |
| `openReference` | `openReference?(session: ClientSessionContext, reference: Pick<ReferenceInsert, 'ref' \| 'appearance'>): boolean;` |
| `codec` | `readonly codec?: ReferenceCodec;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ClientSessionContext {
  readonly sessionId: SessionId
}

export type TriggerChar = '/' | '@'

export interface InputTriggerCandidate {

  readonly name: string

  readonly label?: string
  readonly description?: string

  readonly icon?: InputTriggerCandidateIcon | ComponentType<IconProps>
  readonly hint?: string

  readonly section?: string

  readonly value?: string

  readonly drill?: boolean
}

export interface InputTriggerCrumb {

  readonly label: string

  readonly value: string

  readonly current?: boolean
}

export interface HeaderRequest {

  readonly query: string

  readonly quoted?: boolean

  readonly drilled: boolean
}

export interface SubmitEnvelope {

  readonly attachments: number
}

export interface CandidateRequest {
  readonly query: string

  readonly quoted?: boolean
  readonly position: TriggerPosition

  readonly drilled: boolean
  readonly signal: AbortSignal
}

export interface InputTriggerPick {
  readonly candidate: InputTriggerCandidate
  readonly session: ClientSessionContext
  readonly position: TriggerPosition
  readonly via: PickVia

  readonly action: PickAction
  readonly span: TokenSpan
}

export interface ReferenceCodec {

  clipboardText(ref: string): string

  serialize(ref: string, signal: AbortSignal): Promise<string>
}

export type TriggerPosition = 'leading' | 'inline'

export type PickVia = 'menu' | 'space' | 'enter'

export type PickAction = 'pick' | 'drill'

export type InputTriggerCandidateIcon = 'file' | 'folder' | 'session'
```

## PickVia client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `PickVia`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PickVia = 'menu' | 'space' | 'enter';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

## ReferenceCodec client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `ReferenceCodec`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ReferenceCodec {
    clipboardText(ref: string): string;
    serialize(ref: string, signal: AbortSignal): Promise<string>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `clipboardText` | `clipboardText(ref: string): string;` |
| `serialize` | `serialize(ref: string, signal: AbortSignal): Promise<string>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

## SubmitEnvelope client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `SubmitEnvelope`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SubmitEnvelope {
    readonly attachments: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `attachments` | `readonly attachments: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

## TriggerChar client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `TriggerChar`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type TriggerChar = '/' | '@';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

## TriggerGuard client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `TriggerGuard`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TriggerGuard {
    readonly tier: 'plain' | 'claimed' | 'frozen';
}
```

| 成员 | 公开声明 |
| --- | --- |
| `tier` | `readonly tier: 'plain' \| 'claimed' \| 'frozen';` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

## TriggerPosition client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `TriggerPosition`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type TriggerPosition = 'leading' | 'inline';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。
