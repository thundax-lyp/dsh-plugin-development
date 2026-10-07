# 为插件增加 Client UI、Remote 与实时设置

本路径组合 [Client/Web guardrail](api-client-web.md) 与 [任务所需公开对象](api-client-web-surface.md)；对象签名由后者锁定，本文只拥有跨 Host、Remote、Client 与 Profile 的顺序。

## 结果与组成

目标是让一个 Host 插件保存状态，通过 typed Remote 供浏览器读取，并在 `conversation.session.header.actions` 增加一个按钮；按钮状态可通过插件 Config 在线修改。这个任务组合 Host package、生成 Remote、Client package、slot registration 和 Web Profile 装载。

目标版本没有发布独立第三方 Client bundle builder。下列代码是目标 tag 的完整源契约；消费项目还必须提供能产生 DSH lazy-CJS `lib/client.js` 的兼容构建步骤。若没有该构建器，只能完成 Host/Client 声明编译，不能声称浏览器已装载。

文件：

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
  label(_agent: Agent, signal: AbortSignal): string {
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

`Agent` 是 lookup 参数，不由 Client 发送实体；Gateway 从 wire identity 解析。`AbortSignal` 在最后。更改该签名或 error code 后运行目标仓库 Typert 生成/build，得到 `./typert` Host 描述和 `./remote` Client contribution，再把 contribution 加入应用 Remote assembly。Client 源码必须导入生成包的 `./remote` 类型增强；示例为保持独立编译而展开的 `declare module` 只能由生成器产出，不能手写进真实包。目标 `api-remotes` 是显式 assembly，不会自动发现此 namespace。

## Client 入口与 slot

```tsx
// src/client/index.tsx
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
import { useEffect, useState } from 'react'

// The real Client entry imports this augmentation from the generator-owned
// `@acme/dsh-review/remote` export. It is expanded here only so this standalone
// source contract remains independently compilable.
declare module '@deepseek-ai/dsh-typert-protocol' {
  interface TypertRemoteNamespace$726576696577 {
    label: (signal?: AbortSignal) => Promise<RemoteResult<string>>
  }

  interface TypertRemoteNamespaceMap {
    review: TypertRemoteNamespace$726576696577
  }
}

type Props = PropsRuntime<'conversation.session.header.actions'> & {
  loadLabel: () => Promise<string>
}

function ReviewAction({ loadLabel }: Props) {
  const [label, setLabel] = useState('Review')
  const [failure, setFailure] = useState<string>()

  useEffect(() => {
    const abort = new AbortController()
    void loadLabel().then(setLabel, (error: unknown) => {
      if (!abort.signal.aborted) setFailure(error instanceof Error ? error.message : String(error))
    })
    return () => { abort.abort() }
  }, [loadLabel])

  return <button type="button" disabled={failure !== undefined}>{failure ?? label}</button>
}

export const inject = ['slots', 'remote', 'remote.review']

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.slots.inject('conversation.session.header.actions', () =>
    ctx.slots.register({
      name: 'conversation.session.header.actions',
      id: 'review',
      order: 100,
      inject: () => ({
        loadLabel: async () => {
          const result = await ctx.remote.review.label()
          if (!result.ok) throw result.error
          return result.value
        },
      }),
    }, ReviewAction)), 'review client slot')
}
```

这里用 `slots.inject` 等待 slot owner，而不是用 feature service 猜激活顺序。Component 不接收 `ctx`；Remote 调用在 registration inject closure 内投影为普通 callback。此例没有需要跨 entry 或跨 remount 保留的可变视图状态，因此不声明 store。若状态需要共享，使用 `defineStore` handle 并通过 registration 的 `store` 提供，Component 只用 `useStore` 和 `actions`。

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
  "files": ["lib/index.js", "lib/client.js", "lib/typert.host.js", "lib/typert.remote-client.js", "lib/types/**/*.d.ts"],
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

仅需要 schema 自动表单时，不必自己写页面：让 Host entry 暴露 `Config`，保持 settings/config-editor 组合，并为插件实例使用唯一 row id。需要自定义 Client 页面时，注入 `configForms`，通过 `get<ConfigValue>('review')` 读取；保存 staged draft 时调用：

```ts
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'

export async function saveLabel(form: ConfigForm<{ label: string }>, draftLabel: string): Promise<boolean> {
  const snapshot = form.getSnapshot()
  return form.mutate(
    [{ op: 'set', path: ['label'], value: draftLabel }],
    snapshot.revision,
  )
}
```

`accepted === false` 表示拒绝、冲突或不可写，随后读取恢复后的 snapshot；transport fault 会 reject。清除 override 调用 `unset('label')`，不要写死默认值。非 loopback Web 不提供 Host 持久化。

## 验证与卸载

1. 运行 Remote generator/build，确认 `./typert` 与 `./remote` 对同一 namespace 和签名。
2. 分别编译 Host 与 Client；Client 测试使用真实 `RemoteError` double，按 `result.ok`/`code` 断言。
3. 用 Client module verifier 检查 factory、externals、supplier graph 和同步 cycle。
4. 在隔离 Profile 安装包并挂载 bare root row；确认 Host fiber、Remote namespace、Client fiber 和 slot entry 都激活。
5. 浏览器中确认按钮出现；空 label 显示结构化失败；更新 Config 后下一次读取采用新值。
6. 禁用/删除 row，确认 slot contribution 消失、Remote namespace 不能再调用、事件和订阅不残留；重新启用后由 Host Config/Remote snapshot 恢复，而不是依赖旧 React state。

本次创建只完成了独立 Host/Client 声明编译与生成 Remote fixture 编译；未执行真实 Web Profile、浏览器、重连或 Remote round trip，因此这些运行面保持 Not Covered。

## Web provider

把 `WebRuntime` 与一个 `WebFetchProvider` 或 `WebSearchProvider` 组合进 Host Profile；provider 独占其名字并返回 disposer，凭证只经目标版本 credential seam 解析。调用 owner 的受限 fetch/search 方法，分别验证正常结果、超时/取消、非成功状态、响应大小上限和 redirect 后凭证不外泄。卸载 provider 后同名调用必须明确失败，不能继续使用旧实例。Web provider 是 Host 能力；只有结果需要显示时才另加 Client slot。

## Deliverable 与文档界面

Host 先通过目标 deliverable/office service 生成并持久化规范元数据，Client 再从公开 Remote 或 Session projection 读取该事实并注册 document-preview owner 声明的 slot。转换失败必须保留原 deliverable 和可诊断状态；重连后从持久来源重读，不能把 React state 当作权威。验证至少覆盖成功预览、转换拒绝、页面重连和 slot 卸载。

## 动态 Host 与 Client 扩展

动态扩展只接受已经过目标授权边界审查的不可变 Host/Client half。先定义精确 package、export 与授权记录，再通过 `cordis-host-runner` 和 `cordis-client-runner` 激活同一次 run；Client 产物仍必须符合 lazy-CJS module contract。记录 import、激活和 render failure，停止时撤销两侧 run 并等待 fiber 清理。动态 runner 不把任意本地源码自动提升为可信插件。

## Terminal Remote

Host 组合 terminal owner 和 controller，Client 导入生成的 Remote 类型并注入对应 namespace。每个 stream 由调用者消费或显式 dispose；把 AbortSignal 传到 open/read/write/resize 的目标版本签名，并限制输出与保留窗口。验证首帧、增量输出、取消、重连后的重新查询和卸载后 stream 终止。

## Workspace Remote

Host 组合 workspace owner、文件访问策略和 controller；Client 只调用公开的 scoped workspace/file API，不拼接 Host 路径或绕过策略。对分页、内容大小、符号链接和取消设置显式边界，重连后重取 snapshot/cursor。验证允许与拒绝路径、失效 cursor、取消，以及 owner 卸载后 namespace 不再可调用。
