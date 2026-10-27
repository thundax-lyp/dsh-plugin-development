# ui-slots：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

纯注册表没有 React 依赖。普通 Slots 通过 `SlotMap` 声明合并；`single` 按优先级取一个占位者，`list` 按 id 与 order 组合，`keyed` 按 key 分派，`chain` 依次调用纯 select 直到首个非 null。数字 priority 越小越先。同一单元的同一 priority 冲突、未声明的键、重复 children 声明、跨 scope 共享 Store handle 和缺少 select 的 chain 注册都会抛错。注册 disposer 递归收回 children 声明、贡献与 Store 挂载。Factory 在 `SlotFactoryMap` 声明，通过 registerFactory 安装，局部 slots 逐 occurrence 选择组件；children 仍为全局 Slots。

## ChainKeysOf root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `ChainKeysOf`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ChainKeysOf<S extends keyof SlotMap & string> = S extends unknown ? (SlotMap[S]['kind'] extends 'chain' ? S : never) : never;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotMap {}
```

## ChainRenderOpts root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `ChainRenderOpts`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ChainRenderOpts {
    fallback?: ReactNode;
    fallbackOnly?: boolean;
    overlay?: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `fallback` | `fallback?: ReactNode;` |
| `fallbackOnly` | `fallbackOnly?: boolean;` |
| `overlay` | `overlay?: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## ChainSelect root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `ChainSelect`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ChainSelect<O extends object, M> = (owner: O) => M | null;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## ChildrenDecl root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `ChildrenDecl`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ChildrenDecl = {
    [P in keyof SlotMap & string]?: SlotSpec<SlotMap[P]>;
};
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotMap {}

export type SlotSpec<E extends SlotEntryDef> = {
  kind: E['kind']
  scope: E['scope']

  inline?: true
} & ('inject' extends keyof E
  ? E extends { inject: infer Injected extends object }
    ? { inject: Injected }
    : { inject?: object }
  : { inject?: never })

export interface SlotEntryDef {
  kind: SlotKind
  scope: SlotScope

  inline?: true
  owner?: object

  keyProps?: Record<string, object>

  hookContext?: unknown

  inject?: object
}

export type SlotKind = 'single' | 'list' | 'keyed' | 'chain'

export type SlotScope = 'root' | 'session-maybe' | 'session'
```

## CommonKeyOf root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `CommonKeyOf`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type CommonKeyOf = LocaleNamespaceMap extends {
    common: infer C;
} ? C & string : never;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface LocaleNamespaceMap {}
```

## ComposedProps root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `ComposedProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ComposedProps<K extends keyof SlotMap & string, EntryKey extends EntryKeyOf<K>, S extends keyof SlotMap & string, H, I extends object, M = never, N = undefined> = PropsRuntime<K, EntryKey> & PropsRenderSlots<S> & PropsRenderFactories & PropsStore<H> & InjectFace<I> & MatchedShare<SlotMap[K], M> & PropsLocale<N>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotMap {}

export type PropsLocale<N> = N extends keyof LocaleNamespaceMap & string
  ? {

    t: TranslateNS<N>
  }
  : object

export type EntryKeyOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
    ? keyof P & string
    : string

export type PropsRuntime<
  K extends keyof SlotMap & string,
  EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
> =
  OwnerOf<K> &
  KeyPropsOf<K, EntryKey> &
  SlotInjectFace<SlotInjectOf<K>> &
  ScopeStandardProps<ScopeOf<K>>

export type MatchedShare<E extends SlotEntryDef, M> =
  E['kind'] extends 'chain' ? { matched: M } : object

export type PropsRenderSlots<S extends keyof SlotMap & string> = {

  renderSlot: RenderSlotFn<Exclude<S, ChainKeysOf<S>>>
  readonly __renders?: ((key: S) => void) | undefined
} & ([ChainKeysOf<S>] extends [never] ? object : {

  renderSlotChain: <K extends ChainKeysOf<S>>(key: K, owner: OwnerOf<K>, opts?: ChainRenderOpts) => ReactNode
}) & ([Extract<ScopeOf<S>, 'session' | 'session-maybe'>] extends [never]
  ? object
  : { SessionProvider: SessionProviderComponent })

export interface PropsRenderFactories {
  renderFactorySlot: RenderFactorySlot
}

export type SlotInjectFace<I extends object> =
  I extends { hooks: infer HS extends object } ? Omit<I, 'hooks'> & PropsSlotHooks<HS> : I

export type InjectFace<I extends object> =
  I extends { hooks: infer HS extends HooksSources }
    ? I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'hooks' | 'keyedHooks'> & PropsHooks<HS> & PropsKeyedHooks<KS>
      : Omit<I, 'hooks'> & PropsHooks<HS>
    : I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'keyedHooks'> & PropsKeyedHooks<KS>
      : I

export interface LocaleNamespaceMap {}

export type TranslateNS<N extends keyof LocaleNamespaceMap & string> = Translate<LocaleKeysOf<N>>

export interface SlotEntryDef {
  kind: SlotKind
  scope: SlotScope

  inline?: true
  owner?: object

  keyProps?: Record<string, object>

  hookContext?: unknown

  inject?: object
}

export type OwnerOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { owner: infer O extends object } ? O : object

export type KeyPropsOf<
  K extends keyof SlotMap & string,
  EntryKey extends EntryKeyOf<K>,
> = SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
  ? EntryKey extends keyof P
    ? P[EntryKey] extends object ? P[EntryKey] : never
    : never
  : object

export type SlotInjectOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { inject: infer Injected extends object } ? Injected : object

export type ScopeOf<K extends keyof SlotMap & string> = SlotMap[K]['scope']

export type ScopeStandardProps<S extends SlotScope> =
  (S extends 'session' ? SessionStandardProps
    : S extends 'session-maybe' ? SessionMaybeStandardProps
      : object) & GlobalStandardProps

export interface ChainRenderOpts {

  fallback?: ReactNode

  fallbackOnly?: boolean

  overlay?: boolean
}

export type ChainKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S]['kind'] extends 'chain' ? S : never) : never

type RenderSlotFn<S extends keyof SlotMap & string> =
  ([ContextualKeysOf<S>] extends [never] ? object : {
    <
      K extends ContextualKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts: RenderOpts<EntryKey> & { hookContext: HookContextOf<K> },
    ): ReactNode
  }) &
  ([OrdinaryKeysOf<S>] extends [never] ? object : {
    <
      K extends OrdinaryKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts?: Omit<RenderOpts<EntryKey>, 'hookContext'>,
    ): ReactNode
  })

export type SessionProviderComponent = (props: SessionAreaProps) => ReactNode

export type RenderFactorySlot = <F extends keyof SlotFactoryMap & string>(
  name: F,
  props: FactoryInputPropsOf<F>,
  options?: {
    slots?: Partial<{ [N in FactoryLocalNameOf<F>]: FactoryLocalComponent<F, N> }>
    fallback?: ReactNode
  },
) => ReactNode

export type HooksSources = Record<string, HostObservable<unknown>>

export type KeyedHooksSources = Record<string, KeyedStandardSource>

export type PropsSlotHooks<HS extends object> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]:
  BoundHookOf<HS[N]>
}

export type PropsHooks<HS extends HooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]:
  SnapshotSelectorHook<HS[N] extends HostObservable<infer T> ? T : never>
}

export type PropsKeyedHooks<HS extends KeyedHooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]: KeyedSnapshotSelectorHook<
    HS[N] extends (key: string) => HostObservable<infer T> | undefined ? T : never
  >
}

export interface SlotFactoryMap {}

export type Translate<K extends string = string> =
  (key: K, params?: Record<string, unknown>) => string

export type LocaleKeysOf<N extends keyof LocaleNamespaceMap & string> =
  (LocaleNamespaceMap[N] & string) | CommonKeyOf

export type SlotKind = 'single' | 'list' | 'keyed' | 'chain'

export type SlotScope = 'root' | 'session-maybe' | 'session'

export type HookContextOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { hookContext: infer Context } ? Context : never

export interface SessionStandardProps {}

export interface SessionMaybeStandardProps {}

export interface GlobalStandardProps {}

export interface RenderOpts<EntryKey extends string = string> {
  entryKey?: EntryKey
  only?: string
  fallback?: ReactNode

  hookContext?: unknown
}

type ContextualKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S] extends { hookContext: unknown } ? S : never) : never

type OrdinaryKeysOf<S extends keyof SlotMap & string> = Exclude<S, ContextualKeysOf<S>>

export interface SessionAreaProps {

  readonly session?: SlotScopeTargetMap[keyof SlotScopeTargetMap & 'session'] | undefined

  empty?: (() => ReactNode) | undefined

  children: ReactNode
}

type FactoryInputPropsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { props: infer P extends object } ? P : object

type FactoryLocalNameOf<F extends keyof SlotFactoryMap & string> = keyof FactoryLocalSlotsOf<F> & string

export type FactoryLocalComponent<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = SlotComponent<FactoryLocalComponentPropsOf<F, N>>

export type KeyedSnapshotSelectorHook<Snapshot> = {

  (key: string): Snapshot | undefined

  <Selected>(
    key: string,
    selector: (value: Snapshot | undefined) => Selected,
    equal?: (left: Selected, right: Selected) => boolean,
  ): Selected
}

type BoundHookOf<Definition> =
  Definition extends HostObservable<infer Snapshot>
    ? SnapshotSelectorHook<Snapshot>
    : Definition extends (...args: never[]) => infer Hook
      ? Hook extends (...args: never[]) => unknown ? Hook : never
      : never

export type CommonKeyOf = LocaleNamespaceMap extends { common: infer C } ? C & string : never

export interface SlotScopeTargetMap {}

export type SlotComponent<P> = (props: P) => ReactNode

type FactoryLocalSlotsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { slots: infer S extends Record<string, FactoryLocalSlotDef> }
    ? S
    : Record<never, never>

export type FactoryLocalComponentPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalInputPropsOf<F, N>
  & FactoryRegistrationPropsOf<F>
  & ScopeStandardProps<FactoryLocalDefOf<F, N>['scope']>

export interface FactoryLocalSlotDef {
  scope: SlotScope
  props?: object
}

type FactoryLocalDefOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalSlotsOf<F>[N] & FactoryLocalSlotDef

type FactoryLocalInputPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalDefOf<F, N> extends { props: infer P extends object } ? P : object

export type FactoryRegistrationPropsOf<F extends keyof SlotFactoryMap & string> =
  FactoryRenderPropsOf<F>
  & PropsStore<FactoryStoreOf<F>>
  & InjectFace<FactoryInjectOf<F>>
  & PropsLocale<FactoryLocaleOf<F>>
  & PropsRenderFactories

type FactoryStoreOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { store: infer H extends StoreDecl } ? HandleOf<H> : undefined

type FactoryInjectOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { inject: infer I extends object } ? I : object

type FactoryLocaleOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { locale: infer N extends keyof LocaleNamespaceMap & string } ? N : undefined

type FactoryRenderPropsOf<F extends keyof SlotFactoryMap & string> =
  [keyof FactoryChildrenOf<F> & keyof SlotMap & string] extends [never]
    ? object
    : PropsRenderSlots<keyof FactoryChildrenOf<F> & keyof SlotMap & string>
```

## EntryKeyOf root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `EntryKeyOf`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type EntryKeyOf<K extends keyof SlotMap & string> = SlotMap[K] extends {
    kind: 'keyed';
    keyProps: infer P extends object;
} ? keyof P & string : string;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotMap {}
```

## FactoryComponentPropsOf root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `FactoryComponentPropsOf`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type FactoryComponentPropsOf<F extends keyof SlotFactoryMap & string> = FactoryInputPropsOf<F> & FactoryRegistrationPropsOf<F> & ScopeStandardProps<FactoryDefOf<F>['scope']> & {
    useFactorySlot: UseFactorySlot<F>;
};
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotFactoryMap {}

export type ScopeStandardProps<S extends SlotScope> =
  (S extends 'session' ? SessionStandardProps
    : S extends 'session-maybe' ? SessionMaybeStandardProps
      : object) & GlobalStandardProps

type FactoryDefOf<F extends keyof SlotFactoryMap & string> = SlotFactoryMap[F] & SlotFactoryDef

type FactoryInputPropsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { props: infer P extends object } ? P : object

export type FactoryRegistrationPropsOf<F extends keyof SlotFactoryMap & string> =
  FactoryRenderPropsOf<F>
  & PropsStore<FactoryStoreOf<F>>
  & InjectFace<FactoryInjectOf<F>>
  & PropsLocale<FactoryLocaleOf<F>>
  & PropsRenderFactories

export type UseFactorySlot<F extends keyof SlotFactoryMap & string> =
  <N extends FactoryLocalNameOf<F>>(
    name: N,
    fallback: FactoryLocalComponent<F, N>,
  ) => SlotComponent<FactoryLocalInputPropsOf<F, N>>

export interface PropsRenderFactories {
  renderFactorySlot: RenderFactorySlot
}

export type InjectFace<I extends object> =
  I extends { hooks: infer HS extends HooksSources }
    ? I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'hooks' | 'keyedHooks'> & PropsHooks<HS> & PropsKeyedHooks<KS>
      : Omit<I, 'hooks'> & PropsHooks<HS>
    : I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'keyedHooks'> & PropsKeyedHooks<KS>
      : I

export type PropsLocale<N> = N extends keyof LocaleNamespaceMap & string
  ? {

    t: TranslateNS<N>
  }
  : object

export type SlotScope = 'root' | 'session-maybe' | 'session'

export interface SlotFactoryDef {
  scope: SlotScope
  props?: object
  children?: ChildrenDecl
  store?: StoreDecl
  inject?: object
  locale?: keyof LocaleNamespaceMap & string
  slots?: Record<string, FactoryLocalSlotDef>
}

export type ChildrenDecl = { [P in keyof SlotMap & string]?: SlotSpec<SlotMap[P]> }

export interface SessionStandardProps {}

export interface SessionMaybeStandardProps {}

export interface GlobalStandardProps {}

export type SlotComponent<P> = (props: P) => ReactNode

type FactoryStoreOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { store: infer H extends StoreDecl } ? HandleOf<H> : undefined

type FactoryInjectOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { inject: infer I extends object } ? I : object

type FactoryLocaleOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { locale: infer N extends keyof LocaleNamespaceMap & string } ? N : undefined

type FactoryLocalNameOf<F extends keyof SlotFactoryMap & string> = keyof FactoryLocalSlotsOf<F> & string

type FactoryLocalInputPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalDefOf<F, N> extends { props: infer P extends object } ? P : object

type FactoryRenderPropsOf<F extends keyof SlotFactoryMap & string> =
  [keyof FactoryChildrenOf<F> & keyof SlotMap & string] extends [never]
    ? object
    : PropsRenderSlots<keyof FactoryChildrenOf<F> & keyof SlotMap & string>

export type FactoryLocalComponent<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = SlotComponent<FactoryLocalComponentPropsOf<F, N>>

export type RenderFactorySlot = <F extends keyof SlotFactoryMap & string>(
  name: F,
  props: FactoryInputPropsOf<F>,
  options?: {
    slots?: Partial<{ [N in FactoryLocalNameOf<F>]: FactoryLocalComponent<F, N> }>
    fallback?: ReactNode
  },
) => ReactNode

export type HooksSources = Record<string, HostObservable<unknown>>

export type KeyedHooksSources = Record<string, KeyedStandardSource>

export type PropsHooks<HS extends HooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]:
  SnapshotSelectorHook<HS[N] extends HostObservable<infer T> ? T : never>
}

export type PropsKeyedHooks<HS extends KeyedHooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]: KeyedSnapshotSelectorHook<
    HS[N] extends (key: string) => HostObservable<infer T> | undefined ? T : never
  >
}

export interface SlotMap {}

export interface LocaleNamespaceMap {}

export type TranslateNS<N extends keyof LocaleNamespaceMap & string> = Translate<LocaleKeysOf<N>>

export interface FactoryLocalSlotDef {
  scope: SlotScope
  props?: object
}

export type SlotSpec<E extends SlotEntryDef> = {
  kind: E['kind']
  scope: E['scope']

  inline?: true
} & ('inject' extends keyof E
  ? E extends { inject: infer Injected extends object }
    ? { inject: Injected }
    : { inject?: object }
  : { inject?: never })

export type PropsRenderSlots<S extends keyof SlotMap & string> = {

  renderSlot: RenderSlotFn<Exclude<S, ChainKeysOf<S>>>
  readonly __renders?: ((key: S) => void) | undefined
} & ([ChainKeysOf<S>] extends [never] ? object : {

  renderSlotChain: <K extends ChainKeysOf<S>>(key: K, owner: OwnerOf<K>, opts?: ChainRenderOpts) => ReactNode
}) & ([Extract<ScopeOf<S>, 'session' | 'session-maybe'>] extends [never]
  ? object
  : { SessionProvider: SessionProviderComponent })

type FactoryChildrenOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { children: infer D extends Record<string, unknown> } ? D : Record<never, never>

type FactoryLocalSlotsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { slots: infer S extends Record<string, FactoryLocalSlotDef> }
    ? S
    : Record<never, never>

type FactoryLocalDefOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalSlotsOf<F>[N] & FactoryLocalSlotDef

export type FactoryLocalComponentPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalInputPropsOf<F, N>
  & FactoryRegistrationPropsOf<F>
  & ScopeStandardProps<FactoryLocalDefOf<F, N>['scope']>

export type KeyedSnapshotSelectorHook<Snapshot> = {

  (key: string): Snapshot | undefined

  <Selected>(
    key: string,
    selector: (value: Snapshot | undefined) => Selected,
    equal?: (left: Selected, right: Selected) => boolean,
  ): Selected
}

export type Translate<K extends string = string> =
  (key: K, params?: Record<string, unknown>) => string

export type LocaleKeysOf<N extends keyof LocaleNamespaceMap & string> =
  (LocaleNamespaceMap[N] & string) | CommonKeyOf

export interface SlotEntryDef {
  kind: SlotKind
  scope: SlotScope

  inline?: true
  owner?: object

  keyProps?: Record<string, object>

  hookContext?: unknown

  inject?: object
}

export type OwnerOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { owner: infer O extends object } ? O : object

export type ScopeOf<K extends keyof SlotMap & string> = SlotMap[K]['scope']

export interface ChainRenderOpts {

  fallback?: ReactNode

  fallbackOnly?: boolean

  overlay?: boolean
}

export type ChainKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S]['kind'] extends 'chain' ? S : never) : never

type RenderSlotFn<S extends keyof SlotMap & string> =
  ([ContextualKeysOf<S>] extends [never] ? object : {
    <
      K extends ContextualKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts: RenderOpts<EntryKey> & { hookContext: HookContextOf<K> },
    ): ReactNode
  }) &
  ([OrdinaryKeysOf<S>] extends [never] ? object : {
    <
      K extends OrdinaryKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts?: Omit<RenderOpts<EntryKey>, 'hookContext'>,
    ): ReactNode
  })

export type SessionProviderComponent = (props: SessionAreaProps) => ReactNode

export type CommonKeyOf = LocaleNamespaceMap extends { common: infer C } ? C & string : never

export type SlotKind = 'single' | 'list' | 'keyed' | 'chain'

