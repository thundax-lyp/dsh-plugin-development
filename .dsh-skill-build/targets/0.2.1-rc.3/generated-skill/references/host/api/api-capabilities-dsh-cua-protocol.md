# dsh-cua-protocol 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 protocol 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-cua.md)；本页逐项保留对象的参数、字段和判别分支。

## ActionResult（./protocol）

公开导入：`@deepseek-ai/dsh-cua/protocol`；公开符号：`ActionResult`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

完整公开声明：

```text
export declare const ActionResult: z.ZodObject<{
    dispatched: z.ZodLiteral<true>;
    verified: z.ZodLiteral<false>;
}, z.core.$strip>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## AppResult（./protocol）

公开导入：`@deepseek-ai/dsh-cua/protocol`；公开符号：`AppResult`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

完整公开声明：

```text
export declare const AppResult: z.ZodObject<{
    appHandle: z.ZodPipe<z.ZodString, z.ZodTransform<CuaAppHandle, string>>;
    pid: z.ZodNumber;
    name: z.ZodString;
    bundleId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## AppsResult（./protocol）

公开导入：`@deepseek-ai/dsh-cua/protocol`；公开符号：`AppsResult`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

完整公开声明：

```text
export declare const AppsResult: z.ZodArray<z.ZodObject<{
    pid: z.ZodNumber;
    name: z.ZodString;
    bundleId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## CapabilitiesResult（./protocol）

公开导入：`@deepseek-ai/dsh-cua/protocol`；公开符号：`CapabilitiesResult`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

完整公开声明：

```text
export declare const CapabilitiesResult: z.ZodObject<{
    platform: z.ZodString;
    permissions: z.ZodObject<{
        accessibility: z.ZodBoolean;
        screenRecording: z.ZodBoolean;
    }, z.core.$strip>;
    sessionLocked: z.ZodNullable<z.ZodBoolean>;
    methods: z.ZodArray<z.ZodString>;
    coordinateSpace: z.ZodLiteral<"screenshot-pixels">;
    browser: z.ZodLiteral<false>;
}, z.core.$strip>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## FoundAppsResult（./protocol）

公开导入：`@deepseek-ai/dsh-cua/protocol`；公开符号：`FoundAppsResult`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

完整公开声明：

```text
export declare const FoundAppsResult: z.ZodArray<z.ZodIntersection<z.ZodObject<{
    id: z.ZodString;
    displayName: z.ZodString;
    path: z.ZodString;
}, z.core.$strip>, z.ZodDiscriminatedUnion<[
    z.ZodObject<{
        isRunning: z.ZodLiteral<true>;
        pid: z.ZodNumber;
    }, z.core.$strip>,
    z.ZodObject<{
        isRunning: z.ZodLiteral<false>;
    }, z.core.$strip>
], "isRunning">>>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## HoverResult（./protocol）

公开导入：`@deepseek-ai/dsh-cua/protocol`；公开符号：`HoverResult`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

完整公开声明：

```text
export declare const HoverResult: z.ZodObject<{
    dispatched: z.ZodLiteral<true>;
    verified: z.ZodLiteral<false>;
    hoverRoute: z.ZodEnum<{
        accessibility: "accessibility";
        "system-pointer": "system-pointer";
    }>;
    systemPointerMoved: z.ZodBoolean;
}, z.core.$strip>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## NativeOnlyOperations（./protocol）

公开导入：`@deepseek-ai/dsh-cua/protocol`；公开符号：`NativeOnlyOperations`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

完整公开声明：

```text
export declare const NativeOnlyOperations: readonly [
    z.ZodObject<{
        method: z.ZodLiteral<"launchApp">;
        params: z.ZodObject<{
            appHandle: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>
];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## NativeResourceParameters（./protocol）

公开导入：`@deepseek-ai/dsh-cua/protocol`；公开符号：`NativeResourceParameters`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

完整公开声明：

```text
export declare const NativeResourceParameters: {
    getState: z.ZodObject<{
        maxElements: z.ZodNumber;
        maxDepth: z.ZodNumber;
    }, z.core.$strict>;
    drag: z.ZodObject<{
        durationMs: z.ZodNumber;
        steps: z.ZodNumber;
    }, z.core.$strict>;
    paste: z.ZodObject<{
        maxClipboardBytes: z.ZodNumber;
        pasteReadTimeoutMs: z.ZodNumber;
        maxElements: z.ZodNumber;
        maxDepth: z.ZodNumber;
    }, z.core.$strict>;
    findApps: z.ZodObject<{
        maxAppMatches: z.ZodNumber;
    }, z.core.$strict>;
};
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## NativeScreenshotResult（./protocol）

公开导入：`@deepseek-ai/dsh-cua/protocol`；公开符号：`NativeScreenshotResult`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

完整公开声明：

```text
export declare const NativeScreenshotResult: z.ZodObject<{
    mimeType: z.ZodLiteral<"image/png">;
    data: z.ZodString;
    pixelWidth: z.ZodNumber;
    pixelHeight: z.ZodNumber;
    windowId: z.ZodNumber;
    bounds: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, z.core.$strip>;
    coordinateSpace: z.ZodLiteral<"window-points">;
}, z.core.$strip>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## Request（./protocol）

公开导入：`@deepseek-ai/dsh-cua/protocol`；公开符号：`Request`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

公开声明（保留类型空间与值空间）：

```text
export declare const Request: z.ZodDiscriminatedUnion<[
    z.ZodObject<{
        method: z.ZodLiteral<"getCapabilities">;
        params: z.ZodObject<{}, z.core.$strict>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"listApps">;
        params: z.ZodObject<{}, z.core.$strict>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"findApps">;
        params: z.ZodObject<{
            query: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"getApp">;
        params: z.ZodObject<{
            selector: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"activate">;
        params: z.ZodObject<{
            appHandle: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"show">;
        params: z.ZodObject<{
            windowId: z.ZodOptional<z.ZodNumber>;
            appHandle: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"listWindows">;
        params: z.ZodObject<{
            appHandle: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"getState">;
        params: z.ZodObject<{
            windowId: z.ZodOptional<z.ZodNumber>;
            includeMenus: z.ZodOptional<z.ZodBoolean>;
            details: z.ZodOptional<z.ZodBoolean>;
            appHandle: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"hover">;
        params: z.ZodUnion<readonly [
            z.ZodObject<{
                snapshotId: z.ZodString;
                elementIndex: z.ZodNumber;
                appHandle: z.ZodString;
            }, z.core.$strict>,
            z.ZodObject<{
                relative: z.ZodOptional<z.ZodLiteral<false>>;
                snapshotId: z.ZodOptional<z.ZodString>;
                x: z.ZodNumber;
                y: z.ZodNumber;
                windowId: z.ZodNumber;
                appHandle: z.ZodString;
            }, z.core.$strict>,
            z.ZodObject<{
                relative: z.ZodLiteral<true>;
                x: z.ZodNumber;
                y: z.ZodNumber;
                snapshotId: z.ZodOptional<z.ZodString>;
                windowId: z.ZodNumber;
                appHandle: z.ZodString;
            }, z.core.$strict>
        ]>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"click">;
        params: z.ZodUnion<readonly [
            z.ZodObject<{
                clickCount: z.ZodOptional<z.ZodUnion<readonly [
                    z.ZodLiteral<1>,
                    z.ZodLiteral<2>
                ]>>;
                mouseButton: z.ZodOptional<z.ZodEnum<{
                    left: "left";
                    right: "right";
                    middle: "middle";
                }>>;
                modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    command: "command";
                    control: "control";
                    option: "option";
                    shift: "shift";
                    fn: "fn";
                }>>>;
                snapshotId: z.ZodString;
                elementIndex: z.ZodNumber;
                appHandle: z.ZodString;
            }, z.core.$strict>,
            z.ZodObject<{
                clickCount: z.ZodOptional<z.ZodUnion<readonly [
                    z.ZodLiteral<1>,
                    z.ZodLiteral<2>
                ]>>;
                mouseButton: z.ZodOptional<z.ZodEnum<{
                    left: "left";
                    right: "right";
                    middle: "middle";
                }>>;
                modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    command: "command";
                    control: "control";
                    option: "option";
                    shift: "shift";
                    fn: "fn";
                }>>>;
                relative: z.ZodOptional<z.ZodLiteral<false>>;
                snapshotId: z.ZodOptional<z.ZodString>;
                x: z.ZodNumber;
                y: z.ZodNumber;
                windowId: z.ZodNumber;
                appHandle: z.ZodString;
            }, z.core.$strict>,
            z.ZodObject<{
                clickCount: z.ZodOptional<z.ZodUnion<readonly [
                    z.ZodLiteral<1>,
                    z.ZodLiteral<2>
                ]>>;
                mouseButton: z.ZodOptional<z.ZodEnum<{
                    left: "left";
                    right: "right";
                    middle: "middle";
                }>>;
                modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    command: "command";
                    control: "control";
                    option: "option";
                    shift: "shift";
                    fn: "fn";
                }>>>;
                relative: z.ZodLiteral<true>;
                x: z.ZodNumber;
                y: z.ZodNumber;
                snapshotId: z.ZodOptional<z.ZodString>;
                windowId: z.ZodNumber;
                appHandle: z.ZodString;
            }, z.core.$strict>
        ]>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"setValue">;
        params: z.ZodObject<{
            value: z.ZodString;
            snapshotId: z.ZodString;
            elementIndex: z.ZodNumber;
            appHandle: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"selectText">;
        params: z.ZodObject<{
            text: z.ZodString;
            prefix: z.ZodOptional<z.ZodString>;
            suffix: z.ZodOptional<z.ZodString>;
            selectionType: z.ZodOptional<z.ZodEnum<{
                text: "text";
                cursor_before: "cursor_before";
                cursor_after: "cursor_after";
            }>>;
            snapshotId: z.ZodString;
            elementIndex: z.ZodNumber;
            appHandle: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"performSecondaryAction">;
        params: z.ZodObject<{
            action: z.ZodString;
            snapshotId: z.ZodString;
            elementIndex: z.ZodNumber;
            appHandle: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"typeText">;
        params: z.ZodObject<{
            text: z.ZodString;
            appHandle: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"paste">;
        params: z.ZodObject<{
            text: z.ZodString;
            format: z.ZodOptional<z.ZodEnum<{
                text: "text";
                html: "html";
            }>>;
            appHandle: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"pressKey">;
        params: z.ZodObject<{
            key: z.ZodString;
            modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                command: "command";
                control: "control";
                option: "option";
                shift: "shift";
                fn: "fn";
            }>>>;
            appHandle: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"scroll">;
        params: z.ZodUnion<readonly [
            z.ZodObject<{
                deltaLinesX: z.ZodNumber;
                deltaLinesY: z.ZodNumber;
                relative: z.ZodOptional<z.ZodLiteral<false>>;
                snapshotId: z.ZodOptional<z.ZodString>;
                x: z.ZodNumber;
                y: z.ZodNumber;
                windowId: z.ZodNumber;
                appHandle: z.ZodString;
            }, z.core.$strict>,
            z.ZodObject<{
                deltaLinesX: z.ZodNumber;
                deltaLinesY: z.ZodNumber;
                relative: z.ZodLiteral<true>;
                x: z.ZodNumber;
                y: z.ZodNumber;
                snapshotId: z.ZodOptional<z.ZodString>;
                windowId: z.ZodNumber;
                appHandle: z.ZodString;
            }, z.core.$strict>
        ]>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"drag">;
        params: z.ZodUnion<readonly [
            z.ZodObject<{
                snapshotId: z.ZodOptional<z.ZodString>;
                relative: z.ZodOptional<z.ZodLiteral<false>>;
                fromX: z.ZodNumber;
                fromY: z.ZodNumber;
                toX: z.ZodNumber;
                toY: z.ZodNumber;
                mouseButton: z.ZodOptional<z.ZodEnum<{
                    left: "left";
                    right: "right";
                    middle: "middle";
                }>>;
                modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    command: "command";
                    control: "control";
                    option: "option";
                    shift: "shift";
                    fn: "fn";
                }>>>;
                windowId: z.ZodNumber;
                appHandle: z.ZodString;
            }, z.core.$strict>,
            z.ZodObject<{
                snapshotId: z.ZodOptional<z.ZodString>;
                relative: z.ZodLiteral<true>;
                fromX: z.ZodNumber;
                fromY: z.ZodNumber;
                toX: z.ZodNumber;
                toY: z.ZodNumber;
                mouseButton: z.ZodOptional<z.ZodEnum<{
                    left: "left";
                    right: "right";
                    middle: "middle";
                }>>;
                modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    command: "command";
                    control: "control";
                    option: "option";
                    shift: "shift";
                    fn: "fn";
                }>>>;
                windowId: z.ZodNumber;
                appHandle: z.ZodString;
            }, z.core.$strict>
        ]>;
    }, z.core.$strict>,
    z.ZodObject<{
        method: z.ZodLiteral<"screenshot">;
        params: z.ZodObject<{
            windowId: z.ZodNumber;
            appHandle: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>
], "method">;
```

这是上方声明的公开对象；按实际类型使用，不把它当作文本常量。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## ScreenshotResult（./protocol）

公开导入：`@deepseek-ai/dsh-cua/protocol`；公开符号：`ScreenshotResult`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

完整公开声明：

```text
export declare const ScreenshotResult: z.ZodObject<{
    data: z.ZodString;
    pixelWidth: z.ZodNumber;
    pixelHeight: z.ZodNumber;
    windowId: z.ZodNumber;
    bounds: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, z.core.$strip>;
    mimeType: z.ZodEnum<{
        "image/png": "image/png";
        "image/jpeg": "image/jpeg";
        "image/webp": "image/webp";
        "image/gif": "image/gif";
    }>;
    coordinateSpace: z.ZodLiteral<"screenshot-pixels">;
}, z.core.$strip>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## ShowResult（./protocol）

公开导入：`@deepseek-ai/dsh-cua/protocol`；公开符号：`ShowResult`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

完整公开声明：

```text
export declare const ShowResult: z.ZodObject<{
    dispatched: z.ZodLiteral<true>;
    verified: z.ZodLiteral<false>;
    windowId: z.ZodNullable<z.ZodNumber>;
    foregroundChanged: z.ZodNullable<z.ZodBoolean>;
}, z.core.$strip>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## StateResult（./protocol）

公开导入：`@deepseek-ai/dsh-cua/protocol`；公开符号：`StateResult`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

公开声明（保留类型空间与值空间）：

```text
export declare const StateResult: z.ZodObject<{
    appHandle: z.ZodPipe<z.ZodString, z.ZodTransform<CuaAppHandle, string>>;
    pid: z.ZodNumber;
    windowId: z.ZodNullable<z.ZodNumber>;
    focusedWindowId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    snapshotId: z.ZodPipe<z.ZodString, z.ZodTransform<CuaSnapshotId, string>>;
    tree: z.ZodString;
    windows: z.ZodArray<z.ZodObject<{
        windowId: z.ZodNumber;
        pid: z.ZodNumber;
        appName: z.ZodString;
        title: z.ZodString;
        bounds: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strip>;
        isOnScreen: z.ZodBoolean;
        onCurrentSpace: z.ZodNullable<z.ZodBoolean>;
    }, z.core.$strip>>;
    truncated: z.ZodBoolean;
}, z.core.$strip>;
```

这是上方声明的公开对象；按实际类型使用，不把它当作文本常量。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## WindowsResult（./protocol）

公开导入：`@deepseek-ai/dsh-cua/protocol`；公开符号：`WindowsResult`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

完整公开声明：

```text
export declare const WindowsResult: z.ZodArray<z.ZodObject<{
    windowId: z.ZodNumber;
    pid: z.ZodNumber;
    appName: z.ZodString;
    title: z.ZodString;
    bounds: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, z.core.$strip>;
    isOnScreen: z.ZodBoolean;
    onCurrentSpace: z.ZodNullable<z.ZodBoolean>;
}, z.core.$strip>>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。
