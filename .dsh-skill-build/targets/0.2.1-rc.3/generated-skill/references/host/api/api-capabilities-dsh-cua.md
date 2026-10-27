# @deepseek-ai/dsh-cua 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

检查应用、跨 PTC 调用保留窗口对象，并通过正常工具执行链发送动作。平台提供方负责原生执行；本库负责对象 API、请求校验、应用授权和图像接纳。变量持久性由外部 PTC 运行时负责。

### 使用本包

挂载 macOS 提供方以启用原生操作。外部 PTC 宿主从 `@deepseek-ai/dsh-cua/bridge` 导入 `connectCua`，并提供当前 `tools.cua` 绑定。源码组合与原生组件准备由提供方负责。

单窗口任务直接使用 App 方法。`getApp` 读取初始辅助功能状态；需要指定窗口时使用 `getWindows` 和 `getWindow`。重新读取一个应用或窗口范围会替换其中的元素编号，不使其他窗口的快照失效。键盘输入跟随应用焦点。请求参数校验失败时，在分派前返回包含方法、参数和要求的可读消息。

观察方法会输出并返回结果。使用 `void await app.getAXState()` 只展示一份内容，或使用 `emit:false` 后打印一次返回文本。截图返回包含 `bytes`、`mimeType`、`pixelWidth`、`pixelHeight` 和 `windowId` 的 `CuaScreenshot`，图片输出回调接收同一个对象。选择文件后缀或声明图片时使用其中的 MIME 类型；格式可能是 PNG、JPEG、WebP 或 GIF。每张截图只进入一次附件处理链；`emit:false` 只抑制对象层的输出。

`tools.cua` 直接返回操作结果。截图结果保留图片 Base64，并增加供工具渲染使用的持久 `attachment` 引用；模型内容只包含坐标元数据和一张图片，不包含编码字节。截图前要求附件服务可用，并确认当前模型支持图片输入。图片接入或保存失败会拒绝调用。对象桥接保留截图字节和已校验的元数据，不重复上传或输出同一张图片。

应用授权发生在启动、观察、截图和输入之前。任务许可绑定已选择的应用实例；长期许可要求平台验证可执行文件身份。撤销会关闭受影响的 Agent 连接，因此旧对象必须重新选择目标。取消、超时或重新连接后均不重放输入。

动作返回 `dispatched:true, verified:false`；请读取新状态以验证结果。坐标操作默认使用最近返回截图中的像素；成功观察窗口后，传入 `relative: true` 可使用 0～1000 的整数比例。Host 在返回截图前解析附件归一化和当前模型的图片缩放规则，再将输入换算为原生窗口 point。窗口尺寸变化会使截图映射失效，绝对坐标遇到 `SCREENSHOT_REQUIRED` 时需要重新截图。窗口缩放后以 `WINDOW_CHANGED` 拒绝旧坐标；单纯移动窗口不改变窗口内坐标。

-----

### 已知限制与后续工作

- 当前原生执行使用 macOS 提供方。Windows 支持计划使用独立的提供方包和 C# helper，保留共享应用与窗口 API、授权、快照有效性和动作结果语义。实现须说明系统特有的限制，并区分交叉编译证据和 Windows 桌面验证。
- 持久变量不会在一组连续操作期间独占应用。其他 Agent 和用户可能改变其状态。 悬停和观察不恢复先前的鼠标位置；连续交互不分配跨调用所有权。
- 本包保留在 `experimental`，Windows 支持和平台验证完成后可迁至 `computer-use` 组。

-----

## CuaBackend（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CuaBackend {
    helperPath: string;
    createChannel: NativeChannelFactory;
    guidance: string;
    description: string;
}
```

公开导入：`@deepseek-ai/dsh-cua`；公开符号：`CuaBackend`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`createChannel`、`description`、`guidance`、`helperPath`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CuaConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
interface CuaConfig {
    allowedApps: Volatile<Array<Omit<CuaApplicationGrant, 'id'> & {
        id: string;
    }>>;
    helperPath?: string;
    buildTimeoutMs: number;
    timeoutMs: number;
    connectTimeoutMs: number;
    screenshotTimeoutMs: number;
    axTimeoutMs: number;
    maxResponseBytes: number;
    maxAppMatches: number;
    maxClipboardBytes: number;
    pasteReadTimeoutMs: number;
    maxRequestBytes: number;
    dragDurationMs: number;
    dragSteps: number;
    textEventIntervalMs: number;
    graceMs: number;
    maxElements: number;
    maxDepth: number;
}
```

