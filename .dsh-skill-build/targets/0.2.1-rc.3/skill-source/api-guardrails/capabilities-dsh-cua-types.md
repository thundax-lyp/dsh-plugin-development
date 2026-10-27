# dsh-cua-types 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 types 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-cua.md)；本页逐项保留对象的参数、字段和判别分支。

## CuaActionResult（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaActionResult = z.output<typeof ActionResult>;
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaActionResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaApi（./api）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CuaApi {
    getCapabilities(options?: CuaObservationOptions): Promise<CuaCapabilities>;
    listApps(options?: CuaObservationOptions): Promise<CuaAppInfo[]>;
    findApps(query: string, options?: CuaObservationOptions): Promise<CuaFoundAppInfo[]>;
    getState(options?: CuaObservationOptions): Promise<{
        apps: CuaAppInfo[];
        browsers: [
        ];
    }>;
    getApp(selector: string): Promise<CuaApp>;
}
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaApi`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`findApps`、`getApp`、`getCapabilities`、`getState`、`listApps`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaApp（./api）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CuaApp extends CuaSurface {
    readonly pid: number;
    readonly appHandle: CuaAppHandle;
    activate(): Promise<CuaActionResult>;
    getWindows(options?: CuaObservationOptions): Promise<CuaWindowInfo[]>;
    getWindow(windowId: number): Promise<CuaWindow>;
    typeText(text: string): Promise<CuaActionResult>;
    paste(text: string, options?: CuaPasteOptions): Promise<CuaActionResult>;
    pressKey(key: string): Promise<CuaActionResult>;
}
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaApp`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`activate`、`appHandle`、`click`、`drag`、`getAXState`、`getAXStateAndScreenshot`、`getScreenshot`、`getWindow`、`getWindows`、`hover`、`paste`、`performSecondaryAction`、`pid`、`pressKey`、`scroll`、`selectText`、`setValue`、`show`、`typeText`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaAppHandle（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaAppHandle = Branded<'CuaAppHandle'>;
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaAppHandle`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaAppInfo（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaAppInfo = Pick<Extract<CuaFoundAppInfo, {
    isRunning: true;
}>, 'id' | 'displayName' | 'isRunning' | 'pid'>;
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaAppInfo`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaAxOptions（./api）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CuaAxOptions extends CuaObservationOptions {
    disableDiffing?: boolean;
    includeMenus?: boolean;
    details?: boolean;
}
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaAxOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`details`、`disableDiffing`、`emit`、`includeMenus`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaBounds（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaBounds = CuaWindowInfo['bounds'];
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaBounds`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaCapabilities（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaCapabilities = z.output<typeof CapabilitiesResult>;
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaCapabilities`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaClickOptions（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaClickOptions = Pick<CuaParameters<'click'>, 'mouseButton' | 'clickCount' | 'modifiers'> & CuaCoordinateOptions;
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaClickOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`relative`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaCoordinateOptions（./api）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CuaCoordinateOptions {
    relative?: boolean;
}
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaCoordinateOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`relative`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaDispatch（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaDispatch = (operation: CuaOperation) => Promise<JsonValue>;
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaDispatch`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaDragOptions（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaDragOptions = Pick<CuaParameters<'drag'>, 'mouseButton' | 'modifiers'> & CuaCoordinateOptions;
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaDragOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`relative`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaFoundAppInfo（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaFoundAppInfo = z.output<typeof FoundAppsResult>[number];
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaFoundAppInfo`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaHoverResult（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaHoverResult = z.output<typeof HoverResult>;
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaHoverResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaMouseButton（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaMouseButton = NonNullable<CuaParameters<'click'>['mouseButton']>;
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaMouseButton`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaObservation（./api）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CuaObservation {
    state: string;
    screenshot: CuaScreenshot;
}
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaObservation`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`screenshot`、`state`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaObservationOptions（./api）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CuaObservationOptions {
    emit?: boolean;
}
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaObservationOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`emit`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaObservationSink（./api）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CuaObservationSink {
    text(value: string): void | Promise<void>;
    image(screenshot: CuaScreenshot): void | Promise<void>;
}
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaObservationSink`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`image`、`text`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaOperation（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaOperation = z.output<typeof Request>;
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaOperation`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaPasteOptions（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaPasteOptions = Pick<CuaParameters<'paste'>, 'format'>;
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaPasteOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaPointerModifier（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaPointerModifier = NonNullable<CuaParameters<'click'>['modifiers']>[number];
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaPointerModifier`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaScreenshot（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaScreenshot = Pick<z.output<typeof ScreenshotResult>, 'mimeType' | 'pixelWidth' | 'pixelHeight' | 'windowId'> & {
    bytes: Uint8Array;
};
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaScreenshot`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`bytes`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaScrollOptions（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaScrollOptions = Pick<CuaParameters<'scroll'>, 'x' | 'y' | 'deltaLinesX' | 'deltaLinesY'> & CuaCoordinateOptions;
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaScrollOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`relative`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaSelectTextOptions（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaSelectTextOptions = Pick<CuaParameters<'selectText'>, 'prefix' | 'suffix' | 'selectionType'>;
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaSelectTextOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaShowResult（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaShowResult = z.output<typeof ShowResult>;
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaShowResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaSnapshotId（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaSnapshotId = Branded<'CuaSnapshotId'>;
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaSnapshotId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaSurface（./api）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CuaSurface {
    show(): Promise<CuaShowResult>;
    getAXState(options?: CuaAxOptions): Promise<string>;
    getScreenshot(options?: CuaObservationOptions): Promise<CuaScreenshot>;
    getAXStateAndScreenshot(options?: CuaAxOptions): Promise<CuaObservation>;
    hover(target: number | readonly [
        number,
        number
    ], options?: CuaCoordinateOptions): Promise<CuaHoverResult>;
    click(target: number | readonly [
        number,
        number
    ], options?: CuaClickOptions): Promise<CuaActionResult>;
    setValue(index: number, value: string): Promise<CuaActionResult>;
    selectText(index: number, text: string, options?: CuaSelectTextOptions): Promise<CuaActionResult>;
    performSecondaryAction(index: number, action: string): Promise<CuaActionResult>;
    scroll(options: CuaScrollOptions): Promise<CuaActionResult>;
    drag(from: readonly [
        number,
        number
    ], to: readonly [
        number,
        number
    ], options?: CuaDragOptions): Promise<CuaActionResult>;
}
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaSurface`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`click`、`drag`、`getAXState`、`getAXStateAndScreenshot`、`getScreenshot`、`hover`、`performSecondaryAction`、`scroll`、`selectText`、`setValue`、`show`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaWindow（./api）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CuaWindow extends CuaSurface {
    readonly windowId: number;
}
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaWindow`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`click`、`drag`、`getAXState`、`getAXStateAndScreenshot`、`getScreenshot`、`hover`、`performSecondaryAction`、`scroll`、`selectText`、`setValue`、`show`、`windowId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaWindowInfo（./api）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CuaWindowInfo = z.output<typeof WindowsResult>[number];
```

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`CuaWindowInfo`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。
