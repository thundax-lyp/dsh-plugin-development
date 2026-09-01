# Repository Guidelines

## Project purpose

This repository contains the `dsh-plugin-development` Agent Skill. It is an
offline development guide for implementing or modifying DeepSeek Harness (DSH)
Cordis packages and plugins. It is not a runnable DSH plugin and does not
contain the DSH source tree.

The Skill has one pinned target baseline: `dsh-v0.1.1-rc.2`. Do not silently
apply facts or APIs from another tag or a moving branch.

## Repository layout

- `README.md` is the public project overview.
- `.agents/skills/dsh-plugin-development/SKILL.md` is the Skill entry point.
- `.agents/skills/dsh-plugin-development/agents/openai.yaml` contains display
  metadata and the default prompt.
- `.agents/skills/dsh-plugin-development/references/` contains the offline,
  topic-specific development references.
- `references/plugin-development-routing.md` routes development tasks to the
  minimum relevant reference set.
- `references/source-map.md` records the pinned DSH repository evidence used to
  maintain the references.
- `references/testing-docs-maintenance.md` defines validation and release
  maintenance requirements.

## Scope of changes

Keep this repository focused on the Skill and its offline references.

- Do not add a DSH runtime, example product, generated catalog, or unrelated
  plugin implementation to this repository.
- Do not promote examples or experimental DSH packages to default product
  components.
- Do not change the pinned baseline unless the task explicitly requests a
  baseline upgrade.
- Do not infer permission to call external services, modify credentials, push,
  publish, or release.

## Editing rules

### Skill entry point

Keep `SKILL.md` concise. It should define:

- when the Skill applies and when it does not;
- the pinned DSH baseline;
- the routing procedure;
- cross-cutting implementation invariants;
- completion and authorization boundaries.

Move detailed explanations, code skeletons, and validation matrices into the
appropriate reference rather than expanding `SKILL.md` indefinitely.

### References

Each reference must be self-contained for the topic selected by the router.
Avoid requiring an Agent to read unrelated references to understand a selected
one.

- Give each fact one authoritative home; link to it instead of duplicating it.
- Keep the router as an index, not a second copy of the reference content.
- Use relative links and stable Markdown headings.
- Distinguish clearly between:
    - behavior implemented in `dsh-v0.1.1-rc.2`;
    - rules enforced by the DSH repository;
    - guidance derived from existing primitives;
    - behavior required only by an external protocol.
- Do not turn a design recommendation into a claim that the product already
  implements it.
- Do not treat an example or snapshot as proof of a published default.

### Code examples

Code examples must match the public types and runtime behavior of the pinned
tag. Prefer complete, minimal skeletons that expose ownership, failure,
cancellation, and cleanup behavior.

- Preserve DSH package export conventions.
- Show lifecycle ownership for every registration and asynchronous resource.
- Keep model-visible facts reconstructable from the Session log.
- Use one canonical JSON result for model tools and keep rendering pure.
- Do not invent APIs that are absent from the pinned tag.

### Public documentation

Keep `README.md`, `SKILL.md`, metadata, routing entries, and references aligned.
Update public documentation only when its owned facts change. Describe current
behavior rather than editing history.

## Evidence policy

When maintaining technical claims, resolve conflicts in this order:

1. Public types and runtime code.
2. Executable repository gates.
3. Behavioral tests.
4. The owning package README.
5. Other narrative documentation.

Use `references/source-map.md` to locate evidence only when maintaining the
Skill or auditing its basis. Normal DSH plugin-development tasks should use the
router and selected topic references instead.

Do not claim that a command passed unless its output was actually observed.
Keep design readiness, implemented behavior, and completed validation separate
in reports.

## Validation

Choose checks according to the changed surface. Documentation-only changes do
not require unrelated DSH runtime suites, but they still require structural
validation.

For every Skill change, check at minimum:

1. Skill frontmatter and metadata remain valid and consistent.
2. Every local Markdown link and heading anchor resolves.
3. JSON code fences parse successfully.
4. TypeScript code fences compile against the pinned declarations when code
   examples changed.
