# 注册 Host Inspect Provider

相关公开契约：[API 参考](api-cordis-inspect-provider.md)。

## 任务与依赖

目标 `dsh-v0.2.0-rc.1`。安装 `@deepseek-ai/cordis@4.0.4` 与 `@deepseek-ai/dsh-cordis-host-runner@0.2.0-rc.1`。Host Profile 应先提供 `cordisInspect` service；动态 runner 会创建该 registry。以下插件只返回非敏感常量，不访问 Session；实际领域查询应使用 `context.agent` 执行权限检查，并把取消传给任何异步读取。

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-cordis-host-runner'

export const inject = ['cordisInspect']

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.cordisInspect.register({
    manifest: {
      id: 'example-status',
      description: 'Read a public example status',
      methods: [{
        name: 'get', description: 'Return the current status',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        outputSchema: { type: 'object', properties: { ok: { type: 'boolean' } }, required: ['ok'], additionalProperties: false },
      }],
    },
    async query(method, _input, { signal }) {
      signal.throwIfAborted()
      if (method !== 'get') throw new Error('Unknown inspect method')
      return { ok: true }
    },
  }))
}
```

`ctx.effect` 使注册与插件 fiber 同寿命；重复 id、无效 schema 或空描述会在注册时拒绝，失败时 Cordis 不会保留半注册状态。输出也会在 Registry 查询边界按 schema 验证。只有产品 Profile 同时装载 `@deepseek-ai/dsh-tool-cordis`、关联 Agent/Session 服务，并允许该 Agent 访问 inspect 工具时，模型才能发现和调用此方法。

## 验证

从精确发布声明编译；在隔离 Context 中装载 registry 和插件，检查 `list()` 能看到方法、重复 id 抛错、卸载后消失。完整 Profile 另测真实 Agent 查询、权限不足、取消、输出 schema 失败和规范工具结果；仅注册测试不证明模型消费。
