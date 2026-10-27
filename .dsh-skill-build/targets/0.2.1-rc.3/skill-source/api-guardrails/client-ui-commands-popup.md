# ui-commands：popup 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-commands 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## PopupSelectController client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `PopupSelectController`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class PopupSelectController<TCtx = unknown> {
    readonly state: SnapshotStore<PopupState>;
    constructor(deps: PopupSelectDeps);
    open(command: string, spec: PopupSpec<TCtx>, context: TCtx, segment: TokenSegment): void;
    retry(): void;
    setSearch(search: string): void;
    move(dir: 1 | -1): void;
    highlight(index: number): void;
    select(index: number): Promise<void>;
    acknowledge(acknowledged: boolean): void;
    cancelConfirmation(): void;
    confirm(): Promise<void>;
    dismiss(opts?: {
        readonly focusComposer?: boolean;
    }): void;
    dispose(): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `state` | `readonly state: SnapshotStore<PopupState>;` |
| `constructor` | `constructor(deps: PopupSelectDeps);` |
| `open` | `open(command: string, spec: PopupSpec<TCtx>, context: TCtx, segment: TokenSegment): void;` |
| `retry` | `retry(): void;` |
| `setSearch` | `setSearch(search: string): void;` |
| `move` | `move(dir: 1 \| -1): void;` |
| `highlight` | `highlight(index: number): void;` |
| `select` | `select(index: number): Promise<void>;` |
| `acknowledge` | `acknowledge(acknowledged: boolean): void;` |
| `cancelConfirmation` | `cancelConfirmation(): void;` |
| `confirm` | `confirm(): Promise<void>;` |
| `dismiss` | `dismiss(opts?: { readonly focusComposer?: boolean; }): void;` |
| `dispose` | `dispose(): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type TokenSegment =
  | { readonly via: 'menu'; readonly span: TokenSpan }
  | { readonly via: 'enter'; readonly token: string }

export interface PopupSpec<TCtx> extends Pick<PopupSelectSpec, 'searchLabels' | 'searchMode'> {

  options(context: TCtx, signal: AbortSignal): Promise<readonly SelectOption[]>

  onSelect(option: SelectOption, context: TCtx): void | Promise<void>
}

export interface PopupState {
  readonly open: boolean

  readonly command: string | null

  readonly status: 'pending' | 'ready' | 'failed'

  readonly options: readonly SelectOption[]

  readonly search: string

  readonly searchLabels: PopupSearchLabels | null

  readonly searchMode: PopupSearchMode

  readonly active: number

  readonly submitting: boolean

  readonly confirming: SelectOption | null

  readonly acknowledged: boolean

  readonly error: string | null
}
```

## PopupSelectDeps client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `PopupSelectDeps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PopupSelectDeps {
    consume(segment: TokenSegment): boolean;
    focusComposer(): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `consume` | `consume(segment: TokenSegment): boolean;` |
| `focusComposer` | `focusComposer(): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type TokenSegment =
  | { readonly via: 'menu'; readonly span: TokenSpan }
  | { readonly via: 'enter'; readonly token: string }
```

## PopupSpec client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `PopupSpec`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PopupSpec<TCtx> extends Pick<PopupSelectSpec, 'searchLabels' | 'searchMode'> {
    options(context: TCtx, signal: AbortSignal): Promise<readonly SelectOption[]>;
    onSelect(option: SelectOption, context: TCtx): void | Promise<void>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `options` | `options(context: TCtx, signal: AbortSignal): Promise<readonly SelectOption[]>;` |
| `onSelect` | `onSelect(option: SelectOption, context: TCtx): void \| Promise<void>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。

## PopupState client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `PopupState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PopupState {
    readonly open: boolean;
    readonly command: string | null;
    readonly status: 'pending' | 'ready' | 'failed';
    readonly options: readonly SelectOption[];
    readonly search: string;
    readonly searchLabels: PopupSearchLabels | null;
    readonly searchMode: PopupSearchMode;
    readonly active: number;
    readonly submitting: boolean;
    readonly confirming: SelectOption | null;
    readonly acknowledged: boolean;
    readonly error: string | null;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `open` | `readonly open: boolean;` |
| `command` | `readonly command: string \| null;` |
| `status` | `readonly status: 'pending' \| 'ready' \| 'failed';` |
| `options` | `readonly options: readonly SelectOption[];` |
| `search` | `readonly search: string;` |
| `searchLabels` | `readonly searchLabels: PopupSearchLabels \| null;` |
| `searchMode` | `readonly searchMode: PopupSearchMode;` |
| `active` | `readonly active: number;` |
| `submitting` | `readonly submitting: boolean;` |
| `confirming` | `readonly confirming: SelectOption \| null;` |
| `acknowledged` | `readonly acknowledged: boolean;` |
| `error` | `readonly error: string \| null;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。

## TokenSegment client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `TokenSegment`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type TokenSegment = {
    readonly via: 'menu';
    readonly span: TokenSpan;
} | {
    readonly via: 'enter';
    readonly token: string;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。

## filterOptions client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `filterOptions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function filterOptions(options: readonly SelectOption[], search: string, mode?: PopupSearchMode): readonly SelectOption[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。
