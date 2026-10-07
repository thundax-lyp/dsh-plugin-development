# High pending API surface adjudication (rc.1)

Target: `dsh-v0.2.0-rc.1`, commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`. The [machine matrix](high-pending-attachment-feedback-jobs-client-matrix.json) is a recommendation for the shared `api-surface.json` ledger, not a mutation of it. It covers every entry, object, and discovered member in eleven public package groups: 28 entries, 328 objects, and 707 members. Current decisions are retained alongside recommendations.

| Package group | Entries | Objects | Members | Pending objects | Newly recommended included objects | Task owner |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `dsh-attachment` | 2 | 46 | 125 | 37 | 0 | `api-attachment-store.md` |
| `dsh-message-feedback` | 4 | 45 | 91 | 44 | 12 | `api-user-feedback.md` |
| `dsh-client-modules` | 3 | 40 | 110 | 27 | 0 | `api-client-modules.md` |
| `dsh-jobs` | 4 | 33 | 85 | 32 | 6 | `api-jobs.md` |
| `dsh-session-query` | 1 | 49 | 135 | 30 | 1 | `api-session-query.md` |
| `dsh-workflow` | 3 | 31 | 67 | 29 | 3 | `api-workflow-agent-loop.md` |
| `dsh-client-ui-theme` | 2 | 31 | 33 | 15 | 0 | `api-client-theme.md` |
| `dsh-client-ui-renderer` | 3 | 19 | 18 | 14 | 0 | `api-client-slots.md` |
| `dsh-client-ui-sidebar` | 2 | 13 | 15 | 11 | 0 | `api-client-main-panels.md` |
| `dsh-client-resources` | 2 | 11 | 9 | 9 | 7 | `api-client-resources.md` |
| `dsh-client-ui-layout` | 2 | 10 | 19 | 8 | 0 | `api-client-main-panels.md` |

## Code decisions

- Package `exports` in the exact checkout confirm Host root plus `./client` for the five Client UI groups and Client modules. The root UI entries are already excluded in the ledger because their useful plugin contracts are on `./client`; the matrix retains that boundary. `./invariant` entries are internal Cordis wiring. `./types`, `./brand`, and `./view` mostly mirror canonical contracts; they receive `merged` rather than duplicate pages.
- `packages/feedback/message-feedback/src/types.ts` defines the pure type-only Remote vocabulary. The message-feedback task needs CAS request, item, failure, and result shapes; these now have an exact section-local table in `api-user-feedback.md`. The `./remote` and `./typert` subpaths are generation transport surfaces, so the matrix merges them into this task instead of giving them an independent plugin task.
- `packages/jobs/jobs/src/types.ts` and `view.ts` define `JobSpec`, `JobHooks`, `JobOutcome`, status, view, and event contracts used by a producer. `api-jobs.md` now spells out the remaining producer and outcome members. `jobs-local` and `tool-jobs` remain the implementation/controller assembly described there; an abstract `JobRegistry` root is not an installable backend.
- `packages/session-query/session-query/src/types.ts` supplies the `SessionEventWindow` fields returned by `readEvent`; they are now in the existing query section. Other exported filters, source helpers, and configuration aliases do not create a separate author task beyond the existing query owner.
- `packages/workflow/workflow/src/runtime-types.ts` supplies `WorkflowStartRequest`; `types.ts` supplies `WorkflowResult`; `index.ts` supplies `WorkflowError`. The existing Workflow section now explicitly covers the `fatal` member. The `./types` subpath repeats root contracts, while `./invariant` is assembly wiring.
- `packages/client/resources/src/client/contract.ts` and `index.ts` expose the resource protocol, snapshot, hook, and registration contracts already described with member names under `api-client-resources.md`. `ResourceProvider` was previously included; the remaining task-critical contracts are newly recommended included. Client theme, renderer, sidebar, and layout pending objects are mostly fixed view props or implementation adapters. Their existing included service/registration objects retain the public task route; the remaining supporting exports are merged.
- `packages/attachment/attachment/src/types.ts` supplies durable refs and request DTOs; the canonical attachment store section already includes the actual store and three refs. The pending types are supporting data vocabulary or `./types` mirrors; they stay merged unless a separate task using them is proven.
- `packages/client/modules/src/client/manifest.ts` and `system.ts` expose boot manifest parsing and module loader machinery. The existing Client module task already owns the Loader assembly and its included public registration/baseline types. Pending boot row and parser helpers are merged into that task, not presented as third-party extension hooks.

## Verification and limits

- Re-read package `exports` and public source paths in the exact checkout, then generated the matrix directly from `skill-source/api-surface.json`. Every matrix row has an existing owner document and heading. For each recommended included object and every newly recommended included member, a token check found its symbol/name within the mapped section after the text additions.
- `json.tool` parsing of the matrix and text-only section/token checks passed. This is a static coverage/adjudication pass. It does not compile new examples or run a Profile, Remote, or browser scenario; those lanes are covered only where the existing task evidence says so. `merged` means the public symbol has no independent plugin task route, not that every field is documented as an included API member.
