# @deepseek-ai/dsh-experimental-translator 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`ctx.translator` 通过 Bing 或 Google 翻译一次有大小限制的文本请求，也可选用付费的原生 DeepSeek Flash 路由。默认仍为 Bing；匿名端点无需登录或 API 密钥。付费翻译需要显式选择，并要求现有的持久 Session。此实验包需要显式启用。

### 使用本包

将本包挂载为 Cordis 服务。先调用 `resolve({ text, targetLanguage, sourceLanguage?, provider?, sessionId? })`，再调用 `translate(spec, signal?)`，结果为翻译后的纯文本。省略源语言时使用 `auto`；省略提供者时使用配置中的 `provider`，初始为 `bing`。消费者可以读取 `maxTextChars`，在提交前拆分较长文本。

| 配置 | 默认值 | 含义 |
|---|---|---|
| `provider` | `bing` | `google`、`bing`、`deepseek-account` 或 `deepseek-official` |
| `googleEndpoint` | `https://translate.googleapis.com/translate_a/single` | 兼容 Google 的匿名端点 |
| `bingEndpoint` | `https://edge.microsoft.com/translate/translatetext` | Microsoft Edge 浏览器翻译端点 |
| `timeoutMs` | `10000` | 请求及完整响应正文的截止时间 |
| `maxTextChars` | `4000` | 每次请求提交文本的 UTF-16 代码单元上限 |
| `maxResponseBytes` | `1048576` | 匿名 JSON 正文或付费译文拼接后的 UTF-8 字节数上限 |
| `deepseekTimeoutMs` | `60000` | 原生路由准入／输出与 `availableProviders()` 发现的截止时间 |
| `deepseekMaxOutputTokens` | `8192` | 独立 Flash 翻译请求的输出 token 上限 |

端点接受不含凭据或片段的 HTTP(S) URL。原生 `fetch` 使用 Host 的全局分发器及 `dsh` 启动器安装的 HTTP 代理策略。无需新增翻译库。

传入现有的 `sessionId`，即可将翻译请求和成功结果保存在该 Session 日志中。`translate()` 返回成功结果之前会完成持久化刷新；在精确原文、源语言、目标语言、提供方和翻译配方匹配时，重新挂载或进程重启后会复用已有结果。已保存结果只需持久 Session 存储即可读取。缓存未命中时要求 Session 已激活；消费者负责激活。不传 `sessionId` 的匿名调用仍不保存状态。付费路由必须传入 `sessionId`；原生准入之前会读取已有结果，因此凭据或原生提供方不可用时仍可复用保存的结果。只有缓存未命中时才可能发起付费查询。`availableProviders(signal?)` 只检查原生资格，不执行推理。

GUI 等待首次提供方发现完成后才注册翻译控件。如果凭据或模型发现停滞，免登录翻译控件可能最多延迟 `deepseekTimeoutMs` 才出现；服务的发现截止时间会返回已经发现的选项，包括 Bing 和 Google。

非空文本的付费缓存未命中时，要求实际的 `dsh-llm-deepseek-account` 或 `dsh-llm-deepseek-api-key` 提供方、已注册路由、配置好的认证，以及精确的模型 id `deepseek-flash`。显示名称和版本标签不影响选择，`llm-pi-ai` 不符合条件。每个片段都是全新的查询：关闭思考，仅含一条用户文本，没有对话历史、工具或 Agent 轮次。

匿名服务将 `zh`、`zh-CN`、`zh-SG` 和 `zh-Hans` 映射为简体中文，将 `zh-TW`、`zh-HK`、`zh-MO` 和 `zh-Hant` 映射为繁体中文。其他标签原样传给所选提供者。空文本直接返回空字符串，不发送网络请求。

-----

### 已知限制与待办事项

- 这些非官方浏览器端点不保证支持第三方 API 调用。它们可能限流、不可用或更改响应格式。在中国大陆的可用性取决于用户网络；服务不保证覆盖整个地区的连接能力。
- 付费翻译仅在缓存未命中时产生对应原生路由的推理费用。保存的结果采用实验插件记录保留机制，未来 Session 格式迁移可能丢失这些记录。任何路由都不会回退到其他提供方。
- 不支持的语言标签由所选提供者报错。消费者负责 Session 激活、段落调度、输入拆分和显示回退。服务复用匹配的持久成功结果；通过准入检查的缓存未命中请求执行单次调用，从不重试或切换提供方。
- 每个片段的查找都会扫描完整 Session 日志并重建翻译索引。较长日志中的大量片段可能延迟展示。不保留增量索引。
- 失败或中断的尝试仍作为仅追加的请求记录保留；重试在派发前追加新的请求序号，不复用未完成尝试。
- 格式错误的翻译记录或引用不存在请求的结果会使该 Session 的所有绑定翻译查找均以 `TRANSLATION_STORAGE_ERROR` 拒绝；服务不跳过或修复这些记录。不传 `sessionId` 的调用不读取这些记录。

-----

## AnonymousTranslationProvider（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type AnonymousTranslationProvider = 'google' | 'bing';
```

公开导入：`@deepseek-ai/dsh-experimental-translator`；公开符号：`AnonymousTranslationProvider`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-translator.md)。

## AnonymousTranslationSpec（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface AnonymousTranslationSpec extends TranslationSpecFields {
    readonly provider: AnonymousTranslationProvider;
}
```

公开导入：`@deepseek-ai/dsh-experimental-translator`；公开符号：`AnonymousTranslationSpec`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`provider`、`sessionId`、`sourceLanguage`、`targetLanguage`、`text`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-translator.md)。

## Config（.）

