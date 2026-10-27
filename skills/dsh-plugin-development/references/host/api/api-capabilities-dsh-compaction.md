# @deepseek-ai/dsh-compaction 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-compaction` 让长时会话把较早历史压缩（compaction）成一条摘要消息、保持近期对话不变，并像摘要一直存在那样继续下去——配合 `dsh-compaction-basic` 之类的后端与可选的 `/compact` 命令即可实现。被遮蔽的内容仍保留在会话日志中，因此回放会话时能确定性地重现同一份压缩后的对话。当你实现压缩后端、构建触发压缩的组件，或需要识别压缩后的消息时，才需要本包——它本身不执行任何压缩。想开箱即用地获得该功能时，请选择随附后端。

### 使用本包

先确定你需要什么。随附后端加 `/compact` 命令即可零代码获得自动与按需压缩；只有在你扩展或重实现该功能时才需要本包。以下各节说明压缩做什么、如何启用，以及如何编写后端。

#### 何时选择

当模型撰写的摘要符合需求时，选择 `dsh-compaction-basic`：会话增长时自动压缩，并可通过 `dsh-command-compact` 按需压缩。当你需要不同的摘要方式——固定模板或远程服务——或构建以编程方式触发压缩的组件时，选择本包。不要单独挂载它：没有后端就什么都不会压缩。

#### 压缩后会发生什么

压缩运行时，所选较早范围的对话会被替换为一条摘要消息；近期历史不受影响，对话从摘要继续。压缩可以由 token 压力自动触发、按需触发，或针对显式范围触发；结果会报告压缩了哪些历史以及估算释放的 token 数。

#### 启用压缩

挂载随附后端以注册压缩服务，并添加 `dsh-command-compact` 获得按需命令：

```yaml
- name: '@deepseek-ai/dsh-compaction-basic'
- name: '@deepseek-ai/dsh-command-compact'
```

有了这两行配置，功能即已开启：会话增长时自动压缩，`/compact` 收到请求后立即压缩并报告替换了多少历史项。如果未挂载后端，什么都不会压缩，`/compact` 也会失败；随附后端的完整依赖链见其自身 README。

#### 实现后端

继承提供的基类并实现三个操作：一个针对自动触发决定并执行压缩，一个按需压缩，一个压缩对话的显式范围。把你的类作为插件加载，它就会成为该组合的压缩服务。精确签名、失败规则以及每个后端必须生成的检查点标记，见下方实现章节与压缩子系统参考。

#### 识别压缩后的历史

后端写入的摘要消息带有稳定标记，因此任何消费方都能在持久化或克隆后识别压缩历史，而无需知道是哪个后端生成的。该标记从包根导出，也从一个无 Cordis 依赖的子路径导出，客户端与 wire 程序均可导入。

-----

### 已知限制与延期工作

这些限制说明无论加载哪个后端，压缩都无法做到的事；它们是当前包约束。

- **面向用户的命令，而非模型工具**——压缩由 `/compact` 命令与自动压力触发；不会注册面向模型的压缩工具。
- **部分单元溢出不在约定内**——平衡摘要压缩无法拆分一个不可分单元。当闭合工具对中可移除的主要部分是承载文本的工具结果时，可选剪枝配套服务仍可修复该工具对；无法压缩大型非工具节点，或不可剪枝剩余部分过大的工具单元。
- **单独接近窗口大小的 envelope 不属于表层压缩工作**——压缩缩减派生历史，绝不缩减系统提示词、工具或会话前缀。

## CompactionAgentContext（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CompactionAgentContext {
    session: Session;
    options: {
        provider?: string;
        model?: string;
    };
}
```

公开导入：`@deepseek-ai/dsh-compaction`；公开符号：`CompactionAgentContext`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`options`、`session`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction.md)。

## CompactionCheckpointSource（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CompactionCheckpointSource = typeof COMPACT_CHECKPOINT_MARKER & {
    readonly compactionId: CompactionId;
    readonly sourceCommandId?: CommandId;
};
```

公开导入：`@deepseek-ai/dsh-compaction`；公开符号：`CompactionCheckpointSource`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`compactionId`、`kind`、`sourceCommandId`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction.md)。

## CompactionEngine（.）

