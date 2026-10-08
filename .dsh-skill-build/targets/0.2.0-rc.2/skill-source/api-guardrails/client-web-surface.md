# Client/Web task API

本页锁定 `dsh-v0.2.0-rc.2` 的任务所需公开对象和直接成员；运行语义、生命周期与失败边界见 [对应 guardrail](api-client-web.md)。本页只列出这些插件任务直接使用的公开成员。

## Client/Web task API

**`TypertGatewayService`**

- Entry: `export:@deepseek-ai/dsh-api-gateway:.`
- Signature: `TypertGatewayService`
- Source: `packages/api/gateway/src/index.ts`

| Member   | Signature                                                           | Task use                                            |
| -------- | ------------------------------------------------------------------- | --------------------------------------------------- |
| `stream` | `(request: InvokeRemoteRequest) => Promise<AsyncIterable<unknown>>` | Dispatches a logical Remote stream through Gateway. |

**`ClientRemote`**

- Entry: `export:@deepseek-ai/dsh-api-gateway:./client`
- Signature: `ClientRemote`
- Source: `packages/api/gateway/src/client/index.ts`

| Member  | Signature         | Task use                                                            |
| ------- | ----------------- | ------------------------------------------------------------------- |
| `$host` | `RemoteHostFacts` | Read Host home and loopback facts; home may be absent before ready. |

**`SettingsForms`**

- Entry: `export:@deepseek-ai/dsh-settings:.`
- Signature: `SettingsForms`
- Source: `packages/settings/settings/src/index.ts`

| Member     | Signature                                                                                               | Task use                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `mutate`   | `(ns: string, ops: readonly SettingsPathOp[], expectedRevision?: number \| undefined) => Promise<void>` | Atomically applies namespace operations with an optional revision fence. |
| `writable` | `boolean`                                                                                               | Reports whether this Host settings store accepts writes.                 |

**`ConfigForms`**

- Entry: `export:@deepseek-ai/dsh-client-ui-settings:./client`
- Signature: `ConfigForms`
- Source: `packages/client/ui-settings/src/client/config-form.ts`

| Member        | Signature                                                                                              | Task use                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `get`         | `<T>(entryId: string) => ConfigForm<T>`                                                                | Returns the shared form for one Loader entry id.                                       |
| `whileServed` | `(namespaces: readonly string[], register: (served: ReadonlySet<string>) => () => void) => () => void` | Keeps a registration only while Host serves a watched namespace; caller owns disposer. |

**`SlotMap`**

- Entry: `export:@deepseek-ai/dsh-client-ui-slots:.`
- Signature: `SlotMap`
- Source: `packages/client/ui-slots/src/index.ts`

This declaration supplies the typed key table used by owner augmentation and `PropsRuntime`; it has no directly declared methods.

**`SlotCore`**

- Entry: `export:@deepseek-ai/dsh-client-ui-slots:.`
- Signature: `SlotCore`
- Source: `packages/client/ui-slots/src/index.ts`

| Member      | Signature                                                                         | Task use                                                                                         |
| ----------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `factory`   | `(name: string) => StoredFactory \| undefined`                                    | Looks up a registered reusable Component Factory.                                                |
| `register`  | The two typed overloads below; `(options, component) => () => void`               | Registers an entry and returns an idempotent disposer; use ctx.slots facade for fiber ownership. |
| `snapshot`  | `(root?: string \| undefined) => LiveCompositionNode[]`                           | Reads the current composition tree for diagnostics.                                              |
| `spec`      | `<K extends keyof SlotMap & string>(key: K) => SlotSpec<SlotMap[K]> \| undefined` | Reads the active declaration for a slot key.                                                     |
| `subscribe` | `(key: string, fn: () => void) => () => void`                                     | Watches registration changes for a key; caller owns unsubscribe.                                 |

`SlotCore.register` has two overloads, without and with a registration `inject` face. `SlotRegistry.register` is declared as `SlotCore['register']`, so the same inference applies through `ctx.slots`. The full signatures are:

