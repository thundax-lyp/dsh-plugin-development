# ui-session：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-session 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## PendingInteractionPublisher client

入口 `@deepseek-ai/dsh-client-ui-session/client`，公开符号 `PendingInteractionPublisher`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PendingInteractionPublisher<T extends SessionPendingInteractionBase> = (interaction: T, delegate: () => Promise<void>) => () => void;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-session.md#接入-ui-session) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SessionPendingInteractionBase {

  readonly key: string

  readonly kind: string

  readonly sessionId: SessionId
}
```

## SessionPendingInteraction client

入口 `@deepseek-ai/dsh-client-ui-session/client`，公开符号 `SessionPendingInteraction`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SessionPendingInteraction = [
    keyof SessionPendingInteractionMap
] extends [
    never
] ? SessionPendingInteractionBase : SessionPendingInteractionMap[keyof SessionPendingInteractionMap];
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-session.md#接入-ui-session) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SessionPendingInteractionBase {

  readonly key: string

  readonly kind: string

  readonly sessionId: SessionId
}

export interface SessionPendingInteractionMap {}
```

## SessionPendingInteractionBase client

入口 `@deepseek-ai/dsh-client-ui-session/client`，公开符号 `SessionPendingInteractionBase`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SessionPendingInteractionBase {
    readonly key: string;
    readonly kind: string;
    readonly sessionId: SessionId;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `key` | `readonly key: string;` |
| `kind` | `readonly kind: string;` |
| `sessionId` | `readonly sessionId: SessionId;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-session.md#接入-ui-session) 在真实装载路径检验成功、失败与卸载。

## SessionPendingInteractionMap client

入口 `@deepseek-ai/dsh-client-ui-session/client`，公开符号 `SessionPendingInteractionMap`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

同名接口还包含声明合并：以下后续声明分别来自 `@deepseek-ai/dsh-client-ui-session`、`@deepseek-ai/dsh-client-ui-approval`、`@deepseek-ai/dsh-client-ui-user-questions`。只有消费编译面实际导入相应包声明时，这些字段才加入类型；运行时还须由相应包声明 slot 或提供业务数据。不能由类型合并推定这些能力已在当前 Profile 挂载。

```text
export interface SessionPendingInteractionMap {
}

interface SessionPendingInteractionMap {
    approval: PendingApproval;
}

interface SessionPendingInteractionMap {
    question: PendingQuestion;
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-session.md#接入-ui-session) 在真实装载路径检验成功、失败与卸载。

## SessionSnapshotSelector client

入口 `@deepseek-ai/dsh-client-ui-session/client`，公开符号 `SessionSnapshotSelector`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SessionSnapshotSelector = SnapshotSelectorHook<SessionSnapshot>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-session.md#接入-ui-session) 在真实装载路径检验成功、失败与卸载。

## SessionSourceContribution client

入口 `@deepseek-ai/dsh-client-ui-session/client`，公开符号 `SessionSourceContribution`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SessionSourceContribution<Hooks extends SessionSourceRoster = SessionSourceRoster, KeyedHooks extends SessionSourceRoster = SessionSourceRoster, Props extends SessionSourceRoster = SessionSourceRoster> {
    readonly hooks?: SessionSourceRecord<Hooks, HostObservable<unknown>>;
    readonly keyedHooks?: SessionSourceRecord<KeyedHooks, KeyedStandardSource>;
    readonly props?: SessionSourceRecord<Props, unknown>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `readonly hooks?: SessionSourceRecord<Hooks, HostObservable<unknown>>;` |
| `keyedHooks` | `readonly keyedHooks?: SessionSourceRecord<KeyedHooks, KeyedStandardSource>;` |
| `props` | `readonly props?: SessionSourceRecord<Props, unknown>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-session.md#接入-ui-session) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
type SessionSourceRoster = readonly string[] | undefined

type SessionSourceRecord<Roster extends SessionSourceRoster, Value> =
  Roster extends readonly string[] ? Readonly<Record<Roster[number], Value>> : never
```

## SessionSourceDescriptor client

入口 `@deepseek-ai/dsh-client-ui-session/client`，公开符号 `SessionSourceDescriptor`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SessionSourceDescriptor<Hooks extends SessionSourceRoster = SessionSourceRoster, KeyedHooks extends SessionSourceRoster = SessionSourceRoster, Props extends SessionSourceRoster = SessionSourceRoster> {
    readonly hooks?: Hooks;
    readonly keyedHooks?: KeyedHooks;
    readonly props?: Props;
    resolve(binding: SessionBinding): SessionSourceContribution<NoInfer<Hooks>, NoInfer<KeyedHooks>, NoInfer<Props>>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `readonly hooks?: Hooks;` |
| `keyedHooks` | `readonly keyedHooks?: KeyedHooks;` |
| `props` | `readonly props?: Props;` |
| `resolve` | `resolve(binding: SessionBinding): SessionSourceContribution<NoInfer<Hooks>, NoInfer<KeyedHooks>, NoInfer<Props>>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-session.md#接入-ui-session) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
type SessionSourceRoster = readonly string[] | undefined

export interface SessionSourceContribution<
  Hooks extends SessionSourceRoster = SessionSourceRoster,
  KeyedHooks extends SessionSourceRoster = SessionSourceRoster,
  Props extends SessionSourceRoster = SessionSourceRoster,
> {
  readonly hooks?: SessionSourceRecord<Hooks, HostObservable<unknown>>
  readonly keyedHooks?: SessionSourceRecord<KeyedHooks, KeyedStandardSource>
  readonly props?: SessionSourceRecord<Props, unknown>
}

type SessionSourceRecord<Roster extends SessionSourceRoster, Value> =
  Roster extends readonly string[] ? Readonly<Record<Roster[number], Value>> : never
```

## SessionStatus client

入口 `@deepseek-ai/dsh-client-ui-session/client`，公开符号 `SessionStatus`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SessionStatus {
    readonly running: boolean | undefined;
    readonly pendingInteraction: SessionPendingInteraction | undefined;
    readonly completionUnread: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `running` | `readonly running: boolean \| undefined;` |
| `pendingInteraction` | `readonly pendingInteraction: SessionPendingInteraction \| undefined;` |
| `completionUnread` | `readonly completionUnread: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-session.md#接入-ui-session) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SessionPendingInteractionBase {

  readonly key: string

  readonly kind: string

  readonly sessionId: SessionId
}

export type SessionPendingInteraction =
  [keyof SessionPendingInteractionMap] extends [never]
    ? SessionPendingInteractionBase
    : SessionPendingInteractionMap[keyof SessionPendingInteractionMap]

export interface SessionPendingInteractionMap {}
```

## SessionStatusSnapshot client

入口 `@deepseek-ai/dsh-client-ui-session/client`，公开符号 `SessionStatusSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SessionStatusSnapshot = ReadonlyMap<SessionId, SessionStatus>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-session.md#接入-ui-session) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SessionStatus {

  readonly running: boolean | undefined

  readonly pendingInteraction: SessionPendingInteraction | undefined

  readonly completionUnread: boolean
}

export type SessionPendingInteraction =
  [keyof SessionPendingInteractionMap] extends [never]
    ? SessionPendingInteractionBase
    : SessionPendingInteractionMap[keyof SessionPendingInteractionMap]

export interface SessionPendingInteractionBase {

  readonly key: string

  readonly kind: string

  readonly sessionId: SessionId
}

export interface SessionPendingInteractionMap {}
```

## UiSession client

入口 `@deepseek-ai/dsh-client-ui-session/client`，公开符号 `UiSession`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class UiSession extends Service {
    readonly sessionStatus: HostObservable<SessionStatusSnapshot>;
    readonly adapter: SlotScopeAdapter;
    constructor(ctx: Context, sessions: ISessions);
    bindingSource(reference: SessionReference | undefined): HostObservable<StandardSourceBinding>;
    provide<const Hooks extends SessionSourceRoster = undefined, const KeyedHooks extends SessionSourceRoster = undefined, const Props extends SessionSourceRoster = undefined>(descriptor: SessionSourceDescriptor<Hooks, KeyedHooks, Props>): () => void;
    registerPendingInteraction<T extends SessionPendingInteractionBase>(precedence: (interaction: T) => number): PendingInteractionPublisher<T>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `sessionStatus` | `readonly sessionStatus: HostObservable<SessionStatusSnapshot>;` |
| `adapter` | `readonly adapter: SlotScopeAdapter;` |
| `constructor` | `constructor(ctx: Context, sessions: ISessions);` |
| `bindingSource` | `bindingSource(reference: SessionReference \| undefined): HostObservable<StandardSourceBinding>;` |
| `provide` | `provide<const Hooks extends SessionSourceRoster = undefined, const KeyedHooks extends SessionSourceRoster = undefined, const Props extends SessionSourceRoster = undefined>(descriptor: SessionSourceDescriptor<Hooks, KeyedHooks, Props>): () => void;` |
| `registerPendingInteraction` | `registerPendingInteraction<T extends SessionPendingInteractionBase>(precedence: (interaction: T) => number): PendingInteractionPublisher<T>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-session.md#接入-ui-session) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SessionPendingInteractionBase {

  readonly key: string

  readonly kind: string

  readonly sessionId: SessionId
}

export type SessionStatusSnapshot = ReadonlyMap<SessionId, SessionStatus>

export type PendingInteractionPublisher<T extends SessionPendingInteractionBase> = (
  interaction: T,
  delegate: () => Promise<void>,
) => () => void

type SessionSourceRoster = readonly string[] | undefined

export interface SessionSourceDescriptor<
  Hooks extends SessionSourceRoster = SessionSourceRoster,
  KeyedHooks extends SessionSourceRoster = SessionSourceRoster,
  Props extends SessionSourceRoster = SessionSourceRoster,
> {
  readonly hooks?: Hooks
  readonly keyedHooks?: KeyedHooks
  readonly props?: Props

  resolve(binding: SessionBinding): SessionSourceContribution<
    NoInfer<Hooks>,
    NoInfer<KeyedHooks>,
    NoInfer<Props>
  >
}

export interface SessionStatus {

  readonly running: boolean | undefined

  readonly pendingInteraction: SessionPendingInteraction | undefined

  readonly completionUnread: boolean
}

export interface SessionSourceContribution<
  Hooks extends SessionSourceRoster = SessionSourceRoster,
  KeyedHooks extends SessionSourceRoster = SessionSourceRoster,
  Props extends SessionSourceRoster = SessionSourceRoster,
> {
  readonly hooks?: SessionSourceRecord<Hooks, HostObservable<unknown>>
  readonly keyedHooks?: SessionSourceRecord<KeyedHooks, KeyedStandardSource>
  readonly props?: SessionSourceRecord<Props, unknown>
}

export type SessionPendingInteraction =
  [keyof SessionPendingInteractionMap] extends [never]
    ? SessionPendingInteractionBase
    : SessionPendingInteractionMap[keyof SessionPendingInteractionMap]

type SessionSourceRecord<Roster extends SessionSourceRoster, Value> =
  Roster extends readonly string[] ? Readonly<Record<Roster[number], Value>> : never

export interface SessionPendingInteractionMap {}
```

## UseSession client

入口 `@deepseek-ai/dsh-client-ui-session/client`，公开符号 `UseSession`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UseSession = SessionSnapshotSelector;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-session.md#接入-ui-session) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SessionSnapshotSelector = SnapshotSelectorHook<SessionSnapshot>
```

## UseSessionRetainInfo client

入口 `@deepseek-ai/dsh-client-ui-session/client`，公开符号 `UseSessionRetainInfo`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface UseSessionRetainInfo {
    (sessionId: SessionId): SessionRetainInfo | undefined;
    <Selected>(sessionId: SessionId, selector: (value: SessionRetainInfo | undefined) => Selected, equal?: (left: Selected, right: Selected) => boolean): Selected;
    <Selected>(selector: (value: SessionRetainInfo | undefined) => Selected, equal?: (left: Selected, right: Selected) => boolean): Selected;
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-session.md#接入-ui-session) 在真实装载路径检验成功、失败与卸载。

## UseSessionStatus client

入口 `@deepseek-ai/dsh-client-ui-session/client`，公开符号 `UseSessionStatus`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UseSessionStatus = SnapshotSelectorHook<SessionStatusSnapshot>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-session.md#接入-ui-session) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SessionStatusSnapshot = ReadonlyMap<SessionId, SessionStatus>

export interface SessionStatus {

  readonly running: boolean | undefined

  readonly pendingInteraction: SessionPendingInteraction | undefined

  readonly completionUnread: boolean
}

export type SessionPendingInteraction =
  [keyof SessionPendingInteractionMap] extends [never]
    ? SessionPendingInteractionBase
    : SessionPendingInteractionMap[keyof SessionPendingInteractionMap]

export interface SessionPendingInteractionBase {

  readonly key: string

  readonly kind: string

  readonly sessionId: SessionId
}

export interface SessionPendingInteractionMap {}
```

## UseSessions client

入口 `@deepseek-ai/dsh-client-ui-session/client`，公开符号 `UseSessions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UseSessions = SnapshotSelectorHook<SessionListState>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-session.md#接入-ui-session) 在真实装载路径检验成功、失败与卸载。
