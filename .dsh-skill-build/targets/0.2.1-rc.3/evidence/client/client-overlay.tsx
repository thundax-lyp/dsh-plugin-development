import { useState } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import { Button, Modal } from '@deepseek-ai/dsh-client-ui-primitives'

export const inject = ['slots']

function StatusOverlay() {
  const [open, setOpen] = useState(false)
  return <>
    <div style={{ position: 'fixed', right: 24, bottom: 24, pointerEvents: 'auto' }}>
      <Button variant="outline" onClick={() => setOpen(true)}>插件状态</Button>
    </div>
    <Modal open={open} onClose={() => setOpen(false)} title="插件状态" closeLabel="关闭">
      <p>浏览器插件已挂载。</p>
      <Button data-modal-autofocus onClick={() => setOpen(false)}>完成</Button>
    </Modal>
  </>
}

export function apply(ctx: Context): void {
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'acme-dsh-overlay.status',
    order: 100,
  }, StatusOverlay))
}
