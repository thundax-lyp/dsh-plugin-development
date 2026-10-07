# 增加斜杠候选

## 目标与前置

在 `dsh-v0.2.0-rc.1` Web Profile 安装独立插件。输入 `/gr` 后出现 “Greeting greet”，点击后草稿变为 `Hello from example `；在线移除插件后再输入 `/gr` 不出现该候选。来源契约和取消边界见 [Client 输入触发源](api-client-input-trigger.md)。Profile 需有 Client Conversation 和 ui-input-trigger；静态示例无需模型密钥或实际发送。

## 建包

创建 `dsh-example-input-trigger/`。`package.json`：

```json
{
  "name": "dsh-example-input-trigger",
  "version": "0.0.1",
  "type": "module",
  "exports": { ".": "./lib/index.js", "./client": "./lib/client.js" },
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-input-trigger",
        "@deepseek-ai/dsh-client-ui-conversation"
      ]
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
    "@deepseek-ai/dsh-client-ui-input-trigger": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-client-ui-input-trigger": "0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-conversation": "0.2.0-rc.1",
    "typescript": "6.0.3"
  },
  "scripts": { "build": "node build.mjs" },
  "files": ["lib/index.js", "lib/client.js", "cordis.patch.yml"]
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: example-input-trigger
      name: dsh-example-input-trigger
```

`src/index.js`：

```js
export function apply() {}
```

`src/client.js`：

```js
window.__ModuleLoader__.load({
  id: 'dsh-example-input-trigger',
  factory() {
    const source = {
      trigger: '/', name: 'example', order: 100,
      async candidates(_session, req) {
        if (req.signal.aborted || !'greet'.includes(req.query.toLowerCase())) return []
        return [{ name: 'greet', label: 'Greeting', description: 'Insert a greeting into the draft' }]
      },
      onPick() { return { text: 'Hello from example ' } },
    }
    return {
      inject: ['inputTriggers'],
      apply(ctx) {
        ctx.effect(() => ctx.inputTriggers.registerSource(source), 'example: slash source')
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

TypeScript 示例见 API reference；TS 源必须编译成目标 Client Loader 格式后才能导出。候选只改草稿，没有调用模型或 Host RPC。

## 构建、装载和验证

在包目录运行 `npm install`、`npm run build`、`node --check lib/client.js`、`npm pack --dry-run`。然后在包目录执行：

```sh
export DSH_HOME="$PWD/dsh-input-trigger-home"
dsh --profile input-trigger-smoke --from-default-profile web --dump-config
dsh plugin --profile input-trigger-smoke add "$PWD"
dsh --profile input-trigger-smoke --dump-config
dsh --profile input-trigger-smoke --no-open
```

第二次 dump 应含 `example-input-trigger`。打开 CLI 给出的本地地址，完成首次引导并跳过模型密钥设置。在新会话输入框输入 `/gr`，应看到 `example` 组和 “Greeting greet” 候选。点击候选，输入框应显示 `Hello from example `。不要点发送：本例验证输入管线，不需要模型请求。

保持服务运行，在另一终端使用相同 `DSH_HOME`：

```sh
dsh plugin --profile input-trigger-smoke remove dsh-example-input-trigger
dsh --profile input-trigger-smoke --dump-config
```

在线更新后，清空草稿并重新输入 `/gr`；“Greeting greet” 应消失。关闭测试 tab 和 Web 服务。

## 失败与清理

重复注册 `('/', 'example')` 会抛错；来源应选择独立的 `name` 并由 `ctx.effect` 持有 disposer。动态 `candidates` 请求必须使用 `req.signal` 中止或丢弃迟到结果。若来源另有缓存、订阅、预热任务，也应在插件或 Session scope 卸载时释放。当前静态示例无异步外部资源；实际验证只覆盖 `/` 菜单、pick 文本与在线卸载，不覆盖 `@`、Enter/Space、结构化引用或模型提交。
