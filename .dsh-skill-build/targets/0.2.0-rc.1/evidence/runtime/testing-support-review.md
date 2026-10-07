# Test-support packages review — dsh-v0.2.0-rc.1

Exact checkout: `4878cdabd87d4041bdaff61d04c966883b9fd07a`. Scope: published root exports and plugin-author consumer tests. No shared ledgers edited.

## Per-package disposition candidates

| Package | Exact-code evidence | Candidate disposition |
| --- | --- | --- |
| `@deepseek-ai/dsh-agent-loop-testkit` | `packages/test-support/agent-loop-testkit/package.json`; `src/index.ts` exports `mountAgentLoopTestDependencies`, `mountAgentLoopTestHarness`, Inbox stubs. Prerequisites are real LLM, Session, Projection, Prompt, Tool, Agent services; harness mounts production AgentLoop and calls `create`/`claim`. | Include distinct Host AgentLoop Inbox task via `how-to-test-agent-loop-inbox.md`. Requires caller-owned adapter and cleanup. |
| `@deepseek-ai/dsh-client-test-runtime` | `packages/test-support/client-runtime/package.json`; `src/index.ts` exports `SlotTestRuntime`, UI doubles and `TestClient`; `SlotTestRuntime.create()` mounts real Slots and renderer. | Source-workspace Client Slot task in `how-to-test-client-slot-plugin.md`; independent npm consumer compiles but fails Vitest module collection due missing renderer source file in published dependency. Not currently a verified installed-consumer path. |
| `@deepseek-ai/dsh-loader-smoke` | `packages/test-support/loader-smoke/package.json`; `src/index.ts` exports `runLoaderSmoke`, which invokes real bin with isolated DSH homes, process timeout, stdout/stderr/exit-code checks and temp cleanup. | Conditional Host Profile task in `how-to-smoke-test-loader-profile.md`, requires project-owned bin/config/driver. No isolated Profile run here. |
| `@deepseek-ai/dsh-remote-mock` | `packages/test-support/remote-mock/package.json`; `src/index.ts` exports `RemoteMock`, `ok`, stream helpers; `remote-mock.ts` implements decoded `ClientConnectionRpc` and unmatched accounting. | Include concrete task HOW-TO for Client Remote tests. Isolated npm consumer passes below. |
| `@deepseek-ai/dsh-session-snapshot` | `packages/test-support/session-snapshot/package.json`; `src/index.ts` explicitly imports Vitest-backed `suite.ts`, exports ACP launcher, scenario/snapshot and normalization utilities. | Explicit exclusion from generic plugin testing task: build-static ACP corpus/expected snapshots and Vitest runner are required; relevant only to ACP release compatibility suite, not ordinary Cordis plugin behavior. No isolated run. |
| `@deepseek-ai/dsh-llm-mock-server` | `packages/test-support/llm-mock-server/src/index.ts` exports `startMockLlmServer`, sequence behaviors, loopback `baseURL`, captured `requests`, idempotent `close`. | Include distinct LLM adapter fault-test task, `how-to-test-llm-adapter-faults.md`; separate server test passed, adapter behavior untested. |
| `@deepseek-ai/dsh-llm-replay` | `packages/test-support/llm-replay/src/index.ts` derives scripted chunks from recorded Session V3 streams and explicit compaction marks; throw/hang need override. | Merge with specialized snapshot corpus boundary, exclude from general live plugin test tasks. |

All seven package manifests have root `exports` and `publishConfig.access=public` at version `0.2.0-rc.1`; public package does not imply every test tier has been independently exercised here.

## Independent consumer

Fixture: `evidence/tests/remote-mock-consumer` outside target checkout, `npm install --ignore-scripts --no-audit --no-fund` installed 16 packages; `npm run smoke` passed TypeScript compile and Node execution. Observed `mock.rpc.call('/api','notes/lookup',{args:[{id}]})`, success and failure envelopes, recorded request and `assertNoUnmatched`. No real Connection plugin, generated Remote namespace proxy, Host, browser or Profile was run.

Fixture: `evidence/tests/agent-loop-testkit-consumer`, independent npm install added 28 packages; `npm run smoke` passed TypeScript compile and Node execution. Production harness created an Agent, appended and claimed one Inbox message, and persisted two `agent/inbox/spliced` Session events. Initial assertion incorrectly expected `agent/inbox/claimed`; observed runtime and target tests show claim persists another splice. No LLM adapter or model turn was exercised.

Fixture: `evidence/tests/client-test-runtime-consumer`, independent npm install added 204 packages; `npm run build` passed. `npm run smoke` failed before any test ran: published `@deepseek-ai/dsh-client-test-runtime/lib/index.js` imports `@deepseek-ai/dsh-client-ui-renderer/src/client/bind.ts`, but renderer package `files` includes only `lib` artifacts and the installed package has no such `src` file. The final script targets only the source spec; Vitest reported one failed suite, zero tests. This is a published package composition failure, not evidence that the Slot lifecycle assertion passed or failed. The target checkout's own source tests use this runtime; no isolated npm jsdom behavior was observed.

Fixture: `evidence/tests/llm-mock-server-consumer`, npm install added 7 packages; `npm run smoke` passed TypeScript compile and Node runtime. First loopback POST returned 429, second streamed `recovered` in two `content_block_delta` SSE frames, and request records preserved `rate_limit`/`success` order. Initial assertion searched for contiguous raw text, which fails because SSE chunks split the word; final test parses deltas. No LLM adapter, retry policy or model Session was run.

An earlier attempted Node runtime import of published `@deepseek-ai/dsh-client-connection/client` failed: its package export points to `lib/client.js`, which begins with `window.__ModuleLoader__.load(...)`; direct named `installConnection` import raised `SyntaxError: ... does not provide an export named 'installConnection'`. The `.d.ts` declares `installConnection`; use it in the browser module composition, or keep Node tests type-only as in the final fixture. This is an important runtime boundary rather than a mock test failure. A first compile attempt also used `ctx.connection` and `ctx.dispose` directly; exact Cordis types expose `ctx.get('connection')` and `ctx.fiber.dispose()` instead. Final fixture avoids Context because it tests the carrier contract only.

## Parent integration candidates

- `api-testing-support.md` ← `skill-source/api-guardrails/testing-support.md`.
- `how-to-test-client-remote-call.md` ← `skill-source/how-to/test-client-remote-call.md`.
- `how-to-test-agent-loop-inbox.md` ← `skill-source/how-to/test-agent-loop-inbox.md`.
- `how-to-test-client-slot-plugin.md` ← `skill-source/how-to/test-client-slot-plugin.md` (source-workspace path; npm consumer compile passed, Vitest collection failed on missing published renderer source).
- `how-to-smoke-test-loader-profile.md` ← `skill-source/how-to/smoke-test-loader-profile.md` (conditional on project bin/config/driver; not run).
- `how-to-test-llm-adapter-faults.md` ← `skill-source/how-to/test-llm-adapter-faults.md` (mock server tested; adapter behavior remains caller-owned).
- Reference route heading: “测试支持包与独立消费测试”; task route headings: “测试 Client Remote 调用”, “测试 AgentLoop Inbox”, “测试 Client Slot 插件”, “Loader Profile 进程测试”.
- Candidate capability packages: five `@deepseek-ai/dsh-*` names in table. Keep specialized package dispositions in coverage ledger; do not mark them runtime validated from the remote-mock smoke.
