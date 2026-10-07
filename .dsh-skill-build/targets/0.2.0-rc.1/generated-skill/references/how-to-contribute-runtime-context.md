# 贡献 system prompt 与运行上下文

## 目标与前置

适用 `dsh-v0.2.0-rc.1` Host 插件。公开契约见 [SystemPrompt 章节与运行上下文](api-system-prompt-context.md)。本例将稳定指导写为 section，将当前工作区说明写为 context，变量在组装时解析；真正 Session 快照由 AgentLoop 写入。

## 实现步骤

`package.json`：

```json
{
  "name": "example-prompt-context",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-system-prompt": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-system-prompt": "0.2.0-rc.1",
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
    - id: example-prompt-context
      name: example-prompt-context
```

`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-system-prompt'

export const name = 'example-prompt-context'
export const inject = ['systemPrompt']

export function apply(ctx: Context): void {
  ctx.systemPrompt.variable('project_name', () => 'Example')
  ctx.systemPrompt.section({
    name: 'example:review-guidance',
    order: 9000,
    text: 'When reviewing {{project_name}}, cite the source files.',
  })
  ctx.systemPrompt.context({
    name: 'example:active-workspace',
    order: 200,
    text: () => 'Workspace policy: cite files read in this turn.',
  })
}
```

Profile 装载时先有 `@deepseek-ai/dsh-system-prompt` service（base bundle 已含），再插入插件 patch。三个注册 effect 随插件 fiber 卸载；如果 callback 读取可变状态，状态的生命周期也要随插件关闭。`ctx.systemPrompt.assemble()` 和 `renderPrompt` / `renderContextSnapshot` 可用于服务级检查；模型步上的 AgentLoop 才把 context 渲染为 Session 中的 `runtime-context` 快照。把需要用户可见、可恢复的操作事实写入该操作所属 Session 事件，而不是仅更新 callback 状态。

## 验证边界

用目标 rc.1 已发布声明运行 `npm install && npm run build && npm pack --dry-run --json`，再在隔离 Cordis Host 中装载 SystemPrompt 和插件，检查章节、变量替换、快照及卸载。创建工作区 `evidence/tests/skill-context-consumer/` 是包含本例和前一篇 provider 的可运行消费包；记录见 `evidence/runtime/skill-context-review.md`。真实 AgentLoop/Profile/Session 恢复未在该隔离测试中运行。
