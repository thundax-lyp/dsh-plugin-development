# ui-conversation：conversation 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

会话内容、输入与呈现分别由注册表和标准 source 装配；SlotMap 的 owner props 只描述父级提供的数据，不等于可任意构造的运行时对象。读取 Session 投影与已持久结果后展示；不要在组件 render 期间提交消息或创建连接。自定义节点、视图、分组与输入命令须挂入各自的 definition registry，随插件清理。

## ConversationContextReader client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationContextReader`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationContextReader {
    previous<State>(kind: string): ConversationPreviousContext<State> | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `previous` | `previous<State>(kind: string): ConversationPreviousContext<State> \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConversationPreviousContext<State = unknown> {
  readonly key: string
  readonly kind: string
  readonly id: string
  readonly startSeq: number
  readonly state: Readonly<State>
  readonly matches: readonly ConversationMatch[]
}

export type ConversationMatch =
  | ConversationStartMatch
  | ConversationMatchOf<SessionEventLike, 'update'>

interface ConversationMatchOf<
  Event extends SessionEventLike,
  Role extends ConversationMatchResult['role'],
> {
  readonly event: Event
  readonly role: Role
  readonly location: ConversationLocation
}

export type ConversationStartMatch = ConversationMatchOf<SessionEventLike, 'start'>

export interface ConversationMatchResult {
  readonly id: string
  readonly role: 'start' | 'update'

  readonly exclusive?: true
}

export type ConversationLocation =
  | { readonly kind: 'session' }
  | { readonly kind: 'turn'; readonly turn: TurnLocation }
  | { readonly kind: 'step'; readonly turn: TurnLocation; readonly step: StepLocation }
  | { readonly kind: 'unresolved' }

export interface StepLocation {
  readonly turn: number
  readonly step: number
  readonly start: SessionEvent<'step/start'> | undefined
  readonly end: SessionEvent<'step/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'

  readonly data: ConversationLocationDataStore<ConversationStepDataMap>
}

export interface TurnLocation {
  readonly turn: number
  readonly start: SessionEvent<'turn/start'> | undefined
  readonly end: SessionEvent<'turn/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'
  readonly steps: readonly StepLocation[]

  readonly data: ConversationLocationDataStore<ConversationTurnDataMap>
}

export interface ConversationTurnDataMap {}

export interface ConversationStepDataMap {}

export interface ConversationLocationDataStore<DataMap extends object> {

  get<Key extends keyof DataMap & string>(key: Key): Readonly<DataMap[Key]> | undefined

  source<Key extends keyof DataMap & string>(
    key: Key,
  ): ConversationLocationDataSource<Readonly<DataMap[Key]> | undefined>
}
```

