# 自建 LocalNotes Remote：源码 workspace 的完整两侧包

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本例的起点是该版本**源码 workspace**，不是任意 npm 项目目录。Host 提供 `localNotes/echo` 与可取消的 `localNotes/wait`；Client 包消费真正生成的 `./remote`，把 contribution 挂到 `ctx.remote`。Host 与 Client 编译面分开，不能把 Host 声明或实现导入浏览器。

普通独立消费项目可以安装已经发布、同时包含 `./typert` 和 `./remote` 的 Remote 包；要自行定义新契约，须先使用本例的 workspace 生成路径，再将完整构建产物供消费方安装。此生成器寻找含 `packages/` 与 `tsconfig.host.json` 的 workspace，并非任意目录生成器。

## 文件与顺序

创建 `packages/api/local-notes/`（Host）和 `packages/client/local-notes/`（Client assembly）。前者拥有方法和错误，后者只有浏览器装配与一次调用。两包版本号是示例包自身版本，不代表已发布的官方包。先写 Host → 接入 Host aggregate/paths → Host 编译并生成 → 写 Client → 接入 Client aggregate/paths → Client 编译与 lazy bundle → 选入 Profile。

## packages/api/local-notes/src/index.ts

```ts remote-notes:host
import type { Context } from '@deepseek-ai/cordis'
import type {} from './types.ts'
import { Remote, RemoteError, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
declare module '@deepseek-ai/cordis' { interface Context { localNotes: LocalNotes } }
export class LocalNotes extends TypertRemoteService {
  constructor(ctx: Context) { super(ctx, 'localNotes', { namespace: 'localNotes' }) }
  @Remote
  async echo(text: string, signal: AbortSignal): Promise<string> {
    signal.throwIfAborted()
    if (text.length === 0) throw new RemoteError('local-notes/empty', '文本不能为空', { field: 'text' })
    return text
  }
  @Remote
  async wait(signal: AbortSignal): Promise<string> {
    signal.throwIfAborted()
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(done, 30000)
      function done() { signal.removeEventListener('abort', abort); resolve() }
      function abort() { clearTimeout(timer); signal.removeEventListener('abort', abort); reject(signal.reason) }
      signal.addEventListener('abort', abort, { once: true })
    })
    return '完成'
  }
}
export default LocalNotes
```

`echo` 无持久状态；错误的 `details` 是结构化业务事实。`wait` 只是取消探针，使用 timer 与一次性 abort listener；无论完成还是取消都清理 listener，取消还清理 timer。插件没有创建跨重启任务，因此不承诺恢复等待中的调用。

## packages/api/local-notes/src/types.ts

错误 details 的声明由共享 types 子路径持有。当前生成 Remote 的声明只合并 namespace 与方法，不自动带入自定义错误表；Client 必须显式类型导入此文件，不能借 Host 根入口让其生效。

```ts remote-notes:host
import type {} from '@deepseek-ai/dsh-typert-protocol'
declare module '@deepseek-ai/dsh-typert-protocol' {
  interface RemoteErrorDetailsMap {
    'local-notes/empty': { readonly field: string }
  }
}
export {}
```

## packages/api/local-notes/package.json

```json
{
    "name": "@deepseek-ai/dsh-local-notes",
    "version": "0.2.1-rc.3",
    "private": true,
    "type": "module",
    "main": "lib/index.js",
    "types": "lib/types/index.d.ts",
    "exports": {
        ".": {
            "types": "./lib/types/index.d.ts",
            "default": "./lib/index.js"
        },
        "./types": {
            "types": "./lib/types/types.d.ts",
            "default": "./lib/types/types.js"
        },
        "./typert": {
            "types": "./lib/typert.host.d.ts",
            "default": "./lib/typert.host.js"
        },
        "./remote": {
            "types": "./lib/typert.remote-client.d.ts",
            "default": "./lib/typert.remote-client.js"
        },
        "./package.json": "./package.json"
    },
    "files": [
        "lib/index.js",
        "lib/types/**/*.d.ts",
        "lib/types/**/*.js",
        "lib/typert.host.js",
        "lib/typert.host.d.ts",
        "lib/typert.remote-client.js",
        "lib/typert.remote-client.d.ts"
    ],
    "peerDependencies": {
        "@deepseek-ai/cordis": "4.0.5",
        "@deepseek-ai/dsh-typert-protocol": "0.2.1-rc.3"
    },
    "devDependencies": {
        "@deepseek-ai/cordis": "workspace:~",
        "@deepseek-ai/dsh-typert-protocol": "workspace:*"
    }
}
```

