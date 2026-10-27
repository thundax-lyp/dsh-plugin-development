# dsh-experimental-inspector-snapshot 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 snapshot 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-inspector.md)；本页逐项保留对象的参数、字段和判别分支。

## CordisContextTreeNode（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CordisContextTreeNode extends CordisTreeNodeBase {
    readonly kind: 'context';
    readonly children: readonly CordisTreeNode[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`CordisContextTreeNode`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`children`、`kind`、`objectHandle`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## CordisFiberTreeNode（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CordisFiberTreeNode extends CordisTreeNodeBase {
    readonly kind: 'fiber';
    readonly uid: number;
    readonly children: readonly [
        CordisContextTreeNode
    ];
}
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`CordisFiberTreeNode`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`children`、`kind`、`objectHandle`、`uid`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## CordisTreeNode（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CordisTreeNode = CordisContextTreeNode | CordisFiberTreeNode;
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`CordisTreeNode`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`children`、`kind`、`objectHandle`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## CordisTreeSnapshot（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CordisTreeSnapshot {
    readonly schemaVersion: typeof CORDIS_TREE_SCHEMA_VERSION;
    readonly revision: number;
    readonly objectRegistryId: InspectorObjectRegistryId;
    readonly root: CordisContextTreeNode;
    readonly truncated: boolean;
}
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`CordisTreeSnapshot`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`objectRegistryId`、`revision`、`root`、`schemaVersion`、`truncated`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。
