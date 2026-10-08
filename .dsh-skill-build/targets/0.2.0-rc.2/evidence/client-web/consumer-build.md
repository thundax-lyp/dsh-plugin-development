# Independent Client + Remote consumer build — `dsh-v0.2.0-rc.2`

This experiment copied the current `skill-source/how-to/client-web.md` Host source, Client TSX source, package manifest, and Remote generation script into an isolated temporary npm workspace. No tracked target-checkout file was changed. The npm workspace installed the exact published `0.2.0-rc.2` DSH packages plus Cordis `4.0.4`, React `18.3.1`, TypeScript `6.0.3`, and tsdown `0.22.2`. This is a consumer test, not a Web Profile or browser test.

## Result matrix

| Check | Observed result |
| --- | --- |
| Host TypeScript face | Passed against published dependencies, after using standard decorators (no `experimentalDecorators`) and omitting an unavailable `@types/node` declaration from this minimal tsconfig. |
| Published `WorkspaceTypertGenerator` on unmodified npm dependency graph | Failed: it found the package but reported **no Remote methods**. Zero generated files. |
| Published `.d.ts`-only workspace registration experiment | Protocol registration advanced discovery, but Agent lookup's `SessionId` was not accepted as a named public wire type. Adding a second published declaration registration then caused an uncaught generator `TypeError`. Zero generated files. |
| Client TypeScript face | Failed without generated `./remote` declaration. Passed only after a **handwritten test stub**, which is not generated evidence. |
| Client lazy-CJS bundle and module-system materialization | Passed with the handwritten Remote stub and a custom tsdown wrapper. Structural import only; Client `apply` and Remote round trip were not run. |
| Real Web Profile / browser | Not run; the generated Remote artifact required by the example does not exist. |

## Workspace and Host check

The consumer package lived at `packages/review` and used the HOW-TO's `@acme/dsh-review` manifest, `src/index.ts`, `src/client/index.tsx`, and `scripts/generate-review-remote.mjs`. Root `tsconfig.host.json` and `tsconfig.client.json` were separate aggregate projects; `packages/review/tsconfig.host.json` and `tsconfig.client.json` compiled the respective files independently. The Host project used `target: ES2024`, `module: ESNext`, `moduleResolution: Bundler`, `strict: true`, `skipLibCheck: true`, `lib: [ES2024, DOM, DOM.Iterable]`, and `noEmit: true`. Standard decorators were required by the published `Remote()` signature (`packages/typert/protocol/src/index.ts:198-236`): the first attempt with `experimentalDecorators: true` failed TS1241; omitting it passed.

The dependency install and corrected Host check were:

```sh
npm install --no-audit --no-fund
./node_modules/.bin/tsc -p packages/review/tsconfig.host.json --pretty false
```

Install exited `0` (`added 75 packages in 1m`); Host `tsc` exited `0` with no diagnostics. The first Client check, before any Remote artifact existed, exited `2`:

```text
packages/review/src/client/index.tsx(7,26): error TS2307: Cannot find module '@acme/dsh-review/remote' or its corresponding type declarations.
```

## Published generator blocker

The exact HOW-TO command, run from the consumer workspace root, failed:

```sh
node scripts/generate-review-remote.mjs
```

```text
TypertAnalysisError: typert(host): @acme/dsh-review publishes Remote artifacts but has no Remote methods
    at WorkspaceTypertGenerator.validateExport (.../node_modules/@deepseek-ai/dsh-typert-generator/lib/index.js:4334:91)
```

`new WorkspaceTypertGenerator(process.cwd()).discover(['host'])` did discover `@acme/dsh-review` under `packages/review`, so the root aggregate/project-reference layout was accepted. The target generator's `isTypeMetaSymbol()` (`packages/typert/generator/src/analyzer.ts:1975-1990`) recognizes `Remote` only if its declaration belongs to a workspace-registered package named `@deepseek-ai/dsh-typert-protocol`, or if it is enclosed in an ambient declaration of that module. The npm package's `lib/types/index.d.ts` has ordinary exported declarations; the installed package is outside this workspace's `packages/` registration inventory. The class's `@Remote('label')` therefore was not accepted as an invocation marker. The target generator then rejects the manifest's declared `./remote` export because no Remote methods were modeled (`packages/typert/generator/src/workspace.ts:100-125`).

### Published declaration registration experiment

A **fresh** second temporary workspace used only npm-published declaration content for the following workaround test. It copied the installed published protocol package into `packages/typert-protocol`, mirrored its shipped `lib/types/*.d.ts` as local `src/*.d.ts`, pointed that local package's `types` export at `src/index.d.ts`, and added a direct Host aggregate project reference and `paths` mapping to that declaration. This did not copy target checkout source. The consumer Host method used `agent: Agent` in this branch (see next paragraph). Running the same generation command now recognized the Remote method but failed at Agent lookup:

