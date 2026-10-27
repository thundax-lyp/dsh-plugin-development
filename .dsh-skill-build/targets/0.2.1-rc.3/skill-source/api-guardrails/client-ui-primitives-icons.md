# ui-primitives：icons 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

这些是 React 展示原语，不读取 Cordis、Session 或应用语言；文案必须由调用方以 labels 等 props 传入。控件本身不会注册 slot，直接导入组件也不会让它出现在 DSH 页面。打开状态、表单值和业务请求由调用方持有；React 卸载清理原语自己的 DOM 监听、观察器和 portal，调用方仍须取消自己的异步任务。样式使用 `--dsw-*` tokens，应在现有 DSH Web shell 中呈现。

## ICON_MEDIUM_STROKE root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `ICON_MEDIUM_STROKE`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const ICON_MEDIUM_STROKE = 1.3;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## ICON_REGULAR_STROKE root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `ICON_REGULAR_STROKE`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const ICON_REGULAR_STROKE = 1;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconAgentPresetOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconAgentPresetOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconAgentPresetOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconAgentPresetOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconAgentPresetOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconAgentPresetOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconAlarmClockOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconAlarmClockOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconAlarmClockOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconAlarmClockOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconAlarmClockOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconAlarmClockOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconApiOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconApiOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconApiOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconApiOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconApiOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconApiOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconAppsAddOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconAppsAddOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconAppsAddOutlineMedium: (props: AppsAddIconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
type AppsAddIconProps = IconProps & { readonly compact?: boolean | undefined }
```

## IconAppsAddOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconAppsAddOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconAppsAddOutlineRegular: (props: AppsAddIconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
type AppsAddIconProps = IconProps & { readonly compact?: boolean | undefined }
```

## IconArchiveCheckOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconArchiveCheckOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconArchiveCheckOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconArchiveCheckOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconArchiveCheckOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconArchiveCheckOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconArchiveOffOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconArchiveOffOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconArchiveOffOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconArchiveOffOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconArchiveOffOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconArchiveOffOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconArchiveOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconArchiveOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconArchiveOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconArchiveOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconArchiveOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconArchiveOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconBranchOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconBranchOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconBranchOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconBranchOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconBranchOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconBranchOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconBrowseOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconBrowseOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconBrowseOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconBrowseOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconBrowseOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconBrowseOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCheckCircleFillMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCheckCircleFillMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCheckCircleFillMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCheckCircleFillRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCheckCircleFillRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCheckCircleFillRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCheckCircleOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCheckCircleOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCheckCircleOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCheckCircleOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCheckCircleOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCheckCircleOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCheckOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCheckOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCheckOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCheckOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCheckOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCheckOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconChecklistOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconChecklistOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconChecklistOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconChecklistOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconChecklistOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconChecklistOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconChevronDownOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconChevronDownOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconChevronDownOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconChevronDownOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconChevronDownOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconChevronDownOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconChevronLeftOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconChevronLeftOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconChevronLeftOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconChevronLeftOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconChevronLeftOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconChevronLeftOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconChevronRightOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconChevronRightOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconChevronRightOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconChevronRightOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconChevronRightOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconChevronRightOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconChevronUpOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconChevronUpOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconChevronUpOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconChevronUpOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconChevronUpOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconChevronUpOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconChevronsUpDownOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconChevronsUpDownOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconChevronsUpDownOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconChevronsUpDownOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconChevronsUpDownOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconChevronsUpDownOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconClockOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconClockOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconClockOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconClockOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconClockOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconClockOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCloseCircleFillMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCloseCircleFillMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCloseCircleFillMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCloseCircleFillRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCloseCircleFillRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCloseCircleFillRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCloseFillMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCloseFillMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCloseFillMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCloseFillRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCloseFillRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCloseFillRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCloseOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCloseOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCloseOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCloseOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCloseOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCloseOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCodeOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCodeOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCodeOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCodeOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCodeOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCodeOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCompactOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCompactOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCompactOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCompactOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCompactOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCompactOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCompareSplitOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCompareSplitOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCompareSplitOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCompareSplitOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCompareSplitOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCompareSplitOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconContextInjectionOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconContextInjectionOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconContextInjectionOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconContextInjectionOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconContextInjectionOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconContextInjectionOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCopyOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCopyOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCopyOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCopyOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCopyOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCopyOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCordisPluginOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCordisPluginOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCordisPluginOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconCordisPluginOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconCordisPluginOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconCordisPluginOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconDarkOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconDarkOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconDarkOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconDarkOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconDarkOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconDarkOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconDataOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconDataOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconDataOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconDataOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconDataOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconDataOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconDatabaseOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconDatabaseOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconDatabaseOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconDatabaseOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconDatabaseOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconDatabaseOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconDeliverDocMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconDeliverDocMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconDeliverDocMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconDeliverDocRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconDeliverDocRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconDeliverDocRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconDislikeFillMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconDislikeFillMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconDislikeFillMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconDislikeFillRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconDislikeFillRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconDislikeFillRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconDislikeOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconDislikeOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconDislikeOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconDislikeOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconDislikeOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconDislikeOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconDownloadOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconDownloadOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconDownloadOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconDownloadOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconDownloadOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconDownloadOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconEditOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconEditOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconEditOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconEditOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconEditOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconEditOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconEllipsisOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconEllipsisOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconEllipsisOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconEllipsisOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconEllipsisOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconEllipsisOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconEnhanceOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconEnhanceOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconEnhanceOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconEnhanceOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconEnhanceOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconEnhanceOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconFlatListOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconFlatListOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconFlatListOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconFlatListOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconFlatListOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconFlatListOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconFolderCloseMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconFolderCloseMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconFolderCloseMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconFolderCloseRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconFolderCloseRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconFolderCloseRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconFolderOpenMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconFolderOpenMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconFolderOpenMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconFolderOpenOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconFolderOpenOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconFolderOpenOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconFolderOpenOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconFolderOpenOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconFolderOpenOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconFolderOpenRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconFolderOpenRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconFolderOpenRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconFollowsystemOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconFollowsystemOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconFollowsystemOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconFollowsystemOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconFollowsystemOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconFollowsystemOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconFullscreenOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconFullscreenOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconFullscreenOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconFullscreenOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconFullscreenOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconFullscreenOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconGaugeOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconGaugeOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconGaugeOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconGaugeOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconGaugeOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconGaugeOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconGlobeOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconGlobeOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconGlobeOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconGlobeOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconGlobeOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconGlobeOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconGoalOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconGoalOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconGoalOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconGoalOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconGoalOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconGoalOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconInfoOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconInfoOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconInfoOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconInfoOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconInfoOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconInfoOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconInspectOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconInspectOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconInspectOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconInspectOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconInspectOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconInspectOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconLightOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconLightOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconLightOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconLightOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconLightOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconLightOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconLikeFillMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconLikeFillMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconLikeFillMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconLikeFillRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconLikeFillRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconLikeFillRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconLikeOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconLikeOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconLikeOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconLikeOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconLikeOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconLikeOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconLinkOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconLinkOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconLinkOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconLinkOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconLinkOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconLinkOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconListPenOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconListPenOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconListPenOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconListPenOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconListPenOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconListPenOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconLoadingOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconLoadingOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconLoadingOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconLoadingOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconLoadingOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconLoadingOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconMicrophoneOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconMicrophoneOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconMicrophoneOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconMicrophoneOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconMicrophoneOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconMicrophoneOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconNewChatOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconNewChatOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconNewChatOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconNewChatOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconNewChatOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconNewChatOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconNowrapFillMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconNowrapFillMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconNowrapFillMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconNowrapFillRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconNowrapFillRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconNowrapFillRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPanelLeftOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPanelLeftOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPanelLeftOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPanelLeftOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPanelLeftOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPanelLeftOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPaperPlaneOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPaperPlaneOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPaperPlaneOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPaperPlaneOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPaperPlaneOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPaperPlaneOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPaperclipOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPaperclipOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPaperclipOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPaperclipOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPaperclipOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPaperclipOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPauseOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPauseOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPauseOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPauseOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPauseOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPauseOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPersonalizationOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPersonalizationOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPersonalizationOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPersonalizationOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPersonalizationOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPersonalizationOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPinFillMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPinFillMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPinFillMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPinFillRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPinFillRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPinFillRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPinOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPinOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPinOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPinOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPinOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPinOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPlanOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPlanOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPlanOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPlanOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPlanOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPlanOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPlayOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPlayOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPlayOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPlayOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPlayOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPlayOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPluginPinwheelOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPluginPinwheelOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPluginPinwheelOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPluginPinwheelOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPluginPinwheelOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPluginPinwheelOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPlusOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPlusOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPlusOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconPlusOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconPlusOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconPlusOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconProjectAddOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconProjectAddOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconProjectAddOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconProjectAddOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconProjectAddOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconProjectAddOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconProps root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface IconProps {
    size?: number | undefined;
    className?: string | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `size` | `size?: number \| undefined;` |
