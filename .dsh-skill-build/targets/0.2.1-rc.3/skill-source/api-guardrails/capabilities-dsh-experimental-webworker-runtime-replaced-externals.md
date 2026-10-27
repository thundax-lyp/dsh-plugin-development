# dsh-experimental-webworker-runtime-replaced-externals 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 replaced-externals 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-webworker-runtime.md)；本页逐项保留对象的参数、字段和判别分支。

## REPLACED_EXTERNAL_PACKAGES（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`REPLACED_EXTERNAL_PACKAGES`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const REPLACED_EXTERNAL_PACKAGES: readonly string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。
