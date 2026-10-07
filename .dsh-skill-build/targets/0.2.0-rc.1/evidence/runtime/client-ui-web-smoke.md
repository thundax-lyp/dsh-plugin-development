# Client UI Slots and Resources Web smoke

## Scope

- Target: `dsh-v0.2.0-rc.1` exact checkout; isolated consumer package at `evidence/tests/client-ui-consumer/browser-half/`.
- Profile: `ui-smoke`, created from Web Profile under this fixture's `smoke-home` via an isolated `DSH_HOME`.
- Server: local `127.0.0.1:43881`; Chrome tab created solely for this smoke. The local authenticated URL token is intentionally omitted.
- Fixture: empty Host root, lazy-CJS `./client` factory, `note` resource provider, and `conversation.session.header.actions` list slot. Slot text is the resource hook's first value, `Ready`.

## Preparation and checks

1. `npm run build` passed for the fixture. `node --check lib/client.js`, `node smoke.mjs`, and `npm pack --dry-run` passed. The separate target declaration consumer's `tsc -p tsconfig.json` passed for Slots, Resources, and combined `useResource<'note'>` components.
   The same fixture checks were rerun while preparing `how-to-show-session-header-resource.md`: TypeScript compilation, build, syntax check, fixture smoke and package dry-run all exited 0. The HOW-TO reproduces the browser half's package, patch, Host entry, Client factory and copy build; it does not claim a fresh Chrome run.
2. With fixture-local `DSH_HOME`, `dsh --profile ui-smoke --from-default-profile web --dump-config` exited 0. `dsh plugin --profile ui-smoke add <absolute fixture directory>` exited 0. A subsequent config dump contained the `client-ui-probe` Loader row and its client bundle.
3. `dsh --profile ui-smoke --no-open --port 43881` served the Web Client. Chrome loaded the local URL and entered an existing Session view. A test message was submitted to get past the new-session hero; model execution returned `MISSING_CREDENTIAL` because no API key was configured. The model error was separate from the Client UI observation.

## Observed browser behavior

The fixture reported its lifecycle counters on `document.documentElement.dataset.dshUiProbe`; the same Chrome tab's DOM and accessibility tree showed the slot text.

| Step | DOM marker | Visible slot nodes | Observation |
| --- | --- | --- | --- |
| Session view after load | `{"opens":1,"firstFrames":1,"aborts":0,"unloaded":false}` | `Ready` | Client half activated; provider produced a first frame; header slot consumed it. |
| Navigate to New Session hero | `{"opens":1,"firstFrames":1,"aborts":1,"unloaded":false}` | none | Last resource holder released; provider saw abort. |
| Return to the Session | `{"opens":2,"firstFrames":2,"aborts":1,"unloaded":false}` | `Ready` | Remount reopened the provider and rendered the slot again. |
| `dsh plugin --profile ui-smoke remove dsh-client-ui-probe` while server ran | `{"opens":2,"firstFrames":2,"aborts":2,"unloaded":true}` | none | Live plugin unload disposed the slot and aborted the provider. |

The remove command exited 0, the post-remove config dump no longer contained the plugin row, and the Chrome accessibility tree and screenshots before and after removal showed `Ready` present then absent. The counters are fixture instrumentation, while the displayed node and Loader state are independent UI/config observations.

## Limits

This smoke verifies one fixed first frame and abort on holder release/plugin removal. It did not exercise a subsequent success frame, failure frame, `pin`, duplicate provider registration, slot ordering/collision, interactive button state, or restart persistence. The model call could not complete without credentials and is outside this Client UI result. This is one local Chrome/Web Profile run, not a cross-browser or production Profile result.
