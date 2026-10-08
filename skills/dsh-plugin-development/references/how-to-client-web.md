# 为插件增加 Client UI、Remote 与实时设置

本路径组合 [Client/Web guardrail](api-client-web.md) 与 [任务所需公开对象](api-client-web-surface.md)；对象签名由后者锁定，本文只拥有跨 Host、Remote、Client 与 Profile 的顺序。

## 结果与组成

目标是让一个 Host 插件保存状态，通过 typed Remote 供浏览器读取，并在 `conversation.session.header.actions` 增加一个按钮；按钮状态可通过插件 Config 在线修改。这个任务组合 Host package、生成 Remote、Client package、slot registration 和 Web Profile 装载。

目标版本发布了 `@deepseek-ai/dsh-typert-generator`，但当前独立 npm 消费项目未能用其发布的声明生成 Remote 工件：生成器未把来自 `node_modules` 的 `@Remote` 识别为方法标记，报 `publishes Remote artifacts but has no Remote methods`。目标版本也未发布独立第三方 Client bundle builder。下列代码是 Host/Client 声明示例，**不是可独立安装的完整包**。消费项目还需要可用的 Typert 生成路径、DSH lazy-CJS `lib/client.js` 构建步骤，以及真实 Profile 验证。

下列文件只覆盖源契约和装载声明；Client 构建配置仍是未实现的交付项：

```text
package.json
src/index.ts
src/client/index.tsx
cordis.patch.yml
```

## Host 入口与 Remote

```ts
// src/index.ts
import type { Context, Volatile } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import z from '@deepseek-ai/schemastery'
import { Remote, RemoteError, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'

export interface Config {
  label: Volatile<string>
}

export const Config = z.object({
  label: z.string().default('Review').volatile(),
})

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface RemoteErrorDetailsMap {
    'review/empty-label': { readonly field: 'label' }
  }
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    reviewController: ReviewController
  }
}

export class ReviewController extends TypertRemoteService {
  constructor(ctx: Context, private readonly config: Config) {
    super(ctx, 'reviewController', { namespace: 'review' })
  }

  @Remote('label')
  label(agent: Agent, signal: AbortSignal): string {
    void agent
    signal.throwIfAborted()
    const label = this.config.label.get().trim()
    if (!label) {
      throw new RemoteError('review/empty-label', 'review label is empty', { field: 'label' })
    }
    return label
  }
}

export function apply(ctx: Context, config: Config): void {
  new ReviewController(ctx, config)
}
```

`Agent` 是 lookup 参数，不由 Client 发送实体；Gateway 从 wire identity 解析。`AbortSignal` 在最后。更改该签名或 error code 后运行目标仓库 Typert 生成/build，得到 `./typert` Host 描述和 `./remote` Client contribution。下方 Client assembly 以运行时值导入并挂载该 contribution；同一个导入也带入生成的类型增强。目标 `api-remotes` 是显式 assembly，不会自动发现此 namespace。

Host Profile 还需在 `@deepseek-ai/dsh-typert-registry` 之后挂载 `@deepseek-ai/dsh-typert-loader`。Loader 默认从当前 Cordis Loader entries 发现每个包的 `./typert`，注册随 entry 卸载撤销；藏在另一 entry 后的包可用 loader 的 `packages: ['@acme/dsh-review']` 显式列出，且该名称必须从配置树可解析。没有 `./typert` 的普通 entry 会跳过；显式列出的包缺失该 export 会报错。新增该 export 后须重启 Host，因为解析裁决按进程缓存。只生成四个文件、却不挂载 registry 与 loader，Remote 不会注册到 Host 运行时。

### 生成 Remote 工件的公开 API 与消费限制

