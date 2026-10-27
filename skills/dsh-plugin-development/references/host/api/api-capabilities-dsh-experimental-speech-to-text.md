# @deepseek-ai/dsh-experimental-speech-to-text 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

此服务定义通过 `ctx.speechToText` 选择具名语音识别器。消费者先解析请求再执行，Provider 独立注册。

### 使用此包

通过语音输入 Bundle加载，或组合此服务、Provider 与消费者。`defaultProvider` 为必填项，选择确切的注册 id；Bundle 提供 `sensevoice-local`。`language` 提供省略的语言提示。缺失或重复的 Provider 会明确报错。

提供方通过 `downloadSources` 公布准备阶段可用的源。`prepare(id, options)` 为单次任务转发可选的 `downloadSource`；提供方校验选择，并拒绝在准备期间改源。省略时沿用提供方策略。下载源选择不属于持久化的识别偏好。

-----

### 已知限制与后续工作

- 仅支持完整录音转写。服务没有流式识别或语音合成方法。

-----

## Config（.）

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    defaultProvider: Volatile<string>;
    language: Volatile<string>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## SpeechDownloadFailure（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SpeechDownloadFailure {
    readonly resource: string;
    readonly source: string;
    readonly reason: 'network' | 'dns' | 'timeout' | 'certificate' | 'http' | 'integrity' | 'storage' | 'unknown';
    readonly code?: string;
    readonly status?: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`SpeechDownloadFailure`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`code`、`reason`、`resource`、`source`、`status`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## SpeechInput（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SpeechInput {
    readonly audio: Uint8Array;
    readonly language: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`SpeechInput`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`audio`、`language`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## SpeechPreparation（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SpeechPreparation {
    snapshot(): SpeechPreparationState;
    subscribe(listener: () => void): () => void;
    prepare(options?: SpeechPreparationOptions): void;
    cancel(): Promise<void>;
}
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`SpeechPreparation`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`cancel`、`prepare`、`snapshot`、`subscribe`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这是调用方持有的运行时对象。按上文公开使用路径结束任务；取消和释放不同于业务成功，等待异步清理后才能认定资源已退出。跨进程恢复须读取业务拥有的持久数据，不能序列化此活对象。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## SpeechPreparationOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SpeechPreparationOptions {
    readonly downloadSource?: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`SpeechPreparationOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`downloadSource`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## SpeechPreparationState（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SpeechPreparationState = ({
    readonly phase: 'unprepared' | 'ready' | 'standby' | 'cancelled';
} | {
    readonly phase: 'downloading';
    readonly resource: string;
    readonly completedBytes: number;
    readonly totalBytes?: number;
} | {
    readonly phase: 'checking' | 'loading' | 'waking' | 'cancelling';
    readonly startedAt: number;
} | {
    readonly phase: 'failed';
    readonly message: string;
    readonly download?: SpeechDownloadFailure;
}) & {
    readonly step?: SpeechPreparationStepKind;
    readonly steps?: readonly SpeechPreparationStep[];
};
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`SpeechPreparationState`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`phase`、`step`、`steps`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## SpeechPreparationStep（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SpeechPreparationStep {
    readonly kind: SpeechPreparationStepKind;
    readonly status: 'pending' | 'running' | 'complete' | 'failed' | 'cancelled';
    readonly startedAt?: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`SpeechPreparationStep`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`kind`、`startedAt`、`status`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## SpeechPreparationStepKind（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SpeechPreparationStepKind = 'check' | 'model' | 'vad' | 'verify' | 'load';
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`SpeechPreparationStepKind`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## SpeechProvider（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SpeechProvider {
    readonly info: SpeechProviderInfo;
    readonly preparation?: SpeechPreparation;
    transcribe(input: SpeechInput, signal: AbortSignal): Promise<Transcript>;
}
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`SpeechProvider`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`info`、`preparation`、`transcribe`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## SpeechProviderId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SpeechProviderId = Branded<'SpeechProviderId'>;
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`SpeechProviderId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## SpeechProviderInfo（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SpeechProviderInfo {
    readonly id: SpeechProviderId;
    readonly name: string;
    readonly location: 'host-local' | 'cloud';
    readonly languages: readonly string[];
    readonly setupEstimate?: SpeechSetupEstimate;
    readonly downloadSources?: readonly string[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`SpeechProviderInfo`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`downloadSources`、`id`、`languages`、`location`、`name`、`setupEstimate`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## SpeechProviderView（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SpeechProviderView extends SpeechProviderInfo {
    readonly preparation: SpeechPreparationState;
}
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`SpeechProviderView`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`downloadSources`、`id`、`languages`、`location`、`name`、`preparation`、`setupEstimate`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## SpeechRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SpeechRequest {
    readonly audio: Uint8Array;
    readonly providerId?: SpeechProviderId;
    readonly language?: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`SpeechRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`audio`、`language`、`providerId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## SpeechSelection（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SpeechSelection {
    readonly providerId: SpeechProviderId;
    readonly language: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`SpeechSelection`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`language`、`providerId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## SpeechSelectionPatch（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SpeechSelectionPatch {
    readonly providerId?: SpeechProviderId;
    readonly language?: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`SpeechSelectionPatch`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`language`、`providerId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## SpeechSetupEstimate（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SpeechSetupEstimate {
    readonly recommendedDiskBytes: number;
    readonly expectedMemoryBytes: number;
    readonly minimumMinutes: number;
    readonly maximumMinutes: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`SpeechSetupEstimate`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`expectedMemoryBytes`、`maximumMinutes`、`minimumMinutes`、`recommendedDiskBytes`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## SpeechSnapshot（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SpeechSnapshot {
    readonly providers: readonly SpeechProviderView[];
    readonly selection: SpeechSelection;
}
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`SpeechSnapshot`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`providers`、`selection`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## SpeechSpec（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SpeechSpec extends SpeechInput {
    readonly provider: SpeechProvider;
}
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`SpeechSpec`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`audio`、`language`、`provider`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## Transcript（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface Transcript {
    readonly text: string;
    readonly audioSeconds: number;
    readonly inferenceSeconds: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`Transcript`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`audioSeconds`、`inferenceSeconds`、`text`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## default（.）

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text`；公开符号：`default`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export default class SpeechToText extends Service {
    static Config: z<Schemastery.ObjectS<NoInfer<{
        defaultProvider: z<string, string, "volatile-defined">;
        language: z<string, string, "volatile-defined">;
    }>>, Schemastery.ObjectT<NoInfer<{
        defaultProvider: z<string, string, "volatile-defined">;
        language: z<string, string, "volatile-defined">;
    }>>, "plain">;
    constructor(ctx: Context, config: Config);
    register(provider: SpeechProvider): () => Promise<void>;
    listProviders(): readonly SpeechProviderInfo[];
    follow(caller: AbortSignal): AsyncIterable<SpeechSnapshot>;
    snapshot(): SpeechSnapshot;
    configure(patch: SpeechSelectionPatch): Promise<void>;
    prepare(id: SpeechProviderId, options?: SpeechPreparationOptions): void;
    cancelPreparation(id: SpeechProviderId): Promise<void>;
    resolve(request: SpeechRequest): SpeechSpec;
    transcribe(spec: SpeechSpec, signal: AbortSignal): Promise<Transcript>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

注册在调用方 Cordis scope 中完成。保留返回的 disposer，在插件不再提供该能力时释放；不要让异步任务在 owner 结束后继续写入注册表。服务实现与消费者各自承担其资源，注册回调不是持久化记录。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## validateWave（./wave）

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text/wave`；公开符号：`validateWave`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function validateWave(audio: Uint8Array, maxDurationSeconds: number): number;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    speechToText: SpeechToText;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `speechToText` | `speechToText: SpeechToText` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