公开导入：`@deepseek-ai/dsh-cua`；公开符号：`CuaConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

公开声明（保留类型空间与值空间）：

```text
export interface CuaConfig {
    allowedApps: Volatile<Array<Omit<CuaApplicationGrant, 'id'> & {
        id: string;
    }>>;
    helperPath?: string;
    buildTimeoutMs: number;
    timeoutMs: number;
    connectTimeoutMs: number;
    screenshotTimeoutMs: number;
    axTimeoutMs: number;
    maxResponseBytes: number;
    maxAppMatches: number;
    maxClipboardBytes: number;
    pasteReadTimeoutMs: number;
    maxRequestBytes: number;
    dragDurationMs: number;
    dragSteps: number;
    textEventIntervalMs: number;
    graceMs: number;
    maxElements: number;
    maxDepth: number;
}

export declare const CuaConfig: Schema<Schemastery.ObjectS<NoInfer<{
    allowedApps: Schema<NoInfer<({
        id?: string | null;
        name?: string | null;
        executablePath?: string | null;
    } & import("@deepseek-ai/cosmokit").Dict)[]>, NoInfer<Schemastery.ObjectT<NoInfer<{
        id: Schema<string, string, "defined">;
        name: Schema<string, string, "defined">;
        executablePath: Schema<string, string, "defined">;
    }>>[]>, "volatile-defined">;
    helperPath: Schema<string, string, "plain">;
    buildTimeoutMs: Schema<number, number, "defined">;
    timeoutMs: Schema<number, number, "defined">;
    connectTimeoutMs: Schema<number, number, "defined">;
    screenshotTimeoutMs: Schema<number, number, "defined">;
    axTimeoutMs: Schema<number, number, "defined">;
    maxAppMatches: Schema<number, number, "defined">;
    maxClipboardBytes: Schema<number, number, "defined">;
    pasteReadTimeoutMs: Schema<number, number, "defined">;
    maxRequestBytes: Schema<number, number, "defined">;
    dragDurationMs: Schema<number, number, "defined">;
    dragSteps: Schema<number, number, "defined">;
    maxResponseBytes: Schema<number, number, "defined">;
    textEventIntervalMs: Schema<number, number, "defined">;
    graceMs: Schema<number, number, "defined">;
    maxElements: Schema<number, number, "defined">;
    maxDepth: Schema<number, number, "defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    allowedApps: Schema<NoInfer<({
        id?: string | null;
        name?: string | null;
        executablePath?: string | null;
    } & import("@deepseek-ai/cosmokit").Dict)[]>, NoInfer<Schemastery.ObjectT<NoInfer<{
        id: Schema<string, string, "defined">;
        name: Schema<string, string, "defined">;
        executablePath: Schema<string, string, "defined">;
    }>>[]>, "volatile-defined">;
    helperPath: Schema<string, string, "plain">;
    buildTimeoutMs: Schema<number, number, "defined">;
    timeoutMs: Schema<number, number, "defined">;
    connectTimeoutMs: Schema<number, number, "defined">;
    screenshotTimeoutMs: Schema<number, number, "defined">;
    axTimeoutMs: Schema<number, number, "defined">;
    maxAppMatches: Schema<number, number, "defined">;
    maxClipboardBytes: Schema<number, number, "defined">;
    pasteReadTimeoutMs: Schema<number, number, "defined">;
    maxRequestBytes: Schema<number, number, "defined">;
    dragDurationMs: Schema<number, number, "defined">;
    dragSteps: Schema<number, number, "defined">;
    maxResponseBytes: Schema<number, number, "defined">;
    textEventIntervalMs: Schema<number, number, "defined">;
    graceMs: Schema<number, number, "defined">;
    maxElements: Schema<number, number, "defined">;
    maxDepth: Schema<number, number, "defined">;
}>>, "plain">;
```

同名导出同时提供类型与运行时值；使用 `import type` 引入配置类型，使用普通 `import` 引入运行时 schema，不能当作文本常量。

成员检索：`allowedApps`、`axTimeoutMs`、`buildTimeoutMs`、`connectTimeoutMs`、`dragDurationMs`、`dragSteps`、`graceMs`、`helperPath`、`maxAppMatches`、`maxClipboardBytes`、`maxDepth`、`maxElements`、`maxRequestBytes`、`maxResponseBytes`、`pasteReadTimeoutMs`、`screenshotTimeoutMs`、`textEventIntervalMs`、`timeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## installCua（.）

公开导入：`@deepseek-ai/dsh-cua`；公开符号：`installCua`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function installCua(ctx: Context, config: CuaConfig, backend: CuaBackend): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

相关对象：[types](api-capabilities-dsh-cua-types.md)。

相关对象：[api](api-capabilities-dsh-cua-api.md)。

相关对象：[bridge](api-capabilities-dsh-cua-bridge.md)。

相关对象：[native-client](api-capabilities-dsh-cua-native-client.md)。

相关对象：[protocol](api-capabilities-dsh-cua-protocol.md)。
