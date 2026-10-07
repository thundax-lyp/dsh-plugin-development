# Client locale registration disposition

Target: `dsh-v0.2.0-rc.1`, commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`.

`packages/client/locale/src/client/index.ts` and published `@deepseek-ai/dsh-client-locale/client` expose a real Cordis `ctx.locale` registration surface, separate from input triggers and theme:

- `register(ns, { zh, en })` is the typed own-namespace dictionary path. The source says the namespace's `LocaleNamespaceMap` declaration merge fixes the key union and both built-in languages are required. Its disposer removes both dictionaries. `register(ns, locale, dict)` is the untyped one-language form for language packs or dynamic namespaces. Duplicate `(namespace, locale)` and invalid BCP 47-style locale IDs throw.
- `bind(ns)` returns a stable translation function reading the active locale at call time. Lookup walks the active language's declared fallback chain, then shared `common`, then returns the key. `resolveText` handles independent localized text maps without dictionary registration.
- `addLanguage({ id, label, fallback })` registers a selectable language. The fallback must already exist and terminate at English; duplicate or cyclic entries fail. Removing an active language falls back without clearing the stored preference ID.
- `getLocale`/`getSnapshot`/`subscribe` expose immutable state. `setLocale(id)` accepts only registered languages and persists an explicit choice through its settings scope. `locale/change` fires for a changed active locale; dictionary registration bumps the LocaleFace revision but does not emit `locale/change`.
- `apply` installs the locale service, its built-in dictionaries and General settings language row. Third-party packages should register their own namespace/dictionaries under an effect and use the slot renderer's locale seat or `bind`; replacing this service would also replace the shipped language UI and dictionary ownership.

Disposition: a distinct plugin-author registration task exists for localizing an owned Client surface; language packs are another composition path. This source audit did not independently compile a locale consumer or exercise language switching in a Web Profile. The independently executed Client registration task in this batch is `client-input-trigger-review.md`; do not promote this locale audit to runtime verification.
