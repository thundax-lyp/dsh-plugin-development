# ui-commands：contract 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-commands 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## ActionSpec client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `ActionSpec`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ActionSpec {
    readonly kind: 'action';
    run(session: ClientSessionContext): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `readonly kind: 'action';` |
| `run` | `run(session: ClientSessionContext): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。

## CommandContribution client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `CommandContribution`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface CommandContribution {
    readonly name: string;
    label?(): string;
    description?(): string;
    readonly icon?: ComponentType<IconProps>;
    available(session: ClientSessionContext): boolean;
    readonly ui: CommandUiSpec;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `name` | `readonly name: string;` |
| `label` | `label?(): string;` |
| `description` | `description?(): string;` |
| `icon` | `readonly icon?: ComponentType<IconProps>;` |
| `available` | `available(session: ClientSessionContext): boolean;` |
| `ui` | `readonly ui: CommandUiSpec;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type CommandUiSpec = PopupSelectSpec | ActionSpec

export interface PopupSelectSpec {
  readonly kind: 'popupSelect'

  readonly searchMode?: PopupSearchMode

  searchLabels?(): PopupSearchLabels
  options(session: ClientSessionContext, signal: AbortSignal): Promise<readonly SelectOption[]>
  onSelect(option: SelectOption, session: ClientSessionContext): void | Promise<void>
}

export interface ActionSpec {
  readonly kind: 'action'

  run(session: ClientSessionContext): void
}

export type PopupSearchMode = 'substring' | 'fuzzy-label'

export interface SelectOption {
  readonly id: string
  readonly label: string

  readonly badge?: string
  readonly detail?: string

  readonly group?: SelectOptionGroup

  readonly active?: boolean

  readonly confirmation?: SelectConfirmation
}

export interface PopupSearchLabels {
  readonly placeholder: string

  readonly empty: string

  readonly noResults: string
}

export interface SelectConfirmation {
  readonly title: string
  readonly description: string
  readonly acknowledgeLabel: string
  readonly cancelLabel: string
  readonly confirmLabel: string
}

export interface SelectOptionGroup {
  readonly name: string
  readonly label: string
}
```

## CommandDecoration client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `CommandDecoration`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface CommandDecoration {
    readonly name: string;
    available(session: ClientSessionContext): boolean;
    readonly ui: CommandUiSpec;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `name` | `readonly name: string;` |
| `available` | `available(session: ClientSessionContext): boolean;` |
| `ui` | `readonly ui: CommandUiSpec;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type CommandUiSpec = PopupSelectSpec | ActionSpec

export interface PopupSelectSpec {
  readonly kind: 'popupSelect'

  readonly searchMode?: PopupSearchMode

  searchLabels?(): PopupSearchLabels
  options(session: ClientSessionContext, signal: AbortSignal): Promise<readonly SelectOption[]>
  onSelect(option: SelectOption, session: ClientSessionContext): void | Promise<void>
}

export interface ActionSpec {
  readonly kind: 'action'

  run(session: ClientSessionContext): void
}

export type PopupSearchMode = 'substring' | 'fuzzy-label'

export interface SelectOption {
  readonly id: string
  readonly label: string

  readonly badge?: string
  readonly detail?: string

  readonly group?: SelectOptionGroup

  readonly active?: boolean

  readonly confirmation?: SelectConfirmation
}

export interface PopupSearchLabels {
  readonly placeholder: string

  readonly empty: string

  readonly noResults: string
}

export interface SelectConfirmation {
  readonly title: string
  readonly description: string
  readonly acknowledgeLabel: string
  readonly cancelLabel: string
  readonly confirmLabel: string
}

export interface SelectOptionGroup {
  readonly name: string
  readonly label: string
}
```

## CommandUiContract client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `CommandUiContract`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface CommandUiContract {
    register(contribution: CommandContribution): () => void;
    decorate(decoration: CommandDecoration): () => void;
    dismiss(name: string): void;
    popupFor(actx: ClientContext): unknown;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `register` | `register(contribution: CommandContribution): () => void;` |
| `decorate` | `decorate(decoration: CommandDecoration): () => void;` |
| `dismiss` | `dismiss(name: string): void;` |
| `popupFor` | `popupFor(actx: ClientContext): unknown;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface CommandContribution {

  readonly name: string

  label?(): string

  description?(): string

  readonly icon?: ComponentType<IconProps>

  available(session: ClientSessionContext): boolean

  readonly ui: CommandUiSpec
}

export interface CommandDecoration {

  readonly name: string

  available(session: ClientSessionContext): boolean

  readonly ui: CommandUiSpec
}

export type CommandUiSpec = PopupSelectSpec | ActionSpec

export interface PopupSelectSpec {
  readonly kind: 'popupSelect'

  readonly searchMode?: PopupSearchMode

  searchLabels?(): PopupSearchLabels
  options(session: ClientSessionContext, signal: AbortSignal): Promise<readonly SelectOption[]>
  onSelect(option: SelectOption, session: ClientSessionContext): void | Promise<void>
}

export interface ActionSpec {
  readonly kind: 'action'

  run(session: ClientSessionContext): void
}

export type PopupSearchMode = 'substring' | 'fuzzy-label'

export interface SelectOption {
  readonly id: string
  readonly label: string

  readonly badge?: string
  readonly detail?: string

  readonly group?: SelectOptionGroup

