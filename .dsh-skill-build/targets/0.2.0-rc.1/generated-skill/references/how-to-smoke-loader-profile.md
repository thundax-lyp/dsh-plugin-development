# 测试真实 Loader Profile 的装载与卸载

## 目标与前提

目标精确 `dsh-v0.2.0-rc.1`。本例用已发布 `@deepseek-ai/dsh-loader-smoke` 启动一个**真正调用 `@deepseek-ai/dsh-app-boot.boot`** 的独立 bin，读取同包 `cordis.yml`，由 Loader 装载本地插件，子进程写下激活、entry、卸载三种证据。测试库不是 Loader 本身；Profile 必须能在 stdin 关闭后自行退出。公开选项见[Loader smoke reference](api-loader-smoke-profile.md)。

## 独立最小包

`package.json`：

```json
{
  "name": "dsh-loader-profile-consumer-rc1",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./lib/bin.js",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "smoke": "node smoke.mjs"
  },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/cordis-plugin-loader": "1.0.5",
    "@deepseek-ai/cordis-plugin-include": "1.0.9",
    "@deepseek-ai/dsh-app-boot": "0.2.0-rc.1",
    "@deepseek-ai/dsh-loader-smoke": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@types/node": "24.10.7",
    "typescript": "6.0.3"
  },
  "files": [
    "lib",
    "cordis.yml"
  ]
}
```

`tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "lib",
    "declaration": true,
    "strict": true,
    "skipLibCheck": true,
    "types": [
      "node"
    ]
  },
  "include": [
    "src/**/*.ts"
  ]
}
```

`cordis.yml`：

```yaml
- id: fixture
  name: ./lib/fixture-plugin.js
```

`src/fixture-plugin.ts`：

```ts
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'

export const name = 'loader-fixture-plugin'
export function apply(ctx: Context): void {
  ctx.effect(() => {
    writeFileSync(join(process.cwd(), 'activated.txt'), 'fixture active\n')
    return () => { writeFileSync(join(process.cwd(), 'unloaded.txt'), 'fixture unloaded\n') }
  }, 'fixture activation marker')
}
```

`src/bin.ts`：

```ts
import { writeFile } from 'node:fs/promises'
import { isAbsolute, join } from 'node:path'
import { boot } from '@deepseek-ai/dsh-app-boot'
import type {} from '@deepseek-ai/cordis-plugin-loader'

const config = process.argv[2]
if (config === undefined || !isAbsolute(config)) throw new Error('absolute config path required')
const ctx = await boot('loader-profile-consumer', config)
try {
  const entries = [...ctx.loader.entries()].map(entry => ({ id: entry.id, name: entry.options.name }))
  await writeFile(join(process.cwd(), 'report.json'), JSON.stringify({ entries }))
} finally {
  await ctx.fiber.dispose()
}
```

`smoke.mjs`：

```js
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { runLoaderSmoke } from '@deepseek-ai/dsh-loader-smoke'

const root = fileURLToPath(new URL('.', import.meta.url))
const result = await runLoaderSmoke({
  label: 'independent fixture Profile',
  tempDirPrefix: 'dsh-loader-profile-consumer-',
  binScript: join(root, 'src/bin.ts'),
  libBinScript: join(root, 'lib/bin.js'),
  configPath: join(root, 'cordis.yml'),
  tsconfigPath: join(root, 'tsconfig.json'),
  mode: 'lib',
  inspect: async cwd => {
    const report = JSON.parse(await readFile(join(cwd, 'report.json'), 'utf8'))
    assert.ok(report.entries.some(entry => entry.id === 'include:fixture'
      && entry.name === './lib/fixture-plugin.js'))
    assert.equal(await readFile(join(cwd, 'activated.txt'), 'utf8'), 'fixture active\n')
    assert.equal(await readFile(join(cwd, 'unloaded.txt'), 'utf8'), 'fixture unloaded\n')
  },
})
assert.equal(result.stderr.includes('UNHANDLED'), false)
console.log('real Loader activated fixture, wrote report, disposed and cleaned isolated cwd')
```

运行：

```sh
npm install --ignore-scripts --no-audit --no-fund
npm run build
npm run smoke
npm pack --dry-run --json
```

`mode: 'lib'` 以当前 Node 启动已编译 bin，`tsconfigPath` 在此模式不参与解析；同包 `cordis.yml` 的相对插件名按配置目录解析。`runLoaderSmoke` 在临时 cwd 设置隔离 Home、清除代理继承、关闭 stdin、要求零退出，在 `inspect` 读报告后删除它创建的 cwd。bin 在 `finally` 释放 root fiber；插件自己的 effect 清理写出卸载标记。若测试自己提供 `cwd`，必须由测试清理；若需要确认目标失败，显式设非零 `expectedExitCode` 并检查具体诊断。此 smoke 已运行真实 Loader，但只是极小 Profile；没有生产 base bundle、Agent 轮次或 Web/Client。详细记录在创建工作区 `evidence/runtime/loader-smoke-profile-review.md`。
