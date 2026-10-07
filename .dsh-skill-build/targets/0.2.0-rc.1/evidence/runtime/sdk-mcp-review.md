# SDK/MCP plugin-author review — 0.2.0-rc.1

Target checkout: `dsh-v0.2.0-rc.1`, commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`.

## Source decisions

- `packages/sdk/client/src/index.ts`, `api.ts`, `client.ts`, `types.ts`, `launch.ts`, `dispose.ts`: external SDK client, high/low-level members, owned subprocess, same-version CLI resolution, error and shutdown paths. This is not a Cordis plugin.
- `packages/sdk/server/src/index.ts`, `server.ts` and `packages/sdk/protocol/src/index.ts`, `types.ts`: named runtime service plugin, stdio JSON-RPC methods/notifications and cross-process ownership. The selected Profile supplies model/tool/session behavior.
- `packages/mcp/mcp-client/src/index.ts`, `connection.ts`, `transport.ts`, `tools.ts`, `server-context.ts`: one-server-per-instance configuration, namespace reservation, initial readiness, reconnect/dispose, qualified tool names, canonical result and optional resource/prompt integration.
- `packages/mcp/mcp-resources/src/index.ts`, `tools.ts`: scoped provider registration and three shared resource tools. `packages/bundle/base/cordis.patch.yml` mounts resources in the base composition; custom Profiles must make it available themselves.

## Isolated verification

`evidence/tests/sdk-mcp-consumer/sdk-caller/` was created by extracting the SDK HOW-TO's three fenced files verbatim. `npm install --ignore-scripts --no-audit --no-fund` installed exact `@deepseek-ai/dsh@0.2.0-rc.1` and `@deepseek-ai/dsh-sdk-client@0.2.0-rc.1`; `npm run build` compiled the example with exit code 0. A separate run used the installed public `DeepSeekHarness` with `dshBin` pointed at the target checkout's scripted `packages/sdk/client/tests/fake-runtime.ts`. It completed real child-process JSON-RPC initialize, `session.run`, event collection and `close()`, printing `{"finalResponse":"sdk-smoke","events":4,"notifications":6}`. The fake is a protocol peer, not a real model/Profile; no provider call or persistent Session behavior was observed.

For MCP, the same isolated npm tree had the exact published MCP client/resource packages. `Config({ transport: 'stdio', serverName: 'demo', command: 'node' })` parsed, and `createMcpToolDefinition` was exported. An isolated local server copied from the target checkout's `packages/mcp/mcp-client/tests/fixture-server.ts` was run through the published bridge and Cordis services in `mcp-smoke.mjs`. The first harness attempt lacked `systemPrompt`, so `tools` was unavailable; after mounting the required `systemPrompt` → `tools` → `mcp-resources` composition, it passed: `{"startupTool":"mcp__demo__add","resourceTool":"list_mcp_resources","removedOnUnload":true}`. This proves initial stdio discovery, registration and cleanup on fiber disposal in one process. Tool execution, resource requests, HTTP, reconnect, Profile Loader, Agent permissions, Browser rendering and image admission were not run.

## Parent ledger candidates

- `review-public-package-packages-sdk`: route `package:@deepseek-ai/dsh-sdk-client`, `package:@deepseek-ai/dsh-sdk-jsonrpc-server`, `package:@deepseek-ai/dsh-sdk-protocol` to `api-guardrails/sdk-runtime.md` and `how-to/run-sdk-profile.md`. The direct author task is an external TypeScript caller of `DeepSeekHarness`; the JSON-RPC server and protocol are composition dependencies, not custom-plugin recipes.
- `task:packages/sdk/server/README.zh.md:34`: source-checked runtime service composition belongs in the SDK reference; parent should decide heading disposition against its exact text.
- `review-public-package-packages-mcp`: route `package:@deepseek-ai/dsh-mcp-client` and `package:@deepseek-ai/dsh-mcp-resources` to `api-guardrails/mcp-client.md` and `how-to/connect-mcp-server.md`.
- `task:packages/mcp/mcp-client/README.zh.md:30` and `task:packages/mcp/mcp-resources/README.zh.md:30`: operational connect/resources tasks covered by the MCP reference and HOW-TO, subject to parent task-heading adjudication.

The parent owns all shared claims, coverage, API/member ledger, source-map, routing indexes and formal Skill. This task changed none of those.
