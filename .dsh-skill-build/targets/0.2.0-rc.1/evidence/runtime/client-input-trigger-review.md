# Client input trigger source review

Target: `dsh-v0.2.0-rc.1`, commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`.

## Source adjudication

- `packages/client/ui-input-trigger/src/client/index.ts` exports provider types, service contract and Context merge for `ctx.inputTriggers`; plugin installs the menu in `conversation.input.overlay` itself.
- `packages/client/ui-input-trigger/src/client/service.ts` implements `registerSource` with `(trigger,name)` uniqueness, late-controller notification, and disposer that removes the source from live controllers.
- `packages/client/ui-input-trigger/src/types.ts` defines `InputTriggerSource`, candidate request signal, candidate pure display shape, pick paths and optional match/warm/lexicon/reference hooks.
- `packages/client/ui-input-trigger/src/client/controller.ts` aborts old candidate fetches on query/menu lifecycle, ignores aborted settlements, and executes pick outcomes through scoped input events. `packages/client/ui-conversation/src/client/contract/input.ts` defines `PickOutcome`.

## Isolated consumer and browser

Fixture: `evidence/tests/client-input-trigger-consumer/`. Exact rc.1 package and Cordis 4.0.4 installed. `tsc -p tsconfig.json`, `npm run build`, `node --check lib/client.js`, and `npm pack --dry-run --json` exited 0. Separate Web Profile loaded bundle patch.

Chrome/Web Profile on port 43889: after first-use prompts, typing `/gr` in new Session input displayed `example` group and selected “Greeting greet” candidate. Clicking it changed input AX value to `Hello from example `, with probe `picks:1`. While server/browser were open, removing package via `dsh plugin --profile input-trigger-smoke remove dsh-example-input-trigger` exited 0. Probe then had `disposed:true`. Clearing draft and typing `/gr` showed no menu; DOM listbox count 0 and Greeting exact-text count 0. Browser tab and server were closed.

Verified: independent Client type compile/package, real menu registration, candidate query, pick-to-draft and live source disposal. Not verified: model send, `@`, remote cancellation, Enter/Space adjudication, reference codec, Desktop or restart recovery.