export type EntryKeyOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
    ? keyof P & string
    : string

export type KeyPropsOf<
  K extends keyof SlotMap & string,
  EntryKey extends EntryKeyOf<K>,
> = SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
  ? EntryKey extends keyof P
    ? P[EntryKey] extends object ? P[EntryKey] : never
    : never
  : object

export type HookContextOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { hookContext: infer Context } ? Context : never

export interface RenderOpts<EntryKey extends string = string> {
  entryKey?: EntryKey
  only?: string
  fallback?: ReactNode

  hookContext?: unknown
}

type ContextualKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S] extends { hookContext: unknown } ? S : never) : never

type OrdinaryKeysOf<S extends keyof SlotMap & string> = Exclude<S, ContextualKeysOf<S>>

export interface SessionAreaProps {

  readonly session?: SlotScopeTargetMap[keyof SlotScopeTargetMap & 'session'] | undefined

  empty?: (() => ReactNode) | undefined

  children: ReactNode
}

export interface SlotScopeTargetMap {}
```

## FactoryInjectParams root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `FactoryInjectParams`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type FactoryInjectParams<F extends keyof SlotFactoryMap & string> = FactoryDefOf<F>['scope'] extends 'session' ? ([
    FactoryStoreOf<F>
] extends [
    StoreDecl
] ? [
    sessionId: SessionIdOf,
    actions: BoundActions<FactoryStoreOf<F>>
] : [
    sessionId: SessionIdOf
]) : FactoryDefOf<F>['scope'] extends 'session-maybe' ? ([
    FactoryStoreOf<F>
] extends [
    StoreDecl
] ? [
    sessionId: SessionIdOf | undefined,
    actions: BoundActions<FactoryStoreOf<F>> | undefined
] : [
    sessionId: SessionIdOf | undefined
]) : ([
    FactoryStoreOf<F>
] extends [
    StoreDecl
] ? [
    actions: BoundActions<FactoryStoreOf<F>>
] : [
]);
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotFactoryMap {}

export type SessionIdOf = SessionStandardProps extends { sessionId: infer S } ? S : string

type FactoryDefOf<F extends keyof SlotFactoryMap & string> = SlotFactoryMap[F] & SlotFactoryDef

type FactoryStoreOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { store: infer H extends StoreDecl } ? HandleOf<H> : undefined

export interface SlotFactoryDef {
  scope: SlotScope
  props?: object
  children?: ChildrenDecl
  store?: StoreDecl
  inject?: object
  locale?: keyof LocaleNamespaceMap & string
  slots?: Record<string, FactoryLocalSlotDef>
}

export type ChildrenDecl = { [P in keyof SlotMap & string]?: SlotSpec<SlotMap[P]> }

export interface SessionStandardProps {}

export interface SlotMap {}

export interface LocaleNamespaceMap {}

export type SlotScope = 'root' | 'session-maybe' | 'session'

export interface FactoryLocalSlotDef {
  scope: SlotScope
  props?: object
}

export type SlotSpec<E extends SlotEntryDef> = {
  kind: E['kind']
  scope: E['scope']

  inline?: true
} & ('inject' extends keyof E
  ? E extends { inject: infer Injected extends object }
    ? { inject: Injected }
    : { inject?: object }
  : { inject?: never })

export interface SlotEntryDef {
  kind: SlotKind
  scope: SlotScope

  inline?: true
  owner?: object

  keyProps?: Record<string, object>

  hookContext?: unknown

  inject?: object
}

export type SlotKind = 'single' | 'list' | 'keyed' | 'chain'
```

## FactoryLocalComponent root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `FactoryLocalComponent`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type FactoryLocalComponent<F extends keyof SlotFactoryMap & string, N extends FactoryLocalNameOf<F>> = SlotComponent<FactoryLocalComponentPropsOf<F, N>>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotFactoryMap {}

export type SlotComponent<P> = (props: P) => ReactNode

type FactoryLocalNameOf<F extends keyof SlotFactoryMap & string> = keyof FactoryLocalSlotsOf<F> & string

export type FactoryLocalComponentPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalInputPropsOf<F, N>
  & FactoryRegistrationPropsOf<F>
  & ScopeStandardProps<FactoryLocalDefOf<F, N>['scope']>

export type ScopeStandardProps<S extends SlotScope> =
  (S extends 'session' ? SessionStandardProps
    : S extends 'session-maybe' ? SessionMaybeStandardProps
      : object) & GlobalStandardProps

type FactoryLocalSlotsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { slots: infer S extends Record<string, FactoryLocalSlotDef> }
    ? S
    : Record<never, never>

type FactoryLocalDefOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalSlotsOf<F>[N] & FactoryLocalSlotDef

type FactoryLocalInputPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalDefOf<F, N> extends { props: infer P extends object } ? P : object

export type FactoryRegistrationPropsOf<F extends keyof SlotFactoryMap & string> =
  FactoryRenderPropsOf<F>
  & PropsStore<FactoryStoreOf<F>>
  & InjectFace<FactoryInjectOf<F>>
  & PropsLocale<FactoryLocaleOf<F>>
  & PropsRenderFactories

export interface PropsRenderFactories {
  renderFactorySlot: RenderFactorySlot
}

export type InjectFace<I extends object> =
  I extends { hooks: infer HS extends HooksSources }
    ? I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'hooks' | 'keyedHooks'> & PropsHooks<HS> & PropsKeyedHooks<KS>
      : Omit<I, 'hooks'> & PropsHooks<HS>
    : I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'keyedHooks'> & PropsKeyedHooks<KS>
      : I

export type PropsLocale<N> = N extends keyof LocaleNamespaceMap & string
  ? {

    t: TranslateNS<N>
  }
  : object

export type SlotScope = 'root' | 'session-maybe' | 'session'

export interface FactoryLocalSlotDef {
  scope: SlotScope
  props?: object
}

export interface SessionStandardProps {}

export interface SessionMaybeStandardProps {}

export interface GlobalStandardProps {}

type FactoryStoreOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { store: infer H extends StoreDecl } ? HandleOf<H> : undefined

type FactoryInjectOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { inject: infer I extends object } ? I : object

type FactoryLocaleOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { locale: infer N extends keyof LocaleNamespaceMap & string } ? N : undefined

type FactoryRenderPropsOf<F extends keyof SlotFactoryMap & string> =
  [keyof FactoryChildrenOf<F> & keyof SlotMap & string] extends [never]
    ? object
    : PropsRenderSlots<keyof FactoryChildrenOf<F> & keyof SlotMap & string>

export type RenderFactorySlot = <F extends keyof SlotFactoryMap & string>(
  name: F,
  props: FactoryInputPropsOf<F>,
  options?: {
    slots?: Partial<{ [N in FactoryLocalNameOf<F>]: FactoryLocalComponent<F, N> }>
    fallback?: ReactNode
  },
) => ReactNode

export type HooksSources = Record<string, HostObservable<unknown>>

export type KeyedHooksSources = Record<string, KeyedStandardSource>

export type PropsHooks<HS extends HooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]:
  SnapshotSelectorHook<HS[N] extends HostObservable<infer T> ? T : never>
}

export type PropsKeyedHooks<HS extends KeyedHooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]: KeyedSnapshotSelectorHook<
    HS[N] extends (key: string) => HostObservable<infer T> | undefined ? T : never
  >
}

export interface SlotMap {}

export interface LocaleNamespaceMap {}

export type TranslateNS<N extends keyof LocaleNamespaceMap & string> = Translate<LocaleKeysOf<N>>

export type PropsRenderSlots<S extends keyof SlotMap & string> = {

  renderSlot: RenderSlotFn<Exclude<S, ChainKeysOf<S>>>
  readonly __renders?: ((key: S) => void) | undefined
} & ([ChainKeysOf<S>] extends [never] ? object : {

  renderSlotChain: <K extends ChainKeysOf<S>>(key: K, owner: OwnerOf<K>, opts?: ChainRenderOpts) => ReactNode
}) & ([Extract<ScopeOf<S>, 'session' | 'session-maybe'>] extends [never]
  ? object
  : { SessionProvider: SessionProviderComponent })

type FactoryInputPropsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { props: infer P extends object } ? P : object

type FactoryChildrenOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { children: infer D extends Record<string, unknown> } ? D : Record<never, never>

export type KeyedSnapshotSelectorHook<Snapshot> = {

  (key: string): Snapshot | undefined

  <Selected>(
    key: string,
    selector: (value: Snapshot | undefined) => Selected,
    equal?: (left: Selected, right: Selected) => boolean,
  ): Selected
}

export type Translate<K extends string = string> =
  (key: K, params?: Record<string, unknown>) => string

export type LocaleKeysOf<N extends keyof LocaleNamespaceMap & string> =
  (LocaleNamespaceMap[N] & string) | CommonKeyOf

export type OwnerOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { owner: infer O extends object } ? O : object

export type ScopeOf<K extends keyof SlotMap & string> = SlotMap[K]['scope']

export interface ChainRenderOpts {

  fallback?: ReactNode

  fallbackOnly?: boolean

  overlay?: boolean
}

export type ChainKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S]['kind'] extends 'chain' ? S : never) : never

type RenderSlotFn<S extends keyof SlotMap & string> =
  ([ContextualKeysOf<S>] extends [never] ? object : {
    <
      K extends ContextualKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts: RenderOpts<EntryKey> & { hookContext: HookContextOf<K> },
    ): ReactNode
  }) &
  ([OrdinaryKeysOf<S>] extends [never] ? object : {
    <
      K extends OrdinaryKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts?: Omit<RenderOpts<EntryKey>, 'hookContext'>,
    ): ReactNode
  })

export type SessionProviderComponent = (props: SessionAreaProps) => ReactNode

export type CommonKeyOf = LocaleNamespaceMap extends { common: infer C } ? C & string : never

export type EntryKeyOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
    ? keyof P & string
    : string

export type KeyPropsOf<
  K extends keyof SlotMap & string,
  EntryKey extends EntryKeyOf<K>,
> = SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
  ? EntryKey extends keyof P
    ? P[EntryKey] extends object ? P[EntryKey] : never
    : never
  : object

export type HookContextOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { hookContext: infer Context } ? Context : never

export interface RenderOpts<EntryKey extends string = string> {
  entryKey?: EntryKey
  only?: string
  fallback?: ReactNode

  hookContext?: unknown
}

type ContextualKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S] extends { hookContext: unknown } ? S : never) : never

type OrdinaryKeysOf<S extends keyof SlotMap & string> = Exclude<S, ContextualKeysOf<S>>

export interface SessionAreaProps {

  readonly session?: SlotScopeTargetMap[keyof SlotScopeTargetMap & 'session'] | undefined

  empty?: (() => ReactNode) | undefined

  children: ReactNode
}
```

## FactoryLocalComponentPropsOf root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `FactoryLocalComponentPropsOf`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type FactoryLocalComponentPropsOf<F extends keyof SlotFactoryMap & string, N extends FactoryLocalNameOf<F>> = FactoryLocalInputPropsOf<F, N> & FactoryRegistrationPropsOf<F> & ScopeStandardProps<FactoryLocalDefOf<F, N>['scope']>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotFactoryMap {}

export type ScopeStandardProps<S extends SlotScope> =
  (S extends 'session' ? SessionStandardProps
    : S extends 'session-maybe' ? SessionMaybeStandardProps
      : object) & GlobalStandardProps

type FactoryLocalNameOf<F extends keyof SlotFactoryMap & string> = keyof FactoryLocalSlotsOf<F> & string

type FactoryLocalDefOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalSlotsOf<F>[N] & FactoryLocalSlotDef

type FactoryLocalInputPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalDefOf<F, N> extends { props: infer P extends object } ? P : object

export type FactoryRegistrationPropsOf<F extends keyof SlotFactoryMap & string> =
  FactoryRenderPropsOf<F>
  & PropsStore<FactoryStoreOf<F>>
  & InjectFace<FactoryInjectOf<F>>
  & PropsLocale<FactoryLocaleOf<F>>
  & PropsRenderFactories

export interface PropsRenderFactories {
  renderFactorySlot: RenderFactorySlot
}

export type InjectFace<I extends object> =
  I extends { hooks: infer HS extends HooksSources }
    ? I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'hooks' | 'keyedHooks'> & PropsHooks<HS> & PropsKeyedHooks<KS>
      : Omit<I, 'hooks'> & PropsHooks<HS>
    : I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'keyedHooks'> & PropsKeyedHooks<KS>
      : I

export type PropsLocale<N> = N extends keyof LocaleNamespaceMap & string
  ? {

    t: TranslateNS<N>
  }
  : object

export type SlotScope = 'root' | 'session-maybe' | 'session'

export interface FactoryLocalSlotDef {
  scope: SlotScope
  props?: object
}

export interface SessionStandardProps {}

export interface SessionMaybeStandardProps {}

export interface GlobalStandardProps {}

type FactoryStoreOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { store: infer H extends StoreDecl } ? HandleOf<H> : undefined

type FactoryInjectOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { inject: infer I extends object } ? I : object

type FactoryLocaleOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { locale: infer N extends keyof LocaleNamespaceMap & string } ? N : undefined

type FactoryLocalSlotsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { slots: infer S extends Record<string, FactoryLocalSlotDef> }
    ? S
    : Record<never, never>

type FactoryRenderPropsOf<F extends keyof SlotFactoryMap & string> =
  [keyof FactoryChildrenOf<F> & keyof SlotMap & string] extends [never]
    ? object
    : PropsRenderSlots<keyof FactoryChildrenOf<F> & keyof SlotMap & string>

export type RenderFactorySlot = <F extends keyof SlotFactoryMap & string>(
  name: F,
  props: FactoryInputPropsOf<F>,
  options?: {
    slots?: Partial<{ [N in FactoryLocalNameOf<F>]: FactoryLocalComponent<F, N> }>
    fallback?: ReactNode
  },
) => ReactNode

export type HooksSources = Record<string, HostObservable<unknown>>

export type KeyedHooksSources = Record<string, KeyedStandardSource>

export type PropsHooks<HS extends HooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]:
  SnapshotSelectorHook<HS[N] extends HostObservable<infer T> ? T : never>
}

export type PropsKeyedHooks<HS extends KeyedHooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]: KeyedSnapshotSelectorHook<
    HS[N] extends (key: string) => HostObservable<infer T> | undefined ? T : never
  >
}

export interface SlotMap {}

export interface LocaleNamespaceMap {}

export type TranslateNS<N extends keyof LocaleNamespaceMap & string> = Translate<LocaleKeysOf<N>>

export type PropsRenderSlots<S extends keyof SlotMap & string> = {

  renderSlot: RenderSlotFn<Exclude<S, ChainKeysOf<S>>>
  readonly __renders?: ((key: S) => void) | undefined
} & ([ChainKeysOf<S>] extends [never] ? object : {

  renderSlotChain: <K extends ChainKeysOf<S>>(key: K, owner: OwnerOf<K>, opts?: ChainRenderOpts) => ReactNode
}) & ([Extract<ScopeOf<S>, 'session' | 'session-maybe'>] extends [never]
  ? object
  : { SessionProvider: SessionProviderComponent })

type FactoryInputPropsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { props: infer P extends object } ? P : object

type FactoryChildrenOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { children: infer D extends Record<string, unknown> } ? D : Record<never, never>

export type FactoryLocalComponent<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = SlotComponent<FactoryLocalComponentPropsOf<F, N>>

export type KeyedSnapshotSelectorHook<Snapshot> = {

  (key: string): Snapshot | undefined

  <Selected>(
    key: string,
    selector: (value: Snapshot | undefined) => Selected,
    equal?: (left: Selected, right: Selected) => boolean,
  ): Selected
}

export type Translate<K extends string = string> =
  (key: K, params?: Record<string, unknown>) => string

export type LocaleKeysOf<N extends keyof LocaleNamespaceMap & string> =
  (LocaleNamespaceMap[N] & string) | CommonKeyOf

export type OwnerOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { owner: infer O extends object } ? O : object

export type ScopeOf<K extends keyof SlotMap & string> = SlotMap[K]['scope']

export interface ChainRenderOpts {

  fallback?: ReactNode

  fallbackOnly?: boolean

  overlay?: boolean
}

export type ChainKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S]['kind'] extends 'chain' ? S : never) : never

type RenderSlotFn<S extends keyof SlotMap & string> =
  ([ContextualKeysOf<S>] extends [never] ? object : {
    <
      K extends ContextualKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts: RenderOpts<EntryKey> & { hookContext: HookContextOf<K> },
    ): ReactNode
  }) &
  ([OrdinaryKeysOf<S>] extends [never] ? object : {
    <
      K extends OrdinaryKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts?: Omit<RenderOpts<EntryKey>, 'hookContext'>,
    ): ReactNode
  })

export type SessionProviderComponent = (props: SessionAreaProps) => ReactNode

export type SlotComponent<P> = (props: P) => ReactNode

export type CommonKeyOf = LocaleNamespaceMap extends { common: infer C } ? C & string : never

export type EntryKeyOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
    ? keyof P & string
    : string

export type KeyPropsOf<
  K extends keyof SlotMap & string,
  EntryKey extends EntryKeyOf<K>,
> = SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
  ? EntryKey extends keyof P
    ? P[EntryKey] extends object ? P[EntryKey] : never
    : never
  : object

export type HookContextOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { hookContext: infer Context } ? Context : never

export interface RenderOpts<EntryKey extends string = string> {
  entryKey?: EntryKey
  only?: string
  fallback?: ReactNode

  hookContext?: unknown
}

type ContextualKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S] extends { hookContext: unknown } ? S : never) : never

type OrdinaryKeysOf<S extends keyof SlotMap & string> = Exclude<S, ContextualKeysOf<S>>

export interface SessionAreaProps {

  readonly session?: SlotScopeTargetMap[keyof SlotScopeTargetMap & 'session'] | undefined

  empty?: (() => ReactNode) | undefined

  children: ReactNode
}

export interface SlotScopeTargetMap {}
```

## FactoryLocalSlotDef root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `FactoryLocalSlotDef`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface FactoryLocalSlotDef {
    scope: SlotScope;
    props?: object;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `scope` | `scope: SlotScope;` |
| `props` | `props?: object;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SlotScope = 'root' | 'session-maybe' | 'session'
```

## FactoryRegistrationPropsOf root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `FactoryRegistrationPropsOf`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type FactoryRegistrationPropsOf<F extends keyof SlotFactoryMap & string> = FactoryRenderPropsOf<F> & PropsStore<FactoryStoreOf<F>> & InjectFace<FactoryInjectOf<F>> & PropsLocale<FactoryLocaleOf<F>> & PropsRenderFactories;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotFactoryMap {}

export type PropsLocale<N> = N extends keyof LocaleNamespaceMap & string
  ? {

    t: TranslateNS<N>
  }
  : object

type FactoryStoreOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { store: infer H extends StoreDecl } ? HandleOf<H> : undefined

type FactoryInjectOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { inject: infer I extends object } ? I : object

type FactoryLocaleOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { locale: infer N extends keyof LocaleNamespaceMap & string } ? N : undefined