## packages/api/local-notes/tsconfig.json

```json
{
    "extends": "../../../tsconfig.base.json",
    "compilerOptions": {
        "rootDir": "src",
        "outDir": "lib/types"
    },
    "include": [
        "src"
    ],
    "references": [
        {
            "path": "../../../vendor/cordis"
        },
        {
            "path": "../../typert/protocol"
        }
    ]
}
```

## packages/api/local-notes/tsdown.config.ts

配置属于源码 workspace，引用该版本已构建的生成器。`workspace` 模式与根构建一致，只分析 Host face，再写 Host-for-Client 产物。不要改成 `package` 模式后假定只会分析当前包。

```ts remote-notes:host
import {defineConfig} from 'tsdown'
import {typertPlugin} from '../../typert/generator/lib/types/tsdown-plugin.js'
export default defineConfig({entry:['lib/types/index.js'],outDir:'lib',format:['esm'],platform:'node',target:'es2024',fixedExtension:false,dts:false,clean:false,plugins:[typertPlugin({mode:'workspace',faces:['host']})]})
```

## Host aggregate 与解析

在根 `tsconfig.host.json` 的 `references` 追加 `{ "path": "./packages/api/local-notes" }`。在根 `tsconfig.base.json` 的 `compilerOptions.paths` 加入以下两条，保留已有条目：

```json
{
    "@deepseek-ai/dsh-local-notes": [
        "./packages/api/local-notes/src/index.ts"
    ],
    "@deepseek-ai/dsh-client-local-notes/client": [
        "./packages/client/local-notes/src/client/index.ts"
    ]
}
```

**不要添加 `@deepseek-ai/dsh-local-notes/remote` 的 paths 别名。** 该子路径必须经包 `exports` 在类型检查时选择 `.d.ts`、打包时选择 `.js`；直接指向 `.d.ts` 会令 bundler 把声明当实现，直接指向 `.js` 则可能丢失声明合并。下方 Client manifest 的 workspace 依赖负责建立此包链接。

在 workspace 根执行 `pnpm install --offline --frozen-lockfile` 只适合锁文件已经收录新包的情形。初次加包要先运行 `pnpm install` 更新锁文件，再用 frozen-lockfile 重现；这一步会解析包，离线环境须已准备全部锁定依赖。随后执行：

```sh
pnpm exec tsc -b packages/api/local-notes/tsconfig.json
(cd packages/api/local-notes && pnpm exec tsdown --config-loader native)
```

第二步会在 workspace 生成已有 contributor 与新包的反射，不只是新包。确认 `lib/index.js`、`lib/typert.host.{js,d.ts}`、`lib/typert.remote-client.{js,d.ts}` 均存在。修改方法签名、错误 details、namespace 或导出名后先重新生成，再编译 Client；只改方法体且契约不变才可复用生成物。

## packages/client/local-notes/src/index.ts

Host 的 Loader 入口保留空实现，使该包能作为 Profile entry 被发现；浏览器行为只在 `./client` 中执行。

```ts remote-notes:host
export function apply() {}
```

## packages/client/local-notes/src/client/index.ts