## ConversationLocation client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationLocation`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationLocation = {
    readonly kind: 'session';
} | {
    readonly kind: 'turn';
    readonly turn: TurnLocation;
} | {
    readonly kind: 'step';
    readonly turn: TurnLocation;
    readonly step: StepLocation;
} | {
    readonly kind: 'unresolved';
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface StepLocation {
  readonly turn: number
  readonly step: number
  readonly start: SessionEvent<'step/start'> | undefined
  readonly end: SessionEvent<'step/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'

  readonly data: ConversationLocationDataStore<ConversationStepDataMap>
}

export interface TurnLocation {
  readonly turn: number
  readonly start: SessionEvent<'turn/start'> | undefined
  readonly end: SessionEvent<'turn/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'
  readonly steps: readonly StepLocation[]

  readonly data: ConversationLocationDataStore<ConversationTurnDataMap>
}

export interface ConversationTurnDataMap {}

export interface ConversationStepDataMap {}

export interface ConversationLocationDataStore<DataMap extends object> {

  get<Key extends keyof DataMap & string>(key: Key): Readonly<DataMap[Key]> | undefined

  source<Key extends keyof DataMap & string>(
    key: Key,
  ): ConversationLocationDataSource<Readonly<DataMap[Key]> | undefined>
}

export interface ConversationLocationDataSource<Value> {

  readonly getSnapshot: () => Value

  readonly subscribe: (listener: () => void) => () => void
}
```

## ConversationLocationData client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationLocationData`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationLocationData = ConversationLocationDataOf<ConversationTurnDataMap, ConversationStepDataMap>;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConversationTurnDataMap {}

export interface ConversationStepDataMap {}

type ConversationLocationDataOf<TurnData extends object, StepData extends object> =
  [keyof TurnData | keyof StepData] extends [never]
    ? ConversationLocationDataValue
    : RegisteredTurnData<TurnData> | RegisteredStepData<StepData>

interface ConversationLocationDataValue {
  readonly kind: 'turn' | 'step'
  readonly turn: number
  readonly step?: number
  readonly key: string
  readonly value: unknown
}

type RegisteredTurnData<DataMap extends object> = {
  [Key in Extract<keyof DataMap, string>]: {
    readonly kind: 'turn'
    readonly turn: number
    readonly key: Key
    readonly value: DataMap[Key]
  }
}[Extract<keyof DataMap, string>]

type RegisteredStepData<DataMap extends object> = {
  [Key in Extract<keyof DataMap, string>]: {
    readonly kind: 'step'
    readonly turn: number
    readonly step: number
    readonly key: Key
    readonly value: DataMap[Key]
  }
}[Extract<keyof DataMap, string>]
```

## ConversationLocationDataScope client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationLocationDataScope`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationLocationDataScope = 'step' | 'turn';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationLocationDataSource client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationLocationDataSource`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationLocationDataSource<Value> {
    readonly getSnapshot: () => Value;
    readonly subscribe: (listener: () => void) => () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `getSnapshot` | `readonly getSnapshot: () => Value;` |
| `subscribe` | `readonly subscribe: (listener: () => void) => () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationLocationDataStore client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationLocationDataStore`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationLocationDataStore<DataMap extends object> {
    get<Key extends keyof DataMap & string>(key: Key): Readonly<DataMap[Key]> | undefined;
    source<Key extends keyof DataMap & string>(key: Key): ConversationLocationDataSource<Readonly<DataMap[Key]> | undefined>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `get` | `get<Key extends keyof DataMap & string>(key: Key): Readonly<DataMap[Key]> \| undefined;` |
| `source` | `source<Key extends keyof DataMap & string>(key: Key): ConversationLocationDataSource<Readonly<DataMap[Key]> \| undefined>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConversationLocationDataSource<Value> {

  readonly getSnapshot: () => Value

  readonly subscribe: (listener: () => void) => () => void
}
```

## ConversationMatch client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationMatch`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationMatch = ConversationStartMatch | ConversationMatchOf<SessionEventLike, 'update'>;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ConversationLocation =
  | { readonly kind: 'session' }
  | { readonly kind: 'turn'; readonly turn: TurnLocation }
  | { readonly kind: 'step'; readonly turn: TurnLocation; readonly step: StepLocation }
  | { readonly kind: 'unresolved' }

interface ConversationMatchOf<
  Event extends SessionEventLike,
  Role extends ConversationMatchResult['role'],
> {
  readonly event: Event
  readonly role: Role
  readonly location: ConversationLocation
}

export type ConversationStartMatch = ConversationMatchOf<SessionEventLike, 'start'>

export interface ConversationMatchResult {
  readonly id: string
  readonly role: 'start' | 'update'

  readonly exclusive?: true
}

export interface StepLocation {
  readonly turn: number
  readonly step: number
  readonly start: SessionEvent<'step/start'> | undefined
  readonly end: SessionEvent<'step/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'

  readonly data: ConversationLocationDataStore<ConversationStepDataMap>
}

export interface TurnLocation {
  readonly turn: number
  readonly start: SessionEvent<'turn/start'> | undefined
  readonly end: SessionEvent<'turn/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'
  readonly steps: readonly StepLocation[]

  readonly data: ConversationLocationDataStore<ConversationTurnDataMap>
}

export interface ConversationTurnDataMap {}

export interface ConversationStepDataMap {}

export interface ConversationLocationDataStore<DataMap extends object> {

  get<Key extends keyof DataMap & string>(key: Key): Readonly<DataMap[Key]> | undefined

  source<Key extends keyof DataMap & string>(
    key: Key,
  ): ConversationLocationDataSource<Readonly<DataMap[Key]> | undefined>
}

export interface ConversationLocationDataSource<Value> {

  readonly getSnapshot: () => Value

  readonly subscribe: (listener: () => void) => () => void
}
```

## ConversationMatchHandler client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationMatchHandler`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationMatchHandler = (event: SessionEventLike) => ConversationMatchResult | null;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConversationMatchResult {
  readonly id: string
  readonly role: 'start' | 'update'

  readonly exclusive?: true
}
```

## ConversationMatchResult client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationMatchResult`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationMatchResult {
    readonly id: string;
    readonly role: 'start' | 'update';
    readonly exclusive?: true;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `readonly id: string;` |
| `role` | `readonly role: 'start' \| 'update';` |
| `exclusive` | `readonly exclusive?: true;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationNodeContext client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationNodeContext`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationNodeContext<State = unknown> {
    readonly key: string;
    readonly kind: string;
    readonly id: string;
    readonly matches: readonly ConversationMatch[];
    readonly start: ConversationStartMatch | undefined;
    readonly state: State | undefined;
    readonly current: ReadonlyMap<string, ConversationViewNode | null>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `key` | `readonly key: string;` |
| `kind` | `readonly kind: string;` |
| `id` | `readonly id: string;` |
| `matches` | `readonly matches: readonly ConversationMatch[];` |
| `start` | `readonly start: ConversationStartMatch \| undefined;` |
| `state` | `readonly state: State \| undefined;` |
| `current` | `readonly current: ReadonlyMap<string, ConversationViewNode \| null>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ConversationStartMatch = ConversationMatchOf<SessionEventLike, 'start'>

export type ConversationMatch =
  | ConversationStartMatch
  | ConversationMatchOf<SessionEventLike, 'update'>

export interface ConversationViewNode {
  readonly key: string
  readonly kind: string
  readonly id: string
  readonly target: string
  readonly data: unknown
}

interface ConversationMatchOf<
  Event extends SessionEventLike,
  Role extends ConversationMatchResult['role'],
> {
  readonly event: Event
  readonly role: Role
  readonly location: ConversationLocation
}

export interface ConversationMatchResult {
  readonly id: string
  readonly role: 'start' | 'update'

  readonly exclusive?: true
}

export type ConversationLocation =
  | { readonly kind: 'session' }
  | { readonly kind: 'turn'; readonly turn: TurnLocation }
  | { readonly kind: 'step'; readonly turn: TurnLocation; readonly step: StepLocation }
  | { readonly kind: 'unresolved' }

export interface StepLocation {
  readonly turn: number
  readonly step: number
  readonly start: SessionEvent<'step/start'> | undefined
  readonly end: SessionEvent<'step/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'

  readonly data: ConversationLocationDataStore<ConversationStepDataMap>
}

export interface TurnLocation {
  readonly turn: number
  readonly start: SessionEvent<'turn/start'> | undefined
  readonly end: SessionEvent<'turn/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'
  readonly steps: readonly StepLocation[]

  readonly data: ConversationLocationDataStore<ConversationTurnDataMap>
}

export interface ConversationTurnDataMap {}

export interface ConversationStepDataMap {}

export interface ConversationLocationDataStore<DataMap extends object> {

  get<Key extends keyof DataMap & string>(key: Key): Readonly<DataMap[Key]> | undefined

  source<Key extends keyof DataMap & string>(
    key: Key,
  ): ConversationLocationDataSource<Readonly<DataMap[Key]> | undefined>
}

export interface ConversationLocationDataSource<Value> {

  readonly getSnapshot: () => Value

  readonly subscribe: (listener: () => void) => () => void
}
```

## ConversationNodeDefinition client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationNodeDefinition`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationNodeDefinition<State = unknown> {
    readonly kind: string;
    readonly target?: string;
    match(event: SessionEventLike): ConversationMatchResult | null;
    start(context: ConversationNodeContext<State>, match: ConversationStartMatch, reader: ConversationContextReader): State;
    update(context: ConversationNodeContext<State> & {
        readonly state: State;
    }, match: ConversationMatch): State;
    publication?(match: ConversationMatch): ConversationPublication;
    buildLocationData?(context: ConversationNodeContext<State>, scope: ConversationLocationDataScope, previous: ConversationLocationData | null): ConversationLocationData | null;
    buildViewNode?(context: ConversationNodeContext<State>): ConversationViewNode | null;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `readonly kind: string;` |
| `target` | `readonly target?: string;` |
| `match` | `match(event: SessionEventLike): ConversationMatchResult \| null;` |
| `start` | `start(context: ConversationNodeContext<State>, match: ConversationStartMatch, reader: ConversationContextReader): State;` |
| `update` | `update(context: ConversationNodeContext<State> & { readonly state: State; }, match: ConversationMatch): State;` |
| `publication` | `publication?(match: ConversationMatch): ConversationPublication;` |
| `buildLocationData` | `buildLocationData?(context: ConversationNodeContext<State>, scope: ConversationLocationDataScope, previous: ConversationLocationData \| null): ConversationLocationData \| null;` |
| `buildViewNode` | `buildViewNode?(context: ConversationNodeContext<State>): ConversationViewNode \| null;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConversationMatchResult {
  readonly id: string
  readonly role: 'start' | 'update'

  readonly exclusive?: true
}

interface ConversationLocationDataValue {
  readonly kind: 'turn' | 'step'
  readonly turn: number
  readonly step?: number
  readonly key: string
  readonly value: unknown
}

export type ConversationLocationData = ConversationLocationDataOf<
  ConversationTurnDataMap,
  ConversationStepDataMap
>

export type ConversationStartMatch = ConversationMatchOf<SessionEventLike, 'start'>

export type ConversationMatch =
  | ConversationStartMatch
  | ConversationMatchOf<SessionEventLike, 'update'>

export interface ConversationViewNode {
  readonly key: string
  readonly kind: string
  readonly id: string
  readonly target: string
  readonly data: unknown
}

export interface ConversationNodeContext<State = unknown> {
  readonly key: string
  readonly kind: string
  readonly id: string
  readonly matches: readonly ConversationMatch[]
  readonly start: ConversationStartMatch | undefined
  readonly state: State | undefined
  readonly current: ReadonlyMap<string, ConversationViewNode | null>
}

export interface ConversationContextReader {

  previous<State>(kind: string): ConversationPreviousContext<State> | undefined
}

export type ConversationPublication = 'none' | 'animation-frame' | 'immediate'

export type ConversationLocationDataScope = 'step' | 'turn'

export interface ConversationTurnDataMap {}

export interface ConversationStepDataMap {}

type ConversationLocationDataOf<TurnData extends object, StepData extends object> =
  [keyof TurnData | keyof StepData] extends [never]
    ? ConversationLocationDataValue
    : RegisteredTurnData<TurnData> | RegisteredStepData<StepData>

interface ConversationMatchOf<
  Event extends SessionEventLike,
  Role extends ConversationMatchResult['role'],
> {
  readonly event: Event
  readonly role: Role
  readonly location: ConversationLocation
}

export interface ConversationPreviousContext<State = unknown> {
  readonly key: string
  readonly kind: string
  readonly id: string
  readonly startSeq: number
  readonly state: Readonly<State>
  readonly matches: readonly ConversationMatch[]
}

type RegisteredTurnData<DataMap extends object> = {
  [Key in Extract<keyof DataMap, string>]: {
    readonly kind: 'turn'
    readonly turn: number
    readonly key: Key
    readonly value: DataMap[Key]
  }
}[Extract<keyof DataMap, string>]

type RegisteredStepData<DataMap extends object> = {
  [Key in Extract<keyof DataMap, string>]: {
    readonly kind: 'step'
    readonly turn: number
    readonly step: number
    readonly key: Key
    readonly value: DataMap[Key]
  }
}[Extract<keyof DataMap, string>]

export type ConversationLocation =
  | { readonly kind: 'session' }
  | { readonly kind: 'turn'; readonly turn: TurnLocation }
  | { readonly kind: 'step'; readonly turn: TurnLocation; readonly step: StepLocation }
  | { readonly kind: 'unresolved' }

export interface StepLocation {
  readonly turn: number
  readonly step: number
  readonly start: SessionEvent<'step/start'> | undefined
  readonly end: SessionEvent<'step/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'

  readonly data: ConversationLocationDataStore<ConversationStepDataMap>
}

export interface TurnLocation {
  readonly turn: number
  readonly start: SessionEvent<'turn/start'> | undefined
  readonly end: SessionEvent<'turn/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'
  readonly steps: readonly StepLocation[]

  readonly data: ConversationLocationDataStore<ConversationTurnDataMap>
}

export interface ConversationLocationDataStore<DataMap extends object> {

  get<Key extends keyof DataMap & string>(key: Key): Readonly<DataMap[Key]> | undefined

  source<Key extends keyof DataMap & string>(
    key: Key,
  ): ConversationLocationDataSource<Readonly<DataMap[Key]> | undefined>
}

export interface ConversationLocationDataSource<Value> {

  readonly getSnapshot: () => Value

  readonly subscribe: (listener: () => void) => () => void
}
```

## ConversationNodeDefinitionInput client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationNodeDefinitionInput`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationNodeDefinitionInput<State = unknown> = Omit<ConversationNodeDefinition<State>, 'match'> & {
    readonly match: ConversationMatchHandler | Readonly<Record<string, ConversationMatchHandler>>;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
interface ConversationLocationDataValue {
  readonly kind: 'turn' | 'step'
  readonly turn: number
  readonly step?: number
  readonly key: string
  readonly value: unknown
}

export type ConversationStartMatch = ConversationMatchOf<SessionEventLike, 'start'>

export type ConversationMatch =
  | ConversationStartMatch
  | ConversationMatchOf<SessionEventLike, 'update'>

export interface ConversationViewNode {
  readonly key: string
  readonly kind: string
  readonly id: string
  readonly target: string
  readonly data: unknown
}

export interface ConversationNodeContext<State = unknown> {
  readonly key: string
  readonly kind: string
  readonly id: string
  readonly matches: readonly ConversationMatch[]
  readonly start: ConversationStartMatch | undefined
  readonly state: State | undefined
  readonly current: ReadonlyMap<string, ConversationViewNode | null>
}

export interface ConversationContextReader {

  previous<State>(kind: string): ConversationPreviousContext<State> | undefined
}

export type ConversationPublication = 'none' | 'animation-frame' | 'immediate'

export type ConversationLocationDataScope = 'step' | 'turn'

export type ConversationMatchHandler = (event: SessionEventLike) => ConversationMatchResult | null

export interface ConversationNodeDefinition<State = unknown> {
  readonly kind: string

  readonly target?: string

  match(event: SessionEventLike): ConversationMatchResult | null

  start(
    context: ConversationNodeContext<State>,
    match: ConversationStartMatch,
    reader: ConversationContextReader,
  ): State

  update(
    context: ConversationNodeContext<State> & { readonly state: State },
    match: ConversationMatch,
  ): State

  publication?(match: ConversationMatch): ConversationPublication

  buildLocationData?(
    context: ConversationNodeContext<State>,
    scope: ConversationLocationDataScope,
    previous: ConversationLocationData | null,
  ): ConversationLocationData | null

  buildViewNode?(context: ConversationNodeContext<State>): ConversationViewNode | null
}

export interface ConversationMatchResult {
  readonly id: string
  readonly role: 'start' | 'update'

  readonly exclusive?: true
}

export type ConversationLocationData = ConversationLocationDataOf<
  ConversationTurnDataMap,
  ConversationStepDataMap
>

interface ConversationMatchOf<
  Event extends SessionEventLike,
  Role extends ConversationMatchResult['role'],
> {
  readonly event: Event
  readonly role: Role
  readonly location: ConversationLocation
}

export interface ConversationPreviousContext<State = unknown> {
  readonly key: string
  readonly kind: string
  readonly id: string
  readonly startSeq: number
  readonly state: Readonly<State>
  readonly matches: readonly ConversationMatch[]
}

export interface ConversationTurnDataMap {}

export interface ConversationStepDataMap {}

type ConversationLocationDataOf<TurnData extends object, StepData extends object> =
  [keyof TurnData | keyof StepData] extends [never]
    ? ConversationLocationDataValue
    : RegisteredTurnData<TurnData> | RegisteredStepData<StepData>

export type ConversationLocation =
  | { readonly kind: 'session' }
  | { readonly kind: 'turn'; readonly turn: TurnLocation }
  | { readonly kind: 'step'; readonly turn: TurnLocation; readonly step: StepLocation }
  | { readonly kind: 'unresolved' }

type RegisteredTurnData<DataMap extends object> = {
  [Key in Extract<keyof DataMap, string>]: {
    readonly kind: 'turn'
    readonly turn: number
    readonly key: Key
    readonly value: DataMap[Key]
  }
}[Extract<keyof DataMap, string>]

type RegisteredStepData<DataMap extends object> = {
  [Key in Extract<keyof DataMap, string>]: {
    readonly kind: 'step'
    readonly turn: number
    readonly step: number
    readonly key: Key
    readonly value: DataMap[Key]
  }
}[Extract<keyof DataMap, string>]

export interface StepLocation {
  readonly turn: number
  readonly step: number
  readonly start: SessionEvent<'step/start'> | undefined
  readonly end: SessionEvent<'step/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'

  readonly data: ConversationLocationDataStore<ConversationStepDataMap>
}

export interface TurnLocation {
  readonly turn: number
  readonly start: SessionEvent<'turn/start'> | undefined
  readonly end: SessionEvent<'turn/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'
  readonly steps: readonly StepLocation[]

  readonly data: ConversationLocationDataStore<ConversationTurnDataMap>
}

export interface ConversationLocationDataStore<DataMap extends object> {

  get<Key extends keyof DataMap & string>(key: Key): Readonly<DataMap[Key]> | undefined

  source<Key extends keyof DataMap & string>(
    key: Key,
  ): ConversationLocationDataSource<Readonly<DataMap[Key]> | undefined>
}

export interface ConversationLocationDataSource<Value> {

  readonly getSnapshot: () => Value

  readonly subscribe: (listener: () => void) => () => void
}
```

## ConversationPreviousContext client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationPreviousContext`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationPreviousContext<State = unknown> {
    readonly key: string;
    readonly kind: string;
    readonly id: string;
    readonly startSeq: number;
    readonly state: Readonly<State>;
    readonly matches: readonly ConversationMatch[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `key` | `readonly key: string;` |
| `kind` | `readonly kind: string;` |
| `id` | `readonly id: string;` |
| `startSeq` | `readonly startSeq: number;` |
| `state` | `readonly state: Readonly<State>;` |
| `matches` | `readonly matches: readonly ConversationMatch[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ConversationMatch =
  | ConversationStartMatch
  | ConversationMatchOf<SessionEventLike, 'update'>

interface ConversationMatchOf<
  Event extends SessionEventLike,
  Role extends ConversationMatchResult['role'],
> {
  readonly event: Event
  readonly role: Role
  readonly location: ConversationLocation
}

export type ConversationStartMatch = ConversationMatchOf<SessionEventLike, 'start'>

export interface ConversationMatchResult {
  readonly id: string
  readonly role: 'start' | 'update'

  readonly exclusive?: true
}

export type ConversationLocation =
  | { readonly kind: 'session' }
  | { readonly kind: 'turn'; readonly turn: TurnLocation }
  | { readonly kind: 'step'; readonly turn: TurnLocation; readonly step: StepLocation }
  | { readonly kind: 'unresolved' }

export interface StepLocation {
  readonly turn: number
  readonly step: number
  readonly start: SessionEvent<'step/start'> | undefined
  readonly end: SessionEvent<'step/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'

  readonly data: ConversationLocationDataStore<ConversationStepDataMap>
}

export interface TurnLocation {
  readonly turn: number
  readonly start: SessionEvent<'turn/start'> | undefined
  readonly end: SessionEvent<'turn/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'
  readonly steps: readonly StepLocation[]

  readonly data: ConversationLocationDataStore<ConversationTurnDataMap>
}

export interface ConversationTurnDataMap {}

export interface ConversationStepDataMap {}

export interface ConversationLocationDataStore<DataMap extends object> {

  get<Key extends keyof DataMap & string>(key: Key): Readonly<DataMap[Key]> | undefined

  source<Key extends keyof DataMap & string>(
    key: Key,
  ): ConversationLocationDataSource<Readonly<DataMap[Key]> | undefined>
}

export interface ConversationLocationDataSource<Value> {

  readonly getSnapshot: () => Value

  readonly subscribe: (listener: () => void) => () => void
}
```

## ConversationPublication client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationPublication`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationPublication = 'none' | 'animation-frame' | 'immediate';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationStartMatch client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationStartMatch`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationStartMatch = ConversationMatchOf<SessionEventLike, 'start'>;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ConversationLocation =
  | { readonly kind: 'session' }
  | { readonly kind: 'turn'; readonly turn: TurnLocation }
  | { readonly kind: 'step'; readonly turn: TurnLocation; readonly step: StepLocation }
  | { readonly kind: 'unresolved' }

interface ConversationMatchOf<
  Event extends SessionEventLike,
  Role extends ConversationMatchResult['role'],
> {
  readonly event: Event
  readonly role: Role
  readonly location: ConversationLocation
}

export interface ConversationMatchResult {
  readonly id: string
  readonly role: 'start' | 'update'

  readonly exclusive?: true
}

export interface StepLocation {
  readonly turn: number
  readonly step: number
  readonly start: SessionEvent<'step/start'> | undefined
  readonly end: SessionEvent<'step/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'

  readonly data: ConversationLocationDataStore<ConversationStepDataMap>
}

export interface TurnLocation {
  readonly turn: number
  readonly start: SessionEvent<'turn/start'> | undefined
  readonly end: SessionEvent<'turn/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'
  readonly steps: readonly StepLocation[]

  readonly data: ConversationLocationDataStore<ConversationTurnDataMap>
}

export interface ConversationTurnDataMap {}

export interface ConversationStepDataMap {}

export interface ConversationLocationDataStore<DataMap extends object> {

  get<Key extends keyof DataMap & string>(key: Key): Readonly<DataMap[Key]> | undefined

  source<Key extends keyof DataMap & string>(
    key: Key,
  ): ConversationLocationDataSource<Readonly<DataMap[Key]> | undefined>
}

export interface ConversationLocationDataSource<Value> {

  readonly getSnapshot: () => Value

  readonly subscribe: (listener: () => void) => () => void
}
```

## ConversationStepDataMap client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationStepDataMap`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

同名接口还包含声明合并：以下后续声明分别来自 `@deepseek-ai/dsh-client-ui-conversation`、`@deepseek-ai/dsh-client-ui-chat`。只有消费编译面实际导入相应包声明时，这些字段才加入类型；运行时还须由相应包声明 slot 或提供业务数据。不能由类型合并推定这些能力已在当前 Profile 挂载。

```text
export interface ConversationStepDataMap {
}

interface ConversationStepDataMap {
    'assistant-step': AssistantChatData;
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationTimelineSnapshot client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationTimelineSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationTimelineSnapshot {
    readonly turnOrder: readonly number[];
    readonly turns: ReadonlyMap<number, TurnLocation>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `turnOrder` | `readonly turnOrder: readonly number[];` |
| `turns` | `readonly turns: ReadonlyMap<number, TurnLocation>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface TurnLocation {
  readonly turn: number
  readonly start: SessionEvent<'turn/start'> | undefined
  readonly end: SessionEvent<'turn/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'
  readonly steps: readonly StepLocation[]

  readonly data: ConversationLocationDataStore<ConversationTurnDataMap>
}

export interface ConversationTurnDataMap {}

export interface ConversationLocationDataStore<DataMap extends object> {

  get<Key extends keyof DataMap & string>(key: Key): Readonly<DataMap[Key]> | undefined

  source<Key extends keyof DataMap & string>(
    key: Key,
  ): ConversationLocationDataSource<Readonly<DataMap[Key]> | undefined>
}

export interface StepLocation {
  readonly turn: number
  readonly step: number
  readonly start: SessionEvent<'step/start'> | undefined
  readonly end: SessionEvent<'step/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'

  readonly data: ConversationLocationDataStore<ConversationStepDataMap>
}

export interface ConversationStepDataMap {}

export interface ConversationLocationDataSource<Value> {

  readonly getSnapshot: () => Value

  readonly subscribe: (listener: () => void) => () => void
}
```

## ConversationTurnDataMap client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationTurnDataMap`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

同名接口还包含声明合并：以下后续声明分别来自 `@deepseek-ai/dsh-client-ui-conversation`、`@deepseek-ai/dsh-client-ui-chat`。只有消费编译面实际导入相应包声明时，这些字段才加入类型；运行时还须由相应包声明 slot 或提供业务数据。不能由类型合并推定这些能力已在当前 Profile 挂载。

```text
export interface ConversationTurnDataMap {
}

interface ConversationTurnDataMap {
    'turn-process': TurnProcessSpec;
}

interface ConversationTurnDataMap {
    'turn-tail': TurnTailChatData;
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationViewBuilder client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationViewBuilder`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationViewBuilder<Node extends ConversationViewNode = ConversationViewNode, Snapshot = unknown> {
    readonly empty: Snapshot;
    replace(input: {
        readonly nodes: readonly Node[];
        readonly timeline: ConversationTimelineSnapshot;
        readonly changedTurns?: readonly number[];
    }): Snapshot;
    apply(input: {
        readonly upserts: readonly Node[];
        readonly timeline: ConversationTimelineSnapshot;
        readonly changedTurns?: readonly number[];
    }): Snapshot;
    groupInput?(): ConversationGroupInput<Node>;
    publish?(): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `empty` | `readonly empty: Snapshot;` |
| `replace` | `replace(input: { readonly nodes: readonly Node[]; readonly timeline: ConversationTimelineSnapshot; readonly changedTurns?: readonly number[]; }): Snapshot;` |
| `apply` | `apply(input: { readonly upserts: readonly Node[]; readonly timeline: ConversationTimelineSnapshot; readonly changedTurns?: readonly number[]; }): Snapshot;` |
| `groupInput` | `groupInput?(): ConversationGroupInput<Node>;` |
| `publish` | `publish?(): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConversationViewNode {
  readonly key: string
  readonly kind: string
  readonly id: string
  readonly target: string
  readonly data: unknown
}

export interface ConversationTimelineSnapshot {
  readonly turnOrder: readonly number[]
  readonly turns: ReadonlyMap<number, TurnLocation>
}

export interface TurnLocation {
  readonly turn: number
  readonly start: SessionEvent<'turn/start'> | undefined
  readonly end: SessionEvent<'turn/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'
  readonly steps: readonly StepLocation[]

  readonly data: ConversationLocationDataStore<ConversationTurnDataMap>
}

export interface ConversationTurnDataMap {}

export interface ConversationLocationDataStore<DataMap extends object> {

  get<Key extends keyof DataMap & string>(key: Key): Readonly<DataMap[Key]> | undefined

  source<Key extends keyof DataMap & string>(
    key: Key,
  ): ConversationLocationDataSource<Readonly<DataMap[Key]> | undefined>
}

export interface StepLocation {
  readonly turn: number
  readonly step: number
  readonly start: SessionEvent<'step/start'> | undefined
  readonly end: SessionEvent<'step/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'

  readonly data: ConversationLocationDataStore<ConversationStepDataMap>
}

export interface ConversationStepDataMap {}

export interface ConversationLocationDataSource<Value> {

  readonly getSnapshot: () => Value

  readonly subscribe: (listener: () => void) => () => void
}
```

## ConversationViewDefinition client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationViewDefinition`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationViewDefinition<Node extends ConversationViewNode = ConversationViewNode, Snapshot = unknown> {
    readonly target: string;
    toolCallFocus?(callId: string): string;
    create(): ConversationViewBuilder<Node, Snapshot>;
    isActive?(snapshot: Snapshot): boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `target` | `readonly target: string;` |
| `toolCallFocus` | `toolCallFocus?(callId: string): string;` |
| `create` | `create(): ConversationViewBuilder<Node, Snapshot>;` |
| `isActive` | `isActive?(snapshot: Snapshot): boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConversationViewNode {
  readonly key: string
  readonly kind: string
  readonly id: string
  readonly target: string
  readonly data: unknown
}

export interface ConversationViewBuilder<Node extends ConversationViewNode = ConversationViewNode, Snapshot = unknown> {
  readonly empty: Snapshot

  replace(input: {
    readonly nodes: readonly Node[]
    readonly timeline: ConversationTimelineSnapshot
    readonly changedTurns?: readonly number[]
  }): Snapshot

  apply(input: {
    readonly upserts: readonly Node[]
    readonly timeline: ConversationTimelineSnapshot
    readonly changedTurns?: readonly number[]
  }): Snapshot

  groupInput?(): ConversationGroupInput<Node>

  publish?(): void
}

export interface ConversationTimelineSnapshot {
  readonly turnOrder: readonly number[]
  readonly turns: ReadonlyMap<number, TurnLocation>
}

export interface TurnLocation {
  readonly turn: number
  readonly start: SessionEvent<'turn/start'> | undefined
  readonly end: SessionEvent<'turn/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'
  readonly steps: readonly StepLocation[]

  readonly data: ConversationLocationDataStore<ConversationTurnDataMap>
}

export interface ConversationTurnDataMap {}

export interface ConversationLocationDataStore<DataMap extends object> {

  get<Key extends keyof DataMap & string>(key: Key): Readonly<DataMap[Key]> | undefined

  source<Key extends keyof DataMap & string>(
    key: Key,
  ): ConversationLocationDataSource<Readonly<DataMap[Key]> | undefined>
}

export interface StepLocation {
  readonly turn: number
  readonly step: number
  readonly start: SessionEvent<'step/start'> | undefined
  readonly end: SessionEvent<'step/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'

  readonly data: ConversationLocationDataStore<ConversationStepDataMap>
}

export interface ConversationStepDataMap {}

export interface ConversationLocationDataSource<Value> {

  readonly getSnapshot: () => Value

  readonly subscribe: (listener: () => void) => () => void
}
```

## ConversationViewNode client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationViewNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationViewNode {
    readonly key: string;
    readonly kind: string;
    readonly id: string;
    readonly target: string;
    readonly data: unknown;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `key` | `readonly key: string;` |
| `kind` | `readonly kind: string;` |
| `id` | `readonly id: string;` |
| `target` | `readonly target: string;` |
| `data` | `readonly data: unknown;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationViewSnapshotMap client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationViewSnapshotMap`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

同名接口还包含声明合并：以下后续声明分别来自 `@deepseek-ai/dsh-client-ui-conversation`、`@deepseek-ai/dsh-client-ui-chat`、`@deepseek-ai/dsh-client-ui-trajectory`。只有消费编译面实际导入相应包声明时，这些字段才加入类型；运行时还须由相应包声明 slot 或提供业务数据。不能由类型合并推定这些能力已在当前 Profile 挂载。

```text
export interface ConversationViewSnapshotMap {
}

interface ConversationViewSnapshotMap {
    chat: ChatSnapshot;
}

interface ConversationViewSnapshotMap {
    trajectory: TrajectorySnapshot;
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## ConversationViewSnapshotStore client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `ConversationViewSnapshotStore`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationViewSnapshotStore {
    get<Target extends Extract<keyof ConversationViewSnapshotMap, string>>(target: Target): ConversationViewSnapshotMap[Target] | undefined;
    grouped<Target extends string>(target: Target): ConversationGroupedView<ConversationGroupData<Target>> | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `get` | `get<Target extends Extract<keyof ConversationViewSnapshotMap, string>>(target: Target): ConversationViewSnapshotMap[Target] \| undefined;` |
| `grouped` | `grouped<Target extends string>(target: Target): ConversationGroupedView<ConversationGroupData<Target>> \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConversationViewSnapshotMap {}
```

## StepLocation client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `StepLocation`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface StepLocation {
    readonly turn: number;
    readonly step: number;
    readonly start: SessionEvent<'step/start'> | undefined;
    readonly end: SessionEvent<'step/end'> | undefined;
    readonly status: 'open' | 'closed' | 'unknown';
    readonly data: ConversationLocationDataStore<ConversationStepDataMap>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `turn` | `readonly turn: number;` |
| `step` | `readonly step: number;` |
| `start` | `readonly start: SessionEvent<'step/start'> \| undefined;` |
| `end` | `readonly end: SessionEvent<'step/end'> \| undefined;` |
| `status` | `readonly status: 'open' \| 'closed' \| 'unknown';` |
| `data` | `readonly data: ConversationLocationDataStore<ConversationStepDataMap>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConversationStepDataMap {}

export interface ConversationLocationDataStore<DataMap extends object> {

  get<Key extends keyof DataMap & string>(key: Key): Readonly<DataMap[Key]> | undefined

  source<Key extends keyof DataMap & string>(
    key: Key,
  ): ConversationLocationDataSource<Readonly<DataMap[Key]> | undefined>
}

export interface ConversationLocationDataSource<Value> {

  readonly getSnapshot: () => Value

  readonly subscribe: (listener: () => void) => () => void
}
```

## TurnLocation client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `TurnLocation`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TurnLocation {
    readonly turn: number;
    readonly start: SessionEvent<'turn/start'> | undefined;
    readonly end: SessionEvent<'turn/end'> | undefined;
    readonly status: 'open' | 'closed' | 'unknown';
    readonly steps: readonly StepLocation[];
    readonly data: ConversationLocationDataStore<ConversationTurnDataMap>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `turn` | `readonly turn: number;` |
| `start` | `readonly start: SessionEvent<'turn/start'> \| undefined;` |
| `end` | `readonly end: SessionEvent<'turn/end'> \| undefined;` |
| `status` | `readonly status: 'open' \| 'closed' \| 'unknown';` |
| `steps` | `readonly steps: readonly StepLocation[];` |
| `data` | `readonly data: ConversationLocationDataStore<ConversationTurnDataMap>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface ConversationTurnDataMap {}

export interface ConversationLocationDataStore<DataMap extends object> {

  get<Key extends keyof DataMap & string>(key: Key): Readonly<DataMap[Key]> | undefined

  source<Key extends keyof DataMap & string>(
    key: Key,
  ): ConversationLocationDataSource<Readonly<DataMap[Key]> | undefined>
}

export interface StepLocation {
  readonly turn: number
  readonly step: number
  readonly start: SessionEvent<'step/start'> | undefined
  readonly end: SessionEvent<'step/end'> | undefined
  readonly status: 'open' | 'closed' | 'unknown'

  readonly data: ConversationLocationDataStore<ConversationStepDataMap>
}

export interface ConversationStepDataMap {}

export interface ConversationLocationDataSource<Value> {

  readonly getSnapshot: () => Value

  readonly subscribe: (listener: () => void) => () => void
}
```
