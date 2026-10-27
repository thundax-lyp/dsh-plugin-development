# store：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

createSnapshotStore 提供裸 getSnapshot/subscribe/update/set；defineStore 将 init/persist/actions 绑定为可装入 slot 的 StoreHandle。selector hook 由 renderer 注入，而非引擎产物自带。默认同步通知；raf 是显式选择，帧内多写合并通知。persist 是 localStorage 客户端偏好，不替代 Session 模型事实；一个 handle 只能挂同一 scope，session scope 为各 Session 分开实例。

## EngineStoreHandle root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `EngineStoreHandle`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface EngineStoreHandle<T, A extends ActionsDecl<T>> extends StoreHandle<T, A> {
    create(scopeKey?: string): EngineStoreInstance<T, A>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `create` | `create(scopeKey?: string): EngineStoreInstance<T, A>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface EngineStoreInstance<T, A extends ActionsDecl<T>> extends StoreInstance<T, A> {

  readonly store: SnapshotStore<T>
}

export interface SnapshotStore<T> extends ObservableSnapshot<T> {

  update(mutator: (draft: T) => void): void

  set(next: T): void
}
```

## EngineStoreInstance root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `EngineStoreInstance`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface EngineStoreInstance<T, A extends ActionsDecl<T>> extends StoreInstance<T, A> {
    readonly store: SnapshotStore<T>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `store` | `readonly store: SnapshotStore<T>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SnapshotStore<T> extends ObservableSnapshot<T> {

  update(mutator: (draft: T) => void): void

  set(next: T): void
}
```

## SnapshotStore root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `SnapshotStore`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SnapshotStore<T> extends ObservableSnapshot<T> {
    update(mutator: (draft: T) => void): void;
    set(next: T): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `update` | `update(mutator: (draft: T) => void): void;` |
| `set` | `set(next: T): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

## createSnapshotStore root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `createSnapshotStore`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function createSnapshotStore<T>(init: T, opts?: {
    flush?: 'raf' | 'sync';
    persist?: {
        name: string;
    };
}): SnapshotStore<T>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SnapshotStore<T> extends ObservableSnapshot<T> {

  update(mutator: (draft: T) => void): void

  set(next: T): void
}
```

## defineStore root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `defineStore`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function defineStore<T, A extends ActionsDecl<T>>(decl: StoreSpec<T, A> & {
    actions: A & ActionsDecl<T>;
}): EngineStoreHandle<T, A>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface EngineStoreHandle<T, A extends ActionsDecl<T>> extends StoreHandle<T, A> {

  create(scopeKey?: string): EngineStoreInstance<T, A>
}

export interface EngineStoreInstance<T, A extends ActionsDecl<T>> extends StoreInstance<T, A> {

  readonly store: SnapshotStore<T>
}

export interface SnapshotStore<T> extends ObservableSnapshot<T> {

  update(mutator: (draft: T) => void): void

  set(next: T): void
}
```

## notifySubscribers root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `notifySubscribers`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function notifySubscribers<Args extends readonly unknown[]>(listeners: Iterable<(...args: Args) => void>, label: string, ...args: Args): void;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。

## shallowEqual root

入口 `@deepseek-ai/dsh-client-store`，公开符号 `shallowEqual`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function shallowEqual(a: unknown, b: unknown): boolean;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-store.md#接入-store) 在真实装载路径检验成功、失败与卸载。
