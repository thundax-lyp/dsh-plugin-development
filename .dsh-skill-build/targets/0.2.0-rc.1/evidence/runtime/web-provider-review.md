# Web provider/service/tool review

## Target and source

Target checkout: `dsh-v0.2.0-rc.1`, commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`. This review used public code and published declarations first, then an independent consumer package under `evidence/tests/web-provider-consumer/`. No earlier generated Skill or moving branch supplied API facts.

| Concern | Exact checkout source |
| --- | --- |
| Public service, registration, execution-time selection, duplicate rejection, max-results cap | `packages/web/web/src/index.ts` |
| Public search/fetch provider and request/result types, closed fetch-body union, error class | `packages/web/web/src/types.ts` |
| Model tool config, defaults, enabled-tool registration | `packages/web/tool-web/src/index.ts` |
| `web_search` query validation, parallel service calls, JSON output, render/meta projection | `packages/web/tool-web/src/search.ts` |
| `web_fetch` request, result schema, text conversion, JSON output, render/meta projection | `packages/web/tool-web/src/fetch.ts` |
| Built-in provider composition and Web app preset override | `packages/bundle/base/cordis.patch.yml`, `packages/bundle/web-app/cordis.patch.yml`, `packages/bundle/web-app/presets/standard.patch.yml` |
| Existing provider lifecycle and integration gate | `packages/web/web/tests/web.spec.ts`, `packages/web/tool-web/tests/integration.spec.ts` |

Base config pins `searchProvider: deepseek-official` and `fetchProvider: http`. The Web app disables the Host root `tool-web` row and puts `tool-web` in agent presets. A custom provider therefore needs explicit `web` selection override plus its Loader row; registering alone does not change the configured choice. `WebRuntime` resolves at execution time, with separate search/fetch registries and no registration-order preference. The tool layer registers independently; enabled tools remain visible when providers are unavailable.

## Independent consumer validation

- Fixture package `dsh-example-corpus-web@0.0.1` declares exact rc.1 Web peer and dev dependencies. `npm install --ignore-scripts --no-audit --no-fund` installed 28 packages into its own `node_modules`; `npm run build` (TypeScript `NodeNext`, strict) exited 0 against published declarations. Its provider reads only a two-entry local corpus; no external network calls were needed.
- `node smoke.mjs` exited 0 using real `Context`, `SystemPrompt`, `ToolRuntime`, `WebRuntime`, `ToolWeb` and `ctx.tools.execute()`. It observed successful `web_search` and `web_fetch` tool results, service truncation to `maxResults: 1` with `truncated: true`, pre-aborted signal propagation, custom unknown-URL `WebError`, provider-fiber disposal, direct configured-missing error after disposal, and `web_search` structured tool error code `WEB_PROVIDER_CONFIGURED_MISSING` after disposal. This was not a mocked tool registry.
- `npm pack --dry-run --json` exited 0 and listed only `cordis.patch.yml`, `lib/index.js` and `package.json`.
- With a fixture-local `DSH_HOME`, `dsh --profile web-corpus-smoke --from-default-profile web --dump-config` initialized an isolated Profile. `dsh plugin --profile web-corpus-smoke add <fixture>` exited 0. Its config dump showed `web` changed to `searchProvider: example-corpus`, `fetchProvider: example-corpus`, and a new `example-corpus-web` Loader row. The Host root `tool-web` row remained disabled and preset rows remained present, as expected.
- `dsh --profile web-corpus-smoke --no-open --port 43884` started a Web server and the port was observed listening. No browser tab or model Session tool invocation was made. The process was stopped; no port listener remained.
- `dsh plugin --profile web-corpus-smoke remove dsh-example-corpus-web` exited 0. The subsequent dump restored Base selection (`deepseek-official`, `http`) and removed the custom row. This differs from the independent smoke: its explicitly fixed `example-corpus` service reports configured-missing after provider disposal, whereas the Profile restores its Base patch when the package is removed.

## Limits and disposition

The example corpus is deterministic training data for the extension seam, not a web search backend. It does not validate external credentials, provider network policy, redirect rules, response size limits, slow-request cancellation, retries or dynamic availability changes. The Profile config dump and listening server verify patch composition and boot, but do not independently observe the plugin fiber's provider calls inside that Profile; browser and model-session `tool/call`/`tool/result` replay were not tested. The independent tool registry run proves canonical tool execution and structured errors for this fixture, not a full agent turn. The source establishes timeout config and policy wiring; this fixture did not execute the timeout policy.