5. Every path listed in `references/source-map.md` resolves in an exact
   `dsh-v0.1.1-rc.2` checkout when evidence mappings changed.
6. The Skill directory contains no HTTP(S) URL.
7. Files contain no unintended trailing whitespace.
8. The final diff contains only task-related changes.

Follow the complete maintenance procedure in
`.agents/skills/dsh-plugin-development/references/testing-docs-maintenance.md`.
If a required DSH checkout, generated declaration, or repository command is not
available, report that validation as not run instead of treating it as passed.

## Baseline upgrades

A baseline upgrade is a repository-wide evidence refresh, not a version-string
replacement. When explicitly requested:

1. Check out the exact new DSH tag.
2. Revisit every path in `references/source-map.md`.
3. Reconcile examples with public types, runtime code, tests, manifests, and
   executable gates.
4. Update routing and references for added, removed, or renamed extension
   points.
5. Run the full Skill publication validation described above.
6. Document unavailable or changed APIs explicitly; never blend multiple DSH
   baselines into one reference set.

## Commit rules

### Authorization

- Leave completed changes in the working tree by default. Stage and commit only
  when the user explicitly asks for a commit.
- Staging, committing, pushing, creating a PR, and merging a PR are separate
  operations. Authorization for one does not authorize another.
- A request to modify, inspect, review, or validate does not authorize a
  commit.
- When a commit is requested, include only files owned by the current task.
  Preserve unrelated or ambiguously owned working-tree and index changes.

### Commit boundary

- One commit should express one engineering decision, small capability change,
  evidence lock, configuration assembly, or documentation rule that can be
  summarized in one sentence.
- Keep the source, tests, public contract, configuration, and documentation
  required by the same decision in the same commit.
- Split independent decisions, independent risks, or changes that should be
  independently reversible.
- Do not mechanically squash merely to reduce the commit count.
- Do not split a decision into intermediate commits that cannot be understood
  or validated on their own.
- File count is a cohesion signal, not a mechanical split or merge rule.
- Do not mix unrelated formatting, refactoring, temporary files, credentials,
  local absolute paths, or user-owned changes into a commit.

### Commit message

Use this format:

```text
Type(<project>[/<module>]): <中文工程判断>
```

Allowed `Type` values include `Feat`, `Fix`, `Docs`, `Test`, `Refactor`, and
`CI`. The summary must state the resulting engineering decision or capability;
avoid vague wording such as “调整”, “修改”, or “优化”.

Project Registry:

| Project | Scope                                                                 | Boundary                                                                         |
| ------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `repo`  | Root governance, public docs, CI, and shared repository configuration | Do not use for the internal content of one Skill                                 |
| `skill` | `.agents/skills/dsh-plugin-development/`                              | Skill entry point, metadata, routing, references, examples, and Skill validation |

The optional module identifies a stable area within the selected project; it
does not replace the project. Do not invent temporary project names or use
unregistered aliases.

When a decision truly cannot be split across registered projects, use:

```text
Type(cross-project): <中文工程判断>

Projects: <project-a>, <project-b>
Decision: <why the projects must change atomically>
Verification: <evidence covering each project and their shared contract>
```

Do not use `cross-project` when the changes can be understood, validated, and
reverted independently.

### Before committing

1. Inspect `git status` and distinguish current-task files from pre-existing
   user changes.
2. Read the complete staged diff and check for credentials, temporary data,
   absolute paths, and unrelated changes.
3. Run the narrowest validation set appropriate to the change risk.
4. Report unrun, failed, or blocked checks accurately; never present them as
   passed.
5. Check whether behavior, API, architecture, operations, or workflow changes
   require synchronized documentation.
6. Run `git diff --cached --check` and confirm the staged diff is the intended
   commit boundary.

### History safety

- Do not amend, rebase, squash, or otherwise rewrite existing commits unless
  the user explicitly requests that exact history operation.
- Do not rewrite history already pushed or shared with collaborators without
  explicit confirmation of the target and risk.
