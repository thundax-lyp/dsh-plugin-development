# ui-plugin-manager：slot-contract 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-plugin-manager 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## ConfigPageForm client

入口 `@deepseek-ai/dsh-client-ui-plugin-manager/client`，公开符号 `ConfigPageForm`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConfigPageForm {
    readonly state: ConfigFormSnapshot<Record<string, unknown>>;
    readonly mutate: ConfigForm<Record<string, unknown>>['mutate'];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `state` | `readonly state: ConfigFormSnapshot<Record<string, unknown>>;` |
| `mutate` | `readonly mutate: ConfigForm<Record<string, unknown>>['mutate'];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-plugin-manager.md#接入-ui-plugin-manager) 在真实装载路径检验成功、失败与卸载。

## PluginActivationOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-plugin-manager/client`，公开符号 `PluginActivationOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PluginActivationOwnerProps {
    readonly packageName: string;
    readonly onDismiss: () => void;
    readonly onOpenDetails: () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `packageName` | `readonly packageName: string;` |
| `onDismiss` | `readonly onDismiss: () => void;` |
| `onOpenDetails` | `readonly onOpenDetails: () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-plugin-manager.md#接入-ui-plugin-manager) 在真实装载路径检验成功、失败与卸载。

## PluginAddActionsProps client

入口 `@deepseek-ai/dsh-client-ui-plugin-manager/client`，公开符号 `PluginAddActionsProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PluginAddActionsProps {
    readonly onDismiss: () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `onDismiss` | `readonly onDismiss: () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-plugin-manager.md#接入-ui-plugin-manager) 在真实装载路径检验成功、失败与卸载。

## PluginConfigViewProps client

入口 `@deepseek-ai/dsh-client-ui-plugin-manager/client`，公开符号 `PluginConfigViewProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PluginConfigViewProps {
    readonly view: 'summary' | 'page';
    readonly form?: ConfigPageForm | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `view` | `readonly view: 'summary' \| 'page';` |
| `form` | `readonly form?: ConfigPageForm \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-plugin-manager.md#接入-ui-plugin-manager) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConfigPageForm {

  readonly state: ConfigFormSnapshot<Record<string, unknown>>

  readonly mutate: ConfigForm<Record<string, unknown>>['mutate']
}
```

## PluginDetailProps client

入口 `@deepseek-ai/dsh-client-ui-plugin-manager/client`，公开符号 `PluginDetailProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PluginDetailProps {
    readonly subject: PluginsSubject;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `subject` | `readonly subject: PluginsSubject;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-plugin-manager.md#接入-ui-plugin-manager) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type PluginsSubject =
  | { readonly kind: 'bundle'; readonly pkg: PluginPackageRef }
  | { readonly kind: 'row'; readonly pkg: PluginPackageRef; readonly row: PluginRowRef }
  | { readonly kind: 'item'; readonly id: string }

export interface PluginRowRef {

  readonly rowId: string

  readonly moduleName: string

  readonly enabled: boolean
}

export interface PluginPackageRef {

  readonly name: string

  readonly version?: string

  readonly installed: boolean

  readonly availability: BundleInfo['availability']

  readonly official: boolean

  readonly enabled: boolean

  readonly rows: readonly PluginRowRef[]
}
```

## PluginPackageRef client

入口 `@deepseek-ai/dsh-client-ui-plugin-manager/client`，公开符号 `PluginPackageRef`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PluginPackageRef {
    readonly name: string;
    readonly version?: string;
    readonly installed: boolean;
    readonly availability: BundleInfo['availability'];
    readonly official: boolean;
    readonly enabled: boolean;
    readonly rows: readonly PluginRowRef[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `name` | `readonly name: string;` |
| `version` | `readonly version?: string;` |
| `installed` | `readonly installed: boolean;` |
| `availability` | `readonly availability: BundleInfo['availability'];` |
| `official` | `readonly official: boolean;` |
| `enabled` | `readonly enabled: boolean;` |
| `rows` | `readonly rows: readonly PluginRowRef[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-plugin-manager.md#接入-ui-plugin-manager) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface PluginRowRef {

  readonly rowId: string

  readonly moduleName: string

  readonly enabled: boolean
}
```

## PluginRowRef client

入口 `@deepseek-ai/dsh-client-ui-plugin-manager/client`，公开符号 `PluginRowRef`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PluginRowRef {
    readonly rowId: string;
    readonly moduleName: string;
    readonly enabled: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `rowId` | `readonly rowId: string;` |
| `moduleName` | `readonly moduleName: string;` |
| `enabled` | `readonly enabled: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-plugin-manager.md#接入-ui-plugin-manager) 在真实装载路径检验成功、失败与卸载。

## PluginTabInstall client

入口 `@deepseek-ai/dsh-client-ui-plugin-manager/client`，公开符号 `PluginTabInstall`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PluginTabInstall {
    readonly spec: string;
    readonly registry?: string;
    readonly title: string;
    readonly version: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `spec` | `readonly spec: string;` |
| `registry` | `readonly registry?: string;` |
| `title` | `readonly title: string;` |
| `version` | `readonly version: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-plugin-manager.md#接入-ui-plugin-manager) 在真实装载路径检验成功、失败与卸载。

## PluginTabProps client

入口 `@deepseek-ai/dsh-client-ui-plugin-manager/client`，公开符号 `PluginTabProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PluginTabProps {
    readonly install: (target: PluginTabInstall) => void;
    readonly openPackage: (packageName: string) => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `install` | `readonly install: (target: PluginTabInstall) => void;` |
| `openPackage` | `readonly openPackage: (packageName: string) => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-plugin-manager.md#接入-ui-plugin-manager) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface PluginTabInstall {

  readonly spec: string

  readonly registry?: string

  readonly title: string

  readonly version: string
}
```

## PluginsSubject client

入口 `@deepseek-ai/dsh-client-ui-plugin-manager/client`，公开符号 `PluginsSubject`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PluginsSubject = {
    readonly kind: 'bundle';
    readonly pkg: PluginPackageRef;
} | {
    readonly kind: 'row';
    readonly pkg: PluginPackageRef;
    readonly row: PluginRowRef;
} | {
    readonly kind: 'item';
    readonly id: string;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-plugin-manager.md#接入-ui-plugin-manager) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface PluginRowRef {

  readonly rowId: string

  readonly moduleName: string

  readonly enabled: boolean
}

export interface PluginPackageRef {

  readonly name: string

  readonly version?: string

  readonly installed: boolean

  readonly availability: BundleInfo['availability']

  readonly official: boolean

  readonly enabled: boolean

  readonly rows: readonly PluginRowRef[]
}
```
