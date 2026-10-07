# Client right sidebar tab types

## 适用范围与入口

本页锁定 `dsh-v0.2.0-rc.1` 的 Web Client。`@deepseek-ai/dsh-client-ui-sidebar-right/client` 提供 `ctx.sidebarRightTabs` 的 tab type registry、`ctx.sidebarRight` 的导航面，以及 `sidebar.right.pane.tab` keyed slot。外部插件先声明 tab 的静态类型，再以该定义的 **`id`** 为 key 注册 body；这两个阶段缺一不可。完整独立包、Profile 装载、浏览器打开和卸载步骤见 [增加右侧栏标签](how-to-add-sidebar-right-tab.md)。布局引擎 `@deepseek-ai/dsh-client-ui-dockkit` 是右侧栏内部使用的公开通用 kit；给现有右侧栏增添 tab 应走这里的 registry 和 slot。

## 最小完整 Client 示例

下面提供一个 page type，不声明资源地址 `patterns`。Guide 给出入口，点击后以 `kind: 'example-notes'` 打开，keyed body 从 `useTabInfo()` 读取当前 tab。内容是静态 UI 示例；真实业务数据应由拥有它的服务提供，模型可见事实仍要写入 Session。

```tsx
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type { SidebarRightTabDefinition } from '@deepseek-ai/dsh-client-ui-sidebar-right/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar-right/client'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'

const id = 'example.sidebar.notes'
const definition: SidebarRightTabDefinition = {
  id,
  kind: 'example-notes',
  title: () => 'Example notes',
  guide: [{ id: 'open-notes', order: 100, title: () => 'Example notes', description: () => 'Open a sample sidebar page' }],
}

function NotesTab({ useTabInfo }: PropsRuntime<'sidebar.right.pane.tab'>) {
  const { tab } = useTabInfo()
  return <div>Example notes: {tab.kind}</div>
}

export const inject = ['sidebarRightTabs', 'slots']

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.sidebarRightTabs.register(definition), 'example: sidebar type')
  ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
    name: 'sidebar.right.pane.tab', key: id,
  }, NotesTab)), 'example: sidebar body')
}
```

`SidebarRightTabDefinition.id` 是实现身份和 body/title keyed slot 的 key；`kind` 是 tab 类型和 `openTab(kind)` 的参数。Guide 使用 `kind` 导航，运行中的 registry 再以当前定义的 `id` 查找 body。两者不能互换。`ctx.sidebarRightTabs.register()` 返回 disposer；调用者用自己的 `ctx.effect` 持有。`ctx.slots.inject()` 等待右侧栏父 slot 声明，再安装并在父声明撤销时移除 body；外层 effect 使它随插件卸载清理。

## 公开对象与成员

| 对象/成员                                                  | 公开契约                                                                                                                   | 插件任务中的语义                                                                                                                                                       |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SidebarRightTabDefinition`                                | `id`, `kind`, `title(address)` 必填；`multiple?`, `keepMounted?`, `patterns?`, `priority?`, `canOpen?`, `guide?` 可选      | 无 `patterns` 的 page type 用 `openTab(kind)`；资源 viewer 用 globs 参与 `openResource(address)` 路由。`title` 在打开时捕获到 tab 记录。                               |
| `SidebarRightGuideEntry`                                   | `id`, `order`, `title()` 必填；`description?`, `icon?`, `commandId?` 可选                                                  | Guide 的 entry 归 tab type 拥有；点击默认以该 type 的 `kind` 在 guide tab 原位打开。多于四项时默认 guide 不显示说明。                                                  |
| `ctx.sidebarRightTabs.register`                            | `(definition) => () => void`                                                                                               | 同一实现 `id` 重复或不允许的同 `kind` 组合抛错。外部定义默认 `priority: 'extension'`；它可临时覆盖同 kind 的一个 builtin，卸载后 builtin 恢复。调用者要持有 disposer。 |
| `entries()`, `guide()`, `get(kind)`, `subscribe(listener)` | 只读当前生效 type 与 guide 列表，订阅返回退订                                                                              | 这些是低频静态注册视图，不能替代每 tab 的状态源。                                                                                                                      |
| `candidates(address)`, `claim(address, kind?)`             | 候选排序及确定资源路由                                                                                                     | 按 priority、最长匹配 pattern、注册顺序排序；`canOpen` 可否决。显式 kind 跳过 glob，但仍检查 `canOpen`。无人认领抛错。                                                 |
| `sidebar.right.pane.tab`                                   | session 作用域 keyed slot，key 为当前 type 的 `id`                                                                         | body 通过 `useTabInfo()` 得到当前 tab、导航参数、操作和 lifetime signal。没有匹配 body 时显示不可查看提示。                                                            |
| `sidebar.right.pane.tab.title`                             | 同 key 的可选 keyed slot                                                                                                   | 不注册时 chip 显示 `title(address)` 打开时捕获的文本。                                                                                                                 |
| `SidebarRightTabInfo`                                      | `sidebar`, `panel`, `tab`，其中 tab 有 `navigation`, `visible`, `signal`, `actions`                                        | `signal` 在 tab 记录消失或右侧栏插件卸载时 abort；隐藏或切换 Session 不等于关闭该 tab。                                                                                |
| `ISidebarRight` / `ctx.sidebarRight`                       | `mounted`, `openTab`, `openResource`, `close`, `active`, `isExpanded`, `toggleExpanded`, `focus`, `split`, `float`, `dock` | 导航面作用于已挂载的 Session seat；无 seat 时直接导航会失败。组件可订阅 `mounted` 再开内容。                                                                           |

资源 viewer 的 `patterns` 若包含 `:`，会匹配完整 URI；否则匹配 URI path 的 basename 等路径。`priority` 是 `extension | builtin | fallback`，默认 extension；同 kind 只允许一个 builtin 与一个 extension 成对，fallback 不与其他共享。`multiple` 只影响按 kind 打开的 page 是否每次建独立内容；资源按地址决定内容身份。`keepMounted` 默认 false，设 true 会延迟保持已访问 body，须特别管理异步工作与隐藏状态。

## 失败、取消、清理与验证边界

tab type 的 `id` 和 keyed body key 不一致时，类型虽注册，面板仍缺 body；只注册 body 而没有 type 时，Guide 和导航都无法选择它。静态注册和每 tab 的任务分属不同生命周期：插件卸载撤销 definition/body，但已打开的 tab 记录可留在布局中，显示“没有可用的查看方式”；卸载不自动关闭用户的 tab。若 body 订阅资源、文件或网络，应以 `tab.signal` 与组件卸载清理，并处理隐藏与 Session 切换。业务结果需用 Session 日志持久化，不能只留在 dock 布局或组件 state。

独立 Client TSX 声明编译、lazy-CJS 打包和隔离 Web Profile/Chrome 已验证 Guide 入口、点击后的实际 body，以及在线卸载后 body 与入口撤销、原 tab 记录保留。本次未验证资源地址路由与优先级覆盖、跨 Session 恢复、`keepMounted`、复杂 docking 操作或 Desktop。
