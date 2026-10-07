# Infrastructure, composition, and experimental capability evidence

Target: `dsh-v0.2.0-rc.2` at `639ed015397290b3745d163aafe02ffee4aa3f84`.

This evidence was rebuilt from the target checkout. It does not use the previously generated Skill.

## Author-facing capability groups

### Package declaration and composition

- `packages/util/package-manifest/src/types.ts` is the public package declaration owner. `DshPackageManifest` requires `name` and `version`; `dsh.manifestVersion` is optionally `1`; `dsh.bundle.patch` is one path or an ordered path list relative to the package root; `dsh.profile.bundles` is the ordered installed bundle list; `dsh.client` declares platform, informational package dependencies, boot phase, and explicit module externals. These types do not parse or validate JSON and neither the loader nor installer universally enforces `engines.dsh`.
- `packages/bundle/*/cordis.patch.yml` are product compositions, not APIs. They prove realistic order and dependency combinations. `base` owns shared Host capability providers; `headless`, `web-app`, `sdk-app`, and `acp-app` overlay it; `sdk-minimal` is a separate small tree. A plugin bundle should publish its own patch and declare it in `package.json.dsh.bundle.patch`, rather than copying the product bundle.
- Cordis Loader rows use stable `id`, `name`, optional `inject`, `config`, `disabled`, groups and isolation. Loader/HMR owns effect disposal and reactivation. A plugin waiting for a missing injected service is `PENDING`, not failed. Evidence: `docs/cordis-tutorial/06-composition-and-hmr.md`, `vendor/loader`, `vendor/include`, `vendor/group`, `vendor/hmr`.
- `@deepseek-ai/dsh-app-boot` exposes profile and boot utilities, but application boot orchestration is an app-maintainer surface. Plugin authors normally declare a bundle, then let the launcher resolve bundle layers, profile patches and overlays. `packages/boot/plugin-manager` is a management service, not a plugin registration requirement.

### Stable capability seams

- Attachments: `ctx.attachments: AttachmentStore` publishes durable immutable refs only after commit. Reads accept optional cancellation; streamed reads may fail integrity checks during iteration. Batch image admission validates/prepares before publication, avoiding partial batches. The local backend owns transforms, atomic commit and request-image caching. It is retention-neutral and must not delete shared objects on one Session deletion. Evidence: `packages/attachment/attachment/src/index.ts`, `packages/attachment/attachment-local/src/index.ts`, `docs/subsystems/attachment.md`.
- Credentials and authorization: `ctx.credentials: CredentialProvider` stores/refers to secret records while settings carry `CredentialRef`, not plaintext. `ctx.authorization: AuthorizationService` registers effect-owned flows; `begin()` can settle, decline or fail, and `cancel(key)` cancels active work. Flow disposal and service teardown must cancel/drain owned interactions. Evidence: `packages/credentials/*`, `docs/subsystems/credentials.md`.
- Filesystem: `ctx.fs: FileSystem` separates stable `FsTarget` identity from process paths. Whole-byte reads require a caller cap; text mutation may use an expected version; watch resolves only after observation is ready and returns an async close function that must be awaited. `AbortSignal` cancels initialization/I/O but the seam sets no deadline. Errors use `FsError.code`. Evidence: `packages/fs/fs/src/index.ts`, `packages/fs/fs/README.md`, `docs/subsystems/filesystem.md`.
- Subprocess/shell/sandbox: `ctx.subprocess` owns process handles and termination/wait observability; `ctx.shell` resolves then executes shell work; `ctx.sandbox` confines argv under a resolved policy; `ctx.sandboxPolicy` resolves per-Session mode and workspace roots. Cancellation starts provider termination but callers still await quiescence. `local`, sandbox, and SSH implementations are providers, not alternate service contracts. Evidence: `packages/subprocess/*`, `packages/shell/*`, `packages/sandbox/*`, `packages/ssh/*`, corresponding subsystem pages.
- Storage: `ctx.storage` mounts named forms and provider backends with effect disposers. `storage-domain` provides typed domains/tables and an explicit async `Domain.close()`. A plugin owns its domain handle and must close it during teardown; it must not assume JSON or SQLite unless its deployment mounts that backend. Evidence: `packages/storage/*`, `docs/subsystems/storage.md`.
- Spill: `ctx.spill: SpillStore.saveText()` returns a durable locator; the local provider owns private paths and sweeping. Spill policy is an execution wrapper. Consumers persist the `SpillRef`, not a guessed local pathname. Evidence: `packages/spill/*`, `docs/subsystems/spill.md`.
- LSP: `ctx.lsp: LspService` accepts effect-owned providers and cancellation-aware queries. `lsp-stdio` owns child-process connection lifecycle; tool-lsp is a model-facing consumer, not the seam. Evidence: `packages/lsp/*`, `docs/subsystems/lsp.md`.
- MCP: `mcp-client` is a plugin that connects configured stdio or Streamable HTTP servers and adapts discovered tools into `ctx.tools`; `ctx.mcpResources` registers resource providers by server name and returns a disposer. Reconnect, transport cancellation and teardown belong to the connection plugin. Evidence: `packages/mcp/*`, `docs/subsystems/mcp.md`.
- PTC: `ctx.ptcRuntime: PtcRuntime` resolves a `PtcRunRequest` to a provider-private spec and runs it to one `PtcRunResult`; Node and experimental Python packages are providers. A plugin uses tool registration normally; PTC exposes visible tools automatically, so plugin tools do not integrate separately. Evidence: `packages/ptc-runtime/*`, `docs/subsystems/ptc-runtime.md`.
- Web routes: `ctx.webServer` owns exact/prefix routes, exact upgrade routes, one fallback seat and index taps. Each registration returns a disposer. Duplicate routes/fallbacks throw; `0.0.0.0` adds network exposure without TLS, auth or origin policy. Handler failure is contained to the request/socket. Evidence: `packages/host/webserver/src/index.ts`, package README/tests.
- Webhook: `ctx.webhookRuntime.register(rule)` returns an awaitable disposer which first prevents new delivery, then aborts and drains active callbacks. `dispatch()` snapshots matching rules and returns before callbacks settle, containing each failure. The GitHub adapter verifies the raw signed body before parsing and returns 202 after in-memory dispatch. Evidence: `packages/webhook/*`, `docs/subsystems/webhook.md`.
- Runtime invariants and telemetry are optional operational integrations. Invariant installers are effect-owned checks; OTel reporters and product telemetry exporters require shutdown flushing. They do not define plugin functionality and should be referenced only when a plugin exports checks or telemetry.

