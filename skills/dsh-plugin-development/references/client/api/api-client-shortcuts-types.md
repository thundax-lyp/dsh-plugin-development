# shortcuts：types 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

命令 owner 注册语义命令与有效键位，显示方读取同一 binding 描述。web 与 desktop 的可用修饰键与保留键不同，不能直接监听一个全局 keydown 绕过 modal/terminal/composition 仲裁。注册结果或订阅必须随 ctx.effect 清理。

## ShortcutCatalogEntry client

入口 `@deepseek-ai/dsh-client-shortcuts/client`，公开符号 `ShortcutCatalogEntry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ShortcutCatalogEntry {
    readonly id: ShortcutCommandId;
    readonly label: string;
    readonly aliases: readonly string[];
    readonly keys: readonly string[];
    readonly aria: string | undefined;
    readonly binding: NormalizedBinding | null;
    readonly modified: boolean;
    readonly conflicts: readonly ShortcutCommandId[];
    readonly issue: BindingIssue | null;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `readonly id: ShortcutCommandId;` |
| `label` | `readonly label: string;` |
| `aliases` | `readonly aliases: readonly string[];` |
| `keys` | `readonly keys: readonly string[];` |
| `aria` | `readonly aria: string \| undefined;` |
| `binding` | `readonly binding: NormalizedBinding \| null;` |
| `modified` | `readonly modified: boolean;` |
| `conflicts` | `readonly conflicts: readonly ShortcutCommandId[];` |
| `issue` | `readonly issue: BindingIssue \| null;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## ShortcutCommand client

