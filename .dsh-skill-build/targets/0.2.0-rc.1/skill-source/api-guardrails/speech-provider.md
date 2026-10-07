# 实验语音 Provider

## 公开接入面

目标 `dsh-v0.2.0-rc.1` 已发布 `@deepseek-ai/dsh-experimental-speech-to-text` 根入口和 `/types`、`/wave`。普通 Host 插件可向 `ctx.speechToText` 注册一个 `SpeechProvider`；完整且诚实的最小任务见 [注册静音 WAV Provider](how-to-register-silence-speech-provider.md)。这是一项可选实验能力，未装载相应 service 的 Profile 没有 `ctx.speechToText`。`@deepseek-ai/dsh-experimental-api-speech-to-text` 是 Client Remote controller，负责音频字节/时长门禁；它与 UI bundle 的安装并不自动随 provider 注册发生。

## 对象类型与成员

包根 `default` 导出是 `SpeechToText` Service 类；Provider 通过这个服务注册，不应再建立第二个全局 registry。

| 对象                                                | 契约                                                                                                                                                                                                                                                                                                                                                           |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SpeechToText`                                      | `register(provider)` 返回异步 disposer；重复 id 拒绝。`listProviders()`、`snapshot()`、`follow(signal)` 读取目录/准备状态；`resolve(request)` 固定 provider、语言和录音，`transcribe(spec,signal)` 只送到已固定的同一注册，撤销后拒绝；`prepare`/`cancelPreparation` 委托选定 provider；`configure` 要求 Settings service 和 Loader entry 才能持久改默认选择。 |
| `SpeechProvider`                                    | `info` 含 `id`、名称、`location`、`languages`，可选 `setupEstimate`/`downloadSources`；可选 `preparation` 拥有准备/取消；`transcribe({audio,language}, signal)` 必须响应取消、结算自身资源，返回 `{text,audioSeconds,inferenceSeconds}`。空 `text` 表示没有识别到语音。                                                                                        |
| `SpeechPreparation`                                 | `snapshot()`、`subscribe(listener)`、`prepare(options?)`、`cancel()` 是 provider 自己拥有的准备状态；下载来源必须由 provider 校验，UI 订阅不是准备任务的生命周期 owner。                                                                                                                                                                                       |
| `Config`                                            | `defaultProvider` 与 `language` 是 volatile selection；在任务开始前读取并固定。provider id 缺失、语言不在 `languages` 中时拒绝，不默默 fallback 到别家。                                                                                                                                                                                                       |
| `/wave` 的 `validateWave(audio,maxDurationSeconds)` | 检验规范 16 kHz、单声道 PCM16 WAV 和完整长度，返回音频秒数；它不执行识别。                                                                                                                                                                                                                                                                                     |

`SpeechProviderInfo` 是 provider 的公开目录描述（`id`、`name`、`location`、`languages` 与可选准备成本/下载源）；`Transcript` 由 `text`、`audioSeconds`、`inferenceSeconds` 组成，空文本也须给出时长。

## 运行、取消和跨侧组合

注册的 fiber 拥有 provider 的异步 disposer。撤销时 service 先关闭新请求、abort 已接纳录音，再等待 pending transcription settle。provider 应在自己的 `transcribe` 中让外部调用/子进程也响应 signal；只在 Promise 外层检查一次 signal 不足以中断外部工作。`resolve` 固定原 provider 对象，注册被替换后旧 spec 不能误发给新 provider。每次 transcription 返回最终文本，但 service 不替用户提交 Agent 消息；Client UI 决定是否将文本作为用户输入提交。音频/凭证不能写入 Session 事件或日志。

目标 `voice-input-bundle/cordis.patch.yml` 将 registry、SenseVoice provider、API、UI 分别装载；插件作者可以改用自己的 provider，但必须按所选 Profile 补全 `speech-to-text` service、API/客户端及转录资源。`api-speech-to-text` 的 `transcribe` 先校验规范 base64、大小和 WAV，调用 `resolve` 与 `transcribe`，并按 Remote 错误返回；不把“provider 能注册”误写为“浏览器语音输入已可用”。

## 证据与验证

`packages/experimental/speech-to-text/src/index.ts`、`types.ts`、`wave.ts`；`packages/experimental/api-speech-to-text/src/index.ts`；`packages/experimental/voice-input-bundle/cordis.patch.yml`。隔离目标声明编译、Cordis 注册/调用/撤销结果见 `evidence/runtime/speech-provider-review.md`。
