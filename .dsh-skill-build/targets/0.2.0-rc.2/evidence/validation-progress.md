# Validation progress — `dsh-v0.2.0-rc.2`

Target commit: `639ed015397290b3745d163aafe02ffee4aa3f84`. This record describes checks actually run while `skill-source/manifest.json` remains `draft`; it does not certify a generated or installed Skill.

| Check | Observed result | Boundary |
| --- | --- | --- |
| `validate-skill-source.mjs <target>` | Passed in draft mode: 425 capability candidates; current included/merged/excluded counts are in the ledger. | Draft validation checks structure and references; it does not settle candidate semantics or freeze content hashes. |
| `validate_skill.py --skill <temporary preview> --dsh <exact checkout>` | Passed after the Host/Infra reference edits: 15 Markdown files, 246 local links/anchors, 3 JSON fences, 118 source paths. | The preview copies manifest-listed sources; it is not `generated-skill/` and does not authorize formal replacement. |
| `check_examples.cjs --dsh <exact checkout> --skill <temporary preview>` | Passed: 12 Host blocks and 1 Client block; 0 diagnostics or ignored blocks. | Type compilation does not establish real Profile activation or Remote transport. |
| `register-host-tool.mjs` with exact checkout and offline runner variables | Passed package resolution, in-process Tool call/failure/cancellation and unload assertions. | The test executes documented source under the checkout; no real Agent/Profile call occurred. |
| Local scripted Agent consumer of the documented `greet` Tool | Passed: a real Agent Loop sent the scripted Tool call, Session held paired `tool/call` and `tool/result` (`Hello, Ada!`), and fiber disposal removed Tool plus schema. | The model response was scripted; Web Profile, Loader, HMR and live model selection were not exercised. Details are in `host-core/agent-consumer.md`. |
| Isolated bundle consumer install, boot, removal | Install and config dump passed; boot observed `observe-demo active` then `disposed` on SIGINT; CLI removal deleted bundle row. | Boot needed a `NODE_PATH` workaround for an already installed optional native addon in the target checkout; this is not a clean published consumer validation. Details are in `infra-runtime/consumer-verification.md`. |
| Minimal Client lazy-CJS build and module-system materialization | Passed for a single-file React-external probe using target tsdown/Rolldown. | CSS, chunks, purity gate, package/Profile scan and the documented generated Remote contribution were not exercised. Details are in `client-web/builder-research.md`. |
| Independent published npm Host/Remote/Client consumer | Host source compiled. Published Typert generator failed to discover `@Remote` from installed protocol declarations and produced no Remote files. A declaration-only workspace registration experiment advanced analysis but failed on wire type registration and an internal `TypeError`. Client TS, lazy-CJS and module-system materialization passed only with a handwritten invalid Remote stub. | No generated Remote, actual Client apply, Web Profile, browser, cancellation or unload. Exact commands and diagnostics are in `client-web/consumer-build.md`. |
| `pnpm test:validation` | Passed 9 Python and 36 JavaScript validation tests before the later document-only revisions. | These tests cover maintenance validators, not target runtime behavior. |
| Prettier check and `git diff --check` | Passed on the draft source and topic evidence after the final Host/Infra reference edits. | This confirms formatting and whitespace only; it does not certify a frozen or published Skill. |

## Outstanding gates

- Reconcile the remaining generic public API exclusions against selected plugin tasks: the current shared ledger still has 142 entry and 374 object exclusions using broad task-boundary reasons. The three topic-specific `reconciliation.json` files are audit proposals, not ledger dispositions.
- Resolve the published Typert generator's independent-consumer type registration failure, then complete generated declarations, Client bundle graph, real Web Profile activation, Remote call, cancellation and unload. Until then the Client HOW-TO is declaration-level guidance, not a completed third-party recipe.
- Regenerate the source map after final included-object decisions; review content ownership, task routes and claims before freeze.
- Only then run `validate-skill-source.mjs --freeze`, build and verify `generated-skill/`, run the formal scenario runner, and replace the installed directory. None of these latter steps has been run on this draft.
