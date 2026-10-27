# dsh-cua-native-client 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 native-client 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-cua.md)；本页逐项保留对象的参数、字段和判别分支。

## NativeChannel（./native-client）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface NativeChannel {
    readonly stdin: Writable;
    readonly stdout: Readable;
    readonly done: Promise<void>;
    close(): void;
    waitForClose(): Promise<void>;
}
```

公开导入：`@deepseek-ai/dsh-cua/native-client`；公开符号：`NativeChannel`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`close`、`done`、`stdin`、`stdout`、`waitForClose`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## NativeChannelFactory（./native-client）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type NativeChannelFactory = (owner: {
    subprocess: Pick<SubprocessRuntime, 'spawn'>;
}, config: NativeClientConfig) => NativeChannel;
```

公开导入：`@deepseek-ai/dsh-cua/native-client`；公开符号：`NativeChannelFactory`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## NativeClient（./native-client）

公开导入：`@deepseek-ai/dsh-cua/native-client`；公开符号：`NativeClient`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class NativeClient {
    constructor(owner: {
        subprocess: Pick<SubprocessRuntime, 'spawn'>;
    }, config: NativeClientConfig, createChannel: NativeChannelFactory, reportDiagnostic?: ((message: string) => void) | undefined);
    request(method: string, params: Record<string, JsonValue>, signal: AbortSignal, callId?: ToolExecution['callId']): Promise<JsonValue>;
    get disposed(): boolean;
    invalidate(): void;
    dispose(): Promise<void>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这是调用方持有的运行时对象。按上文公开使用路径结束任务；取消和释放不同于业务成功，等待异步清理后才能认定资源已退出。跨进程恢复须读取业务拥有的持久数据，不能序列化此活对象。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## NativeClientConfig（./native-client）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface NativeClientConfig {
    helperPath: string;
    cwd: string;
    timeoutMs: number;
    connectTimeoutMs: number;
    screenshotTimeoutMs: number;
    axTimeoutMs: number;
    maxRequestBytes: number;
    maxResponseBytes: number;
    graceMs: number;
    textEventIntervalMs: number;
}
```

公开导入：`@deepseek-ai/dsh-cua/native-client`；公开符号：`NativeClientConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`axTimeoutMs`、`connectTimeoutMs`、`cwd`、`graceMs`、`helperPath`、`maxRequestBytes`、`maxResponseBytes`、`screenshotTimeoutMs`、`textEventIntervalMs`、`timeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。

## NativeError（./native-client）

公开导入：`@deepseek-ai/dsh-cua/native-client`；公开符号：`NativeError`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class NativeError extends Error {
    readonly code: string;
    constructor(code: string, message: string, options?: ErrorOptions);
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。
