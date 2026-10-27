# store：contract 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

createSnapshotStore 提供裸 getSnapshot/subscribe/update/set；defineStore 将 init/persist/actions 绑定为可装入 slot 的 StoreHandle。selector hook 由 renderer 注入，而非引擎产物自带。默认同步通知；raf 是显式选择，帧内多写合并通知。persist 是 localStorage 客户端偏好，不替代 Session 模型事实；一个 handle 只能挂同一 scope，session scope 为各 Session 分开实例。

## ActionsDecl root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `ActionsDecl`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ActionsDecl<T> = Record<string, (draft: T, ...params: any[]) => void>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

## BakedActions root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `BakedActions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type BakedActions<T, A extends ActionsDecl<T>> = {
    [K in keyof A]: A[K] extends (draft: T, ...params: infer P) => void ? (...params: P) => void : never;
};
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ActionsDecl<T> = Record<string, (draft: T, ...params: any[]) => void>
```

## BoundActions root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `BoundActions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type BoundActions<H> = H extends StoreHandle<infer T, infer A> ? BakedActions<T, A> : never;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type BakedActions<T, A extends ActionsDecl<T>> = {
  [K in keyof A]: A[K] extends (draft: T, ...params: infer P) => void ? (...params: P) => void : never
}

export interface StoreHandle<T, A extends ActionsDecl<T>> {
  readonly spec: StoreSpec<T, A>

  create(scopeKey?: string): StoreInstance<T, A>
}

export type ActionsDecl<T> = Record<string, (draft: T, ...params: any[]) => void>

export interface StoreSpec<T, A extends ActionsDecl<T>> {
  init: () => T
  persist?: string
  actions: A
}

export interface StoreInstance<T, A extends ActionsDecl<T>> {
  readonly actions: BakedActions<T, A>
  getSnapshot(): T

  subscribe(fn: () => void): () => void

  clearPersisted(): void
}
```

## DefineStore root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `DefineStore`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DefineStore = <T, A extends ActionsDecl<T>>(spec: StoreSpec<T, A>) => StoreHandle<T, A>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ActionsDecl<T> = Record<string, (draft: T, ...params: any[]) => void>

export interface StoreSpec<T, A extends ActionsDecl<T>> {
  init: () => T
  persist?: string
  actions: A
}

export interface StoreHandle<T, A extends ActionsDecl<T>> {
  readonly spec: StoreSpec<T, A>

  create(scopeKey?: string): StoreInstance<T, A>
}

export interface StoreInstance<T, A extends ActionsDecl<T>> {
  readonly actions: BakedActions<T, A>
  getSnapshot(): T

  subscribe(fn: () => void): () => void

  clearPersisted(): void
}

export type BakedActions<T, A extends ActionsDecl<T>> = {
  [K in keyof A]: A[K] extends (draft: T, ...params: infer P) => void ? (...params: P) => void : never
}
```

## HandleOf root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `HandleOf`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type HandleOf<H> = H extends () => infer R ? R : H;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

## MaybeSnapshotSelectorHook root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `MaybeSnapshotSelectorHook`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type MaybeSnapshotSelectorHook<T> = <S>(sel: (s: T) => S, eq?: (a: S, b: S) => boolean) => S | undefined;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

## ObservableSnapshot root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `ObservableSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ObservableSnapshot<T> {
    getSnapshot(): T;
    subscribe(fn: () => void): () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `getSnapshot` | `getSnapshot(): T;` |
| `subscribe` | `subscribe(fn: () => void): () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

## PropsStore root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `PropsStore`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PropsStore<H> = H extends StoreHandle<infer T, infer A> ? {
    useStore: SnapshotSelectorHook<T>;
    actions: BakedActions<T, A>;
} : object;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SnapshotSelectorHook<T> = <S>(sel: (s: T) => S, eq?: (a: S, b: S) => boolean) => S

export type BakedActions<T, A extends ActionsDecl<T>> = {
  [K in keyof A]: A[K] extends (draft: T, ...params: infer P) => void ? (...params: P) => void : never
}

export interface StoreHandle<T, A extends ActionsDecl<T>> {
  readonly spec: StoreSpec<T, A>

  create(scopeKey?: string): StoreInstance<T, A>
}

export type ActionsDecl<T> = Record<string, (draft: T, ...params: any[]) => void>

export interface StoreSpec<T, A extends ActionsDecl<T>> {
  init: () => T
  persist?: string
  actions: A
}

export interface StoreInstance<T, A extends ActionsDecl<T>> {
  readonly actions: BakedActions<T, A>
  getSnapshot(): T

  subscribe(fn: () => void): () => void

  clearPersisted(): void
}
```

