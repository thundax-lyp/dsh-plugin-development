# 增加 Client 快捷命令

## 目标与前置

给 `dsh-v0.2.0-rc.1` Web Client 增加 `example.markPage` 命令：在 macOS 页面区域按 `⌘⌥⇧G` 使测试计数加一；在输入区不触发；在线卸载后按键不再执行。这个计数是浏览器 smoke 标记，不是 Session 事实。业务版本应在命令 `run` 中调用拥有该操作的服务，需恢复或给模型读取的结果由 Host 写入 Session。`ctx.shortcuts` 的公开契约、冲突规则与编辑边界见 [Client keyboard commands](api-client-shortcuts.md)。

目标 Web Profile 已装载 `@deepseek-ai/dsh-client-shortcuts`。命令定义只在包的 `./client` 半边运行；Host 根导出负责 Loader 的包名解析。下面的 JavaScript Client 已是 rc.1 接受的 lazy-CJS 登记格式；TypeScript 版本应另行编译到此格式。

## 建包

新建 `dsh-client-shortcut-probe/`，包含以下五个文件。

`package.json`：

```json
{
  "name": "dsh-client-shortcut-probe",
  "version": "0.0.1",
  "type": "module",
  "exports": { ".": "./lib/index.js", "./client": "./lib/client.js" },
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "inject": ["@deepseek-ai/dsh-client-shortcuts"]
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
    "@deepseek-ai/dsh-client-shortcuts": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-client-shortcuts": "0.2.0-rc.1",
    "typescript": "6.0.3"
  },
  "scripts": { "build": "node build.mjs" },
  "files": ["lib/index.js", "lib/client.js", "cordis.patch.yml"]
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: shortcut-probe
      name: dsh-client-shortcut-probe
```

`src/index.js`：

```js
export function apply() {}
```

`src/client.js`：

```js
window.__ModuleLoader__.load({
  id: 'dsh-client-shortcut-probe',
  factory() {
    const probe = { registered: false, hits: 0, disposed: false }
    const report = () => { document.documentElement.dataset.dshShortcutProbe = JSON.stringify(probe) }
    report()
    return {
      inject: ['shortcuts'],
      apply(ctx) {
        ctx.effect(() => {
          const dispose = ctx.shortcuts.register({
            id: 'example.markPage',
            label: () => 'Mark this page',
            aliases: ['mark page'],
            defaults: { 'web:macos': { code: 'KeyG', modifiers: ['primary', 'alt', 'shift'] } },
            regions: ['page'],
            modals: [],
            resolve: () => ({ status: 'handled', run: () => { probe.hits++; report() } }),
          })
          probe.registered = true
          report()
          return () => { dispose(); probe.disposed = true; report() }
        }, 'example: shortcut')
      },
    }
  },
})
```

`build.mjs`：

```js
import { copyFile, mkdir } from 'node:fs/promises'

await mkdir('lib', { recursive: true })
await copyFile('src/index.js', 'lib/index.js')
await copyFile('src/client.js', 'lib/client.js')
```

此包故意只在 macOS Web 设默认组合；Windows、Linux 和 Desktop 下该命令仍可入 catalog，但默认未绑定。为其他 Profile 另选按键前，用 `ctx.shortcuts.describeBinding` 检查当前设备，并遵守 Web 组合与现有命令冲突规则。不能假设同一物理组合在不同浏览器都可送达。

## 构建、装载、触发与清理

在包目录运行：

```sh
npm install
npm run build
node --check lib/client.js
npm pack --dry-run
```

dry-run 应包含 patch 和两个 `lib` 入口。切到包的父目录，建立独立 Web Profile：

```sh
export DSH_HOME="$PWD/dsh-shortcut-home"
dsh --profile shortcut-smoke --from-default-profile web --dump-config
dsh plugin --profile shortcut-smoke add "$PWD/dsh-client-shortcut-probe"
dsh --profile shortcut-smoke --dump-config
dsh --profile shortcut-smoke --no-open
```

第二次 dump 应出现 `shortcut-probe` Loader 行。打开 CLI 给出的本地地址，完成首次使用引导后，`document.documentElement.dataset.dshShortcutProbe` 应是 `{"registered":true,"hits":0,"disposed":false}`。将焦点放在页面非编辑区域，按 `⌘⌥⇧G`；`hits` 应成为 1。将焦点放在消息输入区再按一次，`hits` 保持 1，因为命令只允许 `regions: ['page']`。这个测试不需要模型凭证，也不应发送消息。

保持 Web 服务运行，在另一个终端用相同 `DSH_HOME` 执行：

```sh
dsh plugin --profile shortcut-smoke remove dsh-client-shortcut-probe
dsh --profile shortcut-smoke --dump-config
```

等待 HMR 后，dump 不再有该行，`disposed` 应是 `true`。再次聚焦非编辑区域并按相同组合，`hits` 保持 1。结束时关闭测试 tab 和 Web 进程。`ctx.shortcuts.register` 返回的 disposer 必须由 `ctx.effect` 清理；只依赖命令服务自身的生命期会让插件卸载后仍留下回调。此示例没有异步任务；若业务 `run` 启动异步操作，须由该业务服务拥有失败、取消与清理路径。

## 失败与验证边界

重复命令 ID、冲突默认绑定、保留或不支持的 Web 按键在注册时抛错。`resolve` 应在当前 region/modal/目标不合适时返回 `pass` 或有原因的 `blocked`，不应对过期元素执行操作。用户可以通过快捷键设置覆盖或解除默认绑定，所以产品 UI 应从 catalog 显示有效键帽，不硬编码 `⌘⌥⇧G`。

此包的 Host/Client 文件打包、独立 Client TS 类型示例编译、隔离 Web Profile 装载和 Chrome 按键/卸载路径均已验证。未验证用户重绑、持久偏好恢复、固定按键、Desktop native 及其他操作系统或浏览器。
