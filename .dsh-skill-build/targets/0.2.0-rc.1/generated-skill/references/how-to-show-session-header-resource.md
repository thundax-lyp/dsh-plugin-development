# 在 Session header 显示 Client 资源

## 目标与前置

把独立 Client 插件装入 `dsh-v0.2.0-rc.1` Web Profile：`conversation.session.header.actions` 显示资源 `dsh-resource://note/example` 的首帧 `Ready`。离开 Session 后，最后一个 hook holder 释放并 abort provider；返回该 Session 后重新打开资源；在线卸载插件后 slot 和 provider 一起清理。此例的固定值只是 Client UI 演示，不是 Session 中的模型可见事实。若展示真实业务状态，provider 须从拥有该事实的服务取得数据，并遵守该服务权限。

先确认目标 Web Profile 已装载 renderer、resources、session 和 conversation 的 Client 半边。Slot 的声明、列表注册和 fiber 所有权见 [Web Client Slots](api-client-slots.md)；资源地址、首帧、失败帧与 abort 见 [Web Client resources](api-client-resources.md)。[构建并装载 Web Client 插件](how-to-build-and-load-web-client-plugin.md)解释此处的双入口包和 lazy-CJS 装载协议。

## 建立独立包

在 `dsh-client-ui-probe/` 创建下面五个文件。包名、Client 登记 id 和 Loader 行名一致。`dsh.client.inject` 指定 Client 装载依赖；`./client` 是浏览器半边，裸包名导出是 Host 半边。

`package.json`：

```json
{
  "name": "dsh-client-ui-probe",
  "version": "0.0.1",
  "type": "module",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js"
  },
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-resources",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-session"
      ]
    }
  },
  "scripts": { "build": "node build.mjs" },
  "files": ["lib/index.js", "lib/client.js", "cordis.patch.yml"]
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: client-ui-probe
      name: dsh-client-ui-probe
```

`src/index.js`：

```js
export function apply() {}
```

`src/client.js`：

```js
window.__ModuleLoader__.load({
  id: 'dsh-client-ui-probe',
  factory(require) {
    const React = require('react')
    const probe = { opens: 0, firstFrames: 0, aborts: 0, unloaded: false }
    const report = () => {
      document.documentElement.dataset.dshUiProbe = JSON.stringify(probe)
    }
    report()
    return {
      inject: ['slots', 'resources'],
      apply(ctx) {
        ctx.effect(() => () => { probe.unloaded = true; report() })
        ctx.resources.register({
          protocol: 'note',
          async *open(address, { signal }) {
            if (address !== 'dsh-resource://note/example') return
            probe.opens++
            report()
            try {
              probe.firstFrames++
              report()
              yield { ok: true, value: { text: 'Ready' } }
              await new Promise(resolve => {
                if (signal.aborted) resolve()
                else signal.addEventListener('abort', resolve, { once: true })
              })
            } finally {
              if (signal.aborted) probe.aborts++
              report()
            }
          },
        })
        ctx.slots.inject('conversation.session.header.actions', () =>
          ctx.slots.register({
            name: 'conversation.session.header.actions',
            id: 'client-ui-probe',
            order: 100,
          }, ({ useResource }) => {
            const resource = useResource('dsh-resource://note/example')
            return React.createElement('span', { 'data-client-ui-probe': '' },
              resource.status === 'live' ? resource.value?.text : resource.status)
          }))
      },
    }
  },
})
```

`build.mjs`：

```js
import { mkdir, copyFile } from 'node:fs/promises'

await mkdir('lib', { recursive: true })
await copyFile('src/index.js', 'lib/index.js')
await copyFile('src/client.js', 'lib/client.js')
```

该 Client 源文件已经是目标 lazy-CJS 登记格式，构建只复制文件。若改为 TypeScript/TSX，必须另做目标 Client 声明编译与浏览器 bundle；不能直接复制 TSX。为 `ResourceProtocolMap.note` 声明 `{ text: string }`、使用 `useResource<'note'>` 的已编译写法见 [Web Client resources](api-client-resources.md)和 [Web Client Slots](api-client-slots.md)。

## 构建、装载与观察

在包内运行：

```sh
npm run build
node --check lib/client.js
npm pack --dry-run
```

确认 dry-run 包含 `cordis.patch.yml`、`lib/index.js`、`lib/client.js`。切到包的父目录，初始化隔离 Web Profile 并装载：

```sh
export DSH_HOME="$PWD/dsh-client-ui-probe-home"
dsh --profile ui-smoke --from-default-profile web --dump-config
dsh plugin --profile ui-smoke add "$PWD/dsh-client-ui-probe"
dsh --profile ui-smoke --dump-config
dsh --profile ui-smoke --no-open
```

第二次配置 dump 应包含 `client-ui-probe` 行。打开 CLI 给出的本地地址，完成首次使用引导，进入一个 Session 页面；新 Profile 如没有 Session，可发送一条测试消息创建 Session。此任务只需要 Session 页面，模型因缺少凭证报错不阻止 `Ready` 首帧显示。

检查 Session header 的 `[data-client-ui-probe]` 显示 `Ready`，且 `document.documentElement.dataset.dshUiProbe` 是 `{"opens":1,"firstFrames":1,"aborts":0,"unloaded":false}`。点击“新建会话”进入没有 Session 绑定的页面；header contribution 不再渲染，`aborts` 应变为 1。回到原 Session 后，`Ready` 应重新出现，`opens`、`firstFrames` 应各变为 2。

保持 Web 服务运行，在另一个终端用同一 `DSH_HOME` 执行：

```sh
dsh plugin --profile ui-smoke remove dsh-client-ui-probe
dsh --profile ui-smoke --dump-config
```

等待 Profile HMR；`[data-client-ui-probe]` 应消失，`aborts` 应变为 2，`unloaded` 应为 `true`，dump 中不再有插件行。若当前环境没有在线 HMR，重启 Web 后检查缺席，并把在线清理记为未验证。结束时关闭测试页面和 Web 服务。

## 失败与清理边界

`ctx.resources.register` 归 provider Client fiber 所有，重复 `note` protocol 会抛错；`ctx.slots.inject` 等父 header 声明出现才登记 list 项，父声明或插件卸载时撤销。`useResource` 的最后一个 holder 释放会 abort `open`；provider 通过 `signal` 停止等待。真实流须在 `finally` 里关闭其订阅、计时器或连接，并用 `{ ok: false, error }` 报告可恢复失败。示例的固定首帧不写 Session，故不能用它代表可重建业务事实。

完成判据是 Web 页面首帧、离开后的 abort、返回后的重新打开、在线卸载后的 UI 消失和 provider abort；配置 dump 与打包通过只是前置。隔离 Chrome/Web Profile 已观察这四个阶段；尚未验证后续帧、失败帧、`pin`、重复 provider 冲突或冷重启。
