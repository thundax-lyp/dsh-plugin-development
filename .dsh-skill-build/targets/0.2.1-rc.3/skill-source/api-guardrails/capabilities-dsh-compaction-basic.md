# @deepseek-ai/dsh-compaction-basic 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

本包让长时 agent（智能体）会话在接近模型上下文上限时仍能正常工作。token 压力上升时，它会把最旧的历史压缩为摘要并保留近期消息；上下文溢出错误发生后，它会压缩并重试。你也可以通过 `/compact` 按需压缩，并选择先修剪超大工具输出。压缩使用一次额外的模型请求，并且只保留该请求返回的摘要文本。它无法缩减系统提示词、工具或会话前缀，也无法拆分单个不可分单元（例如一次超大工具调用）。

### 使用本包

在已提供 LLM（大语言模型）、会话存储与 token 测量的组合中挂载本包，即可获得自动会话压缩。随附 `dsh` 基础配置默认启用它；需要控制压缩发生的时机时请显式挂载。

#### 你会得到什么

默认设置下你会获得四种行为：会话向模型上下文上限增长时自动压缩；提供方确认上下文溢出错误后的恢复（先压缩再重试该请求）；通过 `/compact` 命令按需压缩；以及——挂载修剪器时——压缩前对超大工具输出的修剪。

#### 最小可用组合

挂载会话存储、token 测量、可选修剪器、本后端，以及可选的按需命令：

```yaml
- name: '@deepseek-ai/dsh-session'
- name: '@deepseek-ai/dsh-token-meter'
- name: '@deepseek-ai/dsh-compaction-tool-result-pruner'
- name: '@deepseek-ai/dsh-compaction-basic'
- name: '@deepseek-ai/dsh-command-compact'
```

你可以通过观察会话越过本来会溢出的位置继续工作、以及运行 `/compact` 立即压缩一次来确认成功。如果组合缺少 LLM、会话存储或 token 测量，插件会加载失败。同一个后端可以服务上下文大小不同的模型；用按模型覆盖为每条路由设置各自的阈值与保留：

```yaml
- name: '@deepseek-ai/dsh-compaction-basic'
  config:
    thresholdRatio: 0.8
    retainRatio: 0.16
    modelPolicies:
      - provider: local
        model: small-context
        thresholdRatio: 0.7
        retainTokens: 2048
```

#### 调整压缩开始的时机

| 字段 | 默认值 | 含义 |
|---|---|---|
| `thresholdRatio` | `0.8` | 用于 `floor(min(W × thresholdRatio, W − O − headroomTokens))` 的窗口比例。 |
| `headroomTokens` | `65536` | 路由请求输出预留之外的额外压力余量；必须为非负整数。 |
| `retainRatio` | `0.16` | 以 `W − O` 的一部分表示逐字保留的近期对话；与 `retainTokens` 互斥。 |
| `retainTokens` | — | 逐字保留的近期对话绝对预算；与 `retainRatio` 互斥，并且必须低于已解析阈值。 |
| `summarizationProvider` | `''` | 与 `summarizationModel` 一起设置；空对使用最新已路由请求目标，再回退到 `AgentOptions` 对。 |
| `summarizationModel` | `''` | 与 `summarizationProvider` 一起设置；空对使用最新已路由请求目标，再回退到 `AgentOptions` 对。 |
| `maxTokens` | `headroomTokens`（`65536`） | 正数摘要输出上限，包含提供方计入的推理 token。显式模型上限覆盖显式全局上限；否则跟随解析后的余量。 |
| `compactionRetries` | `1` | 压力仍高于阈值时，在首次压缩后进行的额外尝试次数。 |
| `maxOverflowRetries` | `1` | 已确认上下文窗口溢出后的最大重试次数；`0` 只禁用恢复。 |
| `modelPolicies` | `[]` | 针对个别模型路由的精确 `{ provider, model, ...partialPolicy }` 覆盖。 |
| `auto` | `true` | 启用自动压缩与溢出恢复；设为 `false` 则仅手动执行。 |

