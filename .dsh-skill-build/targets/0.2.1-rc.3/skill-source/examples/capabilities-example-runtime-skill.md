# 完整示例：随插件提供只读 Skill

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`，Host 侧。此示例通过 `ctx.skills.register()` 提供 runtime Skill；发现和加载的契约见 [SkillRegistry](../api/api-capabilities-dsh-skill.md)。它不注册工具，不需要 Client、Remote 或外部服务。

## 文件与依赖

建立 `runtime-skill/`，包含 `package.json`、`tsconfig.json`、`src/index.ts` 和 `cordis.patch.yml`。

`package.json`：

```json
{
    "name": "dsh-runtime-skill-demo",
    "version": "0.1.0",
    "type": "module",
    "exports": { ".": "./lib/index.js" },
    "files": ["lib", "cordis.patch.yml"],
    "engines": { "dsh": "0.2.1-rc.3" },
    "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
    "scripts": { "build": "tsc -p tsconfig.json" },
    "peerDependencies": {
        "@deepseek-ai/cordis": "~4.0.5",
        "@deepseek-ai/dsh-skill": "0.2.1-rc.3"
    },
    "devDependencies": {
        "@deepseek-ai/cordis": "~4.0.5",
        "@deepseek-ai/dsh-skill": "0.2.1-rc.3",
        "typescript": "~6.0.3"
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
        "strict": true,
        "skipLibCheck": true,
        "rootDir": "src",
        "outDir": "lib"
    },
    "include": ["src/**/*.ts"]
}
```

`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-skill'

export const name = 'runtime-skill-demo'
export const inject = ['skills']
export function apply(ctx: Context): void {
  ctx.skills.register({
    name: 'check-evidence',
    description: '在写结论前核对原始证据和验证范围。',
    source: 'runtime',
    invocation: { modelInvocable: true, userInvocable: true },
    content: '先读取原始材料。把已验证事实、推断和未验证项分别写清。'
  })
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: runtime-skill-demo
      name: dsh-runtime-skill-demo
```

## 构建与使用

以下使用全新的隔离 home，以保证示例 Profile 同时具有基础服务与 Web UI。在当前 shell 先执行：

```sh
export DSH_HOME="$(mktemp -d)"
dsh --profile skilldemo --from-default-profile web --dump-config
```

此初始化仅针对刚建立的空 home；对已有 Profile 使用 `--from-default-profile` 会替换其原有目录。后续安装、启动和卸载均在同一 shell 中执行。


运行 `pnpm install`、`pnpm build`，从父目录运行 `dsh plugin --profile skilldemo add ./runtime-skill`，再运行 `dsh --profile skilldemo`。Profile 需要 `dsh-skill` 服务；模型发现与加载另需 `dsh-tool-skill`，文件提供方不负责这份 runtime 内容。询问模型使用 `check-evidence`，或在支持的 UI 中输入 `/check-evidence`；两条路径须分别遵守 invocation policy，内容由统一的 `renderSkillContent` 形成。

在服务层读取 `ctx.skills.list()`，应找到名称与 description；`await ctx.skills.get('check-evidence')` 的 content 应完全匹配注册正文。目录不是模型上下文写入的证明，实际模型目录与工具返回还需在真实会话观察。

## 失败与卸载

使用非法名称或空 description 应在注册时失败。同层同名 runtime Skill 为 first-wins，后到注册得到空操作 disposer；不要以覆盖同名条目更新正文。更新贡献应先释放旧注册再注册新内容。此常量实现不发起异步请求，不持有单独取消资源。

卸载贡献插件后应从目录消失；如果项目层存在同名 Skill，可能显现更高优先级或另一层赢家，核对 provider/source 而非仅凭名称断言卸载失败。执行 `dsh plugin --profile skilldemo remove dsh-runtime-skill-demo` 并重启确认无遗留贡献。它不持久化新业务事实，模型看到的目录和加载结果由 consumer 写入 Session。
