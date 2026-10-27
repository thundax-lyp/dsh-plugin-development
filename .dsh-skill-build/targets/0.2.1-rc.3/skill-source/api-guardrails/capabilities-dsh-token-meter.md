# @deepseek-ai/dsh-token-meter 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

使用 `ctx.tokenMeter` 估算会话当前的请求与上下文压力，或为单条消息计价。测量会回放持久会话日志，结果确定且不进行模型调用，因此压缩、占用显示与遥测可以共享同一结果。会话投影可用时，消费方可以读取 `tokenUsage`、`contextPressure` 与 `contextBreakdown`；文本和没有图片定价的路由采用近似的固定启发式规则，存在声明时应用视觉 token 定价，文件则按模型可见的句柄文本计价。只有请求 envelope 完全相同时才复用提供方报告的用量；本包不添加模型可见内容，也不在 loop 中做决策。

### 使用本包

当消费方需要为压缩决策、占用显示或遥测获取 token 或上下文压力时挂载本插件。估算器没有任何配置，也不添加模型可见表面；模型容量属于拥有精确提供方／模型路由的适配器，可通过 `ctx.llm.resolveModelInfo().context` 获取。

#### 何时选择

当多个插件应该就同一种基于回放的测量达成一致时选择它——压缩规划、占用 UI 与压力检查都读取同一个 fold。测量回放持久会话日志，因此确定、无需模型调用，并精确反映已记录内容。文本和未声明图片定价的路由使用固定启发式规则；当部署需要精确到计费级别的计数时，使用提供方分词器。

#### 测量压力

`ctx.tokenMeter` 暴露两个操作。`measure(session, requestHeader?)` 在同一个已消费日志 revision 上返回独立、深度不可变的快照：`totalTokens` 是请求与响应压力，`surfaceTokens` 是仅表面的路由定价总量，等于 `nodes[].tokens` 之和。可选 `requestHeader` 覆盖会选择计价路由与压力字段；节点集合仍描述当前会话。`estimateMessage(message)` 用固定启发式规则为一条消息计价。每次调用都会克隆带位置的表面节点，因此测量是 O(surface)。

每次测量都会通过可选的 `llm` 服务解析生效 envelope 的提供方／模型。适配器声明图片定价时，图片出现处使用路由请求的视觉 token 价格加模型可见文本，`image/offload` 事件选中的出现位置则按路由的占位文本计价，与表层实际发送的一致；其他路由保持固定启发式规则。文件出现处使用同一个 `llm` 服务为适配器分发解析的确切、与路由无关的 句柄文本，其中包含当前执行世界路径或明确的无路径说明。每个节点还携带与路由无关的 `heuristicTokens`，供替换影子价使用。只有当最新成功调用的规范请求 envelope 与已测量 envelope 匹配、且其总量不低于该调用完整路由定价锚点时，才复用提供方用量；否则会对完整当前 envelope 与表面做估算。表面变更保持相对于按同一路由重新定价的匹配锚点的带符号值，包括缩减替换后的负 delta。

测量锚点包含成功的 `assistant/message` 之前的已计价表面，包括 `step/start` 之后接纳的系统与用户消息，以及重试之前执行的替换。持久输出未变时，完成调用的表面增量为零：其提示词已包含在提供方用量中。后续表面变更仍是相对于该锚点的带符号增量。

#### 会话投影

当组合提供 `ctx.sessionProjections` 时，token-meter 注册三个投影单元。`tokenUsage` 携带完整持久日志中的 `uncachedInputTokens`、`outputTokens`、`cacheReadTokens` 与 `cacheWriteTokens`。最终 assistant 消息样本会替换同一次尝试的流式用量；`llm/retry-started` 会结束该替换范围，因此同一步骤中的重试会贡献另一次计费用量。`contextPressure` 携带可选 `pressureTokens`（提供方报告的最新提示词规模）、可选 `projectedTokens`（下一个请求的提示词将花费多少）与来自最新一条 `request/context` 记录的可选 `contextWindow`。`contextBreakdown` 携带启发式 `systemTokens`、`toolsTokens` 与 `messageTokens`——上下文的构成，而非提供方计费规模。卸载插件会移除全部三个键。

图片省略重新计算现有节点的价格，同时保留此前的用量锚点。固定引用启发式规则不计入 `offloaded` 元数据，因此一次省略决定不改变 `contextBreakdown` 或标量启发式总量，按路由的测量则把所选图片的视觉价格换成占位文本价格。

