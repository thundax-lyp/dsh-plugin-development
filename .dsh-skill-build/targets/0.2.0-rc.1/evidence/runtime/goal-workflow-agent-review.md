# Goal / Workflow / Agent-loop consumer review — 0.2.0-rc.1

Target checkout: `dsh-v0.2.0-rc.1`, commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`.

## Source decisions

- `packages/goal/goal/src/index.ts`, `types.ts`, `domain.ts`, `fold.ts`: `GoalService` requires an exact live Agent, writes full `goal/change` Session events, exposes revision CAS, durable phase and process-local activation; the projection folds goal state from the log. `goal-round-driver/src/index.ts` separately owns automatic continuation and checkpoint gating. `tool-goal/src/index.ts` adds model-tool authority rules that direct service calls do not inherit.
- `packages/workflow/workflow/src/index.ts`, `runtime-types.ts`, `types.ts`: `WorkflowEngine.start`, holder-owned `WorkflowRun`, nonrejecting result, cancellation/disposal, and observe-only lifecycle events.
- `packages/workflow/workflow-ptc/src/index.ts`, `host.ts`, `runtime.ts`: published provider validates meta/script/provider before publication and executes in the Node PTC process with subagent/sandbox dependencies. This task did not run that provider.
- `packages/core/agent/src/index.ts` and `packages/core/agent-loop/src/index.ts`: `ctx.agents.create`/`resume` delegate to a single loop-registered factory; setup is unpublished composition, returned handle is owner-only disposal capability. The loop's concrete internals were not treated as a custom extension API.

## Independent consumer verification

Fixture `evidence/tests/goal-workflow-consumer/` installed exact published `0.2.0-rc.1` DSH dependencies and Cordis `4.0.4` (`npm install --ignore-scripts --no-audit --no-fund`, 22 packages). It compiled the two service-consumer modules. The first smoke build incorrectly read `session.events`, which is not a public member; the harness was corrected to count published `session/event` edges rather than use the deprecated synchronous `snapshotEvents` API. `npm run smoke` then passed with:

```json
{"goalEvents":2,"phase":"paused","workflowDisposed":true}
```

This used real SessionStore, SessionProjectionRegistry, AgentRegistry and GoalService. A minimal registered Agent stood in for an Agent loop instance; goal create and pause produced two committed `goal/change` notifications and revision 1→2. For the workflow holder it used a clearly local `StubWorkflowEngine` to verify that the consumer awaited a result and disposed the handle. Both HOW-TOs' package/tsconfig/TypeScript blocks were extracted verbatim to `howto-*` subdirectories and independently compiled with exit code 0.

The smoke did **not** run Agent loop creation, persistence, Goal round driver, PTC workflow, subagent delegation, sandbox confinement, actual cancellation, model-visible tool output, user authorization, or restart recovery. The workflow stub is only a consumer ownership check.

## Parent ledger candidates

- `review-public-package-packages-goal` / `review-subsystem-subsystems-goal`: route `package:@deepseek-ai/dsh-goal` and `subsystems:goal` to `api-guardrails/goal.md`, with `how-to/coordinate-goal.md`. `dsh-goal-round-driver` and `dsh-tool-goal` are explained as composition/authority boundaries, but their own configuration and model workflow still require separate adjudication; `command-goal` is not claimed.
- `review-public-package-packages-workflow` / `review-subsystem-subsystems-workflow`: route `package:@deepseek-ai/dsh-workflow` and `dsh-workflow-ptc` to `api-guardrails/workflow-agent-loop.md`, with `how-to/own-workflow-run.md`. `tool-workflow` and `tool-ralph` need separate model-tool/task review.
- `package:@deepseek-ai/dsh-agent-loop` under the core package review: route its public create/resume/setup composition boundary to `api-guardrails/workflow-agent-loop.md`; full Agent lifecycle use still needs independent Profile validation.
- Pending heading candidates for parent: `task:packages/goal/goal/README.zh.md:34`, `task:packages/core/agent-loop/README.zh.md:30`, `task:packages/workflow/workflow-ptc/README.zh.md:30`. Review their exact headings before marking included; the two HOW-TOs cover service consumption, not every model-facing task in those package pages.

Shared manifests, claims, coverage, API/member ledger, indexes, source-map and formal Skill were not edited.
