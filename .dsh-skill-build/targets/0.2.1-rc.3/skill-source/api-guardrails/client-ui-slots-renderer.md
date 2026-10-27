# ui-slots：renderer 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

纯注册表没有 React 依赖。普通 Slots 通过 `SlotMap` 声明合并；`single` 按优先级取一个占位者，`list` 按 id 与 order 组合，`keyed` 按 key 分派，`chain` 依次调用纯 select 直到首个非 null。数字 priority 越小越先。同一单元的同一 priority 冲突、未声明的键、重复 children 声明、跨 scope 共享 Store handle 和缺少 select 的 chain 注册都会抛错。注册 disposer 递归收回 children 声明、贡献与 Store 挂载。Factory 在 `SlotFactoryMap` 声明，通过 registerFactory 安装，局部 slots 逐 occurrence 选择组件；children 仍为全局 Slots。

## HostObservable root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `HostObservable`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type HostObservable<T> = ObservableSnapshot<T>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## KeyedStandardSource root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `KeyedStandardSource`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type KeyedStandardSource = (key: string, member?: string) => HostObservable<unknown> | undefined;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type HostObservable<T> = ObservableSnapshot<T>
```

## LocaleFace root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `LocaleFace`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface LocaleFace extends HostObservable<{
    revision: number;
}> {
    bind(ns: string): Translate;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `bind` | `bind(ns: string): Translate;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type HostObservable<T> = ObservableSnapshot<T>
```

## RootStandardSourceContribution root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `RootStandardSourceContribution`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface RootStandardSourceContribution {
    readonly hooks?: Readonly<Record<string, HostObservable<unknown>>>;
    readonly keyedHooks?: Readonly<Record<string, KeyedStandardSource>>;
    readonly props?: Readonly<Record<string, unknown>>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `readonly hooks?: Readonly<Record<string, HostObservable<unknown>>>;` |
| `keyedHooks` | `readonly keyedHooks?: Readonly<Record<string, KeyedStandardSource>>;` |
| `props` | `readonly props?: Readonly<Record<string, unknown>>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type HostObservable<T> = ObservableSnapshot<T>

export type KeyedStandardSource = (key: string, member?: string) => HostObservable<unknown> | undefined
```

## ScopedStandardSourceBinding root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `ScopedStandardSourceBinding`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ScopedStandardSourceBinding extends StandardSourceBinding {
    readonly key: string;
    readonly ctx: Context;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `key` | `readonly key: string;` |
| `ctx` | `readonly ctx: Context;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type KeyedStandardSource = (key: string, member?: string) => HostObservable<unknown> | undefined

export interface StandardSourceBinding {

  readonly key: string | undefined

  readonly hooks: Readonly<Record<string, HostObservable<unknown> | undefined>>

  readonly keyedHooks: Readonly<Record<string, KeyedStandardSource | undefined>>

  readonly props: Readonly<Record<string, unknown>>
}

