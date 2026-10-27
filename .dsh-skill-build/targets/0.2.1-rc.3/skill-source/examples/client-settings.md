# 完整设置页：草稿与 revision 栅栏

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。包同时拥有自己的 Host live Config 与 Client 页面。这里的 namespace `acme-dsh-settings` 是唯一 Loader entry id；对已有 Host namespace 的 companion 包，将 Host 改为空 apply，保留对应字段与 namespace，不能再注册一份同名配置。对象权威契约见 [ConfigForms](../api/api-client-ui-settings-config-form.md) 与 [SettingsFormModel](../api/api-client-ui-primitives-form-model.md)。

## 组成文件

独立目录创建以下六个文件。浏览器依赖 React/Cordis 与框架的同一实例，所有 DSH 包固定目标版本。

`package.json`：

```json
{
    "name": "acme-dsh-settings",
    "version": "1.0.0",
    "type": "module",
    "engines": {
        "dsh": "0.2.1-rc.3"
    },
    "exports": {
        ".": {
            "types": "./lib/types/index.d.ts",
            "default": "./lib/index.js"
        },
        "./client": {
            "types": "./lib/types/client.d.ts",
            "default": "./lib/client.js"
        },
        "./cordis.patch.yml": "./cordis.patch.yml"
    },
    "files": [
        "lib",
        "cordis.patch.yml"
    ],
    "dsh": {
        "bundle": {
            "patch": "./cordis.patch.yml"
        },
        "client": {
            "platform": "web",
            "inject": [
                "@deepseek-ai/dsh-client-ui-settings"
            ]
        }
    },
    "dependencies": {
        "@deepseek-ai/schemastery": "3.18.5"
    },
    "peerDependencies": {
        "@deepseek-ai/cordis": "4.0.5",
        "@deepseek-ai/dsh-agent": "0.2.1-rc.3"
    },
    "devDependencies": {
        "@deepseek-ai/cordis": "4.0.5",
        "@deepseek-ai/cordis-plugin-loader": "1.0.6",
        "@deepseek-ai/dsh-client-ui-renderer": "0.2.1-rc.3",
        "@deepseek-ai/dsh-client-ui-primitives": "0.2.1-rc.3",
        "react": "^18.2.0",
        "@types/react": "^18.2.0",
        "typescript": "6.0.3",
        "esbuild": "^0.25.0",
        "@deepseek-ai/dsh-client-ui-settings": "0.2.1-rc.3",
        "@deepseek-ai/dsh-client-ui-plugin-manager": "0.2.1-rc.3",
        "@deepseek-ai/dsh-client-ui-slots": "0.2.1-rc.3",
        "@deepseek-ai/dsh-client-store": "0.2.1-rc.3",
        "@deepseek-ai/schemastery": "3.18.5"
    },
    "scripts": {
        "build": "tsc && node build.mjs"
    }
}
```

`tsconfig.json`：

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "ESNext",
        "moduleResolution": "Bundler",
        "jsx": "react-jsx",
        "strict": true,
        "skipLibCheck": true,
        "declaration": true,
        "emitDeclarationOnly": true,
        "rootDir": "src",
        "outDir": "lib/types",
        "lib": ["ES2022", "DOM", "DOM.Iterable"]
    },
    "include": ["src"]
}
```

`src/index.ts`（Host）：

```ts
import type {} from '@deepseek-ai/cordis-plugin-loader'
import type { Context, Volatile } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'

export interface Config { retries: Volatile<number> }
export const Config = z.object({ retries: z.number().step(1).min(0).default(3).volatile() })
export function apply(ctx: Context, config: Config): void {
  ctx.on('loader/volatile-update', () => {
    ctx.logger.info('当前重试次数：%d', config.retries.get())
  })
}
```

`src/client.tsx`（Client）：

```tsx
import { useSyncExternalStore } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-plugin-manager/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { SettingsFormModel, settingsNumberField } from '@deepseek-ai/dsh-client-ui-primitives'

