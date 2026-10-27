# dsh-experimental-inspector-json 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 json 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-inspector.md)；本页逐项保留对象的参数、字段和判别分支。

## InspectorJsonObject（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface InspectorJsonObject {
    readonly [key: string]: InspectorJsonValue;
}
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`InspectorJsonObject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## InspectorJsonPrimitive（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type InspectorJsonPrimitive = null | boolean | number | string;
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`InspectorJsonPrimitive`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## InspectorJsonValue（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type InspectorJsonValue = InspectorJsonPrimitive | readonly InspectorJsonValue[] | InspectorJsonObject;
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`InspectorJsonValue`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。
