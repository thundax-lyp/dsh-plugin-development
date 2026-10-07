# 给 Session header 增加局部状态

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。任务是在当前 Session header 放一个可切换的按钮，显示状态由 `defineStore` 拥有。此状态只影响显示；若按钮要改变模型可见事实，另通过相应 Session/Host 服务提交事件。API 细节见 [Client store](api-client-store.md) 和 [Web Client Slots](api-client-slots.md)。

## 实现步骤

1. 以 [构建并装载 Web Client 插件](how-to-build-and-load-web-client-plugin.md)准备独立包：根入口给 Host Loader 行，`./client` 导出下面的 `apply`，`package.json` 声明 `dsh.client.platform: "web"`。在 Web Profile 启用 renderer、Session、Conversation 的 Client 半边以及本包。
2. 在 Client `apply` 内建立 handle，并将其放入 Session header slot 的 `store` seat。组件只收 `PropsRuntime`、`PropsStore`，不捕获 Cordis `ctx`。

```tsx
import type { Context } from '@deepseek-ai/cordis'
import { defineStore } from '@deepseek-ai/dsh-client-store'
import type { PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'

export const inject = ['slots']

export function apply(ctx: Context): void {
  const store = defineStore({
    init: () => ({ open: false }),
    actions: { toggle: (draft) => { draft.open = !draft.open } },
  })

  function HeaderNote({ useStore, actions, sessionId }: PropsRuntime<'conversation.session.header.actions'> & PropsStore<typeof store>) {
    const open = useStore(state => state.open)
    return <button type="button" onClick={actions.toggle} aria-expanded={open}>
      {open ? `Note open for ${sessionId}` : 'Show note'}
    </button>
  }

  ctx.slots.inject('conversation.session.header.actions', () =>
    ctx.slots.register({
      name: 'conversation.session.header.actions',
      id: 'example-stateful-note',
      order: 110,
      store,
    }, HeaderNote))
}
```

3. 用目标发布声明独立编译 Client TSX；构建 lazy-CJS Client bundle，检查其 id 与包名相同。打开 Web Profile 中一个 Session，点击按钮观察文案切换；离开该 Session、关闭 Loader 行或卸载插件后确认按钮消失。重新进入时非持久示例从 `false` 开始。
4. 若要保留纯 UI 偏好，在 `defineStore` spec 增加唯一 `persist` key，并定义何时调用实例的 `clearPersisted()`；不要把该偏好当 Session 可恢复事实。若多处注册共享同一 handle，先核对作用域和实例共享意图；独立实例使用 `store: () => defineStore(...)`。

失败边界：父 Conversation header 未声明时，`ctx.slots.inject` 等待；父声明撤销会处理已安装的 disposer。组件错误或重复占据同一 list id 由 renderer 的定义/监督路径处理。此示例已对精确发布声明编译；同 API 的精简 lazy-CJS probe 在隔离 Web Profile/Chrome 实际观察到点击更新、离开重置和在线卸载消失。该浏览器 probe 未验证示例 TSX 自动构建链或 localStorage 持久化。
