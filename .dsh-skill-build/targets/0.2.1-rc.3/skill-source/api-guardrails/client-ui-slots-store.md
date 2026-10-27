# ui-slots：store 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

纯注册表没有 React 依赖。普通 Slots 通过 `SlotMap` 声明合并；`single` 按优先级取一个占位者，`list` 按 id 与 order 组合，`keyed` 按 key 分派，`chain` 依次调用纯 select 直到首个非 null。数字 priority 越小越先。同一单元的同一 priority 冲突、未声明的键、重复 children 声明、跨 scope 共享 Store handle 和缺少 select 的 chain 注册都会抛错。注册 disposer 递归收回 children 声明、贡献与 Store 挂载。Factory 在 `SlotFactoryMap` 声明，通过 registerFactory 安装，局部 slots 逐 occurrence 选择组件；children 仍为全局 Slots。

## ActionsDecl root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `ActionsDecl`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ActionsDecl 权威契约](api-client-store-contract.md#actionsdecl-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## BakedActions root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `BakedActions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [BakedActions 权威契约](api-client-store-contract.md#bakedactions-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## BoundActions root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `BoundActions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [BoundActions 权威契约](api-client-store-contract.md#boundactions-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## DefineStore root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `DefineStore`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [DefineStore 权威契约](api-client-store-contract.md#definestore-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## HandleOf root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `HandleOf`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [HandleOf 权威契约](api-client-store-contract.md#handleof-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## MaybeSnapshotSelectorHook root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `MaybeSnapshotSelectorHook`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [MaybeSnapshotSelectorHook 权威契约](api-client-store-contract.md#maybesnapshotselectorhook-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## PropsStore root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `PropsStore`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [PropsStore 权威契约](api-client-store-contract.md#propsstore-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## SnapshotSelectorHook root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `SnapshotSelectorHook`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [SnapshotSelectorHook 权威契约](api-client-store-contract.md#snapshotselectorhook-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## StoreDecl root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `StoreDecl`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [StoreDecl 权威契约](api-client-store-contract.md#storedecl-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## StoreFactory root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `StoreFactory`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [StoreFactory 权威契约](api-client-store-contract.md#storefactory-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。

## StoreHandle root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `StoreHandle`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [StoreHandle 权威契约](api-client-store-contract.md#storehandle-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `create` | `create(scopeKey?: string): StoreInstance<T, A>;` | [StoreHandle 权威声明](api-client-store-contract.md#storehandle-root) |
| `spec` | `readonly spec: StoreSpec<T, A>;` | [StoreHandle 权威声明](api-client-store-contract.md#storehandle-root) |

## StoreInstance root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `StoreInstance`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [StoreInstance 权威契约](api-client-store-contract.md#storeinstance-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `actions` | `readonly actions: BakedActions<T, A>;` | [StoreInstance 权威声明](api-client-store-contract.md#storeinstance-root) |
| `clearPersisted` | `clearPersisted(): void;` | [StoreInstance 权威声明](api-client-store-contract.md#storeinstance-root) |
| `getSnapshot` | `getSnapshot(): T;` | [StoreInstance 权威声明](api-client-store-contract.md#storeinstance-root) |

## StoreSpec root

入口 `@deepseek-ai/dsh-client-ui-slots`，公开符号 `StoreSpec`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [StoreSpec 权威契约](api-client-store-contract.md#storespec-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-slots.md#接入-ui-slots) 在真实装载路径检验成功、失败与卸载。



继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `actions` | `actions: A;` | [StoreSpec 权威声明](api-client-store-contract.md#storespec-root) |
| `init` | `init: () => T;` | [StoreSpec 权威声明](api-client-store-contract.md#storespec-root) |
| `persist` | `persist?: string;` | [StoreSpec 权威声明](api-client-store-contract.md#storespec-root) |