```text
register<
  K extends keyof SlotMap & string,
  const EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
  const D extends ChildrenDecl = Record<never, never>,
  H extends StoreDecl | undefined = undefined,
  M = never,
  N extends (keyof LocaleNamespaceMap & string) | undefined = undefined,
  C extends SlotComponent<never> = SlotComponent<never>,
>(
  options: BaseOptions<K, EntryKey, D, H, M, N> & { inject?: undefined },
  component: C & SlotComponent<ComposedProps<
    K, NoInfer<EntryKey>, keyof NoInfer<D> & keyof SlotMap & string,
    HandleOf<NoInfer<H>>, object, NoInfer<M>, NoInfer<N>
  >> & RendersCheck<C, D>,
): () => void

register<
  K extends keyof SlotMap & string,
  I extends object,
  const EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
  const D extends ChildrenDecl = Record<never, never>,
  H extends StoreDecl | undefined = undefined,
  M = never,
  N extends (keyof LocaleNamespaceMap & string) | undefined = undefined,
  C extends SlotComponent<never> = SlotComponent<never>,
>(
  options: BaseOptions<K, EntryKey, D, H, M, N> & { inject: (...args: InjectParams<K, H>) => I },
  component: C & SlotComponent<ComposedProps<
    K, NoInfer<EntryKey>, keyof NoInfer<D> & keyof SlotMap & string,
    HandleOf<NoInfer<H>>, I, NoInfer<M>, NoInfer<N>
  >> & RendersCheck<C, D>,
): () => void
```

`kindOptions` is checked from the target `SlotMap` key (`id` for list, `key` for keyed, `select` for chain). `inject` returns only data and callbacks for the Component; the returned function disposes the contribution. Supporting type declarations are at `packages/client/ui-slots/src/index.ts:1144-1202`; do not replace those type checks with a cast or an `any` signature.

**`SlotRegistry`**

- Entry: `export:@deepseek-ai/dsh-client-ui-renderer:./client`
- Signature: `SlotRegistry` with `register: SlotCore['register']`
- Source: `packages/client/ui-renderer/src/client/registry.ts:164-181,209-270`

| Member     | Signature                                                                          | Task use                                                                                                      |
| ---------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `register` | `SlotCore['register']`                                                             | Registers through the calling Cordis fiber; see the two overloads above.                                      |
| `inject`   | `(key: keyof SlotMap & string, callback: () => SlotInjectionEffect) => () => void` | Waits for a slot declaration and reruns the effect on owner replacement; caller owns the idempotent disposer. |

**`WebRuntime`**

- Entry: `export:@deepseek-ai/dsh-web:.`
- Signature: `WebRuntime`
- Source: `packages/web/web/src/index.ts`

| Member   | Signature                                                                                    | Task use                                                                |
| -------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `fetch`  | `(request: WebFetchRequest, signal?: AbortSignal \| undefined) => Promise<WebFetchResult>`   | Selects a usable fetch provider at call time; non-2xx remains a result. |
| `search` | `(request: WebSearchRequest, signal?: AbortSignal \| undefined) => Promise<WebSearchResult>` | Selects a usable search provider and caps sources to maxResults.        |

Provider authors also call `registerFetchProvider(provider: WebFetchProvider): () => void` or `registerSearchProvider(provider: WebSearchProvider): () => void`; see `packages/web/web/src/index.ts:103-115`. These methods are bound to the caller fiber and reject duplicate ids within the same capability kind.

**`WebFetchProvider`**

- Entry: `export:@deepseek-ai/dsh-web:.`
- Signature: `WebFetchProvider`
- Source: `packages/web/web/src/types.ts`

| Member  | Signature                                                                                  | Task use                                      |
| ------- | ------------------------------------------------------------------------------------------ | --------------------------------------------- |
| `fetch` | `(request: WebFetchRequest, signal?: AbortSignal \| undefined) => Promise<WebFetchResult>` | Retrieves a URL and forwards cancellation.    |
| `id`    | `string`                                                                                   | Unique id within the fetch provider registry. |

`available(): boolean` is required and must be a cheap local check; it is part of the public declaration in `packages/web/web/src/types.ts`.

