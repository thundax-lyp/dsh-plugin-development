<div align="center">

<h1>🧩 DSH Plugin Development</h1>

**Build DeepSeek Harness plugins at the right extension points.**

Lifecycle ownership · durable context · Providers · tools · Client UI · validation

**English** · [简体中文](README_zh-CN.md)

[![GitHub stars](https://img.shields.io/github/stars/thundax-lyp/dsh-plugin-development?style=for-the-badge&color=yellow&label=Stars)](https://github.com/thundax-lyp/dsh-plugin-development/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/thundax-lyp/dsh-plugin-development?style=for-the-badge&color=blue&label=Forks)](https://github.com/thundax-lyp/dsh-plugin-development/network/members)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)](LICENSE)
[![DSH: v0.1.2-rc.1](https://img.shields.io/badge/DSH-v0.1.2--rc.1-4D6BFE?style=for-the-badge)](#compatibility)
[![Agent Skill](https://img.shields.io/badge/Agent-Skill-8257D0?style=for-the-badge)](.agents/skills/dsh-plugin-development/SKILL.md)
[![Offline](https://img.shields.io/badge/References-Offline-2EA44F?style=for-the-badge)](.agents/skills/dsh-plugin-development/references/)

</div>

---

This repository is not a runnable DSH plugin and does not include DSH itself.
It is a version-pinned, offline development guide that helps an Agent select
the correct extension points, preserve Cordis lifecycle and durable-context
invariants, and gather appropriate evidence for each change.

> Current and only supported baseline: `dsh-v0.1.2-rc.1`

<a id="compatibility"></a>

## 🔌 Compatibility

| Surface          | Status                                                              |
| ---------------- | ------------------------------------------------------------------- |
| DeepSeek Harness | `dsh-v0.1.2-rc.1` only                                              |
| Distribution     | Plain workspace Agent Skill                                         |
| Runtime code     | No DSH runtime                                                      |
| Network access   | None required; references are offline                               |
| Language         | English/Chinese overview; Skill and references primarily in Chinese |

## 🎯 What problem does it solve?

Developing a DSH extension involves more than adding a function. A
product-ready plugin may also need to manage lifecycle ownership, Session logs,
persistent state, configuration, credentials, UI composition, cancellation,
cleanup, and validation through the real Loader path.

This Skill gives an Agent a task router and implementation constraints so it
can:

- select an appropriate DSH plugin, service, or event extension point;
- avoid modifying the agent loop when a supported extension point exists;
- manage Cordis effects, registration cleanup, and asynchronous resources;
- keep model-visible input reconstructable from the Session log;
- separate Service Definitions, Providers, and Consumers when they evolve
  independently;
- distinguish Session events, Session projections, and plugin-owned state;
- select composition tests for tools, Providers, Client UI, and remote APIs;
- update public API docs, package READMEs, snapshots, and design records when
  their owned facts change.

## 🧭 Coverage

The references organize implemented capabilities, development contracts and known limitations by task. The table is an index, not a reading order or a promise that every capability is enabled by default.

| Area                          | Contents                                                                                                | References                                                                                                                                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tools and models              | Tool schemas, canonical JSON results, Native/PTC, LLM Adapters, model routes and image requests         | [tools](.agents/skills/dsh-plugin-development/references/tools.md) · [llm-model-routing](.agents/skills/dsh-plugin-development/references/llm-model-routing.md)                                               |
| Agents and coordination       | Agent lifecycle, input control, Subagents, Workflow and Ralph; Agent Teams is experimental              | [agent-subagent-workflow](.agents/skills/dsh-plugin-development/references/agent-subagent-workflow.md) · [builtin-tool-contracts](.agents/skills/dsh-plugin-development/references/builtin-tool-contracts.md) |
| Context and recovery          | Session logs, prompts, presets, personas, Skills, compaction, token metering and checkpoints            | [session-durable-context](.agents/skills/dsh-plugin-development/references/session-durable-context.md) · [context-recovery](.agents/skills/dsh-plugin-development/references/context-recovery.md)             |
| State and scheduling          | Storage domains, projections/caches, queries and exports, Plan, Goal, Todo and Schedule                 | [storage-projections](.agents/skills/dsh-plugin-development/references/storage-projections.md) · [planning-scheduling](.agents/skills/dsh-plugin-development/references/planning-scheduling.md)               |
| Files and execution           | Filesystem observation and write policies, image attachments, Spill, processes, terminals, Jobs and E2B | [filesystem-policy](.agents/skills/dsh-plugin-development/references/filesystem-policy.md) · [runtime-resources](.agents/skills/dsh-plugin-development/references/runtime-resources.md)                       |
| External capabilities         | Web search/fetch, LSP, MCP and Provider-specific protocol and execution boundaries                      | [web-capabilities](.agents/skills/dsh-plugin-development/references/web-capabilities.md) · [runtime-resources](.agents/skills/dsh-plugin-development/references/runtime-resources.md)                         |
| Interaction and authorization | Human commands, business questions, action approval, credential records, sign-in flows and hooks        | [human-interaction](.agents/skills/dsh-plugin-development/references/human-interaction.md) · [credentials-authorization](.agents/skills/dsh-plugin-development/references/credentials-authorization.md)       |
| Client and protocols          | UI slots, Conversation Nodes, Session/Workspace APIs, Typert, SDK/ACP and webhooks                      | [client-ui](.agents/skills/dsh-plugin-development/references/client-ui.md) · [sdk-acp-integration](.agents/skills/dsh-plugin-development/references/sdk-acp-integration.md)                                   |
| Composition and extensions    | Profiles, bundles, Settings, scoped registries, dynamic Cordis and Host support                         | [composition-config-credentials](.agents/skills/dsh-plugin-development/references/composition-config-credentials.md) · [dynamic-cordis](.agents/skills/dsh-plugin-development/references/dynamic-cordis.md)   |
| Development and delivery      | Package boundaries, lifecycle, examples, composition tests, documentation and publication checks        | [package-authoring](.agents/skills/dsh-plugin-development/references/package-authoring.md) · [testing-docs](.agents/skills/dsh-plugin-development/references/testing-docs.md)                                 |

For shared controls, overlays, icons and output renderers, see [UI Primitives](.agents/skills/dsh-plugin-development/references/client-ui-primitives.md) for component selection, host integration, behavior limits and consumer validation.

Start with the [task router](.agents/skills/dsh-plugin-development/references/plugin-development-routing.md), then add contracts required by the change. Experimental packages, unsupported protocol features and platform limits are identified in their owning references.

## 🚀 Usage

### 1. Place the Skill in a workspace

This repository already uses the workspace Skill layout:

```text
.agents/
└── skills/
    └── dsh-plugin-development/
```

Clone this repository directly, or copy
`.agents/skills/dsh-plugin-development` into the corresponding Skill directory
of the target workspace.

The workspace metadata allows implicit invocation for matching tasks; explicit invocation remains available.

### 2. Invoke it for a DSH development task

Example prompts:

```text
Use $dsh-plugin-development to add a read-only project search tool to DSH.
```

```text
Use $dsh-plugin-development to implement a new LLM Provider Adapter and add
composition tests.
```

```text
Use $dsh-plugin-development to add persistent settings and a Browser settings
card to an existing plugin.
```

The Skill supports requirements clarification, application design and implementation of DSH extensions. Start with [requirements discovery](.agents/skills/dsh-plugin-development/references/requirements-discovery.md) for scope and acceptance criteria, or [application design](.agents/skills/dsh-plugin-development/references/application-design.md) for capability selection and composition. It is not for ordinary DSH usage or unrelated documentation polishing.

Distinguish DSH monorepo work from a standalone plugin project: `workspace:^` dependencies and vendor compiler paths are not portable templates. See [package authoring](.agents/skills/dsh-plugin-development/references/package-authoring.md#先区分开发环境) for the Profile loading boundary, template scope and unverified standalone setup.

## 🔄 Agent workflow

An Agent using this Skill should:

1. Confirm that the target code is based on `dsh-v0.1.2-rc.1`.
2. Read the target repository instructions and inspect the nearest existing
   implementation.
3. Select one or more primary paths based on the requested observable result.
4. Add relevant cross-cutting paths for persistence, configuration,
   credentials, concurrent resources, or deliverables.
5. Follow each selected reference's scope and navigation, reading the relevant
   complete contracts, including failure, cancellation, permissions, persistence,
   and cleanup. Load other topics only when needed; then implement against the
   target repository's source, public types, and tests.
6. Run the smallest sufficient validation set for the actual change surface.
7. Report only commands whose output was actually observed.

When sources disagree, use this precedence:

```text
public types and runtime code
  > executable repository gates
  > behavioral tests
  > the owning package README
  > other narrative documentation
```

## 🧱 Core implementation principles

- Extend through supported plugins, services, or events instead of modifying
  the agent loop.
- Give every registration, concurrent task, subprocess, socket, and teardown an
  explicit lifecycle owner.
- Keep model-visible facts backed by durable evidence and reconstructable from
  the Session log.
- Give each model tool one canonical JSON result and render it purely from the
  arguments and that result.
- Put deployment differences in validated configuration, profiles, or patches,
  not hidden runtime defaults.
- Validate product-visible wiring through a real Loader/application
  composition; a local `ctx.plugin(...)` test is not equivalent.
- Treat generated catalogs as projections: edit their source and run the
  owning generator instead of editing generated regions manually.

## 🗂️ Repository structure

```text
.
├── README.md / README_zh-CN.md
├── AGENTS.md
├── package.json
├── scripts/
│   ├── validate_skill.py
│   ├── test_validate_skill.py
│   └── check_examples.cjs
└── .agents/skills/dsh-plugin-development/
    ├── SKILL.md
    ├── agents/openai.yaml
    ├── assets/github-review/
    ├── maintenance/
    │   ├── source-map.md
    │   └── skill-maintenance.md
    └── references/
        ├── requirements-discovery.md
        ├── application-design.md
        ├── plugin-development-routing.md
        ├── testing-docs.md
        └── ...
```

The Skill directory is the portable offline guide. Root-level scripts maintain that guide; they are not a DSH runtime. Normal development follows the task router; source-map is for maintenance and baseline audits.

## ⚠️ Version and boundaries

The reference library is fixed to `dsh-v0.1.2-rc.1` and does not follow a
moving branch. If the target repository uses another version, do not apply the
code skeletons or API assumptions directly. Recheck the public types, runtime
code, and tests for that exact version first.

This project also:

- does not provide runtime isolation or an automated security audit;
- does not replace the target repository's `AGENTS.md`, contribution rules, or
  test gates;
- does not imply that every recommendation in the references is a default DSH
  product capability;
- does not authorize an Agent to make external calls, modify credentials, push,
  or release.

## 🛠️ Maintenance and validation

Read the [maintenance procedure](.agents/skills/dsh-plugin-development/maintenance/skill-maintenance.md), then use [source-map](.agents/skills/dsh-plugin-development/maintenance/source-map.md) to locate exact-tag evidence. For upgrades, revisit the old mappings against types, runtime code, tests and gates; compare old/new DOCS and verify their changes against new code; then merge the findings, remove obsolete guidance and update routing.

Install dependencies and run structural checks from this maintenance repository:

```sh
pnpm install --frozen-lockfile
pnpm verify:skill
pnpm test:validation
```

Source and example checks additionally require an exact `dsh-v0.1.2-rc.1` checkout with its locked dependencies and the Host/Client build prerequisites described in the maintenance procedure. Replace the path below with that checkout:

```sh
pnpm verify:skill --dsh /path/to/dsh-checkout
pnpm verify:examples --dsh /path/to/dsh-checkout
```

| Check                   | Coverage and limits                                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `verify:skill`          | Local Markdown files and anchors, JSON fences, offline boundaries and trailing whitespace; explicitly skips source-path validation without `--dsh` |
| `verify:skill --dsh`    | Also verifies the pinned tag/commit and source-map paths                                                                                           |
| `test:validation`       | Success and failure cases for the checker, not DSH product tests                                                                                   |
| `verify:examples --dsh` | Verifies baseline and tracked-source state, compiles Host/Client separately, and cleans temporary copies without changing upstream tracked files   |

CI keeps `Governance` and `Skill Integrity` separate. It has no independent DSH checkout, so source-path and example-compilation checks run separately. Static validation does not replace live model, cloud, GUI or cross-platform integration tests.

These commands belong to the maintenance repository, not the copied Skill directory. Missing dependencies or declarations mean validation failed or was not run, not that it passed.

## 📄 License

Licensed under the [Apache License 2.0](LICENSE).