公开导入：`@deepseek-ai/dsh-compaction`；公开符号：`CompactionEngine`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare abstract class CompactionEngine extends Service {
    constructor(ctx: Context);
    abstract compactIfNeeded(agent: CompactionAgentContext, trigger: CompactionTrigger, signal: AbortSignal): Promise<CompactionResult | null>;
    abstract compactNow(agent: ManualCompactAgentContext, signal: AbortSignal, sourceCommandId?: CommandId): Promise<CompactionResult | null>;
    abstract compactRegion(start: SessionSeq, end: SessionSeq, agent: CompactionAgentContext, signal?: AbortSignal): Promise<CompactionResult>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction.md)。

## CompactionId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export declare function CompactionId(id: string): CompactionId;

export type CompactionId = Branded<'CompactionId'>;
```

公开导入：`@deepseek-ai/dsh-compaction`；公开符号：`CompactionId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction.md)。

## CompactionResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CompactionResult {
    compactionId: CompactionId;
    sourceCommandId?: CommandId;
    startSeq: SessionSeq;
    summarySeq: SessionSeq;
    endSeq: SessionSeq;
    summary: ContentBlock[];
    shadowedRange: {
        start: SessionSeq;
        end: SessionSeq;
    };
    shadowedSeqs: SessionSeq[];
    shadowedTokenCount: number;
}
```

公开导入：`@deepseek-ai/dsh-compaction`；公开符号：`CompactionResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`compactionId`、`endSeq`、`shadowedRange`、`shadowedSeqs`、`shadowedTokenCount`、`sourceCommandId`、`startSeq`、`summary`、`summarySeq`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction.md)。

## CompactionTrigger（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CompactionTrigger = 'pressure' | 'context-overflow';
```

公开导入：`@deepseek-ai/dsh-compaction`；公开符号：`CompactionTrigger`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction.md)。

## ManualCompactAgentContext（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ManualCompactAgentContext extends CompactionAgentContext {
    runMaintenance<T>(task: (signal: AbortSignal) => Promise<T>): Promise<T>;
}
```

公开导入：`@deepseek-ai/dsh-compaction`；公开符号：`ManualCompactAgentContext`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`options`、`runMaintenance`、`session`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction.md)。

## ManualCompactionError（.）

公开导入：`@deepseek-ai/dsh-compaction`；公开符号：`ManualCompactionError`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class ManualCompactionError extends Error {
    readonly code: ManualCompactionErrorCode;
    readonly name = "ManualCompactionError";
    constructor(code: ManualCompactionErrorCode, message: string, options?: ErrorOptions);
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction.md)。

## ManualCompactionErrorCode（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ManualCompactionErrorCode = 'busy' | 'cancelled' | 'changed' | 'summary' | 'commit' | 'persistence';
```

公开导入：`@deepseek-ai/dsh-compaction`；公开符号：`ManualCompactionErrorCode`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction.md)。

## compactCheckpointSource（.）

公开导入：`@deepseek-ai/dsh-compaction`；公开符号：`compactCheckpointSource`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function compactCheckpointSource(compactionId: CompactionId, sourceCommandId?: CommandId): CompactionCheckpointSource;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction.md)。

## isCompactCheckpointSource（.）

公开导入：`@deepseek-ai/dsh-compaction`；公开符号：`isCompactCheckpointSource`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function isCompactCheckpointSource(source: MessageSource): source is CompactionCheckpointSource;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction.md)。

## toolPairingBalancedAfter（.）

公开导入：`@deepseek-ai/dsh-compaction`；公开符号：`toolPairingBalancedAfter`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function toolPairingBalancedAfter(session: Session, seq: SessionSeq): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction.md)。

## toolPairingBalancedBefore（.）

公开导入：`@deepseek-ai/dsh-compaction`；公开符号：`toolPairingBalancedBefore`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function toolPairingBalancedBefore(session: Session, seq: SessionSeq): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    compaction: CompactionEngine;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `compaction` | `compaction: CompactionEngine` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-compaction.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。

## Events 声明合并入口

完整公开声明：

```text
interface Events {
    'compaction/summary-error'(payload: {
        session: Session;
        sourceEventSeqs: readonly SessionSeq[];
        error: unknown;
        signal?: AbortSignal;
    }, next: () => boolean): boolean;
}
```


本包通过 Cordis `Events` 声明以下事件。监听注册归调用插件 scope，卸载后撤回；waterfall handler 只有调用 next 才继续到下一层，不把观察通知改作隐式授权。可持久重建的业务事实由服务写入 Session，事件监听本身不形成恢复记录。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `compaction/summary-error` | `'compaction/summary-error'(payload: { session: Session; sourceEventSeqs: readonly SessionSeq[]; error: unknown; signal?: AbortSignal }, next: () => boolean): boolean` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-compaction.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