export const inject = ['slots', 'configForms']
interface Values { retries?: number }
const namespace = 'acme-dsh-settings'

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.configForms.whileServed([namespace], () => {
    const scope = ctx.configForms.get<Values>(namespace)
    const form = new SettingsFormModel<Values>(scope, [settingsNumberField('retries')])
    const store = form.bind(() => ({ ...form.shell(), retries: form.field('retries') }))
    const actions = form.actions()
    function Card(props: PropsRuntime<'plugins.item'>) {
      const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
      if (props.view === 'summary') return '配置重试次数'
      if (!state.available) return null
      return <form onSubmit={event => { event.preventDefault(); actions.save() }}>
        <label htmlFor="acme-retries">重试次数</label>
        <input id="acme-retries" value={state.retries.text}
          disabled={!state.writable || state.saving}
          onChange={event => actions.edit('retries', event.target.value)} />
        <button type="button" disabled={state.saving || !state.writable}
          onClick={() => actions.resetField('retries')}>继承默认值</button>
        <button disabled={!state.writable || !state.dirty || state.invalid || state.saving}>保存</button>
        <button type="button" disabled={state.saving} onClick={actions.discard}>丢弃草稿</button>
        {state.failed && <p role="alert">保存未接受。草稿已保留；请核对服务器状态，丢弃并重新编辑后再保存。</p>}
        {state.invalid && <p role="alert">请输入有效数字，Host 仍会校验整数与非负约束。</p>}
      </form>
    }
    const off = ctx.slots.inject('plugins.item', () => ctx.slots.register({
      name: 'plugins.item', id: namespace, order: 100, label: () => '重试设置',
    }, Card))
    return () => { off(); form.dispose() }
  }), 'acme-dsh-settings: namespace 页面')
}
```

普通字段随一次 mutate 原子提交；模型在首次编辑时锁定 baseline revision。即使镜像因别人写入而更新，当前草稿也不能临时改用新 revision。保存中禁用编辑，避免异步成功清掉刚输入的新草稿。false、异常与冲突保留草稿，不自动重放。卸载时先撤 slot 再 dispose form，React 订阅随卸载释放；form.dispose 不取消已经送到 Host 的写入，也不撤销被接受的持久修改。这里没有自定义 Promise 回调写 React 状态，所以不会因晚到结果重新挂载 UI。

`build.mjs`：

```javascript
import { build } from 'esbuild'
import { mkdir, writeFile } from 'node:fs/promises'

await mkdir('lib', { recursive: true })
await build({
  entryPoints: ['src/index.ts'], outfile: 'lib/index.js',
  bundle: true, format: 'esm', platform: 'node', packages: 'external',
})
const result = await build({
  entryPoints: ['src/client.tsx'], bundle: true, write: false,
  format: 'cjs', platform: 'browser', jsx: 'automatic',
  external: ['react', 'react/jsx-runtime', '@deepseek-ai/cordis',
    '@deepseek-ai/dsh-client-ui-primitives'],
})
const body = result.outputFiles[0].text
await writeFile('lib/client.js',
  'window.__ModuleLoader__.load({id:"acme-dsh-settings",factory:(require)=>{\n'
  + 'var module={exports:{}};var exports=module.exports;\n'
  + body + '\nreturn module.exports;}});\n')
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: acme-dsh-settings
      name: acme-dsh-settings
```

## 构建、装载与验证

使用目标版本 CLI 和隔离 home：

```sh
npm install
npm run build
npm pack --dry-run
export DSH_HOME="$(mktemp -d)"
dsh --profile web --dump-default-config >/dev/null
dsh plugin --profile web add "file:$PWD"
dsh web
```

base/web 已组合 settings、config-editor、Plugins 页面与 renderer；不要插入第二份这些服务。打开 Plugins 中“重试设置”：编辑值后、保存前 Host 文件与业务 `.get()` 不应变化；保存非负整数后 live 值与 Profile user patch 改变，Host 插件实例不应重建，重启后值仍存在。负数或小数必须由 Host 拒绝，旧文件与 live 值不变，页面保留草稿并提示失败。

两窗口同时读取后，A 编辑但不保存，B 先保存；A 保存应被 revision 栅栏拒绝，不能覆盖 B，A 草稿仍存在。A 显式丢弃并重输后才能建立新 baseline。停用 namespace 所有者时页面消失；保存未返回时停用 companion，晚到响应不能恢复页面；再启用只有一份页面。companion-only 包没有 Host volatile schema，因此只能编辑已存在且服务中的 namespace。
