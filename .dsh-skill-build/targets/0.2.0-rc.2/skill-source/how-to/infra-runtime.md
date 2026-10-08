# HOW-TO: package, compose, and extend infrastructure plugins

Use the [infrastructure contract](api-infra-runtime.md) for lifecycle and security boundaries and the [public object reference](api-infra-runtime-surface.md) for the selected signatures. All commands and paths here target `dsh-v0.2.0-rc.2`. A Profile layer is a **patch list**, whereas a Cordis source `cordis.yml` is an entry list; do not put bare plugin rows at the top level of a bundle patch.

## Package and activate a bundle

The smallest independent Host bundle contains these three files. This JavaScript example avoids a repository build dependency; TypeScript packages must publish built JS and declarations and declare shared Cordis/DSH packages as peers.

`package.json`:

```json
{
  "name": "dsh-observe-demo",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "files": ["index.js", "cordis.patch.yml"],
  "engines": { "dsh": "0.2.0-rc.2" },
  "dsh": { "manifestVersion": 1, "bundle": { "patch": "./cordis.patch.yml" } }
}
```

`index.js`:

```js
export const name = 'observe-demo'
export function apply(ctx) {
  console.log('observe-demo active')
  ctx.effect(() => () => console.log('observe-demo disposed'))
}
```

`cordis.patch.yml`:

```yaml
- insert:
    - id: observe-demo
      name: dsh-observe-demo
      config: {}
```

1. Pack or place this directory beside the shell. Set a temporary `DSH_HOME` for an isolated consumer, then run `dsh plugin --profile demo add ./dsh-observe-demo` from its parent. The CLI initializes a base-backed Profile, installs the package and adds its bundle name to `dsh.profile.bundles`. A package without `dsh.bundle` is installed only as a dependency and adds no layer.
2. Run `dsh --profile demo --dump-config` and inspect the `dsh-observe-demo` layer and `observe-demo` row. Boot with `dsh --profile demo`, observe the activation log, and inspect Loader fibers if it is absent. A missing required `inject` leaves a row `PENDING`; an invalid `Config` or module import can fail activation. Inspect `skippedBundles` or the launcher's skip diagnostic when a bundle did not load.
3. Run `dsh plugin --profile demo remove dsh-observe-demo`. Bundle membership changes take effect on the next Profile start, so stop and restart the Profile after removal even when HMR is enabled. Observe disposal and confirm the row disappears from the config dump. Do not treat a successful install as proof of activation.

The `dsh plugin` command needs `pnpm` on `PATH`. A `dsh.bundle.patch` may be an ordered array of package-relative files. `dsh.profile.bundles` orders layers, then the Profile patch, home patch and `--patch` overlays apply. An `id` override replaces a row's whole `config`; restate keys the row still needs. A Client half needs `dsh.client` with `platform: "web"`, an exported `./client` entry and a separate Client build. `dsh.client.inject` names package dependencies for module loading; it is not Cordis service injection.

## Implement or consume an infrastructure provider

1. Pick one public capability contract, then check the provider's declared service key and `static inject` in the exact target. Put the provider row and consumer row inside the bundle's `insert` list. The consumer declares required Cordis services in its plugin `inject`; Loader activation follows service availability rather than list order. Use an `id` and complete `config` for each row.
2. Implement the target contract's complete methods and declared failure types, or consume an existing provider. This is provider-specific: `FileSystem` uses `FsTarget` and `FsError.code`; `Storage` separates named forms and closeable `Domain` handles; `ShellExecutor` resolves requests before execution; `McpResourceRuntime.register` returns a disposer. Follow each linked public type rather than adapting the sample bundle's log-only plugin into a pretend DSH provider.
3. Own every registration and live resource in a Cordis effect. Stop admission on unload, propagate cancellation, then await teardown of watches, subprocess handles, domains and connections. Do not equate signal abort with confirmed external process exit. Persist durable attachment or spill refs rather than local backend paths; persist credential references rather than secrets.
4. In an isolated Profile, inspect all rows for `ACTIVE`, invoke one consumer operation, exercise a documented error or cancellation path, remove the bundle and verify no callback or resource survives. The generic bundle above proves package activation only; provider behavior requires the chosen contract's tests and actual runtime environment.