**`WebSearchProvider`**

- Entry: `export:@deepseek-ai/dsh-web:.`
- Signature: `WebSearchProvider`
- Source: `packages/web/web/src/types.ts`

| Member   | Signature                                                                                    | Task use                                       |
| -------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `id`     | `string`                                                                                     | Unique id within the search provider registry. |
| `search` | `(request: WebSearchRequest, signal?: AbortSignal \| undefined) => Promise<WebSearchResult>` | Runs one query and forwards cancellation.      |

`available(): boolean` is required and must be a cheap local check; it is part of the public declaration in `packages/web/web/src/types.ts`.

**`OfficeToPdf`**

- Entry: `export:@deepseek-ai/dsh-office-to-pdf:.`
- Signature: `OfficeToPdf`
- Source: `packages/document/office-to-pdf/src/index.ts`

| Member   | Signature                                                                                                                                      | Task use                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `render` | `(workspaceFileScope: WorkspaceFileScope, path: string, priority: OfficeToPdfPriority, signal: AbortSignal) => Promise<RenderedDocumentBytes>` | Reads an authorized Workspace file and returns complete PDF bytes. |

**`OfficeToPdfResult`**

- Entry: `export:@deepseek-ai/dsh-office-to-pdf:.`
- Signature: `OfficeToPdfResult`
- Source: `packages/document/office-to-pdf/src/types.ts`

This result is a data type, not a callable extension point; conversion methods live on `OfficeToPdf`.

**`DynamicCordisPackageRunner`**

- Entry: `export:@deepseek-ai/dsh-cordis-client-runner:./client`
- Signature: `DynamicCordisPackageRunner`
- Source: `packages/extensions/cordis-client-runner/src/client/runtime.ts`

| Member        | Signature                                                             | Task use                                                                |
| ------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `dispose`     | `() => Promise<void>`                                                 | Unloads live browser packages and waits for teardown.                   |
| `getSnapshot` | `() => readonly DynamicCordisLivePackage[]`                           | Reads this page’s live package set, stable until mutation.              |
| `load`        | `(half: DynamicCordisClientHalf) => Promise<DynamicCordisLoadResult>` | Loads an exact run; success may still be waiting for injected services. |
| `subscribe`   | `(fn: () => void) => () => void`                                      | Watches live-set and render-failure changes; caller owns unsubscribe.   |

**`TerminalController`**

- Entry: `export:@deepseek-ai/dsh-api-terminal-controller:.`
- Signature: `TerminalController`
- Source: `packages/api/terminal-controller/src/index.ts`

| Member   | Signature                                                                                                                                  | Task use                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `create` | `(agent: Agent, request: TerminalCreateRequest, signal: AbortSignal) => Promise<WebTerminalInfo>`                                          | Allocates idempotently for caller-generated identity; committed process survives disconnect. |
| `list`   | `(sessionId: SessionId) => WebTerminalInfo[]`                                                                                              | Returns retained terminals without activating an Agent.                                      |
| `resize` | `(agent: Agent, id: Branded<"WebTerminalId">, attachmentId: Branded<"TerminalAttachmentId">, cols: number, rows: number) => Promise<void>` | Resizes a writable attachment; no signal parameter.                                          |
| `write`  | `(agent: Agent, id: Branded<"WebTerminalId">, attachmentId: Branded<"TerminalAttachmentId">, data: string) => Promise<void>`               | Sends input through the current writable attachment; no signal parameter.                    |

The same public class also declares `environment(agent: Agent, signal: AbortSignal): TerminalEnvironment`, `shells(agent: Agent, signal: AbortSignal): Promise<TerminalShell[]>`, `retain(sessionId: SessionId, id: WebTerminalId, signal: AbortSignal): AsyncIterable<TerminalRetentionFrame>`, `follow(agent: Agent, id: WebTerminalId, attachmentId: TerminalAttachmentId, signal: AbortSignal): AsyncIterable<TerminalFrame>`, `rename(agent: Agent, id: WebTerminalId, title: string): void`, and `close(agent: Agent, id: WebTerminalId): Promise<void>`. `retain` and `follow` are stream Remote methods. Source: `packages/api/terminal-controller/src/index.ts:117-284`.

