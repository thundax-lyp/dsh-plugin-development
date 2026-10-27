# 发布本地资源并由控件订阅

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。这个最小包展示 `dsh-resource://` 协议注册与标准 hook，不访问文件、网络或模型。资源只是浏览器插件状态，不能当作 Session 中已持久记录的业务结论。完整 [ResourceProvider、Resources 与 UseResource](../api/api-client-resources-contract.md) 契约集中在 API 页。

## 文件与构建

使用 [独立 Client 包](example-client-overlay.md) 的 package.json、tsconfig.json、src/index.ts、build.mjs 和 cordis.patch.yml，包名与 factory id 保持不变。在 devDependencies 增加 `@deepseek-ai/dsh-client-resources@0.2.1-rc.3`、`@deepseek-ai/dsh-client-ui-slots@0.2.1-rc.3`；资源类型均为 import type，不新增 runtime external。将 src/client.tsx 替换为：

```tsx
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
```

协议名称使用全小写，类型键、provider.protocol 与地址的协议部分一致；业务 scope 需要时编码在 URI path，不能依赖浏览器的全局当前 Session。

## 装载与验证

按基础包执行构建与 Web Profile 安装；需要 resources provider 已在 Web roster 中。页面显示“本地资源已加载”，停用后 slot 与 provider 退出，再启用只出现一份。示例 generator 完成后保留最新 snapshot，直到最后一个订阅者或 pin 释放，才清除状态；没有后台任务需要等待。

扩展成持续更新流时，open 的第一个 frame 表示当前完整内容，此后每个 ok frame 替换 value。失败应 yield RemoteResult failure frame，而不是 throw；failure 保留最后成功 value，并设置 failed。signal 中止后流必须结束，在 finally 释放自己的订阅/句柄。取消最后 holder 与移除 provider 都需要验证不再产生更新；组件重渲染不应开出第二个同址资源。
