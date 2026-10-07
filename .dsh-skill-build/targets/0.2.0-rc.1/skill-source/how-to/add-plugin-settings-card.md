# 如何给插件添加 Web 设置卡片

## 目标与前置

在 `dsh-v0.2.0-rc.1` 为一条 Host 插件 row `example-settings` 暴露可实时更新的 `endpoint`，并在 Plugins 页该 row 的详情中显示 staged 保存卡片。Host 的 Config、Profile patch 与 revision 契约见 [设置服务](api-settings.md)，Client 表单对象见 [Client Settings Form](api-client-settings-forms.md)。此例由一个包同时提供 Host 根入口和 `./client` 浏览器入口；正式 Web Profile 必须有 `settings`、`api-remotes`、`ui-settings`、`ui-plugin-manager` 和 client-modules。

下面的独立包锁定本次 tag。其轻量 `esbuild` 包装脚本生成 client-modules 需要的 `window.__ModuleLoader__.load({id,factory})` lazy-CJS artifact；该脚本只适用于这个没有本地 CSS、动态 import 或额外运行时依赖的最小卡片。更复杂的 Client 包还需符合目标版本的模块依赖、CSS、chunk 与 source map 规则，不能把普通 ESM 输出改名为 `lib/client.js`。

## 实现步骤

1. 新建 `package.json`、`tsconfig.json` 与 `cordis.patch.yml`：

```json
{
  "name": "dsh-settings-card-consumer-rc1",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "exports": {
    ".": { "types": "./lib/index.d.ts", "default": "./lib/index.js" },
    "./client": { "types": "./lib/client.d.ts", "default": "./lib/client.js" }
  },
  "files": ["lib", "cordis.patch.yml"],
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "inject": ["@deepseek-ai/dsh-client-ui-settings", "@deepseek-ai/dsh-client-ui-plugin-manager"]
    }
  },
  "scripts": { "build": "tsc -p tsconfig.json && node build-client.mjs" },
  "dependencies": { "@deepseek-ai/schemastery": "3.18.4" },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-client-ui-primitives": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-settings": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-plugin-manager": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-renderer": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-store": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-slots": "0.2.0-rc.1",
    "react": "^18.2.0"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-client-ui-primitives": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-settings": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-plugin-manager": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-renderer": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-store": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-slots": "0.2.0-rc.1",
    "@types/react": "~18.3.1",
    "esbuild": "^0.25.0",
    "react": "^18.2.0",
    "typescript": "6.0.3"
  }
}
```

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
    "jsx": "react-jsx"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

```yaml
- insert:
    - id: example-settings
      name: dsh-settings-card-consumer-rc1
```

2. `src/index.ts` 声明 Host 的 volatile 字段。业务操作开始时读 `config.endpoint.get()`；这个例子只记录初始化值，实际请求代码应在每次操作时重新读取。

```ts
import type { Context, Volatile } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'

export interface Config { endpoint: Volatile<string> }
export const Config = z.object({ endpoint: z.string().default('https://example.invalid').volatile() })
export const name = 'example-settings'

export function apply(ctx: Context, config: Config): void {
  ctx.logger.info('example-settings initial endpoint: %s', config.endpoint.get())
}
```

3. `src/client.tsx` 使用共享 form 的 Host snapshot、一个 staged 文字字段与 keyed `plugins.row.config` slot。`entryKey` 必须是“包名#Profile row id”；`namespace` 必须是 Host entry id。`whileServed` 让 Host 未加载该 row 时撤销卡片。模型与 slot 的 disposer 均归当前 fiber。