配置错误会快速失败：未知设置、重复的按模型覆盖、无效 token 数、两种保留形式同时出现，或保留比例不小于阈值比例，都会在加载时拒绝插件。模型首次使用时，`W − O − B` 必须为正，且解析出的保留预算必须低于触发阈值。余量为零时，必须在全局或对应模型策略中显式设置正数 `maxTokens`。小窗口部署必须配置适合其容量的余量；降低 `thresholdRatio` 可以提早压缩。

#### 压缩运行时会发生什么

最旧的平衡范围会被替换为一条摘要消息，近期尾部保持逐字不变；对话从摘要继续。操作会报告压缩了多少历史项以及估算释放的 token 数。如果没有任何内容可以安全压缩——例如整个对话就是一个不可分单元——则不会有任何改变，也不会向会话日志写入任何内容。如果没有模型可以撰写摘要（既未配置目标，也还没有已路由请求），压缩会失败并给出清晰错误，提示你配置摘要提供方与模型，或先路由一次请求。

#### 通过 /compact 按需压缩

挂载 `dsh-command-compact` 后，在聊天 UI 中输入 `/compact` 即可立即压缩，即使未达到压力阈值。命令会报告压缩了多少历史项以及估算节省的 token 数。当 agent 正在轮次中或压缩已在运行时，`/compact` 会报告压缩暂不可用；运行期间你发送的提示词会被接受，并在压缩结束后才开始。

#### 修剪超大工具输出

在本包之前挂载 `dsh-compaction-tool-result-pruner`，即可在压缩过程中修剪超大工具结果。修剪不发起模型调用，并可能完全省去摘要：当修剪后的对话在阈值之内时，压缩会跳过摘要。修剪只在压缩触发条件满足后运行——低于压力的对话绝不会被触碰。

-----

### 已知限制与暂缓事项

这些限制说明自动压缩何时不合适，或何时需要特别注意；它们是当前包约束。

- **计量准确度取决于固定启发式规则**——可复用提供方用量缺失时，会回退到字符数加结构开销，而非精确的 token 化；只有在适配器声明了请求图片定价的路由上，图片出现处才携带提供方精确的视觉 token。
- **溢出分类由适配器维护**——提供方措辞可能改变；两个 DeepSeek 适配器将可识别的上下文限制失败规范化为 `CONTEXT_WINDOW_EXCEEDED`。
- **部分不可分单元与仅 envelope 溢出仍不在表层压缩范围内**——恢复无法缩减系统／工具／前缀、拆分不可分的非工具节点，或修复不可剪枝剩余部分仍超出窗口的工具单元。可选 pruner 可以缩减原本不可分工具对内的文本型工具结果主体。
- **`compactRegion` 要求存在未结束的轮次**——在完全关闭的会话上手动调用会抛出异常（「no open turn」），而不是执行压缩。
- **摘要失败会保留最新持久表层**——任何替换前，自动路径会记录警告，并携带完整超预算历史继续。如果剪枝已落地，后续摘要失败会从该持久剪枝表层继续。因达到 `maxTokens` 而发生的摘要截断（隐藏推理 token 可能会耗尽该额度）遵循同一规则。

## BasicCompactionConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface BasicCompactionConfig extends CompactionPolicyConfig {
    modelPolicies?: ModelCompactPolicyConfig[];
    auto?: boolean;
}
```

公开导入：`@deepseek-ai/dsh-compaction-basic`；公开符号：`BasicCompactionConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`auto`、`compactionRetries`、`headroomTokens`、`maxOverflowRetries`、`maxTokens`、`modelPolicies`、`retainRatio`、`retainTokens`、`summarizationModel`、`summarizationProvider`、`thresholdRatio`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-basic.md)。

## BasicCompactionEngine（.）

