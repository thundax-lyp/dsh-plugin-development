# Host/Core and agent-execution evidence

Target: `@deepseek-ai/dsh-agent@0.2.0-rc.2`, tag `dsh-v0.2.0-rc.2`, commit `639ed015397290b3745d163aafe02ffee4aa3f84`.

This investigation covers `packages/core`, `context`, `llm`, `session`, `session-query`, `interaction`, `goal`, `plan`, `jobs`, `skill`, `workflow`, `subagent`, `hooks`, `guard`, `feedback`, and `todo`. It does not use the existing generated Skill as input.

## Evidence order

1. Package `exports`, public TypeScript declarations, implementation and direct JSDoc.
2. Package tests, bundle/preset patch files, repository checks and executable examples.
3. Package READMEs, `docs/architecture.md`, owning `docs/subsystems/*.md`, and cookbooks.

The machine-readable result is [recommendations.json](recommendations.json). It contains one proposed disposition for all 90 in-scope capability candidates, all 180 export candidates, 1,705 symbol candidates, 3,493 directly declared member candidates, and all 167 in-scope documentation-task candidates. It also contains 20 claims and 12 composed task paths. These are recommendations for the main agent's shared ledgers, not frozen decisions.

## Public seams that matter to plugin authors

| Seam | Public owner | Plugin task | Primary behavioral evidence |
| --- | --- | --- | --- |
| Agent creation and loop | `@deepseek-ai/dsh-agent`, `@deepseek-ai/dsh-agent-loop` | Create/resume agents, inject/steer/follow up, and own cancellation | `packages/core/agent/src/index.ts`, `packages/core/agent-loop/src/agent.ts`, `packages/core/agent-loop/tests/*` |
| Durable session | `@deepseek-ai/dsh-session` | Append typed durable events, fork, and bind persistence | `packages/core/session/src/index.ts`, `packages/core/session/tests/*` |
| Prompt/context | `@deepseek-ai/dsh-system-prompt` plus `packages/context/*` | Contribute scoped sections, variables, tool schemas, and request context | `packages/core/system-prompt/src/index.ts`, context package tests |
| Tools | `@deepseek-ai/dsh-tools` | Register canonical typed tools and policy/presentation hooks | `packages/core/tools/src/index.ts`, `docs/cookbook/adding-a-tool.md`, tools tests |
| LLM | `@deepseek-ai/dsh-llm` | Register providers/adapters and model directory entries | `packages/llm/llm/src/index.ts`, `docs/cookbook/adding-an-llm-adapter.md`, adapter tests |
| Session derived state | `@deepseek-ai/dsh-session-projection`, `@deepseek-ai/dsh-session-query` | Fold durable events and query live/cold sessions | package sources/tests and `docs/subsystems/session-{projection,query}.md` |
| Human interaction | commands, approval, questions | Add human commands, approval answerers, and durable questions | package sources/tests and `docs/subsystems/{commands,approval,user-questions}.md` |
| Goals/jobs/skills | corresponding service packages | Add durable goal state, background work, or Skill providers | package sources/tests and owning subsystem docs |
| Delegation/workflow | subagent and workflow packages | Register providers, delegate children, and run bounded workflows | runtime/provider sources, lifecycle tests, real-composition patch files |
| External hooks | `@deepseek-ai/dsh-hook-protocol` | Execute and merge Claude Code/Codex hook processes | hook protocol sources/tests plus adapters |

## Important exclusions and conflicts

- `Session.eventAt()`, `Session.snapshotEvents()`, and `Session.ownEvents()` are public but explicitly deprecated for new calls. The generated Skill should route new work through projections and SessionQuery.
- `./internal` and `./invariant` subpaths are published for repository/runtime composition needs but are not normal plugin-author APIs. They remain in the ledger with concrete exclusion reasons.
- `dsh-session-format-v0-to-v1` through `v3-to-v4` are historical restoration migrations. A plugin mounts/uses the format catalog and persistence service; it does not import a migration directly for new functionality.
- The first-party DeepSeek/pi-ai adapters, context providers, commands, tools, projections, and provider packages are useful composition choices and implementation evidence. They are merged under canonical extension seams instead of becoming duplicate API topics.
- A package README or export proves availability, not default mounting. Actual bundle/preset patch files are the default-composition evidence.
- No candidate in the generated API inventory is marked deprecated at the symbol/member level except declarations whose source JSDoc is reflected in the candidate data; synchronous Session methods require manual exclusion because class-member discovery does not always carry inherited JSDoc context.

## Verification evidence used

- Direct package tests cover validation, scope disposal, cancellation, projection folding, restore, provider registration, child lifecycle, workflow settlement, and hook runner errors.
- `packages/bundle/base/cordis.patch.yml`, `sdk-app`, `sdk-minimal`, `web-app`, and web-app preset patches show real combinations and load order.
- The repository cookbooks contain compilable tool authoring and LLM adapter shapes. The draft repeats only the minimal complete tool example and links other contracts by evidence path.

## Not covered

- No isolated consumer project or target-tag TypeScript example compilation was run for this draft.
- No live provider request, credentials flow, browser Client/Remote call, ACP/Codex/Claude/DSH-SDK subprocess, or crash/restart persistence run was performed.
- These files do not prove the generated Skill as a whole, and they do not update shared coverage, API surface, claims, manifest, routing, or maintenance files.
