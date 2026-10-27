# @deepseek-ai/dsh-compaction-tool-result-pruner 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-compaction-tool-result-pruner` 防止超大工具输出填满上下文窗口。压缩触发条件满足后，它会把超出预算的文本替换为长度受限的头部、简短的「middle pruned」标记与长度受限的尾部；未达到压力阈值的对话保持不变。完整原始结果仍保留在会话日志中，可供精确回放与检查。修剪不发起模型调用，并可能充分缓解 token 压力，使压缩跳过摘要。字符预算只能近似 token 用量；token meter 负责判定压力是否得到缓解。

### 使用本包

当工具输出经常主导对话窗口时，在 `dsh-compaction-basic` 旁挂载本包。修剪会改变模型看到的内容——更短的结果——并让压缩有更少的历史需要压缩。

#### 最小可用组合

按此顺序挂载 token 测量、本包与后端：

```yaml
- name: '@deepseek-ai/dsh-token-meter'
- name: '@deepseek-ai/dsh-compaction-tool-result-pruner'
- name: '@deepseek-ai/dsh-compaction-basic'
```

有了这些配置行，超大工具结果会在压缩过程中自动被修剪。你可以通过检查后续请求是否显示修剪后的结果来确认成功；完整原始内容仍保留在会话日志中。

#### 什么会被修剪

每个文本超过阈值的工具结果都会被替换为修剪版本：配置的头部、简短的「middle pruned」标记与配置的尾部。图片与结构化块等富内容保持原有顺序，并保留日志中的所有图片省略选择。替换保留工具调用、步骤、错误与元数据——只有文本内容发生变化。如果替换无法被记录，运行会失败，已应用的修剪仍会保留。

#### 设置大小限制

| 字段 | 默认值 | 含义 |
|---|---|---|
| `thresholdChars` | `8192` | 合并文本超过此 Unicode 码点数时修剪。 |
| `headChars` | `4096` | 保留的开头 Unicode 码点数。 |
| `tailChars` | `1024` | 保留的末尾 Unicode 码点数。 |

字符数以 Unicode 码点计，因此切片绝不会拆分 emoji 对，但多字符字素仍可能被切断。头部加标记加尾部之和必须不超过阈值，因此有效配置可以修剪每个超出预算的结果，不会增长或重复改写。未知设置会导致插件在构造时被拒绝。

#### 修剪何时运行

修剪只在压缩触发条件满足后运行：`dsh-compaction-basic` 在压力或溢出确认后、选择要压缩的内容之前调用它。低于压力时不会修剪任何内容，修剪本身也不发起模型调用。

-----

### 已知限制与延期工作

这些限制说明修剪何时不合适，或何时需要特别注意；它们是当前包约束。

- **字符预算不是 token 预算**——不同提供方的 token 密度各异，因此 `ctx.tokenMeter` 仍负责判定修剪是否缓解了请求压力。
- **剪枝只基于语法**——它保留开头与结尾，不解释中间哪些行在语义上重要。
- **字素簇可能被拆分**——按码点切片可保护代理项对，但不会执行考虑区域设置的字素簇分割。

## DEFAULTS（.）

公开导入：`@deepseek-ai/dsh-compaction-tool-result-pruner`；公开符号：`DEFAULTS`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULTS: ResolvedConfig;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-tool-result-pruner.md)。

## PRUNE_MARKER（.）

公开导入：`@deepseek-ai/dsh-compaction-tool-result-pruner`；公开符号：`PRUNE_MARKER`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const PRUNE_MARKER = "\n\n[... tool result middle pruned ...]\n\n";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-tool-result-pruner.md)。

## PruneResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PruneResult {
    readonly pruned: readonly PrunedEntry[];
    readonly charsRemoved: number;
}
```

公开导入：`@deepseek-ai/dsh-compaction-tool-result-pruner`；公开符号：`PruneResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`charsRemoved`、`pruned`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-tool-result-pruner.md)。

## PrunedEntry（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PrunedEntry {
    readonly originalSeq: SessionSeq;
    readonly replacementSeq: SessionSeq;
    readonly callId: ToolCallId;
    readonly charsBefore: number;
    readonly charsAfter: number;
}
```

公开导入：`@deepseek-ai/dsh-compaction-tool-result-pruner`；公开符号：`PrunedEntry`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`callId`、`charsAfter`、`charsBefore`、`originalSeq`、`replacementSeq`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-tool-result-pruner.md)。

## ResolvedConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ResolvedConfig {
    readonly thresholdChars: number;
    readonly headChars: number;
    readonly tailChars: number;
}
```

公开导入：`@deepseek-ai/dsh-compaction-tool-result-pruner`；公开符号：`ResolvedConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`headChars`、`tailChars`、`thresholdChars`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-tool-result-pruner.md)。

## ToolResultPruneConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToolResultPruneConfig {
    thresholdChars?: number;
    headChars?: number;
    tailChars?: number;
}
```

公开导入：`@deepseek-ai/dsh-compaction-tool-result-pruner`；公开符号：`ToolResultPruneConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`headChars`、`tailChars`、`thresholdChars`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-tool-result-pruner.md)。

## ToolResultPruner（.）

公开导入：`@deepseek-ai/dsh-compaction-tool-result-pruner`；公开符号：`ToolResultPruner`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class ToolResultPruner extends Service {
    static inject: string[];
    static Config: z<ToolResultPruneConfig>;
    readonly config: ResolvedConfig;
    constructor(ctx: Context, config?: ToolResultPruneConfig);
    measureContent(blocks: readonly ContentBlock[]): number;
    pruneContent(blocks: readonly ContentBlock[]): ContentBlock[] | null;
    pruneSession(session: Session): PruneResult;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-tool-result-pruner.md)。

## codePointLength（.）

公开导入：`@deepseek-ai/dsh-compaction-tool-result-pruner`；公开符号：`codePointLength`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function codePointLength(text: string): number;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-tool-result-pruner.md)。

## resolveConfig（.）

公开导入：`@deepseek-ai/dsh-compaction-tool-result-pruner`；公开符号：`resolveConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function resolveConfig(config?: ToolResultPruneConfig): ResolvedConfig;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-tool-result-pruner.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    toolResultPruner: ToolResultPruner;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `toolResultPruner` | `toolResultPruner: ToolResultPruner` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-compaction-tool-result-pruner.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