type FactoryRenderPropsOf<F extends keyof SlotFactoryMap & string> =
  [keyof FactoryChildrenOf<F> & keyof SlotMap & string] extends [never]
    ? object
    : PropsRenderSlots<keyof FactoryChildrenOf<F> & keyof SlotMap & string>

export interface PropsRenderFactories {
  renderFactorySlot: RenderFactorySlot
}

export type InjectFace<I extends object> =
  I extends { hooks: infer HS extends HooksSources }
    ? I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'hooks' | 'keyedHooks'> & PropsHooks<HS> & PropsKeyedHooks<KS>
      : Omit<I, 'hooks'> & PropsHooks<HS>
    : I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'keyedHooks'> & PropsKeyedHooks<KS>
      : I

export interface SlotMap {}

export interface LocaleNamespaceMap {}

export type TranslateNS<N extends keyof LocaleNamespaceMap & string> = Translate<LocaleKeysOf<N>>

export type PropsRenderSlots<S extends keyof SlotMap & string> = {

  renderSlot: RenderSlotFn<Exclude<S, ChainKeysOf<S>>>
  readonly __renders?: ((key: S) => void) | undefined
} & ([ChainKeysOf<S>] extends [never] ? object : {

  renderSlotChain: <K extends ChainKeysOf<S>>(key: K, owner: OwnerOf<K>, opts?: ChainRenderOpts) => ReactNode
}) & ([Extract<ScopeOf<S>, 'session' | 'session-maybe'>] extends [never]
  ? object
  : { SessionProvider: SessionProviderComponent })

type FactoryChildrenOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { children: infer D extends Record<string, unknown> } ? D : Record<never, never>

export type RenderFactorySlot = <F extends keyof SlotFactoryMap & string>(
  name: F,
  props: FactoryInputPropsOf<F>,
  options?: {
    slots?: Partial<{ [N in FactoryLocalNameOf<F>]: FactoryLocalComponent<F, N> }>
    fallback?: ReactNode
  },
) => ReactNode

export type HooksSources = Record<string, HostObservable<unknown>>

export type KeyedHooksSources = Record<string, KeyedStandardSource>

export type PropsHooks<HS extends HooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]:
  SnapshotSelectorHook<HS[N] extends HostObservable<infer T> ? T : never>
}

export type PropsKeyedHooks<HS extends KeyedHooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]: KeyedSnapshotSelectorHook<
    HS[N] extends (key: string) => HostObservable<infer T> | undefined ? T : never
  >
}

export type Translate<K extends string = string> =
  (key: K, params?: Record<string, unknown>) => string

export type LocaleKeysOf<N extends keyof LocaleNamespaceMap & string> =
  (LocaleNamespaceMap[N] & string) | CommonKeyOf

export type OwnerOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { owner: infer O extends object } ? O : object

export type ScopeOf<K extends keyof SlotMap & string> = SlotMap[K]['scope']

export interface ChainRenderOpts {

  fallback?: ReactNode

  fallbackOnly?: boolean

  overlay?: boolean
}

export type ChainKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S]['kind'] extends 'chain' ? S : never) : never

type RenderSlotFn<S extends keyof SlotMap & string> =
  ([ContextualKeysOf<S>] extends [never] ? object : {
    <
      K extends ContextualKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts: RenderOpts<EntryKey> & { hookContext: HookContextOf<K> },
    ): ReactNode
  }) &
  ([OrdinaryKeysOf<S>] extends [never] ? object : {
    <
      K extends OrdinaryKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts?: Omit<RenderOpts<EntryKey>, 'hookContext'>,
    ): ReactNode
  })

export type SessionProviderComponent = (props: SessionAreaProps) => ReactNode

type FactoryInputPropsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { props: infer P extends object } ? P : object

type FactoryLocalNameOf<F extends keyof SlotFactoryMap & string> = keyof FactoryLocalSlotsOf<F> & string

export type FactoryLocalComponent<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = SlotComponent<FactoryLocalComponentPropsOf<F, N>>

export type KeyedSnapshotSelectorHook<Snapshot> = {

  (key: string): Snapshot | undefined

  <Selected>(
    key: string,
    selector: (value: Snapshot | undefined) => Selected,
    equal?: (left: Selected, right: Selected) => boolean,
  ): Selected
}

export type CommonKeyOf = LocaleNamespaceMap extends { common: infer C } ? C & string : never

export type EntryKeyOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
    ? keyof P & string
    : string

export type KeyPropsOf<
  K extends keyof SlotMap & string,
  EntryKey extends EntryKeyOf<K>,
> = SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
  ? EntryKey extends keyof P
    ? P[EntryKey] extends object ? P[EntryKey] : never
    : never
  : object

export type HookContextOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { hookContext: infer Context } ? Context : never

export interface RenderOpts<EntryKey extends string = string> {
  entryKey?: EntryKey
  only?: string
  fallback?: ReactNode

  hookContext?: unknown
}

type ContextualKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S] extends { hookContext: unknown } ? S : never) : never

type OrdinaryKeysOf<S extends keyof SlotMap & string> = Exclude<S, ContextualKeysOf<S>>

export interface SessionAreaProps {

  readonly session?: SlotScopeTargetMap[keyof SlotScopeTargetMap & 'session'] | undefined

  empty?: (() => ReactNode) | undefined

  children: ReactNode
}

export type SlotComponent<P> = (props: P) => ReactNode

type FactoryLocalSlotsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { slots: infer S extends Record<string, FactoryLocalSlotDef> }
    ? S
    : Record<never, never>

export type FactoryLocalComponentPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalInputPropsOf<F, N>
  & FactoryRegistrationPropsOf<F>
  & ScopeStandardProps<FactoryLocalDefOf<F, N>['scope']>

export interface SlotScopeTargetMap {}

export interface FactoryLocalSlotDef {
  scope: SlotScope
  props?: object
}

export type ScopeStandardProps<S extends SlotScope> =
  (S extends 'session' ? SessionStandardProps
    : S extends 'session-maybe' ? SessionMaybeStandardProps
      : object) & GlobalStandardProps

type FactoryLocalDefOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalSlotsOf<F>[N] & FactoryLocalSlotDef

type FactoryLocalInputPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalDefOf<F, N> extends { props: infer P extends object } ? P : object

export type SlotScope = 'root' | 'session-maybe' | 'session'

export interface SessionStandardProps {}

export interface SessionMaybeStandardProps {}

export interface GlobalStandardProps {}
```

## GlobalStandardProps root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `GlobalStandardProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface GlobalStandardProps {
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## HookContextOf root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `HookContextOf`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type HookContextOf<K extends keyof SlotMap & string> = SlotMap[K] extends {
    hookContext: infer Context;
} ? Context : never;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotMap {}
```

## HooksSources root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `HooksSources`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type HooksSources = Record<string, HostObservable<unknown>>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## InjectFace root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `InjectFace`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type InjectFace<I extends object> = I extends {
    hooks: infer HS extends HooksSources;
} ? I extends {
    keyedHooks: infer KS extends KeyedHooksSources;
} ? Omit<I, 'hooks' | 'keyedHooks'> & PropsHooks<HS> & PropsKeyedHooks<KS> : Omit<I, 'hooks'> & PropsHooks<HS> : I extends {
    keyedHooks: infer KS extends KeyedHooksSources;
} ? Omit<I, 'keyedHooks'> & PropsKeyedHooks<KS> : I;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type HooksSources = Record<string, HostObservable<unknown>>

export type KeyedHooksSources = Record<string, KeyedStandardSource>

export type PropsHooks<HS extends HooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]:
  SnapshotSelectorHook<HS[N] extends HostObservable<infer T> ? T : never>
}

export type PropsKeyedHooks<HS extends KeyedHooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]: KeyedSnapshotSelectorHook<
    HS[N] extends (key: string) => HostObservable<infer T> | undefined ? T : never
  >
}

export type KeyedSnapshotSelectorHook<Snapshot> = {

  (key: string): Snapshot | undefined

  <Selected>(
    key: string,
    selector: (value: Snapshot | undefined) => Selected,
    equal?: (left: Selected, right: Selected) => boolean,
  ): Selected
}
```

## InjectParams root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `InjectParams`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type InjectParams<K extends keyof SlotMap & string, H> = ScopeOf<K> extends 'session' ? ([
    H
] extends [
    StoreDecl
] ? [
    sessionId: SessionIdOf,
    actions: BoundActions<HandleOf<H>>
] : [
    sessionId: SessionIdOf
]) : ScopeOf<K> extends 'session-maybe' ? ([
    H
] extends [
    StoreDecl
] ? [
    sessionId: SessionIdOf | undefined,
    actions: BoundActions<HandleOf<H>> | undefined
] : [
    sessionId: SessionIdOf | undefined
]) : ([
    H
] extends [
    StoreDecl
] ? [
    actions: BoundActions<HandleOf<H>>
] : [
]);
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotMap {}

export type ScopeOf<K extends keyof SlotMap & string> = SlotMap[K]['scope']

export type SessionIdOf = SessionStandardProps extends { sessionId: infer S } ? S : string

export interface SessionStandardProps {}
```

## KeyPropsOf root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `KeyPropsOf`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type KeyPropsOf<K extends keyof SlotMap & string, EntryKey extends EntryKeyOf<K>> = SlotMap[K] extends {
    kind: 'keyed';
    keyProps: infer P extends object;
} ? EntryKey extends keyof P ? P[EntryKey] extends object ? P[EntryKey] : never : never : object;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotMap {}

export type EntryKeyOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
    ? keyof P & string
    : string
```

## KeyedHooksSources root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `KeyedHooksSources`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type KeyedHooksSources = Record<string, KeyedStandardSource>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## KeyedSnapshotSelectorHook root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `KeyedSnapshotSelectorHook`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type KeyedSnapshotSelectorHook<Snapshot> = {
    (key: string): Snapshot | undefined;
    <Selected>(key: string, selector: (value: Snapshot | undefined) => Selected, equal?: (left: Selected, right: Selected) => boolean): Selected;
};
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## KindOptions root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `KindOptions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type KindOptions<K extends keyof SlotMap & string, EntryKey extends EntryKeyOf<K>, M = never> = SlotMap[K]['kind'] extends 'keyed' ? {
    key: EntryKey;
    priority?: number;
} : SlotMap[K]['kind'] extends 'list' ? {
    id: string;
    order?: number;
    label?: SlotLabel;
    priority?: number;
} : SlotMap[K]['kind'] extends 'chain' ? {
    select: ChainSelect<SlotMap[K] extends {
        owner: infer O extends object;
    } ? O : object, M>;
    priority?: number;
} : {
    priority?: number;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotMap {}

export type EntryKeyOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
    ? keyof P & string
    : string

export type ChainSelect<O extends object, M> = (owner: O) => M | null

export type SlotLabel = string | (() => string)
```

## LiveCompositionNode root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `LiveCompositionNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type LiveCompositionNode = LiveSlotNode | LiveFactoryNode;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SlotScope = 'root' | 'session-maybe' | 'session'

export interface LiveSlotNode {

  type: 'slot'

  name: string

  kind: SlotKind

  scope: SlotScope

  declaredBy?: string

  occupants: LiveSlotOccupant[]

  children: LiveSlotNode[]
}

export interface LiveFactoryNode {

  type: 'factory'

  name: string

  scope: SlotScope

  registrant?: string

  children: LiveSlotNode[]
}

export type SlotKind = 'single' | 'list' | 'keyed' | 'chain'

export interface LiveSlotOccupant {

  registrant?: string

  key?: string

  id?: string

  order?: number

  priority: number

  active: boolean
}
```

## LiveFactoryNode root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `LiveFactoryNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface LiveFactoryNode {
    type: 'factory';
    name: string;
    scope: SlotScope;
    registrant?: string;
    children: LiveSlotNode[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `type` | `type: 'factory';` |
| `name` | `name: string;` |
| `scope` | `scope: SlotScope;` |
| `registrant` | `registrant?: string;` |
| `children` | `children: LiveSlotNode[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SlotScope = 'root' | 'session-maybe' | 'session'

export interface LiveSlotNode {

  type: 'slot'

  name: string

  kind: SlotKind

  scope: SlotScope

  declaredBy?: string

  occupants: LiveSlotOccupant[]

  children: LiveSlotNode[]
}

export type SlotKind = 'single' | 'list' | 'keyed' | 'chain'

export interface LiveSlotOccupant {

  registrant?: string

  key?: string

  id?: string

  order?: number

  priority: number

  active: boolean
}
```

## LiveSlotNode root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `LiveSlotNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface LiveSlotNode {
    type: 'slot';
    name: string;
    kind: SlotKind;
    scope: SlotScope;
    declaredBy?: string;
    occupants: LiveSlotOccupant[];
    children: LiveSlotNode[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `type` | `type: 'slot';` |
| `name` | `name: string;` |
| `kind` | `kind: SlotKind;` |
| `scope` | `scope: SlotScope;` |
| `declaredBy` | `declaredBy?: string;` |
| `occupants` | `occupants: LiveSlotOccupant[];` |
| `children` | `children: LiveSlotNode[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SlotKind = 'single' | 'list' | 'keyed' | 'chain'

export type SlotScope = 'root' | 'session-maybe' | 'session'

export interface LiveSlotOccupant {

  registrant?: string

  key?: string

  id?: string

  order?: number

  priority: number

  active: boolean
}
```

## LiveSlotOccupant root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `LiveSlotOccupant`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface LiveSlotOccupant {
    registrant?: string;
    key?: string;
    id?: string;
    order?: number;
    priority: number;
    active: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `registrant` | `registrant?: string;` |
| `key` | `key?: string;` |
| `id` | `id?: string;` |
| `order` | `order?: number;` |
| `priority` | `priority: number;` |
| `active` | `active: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## LocaleDictOf root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `LocaleDictOf`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type LocaleDictOf<N extends keyof LocaleNamespaceMap & string> = Record<LocaleNamespaceMap[N] & string, string>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface LocaleNamespaceMap {}
```

## LocaleKeysOf root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `LocaleKeysOf`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type LocaleKeysOf<N extends keyof LocaleNamespaceMap & string> = (LocaleNamespaceMap[N] & string) | CommonKeyOf;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface LocaleNamespaceMap {}

export type CommonKeyOf = LocaleNamespaceMap extends { common: infer C } ? C & string : never
```

## LocaleNamespaceMap root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `LocaleNamespaceMap`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface LocaleNamespaceMap {
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## MatchedShare root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `MatchedShare`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type MatchedShare<E extends SlotEntryDef, M> = E['kind'] extends 'chain' ? {
    matched: M;
} : object;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotEntryDef {
  kind: SlotKind
  scope: SlotScope

  inline?: true
  owner?: object

  keyProps?: Record<string, object>

  hookContext?: unknown

  inject?: object
}

export type SlotKind = 'single' | 'list' | 'keyed' | 'chain'

export type SlotScope = 'root' | 'session-maybe' | 'session'
```

## OwnerOf root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `OwnerOf`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type OwnerOf<K extends keyof SlotMap & string> = SlotMap[K] extends {
    owner: infer O extends object;
} ? O : object;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotMap {}
```

## PropsHooks root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `PropsHooks`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PropsHooks<HS extends HooksSources> = {
    [N in keyof HS & string as `use${Capitalize<N>}`]: SnapshotSelectorHook<HS[N] extends HostObservable<infer T> ? T : never>;
};
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type HooksSources = Record<string, HostObservable<unknown>>
```

## PropsKeyedHooks root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `PropsKeyedHooks`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PropsKeyedHooks<HS extends KeyedHooksSources> = {
    [N in keyof HS & string as `use${Capitalize<N>}`]: KeyedSnapshotSelectorHook<HS[N] extends (key: string) => HostObservable<infer T> | undefined ? T : never>;
};
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type KeyedHooksSources = Record<string, KeyedStandardSource>

export type KeyedSnapshotSelectorHook<Snapshot> = {

  (key: string): Snapshot | undefined

  <Selected>(
    key: string,
    selector: (value: Snapshot | undefined) => Selected,
    equal?: (left: Selected, right: Selected) => boolean,
  ): Selected
}
```

## PropsLocale root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `PropsLocale`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PropsLocale<N> = N extends keyof LocaleNamespaceMap & string ? {
    t: TranslateNS<N>;
} : object;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface LocaleNamespaceMap {}

export type TranslateNS<N extends keyof LocaleNamespaceMap & string> = Translate<LocaleKeysOf<N>>

export type Translate<K extends string = string> =
  (key: K, params?: Record<string, unknown>) => string

export type LocaleKeysOf<N extends keyof LocaleNamespaceMap & string> =
  (LocaleNamespaceMap[N] & string) | CommonKeyOf

export type CommonKeyOf = LocaleNamespaceMap extends { common: infer C } ? C & string : never
```

## PropsRenderFactories root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `PropsRenderFactories`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PropsRenderFactories {
    renderFactorySlot: RenderFactorySlot;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `renderFactorySlot` | `renderFactorySlot: RenderFactorySlot;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type RenderFactorySlot = <F extends keyof SlotFactoryMap & string>(
  name: F,
  props: FactoryInputPropsOf<F>,
  options?: {
    slots?: Partial<{ [N in FactoryLocalNameOf<F>]: FactoryLocalComponent<F, N> }>
    fallback?: ReactNode
  },
) => ReactNode

export interface SlotFactoryMap {}

type FactoryInputPropsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { props: infer P extends object } ? P : object

type FactoryLocalNameOf<F extends keyof SlotFactoryMap & string> = keyof FactoryLocalSlotsOf<F> & string

export type FactoryLocalComponent<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = SlotComponent<FactoryLocalComponentPropsOf<F, N>>

export type SlotComponent<P> = (props: P) => ReactNode

type FactoryLocalSlotsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { slots: infer S extends Record<string, FactoryLocalSlotDef> }
    ? S
    : Record<never, never>

export type FactoryLocalComponentPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalInputPropsOf<F, N>
  & FactoryRegistrationPropsOf<F>
  & ScopeStandardProps<FactoryLocalDefOf<F, N>['scope']>

export interface FactoryLocalSlotDef {
  scope: SlotScope
  props?: object
}

export type ScopeStandardProps<S extends SlotScope> =
  (S extends 'session' ? SessionStandardProps
    : S extends 'session-maybe' ? SessionMaybeStandardProps
      : object) & GlobalStandardProps

type FactoryLocalDefOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalSlotsOf<F>[N] & FactoryLocalSlotDef

type FactoryLocalInputPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalDefOf<F, N> extends { props: infer P extends object } ? P : object

export type FactoryRegistrationPropsOf<F extends keyof SlotFactoryMap & string> =
  FactoryRenderPropsOf<F>
  & PropsStore<FactoryStoreOf<F>>
  & InjectFace<FactoryInjectOf<F>>
  & PropsLocale<FactoryLocaleOf<F>>
  & PropsRenderFactories

export type InjectFace<I extends object> =
  I extends { hooks: infer HS extends HooksSources }
    ? I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'hooks' | 'keyedHooks'> & PropsHooks<HS> & PropsKeyedHooks<KS>
      : Omit<I, 'hooks'> & PropsHooks<HS>
    : I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'keyedHooks'> & PropsKeyedHooks<KS>
      : I

export type PropsLocale<N> = N extends keyof LocaleNamespaceMap & string
  ? {

    t: TranslateNS<N>
  }
  : object

export type SlotScope = 'root' | 'session-maybe' | 'session'

export interface SessionStandardProps {}

export interface SessionMaybeStandardProps {}

export interface GlobalStandardProps {}

type FactoryStoreOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { store: infer H extends StoreDecl } ? HandleOf<H> : undefined

type FactoryInjectOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { inject: infer I extends object } ? I : object

type FactoryLocaleOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { locale: infer N extends keyof LocaleNamespaceMap & string } ? N : undefined

type FactoryRenderPropsOf<F extends keyof SlotFactoryMap & string> =
  [keyof FactoryChildrenOf<F> & keyof SlotMap & string] extends [never]
    ? object
    : PropsRenderSlots<keyof FactoryChildrenOf<F> & keyof SlotMap & string>

export type HooksSources = Record<string, HostObservable<unknown>>

export type KeyedHooksSources = Record<string, KeyedStandardSource>

export type PropsHooks<HS extends HooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]:
  SnapshotSelectorHook<HS[N] extends HostObservable<infer T> ? T : never>
}

export type PropsKeyedHooks<HS extends KeyedHooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]: KeyedSnapshotSelectorHook<
    HS[N] extends (key: string) => HostObservable<infer T> | undefined ? T : never
  >
}

export interface SlotMap {}

export interface LocaleNamespaceMap {}

export type TranslateNS<N extends keyof LocaleNamespaceMap & string> = Translate<LocaleKeysOf<N>>

export type PropsRenderSlots<S extends keyof SlotMap & string> = {

  renderSlot: RenderSlotFn<Exclude<S, ChainKeysOf<S>>>
  readonly __renders?: ((key: S) => void) | undefined
} & ([ChainKeysOf<S>] extends [never] ? object : {

  renderSlotChain: <K extends ChainKeysOf<S>>(key: K, owner: OwnerOf<K>, opts?: ChainRenderOpts) => ReactNode
}) & ([Extract<ScopeOf<S>, 'session' | 'session-maybe'>] extends [never]
  ? object
  : { SessionProvider: SessionProviderComponent })

type FactoryChildrenOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { children: infer D extends Record<string, unknown> } ? D : Record<never, never>

export type KeyedSnapshotSelectorHook<Snapshot> = {

  (key: string): Snapshot | undefined

  <Selected>(
    key: string,
    selector: (value: Snapshot | undefined) => Selected,
    equal?: (left: Selected, right: Selected) => boolean,
  ): Selected
}
```

## PropsRenderSlots root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `PropsRenderSlots`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PropsRenderSlots<S extends keyof SlotMap & string> = {
    renderSlot: RenderSlotFn<Exclude<S, ChainKeysOf<S>>>;
    readonly __renders?: ((key: S) => void) | undefined;
} & ([
    ChainKeysOf<S>
] extends [
    never
] ? object : {
    renderSlotChain: <K extends ChainKeysOf<S>>(key: K, owner: OwnerOf<K>, opts?: ChainRenderOpts) => ReactNode;
}) & ([
    Extract<ScopeOf<S>, 'session' | 'session-maybe'>
] extends [
    never
] ? object : {
    SessionProvider: SessionProviderComponent;
});
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotMap {}

export type OwnerOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { owner: infer O extends object } ? O : object

export type ScopeOf<K extends keyof SlotMap & string> = SlotMap[K]['scope']

export interface ChainRenderOpts {

  fallback?: ReactNode

  fallbackOnly?: boolean

  overlay?: boolean
}

export type ChainKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S]['kind'] extends 'chain' ? S : never) : never

