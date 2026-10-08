# `register-host-tool`: local Agent consumer run

Target: `dsh-v0.2.0-rc.2` at `639ed015397290b3745d163aafe02ffee4aa3f84`. Run performed locally on 2026-10-08; no external provider or service was called.

## Executed path

From the exact checkout root, a one-off Node runner extracted the first TypeScript block of `../skill-source/how-to/host-core.md` into a temporary `apps/cli/scratch-agent-consumer-*/src/my-plugin.ts`. It ran a temporary `verify.mjs` with `node --import tsx`. Both temporary files and their directory were removed in the runner's `finally` block.

The verifier mounted `LlmRuntime`, `SessionStore`, `SessionProjectionRegistry`, `SystemPrompt`, `ToolRuntime`, `AgentRegistry`, and `AgentLoop` on one Cordis `Context`, then mounted the documented `greet-tool` plugin as its own fiber. It registered the checkout's scripted `MockAdapter` under provider `mock`, created a real Agent via `ctx.agentLoop.create(SessionId('agent-consumer-greet'), { provider: 'mock', model: 'mock' })`, and sent a user followup. The adapter's first response requested `greet` with `{ "name": "Ada", "waitMs": 0 }`; its second response supplied the final assistant text. This exercises Agent dispatch, not a direct call to `ctx.tools.execute`.

Assertions checked one `tool/call` and one matching `tool/result` in `agent.session.snapshotEvents()`, two adapter requests, successful result content, and removal of the Tool and schema after `await fiber.dispose()`. The process exited 0 and printed:

```json
{"modelRequests":2,"call":{"type":"tool/call","name":"greet","callId":"greet-call-1"},"result":{"type":"tool/result","isError":false,"content":[{"type":"text","text":"Hello, Ada!"}]},"afterUnload":{"tool":null,"schemaPresent":false}}
```

The exact checkout's `git status --short` was empty after cleanup; `git rev-parse HEAD` returned the commit above.

## Evidence and limit

- Authoring source: `skill-source/how-to/host-core.md`, `register-host-tool` TypeScript block.
- Local scripted provider and chunk constructors: `checkout/packages/core/agent-loop/tests/mock-adapter.ts` (`MockAdapter`, `toolCallResponse`, `textResponse`).
- Agent setup and idle/event pattern: `checkout/packages/core/agent-loop/tests/tool-calls.spec.ts`.
- This proves the documented plugin can be consumed by an Agent Loop with a local scripted provider and that fiber disposal unregisters it. A Web Profile/Loader, live model selection, Web UI, and HMR unload were not run here; the scripted response predetermined the Tool call.