入口 `@deepseek-ai/dsh-client-shortcuts/client`，公开符号 `ShortcutCommand`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ShortcutCommand {
    readonly id: ShortcutCommandId;
    readonly label: () => string;
    readonly aliases: readonly string[];
    readonly defaults: Readonly<Partial<Record<ShortcutProfile, ShortcutBinding>>>;
    readonly regions: readonly ShortcutRegion[];
    readonly modals: readonly string[];
    resolve(context: ShortcutContext): ShortcutResolution;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `readonly id: ShortcutCommandId;` |
| `label` | `readonly label: () => string;` |
| `aliases` | `readonly aliases: readonly string[];` |
| `defaults` | `readonly defaults: Readonly<Partial<Record<ShortcutProfile, ShortcutBinding>>>;` |
| `regions` | `readonly regions: readonly ShortcutRegion[];` |
| `modals` | `readonly modals: readonly string[];` |
| `resolve` | `resolve(context: ShortcutContext): ShortcutResolution;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ShortcutRegion = 'page' | 'editable' | 'terminal'

export interface ShortcutContext {
  readonly source?: 'keyboard' | 'menu' | 'iframe' | 'webview'
  readonly region: ShortcutRegion
  readonly modal: string | null

  readonly target: Element | null
}

export type ShortcutResolution = { status: 'handled'; run(): void }
  | { status: 'blocked'; reason: string }
  | { status: 'pass' }
```

## ShortcutContext client

入口 `@deepseek-ai/dsh-client-shortcuts/client`，公开符号 `ShortcutContext`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ShortcutContext {
    readonly source?: 'keyboard' | 'menu' | 'iframe' | 'webview';
    readonly region: ShortcutRegion;
    readonly modal: string | null;
    readonly target: Element | null;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `source` | `readonly source?: 'keyboard' \| 'menu' \| 'iframe' \| 'webview';` |
| `region` | `readonly region: ShortcutRegion;` |
| `modal` | `readonly modal: string \| null;` |
| `target` | `readonly target: Element \| null;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ShortcutRegion = 'page' | 'editable' | 'terminal'
```

## ShortcutFixedCatalogEntry client

入口 `@deepseek-ai/dsh-client-shortcuts/client`，公开符号 `ShortcutFixedCatalogEntry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ShortcutFixedCatalogEntry {
    readonly id: ShortcutCommandId;
    readonly label: string;
    readonly keys: readonly string[];
    readonly bindings: readonly NormalizedBinding[];
    readonly group: ShortcutFixedCommand['group'];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `readonly id: ShortcutCommandId;` |
| `label` | `readonly label: string;` |
| `keys` | `readonly keys: readonly string[];` |
| `bindings` | `readonly bindings: readonly NormalizedBinding[];` |
| `group` | `readonly group: ShortcutFixedCommand['group'];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ShortcutFixedCommand {
  readonly id: ShortcutCommandId
  readonly label: () => string
  readonly keys: readonly string[]

  readonly bindings: readonly [ShortcutBinding, ...ShortcutBinding[]]
  readonly group: 'application' | 'input' | 'menus' | 'approval'
}
```

## ShortcutFixedCommand client

入口 `@deepseek-ai/dsh-client-shortcuts/client`，公开符号 `ShortcutFixedCommand`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ShortcutFixedCommand {
    readonly id: ShortcutCommandId;
    readonly label: () => string;
    readonly keys: readonly string[];
    readonly bindings: readonly [
        ShortcutBinding,
        ...ShortcutBinding[]
    ];
    readonly group: 'application' | 'input' | 'menus' | 'approval';
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `readonly id: ShortcutCommandId;` |
| `label` | `readonly label: () => string;` |
| `keys` | `readonly keys: readonly string[];` |
| `bindings` | `readonly bindings: readonly [ ShortcutBinding, ...ShortcutBinding[] ];` |
| `group` | `readonly group: 'application' \| 'input' \| 'menus' \| 'approval';` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## ShortcutFixedInput client

入口 `@deepseek-ai/dsh-client-shortcuts/client`，公开符号 `ShortcutFixedInput`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ShortcutFixedInput = {
    readonly type: 'keydown';
    readonly gesture: ShortcutGesture;
    readonly context: ShortcutContext;
    consume(): void;
} | {
    readonly type: 'reset';
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ShortcutContext {
  readonly source?: 'keyboard' | 'menu' | 'iframe' | 'webview'
  readonly region: ShortcutRegion
  readonly modal: string | null

  readonly target: Element | null
}

export interface ShortcutGesture {
  readonly code: string

  readonly secondCode?: string
  readonly control: boolean
  readonly alt: boolean
  readonly shift: boolean
  readonly meta: boolean
  readonly repeat: boolean
  readonly composing: boolean
  readonly defaultPrevented: boolean
}

export type ShortcutRegion = 'page' | 'editable' | 'terminal'
```

## ShortcutGesture client

入口 `@deepseek-ai/dsh-client-shortcuts/client`，公开符号 `ShortcutGesture`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ShortcutGesture {
    readonly code: string;
    readonly secondCode?: string;
    readonly control: boolean;
    readonly alt: boolean;
    readonly shift: boolean;
    readonly meta: boolean;
    readonly repeat: boolean;
    readonly composing: boolean;
    readonly defaultPrevented: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `code` | `readonly code: string;` |
| `secondCode` | `readonly secondCode?: string;` |
| `control` | `readonly control: boolean;` |
| `alt` | `readonly alt: boolean;` |
| `shift` | `readonly shift: boolean;` |
| `meta` | `readonly meta: boolean;` |
| `repeat` | `readonly repeat: boolean;` |
| `composing` | `readonly composing: boolean;` |
| `defaultPrevented` | `readonly defaultPrevented: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## Shortcuts client

入口 `@deepseek-ai/dsh-client-shortcuts/client`，公开符号 `Shortcuts`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface Shortcuts {
    readonly runtime: ShortcutRuntime;
    readonly platform: ShortcutPlatform;
    readonly catalog: ObservableSnapshot<readonly ShortcutCatalogEntry[]>;
    readonly config: ObservableSnapshot<ShortcutConfigSnapshot>;
    readonly fixedCatalog: ObservableSnapshot<readonly ShortcutFixedCatalogEntry[]>;
    readonly stopSequenceMs: number;
    registerFixed(command: ShortcutFixedCommand): () => void;
    observeFixedInput(listener: (input: ShortcutFixedInput) => void): () => void;
    describeBinding(binding: ShortcutBinding | null): {
        binding: NormalizedBinding | null;
        keys: readonly string[];
        issue: BindingIssue | null;
        conflicts: readonly ShortcutCommandId[];
    };
    edit(edit: ShortcutEdit, revision: ShortcutRevision): Promise<ShortcutSaveResult>;
    recording(active: boolean): Promise<void>;
    closeWindow(): Promise<void>;
    register(command: ShortcutCommand): () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `runtime` | `readonly runtime: ShortcutRuntime;` |
| `platform` | `readonly platform: ShortcutPlatform;` |
| `catalog` | `readonly catalog: ObservableSnapshot<readonly ShortcutCatalogEntry[]>;` |
| `config` | `readonly config: ObservableSnapshot<ShortcutConfigSnapshot>;` |
| `fixedCatalog` | `readonly fixedCatalog: ObservableSnapshot<readonly ShortcutFixedCatalogEntry[]>;` |
| `stopSequenceMs` | `readonly stopSequenceMs: number;` |
| `registerFixed` | `registerFixed(command: ShortcutFixedCommand): () => void;` |
| `observeFixedInput` | `observeFixedInput(listener: (input: ShortcutFixedInput) => void): () => void;` |
| `describeBinding` | `describeBinding(binding: ShortcutBinding \| null): { binding: NormalizedBinding \| null; keys: readonly string[]; issue: BindingIssue \| null; conflicts: readonly ShortcutCommandId[]; };` |
| `edit` | `edit(edit: ShortcutEdit, revision: ShortcutRevision): Promise<ShortcutSaveResult>;` |
| `recording` | `recording(active: boolean): Promise<void>;` |
| `closeWindow` | `closeWindow(): Promise<void>;` |
| `register` | `register(command: ShortcutCommand): () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface ShortcutCommand {
  readonly id: ShortcutCommandId
  readonly label: () => string
  readonly aliases: readonly string[]
  readonly defaults: Readonly<Partial<Record<ShortcutProfile, ShortcutBinding>>>
  readonly regions: readonly ShortcutRegion[]

  readonly modals: readonly string[]
  resolve(context: ShortcutContext): ShortcutResolution
}

export interface ShortcutCatalogEntry {
  readonly id: ShortcutCommandId
  readonly label: string
  readonly aliases: readonly string[]
  readonly keys: readonly string[]
  readonly aria: string | undefined
  readonly binding: NormalizedBinding | null
  readonly modified: boolean
  readonly conflicts: readonly ShortcutCommandId[]
  readonly issue: BindingIssue | null
}

export type ShortcutFixedInput = {
  readonly type: 'keydown'
  readonly gesture: ShortcutGesture
  readonly context: ShortcutContext
  consume(): void
} | { readonly type: 'reset' }

export interface ShortcutFixedCommand {
  readonly id: ShortcutCommandId
  readonly label: () => string
  readonly keys: readonly string[]

  readonly bindings: readonly [ShortcutBinding, ...ShortcutBinding[]]
  readonly group: 'application' | 'input' | 'menus' | 'approval'
}

export interface ShortcutFixedCatalogEntry {
  readonly id: ShortcutCommandId
  readonly label: string
  readonly keys: readonly string[]
  readonly bindings: readonly NormalizedBinding[]
  readonly group: ShortcutFixedCommand['group']
}

export type ShortcutRegion = 'page' | 'editable' | 'terminal'

export interface ShortcutContext {
  readonly source?: 'keyboard' | 'menu' | 'iframe' | 'webview'
  readonly region: ShortcutRegion
  readonly modal: string | null

  readonly target: Element | null
}

export type ShortcutResolution = { status: 'handled'; run(): void }
  | { status: 'blocked'; reason: string }
  | { status: 'pass' }

export interface ShortcutGesture {
  readonly code: string

  readonly secondCode?: string
  readonly control: boolean
  readonly alt: boolean
  readonly shift: boolean
  readonly meta: boolean
  readonly repeat: boolean
  readonly composing: boolean
  readonly defaultPrevented: boolean
}
```
