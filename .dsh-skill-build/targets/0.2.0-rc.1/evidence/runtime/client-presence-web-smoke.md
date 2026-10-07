# Client presence consumer: independent Web Profile/browser smoke

Target: npm `@deepseek-ai/dsh@0.2.0-rc.1` (installed in `evidence/tests/profile-consumer/node_modules`, package version read back as `0.2.0-rc.1`), corresponding source tag `dsh-v0.2.0-rc.1`. Date: 2026-10-07. Test package: `evidence/tests/client-presence-consumer/`. All paths below are relative to this target evidence root unless stated otherwise. This is a genuine Web Profile and Chrome observation, separate from the earlier Node VM probe.

## Preparation and commands actually run

The fixture package exports `.` as `lib/index.js`, `./client` as `lib/client.js`, declares `dsh.client.platform: web`, and has a bundle patch inserting the Host row. `lib/` had already been built before this smoke. Its Client module calls `window.__ModuleLoader__.load`, creates one fixed `data-client-presence` DOM element on activation, and removes it in the Cordis effect disposer.

In the repository root, a new `smoke-home/` inside this isolated fixture was used as `DSH_HOME`. The exact commands were equivalent to:

```sh
DSH_HOME="$PWD/.dsh-skill-build/targets/0.2.0-rc.1/evidence/tests/client-presence-consumer/smoke-home" \
  .dsh-skill-build/targets/0.2.0-rc.1/evidence/tests/profile-consumer/node_modules/.bin/dsh \
  --profile web --dump-default-config

DSH_HOME="$PWD/.dsh-skill-build/targets/0.2.0-rc.1/evidence/tests/client-presence-consumer/smoke-home" \
  .dsh-skill-build/targets/0.2.0-rc.1/evidence/tests/profile-consumer/node_modules/.bin/dsh \
  plugin --profile web add "file:$PWD/.dsh-skill-build/targets/0.2.0-rc.1/evidence/tests/client-presence-consumer"

DSH_HOME="$PWD/.dsh-skill-build/targets/0.2.0-rc.1/evidence/tests/client-presence-consumer/smoke-home" \
  .dsh-skill-build/targets/0.2.0-rc.1/evidence/tests/profile-consumer/node_modules/.bin/dsh \
  --profile web --port 18787
```

Initialization exited 0 and created the isolated Web Profile. The install command exited 0; its `package.json` was read back with `dsh-client-presence` in dependencies and `dsh.profile.bundles`. The Web process announced a loopback URL on port `18787` and opened Chrome. The URL contained a one-time local token, omitted from this record.

## Actual browser observation

Through the connected Chrome browser tab for `127.0.0.1:18787`, the accessibility tree showed visible text `Client plugin active` on the DeepSeek Harness page. A read-only DOM inspection returned `{ markerCount: 1, markerText: 'Client plugin active', pageTitle: 'DeepSeek Harness' }` for `[data-client-presence]`. This confirms the installed package's Client code reached the real browser and applied its DOM effect. The page also showed the application's preview notice; no user conversation or model request was needed.

While the Web process was still running, this command was executed:

```sh
DSH_HOME="$PWD/.dsh-skill-build/targets/0.2.0-rc.1/evidence/tests/client-presence-consumer/smoke-home" \
  .dsh-skill-build/targets/0.2.0-rc.1/evidence/tests/profile-consumer/node_modules/.bin/dsh \
  plugin --profile web remove dsh-client-presence
```

It exited 0. A subsequent fresh Chrome accessibility read no longer showed `Client plugin active`; DOM inspection returned `{ markerCount: 0, text: false }`. This is browser-side evidence that Profile removal caused the Client effect to dispose and remove its node. The Web process was then stopped with Ctrl-C (shell exit 130), and the test browser tab was closed.

## Scope and remaining checks

This verifies one Web Client package's install, Host bundle composition sufficient for Client loading, browser activation, and browser-visible removal in a running Profile. It does not verify a Client slot, Remote call, CSS/assets pipeline, reconnect, multiple browser tabs, a second install/reload cycle, or that all Client modules share this behavior. No compile claim follows from this smoke; this fixture is JavaScript. The fixture's prior Node VM result remains a separate check, not the evidence used for the browser conclusion.
