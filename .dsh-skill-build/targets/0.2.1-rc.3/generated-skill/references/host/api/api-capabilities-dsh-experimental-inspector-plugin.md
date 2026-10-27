# dsh-experimental-inspector-plugin 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 plugin 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-inspector.md)；本页逐项保留对象的参数、字段和判别分支。

## InspectorService（./client）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface InspectorService extends SharedInspectorService {
}
```

公开导入：`@deepseek-ai/dsh-experimental-inspector/client`；公开符号：`InspectorService`。 此子路径用于 Client 编译面；不把它的运行对象传到 Host。

类型、值空间与调用形式以上方完整声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## apply（./client）

公开导入：`@deepseek-ai/dsh-experimental-inspector/client`；公开符号：`apply`。 此子路径用于 Client 编译面；不把它的运行对象传到 Host。

完整公开声明：

```text
export declare function apply(ctx: Context): Promise<void>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## inject（./client）

公开导入：`@deepseek-ai/dsh-experimental-inspector/client`；公开符号：`inject`。 此子路径用于 Client 编译面；不把它的运行对象传到 Host。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## name（./client）

公开导入：`@deepseek-ai/dsh-experimental-inspector/client`；公开符号：`name`。 此子路径用于 Client 编译面；不把它的运行对象传到 Host。

完整公开声明：

```text
export declare const name = "experimental-inspector";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。
