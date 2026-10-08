# Third-party Client lazy-CJS build research — `dsh-v0.2.0-rc.2`

Scope: exact target checkout only. This is a reproducibility experiment, not a claim that DSH publishes a general third-party builder. No shared ledger or final Skill file was changed in this investigation.

## Published contract and missing preset

- `packages/client/modules/README.md` (Declaring a client plugin; Build requirements) requires a browser `lib/client.js` that registers `window.__ModuleLoader__.load({ id, factory })`; external requests resolve through the factory's supplied `require`. `packages/client/modules/src/client/system.ts:120-156,293-336` drains registrations and materializes them on import.
- `packages/client/tsdown.client.ts:110-136,475-616` implements the repository's `clientBundle()` preset. That file imports `scripts/client-build-environment.ts` and `scripts/bundle-input-isolation.ts` at lines 22-23, plus Client source internals. It is not a published package export. `packages/client/modules/package.json` exports `.`, `./client`, and `./invariant`; its `files` list publishes `lib` artifacts and declarations, not `tsdown.client.ts` or the private scripts. The wildcard `./src/*` export in the manifest does not put those source files in the published file list.
- Registry confirmation: `npm view @deepseek-ai/dsh-client-modules@0.2.0-rc.2 version dist.tarball --json` returned version `0.2.0-rc.2` and the npm registry tarball URL (exit `0`). `npm pack @deepseek-ai/dsh-client-modules@0.2.0-rc.2 --pack-destination <temporary-directory> --json` returned a 15-file archive (exit `0`), containing only license, README files, `lib/client.js`, `lib/index.js`, `lib/invariant.js`, `lib/types/**/*.d.ts`, and `package.json`. No `src/*`, `tsdown.client.ts`, or `scripts/*` file was present in the actual package archive.
- The preset does substantially more than stamp the registration wrapper: external allowlist and purity gate (`tsdown.client.ts:410-425,475-545`), CSS loaders (`:552-582`), chunk names and per-chunk registration (`:589-616`), and bundle input isolation (`:620-668`). Thus a third party can build the narrow artifact below with public tsdown/Rolldown, but cannot import DSH's full preset from this published Client package.

## Minimal build that worked

Test environment: checkout-installed `tsdown 0.22.2`, powered by `rolldown 1.1.1`; `node_modules` was installed under the exact target checkout. The standalone maintenance repository did not resolve `tsdown`, `rolldown`, or `esbuild`; a third-party package must install its own build dependencies. The experiment used a temporary package directory with `node_modules` symlinked to the target checkout's installed modules. The package id `@acme/probe` is illustrative.

`src/client/index.ts`:

```ts
import * as React from 'react'

export const name = 'probe'
export function apply() { return React.version }
```

`tsdown.config.mjs` (the exact config exercised):

```js
export default {
  entry: ['src/client/index.ts'],
  outDir: 'lib',
  format: ['cjs'],
  platform: 'browser',
  target: 'es2024',
  dts: false,
  clean: false,
  deps: { neverBundle: specifier => specifier === 'react' },
  outputOptions: {
    entryFileNames: 'client.js',
    banner: 'window.__ModuleLoader__.load({ id: "@acme/probe", factory: (require) => {',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
    footer: 'return module.exports; } });',
  },
}
```

The actual invocation from the temporary package directory was:

```sh
"$DSH_TARGET_CHECKOUT/node_modules/.bin/tsdown" --config tsdown.config.mjs
```

Observed exit code `0`; salient output:

```text
ℹ tsdown v0.22.2 powered by rolldown v1.1.1
ℹ [CJS] lib/client.js  1.50 kB │ gzip: 0.71 kB
✔ Build complete in 13ms
```

Inspection of `lib/client.js` showed one `window.__ModuleLoader__.load` registration, `require("react")` inside the factory, and a `return module.exports` footer. Before adding React, the same config without `deps` compiled a no-import `apply() { return 'loaded' }` entry to a 0.41 kB `client.js` (exit `0`).

## Runtime check against target module system

The following verifier used the checkout's compiled `ClientModuleSystem`, which is an **internal test import**, not a published third-party verifier API. It evaluated the emitted artifact in a VM with a queue-mode `window.__ModuleLoader__`, then constructed the target module system with one boot row and a React seed. The checkout module system drained the queue, imported `@acme/probe`, and called its export:

```js
import { readFile } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'
import { ClientModuleSystem } from '<exact-checkout>/packages/client/modules/lib/types/client/system.js'

const queue = []
const target = { mode: 'queue', pendingQueue: queue, load: entry => queue.push(entry) }
const script = await readFile('lib/client.js', 'utf8')
runInNewContext(script, { window: { __ModuleLoader__: target }, Symbol, Object })
if (queue.length !== 1 || queue[0].id !== '@acme/probe') throw new Error('registration mismatch')
const system = new ClientModuleSystem({
  manifest: {
    rev: 'local',
    modules: [{ id: '@acme/probe', url: 'plugins/@acme/probe/client.js', initialUrl: 'plugins/local.js', rev: 'local', inject: [], external: ['react'] }],
    plugins: [{ id: '@acme/probe', inject: [], immediately: false }],
  },
  staticModules: { react: { version: 'probe-react-version' } },
  registrationTarget: target,
  bootstrapModule: { id: '@deepseek-ai/dsh-client-modules', exports: {} },
  loadBundle: async () => { throw new Error('transport should not run') },
})
const exports = await system.import('@acme/probe')
if (exports.name !== 'probe' || exports.apply() !== 'probe-react-version') throw new Error('materialization mismatch')
console.log(JSON.stringify({ name: exports.name, apply: exports.apply(), importCache: system.loadCache.has('@acme/probe') }))
```

Actual command: `node verify-react.mjs` in the temporary package directory (the tested file used the checkout's absolute import path in place of `<exact-checkout>`). Observed exit code `0` and output `{"registrations":0,"name":"probe","apply":"probe-react-version","importCache":true}`; `registrations:0` was logged after construction because the system drained the queue. The earlier no-import bundle was also materialized successfully and returned `loaded`.

## Decision boundary

This establishes a working **minimal single-file Client lazy-CJS artifact** using public tsdown/Rolldown tooling and confirms that the exact target runtime accepts its registration and a seeded `react` external. It does not establish a supported, complete third-party Client build workflow: the experiment did not exercise package publication, Host node-half/profile scanning, type declaration compilation, declared external graph validation, CSS lifecycle, dynamic chunks, source maps, HMR, or the preset's input/purity gates. The exact DSH preset and its dependencies are repository-private rather than published builder APIs. A general recipe would need to reproduce and verify those contracts independently or DSH would need to publish a supported builder.
