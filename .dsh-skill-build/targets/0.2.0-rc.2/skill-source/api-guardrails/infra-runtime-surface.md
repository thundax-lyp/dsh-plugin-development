# Infrastructure task API

本页锁定 `dsh-v0.2.0-rc.2` 的任务所需公开对象和直接成员；运行语义、生命周期与失败边界见 [对应 guardrail](api-infra-runtime.md)。未列入的公开符号仍在 `api-surface.json` 中逐项裁决，但不进入常规插件指导。

## Infrastructure task API

`BrowserUseRegistry` and `ComputerUseRegistry` are the public singleton-selection facades for the optional experimental provider task. Their `providerName` is a `BrowserUseProviderName | undefined` or `ComputerUseProviderName | undefined`; `register(name)` returns an async disposer and refuses a second live provider. The branded names are exported from `@deepseek-ai/dsh-browser-use/brand` and `@deepseek-ai/dsh-computer-use/brand`. Neither registry runs browser or desktop actions itself; the selected provider row supplies those tools.

`SshConnection` is the public `ctx.ssh` service behind `fs-ssh`, `subprocess-ssh` and `sandbox-ssh`. Its `ready` promise settles connection startup; `request(method, params, resultSchema, signal?, wait?)` sends administrative RPC; `connectStream(endpoint, signal?)` opens a separate authenticated stream; `dispose()` joins forwarding and partial setup. `nodeExecutable` is the verified remote Node path. `bootstrapPath` is available only when both optional PTC bootstrap path and hash are configured. The published `Config` requires an OpenSSH `host` alias and absolute remote `node`, `helper`, `workspace` plus `helperHash`; optional `bootstrapPath`/`bootstrapHash` must be paired, while `requestTimeoutMs`, `maxFrameBytes`, `maxPending` and `leaseMs` bound transport. The selected infrastructure task usually consumes this service through the three SSH providers, and must not replay an operation after ambiguous transport loss. Source: `packages/ssh/ssh/src/index.ts`.

**`AgentPresetRegistry`**

- Entry: `export:@deepseek-ai/dsh-agent-preset-registry:.`
- Signature: `AgentPresetRegistry`
- Source: `packages/preset/agent-preset-registry/src/index.ts`

| Member     | Signature                                                          | Task use                                           |
| ---------- | ------------------------------------------------------------------ | -------------------------------------------------- |
| `config`   | `Config`                                                           | Resolved default and volatile selection Config; do not mutate a live revision through this object. |
| `list`     | `() => Promise<AgentPreset[]>`                                     | Return every definition with current broken diagnostics; await settled Loader audit. |
| `mount`    | `(ctx: Context, id?: string \| undefined) => Promise<AgentPreset>` | Mount the selected revision in a Cordis context; a failed tree rejects. |
| `register` | `(definition: PresetDefinition) => Promise<() => Promise<void>>`   | Own one definition and its async unregister disposer. |
| `resolve`  | `(id?: string \| undefined) => Promise<AgentPreset>`               | Read current preset metadata without starting an Agent. |
| `select`   | `(agent: Agent, agentPreset: string) => Promise<string>`           | Persist one Agent selection and return the selected preset id. |

**`AttachmentStore`**

- Entry: `export:@deepseek-ai/dsh-attachment:.`
- Signature: `AttachmentStore`
- Source: `packages/attachment/attachment/src/index.ts`