```tsx
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-plugin-manager/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import { useSyncExternalStore } from 'react'
import {
  SettingsForm, SettingsFormModel, SettingsValueField, settingsTextField,
} from '@deepseek-ai/dsh-client-ui-primitives'

interface ExampleSettings { endpoint?: string }
const namespace = 'example-settings'
const entryKey = 'dsh-settings-card-consumer-rc1#example-settings'
export const inject = ['slots', 'configForms']

export function apply(ctx: Context): void {
  const model = new SettingsFormModel(ctx.configForms.get<ExampleSettings>(namespace), [settingsTextField('endpoint')])
  const actions = model.actions()
  const store = model.bind(() => ({ ...model.shell(), endpoint: model.field('endpoint') }))
  ctx.effect(() => () => { model.dispose() }, 'example-settings: form model')

  function Card({ view }: { view: 'summary' | 'page' }) {
    const state = useSyncExternalStore(store.subscribe, store.getSnapshot)
    if (view === 'summary') return 'Configure the example endpoint.'
    return (
      <SettingsForm
        labels={{ unavailable: 'Unavailable', readOnly: 'Read only', saveFailed: 'Save failed', save: 'Save', saving: 'Saving' }}
        state={state}
        onSave={actions.save}
        onDiscard={actions.discard}
      >
        <SettingsValueField
          id="example-endpoint"
          label="Endpoint"
          hint="Service endpoint"
          overriddenLabel="Overridden"
          resetLabel="Reset"
          invalidLabel="Invalid endpoint"
          disabled={!state.writable}
          {...state.endpoint}
          onEdit={text => { actions.edit('endpoint', text) }}
          onReset={() => { actions.resetField('endpoint') }}
        />
      </SettingsForm>
    )
  }

  ctx.effect(() => ctx.configForms.whileServed([namespace], () => ctx.slots.inject('plugins.row.config', () => ctx.slots.register({
    name: 'plugins.row.config', key: entryKey,
  }, Card))), 'example-settings: row card')
}
```

4. `build-client.mjs` 将唯一 Client 入口及其本地代码合并为一个 CommonJS body，只把目标 Web 平台模块留为 `require`，再包装为 loader factory。文件名和 `id` 必须与 manifest 对应。

```js
import { writeFile } from 'node:fs/promises'
import { build } from 'esbuild'

const id = 'dsh-settings-card-consumer-rc1'
const result = await build({
  entryPoints: ['src/client.tsx'], bundle: true, write: false,
  format: 'cjs', platform: 'browser', target: 'es2024',
  external: [
    '@deepseek-ai/cordis', '@deepseek-ai/dsh-client-ui-primitives',
    '@deepseek-ai/dsh-client-store', '@deepseek-ai/dsh-client-ui-slots',
    'react', 'react/jsx-runtime',
  ],
})
const body = result.outputFiles[0].text
const wrapped = `window.__ModuleLoader__.load({ id: ${JSON.stringify(id)}, factory: (require) => {\nvar module = { exports: {} }; var exports = module.exports;\n${body}\nreturn module.exports;\n} });\n`
await writeFile('lib/client.js', wrapped)
```

5. 执行 `npm install && npm run build && npm pack --dry-run`；检查包内有 `lib/index.js`、`lib/index.d.ts`、`lib/client.js`、`lib/client.d.ts` 与 patch。把包按消费项目的插件安装入口纳入 Web Profile 后启动，确认 Loader 中 Host row 和 Client row 都已激活。打开 Plugins → 包 → `example-settings` row；先修改不保存并离开页面，值应不变；再修改并保存，检查 Profile patch、页面 effective 值、下一次 Host 操作的 `.get()` 与重启恢复。输入不合法或并发 revision 冲突时应保留可纠正草稿，不能显示虚假成功。

## 验证与完成边界

独立消费者的 TypeScript Host/Client 声明编译、lazy-CJS 文件/外部 `require` 静态检查和 pack dry-run 记录在创建工作区 `evidence/runtime/settings-ui-review.md`。这些只证明该最小包的形状与公开类型；真实 Loader、Client 模块加载、slot 页面、CSS/React 和 Profile patch 的用户可见结果需要消费项目运行上述步骤。Client 库的共享 `clientBundle` preset 位于目标仓库内部，不是独立发布入口；本教程的包装脚本是针对该最小无样式页面的已写明组合方案。
