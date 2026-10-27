# ui-primitives：form-model 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页是与 React、Cordis 解耦的设置草稿模型契约：`SettingsFormScope<T>` 提供已接受值的快照、订阅和 revision 围栏写入；`SettingsFormModel<T>` 管理草稿并在显式保存时提交。模型不注册 slot、不提供设置命名空间，也不自动随 React 组件卸载；创建它的 owner 负责 `dispose()`。展示控件与页面装配由设置页任务完成。

## SettingsFieldSpec root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SettingsFieldSpec`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SettingsFieldSpec {
    field: string;
    format: (value: unknown) => string;
    parse: (text: string) => SettingsFieldWrite | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `field` | `field: string;` |
| `format` | `format: (value: unknown) => string;` |
| `parse` | `parse: (text: string) => SettingsFieldWrite \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SettingsFieldWrite =
  | { kind: 'set'; value: unknown }
  | { kind: 'clear' }
```

## SettingsFieldState root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SettingsFieldState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SettingsFieldState {
    text: string;
    overridden: boolean;
    invalid: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `text` | `text: string;` |
| `overridden` | `overridden: boolean;` |
| `invalid` | `invalid: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## SettingsFieldWrite root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SettingsFieldWrite`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SettingsFieldWrite = {
    kind: 'set';
    value: unknown;
} | {
    kind: 'clear';
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## SettingsFormActions root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SettingsFormActions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SettingsFormActions {
    edit: (field: string, text: string) => void;
    resetField: (field: string) => void;
    save: () => void;
    discard: () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `edit` | `edit: (field: string, text: string) => void;` |
| `resetField` | `resetField: (field: string) => void;` |
| `save` | `save: () => void;` |
| `discard` | `discard: () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## SettingsFormModel root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SettingsFormModel`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class SettingsFormModel<T> {
    constructor(scope: SettingsFormScope<T>, specs: SettingsFieldSpec[], secrets?: SettingsSecretSpec[]);
    bind<S>(project: () => S): SnapshotStore<S>;
    shell(): SettingsFormShell;
    field(field: string): SettingsFieldState;
    actions(): SettingsFormActions;
    save(): Promise<void>;
    dispose(): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `constructor` | `constructor(scope: SettingsFormScope<T>, specs: SettingsFieldSpec[], secrets?: SettingsSecretSpec[]);` |
| `bind` | `bind<S>(project: () => S): SnapshotStore<S>;` |
| `shell` | `shell(): SettingsFormShell;` |
| `field` | `field(field: string): SettingsFieldState;` |
| `actions` | `actions(): SettingsFormActions;` |
| `save` | `save(): Promise<void>;` |
| `dispose` | `dispose(): void;` |

这是持有订阅和草稿的有状态模型，不是纯 React 控件。`scope` 由 `configForms.namespace<T>(...)` 或插件配置页表单提供；调用方须保留其泛型与命名空间对应的配置类型。构造时立即订阅 scope；创建模型的插件或页面 owner 必须在退出时调用 `dispose()` 退订并清空模型监听器。`dispose()` 不等于取消已发出的保存请求，页面仍须遵守自身异步 owner 边界。

第一次 `actions().edit` 或 `resetField` 捕获当时 snapshot 为 baseline；后续远端 snapshot 更新不会替换这个 baseline。`save()` 将全部有效字段改动作为一次 `scope.mutate(ops, baseline.revision)` 提交；不要在点击保存时改成最新 revision，否则会绕过编辑期间的冲突检测。成功后才清除草稿和 baseline；Host 拒绝或抛错时 `shell().failed` 为 true，草稿保留。冲突后应让用户对照最新值协调；`discard()` 明确丢弃草稿并释放 baseline，之后的新编辑才捕获新 revision，不应自动反复提交旧草稿。

`parse` 返回 `undefined` 时整个字段保存被阻止，`shell().invalid` 为 true；只读、正在保存、没有计划写入时 `save()` 不执行写入。`resetField` 暂存清除用户层覆盖，使保存后重新继承组合层；覆盖标记按用户层字段是否存在判定，不按值是否相等判定。secret 的空白草稿不写入，非空 secret 在普通字段写入获接受后逐项提交；部分 secret 失败不是普通字段事务回滚，失败时保留草稿供用户处理。

`actions().save()` 是返回 void 的 UI 回调；需要等待收口的调用方应 `await model.save()`。后者会将保存异常转换为 `failed` 状态，完成不等于保存被接受；检查 `shell()` 和 scope 回读。`bind(project)` 创建由 scope 和草稿变化驱动的快照投影，slot 使用它的 selector；模型不直接渲染页面。完整装配与并发验证见 [设置页接入](../how-to/how-to-client-ui-settings.md#接入-ui-settings)。

同文件声明的形状依赖：

```text
export interface SettingsFieldState {

  text: string

  overridden: boolean

  invalid: boolean
}

export interface SettingsFormShell {

  available: boolean

  writable: boolean

  dirty: boolean

  invalid: boolean

  saving: boolean

  failed: boolean
}

export interface SettingsFormActions {

  edit: (field: string, text: string) => void

  resetField: (field: string) => void

  save: () => void

  discard: () => void
}
```

## SettingsFormPathOp root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SettingsFormPathOp`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SettingsFormPathOp = {
    op: 'set';
    path: readonly string[];
    value: unknown;
} | {
    op: 'unset';
    path: readonly string[];
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## SettingsFormScope root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SettingsFormScope`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SettingsFormScope<T> {
    getSnapshot(): SettingsFormScopeSnapshot<T>;
    subscribe(listener: () => void): () => void;
    mutate(ops: readonly SettingsFormPathOp[], expectedRevision?: number): Promise<boolean>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `getSnapshot` | `getSnapshot(): SettingsFormScopeSnapshot<T>;` |
| `subscribe` | `subscribe(listener: () => void): () => void;` |
| `mutate` | `mutate(ops: readonly SettingsFormPathOp[], expectedRevision?: number): Promise<boolean>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SettingsFormScopeSnapshot<T> {

  status: 'loading' | 'ready' | 'unavailable'

  value: T | undefined

  base: unknown

  user: unknown

  writable: boolean

  revision: number | undefined
}

export type SettingsFormPathOp =
  | { op: 'set'; path: readonly string[]; value: unknown }
  | { op: 'unset'; path: readonly string[] }
```

## SettingsFormScopeSnapshot root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SettingsFormScopeSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SettingsFormScopeSnapshot<T> {
    status: 'loading' | 'ready' | 'unavailable';
    value: T | undefined;
    base: unknown;
    user: unknown;
    writable: boolean;
    revision: number | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `status` | `status: 'loading' \| 'ready' \| 'unavailable';` |
| `value` | `value: T \| undefined;` |
| `base` | `base: unknown;` |
| `user` | `user: unknown;` |
| `writable` | `writable: boolean;` |
| `revision` | `revision: number \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## SettingsFormShell root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SettingsFormShell`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SettingsFormShell {
    available: boolean;
    writable: boolean;
    dirty: boolean;
    invalid: boolean;
    saving: boolean;
    failed: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `available` | `available: boolean;` |
| `writable` | `writable: boolean;` |
| `dirty` | `dirty: boolean;` |
| `invalid` | `invalid: boolean;` |
| `saving` | `saving: boolean;` |
| `failed` | `failed: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## SettingsSecretSpec root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SettingsSecretSpec`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SettingsSecretSpec {
    field: string;
    write: (text: string) => Promise<boolean>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `field` | `field: string;` |
| `write` | `write: (text: string) => Promise<boolean>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## settingsNumberField root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `settingsNumberField`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function settingsNumberField(field: string): SettingsFieldSpec;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SettingsFieldSpec {

  field: string

  format: (value: unknown) => string

  parse: (text: string) => SettingsFieldWrite | undefined
}

export type SettingsFieldWrite =
  | { kind: 'set'; value: unknown }
  | { kind: 'clear' }
```

## settingsTextField root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `settingsTextField`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function settingsTextField(field: string): SettingsFieldSpec;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface SettingsFieldSpec {

  field: string

  format: (value: unknown) => string

  parse: (text: string) => SettingsFieldWrite | undefined
}

export type SettingsFieldWrite =
  | { kind: 'set'; value: unknown }
  | { kind: 'clear' }
```
