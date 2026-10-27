import type { Context } from '@deepseek-ai/cordis'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { ResourceProvider } from '@deepseek-ai/dsh-client-resources/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface ResourceProtocolMap { acmestatus: string }
}

export const inject = ['resources', 'slots']
const provider: ResourceProvider<'acmestatus'> = {
  protocol: 'acmestatus',
  async *open(_address, { signal }) {
    if (signal.aborted) return
    yield { ok: true, value: '本地资源已加载' }
  },
}

function ResourceStatus({ useResource }: PropsRuntime<'shell.overlay'>) {
  const resource = useResource<'acmestatus'>('dsh-resource://acmestatus/status')
  return <p role="status" style={{ position: 'fixed', right: 24, bottom: 24 }}>
    {resource.status === 'live' ? resource.value : '资源尚未就绪'}
  </p>
}

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.resources.register(provider))
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay', id: 'acme-dsh-overlay.resource',
  }, ResourceStatus))
}
