# Right sidebar tab type review and Web smoke

## Target and candidate

Target checkout: `dsh-v0.2.0-rc.1`, commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`. `skill-source/coverage.json` still has pending `review-public-package-packages-client`, including `package:@deepseek-ai/dsh-client-ui-sidebar-right` and `package:@deepseek-ai/dsh-client-ui-dockkit`, plus pending `subsystems:web-client`. This review covers one external right-sidebar tab-type task. Dockkit is a published generic layout kit with no Cordis registration face; an external type in the existing product right sidebar uses sidebar-right's two-stage registry/slot boundary.

| Claim | Exact target source |
| --- | --- |
| Public Client exports for definition, registry, navigation, tab-info and slots | `packages/client/ui-sidebar-right/src/client/index.ts` |
| Type registration, priorities, globs, Guide entries, unique id/kind rules and disposer | `packages/client/ui-sidebar-right/src/client/tab-registry.ts` |
| Body/title keyed slots and `SidebarRightTabInfo`/lifetime signal | `packages/client/ui-sidebar-right/src/client/contract/slots.ts` |
| `ctx.sidebarRight` navigation, mounted Session binding and store adoption | `packages/client/ui-sidebar-right/src/client/service.ts` |
| Shipped guide entry action opens tab by kind, uses definition id to dispatch body | `packages/client/ui-sidebar-right/src/client/tabs/guide/GuideBody.tsx`, `src/client/index.ts` |
| In-tree external-style two-stage type/body example | `packages/client/ui-sidebar-documentpreview/src/client/index.ts` |
| Dockkit's independent pure engine/React surface | `packages/client/ui-dockkit/src/index.ts`, `package.json` |

The fixture definition has `id: example.sidebar.notes` and `kind: example-notes`. Its guide entry opens by kind; its body is a `sidebar.right.pane.tab` keyed contribution with key equal to the definition id. Both registrations are retained by the external Client plugin's `ctx.effect`. It is a page type with no resource `patterns` and no async provider.

## Independent consumer checks

- Fixture: `evidence/tests/sidebar-tab-consumer/`. `npm install --ignore-scripts --no-audit --no-fund` installed 13 exact dependencies into an isolated `node_modules`. `./node_modules/.bin/tsc -p tsconfig.json` exited 0 against published rc.1 Client declarations for `SidebarRightTabDefinition`, keyed slot and `useTabInfo`.
- `npm run build`, `node --check lib/client.js` and `npm pack --dry-run --json` exited 0. Dry-run included `cordis.patch.yml`, `lib/index.js`, `lib/client.js` and `package.json`.
- In fixture-local `DSH_HOME`, `dsh --profile sidebar-tab-smoke --from-default-profile web --dump-config` initialized the Web Profile. `dsh plugin --profile sidebar-tab-smoke add <fixture>` exited 0. Dump showed the built-in `ui-sidebar-right` row and the new `example-sidebar-tab` row.

## Chrome/Web Profile observations

The Profile Web server ran on local port 43886. A new Chrome tab skipped API-key setup; no model request was made. The fixture's marker was `document.documentElement.dataset.dshSidebarTabProbe`.

| Action | Observed browser state |
| --- | --- |
| Initial page | Marker `{"typeRegistered":true,"bodyRenders":0,"disposed":false}`. |
| Click “打开右侧边栏” | AX tree showed Guide button “Example notes Open a sample sidebar page”. |
| Click that button | AX tree showed selected “Example notes” tab and text `Example notes: example-notes`; DOM had one `[data-example-sidebar-tab]`; marker bodyRenders became 1. |
| `dsh plugin --profile sidebar-tab-smoke remove dsh-example-sidebar-tab` while server ran | Remove exited 0; marker became `{"typeRegistered":true,"bodyRenders":1,"disposed":true}`. The body marker count became 0; AX body changed to “这类内容还没有可用的查看方式。” The existing “Example notes” tab chip remained. |
| Open a new Guide tab | No `Example notes` Guide entry remained; `data-sidebar-right-guide-entry="example-notes"` count was 0. |

The post-remove config dump had no custom row. The test tab and server were closed; port 43886 was not listening. The original tab remaining as an unavailable-viewer record is an observed lifecycle boundary, not a failure to dispose the type/body.

## Limits and ledger mapping

The run covers one Web page type, Guide entry, keyed body and online removal. It does not test resource pattern claims, same-kind extension takeover/builtin restoration, tab title replacement, `keepMounted`, splits/floats, tab signal abort, another Session, cold restart, Desktop or non-Chrome browsers. The source review describes these members but does not make runtime claims for them. Static text is not Session or model-visible business data.

Suggested shared-ledger mapping: `package:@deepseek-ai/dsh-client-ui-sidebar-right` and the right-sidebar extension subtask of `subsystems:web-client` → `references/api-sidebar-right-tabs.md` and ordered `references/how-to-add-sidebar-right-tab.md`. `package:@deepseek-ai/dsh-client-ui-dockkit` should remain a separate reviewed generic-kit candidate; this tab task uses its layout indirectly but does not document the full dockkit public API.