`@deepseek-ai/dsh-typert-generator` 的根导出提供 `WorkspaceTypertGenerator`，`./tsdown` 导出提供 `typertPlugin()`。直接调用生成器时，workspace 根必须有 `tsconfig.host.json`、`tsconfig.client.json` 两个独立聚合工程，插件包必须位于根目录的 `packages/` 下并被 Host 聚合工程直接引用；生成器只从这些 project references 发现包，单独在任意目录运行不会找到它。Host 包清单需预先声明精确的 `./typert` 与 `./remote` exports，并在 `files` 显式列出四个生成的 `.js`/`.d.ts` 文件；声明与产物不匹配会被生成器拒绝。见目标 `packages/typert/generator/src/analyzer.ts:294-336,478-520` 与 `src/workspace.ts:65-125`。

独立 workspace 完成 Host 类型检查后，公开根导出提供以下生成器调用形状。它在本目标版本的独立 npm 消费实验中**未生成文件**，因此只能用于核查 API，不能作为已验证的安装步骤：

```js
// scripts/generate-review-remote.mjs
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { WorkspaceTypertGenerator } from '@deepseek-ai/dsh-typert-generator'

const root = process.cwd()
const artifacts = new WorkspaceTypertGenerator(root).generate(['@acme/dsh-review'], ['host'])
if (artifacts.length !== 1 || !artifacts[0].remote) {
  throw new Error('Expected one Host artifact with a Remote contribution')
}
const artifact = artifacts[0]
const output = resolve(root, artifact.packageRoot, 'lib')
await mkdir(output, { recursive: true })
await Promise.all([
  writeFile(resolve(output, 'typert.host.js'), artifact.js),
  writeFile(resolve(output, 'typert.host.d.ts'), artifact.dts),
  writeFile(resolve(output, 'typert.remote-client.js'), artifact.remote.js),
  writeFile(resolve(output, 'typert.remote-client.d.ts'), artifact.remote.dts),
])
```

把 `@deepseek-ai/dsh-typert-generator` 固定到 `0.2.0-rc.2` 作为构建依赖。上述脚本的 API 与输出路径由公开声明支持，但发布版生成器在本独立消费实验中先因 `@Remote` 声明不属于登记的 workspace package 而没有发现方法；仅把已发布 protocol 与 session `.d.ts` 复制成 workspace package，接着分别遇到未命名的公开 wire type 与生成器内部 `TypeError`。这不是可复现的四文件构建路径。只有找到并验证公开配置或修复后，才能验收四个文件、两侧声明编译及 Profile 装载。目标 `typertPlugin()` 可以接入 tsdown 构建，然而其 `writeBundle` 以 `lib/` 的最近 package 与 workspace 根作发现，并假定 TypeScript 产物已通过构建；不能只把插件名传给它就绕过聚合工程。

Client bundle 的发布边界仍在：目标 `packages/client/tsdown.client.ts` 中的 `clientBundle()` 不在任何已发布包 exports 中，而且该预设依赖仓库私有的 `scripts/client-build-environment.ts`、`scripts/bundle-input-isolation.ts` 和 Client module 内部实现。`packages/client/modules/README.md` 要求产物以 `window.__ModuleLoader__.load({ id, factory })` 登记 lazy-CJS；外部模块还须与页面 seed table 或 `dsh.client.external` 精确匹配。

简单的 tsdown CJS wrapper 可生成单文件、只外部化 React 的最小工件：`banner` 登记 `window.__ModuleLoader__.load({ id, factory: (require) => {`，`intro` 创建 `module.exports`，`footer` 返回它，再由 `deps.neverBundle` 保留 `require('react')`。目标版本的 Client module system 能装载这种工件并从 seed table 解析 React。这个窄构建方法没有覆盖本例的生成 Remote contribution、全部 externals、CSS、异步 chunk、purity/input gate、source map 与 Profile；制作完整 Client 包必须逐项满足这些契约，并在真实 Web 组合验证。

## Client 入口与 slot

