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
