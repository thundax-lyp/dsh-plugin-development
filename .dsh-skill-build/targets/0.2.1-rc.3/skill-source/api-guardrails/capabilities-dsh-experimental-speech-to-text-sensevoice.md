# @deepseek-ai/dsh-experimental-speech-to-text-sensevoice 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

此 Provider 在 Host CPU 上使用 SenseVoiceSmall ONNX 与 Silero VAD 识别语音。各平台的 sherpa-onnx Node 包包含 ONNX Runtime；用户无需 Python、编译器或模型转换。启用时检查缓存资源，不加载模型或下载资源。

### 使用此包

Bundle 在 DSH 主目录下提供绝对 `dataRoot`。准备会下载固定修订的模型文件，校验大小与 SHA-256，再加载模型。`precision` 默认为 `int8`，`fp32` 选择较大的参考权重。`modelDirectory` 提供包含所选 ONNX 文件和 `tokens.txt` 的已有绝对目录，`vadModelPath` 选择已有 Silero ONNX 文件。取消或失败后复用已完成并通过校验的文件。

下载每个缺失文件前，Host 会比较兼容 Hugging Face 的 `modelOrigins`，默认为 `https://huggingface.co` 和 HF-Mirror。并发 HEAD 请求沿用固定文件路径，通过 Host 的 fetch 代理跟随重定向，先返回 2xx 的源优先下载。`modelProbeTimeoutMs` 默认为 3000 毫秒；所有探测均失败时按配置顺序下载。网络、HTTP、证书或完整性校验失败会尝试其他源；取消、存储错误和未分类错误会停止准备。所有源都必须符合固定修订、大小和 SHA-256 校验值。响应延迟不代表下载吞吐量，完整下载仍受准备阶段的总超时约束。

显式 `modelOrigin` 仅使用指定源，不探测也不回退到公共源。只有一个地址的 `modelOrigins` 同样跳过探测。已校验的缓存和显式离线路径无需请求下载源。语音 UI 在准备或重试前提供已公布的下载源。手动选择仅覆盖本次任务，只使用指定源而不回退，且不能替换进行中任务的源。Host 拒绝配置之外的源；完全离线部署不公布下载源。

下载失败会标明文件与下载源，并提供原因分类，以及可用的 HTTP 状态或错误码。公开状态不包含 URL 凭据、查询参数和原始底层错误消息。重试复用已校验文件，未完成的文件重新下载。

每次启用都会检查磁盘上的所选模型、词表与 VAD。缓存完整且校验通过后立即恢复就绪，首次录音再唤醒工作进程。文件缺失或托管文件校验不符时需要显式准备；路径不可读时报告错误。显式部署路径只检查可访问性，文件内容由部署者负责。禁用插件或重启 Host 后，无需重新下载完好的缓存。

-----

### 已知限制与后续工作

- 仅使用 CPU。原生包面向 macOS arm64/x64、Linux glibc arm64/x64 和 Windows x64；Windows ARM64 与 Linux musl 尚非已验证部署目标。INT8 权重约 239 MB，FP32 约 938 MB，另需运行时和 VAD。模型内存大于文件大小，并随录音长度增长；安装提示属于估算。语言提示包括自动、中文、英语、粤语、日语和韩语。禁用插件保留模型缓存。桌面发行包仍需各平台签名和麦克风权限验收；Linux 桌面分发不属于此 Provider。

-----

## Config（.）

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text-sensevoice`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    providerId: string;
    dataRoot: string;
    modelDirectory?: string | undefined;
    vadModelPath?: string | undefined;
    precision: 'int8' | 'fp32';
    modelOrigin?: string | undefined;
    modelOrigins: string[];
    modelProbeTimeoutMs: number;
    threads: number;
    segmentSeconds: number;
    vadThreshold: number;
    minSpeechSeconds: number;
    minSilenceSeconds: number;
    vadOnsetPaddingSeconds: number;
    maxAudioBytes: number;
    prepareTimeoutMs: number;
    inferenceTimeoutMs: number;
    idleTimeoutMs: number;
    maxPending: number;
    graceMs: number;
    maxLogBytes: number;
    maxResponseBytes: number;
    progressIntervalMs: number;
}

export declare const Config: z<Partial<Config>, Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text-sensevoice.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text-sensevoice`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text-sensevoice.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text-sensevoice`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text-sensevoice.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-experimental-speech-to-text-sensevoice`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "experimental-speech-to-text-sensevoice";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-speech-to-text-sensevoice.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
