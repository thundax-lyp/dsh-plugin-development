# Infrastructure, composition, and provider guardrails

## Choose the public seam before an implementation

Import the contract package when implementing or consuming a capability, then mount exactly one provider in the Profile or preset composition. Stable seams in this group are `AttachmentStore`, `CredentialProvider`, `AuthorizationService`, `FileSystem`, `LspService`, `McpResourceRuntime`, `PtcRuntime`, `SandboxProvider`, `SandboxPolicyService`, `ShellExecutor`, `SpillStore`, `Storage`, `SubprocessRuntime`, `WebServer`, and `WebhookRuntime`. Local, SSH, sandbox, stdio, SQLite, JSON, Node, or experimental packages are provider choices, not portable contracts.

Cordis owns registrations as effects. Retain and return/await every disposer supplied by `register`, `mount`, `watch`, route registration, Remote binding, webhook registration, or provider selection. Unload must first stop admission, then cancel owned live work, then await cleanup. An `AbortSignal` cancels the named operation; it does not undo an external side effect already delivered.

## Package and bundle declaration

Use `DshPackageManifest` from `@deepseek-ai/dsh-package-manifest` as the author declaration shape. A distributable bundle declares:

```json
{
  "name": "@example/dsh-plugin-demo",
  "version": "1.0.0",
  "engines": { "dsh": "0.2.0-rc.2" },
  "dsh": {
    "manifestVersion": 1,
    "bundle": { "patch": "./cordis.patch.yml" }
  }
}
```

The declarations are static types, not validation. The current installer/loader does not universally enforce `engines.dsh`; still declare a truthful range and test against the exact target. Patch paths are package-root-relative and an array is applied in order as one bundle layer.

A bundle patch is a list of patch operations: use `- insert:` with nested Cordis rows to add plugins; a bare top-level row is not an insertion. Each inserted row needs a stable `id`, a resolvable `name`, complete `config`, and every required service in `inject`. Missing injected services leave the fiber `PENDING`. A later patch replacing `config` replaces that whole object, so restate every owned key. Do not copy the shipped `base` or `web-app` composition; layer the smallest bundle over an existing Profile.

## Capability-specific boundaries

The following sections separate contracts whose dependencies, resource owners, and failure modes differ. Their exact task-facing public objects are listed in [the selected surface](api-infra-runtime-surface.md).

## Attachment 与 credential 所有权

Attachments publish durable refs, never browser URLs, temporary host paths or base64 payloads in Session facts. Forward cancellation on reads; do not tie object deletion to one Session. Credentials store secret values behind `CredentialRef`; never persist plaintext in plugin settings or Session logs. Authorization flows must be unregisterable and cancellation-aware.

