# shortcuts：binding 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

命令 owner 注册语义命令与有效键位，显示方读取同一 binding 描述。web 与 desktop 的可用修饰键与保留键不同，不能直接监听一个全局 keydown 绕过 modal/terminal/composition 仲裁。注册结果或订阅必须随 ctx.effect 清理。

## ShortcutBinding client

入口 `@deepseek-ai/dsh-client-shortcuts/client`，公开符号 `ShortcutBinding`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ShortcutBinding {
    readonly code: string;
    readonly secondCode?: string;
    readonly modifiers: readonly ShortcutModifier[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `code` | `readonly code: string;` |
| `secondCode` | `readonly secondCode?: string;` |
| `modifiers` | `readonly modifiers: readonly ShortcutModifier[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ShortcutModifier = 'primary' | 'control' | 'alt' | 'shift' | 'meta'
```

## ShortcutCommandId client

入口 `@deepseek-ai/dsh-client-shortcuts/client`，公开符号 `ShortcutCommandId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ShortcutCommandId = Branded<'ShortcutCommandId'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## ShortcutPlatform client

入口 `@deepseek-ai/dsh-client-shortcuts/client`，公开符号 `ShortcutPlatform`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ShortcutPlatform = 'macos' | 'windows' | 'linux';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## ShortcutRuntime client

入口 `@deepseek-ai/dsh-client-shortcuts/client`，公开符号 `ShortcutRuntime`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ShortcutRuntime = 'desktop' | 'web';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## NormalizedBinding protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `NormalizedBinding`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface NormalizedBinding {
    readonly code: string;
    readonly secondCode?: string;
    readonly modifiers: readonly ('control' | 'alt' | 'shift' | 'meta')[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `code` | `readonly code: string;` |
| `secondCode` | `readonly secondCode?: string;` |
| `modifiers` | `readonly modifiers: readonly ('control' \| 'alt' \| 'shift' \| 'meta')[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## ShortcutBinding protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `ShortcutBinding`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ShortcutBinding {
    readonly code: string;
    readonly secondCode?: string;
    readonly modifiers: readonly ShortcutModifier[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `code` | `readonly code: string;` |
| `secondCode` | `readonly secondCode?: string;` |
| `modifiers` | `readonly modifiers: readonly ShortcutModifier[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ShortcutModifier = 'primary' | 'control' | 'alt' | 'shift' | 'meta'
```

## ShortcutCommandId protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `ShortcutCommandId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ShortcutCommandId = Branded<'ShortcutCommandId'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## ShortcutModifier protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `ShortcutModifier`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ShortcutModifier = 'primary' | 'control' | 'alt' | 'shift' | 'meta';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## ShortcutPlatform protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `ShortcutPlatform`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ShortcutPlatform = 'macos' | 'windows' | 'linux';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## ShortcutProfile protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `ShortcutProfile`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ShortcutProfile = `${ShortcutRuntime}:${ShortcutPlatform}`;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ShortcutPlatform = 'macos' | 'windows' | 'linux'

export type ShortcutRuntime = 'desktop' | 'web'
```

## ShortcutRuntime protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `ShortcutRuntime`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ShortcutRuntime = 'desktop' | 'web';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

## bindingKey protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `bindingKey`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function bindingKey(binding: NormalizedBinding): string;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface NormalizedBinding {
  readonly code: string
  readonly secondCode?: string
  readonly modifiers: readonly ('control' | 'alt' | 'shift' | 'meta')[]
}
```

## isWebBindingAllowed protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `isWebBindingAllowed`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function isWebBindingAllowed(binding: NormalizedBinding, platform: ShortcutPlatform): boolean;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ShortcutPlatform = 'macos' | 'windows' | 'linux'

export interface NormalizedBinding {
  readonly code: string
  readonly secondCode?: string
  readonly modifiers: readonly ('control' | 'alt' | 'shift' | 'meta')[]
}
```

## normalizeBinding protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `normalizeBinding`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function normalizeBinding(binding: ShortcutBinding, platform: ShortcutPlatform): NormalizedBinding;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ShortcutPlatform = 'macos' | 'windows' | 'linux'

export interface ShortcutBinding {
  readonly code: string
  readonly secondCode?: string
  readonly modifiers: readonly ShortcutModifier[]
}

export interface NormalizedBinding {
  readonly code: string
  readonly secondCode?: string
  readonly modifiers: readonly ('control' | 'alt' | 'shift' | 'meta')[]
}

export type ShortcutModifier = 'primary' | 'control' | 'alt' | 'shift' | 'meta'
```

## presentBinding protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `presentBinding`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function presentBinding(binding: NormalizedBinding | null, platform: ShortcutPlatform): {
    keys: readonly string[];
    aria: string | undefined;
};
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type ShortcutPlatform = 'macos' | 'windows' | 'linux'

export interface NormalizedBinding {
  readonly code: string
  readonly secondCode?: string
  readonly modifiers: readonly ('control' | 'alt' | 'shift' | 'meta')[]
}
```