### Provider contracts and lifecycle checks

For each seam, use the following contract-specific call and completion check. An implementation of an abstract service must satisfy **all** its abstract methods and public nested types; a single line here does not substitute for that declaration.

- **Attachment:** `ctx.attachments.saveImages(inputs)` returns ordered durable refs; `saveFile`/`saveFileStream` publish file refs only when a file-capable provider overrides the base unsupported behavior. Read images or files with cancellation; a streaming provider applies backpressure and verifies bytes while reading. Test over-limit batch rejection before Session publication, a streamed file round trip, mid-read abort, and a committed ref after Session removal. Source: `packages/attachment/attachment/src/index.ts`.
- **Authorization:** Register a flow with a credential key, label, ordered nonempty methods and `run(session)`; retain the `registerFlow` disposer. Start `begin({ key, method?, interaction, signal? })` with an interaction that can notify and prompt, and await `session.commit(record)` before success. Test a human decline, a single withdrawn prompt, cancellation of the whole attempt, and flow removal while a prompt is pending. Source: `packages/credentials/authorization/src/index.ts` and `src/types.ts`.
- **Credentials:** `ctx.credentials.resolve(ref)` returns a secret or `undefined`; `set`/`unset` manage reference values. A complete provider also implements record read, metadata/list, serialized `modifyRecord` and delete; publish update notifications only after persistence. Store only `CredentialRef` in settings. Test missing, set, resolve, unchanged mutation, record listing without secret values, delete and post-commit observation without printing a secret. Source: `packages/credentials/credentials/src/index.ts`.
- **Filesystem:** `resolve(path, opts?)` yields `FsTarget`; `readBytes(target, signal, maxBytes)` requires a byte cap; `watch(target, changed, signal)` yields an async close function. Test target resolution, a capped read, expected-version write conflict, cancellation and awaiting watcher close. Source: `packages/fs/fs/src/index.ts`.
- **LSP:** `registerProvider(provider)` atomically reserves provider ID and file extensions and returns a disposer; `query(request, signal?)` selects by extension and returns a `locations` or `hover` result. Test duplicate extension refusal, one zero-based UTF-16 query, cancellation and release. Source: `packages/lsp/lsp/src/types.ts` and `src/index.ts`.
- **MCP resources:** `register(server, provider)` returns a disposer; the provider's `request(request, exec)` handles only list, template-list and read operations and returns lossless JSON. Test one scoped server read, duplicate name refusal and tool disappearance on disposal. The separate `dsh-mcp-client` package owns transport reconnect. Source: `packages/mcp/mcp-resources/src/index.ts`.
- **PTC:** Supply `program` and JSON-valued binding namespaces to `ctx.ptcRuntime.resolve(request)`, then pass its provider-private spec to the same provider's `run(spec)`. Read `value`/`logs` or the resolved `error` kind; test program exception, timeout, cancellation and sandbox-unavailable result separately. A normal plugin tool does not register with PTC separately. Source: `packages/ptc-runtime/ptc-runtime/src/index.ts` and `src/types.ts`.
- **Sandbox and policy:** Resolve a `SandboxExecutionPolicy`, then use only the `argv` returned by `ctx.sandbox.confine(argv, policy, signal?)`. Inspect `enforcement`, denial signatures and runner-failure rules from the selected backend; classify runner failure before policy denial. Test denial, unavailable runner and failed confinement without an unconfined retry. Source: `packages/sandbox/sandbox-policy/src/index.ts` and `packages/sandbox/sandbox/src/index.ts`.
- **Shell:** Resolve a request and `execute(spec)`; await `result()` for foreground facts, or use `done`, `readOutput()`/`observed` and `kill()` for a background handle. Test nonzero exit, timeout and abort as results, infrastructure failure as a rejected `result()`, and output still readable after exit. Process lifetime may belong to `ctx.subprocess`, so reloading only the shell executor need not kill it. Source: `packages/shell/shell/src/index.ts` and `src/types.ts`.
- **Spill:** `ctx.spillStore.saveText(input)` returns a `SpillRef` only after persistence. Test a successful locator and failed write; never persist its provider-private file path. Source: `packages/spill/spill/src/index.ts`.
- **Storage and domain:** For a named backend, register it through `ctx.storage.backend.register(name, backend)` and provide `storageBackendServiceKey(name)` separately; dispose registration and await `backend.close()`. Open a `KvUnit` through `backend.kv.open(descriptor)`, serialize writes, reopen to verify resolved writes persisted, then close unit and backend. If using a Domain, mount its form, use typed `table(name)` operations and await `Domain.close()`. Test duplicate registration, unsupported `kv`, version mismatch, failed write, durability and teardown. Sources: `packages/storage/storage/src/registry.ts`, `src/backend.ts`, and `packages/storage/storage-domain/src/domain.ts`.
- **Subprocess:** Resolve executable and call `spawn(spec)` or `spawnTerminal(spec)` as separate operations. A synchronous `spawn` throw publishes no handle; once published, own pipes, observe `done`, call `terminate()` and await `waitForExit()` for the managed range. For collect mode, read from an owned byte offset and check `lossy`/`spillPath`. Test missing executable, pre-abort, collected output after exit and range quiescence after cancellation. Source: `packages/subprocess/subprocess/src/index.ts` and `src/types.ts`.

