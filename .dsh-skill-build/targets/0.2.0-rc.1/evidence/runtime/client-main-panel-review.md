# Client global main panel and dockkit adjudication

Target: `dsh-v0.2.0-rc.1`, commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`.

## Source and declaration

- `packages/client/ui-layout/src/client/index.ts`: `main` is a root keyed slot; `conversation` is reserved. `AppFrame` declares the slot and layout service follows `main` entries.
- `packages/client/ui-layout/src/client/service.ts`: public `MainPanelId`, `ILayout.selectPanel`; a missing non-null key throws.
- `packages/client/ui-layout/src/client/stores.ts`: `retainMainPanels` clears an active key that is no longer registered.
- `packages/client/ui-sidebar/src/client/contract/slots.ts`: `sidebar.panellist` is a root list slot; owner props are `size` and `active`; metadata ID is `MainPanelId`.
- `packages/client/ui-sidebar/src/client/index.ts` and `SidebarRoot.tsx`: list entries form sidebar panel metadata; the shell button selects the matching main panel ID and renders the entry as an icon.
- `packages/client/ui-plugin-manager/src/client/index.ts`: shipped composition registers `main` under `PANEL_ID` and `sidebar.panellist` with the same `id`.
- `packages/client/ui-dockkit/src/index.ts`: publicly exports pure layout operations, `DockController`, and React surfaces. It has no Cordis `apply`, `ctx` service or SlotMap augmentation. Thus a DSH plugin adding a panel to existing UI routes through layout/sidebar; dockkit may be used to build an owned layout inside a page, but is not itself an existing UI registration point.

## Isolated consumer and runtime

Fixture: `evidence/tests/client-main-panel-consumer/`. Exact published rc.1 dependencies installed in isolated package. `tsc -p tsconfig.json` passed for Client TSX. `npm run build` and `npm pack --dry-run --json` passed; pack included Host root, Client half, patch and manifest. The fixture generated a separate Web Profile in `profile-home` and added the package via `dsh plugin`; `profile-after.yml` contained the Loader entry.

Served this Profile on port 43887 and opened Chrome. After skipping initial model setup, AX showed a global panel button named “Example panel”. Clicking it rendered “Example main panel” in the main column; the DOM contained `[data-example-main-panel]`. While the server and tab remained open, `dsh plugin --profile main-panel-smoke remove dsh-example-main-panel` exited 0. AX no longer showed that sidebar button, `[data-example-main-panel]` count was 0, and the main column showed the new Session composer. The tab and server were closed afterward.

This validates Web Client composition, click, live removal and layout selection fallback. It does not validate Desktop, restart persistence, a data-bearing page, network cancellation or a model turn. The static fixture has no asynchronous resources to abort.