```sh
cp -R node_modules/@deepseek-ai/dsh-typert-protocol packages/typert-protocol
mkdir -p packages/typert-protocol/src
cp packages/typert-protocol/lib/types/*.d.ts packages/typert-protocol/src/
# In the copied package.json only: point the root types export at ./src/index.d.ts.
# In tsconfig.host.json: reference ./packages/typert-protocol/tsconfig.json
# and map @deepseek-ai/dsh-typert-protocol to ./packages/typert-protocol/src/index.d.ts.
node scripts/generate-review-remote.mjs
```

```text
TypertAnalysisError: typert(host): .../node_modules/@deepseek-ai/dsh-agent/lib/types/types.d.ts:23:36: lookup and Context wire types must be named public types
```

The Agent's published `TypertLookupMap.agent` maps to `SessionId` from `@deepseek-ai/dsh-session/types` (`node_modules/@deepseek-ai/dsh-agent/lib/types/types.d.ts:19-27`). Registering the published session `.d.ts` package by the same local-copy/reference/paths method did not yield a working build; `node scripts/generate-review-remote.mjs` exited `1` with:

```sh
cp -R node_modules/@deepseek-ai/dsh-session packages/session-public-types
# Mirror its published lib/types/**/*.d.ts under local src/ and map
# @deepseek-ai/dsh-session/types to ./packages/session-public-types/src/types.d.ts.
# Add ./packages/session-public-types/tsconfig.json to the Host aggregate references.
node scripts/generate-review-remote.mjs
```

```text
TypeError: Cannot read properties of undefined (reading 'name')
    at FaceAnalyzer.targetForReference (.../node_modules/@deepseek-ai/dsh-typert-generator/lib/index.js:1871:28)
```

These results do **not** prove no possible consumer workaround exists. They show that simply registering one or two published declaration packages is insufficient to make this example generate with the published generator. No four-file generator output was produced.

The HOW-TO version originally copied into the first fixture also had `_agent: Agent`. When target checkout protocol **source** was temporarily copied into that fixture solely to diagnose the first marker failure, the generator reached invocation analysis and reported:

```text
TypertAnalysisError: typert(host): packages/review/src/index.ts:33:9: lookup parameter for agent must also be named agent
```

This is a separate source defect: `packages/typert/generator/src/analyzer.ts:1104-1113` requires a lookup parameter to use the same name as its lookup key. The second declaration-only fixture used `agent: Agent`. Copying checkout source is not part of an independent published-package recipe.

## Client build isolated with an explicit stub

To isolate the Client declaration and bundle shape, the first fixture wrote **handmade** `lib/typert.remote-client.d.ts` and `.js` in place of the missing generated files. The declaration augmented `TypertRemoteNamespaceMap.review` with `label(signal?: AbortSignal): Promise<RemoteResult<string>>`; the JavaScript default export was `{ package: '@acme/dsh-review', descriptors: [] }`. This is not a valid Remote implementation and was never mounted. With this stub, `./node_modules/.bin/tsc -p packages/review/tsconfig.client.json --pretty false` exited `0`.

The custom Client tsdown config used the HOW-TO source unchanged, `entry: ['src/client/index.tsx']`, `outDir: 'lib'`, `format: ['cjs']`, `platform: 'browser'`, `target: 'es2024'`, `clean: false`, and `dts: false`. Its relevant build contract was:

```js
deps: { neverBundle: specifier => specifier === 'react' || specifier === 'react/jsx-runtime' },
outputOptions: {
  entryFileNames: 'client.js',
  banner: 'window.__ModuleLoader__.load({ id: "@acme/dsh-review", factory: (require) => {',
  intro: 'var module = { exports: {} }; var exports = module.exports;',
  footer: 'return module.exports; } });',
},
```

`./node_modules/.bin/tsdown --config packages/review/tsdown.config.mjs` exited `0` and emitted one `packages/review/lib/client.js` of 2.10 kB (`tsdown 0.22.2`, Rolldown `1.1.5`). Inspection showed `require('react')` and `require('react/jsx-runtime')` inside the registration factory, while the **stub** Remote object was inlined. A separate Host `tsdown` build emitted `lib/index.js` of 0.78 kB (exit `0`); this Host bundle does not substitute for Typert output.

An isolated VM evaluated `client.js` with queue-mode `window.__ModuleLoader__`. The exact checkout's compiled `ClientModuleSystem` then drained the queue and imported `@acme/dsh-review` with React and `react/jsx-runtime` seeds. `node verify-client.mjs` exited `0`:

```json
{"factoryConsumed":true,"apply":"function","inject":["slots","remote"]}
```

This validates registration and materialization only. It did not call `apply`, mount Remote, register the slot, start a Host/Profile, or exercise a browser.

## Decision

The current HOW-TO source is **not a reproducibly buildable independent third-party package using only target-version published npm exports**. Host source type-checks, and a custom Client wrapper can emit a materializable artifact, but the published Typert generator did not produce the four required files. The Client success above relied on an explicitly invalid handwritten Remote stub. A complete recipe requires a generator change or a verified consumer configuration that recognizes published protocol and lookup/wire type declarations without private checkout source, followed by actual Client bundle and Web Profile lifecycle verification.