`saveImage`, `saveImages`, `readImage` and file save/read methods form the task surface; the exact selected signatures and ownership are in [Infrastructure provider call shapes](#infrastructure-provider-call-shapes). A provider implements every abstract member, including limits and media reads.

**`AuthorizationService`**

- Entry: `export:@deepseek-ai/dsh-authorization:.`
- Signature: `AuthorizationService`
- Source: `packages/credentials/authorization/src/index.ts`

| Member   | Signature                             | Task use                                           |
| -------- | ------------------------------------- | -------------------------------------------------- |
| `cancel` | `(key: CredentialKey) => void`        | Abort the in-flight attempt for this credential key. |
| `list`   | `() => readonly AuthorizationEntry[]` | Read the currently registered flow metadata. |

**`CredentialProvider`**

- Entry: `export:@deepseek-ai/dsh-credentials:.`
- Signature: `CredentialProvider`
- Source: `packages/credentials/credentials/src/index.ts`

| Member    | Signature                                                                     | Task use                                           |
| --------- | ----------------------------------------------------------------------------- | -------------------------------------------------- |
| `resolve` | `(ref: Branded<"CredentialRef">) => Promise<ResolvedCredential \| undefined>` | Look up a secret reference; undefined means unavailable. |
| `set`     | `(ref: Branded<"CredentialRef">, value: string) => Promise<void>`             | Persist a secret value behind its reference. |

**`FileSystem`**

- Entry: `export:@deepseek-ai/dsh-fs:.`
- Signature: `FileSystem`
- Source: `packages/fs/fs/src/index.ts`

| Member        | Signature                                                                                                                    | Task use                                           |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `readBytes`   | `(target: FsTarget, signal: AbortSignal \| undefined, maxBytes: number) => Promise<Uint8Array<ArrayBufferLike>>`             | Require a caller byte cap; reject rather than return an unbounded read. |
| `resolve`     | `(path: string, opts?: { cwd?: string \| undefined; signal?: AbortSignal \| undefined; } \| undefined) => Promise<FsTarget>` | Resolve caller path into provider-stable FsTarget identity. |
| `sandboxMode` | `SandboxMode \| undefined`                                                                                                                        | Report enforcement mode of this provider, if any. |
| `stat`        | `(target: FsTarget, signal?: AbortSignal \| undefined) => Promise<FsInfo \| undefined>`                                      | Read metadata; undefined means the target is absent. |
| `watch`       | `(target: FsTarget, changed: (error?: Error \| undefined) => void, signal: AbortSignal) => Promise<() => Promise<void>>`     | Wait for observation readiness; await returned close function on teardown. |

**`WebServer`**

- Entry: `export:@deepseek-ai/dsh-host-webserver:.`
- Signature: `WebServer`
- Source: `packages/host/webserver/src/index.ts`

| Member     | Signature                         | Task use                                           |
| ---------- | --------------------------------- | -------------------------------------------------- |
| `host`     | `"127.0.0.1" \| "0.0.0.0"`        | Configured loopback or all-interface bind address. |
| `port`     | `number`                          | Actual bound port, including an OS-assigned port when configured as zero. |
| `register` | `(route: WebRoute) => () => void` | Reserve exact/prefix route; duplicate kind and path throws; dispose to remove. |

**`LspService`**

- Entry: `export:@deepseek-ai/dsh-lsp:.`
- Signature: `LspService`
- Source: `packages/lsp/lsp/src/types.ts`

`registerProvider(provider: LspProvider): () => void` and `query(request: LspQueryRequest, signal?: AbortSignal): Promise<LspQueryResult>` are declared on this interface. Registration reserves the provider ID and extension map; the query result is a closed `locations | hover` union.

**`McpResourceRuntime`**

- Entry: `export:@deepseek-ai/dsh-mcp-resources:.`
- Signature: `McpResourceRuntime`
- Source: `packages/mcp/mcp-resources/src/index.ts`

| Member     | Signature                                                       | Task use                                           |
| ---------- | --------------------------------------------------------------- | -------------------------------------------------- |
| `register` | `(server: string, provider: McpResourceProvider) => () => void` | Register a server in the caller scope and expose shared resource tools; dispose with connection. |

**`DshBundleManifest`**

- Entry: `export:@deepseek-ai/dsh-package-manifest:.`
- Signature: `DshBundleManifest`
- Source: `packages/util/package-manifest/src/types.ts`

| Member  | Signature            | Task use                                           |
| ------- | -------------------- | -------------------------------------------------- |
| `patch` | `string \| string[]` | One package-root-relative patch file or ordered list of patch files. |

**`DshClientManifest`**

- Entry: `export:@deepseek-ai/dsh-package-manifest:.`
- Signature: `DshClientManifest`
- Source: `packages/util/package-manifest/src/types.ts`

| Member     | Signature               | Task use                                           |
| ---------- | ----------------------- | -------------------------------------------------- |
| `external` | `string[] \| undefined` | Exact additional Client module-table requests, including subpaths; absent keeps baseline only. |
| `inject`   | `string[] \| undefined` | Informational package-name dependencies; not Cordis service injection. |

**`DshManifest`**

- Entry: `export:@deepseek-ai/dsh-package-manifest:.`
- Signature: `DshManifest`
- Source: `packages/util/package-manifest/src/types.ts`

| Member            | Signature                        | Task use                                           |
| ----------------- | -------------------------------- | -------------------------------------------------- |
| `bundle`          | `DshBundleManifest \| undefined` | Declares an installable bundle layer consumed by Profile composition. |
| `client`          | `DshClientManifest \| undefined` | Declares a Client module for the selected platform/build. |
| `manifestVersion` | `1 \| undefined`                 | Optional literal 1; independent of package and Session versions. |

**`DshPackageManifest`**

- Entry: `export:@deepseek-ai/dsh-package-manifest:.`
- Signature: `DshPackageManifest`
- Source: `packages/util/package-manifest/src/types.ts`

| Member         | Signature                             | Task use                                           |
| -------------- | ------------------------------------- | -------------------------------------------------- |
| `dependencies` | `Record<string, string> \| undefined` | npm packages installed alongside this package. |
| `dsh`          | `DshManifest \| undefined`            | DSH bundle/Profile/Client declarations. |
| `engines`      | `DshEnginesManifest \| undefined`     | Declarative runtime compatibility; readers decide enforcement. |
| `name`         | `string`                              | Published npm package identity. |
| `version`      | `string`                              | Published package version. |

**`DshProfileManifest`**

- Entry: `export:@deepseek-ai/dsh-package-manifest:.`
- Signature: `DshProfileManifest`
- Source: `packages/util/package-manifest/src/types.ts`

`bundles?: string[]` is the ordered list of installed bundle package names in a Profile manifest. The `dsh plugin` CLI maintains it when installing or removing a declared bundle.

**`PtcRuntime`**

- Entry: `export:@deepseek-ai/dsh-ptc-runtime:.`
- Signature: `PtcRuntime`
- Source: `packages/ptc-runtime/ptc-runtime/src/index.ts`

| Member        | Signature                                     | Task use                                           |
| ------------- | --------------------------------------------- | -------------------------------------------------- |
| `isolation`   | `string`                                      | Provider-reported execution isolation identity. |
| `resolve`     | `(request: PtcRunRequest) => PtcRunSpec`      | Convert public request to provider-private run spec. |
| `run`         | `(spec: PtcRunSpec) => Promise<PtcRunResult>` | Execute resolved spec and return one result. |
| `sandboxMode` | `SandboxMode \| undefined`                                         | Provider default sandbox mode when supported. |

**`SandboxPolicyService`**

- Entry: `export:@deepseek-ai/dsh-sandbox-policy:.`
- Signature: `SandboxPolicyService`
- Source: `packages/sandbox/sandbox-policy/src/index.ts`

| Member    | Signature                                                    | Task use                                           |
| --------- | ------------------------------------------------------------ | -------------------------------------------------- |
| `resolve` | `(request?: SandboxPolicyRequest) => SandboxExecutionPolicy` | Resolve per-request sandbox mode and workspace roots. |

**`SandboxProvider`**

- Entry: `export:@deepseek-ai/dsh-sandbox:.`
- Signature: `SandboxProvider`
- Source: `packages/sandbox/sandbox/src/index.ts`

`confine(argv: readonly string[], policy: SandboxPolicy, signal?: AbortSignal): Promise<ConfinedArgv>` must return enforcing argv or fail closed. The caller spawns the returned argv.

**`ShellExecutor`**

- Entry: `export:@deepseek-ai/dsh-shell:.`
- Signature: `ShellExecutor`
- Source: `packages/shell/shell/src/index.ts`

| Member        | Signature                                          | Task use                                           |
| ------------- | -------------------------------------------------- | -------------------------------------------------- |
| `execute`     | `(spec: ShellExecSpec) => Promise<ShellExecution>` | Prepare and spawn a resolved spec; may reject before handle publication. |
| `resolve`     | `(request: ShellExecRequest) => ShellExecSpec`     | Apply provider defaults and caps before execution. |
| `sandboxMode` | `SandboxMode \| undefined`                                              | Executor default mode or undefined when it does not sandbox. |

**`SpillStore`**

- Entry: `export:@deepseek-ai/dsh-spill:.`
- Signature: `SpillStore`
- Source: `packages/spill/spill/src/index.ts`

`saveText(input: SaveTextSpill): Promise<SpillRef>` publishes a durable locator; the backend path stays private.

**`Domain`**

- Entry: `export:@deepseek-ai/dsh-storage-domain:.`
- Signature: `Domain<S>`
- Source: `packages/storage/storage-domain/src/domain.ts`

| Member  | Signature                                                                                          | Task use                                           |
| ------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `close` | `() => Promise<void>`                                                                              | Reject new writes, drain queued writes, release backend unit; idempotent. |
| `name`  | `string`                                                                                           | Domain identity from its spec. |
| `table` | `<N extends keyof S["tables"] & string>(name: N) => KvTable<TableKeyOf<S, N>, TableValueOf<S, N>>` | Return the stable typed handle for one declared table. |

**`Storage`**

- Entry: `export:@deepseek-ai/dsh-storage:.`
- Signature: `Storage`
- Source: `packages/storage/storage/src/index.ts`

| Member   | Signature                                                                          | Task use                                           |
| -------- | ---------------------------------------------------------------------------------- | -------------------------------------------------- |
| `domain` | `DomainFacility after @deepseek-ai/dsh-storage-domain declaration merging`                                                                            | Domain facility only after the domain plugin has mounted its form. |
| `form`   | `<K extends keyof StorageForms>(form: K) => StorageForms[K]`                       | Return named mounted form or throw form-not-mounted. |
| `mount`  | `<K extends keyof StorageForms>(form: K, facility: StorageForms[K]) => () => void` | Reserve one named form and return an effect-owned unmount disposer. |

**`SubprocessRuntime`**

- Entry: `export:@deepseek-ai/dsh-subprocess:.`
- Signature: `SubprocessRuntime`
- Source: `packages/subprocess/subprocess/src/index.ts`

`resolveExecutable`, `terminalEnvironment`, `spawn`, and `spawnTerminal` are distinct abstract operations. `spawn` may throw before publishing a live handle; a published handle must be terminated and awaited.

**`TypertRemoteService`**

- Entry: `export:@deepseek-ai/dsh-typert-protocol:.`
- Signature: `TypertRemoteService<T>`
- Source: `packages/typert/protocol/src/index.ts`

The Host class binds a Cordis service key to a wire namespace; expose only `@Remote` methods through generated Typert artifacts. See [Remote composition](how-to-infra-runtime.md#compose-a-preset-and-a-host-to-client-remote) for the Host/Client build path.

**`WebhookRuntime`**

- Entry: `export:@deepseek-ai/dsh-webhook:.`
- Signature: `WebhookRuntime`
- Source: `packages/webhook/webhook/src/index.ts`

| Member     | Signature                                                          | Task use                                           |
| ---------- | ------------------------------------------------------------------ | -------------------------------------------------- |
| `dispatch` | `<K extends string>(delivery: VerifiedWebhookDelivery<K>) => void` | Validate and snapshot trusted delivery, start matching callbacks, return before they settle. |
| `register` | `<K extends string>(rule: WebhookRule<K>) => () => Promise<void>`  | Register unique rule and return async disposer that aborts and drains active callbacks. |

## Members and task boundaries omitted by the direct-member discovery

- `DshClientManifest.platform: string` is required; the Web loader selects `"web"`. `immediately?: boolean` selects the phase-one registration barrier. These are declared in `packages/util/package-manifest/src/types.ts` and are required for an actual Client module task.
- `Storage.domain` is **not** an unusable `never` at runtime: `@deepseek-ai/dsh-storage-domain` merges `domain: DomainFacility` into `StorageForms`, and its plugin must be mounted. `Storage.form('domain')` throws `StorageError('form-not-mounted', ...)` before that mount. A domain caller owns the `Domain<S>` handle and awaits `close()`.
- `BrowserUseRegistry` and `ComputerUseRegistry` are the public objects behind the experimental selection task. Each declares `providerName: BrowserUseProviderName | undefined` or `ComputerUseProviderName | undefined`, and `register(name)` returns `() => Promise<void>`. Both reject a second provider even with the same name. Their source owners are `packages/browser-use/browser-use/src/index.ts` and `packages/computer-use/computer-use/src/index.ts`. They do not provide browser/desktop action methods.
- `WebServer.register(route: WebRoute): () => void` accepts `kind: 'exact' | 'prefix'`, an absolute `path` without trailing slash, and a handler that owns the response. `WebhookRuntime.register<K extends string>(rule: WebhookRule<K>): () => Promise<void>` is distinct from `dispatch<K extends string>(delivery: VerifiedWebhookDelivery<K>): void`; dispatch does not await matching callbacks. See their source owners under `packages/host/webserver/src/index.ts` and `packages/webhook/webhook/src/index.ts`.
- `AgentPresetRegistry.register(definition: PresetDefinition): Promise<() => Promise<void>>` registers a complete definition and returns its owner disposer after activation/diagnostic settles. `list(): Promise<AgentPreset[]>` includes broken definitions. Use the `@deepseek-ai/dsh-agent-preset` row to submit definitions in a Profile; `register` is not a directory scan.

The tables above are selected direct declarations, not complete descriptions of inherited Service methods, provider interfaces or nested request/result branches. A provider implementation must read its own target declaration and run its contract tests before being treated as complete.

## Infrastructure provider call shapes

These selected signatures supply the member contract that the task uses; provider implementers must also satisfy every abstract method in the cited public declaration. This list is intentionally narrower than an entire package API.

- `AttachmentStore` (`packages/attachment/attachment/src/index.ts`): `saveImages(inputs: readonly SaveImageAttachment[]): Promise<readonly ImageAttachmentRef[]>`; `saveImage(input: SaveImageAttachment): Promise<ImageAttachmentRef>`; `readImage(ref: ImageAttachmentRef, signal?: AbortSignal): Promise<StoredImageAttachment>`. Validate the whole admission input before publishing refs; a provider owns durable media and integrity on reads.
- `AuthorizationService` (`packages/credentials/authorization/src/index.ts`): `registerFlow(flow: AuthorizationFlow): () => void`; `begin(request: AuthorizationRequest): Promise<AuthorizationOutcome>`; `cancel(key: CredentialKey): void`. The flow is effect-owned; `begin` may decline or fail, and cancellation must reach in-flight interactions.
- `CredentialProvider` (`packages/credentials/credentials/src/index.ts`): `resolve(ref: CredentialRef): Promise<ResolvedCredential | undefined>`; `set(ref: CredentialRef, value: string): Promise<void>`; `unset(ref: CredentialRef): Promise<void>`. A complete provider also implements `describe`, record reading/listing/modification and deletion; settings store a `CredentialRef`, not the resolved value.
- `FileSystem` (`packages/fs/fs/src/index.ts`): `resolve(path: string, opts?: { cwd?: string; signal?: AbortSignal }): Promise<FsTarget>`; `readBytes(target: FsTarget, signal: AbortSignal | undefined, maxBytes: number): Promise<Uint8Array>`; `watch(target: FsTarget, changed: (error?: Error) => void, signal: AbortSignal): Promise<() => Promise<void>>`. `watch` resolves after observation is ready; the returned close function is awaitable.
- `LspService` (`packages/lsp/lsp/src/types.ts`): `registerProvider(provider: LspProvider): () => void`; `query(request: LspQueryRequest, signal?: AbortSignal): Promise<LspQueryResult>`. Operations are the closed union `goToDefinition | findReferences | goToImplementation | hover`; locations use zero-based UTF-16 ranges. `LspError` covers duplicate registrations and unavailable selection.
- `McpResourceRuntime` (`packages/mcp/mcp-resources/src/index.ts`): `register(server: string, provider: McpResourceProvider): () => void`. The provider implements `request(request: McpResourceRequest, exec: ToolExecution): Promise<JsonValue>`; the request union has `resources/list`, `resources/templates/list`, and `resources/read`. Registration is scoped to the caller and removed with its effect.
- `PtcRuntime` (`packages/ptc-runtime/ptc-runtime/src/index.ts`): `resolve(request: PtcRunRequest): PtcRunSpec`; `run(spec: PtcRunSpec): Promise<PtcRunResult>`. The spec is provider-private; callers pass the value returned by the same provider's `resolve` into `run`.
- `SandboxPolicyService` (`packages/sandbox/sandbox-policy/src/index.ts`): `resolve(request: SandboxPolicyRequest = {}): SandboxExecutionPolicy`. `SandboxProvider` (`packages/sandbox/sandbox/src/index.ts`): `confine(argv: readonly string[], policy: SandboxPolicy, signal?: AbortSignal): Promise<ConfinedArgv>`. `confine` returns enforcing argv or refuses; the caller runs the returned argv, never the original after a failed confinement.
- `ShellExecutor` (`packages/shell/shell/src/index.ts`): `resolve(request: ShellExecRequest): ShellExecSpec`; `execute(spec: ShellExecSpec): Promise<ShellExecution>`. The first applies provider defaults/caps; the second may reject before publishing a handle, after which handle/result teardown belongs to the selected provider.
- `SpillStore` (`packages/spill/spill/src/index.ts`): `saveText(input: SaveTextSpill): Promise<SpillRef>`. The locator is the durable public result; the backend path is private.
- `Storage` (`packages/storage/storage/src/index.ts`): `mount<K extends keyof StorageForms>(form: K, facility: StorageForms[K]): () => void`; `form<K extends keyof StorageForms>(form: K): StorageForms[K]`. The domain package merges `domain: DomainFacility` into `StorageForms`. `DomainFacility.open<S extends DomainSpec>(spec: S): Promise<Domain<S>>` (`packages/storage/storage-domain/src/index.ts`) returns a caller-owned handle; `Domain<S>.close(): Promise<void>` (`src/domain.ts`) drains queued writes.
- `SubprocessRuntime` (`packages/subprocess/subprocess/src/index.ts`): `resolveExecutable(command: string, env?: Readonly<Record<string, string>>, signal?: AbortSignal): Promise<string>`; `spawn(spec: SubprocessSpawnSpec): SubprocessHandle`; `spawnTerminal(spec: SubprocessTerminalSpawnSpec): Promise<SubprocessTerminalHandle>`. `spawn` may fail synchronously before publication; published handles own exit observation and termination.

### Attachment persistence and credential records

`AttachmentStore` additionally exposes `saveFile(input: SaveFileAttachment): Promise<FileAttachmentRef>`, `saveFileStream(input: SaveFileStreamAttachment): Promise<FileAttachmentRef>`, and `readFileStream(ref: FileAttachmentRef, signal?: AbortSignal): AsyncIterable<Uint8Array>`. The base class rejects these with `ATTACHMENT_FILES_UNSUPPORTED`; a file-capable provider overrides them. Streaming writes apply backpressure without buffering the entire file, and streamed reads verify integrity while observing cancellation. `saveImages` validates the complete batch before saving individual images; failure publishes no partial list of refs. Source: `packages/attachment/attachment/src/index.ts:145-228`.

The complete `CredentialProvider` abstract contract also includes `describe(ref: CredentialRef): Promise<CredentialInfo>`, `readRecord(key: CredentialKey): Promise<CredentialRecord | undefined>`, `describeRecord(key: CredentialKey): Promise<CredentialRecordInfo>`, `listRecords(): Promise<readonly CredentialRecordEntry[]>`, `modifyRecord(key: CredentialKey, mutate: (current: CredentialRecord | undefined) => Promise<CredentialRecord | undefined>): Promise<CredentialRecord | undefined>`, and `deleteRecord(key: CredentialKey): Promise<void>`. `modifyRecord` serializes read, mutation and write; a mutation returning `undefined` leaves the entry unchanged. Record descriptions and listings omit secret values. A provider emits update notifications only after commit. Source: `packages/credentials/credentials/src/index.ts:170-282`.

`AuthorizationFlow` is `{ key: CredentialKey; label: string; methods: readonly [AuthorizationMethod, ...AuthorizationMethod[]]; run(session: AuthorizationSession): Promise<void> }`. The session supplies `method`, `signal`, `commit(record: CredentialRecord): Promise<void>`, `notify(notice: AuthorizationNotice): void`, and `prompt(prompt: AuthorizationPrompt): Promise<string>`. `AuthorizationRequest` supplies `key`, optional `method` and `signal`, and `interaction: AuthorizationInteraction` with `notify` and `prompt`; `begin` uses that supplied interaction. `commit` resolves after persistence. A human decline throws `AuthorizationDeclinedError` and settles as cancelled; withdrawal of a single prompt through its own signal is a distinct branch. Source: `packages/credentials/authorization/src/index.ts:73-180` and `src/types.ts:11-76`.

### Backend storage and process handles

`ctx.storage.backend.register(name: string, backend: StorageBackend): () => void` reserves a backend name. The provider separately contributes `ctx.provide(storageBackendServiceKey(name), backend)` for lifecycle dependency. Unregistering the name does **not** close the backend; the provider awaits `backend.close(): Promise<void>` after stopping admission. `StorageBackend.kv?: KvFacet` supplies `open(descriptor: KvUnitDescriptor): Promise<KvUnit>`. The descriptor has `name`, `version`, `tables`, `hasGlobal`, optional `layout` and `compatibleVersions`. A unit exposes `loadAll()`, `putRecord(table, key, value)`, `deleteRecord(table, key)`, optional `backupRecord(table, key): Promise<string>`, `setGlobal(value)`, and `close()`. Each resolved write is atomic and durable; the caller serializes concurrent writes. `close()` drains writes; later calls reject. `backupRecord` enables a Domain's `backup-and-skip` policy only when the backend implements it. Source: `packages/storage/storage/src/registry.ts:14-63`, `src/backend.ts:17-145`, and `src/index.ts:20-80`.

After `spawn(spec)` publishes a `SubprocessHandle`, its `done: Promise<SubprocessOutcome>` resolves command exit facts and rejects spawn/provider faults. `terminate(): void` is idempotent for the provider-managed process range; `waitForExit(signal?: AbortSignal): Promise<boolean>` waits for that same range, returning `false` if the wait signal aborts and throwing if observation is lost. `done` alone does not prove descendants in the managed range exited. Piped `stdin`/`stdout`/`stderr` and optional `control` stream belong to the caller. In collect mode, `collected.stdout?` and `.stderr?` are `SubprocessOutputReader` handles with `readFrom(fromByte): SubprocessOutputRead`; its `text`, `nextOffset`, `lossy` and optional `spillPath` let independent readers retain their own byte offsets, even after exit. Source: `packages/subprocess/subprocess/src/index.ts:101-163` and `src/types.ts:124-196`.

`ShellExecution` extends `ShellProcess`. Call `result(): Promise<ShellRunResult>` for a memoized foreground projection; nonzero exit, timeout and abort resolve as result facts, while an infrastructure failure such as a spawn that never produced a process rejects. For background work, `done: Promise<void>` never rejects, `status`/`exitCode`/`signal` expose settlement, `readOutput(): ShellProcessRead` advances a consuming cursor, `observed: ShellObservedStreams` provides independent non-consuming offset readers, and `kill(): boolean` requests termination of the managed range. Captured output remains readable after exit. Source: `packages/shell/shell/src/index.ts:70-96` and `src/types.ts:168-240`.

### PTC bindings and confinement evidence

`PtcRunRequest` supplies `program`, `bindings: PtcBindingNamespace[]`, optional `cwd`, `timeoutMs`, `sandboxPolicy` and `signal`. Each binding namespace supplies `global`, `functions: Record<string, (args: unknown) => Promise<PtcJsonValue>>`, and optional `errorClass`; returned values must be JSON. `PtcRunResult` has optional `value`, required `logs`, optional `sandbox`, and optional `error: PtcRunFailure`. Program exceptions, timeout, abort, worker exit, invalid output, output limit, protocol errors and unavailable sandbox are distinct failure kinds in the resolved result, not ordinary promise rejection. Source: `packages/ptc-runtime/ptc-runtime/src/types.ts:20-170`.

`ConfinedArgv` returns `{ argv: string[]; enforcement: 'full' | 'partial'; denialSignatures: readonly string[]; runnerFailureRules: readonly RunnerFailureRule[] }`. A rule has optional `allowedExitCodes`, required `fatalSignatures`, and optional `informationalLines`. These diagnostics come from the selected runner: classify runner failure before treating matching output as policy denial. A requested sandbox mode alone is no proof of enforcement, and a failed `confine` must not fall back to the original argv. Source: `packages/sandbox/sandbox/src/index.ts:70-129`.

## Task-required structural types

These public shapes are inputs or results of the included methods. They form part of the callable contract even when a consumer does not import them as runtime values.

- `PresetDefinition` in `packages/preset/agent-preset-registry/src/definition.ts`: required `id: string` and `plugins: readonly EntryOptions[]` (with the declared optional `id` and `disabled` expression variations); optional `name`, `description`, `order`. The `@deepseek-ai/dsh-agent-preset` row accepts this as its `Config`, and `AgentPresetRegistry.register` accepts it directly. A malformed nested group fails validation; `list()` exposes a broken activation diagnostic.
- `DomainSpec` in `packages/storage/storage-domain/src/spec.ts`: required `name`, nonnegative `version`, and `tables`; optional `layout`, `compatibleVersions`, `invalidRecords`, and `global`. `defineDomain<S extends DomainSpec>(spec: S): S` validates the declaration; `domainTable<K,V>(schema)` declares a typed table. `DomainFacility.open<S extends DomainSpec>(spec: S): Promise<Domain<S>>` is the only opening operation. `Domain<S>.table(name)` returns `KvTable<K,V>` with synchronous `get`/snapshot iterators and durable async `put`, `delete`, `update`; `close()` is awaited. A backend route and `kv` facet must exist before `open` succeeds.
- `WebRoute` in `packages/host/webserver/src/index.ts`: `{ kind: 'exact' | 'prefix'; path: string; handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void> }`. `path` is absolute with no trailing slash; the handler owns the full response. `WebServer.register` rejects a duplicate `(kind, path)` and returns a synchronous disposer.
- `WebhookRule<K>` in `packages/webhook/webhook/src/types.ts`: required unique `id: WebhookRuleId`, `kind: K`, and `run(delivery: Readonly<VerifiedWebhookDelivery<K>>, signal: AbortSignal): WebhookSessionRequest | null | Promise<...>`. `VerifiedWebhookDelivery` carries `kind`, `source`, `deliveryId`, normalized JSON `event` and `receivedAt` epoch milliseconds. `WebhookSessionRequest` requires `workspacePath`, `title`, nonempty `prompt`, `agentPreset`, and `permissionPreset`; optional `model` selects a route. Authentication is an adapter obligation before calling `dispatch`; the runtime only snapshots/validates the already trusted delivery and starts matching rules.
- `DshClientManifest.platform` is required and `DshProfileManifest.bundles` is the ordered Profile list (`packages/util/package-manifest/src/types.ts`). Both are declarative fields used by the Client loader and Profile composer, respectively. Treating them as unused because code does not *call* them misclassifies public configuration contracts.

## Cordis lifecycle public API

The public Cordis package re-exports `Context`, `Service`, `Plugin`, `Inject`, `Fiber`, `FiberState`, `Effect`, and `Disposable` from `vendor/cordis/src/index.ts`. The Loader and Include packages publish the composition shapes from `vendor/loader/src/config/entry.ts` and `vendor/include/src/index.ts`. These are the common authoring contract for Host plugins, independent of any DSH capability service.

`@deepseek-ai/schemastery` publishes the default `Schema` builder used by a plugin's exported `Config`. `Schema.object({ field: Schema.string().default(value) })` supplies validation and defaults before `apply`; `.volatile()` marks a field whose live value is read through `Volatile<T>.get()`. The selected package example uses `object`, `string`, `default` and `volatile`; the other builder metadata and presentation methods are optional, not proof of an activation effect. A plain object named `Config` is not a Standard Schema.

| Author path | Target declaration and effect |
| --- | --- |
| Function plugin | `Plugin.Function<T>` is `(ctx: Context, config: T) => any`, with optional `name`, `Config`, `inject` and `provide` metadata. |
| Object plugin | `Plugin.Object<T>` has `apply(ctx: Context, config: T): any` and the same optional metadata. A class plugin is constructed as `new (ctx: Context, config: T)`. |
| Dependency declaration | `Inject<M> = (keyof M)[] \| { [K in keyof M]?: M[K] }`. `ctx.inject(deps: Inject, callback: Plugin.Function<void>): Fiber & PromiseLike<Fiber>` starts the callback when all required services exist, and unloads/restarts it when those services change. |
| Child mount | `ctx.plugin<P extends Plugin>(plugin: P, ...args): Fiber & PromiseLike<Fiber>` starts one child under the current fiber. Await it for startup completion; it rejects on config validation/startup failure. The parent disposes its child. |
| Owned resource | `ctx.effect(execute: () => SyncEffect, label?: string)` and its async-effect overload return a disposer; `Effect` accepts one disposer, a promise of one, or an iterable/async iterable of disposers. The effect body runs immediately. Its disposers run in reverse registration order for that effect and are awaited on unload. |
| Service implementation | `new Service(ctx: Context, name: string)` registers the instance on that context through `ctx.reflect.provide`. A subclass calls `super(ctx, 'serviceKey')`; the owning fiber removes the service on unload. Extend Cordis `Context` through declaration merging to type `ctx.serviceKey`. |
| Volatile config | `Volatile<T>` marks a live config value; the consumer reads its current value with `get()` rather than retaining an earlier snapshot. Use the owning Config schema's `.volatile()` declaration. |
| Fiber observation | `fiber.state: FiberState` (`PENDING`, `LOADING`, `ACTIVE`, `FAILED`, `UNLOADING`, `DISPOSED`) and `fiber.dispose(): Promise<void>`. `PENDING` means an injection is missing and can activate later; `FAILED` records config/startup failure. `dispose()` settles after cleanup. |
| Loader row | `EntryOptions` has required `id: string`, `name: string`, optional `config`, `group`, `disabled`, `inject`. An entry's stable `id` lets Loader patch/reload the same row. |
| Include patch | `PatchOptions` has optional `insert?: EntryOptions[]` for adding rows or `id` for modifying an existing row. A bare top-level `EntryOptions` is not an insertion: `applyEntryPatches` warns `patch: id is required for non-insert patches` or `entry not found`. |

`Config` is a Standard Schema value, not a plain object; Cordis validates it before plugin activation and throws `ValidationError` on issues. `ctx.effect` throws `CordisError('INACTIVE_EFFECT')` when called on a disposed/unloading fiber. Inspect `fiber.state` or await the fiber rather than interpreting lack of a plugin log as success.
