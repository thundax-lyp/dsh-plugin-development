# dsh-experimental-inspector-controller 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 controller 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-inspector.md)；本页逐项保留对象的参数、字段和判别分支。

## InspectorEndpoint（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface InspectorEndpoint {
    readonly httpUrl: string;
    readonly webSocketDebuggerUrl: string;
    readonly devtoolsFrontendUrl: string;
    readonly client: InspectorClientBootstrap;
}
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`InspectorEndpoint`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`client`、`devtoolsFrontendUrl`、`httpUrl`、`webSocketDebuggerUrl`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## InspectorHandle（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface InspectorHandle {
    readonly endpoint: InspectorEndpoint;
    readonly source: InspectorConnection;
    close(): Promise<void>;
}
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`InspectorHandle`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`close`、`endpoint`、`source`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## InspectorOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface InspectorOptions {
    readonly host?: '127.0.0.1';
    readonly port?: number;
    readonly clientOrigins?: readonly string[];
    readonly captureFetch?: boolean;
    readonly maxRequestBodyBytes?: number;
    readonly maxResponseBodyBytes?: number;
    readonly maxBodyChunkBytes?: number;
    readonly maxJournalBytes?: number;
    readonly maxRetainedRequests?: number;
    readonly maxSourceFrameBytes?: number;
    readonly maxSourceRecordsPerFrame?: number;
    readonly maxQueuedRecords?: number;
    readonly maxQueuedBytes?: number;
    readonly startupTimeoutMs?: number;
    readonly stopTimeoutMs?: number;
    readonly clientReconnectBaseMs?: number;
    readonly clientReconnectMaxMs?: number;
    readonly clientRuntimeTimeoutMs?: number;
    readonly queryTimeoutMs?: number;
    readonly maxClientRuntimeObjects?: number;
    readonly maxClientRuntimeProperties?: number;
    readonly maxClientSourceBytes?: number;
    readonly maxCordisNodes?: number;
    readonly maxDisconnectedCordisTrees?: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`InspectorOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`captureFetch`、`clientOrigins`、`clientReconnectBaseMs`、`clientReconnectMaxMs`、`clientRuntimeTimeoutMs`、`host`、`maxBodyChunkBytes`、`maxClientRuntimeObjects`、`maxClientRuntimeProperties`、`maxClientSourceBytes`、`maxCordisNodes`、`maxDisconnectedCordisTrees`、`maxJournalBytes`、`maxQueuedBytes`、`maxQueuedRecords`、`maxRequestBodyBytes`、`maxResponseBodyBytes`、`maxRetainedRequests`、`maxSourceFrameBytes`、`maxSourceRecordsPerFrame`、`port`、`queryTimeoutMs`、`startupTimeoutMs`、`stopTimeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## InspectorSpec（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface InspectorSpec {
    readonly host: '127.0.0.1';
    readonly port: number;
    readonly clientOrigins: readonly string[];
    readonly captureFetch: boolean;
    readonly maxRequestBodyBytes: number;
    readonly maxResponseBodyBytes: number;
    readonly maxBodyChunkBytes: number;
    readonly maxJournalBytes: number;
    readonly maxRetainedRequests: number;
    readonly maxSourceFrameBytes: number;
    readonly maxSourceRecordsPerFrame: number;
    readonly maxQueuedRecords: number;
    readonly maxQueuedBytes: number;
    readonly startupTimeoutMs: number;
    readonly stopTimeoutMs: number;
    readonly clientReconnectBaseMs: number;
    readonly clientReconnectMaxMs: number;
    readonly clientRuntimeTimeoutMs: number;
    readonly queryTimeoutMs: number;
    readonly maxClientRuntimeObjects: number;
    readonly maxClientRuntimeProperties: number;
    readonly maxClientSourceBytes: number;
    readonly maxCordisNodes: number;
    readonly maxDisconnectedCordisTrees: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`InspectorSpec`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`captureFetch`、`clientOrigins`、`clientReconnectBaseMs`、`clientReconnectMaxMs`、`clientRuntimeTimeoutMs`、`host`、`maxBodyChunkBytes`、`maxClientRuntimeObjects`、`maxClientRuntimeProperties`、`maxClientSourceBytes`、`maxCordisNodes`、`maxDisconnectedCordisTrees`、`maxJournalBytes`、`maxQueuedBytes`、`maxQueuedRecords`、`maxRequestBodyBytes`、`maxResponseBodyBytes`、`maxRetainedRequests`、`maxSourceFrameBytes`、`maxSourceRecordsPerFrame`、`port`、`queryTimeoutMs`、`startupTimeoutMs`、`stopTimeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## resolveInspectorOptions（.）

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`resolveInspectorOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function resolveInspectorOptions(options?: InspectorOptions): InspectorSpec;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## startInspector（.）

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`startInspector`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function startInspector(options?: InspectorOptions): Promise<InspectorHandle>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。
