# Client locale panel review

Target: `dsh-v0.2.0-rc.1`, commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`. Source contract audit is also in `client-locale-disposition.md`.

## Source and fixture

`packages/client/locale/src/client/index.ts` owns `ctx.locale`, namespace dictionaries, `bind`, selectable language catalog and settings row. `packages/client/ui-slots/src/index.ts` defines `LocaleNamespaceMap`, `LocaleDictOf<N>`, `PropsLocale<N>` and the slot locale seat. `packages/client/ui-sidebar/src/client/index.ts` resolves a dynamic list-entry label; `packages/client/ui-layout/src/client/index.ts` owns the keyed main panel. Fixture `evidence/tests/client-locale-consumer/` composes them with an owned namespace.

Installed exact rc.1 published Client packages and Cordis 4.0.4. `tsc -p tsconfig.json` passed for TypeScript declaration merge, bilingual registration, main panel `PropsLocale`, and sidebar label. `npm run build`, `node --check lib/client.js`, and `npm pack --dry-run --json` passed. Isolated Web Profile loaded the bundle patch.

## Browser observations

Chrome/Web Profile on port 43890: after first-use prompts, AX showed global panel button “示例语言面板”. Clicking it displayed “你好，世界”. Opened Settings → General → Language and selected English. On the same mounted panel, AX showed “Example language panel” button and “Hello, world” body. While browser/server remained open, `dsh plugin --profile locale-panel-smoke remove dsh-example-locale-panel` exited 0; AX removed both button and body, DOM `[data-example-locale-panel]` count was 0, fixture disposer probe was true, and the main column returned to the new Session composer. Browser tab and server were closed.

Verified: exact-version Client compile/package, Web Profile assembly, bilingual dictionary registration, reactive label and component translation, settings-driven language switch, online dictionary/slot disposal. Not verified: third-party language packs, reload persistence, Desktop, asynchronous translation or model turn.
