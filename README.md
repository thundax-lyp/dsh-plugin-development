# Create DSH Plugin Development Skill

[简体中文](README_zh-CN.md)

This repository contains `$create-dsh-skill`, a workflow for creating a version-specific, offline `dsh-plugin-development` Agent Skill from DeepSeek Harness (DSH) source. The resulting Skill teaches developers how to build DSH Cordis packages and plugins; it is not a general DSH reference.

## Version selection

Invoke `$create-dsh-skill [version]` explicitly. Without a version, the creator resolves the newest published `@deepseek-ai/dsh-agent` release candidate (`X.Y.Z-rc.N`) by numeric version order. With a version, it requires an exact published match. Each creation run records one DSH tag and commit in the build workspace and uses only that checkout for product facts. The distributed Skill identifies the published npm package version; it does not expose the source commit. **This repository has no fixed DSH version baseline.**

## Creation workflow

The [creator Skill](.agents/skills/create-dsh-skill/SKILL.md) prepares the exact checkout, inventories code exports and their object members alongside “how to” task headings, adjudicates each public API and task candidate, and writes a frozen `skill-source/`. It then builds a complete Skill in an isolated directory, validates that directory against the same checkout, and replaces `skills/dsh-plugin-development/` as a whole. The previous generated Skill is never an input to the new one.

Selected common tasks link from the generated `SKILL.md` directly to their exact HOW-TO sections. The source validator checks each selected task's entry against its adjudicated task path; other tasks remain available through the task routing reference.

The entry-point search and evidence rules are in [entrypoint scope](.agents/skills/create-dsh-skill/references/entrypoint-scope.md); the required document structure is in the [reference template](.agents/skills/create-dsh-skill/references/reference-template.md). Candidate coverage and source claims must be resolved before the source can be frozen.

The generated `skills/dsh-plugin-development/` directory is an output, so it may be absent while creation is in progress. Only a completed, validated output should be copied into a consuming project's `.agents/skills/` directory. This repository contains no DSH runtime or product plugin.

## Review a generated Skill

Invoke `$review-dsh-skill` to follow the [review Skill](.agents/skills/review-dsh-skill/SKILL.md). It discovers plugin tasks independently from real needs and the target version, delegates reference groups to subagents, and consolidates P0–P3 findings on coverage, Agent integration results, decision value, and redundancy. The review points proposed changes to the creation sources and validation rules; it does not edit the generated directory.

## Validate the creator

```sh
pnpm install --frozen-lockfile
pnpm verify:skill
pnpm test:validation
pnpm format:check
git diff --check
```

For a generated output, follow the [creator's verification procedure](.agents/skills/create-dsh-skill/SKILL.md#验证与交付), passing the generated Skill and its exact DSH checkout to the validators. Host and Client examples are checked separately. Structural checks alone do not establish runtime behavior.

## Repository layout

```text
.agents/skills/create-dsh-skill/   # creator instructions, references, scripts, tests
.agents/skills/review-dsh-skill/   # user-focused review of an existing output
.dsh-skill-build/                 # per-version workspace; output and adjudicated evidence can be tracked
skills/dsh-plugin-development/    # validated generated output, when present
scripts/                          # independent output validators
docs/00-governance/               # commit and PR rules
```

## License

[Apache License 2.0](LICENSE)