  readonly active?: boolean

  readonly confirmation?: SelectConfirmation
}

export interface PopupSearchLabels {
  readonly placeholder: string

  readonly empty: string

  readonly noResults: string
}

export interface SelectConfirmation {
  readonly title: string
  readonly description: string
  readonly acknowledgeLabel: string
  readonly cancelLabel: string
  readonly confirmLabel: string
}

export interface SelectOptionGroup {
  readonly name: string
  readonly label: string
}
```

## CommandUiSpec client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `CommandUiSpec`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type CommandUiSpec = PopupSelectSpec | ActionSpec;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface PopupSelectSpec {
  readonly kind: 'popupSelect'

  readonly searchMode?: PopupSearchMode

  searchLabels?(): PopupSearchLabels
  options(session: ClientSessionContext, signal: AbortSignal): Promise<readonly SelectOption[]>
  onSelect(option: SelectOption, session: ClientSessionContext): void | Promise<void>
}

export interface ActionSpec {
  readonly kind: 'action'

  run(session: ClientSessionContext): void
}

export type PopupSearchMode = 'substring' | 'fuzzy-label'

export interface SelectOption {
  readonly id: string
  readonly label: string

  readonly badge?: string
  readonly detail?: string

  readonly group?: SelectOptionGroup

  readonly active?: boolean

  readonly confirmation?: SelectConfirmation
}

export interface PopupSearchLabels {
  readonly placeholder: string

  readonly empty: string

  readonly noResults: string
}

export interface SelectConfirmation {
  readonly title: string
  readonly description: string
  readonly acknowledgeLabel: string
  readonly cancelLabel: string
  readonly confirmLabel: string
}

export interface SelectOptionGroup {
  readonly name: string
  readonly label: string
}
```

## PopupSearchLabels client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `PopupSearchLabels`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PopupSearchLabels {
    readonly placeholder: string;
    readonly empty: string;
    readonly noResults: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `placeholder` | `readonly placeholder: string;` |
| `empty` | `readonly empty: string;` |
| `noResults` | `readonly noResults: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。

## PopupSearchMode client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `PopupSearchMode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PopupSearchMode = 'substring' | 'fuzzy-label';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。

## PopupSelectSpec client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `PopupSelectSpec`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PopupSelectSpec {
    readonly kind: 'popupSelect';
    readonly searchMode?: PopupSearchMode;
    searchLabels?(): PopupSearchLabels;
    options(session: ClientSessionContext, signal: AbortSignal): Promise<readonly SelectOption[]>;
    onSelect(option: SelectOption, session: ClientSessionContext): void | Promise<void>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `readonly kind: 'popupSelect';` |
| `searchMode` | `readonly searchMode?: PopupSearchMode;` |
| `searchLabels` | `searchLabels?(): PopupSearchLabels;` |
| `options` | `options(session: ClientSessionContext, signal: AbortSignal): Promise<readonly SelectOption[]>;` |
| `onSelect` | `onSelect(option: SelectOption, session: ClientSessionContext): void \| Promise<void>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type PopupSearchMode = 'substring' | 'fuzzy-label'

export interface SelectOption {
  readonly id: string
  readonly label: string

  readonly badge?: string
  readonly detail?: string

  readonly group?: SelectOptionGroup

  readonly active?: boolean

  readonly confirmation?: SelectConfirmation
}

export interface PopupSearchLabels {
  readonly placeholder: string

  readonly empty: string

  readonly noResults: string
}

export interface SelectConfirmation {
  readonly title: string
  readonly description: string
  readonly acknowledgeLabel: string
  readonly cancelLabel: string
  readonly confirmLabel: string
}

export interface SelectOptionGroup {
  readonly name: string
  readonly label: string
}
```

## SelectConfirmation client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `SelectConfirmation`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SelectConfirmation {
    readonly title: string;
    readonly description: string;
    readonly acknowledgeLabel: string;
    readonly cancelLabel: string;
    readonly confirmLabel: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `title` | `readonly title: string;` |
| `description` | `readonly description: string;` |
| `acknowledgeLabel` | `readonly acknowledgeLabel: string;` |
| `cancelLabel` | `readonly cancelLabel: string;` |
| `confirmLabel` | `readonly confirmLabel: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。

## SelectOption client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `SelectOption`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SelectOption {
    readonly id: string;
    readonly label: string;
    readonly badge?: string;
    readonly detail?: string;
    readonly group?: SelectOptionGroup;
    readonly active?: boolean;
    readonly confirmation?: SelectConfirmation;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `readonly id: string;` |
| `label` | `readonly label: string;` |
| `badge` | `readonly badge?: string;` |
| `detail` | `readonly detail?: string;` |
| `group` | `readonly group?: SelectOptionGroup;` |
| `active` | `readonly active?: boolean;` |
| `confirmation` | `readonly confirmation?: SelectConfirmation;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SelectConfirmation {
  readonly title: string
  readonly description: string
  readonly acknowledgeLabel: string
  readonly cancelLabel: string
  readonly confirmLabel: string
}

export interface SelectOptionGroup {
  readonly name: string
  readonly label: string
}
```

## SelectOptionGroup client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `SelectOptionGroup`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SelectOptionGroup {
    readonly name: string;
    readonly label: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `name` | `readonly name: string;` |
| `label` | `readonly label: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。
