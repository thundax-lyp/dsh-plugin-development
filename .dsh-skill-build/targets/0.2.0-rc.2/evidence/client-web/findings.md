# Client / Web / Remote / UI evidence

Target: `@deepseek-ai/dsh-agent@0.2.0-rc.2`, tag `dsh-v0.2.0-rc.2`, commit `639ed015397290b3745d163aafe02ffee4aa3f84`.

This evidence was rebuilt from the target checkout. The existing generated Skill was not read.

## Plugin-author extension surface

The reusable browser extension path is a two-faced Cordis package. Its Host entry is a normal Loader plugin and its `./client` export is the browser plugin. The package manifest declares `dsh.client.platform: "web"`; the Web composition must mount the package as a bare package row and install it as a dependency. `packages/client/modules` scans enabled Loader entries, serves built `lib/client.js`, and materializes its lazy-CJS factory. A subpath Loader row does not carry the package's Client half.

The repository's `clientBundle` build preset is internal to the monorepo rather than a published package. Therefore the target proves the artifact contract, not a turnkey external build tool: an independent npm plugin must reproduce the single-file factory format or use a separately supplied compatible builder. A source-only `./client` export is not loadable by the Web profile.

The generic UI extension contract is `@deepseek-ai/dsh-client-ui-slots`. `SlotMap` declaration merging fixes each slot's `kind`, `scope`, owner props, optional keyed props, hook context, and slot-level injected face. A registration contributes through `ctx.slots.register`; the owner registration's `children` table both declares and authorizes child rendering. `ctx.slots.inject(name, callback)` is the safe way to wait for a declaration owned by another package. The returned registration/injection disposer belongs to the caller's Cordis effect lifetime.

Cardinality is runtime-enforced: `single` selects the lowest-priority entry; `list` requires an `id` and orders by `order`; `keyed` requires a declared key; `chain` requires a pure selector and takes the first non-null match. Only `root` is predeclared. Duplicate declaration ownership, registration into an undeclared slot, same-priority collisions, stale render authorization, and incompatible store scopes fail loudly.

Component inputs are derived, not hand-written: `PropsRuntime`, `PropsRenderSlots`, `PropsRenderFactories`, `PropsStore`, `InjectFace`, and optional `PropsLocale`. Components never receive `ctx`. Owner-known values use owner props; entry-private services and callbacks use the registration `inject` factory; mutable shared view state uses a declared store; React content crosses package boundaries through slots. Business packages must not runtime-import another feature package.

`@deepseek-ai/dsh-client-store` owns `defineStore`, `createSnapshotStore`, and stable snapshot subscriptions. Store handles are created in `apply` and passed to registrations; production components read `props.useStore` and write only `props.actions`. Browser persistence is JSON `localStorage`, disables itself outside a browser or after storage failures, and is not Host or Session persistence.

## Remote contract

A Host-owned service extends `TypertRemoteService`, binds a namespace in `super`, and marks exported methods with `@Remote`. Agent/Session lookup values may occur only as top-level parameters. Cooperative cancellation is the final `AbortSignal` parameter. Public failures use one `RemoteError` and declaration-merge domain codes into `RemoteErrorDetailsMap`; unrelated exceptions are folded by the Gateway to `gateway/internal`.

The generated `./typert` and `./remote` entries are build artifacts. Signature, namespace, failure-code, or export changes require the repository's Typert generation/build step. `@deepseek-ai/dsh-api-remotes/client` is the application assembly that mounts selected generated contributions through `ctx.remote.$mount`; it is not runtime discovery. A Client caller injects both `remote` and `remote.<namespace>` and branches on `RemoteResult.ok`. Unary cancellation is an error result with code `gateway/cancelled`, not a rejected promise.

`ctx.remote.$host` exposes fixed page facts `{ home, isLoopback }`; `home` is undefined before the first ready frame. They are plain reads. Refresh state after `connection/reset` or a domain-owned Remote event. Ordinary forwarded events are best effort and not replayed; reliable recovery needs a query, cursor, or opening snapshot. Remote stream objects and contributions are effect-owned and must be disposed.