**`ClientTerminals`**

- Entry: `export:@deepseek-ai/dsh-api-terminal-controller:./client`
- Signature: `ClientTerminals`
- Source: `packages/api/terminal-controller/src/client/index.ts`

| Member | Signature                                                                                                                | Task use                                     |
| ------ | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| `view` | `(sessionId: SessionId, key: string, contentId: string, terminalId?: WebTerminalId, shellPath?: string) => TerminalView` | Returns the per-occurrence observable model. |

The class also declares `launchShells(sessionId: SessionId, signal: AbortSignal): Promise<TerminalLaunchShells>`, `selectShell(path: string): void`, `close(sessionId: SessionId, key: string, contentId: string, terminalId?: WebTerminalId): void`, and `retainTabs(tabs: readonly { sessionId: SessionId; tabId: string; contentId: string }[]): void`. Source: `packages/api/terminal-controller/src/client/index.ts:78-143`.

**`Workspace`**

- Entry: `export:@deepseek-ai/dsh-workspace:.`
- Signature: `Workspace`
- Source: `packages/workspace/workspace/src/types.ts`

| Member   | Signature                              | Task use                                   |
| -------- | -------------------------------------- | ------------------------------------------ |
| `id`     | `Branded<"WorkspaceId">`               | Stable branded Workspace identity.         |
| `path`   | `string`                               | Registered Host directory path.            |
| `status` | `() => Promise<"ok" \| "missing-dir">` | Checks whether the directory still exists. |

**`IWorkspaces`**

- Entry: `export:@deepseek-ai/dsh-api-workspace-controller:./client`
- Signature: `IWorkspaces`
- Source: `packages/api/workspace-controller/src/client/service.ts`

| Member   | Signature                                              | Task use                                                            |
| -------- | ------------------------------------------------------ | ------------------------------------------------------------------- |
| `create` | `(input: { path: string; }) => Promise<WorkspaceView>` | Registers an existing path and returns the Host-resolved Workspace. |
| `list`   | `WorkspaceSource`                                      | Observable Host-authoritative Workspace snapshot and follow state.  |

**`defineStore`**

- Entry: `export:@deepseek-ai/dsh-client-store:.`
- Signature: `<T, A extends ActionsDecl<T>>(decl: StoreSpec<T, A> & { actions: A & ActionsDecl<T> }): EngineStoreHandle<T, A>`
- Source: `packages/client/store/src/index.ts`

`init()` creates state per instance; actions write through the returned handle. Persisted keys belong to browser `localStorage`.

**`createSnapshotStore`**

- Entry: `export:@deepseek-ai/dsh-client-store:.`
- Signature: `<T>(init: T, opts?: { flush?: 'raf' | 'sync'; persist?: { name: string } }): SnapshotStore<T>`
- Source: `packages/client/store/src/index.ts`

Produces a React-free observable with stable snapshot reads; `raf` batches notifications and `persist` uses browser `localStorage`.

**`InputActions` / `TokenSpan`**

- Entry: `export:@deepseek-ai/dsh-client-ui-conversation:./client`
- Signature: `InputActions`; `TokenSpan = { readonly start: number; readonly end: number; readonly draftRev: number }`
- Source: `packages/client/ui-conversation/src/client/contract/input.ts:222-231`; `contract/draft-editor.ts:7-11`

| Member             | Signature                                    | Task use                                                                                                                    |
| ------------------ | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `captureInsertion` | `() => TokenSpan`                            | Capture selection and draft revision before an asynchronous operation.                                                      |
| `insertText`       | `(text: string, span: TokenSpan) => boolean` | Insert one undoable plain-text edit; `false` means revision changed or input is locked, so keep text for an explicit retry. |

