# dsh-experimental-webworker-runtime-index-dcdbb 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 index-dcdbb 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-webworker-runtime.md)；本页逐项保留对象的参数、字段和判别分支。

## WorkerHostConnectOptions（./client）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WorkerHostConnectOptions {
    readonly image?: string | URL;
    readonly overlays?: readonly (string | URL)[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime/client`；公开符号：`WorkerHostConnectOptions`。 此子路径用于 Client 编译面；不把它的运行对象传到 Host。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`image`、`overlays`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## WorkerHostConnection（./client）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WorkerHostConnection {
    readonly worker: Worker;
    readonly tunnel: WorkerTunnel;
    loadBundle(url: string): Promise<void>;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime/client`；公开符号：`WorkerHostConnection`。 此子路径用于 Client 编译面；不把它的运行对象传到 Host。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`loadBundle`、`tunnel`、`worker`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## WorkerHostSource（./client）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WorkerHostSource {
    readonly overlays: readonly URL[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime/client`；公开符号：`WorkerHostSource`。 此子路径用于 Client 编译面；不把它的运行对象传到 Host。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`overlays`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## WorkerHostSourceOptions（./client）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WorkerHostSourceOptions {
    readonly image?: string | URL;
    readonly fixtureManifest?: string | URL;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime/client`；公开符号：`WorkerHostSourceOptions`。 此子路径用于 Client 编译面；不把它的运行对象传到 Host。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`fixtureManifest`、`image`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## applyIndexInjections（./client）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime/client`；公开符号：`applyIndexInjections`。 此子路径用于 Client 编译面；不把它的运行对象传到 Host。

完整公开声明：

```text
export declare function applyIndexInjections(rows: readonly IndexInjection[], loadScript: (src: string) => Promise<void>): Promise<void>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## chooseWorkerHostSource（./client）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime/client`；公开符号：`chooseWorkerHostSource`。 此子路径用于 Client 编译面；不把它的运行对象传到 Host。

完整公开声明：

```text
export declare function chooseWorkerHostSource(options?: WorkerHostSourceOptions): Promise<WorkerHostSource>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## connectWorkerHost（./client）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime/client`；公开符号：`connectWorkerHost`。 此子路径用于 Client 编译面；不把它的运行对象传到 Host。

完整公开声明：

```text
export declare function connectWorkerHost(worker: Worker, options?: WorkerHostConnectOptions): Promise<WorkerHostConnection>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。
