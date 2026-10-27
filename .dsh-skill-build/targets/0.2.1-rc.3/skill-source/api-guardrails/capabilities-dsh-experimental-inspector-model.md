# dsh-experimental-inspector-model 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 model 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-inspector.md)；本页逐项保留对象的参数、字段和判别分支。

## CordisRuntimeConnection（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CordisRuntimeConnection = {
    readonly state: 'connected';
} | {
    readonly state: 'disconnected';
    readonly reason: string;
};
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`CordisRuntimeConnection`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`state`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## CordisRuntimeContext（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CordisRuntimeContext {
    readonly kind: 'context';
    readonly children: readonly CordisRuntimeNode[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`CordisRuntimeContext`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`children`、`kind`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## CordisRuntimeFiber（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CordisRuntimeFiber {
    readonly kind: 'fiber';
    readonly uid: number;
    readonly children: readonly [
        CordisRuntimeContext
    ];
}
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`CordisRuntimeFiber`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`children`、`kind`、`uid`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## CordisRuntimeNode（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CordisRuntimeNode = CordisRuntimeContext | CordisRuntimeFiber;
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`CordisRuntimeNode`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`children`、`kind`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## CordisRuntimeRealm（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CordisRuntimeRealm {
    readonly source: CordisRuntimeSource;
    readonly connection: CordisRuntimeConnection;
    readonly revision: number;
    readonly truncated: boolean;
    readonly root: CordisRuntimeContext;
}
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`CordisRuntimeRealm`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`connection`、`revision`、`root`、`source`、`truncated`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## CordisRuntimeSource（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CordisRuntimeSource {
    readonly sourceId: CordisRuntimeSourceId;
    readonly kind: CordisRuntimeSourceKind;
    readonly label: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`CordisRuntimeSource`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`kind`、`label`、`sourceId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## CordisRuntimeTree（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CordisRuntimeTree {
    readonly schemaVersion: typeof CORDIS_RUNTIME_TREE_SCHEMA_VERSION;
    readonly host: CordisRuntimeRealm | null;
    readonly clients: readonly CordisRuntimeRealm[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`CordisRuntimeTree`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`clients`、`host`、`schemaVersion`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。
