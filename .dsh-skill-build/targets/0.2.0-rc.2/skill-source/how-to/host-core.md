# Host/Core end-to-end tasks

These paths compose the contracts in [Host/Core API guardrails](api-host-core.md) and the [selected public surface](api-host-core-surface.md). They are pinned to `dsh-v0.2.0-rc.2`.

## register-host-tool

1. Add target-version dependencies on `@deepseek-ai/cordis`, `@deepseek-ai/dsh-system-prompt`, and `@deepseek-ai/dsh-tools`.
2. Mount `system-prompt` before `tools`; use `mode: native` first unless a PTC runtime is also mounted.
3. Export a Cordis plugin with `inject = ['tools']` and register the complete `defineTool()` example from the guardrail.
4. Make `execute` return the declared canonical JSON value, forward `exec.signal`, and wait for owned work. Put human/model prose in `output.render`, and keep presentation functions pure.
5. Exercise invalid args, success, thrown failure, abort, and unload. In a real agent Session, observe paired `tool/call` and `tool/result` events; after unloading, the schema must disappear.

Completion means the Host example compiles against the target checkout, a Profile loads it, one agent call returns the declared value/rendering, cancellation settles, and disposal removes it. Static schema inspection alone is not completion.

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