type RenderSlotFn<S extends keyof SlotMap & string> =
  ([ContextualKeysOf<S>] extends [never] ? object : {
    <
      K extends ContextualKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts: RenderOpts<EntryKey> & { hookContext: HookContextOf<K> },
    ): ReactNode
  }) &
  ([OrdinaryKeysOf<S>] extends [never] ? object : {
    <
      K extends OrdinaryKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts?: Omit<RenderOpts<EntryKey>, 'hookContext'>,
    ): ReactNode
  })

export type SessionProviderComponent = (props: SessionAreaProps) => ReactNode

export type EntryKeyOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
    ? keyof P & string
    : string

export type KeyPropsOf<
  K extends keyof SlotMap & string,
  EntryKey extends EntryKeyOf<K>,
> = SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
  ? EntryKey extends keyof P
    ? P[EntryKey] extends object ? P[EntryKey] : never
    : never
  : object

export type HookContextOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { hookContext: infer Context } ? Context : never

export interface RenderOpts<EntryKey extends string = string> {
  entryKey?: EntryKey
  only?: string
  fallback?: ReactNode

  hookContext?: unknown
}

type ContextualKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S] extends { hookContext: unknown } ? S : never) : never

type OrdinaryKeysOf<S extends keyof SlotMap & string> = Exclude<S, ContextualKeysOf<S>>

export interface SessionAreaProps {

  readonly session?: SlotScopeTargetMap[keyof SlotScopeTargetMap & 'session'] | undefined

  empty?: (() => ReactNode) | undefined

  children: ReactNode
}

export interface SlotScopeTargetMap {}
```

## PropsRuntime root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `PropsRuntime`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PropsRuntime<K extends keyof SlotMap & string, EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>> = OwnerOf<K> & KeyPropsOf<K, EntryKey> & SlotInjectFace<SlotInjectOf<K>> & ScopeStandardProps<ScopeOf<K>>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotMap {}

export type OwnerOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { owner: infer O extends object } ? O : object

export type EntryKeyOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
    ? keyof P & string
    : string

export type KeyPropsOf<
  K extends keyof SlotMap & string,
  EntryKey extends EntryKeyOf<K>,
> = SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
  ? EntryKey extends keyof P
    ? P[EntryKey] extends object ? P[EntryKey] : never
    : never
  : object

export type SlotInjectOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { inject: infer Injected extends object } ? Injected : object

export type ScopeOf<K extends keyof SlotMap & string> = SlotMap[K]['scope']

export type ScopeStandardProps<S extends SlotScope> =
  (S extends 'session' ? SessionStandardProps
    : S extends 'session-maybe' ? SessionMaybeStandardProps
      : object) & GlobalStandardProps

export type SlotInjectFace<I extends object> =
  I extends { hooks: infer HS extends object } ? Omit<I, 'hooks'> & PropsSlotHooks<HS> : I

export type SlotScope = 'root' | 'session-maybe' | 'session'

export interface SessionStandardProps {}

export interface SessionMaybeStandardProps {}

export interface GlobalStandardProps {}

export type PropsSlotHooks<HS extends object> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]:
  BoundHookOf<HS[N]>
}

type BoundHookOf<Definition> =
  Definition extends HostObservable<infer Snapshot>
    ? SnapshotSelectorHook<Snapshot>
    : Definition extends (...args: never[]) => infer Hook
      ? Hook extends (...args: never[]) => unknown ? Hook : never
      : never
```

## PropsSlotHooks root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `PropsSlotHooks`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PropsSlotHooks<HS extends object> = {
    [N in keyof HS & string as `use${Capitalize<N>}`]: BoundHookOf<HS[N]>;
};
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
type BoundHookOf<Definition> =
  Definition extends HostObservable<infer Snapshot>
    ? SnapshotSelectorHook<Snapshot>
    : Definition extends (...args: never[]) => infer Hook
      ? Hook extends (...args: never[]) => unknown ? Hook : never
      : never
```

## RegisterFactory root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `RegisterFactory`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface RegisterFactory {
    <F extends keyof SlotFactoryMap & string>(options: RegisterFactoryOptions<F>, component: SlotComponent<FactoryComponentPropsOf<F>>): () => void;
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotFactoryMap {}

export type SlotComponent<P> = (props: P) => ReactNode

export type FactoryComponentPropsOf<F extends keyof SlotFactoryMap & string> =
  FactoryInputPropsOf<F>
  & FactoryRegistrationPropsOf<F>
  & ScopeStandardProps<FactoryDefOf<F>['scope']>
  & { useFactorySlot: UseFactorySlot<F> }

export type UseFactorySlot<F extends keyof SlotFactoryMap & string> =
  <N extends FactoryLocalNameOf<F>>(
    name: N,
    fallback: FactoryLocalComponent<F, N>,
  ) => SlotComponent<FactoryLocalInputPropsOf<F, N>>

export type RegisterFactoryOptions<F extends keyof SlotFactoryMap & string> = {
  name: F
  scope: FactoryDefOf<F>['scope']
} & FactoryField<F, 'children', FactoryChildrenOf<F>>
  & FactoryField<F, 'store', FactoryStoreOf<F> | (() => FactoryStoreOf<F>)>
  & FactoryField<F, 'inject', (...args: FactoryInjectParams<F>) => FactoryInjectOf<F>>
  & FactoryField<F, 'locale', FactoryLocaleOf<F>>
  & FactoryField<F, 'slots', RuntimeFactorySlots<F>>
  & FactoryCollisionCheck<F>
  & FactoryChildrenCheck<F>

export type ScopeStandardProps<S extends SlotScope> =
  (S extends 'session' ? SessionStandardProps
    : S extends 'session-maybe' ? SessionMaybeStandardProps
      : object) & GlobalStandardProps

type FactoryDefOf<F extends keyof SlotFactoryMap & string> = SlotFactoryMap[F] & SlotFactoryDef

type FactoryInputPropsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { props: infer P extends object } ? P : object

type FactoryChildrenOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { children: infer D extends Record<string, unknown> } ? D : Record<never, never>

type FactoryStoreOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { store: infer H extends StoreDecl } ? HandleOf<H> : undefined

type FactoryInjectOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { inject: infer I extends object } ? I : object

type FactoryLocaleOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { locale: infer N extends keyof LocaleNamespaceMap & string } ? N : undefined

type FactoryLocalNameOf<F extends keyof SlotFactoryMap & string> = keyof FactoryLocalSlotsOf<F> & string

type FactoryLocalInputPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalDefOf<F, N> extends { props: infer P extends object } ? P : object

export type FactoryRegistrationPropsOf<F extends keyof SlotFactoryMap & string> =
  FactoryRenderPropsOf<F>
  & PropsStore<FactoryStoreOf<F>>
  & InjectFace<FactoryInjectOf<F>>
  & PropsLocale<FactoryLocaleOf<F>>
  & PropsRenderFactories

export type FactoryLocalComponent<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = SlotComponent<FactoryLocalComponentPropsOf<F, N>>

export interface PropsRenderFactories {
  renderFactorySlot: RenderFactorySlot
}

export type InjectFace<I extends object> =
  I extends { hooks: infer HS extends HooksSources }
    ? I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'hooks' | 'keyedHooks'> & PropsHooks<HS> & PropsKeyedHooks<KS>
      : Omit<I, 'hooks'> & PropsHooks<HS>
    : I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'keyedHooks'> & PropsKeyedHooks<KS>
      : I

export type FactoryInjectParams<F extends keyof SlotFactoryMap & string> =
  FactoryDefOf<F>['scope'] extends 'session'
    ? ([FactoryStoreOf<F>] extends [StoreDecl]
      ? [sessionId: SessionIdOf, actions: BoundActions<FactoryStoreOf<F>>]
      : [sessionId: SessionIdOf])
    : FactoryDefOf<F>['scope'] extends 'session-maybe'
      ? ([FactoryStoreOf<F>] extends [StoreDecl]
        ? [sessionId: SessionIdOf | undefined, actions: BoundActions<FactoryStoreOf<F>> | undefined]
        : [sessionId: SessionIdOf | undefined])
      : ([FactoryStoreOf<F>] extends [StoreDecl]
        ? [actions: BoundActions<FactoryStoreOf<F>>]
        : [])

type FactoryField<
  F extends keyof SlotFactoryMap & string,
  K extends keyof SlotFactoryDef,
  Value,
> = K extends keyof SlotFactoryMap[F] ? { [P in K]-?: Value } : { [P in K]?: never }

type RuntimeFactorySlots<F extends keyof SlotFactoryMap & string> = {
  [N in FactoryLocalNameOf<F>]: { scope: FactoryLocalDefOf<F, N>['scope'] }
}

type FactoryCollisionCheck<F extends keyof SlotFactoryMap & string> = [
  FactoryInjectCollisionKeys<F>
  | FactoryInputCollisionKeys<F>
  | FactoryLocalCollisionKeys<F>
  | FactoryRegistrationLocalScopeCollisionKeys<F>,
] extends [never]
  ? unknown
  : {
    'Factory declaration has overlapping prop ownership':
      FactoryInjectCollisionKeys<F>
      | FactoryInputCollisionKeys<F>
      | FactoryLocalCollisionKeys<F>
      | FactoryRegistrationLocalScopeCollisionKeys<F>
  }

type FactoryChildrenCheck<F extends keyof SlotFactoryMap & string> =
  [FactoryChildMismatchKeys<F>] extends [never]
    ? unknown
    : { 'Factory children must match SlotMap': FactoryChildMismatchKeys<F> }

export interface SlotMap {}

export interface LocaleNamespaceMap {}

export type PropsLocale<N> = N extends keyof LocaleNamespaceMap & string
  ? {

    t: TranslateNS<N>
  }
  : object

export type SlotScope = 'root' | 'session-maybe' | 'session'

export interface SlotFactoryDef {
  scope: SlotScope
  props?: object
  children?: ChildrenDecl
  store?: StoreDecl
  inject?: object
  locale?: keyof LocaleNamespaceMap & string
  slots?: Record<string, FactoryLocalSlotDef>
}

export type ChildrenDecl = { [P in keyof SlotMap & string]?: SlotSpec<SlotMap[P]> }

export interface SessionStandardProps {}

export interface SessionMaybeStandardProps {}

export interface GlobalStandardProps {}

export type SessionIdOf = SessionStandardProps extends { sessionId: infer S } ? S : string

type FactoryLocalSlotsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { slots: infer S extends Record<string, FactoryLocalSlotDef> }
    ? S
    : Record<never, never>

type FactoryLocalDefOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalSlotsOf<F>[N] & FactoryLocalSlotDef

type FactoryRenderPropsOf<F extends keyof SlotFactoryMap & string> =
  [keyof FactoryChildrenOf<F> & keyof SlotMap & string] extends [never]
    ? object
    : PropsRenderSlots<keyof FactoryChildrenOf<F> & keyof SlotMap & string>

export type FactoryLocalComponentPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalInputPropsOf<F, N>
  & FactoryRegistrationPropsOf<F>
  & ScopeStandardProps<FactoryLocalDefOf<F, N>['scope']>

export type RenderFactorySlot = <F extends keyof SlotFactoryMap & string>(
  name: F,
  props: FactoryInputPropsOf<F>,
  options?: {
    slots?: Partial<{ [N in FactoryLocalNameOf<F>]: FactoryLocalComponent<F, N> }>
    fallback?: ReactNode
  },
) => ReactNode

export type HooksSources = Record<string, HostObservable<unknown>>

export type KeyedHooksSources = Record<string, KeyedStandardSource>

export type PropsHooks<HS extends HooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]:
  SnapshotSelectorHook<HS[N] extends HostObservable<infer T> ? T : never>
}

export type PropsKeyedHooks<HS extends KeyedHooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]: KeyedSnapshotSelectorHook<
    HS[N] extends (key: string) => HostObservable<infer T> | undefined ? T : never
  >
}

type FactoryInjectCollisionKeys<F extends keyof SlotFactoryMap & string> = Extract<
  keyof InjectFace<FactoryInjectOf<F>>,
  keyof (
    FactoryRenderPropsOf<F>
    & PropsStore<FactoryStoreOf<F>>
    & PropsLocale<FactoryLocaleOf<F>>
    & PropsRenderFactories
    & ScopeStandardProps<FactoryDefOf<F>['scope']>
    & { useFactorySlot: UseFactorySlot<F> }
  )
>

type FactoryInputCollisionKeys<F extends keyof SlotFactoryMap & string> = Extract<
  keyof FactoryInputPropsOf<F>,
  keyof (
    FactoryRegistrationPropsOf<F>
    & ScopeStandardProps<FactoryDefOf<F>['scope']>
    & { useFactorySlot: UseFactorySlot<F> }
  )
>

type FactoryLocalCollisionKeys<F extends keyof SlotFactoryMap & string> = {
  [N in FactoryLocalNameOf<F>]: Extract<
    keyof FactoryLocalInputPropsOf<F, N>,
    keyof (FactoryRegistrationPropsOf<F> & ScopeStandardProps<FactoryLocalDefOf<F, N>['scope']>)
  >
}[FactoryLocalNameOf<F>]

type FactoryRegistrationLocalScopeCollisionKeys<F extends keyof SlotFactoryMap & string> = {
  [N in FactoryLocalNameOf<F>]: Extract<
    keyof FactoryRegistrationPropsOf<F>,
    keyof ScopeStandardProps<FactoryLocalDefOf<F, N>['scope']>
  >
}[FactoryLocalNameOf<F>]

type FactoryChildMismatchKeys<F extends keyof SlotFactoryMap & string> = {
  [K in keyof FactoryChildrenOf<F>]: K extends keyof SlotMap
    ? FactoryChildrenOf<F>[K] extends SlotSpec<SlotMap[K]> ? never : K
    : K
}[keyof FactoryChildrenOf<F>]

export type TranslateNS<N extends keyof LocaleNamespaceMap & string> = Translate<LocaleKeysOf<N>>

export interface FactoryLocalSlotDef {
  scope: SlotScope
  props?: object
}

export type SlotSpec<E extends SlotEntryDef> = {
  kind: E['kind']
  scope: E['scope']

  inline?: true
} & ('inject' extends keyof E
  ? E extends { inject: infer Injected extends object }
    ? { inject: Injected }
    : { inject?: object }
  : { inject?: never })

export type PropsRenderSlots<S extends keyof SlotMap & string> = {

  renderSlot: RenderSlotFn<Exclude<S, ChainKeysOf<S>>>
  readonly __renders?: ((key: S) => void) | undefined
} & ([ChainKeysOf<S>] extends [never] ? object : {

  renderSlotChain: <K extends ChainKeysOf<S>>(key: K, owner: OwnerOf<K>, opts?: ChainRenderOpts) => ReactNode
}) & ([Extract<ScopeOf<S>, 'session' | 'session-maybe'>] extends [never]
  ? object
  : { SessionProvider: SessionProviderComponent })

export type KeyedSnapshotSelectorHook<Snapshot> = {

  (key: string): Snapshot | undefined

  <Selected>(
    key: string,
    selector: (value: Snapshot | undefined) => Selected,
    equal?: (left: Selected, right: Selected) => boolean,
  ): Selected
}

export type Translate<K extends string = string> =
  (key: K, params?: Record<string, unknown>) => string

export type LocaleKeysOf<N extends keyof LocaleNamespaceMap & string> =
  (LocaleNamespaceMap[N] & string) | CommonKeyOf

export interface SlotEntryDef {
  kind: SlotKind
  scope: SlotScope

  inline?: true
  owner?: object

  keyProps?: Record<string, object>

  hookContext?: unknown

  inject?: object
}

export type OwnerOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { owner: infer O extends object } ? O : object

export type ScopeOf<K extends keyof SlotMap & string> = SlotMap[K]['scope']

export interface ChainRenderOpts {

  fallback?: ReactNode

  fallbackOnly?: boolean

  overlay?: boolean
}

export type ChainKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S]['kind'] extends 'chain' ? S : never) : never

type RenderSlotFn<S extends keyof SlotMap & string> =
  ([ContextualKeysOf<S>] extends [never] ? object : {
    <
      K extends ContextualKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts: RenderOpts<EntryKey> & { hookContext: HookContextOf<K> },
    ): ReactNode
  }) &
  ([OrdinaryKeysOf<S>] extends [never] ? object : {
    <
      K extends OrdinaryKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts?: Omit<RenderOpts<EntryKey>, 'hookContext'>,
    ): ReactNode
  })

export type SessionProviderComponent = (props: SessionAreaProps) => ReactNode

export type CommonKeyOf = LocaleNamespaceMap extends { common: infer C } ? C & string : never

export type SlotKind = 'single' | 'list' | 'keyed' | 'chain'

export type EntryKeyOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
    ? keyof P & string
    : string

export type KeyPropsOf<
  K extends keyof SlotMap & string,
  EntryKey extends EntryKeyOf<K>,
> = SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
  ? EntryKey extends keyof P
    ? P[EntryKey] extends object ? P[EntryKey] : never
    : never
  : object

export type HookContextOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { hookContext: infer Context } ? Context : never

export interface RenderOpts<EntryKey extends string = string> {
  entryKey?: EntryKey
  only?: string
  fallback?: ReactNode

  hookContext?: unknown
}

type ContextualKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S] extends { hookContext: unknown } ? S : never) : never

type OrdinaryKeysOf<S extends keyof SlotMap & string> = Exclude<S, ContextualKeysOf<S>>

export interface SessionAreaProps {

  readonly session?: SlotScopeTargetMap[keyof SlotScopeTargetMap & 'session'] | undefined

  empty?: (() => ReactNode) | undefined

  children: ReactNode
}
```

