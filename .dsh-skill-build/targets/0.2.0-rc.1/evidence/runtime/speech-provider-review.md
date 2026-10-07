# rc.1 实验语音 Provider 验证

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。公开导出及运行时证据为 `packages/experimental/speech-to-text/src/index.ts`、`types.ts`、`wave.ts`；跨侧门禁为 `packages/experimental/api-speech-to-text/src/index.ts`；可选组合为 `packages/experimental/voice-input-bundle/cordis.patch.yml`。

`evidence/tests/speech-provider-consumer/` 的 package、TS、patch 从 `how-to-register-silence-speech-provider.md` 原样抽取。对 npm 发布的 `@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/dsh-experimental-speech-to-text@0.2.0-rc.1` 和 TypeScript 6.0.3 执行 `npm install --ignore-scripts --no-audit --no-fund` 与 `npm run build`，均通过。`node smoke.mjs` 在真实 Cordis Context 中装载 SpeechToText service 和插件，验证注册、固定 provider、规范静音 WAV 返回空文本/正确秒数、非静音和预取消拒绝、插件卸载后 provider 不在目录且旧 spec 拒绝，均通过。

验证限于一个无资源准备的窄 provider。未运行浏览器录音、API Remote、真实识别模型/网络、准备下载、并发中的 abort 与异步外部清理、Settings 持久选择、Session 提交。故只可确认公开 provider 接入和上述生命周期；不能宣称整条 Voice Input 产品路径通过。
