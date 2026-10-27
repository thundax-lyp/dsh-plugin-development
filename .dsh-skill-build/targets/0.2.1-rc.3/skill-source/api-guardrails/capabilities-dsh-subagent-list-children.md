# dsh-subagent-list-children 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 list-children 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-subagent.md)；本页逐项保留对象的参数、字段和判别分支。

## SubagentDescendantListEntry（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SubagentDescendantListEntry = SubagentListEntry & {
    readonly parentId: SessionId;
    readonly depth: number;
};
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentDescendantListEntry`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`depth`、`parentId`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。