```tsx
// src/client/index.tsx
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import reviewRemote from '@acme/dsh-review/remote'
import { useEffect, useState } from 'react'

type Props = PropsRuntime<'conversation.session.header.actions'> & {
  loadLabel: (signal?: AbortSignal) => Promise<string>
}

function ReviewAction({ loadLabel }: Props) {
  const [label, setLabel] = useState('Review')
  const [failure, setFailure] = useState<string>()

  useEffect(() => {
    const abort = new AbortController()
    void loadLabel(abort.signal).then(
      value => { if (!abort.signal.aborted) setLabel(value) },
      (error: unknown) => {
        if (!abort.signal.aborted) setFailure(error instanceof Error ? error.message : String(error))
      },
    )
    return () => { abort.abort() }
  }, [loadLabel])

  return <button type="button" disabled={failure !== undefined}>{failure ?? label}</button>
}

export const inject = ['slots', 'remote']

function registerUi(ctx: Context): void {
  ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register({
    name: 'conversation.session.header.actions',
    id: 'review',
    order: 100,
    inject: () => ({
      loadLabel: async (signal?: AbortSignal) => {
        const result = await ctx.remote.review.label(signal)
        if (!result.ok) throw result.error
        return result.value
      },
    }),
  }, ReviewAction))
}

export async function apply(ctx: Context): Promise<() => Promise<void>> {
  const disposeRemote = await ctx.remote.$mount(reviewRemote)
  const ui = ctx.inject(['remote.review', 'slots'], registerUi)
  try {
    await ui
  } catch (error) {
    await ui.dispose()
    await disposeRemote()
    throw error
  }
  return async () => {
    await ui.dispose()
    await disposeRemote()
  }
}
```

外层 Client assembly 只声明它启动前已有的 `remote` 与 `slots`；它先挂载生成 contribution，再用内层 `ctx.inject` 等待新出现的 `remote.review`，避免把自己将要提供的 namespace 写成启动前依赖。`slots.inject` 继续等待 slot owner。Component 不接收 `ctx`；Remote 调用在 registration inject closure 内投影为普通 callback，并把 effect 的 signal 传入传输层。卸载先停止 UI fiber，再撤回 Remote contribution，因此卸载后的成功或失败都不会更新组件。此例没有需要跨 entry 或跨 remount 保留的可变视图状态，因此不声明 store。若状态需要共享，使用 `defineStore` handle 并通过 registration 的 `store` 提供，Component 只用 `useStore` 和 `actions`。

真实产品字符串还必须注册 typed locale namespace 并通过 `locale`/`t` 提供；示例中的英文 fallback 仅为最小契约演示，不符合产品发布的本地化门禁。

## 包清单与 Profile

```json
{
  "name": "@acme/dsh-review",
  "version": "0.0.1",
  "type": "module",
  "exports": {
    ".": { "types": "./lib/types/index.d.ts", "default": "./lib/index.js" },
    "./client": { "types": "./lib/types/client/index.d.ts", "default": "./lib/client.js" },
    "./typert": { "types": "./lib/typert.host.d.ts", "default": "./lib/typert.host.js" },
    "./remote": { "types": "./lib/typert.remote-client.d.ts", "default": "./lib/typert.remote-client.js" }
  },
  "dsh": {
    "client": {
      "platform": "web",
      "inject": ["@deepseek-ai/dsh-client-ui-conversation", "@deepseek-ai/dsh-api-remotes"]
    }
  },
  "files": ["lib/index.js", "lib/client.js", "lib/typert.host.js", "lib/typert.host.d.ts", "lib/typert.remote-client.js", "lib/typert.remote-client.d.ts", "lib/types/**/*.d.ts"],
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-typert-protocol": "0.2.0-rc.2"
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "3.18.4"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-agent": "0.2.0-rc.2",
    "@deepseek-ai/dsh-api-remotes": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-conversation": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-renderer": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-slots": "0.2.0-rc.2",
    "@deepseek-ai/dsh-typert-generator": "0.2.0-rc.2",
    "@deepseek-ai/dsh-typert-protocol": "0.2.0-rc.2",
    "@types/react": "~18.3.1",
    "react": "^18.2.0"
  }
}
```

```yaml
- insert:
    - id: review
      name: '@acme/dsh-review'
      config:
        label: Review
```

包必须安装到 Profile 解析得到的依赖树；只写 patch 而未安装会在 bare specifier import 时失败。Client build 还必须 externalize DSH baseline，并输出 module system 所需 factory。

