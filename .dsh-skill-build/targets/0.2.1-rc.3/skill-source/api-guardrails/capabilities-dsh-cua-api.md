# dsh-cua-api 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 api 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-cua.md)；本页逐项保留对象的参数、字段和判别分支。

## createCuaApi（./api）

公开导入：`@deepseek-ai/dsh-cua/api`；公开符号：`createCuaApi`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function createCuaApi(dispatch: CuaDispatch, sink?: CuaObservationSink): CuaApi;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-cua.md)。
