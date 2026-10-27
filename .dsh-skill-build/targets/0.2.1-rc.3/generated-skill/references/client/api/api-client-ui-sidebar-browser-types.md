# ui-sidebar-browser：types 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-sidebar-browser 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## DesktopBrowserBridge types

入口 `@deepseek-ai/dsh-client-ui-sidebar-browser/types`，公开符号 `DesktopBrowserBridge`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DesktopBrowserBridge {
    acquire(workspace: string): Promise<DesktopBrowserReservation>;
    release(lease: DesktopBrowserLeaseId): Promise<void>;
    onOpenRequested(lease: DesktopBrowserLeaseId, listener: (url: string) => void): () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `acquire` | `acquire(workspace: string): Promise<DesktopBrowserReservation>;` |
| `release` | `release(lease: DesktopBrowserLeaseId): Promise<void>;` |
| `onOpenRequested` | `onOpenRequested(lease: DesktopBrowserLeaseId, listener: (url: string) => void): () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-browser.md#接入-ui-sidebar-browser) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type DesktopBrowserLeaseId = Branded<'DesktopBrowserLeaseId'>

export interface DesktopBrowserReservation {
  readonly lease: DesktopBrowserLeaseId
  readonly partition: string
}
```

## DesktopBrowserLeaseId types

入口 `@deepseek-ai/dsh-client-ui-sidebar-browser/types`，公开符号 `DesktopBrowserLeaseId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DesktopBrowserLeaseId = Branded<'DesktopBrowserLeaseId'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-browser.md#接入-ui-sidebar-browser) 在真实装载路径检验成功、失败与卸载。

## DesktopBrowserOpenRequest types

入口 `@deepseek-ai/dsh-client-ui-sidebar-browser/types`，公开符号 `DesktopBrowserOpenRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DesktopBrowserOpenRequest {
    readonly lease: DesktopBrowserLeaseId;
    readonly url: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `lease` | `readonly lease: DesktopBrowserLeaseId;` |
| `url` | `readonly url: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-browser.md#接入-ui-sidebar-browser) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type DesktopBrowserLeaseId = Branded<'DesktopBrowserLeaseId'>
```

## DesktopBrowserReservation types

入口 `@deepseek-ai/dsh-client-ui-sidebar-browser/types`，公开符号 `DesktopBrowserReservation`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DesktopBrowserReservation {
    readonly lease: DesktopBrowserLeaseId;
    readonly partition: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `lease` | `readonly lease: DesktopBrowserLeaseId;` |
| `partition` | `readonly partition: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-browser.md#接入-ui-sidebar-browser) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type DesktopBrowserLeaseId = Branded<'DesktopBrowserLeaseId'>
```