## 设置页面

仅需要 schema 自动表单时，不必自己写页面：让 Host entry 暴露 `Config`，保持 settings/config-editor 组合，并为插件实例使用唯一 row id。需要自定义 Client 页面时，注入 `configForms`，通过 `get<ConfigValue>('review')` 读取。staged draft 开始编辑时必须同时捕获字段值和该时刻的 revision；保存时继续使用这一旧 revision，而不是重读最新 snapshot 后把旧草稿当作新编辑提交：

```ts
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'

export function beginLabelEdit(form: ConfigForm<{ label: string }>) {
  const snapshot = form.getSnapshot()
  if (snapshot.status !== 'ready' || !snapshot.writable || !snapshot.value || snapshot.revision === undefined) {
    return undefined
  }
  return { draftLabel: snapshot.value.label, expectedRevision: snapshot.revision }
}

export async function saveLabel(
  form: ConfigForm<{ label: string }>,
  draftLabel: string,
  expectedRevision: number,
): Promise<boolean> {
  return form.mutate(
    [{ op: 'set', path: ['label'], value: draftLabel }],
    expectedRevision,
  )
}
```

`saveLabel` 返回 `false` 表示拒绝、冲突或不可写；保留用户草稿，读取恢复后的最新 snapshot，提示用户比较后再决定是否重新编辑，不能静默以新 revision 重试。transport fault 会 reject，同样保留草稿并报告失败。清除 override 调用 `unset('label')`，不要写死默认值。非 loopback Web 不提供 Host 持久化。用两个编辑者交错写入验证：A 捕获 revision，B 先保存新值，A 的旧草稿必须被拒绝且不能覆盖 B。

## 验证与卸载

1. 运行 Remote generator/build，确认 `./typert` 与 `./remote` 对同一 namespace 和签名。
2. 分别编译 Host 与 Client；Client 测试使用真实 `RemoteError` double，按 `result.ok`/`code` 断言。
3. 用 Client module verifier 检查 factory、externals、supplier graph 和同步 cycle。
4. 在隔离 Profile 安装包并挂载 bare root row；确认 Host fiber、Remote namespace、Client fiber 和 slot entry 都激活。
5. 浏览器中确认按钮出现；空 label 显示结构化失败；更新 Config 后下一次读取采用新值。
6. 禁用/删除 row，确认 slot contribution 消失、Remote namespace 不能再调用、事件和订阅不残留；重新启用后由 Host Config/Remote snapshot 恢复，而不是依赖旧 React state。

分别观察 Web Profile 装载、浏览器交互、重连和 Remote round trip，确认各侧运行行为。

## 输入框异步插入与显式启用引导

若任务要在输入框旁增加语音转写、搜索建议等异步动作，先导入 `@deepseek-ai/dsh-client-ui-conversation/client` 的 slot 声明，并向 session-scoped `conversation.input.activity` 注册组件。`PropsRuntime<'conversation.input.activity'>` 提供 `inputActions`、`locked` 和 `onActiveChange`；组件不能从 Host 路径或 React 私有输入框状态构造插入位置。下面的 `produceText` 是插件自己实现的可取消异步操作，通过 registration `inject` 传入，组件不持有 Cordis `ctx`：

