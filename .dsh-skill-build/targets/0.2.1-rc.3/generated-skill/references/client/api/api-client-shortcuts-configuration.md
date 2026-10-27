# shortcuts：configuration 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

命令 owner 注册语义命令与有效键位，显示方读取同一 binding 描述。web 与 desktop 的可用修饰键与保留键不同，不能直接监听一个全局 keydown 绕过 modal/terminal/composition 仲裁。注册结果或订阅必须随 ctx.effect 清理。

## BindingIssue protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `BindingIssue`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type BindingIssue = 'reserved' | 'unsupported-browser' | 'modifier-required' | 'unsupported-key';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## EffectiveShortcut protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `EffectiveShortcut`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface EffectiveShortcut {
    readonly id: ShortcutCommandId;
    readonly binding: NormalizedBinding | null;
    readonly modified: boolean;
    readonly conflicts: readonly ShortcutCommandId[];
    readonly issue: BindingIssue | null;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `readonly id: ShortcutCommandId;` |
| `binding` | `readonly binding: NormalizedBinding \| null;` |
| `modified` | `readonly modified: boolean;` |
| `conflicts` | `readonly conflicts: readonly ShortcutCommandId[];` |
| `issue` | `readonly issue: BindingIssue \| null;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type BindingIssue = 'reserved' | 'unsupported-browser' | 'modifier-required' | 'unsupported-key'
```

## ShortcutDefinition protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `ShortcutDefinition`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ShortcutDefinition {
    readonly id: ShortcutCommandId;
    readonly defaults: Readonly<Partial<Record<ShortcutProfile, ShortcutBinding>>>;
    readonly fixed?: readonly [
        ShortcutBinding,
        ...ShortcutBinding[]
    ];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `readonly id: ShortcutCommandId;` |
| `defaults` | `readonly defaults: Readonly<Partial<Record<ShortcutProfile, ShortcutBinding>>>;` |
| `fixed` | `readonly fixed?: readonly [ ShortcutBinding, ...ShortcutBinding[] ];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## ShortcutDocument protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `ShortcutDocument`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ShortcutDocument {
    readonly schemaVersion: 1 | 2;
    readonly profiles: Readonly<Partial<Record<ShortcutProfile, Readonly<Record<string, ShortcutBinding | null>>>>>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `schemaVersion` | `readonly schemaVersion: 1 \| 2;` |
| `profiles` | `readonly profiles: Readonly<Partial<Record<ShortcutProfile, Readonly<Record<string, ShortcutBinding \| null>>>>>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## ShortcutEdit protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `ShortcutEdit`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ShortcutEdit = {
    type: 'set';
    id: ShortcutCommandId;
    binding: ShortcutBinding | null;
} | {
    type: 'reset';
    id: ShortcutCommandId;
} | {
    type: 'reset-all';
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## bindingIssue protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `bindingIssue`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function bindingIssue(binding: NormalizedBinding, runtime: ShortcutRuntime, platform: ShortcutPlatform): BindingIssue | null;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type BindingIssue = 'reserved' | 'unsupported-browser' | 'modifier-required' | 'unsupported-key'
```

## editShortcutDocument protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `editShortcutDocument`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function editShortcutDocument(document: ShortcutDocument, edit: ShortcutEdit, runtime: ShortcutRuntime, platform: ShortcutPlatform): ShortcutDocument;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ShortcutDocument {
  readonly schemaVersion: 1 | 2
  readonly profiles: Readonly<Partial<Record<ShortcutProfile, Readonly<Record<string, ShortcutBinding | null>>>>>
}

export type ShortcutEdit = { type: 'set'; id: ShortcutCommandId; binding: ShortcutBinding | null }
  | { type: 'reset'; id: ShortcutCommandId } | { type: 'reset-all' }
```

## effectiveShortcuts protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `effectiveShortcuts`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function effectiveShortcuts(definitions: readonly ShortcutDefinition[], document: ShortcutDocument, runtime: ShortcutRuntime, platform: ShortcutPlatform): readonly EffectiveShortcut[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ShortcutDocument {
  readonly schemaVersion: 1 | 2
  readonly profiles: Readonly<Partial<Record<ShortcutProfile, Readonly<Record<string, ShortcutBinding | null>>>>>
}

export interface ShortcutDefinition {
  readonly id: ShortcutCommandId
  readonly defaults: Readonly<Partial<Record<ShortcutProfile, ShortcutBinding>>>

  readonly fixed?: readonly [ShortcutBinding, ...ShortcutBinding[]]
}

export interface EffectiveShortcut {
  readonly id: ShortcutCommandId
  readonly binding: NormalizedBinding | null
  readonly modified: boolean
  readonly conflicts: readonly ShortcutCommandId[]
  readonly issue: BindingIssue | null
}

export type BindingIssue = 'reserved' | 'unsupported-browser' | 'modifier-required' | 'unsupported-key'
```

## overlappingBindings protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `overlappingBindings`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function overlappingBindings(left: NormalizedBinding, right: NormalizedBinding): boolean;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## parseBinding protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `parseBinding`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function parseBinding(value: unknown): ShortcutBinding | null;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## parseShortcutDefinitions protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `parseShortcutDefinitions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function parseShortcutDefinitions(value: unknown): readonly ShortcutDefinition[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ShortcutDefinition {
  readonly id: ShortcutCommandId
  readonly defaults: Readonly<Partial<Record<ShortcutProfile, ShortcutBinding>>>

  readonly fixed?: readonly [ShortcutBinding, ...ShortcutBinding[]]
}
```

## parseShortcutDocument protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `parseShortcutDocument`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function parseShortcutDocument(raw: string | null): ShortcutDocument | 'invalid' | 'future';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ShortcutDocument {
  readonly schemaVersion: 1 | 2
  readonly profiles: Readonly<Partial<Record<ShortcutProfile, Readonly<Record<string, ShortcutBinding | null>>>>>
}
```

## parseShortcutEdit protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `parseShortcutEdit`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function parseShortcutEdit(value: unknown): ShortcutEdit;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ShortcutEdit = { type: 'set'; id: ShortcutCommandId; binding: ShortcutBinding | null }
  | { type: 'reset'; id: ShortcutCommandId } | { type: 'reset-all' }
```

## resolveShortcutDefault protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `resolveShortcutDefault`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function resolveShortcutDefault(definition: ShortcutDefinition, runtime: ShortcutRuntime, platform: ShortcutPlatform): ShortcutBinding | undefined;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface ShortcutDefinition {
  readonly id: ShortcutCommandId
  readonly defaults: Readonly<Partial<Record<ShortcutProfile, ShortcutBinding>>>

  readonly fixed?: readonly [ShortcutBinding, ...ShortcutBinding[]]
}
```
