# 装载自有 Skill 目录

## 目标与前置

在已装载 `ctx.skills` 的 Host Profile 中，以独立 provider 名装载一个部署者指定的技能目录。模型载入器需要在使用该 Agent 的组合层装载；base 与 standard preset 的清单示例已有 `tool-skill`。公开行为见 [内置 Skill Provider](api-skill-bundled-consumers.md)。本例以环境变量给绝对路径，不把机器路径写进插件包。

## 实现步骤

在一个新目录建以下文件。`package.json`：

```json
{
  "name": "example-mounted-skills",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-skill": "0.2.0-rc.1",
    "@deepseek-ai/dsh-skill-filesystem": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-skill": "0.2.0-rc.1",
    "@deepseek-ai/dsh-skill-filesystem": "0.2.0-rc.1",
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
    - id: example-mounted-skills
      name: example-mounted-skills
```

`src/index.ts`：

```ts
import { isAbsolute } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-skill'
import { apply as mountFilesystem } from '@deepseek-ai/dsh-skill-filesystem'

export const name = 'example-mounted-skills'
export const inject = ['skills']

export function apply(ctx: Context): void {
  const root = process.env.EXAMPLE_SKILL_ROOT
  if (!root || !isAbsolute(root)) {
    throw new Error('EXAMPLE_SKILL_ROOT must be an absolute directory')
  }
  mountFilesystem(ctx, {
    providerName: 'example-mounted-skills',
    includeDefaultRoots: false,
    customSkillDirs: [root],
    watch: true,
  })
}
```

部署者在 `EXAMPLE_SKILL_ROOT` 所指目录创建 `review-notes/SKILL.md`：

```markdown
---
name: review-notes
description: Review project notes and cite the source paths.
---

Summarize only notes available in the current task. Cite each source path.
```

用目标版本依赖执行 `npm install && npm run build`，将包加入目标 Profile 的 bundle，设置绝对路径后启动。通过 `ctx.skills.list({ cwd })` 确认 `review-notes` candidate，通过 `ctx.skills.get('review-notes', { cwd })` 确认正文。若需模型 `skill` 工具，检查目标 Agent 的组合层包含 `tool-skill`；不能从 provider 注册推断它已出现。编辑正文后重新查询以验证 watcher 更新；卸载本插件后再次查询应找不到该 provider。部署时目录写权限和内容审查由拥有该目录的运维方负责。
