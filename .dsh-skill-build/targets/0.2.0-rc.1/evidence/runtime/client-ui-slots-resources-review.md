# Client Slots and resources review — dsh-v0.2.0-rc.1

Source checkout: `dsh-v0.2.0-rc.1`, commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`. This is a source review, not an independent browser run.

## Public entrypoints and ownership

- `packages/client/ui-slots/package.json`: published root export; `src/index.ts` declares `SlotMap`, cardinalities/scopes, registration option types and `SlotCore`; `src/renderer.ts` declares renderer contracts. Its `./src/*` path is a source export, but ordinary consumers use the root public entry.
- `packages/client/ui-renderer/package.json` and `src/client/index.ts`: `./client` exports `SlotRegistry`; Client `apply` constructs it, installs renderer, and provides `ctx.uiRenderer`. `src/client/registry.ts` implements `register`, `registerFactory`, `inject`, root/locale/scope adapters, and effect ownership.
- `packages/client/resources/package.json`: root Host `apply` is empty, `./client` exports resource types, Client `apply`, and service. `src/client/contract.ts` owns provider/snapshot signatures; `src/client/resources.ts` owns stream/holder mechanics.
- `packages/bundle/web-app/cordis.patch.yml` includes ui-renderer and resources in the shipped web composition; package presence alone does not mount a third-party Client half.

## Runtime and test checks

- `ui-slots/src/index.ts` lines around `1150–1290`: undeclared target, duplicate cell/child, required keyed/list/chain fields, priority winner, recursive disposal. `ui-slots/tests/core.client.spec.ts` tests root, conflicts, idempotent disposal, cascade, sorting, snapshots and declaration listeners.
- `ui-renderer/src/client/registry.ts` around `190–275`: registration uses caller `ctx.effect`; `inject` waits for declaration and disposes on collapse; synchronous setup failure and delayed microtask failure differ. `ui-renderer/tests/registry.client.spec.ts` tests injection, fiber disposal, and declaration reappearance.
- `resources/src/client/contract.ts`: `ResourceProtocolMap`, `ResourceStatus`, `ResourceSnapshot`, `UseResource`, `ResourceProvider`, `Resources`. `resources/src/client/resources.ts`: URL protocol parsing, one provider, holder count, abort, failure frames and stable address records. `resources/tests/resources.client.spec.ts` tests all these branches; `apply.client.spec.ts` tests service plus hook assembly.
- `docs/subsystems/slots.md`, `packages/client/ui-slots/README.md`, `packages/client/resources/README.md`, and `docs/cookbook/adding-a-settings-card.md` supply author task and composition context. Their examples marked `ignore-check` are not compilation evidence.

## Ledger handoff

Suggested topics: `client-slots` owned by `api-client-slots.md`; `client-resources` owned by `api-client-resources.md`. Relevant coverage candidates should include `package:@deepseek-ai/dsh-client-ui-slots`, `package:@deepseek-ai/dsh-client-ui-renderer`, `package:@deepseek-ai/dsh-client-resources`, and `subsystems:slots`. The renderer is a separate package with distinct `./client` entry and may merit its own object/member owner if the API ledger is fine grained. The resources Host root is only an empty composition stub; the operational API is `./client`.

Suggested API entry decisions: include `export:@deepseek-ai/dsh-client-ui-slots:.` for type contracts; include `export:@deepseek-ai/dsh-client-ui-renderer:./client` for `ctx.slots` service; include `export:@deepseek-ai/dsh-client-resources:./client` for provider/hook API; include resources `.` only as a package composition entry, not an independent Host capability. Do not infer runtime support from `./src/*` export. Directly used objects: `SlotMap`, `SlotEntryDef`, `SlotKind`, `SlotScope`, `PropsRuntime`, `PropsRenderSlots`, `SlotCore.register` / `SlotRegistry.register`, `SlotRegistry.inject`, `ResourceProtocolMap`, `ResourceSnapshot`, `ResourceProvider`, `Resources`, `UseResource`. Factory and advanced store/locale/renderer internals are present but need separate review before broad inclusion.

Task path candidates: contribute a Web UI action to an existing declared slot; provide and read an address keyed resource. Each must route through Client package build/Loader, not just `ctx.slots.register` in a Host plugin. Task discovery `docs/cookbook/adding-a-settings-card.md` is partly config editing and partly Client slot extension; route the latter here, and keep config schema/Host validation with its separate owner.

## Independent Client verification

Isolated consumer: `evidence/tests/client-ui-consumer/`. It installs published `0.2.0-rc.1` Client slots, renderer, conversation, session, resources, protocol, session-controller, and store declarations plus Cordis `4.0.4` and React `18.3.1`. The installed session-controller and store are needed for the `useSession` selector to retain its actual type; `skipLibCheck` alone would otherwise hide a missing dependency and let the selector parameter become implicit `any`.

- `./node_modules/.bin/tsc -p tsconfig.json`: passed for the Slots TSX example, Resources provider example, and a combined slot component reading `useResource<'note'>`. First pass exposed a real omission in `client-slots.md`: `Context.slots` requires a type import of `@deepseek-ai/dsh-client-ui-renderer/client`; this is fixed in the reference. No `any` or diagnostic suppression was added to the snippets.
- `browser-half/` is a separate, isolated lazy-CJS package modeled on the target module protocol, leaving the other agent's `client-presence-consumer` untouched. It publishes root Host and `./client`, declares the Web Client dependencies, registers a `note` resource provider, contributes a Conversation header list cell, and renders the resource snapshot. `npm run build`, `node --check lib/client.js`, and `npm pack --dry-run --json` passed; the pack includes `package.json`, patch, Host JS and Client JS.
- `node smoke.mjs` executes the built Client script in a Node VM with fake module-loader and Cordis service faces. It observed the expected registration id, provider's successful first frame, slot cell id, and `Ready` React element. This is protocol-shape and component-function evidence, not a real Cordis fiber or Web render.

Real Web Profile activation, resource subscription/abort, Session binding, browser React rendering, failure frame, HMR, and unload are **not covered** by this isolated check. Upstream `resources.client.spec.ts`, `apply.client.spec.ts` and renderer/slot tests support the target-version mechanics, but do not prove this consumer package is mounted in a page. A release-ready end-to-end UI task still needs actual Web Client loading and a visible result/disposal observation.