The session-scoped `PropsRuntime<'conversation.input.activity'>` supplies `inputActions: InputActions`, `locked: boolean`, and `onActiveChange(active: boolean): void` after importing the conversation `./client` augmentation. `InputActivityOwnerProps` is declared in the owner's `contract/slots.ts` but is not directly re-exported by its public `./client` index; use the `SlotMap` key through `PropsRuntime` instead. Source: `packages/client/ui-conversation/src/client/contract/slots.ts:205,260,416-419`.

**`PluginActivationOwnerProps`**

- Entry: `export:@deepseek-ai/dsh-client-ui-plugin-manager:./client`
- Signature: `PluginActivationOwnerProps`
- Source: `packages/client/ui-plugin-manager/src/client/slot-contract.ts:66-79`; re-exported by `src/client/index.ts`

`plugins.bundle.activation` is a root-scoped keyed slot declared by the plugin manager. Register with the exact bundle package name as `key`; its owner props guide the user after explicit enablement.

| Member          | Signature    | Task use                                                    |
| --------------- | ------------ | ----------------------------------------------------------- |
| `packageName`   | `string`     | Bundle that the enablement guidance concerns.               |
| `onDismiss`     | `() => void` | Dismiss this activation guidance.                           |
| `onOpenDetails` | `() => void` | Dismiss guidance and navigate to that bundle's detail page. |

**`ConfigForm`**

- Entry: `export:@deepseek-ai/dsh-client-ui-settings:./client`
- Signature: `ConfigForm<T>`
- Source: `packages/client/ui-settings/src/client/config-form-types.ts`

| Member        | Signature                                                                                          | Task use                                                          |
| ------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `getSnapshot` | `() => ConfigFormSnapshot<T>`                                                                      | Reads stable current value, revision, mode and write status.      |
| `mutate`      | `(ops: readonly SettingsPathOpView[], expectedRevision?: number \| undefined) => Promise<boolean>` | Queues atomic path operations against an optional fixed revision. |
| `set`         | `(field: string, value: unknown) => Promise<boolean>`                                              | Queues one top-level field write.                                 |
| `subscribe`   | `(listener: () => void) => () => void`                                                             | Watches snapshot replacements; caller owns unsubscribe.           |
| `unset`       | `(field: string) => Promise<boolean>`                                                              | Clears one override to restore inherited value.                   |

`ConfigFormSnapshot<T>` is the `getSnapshot()` result: `status` is `loading | ready | unavailable`, `mode` is `host | memory`, `writable` gates mutation, and `revision?: number` fences a Host write. Its `base`, `user` and resolved `value?: T` distinguish defaults, override and effective state. After `mutate` returns false or rejects, read a fresh snapshot before retrying; do not reuse the old revision.

`TerminalCreateRequest` requires caller-generated `id: WebTerminalId`, `cols` and `rows`, with optional discovered `shellPath`; retry the same id after a transport fault rather than allocating a second terminal. A `TerminalFrame` is a discriminated `type` union: initial `snapshot` has bounded `screen`, `sequence` and `info`; later `output` has ordered `sequence`/`data`; `state` has updated `info`. A retain hold is separate from the writable attachment used by `write`/`resize`. The Client `TerminalView` exposes stable `id`, observable `state`, `mount()` cleanup, `connect()`, `refresh()`, `acknowledge(revision)`, `write(data)`, `resize(cols, rows)`, async `rename(title)`, `close()` and `dispose()`; the view owner must call the latter when its Sidebar occurrence ends. Sources: `packages/api/terminal-controller/src/types.ts` and `src/client/index.ts`.

For Workspace UI, `WorkspaceSource.getSnapshot()` returns a `WorkspaceSnapshot` and `subscribe(listener)` returns the exact unsubscribe. The snapshot's `state` and `phase` distinguish idle/loading/error from initial baseline and ready follow state; `items` holds Host-authoritative rows, `archivedSessionIds` and `pinnedSessionIds` are separate sets, and `error` explains a failed follow. `WorkspaceArchiveError` carries `name` and `rpcError: RemoteFailure`; inspect its code before offering a stop-activity retry. Sources: `packages/api/workspace-controller/src/client/service.ts` and the Client model.

## Remote authoring symbols