## Settings contract

Host plugins expose editable values through their exported Cordis `Config` schema. Fields intended for live updates use `Volatile<T>` and a `.volatile()` schema node; operation code samples `.get()` once. `SettingsForms.configure` controls whether an automatic page is generated but does not change the Config itself.

The Client `configForms` service owns one shared settings mirror. `get(entryId)` returns a shared `ConfigForm<T>` with stable snapshots and serialized `set`, `unset`, and atomic `mutate` writes. A staged editor passes the read `revision` to `mutate`; conflicts or refusals reload the latest Host state. `unset` restores inheritance instead of writing a guessed default. Non-loopback Web uses memory mode and does not persist Host settings. Custom pages for another namespace use `whileServed` and own the returned disposer.

Slots used for settings pages are declared by `@deepseek-ai/dsh-client-ui-settings/client`; the shipped shell and pages are examples, not generic APIs to import at runtime. A feature may type-import their declarations and contribute to `settings.section`, `settings.plugins.tab`, or the documented plugin-detail slots.

## Domain APIs and product packages

Workspace, terminal, schedule, document conversion, deliverables, session/job controllers, file upload, and Web providers publish real Host/Client/Remote types and are present in the Web bundle. They are public composition candidates, but their shipped UI packages are product feature plugins, not a license to import their implementation components. Reuse is through their Cordis services, generated Remote namespaces, slot declarations, and data types. The main ledger should merge these entries into domain references instead of documenting every product screen as a distinct extension mechanism.

The Web bundle is the observed real composition: it mounts Gateway, Connection, API Remote assembly, modules, renderer, slots-owning feature packages, controllers, settings, workspace, terminal, Office conversion, deliverables and the built frontend. This proves intended composition and package presence. It does not prove an independently published third-party package can build or install.

## Deprecation and exclusions

`ClientTimerService.setTimeout` and `setInterval` are explicitly deprecated; new Client plugins use `ctx.timeout` and `ctx.interval`. DOM `keyCode`, clipboard fallback, and HTML `align` comments are browser compatibility notes, not DSH API deprecations.

`apps/web` is the product frontend, and `@deepseek-ai/dsh-web-frontend` exports dist assets only. It is not a plugin API. `@deepseek-ai/dsh-client-web` is shell boot/injection infrastructure, not a Loader Client plugin. Generated `./remote` and `./typert` entries are consumed through the generator/assembly, not hand-authored implementations.

## Evidence paths

- `packages/client/AGENTS.md`
- `packages/client/ui-slots/src/index.ts`
- `packages/client/ui-slots/src/renderer.ts`
- `packages/client/store/src/index.ts`
- `packages/client/modules/src/index.ts`
- `packages/client/modules/src/client/index.ts`
- `packages/api/gateway/src/index.ts`
- `packages/api/gateway/src/client/index.ts`
- `packages/api/remotes/src/index.ts`
- `packages/api/remotes/src/client/index.ts`
- `packages/settings/settings/src/index.ts`
- `packages/settings/settings/src/types.ts`
- `packages/client/ui-settings/src/client/config-form.ts`
- `packages/client/ui-settings/src/client/config-form-types.ts`
- `packages/extensions/cordis-client-runner/src/client/index.ts`
- `packages/extensions/cordis-client-runner/src/client/timer.ts`
- `packages/bundle/web-app/cordis.patch.yml`
- `packages/bundle/web-app/package.json`
- `docs/cookbook/adding-a-remote-api.md`
- `docs/cookbook/adding-a-settings-card.md`
- `docs/subsystems/slots.md`
- `docs/subsystems/web-client.md`
- `docs/subsystems/client-modules.md`

## Validation boundary

No independent consumer package was built or loaded, no browser smoke was run, and no generated Remote declarations were regenerated in this subtask. Conclusions are source-, test-, gate-, and shipped-composition-backed. The complete creation workflow must still compile the final Client example and run the isolated Profile/Client/Remote smoke lane.
