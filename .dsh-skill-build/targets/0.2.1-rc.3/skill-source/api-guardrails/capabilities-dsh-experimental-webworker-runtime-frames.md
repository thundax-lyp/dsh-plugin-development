# dsh-experimental-webworker-runtime-frames 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 frames 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-webworker-runtime.md)；本页逐项保留对象的参数、字段和判别分支。

## TunnelAbortFrame（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TunnelAbortFrame {
    readonly t: 'abort';
    readonly id: TunnelRequestId;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`TunnelAbortFrame`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`id`、`t`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## TunnelInboundFrame（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type TunnelInboundFrame = TunnelInitFrame | TunnelRequestFrame | TunnelStreamOpenFrame | TunnelStreamUplinkItemFrame | TunnelStreamUplinkEndFrame | TunnelAbortFrame;
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`TunnelInboundFrame`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`t`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## TunnelOutboundFrame（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type TunnelOutboundFrame = TunnelViewTextFrame | TunnelResponseFrame | TunnelResponseHeadFrame | TunnelResponseChunkFrame | TunnelResponseEndFrame | TunnelResponseErrorFrame | TunnelStreamItemFrame | TunnelStreamEndFrame | TunnelStreamErrorFrame;
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`TunnelOutboundFrame`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`t`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## TunnelRequestFrame（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TunnelRequestFrame {
    readonly t: 'req';
    readonly id: TunnelRequestId;
    readonly method: string;
    readonly url: string;
    readonly headers: Readonly<Record<string, string>>;
    readonly body?: ArrayBuffer | Blob | ReadableStream<Uint8Array> | undefined;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`TunnelRequestFrame`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`body`、`headers`、`id`、`method`、`t`、`url`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## TunnelRequestId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type TunnelRequestId = string | number;
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`TunnelRequestId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## TunnelResponseChunkFrame（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TunnelResponseChunkFrame {
    readonly t: 'res-chunk';
    readonly id: TunnelRequestId;
    readonly chunk: ArrayBuffer;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`TunnelResponseChunkFrame`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`chunk`、`id`、`t`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## TunnelResponseEndFrame（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TunnelResponseEndFrame {
    readonly t: 'res-end';
    readonly id: TunnelRequestId;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`TunnelResponseEndFrame`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`id`、`t`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## TunnelResponseErrorFrame（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TunnelResponseErrorFrame {
    readonly t: 'res-err';
    readonly id: TunnelRequestId;
    readonly message: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`TunnelResponseErrorFrame`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`id`、`message`、`t`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## TunnelResponseFrame（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TunnelResponseFrame {
    readonly t: 'res';
    readonly id: TunnelRequestId;
    readonly status: number;
    readonly headers: Record<string, string>;
    readonly body?: ArrayBuffer | undefined;
    readonly message?: string | undefined;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`TunnelResponseFrame`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`body`、`headers`、`id`、`message`、`status`、`t`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## TunnelResponseHeadFrame（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TunnelResponseHeadFrame {
    readonly t: 'res-head';
    readonly id: TunnelRequestId;
    readonly status: number;
    readonly headers: Record<string, string>;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`TunnelResponseHeadFrame`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`headers`、`id`、`status`、`t`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## TunnelStreamEndFrame（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TunnelStreamEndFrame {
    readonly t: 'stream-end';
    readonly id: TunnelRequestId;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`TunnelStreamEndFrame`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`id`、`t`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## TunnelStreamErrorFrame（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TunnelStreamErrorFrame {
    readonly t: 'stream-error';
    readonly id: TunnelRequestId;
    readonly failure: {
        readonly kind: 'remote';
        readonly code: string;
        readonly message: string;
        readonly details: object;
    } | {
        readonly kind: 'carrier';
        readonly message: string;
    };
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`TunnelStreamErrorFrame`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`failure`、`id`、`t`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## TunnelStreamItemFrame（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TunnelStreamItemFrame {
    readonly t: 'stream-item';
    readonly id: TunnelRequestId;
    readonly value?: unknown;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`TunnelStreamItemFrame`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`id`、`t`、`value`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## TunnelStreamOpenFrame（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TunnelStreamOpenFrame {
    readonly t: 'stream-open';
    readonly id: TunnelRequestId;
    readonly endpoint: string;
    readonly payload: unknown;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`TunnelStreamOpenFrame`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`endpoint`、`id`、`payload`、`t`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## TunnelStreamUplinkEndFrame（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TunnelStreamUplinkEndFrame {
    readonly t: 'stream-uplink-end';
    readonly id: TunnelRequestId;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`TunnelStreamUplinkEndFrame`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`id`、`t`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## TunnelStreamUplinkItemFrame（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TunnelStreamUplinkItemFrame {
    readonly t: 'stream-uplink-item';
    readonly id: TunnelRequestId;
    readonly value?: unknown;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`TunnelStreamUplinkItemFrame`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`id`、`t`、`value`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## parseInboundFrame（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`parseInboundFrame`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function parseInboundFrame(data: unknown): TunnelInboundFrame;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。