## RegisterFactoryOptions root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `RegisterFactoryOptions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type RegisterFactoryOptions<F extends keyof SlotFactoryMap & string> = {
    name: F;
    scope: FactoryDefOf<F>['scope'];
} & FactoryField<F, 'children', FactoryChildrenOf<F>> & FactoryField<F, 'store', FactoryStoreOf<F> | (() => FactoryStoreOf<F>)> & FactoryField<F, 'inject', (...args: FactoryInjectParams<F>) => FactoryInjectOf<F>> & FactoryField<F, 'locale', FactoryLocaleOf<F>> & FactoryField<F, 'slots', RuntimeFactorySlots<F>> & FactoryCollisionCheck<F> & FactoryChildrenCheck<F>;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotFactoryMap {}

type FactoryDefOf<F extends keyof SlotFactoryMap & string> = SlotFactoryMap[F] & SlotFactoryDef

type FactoryChildrenOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { children: infer D extends Record<string, unknown> } ? D : Record<never, never>

type FactoryStoreOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { store: infer H extends StoreDecl } ? HandleOf<H> : undefined

type FactoryInjectOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { inject: infer I extends object } ? I : object

type FactoryLocaleOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { locale: infer N extends keyof LocaleNamespaceMap & string } ? N : undefined

export type FactoryInjectParams<F extends keyof SlotFactoryMap & string> =
  FactoryDefOf<F>['scope'] extends 'session'
    ? ([FactoryStoreOf<F>] extends [StoreDecl]
      ? [sessionId: SessionIdOf, actions: BoundActions<FactoryStoreOf<F>>]
      : [sessionId: SessionIdOf])
    : FactoryDefOf<F>['scope'] extends 'session-maybe'
      ? ([FactoryStoreOf<F>] extends [StoreDecl]
        ? [sessionId: SessionIdOf | undefined, actions: BoundActions<FactoryStoreOf<F>> | undefined]
        : [sessionId: SessionIdOf | undefined])
      : ([FactoryStoreOf<F>] extends [StoreDecl]
        ? [actions: BoundActions<FactoryStoreOf<F>>]
        : [])

type FactoryField<
  F extends keyof SlotFactoryMap & string,
  K extends keyof SlotFactoryDef,
  Value,
> = K extends keyof SlotFactoryMap[F] ? { [P in K]-?: Value } : { [P in K]?: never }

type RuntimeFactorySlots<F extends keyof SlotFactoryMap & string> = {
  [N in FactoryLocalNameOf<F>]: { scope: FactoryLocalDefOf<F, N>['scope'] }
}

type FactoryCollisionCheck<F extends keyof SlotFactoryMap & string> = [
  FactoryInjectCollisionKeys<F>
  | FactoryInputCollisionKeys<F>
  | FactoryLocalCollisionKeys<F>
  | FactoryRegistrationLocalScopeCollisionKeys<F>,
] extends [never]
  ? unknown
  : {
    'Factory declaration has overlapping prop ownership':
      FactoryInjectCollisionKeys<F>
      | FactoryInputCollisionKeys<F>
      | FactoryLocalCollisionKeys<F>
      | FactoryRegistrationLocalScopeCollisionKeys<F>
  }

type FactoryChildrenCheck<F extends keyof SlotFactoryMap & string> =
  [FactoryChildMismatchKeys<F>] extends [never]
    ? unknown
    : { 'Factory children must match SlotMap': FactoryChildMismatchKeys<F> }

export interface SlotMap {}

export interface LocaleNamespaceMap {}

export interface SlotFactoryDef {
  scope: SlotScope
  props?: object
  children?: ChildrenDecl
  store?: StoreDecl
  inject?: object
  locale?: keyof LocaleNamespaceMap & string
  slots?: Record<string, FactoryLocalSlotDef>
}

export type ChildrenDecl = { [P in keyof SlotMap & string]?: SlotSpec<SlotMap[P]> }

export type SessionIdOf = SessionStandardProps extends { sessionId: infer S } ? S : string

type FactoryLocalNameOf<F extends keyof SlotFactoryMap & string> = keyof FactoryLocalSlotsOf<F> & string

type FactoryLocalDefOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalSlotsOf<F>[N] & FactoryLocalSlotDef

type FactoryInjectCollisionKeys<F extends keyof SlotFactoryMap & string> = Extract<
  keyof InjectFace<FactoryInjectOf<F>>,
  keyof (
    FactoryRenderPropsOf<F>
    & PropsStore<FactoryStoreOf<F>>
    & PropsLocale<FactoryLocaleOf<F>>
    & PropsRenderFactories
    & ScopeStandardProps<FactoryDefOf<F>['scope']>
    & { useFactorySlot: UseFactorySlot<F> }
  )
>

type FactoryInputCollisionKeys<F extends keyof SlotFactoryMap & string> = Extract<
  keyof FactoryInputPropsOf<F>,
  keyof (
    FactoryRegistrationPropsOf<F>
    & ScopeStandardProps<FactoryDefOf<F>['scope']>
    & { useFactorySlot: UseFactorySlot<F> }
  )
>

type FactoryLocalCollisionKeys<F extends keyof SlotFactoryMap & string> = {
  [N in FactoryLocalNameOf<F>]: Extract<
    keyof FactoryLocalInputPropsOf<F, N>,
    keyof (FactoryRegistrationPropsOf<F> & ScopeStandardProps<FactoryLocalDefOf<F, N>['scope']>)
  >
}[FactoryLocalNameOf<F>]

type FactoryRegistrationLocalScopeCollisionKeys<F extends keyof SlotFactoryMap & string> = {
  [N in FactoryLocalNameOf<F>]: Extract<
    keyof FactoryRegistrationPropsOf<F>,
    keyof ScopeStandardProps<FactoryLocalDefOf<F, N>['scope']>
  >
}[FactoryLocalNameOf<F>]

type FactoryChildMismatchKeys<F extends keyof SlotFactoryMap & string> = {
  [K in keyof FactoryChildrenOf<F>]: K extends keyof SlotMap
    ? FactoryChildrenOf<F>[K] extends SlotSpec<SlotMap[K]> ? never : K
    : K
}[keyof FactoryChildrenOf<F>]

export type PropsLocale<N> = N extends keyof LocaleNamespaceMap & string
  ? {

    t: TranslateNS<N>
  }
  : object

export type SlotScope = 'root' | 'session-maybe' | 'session'

export interface FactoryLocalSlotDef {
  scope: SlotScope
  props?: object
}

export type SlotSpec<E extends SlotEntryDef> = {
  kind: E['kind']
  scope: E['scope']

  inline?: true
} & ('inject' extends keyof E
  ? E extends { inject: infer Injected extends object }
    ? { inject: Injected }
    : { inject?: object }
  : { inject?: never })

export interface SessionStandardProps {}

export type ScopeStandardProps<S extends SlotScope> =
  (S extends 'session' ? SessionStandardProps
    : S extends 'session-maybe' ? SessionMaybeStandardProps
      : object) & GlobalStandardProps

type FactoryInputPropsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { props: infer P extends object } ? P : object

type FactoryLocalSlotsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { slots: infer S extends Record<string, FactoryLocalSlotDef> }
    ? S
    : Record<never, never>

type FactoryLocalInputPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalDefOf<F, N> extends { props: infer P extends object } ? P : object

type FactoryRenderPropsOf<F extends keyof SlotFactoryMap & string> =
  [keyof FactoryChildrenOf<F> & keyof SlotMap & string] extends [never]
    ? object
    : PropsRenderSlots<keyof FactoryChildrenOf<F> & keyof SlotMap & string>

export type FactoryRegistrationPropsOf<F extends keyof SlotFactoryMap & string> =
  FactoryRenderPropsOf<F>
  & PropsStore<FactoryStoreOf<F>>
  & InjectFace<FactoryInjectOf<F>>
  & PropsLocale<FactoryLocaleOf<F>>
  & PropsRenderFactories

export type UseFactorySlot<F extends keyof SlotFactoryMap & string> =
  <N extends FactoryLocalNameOf<F>>(
    name: N,
    fallback: FactoryLocalComponent<F, N>,
  ) => SlotComponent<FactoryLocalInputPropsOf<F, N>>

export interface PropsRenderFactories {
  renderFactorySlot: RenderFactorySlot
}

export type InjectFace<I extends object> =
  I extends { hooks: infer HS extends HooksSources }
    ? I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'hooks' | 'keyedHooks'> & PropsHooks<HS> & PropsKeyedHooks<KS>
      : Omit<I, 'hooks'> & PropsHooks<HS>
    : I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'keyedHooks'> & PropsKeyedHooks<KS>
      : I

export type TranslateNS<N extends keyof LocaleNamespaceMap & string> = Translate<LocaleKeysOf<N>>

export interface SlotEntryDef {
  kind: SlotKind
  scope: SlotScope

  inline?: true
  owner?: object

  keyProps?: Record<string, object>

  hookContext?: unknown

  inject?: object
}

export interface SessionMaybeStandardProps {}

export interface GlobalStandardProps {}

export type PropsRenderSlots<S extends keyof SlotMap & string> = {

  renderSlot: RenderSlotFn<Exclude<S, ChainKeysOf<S>>>
  readonly __renders?: ((key: S) => void) | undefined
} & ([ChainKeysOf<S>] extends [never] ? object : {

  renderSlotChain: <K extends ChainKeysOf<S>>(key: K, owner: OwnerOf<K>, opts?: ChainRenderOpts) => ReactNode
}) & ([Extract<ScopeOf<S>, 'session' | 'session-maybe'>] extends [never]
  ? object
  : { SessionProvider: SessionProviderComponent })

export type SlotComponent<P> = (props: P) => ReactNode

export type FactoryLocalComponent<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = SlotComponent<FactoryLocalComponentPropsOf<F, N>>

export type RenderFactorySlot = <F extends keyof SlotFactoryMap & string>(
  name: F,
  props: FactoryInputPropsOf<F>,
  options?: {
    slots?: Partial<{ [N in FactoryLocalNameOf<F>]: FactoryLocalComponent<F, N> }>
    fallback?: ReactNode
  },
) => ReactNode

export type HooksSources = Record<string, HostObservable<unknown>>

export type KeyedHooksSources = Record<string, KeyedStandardSource>

export type PropsHooks<HS extends HooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]:
  SnapshotSelectorHook<HS[N] extends HostObservable<infer T> ? T : never>
}

export type PropsKeyedHooks<HS extends KeyedHooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]: KeyedSnapshotSelectorHook<
    HS[N] extends (key: string) => HostObservable<infer T> | undefined ? T : never
  >
}

export type Translate<K extends string = string> =
  (key: K, params?: Record<string, unknown>) => string

export type LocaleKeysOf<N extends keyof LocaleNamespaceMap & string> =
  (LocaleNamespaceMap[N] & string) | CommonKeyOf

export type SlotKind = 'single' | 'list' | 'keyed' | 'chain'

export type OwnerOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { owner: infer O extends object } ? O : object

export type ScopeOf<K extends keyof SlotMap & string> = SlotMap[K]['scope']

export interface ChainRenderOpts {

  fallback?: ReactNode

  fallbackOnly?: boolean

  overlay?: boolean
}

export type ChainKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S]['kind'] extends 'chain' ? S : never) : never

type RenderSlotFn<S extends keyof SlotMap & string> =
  ([ContextualKeysOf<S>] extends [never] ? object : {
    <
      K extends ContextualKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts: RenderOpts<EntryKey> & { hookContext: HookContextOf<K> },
    ): ReactNode
  }) &
  ([OrdinaryKeysOf<S>] extends [never] ? object : {
    <
      K extends OrdinaryKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts?: Omit<RenderOpts<EntryKey>, 'hookContext'>,
    ): ReactNode
  })

export type SessionProviderComponent = (props: SessionAreaProps) => ReactNode

export type FactoryLocalComponentPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalInputPropsOf<F, N>
  & FactoryRegistrationPropsOf<F>
  & ScopeStandardProps<FactoryLocalDefOf<F, N>['scope']>

export type KeyedSnapshotSelectorHook<Snapshot> = {

  (key: string): Snapshot | undefined

  <Selected>(
    key: string,
    selector: (value: Snapshot | undefined) => Selected,
    equal?: (left: Selected, right: Selected) => boolean,
  ): Selected
}

export type CommonKeyOf = LocaleNamespaceMap extends { common: infer C } ? C & string : never

export type EntryKeyOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
    ? keyof P & string
    : string

export type KeyPropsOf<
  K extends keyof SlotMap & string,
  EntryKey extends EntryKeyOf<K>,
> = SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
  ? EntryKey extends keyof P
    ? P[EntryKey] extends object ? P[EntryKey] : never
    : never
  : object

export type HookContextOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { hookContext: infer Context } ? Context : never

export interface RenderOpts<EntryKey extends string = string> {
  entryKey?: EntryKey
  only?: string
  fallback?: ReactNode

  hookContext?: unknown
}

type ContextualKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S] extends { hookContext: unknown } ? S : never) : never

type OrdinaryKeysOf<S extends keyof SlotMap & string> = Exclude<S, ContextualKeysOf<S>>

export interface SessionAreaProps {

  readonly session?: SlotScopeTargetMap[keyof SlotScopeTargetMap & 'session'] | undefined

  empty?: (() => ReactNode) | undefined

  children: ReactNode
}
```

## RenderFactorySlot root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `RenderFactorySlot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type RenderFactorySlot = <F extends keyof SlotFactoryMap & string>(name: F, props: FactoryInputPropsOf<F>, options?: {
    slots?: Partial<{
        [N in FactoryLocalNameOf<F>]: FactoryLocalComponent<F, N>;
    }>;
    fallback?: ReactNode;
}) => ReactNode;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotFactoryMap {}

type FactoryInputPropsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { props: infer P extends object } ? P : object

type FactoryLocalNameOf<F extends keyof SlotFactoryMap & string> = keyof FactoryLocalSlotsOf<F> & string

export type FactoryLocalComponent<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = SlotComponent<FactoryLocalComponentPropsOf<F, N>>

export type SlotComponent<P> = (props: P) => ReactNode

type FactoryLocalSlotsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { slots: infer S extends Record<string, FactoryLocalSlotDef> }
    ? S
    : Record<never, never>

export type FactoryLocalComponentPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalInputPropsOf<F, N>
  & FactoryRegistrationPropsOf<F>
  & ScopeStandardProps<FactoryLocalDefOf<F, N>['scope']>

export interface FactoryLocalSlotDef {
  scope: SlotScope
  props?: object
}

export type ScopeStandardProps<S extends SlotScope> =
  (S extends 'session' ? SessionStandardProps
    : S extends 'session-maybe' ? SessionMaybeStandardProps
      : object) & GlobalStandardProps

type FactoryLocalDefOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalSlotsOf<F>[N] & FactoryLocalSlotDef

type FactoryLocalInputPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalDefOf<F, N> extends { props: infer P extends object } ? P : object

export type FactoryRegistrationPropsOf<F extends keyof SlotFactoryMap & string> =
  FactoryRenderPropsOf<F>
  & PropsStore<FactoryStoreOf<F>>
  & InjectFace<FactoryInjectOf<F>>
  & PropsLocale<FactoryLocaleOf<F>>
  & PropsRenderFactories

export interface PropsRenderFactories {
  renderFactorySlot: RenderFactorySlot
}

export type InjectFace<I extends object> =
  I extends { hooks: infer HS extends HooksSources }
    ? I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'hooks' | 'keyedHooks'> & PropsHooks<HS> & PropsKeyedHooks<KS>
      : Omit<I, 'hooks'> & PropsHooks<HS>
    : I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'keyedHooks'> & PropsKeyedHooks<KS>
      : I

export type PropsLocale<N> = N extends keyof LocaleNamespaceMap & string
  ? {

    t: TranslateNS<N>
  }
  : object

export type SlotScope = 'root' | 'session-maybe' | 'session'

export interface SessionStandardProps {}

export interface SessionMaybeStandardProps {}

export interface GlobalStandardProps {}

type FactoryStoreOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { store: infer H extends StoreDecl } ? HandleOf<H> : undefined

type FactoryInjectOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { inject: infer I extends object } ? I : object

type FactoryLocaleOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { locale: infer N extends keyof LocaleNamespaceMap & string } ? N : undefined

type FactoryRenderPropsOf<F extends keyof SlotFactoryMap & string> =
  [keyof FactoryChildrenOf<F> & keyof SlotMap & string] extends [never]
    ? object
    : PropsRenderSlots<keyof FactoryChildrenOf<F> & keyof SlotMap & string>

export type HooksSources = Record<string, HostObservable<unknown>>

export type KeyedHooksSources = Record<string, KeyedStandardSource>

export type PropsHooks<HS extends HooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]:
  SnapshotSelectorHook<HS[N] extends HostObservable<infer T> ? T : never>
}

export type PropsKeyedHooks<HS extends KeyedHooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]: KeyedSnapshotSelectorHook<
    HS[N] extends (key: string) => HostObservable<infer T> | undefined ? T : never
  >
}

export interface SlotMap {}

export interface LocaleNamespaceMap {}

export type TranslateNS<N extends keyof LocaleNamespaceMap & string> = Translate<LocaleKeysOf<N>>

