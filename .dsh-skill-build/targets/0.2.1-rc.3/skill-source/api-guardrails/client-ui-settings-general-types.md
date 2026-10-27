# ui-settings-general：types 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-settings-general 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## DesktopUpdateBridge types

入口 `@deepseek-ai/dsh-client-ui-settings-general/types`，公开符号 `DesktopUpdateBridge`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DesktopUpdateBridge {
    status(): Promise<DesktopUpdatePresentation>;
    open(): Promise<void>;
    subscribe(listener: (state: DesktopUpdatePresentation) => void): () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `status` | `status(): Promise<DesktopUpdatePresentation>;` |
| `open` | `open(): Promise<void>;` |
| `subscribe` | `subscribe(listener: (state: DesktopUpdatePresentation) => void): () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-general.md#接入-ui-settings-general) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface DesktopUpdatePresentation {
  readonly phase: 'idle' | 'checking' | 'available' | 'downloading' | 'verifying' | 'installing' | 'ready' | 'error'
  readonly version?: string
  readonly percent?: number
  readonly failure?: DesktopUpdateFailureKind
}

export type DesktopUpdateFailureKind =
  | 'check'
  | 'check-network'
  | 'download'
  | 'download-network'
  | 'install'
  | 'install-network'
  | 'stop-failed'
  | 'tasks-changed'
  | 'tasks-unavailable'
```

## DesktopUpdateFailureKind types

入口 `@deepseek-ai/dsh-client-ui-settings-general/types`，公开符号 `DesktopUpdateFailureKind`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DesktopUpdateFailureKind = 'check' | 'check-network' | 'download' | 'download-network' | 'install' | 'install-network' | 'stop-failed' | 'tasks-changed' | 'tasks-unavailable';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-general.md#接入-ui-settings-general) 在真实装载路径检验成功、失败与卸载。

## DesktopUpdatePresentation types

入口 `@deepseek-ai/dsh-client-ui-settings-general/types`，公开符号 `DesktopUpdatePresentation`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DesktopUpdatePresentation {
    readonly phase: 'idle' | 'checking' | 'available' | 'downloading' | 'verifying' | 'installing' | 'ready' | 'error';
    readonly version?: string;
    readonly percent?: number;
    readonly failure?: DesktopUpdateFailureKind;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `phase` | `readonly phase: 'idle' \| 'checking' \| 'available' \| 'downloading' \| 'verifying' \| 'installing' \| 'ready' \| 'error';` |
| `version` | `readonly version?: string;` |
| `percent` | `readonly percent?: number;` |
| `failure` | `readonly failure?: DesktopUpdateFailureKind;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-general.md#接入-ui-settings-general) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type DesktopUpdateFailureKind =
  | 'check'
  | 'check-network'
  | 'download'
  | 'download-network'
  | 'install'
  | 'install-network'
  | 'stop-failed'
  | 'tasks-changed'
  | 'tasks-unavailable'
```

## DesktopUpdateView types

入口 `@deepseek-ai/dsh-client-ui-settings-general/types`，公开符号 `DesktopUpdateView`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DesktopUpdateView {
    readonly presentation?: DesktopUpdatePresentation;
    readonly failed: boolean;
    readonly opening: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `presentation` | `readonly presentation?: DesktopUpdatePresentation;` |
| `failed` | `readonly failed: boolean;` |
| `opening` | `readonly opening: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-general.md#接入-ui-settings-general) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface DesktopUpdatePresentation {
  readonly phase: 'idle' | 'checking' | 'available' | 'downloading' | 'verifying' | 'installing' | 'ready' | 'error'
  readonly version?: string
  readonly percent?: number
  readonly failure?: DesktopUpdateFailureKind
}

export type DesktopUpdateFailureKind =
  | 'check'
  | 'check-network'
  | 'download'
  | 'download-network'
  | 'install'
  | 'install-network'
  | 'stop-failed'
  | 'tasks-changed'
  | 'tasks-unavailable'
```