值导入的生成模块同时带入 `TypertRemoteNamespaceMap` 等声明合并，共享 `./types` 的显式类型导入提供错误 details 声明；`ClientRemote` 来自 Gateway 的 Client 导出。不要另外手写 `localNotes` 接口，也不要导入 Host 根包来补类型。多个 contribution 时逐个 push disposer，装载失败及正常卸载均按逆序 await。此最小插件装配后，通过等待子 `ctx.inject` scope 执行一次回声，失败即回滚。父 assembly 只注入 `remote`，不能在该 scope 直接读新建的 `remote.localNotes`，否则 Cordis 注入门禁拒绝；也不能把自己尚未挂载的 namespace 加进父 inject 而制造启动依赖环；实际页面可把调用移到用户操作，但仍须持有取消与卸载 owner。

```tsx remote-notes:client
import type { Context } from '@deepseek-ai/cordis'
import type { ClientRemote } from '@deepseek-ai/dsh-api-gateway/client'
import { TYPERT_REMOTE } from '@deepseek-ai/dsh-local-notes/remote'
import type {} from '@deepseek-ai/dsh-local-notes/types'
declare module '@deepseek-ai/cordis' { interface Context { remote: ClientRemote } }
export const inject = ['remote']
export async function apply(ctx: Context): Promise<() => Promise<void>> {
  const disposers: Array<() => Promise<void>> = []
  try {
    disposers.push(await ctx.remote.$mount(TYPERT_REMOTE))
    await ctx.inject(['remote', 'remote.localNotes'], async (scope) => {
      const result = await scope.remote.localNotes.echo('你好')
      if (!result.ok) {
        if (result.error.code === 'local-notes/empty') {
          throw new Error(`输入字段不能为空：${result.error.details.field}`)
        }
        throw result.error
      }
      if (result.value !== '你好') throw new Error('返回值不匹配')
    })
  } catch (error) {
    for (const dispose of disposers.reverse()) await dispose()
    throw error
  }
  return async () => { for (const dispose of disposers.reverse()) await dispose() }
}
```

## packages/client/local-notes/package.json

```json
{
    "name": "@deepseek-ai/dsh-client-local-notes",
    "version": "0.2.1-rc.3",
    "private": true,
    "type": "module",
    "exports": {
        ".": {
            "types": "./lib/types/index.d.ts",
            "default": "./lib/index.js"
        },
        "./client": {
            "types": "./lib/types/client/index.d.ts",
            "default": "./lib/client.js"
        },
        "./package.json": "./package.json"
    },
    "files": [
        "lib/index.js",
        "lib/client.js",
        "lib/types/**/*.d.ts"
    ],
    "dsh": {
        "client": {
            "inject": [
                "@deepseek-ai/dsh-api-gateway"
            ],
            "platform": "web"
        }
    },
    "dependencies": {
        "@deepseek-ai/dsh-local-notes": "workspace:*"
    },
    "peerDependencies": {
        "@deepseek-ai/cordis": "workspace:~"
    },
    "devDependencies": {
        "@deepseek-ai/cordis": "workspace:~",
        "@deepseek-ai/dsh-api-gateway": "workspace:*"
    }
}
```

## packages/client/local-notes/tsconfig.json

```json
{
    "extends": "../../../tsconfig.base.client.json",
    "compilerOptions": {
        "rootDir": "src",
        "outDir": "lib/types"
    },
    "include": [
        "src"
    ],
    "references": [
        {
            "path": "../../../vendor/cordis"
        },
        {
            "path": "../../api/gateway/tsconfig.client.json"
        }
    ]
}
```

## packages/client/local-notes/tsdown.config.ts

`clientBundle` 是此源码 workspace 的构建设施，不是宣称 npm 包会分发的通用配置导出。它同时发出 Node 入口与 `window.__ModuleLoader__.load({id,factory})` lazy Client bundle；生成 Remote contribution 可以被内联，Cordis 与 Gateway 的共享身份经模块表提供。

```ts remote-notes:host
import {clientBundle} from '../tsdown.client.ts'
export default clientBundle(import.meta.dirname,['lib/types/index.js'])
```