```tsx
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type { Context } from '@deepseek-ai/cordis'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { useEffect, useRef, useState } from 'react'

type InputActionProps = PropsRuntime<'conversation.input.activity'> & {
  produceText: (signal: AbortSignal) => Promise<string>
}

function InputAction({ inputActions, locked, onActiveChange, produceText }: InputActionProps) {
  const [busy, setBusy] = useState(false)
  const [pending, setPending] = useState<string>()
  const [failure, setFailure] = useState<string>()
  const operation = useRef<AbortController>()

  useEffect(() => {
    onActiveChange(busy || pending !== undefined || failure !== undefined)
    return () => { onActiveChange(false) }
  }, [busy, pending, failure, onActiveChange])
  useEffect(() => () => { operation.current?.abort() }, [])

  async function start(): Promise<void> {
    if (locked || operation.current) return
    const span = inputActions.captureInsertion() // 捕获必须早于异步等待
    const abort = new AbortController()
    operation.current = abort
    setBusy(true)
    setFailure(undefined)
    try {
      const text = await produceText(abort.signal)
      if (abort.signal.aborted) return
      if (!inputActions.insertText(text, span)) setPending(text)
    } catch (error) {
      if (!abort.signal.aborted) setFailure(error instanceof Error ? error.message : String(error))
    } finally {
      if (operation.current === abort) operation.current = undefined
      if (!abort.signal.aborted) setBusy(false)
    }
  }

  return <div>
    <button type="button" disabled={locked || busy} onClick={() => { void start() }}>Insert result</button>
    {pending !== undefined && <button type="button" disabled={locked} onClick={() => {
      if (inputActions.insertText(pending, inputActions.captureInsertion())) setPending(undefined)
    }}>Insert retained text</button>}
    {failure !== undefined && <span role="alert">{failure}</span>}
  </div>
}

export const inject = ['slots']
export function apply(ctx: Context): void {
  ctx.slots.inject('conversation.input.activity', () => ctx.slots.register({
    name: 'conversation.input.activity',
    inject: () => ({ produceText: async (signal: AbortSignal) => {
      // 在插件自身实现中调用真实服务；必须转发 signal 并处理业务失败。
      signal.throwIfAborted()
      return 'example result'
    } }),
  }, InputAction))
}
```

`insertText(text, span)` 返回 `false` 时保留结果，用户明确点击重试时才重新 `captureInsertion()`；不能悄悄覆盖后续编辑。卸载、切换 Session 或用户取消时应中止操作并丢弃迟到结果。上例只示范输入契约，生产组件仍须为按钮和失败消息提供 locale 文案，并把真实操作的取消、失败和资源释放接入自身生命周期。

如果启用 bundle 后还需提示下载模型等准备步骤，另向 `plugins.bundle.activation` 注册 root-scoped keyed entry，`key` 用确切 npm 包名；导入 `@deepseek-ai/dsh-client-ui-plugin-manager/client` 的类型声明，等待该 slot owner，再在组件中用 `PropsRuntime<'plugins.bundle.activation'>` 的 `onDismiss()` 或 `onOpenDetails()` 结束引导。该 slot 只在用户显式启用后由插件管理页渲染；插件列表的普通卡片只显示 bundle 描述和开关。此入口不是自动安装或下载 API。参考目标版本 `packages/experimental/client-ui-voice-input/src/client/mount.ts:48-50` 和 `packages/client/ui-plugin-manager/src/client/slot-contract.ts:66-79`。

```tsx
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-plugin-manager/client'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'

function SetupPrompt({ packageName, onDismiss, onOpenDetails }: PropsRuntime<'plugins.bundle.activation'>) {
  if (packageName !== '@acme/dsh-input-bundle') return null
  return <div>
    <p>Additional setup is needed.</p>
    <button type="button" onClick={onOpenDetails}>Open bundle details</button>
    <button type="button" onClick={onDismiss}>Later</button>
  </div>
}

export function apply(ctx: Context) {
  ctx.slots.inject('plugins.bundle.activation', () => ctx.slots.register({
    name: 'plugins.bundle.activation', key: '@acme/dsh-input-bundle',
  }, SetupPrompt))
}
```

这里的 `ctx` 是 Client 插件 `apply`/`registerUi` 收到的 Context；把注册语句放在该函数内，并将详情引导与真正的资源准备状态关联。上例文案只演示 slot 契约，发布时需接入 locale。

验证时在隔离 Web Profile 装载实际 bundle：开始异步操作后更改草稿，确认旧 span 被拒绝且文字仍可手动插入；锁定输入或切换 Session 时不写入旧草稿；展开活动控件后卸载，确认 `onActiveChange(false)` 释放布局；显式启用缺资源 bundle 时仅显示准备引导，关闭与打开详情分别调用 owner callback。

