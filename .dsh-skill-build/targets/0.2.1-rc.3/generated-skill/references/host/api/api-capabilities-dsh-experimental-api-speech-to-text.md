# @deepseek-ai/dsh-experimental-api-speech-to-text 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`speech` Remote 将浏览器录音连接至 `ctx.speechToText`，提供 Provider 发现和完整录音转写调用。

### 使用此包

与语音服务定义和 Typert 组合。`maxAudioBytes` 与 `maxDurationSeconds` 限制接收的录音。浏览器 UI 启用时挂载本包生成的 `/remote` 贡献。

`prepare(providerId, { downloadSource })` 将公布的一个下载源转发给提供方，省略时保留其配置策略。目录通过 `downloadSources` 提供选择器选项。提供方拒绝不可用的源，以及对进行中任务的源变更。

-----

### 已知限制与后续工作

- 不提供文件上传、持久化转写历史或流式协议。Base64 会增加传输开销；录音受公布的限制约束。

-----

## Config（.）

公开导入：`@deepseek-ai/dsh-experimental-api-speech-to-text`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    maxAudioBytes: number;
    maxDurationSeconds: number;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-api-speech-to-text.md)。

## SpeechCatalog（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SpeechCatalog extends SpeechSnapshot {
    readonly maxAudioBytes: number;
    readonly maxDurationSeconds: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-api-speech-to-text`；公开符号：`SpeechCatalog`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`maxAudioBytes`、`maxDurationSeconds`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-api-speech-to-text.md)。

## TranscriptionRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TranscriptionRequest {
    readonly audioBase64: string;
    readonly providerId?: SpeechProviderId;
    readonly language?: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-api-speech-to-text`；公开符号：`TranscriptionRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`audioBase64`、`language`、`providerId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-api-speech-to-text.md)。

## default（.）

公开导入：`@deepseek-ai/dsh-experimental-api-speech-to-text`；公开符号：`default`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export default class SpeechController extends TypertRemoteService {
    static inject: string[];
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    catalog(): SpeechCatalog;
    follow(signal: AbortSignal): AsyncIterable<SpeechCatalog>;
    configure(patch: SpeechSelectionPatch): Promise<void>;
    prepare(providerId: SpeechProviderId, options?: SpeechPreparationOptions): void;
    cancelPreparation(providerId: SpeechProviderId): Promise<void>;
    transcribe(request: TranscriptionRequest, signal: AbortSignal): Promise<Transcript>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-api-speech-to-text.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    speechController: SpeechController;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `speechController` | `speechController: SpeechController` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-experimental-api-speech-to-text.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
