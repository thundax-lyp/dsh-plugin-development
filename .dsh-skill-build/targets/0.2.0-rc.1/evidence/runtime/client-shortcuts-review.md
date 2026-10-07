# Client shortcuts review and browser smoke

## Candidate and source decision

The target is `dsh-v0.2.0-rc.1` at commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`. `skill-source/coverage.json` still has pending `review-public-package-packages-client`, which includes `package:@deepseek-ai/dsh-client-shortcuts`; this review proposes a scoped outcome for that package, not a disposition for the whole Client package group. Plugin-author task: register an application shortcut in an external Web Client half, execute it only in an allowed input region, and remove it on plugin unload.

| Claim | Exact target source |
| --- | --- |
| Public `Shortcuts` service, `ShortcutCommand`, context, fixed-input and catalog types | `packages/client/shortcuts/src/client/index.ts`, `src/client/types.ts`, `src/binding.ts`, `src/configuration.ts` |
| Command registration validation, effective binding, dispatch, duplicate/conflict errors | `packages/client/shortcuts/src/client/registry.ts` |
| Web/desktop environment, region/modal detection, keyboard listener lifetime | `packages/client/shortcuts/src/client/dom.ts` |
| `register` returns disposer and caller must own it; service keyboard and storage lifetime | `packages/client/shortcuts/src/client/index.ts`; in-tree calls in `ui-sidebar-browser/src/client/index.ts` and `ui-layout/src/client/index.ts` |
| Browser origin storage key, Desktop bridge boundary | `packages/client/shortcuts/src/client/storage.ts` |
| Web Profile loads shortcuts and reference UI | `packages/bundle/web-app/cordis.patch.yml` |

The `register` method itself does not call `ctx.effect`; unlike some other registries, the owner must put its returned disposer in its own effect. The fixture does exactly that. Its `example.markPage` id has only a `web:macos` default with `primary+alt+shift+KeyG`; `regions: ['page']` excludes editor input. The action only increments a DOM instrumentation counter, so it is not described as a durable Session or model fact.

## Independent package and type validation

- Fixture: `evidence/tests/client-shortcuts-consumer/` with its own `package.json`, `src/index.js`, `src/client.js`, `src/client.ts`, patch and copy build. `npm install --ignore-scripts --no-audit --no-fund` installed eight exact dependencies into its own `node_modules`.
- `./node_modules/.bin/tsc -p tsconfig.json` exited 0 against the published rc.1 `@deepseek-ai/dsh-client-shortcuts/client` declarations. `npm run build`, `node --check lib/client.js` and `npm pack --dry-run --json` exited 0; pack included the Host and Client entries plus patch.
- With fixture-local `DSH_HOME`, `dsh --profile shortcut-smoke --from-default-profile web --dump-config` initialized a Web Profile. `dsh plugin --profile shortcut-smoke add <fixture>` exited 0. Dump showed existing `shortcuts` service plus the `shortcut-probe` Loader row.

## Chrome/Web Profile observation

The isolated Web server ran at local port 43885. A fresh Chrome tab loaded it and skipped API-key onboarding; no message or model call was sent. The fixture reported its state through `document.documentElement.dataset.dshShortcutProbe`.

| Action | Observed marker | Meaning |
| --- | --- | --- |
| First page load | `{"registered":true,"hits":0,"disposed":false}` | Client factory applied and registered the command. |
| Press `⌘⌥⇧G` with page focus | `{"registered":true,"hits":1,"disposed":false}` | Web keyboard adapter dispatched the command once. |
| Focus message input and press same combination | `{"registered":true,"hits":1,"disposed":false}` | `editable` was outside command regions. |
| Remove package while server ran | `{"registered":true,"hits":1,"disposed":true}` | Client fiber effect disposer ran. |
| Focus page button and press same combination | `{"registered":true,"hits":1,"disposed":true}` | Removed command no longer executed. |

The plugin-manager remove command exited 0 and a subsequent config dump had no `shortcut-probe` row. The test tab and Web server were closed; port 43885 no longer listened. The marker is fixture instrumentation; its hit increment after a real browser keypress and stable value after removal are the behavioral observations. No screenshot was needed for the DOM-only counter.

## Limits and ledger suggestion

This smoke covers Chrome on macOS Web only. It did not exercise catalog UI, preference `edit`, storage restore, duplicate/default conflict errors, fixed inputs, Desktop native routing or cross-browser key delivery. The code review establishes those contracts; the run does not prove them. `ShortcutCommandId` and defaults are target-specific, and arbitrary business actions must handle their own async failure/cancellation and write durable facts to Session when required.

Candidate mapping for the shared ledger: `package:@deepseek-ai/dsh-client-shortcuts` and the application-command subtask from `subsystems:web-client` → `references/api-client-shortcuts.md` (public object/member contract) plus `references/how-to-add-client-shortcut.md` (ordered package, Client registration, browser dispatch and unload). Leave unrelated Client package candidates pending.