The following first-party providers are separately installed Loader rows behind those seams. Select the row for the process, storage and path authority that the consumer actually needs; the seam package alone does not supply its concrete backend. These are target-version mount contracts, not results of this creation's optional-provider runtime tests.

### File, credential and language providers

| Seam                   | Selectable provider and required composition                                                                                                                                     | Failure or cleanup boundary                                                                                                                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Attachment             | `dsh-attachment-local` stores under `DSH_HOME`; mount with `dsh-attachment`.                                                                                                     | It verifies image/file integrity and does not delete stored objects automatically.                                                                                    |
| Credentials            | `dsh-credentials-local` accepts optional private-record `path`; mount with `dsh-credentials`.                                                                                    | Environment, saved file and `.env` have defined precedence; do not treat the same OS user as a secret isolation boundary.                                             |
| Filesystem             | `dsh-fs-local` accepts `cwd`; `dsh-fs-sandbox` additionally injects `sandboxPolicy`; `dsh-fs-ssh` injects both `ssh` and `sandboxPolicy`. Choose one for the intended namespace. | Local `cwd` does not confine absolute paths. Sandbox write denial is `FS_SANDBOX_DENIED`; SSH transport loss can leave a mutation committed, so do not blindly retry. |
| Filesystem observation | Optional `dsh-fs-observation-policy` guards writes/edits using the Session's prior read and observed version.                                                                    | A resumed Session must re-read before guarded mutation; changed files fail `FS_STALE_VERSION`. It is a policy layer, not another filesystem backend.                  |
| LSP                    | `dsh-lsp-stdio` injects `fs`, `lsp`, `subprocess`; configure nonempty executable/args/extension server rows.                                                                     | Resolution can fail activation; provider pools lazy processes per workspace and closes them on disposal.                                                              |

### Process and confinement providers

| Seam       | Selectable provider and required composition                                                                                                                                                                           | Failure or cleanup boundary                                                                                                                                                 |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PTC        | `dsh-ptc-runtime-node` injects `fs`, `subprocess`, `sandbox`, `sandboxPolicy`; configure execution limits.                                                                                                             | Every run uses fresh Node; restricted mode fails if the sandbox is unavailable.                                                                                             |
| Sandbox    | `dsh-sandbox-local` selects a local platform runner; `dsh-sandbox-ssh` injects `ssh` and confines on the remote host.                                                                                                  | Both fail before launch if enforcement is unavailable. `dsh-sandbox-windows-acl` is a direct Windows API selected internally by the local provider, not another Loader row. |
| Shell      | `dsh-bash-local` or `dsh-pwsh-local` registers `ctx.shell` using fresh non-login/non-profile processes. Choose `dsh-bash-sandbox` or `dsh-pwsh-sandbox` instead when the task requires `sandbox` plus `sandboxPolicy`. | Local variants run with Host authority; sandbox variants must fail when required confinement cannot be supplied. No shell state persists across calls.                      |
| Subprocess | `dsh-subprocess-local` runs on the Host; `dsh-subprocess-ssh` injects `ssh` and should share its remote namespace with SSH filesystem/sandbox.                                                                         | Dispose managed process ranges after local cancellation. SSH transport loss leaves unconfirmed launch state and must not trigger an automatic replay.                       |

