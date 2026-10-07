# 人工授权凭证流程

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1` 的 Host 插件可从 `@deepseek-ai/dsh-authorization` 根导入 `AuthorizationService`、`AuthorizationError`、`AuthorizationDeclinedError` 及流程类型；`./types` 给 Client 安全数据类型。base bundle 已挂载授权服务和本地 [凭证 Provider](api-credentials.md)。自定义 Profile 先装载 `ctx.credentials`，再装载 `AuthorizationService`；注册流程的消费插件声明 `inject = ['authorization', 'credentials']`。此服务取得凭证，不授予 shell/tool 执行权限。

## 契约与运行语义

插件为自己拥有的 `CredentialKey` 注册一个 `AuthorizationFlow`：`ctx.authorization.registerFlow(flow): () => void`。重复键抛 `AuthorizationError('DUPLICATE_FLOW')`。`list()` 返回注册顺序的 `AuthorizationEntry[]`，`describe(key)` 返回单项或 `undefined`。界面调用 `begin({ key, method?, interaction, signal? })`；未指定 method 时取流程 `methods[0]`，无流程、未知方法、同键已有尝试分别抛 `NO_FLOW`、`UNKNOWN_METHOD`、`ALREADY_IN_FLIGHT`。调用方取消或人拒绝产生 `{ status: 'cancelled' }`，真正存储并观察到本次记录提交才产生 `{ status: 'authorized' }`；失败抛错，`authorization/settled(key, status)` 同时通知其他观察者，失败状态为 `failed`。

`run(session)` 得到本次 `method`、`signal`、`commit(record)`、`notify(notice)`、`prompt(prompt)`。`session.commit` 在取消前检查并通过 `ctx.credentials.modifyRecord` 写入；写入已开始后取消等待它完成。也可使用拥有同一记录的自有适配器写入，但服务仍要求在本次尝试中观察 `credentials/record-updated` 且末尾记录仍存在。没有提交时抛 `NOT_COMMITTED`。`notify` 的 UI 渲染故障只记录；`prompt` 人主动拒绝需抛 `AuthorizationDeclinedError`，其他异常是流程失败。

最小独立 Host 包的 `src/index.ts` 如下。`registerFlow` 的返回值属于插件 fiber；卸载会撤回流程并取消尝试。此包提供人工粘贴 API key 的流程，没有外部 OAuth 交换，也没有 Client 界面；由现有授权界面或调用者提供 interaction。

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-authorization'
import { credentialKey } from '@deepseek-ai/dsh-credentials'

export const name = 'example-authorization'
export const inject = ['authorization', 'credentials']

export function apply(ctx: Context): void {
  const key = credentialKey(name, 'sample-service')
  const stop = ctx.authorization.registerFlow({
    key,
    label: 'Sample service',
    methods: [{ id: 'paste-key', label: 'Paste an API key' }],
    async run(session) {
      const secret = await session.prompt({ kind: 'secret', message: 'Enter API key' })
      session.signal.throwIfAborted()
      if (secret.length === 0) throw new Error('API key is empty')
      await session.commit({ kind: 'api-key', key: secret })
    },
  })
  ctx.effect(() => stop)
}
```

`package.json`：

```json
{
  "name": "dsh-authorization-consumer-rc1",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/dsh-authorization": "0.2.0-rc.1",
    "@deepseek-ai/dsh-credentials": "0.2.0-rc.1",
    "@deepseek-ai/cordis": "4.0.4"
  },
  "devDependencies": {
    "@deepseek-ai/dsh-authorization": "0.2.0-rc.1",
    "@deepseek-ai/dsh-credentials": "0.2.0-rc.1",
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
  "include": ["src/**/*.ts"]
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: example-authorization
      name: dsh-authorization-consumer-rc1
```

在包目录运行 `npm install --ignore-scripts --no-audit --no-fund`、`npm run build`、`npm pack --dry-run --json`；pack 应有构建输出、manifest 和 patch。接着用目标 CLI `dsh plugin --profile <name> add ./dsh-authorization-consumer-rc1`，确认 Profile dump 中授权服务、凭证 Provider 与本包的装载行，再启动并从现有授权界面以 `example-authorization/sample-service`、方法 `paste-key` 测试。实际 Profile 运行尚未做，不能把包编译视为交互成功。

