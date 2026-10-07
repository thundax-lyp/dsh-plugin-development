# 在 jsdom 测试 Client Slot 插件

## 适用任务

用 `@deepseek-ai/dsh-client-test-runtime@0.2.0-rc.1` 的 `SlotTestRuntime`，在 Vitest/jsdom 中检查 Client 插件注册、渲染和卸载。此层使用真实 SlotRegistry 与 renderer，并由测试持有 Session/Workspace/Remote 替身。它不能代替 Web Profile 在真实浏览器中的装载测试；支持包边界见[测试支持包](api-testing-support.md)。

## 测试装配

测试项目须安装 `@deepseek-ai/dsh-client-test-runtime`、`@deepseek-ai/dsh-client-ui-slots`、`@deepseek-ai/cordis`、`react`、`vitest`、`jsdom`，并满足 runtime 包 manifest 中的 Client peer dependencies。使用 `// @vitest-environment jsdom`。以下完整骨架来自目标版本 Slot runtime 的注册/卸载测试模式，`apply` 可替换为待测插件的真实 Client 入口：

```tsx
// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { SlotTestRuntime } from '@deepseek-ai/dsh-client-test-runtime'
import type { Context } from '@deepseek-ai/cordis'
import type { PropsRenderSlots } from '@deepseek-ai/dsh-client-ui-slots'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    'demo.panel': { kind: 'single'; scope: 'root'; owner: { label: string } }
  }
}

function Frame({ renderSlot }: PropsRenderSlots<'demo.panel'>) {
  return renderSlot('demo.panel', { label: 'owner' }, { fallback: <i>empty</i> })
}

function apply(ctx: Context) {
  ctx.slots.register({ name: 'demo.panel' }, ({ label }: { label: string }) => <b>{label}</b>)
}

describe('demo panel', () => {
  it('registers, renders, and unloads', async () => {
    const runtime = await SlotTestRuntime.create()
    try {
      await runtime.root.declare({ 'demo.panel': { kind: 'single', scope: 'root' } }, Frame)
      const feature = await runtime.mount({ inject: ['slots'], apply })
      const view = runtime.renderRoot()
      expect(view.container.textContent).toContain('owner')
      await feature.dispose()
      await runtime.flush()
      expect(view.container.textContent).toContain('empty')
    } finally { await runtime.dispose() }
  })
})
```

被测插件若注入其他服务，先由 `runtime.ctx.provide` 或对应 runtime fixture 提供；`runtime.mount` 会在缺失时明确拒绝，不会默默悬挂。每个测试创建独立 runtime，并在 `finally` 中 `dispose`；需要测试 Session scope、workspace hook 或 Remote 时使用其专门的 `sessions`、`workspaces`、`remote` 句柄。

此例的独立 npm 包 TypeScript 编译通过，但 Vitest 在收集前失败：发布的 `dsh-client-test-runtime/lib/index.js` 导入未随发布包携带的 `dsh-client-ui-renderer/src/client/bind.ts`。因此此路径在目标 checkout 的源码 workspace 测试中有实际用例，当前发布 tarball 的独立测试不能宣称可运行；若在消费项目使用，需先由上游修复该包的构建/发布入口并重跑 jsdom 与真实浏览器验证。