### Storage and spill providers

| Seam           | Selectable provider and required composition                                                                                                                                                                                                  | Failure or cleanup boundary                                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Spill          | `dsh-spill-local` accepts optional `root` and `cleanupPeriodDays`.                                                                                                                                                                            | Returned refs are Session scoped; startup sweep is best effort and disposal waits for the sweep.                                          |
| Storage domain | `dsh-storage-json` injects `storage`, requires `root` and registers form `json`; `dsh-storage-sqlite` injects `storage`, accepts a database `path` and registers form `sqlite`. Mount `dsh-storage-domain` and route it to the selected form. | JSON layout and SQLite version errors remain provider specific; SQLite `:memory:` is ephemeral. Close domain handles after queued writes. |

### SSH provider composition

For the SSH choices, mount `@deepseek-ai/dsh-ssh` before matching filesystem, subprocess and sandbox providers when one task needs all three; mixing local paths with remote execution breaks the task's path authority. Both endpoints must run Linux or macOS. Configure an existing OpenSSH alias with strict known-host checking and noninteractive credentials, then set the remote absolute `node`, `helper`, `workspace` and lowercase SHA-256 `helperHash`. A PTC deployment also supplies paired `bootstrapPath`/`bootstrapHash`. Install the matching helper/runtime outside writable workspace and temporary roots. Verify `ctx.ssh.ready` and one remote operation, then dispose the connection and check pending streams join. SSH transport loss leaves the remote outcome uncertain; never retry a possibly committed mutation or launch merely because the connection rejected. Concrete provider configuration and ownership are defined in each package's target README and `src/index.ts` under `packages/{attachment,credentials,fs,lsp,ptc-runtime,sandbox,spill,storage,subprocess,ssh}/`.

## Register a web route and webhook rule

1. Mount `@deepseek-ai/dsh-host-webserver` with explicit loopback `host` and `port` when HTTP is needed, and mount `@deepseek-ai/dsh-webhook` plus its required Agent, preset, permission, title and workspace services when Session creation is needed. The web server is not a webhook adapter by itself.
2. A route plugin injects `webServer`; `ctx.webServer.register({ kind: 'exact', path: '/my-hook', handler })` returns a synchronous disposer. An exact or prefix route with the same key already registered throws. A handler owns the HTTP response. For an external webhook, authenticate the raw request bytes **before** constructing and passing a `VerifiedWebhookDelivery` to `ctx.webhookRuntime.dispatch`. The GitHub adapter is a concrete example, not a generic authenticator.
3. Register a rule with `ctx.webhookRuntime.register({ id, kind, run })`. Its `run(delivery, signal)` returns a `WebhookSessionRequest` or `null`; `dispatch` snapshots the validated delivery, starts matching rules and returns before callbacks finish. Rule callback failures are contained and logged. Keep the returned async disposer and await it on unload: it hides the rule, aborts its signal and drains active callbacks. Dispose the route as well. Test malformed/unauthenticated requests, duplicate route/rule IDs, a successful delivery, and a slow callback during unload.

The `WebServer` provides neither TLS, authentication nor origin policy. Binding `0.0.0.0` changes exposure; add the necessary boundary in the deployment or adapter.

## Compose a preset and a Host to Client Remote

