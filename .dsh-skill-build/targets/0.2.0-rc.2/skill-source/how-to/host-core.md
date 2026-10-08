# Host/Core 端到端任务

这些任务路径结合了 [Host/Core API 约束](api-host-core.md)和[所选公开接口](api-host-core-surface.md)中的契约，均锁定到 `dsh-v0.2.0-rc.2`。

## register-host-tool

在精确版本的 DSH checkout 中开发本地 Host Tool 时，按以下顺序操作。本路径基于目标 tag 的首个插件和首个 Tool 教程，并调整本地目录以便解析包。单独分发的包还需要按[基础设施操作指南](how-to-infra-runtime.md)准备包清单、构建产物与 Profile 安装路径；checkout 中的 TypeScript 文件并不是已发布包。

1. 从目标 checkout 根目录执行一次 `pnpm install --frozen-lockfile` 和 `pnpm run build`，运行 `mkdir -p apps/cli/scratch-plugin/src`，再创建 `apps/cli/scratch-plugin/src/my-plugin.ts`。该位置可通过 `apps/cli` 声明的 workspace 依赖解析公开的 `@deepseek-ai/dsh-tools` 导入；此 checkout 的根目录 `scratch-plugin/` 没有相应的已安装依赖链接。Web Profile 必须挂载 `system-prompt` 和 `tools`；此插件声明 `inject = ['tools']`，因此缺少注册表时，其配置行保持 PENDING。
2. 使用下面完整的 Host 文件。`execute` 返回唯一的规范字符串，纯渲染器生成面向模型的内容，可选等待让取消行为可观察。名称与等待时长的手动检查覆盖参数 DSL 之外的约束。API 语义以 [Tool 契约](api-host-core.md#tool-runtime-与定义)为准。

```ts
import { setTimeout as sleep } from 'node:timers/promises'
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'greet-tool'
export const inject = ['tools']

export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    name: 'greet',
    description: 'Greet someone by name.',
    parameters: {
      name: { type: 'string', required: true, description: 'Name to greet' },
      waitMs: { type: 'number', description: 'Optional wait before greeting, up to 10000 ms' },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args, exec) {
      if (!args.name.trim()) throw new Error('name must not be blank')
      const waitMs = args.waitMs ?? 0
      if (!Number.isInteger(waitMs) || waitMs < 0 || waitMs > 10000) {
        throw new Error('waitMs must be an integer from 0 to 10000')
      }
      await sleep(waitMs, undefined, { signal: exec.signal })
      return `Hello, ${args.name}!`
    },
  }))
}
```

3. 从 checkout 根目录创建 overlay。这里必须使用绝对路径：patch 不会改变 Loader 的模块解析目录。

```sh
cat > apps/cli/scratch-plugin/cordis.yml <<EOF
- insert:
    - id: greet-tool
      name: '$(pwd)/apps/cli/scratch-plugin/src/my-plugin.ts'
EOF
pnpm dsh web --patch ./apps/cli/scratch-plugin/cordis.yml
```

4. 在界面显示的本地地址打开 Web UI，请已配置的 Agent 以 `name: "Ada"`、`waitMs: 0` 调用 `greet`。预期 Tool 结果为 `Hello, Ada!`，Session 中出现配对的 `tool/call` 和 `tool/result` 事件。若 Tool 未出现，先检查插件 fiber：PENDING 表示缺少必需服务；在排查模型提示词前，确认 Profile 挂载了 `tools`、overlay 路径可解析，并且 `ctx.tools.schemas()` 中出现该 Tool schema。
5. 将下面的代码保存为 `apps/cli/scratch-plugin/verify.mjs`，从 checkout 根目录运行 `node --import tsx apps/cli/scratch-plugin/verify.mjs`。它不依赖 LLM 即可运行同一插件，因此能确定性地断言失败、取消与 fiber 卸载。它不能替代第 4 步的真实 Profile 和 Agent 调用。

```js
import assert from 'node:assert/strict'
import { Context } from '@deepseek-ai/cordis'
import { ToolCallId } from '@deepseek-ai/dsh-llm'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import ToolRuntime from '@deepseek-ai/dsh-tools'
import * as plugin from './src/my-plugin.ts'

const ctx = new Context()
try {
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(ToolRuntime)
  const fiber = await ctx.plugin({ name: plugin.name, inject: plugin.inject, apply: plugin.apply })
  assert(ctx.tools.schemas().some((schema) => schema.name === 'greet'))
  const run = (id, args, signal = new AbortController().signal) =>
    ctx.tools.execute({ signal, callId: ToolCallId(id), name: 'greet', arguments: args })
  const success = await run('success', { name: 'Ada', waitMs: 0 })
  assert.equal(success.isError, false)
  assert.equal(success.value, 'Hello, Ada!')
  const failure = await run('failure', { name: '', waitMs: 0 })
  assert.equal(failure.isError, true)
  const controller = new AbortController()
  const pending = run('abort', { name: 'Ada', waitMs: 10000 }, controller.signal)
  setTimeout(() => controller.abort(), 20)
  assert.equal((await pending).isError, true)
  await fiber.dispose()
  assert.equal(ctx.tools.get('greet'), undefined)
  assert.equal((await run('unloaded', { name: 'Ada' })).isError, true)
  console.log('Tool success, failure, cancellation, and unload verified')
} finally {
  await ctx.fiber.dispose()
}
```

若真实 Profile 中没有该 Tool，先检查配置行及其必需的 `tools` 服务。通过 HMR 禁用 overlay 配置行时，还需确认运行中的 Profile 移除了相应 schema；此实时 HMR 检查与上述进程内卸载测试相互独立。

完成条件是：Host 文件可针对目标 tag 编译，Profile 激活对应配置行，真实 Agent 调用产生声明的结果，失败与取消路径均正常结束，卸载后 schema 消失。仅构建成功或列出 schema 不能证明整条路径可运行。

## provide-and-consume-cordis-service

当一个 Host 插件拥有某项能力，而另一个插件需要通过 `ctx` 使用它时，应使用 Cordis service。服务名须与 DSH 内置 service key 不同。所有权和生命周期契约见 [Cordis 公开服务接口](api-infra-runtime-surface.md#cordis-生命周期公开-api)。对于这个 checkout 内的示例，把两个文件放在 `apps/cli/scratch-plugin/src/`，以便通过 CLI workspace 依赖解析公开的 Cordis 导入。单独分发的包遵循[包与 Profile 路径](how-to-infra-runtime.md#打包并启用-bundle)。

1. 在 `greeter.ts` 中声明 `Context` 属性并挂载 `Service` 子类。`super(ctx, 'exampleGreeter')` 在 provider fiber 的整个生命周期内提供实例；声明合并仅构成该契约的 TypeScript 部分。

```ts
import { Service, type Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Context { exampleGreeter: GreeterService }
}

export class GreeterService extends Service {
  constructor(ctx: Context) { super(ctx, 'exampleGreeter') }
  greet(name: string): string { return `Hello, ${name}!` }
}

export const name = 'example-greeter-provider'
export function apply(ctx: Context) { ctx.plugin(GreeterService) }
```

2. 在 `consumer.js` 中先声明服务依赖，再读取服务。TypeScript consumer 可以通过仅类型副作用导入 `./greeter.js` 获得 provider 对 `Context` 的扩展。provider 与 consumer 应是两个独立的 Loader 配置行：`inject` 控制激活，因此配置行顺序不是依赖机制。

```js
export const name = 'example-greeter-consumer'
export const inject = ['exampleGreeter']
export function apply(ctx) {
  if (ctx.exampleGreeter.greet('Ada') !== 'Hello, Ada!') throw new Error('service mismatch')
}
```

3. 从 checkout 根目录启动同时包含这两行的隔离 Web Profile。patch 使用绝对路径，因为 Loader 从 Profile 所在位置解析模块，而不是从 patch 文件所在位置解析。对于已发布包，应改用 [Bundle 指南](how-to-infra-runtime.md#打包并启用-bundle)。

```sh
mkdir -p apps/cli/scratch-plugin/src
cat > apps/cli/scratch-plugin/service.patch.yml <<EOF
- insert:
    - id: example-greeter-provider
      name: '$(pwd)/apps/cli/scratch-plugin/src/greeter.ts'
      config: {}
    - id: example-greeter-consumer
      name: '$(pwd)/apps/cli/scratch-plugin/src/consumer.js'
      config: {}
EOF
pnpm dsh web --patch ./apps/cli/scratch-plugin/service.patch.yml
```

4. 针对目标 tag 编译 provider。在 Profile 中确认两个 fiber 均变为 `ACTIVE`，且 consumer 断言通过；停止 Profile，从 patch 中移除 provider 配置行并重启，确认 consumer 变为 `PENDING`。恢复 provider 并再次重启，确认 consumer 重新激活。若要在运行期间检查依赖卸载，可通过 HMR 移除或替换 provider，并观察 consumer 的 effect 是否撤销。若 provider 拥有定时器、socket 或 watcher，应返回一个会被等待的 `ctx.effect()` 清理函数，并在宣布卸载完成前确认这些资源均已关闭。来源：锁定 checkout 中的 `docs/cordis-tutorial/03-services.md` 与 `vendor/cordis/src/service.ts`。

## extend-system-prompt

挂载 `@deepseek-ai/dsh-system-prompt`，注入 `systemPrompt`，并在正确的 Cordis scope 中注册名称唯一的 `section`、`context`、`variable` 或 `tools` provider。仓库自有的插入位置使用 `getSectionOrder`/`getContextOrder`；第三方插件应选择稳定、有限的顺序值及名称。若注册的生命周期短于插件 scope，须保留清理函数。分别在全局和目标 Agent scope 中组装一次；验证覆盖规则、确定性顺序、变量缺失时的失败及卸载清理。隐藏 runtime context 只影响披露，不影响执行约束。

## add-llm-adapter

挂载 `@deepseek-ai/dsh-llm`，注入 `llm`，并在插件 apply 期间调用 `ctx.llm.registerAdapter(providerRoutes, adapter)`。返回的 handle 是归属于 effect 的清理函数，并提供 `replace(nextRoutes)`，用于以同一 adapter 实例原子替换路由。`LlmAdapter.stream(options)` 是唯一的抽象方法：继承的 `resolveModel` 和 `prepareCall` 适用于静态路由。若需要按目录选择模型，覆写 `listModels`；若设置可能在模型解析和请求分发之间变化，覆写 `prepareCall`。只有插件还拥有设置或目录项时，才额外注册 `registerConfigurableProviders` 和 `registerModelDiscovery`；它们是独立注册项。参见 [LLM 契约](api-host-core.md#llm-provider-与-adapter)与[公开签名](api-host-core-surface.md#hostcore-任务-api)。

下面完整的**本地脚本式** adapter 可在无凭证的情况下检查 Host 扩展路径。它是测试夹具，不是 HTTP provider：实际接入时应改为真实请求，转发 `options.signal`，在每个发往 provider 的请求上加入 `attributionHeaders()`，将增量响应转换为稳定的 block 索引和原始 JSON Tool 参数片段，在结束前发出 usage，并在取消时释放传输资源。生产 adapter 必须以稳定的 `LlmError` 拒绝不支持的请求选项，不能静默忽略。对于自有凭证，先解析其配置或环境变量引用，再将原始值传入 `assertUsableApiKey(raw, packageName, credentialRef)`，然后才构造 HTTP header；诊断信息应标识引用而不回显密钥。若 adapter 拥有重试设置，用 `resolveRetryPolicy(config, diagnosticPath)` 验证，并从 `providerRetryPolicy(provider)` 返回不可变结果。挂载 `llm-retry` 才会在失败步骤执行该路由策略；仅注册策略会捕获配置，但不会安排重试。

```ts
import type { Context } from '@deepseek-ai/cordis'
import { LlmAdapter } from '@deepseek-ai/dsh-llm'
import type { GenerateOptions, StreamChunk } from '@deepseek-ai/dsh-llm'

export const name = 'local-scripted-llm'
export const inject = ['llm']

class ScriptedAdapter extends LlmAdapter {
  override async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    if (options.signal?.aborted) throw options.signal.reason
    yield { type: 'block-start', index: 0, blockType: 'text' }
    yield { type: 'text-delta', index: 0, text: 'Hello from a local adapter.' }
    yield { type: 'block-end', index: 0, block: { type: 'text', text: 'Hello from a local adapter.' } }
    yield { type: 'usage', usage: { inputTokens: 0, outputTokens: 0 } }
    yield { type: 'finish', reason: { kind: 'stop' } }
  }
}

export function apply(ctx: Context) {
  ctx.llm.registerAdapter(['local-scripted'], new ScriptedAdapter())
}
```

编译此 Host 文件，在可丢弃的 Profile 中挂载 `llm` 服务和插件配置行，以真实的 `GenerateOptions` 对 `local-scripted` 调用 `ctx.llm.prepareCall` 或 `ctx.llm.stream`，并断言文本、usage 先于 finish 的顺序、重复路由被拒绝、取消行为，以及 fiber 卸载后路由消失。GUI 模型选择器还需要 `listModels` 或已配置的模型目录路由；基础 adapter 不公布任何模型。生产传输实现还需单独进行网络请求与取消测试。

若设置页要通过草稿 endpoint 发现模型，应以其 `settingsNs` 注册 discovery。回调接收 `LlmModelDiscoveryRequest`（`provider?`、`baseURL?`、`api?`、`apiKey?`）和单独的可选 `AbortSignal`；使用该 signal 取消探测，让草稿凭证只在本次操作中有效，并随插件卸载清理注册。包还为 pi-ai 辅助功能导出了 `LlmModelDiscoveryOperation`，但它**不是** `registerModelDiscovery` 的回调签名。

## persist-derived-session-state

从规范 Session 事件定义纯 projection，在打开或恢复 Session 前注册，并通过 `stateOf(session, key)` 读取仅供 Host 使用的状态单元。本示例统计已提交的 turn start，无需维护可变计数器；它使用公开的 `@deepseek-ai/dsh-session-projection` key 扩展及目标 tag 的 `turn/start` 事件。若将插件单独打包，须把 `zod` 加入依赖。

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-session-projection'
import { z } from 'zod'

declare module '@deepseek-ai/dsh-session-projection/types' {
  interface SessionProjectionStateMap { exampleTurnCount: number }
}

export const name = 'example-turn-count'
export const inject = ['sessionProjections']

export function apply(ctx: Context) {
  ctx.sessionProjections.register({
    key: 'exampleTurnCount',
    stateSchema: z.number().int().nonnegative(),
    stateVersion: 0,
    init: () => 0,
    apply: (count, event) => event.type === 'turn/start' ? count + 1 : count,
  })
}
```

在 Host Profile 中挂载 `session-projection` 和插件。真实 Agent turn 完成后，断言 `ctx.sessionProjections.stateOf(agent.session, 'exampleTurnCount')` 增加一次；另一 Session 应保有自己的计数。卸载插件后该 key 应消失。面向 Client 的 projection 还要声明 `SessionProjectionMap` 和 `wire: { viewSchema, view }`，并检查 `snapshot(session).values`；仅供 Host 使用的示例刻意不出现在该 snapshot 中。若需持久恢复，挂载 `session-persistence` 和恰好一个 backend，经由拥有该资源的 service 追加可观察事件，关闭时 flush/drain，重启后比较 fold 结果。若启用 checkpoint，应删除或忽略缓存，证明完整日志重算的结果一致。本 reference **尚未**运行该重启路径；不能从这个类型层面的示例宣称已验证持久化。新代码中不要使用已弃用的同步 Session reader，也不要把 checkpoint 当成权威数据。

## add-command-and-approval

挂载 `@deepseek-ai/dsh-commands` 并注入 `commands`。`CommandDefinition.handler` 接收 `CommandInvocation`，不是 `CommandExecution`；后者是注册表返回的已完成结果。invocation 的 `signal` 归属于发起分发的 UI 请求。以下不处理附件的最小命令，其注册由所属 Cordis fiber 管理：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-commands'

export const name = 'status-command'
export const inject = ['commands']

export function apply(ctx: Context) {
  ctx.commands.register({
    name: 'status',
    description: 'Report whether this command can run.',
    handler: ({ signal, rawInput }) => {
      if (signal.aborted) return { kind: 'error', text: 'Command cancelled.' }
      if (rawInput.trim()) return { kind: 'error', text: 'This command takes no arguments.' }
      return { kind: 'success', text: 'Command ready.' }
    },
  })
}
```

在带有真实 Agent 的 Profile 中挂载该配置行，检查 `ctx.commands.list(agent)` 包含 `status`，分发 `/status`，然后卸载该行并确认列表中不再有它。分发器会写入配对的 `command/run` 和 `command/done` 事件；除返回的 `CommandExecution.result` 外，也应检查这些事件。若 handler 启动异步工作，必须转发 `invocation.signal`、在返回前等待清理，并按命令接口传播取消。若接受附件，须声明 `input: { hint: string, attachments: true }`；暂存文件回执还需要单独拥有 `registerFileReceiptResolver`，并精确检查 Session 所有权。

不要在该 slash command 的 handler 内调用 `ApprovalService.request`。命令分发会追加 `command/run` 和 `command/done`，但不会打开 Session turn；审批需要 open turn 才能持久记录成对的 `approval/asked` 与 `approval/decided`，因此此类请求会在询问任何人之前抛错。对于受保护的模型动作，应挂载 `@deepseek-ai/dsh-user-approval` 及真实审批应答方，把 `approval` 注入 [register-host-tool](#register-host-tool) 中的 Tool 插件，并在 Agent turn 尚未关闭时从该 Tool 的 `execute` 请求审批。必须存在 `exec.agent`（裸的程序化 Tool 调用可能没有它），然后在执行副作用前调用 `ctx.approval.request({ agent: exec.agent, toolName: '<tool-name>', callId: exec.callId, reason: '<action and scope>', signal: exec.signal })`。只有 `allowed-once` 授权本次动作；对 `rejected`、`cancelled` 和 `unavailable` 均不得执行动作，审计追加失败也应视为失败。若人工命令需要受保护动作，必须安排单独的、已授权且绑定 turn 的路径；上述 `/status` handler 只报告状态。验证 slash 分发不会请求审批，并验证 Tool 审批的四种结果、取消、配对的审计事件和卸载。permission preset 只选择策略，本身不会执行或授权动作。请求字段和 turn 前置条件见 [Host 契约](api-host-core.md#命令审批与提问)。

## manage-goal

先挂载 `dsh-goal`，再挂载 `tool-goal`、`command-goal` 或 `goal-round-driver`。通过 `GoalService` 创建或编辑目标；暂停、恢复、阻塞、完成或清除目标时，仅从具有相应权限的接口操作。观察 `GoalProjection`，不要另建内存副本。重启或恢复 Session，验证 phase、objective 和 round 状态可以重建；测试配置的最大轮数与卸载行为。

## run-background-job

挂载具体实现 `@deepseek-ai/dsh-jobs-local` 并注入 `jobs`；仅挂载抽象的 `@deepseek-ai/dsh-jobs` 会在构造时失败。对于归属于某个 Session 的 job，应把真实 Agent 的 `session.id` 作为 `owner`，使读取和取消权限限于该 Session。`start({ kind, label, owner, run })` 返回 `JobId`；注册表向 `run` 传入 `JobHandle`。producer 必须同步返回 `JobHooks`：`cancel(reason?)` 幂等地请求终止，`done` 仅在所属资源关闭后才 resolve。自定义 kind 需要对 `JobKindMap` 进行声明合并；producer 的 `kind` 不能是任意未类型化字符串。

```ts
import type { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type { JobId } from '@deepseek-ai/dsh-jobs'
import type {} from '@deepseek-ai/dsh-jobs-local'

declare module '@deepseek-ai/dsh-jobs/view' {
  interface JobKindMap { countdown: 'countdown' }
}

export const name = 'countdown-job'
export const inject = ['jobs']

export function startCountdown(ctx: Context, agent: Agent): JobId {
  return ctx.jobs.start({
    kind: 'countdown',
    label: 'One tick',
    owner: agent.session.id,
    run(job) {
      let finish!: (outcome: { status: 'completed' | 'killed'; detail?: string }) => void
      const done = new Promise<{ status: 'completed' | 'killed'; detail?: string }>(resolve => { finish = resolve })
      let settled = false
      const timer = setTimeout(() => {
        if (settled) return
        settled = true
        job.append('tick\n')
        finish({ status: 'completed' })
      }, 50)
      return {
        done,
        cancel(reason) {
          if (settled) return
          settled = true
          clearTimeout(timer)
          finish(reason === undefined ? { status: 'killed' } : { status: 'killed', detail: reason })
        },
      }
    },
  })
}
```

只从已挂载 `jobs` 的插件调用 `startCountdown`，并为 owner Session 保留返回的 id。测试 `ctx.jobs.wait(id, timeoutMs, agent.session.id)`、通过 `read(id, owner)` 读到一次 `tick`，以及通过 `readAt(id, 0, owner)` 在不消耗 cursor 的情况下读取。另一次运行中，在定时器触发前调用 `kill(id, owner, reason)`，断言结果为 `killed` 且没有延迟输出；第三次运行中卸载 Agent 和 service，断言没有定时器残留。还需测试外部 caller id 被拒绝、超过保留容量时的 ring gap，并仅在 consumer 完成后移除保留记录。只有模型本身需要等待、读取或终止 job 时才需要 `tool-jobs`。

若 producer 使用外部输出缓冲区，可提供 `JobSpec.output: [{ channel, read(fromByte) }]` 来替代或配合 `job.append()`。每次 `read` 返回从请求的完整流字节偏移量开始的文本、`nextOffset`、`lossy` 标志，以及可选的完整流 `spillPath`；注册表会持续提取，并在 `done` 完成前再读取一次。另一个插件若要观察完成事件，应使用明确的 `JobEventFilter` 订阅：`{ owner: agent.session.id }` 包含该 Session 的 job 和无主 job；`{ owners: 'scope' }` 跟随订阅方的组合 scope；`{ owners: 'all' }` 覆盖整个进程。`settled` 事件报告 `cause` 和 `awaited`；`output` 事件只报告新的总量，因此观察方应从自己维护的 cursor 调用 `readAt` 获取字节。卸载时清理订阅。

## provide-skills

挂载 `@deepseek-ai/dsh-skill`，注入 `skills`，然后注册一个 runtime `SkillRegistration`，或同步注册 provider factory。下面完整的 runtime 示例不使用文件系统 watcher，也无需实现 provider 的 `list/get`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-skill'

export const name = 'example-runtime-skill'
export const inject = ['skills']

export function apply(ctx: Context) {
  ctx.skills.register({
    name: 'example-guidance',
    description: 'Use for the local example task.',
    source: 'runtime',
    content: '# Example guidance\n\nFollow the local task contract.\n',
    invocation: { modelInvocable: true, userInvocable: true },
  })
}
```

对于多个或延迟加载的 Skill，调用 `registerProvider((control) => ({ name, list: async options => ..., get: async (candidate, options) => ... }))`：同步构造 provider，在 `list` 中进行远程或文件系统发现，同时遵守 `control.signal` 和 `options.signal`；监听到变化后调用 `control.invalidate()`，control 被取消时释放 watcher。调用返回清理函数，**不是** control 对象。若 provider 获得可用但不完整的结果，可以返回 `{ candidates, complete: false }`；注册表会在本次观察中使用这些 candidate，由 `snapshot()` 报告不完整，且不会缓存结果。不得把不完整发现呈现为最终目录。文件系统发现须配置精确根目录、symlink/polling 策略和预算。仅当模型需要目录或调用能力时挂载 `tool-skill`。验证目标 cwd 下的 `list/get`、用户和模型调用策略、无效 Skill 被拒绝、provider 错误隔离、变化后失效处理及 watcher 清理。卸载插件配置行，确认 runtime Skill 或 provider 从目录中消失。

## delegate-subagent

先确定一次性或可继续的语义，再选择 provider。挂载 `@deepseek-ai/dsh-subagent` 和具名 provider，例如 `subagent-spawn-in-process` 或 `subagent-fork-in-process`；仅在需要模型发起委派时挂载 `tool-subagent`。在 Profile 中配置 provider 的实际名称、有限的深度上限和活跃 child 上限。Host 插件取得精确的真实父 Agent 后，可以直接调用一次性接口：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type { SubagentResult } from '@deepseek-ai/dsh-subagent'

export async function delegateOnce(
  ctx: Context,
  providerName: string,
  parent: Agent,
  signal: AbortSignal,
): Promise<SubagentResult> {
  const run = await ctx.subagents.start(providerName, {
    parent,
    prompt: [{ type: 'text', text: 'Summarize the current task.' }],
    signal,
  })
  try {
    return await run.result
  } finally {
    await run.dispose()
  }
}
```

将此辅助函数封装进注入 `subagents` 的插件，并且只从其拥有的 Agent 操作中调用。`start` 会在发布前的准备失败时 reject；发布后，`run.result` 通过 `stopReason` 表达 child 层面的失败，`dispose()` 则等待剩余工作结束。仅在核对所选 provider 的 `capabilities` 后才传入可选的 `agentOptions`、`outputSchema`、`maxDepth`、`toolFilter` 或 `persona`；通用 service 会拒绝不支持的请求。五个一次性能力标志是 `agentOptions`、`outputSchema`、对应 `maxDepth` 的 `depthLimit`、`toolFilter` 与 `persona`；它们本身不保证支持继续执行。`ctx.subagents.list()` 列出的是**provider 名称**。持久化 child 目录查询应使用 `listChildren(parent.session.id, signal)` 或 `listDescendants(...)`；可继续的 child 应使用其专有的 `prompt`/`interrupt` 授权路径，并在父对象卸载期间等待所有后代退出。精确的真实父 Agent 可调用 `ctx.subagents.sendMessage(parent, childId, content, { signal })`；返回的 inbox id 表示已接受消息，而此 signal 仅能取消接受前的工作。`ctx.subagents.interrupt(childId, { kind: 'ancestor', agent: parent })` 会向当前可继续的 turn 发出信号，但不会删除排队消息或卸载 child；人工路径在检查地址后使用 `{ kind: 'user', parentSessionId }`。可继续的 provider 实现 `prepareContinuable`，后续激活由 continuation manager 拥有。验证容量和深度限制、启动失败、正常与取消后的结束、没有泄漏的后代，以及使用 Session 的 provider 的血缘关系。ACP 仅支持一次性运行。只有实际执行相应路径后，才报告真实 provider 或 Browser/Client Remote 组合的行为。

## run-workflow

在真实 Profile 中挂载 `workflow-ptc`、它所需的 PTC runtime 与 sandbox policy、`dsh-subagent` 及所选 provider；仅当模型需要发起调用时才挂载 `tool-workflow`。`WorkflowStartRequest` 必须提供 `script`、`meta: { name, description }` 及精确的真实 `parent`；`args`、`subagentProvider`、`maxTotalAgents` 和 `signal` 可选。设置明确的 child 上限，并转发 caller signal。Host 所有者等待不会 reject 的结果，并始终卸载该 run：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type { WorkflowResult } from '@deepseek-ai/dsh-workflow'

export async function runOneChild(
  ctx: Context,
  parent: Agent,
  providerName: string,
  signal: AbortSignal,
): Promise<WorkflowResult> {
  const run = ctx.workflowEngine.start({
    script: "return await agent('Summarize the current task.')",
    meta: { name: 'one-child-summary', description: 'Ask one child for a summary.' },
    subagentProvider: providerName,
    maxTotalAgents: 1,
    parent,
    signal,
  })
  try {
    return await run.result
  } finally {
    await run.dispose()
  }
}
```

所选 provider 必须已注册，并能够在配置的 PTC/sandbox 组合中运行。`result.stopReason` 可为 `completed`、`cancelled` 或 `error`；仅在完成时使用 `value`，否则报告 `error`。若需检查进度，观察 `workflow/start`、`workflow/phase`、`workflow/log`、`workflow/agent-start`、`workflow/agent-end` 和 `workflow/end`。终止事件包含 `WorkflowResultInfo`（`stopReason`、可选 `error`、`agentsStarted`），**不包含** `value`；只有 run 所有者的 `result` promise 会给出实体化结果。验证元数据、语法或实体化失败、child 拒绝、结果大小上限、取消以及没有泄漏的 child。测试替身或通过 `WorkflowRun` 类型检查都不能证明 Profile 能创建真实 child；本 reference **尚未**运行完整组合。

## run-external-hook

选择 Claude Code 或 Codex bridge，并挂载其必需的 `shell` 服务；bridge 负责对应 dialect 的配置解析、匹配、payload、环境变量及决策映射。通用 `runHook(ctx.shell, hook, options, now)` 有四个参数：`hook` 为 `{ command, timeoutSec? }`（秒），`options` 必须包含 `payload`、`signal`、`trailingNewline` 和 `defaultTimeoutMs`（毫秒），还可包含 `cwd`、`env` 与 `expectedEventName`。Codex 传入 `trailingNewline: false`；bridge 当前 Session 的 workspace 提供 `cwd`。runner 将 payload 序列化至 stdin，通过 `ctx.shell` 执行，并返回 `{ output, durationMs }`；即使基础设施失败，也会包含解析后的非阻塞结果。bridge 随后应用 `mergeHookOutputs` 及自身的 hook point 决策规则。

对于自定义 bridge，调用任何命令前，应根据明确选定的 dialect 和 matcher 验证配置文件。生成稳定的 `handlerId`，在 open turn 内调用 `appendHookInvoked(session, invocation)`；其中 `invocation` 包含 `turn`、`point`、`dialect`、`handlerId` 和可选 `matcher`。`runHook` 后调用 `appendHookResult(session, { turn, point, handlerId, output, stderrSummaryMaxChars, durationMs })`。结果辅助函数从解析后的输出推导决策、可选退出码及有长度限制的 stderr 摘要。成对事件的 `turn`、`point` 和 `handlerId` 必须一致；不得在 open turn 之外追加仅用于日志的 hook 事件。为 stderr 摘要设置上限，并在关闭期间卸载每个 detached run。测试不匹配的 hook、格式错误的输出、退出码 2 与其他非零退出码、超时、取消、决策合并及精确配对的 Session 记录。这里**尚未**将直接 runner、配置 bridge、Shell 执行器和 Session 事件路径一起运行；应将其视作构建路径，而非已验证的 hook 行为。

## add-context-provider

在各自必需服务之后挂载所需 contributor：instructions、time、tmux、file reference/local search 或 session reference。明确配置根目录、字节及结果预算、时区、polling 和 symlink 行为，不依赖其他版本的默认值。在目标 Agent/Session scope 中组装，并检查 Session 可见的上下文来源与元数据。适用时更改底层文件、时间或 Session，验证刷新与失效处理，随后卸载并证明定时器、watcher 和 provider 已停止。

## 跨端与失败路径检查清单

- Host 源码从包的主入口导入。Browser 源码只从已声明的 `./client` 入口导入；Remote/Typert 注册须在两端执行。
- 所有按 scope 注册的资源、watcher、定时器、子进程、job、child 及 workflow run 均有清理函数或所属 scope。
- Abort signal 传达到所属的异步资源，promise 仅在清理后结束。
- Session 可见事实能从规范事件或 projection 重建；仅供 UI 使用的卡片和缓存不是权威数据。
- 必须验证 Profile 装载及至少一个可观察行为。类型编译、导出符号、包 README 示例和单元测试只是辅助证据，不能证明运行行为。