`contextBreakdown` 把 surface 顺序中最后一个非空且存活的 `system/message` 归入 `systemTokens`；休眠的空节点不贡献 token，没有非空系统消息时为零。`messageTokens` 包含其余所有可见节点，包括被取代的提示词。在追加、已计量的压缩与裁剪、系统提示词改写或清空之后，两者之和等于 `measure().nodes[].heuristicTokens`；对非系统范围的未计量替换以零增量折叠，与 `contextPressure` 相同。`toolsTokens` 跟随最新 `request/header`。三个数字都使用固定启发式规则，而非路由图片定价或文件句柄投影；它们是近似构成，不是计费数据或 `projectedTokens`。

`deriveTurnTokenUsage(events)` 为浏览器消费方把一个完整轮次折叠为精确的逐次尝试与整轮用量。生命周期证据缺失、计数不安全或精确总量矛盾时不返回结果；只有每次参与的尝试都报告可选缓存、推理或路由值时，相应汇总才会出现。

#### 组合

```yaml
- name: '@deepseek-ai/dsh-token-meter'
- name: '@deepseek-ai/dsh-compaction-basic'
```

两个插件都有可用默认值。meter 只消费可选的 `llm` 服务，且仅用于解析路由声明的请求图片定价；压缩保持可选。部署会在 LLM（大语言模型）适配器上配置容量与图片定价，并在 `dsh-compaction-basic` 上配置压缩策略。

#### 解读数字

占用是参考数字，不是计费记录：harness 中没有任何机制依据它做决定，压缩读取的是 `measure()`。UI 用测量压力除以所选模型独立解析的容量来计算占用。`contextBreakdown` 数字是估算值，其总和不会等于 `projectedTokens`；后者的提供方锚点恰好携带启发式误差——CJK 文本与 JSON schema 在每 token 四字符下严重低估。

-----

### 已知限制与延期工作

这些限制说明计量在哪里停止、由未来工作接续。它们是当前包约束，不是通用 token 计量对比或任务积压。

- **固定启发式规则是近似值**——没有可复用提供方用量的文本按字符数加结构开销计价，而非精确提供方分词器或请求序列化器；只有声明了定价的路由上的图片出现处携带提供方精确的视觉 token。
- **每次测量都克隆当前表面**——连贯不可变快照让读取为 O(surface)，包括低于阈值的压力检查。
- **提供方用量只在规范 envelope 完全相同时可复用**——工具、提供方、模型或调用配置变化会刻意回退到完整启发式估算；系统提示词变更在下一次成功调用之前按带符号的表面增量计量。
- **系统提示词改写不带影子价**——循环替换 system 节点时没有紧邻的计量事件，因此 `contextPressure.projectedTokens` 以零增量折叠该替换，直到下一个用量样本；`contextBreakdown.systemTokens` 与 `measure()` 会立即按新提示词重新计价。
- **构成检查点保留当前 surface**——精确的 system/message 分类需要位置条目；检查点大小和 surface 事件折叠成本为 O(当前保留 surface)。

## ContextBreakdownProjection（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ContextBreakdownProjection {
    systemTokens: number;
    toolsTokens: number;
    messageTokens: number;
}
```

公开导入：`@deepseek-ai/dsh-token-meter`；公开符号：`ContextBreakdownProjection`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`messageTokens`、`systemTokens`、`toolsTokens`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## ContextPressureProjection（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ContextPressureProjection {
    pressureTokens?: number;
    projectedTokens?: number;
    contextWindow?: number;
}
```

公开导入：`@deepseek-ai/dsh-token-meter`；公开符号：`ContextPressureProjection`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`contextWindow`、`pressureTokens`、`projectedTokens`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## TokenMeasurement（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TokenMeasurement {
    readonly logRevision: SessionLogOffset;
    readonly baseline: TokenMeasurementBaseline;
    readonly surfaceDeltaTokens: number;
    readonly totalTokens: number;
    readonly surfaceTokens: number;
    readonly nodes: readonly TokenSurfaceNode[];
}
```

公开导入：`@deepseek-ai/dsh-token-meter`；公开符号：`TokenMeasurement`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`baseline`、`logRevision`、`nodes`、`surfaceDeltaTokens`、`surfaceTokens`、`totalTokens`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## TokenMeasurementBaseline（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type TokenMeasurementBaseline = {
    readonly kind: 'none';
    readonly tokens: 0;
} | {
    readonly kind: 'estimated';
    readonly tokens: number;
} | {
    readonly kind: 'usage';
    readonly tokens: number;
    readonly usage: Readonly<TokenUsage>;
};
```

