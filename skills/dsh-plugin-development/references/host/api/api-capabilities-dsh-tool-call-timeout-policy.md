# @deepseek-ai/dsh-tool-call-timeout-policy 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

使用本包可为工具调用执行其配置的协作式时间上限，并在取消完成后向模型返回清晰的超时错误。按时完成的调用保持不变。忽略或缓慢处理取消的工具仍可能让调用方继续等待，因为本包无法硬性停止下游工作。每个工具分别提供自己的限时；本包无需配置，并随 `dsh` 基础组合包默认启用。

### 使用本包

常用路径只有一行：把插件加入组合——`dsh` 基础组合包已经包含它。配置了限时的工具会被自动保护；其余工具完全不受影响。

#### 何时选择

当模型会调用耗时很长的工具、这些工具会遵守 `exec.signal`，且你希望在取消完成后得到可预期的超时答复时，选择它。当工具必须在到达限时后被硬性停止时——插件只能请求工具停止，因此忽略取消的工具会继续运行并让调用方继续等待——以及当你希望为所有工具设置一个统一默认限时时（因为每个工具的限时来自该工具自身的配置），避免使用它。

#### 设置

无需任何配置即可挂载插件：

```yaml
- name: '@deepseek-ai/dsh-tool-call-timeout-policy'
```

#### 你会得到什么

截止时间触发时，插件会中止派生的 `exec.signal`。下游代码遵守取消且 `next()` 完成后，模型会收到标记为错误的 `Error: tool call timed out after <ms>ms` 工具结果，从而决定重试、调整或放弃。忽略或缓慢处理该信号的工具会让调用方继续等待，并且在自身完成前不会产生超时结果；按时完成的调用保持不变。

-----

### 已知限制与延期工作

这些限制说明策略何时不合适。它们是当前包约束，不是任务积压。

- **协作式，绝不是硬终止**——截止时间只通过 `exec.signal` 通知；忽略该信号的工具不会在超时时停止，包装层仍停留在 `await next()` 内，模型要等下游完成后才可能收到超时结果。
- **没有统一预算**——只有声明 `timeoutMs` 并将其放在 `ToolDefinition` 上的工具才会获得截止时间；未声明工具（随附的 `bash`、`read`、`write`、`edit` 有意不声明）没有注册表级默认值。

## TOOL_TIMEOUT（.）

公开导入：`@deepseek-ai/dsh-tool-call-timeout-policy`；公开符号：`TOOL_TIMEOUT`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const TOOL_TIMEOUT = "TOOL_TIMEOUT";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-call-timeout-policy.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-tool-call-timeout-policy`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-call-timeout-policy.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-tool-call-timeout-policy`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-call-timeout-policy.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-tool-call-timeout-policy`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "timeout-policy";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-call-timeout-policy.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