公开导入：`@deepseek-ai/dsh-experimental-translator`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    provider: TranslationProvider;
    googleEndpoint: string;
    bingEndpoint: string;
    timeoutMs: number;
    maxTextChars: number;
    maxResponseBytes: number;
    deepseekTimeoutMs: number;
    deepseekMaxOutputTokens: number;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-translator.md)。

## PaidTranslationProvider（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type PaidTranslationProvider = 'deepseek-account' | 'deepseek-official';
```

公开导入：`@deepseek-ai/dsh-experimental-translator`；公开符号：`PaidTranslationProvider`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-translator.md)。

## PaidTranslationSpec（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PaidTranslationSpec extends TranslationSpecFields {
    readonly provider: PaidTranslationProvider;
    readonly sessionId: SessionId;
}
```

公开导入：`@deepseek-ai/dsh-experimental-translator`；公开符号：`PaidTranslationSpec`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`provider`、`sessionId`、`sourceLanguage`、`targetLanguage`、`text`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-translator.md)。

## TranslationError（.）

公开导入：`@deepseek-ai/dsh-experimental-translator`；公开符号：`TranslationError`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class TranslationError extends Error {
    readonly code: TranslationErrorCode;
    name: string;
    constructor(code: TranslationErrorCode, message: string);
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-translator.md)。

## TranslationErrorCode（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type TranslationErrorCode = 'TRANSLATION_TEXT_LIMIT' | 'TRANSLATION_HTTP_ERROR' | 'TRANSLATION_INVALID_RESPONSE' | 'TRANSLATION_RESPONSE_LIMIT' | 'TRANSLATION_REQUEST_FAILED' | 'TRANSLATION_TIMEOUT' | 'TRANSLATION_SESSION_REQUIRED' | 'TRANSLATION_SESSION_INACTIVE' | 'TRANSLATION_STORAGE_ERROR' | 'TRANSLATION_UNAVAILABLE';
```

公开导入：`@deepseek-ai/dsh-experimental-translator`；公开符号：`TranslationErrorCode`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-translator.md)。

## TranslationIdentity（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TranslationIdentity {
    readonly provider: string;
    readonly text: string;
    readonly sourceLanguage: string;
    readonly targetLanguage: string;
    readonly recipe: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-translator`；公开符号：`TranslationIdentity`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`provider`、`recipe`、`sourceLanguage`、`targetLanguage`、`text`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-translator.md)。

## TranslationProvider（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type TranslationProvider = AnonymousTranslationProvider | PaidTranslationProvider;
```

公开导入：`@deepseek-ai/dsh-experimental-translator`；公开符号：`TranslationProvider`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-translator.md)。

## TranslationRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TranslationRequest {
    readonly text: string;
    readonly targetLanguage: string;
    readonly sourceLanguage?: string;
    readonly provider?: TranslationProvider;
    readonly sessionId?: SessionId;
}
```

公开导入：`@deepseek-ai/dsh-experimental-translator`；公开符号：`TranslationRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`provider`、`sessionId`、`sourceLanguage`、`targetLanguage`、`text`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-translator.md)。

## TranslationRequestRecord（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TranslationRequestRecord extends TranslationIdentity {
    readonly metadata?: Record<string, unknown>;
}
```

公开导入：`@deepseek-ai/dsh-experimental-translator`；公开符号：`TranslationRequestRecord`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`metadata`、`provider`、`recipe`、`sourceLanguage`、`targetLanguage`、`text`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-translator.md)。

## TranslationResultRecord（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TranslationResultRecord {
    readonly requestSeq: SessionSeq;
    readonly text: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-translator`；公开符号：`TranslationResultRecord`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`requestSeq`、`text`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-translator.md)。

## TranslationSpec（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type TranslationSpec = AnonymousTranslationSpec | PaidTranslationSpec;
```

公开导入：`@deepseek-ai/dsh-experimental-translator`；公开符号：`TranslationSpec`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`provider`、`sessionId`、`sourceLanguage`、`targetLanguage`、`text`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-translator.md)。

## default（.）

公开导入：`@deepseek-ai/dsh-experimental-translator`；公开符号：`default`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export default class Translator extends Service {
    static Config: z<Schemastery.ObjectS<NoInfer<{
        provider: z<"google" | "bing" | "deepseek-account" | "deepseek-official", "google" | "bing" | "deepseek-account" | "deepseek-official", "defined">;
        googleEndpoint: z<string, string, "defined">;
        bingEndpoint: z<string, string, "defined">;
        timeoutMs: z<number, number, "defined">;
        maxTextChars: z<number, number, "defined">;
        maxResponseBytes: z<number, number, "defined">;
        deepseekTimeoutMs: z<number, number, "defined">;
        deepseekMaxOutputTokens: z<number, number, "defined">;
    }>>, Schemastery.ObjectT<NoInfer<{
        provider: z<"google" | "bing" | "deepseek-account" | "deepseek-official", "google" | "bing" | "deepseek-account" | "deepseek-official", "defined">;
        googleEndpoint: z<string, string, "defined">;
        bingEndpoint: z<string, string, "defined">;
        timeoutMs: z<number, number, "defined">;
        maxTextChars: z<number, number, "defined">;
        maxResponseBytes: z<number, number, "defined">;
        deepseekTimeoutMs: z<number, number, "defined">;
        deepseekMaxOutputTokens: z<number, number, "defined">;
    }>>, "plain">;
    constructor(ctx: Context, config: Config);
    get maxTextChars(): number;
    availableProviders(signal?: AbortSignal): Promise<readonly TranslationProvider[]>;
    resolve(request: TranslationRequest): TranslationSpec;
    translate(spec: TranslationSpec, signal?: AbortSignal): Promise<string>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-translator.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    translator: Translator;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `translator` | `translator: Translator` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-experimental-translator.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
