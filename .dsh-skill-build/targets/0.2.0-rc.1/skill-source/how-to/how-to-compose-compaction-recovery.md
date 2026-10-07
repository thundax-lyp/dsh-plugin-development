# 装载可恢复的 Compaction

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。此 Host 插件组合 `ToolResultPruner` 与 `BasicCompactionEngine`：前者可先用规范 Session replacement 缩短长工具结果，后者在 step 压力或经 provider 确认的窗口溢出时尝试摘要并只在 durable surface 有进展时重试。公开契约见 [Compaction 与模型请求恢复](api-compaction-context-recovery.md)。

`package.json`：

```json
{
  "name": "example-compaction-profile",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-compaction-basic": "0.2.0-rc.1",
    "@deepseek-ai/dsh-compaction-tool-result-pruner": "0.2.0-rc.1",
    "@deepseek-ai/dsh-llm": "0.2.0-rc.1",
    "@deepseek-ai/dsh-token-meter": "0.2.0-rc.1",
    "@deepseek-ai/dsh-session": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-compaction-basic": "0.2.0-rc.1",
    "@deepseek-ai/dsh-compaction-tool-result-pruner": "0.2.0-rc.1",
    "@deepseek-ai/dsh-llm": "0.2.0-rc.1",
    "@deepseek-ai/dsh-token-meter": "0.2.0-rc.1",
    "@deepseek-ai/dsh-session": "0.2.0-rc.1",
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
    "outDir": "lib",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: example-compaction-profile
      name: example-compaction-profile
```

`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-llm'
import type {} from '@deepseek-ai/dsh-token-meter'
import type {} from '@deepseek-ai/dsh-session'
import BasicCompactionEngine from '@deepseek-ai/dsh-compaction-basic'
import ToolResultPruner from '@deepseek-ai/dsh-compaction-tool-result-pruner'

export const name = 'example-compaction-profile'
export const inject = ['llm', 'tokenMeter', 'sessions']

export async function apply(ctx: Context): Promise<void> {
  const pruner = ctx.plugin(ToolResultPruner, {
    thresholdChars: 8192, headChars: 4096, tailChars: 1024,
  })
  try {
    await pruner.await()
    const engine = ctx.plugin(BasicCompactionEngine, {
      auto: true, maxOverflowRetries: 1,
    })
    await engine.await()
  } catch (error) {
    await pruner.dispose()
    throw error
  }
}
```

Profile 先装载 `llm`、`sessionProjections`/`tokenMeter`、`sessions`，再装载本插件。`BasicCompactionEngine` 只在路由请求事实存在时自动考虑 compaction；若源太大或没有安全、工具配对平衡的可缩区间，返回 `null` 而非强行截断。摘要会发独立 LLM 请求，按 `signal` 取消；失败和已落地的部分进展留在规范 Session 日志。两个子 service 随父插件卸载；启动第二个失败时本例显式清理先启动的 pruner。不要同时装载另一 `ctx.compaction` 实现。

隔离消费包 `evidence/tests/compaction-recovery-consumer/` 用发布 rc.1 声明编译，装载各真实 service 并验证 pruner 的纯内容缩减与卸载；完整 AgentLoop 的压力/溢出恢复、摘要模型、Session 持久化及手动 compact 未由该 smoke 执行，见 `evidence/runtime/compaction-recovery-review.md`。