公开导入：`@deepseek-ai/dsh-token-meter`；公开符号：`TokenMeasurementBaseline`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`kind`、`tokens`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## TokenMeter（.）

公开导入：`@deepseek-ai/dsh-token-meter`；公开符号：`TokenMeter`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class TokenMeter extends Service {
    static Config: z<TokenMeterConfig>;
    static inject: string[];
    constructor(ctx: Context, config?: TokenMeterConfig);
    measure(session: Session, requestHeader?: EpochHeader): TokenMeasurement;
    estimateMessage(message: Message): number;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## TokenMeterConfig（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type TokenMeterConfig = Record<string, never>;
```

公开导入：`@deepseek-ai/dsh-token-meter`；公开符号：`TokenMeterConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## TokenSurfaceNode（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TokenSurfaceNode {
    readonly seq: SessionSeq;
    readonly tokens: number;
    readonly heuristicTokens: number;
}
```

公开导入：`@deepseek-ai/dsh-token-meter`；公开符号：`TokenSurfaceNode`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`heuristicTokens`、`seq`、`tokens`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## TokenUsageProjection（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TokenUsageProjection {
    uncachedInputTokens: number;
    outputTokens: number;
    cacheReadTokens: number;
    cacheWriteTokens: number;
}
```

公开导入：`@deepseek-ai/dsh-token-meter`；公开符号：`TokenUsageProjection`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`cacheReadTokens`、`cacheWriteTokens`、`outputTokens`、`uncachedInputTokens`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## contextBreakdownProjectionDefinition（.）

公开导入：`@deepseek-ai/dsh-token-meter`；公开符号：`contextBreakdownProjectionDefinition`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

公开声明（保留类型空间与值空间）：

```text
export declare const contextBreakdownProjectionDefinition: {
    key: "contextBreakdown";
    stateVersion: number;
    stateSchema: z.ZodObject<{
        systems: z.ZodArray<z.ZodObject<{
            seq: z.ZodPipe<z.ZodNumber, z.ZodTransform<SessionSeq, number>>;
            tokens: z.ZodNumber;
        }, z.core.$strict>>;
        surfaceTokens: z.ZodNumber;
        claim: z.ZodOptional<z.ZodObject<{
            start: z.ZodPipe<z.ZodNumber, z.ZodTransform<SessionSeq, number>>;
            end: z.ZodPipe<z.ZodNumber, z.ZodTransform<SessionSeq, number>>;
            tokens: z.ZodNumber;
            systemSeqs: z.ZodArray<z.ZodPipe<z.ZodNumber, z.ZodTransform<SessionSeq, number>>>;
        }, z.core.$strict>>;
        breakdown: z.ZodObject<{
            systemTokens: z.ZodNumber;
            toolsTokens: z.ZodNumber;
            messageTokens: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>;
    init: () => ContextBreakdownState;
    apply: (state: NoInfer<{
        systems: {
            seq: SessionSeq;
            tokens: number;
        }[];
        surfaceTokens: number;
        breakdown: {
            systemTokens: number;
            toolsTokens: number;
            messageTokens: number;
        };
        claim?: {
            start: SessionSeq;
            end: SessionSeq;
            tokens: number;
            systemSeqs: SessionSeq[];
        } | undefined;
    }>, event: import("@deepseek-ai/dsh-session").SessionEvent) => {
        systems: {
            seq: SessionSeq;
            tokens: number;
        }[];
        surfaceTokens: number;
        breakdown: {
            systemTokens: number;
            toolsTokens: number;
            messageTokens: number;
        };
        claim?: {
            start: SessionSeq;
            end: SessionSeq;
            tokens: number;
            systemSeqs: SessionSeq[];
        } | undefined;
    };
    wire: {
        viewSchema: z.ZodObject<{
            systemTokens: z.ZodNumber;
            toolsTokens: z.ZodNumber;
            messageTokens: z.ZodNumber;
        }, z.core.$strict>;
        view: (state: NoInfer<{
            systems: {
                seq: SessionSeq;
                tokens: number;
            }[];
            surfaceTokens: number;
            breakdown: {
                systemTokens: number;
                toolsTokens: number;
                messageTokens: number;
            };
            claim?: {
                start: SessionSeq;
                end: SessionSeq;
                tokens: number;
                systemSeqs: SessionSeq[];
            } | undefined;
        }>) => {
            systemTokens: number;
            toolsTokens: number;
            messageTokens: number;
        };
    };
};
```