公开导入：`@deepseek-ai/dsh-compaction-basic`；公开符号：`BasicCompactionEngine`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class BasicCompactionEngine extends CompactionEngine {
    static inject: string[];
    static Config: z<BasicCompactionConfig>;
    readonly config: ResolvedConfig;
    constructor(ctx: Context, config?: BasicCompactionConfig);
    compactIfNeeded(agent: Agent, trigger: CompactionTrigger, signal: AbortSignal): Promise<CompactionResult | null>;
    compactRegion(start: SessionSeq, end: SessionSeq, agent: Agent, signal?: AbortSignal): Promise<CompactionResult>;
    compactNow(agent: Agent, signal: AbortSignal, sourceCommandId?: CommandId): Promise<CompactionResult | null>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-basic.md)。

## CompactionPolicyConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CompactionPolicyConfig {
    thresholdRatio?: number;
    headroomTokens?: number;
    retainRatio?: number;
    retainTokens?: number;
    summarizationProvider?: string;
    summarizationModel?: string;
    maxTokens?: number;
    compactionRetries?: number;
    maxOverflowRetries?: number;
}
```

公开导入：`@deepseek-ai/dsh-compaction-basic`；公开符号：`CompactionPolicyConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`compactionRetries`、`headroomTokens`、`maxOverflowRetries`、`maxTokens`、`retainRatio`、`retainTokens`、`summarizationModel`、`summarizationProvider`、`thresholdRatio`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-basic.md)。

## ModelCompactPolicyConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ModelCompactPolicyConfig extends CompactionPolicyConfig {
    provider: string;
    model: string;
}
```

公开导入：`@deepseek-ai/dsh-compaction-basic`；公开符号：`ModelCompactPolicyConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`compactionRetries`、`headroomTokens`、`maxOverflowRetries`、`maxTokens`、`model`、`provider`、`retainRatio`、`retainTokens`、`summarizationModel`、`summarizationProvider`、`thresholdRatio`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-basic.md)。

## ResolvedCompactSpec（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ResolvedCompactSpec = Omit<ResolvedTargetPolicy, 'retainRatio' | 'retainTokens' | 'headroomTokens'> & {
    readonly contextWindow: number;
    readonly thresholdTokens: number;
    readonly retainTokens: number;
};
```

公开导入：`@deepseek-ai/dsh-compaction-basic`；公开符号：`ResolvedCompactSpec`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`compactionRetries`、`contextWindow`、`maxOverflowRetries`、`maxTokens`、`retainTokens`、`summarizationModel`、`summarizationProvider`、`target`、`thresholdRatio`、`thresholdTokens`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-basic.md)。

## ResolvedConfig（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ResolvedConfig = ResolvedPolicyFields & ResolvedRetention & {
    readonly modelPolicies: readonly Readonly<ModelCompactPolicyConfig>[];
    readonly auto: boolean;
};
```

公开导入：`@deepseek-ai/dsh-compaction-basic`；公开符号：`ResolvedConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`auto`、`compactionRetries`、`headroomTokens`、`maxOverflowRetries`、`maxTokens`、`modelPolicies`、`retainRatio`、`retainTokens`、`summarizationModel`、`summarizationProvider`、`thresholdRatio`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-basic.md)。

## ResolvedRetention（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ResolvedRetention = {
    readonly retainRatio: number;
    readonly retainTokens?: never;
} | {
    readonly retainRatio?: never;
    readonly retainTokens: number;
};
```

公开导入：`@deepseek-ai/dsh-compaction-basic`；公开符号：`ResolvedRetention`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`retainRatio`、`retainTokens`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-basic.md)。

## ResolvedTargetPolicy（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ResolvedTargetPolicy = ResolvedPolicyFields & ResolvedRetention & {
    readonly target: Pick<LlmCallConfig, 'provider' | 'model'>;
};
```

公开导入：`@deepseek-ai/dsh-compaction-basic`；公开符号：`ResolvedTargetPolicy`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`compactionRetries`、`headroomTokens`、`maxOverflowRetries`、`maxTokens`、`retainRatio`、`retainTokens`、`summarizationModel`、`summarizationProvider`、`target`、`thresholdRatio`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-basic.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
