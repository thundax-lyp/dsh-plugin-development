# 注册静音 WAV Provider

## 目标与前置

给已经装载 `speechToText` service 的 Host Profile 增加一个只识别**规范静音 WAV** 的 provider：静音返回空文本，有非静音采样时明确拒绝。此例是真正可运行的窄能力，不假装执行一般语音识别。完整 API 边界见 [实验语音 Provider](api-speech-provider.md)。

## 实现步骤

`package.json`：

```json
{
  "name": "example-silence-speech-provider",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-experimental-speech-to-text": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-experimental-speech-to-text": "0.2.0-rc.1",
    "@types/node": "^24.0.0",
    "typescript": "6.0.3"
  }
}
```

`tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "rootDir": "src",
    "outDir": "lib",
    "strict": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"]
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: example-silence-speech-provider
      name: example-silence-speech-provider
```

`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-experimental-speech-to-text'
import type { SpeechProvider, SpeechProviderId } from '@deepseek-ai/dsh-experimental-speech-to-text/types'
import { validateWave } from '@deepseek-ai/dsh-experimental-speech-to-text/wave'

const provider: SpeechProvider = {
  info: {
    id: 'silence-wav' as SpeechProviderId,
    name: 'Silence WAV detector',
    location: 'host-local',
    languages: ['auto'],
  },
  async transcribe({ audio }, signal) {
    signal.throwIfAborted()
    const audioSeconds = validateWave(audio, 120)
    const samples = new DataView(audio.buffer, audio.byteOffset, audio.byteLength)
    for (let offset = 44; offset < audio.byteLength; offset += 2) {
      if (offset % 8192 === 44) signal.throwIfAborted()
      if (samples.getInt16(offset, true) !== 0) {
        throw new Error('silence-wav accepts only silent PCM16 recordings')
      }
    }
    signal.throwIfAborted()
    return { text: '', audioSeconds, inferenceSeconds: 0 }
  },
}

export const name = 'example-silence-speech-provider'
export const inject = ['speechToText']

export function apply(ctx: Context): void {
  ctx.effect(function* () {
    const dispose = ctx.speechToText.register(provider)
    yield dispose
  }, 'silence speech provider')
}
```

把包放入 `speech-to-text` service 后的同一 Host Profile，执行 `npm install && npm run build`。用规范静音 PCM16 WAV 调用 `ctx.speechToText.resolve({audio,providerId:'silence-wav',language:'auto'})`，再调用 `transcribe(spec,signal)`，结果应有空 `text` 和准确时长；非静音、无效 WAV、取消应明确拒绝。撤销插件后同一 id 应从 `listProviders()` 消失，旧 spec 不能再执行。若要浏览器录音入口，另装并验证 speech API 与 Client UI 的完整组合；真实 recognizer 应替换这段窄检测算法，并证明其外部资源能随 signal 关闭。
