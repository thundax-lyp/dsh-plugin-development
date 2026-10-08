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

Completion means the Host file compiles against the target tag, the Profile activates its row, a real Agent call produces the declared result, the failure and cancellation paths settle, and unloading removes the schema. Record any step not actually run as Not Covered; a build or schema listing alone does not establish the full path.

## extend-system-prompt

Mount `@deepseek-ai/dsh-system-prompt`, inject `systemPrompt`, and register a uniquely named `section`, `context`, `variable`, or `tools` provider in the correct Cordis scope. Use `getSectionOrder`/`getContextOrder` for repository-owned placements; third-party plugins should choose a stable finite order and name. Retain the disposer when the registration lifetime is shorter than the plugin scope. Assemble once globally and once in the target agent scope; verify shadowing, deterministic ordering, missing-variable failure, and unload cleanup. Suppressing runtime context affects disclosure only, not enforcement.

## add-llm-adapter

Mount `@deepseek-ai/dsh-llm`, inject `llm`, and register one adapter instance for its provider routes plus any directory/model discovery entry. Implement `prepareCall`/model resolution and `stream(options)` with raw tool-argument JSON fragments, stable block indexes, usage before finish, nothing after finish, and `options.signal` propagation. Throw `LlmError` for transport/protocol/unsupported-option failures; use in-band error/aborted finish only for documented provider outcomes. Verify duplicate route refusal, abort, malformed provider stream, replay-state validation, handle disposal, and one real request when credentials/network are available.

## persist-derived-session-state

Define a pure projection from canonical Session events, register it before opening/restoring Sessions, and read it through the projection registry or SessionQuery. If checkpoints are enabled, delete/ignore the cache in a test and prove recomputation matches. Mount session persistence plus exactly one backend, append observable events through the owning service, flush/drain on shutdown, restart, and compare the projected value. Do not call deprecated synchronous Session readers in new code and do not treat a checkpoint as authority.

## add-command-and-approval

Mount commands, approval, and at least one approval answerer. Register a scoped command whose handler receives the `CommandExecution.signal`, validates attachment receipts, and calls `ApprovalService.request` before the protected action. Handle all four outcomes explicitly. Verify direct and agent-scoped command listing, allowed/rejected/cancelled/unavailable outcomes, cancellation propagation, durable audit events, and removal after scope disposal. A permission preset selects policy but does not itself perform or authorize the protected action.

## manage-goal

Mount `dsh-goal` before `tool-goal`, `command-goal`, or `goal-round-driver`. Create/edit through `GoalService`, then pause/resume/block/complete/clear only from a surface with the corresponding authority. Observe `GoalProjection` rather than another in-memory copy. Restart or restore the Session and verify the same phase/objective/round state reconstructs; test configured maximum rounds and unload behavior.

## run-background-job

Mount `jobs-local`, then any producer and `tool-jobs`. Start with an explicit owner and a producer that owns its controller, output source/push path, result, and cleanup. Before an id is published, the caller signal may cancel creation; afterwards, the job controller, owner disposal, `job_kill`, and service teardown own lifetime. Verify bounded output gaps, `readAt`, wait timeout, normal/error/cancel settlement, per-owner concurrency refusal, retention, and removal.

## provide-skills

Mount `dsh-skill`; register a runtime `SkillDefinition` or a provider with list/get/observation and retain its returned control/disposer. For filesystem discovery, configure exact roots, symlink/polling policy, and budgets. Mount `tool-skill` only when the model needs catalog/invocation. Verify list/get under the intended cwd, user/model invocation policy, malformed skill rejection, provider error containment, change invalidation, and watcher cleanup.

## delegate-subagent

Choose one-shot or continuable semantics before choosing a provider. Mount `dsh-subagent`, the provider, and `tool-subagent`; set a finite `maxDepth` and active-child cap. Pass cwd/model/policy/sandbox/tool filters explicitly and forward parent cancellation. For continuable children, verify send/interrupt/list and descendant drain; for one-shot providers such as ACP, verify only run/collect/stop-reason behavior. Test depth/capacity refusal, provider startup failure, normal settlement, cancellation, unload disposal, and durable parent/child Session links. Do not claim Browser/Client controls until their Remote combination runs.

## run-workflow

Mount workflow engine, `workflow-ptc`, selected subagent provider, and optionally `tool-workflow`. Validate workflow metadata/args/schema and set `maxTotalAgents`; never let a guest script select unbounded children. Retain the returned run, consume progress/result, forward cancellation, and dispose it on caller failure or plugin unload. Verify syntax/materialization failure, child refusal, fatal versus nonfatal workflow error, result-size bound, cancellation, and zero leaked children.

## run-external-hook

Select the Claude Code or Codex adapter and mount its common hook protocol dependencies. Resolve configuration to an exact command, cwd, environment, matcher, dialect, finite timeout, stderr bound, and AbortSignal. Run, parse, merge, and append invocation/result records; do not execute configuration merely because a file exists. Verify unmatched hooks, malformed output, nonzero exit, timeout, cancellation, merged stop/continue decisions, and detached-run drain during unload.

## add-context-provider

Mount the exact contributor after its required services: instructions, time, tmux, file reference/local search, or session reference. Configure roots, byte/result budgets, time zone, polling, and symlink behavior rather than relying on another version's defaults. Assemble in the intended agent/session scope and inspect the Session-visible context source/metadata. Mutate the underlying file/time/session when applicable, verify refresh/invalidation, then unload and prove timers/watchers/providers stop.

## cross-side and failure checklist

- Host source imports the primary package entry. Browser source imports only declared `./client` entries; Remote/Typert registration runs on both sides.
- All scoped registrations, watchers, timers, subprocesses, jobs, children, and workflow runs have a disposer or owning scope.
- Abort signals reach owned asynchronous resources, and promises settle only after cleanup.
- Session-visible facts are reconstructible from canonical events/projections; UI-only cards and caches are not authority.
- Profile load plus one observable behavior is required. Type compilation, exported symbols, package README examples, and unit tests remain supporting evidence, not runtime proof.
