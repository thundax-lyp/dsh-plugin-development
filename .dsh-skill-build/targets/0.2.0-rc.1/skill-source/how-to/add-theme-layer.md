# 添加主题令牌层

## 目标与前置

在 `dsh-v0.2.0-rc.1` Web Profile 安装独立插件，把基础背景令牌在亮色模式改为淡红色，在线卸载后恢复。`ctx.theme` 的注册、覆盖与快照契约见 [Client 主题注册与令牌覆写](api-client-theme.md)。Profile 应已有 Client `ui-theme` 和 `ui-layout`。此例只改视觉令牌，不产生模型可见事实。

## 建包

创建 `dsh-example-theme-layer/`。`package.json`：

```json
{
  "name": "dsh-example-theme-layer",
  "version": "0.0.1",
  "type": "module",
  "exports": { ".": "./lib/index.js", "./client": "./lib/client.js" },
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-theme",
        "@deepseek-ai/dsh-client-ui-layout"
      ]
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
    "@deepseek-ai/dsh-client-ui-theme": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-client-ui-theme": "0.2.0-rc.1",
    "typescript": "6.0.3"
  },
  "scripts": { "build": "node build.mjs" },
  "files": ["lib/index.js", "lib/client.js", "cordis.patch.yml"]
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: example-theme-layer
      name: dsh-example-theme-layer
```

`src/index.js`：

```js
export function apply() {}
```

`src/client.js` 使用目标 Web Loader 的 lazy-CJS 格式：

```js
window.__ModuleLoader__.load({
  id: 'dsh-example-theme-layer',
  factory() {
    return {
      inject: ['theme'],
      apply(ctx) {
        ctx.effect(() => ctx.theme.overrideTokens('dsh-example-theme-layer', {
          '--dsw-alias-bg-base': { light: '#ffe8e8', dark: '#3b1010' },
        }), 'example: theme layer')
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

如果用 TypeScript 写 Client，先编译/打包为目标 Loader 格式；不能把 `client.ts` 直接作为浏览器包导出。插件拥有唯一 `source`，`ctx.effect` 撤销注册层。

## 构建、装载与验证

在包目录运行 `npm install`、`npm run build`、`node --check lib/client.js`、`npm pack --dry-run`。pack 应包含 patch、Host 根与 Client half。然后在包目录执行：

```sh
export DSH_HOME="$PWD/dsh-theme-layer-home"
dsh --profile theme-layer-smoke --from-default-profile web --dump-config
dsh plugin --profile theme-layer-smoke add "$PWD"
dsh --profile theme-layer-smoke --dump-config
dsh --profile theme-layer-smoke --no-open
```

第二次 dump 应有 `example-theme-layer`。打开 CLI 给出的本地 Web 地址，完成引导并跳过模型密钥设置。在亮色模式下用浏览器开发工具检查：

```js
getComputedStyle(document.body).getPropertyValue('--dsw-alias-bg-base').trim()
// '#ffe8e8'
```

保持服务与浏览器运行，另一个终端用相同 `DSH_HOME` 移除插件：

```sh
dsh plugin --profile theme-layer-smoke remove dsh-example-theme-layer
dsh --profile theme-layer-smoke --dump-config
```

在线更新后，`document.body.style.getPropertyValue('--dsw-alias-bg-base')` 应为空；基础样式重新决定计算值。本次隔离 Chrome 的亮色默认计算值为 `#fff`。关闭测试 tab 和 Web 服务。

## 失败与清理

令牌值必须包含字符串 `light` 和 `dark`；裸字符串或不完整对象在 `overrideTokens` 边界抛错。同 source 再次覆写会替换上一层；卸载时旧 disposer 不移除较新的同 source 层。若实际插件会更新令牌，应在单一 effect 中管理当前 disposer，确保卸载撤销最终层。此路径实际验证了亮色覆写和在线卸载恢复；未验证暗色模式、自定义主题设置 UI、Desktop 或重启恢复。
