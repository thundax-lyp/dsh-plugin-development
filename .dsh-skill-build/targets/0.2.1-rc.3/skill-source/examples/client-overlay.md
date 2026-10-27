# 最小独立 Client 包：状态按钮与对话框

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。这个包提供 Host 空入口、浏览器 `./client` export 和 bundle patch；按钮注册在框架公开的 `shell.overlay` list slot。它不注册工具，不调用模型或外部服务，也不建立 Session 持久事实。完整公共签名见 [Modal](../api/api-client-ui-primitives-modal.md) 与 [SlotRegistry](../api/api-client-ui-renderer-registry.md)。

## 文件与依赖

在独立目录中创建以下六个文件。DSH 包采用目标版本；Cordis 使用该版本随附的 `4.0.5`，不能把所有依赖都写成 DSH 版本号。React 与 Cordis 在浏览器中必须使用 shell 提供的同一实例。

`package.json`：

```json
{
    "name": "acme-dsh-overlay",
    "version": "1.0.0",
    "type": "module",
    "engines": { "dsh": "0.2.1-rc.3" },
    "exports": {
        ".": { "types": "./lib/types/index.d.ts", "default": "./lib/index.js" },
        "./client": { "types": "./lib/types/client.d.ts", "default": "./lib/client.js" },
        "./cordis.patch.yml": "./cordis.patch.yml"
    },
    "files": ["lib", "cordis.patch.yml"],
    "dsh": {
        "bundle": { "patch": "./cordis.patch.yml" },
        "client": { "platform": "web" }
    },
    "peerDependencies": { "@deepseek-ai/cordis": "4.0.5", "@deepseek-ai/dsh-agent": "0.2.1-rc.3" },
    "devDependencies": {
        "@deepseek-ai/cordis": "4.0.5",
        "@deepseek-ai/dsh-client-ui-layout": "0.2.1-rc.3",
        "@deepseek-ai/dsh-client-ui-renderer": "0.2.1-rc.3",
        "@deepseek-ai/dsh-client-ui-primitives": "0.2.1-rc.3",
        "react": "^18.2.0",
        "@types/react": "^18.2.0",
        "typescript": "6.0.3",
        "esbuild": "^0.25.0"
    },
    "scripts": { "build": "tsc && node build.mjs" }
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
import type { Context } from '@deepseek-ai/cordis'

export function apply(_ctx: Context): void {}
```

`src/client.tsx`（Client）：

```tsx
import { useState } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import { Button, Modal } from '@deepseek-ai/dsh-client-ui-primitives'

export const inject = ['slots']

function StatusOverlay() {
  const [open, setOpen] = useState(false)
  return <>
    <div style={{ position: 'fixed', right: 24, bottom: 24, pointerEvents: 'auto' }}>
      <Button variant="outline" onClick={() => setOpen(true)}>插件状态</Button>
    </div>
    <Modal open={open} onClose={() => setOpen(false)} title="插件状态" closeLabel="关闭">
      <p>浏览器插件已挂载。</p>
      <Button data-modal-autofocus onClick={() => setOpen(false)}>完成</Button>
    </Modal>
  </>
}

export function apply(ctx: Context): void {
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'acme-dsh-overlay.status',
    order: 100,
  }, StatusOverlay))
}
```

固定中文文案用于这个最小包；多语言产品应另行注册字典，再把翻译后的 title、closeLabel 和 children 传给原语。`ctx.slots.inject` 与 `register` 的贡献属于插件 fiber，插件停用时自动清理。React 卸载释放 Modal 的焦点层与监听；示例没有额外异步资源，不需要创建 AbortController。

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
  'window.__ModuleLoader__.load({id:"acme-dsh-overlay",factory:(require)=>{\n'
  + 'var module={exports:{}};var exports=module.exports;\n'
  + body + '\nreturn module.exports;}});\n')
```

这是只处理单一 TSX entry、无 CSS/图片导入、无动态分块的最小 factory 构建；它复现 loader 的 `load({ id, factory })` 交接协议。上游 clientBundle preset 没有作为独立 npm 包发布，不能从消费者项目导入上游相对路径。增加 CSS、动态 import 或非 baseline external 时，应先扩展构建与 manifest 并验证图依赖，不能直接把普通 ESM 输出当作 client bundle。

`cordis.patch.yml`：

```yaml
- insert:
    - id: acme-dsh-overlay
      name: acme-dsh-overlay
```

## 构建、装载与观察

```sh
npm install
npm run build
npm pack --dry-run
export DSH_HOME="$(mktemp -d)"
dsh --profile web --dump-default-config >/dev/null
dsh plugin --profile web add "file:$PWD"
dsh web
```

使用目标版本 CLI；初始化和安装在同一个显式 `DSH_HOME` 下运行。浏览器打开 `dsh web` 打印的地址，确认右下角只有一个“插件状态”按钮；点击后对话框存在，Tab 不逃到背景，Escape 关闭并将焦点还给按钮。点击遮罩与“完成”均关闭。点击对话框时不产生模型请求。

在 Plugins 列表停用本包的根行，按钮和已打开的对话框都应消失；再启用后只有一份按钮。若出现 bundle 404，先确认 exports 指向的 lib/client.js 已构建；若脚本执行却没有登记模块，检查 factory id 是否与 package.name 完全相等；若缺服务或 slot，检查目标 Profile 启用了 Web framework，且未误注册 root。刷新页面会重置 open 状态，这是本示例有意的本地 UI 状态。

## 完成判据

独立包类型检查与构建通过，npm pack 包含两个入口及声明、patch；Host 找到裸包名行并公布 bundle；页面显示按钮、能打开并关闭 Modal；停用回收注册与焦点层，再启用没有重复。这些观察共同构成完成判据，单独编译不能代替浏览器装载验证。
