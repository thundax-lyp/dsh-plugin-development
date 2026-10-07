# Client theme layer review

Target: `dsh-v0.2.0-rc.1`, commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`.

## Source adjudication

- `packages/client/ui-theme/src/client/index.ts` exports `ThemeRuntime`, `ThemeDefinition`, `ThemeSnapshot`, `ThemeTokenOverrides`, and merges `ctx.theme`. `register` rejects duplicate IDs and `system`; `overrideTokens` validates light/dark pairs, stacks layers by sequence, replaces same source and returns identity-aware disposer. `getTheme`, `setTheme`, `setFontSize`, and `exportInspectTokens` are public.
- `packages/client/ui-layout/src/client/theme-presenter.ts` applies resolved theme tokens as body inline CSS variables and retracts its own writes. It uses `active.colorScheme` to choose the palette.
- `packages/client/ui-input-trigger/src/client/index.ts` exposes a separate `ctx.inputTriggers.registerSource` provider extension with session-scoped pipeline; `packages/client/locale/src/client/index.ts` exposes `ctx.locale.register`. These are distinct task candidates and are not semantically covered by a theme layer.

## Isolated consumer and browser

Fixture: `evidence/tests/client-theme-consumer/`. Installed published `0.2.0-rc.1` theme dependency and Cordis 4.0.4. `tsc -p tsconfig.json`, `npm run build`, `node --check lib/client.js`, `npm pack --dry-run --json` all exited 0. Isolated Web Profile loaded the package via its bundle patch.

Chrome/Web Profile on port 43888: after first-use prompts, `body` inline and computed `--dsw-alias-bg-base` were both `#ffe8e8`; `data-ds-dark-theme` was absent. While browser and server remained open, `dsh plugin --profile theme-layer-smoke remove dsh-example-theme-layer` exited 0. The same browser tab then showed empty body inline value and computed value `#fff`. Browser tab and server were closed.

Verified: exact-version Client compilation, package shape, Web Profile assembly, light palette visual token application, live disposal/fallback. Not verified: dark-mode value in a browser, registered custom theme selection, Desktop, restart persistence, model turn or asynchronous work (none in this fixture).
