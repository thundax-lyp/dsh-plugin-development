# Client 全局主面板与侧栏入口

## 适用范围与入口

本页锁定 `dsh-v0.2.0-rc.1` 的 Web Client。插件要增加独立全局页面，应向 `main` keyed slot 注册页面，并向 `sidebar.panellist` list slot 注册同 ID 的图标入口。`main` 由 `@deepseek-ai/dsh-client-ui-layout/client` 声明；侧栏内部的 `sidebar.panellist` 由 `@deepseek-ai/dsh-client-ui-sidebar/client` 声明。完整建包、Profile 装载与浏览器验证见 [增加全局主面板](how-to-add-main-panel.md)。

`@deepseek-ai/dsh-client-ui-dockkit` 公开的是独立 split/tab 布局引擎及 React 组件，不提供 Cordis slot 或插件注册入口；要扩展现有 DSH 主列，使用上述两个 slot。`@deepseek-ai/dsh-client-ui-primitives` 提供可选图标组件，不承担注册或导航。

## 最小完整 Client 示例

```tsx
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type { MainPanelId } from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'

const PANEL_ID = 'example.panel' as MainPanelId

function ExamplePanel() {
  return <div>Example main panel</div>
}

function ExampleIcon({ size, active }: PropsRuntime<'sidebar.panellist'>) {
  return <span style={{ fontSize: size / 2 }} aria-hidden="true">{active ? '◆' : '◇'}</span>
}

export const inject = ['slots', 'layout']

export function apply(ctx: Context): void {
  ctx.slots.inject('main', () => ctx.slots.register({
    name: 'main', key: PANEL_ID,
  }, ExamplePanel))
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
    name: 'sidebar.panellist', id: PANEL_ID, order: 50, label: 'Example panel',
  }, ExampleIcon))
}
```

`ctx.slots.inject` 等待父 slot 声明，随父 slot 或插件 fiber 撤销注册。两个注册都属于本插件。页面示例没有异步资源；如果页面订阅、请求或开启任务，应在页面卸载时取消，并在拥有该任务的 effect 中释放 disposer。模型可见的业务结果应记录到 Session，而非只存在页面 state 中。

## 公开对象与成员

| 对象/成员                    | 公开契约                                                          | 插件任务中的语义                                                                            |
| ---------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `MainPanelId`                | `@deepseek-ai/dsh-client-ui-layout/client` 导出的品牌 ID          | 页面 `main.key` 与侧栏 `sidebar.panellist.id` 应相同；`conversation` 是预留的会话面板 key。 |
| `main`                       | `keyed`、`root` scope；除 `conversation` 外不附加 Session binding | 中央页面的组件由 AppFrame 按所选 key 渲染。全局页面要自行取得所需业务服务和状态。           |
| `sidebar.panellist`          | `list`、`root` scope；注册项使用 `id`、`order`、`label`           | 侧栏按 order 排序，拥有按钮、可访问名称与点击导航；组件只绘制图标。                         |
| `SidebarPanelIconOwnerProps` | `size: number`、`active: boolean`                                 | 通过 `PropsRuntime<'sidebar.panellist'>` 取得，供图标尺寸与当前选择态使用。                 |
| `ctx.layout.selectPanel`     | `(panelId: MainPanelId \| null) => void`                          | 程序化切换；非 null key 未注册时抛错。侧栏按钮已调用此方法，图标无需再调用。                |
| `ctx.layout.panelInfo`       | `getSnapshot()`、`subscribe()`；snapshot 有 `activePanelId`       | 需要订阅当前主面板的插件可使用；全局标准 props 还提供 `usePanelInfo` selector hook。        |

## 失败、卸载与验证边界

只注册侧栏图标而不注册同 key 的 `main`，点击会因未注册页面而失败；只注册页面则没有侧栏入口，可由持有 `ctx.layout` 的其他插件调用 `selectPanel`。不要向 `sidebar` single slot 注册新页面；那会替换整个导航列。`sidebar.panellist` 的图标不应包装自己的选择按钮，因为外层按钮已负责导航。

在线卸载时，布局服务从 `main` 实际注册项重算有效面板：被移除的当前面板回到 `null`，会话页面重新出现。隔离消费 TSX 编译、包构建/pack、Web Profile + Chrome 的入口、点击、主面板渲染和卸载清理已实际验证。未验证 Desktop、跨 Profile/重启持久化、复杂业务页面或模型会话调用。