| `className` | `className?: string \| undefined;` |

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconQuestionOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconQuestionOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconQuestionOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconQuestionOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconQuestionOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconQuestionOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconQueueOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconQueueOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconQueueOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconQueueOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconQueueOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconQueueOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconRefreshOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconRefreshOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconRefreshOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconRefreshOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconRefreshOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconRefreshOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconRightUpOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconRightUpOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconRightUpOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconRightUpOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconRightUpOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconRightUpOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconSearchOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconSearchOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconSearchOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconSearchOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconSearchOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconSearchOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconSendOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconSendOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconSendOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconSendOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconSendOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconSendOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconSettingsOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconSettingsOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconSettingsOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconSettingsOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconSettingsOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconSettingsOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconShareOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconShareOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconShareOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconShareOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconShareOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconShareOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconShieldOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconShieldOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconShieldOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconShieldOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconShieldOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconShieldOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconSkillOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconSkillOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconSkillOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconSkillOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconSkillOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconSkillOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconSlidersTwoOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconSlidersTwoOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconSlidersTwoOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconSlidersTwoOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconSlidersTwoOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconSlidersTwoOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconSparkleMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconSparkleMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconSparkleMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconSparkleRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconSparkleRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconSparkleRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconStopFillMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconStopFillMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconStopFillMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconStopFillRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconStopFillRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconStopFillRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconThinkOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconThinkOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconThinkOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconThinkOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconThinkOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconThinkOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconTrashOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconTrashOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconTrashOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconTrashOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconTrashOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconTrashOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconTreeCornerMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconTreeCornerMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconTreeCornerMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconTreeCornerRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconTreeCornerRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconTreeCornerRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconTriangleRightFillMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconTriangleRightFillMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconTriangleRightFillMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconTriangleRightFillRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconTriangleRightFillRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconTriangleRightFillRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconUnarchiveOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconUnarchiveOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconUnarchiveOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconUnarchiveOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconUnarchiveOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconUnarchiveOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconUserOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconUserOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconUserOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconUserOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconUserOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconUserOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconUsersOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconUsersOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconUsersOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconUsersOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconUsersOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconUsersOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconWarningOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconWarningOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconWarningOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconWarningOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconWarningOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconWarningOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconWarningTriangleOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconWarningTriangleOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconWarningTriangleOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconWarningTriangleOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconWarningTriangleOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconWarningTriangleOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconWorkspaceTreeOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconWorkspaceTreeOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconWorkspaceTreeOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconWorkspaceTreeOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconWorkspaceTreeOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconWorkspaceTreeOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconWrapFillMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconWrapFillMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconWrapFillMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconWrapFillRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconWrapFillRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconWrapFillRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconWrapLinesOutlineMedium root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconWrapLinesOutlineMedium`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconWrapLinesOutlineMedium: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## IconWrapLinesOutlineRegular root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `IconWrapLinesOutlineRegular`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const IconWrapLinesOutlineRegular: (props: IconProps) => import("react").JSX.Element;
```

这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## SHIELD_OUTLINE_PATH root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SHIELD_OUTLINE_PATH`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const SHIELD_OUTLINE_PATH = "M6.80132 2.14853C7.70663 1.80917 8.70422 1.80919 9.60952 2.14859L14.1296 3.84317V7.11961C14.1296 11.6089 10.7615 13.5975 8.20543 14.5779C5.64931 13.5975 2.28052 11.6089 2.28052 7.11961V3.84317L6.80132 2.14853Z";
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。