在根 `tsconfig.client.json` 的 `references` 追加 `{ "path": "./packages/client/local-notes" }`。先完成上面的 Host 生成，再在根执行：

```sh
pnpm exec tsc -b packages/client/local-notes/tsconfig.json
(cd packages/client/local-notes && pnpm exec tsdown --config-loader native --env.DSH_BUILD_FACE client)
```

确认 `lib/index.js`、`lib/client.js` 与 `lib/types/client/index.d.ts` 存在。`dsh.client.inject` 声明模块装载依赖，代码 `inject=['remote']` 声明 Cordis 服务依赖；两者不可互相代替。需要其他功能插件在贡献装配之后调用 namespace 时，让它注入 `remote.localNotes`，不依赖未等待的启动事件。

## Profile 装载

在使用该源码 workspace、已经包含 `typert`、`typert-loader`、`remote-access`、Gateway 与 Web Client 基础组合的 Profile 中，将两包加入 composition 的 workspace dependencies 并更新锁文件。在该 Profile 的补丁末尾加入：

```yaml
- insert:
    - id: local-notes
      name: '@deepseek-ai/dsh-local-notes'
    - id: client-local-notes
      name: '@deepseek-ai/dsh-client-local-notes'
```

也可由现有 bundle 的 `cordis.patch.yml` 承载同一插入，并将它列入 bundle 的 `dsh.bundle.patch` 与 `files`。不要再次插入基础 Profile 已有的 Gateway、Registry、Loader 或 Web entry。`typert-loader` 根据激活的 Host 包名解析其 `./typert` 并注册；若调用方要求启动阶段已经装好严格定义，将 `@deepseek-ai/dsh-local-notes` 追加到现有 `typert-loader` 的 `config.packages`（保留已有项），使其激活阶段等待该 artifact 的验证与注册。动态 entry 的增量注册是异步过程，不能只见 Service 存在就推断严格 codec 已就绪；文件 URL entry 不等于 npm 根包 entry，不能期望从任意文件 URL 自动发现 artifact。Web Host 从 Client 包 manifest 收集 `./client` 与依赖，浏览器模块系统按需执行工厂。重启 Profile 后，检查两个 entry 都激活，Client assembly 的回声完成；没有 UI 控件是预期，此例只建立 namespace 和回声调用。

独立分发前去掉私有标记、把 workspace 依赖转换为实际可安装版本，并将完整构建文件打包到本地 tgz检查。若尚未发布示例包，不能复制官方名称版本执行 registry install 并声称可以获得此代码。

## 行为验证与卸载

1. 正常调用 `await ctx.remote.localNotes.echo('你好')` 得 `{ok:true,value:'你好'}`；Host 的生成调用表出现 `localNotes/echo` 与 `localNotes/wait`。
2. 通过测试载体发送错误类型参数，须在调用前返回参数校验错误；TypeScript 调用方不能为了制造坏输入把参数转换为 `any`。
3. 空字符串调用返回 `ok:false`、`error.code === 'local-notes/empty'`、`error.details` 等于 `{field:'text'}`。按 code 判别后使用 details；不把失败分支当正常 value。
4. 预先 abort 的 signal 与已开始的 `wait(signal)` 被 abort 后都返回 `gateway/cancelled`。必须观察等待实际结束和 timer 释放，不能只检查 `AbortController.aborted`。
5. 停用 Client entry，确认 `remote.localNotes` 被撤销，旧方法引用不能继续成功调用；再停用 Host entry，确认 Host Service 消失，Gateway 无法调用已卸载实现。正常卸载与部分失败均逆序清理，按需刷新重连后的 UI 状态。
6. 本例的进程内载体只适合验证生成 codec、Gateway、真实 Loader 与 lazy Client assembly 的组合。最终 Web 产品还要验证真正 WebSocket、断连重连、浏览器装载失败和非 owner 授权；owner 调用成功不证明权限隔离。
