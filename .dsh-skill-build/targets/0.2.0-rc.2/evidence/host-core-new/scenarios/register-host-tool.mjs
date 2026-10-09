import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { join, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'

assert.ok(process.env.DSH_TARGET_CHECKOUT, '缺少 DSH_TARGET_CHECKOUT')
const checkout = resolve(process.env.DSH_TARGET_CHECKOUT)
assert.ok(process.env.DSH_TASK_VERIFICATION_OFFLINE === '1', '必须使用离线场景环境')

// 从目标 checkout 中已构建的 dsh-tools 包解析它实际依赖的公开包。
const requireFromTools = createRequire(join(checkout, 'packages/core/tools/package.json'))
async function loadPackage(name) {
  const file = requireFromTools.resolve(name)
  assert.ok(file.startsWith(`${checkout}${sep}`), `${name} 未解析到目标 checkout`)
  return import(pathToFileURL(file).href)
}

const [{ Context }, { default: SystemPrompt }, { default: ToolRuntime, defineTool }, { ToolCallId }] = await Promise.all([
  loadPackage('@deepseek-ai/cordis'),
  loadPackage('@deepseek-ai/dsh-system-prompt'),
  loadPackage('@deepseek-ai/dsh-tools'),
  loadPackage('@deepseek-ai/dsh-llm'),
])

const checks = { 'package-resolution': true }
const ctx = new Context()
try {
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(ToolRuntime)
  let calls = 0
  const plugin = {
    name: 'scenario-greet',
    inject: ['tools'],
    apply(scope) {
      scope.tools.register(defineTool({
        name: 'scenario_greet',
        description: '返回姓名对应的问候。',
        parameters: { name: { type: 'string', required: true } },
        output: {
          schema: { type: 'string' },
          render: (_args, value) => [{ type: 'text', text: value }],
        },
        async execute(args, exec) {
          assert.equal(exec.signal.aborted, false)
          calls += 1
          return `你好，${args.name}！`
        },
      }))
    },
  }
  const fiber = await ctx.plugin(plugin)
  assert.ok(ctx.tools.schemas().some(schema => schema.name === 'scenario_greet'))
  assert.ok((await ctx.systemPrompt.assemble()).tools.some(schema => schema.name === 'scenario_greet'))
  checks['tool-registration'] = true

  const result = await ctx.tools.execute({
    signal: new AbortController().signal,
    callId: ToolCallId('scenario-call'),
    name: 'scenario_greet',
    arguments: { name: 'Ada' },
  })
  assert.equal(result.isError, false)
  assert.equal(result.value, '你好，Ada！')
  assert.deepEqual(result.content, [{ type: 'text', text: '你好，Ada！' }])
  assert.equal(calls, 1)
  checks['tool-call'] = true

  await fiber.dispose()
  assert.ok(!ctx.tools.schemas().some(schema => schema.name === 'scenario_greet'))
  assert.equal(ctx.tools.get('scenario_greet'), undefined)
  checks.unload = true
} finally {
  await ctx.fiber.dispose()
}

process.stdout.write(`${JSON.stringify({ taskId: 'register-host-tool', checks })}\n`)
