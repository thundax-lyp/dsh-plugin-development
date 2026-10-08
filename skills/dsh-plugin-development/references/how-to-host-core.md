# Host/Core end-to-end tasks

These paths compose the contracts in [Host/Core API guardrails](api-host-core.md) and the [selected public surface](api-host-core-surface.md). They are pinned to `dsh-v0.2.0-rc.2`.

## register-host-tool

Use this ordered path for a local Host Tool in the exact DSH checkout. It builds on the target tag's first-plugin and first-tool tutorials, with the local directory adjusted for package resolution. A separately distributed package additionally needs the package manifest, build output, and Profile installation path in the [infrastructure HOW-TO](how-to-infra-runtime.md); a checkout-local TypeScript file is not a published package.

1. From the target checkout root, complete `pnpm install --frozen-lockfile` and `pnpm run build` once, run `mkdir -p apps/cli/scratch-plugin/src`, then create `apps/cli/scratch-plugin/src/my-plugin.ts`. This location resolves the public `@deepseek-ai/dsh-tools` import through `apps/cli`'s declared workspace dependencies; a root-level `scratch-plugin/` has no such installed dependency link in this checkout. The Web Profile must mount `system-prompt` and `tools`; this plugin declares `inject = ['tools']` so a missing registry leaves its row PENDING.
2. Use this complete Host file. `execute` returns one canonical string, the pure renderer creates model-facing content, and the optional wait makes abort observable. The manual name and wait checks cover constraints beyond the parameter DSL. The [Tool contract](api-host-core.md#tool-runtime-and-definition) owns the API semantics.

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

3. Create the overlay from the checkout root. The absolute path matters: a patch does not change the Loader's module-resolution directory.

```sh
cat > apps/cli/scratch-plugin/cordis.yml <<EOF
- insert:
    - id: greet-tool
      name: '$(pwd)/apps/cli/scratch-plugin/src/my-plugin.ts'
EOF
pnpm dsh web --patch ./apps/cli/scratch-plugin/cordis.yml
```

4. Open the Web UI on its displayed local address and ask the configured Agent to call `greet` with `name: "Ada"` and `waitMs: 0`. Expect `Hello, Ada!` in the tool result and paired `tool/call` and `tool/result` Session events. If the tool is absent, inspect the plugin fiber: PENDING means a required service is missing; confirm the Profile mounts `tools`, the overlay path resolves, and the tool schema appears in `ctx.tools.schemas()` before debugging the model prompt.
5. Save the following as `apps/cli/scratch-plugin/verify.mjs` and run `node --import tsx apps/cli/scratch-plugin/verify.mjs` from the checkout root. It exercises the same plugin without an LLM, so failure, cancellation, and fiber disposal have deterministic assertions. It does not replace the real Profile and Agent call in step 4.

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

If the Tool is absent in the real Profile, inspect the row and its required `tools` service first. When using HMR to disable the overlay row, verify the running Profile also removes the schema; that live HMR check remains separate from this in-process disposal test.

Completion means the Host file compiles against the target tag, the Profile activates its row, a real Agent call produces the declared result, the failure and cancellation paths settle, and unloading removes the schema. A build or schema listing alone does not establish the full path.

## provide-and-consume-cordis-service

Use a Cordis service when one Host plugin owns a capability and another plugin needs it through `ctx`. Give the service a name distinct from DSH's built-in service keys. Check the [public Cordis service surface](api-infra-runtime-surface.md#cordis-lifecycle-public-api) for the owner and lifecycle contract. For this checkout-local example, place both files in `apps/cli/scratch-plugin/src/`, where the public Cordis import resolves through the CLI workspace dependency. A separately distributed package follows the [package and Profile path](how-to-infra-runtime.md#package-and-activate-a-bundle).

1. In `greeter.ts`, declare the `Context` property and mount a `Service` subclass. `super(ctx, 'exampleGreeter')` provides the instance for the lifetime of the provider fiber; the declaration merge is only the TypeScript side of that contract.

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

2. In `consumer.js`, require the service before reading it. The provider's `Context` augmentation is available to a TypeScript consumer by importing `./greeter.js` as a type-only side effect. Keep the provider and consumer as separate Loader rows: `inject` controls activation, so their row order is not a dependency mechanism.

```js
export const name = 'example-greeter-consumer'
export const inject = ['exampleGreeter']
export function apply(ctx) {
  if (ctx.exampleGreeter.greet('Ada') !== 'Hello, Ada!') throw new Error('service mismatch')
}
```

3. From the checkout root, start an isolated Web Profile with both rows. The patch uses absolute paths because Loader resolves modules from the Profile, not from the patch file. For a published package, use the [bundle instructions](how-to-infra-runtime.md#package-and-activate-a-bundle) instead.

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

4. Compile the provider against the target tag. In the Profile, confirm both fibers become `ACTIVE` and the consumer's assertion passes; stop the Profile, remove the provider row from the patch, restart, and confirm the consumer is `PENDING`. Restore the provider and restart to confirm the consumer activates again. To check dependent unload while live, remove or replace the provider through HMR and observe its consumer's effects unwind. For a provider that owns timers, sockets, or watches, return an awaited `ctx.effect()` disposer and verify those resources close before declaring unload complete. Source: `docs/cordis-tutorial/03-services.md` and `vendor/cordis/src/service.ts` in the pinned checkout.

## extend-system-prompt

Mount `@deepseek-ai/dsh-system-prompt`, inject `systemPrompt`, and register a uniquely named `section`, `context`, `variable`, or `tools` provider in the correct Cordis scope. Use `getSectionOrder`/`getContextOrder` for repository-owned placements; third-party plugins should choose a stable finite order and name. Retain the disposer when the registration lifetime is shorter than the plugin scope. Assemble once globally and once in the target agent scope; verify shadowing, deterministic ordering, missing-variable failure, and unload cleanup. Suppressing runtime context affects disclosure only, not enforcement.

## add-llm-adapter

Mount `@deepseek-ai/dsh-llm`, inject `llm`, and call `ctx.llm.registerAdapter(providerRoutes, adapter)` during plugin apply. Its handle is the exact effect-owned disposer and has `replace(nextRoutes)` for an atomic same-instance route swap. `LlmAdapter.stream(options)` is the only abstract method: inherited `resolveModel` and `prepareCall` work for static routes. Override `listModels` for catalog-driven selection and `prepareCall` when settings may change between model resolution and dispatch. Add `registerConfigurableProviders` and `registerModelDiscovery` only if the plugin also owns a settings/catalog entry; they are separate registrations. See [LLM contract](api-host-core.md#llm-provider-and-adapter) and [public signatures](api-host-core-surface.md#hostcore-task-api).

This complete **local scripted** adapter is suitable for checking the Host extension path without credentials. It is a fixture, not an HTTP provider: replace its body with a real request that forwards `options.signal`, adds `attributionHeaders()` to every outbound provider request, translates the provider's incremental response into stable block indexes and raw JSON tool-argument fragments, emits usage before finish, and releases transport resources on abort. A production adapter must reject unsupported request options with a stable `LlmError` rather than silently ignoring them. For an owned credential, resolve its config or environment reference first and pass the raw value to `assertUsableApiKey(raw, packageName, credentialRef)` before constructing an HTTP header; its diagnostic identifies the reference without echoing the key. If the adapter owns a retry setting, validate it with `resolveRetryPolicy(config, diagnosticPath)` and return the immutable result from `providerRetryPolicy(provider)`. Mount `llm-retry` to execute that route policy on failed steps; registration alone captures it but does not schedule retries.

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

Compile this Host file, mount the `llm` service and plugin row in a disposable Profile, call `ctx.llm.prepareCall` or `ctx.llm.stream` for `local-scripted` with a real `GenerateOptions`, and assert the text, usage-before-finish order, duplicate-route rejection, abort behavior, and route absence after fiber disposal. A GUI model picker additionally requires `listModels` or a configured model-directory route; the base adapter advertises none. A production transport requires a separate wire request and cancellation test.

For a settings page that discovers models at a draft endpoint, register discovery under its `settingsNs`. Its callback receives `LlmModelDiscoveryRequest` (`provider?`, `baseURL?`, `api?`, `apiKey?`) and a separate optional `AbortSignal`; use that signal for the interrogation, keep the draft credential operation-local, and dispose the registration with the plugin. The package also exports `LlmModelDiscoveryOperation` for a pi-ai helper, but that is **not** the `registerModelDiscovery` callback signature.

## persist-derived-session-state

Define a pure projection from canonical Session events, register it before opening/restoring Sessions, and read it through `stateOf(session, key)` for a host-only unit. This example counts committed turn starts without its own mutable counter; it uses the public `@deepseek-ai/dsh-session-projection` key extension and the target tag's `turn/start` event. Add `zod` to a separately packaged plugin's dependencies.

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

Mount `session-projection` and the plugin in the Host Profile. After a real Agent turn, assert `ctx.sessionProjections.stateOf(agent.session, 'exampleTurnCount')` advanced once; a separate Session should retain its own count. Unloading removes the key. A Client-facing projection also declares `SessionProjectionMap` and `wire: { viewSchema, view }`, then checks `snapshot(session).values`; the host-only example is intentionally absent from that snapshot. For durable restoration, mount `session-persistence` plus exactly one backend, append observable events through the owning service, flush/drain on shutdown, restart, and compare the fold. If checkpoints are enabled, delete/ignore the cache and prove full-log recomputation matches. This reference has **not** executed that restart path; do not claim persistence from this type-level example. Do not use deprecated synchronous Session readers in new code or treat a checkpoint as authority.

## add-command-and-approval

Mount `@deepseek-ai/dsh-commands` and inject `commands`. A `CommandDefinition.handler` receives `CommandInvocation`, not `CommandExecution`; the latter is the settled registry result. The invocation's `signal` belongs to the dispatching UI request. The minimal attachment-free command below leaves its registration to the owning Cordis fiber:

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

Mount the row in a Profile with a live Agent, check `ctx.commands.list(agent)` contains `status`, dispatch `/status`, then dispose the row and confirm listing no longer contains it. The dispatcher writes paired `command/run` and `command/done` events; inspect those events as well as the returned `CommandExecution.result`. A handler that starts async work must forward `invocation.signal`, await cleanup before returning, and propagate cancellation according to the command surface. If it accepts attachments, declare `input: { hint: string, attachments: true }`; staged file receipts require a separately owned `registerFileReceiptResolver` and exact Session ownership checks.

For a protected action, additionally mount `@deepseek-ai/dsh-user-approval` and a real approval answerer, then call `ApprovalService.request` with the invocation's signal and attributable request fields before acting. Handle `allowed-once`, `rejected`, `cancelled`, and `unavailable` explicitly. Verify all four outcomes and durable audit events; a permission preset selects policy but does not perform or authorize the action by itself. The approval request shape is in the [Host contract](api-host-core.md#commands-approval-and-questions); do not synthesize it from a command name alone.

## manage-goal

Mount `dsh-goal` before `tool-goal`, `command-goal`, or `goal-round-driver`. Create/edit through `GoalService`, then pause/resume/block/complete/clear only from a surface with the corresponding authority. Observe `GoalProjection` rather than another in-memory copy. Restart or restore the Session and verify the same phase/objective/round state reconstructs; test configured maximum rounds and unload behavior.

## run-background-job

Mount concrete `@deepseek-ai/dsh-jobs-local` and inject `jobs`; mounting abstract `@deepseek-ai/dsh-jobs` alone fails at construction. For a Session-owned job, pass the live Agent's `session.id` as `owner` so reads and cancellation are fenced to that Session. `start({ kind, label, owner, run })` returns `JobId`; the registry gives `run` a `JobHandle`. The producer must return `JobHooks` synchronously: `cancel(reason?)` requests termination idempotently, and `done` resolves only after its resources close. A custom kind requires declaration merging of `JobKindMap`; the producer's `kind` cannot be an arbitrary untyped string.

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

Call `startCountdown` only from a plugin mounted with `jobs`, retaining the returned id for the owner Session. Test `ctx.jobs.wait(id, timeoutMs, agent.session.id)`, `read(id, owner)` for one `tick`, and `readAt(id, 0, owner)` without cursor consumption. In another run, call `kill(id, owner, reason)` before the timer fires and assert `killed` plus no late output; dispose the Agent and service in a third run and assert no timer survives. Test a foreign caller id for access refusal, ring gaps when retention is exceeded, and remove the retained record only after consumers finish. `tool-jobs` is needed only when the model itself should wait/read/kill.

A producer with an external output buffer can supply `JobSpec.output: [{ channel, read(fromByte) }]` instead of or alongside `job.append()`. Each `read` returns text since the requested whole-stream byte offset, its `nextOffset`, a `lossy` flag, and optional complete-stream `spillPath`; the registry pumps it and drains once more before `done` settles. To observe completion from another plugin, subscribe with an explicit `JobEventFilter`: `{ owner: agent.session.id }` includes that Session's jobs and unowned jobs, `{ owners: 'scope' }` follows the subscribing composition, and `{ owners: 'all' }` is process-wide. A `settled` event reports `cause` and `awaited`; an `output` event reports only the new total, so read bytes with `readAt` from an observer-owned cursor. Dispose the subscription on unload.

## provide-skills

Mount `@deepseek-ai/dsh-skill`, inject `skills`, then either register one runtime `SkillRegistration` or synchronously register a provider factory. This complete runtime example uses no filesystem watcher and needs no provider `list/get` implementation:

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

For multiple or lazy-loaded skills, call `registerProvider((control) => ({ name, list: async options => ..., get: async (candidate, options) => ... }))`: construct the provider synchronously, do remote/filesystem discovery in `list`, honor both `control.signal` and `options.signal`, call `control.invalidate()` after a watched change, and release watchers when control aborts. The call returns the disposer, **not** the control object. A provider that has usable but incomplete results may return `{ candidates, complete: false }`; the registry uses those candidates for that observation, reports incomplete from `snapshot()`, and does not cache them. Do not present an incomplete discovery as a final catalog. For filesystem discovery, configure exact roots, symlink/polling policy, and budgets. Mount `tool-skill` only when the model needs catalog/invocation. Verify `list/get` under the intended cwd, user/model invocation policy, malformed skill rejection, provider error containment, change invalidation, and watcher cleanup. Dispose the plugin row and confirm the runtime skill or provider disappears from the catalog.

## delegate-subagent

Choose one-shot or continuable semantics before choosing a provider. Mount `@deepseek-ai/dsh-subagent` and a named provider such as `subagent-spawn-in-process` or `subagent-fork-in-process`; mount `tool-subagent` only for model-facing delegation. Configure the provider's actual name and a finite depth/active-child cap in the Profile. A Host plugin can call the one-shot seam directly after it receives an exact live parent Agent:

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

Package the helper in a plugin that injects `subagents` and calls it only from an owned Agent operation. `start` rejects on prepublication setup failure; after publication, `run.result` resolves child-level failure as a `stopReason` and `dispose()` drains remaining work. Pass optional `agentOptions`, `outputSchema`, `maxDepth`, `toolFilter`, or `persona` only after checking the selected provider's `capabilities`; the generic service rejects unsupported requests. The five one-shot flags are `agentOptions`, `outputSchema`, `depthLimit` for `maxDepth`, `toolFilter`, and `persona`; they do not by themselves promise continuable support. `ctx.subagents.list()` lists **provider names**. For durable child catalog queries use `listChildren(parent.session.id, signal)` or `listDescendants(...)`; for a continuable child use its dedicated `prompt`/`interrupt` authority path and drain descendants during parent teardown. An exact live parent Agent may call `ctx.subagents.sendMessage(parent, childId, content, { signal })`; the returned inbox id confirms acceptance, and that signal cancels only preacceptance work. `ctx.subagents.interrupt(childId, { kind: 'ancestor', agent: parent })` signals a current continuable turn without deleting queued messages or disposing the child; a human path uses `{ kind: 'user', parentSessionId }` after its address check. A continuable provider implements `prepareContinuable`, and the continuation manager owns later activations. Verify capacity/depth refusal, startup failure, normal and cancelled settlement, no leaked descendants, and Session lineage for a session-backed provider. ACP is one-shot. Report a real provider or Browser/Client Remote composition only after exercising that exact path; verify that composition before claiming its behavior.

## run-workflow

Mount `workflow-ptc`, its required PTC runtime and sandbox policy, `dsh-subagent`, and a selected provider in a real Profile; mount `tool-workflow` only for model-facing invocation. `WorkflowStartRequest` requires `script`, `meta: { name, description }`, and the exact live `parent`; `args`, `subagentProvider`, `maxTotalAgents`, and `signal` are optional. Set an explicit child ceiling and forward the caller signal. The Host owner awaits the never-rejecting result and always disposes the run:

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

The selected provider must be registered and able to run in the configured PTC/sandbox composition. `result.stopReason` is `completed`, `cancelled`, or `error`; use `value` only on completion and report `error` otherwise. For progress checks, observe `workflow/start`, `workflow/phase`, `workflow/log`, `workflow/agent-start`, `workflow/agent-end`, and `workflow/end`. The terminal event carries `WorkflowResultInfo` (`stopReason`, optional `error`, `agentsStarted`) **without** `value`; only the run owner's `result` promise yields the materialized value. Verify metadata validation, syntax/materialization failure, child refusal, result-size bound, cancellation and zero leaked children. A test double or a successful `WorkflowRun` type check does not establish that the Profile can spawn a real child; this reference has **not** run that complete combination.

## run-external-hook

Select the Claude Code or Codex bridge and mount its required `shell` service; the bridges own dialect-specific config parsing, matching, payloads, environment, and decision mapping. The common `runHook(ctx.shell, hook, options, now)` has four arguments: `hook` is `{ command, timeoutSec? }` (seconds), and `options` requires `payload`, `signal`, `trailingNewline`, and `defaultTimeoutMs` (milliseconds), plus optional `cwd`, `env`, and `expectedEventName`. Codex passes `trailingNewline: false`; the bridge's active Session workspace supplies `cwd`. The runner serializes payload to stdin, executes through `ctx.shell`, and returns `{ output, durationMs }`, including a nonblocking parsed outcome on infrastructure failure. The bridge then applies `mergeHookOutputs` and its own hook-point decision rules.

For a custom bridge, validate the config file against an explicitly selected dialect and matcher before invoking any command. Generate a stable `handlerId` and call `appendHookInvoked(session, invocation)` inside the open turn, where `invocation` has `turn`, `point`, `dialect`, `handlerId`, and optional `matcher`. After `runHook`, call `appendHookResult(session, { turn, point, handlerId, output, stderrSummaryMaxChars, durationMs })`. The result helper derives decision, optional exit code, and bounded stderr summary from decoded output. The `turn`, `point`, and `handlerId` must match across the pair; do not append log-only hook events outside an open turn. Supply a bounded stderr summary and dispose every detached run during shutdown. Test unmatched hooks, malformed output, exit 2 versus other nonzero exits, timeout, abort, decision merge, and exact paired Session records. The direct runner, config bridge, Shell executor, and Session event path have **not** been run together here; treat this as a construction path, not verified hook behavior.

## add-context-provider

Mount the exact contributor after its required services: instructions, time, tmux, file reference/local search, or session reference. Configure roots, byte/result budgets, time zone, polling, and symlink behavior rather than relying on another version's defaults. Assemble in the intended agent/session scope and inspect the Session-visible context source/metadata. Mutate the underlying file/time/session when applicable, verify refresh/invalidation, then unload and prove timers/watchers/providers stop.

## cross-side and failure checklist

- Host source imports the primary package entry. Browser source imports only declared `./client` entries; Remote/Typert registration runs on both sides.
- All scoped registrations, watchers, timers, subprocesses, jobs, children, and workflow runs have a disposer or owning scope.
- Abort signals reach owned asynchronous resources, and promises settle only after cleanup.
- Session-visible facts are reconstructible from canonical events/projections; UI-only cards and caches are not authority.
- Profile load plus one observable behavior is required. Type compilation, exported symbols, package README examples, and unit tests remain supporting evidence, not runtime proof.