### Selection registries and experimental providers

- `ctx.browserUse` and `ctx.computerUse` are registration-only singleton registries. They expose the selected provider name, not common browser/desktop operations. `register(name)` rejects a second provider and returns an async disposer. Experimental provider packages must be explicitly mounted; provider startup failure releases registration, while shutdown retains it until tools/resources drain. Cancellation cannot undo browser or desktop actions already delivered. Evidence: `packages/browser-use/browser-use`, `packages/computer-use/computer-use`, `packages/experimental/browser-use-*`, `packages/experimental/computer-use-*`, subsystem pages and loader-composition tests.
- Other `packages/experimental/*` packages are public packages but product-specific or unstable implementations. They are not baseline authoring APIs merely because exported. Use them only for a task that explicitly selects that feature and retain the `experimental` stability label. Agent Team facts cross to the Agent/Core owner; voice and Client UI facts cross to Client/Web.

### Presets and Remote

- `@deepseek-ai/dsh-agent-preset` registers one declarative preset definition; `ctx.agentPresets: AgentPresetRegistry` owns revision scopes, composition trees, mount/select and release. Definitions are plugin rows, not directory scans. A mount rejects import, activation or service-leak audit failures. Retired revisions stay alive while referenced; releasing the final reference disposes their Loader tree.
- Typert is the supported Host/Client Remote mechanism. Host packages expose generated `./typert` and `./remote` subpaths where present. `ctx.typert` registrations are effect-owned; Remote streams must be iterated or disposed; connection loss/cancel terminates them. Plugin authors should follow the Remote cookbook/generator rather than hand-authoring wire envelopes. Evidence: `packages/typert/*`, `docs/subsystems/typert.md`, `docs/cookbook/adding-a-remote-api.md`.

## Cookbook candidate decisions

- `adding-a-package`: include as a maintainer-oriented checklist only where it defines publishable package shape and Host/Client split. Do not copy repository-only root config/CI steps into a consumer plugin guide.
- `adding-a-tool`: merge into the tool-authoring owner; this group contributes composition, sandbox/subprocess, spill and PTC cross-links only.
- `adding-an-llm-adapter`: cross-owner with LLM; this group contributes credentials, package/bundle and provider lifecycle links.
- `adding-a-remote-api`: include as the Remote/Typert end-to-end path; Host contract, generated Typert artifacts, Client remote binding, cancellation and stream disposal must be kept together.
- `adding-a-settings-card`: cross-owner with Settings and Client/Web; this group contributes package `dsh.client`, Remote transport and bundle composition only.
- `adding-a-session-format-version`: exclude from plugin-development task routing. It is repository persistence-maintenance work, not an external plugin extension point.

## Verification evidence and limits

Source-backed gates include package workspace constraints, declaration builds, Loader composition tests, subsystem behavior tests, and generated Typert checks. This investigation did not execute those tests, compile an isolated consumer, boot a Profile, establish an MCP/SSH/SDK/Remote connection, or exercise native/experimental providers. The draft therefore gives executable validation criteria but does not claim those runtime lanes passed.