- If an explicitly authorized published-history update requires a force push,
  use lease protection; never use an unprotected force push.
- Do not use destructive commands to discard commits, working-tree changes, or
  untracked files.

## Pull request rules

### Delivery boundary

- Development changes enter `main` through `branch -> PR -> review -> merge`.
  Do not push in-progress development directly to `main`.
- Organize each branch and PR around one reviewable, verifiable delivery goal.
- A PR may contain one or more compliant commits, but together they must form a
  coherent delivery boundary.
- Draft status does not justify omitting scope, risk, or validation details.
- If a PR must span multiple projects or technical domains, explain why it
  cannot be split, identify the cross-boundary impact, and expand validation.

Use short, stable English branch names such as
`docs/clarify-maintenance` or `feat/add-provider-reference`.

### PR title and description

Use the same title structure as commit messages:

```text
Type(<project>[/<module>]): <阶段性交付结论>
```

The PR description must explain the delivered result, not merely list changed
files. It must cover:

- `Closure`: the completed and reviewable outcome;
- `Scope`: included work and explicit exclusions;
- `Verification Evidence`: commands actually run and their observed results;
- `Not Covered`: checks not automated, not run, blocked, or intentionally
  excluded, with reasons and impact;
- `Cross-boundary Impact`: effects on APIs, lifecycle, permissions, data,
  configuration, or distribution;
- `Documentation And Task Closure`: documentation and remaining task status;
- `Risks`: residual risks, runtime dependencies, and follow-up concerns.

Use the repository PR template when one exists. Fill non-applicable fields with
`N/A` and a reason rather than leaving them blank or marking them as passed.
Do not include credentials, local absolute paths, temporary files, unpublished
drafts, personal machine details, or an Agent's internal execution narrative.

### Verification evidence

- The repository PR workflow exposes two checks: `Governance` verifies required
  repository files and diff formatting; `Skill Integrity` verifies Skill
  frontmatter, metadata, pinned-baseline consistency, the offline boundary,
  local Markdown targets, and JSON code fences.
- Keep these checks visible as separate jobs. Do not hide all validation behind
  one opaque aggregate script.
- Record only checks that were actually run and observed.
- Prefer the narrowest checks matching the diff; expand for public contracts,
  shared infrastructure, lifecycle behavior, or distribution changes.
- Automated green checks are evidence, not proof that lifecycle, permissions,
  recovery behavior, and user-visible behavior are correct.
- Put blocked or unavailable checks in `Not Covered` with their likely impact.
- Before requesting merge, resolve executable review feedback and rerun checks
  affected by the fix.

The current CI does not compile TypeScript code fences or validate every source
map path against a separate exact DSH checkout. Report those checks under `Not
Covered` unless they were run through the full publication procedure described
in `references/testing-docs-maintenance.md`.

### GitHub tooling and authorization

- A GitHub connector and local `gh` CLI may have different credentials and
  permissions. A connector failure does not by itself prove the requested
  GitHub operation is impossible.
- Changing the access channel does not expand user authorization. Push, reply,
  resolve, reaction, deletion, close, and merge remain separately authorized
  writes.
- Before using `gh`, verify the repository and target PR, thread, or comment,
  and confirm that `gh auth status` has access to the repository.
- After every GitHub write, read the target resource back and verify its final
  state. A successful command exit is not a substitute for readback.

### Review and merge

- Review the complete PR diff from its merge base and assess requirements,
  contracts, lifecycle ownership, failure paths, and validation evidence.
- A finding must state its concrete trigger, observable impact, and correction
  direction; do not report unsupported speculation or pure style preference as
  a defect.
- Default to a normal merge commit so small, meaningful branch commits remain
  visible. Squash only when the user explicitly requests it.
- Never merge a PR automatically. Merge only when the user explicitly asks for
  that operation.

## Side effects

- Do not reset, rebase, push, open a PR, publish, release, or merge unless the
  user explicitly requests the corresponding operation.
- Do not edit generated files when a source and generator own the output.