File-capable attachment providers must override the base class's unsupported file methods, stream with backpressure, and verify bytes while reading. A rejected image batch publishes no refs, though earlier content-addressed objects may remain unreachable. Credential providers own serialized record modification and emit updates after the write commits; record list and description surfaces must not reveal values. An authorization flow owns its registered disposer separately from an active attempt: a declined human prompt cancels the attempt, while a prompt's own signal can withdraw only that prompt. Await `session.commit` before reporting authorization. The [provider shapes](api-infra-runtime-surface.md#attachment-persistence-and-credential-records) spell out these contracts.

## Filesystem、storage 与 spill

Filesystem callers cap `readBytes`, branch on `FsError.code`, use expected versions for compare-and-write, and await the close function returned by `watch`. Storage callers own and close `Domain` handles. Do not couple a plugin contract to JSON/SQLite unless the plugin explicitly requires that provider. Persist a `SpillRef`, not a guessed provider pathname.

A named storage backend contributes both its registry name and lifecycle service. Remove the name before closing the backend; the registry disposer does not release the medium. Each resolved KV write is durable, but the unit does not serialize concurrent writes, so a direct caller supplies ordering. Close opened units and then the backend; a Domain caller instead awaits `Domain.close()`. See the [backend signatures](api-infra-runtime-surface.md#backend-storage-and-process-handles).

## Shell、subprocess 与 sandbox

Subprocess, shell and sandbox callers distinguish request cancellation from confirmed process exit. Await the provider's termination/quiescence contract. Never infer that `sandboxMode` means enforcement succeeded; retain returned enforcement/denial facts. SSH is a provider boundary, not another portable shell contract.

For a published subprocess handle, `done` observes command outcome while `waitForExit` observes the managed process range; await the latter after termination when survivors matter. Own piped streams and keep independent byte offsets for collected reads. A shell execution offers foreground `result()` and background `done`/output/kill; nonzero exit, timeout and abort are foreground result facts, while infrastructure failure can reject `result()`. Treat the runner's `ConfinedArgv` evidence as part of the decision: classify runner failure before denial, and never run original argv after confinement failed. The [handle and confinement shapes](api-infra-runtime-surface.md#backend-storage-and-process-handles) give the public members.

## LSP、MCP 与 PTC

MCP, LSP and PTC are carrier or execution boundaries. Propagate cancellation, bound input/output, and dispose streams/connections. Keep one canonical JSON value across model tools; carrier prose is not an API. Ordinary plugin tools enter PTC through the normal tool registry and do not add a second integration.

PTC bindings accept and return JSON values. Read `PtcRunResult.error` after `run`: program exception, timeout, abort, worker exit and sandbox unavailability are distinct resolved failure facts. The [PTC request and result shapes](api-infra-runtime-surface.md#ptc-bindings-and-confinement-evidence) define the boundary.

## Web route 生命周期

`WebServer` has one fallback seat and no built-in TLS/auth/origin policy. Exact/prefix route names are deployment-wide collision domains; dispose registrations and contain handler failure to the request or socket.

## Webhook 生命周期

Webhook `dispatch()` is fire-and-forget. Rule disposal is awaitable because it first stops admission, then aborts and drains active deliveries.

## Browser 与 computer provider 选择

Browser/computer-use registries select one provider only. Experimental providers require explicit activation and retain experimental status; cancellation cannot reverse an already-issued browser or desktop action.

## Preset 与 Typert Remote

Preset definitions are live Loader trees with revision lifetime. Do not keep service objects after releasing the owning preset scope. Typert streams and generated Remote contributions are effect-owned; iterate or dispose them and never hand-author the wire envelope.

## Cross-side rules

Host packages execute runtime work. Client packages declare `dsh.client`, export their Client entry, and cannot import Host implementations into the browser. Typert-generated `./typert` Host artifacts and `./remote` Client artifacts bridge the sides. A Remote stream holder must iterate or dispose it. UI/settings/session-format details belong to their respective Client, Settings, or Session owners; composition only wires them together.

## Validation

At minimum, validate package exports and declaration compilation, run `dsh plugin --profile <name> add <package>` in an isolated `DSH_HOME`, inspect `dsh --profile <name> --dump-config`, boot that Profile, assert every intended row becomes active rather than `PENDING`, observe one capability call, remove the bundle with `dsh plugin --profile <name> remove <package>`, and assert routes/providers/watchers/processes/streams are gone after reload or restart. Split Host and Client builds. For native, SSH, browser, desktop, MCP and Remote providers, add an actual environment smoke and inspect its actual behavior.

## Cordis plugin lifecycle and composition

Use the [Cordis lifecycle signatures](api-infra-runtime-surface.md#cordis-lifecycle-public-api) for every Host plugin. An author exports a function, class, or object `apply(ctx, config)` entry; `inject` declares required services, and an exported Standard Schema `Config` validates values before startup. `ctx.plugin(child)` and `ctx.inject(deps, callback)` return fibers that can be awaited for activation. A fiber with missing services is `PENDING`, not failed, and can activate after a provider appears. Config validation or startup failure produces `FAILED`; inspect the fiber/Loader diagnostic instead of assuming activation from a parsed patch.

A `Service` subclass calls `super(ctx, key)` and augments Cordis `Context` with that key. Cordis registers it as an effect; unloading removes the service, which can in turn unload dependent fibers. Wrap timers, process handles, remote connections and other non-Cordis resources in `ctx.effect`, returning synchronous or async cleanup. Effect cleanup runs on explicit disposal, dependency loss, HMR or parent unload. Within one effect, disposers run in reverse order and async cleanup is awaited; if separate effects require strict sequencing, use one disposer that performs and awaits the sequence. `fiber.dispose()` is the completion boundary. A caller abort signal must still be forwarded to owned work; unloading a fiber does not undo external actions already delivered.

A bundle `cordis.patch.yml` is a `PatchOptions[]`, so adding a plugin requires `- insert:` and nested `EntryOptions` rows. Stable row IDs support later override/reload. A row's `inject` expresses Loader dependencies, while `dsh.client.inject` in `package.json` names Client packages; these declarations have different meanings. Parent/child service isolation and configuration intercepts are available through Cordis contexts; use them only when the Profile needs separate provider instances or controlled per-plugin config.
