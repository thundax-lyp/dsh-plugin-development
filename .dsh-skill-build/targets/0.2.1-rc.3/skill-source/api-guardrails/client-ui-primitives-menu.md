# ui-primitives：menu 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

这些是 React 展示原语，不读取 Cordis、Session 或应用语言；文案必须由调用方以 labels 等 props 传入。控件本身不会注册 slot，直接导入组件也不会让它出现在 DSH 页面。打开状态、表单值和业务请求由调用方持有；React 卸载清理原语自己的 DOM 监听、观察器和 portal，调用方仍须取消自己的异步任务。样式使用 `--dsw-*` tokens，应在现有 DSH Web shell 中呈现。

## Menu root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `Menu`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function Menu({ open, anchor, items, children, selectedId, selectedIds, onSelect, onClose, align, side, portal, closeOnPointerLeave, dense, compact, autoFocus, selection, getAnchorRect, minWidthFromAnchor, footer, className, listClassName }: {
    open: boolean;
    autoFocus?: boolean;
    anchor: ReactNode;
    items?: readonly MenuEntry[];
    children?: ReactNode;
    footer?: readonly MenuEntry[];
    selectedId?: string | undefined;
    selectedIds?: readonly string[] | undefined;
    onSelect?: (id: string) => void;
    onClose: () => void;
    align?: 'start' | 'end';
    side?: 'bottom' | 'top' | 'right';
    portal?: boolean;
    closeOnPointerLeave?: boolean;
    dense?: boolean;
    compact?: boolean;
    selection?: 'check' | 'fill';
    getAnchorRect?: () => DOMRect | null;
    minWidthFromAnchor?: boolean;
    className?: string | undefined;
    listClassName?: string | undefined;
}): import("react").JSX.Element;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type MenuEntry = MenuItem | MenuSeparator | MenuLabel

export interface MenuItem {
  id: string
  label: ReactNode
  disabled?: boolean

  shortcut?: { keys: readonly string[]; aria?: string | undefined }

  icon?: ReactNode

  danger?: boolean

  submenu?: readonly MenuItem[]
}

export interface MenuSeparator {
  type: 'separator'
  id: string
}

export interface MenuLabel {
  type: 'label'
  id: string
  text: string
}
```

## MenuEntry root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `MenuEntry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type MenuEntry = MenuItem | MenuSeparator | MenuLabel;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface MenuItem {
  id: string
  label: ReactNode
  disabled?: boolean

  shortcut?: { keys: readonly string[]; aria?: string | undefined }

  icon?: ReactNode

  danger?: boolean

  submenu?: readonly MenuItem[]
}

export interface MenuSeparator {
  type: 'separator'
  id: string
}

export interface MenuLabel {
  type: 'label'
  id: string
  text: string
}
```

## MenuItem root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `MenuItem`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface MenuItem {
    id: string;
    label: ReactNode;
    disabled?: boolean;
    shortcut?: {
        keys: readonly string[];
        aria?: string | undefined;
    };
    icon?: ReactNode;
    danger?: boolean;
    submenu?: readonly MenuItem[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `id: string;` |
| `label` | `label: ReactNode;` |
| `disabled` | `disabled?: boolean;` |
| `shortcut` | `shortcut?: { keys: readonly string[]; aria?: string \| undefined; };` |
| `icon` | `icon?: ReactNode;` |
| `danger` | `danger?: boolean;` |
| `submenu` | `submenu?: readonly MenuItem[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## MenuItemButton root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `MenuItemButton`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function MenuItemButton({ children, shortcut, icon, current, disabled, danger, separatorBefore, onSelect, }: MenuItemButtonProps): import("react").JSX.Element;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface MenuItemButtonProps {

  children: ReactNode

  shortcut?: MenuItem['shortcut']

  icon?: ReactNode

  current?: boolean

  disabled?: boolean

  danger?: boolean

  separatorBefore?: boolean

  onSelect: () => void
}

export interface MenuItem {
  id: string
  label: ReactNode
  disabled?: boolean

  shortcut?: { keys: readonly string[]; aria?: string | undefined }

  icon?: ReactNode

  danger?: boolean

  submenu?: readonly MenuItem[]
}
```

## MenuItemButtonProps root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `MenuItemButtonProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface MenuItemButtonProps {
    children: ReactNode;
    shortcut?: MenuItem['shortcut'];
    icon?: ReactNode;
    current?: boolean;
    disabled?: boolean;
    danger?: boolean;
    separatorBefore?: boolean;
    onSelect: () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `children` | `children: ReactNode;` |
| `shortcut` | `shortcut?: MenuItem['shortcut'];` |
| `icon` | `icon?: ReactNode;` |
| `current` | `current?: boolean;` |
| `disabled` | `disabled?: boolean;` |
| `danger` | `danger?: boolean;` |
| `separatorBefore` | `separatorBefore?: boolean;` |
| `onSelect` | `onSelect: () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface MenuItem {
  id: string
  label: ReactNode
  disabled?: boolean

  shortcut?: { keys: readonly string[]; aria?: string | undefined }

  icon?: ReactNode

  danger?: boolean

  submenu?: readonly MenuItem[]
}
```

## MenuLabel root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `MenuLabel`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface MenuLabel {
    type: 'label';
    id: string;
    text: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `type` | `type: 'label';` |
| `id` | `id: string;` |
| `text` | `text: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## MenuSeparator root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `MenuSeparator`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface MenuSeparator {
    type: 'separator';
    id: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `type` | `type: 'separator';` |
| `id` | `id: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。