## 对象类型与成员

| 对象                         | 成员与约束                                                                                                                                                                                                                               |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AuthorizationService`       | `registerFlow(flow)` 注册且返回 disposer；`list()` 与 `describe(key)` 读当前目录；`begin(request)` 启动一次独占尝试，`cancel(key)` 撤销指定尝试。                                                                                        |
| `AuthorizationError`         | 稳定 `code` 表示服务级失败，例如 NO_FLOW、UNKNOWN_METHOD、ALREADY_IN_FLIGHT、NOT_COMMITTED；不能把异常当作用户取消结果。                                                                                                                 |
| `AuthorizationDeclinedError` | 流程在用户明确拒绝时抛出的专用错误；服务把它归入 cancelled，而普通异常仍是 failed。                                                                                                                                                      |
| `AuthorizationFlow`          | `key: CredentialKey`、`label: string`、非空元组 `methods: readonly [AuthorizationMethod, ...AuthorizationMethod[]]`、`run(session): Promise<void>`；注册插件拥有。                                                                       |
| `AuthorizationMethod`        | `id: string`、`label: string`。                                                                                                                                                                                                          |
| `AuthorizationRequest`       | `key` 必需；`method?` 默认首个；`interaction` 必需；`signal?` 取消整个尝试。                                                                                                                                                             |
| `AuthorizationInteraction`   | `notify(notice): void`；`prompt(prompt): Promise<string>`，`select` 返回选项 id。                                                                                                                                                        |
| `AuthorizationSession`       | `method`、`signal`、`commit(record): Promise<void>`、`notify(notice): void`、`prompt(prompt): Promise<string>`；只在本次尝试使用。                                                                                                       |
| `AuthorizationNotice`        | `message: string`，可选 `url?: string`、`code?: string`；不承载秘密。                                                                                                                                                                    |
| `AuthorizationPrompt`        | `kind: 'text' \| 'secret' \| 'select'`；共有 `message`、可选 `signal`；text/secret 可有 `placeholder`，select 必有 `options: readonly { id, label, description? }[]`。secret 仅影响遮蔽显示和日志策略。prompt 的 `signal` 只取消该问题。 |
| `AuthorizationOutcome`       | `status: 'authorized' \| 'cancelled'`；失败走异常。                                                                                                                                                                                      |
| `AuthorizationEntry`         | `key`、`label`、`methods`、`inFlight`；可供 UI 展示。                                                                                                                                                                                    |

## 生命周期与状态

`registerFlow` 返回的 disposer 由插件 fiber 拥有，卸载时撤回流程并取消对应尝试。`begin` 的调用者拥有 `AbortController` 和交互界面；`cancel(key)` 可由另一请求撤回同键尝试。即使流程忽略取消，服务会释放本次槽位并使 `begin` 返回 cancelled；滞后流程可能仍在私有协议中继续，因此流程必须检查 `session.signal` 并避免无关副作用。授权尝试仅在本进程内存中运行，浏览器重载或进程重启后不能恢复；成功写入的凭证记录持久，重新读取从 [凭证入口](api-credentials.md) 开始。删除本地记录不保证撤销远端授权。

## 失败、权限与边界

`secret` prompt 的遮蔽由界面执行，流程不可将回答写到 `notify`、Session 或模型可见结果。注册/取消并非远端 OAuth 协议实现；每个插件负责外部交换、错误分类和失败清理。`authorization/settled` 在槽位释放后发出；普通监听器故障被包含，`INVARIANT` 同步错误另行抛出。`begin` 有参数校验顺序：即便传入已取消 signal，仍会先报告无流程或未知方法。

## 验证

目标源码与行为测试是 `packages/credentials/authorization/src/{index,types}.ts`、`tests/authorization.spec.ts` 和 `tests/invariant.spec.ts`。完整流程还须在独立消费包中编译 Host、经真实 Profile 注册、从一个界面启动并分别验证成功、拒绝、重复尝试、取消、卸载。该真实路径尚未运行，不能仅凭类型或测试文件名声称已完成。
