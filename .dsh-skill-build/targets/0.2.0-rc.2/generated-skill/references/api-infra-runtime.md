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

A Cordis row needs a stable `id`, a resolvable `name`, complete `config`, and every required service in `inject`. Missing injected services leave the fiber `PENDING`. A later patch replacing `config` replaces that whole object, so restate every owned key. Do not copy the shipped `base` or `web-app` composition; layer the smallest bundle over an existing Profile.

## Capability-specific boundaries

The following sections separate contracts whose dependencies, resource owners, and failure modes differ. Their exact task-facing public objects are listed in [the selected surface](api-infra-runtime-surface.md).

## Attachment 与 credential 所有权

Attachments publish durable refs, never browser URLs, temporary host paths or base64 payloads in Session facts. Forward cancellation on reads; do not tie object deletion to one Session. Credentials store secret values behind `CredentialRef`; never persist plaintext in plugin settings or Session logs. Authorization flows must be unregisterable and cancellation-aware.

## Filesystem、storage 与 spill

Filesystem callers cap `readBytes`, branch on `FsError.code`, use expected versions for compare-and-write, and await the close function returned by `watch`. Storage callers own and close `Domain` handles. Do not couple a plugin contract to JSON/SQLite unless the plugin explicitly requires that provider. Persist a `SpillRef`, not a guessed provider pathname.

## Shell、subprocess 与 sandbox

Subprocess, shell and sandbox callers distinguish request cancellation from confirmed process exit. Await the provider's termination/quiescence contract. Never infer that `sandboxMode` means enforcement succeeded; retain returned enforcement/denial facts. SSH is a provider boundary, not another portable shell contract.

## LSP、MCP 与 PTC

MCP, LSP and PTC are carrier or execution boundaries. Propagate cancellation, bound input/output, and dispose streams/connections. Keep one canonical JSON value across model tools; carrier prose is not an API. Ordinary plugin tools enter PTC through the normal tool registry and do not add a second integration.

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

At minimum, validate package exports and declaration compilation, parse the bundle patch through the exact target Loader, boot a disposable Profile, assert every intended row becomes active rather than `PENDING`, observe one capability call, unload the bundle, and assert routes/providers/watchers/processes/streams are gone. Split Host and Client builds. For native, SSH, browser, desktop, MCP and Remote providers, add an actual environment smoke or mark that lane Not Covered.
