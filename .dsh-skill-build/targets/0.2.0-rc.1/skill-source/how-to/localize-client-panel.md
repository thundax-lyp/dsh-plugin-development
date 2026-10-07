# 本地化自有 Client 面板

## 目标与前置

在 `dsh-v0.2.0-rc.1` Web Profile 安装独立包，新增一个可见面板，其侧栏标签和正文随中文/English 设置同步切换；在线卸载后入口和正文清除。Locale 注册面见 [Client 本地化字典与语言注册](api-client-locale.md)，主面板组合见 [Client 全局主面板与侧栏入口](api-client-main-panels.md)。Web Profile 应已有 renderer、locale、layout 与 sidebar。静态示例无需模型凭证或发送消息。

## 建包

创建 `dsh-example-locale-panel/`。`package.json`：

```json
{
  "name": "dsh-example-locale-panel",
  "version": "0.0.1",
  "type": "module",
  "exports": { ".": "./lib/index.js", "./client": "./lib/client.js" },
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ]
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
    "@deepseek-ai/dsh-client-locale": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-layout": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-sidebar": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-client-locale": "0.2.0-rc.1",
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
    - id: example-locale-panel
      name: dsh-example-locale-panel
```

`src/index.js`：

```js
export function apply() {}
```

`src/client.js` 为目标 Web Loader 的 lazy-CJS 输出：

```js
window.__ModuleLoader__.load({
  id: 'dsh-example-locale-panel',
  factory(require) {
    const React = require('react')
    const ns = 'example.panel', id = 'example.locale.panel'
    const zh = { title: '示例语言面板', body: '你好，世界' }
    const en = { title: 'Example language panel', body: 'Hello, world' }
    function Page({ t }) {
      return React.createElement('div', { 'data-example-locale-panel': '' }, t('body'))
    }
    function Icon({ size }) {
      return React.createElement('span', { style: { fontSize: size / 2 }, 'aria-hidden': true }, '文')
    }
    return {
      inject: ['locale', 'slots', 'layout'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(ns, { zh, en }), 'example: dictionaries')
        const t = ctx.locale.bind(ns)
        ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: id, locale: ns }, Page))
        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist', id, order: 50, label: () => t('title'), locale: ns,
        }, Icon))
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

TypeScript/TSX 源不能直接作为浏览器 `./client` 导出；编译示例见 API reference。两份字典、主面板与侧栏图标应由插件 fiber 共同拥有。

## 构建、装载、切换与卸载

在包目录执行 `npm install`、`npm run build`、`node --check lib/client.js`、`npm pack --dry-run`。pack 应包含 patch、Host 根与 Client half。然后：

```sh
export DSH_HOME="$PWD/dsh-locale-panel-home"
dsh --profile locale-panel-smoke --from-default-profile web --dump-config
dsh plugin --profile locale-panel-smoke add "$PWD"
dsh --profile locale-panel-smoke --dump-config
dsh --profile locale-panel-smoke --no-open
```

第二次 dump 应有 `example-locale-panel`。打开 CLI 的本地地址，完成首次引导并跳过模型密钥设置。在中文界面，侧栏“全局面板”应有“示例语言面板”，点击后正文是“你好，世界”。打开“设置”→“通用设置”→“语言”，选择 English；同一侧栏按钮变为 “Example language panel”，正文变为 “Hello, world”。

保持 Web 服务运行，在另一终端用相同 `DSH_HOME` 执行：

```sh
dsh plugin --profile locale-panel-smoke remove dsh-example-locale-panel
dsh --profile locale-panel-smoke --dump-config
```

等待在线更新；该入口和正文消失，页面回到会话。最后关闭测试 tab 与服务。

## 失败、取消与清理

重复 `(namespace, locale)` 注册会抛错；独立包应使用自己的 namespace。类型化注册要求中英文键一致。`register` 的 disposer 必须归 `ctx.effect`；slot 注册跟随父声明和本插件 fiber。此例没有异步资源；若正文包含业务请求，须在 effect/组件卸载时取消，并把模型可见事实写入 Session 日志。此路径已验证中文、English 切换及在线卸载；未验证第三语言、重启持久或 Desktop。
