# 增加右侧栏标签

## 目标与前置

在 `dsh-v0.2.0-rc.1` Web Profile 安装一个独立包，让右侧栏的开始页出现 “Example notes” 入口；点击后打开 `example-notes` tab 并显示 body。在线卸载后，入口和 body 消失，已打开的 tab 记录保留并显示不可查看提示。Tab type、keyed body、导航和生命周期的完整契约见 [Client right sidebar tab types](api-sidebar-right-tabs.md)。

Web Profile 应已有 `@deepseek-ai/dsh-client-ui-sidebar-right` 和 `@deepseek-ai/dsh-client-ui-renderer` 的 Client 半边。此例是静态 page type，既不读资源也不写 Session；要显示业务事实，另从拥有者服务读取并把模型可见事实记录到 Session。下列 Client JavaScript 已是目标 lazy-CJS 登记格式；TypeScript/TSX 版本不能直接复制到浏览器输出，需打包成相同格式。

## 建包

创建 `dsh-example-sidebar-tab/`，写入五个文件。`package.json`：

```json
{
  "name": "dsh-example-sidebar-tab",
  "version": "0.0.1",
  "type": "module",
  "exports": { ".": "./lib/index.js", "./client": "./lib/client.js" },
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-sidebar-right"
      ]
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
    "@deepseek-ai/dsh-client-ui-sidebar-right": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-client-ui-renderer": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-sidebar-right": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-slots": "0.2.0-rc.1",
    "@types/react": "18.3.1",
    "react": "18.3.1",
    "typescript": "6.0.3"
  },
  "scripts": { "build": "node build.mjs" },
  "files": ["lib/index.js", "lib/client.js", "cordis.patch.yml"]
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: example-sidebar-tab
      name: dsh-example-sidebar-tab
```

`src/index.js` 让 Host Loader 可解析裸包名：

```js
export function apply() {}
```

`src/client.js`：

```js
window.__ModuleLoader__.load({
  id: 'dsh-example-sidebar-tab',
  factory(require) {
    const React = require('react')
    const probe = { typeRegistered: false, bodyRenders: 0, disposed: false }
    const report = () => { document.documentElement.dataset.dshSidebarTabProbe = JSON.stringify(probe) }
    report()
    const id = 'example.sidebar.notes'
    const definition = {
      id,
      kind: 'example-notes',
      title: () => 'Example notes',
      guide: [{ id: 'open-notes', order: 100, title: () => 'Example notes', description: () => 'Open a sample sidebar page' }],
    }
    function NotesTab({ useTabInfo }) {
      probe.bodyRenders++
      report()
      const { tab } = useTabInfo()
      return React.createElement('div', { 'data-example-sidebar-tab': '' }, `Example notes: ${tab.kind}`)
    }
    return {
      inject: ['sidebarRightTabs', 'slots'],
      apply(ctx) {
        ctx.effect(() => {
          const dispose = ctx.sidebarRightTabs.register(definition)
          probe.typeRegistered = true
          report()
          return () => { dispose(); probe.disposed = true; report() }
        }, 'example: sidebar type')
        ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
          name: 'sidebar.right.pane.tab', key: id,
        }, NotesTab)), 'example: sidebar body')
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

`definition.id` 与 `sidebar.right.pane.tab` 的 `key` 都是 `example.sidebar.notes`；`kind` 是 `example-notes`，供 Guide 和 `openTab(kind)` 导航。包的 Client half 必须同时装载 renderer 和 sidebar-right；只安装 Host 根不会显示入口。

## 构建、装载和验证

在包内运行：

```sh
npm install
npm run build
node --check lib/client.js
npm pack --dry-run
```

dry-run 应包括 patch、Host 根和 Client half。切到包的父目录，用隔离 Profile：

```sh
export DSH_HOME="$PWD/dsh-sidebar-tab-home"
dsh --profile sidebar-tab-smoke --from-default-profile web --dump-config
dsh plugin --profile sidebar-tab-smoke add "$PWD/dsh-example-sidebar-tab"
dsh --profile sidebar-tab-smoke --dump-config
dsh --profile sidebar-tab-smoke --no-open
```

第二次 dump 应出现 `example-sidebar-tab` Loader 行。打开 CLI 给出的本地 Web 地址并完成首次使用引导；此例不需要模型凭证，也不必发送消息。检查页面标记 `data-dsh-sidebar-tab-probe` 的 `typeRegistered` 为 `true`。点击“打开右侧边栏”，开始页应显示 “Example notes” 和说明；点击该入口，tab chip 显示 “Example notes”，body 显示 `Example notes: example-notes`，`bodyRenders` 至少为 1。

保持 Web 服务运行，在另一个终端用同一 `DSH_HOME` 执行：

```sh
dsh plugin --profile sidebar-tab-smoke remove dsh-example-sidebar-tab
dsh --profile sidebar-tab-smoke --dump-config
```

等待 HMR，dump 不再有该行，`disposed` 为 `true`。已打开的 tab chip 仍可能在布局中；它的 body 应改为“这类内容还没有可用的查看方式。”，而非继续显示示例内容。打开新 tab 回到开始页后，“Example notes” 入口不再出现。最后关闭测试 tab 和 Web 服务。

## 失败、取消与清理

重复 type `id`、不允许的同 `kind` 冲突或重复 Guide entry ID 会在注册时抛错。漏注册 body、或 body 的 keyed `key` 与 type `id` 不一致，Guide 仍可能出现但面板不能呈现业务内容。两个注册都应归插件 fiber：type 的返回 disposer 由 `ctx.effect` 调用，slot 通过 `ctx.slots.inject` 跟随父声明并由外层 effect 撤销。

本例没有网络或异步资源。增加资源 viewer 时，先在 `patterns` 和 `canOpen` 中明确地址边界，再用 tab 信息的 `signal` 管理 tab 记录的工作，并在组件卸载时释放监听器；隐藏或 Session 切换不等于 tab 被关闭。用户布局中留下的已打开 tab 要能在 provider 回来时恢复或显示明确的不可查看提示，不能假定插件卸载会删除记录。

此路径已在独立 Client 类型编译、包构建和隔离 Chrome/Web Profile 中验证 guide、body、在线卸载和 fallback。未验证资源地址路由、同 kind 覆盖、跨 Session/重启恢复、`keepMounted` 或 Desktop 布局。
