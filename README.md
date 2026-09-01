<div align="center">

<h1>🧩 DSH Plugin Development</h1>

**Build DeepSeek Harness plugins at the right extension points.**

Lifecycle ownership · durable context · Providers · tools · Client UI · validation

**English** · [简体中文](README_zh-CN.md)

[![GitHub stars](https://img.shields.io/github/stars/thundax-lyp/dsh-plugin-development?style=for-the-badge&color=yellow&label=Stars)](https://github.com/thundax-lyp/dsh-plugin-development/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/thundax-lyp/dsh-plugin-development?style=for-the-badge&color=blue&label=Forks)](https://github.com/thundax-lyp/dsh-plugin-development/network/members)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)](LICENSE)
[![DSH: v0.1.1-rc.2](https://img.shields.io/badge/DSH-v0.1.1--rc.2-4D6BFE?style=for-the-badge)](#compatibility)
[![Agent Skill](https://img.shields.io/badge/Agent-Skill-8257D0?style=for-the-badge)](.agents/skills/dsh-plugin-development/SKILL.md)
[![Offline](https://img.shields.io/badge/References-Offline-2EA44F?style=for-the-badge)](.agents/skills/dsh-plugin-development/references/)

</div>

---

This repository is not a runnable DSH plugin and does not include DSH itself.
It is a version-pinned, offline development guide that helps an Agent select
the correct extension points, preserve Cordis lifecycle and durable-context
invariants, and gather appropriate evidence for each change.

> Current and only supported baseline: `dsh-v0.1.1-rc.2`

## 🔌 Compatibility

| Surface          | Status                                               |
| ---------------- | ---------------------------------------------------- |
| DeepSeek Harness | `dsh-v0.1.1-rc.2` only                               |
| Distribution     | Plain workspace Agent Skill                          |
| Runtime code     | None                                                 |
| Network access   | None required; references are offline                |
| Language         | English and Simplified Chinese project documentation |

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

The bundled offline references cover the following development paths:

| Area              | Capabilities                                                               |
| ----------------- | -------------------------------------------------------------------------- |
| Model surface     | Tools, render intent, system prompts, runtime context, Skill contributions |
| Providers         | Service/Provider/Consumer seams, LLM Adapters, external protocols          |
| Agents            | Agent lifecycle, input control, Subagents, TeamTask, Workflow              |
| Human interaction | Human commands, user questions, one-time action approval                   |
| Client            | UI slots, components/stores/actions/locales, Conversation Nodes            |
| Remote access     | Typert Remote API, Gateway carriers, rc.2 webhook receivers                |
| State and storage | Session events, projections, Storage domains, plugin state                 |
| Composition       | Profiles, bundles, boot, Config, Settings, Credentials                     |
| Delivery          | New packages, lifecycle tests, snapshots, docs, generated artifacts        |

See
[`plugin-development-routing.md`](.agents/skills/dsh-plugin-development/references/plugin-development-routing.md)
for the complete task index.

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

The Skill applies to implementing or modifying DSH extensions. It is not for
ordinary DSH usage or documentation-only work unrelated to a code change.

## 🔄 Agent workflow

An Agent using this Skill should:

1. Confirm that the target code is based on `dsh-v0.1.1-rc.2`.
2. Read the target repository instructions and inspect the nearest existing
   implementation.
3. Select one or more primary paths based on the requested observable result.
4. Add relevant cross-cutting paths for persistence, configuration,
   credentials, concurrent resources, or deliverables.
5. Read every selected reference in full, then implement against the target
   repository's source, public types, and tests.
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
├── README.md
├── README_zh-CN.md
├── AGENTS.md
├── LICENSE
└── .agents/skills/dsh-plugin-development/
    ├── SKILL.md                  # Entry point, scope, and global rules
    ├── agents/openai.yaml        # Display metadata and default prompt
    └── references/
        ├── plugin-development-routing.md
        ├── cordis-lifecycle.md
        ├── tools.md
        ├── capability-seams-providers.md
        ├── llm-provider-adapters.md
        ├── agent-subagent-workflow.md
        ├── session-durable-context.md
        ├── storage-projections.md
        ├── client-ui.md
        ├── client-conversation-nodes.md
        ├── typert-remote-api.md
        └── ...
```

`SKILL.md` remains concise and defines only the entry point and invariants.
Detailed knowledge is split by topic under `references/`, allowing an Agent to
load only the material relevant to the current task.

## ⚠️ Version and boundaries

The reference library is fixed to `dsh-v0.1.1-rc.2` and does not follow a
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

## 🛠️ Maintenance

Before maintaining the Skill or upgrading its baseline, read
[`source-map.md`](.agents/skills/dsh-plugin-development/references/source-map.md)
and
[`testing-docs-maintenance.md`](.agents/skills/dsh-plugin-development/references/testing-docs-maintenance.md).

Maintenance requirements include:

- rechecking every evidence path at the exact target tag;
- reconciling public types, runtime code, tests, and executable gates;
- compiling TypeScript code fences and parsing JSON code fences;
- validating all local Markdown targets and heading anchors;
- keeping the Skill offline, with no HTTP(S) URL in its directory;
- never introducing APIs from a newer version into an older pinned baseline.

## 📄 License

Licensed under the [Apache License 2.0](LICENSE).