## SnapshotSelectorHook root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `SnapshotSelectorHook`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SnapshotSelectorHook<T> = <S>(sel: (s: T) => S, eq?: (a: S, b: S) => boolean) => S;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

## StoreDecl root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `StoreDecl`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type StoreDecl = StoreHandle<any, any> | StoreFactory;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface StoreHandle<T, A extends ActionsDecl<T>> {
  readonly spec: StoreSpec<T, A>

  create(scopeKey?: string): StoreInstance<T, A>
}

export type StoreFactory = () => StoreHandle<any, any>

export type ActionsDecl<T> = Record<string, (draft: T, ...params: any[]) => void>

export interface StoreSpec<T, A extends ActionsDecl<T>> {
  init: () => T
  persist?: string
  actions: A
}

export interface StoreInstance<T, A extends ActionsDecl<T>> {
  readonly actions: BakedActions<T, A>
  getSnapshot(): T

  subscribe(fn: () => void): () => void

  clearPersisted(): void
}

export type BakedActions<T, A extends ActionsDecl<T>> = {
  [K in keyof A]: A[K] extends (draft: T, ...params: infer P) => void ? (...params: P) => void : never
}
```

## StoreFactory root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `StoreFactory`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type StoreFactory = () => StoreHandle<any, any>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface StoreHandle<T, A extends ActionsDecl<T>> {
  readonly spec: StoreSpec<T, A>

  create(scopeKey?: string): StoreInstance<T, A>
}

export type ActionsDecl<T> = Record<string, (draft: T, ...params: any[]) => void>

export interface StoreSpec<T, A extends ActionsDecl<T>> {
  init: () => T
  persist?: string
  actions: A
}

export interface StoreInstance<T, A extends ActionsDecl<T>> {
  readonly actions: BakedActions<T, A>
  getSnapshot(): T

  subscribe(fn: () => void): () => void

  clearPersisted(): void
}

export type BakedActions<T, A extends ActionsDecl<T>> = {
  [K in keyof A]: A[K] extends (draft: T, ...params: infer P) => void ? (...params: P) => void : never
}
```

## StoreHandle root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `StoreHandle`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface StoreHandle<T, A extends ActionsDecl<T>> {
    readonly spec: StoreSpec<T, A>;
    create(scopeKey?: string): StoreInstance<T, A>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `spec` | `readonly spec: StoreSpec<T, A>;` |
| `create` | `create(scopeKey?: string): StoreInstance<T, A>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ActionsDecl<T> = Record<string, (draft: T, ...params: any[]) => void>

export interface StoreSpec<T, A extends ActionsDecl<T>> {
  init: () => T
  persist?: string
  actions: A
}

export interface StoreInstance<T, A extends ActionsDecl<T>> {
  readonly actions: BakedActions<T, A>
  getSnapshot(): T

  subscribe(fn: () => void): () => void

  clearPersisted(): void
}

export type BakedActions<T, A extends ActionsDecl<T>> = {
  [K in keyof A]: A[K] extends (draft: T, ...params: infer P) => void ? (...params: P) => void : never
}
```

## StoreInstance root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `StoreInstance`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface StoreInstance<T, A extends ActionsDecl<T>> {
    readonly actions: BakedActions<T, A>;
    getSnapshot(): T;
    subscribe(fn: () => void): () => void;
    clearPersisted(): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `actions` | `readonly actions: BakedActions<T, A>;` |
| `getSnapshot` | `getSnapshot(): T;` |
| `subscribe` | `subscribe(fn: () => void): () => void;` |
| `clearPersisted` | `clearPersisted(): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ActionsDecl<T> = Record<string, (draft: T, ...params: any[]) => void>

export type BakedActions<T, A extends ActionsDecl<T>> = {
  [K in keyof A]: A[K] extends (draft: T, ...params: infer P) => void ? (...params: P) => void : never
}
```

## StoreSpec root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `StoreSpec`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface StoreSpec<T, A extends ActionsDecl<T>> {
    init: () => T;
    persist?: string;
    actions: A;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `init` | `init: () => T;` |
| `persist` | `persist?: string;` |
| `actions` | `actions: A;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type ActionsDecl<T> = Record<string, (draft: T, ...params: any[]) => void>
```
