# Remaining Client package priority disposition

Target: `dsh-v0.2.0-rc.1`, commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`. Decisions below are **recommendations** for the shared coverage/API ledger, not ledger edits or runtime verification. `included` means a plugin-author task has a real public entry; `merged` means the entry is explained through a more specific task; `excluded` means no ordinary external plugin task is supported by that entry. Each public subpath is judged independently.

## `@deepseek-ai/dsh-client-ui-settings`

| Entry | Recommendation | Code basis and target task |
| --- | --- | --- |
| `.` | merged → `api-settings.md` and `api-client-settings-forms.md` | `packages/client/ui-settings/src/index.ts` installs one Host developer-tools preference/configuration, not a third-party settings registry. Host setting ownership belongs with the settings task. |
| `./client` | included → `api-client-settings-forms.md` + `how-to-add-plugin-settings-card.md` | `src/client/index.ts` publishes `ctx.configForms` and `ctx.settingsSchema`; `src/client/config-form.ts` exposes `get<T>(entryId)`, `describe()`, `whileServed()` over the shared Host describe mirror. `src/client/contract/slots.ts` defines additive `settings.section`, `settings.plugins.tab`, `settings.general.item` seats. An external plugin can own its own UI and settings namespace, but must not replace the shared provider. Existing reference/HOW-TO already cover the principal task. |

Included-object follow-up: `ConfigForms` is already mapped. `ConfigForm<T>` and `ConfigFormSnapshot<T>` are direct consumer types in the same reference and should be included there with their explicit member table; `SettingsSchemaService` only needs inclusion if a documented schema-editor task uses its methods. `Settings*OwnerProps` are slot contract types and can merge into the settings card reference or Client slots reference rather than spawning one page per type. `apply`, `inject`, built-in developer-tools `Config` and describe implementation classes are composition context, not separate external tasks.

## `@deepseek-ai/dsh-client-web`

| Entry | Recommendation | Code basis and target task |
| --- | --- | --- |
| `.` | excluded from plugin-author API; mention in `api-client-modules.md` as boot boundary | `packages/client/web/src/index.ts` exports `AppWebEntry`, `getStaticModules`, fixed platform module words and boot helpers. `src/boot.ts` constructs one root Context, Loader and UI mount; this is the `apps/web` application entry, not a Cordis plugin with a contribution registry. External UI features enter through `dsh.client` metadata and Loader rows, not by constructing a second Web shell. |
| `./injections` | merged into Web boot/Host webserver deployment contract, not Client plugin authoring | `src/apply-injections.ts` executes a preselected `IndexInjection[]` table into document globals/scripts/styles/HTML in order. It is a page bootstrap interpreter, with no independently registered plugin callback. |

`PRELOADED_CLIENT_EXTERNALS` and `getStaticModules()` are static tables used by boot. Their published status does not make them mutable extension points; the external module boundary is `@deepseek-ai/dsh-client-modules/client` plus package metadata, already covered by `api-client-modules.md`.

## `@deepseek-ai/dsh-client-store`

| Entry | Recommendation | Code basis and target task |
| --- | --- | --- |
| `.` | merged/included as a supporting API in `api-client-slots.md` or a focused Client store subsection | `packages/client/store/src/index.ts` is a React-free library with `createSnapshotStore`, `defineStore`, `notifySubscribers`, `shallowEqual` and `SnapshotStore` types, no Cordis `apply` or service. `src/contract.ts` defines `StoreSpec`, `StoreHandle`, `StoreDecl`, `BoundActions`, `PropsStore` for the renderer's slot `store` seat. A plugin author with stateful slot UI can use `defineStore` in `apply` and pass the handle/factory to `ctx.slots.register`. |

`defineStore` is a real executable author primitive, so blanket exclusion would hide a useful task. Route the ordered task as “create a stateful slot component” and keep `StoreSpec`/`StoreHandle`/`PropsStore` in that reference. `createSnapshotStore` can be included for a service's bare observable state but should not be sold as a React hook; renderer synthesizes hooks. `notifySubscribers`/`shallowEqual` are general helpers, merged into the same library reference if the object/member ledger demands coverage. Persistence is optional `localStorage` by key, not Session durability or model fact storage; `clearPersisted()` is explicit and not called on ordinary scope disposal.

## `@deepseek-ai/dsh-client-file-upload`

| Entry | Recommendation | Code basis and target task |
| --- | --- | --- |
| `.` | merged into attachment/Session submission task for ordinary consumers; Host provider details conditional | `packages/client/file-upload/src/index.ts` owns `ctx.fileUploads`, streaming HTTP route, receipt staging and `registerAgentResolver`. `FileUploads` is one Host owner, not a general multi-provider upload registry. The ordinary third-party task should not mount a second service. Its `registerAgentResolver` is an exclusive specialized Host resolver; only a custom Session/Agent hosting composition would provide it. |
| `./client` | included, preferably a focused Client upload/Session submission reference and HOW-TO | `src/client/index.ts` supplies `ctx.fileUpload: FileUploadService`; `src/client/contract.ts` has `upload(sessionId, Blob\|Uint8Array\|ReadableStream, name?, signal?, onProgress?) -> RemoteResult<FileUploadValue>`. `src/client/runtime.ts` sends Blob/stream through background HTTP Worker and exact `Uint8Array` through Remote base64 fallback. `ui-conversation/src/client/service.ts` uses this API, stores receipt and durable file ref in its draft, and later submits through the Session path. A custom composer can consume it but must carry `receiptId` into the accepted prompt; a bare upload is staged, not a Session attachment yet. |
| `./types` | merged with the Client/Host upload reference | Browser-safe `EncodedFileUploadRequest`, `FileUploadValue`, `FileUploadReceiptId`, transport hooks; contract facts, not another registration task. |
| `./remote`, `./typert` | merged into generated Remote owner/build path | Generated client and Host Typert artifacts for this one service. They do not add a second plugin-author registry; external Remote work uses its own contribution. |

Cancellation and failure boundary: `upload()` may return `{ok:false}` for business failures or reject for HTTP/Worker/parse failures; `signal` aborts active background upload. The staged receipt is Agent/Session-scoped and retired on accepted prompt/queue observation; `src/index.ts` rejects subagent file uploads. A complete HOW-TO must include the submission binding and cleanup, not stop after the upload response. No isolated consumer or browser file selection was run in this audit.

## `@deepseek-ai/dsh-client-product-analytics`

| Entry | Recommendation | Code basis and target task |
| --- | --- | --- |
| `.` | excluded from ordinary third-party plugin tasks | `packages/client/product-analytics/src/index.ts` installs application-owned Desktop event collection over account identity and `productTelemetry`, with fixed `Config.enabled`; it is not a generic event provider registry. |
| `./client` | excluded, or merged into a narrow Desktop product telemetry integration if explicitly in scope | `src/client/index.ts` provides `ctx.productAnalytics.track` over a fixed `ProductEventMap`; service checks `dshDesktop` and a live Host policy stream. Ordinary browser application has no collection capability, `track()` becomes a no-op when disabled. No register-event/register-provider method is exposed. |
| `./types` | merged with the same product-owned telemetry boundary | `src/events.ts` defines the selected event names/attribute tuples. An open TypeScript interface alone is not evidence that generated Remote validation or analytics policy accepts third-party events. |
| `./remote`, `./typert` | excluded as a third-party registration path | Generated artifacts for product-owned reporting, not a mutable event schema or arbitrary analytics sink. |

This review is exact-source and public-export based. It does not independently compile these five packages as external consumers or exercise uploads, settings writes, Desktop analytics or Web boot. Existing settings task evidence is separate.
