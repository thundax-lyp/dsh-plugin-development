# dsh-experimental-inspector-control 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 control 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-inspector.md)；本页逐项保留对象的参数、字段和判别分支。

## InspectorClientBootstrap（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface InspectorClientBootstrap {
    readonly endpoint: string;
    readonly protocol: string;
    readonly maxQueuedRecords: number;
    readonly maxQueuedBytes: number;
    readonly maxRecordsPerFrame: number;
    readonly maxFrameBytes: number;
    readonly reconnectBaseMs: number;
    readonly reconnectMaxMs: number;
    readonly queryTimeoutMs: number;
    readonly maxRuntimeObjectsPerSession: number;
    readonly maxRuntimePropertiesPerResult: number;
    readonly maxClientSourceBytes: number;
    readonly maxCordisNodes: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`InspectorClientBootstrap`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`endpoint`、`maxClientSourceBytes`、`maxCordisNodes`、`maxFrameBytes`、`maxQueuedBytes`、`maxQueuedRecords`、`maxRecordsPerFrame`、`maxRuntimeObjectsPerSession`、`maxRuntimePropertiesPerResult`、`protocol`、`queryTimeoutMs`、`reconnectBaseMs`、`reconnectMaxMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。
