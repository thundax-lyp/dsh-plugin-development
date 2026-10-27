# dsh-subagent-out-of-process 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 out-of-process 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-subagent.md)；本页逐项保留对象的参数、字段和判别分支。

## NO_START_CAPABILITIES（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`NO_START_CAPABILITIES`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const NO_START_CAPABILITIES: SubagentCapabilities;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## RunResultSettlement（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface RunResultSettlement {
    attempt: () => Promise<SubagentResult>;
    collectOutput: () => readonly ContentBlock[];
    collectDiagnostic?: (() => string | undefined) | undefined;
    cancelled: () => boolean;
    onError?: ((error: Error, stopReason: SubagentStopReason) => void) | undefined;
    signal: AbortSignal;
    onAbort: () => void;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`RunResultSettlement`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`attempt`、`cancelled`、`collectDiagnostic`、`collectOutput`、`onAbort`、`onError`、`signal`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubprocessRunHandleParts（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SubprocessRunHandleParts {
    id: SubagentRun['id'];
    result: Promise<SubagentResult>;
    signal: AbortSignal;
    onAbort: () => void;
    requestCancel: () => void;
    teardown: () => Promise<void>;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubprocessRunHandleParts`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`id`、`onAbort`、`requestCancel`、`result`、`signal`、`teardown`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## assertPositiveFinite（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`assertPositiveFinite`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function assertPositiveFinite(prefix: string, name: string, value: number): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## assertUsableCwd（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`assertUsableCwd`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function assertUsableCwd(prefix: string, label: string, cwd: string): string;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## settleRunResult（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`settleRunResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function settleRunResult(parts: RunResultSettlement): Promise<SubagentResult>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## subprocessRunHandle（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`subprocessRunHandle`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function subprocessRunHandle(parts: SubprocessRunHandleParts): SubagentRun;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。
