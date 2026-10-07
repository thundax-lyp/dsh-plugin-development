# 用脚本化 Messages 服务测试 LLM 适配器故障

## 适用任务

`@deepseek-ai/dsh-llm-mock-server@0.2.0-rc.1` 在本机启动真实 HTTP/SSE Messages 端点，按接收请求顺序消耗 `sequence` 中的行为。插件作者可把自有 Messages 适配器指向其 `baseURL`，测试 HTTP 错误、断流、空语义输出、取消及重试计数。此支持包不拥有适配器重试策略；测试须明确断言适配器输出和 `server.requests`。能力边界见[测试支持包](api-testing-support.md)。

## 最小隔离例子

安装 `@deepseek-ai/dsh-llm-mock-server@0.2.0-rc.1`，在 Node 20+ ESM 测试进程中运行：

```ts
import assert from 'node:assert/strict'
import { startMockLlmServer } from '@deepseek-ai/dsh-llm-mock-server'

const server = await startMockLlmServer({
  sequence: ['rate_limit', 'success'],
  apiKey: 'test-key', successText: 'recovered',
})
try {
  async function request(): Promise<Response> {
    return fetch(`${server.baseURL}/v1/messages`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': 'test-key' },
      body: JSON.stringify({ model: 'mock', messages: [], stream: true }),
    })
  }
  const first = await request()
  assert.equal(first.status, 429)
  await first.text()
  const second = await request()
  assert.equal(second.status, 200)
  const frames = (await second.text()).split('\n')
    .filter(line => line.startsWith('data: '))
    .map(line => JSON.parse(line.slice(6)) as { type: string; delta?: { text?: string } })
  assert.equal(frames.filter(f => f.type === 'content_block_delta')
    .map(f => f.delta?.text ?? '').join(''), 'recovered')
  assert.deepEqual(server.requests.map(r => r.behavior), ['rate_limit', 'success'])
} finally { await server.close() }
```

真实适配器测试把 `request()` 替换为待测 `ctx.llm.stream` 或该适配器的公开调用，并将 provider endpoint 指向 `server.baseURL`。比较规范 `StreamChunk`、`LlmError`/finish 原因、请求数、认证头、取消和关闭；不要因 mock 服务给出第二次成功就默认适配器有重试。`sequence` 用尽会明确失败，`repeatLast` 才重复最后行为。每例独立启动、`finally` 关闭，使用端口 `0` 取得 OS 分配的回环端口；本例没有真实适配器，仅独立验证 mock 服务的 HTTP/SSE 合同和请求记录。
