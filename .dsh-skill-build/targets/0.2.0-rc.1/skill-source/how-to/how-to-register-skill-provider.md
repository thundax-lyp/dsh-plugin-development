# 注册按需载入的 Skill Provider

## 目标与前置

适用 `dsh-v0.2.0-rc.1` Host 插件。公开契约见 [Skill Provider](api-skill-providers.md)。本例暴露一项固定技能，用 `locator` 在 `get()` 中核对目录版本；可变目录应在源变化时调用 `control.invalidate()`。技能正文来自插件自己维护的可信内容。

## 实现步骤

`package.json`：

```json
{
  "name": "example-skill-provider",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-skill": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-skill": "0.2.0-rc.1",
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
    - id: example-skill-provider
      name: example-skill-provider
```

`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-skill'
import type { SkillCandidate, SkillDefinition } from '@deepseek-ai/dsh-skill'

const candidate: SkillCandidate = {
  name: 'review-notes',
  description: 'Review project notes when asked for a concise source summary.',
  invocation: { modelInvocable: true, userInvocable: true },
  provider: 'example-notes',
  source: 'custom',
  rank: 500,
  locator: 'review-notes-v1',
}

export const name = 'example-skill-provider'
export const inject = ['skills']

export function apply(ctx: Context): void {
  ctx.skills.registerProvider(control => ({
    name: 'example-notes',
    async list(options) {
      options.signal?.throwIfAborted()
      control.signal.throwIfAborted()
      return [candidate]
    },
    async get(found, options): Promise<SkillDefinition | undefined> {
      options.signal?.throwIfAborted()
      control.signal.throwIfAborted()
      if (found.locator !== candidate.locator) return undefined
      return {
        name: candidate.name,
        description: candidate.description,
        invocation: candidate.invocation,
        provider: candidate.provider,
        source: candidate.source,
        content: 'Summarize only the notes the user provided. Cite their source paths.',
      }
    },
  }))
}
```

Profile 装载时先有 `@deepseek-ai/dsh-skill` service（base bundle 已含），再插入该插件 patch。`inject` 保证依赖顺序；注册句柄由 `apply` 所属 fiber 回收。查询者使用 `ctx.skills.list({cwd})` 与 `ctx.skills.get('review-notes',{cwd})`，调用受众另按 `invocation` 字段筛选。实际资源变动时，provider 应观察变化并调用 `control.invalidate()`；观察器、远端请求及其取消由插件负责，卸载时停止它们。若 `get` 发现资源已消失，返回 `undefined`。

## 验证边界

在目标 rc.1 已发布声明上运行 `npm install && npm run build && npm pack --dry-run --json`，再在隔离 Cordis Host 中装载 SkillRegistry 和插件、查询、渲染并卸载。创建工作区的 `evidence/tests/skill-context-consumer/` 是包含此 provider 和下一篇 context 贡献的可运行消费包；结果见 `evidence/runtime/skill-context-review.md`。这不等于真实 AgentLoop、模型调用或 Session 恢复已通过。
