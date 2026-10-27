# dsh-experimental-webworker-runtime-tar 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 tar 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-webworker-runtime.md)；本页逐项保留对象的参数、字段和判别分支。

## TarEntry（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TarEntry {
    readonly name: string;
    readonly bytes: Uint8Array;
    readonly directory: boolean;
    readonly mode: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`TarEntry`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`bytes`、`directory`、`mode`、`name`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## packTar（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`packTar`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function packTar(files: Readonly<Record<string, Uint8Array>>): Uint8Array;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## parseTar（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`parseTar`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function parseTar(archive: Uint8Array): TarEntry[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。