export type HostObservable<T> = ObservableSnapshot<T>
```

## SlotOwnershipError root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotOwnershipError`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class SlotOwnershipError extends Error {
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## SlotRenderer root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotRenderer`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SlotRenderer {
    renderRoot(host: SlotRendererHost, ownerProps: object): ReactNode;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `renderRoot` | `renderRoot(host: SlotRendererHost, ownerProps: object): ReactNode;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SlotRendererHost {

  subscribe(key: string, fn: () => void): () => void

  getVersion(key: string): number

  entriesOf(key: string): readonly StoredEntry[]

  entriesOfSlot(key: string): readonly StoredEntry[]

  reportEntryError(key: string, entry: StoredEntry, error: unknown, info: { abdicate: boolean }): void

  reportFactoryError(name: string, registration: StoredEntry | StoredFactory, error: unknown): void

  specOf(key: string): SlotSpec<SlotEntryDef> | undefined

  isLive(entry: StoredEntry): boolean

  storeOf(entry: StoredEntry, scopeBinding: ScopedStandardSourceBinding | undefined): StoreInstanceLike | undefined

  factoryStoreOf(
    definition: StoredFactory,
    scopeBinding: ScopedStandardSourceBinding | undefined,
    occurrence: object,
  ): StoreInstanceLike | undefined

  retainFactoryOccurrence(definition: StoredFactory, occurrence: object): () => void

  subscribeFactory(name: string, fn: () => void): () => void

  getFactoryVersion(name: string): number

  factoryOf(name: string): StoredFactory | undefined

  isFactoryLive(definition: StoredFactory): boolean

  readonly root: HostObservable<StandardSourceBinding>

  readonly scopeRevision: HostObservable<number>

  scope(scope: Exclude<SlotScope, 'root'>): SlotScopeAdapter | undefined

  locale?: LocaleFace | undefined
}

export interface LocaleFace extends HostObservable<{ revision: number }> {

  bind(ns: string): Translate
}

export type HostObservable<T> = ObservableSnapshot<T>

export interface StoreInstanceLike {
  getSnapshot(): unknown

  subscribe(fn: () => void): () => void
  readonly actions: Record<string, (...params: never[]) => void>
}

export interface StandardSourceBinding {

  readonly key: string | undefined

  readonly hooks: Readonly<Record<string, HostObservable<unknown> | undefined>>

  readonly keyedHooks: Readonly<Record<string, KeyedStandardSource | undefined>>

  readonly props: Readonly<Record<string, unknown>>
}

export interface ScopedStandardSourceBinding extends StandardSourceBinding {
  readonly key: string
  readonly ctx: Context
}

export interface SlotScopeAdapter {

  readonly current: HostObservable<StandardSourceBinding>

  bindingSource(target: SessionAreaProps['session']): HostObservable<StandardSourceBinding>

  renderArea?(binding: StandardSourceBinding, props: SessionAreaProps): ReactNode
}

export type KeyedStandardSource = (key: string, member?: string) => HostObservable<unknown> | undefined
```

## SlotRendererHost root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotRendererHost`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SlotRendererHost {
    subscribe(key: string, fn: () => void): () => void;
    getVersion(key: string): number;
    entriesOf(key: string): readonly StoredEntry[];
    entriesOfSlot(key: string): readonly StoredEntry[];
    reportEntryError(key: string, entry: StoredEntry, error: unknown, info: {
        abdicate: boolean;
    }): void;
    reportFactoryError(name: string, registration: StoredEntry | StoredFactory, error: unknown): void;
    specOf(key: string): SlotSpec<SlotEntryDef> | undefined;
    isLive(entry: StoredEntry): boolean;
    storeOf(entry: StoredEntry, scopeBinding: ScopedStandardSourceBinding | undefined): StoreInstanceLike | undefined;
    factoryStoreOf(definition: StoredFactory, scopeBinding: ScopedStandardSourceBinding | undefined, occurrence: object): StoreInstanceLike | undefined;
    retainFactoryOccurrence(definition: StoredFactory, occurrence: object): () => void;
    subscribeFactory(name: string, fn: () => void): () => void;
    getFactoryVersion(name: string): number;
    factoryOf(name: string): StoredFactory | undefined;
    isFactoryLive(definition: StoredFactory): boolean;
    readonly root: HostObservable<StandardSourceBinding>;
    readonly scopeRevision: HostObservable<number>;
    scope(scope: Exclude<SlotScope, 'root'>): SlotScopeAdapter | undefined;
    locale?: LocaleFace | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `subscribe` | `subscribe(key: string, fn: () => void): () => void;` |
| `getVersion` | `getVersion(key: string): number;` |
| `entriesOf` | `entriesOf(key: string): readonly StoredEntry[];` |
| `entriesOfSlot` | `entriesOfSlot(key: string): readonly StoredEntry[];` |
| `reportEntryError` | `reportEntryError(key: string, entry: StoredEntry, error: unknown, info: { abdicate: boolean; }): void;` |
| `reportFactoryError` | `reportFactoryError(name: string, registration: StoredEntry \| StoredFactory, error: unknown): void;` |
| `specOf` | `specOf(key: string): SlotSpec<SlotEntryDef> \| undefined;` |
| `isLive` | `isLive(entry: StoredEntry): boolean;` |
| `storeOf` | `storeOf(entry: StoredEntry, scopeBinding: ScopedStandardSourceBinding \| undefined): StoreInstanceLike \| undefined;` |
| `factoryStoreOf` | `factoryStoreOf(definition: StoredFactory, scopeBinding: ScopedStandardSourceBinding \| undefined, occurrence: object): StoreInstanceLike \| undefined;` |
| `retainFactoryOccurrence` | `retainFactoryOccurrence(definition: StoredFactory, occurrence: object): () => void;` |
| `subscribeFactory` | `subscribeFactory(name: string, fn: () => void): () => void;` |
| `getFactoryVersion` | `getFactoryVersion(name: string): number;` |
| `factoryOf` | `factoryOf(name: string): StoredFactory \| undefined;` |
| `isFactoryLive` | `isFactoryLive(definition: StoredFactory): boolean;` |
| `root` | `readonly root: HostObservable<StandardSourceBinding>;` |
| `scopeRevision` | `readonly scopeRevision: HostObservable<number>;` |
| `scope` | `scope(scope: Exclude<SlotScope, 'root'>): SlotScopeAdapter \| undefined;` |
| `locale` | `locale?: LocaleFace \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface LocaleFace extends HostObservable<{ revision: number }> {

  bind(ns: string): Translate
}

export type HostObservable<T> = ObservableSnapshot<T>

export interface StoreInstanceLike {
  getSnapshot(): unknown

  subscribe(fn: () => void): () => void
  readonly actions: Record<string, (...params: never[]) => void>
}

export interface StandardSourceBinding {

  readonly key: string | undefined

  readonly hooks: Readonly<Record<string, HostObservable<unknown> | undefined>>

  readonly keyedHooks: Readonly<Record<string, KeyedStandardSource | undefined>>

  readonly props: Readonly<Record<string, unknown>>
}

export interface ScopedStandardSourceBinding extends StandardSourceBinding {
  readonly key: string
  readonly ctx: Context
}

export interface SlotScopeAdapter {

  readonly current: HostObservable<StandardSourceBinding>

  bindingSource(target: SessionAreaProps['session']): HostObservable<StandardSourceBinding>

  renderArea?(binding: StandardSourceBinding, props: SessionAreaProps): ReactNode
}

export type KeyedStandardSource = (key: string, member?: string) => HostObservable<unknown> | undefined
```

## SlotScopeAdapter root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SlotScopeAdapter`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SlotScopeAdapter {
    readonly current: HostObservable<StandardSourceBinding>;
    bindingSource(target: SessionAreaProps['session']): HostObservable<StandardSourceBinding>;
    renderArea?(binding: StandardSourceBinding, props: SessionAreaProps): ReactNode;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `current` | `readonly current: HostObservable<StandardSourceBinding>;` |
| `bindingSource` | `bindingSource(target: SessionAreaProps['session']): HostObservable<StandardSourceBinding>;` |
| `renderArea` | `renderArea?(binding: StandardSourceBinding, props: SessionAreaProps): ReactNode;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type HostObservable<T> = ObservableSnapshot<T>

export interface StandardSourceBinding {

  readonly key: string | undefined

  readonly hooks: Readonly<Record<string, HostObservable<unknown> | undefined>>

  readonly keyedHooks: Readonly<Record<string, KeyedStandardSource | undefined>>

  readonly props: Readonly<Record<string, unknown>>
}

export type KeyedStandardSource = (key: string, member?: string) => HostObservable<unknown> | undefined
```

## StaleAuthorizationError root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `StaleAuthorizationError`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class StaleAuthorizationError extends Error {
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## StandardSourceBinding root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `StandardSourceBinding`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface StandardSourceBinding {
    readonly key: string | undefined;
    readonly hooks: Readonly<Record<string, HostObservable<unknown> | undefined>>;
    readonly keyedHooks: Readonly<Record<string, KeyedStandardSource | undefined>>;
    readonly props: Readonly<Record<string, unknown>>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `key` | `readonly key: string \| undefined;` |
| `hooks` | `readonly hooks: Readonly<Record<string, HostObservable<unknown> \| undefined>>;` |
| `keyedHooks` | `readonly keyedHooks: Readonly<Record<string, KeyedStandardSource \| undefined>>;` |
| `props` | `readonly props: Readonly<Record<string, unknown>>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type HostObservable<T> = ObservableSnapshot<T>

export type KeyedStandardSource = (key: string, member?: string) => HostObservable<unknown> | undefined
```

## StoreInstanceLike root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `StoreInstanceLike`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface StoreInstanceLike {
    getSnapshot(): unknown;
    subscribe(fn: () => void): () => void;
    readonly actions: Record<string, (...params: never[]) => void>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `getSnapshot` | `getSnapshot(): unknown;` |
| `subscribe` | `subscribe(fn: () => void): () => void;` |
| `actions` | `readonly actions: Record<string, (...params: never[]) => void>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## standardHookPropName root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `standardHookPropName`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function standardHookPropName(name: string): string;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。