## Web provider 集成

Host Profile 先挂载 `@deepseek-ai/dsh-web`，再挂载依赖 `web` service 的 provider 包。搜索与抓取是两个独立 registry；只实现其中一种时只调用对应的注册方法。`WebSearchProvider` 和 `WebFetchProvider` 均须有唯一的 `id: string`、同步无网络的 `available(): boolean`，以及分别为 `search(request: WebSearchRequest, signal?: AbortSignal): Promise<WebSearchResult>`、`fetch(request: WebFetchRequest, signal?: AbortSignal): Promise<WebFetchResult>` 的方法。`ctx.web.registerSearchProvider(provider)` 与 `registerFetchProvider(provider)` 返回 disposer，且注册本身绑定调用方 fiber；同类重复 id 抛 `WEB_DUPLICATE_PROVIDER`。参考目标源码 `packages/web/web/src/types.ts`、`packages/web/web/src/index.ts` 和 `packages/web/web-search-perplexity/src/index.ts`。

```ts
// Host 插件 src/index.ts：本地、无网络的搜索 provider 最小契约。
import type { Context } from '@deepseek-ai/cordis'
import type { WebSearchProvider } from '@deepseek-ai/dsh-web'
import type {} from '@deepseek-ai/dsh-web'

const provider: WebSearchProvider = {
  id: 'acme-static-search',
  available: () => true,
  async search(request, signal) {
    signal?.throwIfAborted()
    return { sources: [{ url: 'https://example.com/', title: request.query }], truncated: false }
  },
}

export const inject = ['web']
export function apply(ctx: Context): void {
  ctx.web.registerSearchProvider(provider)
}
```

插件安装后，Profile 同时挂载 `@deepseek-ai/dsh-web` 与本插件，然后执行 `ctx.web.search({ query: 'probe', maxResults: 1 })`；结果应有一条可引用 URL。卸载本插件后，若没有其他可用搜索 provider，同一调用应抛 `WEB_PROVIDER_UNAVAILABLE`。多个可用 provider 而未设置 `searchProvider` 时抛 `WEB_PROVIDER_AMBIGUOUS`；指定但未注册的 id 抛 `WEB_PROVIDER_CONFIGURED_MISSING`。选择在每次调用时发生，注册顺序不决定选择。生产网络 provider 还须独立验证取消、重定向、凭证和响应大小边界；上例只验证 registry 与生命周期，不能证明网络安全。`fetch` 的非 2xx HTTP 状态是 `WebFetchResult`，不是自动抛错。

## 交付物与文档界面

这里有两条不同路径，不能把它们写成一个自动转换流程：

1. **声明已有文件为交付物。** 在 Agent scoped Profile 挂载 `@deepseek-ai/dsh-tool-present`，它依赖 `tools`、`fs`、`sessionProjections`。Agent 完成文件写入后调用 `present`，参数是 `files: [{ path, description? }]`。目标实现对每个路径用 Session 的 `ctx.fs` 校验普通文件；只有成功的 `tools/result` 才向同一 Session 追加 `deliverables/presented`，事件保存路径而不复制字节。Client 的 `@deepseek-ai/dsh-client-ui-deliverables` 读取这项 Session 事实、显示卡片并在重连后重读；文件内容随后改变会改变用户打开时看到的内容。Host 来源是 `packages/deliverables/tool-present/src/index.ts`，显示 owner 是 `packages/client/ui-deliverables/src/client/index.ts`。
2. **扩展文件卡片动作。** `ui-deliverables` 在 `conversation.chat.turnTail` entry 的 `children` 中声明 `deliverables.file.actions`，类型是 `list`、`session`，由 `@deepseek-ai/dsh-client-ui-deliverables/client` 的声明合并公开。插件先注入 `slots`，再用 `ctx.slots.inject('deliverables.file.actions', () => ctx.slots.register({ name: 'deliverables.file.actions', id: 'my-action' }, Component))` 等待 owner；返回 disposer 属于调用方 fiber。`PropsRuntime<'deliverables.file.actions'>` 提供 `actionUrl`、`available`、`pending`、`onAction('open' | 'reveal', application?)`；后者返回 `null | 'openError' | 'revealError'`。Component 根据 `available/pending` 控制按钮，并调用 owner 的 `onAction`，不能自行从 URL 推导 Host 路径。声明及 render props 在 `packages/client/ui-deliverables/src/client/file-actions.ts` 与 `Deliverables.tsx:112-120`。