These are related composition mechanisms with separate owners. An ordinary Cordis row mounts `@deepseek-ai/dsh-agent-preset` with `config: { id, plugins }`; that plugin registers a `PresetDefinition` through `ctx.agentPresets.register`. Registration returns an async disposer and `list()` reports a `broken` diagnostic for failed or pending rows. A selected Agent retains its preset revision until released, so removing the definition does not immediately dispose an in-use revision. Verify a preset by registering it, listing it without `broken`, creating and releasing a selected Agent, then unloading the row and confirming old resources drain after the final release.

For a Remote API, use the [dedicated Remote HOW-TO](how-to-client-web.md) for its Host declaration, generated `./typert` and `./remote` exports, Client `remote` and `remote.<namespace>` injections, failure codes and stream disposal. The Host method must use the public Typert protocol types; the Client imports the generated binding. Build generated declarations before Client compilation, invoke a unary method and one cancellation/failure case through the actual connection, then dispose any stream and unmount both contributions. A Profile bundle can carry the Host row, but its YAML cannot stand in for the generated Client binding.

## Select an experimental browser or computer provider

`@deepseek-ai/dsh-browser-use` and `@deepseek-ai/dsh-computer-use` expose singleton provider-selection registries, not a portable browser or desktop command API. Their `register(name)` returns an async disposer and rejects a second live provider. Mount the chosen registry and **one** target-version experimental provider package explicitly in the Profile, along with that provider's own declared dependencies and configuration. Test that its tools appear in a suitable Session and execute one scripted local call; then cancel a call, unload the provider and await cleanup. Cancellation cannot undo actions already delivered to a browser or desktop. The registry alone cannot supply tools, and an experimental package's presence in the repository does not mean it is mounted by default. For example, a bundle patch for a browser provider can insert these rows into a Profile that already supplies Agents, tools and system prompts:

```yaml
- insert:
    - id: browser-use
      name: '@deepseek-ai/dsh-browser-use'
    - id: browser-provider
      name: '@deepseek-ai/dsh-experimental-browser-use-playwright-mcp'
      config:
        mode: launch
        headless: true
```

The provider starts a browser connection for each newly created or resumed Session; reloading it does not adopt already active Sessions. The selected experimental package and its pinned runtime must be installed with the bundle. A computer provider uses `@deepseek-ai/dsh-computer-use` plus one driver package instead. For example, `@deepseek-ai/dsh-experimental-computer-use-cua-driver-mcp` needs an installed `cua-driver` executable and `config: { command: cua-driver, args: [mcp] }`; desktop permissions are provided by that driver. Observe `browserUse.providerName` or `computerUse.providerName`, the Session's discovered tools, one call result and provider-name removal after unload. A non-empty provider name alone does not prove the external browser or desktop operation worked.

| Explicit provider                                               | Mount condition and failure boundary                                                                                                                                                                                                                                                 |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@deepseek-ai/dsh-experimental-browser-use-chrome-devtools-mcp` | Set `mode: launch` and optional `headless`/`executablePath`, or `mode: attach` with a debugging `endpoint`. An attached browser is claimed by one live Session; a busy attachment does not retry within that activation. Unload disconnects but leaves the external browser running. |
| `@deepseek-ai/dsh-experimental-browser-use-playwright-mcp`      | The patch above uses `mode: launch` and `headless: true`. Install its pinned browser runtime and verify a scripted local browser call; registration alone does not establish a running browser.                                                                                      |
| `@deepseek-ai/dsh-experimental-browser-use-stagehand-native`    | Set `mode: launch`, `headless`, and required `model` credentials for a supported Stagehand SDK model. Even navigation needs `model`; startup occurs on the first tool call and fails if its Chrome runtime is unavailable.                                                           |
| `@deepseek-ai/dsh-experimental-computer-use-cua-driver-mcp`     | Supply the external `cua-driver` command and its `mcp` argument; the driver process owns desktop permissions. Verify its tool catalog and cancellation in a permitted local session.                                                                                                 |
| `@deepseek-ai/dsh-experimental-computer-use-cua-driver-native`  | No package config fields. Keep optional native dependencies enabled and grant desktop permissions to the launching Host process. A native crash can terminate that process; activation failure must release the registry slot and tools.                                             |