这是上方声明的公开对象；按实际类型使用，不把它当作文本常量。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## contextPressureProjectionDefinition（.）

公开导入：`@deepseek-ai/dsh-token-meter`；公开符号：`contextPressureProjectionDefinition`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

公开声明（保留类型空间与值空间）：

```text
export declare const contextPressureProjectionDefinition: {
    key: "contextPressure";
    stateVersion: number;
    stateSchema: z.ZodObject<{
        contextWindow: z.ZodOptional<z.ZodNumber>;
        pressureTokens: z.ZodOptional<z.ZodNumber>;
        surfaceTokens: z.ZodNumber;
        sampledSurfaceTokens: z.ZodOptional<z.ZodNumber>;
        claim: z.ZodOptional<z.ZodObject<{
            start: z.ZodPipe<z.ZodNumber, z.ZodTransform<SessionSeq, number>>;
            end: z.ZodPipe<z.ZodNumber, z.ZodTransform<SessionSeq, number>>;
            tokens: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strict>;
    init: () => {
        surfaceTokens: number;
    };
    apply: (state: NoInfer<{
        surfaceTokens: number;
        contextWindow?: number | undefined;
        pressureTokens?: number | undefined;
        sampledSurfaceTokens?: number | undefined;
        claim?: {
            start: SessionSeq;
            end: SessionSeq;
            tokens: number;
        } | undefined;
    }>, event: SessionEvent) => {
        surfaceTokens: number;
        contextWindow?: number | undefined;
        pressureTokens?: number | undefined;
        sampledSurfaceTokens?: number | undefined;
    };
    wire: {
        viewSchema: z.ZodType<ContextPressureProjection, unknown, z.core.$ZodTypeInternals<ContextPressureProjection, unknown>>;
        view: ({ contextWindow, pressureTokens, surfaceTokens, sampledSurfaceTokens }: NoInfer<{
            surfaceTokens: number;
            contextWindow?: number | undefined;
            pressureTokens?: number | undefined;
            sampledSurfaceTokens?: number | undefined;
            claim?: {
                start: SessionSeq;
                end: SessionSeq;
                tokens: number;
            } | undefined;
        }>) => {
            projectedTokens?: number;
            pressureTokens?: number;
            contextWindow?: number;
        };
    };
};
```

这是上方声明的公开对象；按实际类型使用，不把它当作文本常量。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## tokenUsageProjectionDefinition（.）

公开导入：`@deepseek-ai/dsh-token-meter`；公开符号：`tokenUsageProjectionDefinition`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

公开声明（保留类型空间与值空间）：