`@deepseek-ai/dsh-office-to-pdf` 是独立 Host 转换服务；公开 `OfficeToPdf.render(workspaceFileScope, path, priority, signal)` 使用 workspace-files 授权读取并返回 PDF 字节，不会自动调用 `present`、写 Session 交付事件或注册上述动作 slot。若任务还要求 Office 预览，需要另行组合转换服务、对应的 document-preview Client owner 与文件资源通道，并验证取消、转换失败、重连和卸载。这里的路径只说明“声明已有文件”和“扩展卡片动作”；Office 转换不属于这条组合路径。

## 动态 Host 与 Client 扩展

这是目标内置的**进程内定义**路径，与上面的已安装 `dsh.client` npm 包装载不同。Host Profile 挂载 `@deepseek-ai/dsh-cordis-host-runner`；需要浏览器半边时 Web 组合同时挂载 `@deepseek-ai/dsh-cordis-client-runner`，已有控制界面由 `@deepseek-ai/dsh-client-ui-cordis` 提供。Host `define` 记录 session scoped、进程内、不可变 package 版本，`run` 在有人连接的页面提出批准请求；获准后先执行 Host half，再取 Client 代码并激活浏览器 half，最后回传 run resolution。`stop` 撤销运行 effect 但保留定义，`undefine` 还删除定义。无页面连接时含 Client half 的请求会等待，页面刷新也不会恢复既有定义或自动重新运行。来源为目标 `packages/extensions/cordis-host-runner/README.md` 和 `cordis-client-runner/README.md`，实际行为还须回查 `src/registry.ts`、`src/client/orchestrator.ts`。

底层 `DynamicCordisClientHalf` 要求 `pluginId`、`packageId`、`pluginRunId`、`agentId`、`name`、`code`；其 `code` 是返回插件的纯 JavaScript async function body，不能传 JSX、TypeScript 或模块 import。`DynamicCordisPackageRunner.load(half)` 的成功结果也可能带 `waitingFor`，表示 Client fiber 等待声明的 service，未代表 UI 已渲染；失败阶段是 `evaluate | module-import | activate`。页面 `getSnapshot()`/`subscribe()` 只报告该页面当前运行集，`renderFailures` 另报 settle 后的 React 崩溃。精确 run 的 `retract(pluginId, pluginRunId)` 不会误撤新版本；卸载 runner 时 `dispose()` 等待全部 live package 清理。来源为 `packages/extensions/cordis-client-runner/src/client/runtime.ts:49-98,177-330`。受控动态定义 API 只适用于进程内路径；验证时分别执行批准、失败、重连和清理场景。

## Terminal Remote 集成

Host 组合 terminal owner、`TerminalController` 及其 `subprocess`、`sandboxPolicy`、`typert` 依赖。公开 Remote 是 `environment(agent, signal)`、`shells(agent, signal)`、`list(sessionId)`、`create(agent, request, signal)`、`retain(sessionId, id, signal)`、`follow(agent, id, attachmentId, signal)`、`write(agent, id, attachmentId, data)`、`resize(agent, id, attachmentId, cols, rows)`、`rename(agent, id, title)`、`close(agent, id)`；其中 `retain` 与 `follow` 是 stream。Client 持有生成的 `RemoteStreamHandle` 时必须迭代或显式 `dispose()`，并按 attachment 身份控制写入；`write` 和 `resize` **没有** `AbortSignal` 参数。关闭 tab 时可通过公开 `ClientTerminals.close(sessionId, key, contentId, terminalId?)` 保存清理意图；`view()` 的模型刷新和 `retainTabs()` 的窗口 hold 配合恢复。目标源码为 `packages/api/terminal-controller/src/index.ts` 与 `src/client/index.ts`。第三方 Terminal 插件还需独立构建与真实 Profile 验证；至少观察首帧、增量、取消、重连查询和卸载后 stream 终止，才能报告行为通过。