export type PropsRenderSlots<S extends keyof SlotMap & string> = {

  renderSlot: RenderSlotFn<Exclude<S, ChainKeysOf<S>>>
  readonly __renders?: ((key: S) => void) | undefined
} & ([ChainKeysOf<S>] extends [never] ? object : {

  renderSlotChain: <K extends ChainKeysOf<S>>(key: K, owner: OwnerOf<K>, opts?: ChainRenderOpts) => ReactNode
}) & ([Extract<ScopeOf<S>, 'session' | 'session-maybe'>] extends [never]
  ? object
  : { SessionProvider: SessionProviderComponent })

type FactoryChildrenOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { children: infer D extends Record<string, unknown> } ? D : Record<never, never>

export type KeyedSnapshotSelectorHook<Snapshot> = {

  (key: string): Snapshot | undefined

  <Selected>(
    key: string,
    selector: (value: Snapshot | undefined) => Selected,
    equal?: (left: Selected, right: Selected) => boolean,
  ): Selected
}

export type Translate<K extends string = string> =
  (key: K, params?: Record<string, unknown>) => string

export type LocaleKeysOf<N extends keyof LocaleNamespaceMap & string> =
  (LocaleNamespaceMap[N] & string) | CommonKeyOf

export type OwnerOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { owner: infer O extends object } ? O : object

export type ScopeOf<K extends keyof SlotMap & string> = SlotMap[K]['scope']

export interface ChainRenderOpts {

  fallback?: ReactNode

  fallbackOnly?: boolean

  overlay?: boolean
}

export type ChainKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S]['kind'] extends 'chain' ? S : never) : never

type RenderSlotFn<S extends keyof SlotMap & string> =
  ([ContextualKeysOf<S>] extends [never] ? object : {
    <
      K extends ContextualKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts: RenderOpts<EntryKey> & { hookContext: HookContextOf<K> },
    ): ReactNode
  }) &
  ([OrdinaryKeysOf<S>] extends [never] ? object : {
    <
      K extends OrdinaryKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts?: Omit<RenderOpts<EntryKey>, 'hookContext'>,
    ): ReactNode
  })

export type SessionProviderComponent = (props: SessionAreaProps) => ReactNode
```

## RenderOpts root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `RenderOpts`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface RenderOpts<EntryKey extends string = string> {
    entryKey?: EntryKey;
    only?: string;
    fallback?: ReactNode;
    hookContext?: unknown;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `entryKey` | `entryKey?: EntryKey;` |
| `only` | `only?: string;` |
| `fallback` | `fallback?: ReactNode;` |
| `hookContext` | `hookContext?: unknown;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## ResourceProtocolMap root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `ResourceProtocolMap`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ResourceProtocolMap {
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## ScopeOf root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `ScopeOf`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ScopeOf<K extends keyof SlotMap & string> = SlotMap[K]['scope'];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotMap {}
```

## ScopeStandardProps root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `ScopeStandardProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ScopeStandardProps<S extends SlotScope> = (S extends 'session' ? SessionStandardProps : S extends 'session-maybe' ? SessionMaybeStandardProps : object) & GlobalStandardProps;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SlotScope = 'root' | 'session-maybe' | 'session'

export interface SessionStandardProps {}

export interface SessionMaybeStandardProps {}

export interface GlobalStandardProps {}
```

## SessionAreaProps root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SessionAreaProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SessionAreaProps {
    readonly session?: SlotScopeTargetMap[keyof SlotScopeTargetMap & 'session'] | undefined;
    empty?: (() => ReactNode) | undefined;
    children: ReactNode;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `session` | `readonly session?: SlotScopeTargetMap[keyof SlotScopeTargetMap & 'session'] \| undefined;` |
| `empty` | `empty?: (() => ReactNode) \| undefined;` |
| `children` | `children: ReactNode;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotScopeTargetMap {}
```

## SessionIdOf root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SessionIdOf`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SessionIdOf = SessionStandardProps extends {
    sessionId: infer S;
} ? S : string;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SessionStandardProps {}
```

## SessionMaybeStandardProps root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SessionMaybeStandardProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SessionMaybeStandardProps {
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## SessionProviderComponent root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SessionProviderComponent`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SessionProviderComponent = (props: SessionAreaProps) => ReactNode;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SessionAreaProps {

  readonly session?: SlotScopeTargetMap[keyof SlotScopeTargetMap & 'session'] | undefined

  empty?: (() => ReactNode) | undefined

  children: ReactNode
}

export interface SlotScopeTargetMap {}
```

## SessionStandardProps root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SessionStandardProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SessionStandardProps {
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## SlotComponent root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotComponent`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SlotComponent<P> = (props: P) => ReactNode;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## SlotCore root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotCore`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class SlotCore {
    constructor();
    readonly registerFactory: RegisterFactory;
    factory(name: string): StoredFactory | undefined;
    factoryVersion(name: string): number;
    subscribeFactory(name: string, listener: () => void): () => void;
    isFactoryLive(definition: StoredFactory): boolean;
    register<K extends keyof SlotMap & string, const EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>, const D extends ChildrenDecl = Record<never, never>, H extends StoreDecl | undefined = undefined, M = never, N extends (keyof LocaleNamespaceMap & string) | undefined = undefined, C extends SlotComponent<never> = SlotComponent<never>>(options: BaseOptions<K, EntryKey, D, H, M, N> & {
        inject?: undefined;
    }, component: C & SlotComponent<ComposedProps<K, NoInfer<EntryKey>, keyof NoInfer<D> & keyof SlotMap & string, HandleOf<NoInfer<H>>, object, NoInfer<M>, NoInfer<N>>> & RendersCheck<C, D>): () => void;
    register<K extends keyof SlotMap & string, I extends object, const EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>, const D extends ChildrenDecl = Record<never, never>, H extends StoreDecl | undefined = undefined, M = never, N extends (keyof LocaleNamespaceMap & string) | undefined = undefined, C extends SlotComponent<never> = SlotComponent<never>>(options: BaseOptions<K, EntryKey, D, H, M, N> & {
        inject: (...args: InjectParams<K, H>) => I;
    }, component: C & SlotComponent<ComposedProps<K, NoInfer<EntryKey>, keyof NoInfer<D> & keyof SlotMap & string, HandleOf<NoInfer<H>>, I, NoInfer<M>, NoInfer<N>>> & RendersCheck<C, D>): () => void;
    isLive(entry: StoredEntry): boolean;
    entries(key: string): readonly StoredEntry[];
    entriesOfSlot(key: string): readonly StoredEntry[];
    spec<K extends keyof SlotMap & string>(key: K): SlotSpec<SlotMap[K]> | undefined;
    specDynamic(key: string): SlotSpec<SlotEntryDef> | undefined;
    snapshot(root?: string): LiveCompositionNode[];
    declarationEpoch(key: string): number;
    subscribe(key: string, fn: () => void): () => void;
    subscribeDeclaration(key: string, fn: () => void): () => void;
    getVersion(key: string): number;
    onMutate(fn: (key: string) => void): () => void;
    reportEntryError(key: string, entry: StoredEntry, error: unknown, info: {
        abdicate: boolean;
    }): void;
    reportFactoryError(name: string, registration: StoredEntry | StoredFactory, error: unknown): void;
    onEntryError(fn: (key: string, registration: StoredEntry | StoredFactory, error: unknown, info: {
        abdicated: boolean;
    }) => void): () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `constructor` | `constructor();` |
| `registerFactory` | `readonly registerFactory: RegisterFactory;` |
| `factory` | `factory(name: string): StoredFactory \| undefined;` |
| `factoryVersion` | `factoryVersion(name: string): number;` |
| `subscribeFactory` | `subscribeFactory(name: string, listener: () => void): () => void;` |
| `isFactoryLive` | `isFactoryLive(definition: StoredFactory): boolean;` |
| `register` | `register<K extends keyof SlotMap & string, const EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>, const D extends ChildrenDecl = Record<never, never>, H extends StoreDecl \| undefined = undefined, M = never, N extends (keyof LocaleNamespaceMap & string) \| undefined = undefined, C extends SlotComponent<never> = SlotComponent<never>>(options: BaseOptions<K, EntryKey, D, H, M, N> & { inject?: undefined; }, component: C & SlotComponent<ComposedProps<K, NoInfer<EntryKey>, keyof NoInfer<D> & keyof SlotMap & string, HandleOf<NoInfer<H>>, object, NoInfer<M>, NoInfer<N>>> & RendersCheck<C, D>): () => void;` |
| `register` | `register<K extends keyof SlotMap & string, I extends object, const EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>, const D extends ChildrenDecl = Record<never, never>, H extends StoreDecl \| undefined = undefined, M = never, N extends (keyof LocaleNamespaceMap & string) \| undefined = undefined, C extends SlotComponent<never> = SlotComponent<never>>(options: BaseOptions<K, EntryKey, D, H, M, N> & { inject: (...args: InjectParams<K, H>) => I; }, component: C & SlotComponent<ComposedProps<K, NoInfer<EntryKey>, keyof NoInfer<D> & keyof SlotMap & string, HandleOf<NoInfer<H>>, I, NoInfer<M>, NoInfer<N>>> & RendersCheck<C, D>): () => void;` |
| `isLive` | `isLive(entry: StoredEntry): boolean;` |
| `entries` | `entries(key: string): readonly StoredEntry[];` |
| `entriesOfSlot` | `entriesOfSlot(key: string): readonly StoredEntry[];` |
| `spec` | `spec<K extends keyof SlotMap & string>(key: K): SlotSpec<SlotMap[K]> \| undefined;` |
| `specDynamic` | `specDynamic(key: string): SlotSpec<SlotEntryDef> \| undefined;` |
| `snapshot` | `snapshot(root?: string): LiveCompositionNode[];` |
| `declarationEpoch` | `declarationEpoch(key: string): number;` |
| `subscribe` | `subscribe(key: string, fn: () => void): () => void;` |
| `subscribeDeclaration` | `subscribeDeclaration(key: string, fn: () => void): () => void;` |
| `getVersion` | `getVersion(key: string): number;` |
| `onMutate` | `onMutate(fn: (key: string) => void): () => void;` |
| `reportEntryError` | `reportEntryError(key: string, entry: StoredEntry, error: unknown, info: { abdicate: boolean; }): void;` |
| `reportFactoryError` | `reportFactoryError(name: string, registration: StoredEntry \| StoredFactory, error: unknown): void;` |
| `onEntryError` | `onEntryError(fn: (key: string, registration: StoredEntry \| StoredFactory, error: unknown, info: { abdicated: boolean; }) => void): () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotMap {}

export interface LocaleNamespaceMap {}

export interface SlotEntryDef {
  kind: SlotKind
  scope: SlotScope

  inline?: true
  owner?: object

  keyProps?: Record<string, object>

  hookContext?: unknown

  inject?: object
}

export type SlotSpec<E extends SlotEntryDef> = {
  kind: E['kind']
  scope: E['scope']

  inline?: true
} & ('inject' extends keyof E
  ? E extends { inject: infer Injected extends object }
    ? { inject: Injected }
    : { inject?: object }
  : { inject?: never })

export type ChildrenDecl = { [P in keyof SlotMap & string]?: SlotSpec<SlotMap[P]> }

export type EntryKeyOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { kind: 'keyed'; keyProps: infer P extends object }
    ? keyof P & string
    : string

export type SlotComponent<P> = (props: P) => ReactNode

export interface RegisterFactory {
  <F extends keyof SlotFactoryMap & string>(
    options: RegisterFactoryOptions<F>,
    component: SlotComponent<FactoryComponentPropsOf<F>>,
  ): () => void
}

export interface StoredFactory {
  readonly name: string
  readonly component: unknown
  readonly scope: SlotScope
  readonly children?: Readonly<Record<string, SlotSpec<SlotEntryDef>>> | undefined
  readonly store?: StoreDecl | undefined
  readonly inject?: ((...args: never[]) => Record<string, unknown>) | undefined
  readonly locale?: string | undefined
  readonly slots?: Readonly<Record<string, { scope: SlotScope }>> | undefined

  readonly registrant?: string | undefined
}

export interface StoredEntry {
  component: unknown
  options: { key?: string; id?: string; order?: number; label?: SlotLabel; priority?: number }

  select?: ((owner: never) => unknown) | undefined

  inject?: ((...args: never[]) => Record<string, unknown>) | undefined

  children?: Readonly<Record<string, SlotSpec<SlotEntryDef>>> | undefined

  store?: StoreDecl | undefined

  locale?: string | undefined

  registrant?: string | undefined
}

export type LiveCompositionNode = LiveSlotNode | LiveFactoryNode

export interface SlotFactoryMap {}

export type SlotKind = 'single' | 'list' | 'keyed' | 'chain'

export type SlotScope = 'root' | 'session-maybe' | 'session'

export type FactoryComponentPropsOf<F extends keyof SlotFactoryMap & string> =
  FactoryInputPropsOf<F>
  & FactoryRegistrationPropsOf<F>
  & ScopeStandardProps<FactoryDefOf<F>['scope']>
  & { useFactorySlot: UseFactorySlot<F> }

export type UseFactorySlot<F extends keyof SlotFactoryMap & string> =
  <N extends FactoryLocalNameOf<F>>(
    name: N,
    fallback: FactoryLocalComponent<F, N>,
  ) => SlotComponent<FactoryLocalInputPropsOf<F, N>>

export type RegisterFactoryOptions<F extends keyof SlotFactoryMap & string> = {
  name: F
  scope: FactoryDefOf<F>['scope']
} & FactoryField<F, 'children', FactoryChildrenOf<F>>
  & FactoryField<F, 'store', FactoryStoreOf<F> | (() => FactoryStoreOf<F>)>
  & FactoryField<F, 'inject', (...args: FactoryInjectParams<F>) => FactoryInjectOf<F>>
  & FactoryField<F, 'locale', FactoryLocaleOf<F>>
  & FactoryField<F, 'slots', RuntimeFactorySlots<F>>
  & FactoryCollisionCheck<F>
  & FactoryChildrenCheck<F>

export type SlotLabel = string | (() => string)

export interface LiveSlotNode {

  type: 'slot'

  name: string

  kind: SlotKind

  scope: SlotScope

  declaredBy?: string

  occupants: LiveSlotOccupant[]

  children: LiveSlotNode[]
}

export interface LiveFactoryNode {

  type: 'factory'

  name: string

  scope: SlotScope

  registrant?: string

  children: LiveSlotNode[]
}

export type ScopeStandardProps<S extends SlotScope> =
  (S extends 'session' ? SessionStandardProps
    : S extends 'session-maybe' ? SessionMaybeStandardProps
      : object) & GlobalStandardProps

type FactoryDefOf<F extends keyof SlotFactoryMap & string> = SlotFactoryMap[F] & SlotFactoryDef

type FactoryInputPropsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { props: infer P extends object } ? P : object

type FactoryChildrenOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { children: infer D extends Record<string, unknown> } ? D : Record<never, never>

type FactoryStoreOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { store: infer H extends StoreDecl } ? HandleOf<H> : undefined

type FactoryInjectOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { inject: infer I extends object } ? I : object

type FactoryLocaleOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { locale: infer N extends keyof LocaleNamespaceMap & string } ? N : undefined

type FactoryLocalNameOf<F extends keyof SlotFactoryMap & string> = keyof FactoryLocalSlotsOf<F> & string

type FactoryLocalInputPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalDefOf<F, N> extends { props: infer P extends object } ? P : object

export type FactoryRegistrationPropsOf<F extends keyof SlotFactoryMap & string> =
  FactoryRenderPropsOf<F>
  & PropsStore<FactoryStoreOf<F>>
  & InjectFace<FactoryInjectOf<F>>
  & PropsLocale<FactoryLocaleOf<F>>
  & PropsRenderFactories

export type FactoryLocalComponent<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = SlotComponent<FactoryLocalComponentPropsOf<F, N>>

export interface PropsRenderFactories {
  renderFactorySlot: RenderFactorySlot
}

export type InjectFace<I extends object> =
  I extends { hooks: infer HS extends HooksSources }
    ? I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'hooks' | 'keyedHooks'> & PropsHooks<HS> & PropsKeyedHooks<KS>
      : Omit<I, 'hooks'> & PropsHooks<HS>
    : I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'keyedHooks'> & PropsKeyedHooks<KS>
      : I

export type FactoryInjectParams<F extends keyof SlotFactoryMap & string> =
  FactoryDefOf<F>['scope'] extends 'session'
    ? ([FactoryStoreOf<F>] extends [StoreDecl]
      ? [sessionId: SessionIdOf, actions: BoundActions<FactoryStoreOf<F>>]
      : [sessionId: SessionIdOf])
    : FactoryDefOf<F>['scope'] extends 'session-maybe'
      ? ([FactoryStoreOf<F>] extends [StoreDecl]
        ? [sessionId: SessionIdOf | undefined, actions: BoundActions<FactoryStoreOf<F>> | undefined]
        : [sessionId: SessionIdOf | undefined])
      : ([FactoryStoreOf<F>] extends [StoreDecl]
        ? [actions: BoundActions<FactoryStoreOf<F>>]
        : [])

type FactoryField<
  F extends keyof SlotFactoryMap & string,
  K extends keyof SlotFactoryDef,
  Value,
> = K extends keyof SlotFactoryMap[F] ? { [P in K]-?: Value } : { [P in K]?: never }

type RuntimeFactorySlots<F extends keyof SlotFactoryMap & string> = {
  [N in FactoryLocalNameOf<F>]: { scope: FactoryLocalDefOf<F, N>['scope'] }
}

type FactoryCollisionCheck<F extends keyof SlotFactoryMap & string> = [
  FactoryInjectCollisionKeys<F>
  | FactoryInputCollisionKeys<F>
  | FactoryLocalCollisionKeys<F>
  | FactoryRegistrationLocalScopeCollisionKeys<F>,
] extends [never]
  ? unknown
  : {
    'Factory declaration has overlapping prop ownership':
      FactoryInjectCollisionKeys<F>
      | FactoryInputCollisionKeys<F>
      | FactoryLocalCollisionKeys<F>
      | FactoryRegistrationLocalScopeCollisionKeys<F>
  }

type FactoryChildrenCheck<F extends keyof SlotFactoryMap & string> =
  [FactoryChildMismatchKeys<F>] extends [never]
    ? unknown
    : { 'Factory children must match SlotMap': FactoryChildMismatchKeys<F> }

export interface LiveSlotOccupant {

  registrant?: string

  key?: string

  id?: string

  order?: number

  priority: number

  active: boolean
}

export type PropsLocale<N> = N extends keyof LocaleNamespaceMap & string
  ? {

    t: TranslateNS<N>
  }
  : object

export interface SlotFactoryDef {
  scope: SlotScope
  props?: object
  children?: ChildrenDecl
  store?: StoreDecl
  inject?: object
  locale?: keyof LocaleNamespaceMap & string
  slots?: Record<string, FactoryLocalSlotDef>
}

export interface SessionStandardProps {}

export interface SessionMaybeStandardProps {}

export interface GlobalStandardProps {}

export type SessionIdOf = SessionStandardProps extends { sessionId: infer S } ? S : string

type FactoryLocalSlotsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { slots: infer S extends Record<string, FactoryLocalSlotDef> }
    ? S
    : Record<never, never>

type FactoryLocalDefOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalSlotsOf<F>[N] & FactoryLocalSlotDef

type FactoryRenderPropsOf<F extends keyof SlotFactoryMap & string> =
  [keyof FactoryChildrenOf<F> & keyof SlotMap & string] extends [never]
    ? object
    : PropsRenderSlots<keyof FactoryChildrenOf<F> & keyof SlotMap & string>

export type FactoryLocalComponentPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalInputPropsOf<F, N>
  & FactoryRegistrationPropsOf<F>
  & ScopeStandardProps<FactoryLocalDefOf<F, N>['scope']>

export type RenderFactorySlot = <F extends keyof SlotFactoryMap & string>(
  name: F,
  props: FactoryInputPropsOf<F>,
  options?: {
    slots?: Partial<{ [N in FactoryLocalNameOf<F>]: FactoryLocalComponent<F, N> }>
    fallback?: ReactNode
  },
) => ReactNode

export type HooksSources = Record<string, HostObservable<unknown>>

export type KeyedHooksSources = Record<string, KeyedStandardSource>

export type PropsHooks<HS extends HooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]:
  SnapshotSelectorHook<HS[N] extends HostObservable<infer T> ? T : never>
}

export type PropsKeyedHooks<HS extends KeyedHooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]: KeyedSnapshotSelectorHook<
    HS[N] extends (key: string) => HostObservable<infer T> | undefined ? T : never
  >
}

type FactoryInjectCollisionKeys<F extends keyof SlotFactoryMap & string> = Extract<
  keyof InjectFace<FactoryInjectOf<F>>,
  keyof (
    FactoryRenderPropsOf<F>
    & PropsStore<FactoryStoreOf<F>>
    & PropsLocale<FactoryLocaleOf<F>>
    & PropsRenderFactories
    & ScopeStandardProps<FactoryDefOf<F>['scope']>
    & { useFactorySlot: UseFactorySlot<F> }
  )
>

type FactoryInputCollisionKeys<F extends keyof SlotFactoryMap & string> = Extract<
  keyof FactoryInputPropsOf<F>,
  keyof (
    FactoryRegistrationPropsOf<F>
    & ScopeStandardProps<FactoryDefOf<F>['scope']>
    & { useFactorySlot: UseFactorySlot<F> }
  )
>

type FactoryLocalCollisionKeys<F extends keyof SlotFactoryMap & string> = {
  [N in FactoryLocalNameOf<F>]: Extract<
    keyof FactoryLocalInputPropsOf<F, N>,
    keyof (FactoryRegistrationPropsOf<F> & ScopeStandardProps<FactoryLocalDefOf<F, N>['scope']>)
  >
}[FactoryLocalNameOf<F>]

type FactoryRegistrationLocalScopeCollisionKeys<F extends keyof SlotFactoryMap & string> = {
  [N in FactoryLocalNameOf<F>]: Extract<
    keyof FactoryRegistrationPropsOf<F>,
    keyof ScopeStandardProps<FactoryLocalDefOf<F, N>['scope']>
  >
}[FactoryLocalNameOf<F>]

type FactoryChildMismatchKeys<F extends keyof SlotFactoryMap & string> = {
  [K in keyof FactoryChildrenOf<F>]: K extends keyof SlotMap
    ? FactoryChildrenOf<F>[K] extends SlotSpec<SlotMap[K]> ? never : K
    : K
}[keyof FactoryChildrenOf<F>]

export type TranslateNS<N extends keyof LocaleNamespaceMap & string> = Translate<LocaleKeysOf<N>>

export interface FactoryLocalSlotDef {
  scope: SlotScope
  props?: object
}

export type PropsRenderSlots<S extends keyof SlotMap & string> = {

  renderSlot: RenderSlotFn<Exclude<S, ChainKeysOf<S>>>
  readonly __renders?: ((key: S) => void) | undefined
} & ([ChainKeysOf<S>] extends [never] ? object : {

  renderSlotChain: <K extends ChainKeysOf<S>>(key: K, owner: OwnerOf<K>, opts?: ChainRenderOpts) => ReactNode
}) & ([Extract<ScopeOf<S>, 'session' | 'session-maybe'>] extends [never]
  ? object
  : { SessionProvider: SessionProviderComponent })

export type KeyedSnapshotSelectorHook<Snapshot> = {

  (key: string): Snapshot | undefined

  <Selected>(
    key: string,
    selector: (value: Snapshot | undefined) => Selected,
    equal?: (left: Selected, right: Selected) => boolean,
  ): Selected
}

export type Translate<K extends string = string> =
  (key: K, params?: Record<string, unknown>) => string

export type LocaleKeysOf<N extends keyof LocaleNamespaceMap & string> =
  (LocaleNamespaceMap[N] & string) | CommonKeyOf

export type OwnerOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { owner: infer O extends object } ? O : object

export type ScopeOf<K extends keyof SlotMap & string> = SlotMap[K]['scope']

export interface ChainRenderOpts {

  fallback?: ReactNode

  fallbackOnly?: boolean

  overlay?: boolean
}

export type ChainKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S]['kind'] extends 'chain' ? S : never) : never

type RenderSlotFn<S extends keyof SlotMap & string> =
  ([ContextualKeysOf<S>] extends [never] ? object : {
    <
      K extends ContextualKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts: RenderOpts<EntryKey> & { hookContext: HookContextOf<K> },
    ): ReactNode
  }) &
  ([OrdinaryKeysOf<S>] extends [never] ? object : {
    <
      K extends OrdinaryKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts?: Omit<RenderOpts<EntryKey>, 'hookContext'>,
    ): ReactNode
  })

export type SessionProviderComponent = (props: SessionAreaProps) => ReactNode
```

