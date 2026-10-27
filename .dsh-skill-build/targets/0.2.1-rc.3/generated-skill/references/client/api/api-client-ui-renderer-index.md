# ui-renderer：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

浏览器 `apply` 提供 `ctx.slots: SlotRegistry` 与 `ctx.uiRenderer`。插件使用服务代理方法 register/inject，不新建 SlotRegistry；代理将注册 effect 归入调用插件的 fiber。inject 等待目标 slot 的声明生命周期，声明消失就清理，重新声明再安装；回调必须同步返回 disposer 或 disposer iterable。不要注册 root：它是框架 AppFrame 的 single slot，覆盖它会移除整个页面；全局浮层使用 shell.overlay。

## ChainRenderOpts client

入口 `@deepseek-ai/dsh-client-ui-renderer/client`，公开符号 `ChainRenderOpts`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ChainRenderOpts 权威契约](api-client-ui-slots-index.md#chainrenderopts-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-renderer.md#接入-ui-renderer) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `fallback` | `fallback?: ReactNode;` | [ChainRenderOpts 权威声明](api-client-ui-slots-index.md#chainrenderopts-root) |
| `fallbackOnly` | `fallbackOnly?: boolean;` | [ChainRenderOpts 权威声明](api-client-ui-slots-index.md#chainrenderopts-root) |
| `overlay` | `overlay?: boolean;` | [ChainRenderOpts 权威声明](api-client-ui-slots-index.md#chainrenderopts-root) |

## HostObservable client

入口 `@deepseek-ai/dsh-client-ui-renderer/client`，公开符号 `HostObservable`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [HostObservable 权威契约](api-client-ui-slots-renderer.md#hostobservable-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-renderer.md#接入-ui-renderer) 在真实装载路径检验成功、失败与卸载。

## RenderOpts client

入口 `@deepseek-ai/dsh-client-ui-renderer/client`，公开符号 `RenderOpts`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [RenderOpts 权威契约](api-client-ui-slots-index.md#renderopts-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-renderer.md#接入-ui-renderer) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `entryKey` | `entryKey?: EntryKey;` | [RenderOpts 权威声明](api-client-ui-slots-index.md#renderopts-root) |
| `fallback` | `fallback?: ReactNode;` | [RenderOpts 权威声明](api-client-ui-slots-index.md#renderopts-root) |
| `hookContext` | `hookContext?: unknown;` | [RenderOpts 权威声明](api-client-ui-slots-index.md#renderopts-root) |
| `only` | `only?: string;` | [RenderOpts 权威声明](api-client-ui-slots-index.md#renderopts-root) |

## ScopedStandardSourceBinding client

入口 `@deepseek-ai/dsh-client-ui-renderer/client`，公开符号 `ScopedStandardSourceBinding`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ScopedStandardSourceBinding 权威契约](api-client-ui-slots-renderer.md#scopedstandardsourcebinding-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-renderer.md#接入-ui-renderer) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `ctx` | `readonly ctx: Context;` | [ScopedStandardSourceBinding 权威声明](api-client-ui-slots-renderer.md#scopedstandardsourcebinding-root) |
| `hooks` | `readonly hooks: Readonly<Record<string, HostObservable<unknown> \| undefined>>;` | [StandardSourceBinding 权威声明](api-client-ui-slots-renderer.md#standardsourcebinding-root) |
| `key` | `readonly key: string;` | [ScopedStandardSourceBinding 权威声明](api-client-ui-slots-renderer.md#scopedstandardsourcebinding-root) |
| `keyedHooks` | `readonly keyedHooks: Readonly<Record<string, KeyedStandardSource \| undefined>>;` | [StandardSourceBinding 权威声明](api-client-ui-slots-renderer.md#standardsourcebinding-root) |

## SlotRenderer client

入口 `@deepseek-ai/dsh-client-ui-renderer/client`，公开符号 `SlotRenderer`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [SlotRenderer 权威契约](api-client-ui-slots-renderer.md#slotrenderer-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-renderer.md#接入-ui-renderer) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `renderRoot` | `renderRoot(host: SlotRendererHost, ownerProps: object): ReactNode;` | [SlotRenderer 权威声明](api-client-ui-slots-renderer.md#slotrenderer-root) |

## SlotRendererHost client

入口 `@deepseek-ai/dsh-client-ui-renderer/client`，公开符号 `SlotRendererHost`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [SlotRendererHost 权威契约](api-client-ui-slots-renderer.md#slotrendererhost-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-renderer.md#接入-ui-renderer) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `entriesOf` | `entriesOf(key: string): readonly StoredEntry[];` | [SlotRendererHost 权威声明](api-client-ui-slots-renderer.md#slotrendererhost-root) |
| `entriesOfSlot` | `entriesOfSlot(key: string): readonly StoredEntry[];` | [SlotRendererHost 权威声明](api-client-ui-slots-renderer.md#slotrendererhost-root) |
| `factoryOf` | `factoryOf(name: string): StoredFactory \| undefined;` | [SlotRendererHost 权威声明](api-client-ui-slots-renderer.md#slotrendererhost-root) |
| `factoryStoreOf` | `factoryStoreOf(definition: StoredFactory, scopeBinding: ScopedStandardSourceBinding \| undefined, occurrence: object): StoreInstanceLike \| undefined;` | [SlotRendererHost 权威声明](api-client-ui-slots-renderer.md#slotrendererhost-root) |
| `getFactoryVersion` | `getFactoryVersion(name: string): number;` | [SlotRendererHost 权威声明](api-client-ui-slots-renderer.md#slotrendererhost-root) |
| `getVersion` | `getVersion(key: string): number;` | [SlotRendererHost 权威声明](api-client-ui-slots-renderer.md#slotrendererhost-root) |
| `isFactoryLive` | `isFactoryLive(definition: StoredFactory): boolean;` | [SlotRendererHost 权威声明](api-client-ui-slots-renderer.md#slotrendererhost-root) |
| `isLive` | `isLive(entry: StoredEntry): boolean;` | [SlotRendererHost 权威声明](api-client-ui-slots-renderer.md#slotrendererhost-root) |
| `locale` | `locale?: LocaleFace \| undefined;` | [SlotRendererHost 权威声明](api-client-ui-slots-renderer.md#slotrendererhost-root) |
| `reportEntryError` | `reportEntryError(key: string, entry: StoredEntry, error: unknown, info: { abdicate: boolean; }): void;` | [SlotRendererHost 权威声明](api-client-ui-slots-renderer.md#slotrendererhost-root) |
| `reportFactoryError` | `reportFactoryError(name: string, registration: StoredEntry \| StoredFactory, error: unknown): void;` | [SlotRendererHost 权威声明](api-client-ui-slots-renderer.md#slotrendererhost-root) |
| `retainFactoryOccurrence` | `retainFactoryOccurrence(definition: StoredFactory, occurrence: object): () => void;` | [SlotRendererHost 权威声明](api-client-ui-slots-renderer.md#slotrendererhost-root) |
| `scope` | `scope(scope: Exclude<SlotScope, 'root'>): SlotScopeAdapter \| undefined;` | [SlotRendererHost 权威声明](api-client-ui-slots-renderer.md#slotrendererhost-root) |
| `scopeRevision` | `readonly scopeRevision: HostObservable<number>;` | [SlotRendererHost 权威声明](api-client-ui-slots-renderer.md#slotrendererhost-root) |
| `specOf` | `specOf(key: string): SlotSpec<SlotEntryDef> \| undefined;` | [SlotRendererHost 权威声明](api-client-ui-slots-renderer.md#slotrendererhost-root) |
| `storeOf` | `storeOf(entry: StoredEntry, scopeBinding: ScopedStandardSourceBinding \| undefined): StoreInstanceLike \| undefined;` | [SlotRendererHost 权威声明](api-client-ui-slots-renderer.md#slotrendererhost-root) |
| `subscribeFactory` | `subscribeFactory(name: string, fn: () => void): () => void;` | [SlotRendererHost 权威声明](api-client-ui-slots-renderer.md#slotrendererhost-root) |

## SlotScopeAdapter client

入口 `@deepseek-ai/dsh-client-ui-renderer/client`，公开符号 `SlotScopeAdapter`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [SlotScopeAdapter 权威契约](api-client-ui-slots-renderer.md#slotscopeadapter-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-renderer.md#接入-ui-renderer) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `bindingSource` | `bindingSource(target: SessionAreaProps['session']): HostObservable<StandardSourceBinding>;` | [SlotScopeAdapter 权威声明](api-client-ui-slots-renderer.md#slotscopeadapter-root) |
| `current` | `readonly current: HostObservable<StandardSourceBinding>;` | [SlotScopeAdapter 权威声明](api-client-ui-slots-renderer.md#slotscopeadapter-root) |
| `renderArea` | `renderArea?(binding: StandardSourceBinding, props: SessionAreaProps): ReactNode;` | [SlotScopeAdapter 权威声明](api-client-ui-slots-renderer.md#slotscopeadapter-root) |

## SnapshotSelectorHook client

入口 `@deepseek-ai/dsh-client-ui-renderer/client`，公开符号 `SnapshotSelectorHook`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [SnapshotSelectorHook 权威契约](api-client-store-contract.md#snapshotselectorhook-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-renderer.md#接入-ui-renderer) 在真实装载路径检验成功、失败与卸载。

## StandardSourceBinding client

入口 `@deepseek-ai/dsh-client-ui-renderer/client`，公开符号 `StandardSourceBinding`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [StandardSourceBinding 权威契约](api-client-ui-slots-renderer.md#standardsourcebinding-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-renderer.md#接入-ui-renderer) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `hooks` | `readonly hooks: Readonly<Record<string, HostObservable<unknown> \| undefined>>;` | [StandardSourceBinding 权威声明](api-client-ui-slots-renderer.md#standardsourcebinding-root) |
| `key` | `readonly key: string \| undefined;` | [StandardSourceBinding 权威声明](api-client-ui-slots-renderer.md#standardsourcebinding-root) |
| `keyedHooks` | `readonly keyedHooks: Readonly<Record<string, KeyedStandardSource \| undefined>>;` | [StandardSourceBinding 权威声明](api-client-ui-slots-renderer.md#standardsourcebinding-root) |

## StoreInstanceLike client

入口 `@deepseek-ai/dsh-client-ui-renderer/client`，公开符号 `StoreInstanceLike`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [StoreInstanceLike 权威契约](api-client-ui-slots-renderer.md#storeinstancelike-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-renderer.md#接入-ui-renderer) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `actions` | `readonly actions: Record<string, (...params: never[]) => void>;` | [StoreInstanceLike 权威声明](api-client-ui-slots-renderer.md#storeinstancelike-root) |
| `getSnapshot` | `getSnapshot(): unknown;` | [StoreInstanceLike 权威声明](api-client-ui-slots-renderer.md#storeinstancelike-root) |

## UiRendererService client

入口 `@deepseek-ai/dsh-client-ui-renderer/client`，公开符号 `UiRendererService`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface UiRendererService {
    mount: (container: HTMLElement) => () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `mount` | `mount: (container: HTMLElement) => () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-renderer.md#接入-ui-renderer) 在真实装载路径检验成功、失败与卸载。
