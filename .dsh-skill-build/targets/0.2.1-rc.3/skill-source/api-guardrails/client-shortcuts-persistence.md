# shortcuts：persistence 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

命令 owner 注册语义命令与有效键位，显示方读取同一 binding 描述。web 与 desktop 的可用修饰键与保留键不同，不能直接监听一个全局 keydown 绕过 modal/terminal/composition 仲裁。注册结果或订阅必须随 ctx.effect 清理。

## DesktopShortcutsApi protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `DesktopShortcutsApi`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DesktopShortcutsApi {
    get(definitions: readonly ShortcutDefinition[]): Promise<ShortcutConfigSnapshot>;
    edit(edit: ShortcutEdit, revision: ShortcutRevision): Promise<ShortcutSaveResult>;
    subscribe(listener: (snapshot: ShortcutConfigSnapshot) => void): () => void;
    recording(active: boolean): Promise<void>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `get` | `get(definitions: readonly ShortcutDefinition[]): Promise<ShortcutConfigSnapshot>;` |
| `edit` | `edit(edit: ShortcutEdit, revision: ShortcutRevision): Promise<ShortcutSaveResult>;` |
| `subscribe` | `subscribe(listener: (snapshot: ShortcutConfigSnapshot) => void): () => void;` |
| `recording` | `recording(active: boolean): Promise<void>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ShortcutRevision = Branded<'ShortcutRevision'>

export interface ShortcutConfigSnapshot {
  readonly revision: ShortcutRevision

  readonly sequence: number
  readonly document: ShortcutDocument
  readonly status: 'loading' | 'ready' | 'unreadable'
  readonly error: 'read' | 'invalid' | 'future' | null
  readonly usingDefaults: boolean
}

export interface ShortcutSaveResult {
  readonly status: 'saved' | 'stale' | 'unreadable' | 'write-failed' | 'not-ready' | 'conflict'
  readonly snapshot: ShortcutConfigSnapshot
  readonly issue?: BindingIssue
  readonly conflicts?: readonly ShortcutCommandId[]
}
```

## ShortcutConfigSnapshot protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `ShortcutConfigSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ShortcutConfigSnapshot {
    readonly revision: ShortcutRevision;
    readonly sequence: number;
    readonly document: ShortcutDocument;
    readonly status: 'loading' | 'ready' | 'unreadable';
    readonly error: 'read' | 'invalid' | 'future' | null;
    readonly usingDefaults: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `revision` | `readonly revision: ShortcutRevision;` |
| `sequence` | `readonly sequence: number;` |
| `document` | `readonly document: ShortcutDocument;` |
| `status` | `readonly status: 'loading' \| 'ready' \| 'unreadable';` |
| `error` | `readonly error: 'read' \| 'invalid' \| 'future' \| null;` |
| `usingDefaults` | `readonly usingDefaults: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ShortcutRevision = Branded<'ShortcutRevision'>
```

## ShortcutPersistence protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `ShortcutPersistence`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class ShortcutPersistence {
    constructor(storage: ShortcutStorage, runtime: ShortcutRuntime, platform: ShortcutPlatform, rereadBeforeWrite: boolean, publish: (snapshot: ShortcutConfigSnapshot) => void);
    setDefinitions(definitions: readonly ShortcutDefinition[] | null): void;
    dispose(): void;
    readCurrent(): Promise<ShortcutConfigSnapshot>;
    edit(edit: ShortcutEdit, revision: ShortcutRevision): Promise<ShortcutSaveResult>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `constructor` | `constructor(storage: ShortcutStorage, runtime: ShortcutRuntime, platform: ShortcutPlatform, rereadBeforeWrite: boolean, publish: (snapshot: ShortcutConfigSnapshot) => void);` |
| `setDefinitions` | `setDefinitions(definitions: readonly ShortcutDefinition[] \| null): void;` |
| `dispose` | `dispose(): void;` |
| `readCurrent` | `readCurrent(): Promise<ShortcutConfigSnapshot>;` |
| `edit` | `edit(edit: ShortcutEdit, revision: ShortcutRevision): Promise<ShortcutSaveResult>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ShortcutRevision = Branded<'ShortcutRevision'>

export interface ShortcutConfigSnapshot {
  readonly revision: ShortcutRevision

  readonly sequence: number
  readonly document: ShortcutDocument
  readonly status: 'loading' | 'ready' | 'unreadable'
  readonly error: 'read' | 'invalid' | 'future' | null
  readonly usingDefaults: boolean
}

export interface ShortcutSaveResult {
  readonly status: 'saved' | 'stale' | 'unreadable' | 'write-failed' | 'not-ready' | 'conflict'
  readonly snapshot: ShortcutConfigSnapshot
  readonly issue?: BindingIssue
  readonly conflicts?: readonly ShortcutCommandId[]
}
```

## ShortcutRevision protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `ShortcutRevision`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ShortcutRevision = Branded<'ShortcutRevision'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## ShortcutSaveResult protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `ShortcutSaveResult`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ShortcutSaveResult {
    readonly status: 'saved' | 'stale' | 'unreadable' | 'write-failed' | 'not-ready' | 'conflict';
    readonly snapshot: ShortcutConfigSnapshot;
    readonly issue?: BindingIssue;
    readonly conflicts?: readonly ShortcutCommandId[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `status` | `readonly status: 'saved' \| 'stale' \| 'unreadable' \| 'write-failed' \| 'not-ready' \| 'conflict';` |
| `snapshot` | `readonly snapshot: ShortcutConfigSnapshot;` |
| `issue` | `readonly issue?: BindingIssue;` |
| `conflicts` | `readonly conflicts?: readonly ShortcutCommandId[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ShortcutConfigSnapshot {
  readonly revision: ShortcutRevision

  readonly sequence: number
  readonly document: ShortcutDocument
  readonly status: 'loading' | 'ready' | 'unreadable'
  readonly error: 'read' | 'invalid' | 'future' | null
  readonly usingDefaults: boolean
}

export type ShortcutRevision = Branded<'ShortcutRevision'>
```

## ShortcutStorage protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `ShortcutStorage`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ShortcutStorage {
    read(): string | null | Promise<string | null>;
    write(raw: string): void | Promise<void>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `read` | `read(): string \| null \| Promise<string \| null>;` |
| `write` | `write(raw: string): void \| Promise<void>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## initialShortcutConfig protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `initialShortcutConfig`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function initialShortcutConfig(): ShortcutConfigSnapshot;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface ShortcutConfigSnapshot {
  readonly revision: ShortcutRevision

  readonly sequence: number
  readonly document: ShortcutDocument
  readonly status: 'loading' | 'ready' | 'unreadable'
  readonly error: 'read' | 'invalid' | 'future' | null
  readonly usingDefaults: boolean
}

export type ShortcutRevision = Branded<'ShortcutRevision'>
```
