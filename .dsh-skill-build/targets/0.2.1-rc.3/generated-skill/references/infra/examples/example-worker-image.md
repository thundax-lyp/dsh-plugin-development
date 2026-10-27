# Worker 镜像：独立库与完整预览

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。packer 在 Node 中构建；runtime 根入口处理镜像/VFS/模块，`./worker` 在 Worker 中运行，`./client` 在页面中连接。根 API 见 [packer](../../host/api/api-capabilities-dsh-experimental-webworker-packer.md)、[runtime](../../host/api/api-capabilities-dsh-experimental-webworker-runtime.md) 与 [页面连接](../../host/api/api-capabilities-dsh-experimental-webworker-runtime-client.md)。这三者都不作为业务 Profile 的插件行。

## 独立 npm 库的完整 smoke

创建 `package.json`，通过目标版本的公开根入口使用库：

```json
{
    "name": "acme-worker-image-smoke",
    "private": true,
    "type": "module",
    "scripts": { "test": "node pack.mjs" },
    "dependencies": {
        "@deepseek-ai/dsh-experimental-webworker-packer": "0.2.1-rc.3",
        "@deepseek-ai/dsh-experimental-webworker-runtime": "0.2.1-rc.3"
    }
}
```

`pack.mjs` 是完整构建与运行断言；它用已构建的最小库模拟发布包，没有 DSH Host Profile。因而特意用 `entries: []` 避免引入默认 Worker assembly seeds；完整应用不能沿用这一设置。

```javascript
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { packVfsImage, packVfsOverlay } from '@deepseek-ai/dsh-experimental-webworker-packer'
import { inflateImage, loadVfsImage, loadVfsOverlay, WorkerModuleLoader } from '@deepseek-ai/dsh-experimental-webworker-runtime'

mkdirSync('subject/lib', { recursive: true })
writeFileSync('subject/package.json', JSON.stringify({
  name: 'acme-worker-subject', type: 'module', files: ['lib'], exports: { '.': './lib/index.js' },
}))
writeFileSync('subject/lib/index.js', 'export const answer = 42')
const packed = packVfsImage({
  profile: 'library-smoke', roster: ['acme-worker-subject'],
  workspaces: new Map([['acme-worker-subject', resolve('subject')]]),
  resolveFrom: process.cwd(), entries: [],
})
assert.deepEqual(packed.missing, [])
mkdirSync('output', { recursive: true })
writeFileSync('output/vfs-image.tar.gz', packed.image)
for (const archive of packed.lazyArchives) {
  const output = resolve('output', archive.name)
  mkdirSync(dirname(output), { recursive: true })
  writeFileSync(output, archive.image)
}
const vfs = loadVfsImage(await inflateImage(packed.image, 'library smoke'))
const loader = new WorkerModuleLoader({ vfs, root: '/dsh', staticModules: {} })
const subject = loader.requireFrom('/dsh')('acme-worker-subject')
assert.equal(subject.answer, 42)
mkdirSync('seed', { recursive: true })
writeFileSync('seed/hello.txt', '本地数据')
const overlay = packVfsOverlay([{ mount: 'workspace', directory: resolve('seed') }])
loadVfsOverlay(await inflateImage(overlay.image, 'data overlay'), '/dsh', vfs)
assert.equal(vfs.readFileSync('/dsh/workspace/hello.txt', 'utf8'), '本地数据')
writeFileSync('output/seed.tar.gz', overlay.image)
console.log('镜像、模块与 overlay 断言通过')
```

运行 `npm install && npm test`。任何断言或打包错误均阻断交付。此测试不需要模型、网络 provider、Worker 或 DSH_HOME；本地输出归本项目所有，可以删除 output/subject/seed 后重跑。它证明库入口可用与发布代码能在 Worker 模块加载器执行，不能证明真实 Web shell 启动。

## 完整 Web Profile 的 checkout 起点

完整源码 checkout 已包含标准 Web bundle、CLI 安装 manifest、配置树与 roster 适配器；不是把 packer 装入 Profile。使用目标版本 checkout，先准备锁定依赖与 Host/Client 生成声明及构建，再从仓库根运行：

```sh
pnpm install --frozen-lockfile
pnpm run build:lib:host
pnpm run build:lib:client
pnpm --dir apps/web run build:preview
pnpm --dir apps/web exec vite preview --host 127.0.0.1
```

`build:preview` 由应用脚本构建页面并调用仓库 packer CLI；保留构建出的全部 preview 资源和 lazy/fixture 相对目录。浏览器打开服务地址的 preview.html。准备自定义业务插件时先将它按公开包契约构建并组合进相应 bundle/roster；打包器不会凭 npm 安装自动把它变成启用行。

需要自建页面而复用同一镜像时，使用 Vite 等能够解析 `?worker` 的 bundler，页面入口完整启动顺序如下；`index.html` 先提供 `<div id="root"></div>`，image 指向已打包的完整 Web 镜像。不能用上节纯库镜像替换它。

```javascript
import DshWorker from '@deepseek-ai/dsh-experimental-webworker-runtime/worker?worker'
import { connectWorkerHost } from '@deepseek-ai/dsh-experimental-webworker-runtime/client'
import { AppWebEntry } from '@deepseek-ai/dsh-client-web'

const element = document.getElementById('root')
if (element === null) throw new Error('缺少 #root')
const worker = new DshWorker({ name: 'dsh-host' })
const stop = () => { worker.terminate() }
window.addEventListener('pagehide', stop, { once: true })
try {
  await connectWorkerHost(worker, { image: '/preview/vfs-image.tar.gz', overlays: [] })
  await new AppWebEntry(element).run()
} catch (error) {
  stop()
  element.textContent = error instanceof Error ? error.message : String(error)
}
```

这里 `?worker` 的 ambient type 由 bundler 提供，不是 DSH 包声明；例如 Vite 项目须引用 `vite/client`。生产页面还应引入 shell theme 资产。connector 先完成握手和 index injections，才允许运行 shell。它没有公开 close/dispose，调用方结束自己拥有的请求/流后 terminate Worker；这不是保证 Host fiber 优雅卸载或写入完成的协议。共享 transport 全局随页面回收，重启使用页面重载。

## 真实页面完成判据

页面必须显示真实 Web shell，可执行一次本地 Session/文件动作；缺镜像 URL、缺 roster 包和无效 overlays 时显示失败而不继续启动；取消自己发起的请求后不更新已卸载 UI。关闭页后 Worker 终止，重开从镜像与按序 overlays 重新初始化。内存 VFS 状态不保证跨 Worker 重启保存；需要持久化的产品应另行设计且验证导出/恢复，不能把内存状态写成持久 Session 保证。