These symbols belong to `@deepseek-ai/dsh-typert-protocol` root; the selected Host/Client example uses them directly. `TypertRemoteService` is the service base that binds a Cordis service key to a wire namespace. Its constructor is `protected (ctx: Context, serviceKey: string, options?: { namespace?: string })`; a subclass calls `super(ctx, key, { namespace })`. Source: `packages/typert/protocol/src/index.ts:166-179`.

| Symbol                                                  | Public task contract                                                                                                                                                                                                                                                                                                      | Source                                                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `Remote`                                                | Standard method decorator `@Remote` or `@Remote(name: string)`; optional `{ mode: 'stream' }` declares a logical stream. Only public instance methods are accepted. A cancellation parameter is named `signal` and placed last.                                                                                           | `packages/typert/protocol/src/index.ts:195-225`; `packages/typert/generator/src/analyzer.ts:1106` |
| `RemoteError<Code>`                                     | `new RemoteError(code, message, details, options?: ErrorOptions)`; `Code` indexes declaration-merged `RemoteErrorDetailsMap`, so `details` has the code-specific type. `isDSHRemoteError` identifies the domain error without relying on cross-realm `instanceof`. The `cause` is process-local and not a wire guarantee. | `packages/typert/protocol/src/remote-error.ts:12-31`                                              |
| `RemoteErrorDetailsMap`                                 | Merge-extensible code-to-details table. Domain packages declare their own codes beside throwing code; built-ins include `gateway/bad-request`, `gateway/cancelled`, `gateway/internal`.                                                                                                                                   | `packages/typert/protocol/src/types.ts:45-63`                                                     |
| `RemoteResult<T>`                                       | Discriminated result `{ ok: true; value: T } \| { ok: false; error: RemoteFailure }`; business/carrier failures use the error arm, while local assembly faults may reject.                                                                                                                                                | `packages/typert/protocol/src/types.ts:67-79`                                                     |
| `RemoteFailure`                                         | Error arm with stable `code`, readable `message` and typed `details` when the code belongs to `RemoteErrorDetailsMap`; treat it as data returned by a Remote call, not as a thrown local exception.                                                                                                                       | `packages/typert/protocol/src/types.ts:49-78`                                                     |
| `TypertRemoteContribution`                              | Generated Client contribution `{ package: string; descriptors: readonly InvocationDescriptor[] }`; pass the generated `./remote` runtime value to `ctx.remote.$mount`. Do not hand-author descriptors.                                                                                                                    | `packages/typert/protocol/src/types.ts:423-438`                                                   |
| `TypertClientRemote`                                    | Client facade has `$mount(contribution): Promise<TypertDisposer>` and typed `$on(event, listener)`; namespace methods arrive from declaration merging. Mount is effect-owned, but await its disposer before destroying dependent UI.                                                                                      | `packages/typert/protocol/src/types.ts:431-455`                                                   |
| `RemoteStream<Out, In>` / `RemoteStreamHandle<Out, In>` | Host stream method returns iterable or marked `RemoteStream`; generated Client method opens a handle with async iteration and `send`, `end`, `dispose`. A holder that neither iterates nor disposes retains Host stream resources.                                                                                        | `packages/typert/protocol/src/types.ts:82-124`                                                    |

## Slot authoring symbols

`@deepseek-ai/dsh-client-ui-slots` root exports the type vocabulary, while `@deepseek-ai/dsh-client-ui-renderer/client` installs the public `ctx.slots` service facade. The facade binds `register` and `inject` effects to the calling Cordis fiber; target `packages/client/ui-renderer/src/client/registry.ts:164-181,194-270` is the runtime owner.

`SlotRegistry.register({ name, id }, Component, options?)` contributes a typed entry and returns its disposer; `SlotRegistry.inject(name, callback)` waits for the owner slot before running the callback, then withdraws its registration on owner loss. A contribution should use those two methods through `ctx.slots`; renderer-side `UiRendererService.mount` and owner-side header props do not need to be called by the contributor. `ConversationSessionHeaderSlotProps` and `ConversationHeaderActionOwnerProps` belong to the first-party conversation owner; importing its `./client` augmentation supplies the key used by `PropsRuntime<'conversation.session.header.actions'>`.

