# 测试 Client Remote 调用

## 目标

在 `dsh-v0.2.0-rc.1` 用发布的 `@deepseek-ai/dsh-remote-mock` 测试一个 Client 逻辑函数如何处理 Remote 成功与失败，以及实际发送的端点和参数。此例在 Node 独立运行；完整浏览器插件装载仍按 Client Profile 测试执行。API 与各支持包适用范围见[测试支持包](api-testing-support.md)。

## 安装与代码

新建 ESM 测试包，安装精确版本 `@deepseek-ai/dsh-client-connection@0.2.0-rc.1`，开发依赖安装 `@deepseek-ai/dsh-remote-mock@0.2.0-rc.1`、`@deepseek-ai/dsh-typert-protocol@0.2.0-rc.1`、`typescript`、`@types/node`。`dsh-client-connection/client` 在此例只用于类型导入。

```ts
import assert from 'node:assert/strict'
import type { ClientConnectionRpc } from '@deepseek-ai/dsh-client-connection/client'
import { RemoteMock, ok } from '@deepseek-ai/dsh-remote-mock'

async function lookup(rpc: ClientConnectionRpc, id: string): Promise<string> {
  const result = await rpc.call('/api', 'notes/lookup', { args: [{ id }] })
  if (!result.ok) throw new Error(result.error.message)
  return (result.value as { title: string }).title
}

const mock = RemoteMock.create().unary('notes/lookup', (request: { id: string }) =>
  request.id === 'missing'
    ? { ok: false, error: { code: 'missing', message: 'No note', details: {} } }
    : ok({ title: `title:${request.id}` }))

try {
  assert.equal(await lookup(mock.rpc, 'n1'), 'title:n1')
  assert.deepEqual(mock.log.requests('notes/lookup'), [{ id: 'n1' }])
  await assert.rejects(lookup(mock.rpc, 'missing'), /No note/)
} finally {
  mock.assertNoUnmatched()
}
```

以 `module`/`moduleResolution: NodeNext`、`target: ES2022`、`strict: true` 编译成 `lib/`，运行 `node lib/smoke.js`。真实插件可把 `lookup` 换成接收 `ctx.connection.rpc` 的业务逻辑；在 Client 测试运行时将 `mock.rpc` 注入 Connection 的 `transport.rpc`，并由测试拥有/清理 Client Context。若要验证流，先以 `stream(endpoint, frames(...))` 或 `openStream(...)` 声明，再观察 `mock.streams.opened/drained`，最后结束或取消；不要把未消费的流留到 teardown。

## 结果与限制

成功断言检查响应 envelope 解码后的业务值和已记录的请求；失败断言检查业务错误；`assertNoUnmatched` 保证没有悄悄遗漏的端点。例中 `result.value` 的断言只是测试函数自己的结构约束，生产 Remote 方法类型仍须由该版本生成的 Typert 声明与 Client 编译验证。此例不执行 Host、HTTP/WebSocket、权限、真实浏览器或完整 Profile 装载。