```text
export declare const tokenUsageProjectionDefinition: {
    key: "tokenUsage";
    stateVersion: number;
    stateSchema: z.ZodObject<{
        totals: z.ZodObject<{
            uncachedInputTokens: z.ZodNumber;
            outputTokens: z.ZodNumber;
            cacheReadTokens: z.ZodNumber;
            cacheWriteTokens: z.ZodNumber;
        }, z.core.$strict>;
        last: z.ZodNullable<z.ZodObject<{
            turn: z.ZodNumber;
            step: z.ZodNumber;
            buckets: z.ZodObject<{
                uncachedInputTokens: z.ZodNumber;
                outputTokens: z.ZodNumber;
                cacheReadTokens: z.ZodNumber;
                cacheWriteTokens: z.ZodNumber;
            }, z.core.$strict>;
        }, z.core.$strip>>;
    }, z.core.$strict>;
    init: () => {
        totals: TokenUsageProjection;
        last: null;
    };
    apply: (state: NoInfer<{
        totals: {
            uncachedInputTokens: number;
            outputTokens: number;
            cacheReadTokens: number;
            cacheWriteTokens: number;
        };
        last: {
            turn: number;
            step: number;
            buckets: {
                uncachedInputTokens: number;
                outputTokens: number;
                cacheReadTokens: number;
                cacheWriteTokens: number;
            };
        } | null;
    }>, event: SessionEvent) => {
        totals: {
            uncachedInputTokens: number;
            outputTokens: number;
            cacheReadTokens: number;
            cacheWriteTokens: number;
        };
        last: {
            turn: number;
            step: number;
            buckets: {
                uncachedInputTokens: number;
                outputTokens: number;
                cacheReadTokens: number;
                cacheWriteTokens: number;
            };
        } | null;
    };
    wire: {
        viewSchema: z.ZodObject<{
            uncachedInputTokens: z.ZodNumber;
            outputTokens: z.ZodNumber;
            cacheReadTokens: z.ZodNumber;
            cacheWriteTokens: z.ZodNumber;
        }, z.core.$strict>;
        view: (state: NoInfer<{
            totals: {
                uncachedInputTokens: number;
                outputTokens: number;
                cacheReadTokens: number;
                cacheWriteTokens: number;
            };
            last: {
                turn: number;
                step: number;
                buckets: {
                    uncachedInputTokens: number;
                    outputTokens: number;
                    cacheReadTokens: number;
                    cacheWriteTokens: number;
                };
            } | null;
        }>) => {
            uncachedInputTokens: number;
            outputTokens: number;
            cacheReadTokens: number;
            cacheWriteTokens: number;
        };
    };
};
```

这是上方声明的公开对象；按实际类型使用，不把它当作文本常量。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## TurnTokenUsage（./client）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TurnTokenUsage {
    readonly uncachedInputTokens: number;
    readonly outputTokens: number;
    readonly totalTokens: number;
    readonly cacheReadTokens?: number;
    readonly cacheWriteTokens?: number;
    readonly reasoningTokens?: number;
    readonly routes?: readonly TurnTokenUsageRoute[];
}
```

公开导入：`@deepseek-ai/dsh-token-meter/client`；公开符号：`TurnTokenUsage`。 此子路径用于 Client 编译面；不把它的运行对象传到 Host。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`cacheReadTokens`、`cacheWriteTokens`、`outputTokens`、`reasoningTokens`、`routes`、`totalTokens`、`uncachedInputTokens`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## TurnTokenUsageRoute（./client）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TurnTokenUsageRoute {
    readonly provider: string;
    readonly model: string;
}
```

公开导入：`@deepseek-ai/dsh-token-meter/client`；公开符号：`TurnTokenUsageRoute`。 此子路径用于 Client 编译面；不把它的运行对象传到 Host。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`model`、`provider`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## deriveTurnTokenUsage（./client）

公开导入：`@deepseek-ai/dsh-token-meter/client`；公开符号：`deriveTurnTokenUsage`。 此子路径用于 Client 编译面；不把它的运行对象传到 Host。

完整公开声明：

```text
export declare function deriveTurnTokenUsage(events: readonly SessionEvent[]): TurnTokenUsage | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## ROLE_OVERHEAD（./estimate）

公开导入：`@deepseek-ai/dsh-token-meter/estimate`；公开符号：`ROLE_OVERHEAD`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const ROLE_OVERHEAD = 4;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## estimateContent（./estimate）

公开导入：`@deepseek-ai/dsh-token-meter/estimate`；公开符号：`estimateContent`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function estimateContent(blocks: readonly ContentBlock[]): number;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## estimateMessage（./estimate）

公开导入：`@deepseek-ai/dsh-token-meter/estimate`；公开符号：`estimateMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function estimateMessage(message: Message): number;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## estimateStructuralBlock（./estimate）

公开导入：`@deepseek-ai/dsh-token-meter/estimate`；公开符号：`estimateStructuralBlock`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function estimateStructuralBlock(block: ContentBlock): number;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## estimateSystemMessage（./estimate）

公开导入：`@deepseek-ai/dsh-token-meter/estimate`；公开符号：`estimateSystemMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function estimateSystemMessage(message: Message): number;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## estimateToolsTokens（./estimate）

公开导入：`@deepseek-ai/dsh-token-meter/estimate`；公开符号：`estimateToolsTokens`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function estimateToolsTokens(header: EpochHeader | undefined): number;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    tokenMeter: TokenMeter;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `tokenMeter` | `tokenMeter: TokenMeter` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-token-meter.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
