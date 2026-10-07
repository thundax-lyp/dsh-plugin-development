# 构建并装载 Web Client 插件

## 目标与前置

把一个独立包安装进基于 `web` 模板的 Profile，使页面出现 `Client plugin active`；卸载后文字消失。此例使用目标版本 `dsh-v0.2.0-rc.1` 的 `dsh.client`、`./client` 导出和 Client bundle 登记协议。包不调用 Remote 或专用 slot，因此不需要额外服务；要接入具体 UI slot 时再按相应 reference 添加类型与 `ctx.slots` 注册。模块装载契约见[Web Client 模块装载](api-client-modules.md)，Profile 安装与 patch 叠层见[Bundle 与 Profile](api-profile-bundle.md)。

下面采用无运行时依赖的 JavaScript 入口，并显式生成目标版本接受的 lazy-CJS `lib/client.js`。上游 `clientBundle` tsdown 预设是仓库内文件，不是独立消费包可导入的已发布 API。需要 TypeScript/TSX 或 CSS Modules 的包应在自己的构建中复刻其输出格式与 external/purity 约束，并分别编译 Host 与 Client。

## 实现步骤

在新目录 `dsh-client-presence/` 创建如下五个文件。`package.json` 的包名与 Client 注册 id 保持完全一致；发布时 `files` 包含构建输出及 patch。

`package.json`：

```json
{
  "name": "dsh-client-presence",
  "version": "0.0.1",
  "type": "module",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js"
  },
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": { "platform": "web" }
  },
  "scripts": { "build": "node build.mjs" },
  "files": ["lib/index.js", "lib/client.js", "cordis.patch.yml"]
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: client-presence
      name: dsh-client-presence
```

`src/index.js`，Host 半侧保持空操作，供 Loader 的裸包名行解析；不能只发布 `./client`：

```js
export function apply() {}
```

`src/client.js`，浏览器脚本只登记 factory。DOM 节点由 Client fiber 的 `ctx.effect` 拥有，卸载时由 disposer 移除；没有持久业务事实。

```js
window.__ModuleLoader__.load({
  id: 'dsh-client-presence',
  factory() {
    return {
      apply(ctx) {
        ctx.effect(() => {
          const node = document.createElement('div')
          node.textContent = 'Client plugin active'
          node.setAttribute('data-client-presence', '')
          node.style.cssText = 'position:fixed;bottom:1rem;right:1rem;z-index:1000;background:white;color:black;padding:.5rem'
          document.body.append(node)
          return () => node.remove()
        })
      },
    }
  },
})
```

`build.mjs` 将两个入口产出到 manifest 指定的位置。这是纯文件复制：源 Client 脚本已经是目标登记格式，且没有包外模块请求或 chunk。

```js
import { mkdir, copyFile } from 'node:fs/promises'

await mkdir('lib', { recursive: true })
await copyFile('src/index.js', 'lib/index.js')
await copyFile('src/client.js', 'lib/client.js')
```

执行 `npm run build`，确认 `lib/index.js`、`lib/client.js` 存在。再从包的父目录操作一个隔离的 `web` Profile：

```sh
export DSH_HOME="$PWD/dsh-client-presence-home"
dsh --profile web --dump-default-config >/dev/null
dsh plugin --profile web add "file:$PWD/dsh-client-presence"
dsh --profile web --dump-config
dsh --profile web
```

第二次 dump 中应有 `client-presence` 的裸包名行；第一条命令负责在独立 `DSH_HOME` 初始化 Web Profile。启动日志中的 Web 地址以实际环境为准。打开该页面，检查 `[data-client-presence]` 的文字。Host 侧 `ctx.clientModules.graph().entries` 应包含 `dsh-client-presence`，但配置 dump 或 graph 行本身不足以证明页面的 `apply` 已运行。

在 Web 进程运行时执行 `dsh plugin --profile web remove dsh-client-presence`；等待 Profile HMR 后，目标元素应从当前页面消失。若未启用 HMR，则重启并刷新页面验证缺席。此例无网络请求、取消信号或可恢复状态；若增加监听器、请求、计时器或 CSS，应在同一 fiber scope 负责取消与清理。包解析、bundle 缺失、登记 id 错误、factory 抛错都应视为失败，而非回退成“已安装”。

## 验证与完成边界

`npm run build` 只能证明产物文件生成；`dsh --dump-config` 只能证明 Profile 层拼接。完成判据是 Web 页面实际显示文本、卸载后不再显示，并检查浏览器控制台及 Host boot audit 是否有该行的装载错误。该示例已在独立 `web` Profile 的真实 Chrome 页面观察到一个标记节点，运行中卸载后观察到零个节点；此次未检查控制台与 boot audit，也未覆盖 Client slot、Remote、跨重连业务状态和 HMR 构建刷新。
