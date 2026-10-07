# 装配出站 HTTP 代理与子进程环境

## 目标与边界

目标精确 `dsh-v0.2.0-rc.1`。本例在一个自有 Node Host 进程的 outbound 工作期安装 rc.1 代理策略，查询一条 URL 的路由，给 spawn 组装代理环境，并为本地回放清除代理变量。`@deepseek-ai/dsh-http-proxy` 是进程级库，不是 Cordis service，也不能当 Loader plugin 装载。源码见目标 `packages/util/http-proxy/src/{index,install,policy}.ts`；公开成员详见[出站 HTTP 代理](api-http-proxy.md)。

`withOutboundProxy` 的 finally 总是等待 disposer 恢复先前的全局 dispatcher 和环境；真实应用应在进程启动时安装一次，等待所有自有请求结束再卸载，不要让并发请求各自安装。`proxyRouteFor` 的 proxied dispatcher 属于库，不能由调用者关闭。子进程 overlay 中 undefined 必须删除键，不能作为字符串写入；回放用 `clearedProxyEnv()`。不把可能含认证信息的代理 URL 记录在 Session、日志或模型结果。

环境视图的 `get(name)` 可由受信任 launch environment snapshot 实现。`installProxyFromEnvironment` 会报告不能使用的代理值；本例将该诊断抛错，调用方可改为受控日志，但不得输出 URL 中的秘密。对同一进程的普通 `fetch`，全局 undici dispatcher 在安装期生效。worker thread 拥有自己的 dispatcher，主线程安装不传播。

## 独立最小包

`package.json`：

```json
{
  "name": "dsh-http-proxy-consumer-rc1",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": [
    "lib"
  ],
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "smoke": "node smoke.mjs"
  },
  "dependencies": {
    "@deepseek-ai/dsh-http-proxy": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "typescript": "6.0.3"
  }
}
```

`tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "lib",
    "declaration": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": [
    "src/**/*.ts"
  ]
}
```

`src/index.ts`：

```ts
import {
  installProxyFromEnvironment, proxyRouteFor, proxyEnvironmentForChild, clearedProxyEnv,
} from '@deepseek-ai/dsh-http-proxy'

export function childEnvironment(
  base: Readonly<Record<string, string | undefined>>, replay = false,
): Record<string, string | undefined> {
  const child = { ...base }
  const overlay = replay ? clearedProxyEnv() : proxyEnvironmentForChild()
  for (const [name, value] of Object.entries(overlay)) {
    if (value === undefined) delete child[name]
    else child[name] = value
  }
  return child
}

export async function withOutboundProxy<T>(
  values: Readonly<Record<string, string>>, work: () => Promise<T>,
): Promise<T> {
  const env = { get: (name: string) => values[name] === undefined ? undefined : { value: values[name] } }
  const dispose = await installProxyFromEnvironment(env, message => { throw new Error(message) })
  try {
    // A process owner installs once around its outbound work, not once per request.
    return await work()
  } finally {
    await dispose()
  }
}

export function outboundRoute(url: string): { proxied: boolean; proxy?: string } {
  const route = proxyRouteFor(new URL(url))
  return route.proxied ? { proxied: true, proxy: route.proxy } : { proxied: false }
}
```

`smoke.mjs`：

```js
import assert from 'node:assert/strict'
import { childEnvironment, withOutboundProxy, outboundRoute } from './lib/index.js'

assert.deepEqual(outboundRoute('https://example.com'), { proxied: false })
const before = process.env.HTTP_PROXY
await withOutboundProxy({ HTTP_PROXY: 'http://127.0.0.1:18765', NO_PROXY: 'internal.test' }, async () => {
  assert.deepEqual(outboundRoute('https://example.com'), {
    proxied: true, proxy: 'http://127.0.0.1:18765',
  })
  assert.deepEqual(outboundRoute('http://127.0.0.2:3000'), { proxied: false })
  assert.deepEqual(outboundRoute('https://internal.test'), { proxied: false })
  const child = childEnvironment({ CUSTOM: 'ok' })
  assert.equal(child.CUSTOM, 'ok')
  assert.equal(child.NODE_USE_ENV_PROXY, '1')
  assert.ok(child.NO_PROXY.includes('localhost'))
  const replay = childEnvironment({ CUSTOM: 'ok', HTTP_PROXY: 'http://unwanted.invalid' }, true)
  assert.equal(replay.HTTP_PROXY, undefined)
  assert.equal(replay.CUSTOM, 'ok')
})
assert.equal(process.env.HTTP_PROXY, before)
assert.deepEqual(outboundRoute('https://example.com'), { proxied: false })
console.log('proxy route, child env, replay clear, global dispose')
```

在新目录运行：

```sh
npm install --ignore-scripts --no-audit --no-fund
npm run build
npm run smoke
npm pack --dry-run --json
```

隔离 smoke 只核对 route、loopback/NO_PROXY、child/replay overlay 和 dispose 恢复；没有发起真实代理连接、创建子进程或验证 worker。具体执行记录见创建工作区 `evidence/runtime/http-proxy-review.md`。