## SlotEntryDef root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotEntryDef`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SlotEntryDef {
    kind: SlotKind;
    scope: SlotScope;
    inline?: true;
    owner?: object;
    keyProps?: Record<string, object>;
    hookContext?: unknown;
    inject?: object;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `kind: SlotKind;` |
| `scope` | `scope: SlotScope;` |
| `inline` | `inline?: true;` |
| `owner` | `owner?: object;` |
| `keyProps` | `keyProps?: Record<string, object>;` |
| `hookContext` | `hookContext?: unknown;` |
| `inject` | `inject?: object;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SlotKind = 'single' | 'list' | 'keyed' | 'chain'

export type SlotScope = 'root' | 'session-maybe' | 'session'
```

## SlotFactoryDef root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotFactoryDef`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SlotFactoryDef {
    scope: SlotScope;
    props?: object;
    children?: ChildrenDecl;
    store?: StoreDecl;
    inject?: object;
    locale?: keyof LocaleNamespaceMap & string;
    slots?: Record<string, FactoryLocalSlotDef>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `scope` | `scope: SlotScope;` |
| `props` | `props?: object;` |
| `children` | `children?: ChildrenDecl;` |
| `store` | `store?: StoreDecl;` |
| `inject` | `inject?: object;` |
| `locale` | `locale?: keyof LocaleNamespaceMap & string;` |
| `slots` | `slots?: Record<string, FactoryLocalSlotDef>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface LocaleNamespaceMap {}

export type SlotScope = 'root' | 'session-maybe' | 'session'

export interface FactoryLocalSlotDef {
  scope: SlotScope
  props?: object
}

export type ChildrenDecl = { [P in keyof SlotMap & string]?: SlotSpec<SlotMap[P]> }

export interface SlotMap {}

export type SlotSpec<E extends SlotEntryDef> = {
  kind: E['kind']
  scope: E['scope']

  inline?: true
} & ('inject' extends keyof E
  ? E extends { inject: infer Injected extends object }
    ? { inject: Injected }
    : { inject?: object }
  : { inject?: never })

export interface SlotEntryDef {
  kind: SlotKind
  scope: SlotScope

  inline?: true
  owner?: object

  keyProps?: Record<string, object>

  hookContext?: unknown

  inject?: object
}

export type SlotKind = 'single' | 'list' | 'keyed' | 'chain'
```

## SlotFactoryMap root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotFactoryMap`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SlotFactoryMap {
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## SlotHookFactory root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotHookFactory`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SlotHookFactory<K extends keyof SlotMap & string, Hook extends (...args: never[]) => unknown> = (standard: StandardPropsOf<K>, hookContext: HookContextOf<K>) => Hook;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotMap {}

export type HookContextOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { hookContext: infer Context } ? Context : never

export type StandardPropsOf<K extends keyof SlotMap & string> =
  (ScopeOf<K> extends 'session' ? SessionStandardProps
    : ScopeOf<K> extends 'session-maybe' ? SessionMaybeStandardProps
      : object) &
  GlobalStandardProps

export type ScopeOf<K extends keyof SlotMap & string> = SlotMap[K]['scope']

export interface SessionStandardProps {}

export interface SessionMaybeStandardProps {}

export interface GlobalStandardProps {}
```

## SlotInjectFace root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotInjectFace`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SlotInjectFace<I extends object> = I extends {
    hooks: infer HS extends object;
} ? Omit<I, 'hooks'> & PropsSlotHooks<HS> : I;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type PropsSlotHooks<HS extends object> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]:
  BoundHookOf<HS[N]>
}

type BoundHookOf<Definition> =
  Definition extends HostObservable<infer Snapshot>
    ? SnapshotSelectorHook<Snapshot>
    : Definition extends (...args: never[]) => infer Hook
      ? Hook extends (...args: never[]) => unknown ? Hook : never
      : never
```

## SlotInjectOf root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotInjectOf`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SlotInjectOf<K extends keyof SlotMap & string> = SlotMap[K] extends {
    inject: infer Injected extends object;
} ? Injected : object;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotMap {}
```

## SlotKind root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotKind`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SlotKind = 'single' | 'list' | 'keyed' | 'chain';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## SlotLabel root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotLabel`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SlotLabel = string | (() => string);
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## SlotMap root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotMap`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

同名接口还包含声明合并：以下后续声明分别来自 `@deepseek-ai/dsh-client-ui-slots`、`@deepseek-ai/dsh-client-ui-settings`、`@deepseek-ai/dsh-client-ui-approval`、`@deepseek-ai/dsh-client-ui-conversation`、`@deepseek-ai/dsh-client-ui-chat`、`@deepseek-ai/dsh-client-ui-layout`、`@deepseek-ai/dsh-client-ui-model-selection`、`@deepseek-ai/dsh-client-ui-plugin-manager`、`@deepseek-ai/dsh-client-ui-renderer`、`@deepseek-ai/dsh-client-ui-settings-models`、`@deepseek-ai/dsh-client-ui-sidebar-right`、`@deepseek-ai/dsh-client-ui-sidebar-documentpreview`、`@deepseek-ai/dsh-client-ui-sidebar-files`、`@deepseek-ai/dsh-client-ui-sidebar`、`@deepseek-ai/dsh-client-ui-tool`、`@deepseek-ai/dsh-client-ui-trajectory`、`@deepseek-ai/dsh-client-ui-user-questions`、`@deepseek-ai/dsh-client-ui-workspace`。只有消费编译面实际导入相应包声明时，这些字段才加入类型；运行时还须由相应包声明 slot 或提供业务数据。不能由类型合并推定这些能力已在当前 Profile 挂载。

```text
export interface SlotMap {
}

interface SlotMap {
    'settings.launcher': {
        kind: 'single';
        scope: 'root';
        owner: SettingsLauncherOwnerProps;
    };
    'settings.trigger': {
        kind: 'single';
        scope: 'root';
        owner: SettingsTriggerOwnerProps;
    };
    'settings.header': {
        kind: 'single';
        scope: 'root';
        owner: SettingsHeaderOwnerProps;
    };
    'settings.action': {
        kind: 'list';
        scope: 'root';
        owner: SettingsHeaderOwnerProps;
    };
    'settings.close': {
        kind: 'single';
        scope: 'root';
        owner: SettingsHeaderOwnerProps;
    };
    'settings.section': {
        kind: 'list';
        scope: 'root';
        owner: SettingsSectionOwnerProps;
    };
    'settings.plugins.tab': {
        kind: 'list';
        scope: 'root';
        owner: SettingsPluginsTabOwnerProps;
    };
    'settings.onboarding': {
        kind: 'list';
        scope: 'root';
        owner: SettingsOnboardingOwnerProps;
    };
    'settings.general.item': {
        kind: 'list';
        scope: 'root';
        owner: SettingsGeneralItemOwnerProps;
    };
}

interface SlotMap {
    'conversation.approval.detail': {
        kind: 'single';
        scope: 'session';
        owner: ApprovalDetailOwnerProps;
    };
}

interface SlotMap {
    'conversation.user.text.node': {
        kind: 'keyed';
        scope: 'session';
        inline: true;
        owner: UserTextNodeOwnerProps;
        keyProps: {
            [Id in UserTextId]: {
                node: UserTextNode<Id>;
            };
        };
    };
    'main.conversation': {
        kind: 'single';
        scope: 'session-maybe';
    };
    'conversation.session': {
        kind: 'single';
        scope: 'session';
        owner: {
            view?: string;
        };
    };
    'conversation.header': {
        kind: 'single';
        scope: 'session-maybe';
    };
    'conversation.session.header': {
        kind: 'single';
        scope: 'session';
        owner: {
            hideChrome: boolean;
        };
    };
    'conversation.session.header.lineage': {
        kind: 'single';
        scope: 'session';
        owner: ConversationHeaderLineageOwnerProps;
    };
    'conversation.session.header.actions': {
        kind: 'list';
        scope: 'session';
        owner: ConversationHeaderActionOwnerProps;
    };
    'conversation.session.header.utilities': {
        kind: 'list';
        scope: 'session';
        owner: ConversationHeaderActionOwnerProps;
    };
    'conversation.header.leading': {
        kind: 'single';
        scope: 'root';
        owner: ConversationHeaderLeadingOwnerProps;
    };
    'conversation.session.header.corner': {
        kind: 'single';
        scope: 'session';
        owner: ConversationHeaderCornerOwnerProps;
    };
    'conversation.session.header.views.actions': {
        kind: 'list';
        scope: 'root';
        owner: ConversationViewActionsOwnerProps;
    };
    'conversation.view': {
        kind: 'list';
        scope: 'session';
        owner: ConvViewOwnerProps;
    };
    'conversation.composer': {
        kind: 'chain';
        scope: 'session';
        owner: ComposerChainProps;
    };
    'conversation.hero.workspace': {
        kind: 'single';
        scope: 'root';
        owner: EmptyWorkspaceOwnerProps;
    };
    'conversation.hero.brand.mark': {
        kind: 'single';
        scope: 'root';
        owner: HeroBrandMarkOwnerProps;
    };
    'conversation.hero.agentPreset': {
        kind: 'single';
        scope: 'session-maybe';
        owner: HeroAgentPresetOwnerProps;
    };
    'conversation.hero.options': {
        kind: 'list';
        scope: 'session';
    };
    'conversation.input.dock': {
        kind: 'list';
        scope: 'session';
        owner: InputZone;
    };
    'conversation.input.overlay': {
        kind: 'list';
        scope: 'session';
    };
    'conversation.composer.dock': {
        kind: 'list';
        scope: 'session';
    };
    'conversation.input.left': {
        kind: 'list';
        scope: 'session';
    };
    'conversation.input.right': {
        kind: 'list';
        scope: 'session';
    };
    'conversation.input.activity': {
        kind: 'single';
        scope: 'session';
        owner: InputActivityOwnerProps;
    };
    'conversation.composer.bar': {
        kind: 'single';
        scope: 'session-maybe';
        owner: ComposerBarOwnerProps;
    };
    'conversation.input.attachments': {
        kind: 'single';
        scope: 'session-maybe';
        owner: ComposerAttachmentsOwnerProps;
    };
    'conversation.input.plan': {
        kind: 'single';
        scope: 'session';
        owner: InputControlOwnerProps;
    };
    'conversation.input.permission': {
        kind: 'single';
        scope: 'session';
        owner: InputControlOwnerProps;
    };
    'conversation.input.model': {
        kind: 'single';
        scope: 'session';
        owner: InputControlOwnerProps;
    };
}

interface SlotMap {
    'conversation.chat.flow': {
        kind: 'single';
        scope: 'session';
        owner: ChatFlowOwnerProps;
        hookContext: ChatFlowHookContext;
        inject: ChatFlowInjected;
    };
    'conversation.chat.node': {
        kind: 'keyed';
        scope: 'session';
        owner: ChatNodeOwnerProps;
        keyProps: {
            [Kind in ChatNodeKind]: {
                node: ChatNode<Kind>;
            };
        };
        hookContext: ChatNodeHookContext;
        inject: ChatNodeInjected;
    };
    'conversation.chat.message.images': {
        kind: 'single';
        scope: 'session';
        owner: MessageImagesOwnerProps;
    };
    'conversation.chat.user.images': {
        kind: 'single';
        scope: 'session';
        owner: MessageImagesOwnerProps;
    };
    'conversation.chat.commandview': {
        kind: 'keyed';
        scope: 'session';
        owner: CommandRowOwnerProps;
    };
    'conversation.chat.reasoning.body': {
        kind: 'single';
        scope: 'session';
        owner: ReasoningBodyOwnerProps;
    };
    'conversation.chat.turnTail': {
        kind: 'list';
        scope: 'session';
        owner: TurnTailOwnerProps;
    };
    'conversation.chat.assistant-actions': {
        kind: 'list';
        scope: 'session';
        owner: AssistantActionOwnerProps;
    };
    'shell.quota-notice': {
        kind: 'chain';
        scope: 'root';
        owner: QuotaNoticeOwnerProps;
    };
}

interface SlotMap {
    'sidebar': {
        kind: 'single';
        scope: 'root';
        owner: SidebarOwnerProps;
    };
    'main': {
        kind: 'keyed';
        scope: 'root';
    };
    'rightbar': {
        kind: 'single';
        scope: 'root';
        owner: RightbarOwnerProps;
    };
    'shell.bottom': {
        kind: 'single';
        scope: 'root';
    };
    'shell.overlay': {
        kind: 'list';
        scope: 'root';
    };
    'shell.leading': {
        kind: 'single';
        scope: 'root';
    };
}

interface SlotMap {
    'conversation.input.model.label': {
        kind: 'single';
        scope: 'session';
        inline: true;
        owner: ModelLabelOwner;
    };
}

interface SlotMap {
    'plugins.add.actions': {
        kind: 'list';
        scope: 'root';
        owner: PluginAddActionsProps;
    };
    'plugins.tab': {
        kind: 'list';
        scope: 'root';
        owner: PluginTabProps;
    };
    'plugins.bundle.activation': {
        kind: 'keyed';
        scope: 'root';
        owner: PluginActivationOwnerProps;
    };
    'plugins.item': {
        kind: 'list';
        scope: 'root';
        owner: PluginConfigViewProps;
    };
    'plugins.bundle.config': {
        kind: 'keyed';
        scope: 'root';
        owner: PluginConfigViewProps;
    };
    'plugins.row.config': {
        kind: 'keyed';
        scope: 'root';
        owner: PluginConfigViewProps;
    };
    'plugins.detail.actions': {
        kind: 'list';
        scope: 'root';
        owner: PluginDetailProps;
    };
    'plugins.detail.badge': {
        kind: 'list';
        scope: 'root';
        owner: PluginDetailProps;
    };
    'plugins.detail.section': {
        kind: 'list';
        scope: 'root';
        owner: PluginDetailProps;
    };
}

interface SlotMap {
    'root': {
        kind: 'single';
        scope: 'root';
        owner: RootOwnerProps;
    };
}

interface SlotMap {
    'settings.models.provider-card': {
        kind: 'keyed';
        scope: 'root';
        owner: ProviderCardExtrasOwnerProps;
    };
    'settings.models.sign-in': {
        kind: 'single';
        scope: 'root';
        owner: {
            complete: () => void;
            useApiKey: () => void;
        };
    };
    'settings.models.footer': {
        kind: 'list';
        scope: 'root';
        owner: ModelsFooterOwnerProps;
    };
}

interface SlotMap {
    'rightbar.session': {
        kind: 'single';
        scope: 'session';
        owner: RightbarOwnerProps & {
            readonly active: boolean;
            readonly retainTab: (tabId: TabId, signal: AbortSignal) => () => void;
        };
    };
    'sidebar.right.pane.tab': {
        kind: 'keyed';
        scope: 'session';
        hookContext: TabHookContext;
        inject: SidebarRightTabInjected;
    };
    'sidebar.right.pane.tab.title': {
        kind: 'keyed';
        scope: 'session';
        hookContext: TabHookContext;
        inject: SidebarRightTabInjected;
    };
    'sidebar.right.tab.guide': {
        kind: 'chain';
        scope: 'session';
        hookContext: UseSidebarRightTabInfo;
        inject: {
            hooks: {
                tabInfo: SlotHookFactory<'sidebar.right.tab.guide', UseSidebarRightTabInfo>;
            };
        };
    };
    'sidebar.right.tab.guide.actions': {
        kind: 'list';
        scope: 'root';
        owner: SidebarRightGuideActionsOwnerProps;
    };
    'sidebar.right.tab.guide.entry': {
        kind: 'keyed';
        scope: 'session';
        owner: SidebarRightGuideEntryOwnerProps;
        hookContext: UseSidebarRightTabInfo;
        inject: {
            hooks: {
                tabInfo: SlotHookFactory<'sidebar.right.tab.guide.entry', UseSidebarRightTabInfo>;
            };
        };
    };
    'sidebar.right.tab.menu.item': {
        kind: 'list';
        scope: 'session';
        owner: SidebarRightTabMenuOwnerProps;
    };
}

interface SlotMap {
    'sidebar.right.tab.document': {
        kind: 'keyed';
        scope: 'session';
        owner: DocumentBodyOwner;
        hookContext: UseSidebarRightTabInfo;
        inject: {
            hooks: {
                tabInfo: SlotHookFactory<'sidebar.right.tab.document', UseSidebarRightTabInfo>;
            };
        };
    };
    'sidebar.right.tab.document.actions': {
        kind: 'list';
        scope: 'session';
        owner: {
            readonly absolutePath: string;
        };
    };
    'sidebar.right.tab.document.unpreviewable': {
        kind: 'list';
        scope: 'session';
        owner: {
            readonly absolutePath: string;
        };
    };
    'sidebar.right.tab.document.action': {
        kind: 'keyed';
        scope: 'session';
        owner: {
            readonly content: DocumentContent;
        };
        hookContext: UseSidebarRightTabInfo;
        inject: {
            hooks: {
                tabInfo: SlotHookFactory<'sidebar.right.tab.document', UseSidebarRightTabInfo>;
            };
        };
    };
}

interface SlotMap {
    'sidebar.right.tab.files.actions': {
        kind: 'list';
        scope: 'session';
        owner: {
            readonly absolutePath: string;
        };
    };
}

interface SlotMap {
    'sidebar.toggle.badge': {
        kind: 'single';
        scope: 'root';
        owner: Record<never, never>;
    };
    'sidebar.brand.mark': {
        kind: 'single';
        scope: 'root';
        owner: SidebarBrandMarkOwnerProps;
    };
    'sidebar.brand.name': {
        kind: 'single';
        scope: 'root';
        owner: SidebarBrandNameOwnerProps;
    };
    'sidebar.panellist': {
        kind: 'list';
        scope: 'root';
        owner: SidebarPanelIconOwnerProps;
    };
    'sidebar.panellist.actions': {
        kind: 'list';
        scope: 'root';
        owner: SidebarPanelActionsOwnerProps;
    };
    'sidebar.workspaces': {
        kind: 'single';
        scope: 'root';
        owner: SidebarSectionOwnerProps;
    };
    'sidebar.settings': {
        kind: 'single';
        scope: 'root';
        owner: SidebarSettingsOwnerProps;
    };
    'sidebar.footer.action': {
        kind: 'list';
        scope: 'root';
        owner: SidebarFooterActionOwnerProps;
    };
}

interface SlotMap {
    'tool.call.toolview': {
        kind: 'keyed';
        scope: 'session';
        owner: ToolCallOwnerProps;
    };
    'tool.call.images': {
        kind: 'single';
        scope: 'session';
        owner: ToolImagesOwnerProps;
    };
}

interface SlotMap {
    'conversation.trajectory.images': {
        kind: 'single';
        scope: 'session';
        owner: MessageImagesOwnerProps;
    };
}

interface SlotMap {
    'conversation.plan-review.actions': {
        kind: 'list';
        scope: 'session';
        owner: {
            review: PlanReview;
            requestKey: PendingQuestion['key'];
        };
    };
}

interface SlotMap {
    'conversation.hero.workspace.directoryFlow': {
        kind: 'single';
        scope: 'root';
        owner: DirectoryFlowOwnerProps;
    };
    'sidebar.workspaces.directoryFlow': {
        kind: 'single';
        scope: 'root';
        owner: DirectoryFlowOwnerProps;
    };
    'sidebar.session.row.leading': {
        kind: 'list';
        scope: 'root';
        owner: SessionRowScheduleOwnerProps;
    };
    'sidebar.session.row.hover': {
        kind: 'list';
        scope: 'root';
        owner: SessionRowScheduleOwnerProps;
    };
    'sidebar.workspaces.session.menu.item': {
        kind: 'list';
        scope: 'root';
        owner: SessionRowOwnerProps;
        hookContext: MenuOpenState;
        inject: {
            hooks: {
                menuOpenState: SlotHookFactory<'sidebar.workspaces.session.menu.item', UseMenuOpenState>;
                shortcuts: HostObservable<readonly ShortcutCatalogEntry[]>;
            };
        };
    };
    'sidebar.workspaces.session.row.action': {
        kind: 'list';
        scope: 'root';
        owner: SessionRowOwnerProps;
    };
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## SlotScope root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotScope`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SlotScope = 'root' | 'session-maybe' | 'session';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## SlotScopeTargetMap root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotScopeTargetMap`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SlotScopeTargetMap {
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## SlotSpec root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotSpec`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SlotSpec<E extends SlotEntryDef> = {
    kind: E['kind'];
    scope: E['scope'];
    inline?: true;
} & ('inject' extends keyof E ? E extends {
    inject: infer Injected extends object;
} ? {
    inject: Injected;
} : {
    inject?: object;
} : {
    inject?: never;
});
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotEntryDef {
  kind: SlotKind
  scope: SlotScope

  inline?: true
  owner?: object

  keyProps?: Record<string, object>

  hookContext?: unknown

  inject?: object
}

