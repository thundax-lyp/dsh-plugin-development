# Jobs, Schedule, Plan mode and Todo review — 0.2.0-rc.1

## Target and consumer

- Exact checkout commit: `4878cdabd87d4041bdaff61d04c966883b9fd07a` (`dsh-v0.2.0-rc.1`).
- Independent declaration consumer: `evidence/tests/jobs-schedule-planning-consumer/`; its `node_modules` is a symlink to the already installed isolated `profile-consumer` dependency tree. The compiler executable comes from `evidence/tests/client-ui-consumer/node_modules/.bin/tsc`, not from target source files.
- Installed `@deepseek-ai/dsh-jobs`, `dsh-jobs-local`, `dsh-tool-jobs`, `dsh-schedule`, `dsh-plan-mode`, and `dsh-tool-todo` package manifests each reported version `0.2.0-rc.1`.

## Source-checked contract

| Topic | Public export and implementation evidence | Adjudicated boundary |
| --- | --- | --- |
| Job registry | `packages/jobs/jobs/package.json`, `jobs/src/index.ts`, `jobs/src/types.ts`, `jobs/src/view.ts`; `jobs-local/src/index.ts`, `jobs-local/src/events.ts` | Root jobs package is an abstract service; `jobs-local` supplies the process-local implementation. `start` needs a controller serving the owner. The output ring and model cursor are separate from observer offsets. Owner access uses Session id. |
| Model job control | `packages/jobs/tool-jobs/src/index.ts`, `tool-jobs/src/render.ts` | The plugin attaches the controller and registers `job_output`, `job_list`, `job_kill`; its completion notice policy is separately configurable. |
| Schedule | `packages/schedule/schedule/package.json`, `schedule/src/index.ts`, `schedule/src/types.ts`, `schedule/src/tools.ts`, `schedule/src/runtime.ts`, `schedule/src/storage.ts` | Host durable task domain; exact-Session binding; create/list/catalog/history/update/delete. Due delivery resumes Agent and flushes Session before task advancement; enqueue and task write are not atomic. |
| Plan mode | `packages/plan/plan-mode/package.json`, `plan-mode/src/index.ts`, `plan-mode/src/types.ts` | `set` chooses an immediate or next accepted pre-step log transition; `exit_plan_mode` asks user review and does not change permission policy. |
| Todo | `packages/todo/tool-todo/package.json`, `tool-todo/src/index.ts`, `tool-todo/src/types.ts` | `todo_write` appends complete list snapshot, with parallel-active policy. Projection clears at next `turn/start`. |

The corresponding target tests inspected as behavior cross-checks were `packages/jobs/jobs-local/tests/jobs.spec.ts`, `packages/jobs/tool-jobs/tests/tool-jobs.spec.ts`, `packages/schedule/schedule/tests/{delivery,update,recurrence,plugin}.spec.ts`, `packages/plan/plan-mode/tests/{integration,plan-mode}.spec.ts`, and `packages/todo/tool-todo/tests/{integration,tool-todo}.spec.ts`. Test files were not executed in this independent review.

## Executed checks

From the isolated consumer directory, `../client-ui-consumer/node_modules/.bin/tsc -p tsconfig.json --noEmit` exited 0. This compiled:

- the Job producer kind merge, synchronous `ctx.jobs.start` starter, idempotent cancel/settlement, and a model tool with canonical JSON output;
- Host `ctx.schedule.create`/`delete` use with branded Session/record ids and AbortSignal;
- Host `ctx.planMode.get`/`set`, projection type, and `TodoItem` values.

The TypeScript code blocks in the three new references were also extracted verbatim into `docs-jobs.ts`, `docs-schedule.ts`, and `docs-planning.ts` in that consumer. The same compiler invocation exited 0 with those files included. Thus the presented examples, as well as the separately composed fixture, passed the target declaration check.

Two isolated Cordis runtime scripts also exited 0:

- `node runtime-jobs.mjs` loaded the published Agent, System Prompt, Tools, Jobs Local, Tool Jobs and example tool plugins. `example_background_task` returned `example-1`; `ctx.jobs.wait` observed `completed`; `read` returned `Example finished\\n` and one `Done` result; a second `read` returned no result. A second producer was cancelled through the actual `job_kill` tool, which returned `cancellation-requested`; `wait` observed `killed` with the supplied reason. Scope and root fibers were disposed in `finally`.
- `node runtime-schedule.mjs` loaded published Session, Agent, System Prompt, Tools, Storage, JSON backend, Storage Domain and Schedule services against a fresh temporary root. `create` returned an `after` record; `list` and `catalog` each showed one active row with the original Session id; `delete` removed it from both views. The stub Session controller's resolver was called zero times. The script disposed the Cordis fiber and removed only its own temporary root in `finally`.

The two local bundle fixtures `profile-jobs/` and `profile-schedule/` each passed `npm pack --dry-run --json`, listing its Host root and patch. The isolated CLI Profile `job-schedule-smoke` was initialized from the Web default under this fixture's `profile-home`; `dsh plugin ... add` exited 0 for each local bundle. `dsh --profile job-schedule-smoke --dump-config` exited 0 and showed `jobs`, `tool-jobs`, `example-background`, `schedule`, `storage-json`, `storage-domain`, `session-controller`, and `session-persistence-jsonl` rows. `dsh --profile job-schedule-smoke --no-open --port 43882` reported a local Web URL and stayed running until stopped with Ctrl-C; afterward port 43882 had no listener. The local auth token is omitted from this record. The startup observation confirms service boot, but the CLI Profile was not used to call the tools or dispatch a reminder.

The target checkout had no installed `node_modules/.bin/vitest` at review time. No upstream suite, complete CLI Profile/LLM turn, long-running producer, unload cancellation, timed Schedule delivery/restart, plan review interaction, or todo browser projection was run. Type compilation, direct Cordis scripts, and CLI boot do not prove those remaining behaviors.

## New source files

- `skill-source/api-guardrails/jobs.md`
- `skill-source/api-guardrails/schedule.md`
- `skill-source/api-guardrails/planning.md`
- `skill-source/how-to/run-background-job.md`
- `skill-source/how-to/schedule-session-task.md`

These are candidate topical references. Shared manifest, claims, coverage, indexes, source map, and formal Skill output were not edited in this subtask.
