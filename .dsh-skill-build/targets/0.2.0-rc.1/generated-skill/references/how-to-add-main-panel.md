# 增加全局主面板

## 目标与前置

在 `dsh-v0.2.0-rc.1` Web Profile 安装独立包，侧栏出现 “Example panel”；点击后中央显示 “Example main panel”；在线移除包后入口和页面消失。注册契约见 [Client 全局主面板与侧栏入口](api-client-main-panels.md)。Profile 需已有 Client renderer、layout 与 sidebar。此例没有 Host 业务和异步请求，Host 根只供 Loader 解析。

## 建包

建立 `dsh-example-main-panel/`。`package.json`：

```json
{
  "name": "dsh-example-main-panel",
  "version": "0.0.1",
  "type": "module",
  "exports": { ".": "./lib/index.js", "./client": "./lib/client.js" },
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ]
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
    "@deepseek-ai/dsh-client-ui-layout": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-sidebar": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-client-ui-renderer": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-layout": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-sidebar": "0.2.0-rc.1",
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
    - id: example-main-panel
      name: dsh-example-main-panel
```

`src/index.js`：

```js
export function apply() {}
```

`src/client.js` 使用目标 Web Loader 的 lazy-CJS 格式：

```js
window.__ModuleLoader__.load({
  id: 'dsh-example-main-panel',
  factory(require) {
    const React = require('react')
    const id = 'example.panel'
    function ExamplePanel() {
      return React.createElement('div', { 'data-example-main-panel': '' }, 'Example main panel')
    }
    function ExampleIcon({ size, active }) {
      return React.createElement('span', { style: { fontSize: size / 2 }, 'aria-hidden': true }, active ? '◆' : '◇')
    }
    return {
      inject: ['slots', 'layout'],
      apply(ctx) {
        ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: id }, ExamplePanel))
        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist', id, order: 50, label: 'Example panel',
        }, ExampleIcon))
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

Client `id` 同时是 `main.key` 和 `sidebar.panellist.id`。图标只画内容，外层侧栏按钮负责 `ctx.layout.selectPanel(id)`。若用 TypeScript/TSX 编写组件，要先将其编译/打包为目标 Loader 的 Client 输出，不能直接把 TSX 当 `./client` 导出。

## 构建、装载与验证

在包目录运行 `npm install`、`npm run build`、`node --check lib/client.js`、`npm pack --dry-run`。pack 列表应包含 Host 根、Client half 和 patch。随后在包目录执行：

```sh
export DSH_HOME="$PWD/dsh-main-panel-home"
dsh --profile main-panel-smoke --from-default-profile web --dump-config
dsh plugin --profile main-panel-smoke add "$PWD"
dsh --profile main-panel-smoke --dump-config
dsh --profile main-panel-smoke --no-open
```

第二次 dump 应包含 `example-main-panel` Loader 行。打开 CLI 给出的本地地址，完成首次引导并跳过模型密钥设置；此静态示例无需发送消息。侧栏“全局面板”中应有 “Example panel” 按钮。点击它，主列应显示带 `data-example-main-panel` 的 “Example main panel”。

保持 Web 服务运行，在另一个终端使用同一 `DSH_HOME`：

```sh
dsh plugin --profile main-panel-smoke remove dsh-example-main-panel
dsh --profile main-panel-smoke --dump-config
```

等待在线更新；侧栏入口应消失，主列不再有 `data-example-main-panel`，若原页面是当前面板则回到会话。最后关闭测试浏览器 tab 和 Web 服务。

## 失败与清理

页面 key 缺席时程序化 `selectPanel(id)` 会抛错；入口 ID 与页面 key 不同也无法打开目标页面。两个 `ctx.slots.inject` 注册跟随父 slot 和包的 Client fiber 清理。若页面有订阅、请求或任务，把所有取消/释放逻辑绑定到 effect 或 React cleanup，并把模型可见的业务事实写入 Session 日志。本例仅验证 Web Profile 的静态 UI、点击与在线卸载；未验证 Desktop、业务数据、重启恢复或模型会话调用。
