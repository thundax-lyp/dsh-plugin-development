# dsh-experimental-webworker-runtime-image-layout 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 image-layout 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-webworker-runtime.md)；本页逐项保留对象的参数、字段和判别分支。

## DEFAULT_ROOT（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`DEFAULT_ROOT`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_ROOT = "/dsh";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## IMAGE_EMPTY_DIRECTORIES（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`IMAGE_EMPTY_DIRECTORIES`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const IMAGE_EMPTY_DIRECTORIES: readonly string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## IMAGE_FILE_NAME（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`IMAGE_FILE_NAME`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const IMAGE_FILE_NAME = "vfs-image.tar.gz";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## IMAGE_HOME_DIRECTORY（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`IMAGE_HOME_DIRECTORY`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const IMAGE_HOME_DIRECTORY = "home";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## IMAGE_LAZY_DIRECTORY（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`IMAGE_LAZY_DIRECTORY`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const IMAGE_LAZY_DIRECTORY = "lazy";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## IMAGE_MANIFEST_PATH（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`IMAGE_MANIFEST_PATH`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const IMAGE_MANIFEST_PATH = "config/vfs-manifest.json";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## IMAGE_OVERLAY_DIRECTORIES（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`IMAGE_OVERLAY_DIRECTORIES`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const IMAGE_OVERLAY_DIRECTORIES: readonly string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## LOWERING_VERSION（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`LOWERING_VERSION`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const LOWERING_VERSION = "dsh-worker-transform/1";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## PLATFORM_ENTRY_CONFIG（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`PLATFORM_ENTRY_CONFIG`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const PLATFORM_ENTRY_CONFIG: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## WRAPPER_PARAMS（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`WRAPPER_PARAMS`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const WRAPPER_PARAMS: readonly [
    "exports",
    "require",
    "module",
    "__filename",
    "__dirname",
    "__dsh$meta",
    "__als"
];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。
