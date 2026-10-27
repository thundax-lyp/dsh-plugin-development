# 最小右侧栏页面插件

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。目标是从右侧栏引导页打开一个插件页面。这个页面没有网络请求和模型工具；只读取框架提供的 tab 信息。权威契约见 [SidebarRightTabDefinition](../api/api-client-ui-sidebar-right-tab-registry.md)、[SidebarRightTabInfo](../api/api-client-ui-sidebar-right-slots.md) 与 [SlotRegistry](../api/api-client-ui-renderer-registry.md)。

## 文件与构建

完整包基础文件使用 [Client 包构建示例](example-client-overlay.md) 的 package.json、tsconfig.json、src/index.ts、build.mjs、cordis.patch.yml。包名仍用 acme-dsh-overlay，因此 factory id、patch 的 name/id 都不需要改；若自行改名，必须同时修改这四处。额外在 devDependencies 加入 `@deepseek-ai/dsh-client-ui-sidebar-right@0.2.1-rc.3` 与 `@deepseek-ai/dsh-client-ui-slots@0.2.1-rc.3`。这些新增导入均是类型，不产生 runtime request，无需新增 dsh.client.external。

把 `src/client.tsx` 完整替换成：

```tsx
import type { Context } from '@deepseek-ai/cordis'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar-right/client'

export const inject = ['slots', 'sidebarRightTabs']
const definitionId = 'acme-dsh-overlay.report'
const kind = 'acme-report'

function ReportBody({ useTabInfo }: PropsRuntime<'sidebar.right.pane.tab'>) {
  const { tab } = useTabInfo()
  return <section aria-label="插件报告">
    <h2>插件报告</h2>
    <p>页面标题：{tab.title}</p>
    <p>当前可见：{tab.visible ? '是' : '否'}</p>
  </section>
}

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.sidebarRightTabs.register({
    id: definitionId,
    kind,
    title: () => '插件报告',
    guide: [{ id: 'report', order: 100, title: () => '插件报告',
      description: () => '打开这个插件的只读报告页面' }],
  }))
  ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
    name: 'sidebar.right.pane.tab',
    key: definitionId,
  }, ReportBody))
}
```

`definitionId` 标识注册实现，`kind` 标识页类别；正文 key 必须是 definition.id。页面型没有 patterns；资源 viewer 才为 dsh-resource:// 地址声明 patterns。这个例子不伪造资源地址，也不把自己的页面当文件查看器。

## 装载、成功与清理

执行基础示例的 npm install、npm run build、独立 DSH_HOME 初始化、plugin add 与 dsh web。选中或创建一个会话，展开右侧栏引导页，点击“插件报告”入口。观察出现报告 tab、标题和正文；同一分栏再次打开该页应复用页面，而非重复产生一份。

关闭 tab、切换会话、收起再打开面板；组件不得创建多余注册。该页没有业务资源，卸载只需要回收静态类型和 slot 注册；ctx.effect 与 ctx.slots.inject 已持有它们。若以后增加请求，使用 useTabInfo().tab.signal 管理 occurrence 的寿命，并把导航版本纳入陈旧结果检查；收起面板本身不保证 signal 中止。

停用插件后引导入口消失、该实现的正文不再被调用；已保存的布局记录与当前可用 provider 是两件事，不能将恢复的 tab 地址解释成恢复了请求连接。再次启用后只出现一个入口。刷新会恢复布局，示例页面的本地 React 状态若有则重新创建；布局不保存资源内容和 navigation.params。

## 完成判据

Client 声明编译与 factory 构建通过，真实 Web Profile 能从引导入口打开页面，tab 信息匹配当前 occurrence，关闭与停用不遗留注册，重新启用无重复。纯静态报告无需外部服务；浏览器呈现和生命周期仍须实际观察。