| Symbol                                               | Public task contract                                                                                                                                                                                                                                        | Source                                                                                                              |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `SlotMap` / `SlotEntryDef`                           | Owner declaration-merges each key with required `kind` and `scope`; `owner`, `keyProps`, `hookContext`, `inject` and related fields describe the share. Other packages import the owner's `./client` augmentation with `import type {}` before registering. | `packages/client/ui-slots/src/index.ts:25-30,116-137`                                                               |
| `PropsRuntime<K, EntryKey>`                          | Owner share plus key props, slot-injected face, and scope standard props; the Component reads this, never a captured Cordis `ctx`. In the selected header-actions example, `K` is `conversation.session.header.actions`.                                    | `packages/client/ui-slots/src/index.ts:245-262`; `packages/client/ui-conversation/src/client/contract/slots.ts:156` |
| `PropsStore<H>` / `InjectFace<I>` / `PropsLocale<N>` | Add store selector/actions, registration-injected data/callbacks, and typed `t` respectively. Only include a share when the registration declared the matching feature.                                                                                     | `packages/client/ui-slots/src/index.ts:595-609`                                                                     |

## Web provider request and result symbols

The following types are exported by `@deepseek-ai/dsh-web` root and are necessary to author or call a provider. Its `WebRuntime` selects at call time and exposes `registerSearchProvider`, `registerFetchProvider`, `search`, and `fetch`; see `packages/web/web/src/index.ts:96-164`.

| Symbol                                | Public task contract                                                                                                                                                                                                                    | Source                                                                         |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `WebSearchRequest`                    | `{ query: string; maxResults?: number }`; provider may use `maxResults` to reduce upstream cost, and `WebRuntime` enforces it on returned sources.                                                                                      | `packages/web/web/src/types.ts:13-28`                                          |
| `WebSearchResult` / `WebSearchSource` | Result has optional `content`, `sources: readonly WebSearchSource[]`, `truncated: boolean`; each source requires `url`, with optional `title`, `snippet`, `publishedAt`.                                                                | `packages/web/web/src/types.ts:30-56`                                          |
| `WebFetchRequest`                     | `{ url: string }`; timeout and format are not request fields. The optional `AbortSignal` is passed separately to `fetch`.                                                                                                               | `packages/web/web/src/types.ts:58-68`                                          |
| `WebFetchResult` / `WebFetchBody`     | Result has final `url`, `statusCode`, `body`, `truncated`; the closed body union has `kind: 'html' \| 'text'` and `content`. Non-2xx response is a result, not a transport exception.                                                   | `packages/web/web/src/types.ts:70-96`                                          |
| `WebError` / `WebRuntimeConfig`       | Registry and selection failures use `WebError.code`; `WebRuntimeConfig.searchProvider` and `.fetchProvider` pin ids, otherwise exactly one available provider is required. Do not treat provider-specific error codes as a closed enum. | `packages/web/web/src/types.ts:122-135`; `packages/web/web/src/index.ts:62-93` |

## Build-time Remote generation

`@deepseek-ai/dsh-typert-generator` root exports `WorkspaceTypertGenerator(root, options?)`; `generate(packages?, faces?)` returns `WorkspaceEmitResult[]` with `package`, `packageRoot`, `face`, `js`, `dts`, and optional `remote` containing `js`, `dts`, `dtsMap`. The selected recipe requests one Host package with `generate(['@acme/dsh-review'], ['host'])`, writes `typert.host.*` and `typert.remote-client.*`, then compiles the Client against those declarations. The generator discovers only package project references under `packages/` from independent root `tsconfig.host.json` and `tsconfig.client.json`, and validates exact manifest exports and `files` entries. Source: `packages/typert/generator/src/index.ts:14-15`, `src/workspace.ts:14-123`, `src/analyzer.ts:294-336,478-520`. The published `./tsdown` subpath exports `typertPlugin(options?)` as an alternative build integration (`src/tsdown-plugin.ts:30-43`), but the selected recipe uses the direct root API.
