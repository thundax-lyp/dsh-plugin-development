# 增加可见的 Chat 对话节点

## 目标与前置

在 `dsh-v0.2.0-rc.1` 的 Web Profile 安装一个独立插件：每次已有 Session 的 `turn/start` 事件生成 `example-turn-marker` Chat node，并显示 `Turn N opened`。卸载插件后，该 node 与 renderer 一起消失。这里只投影 Session 已记录的事实；若业务需要新事件，先由 Host 写入 Session，再让 Client 根据日志重建。公开类型、匹配规则、生命周期和显示策略见[Client Conversation Nodes and Chat Renderers](api-conversation-nodes.md)。

需要 rc.1 的 `dsh` CLI、可运行的 Web Profile 和浏览器。下面的 Client 文件是目标版本接受的 lazy-CJS factory；示例用普通 JavaScript 运行，另在 API reference 中给出已通过目标声明编译的 TSX 版本。独立包若改用 TSX 构建，必须让打包器产出同样的 factory 登记格式；不能只把 TSX 复制到 `lib/client.js`。

## 建包与装载

新建 `dsh-turn-marker/`，文件如下。包名、Loader 行名和 `__ModuleLoader__.load` 的 id 必须一致。

`package.json`：

```json
{
  "name": "dsh-turn-marker",
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
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-chat"
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
    - id: turn-marker
      name: dsh-turn-marker
```

`src/index.js`：

```js
export function apply() {}
```

`src/client.js`：

```js
window.__ModuleLoader__.load({
  id: 'dsh-turn-marker',
  factory(require) {
    const React = require('react')
    const definition = {
      kind: 'example-turn-marker',
      target: 'chat',
      match: event => event.type === 'turn/start'
        ? { id: String(event.data.turn), role: 'start' }
        : null,
      start: (_context, match) => {
        if (match.event.type !== 'turn/start') throw new Error('expected turn/start')
        return { turn: match.event.data.turn, seq: match.event.seq }
      },
      update: context => context.state,
      buildViewNode: context => context.state === undefined ? null : ({
        key: context.key,
        kind: 'example-turn-marker',
        id: context.id,
        target: 'chat',
        anchorSeq: context.state.seq,
        location: context.start?.location ?? { kind: 'unresolved' },
        visibility: 'visible',
        data: { turn: context.state.turn },
      }),
    }
    function TurnMarker({ node }) {
      return React.createElement('span', null, `Turn ${node.data.turn} opened`)
    }
    return {
      inject: ['uiConversation', 'slots'],
      apply(ctx) {
        ctx.uiConversation.events.register(definition)
        ctx.slots.inject('conversation.chat.node', () => ctx.slots.register({
          name: 'conversation.chat.node',
          key: 'example-turn-marker',
        }, TurnMarker))
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

运行 `npm run build`、`node --check lib/client.js`、`npm pack --dry-run`，确认三个发布文件被纳入。隔离 Profile 的一个运行方法：

```sh
export DSH_HOME="$PWD/dsh-turn-marker-home"
dsh --profile turn-marker-smoke --from-default-profile web --dump-config
dsh plugin --profile turn-marker-smoke add "$PWD/dsh-turn-marker"
dsh --profile turn-marker-smoke --dump-config
dsh --profile turn-marker-smoke --no-open
```

从 `dsh-turn-marker/` 的父目录执行这些命令。装载前应有 Web/Chat 的 Loader 行；装载后 dump 应多出 `turn-marker` 行。打开 CLI 输出的本地 Web 地址，完成必要的新用户引导并进入一个有 `turn/start` 的 Session；可发送一条消息产生 Turn。即使模型因凭证缺失而失败，已写入的 `turn/start` 仍可用于本例。检查页面有 `Turn 1 opened`；如果 Chat 把已完成 Turn 的 process 折叠，展开该 Turn 再检查。也可检查 `data-chat-flow-kind="example-turn-marker"` 的 Chat wrapper，确认这是投影后的 Chat node，而非手工插入 DOM 的旁路内容。

保持服务运行，在另一终端使用相同 `DSH_HOME` 执行：

```sh
dsh plugin --profile turn-marker-smoke remove dsh-turn-marker
dsh --profile turn-marker-smoke --dump-config
```

等待 Profile HMR 后，当前页面的文字和该 `data-chat-flow-kind` wrapper 应消失，dump 不再包含该行。若 HMR 不可用，重启 Web 进程并刷新页面。最后关闭测试 tab 和进程。`events.register`、`slots.inject` 及其内部 `slots.register` 的 effect 隶属此 Client fiber；卸载时撤销定义和 renderer。组件只读 `node.data`，没有异步工作要取消；扩展为订阅或请求时须在同一 fiber 生命周期内清理。

## 故障与完成判据

重复 node `kind` 或 keyed renderer cell、遗漏 `target` 与 `buildViewNode` 的一侧、缺少 Web Client 半边或 `uiConversation`/`slots` 服务都会阻止正确装载。只看到 Profile 配置行不能证明浏览器投影成功；只看到 DOM 文字也不足以证明它归 Chat 所有，须同时核对 Chat wrapper。`node.kind` 与注册的 slot `key` 不一致时会落到 Chat 的 JSON fallback。完成判据是 Session 事件、Chat node、可见 renderer 和卸载消失四项均实际观察。

此任务路径已在一个隔离 Chrome/Web Profile 运行：出现 `Turn 1 opened`，在线卸载后 wrapper 数量为零。该验证不覆盖自定义事件的 Host 写入、不同 presentation policy、更多浏览器或冷重启后仍装载的行为。