export type SlotKind = 'single' | 'list' | 'keyed' | 'chain'

export type SlotScope = 'root' | 'session-maybe' | 'session'
```

## StandardPropsOf root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `StandardPropsOf`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type StandardPropsOf<K extends keyof SlotMap & string> = (ScopeOf<K> extends 'session' ? SessionStandardProps : ScopeOf<K> extends 'session-maybe' ? SessionMaybeStandardProps : object) & GlobalStandardProps;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotMap {}

export type ScopeOf<K extends keyof SlotMap & string> = SlotMap[K]['scope']

export interface SessionStandardProps {}

export interface SessionMaybeStandardProps {}

export interface GlobalStandardProps {}
```

## StoredEntry root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `StoredEntry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface StoredEntry {
    component: unknown;
    options: {
        key?: string;
        id?: string;
        order?: number;
        label?: SlotLabel;
        priority?: number;
    };
    select?: ((owner: never) => unknown) | undefined;
    inject?: ((...args: never[]) => Record<string, unknown>) | undefined;
    children?: Readonly<Record<string, SlotSpec<SlotEntryDef>>> | undefined;
    store?: StoreDecl | undefined;
    locale?: string | undefined;
    registrant?: string | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `component` | `component: unknown;` |
| `options` | `options: { key?: string; id?: string; order?: number; label?: SlotLabel; priority?: number; };` |
| `select` | `select?: ((owner: never) => unknown) \| undefined;` |
| `inject` | `inject?: ((...args: never[]) => Record<string, unknown>) \| undefined;` |
| `children` | `children?: Readonly<Record<string, SlotSpec<SlotEntryDef>>> \| undefined;` |
| `store` | `store?: StoreDecl \| undefined;` |
| `locale` | `locale?: string \| undefined;` |
| `registrant` | `registrant?: string \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotEntryDef {
  kind: SlotKind
  scope: SlotScope

  inline?: true
  owner?: object

  keyProps?: Record<string, object>

  hookContext?: unknown

  inject?: object
}

export type SlotSpec<E extends SlotEntryDef> = {
  kind: E['kind']
  scope: E['scope']

  inline?: true
} & ('inject' extends keyof E
  ? E extends { inject: infer Injected extends object }
    ? { inject: Injected }
    : { inject?: object }
  : { inject?: never })

export type SlotLabel = string | (() => string)

export type SlotKind = 'single' | 'list' | 'keyed' | 'chain'

export type SlotScope = 'root' | 'session-maybe' | 'session'
```

## StoredFactory root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `StoredFactory`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface StoredFactory {
    readonly name: string;
    readonly component: unknown;
    readonly scope: SlotScope;
    readonly children?: Readonly<Record<string, SlotSpec<SlotEntryDef>>> | undefined;
    readonly store?: StoreDecl | undefined;
    readonly inject?: ((...args: never[]) => Record<string, unknown>) | undefined;
    readonly locale?: string | undefined;
    readonly slots?: Readonly<Record<string, {
        scope: SlotScope;
    }>> | undefined;
    readonly registrant?: string | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `name` | `readonly name: string;` |
| `component` | `readonly component: unknown;` |
| `scope` | `readonly scope: SlotScope;` |
| `children` | `readonly children?: Readonly<Record<string, SlotSpec<SlotEntryDef>>> \| undefined;` |
| `store` | `readonly store?: StoreDecl \| undefined;` |
| `inject` | `readonly inject?: ((...args: never[]) => Record<string, unknown>) \| undefined;` |
| `locale` | `readonly locale?: string \| undefined;` |
| `slots` | `readonly slots?: Readonly<Record<string, { scope: SlotScope; }>> \| undefined;` |
| `registrant` | `readonly registrant?: string \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SlotScope = 'root' | 'session-maybe' | 'session'

export interface SlotEntryDef {
  kind: SlotKind
  scope: SlotScope

  inline?: true
  owner?: object

  keyProps?: Record<string, object>

  hookContext?: unknown

  inject?: object
}

export type SlotSpec<E extends SlotEntryDef> = {
  kind: E['kind']
  scope: E['scope']

  inline?: true
} & ('inject' extends keyof E
  ? E extends { inject: infer Injected extends object }
    ? { inject: Injected }
    : { inject?: object }
  : { inject?: never })

export type SlotKind = 'single' | 'list' | 'keyed' | 'chain'
```

## Translate root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `Translate`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type Translate<K extends string = string> = (key: K, params?: Record<string, unknown>) => string;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## TranslateNS root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `TranslateNS`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type TranslateNS<N extends keyof LocaleNamespaceMap & string> = Translate<LocaleKeysOf<N>>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface LocaleNamespaceMap {}

export type Translate<K extends string = string> =
  (key: K, params?: Record<string, unknown>) => string

export type LocaleKeysOf<N extends keyof LocaleNamespaceMap & string> =
  (LocaleNamespaceMap[N] & string) | CommonKeyOf

export type CommonKeyOf = LocaleNamespaceMap extends { common: infer C } ? C & string : never
```

## UseFactorySlot root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `UseFactorySlot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UseFactorySlot<F extends keyof SlotFactoryMap & string> = <N extends FactoryLocalNameOf<F>>(name: N, fallback: FactoryLocalComponent<F, N>) => SlotComponent<FactoryLocalInputPropsOf<F, N>>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotFactoryMap {}

export type SlotComponent<P> = (props: P) => ReactNode

type FactoryLocalNameOf<F extends keyof SlotFactoryMap & string> = keyof FactoryLocalSlotsOf<F> & string

type FactoryLocalInputPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalDefOf<F, N> extends { props: infer P extends object } ? P : object

export type FactoryLocalComponent<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = SlotComponent<FactoryLocalComponentPropsOf<F, N>>

type FactoryLocalSlotsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { slots: infer S extends Record<string, FactoryLocalSlotDef> }
    ? S
    : Record<never, never>

type FactoryLocalDefOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalSlotsOf<F>[N] & FactoryLocalSlotDef

export type FactoryLocalComponentPropsOf<
  F extends keyof SlotFactoryMap & string,
  N extends FactoryLocalNameOf<F>,
> = FactoryLocalInputPropsOf<F, N>
  & FactoryRegistrationPropsOf<F>
  & ScopeStandardProps<FactoryLocalDefOf<F, N>['scope']>

export interface FactoryLocalSlotDef {
  scope: SlotScope
  props?: object
}

export type ScopeStandardProps<S extends SlotScope> =
  (S extends 'session' ? SessionStandardProps
    : S extends 'session-maybe' ? SessionMaybeStandardProps
      : object) & GlobalStandardProps

export type FactoryRegistrationPropsOf<F extends keyof SlotFactoryMap & string> =
  FactoryRenderPropsOf<F>
  & PropsStore<FactoryStoreOf<F>>
  & InjectFace<FactoryInjectOf<F>>
  & PropsLocale<FactoryLocaleOf<F>>
  & PropsRenderFactories

export interface PropsRenderFactories {
  renderFactorySlot: RenderFactorySlot
}

export type InjectFace<I extends object> =
  I extends { hooks: infer HS extends HooksSources }
    ? I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'hooks' | 'keyedHooks'> & PropsHooks<HS> & PropsKeyedHooks<KS>
      : Omit<I, 'hooks'> & PropsHooks<HS>
    : I extends { keyedHooks: infer KS extends KeyedHooksSources }
      ? Omit<I, 'keyedHooks'> & PropsKeyedHooks<KS>
      : I

export type PropsLocale<N> = N extends keyof LocaleNamespaceMap & string
  ? {

    t: TranslateNS<N>
  }
  : object

export type SlotScope = 'root' | 'session-maybe' | 'session'

export interface SessionStandardProps {}

export interface SessionMaybeStandardProps {}

export interface GlobalStandardProps {}

type FactoryStoreOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { store: infer H extends StoreDecl } ? HandleOf<H> : undefined

type FactoryInjectOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { inject: infer I extends object } ? I : object

type FactoryLocaleOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { locale: infer N extends keyof LocaleNamespaceMap & string } ? N : undefined

type FactoryRenderPropsOf<F extends keyof SlotFactoryMap & string> =
  [keyof FactoryChildrenOf<F> & keyof SlotMap & string] extends [never]
    ? object
    : PropsRenderSlots<keyof FactoryChildrenOf<F> & keyof SlotMap & string>

export type RenderFactorySlot = <F extends keyof SlotFactoryMap & string>(
  name: F,
  props: FactoryInputPropsOf<F>,
  options?: {
    slots?: Partial<{ [N in FactoryLocalNameOf<F>]: FactoryLocalComponent<F, N> }>
    fallback?: ReactNode
  },
) => ReactNode

export type HooksSources = Record<string, HostObservable<unknown>>

export type KeyedHooksSources = Record<string, KeyedStandardSource>

export type PropsHooks<HS extends HooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]:
  SnapshotSelectorHook<HS[N] extends HostObservable<infer T> ? T : never>
}

export type PropsKeyedHooks<HS extends KeyedHooksSources> = {
  [N in keyof HS & string as `use${Capitalize<N>}`]: KeyedSnapshotSelectorHook<
    HS[N] extends (key: string) => HostObservable<infer T> | undefined ? T : never
  >
}

export interface SlotMap {}

export interface LocaleNamespaceMap {}

export type TranslateNS<N extends keyof LocaleNamespaceMap & string> = Translate<LocaleKeysOf<N>>

export type PropsRenderSlots<S extends keyof SlotMap & string> = {

  renderSlot: RenderSlotFn<Exclude<S, ChainKeysOf<S>>>
  readonly __renders?: ((key: S) => void) | undefined
} & ([ChainKeysOf<S>] extends [never] ? object : {

  renderSlotChain: <K extends ChainKeysOf<S>>(key: K, owner: OwnerOf<K>, opts?: ChainRenderOpts) => ReactNode
}) & ([Extract<ScopeOf<S>, 'session' | 'session-maybe'>] extends [never]
  ? object
  : { SessionProvider: SessionProviderComponent })

type FactoryInputPropsOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { props: infer P extends object } ? P : object

type FactoryChildrenOf<F extends keyof SlotFactoryMap & string> =
  SlotFactoryMap[F] extends { children: infer D extends Record<string, unknown> } ? D : Record<never, never>

export type KeyedSnapshotSelectorHook<Snapshot> = {

  (key: string): Snapshot | undefined

  <Selected>(
    key: string,
    selector: (value: Snapshot | undefined) => Selected,
    equal?: (left: Selected, right: Selected) => boolean,
  ): Selected
}

export type Translate<K extends string = string> =
  (key: K, params?: Record<string, unknown>) => string

export type LocaleKeysOf<N extends keyof LocaleNamespaceMap & string> =
  (LocaleNamespaceMap[N] & string) | CommonKeyOf

export type OwnerOf<K extends keyof SlotMap & string> =
  SlotMap[K] extends { owner: infer O extends object } ? O : object

export type ScopeOf<K extends keyof SlotMap & string> = SlotMap[K]['scope']

export interface ChainRenderOpts {

  fallback?: ReactNode

  fallbackOnly?: boolean

  overlay?: boolean
}

export type ChainKeysOf<S extends keyof SlotMap & string> =
  S extends unknown ? (SlotMap[S]['kind'] extends 'chain' ? S : never) : never

type RenderSlotFn<S extends keyof SlotMap & string> =
  ([ContextualKeysOf<S>] extends [never] ? object : {
    <
      K extends ContextualKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts: RenderOpts<EntryKey> & { hookContext: HookContextOf<K> },
    ): ReactNode
  }) &
  ([OrdinaryKeysOf<S>] extends [never] ? object : {
    <
      K extends OrdinaryKeysOf<S>,
      EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
    >(
      key: K,
      owner: OwnerOf<K> & KeyPropsOf<K, NoInfer<EntryKey>>,
      opts?: Omit<RenderOpts<EntryKey>, 'hookContext'>,
    ): ReactNode
  })

export type SessionProviderComponent = (props: SessionAreaProps) => ReactNode
```

## resolveSlotLabel root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `resolveSlotLabel`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function resolveSlotLabel(label: SlotLabel | undefined): string | undefined;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type SlotLabel = string | (() => string)
```