目标内置 Client 路径的顺序是：

1. 组合 Host terminal controller 与其依赖，Client 装载 `@deepseek-ai/dsh-api-terminal-controller/client` 及生成的 `remote.terminal` namespace。调用 `ctx.webTerminals.launchShells(sessionId, signal)` 先发现可用 shell，不因此分配 PTY；其结果给出 `shells` 和 `selectedShell`。
2. 给一个 Sidebar occurrence 调用 `ctx.webTerminals.view(sessionId, key, contentId, terminalId?, shellPath?)`，取得稳定的 `TerminalView`。新建身份由 Client model 保存；恢复时 `terminalId` 指向已有 Host terminal。底层 Host `create(agent, request, signal)` 以调用者生成的 request id 幂等分配，Host 已提交的终端不会因连接中断而自动关闭。
3. 窗口保持通过 `retain(sessionId, id, signal)` stream 表示；输出与可写 attachment 由 `follow(agent, id, attachmentId, signal)` stream 表示。每个 Remote stream handle 必须迭代到完成或调用 `dispose()`。`write`/`resize` 校验当前 attachment id，不能向只拿到 retain hold 的窗口发输入。`ctx.webTerminals.retainTabs(tabs)` 同步当前 Sidebar occurrence 集，撤销不再需要的 hold。
4. 用户关闭 tab 时调用 `ctx.webTerminals.close(sessionId, key, contentId, terminalId?)`。它先保存关闭意图并移除 occurrence，然后在后台请求 Host `close`；失败显示在 `closeFailures` snapshot，可重试且不恢复旧 tab。Session owner 或 terminal service 卸载时 Host 聚合等待终端、分配与清理任务；清理失败可能重试，不能只以 DOM 消失作为成功。

这些步骤取自 `packages/api/terminal-controller/src/client/index.ts:38-143`、`src/client/model.ts` 和 Host `src/index.ts:150-310`。验证需分别观察 launch 不分配、create 幂等、follow 初始屏幕与增量、stream 取消、失去连接后 list/hold 恢复、关闭失败可见及卸载无存活进程；各项须在独立 Profile 运行后分别报告。

## Workspace Remote 集成

普通 Client 页面若只需要 Workspace 列表与命令，注入 `workspaces`，通过公开 `IWorkspaces.list.getSnapshot()` 读 Host 权威快照、`list.subscribe(listener)` 监听替换并在卸载时调用返回的 unsubscribe。`create({ path })` 注册现有路径；`initializeDefault(signal?)` 可能返回 `undefined`；`rename(workspaceId, title)`、`delete(workspaceId)`、`insertBefore(workspaceId, beforeWorkspaceId?)` 改变 Workspace 登记，`delete` 不删除 Session 或磁盘文件。Session 分组还提供 `archiveSession(sessionId, { stopActivity? })`、`unarchiveSession`、`pinSession`、`unpinSession` 与 `insertSessionBefore`。归档运行中的 Session 可抛 `WorkspaceArchiveError`，其 `rpcError.code` 为 `workspace/session-active`。这些签名在 `packages/api/workspace-controller/src/client/service.ts`。

读取 Workspace 文件是另一条路径：目标 Client 的 `@deepseek-ai/dsh-api-workspace-files/client` 注入 `resources`、`remote`、`remote.workspaceFiles`，通过 `ctx.resources.register(provider)` 安装 `file` provider，卸载时先撤销注册，再等待 change feed stream 关闭；见 `packages/api/workspace-files/src/client/index.ts`。不要从 Workspace 列表拼接 Host 文件路径或绕过 provider 的访问策略。第三方 scoped file 插件还需完成构建与 Profile 装载，并分别验证分页、大小、符号链接、取消、重连与 owner 卸载。
