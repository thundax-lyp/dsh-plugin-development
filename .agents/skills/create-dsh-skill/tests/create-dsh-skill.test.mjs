import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
    existsSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { buildSkill } from "../scripts/build-dsh-plugin-development-skill.mjs";
import {
    buildApiEntryCandidates,
    buildCapabilityCandidates,
    buildTaskCandidates,
} from "../scripts/inventory-dsh-surface.mjs";
import { discoverPublicApiMembers } from "../scripts/discover-public-api-members.mjs";
import {
    buildCoverageWorkQueue,
    initializeCoverage,
} from "../scripts/initialize-capability-coverage.mjs";
import {
    assertReplaceableFormalSkill,
    installGeneratedSkill,
} from "../scripts/replace-generated-skill.mjs";
import { resolvePublishedVersion } from "../scripts/resolve-dsh-agent-version.mjs";
import { loadTarget } from "../scripts/skill-build-contract.mjs";
import { syncTaskNavigation } from "../scripts/sync-task-navigation.mjs";
import { renderTaskNavigation } from "../scripts/task-navigation.mjs";
import { validateSkillSource } from "../scripts/validate-skill-source.mjs";
import { verifyTaskScenarios } from "../scripts/verify-task-scenarios.mjs";

function write(path, content) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
}

function createFixture(t, options = {}) {
    const root = mkdtempSync(join(tmpdir(), "create-dsh-skill-test-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const targetPath = join(root, "target");
    const checkoutPath = join(targetPath, "checkout");
    const skillSourcePath = join(targetPath, "skill-source");
    mkdirSync(checkoutPath, { recursive: true });
    write(join(checkoutPath, ".gitignore"), "ignored-proof.ts\n");
    write(
        join(checkoutPath, "proof.ts"),
        "export const proof = true;\nexport interface Fixture { run(): void }\n",
    );
    write(
        join(checkoutPath, "docs/how-to.md"),
        "# How to register a tool\n\nUse a plugin.\n",
    );
    execFileSync("git", ["init", "-q"], { cwd: checkoutPath });
    execFileSync("git", ["add", "."], { cwd: checkoutPath });
    execFileSync(
        "git",
        [
            "-c",
            "user.name=Skill Test",
            "-c",
            "user.email=skill-test@example.invalid",
            "commit",
            "-qm",
            "fixture",
        ],
        { cwd: checkoutPath },
    );
    const commit = execFileSync("git", ["rev-parse", "HEAD"], {
        cwd: checkoutPath,
        encoding: "utf8",
    }).trim();
    const identity = {
        version: "9.9.9-rc.9",
        tag: "dsh-v9.9.9-rc.9",
        commit,
        remote: "https://github.com/deepseek-ai/deepseek-harness",
    };
    write(
        join(targetPath, "provenance.json"),
        `${JSON.stringify(
            { package: "@deepseek-ai/dsh-agent", ...identity },
            null,
            4,
        )}\n`,
    );
    write(
        join(targetPath, "evidence", "inventory.json"),
        `${JSON.stringify({ schemaVersion: 1, ...identity }, null, 4)}\n`,
    );
    write(
        join(targetPath, "evidence", "capability-candidates.json"),
        `${JSON.stringify({ schemaVersion: 1, ...identity, candidates: [{ id: "package:fixture", kind: "public-package", path: "proof.ts" }] }, null, 4)}\n`,
    );
    if (options.schemaVersion === 3) {
        write(
            join(targetPath, "evidence", "api-entry-candidates.json"),
            `${JSON.stringify({ schemaVersion: 1, ...identity, candidates: [{ id: "export:@deepseek-ai/dsh-fixture:.", package: "@deepseek-ai/dsh-fixture", subpath: ".", path: "proof.ts" }] }, null, 4)}\n`,
        );
        write(
            join(targetPath, "evidence", "api-symbol-candidates.json"),
            `${JSON.stringify({ schemaVersion: 1, ...identity, entries: [{ entry: "export:@deepseek-ai/dsh-fixture:.", source: "proof.ts", status: "resolved", symbols: [{ name: "Fixture", signature: "Fixture", source: "proof.ts", members: [{ name: "run", signature: "() => void" }] }] }] }, null, 4)}\n`,
        );
        write(
            join(targetPath, "evidence", "task-candidates.json"),
            `${JSON.stringify({ schemaVersion: 1, ...identity, candidates: [{ id: "task:docs/how-to.md:1", path: "docs/how-to.md", line: 1, title: "How to register a tool" }] }, null, 4)}\n`,
        );
        write(
            join(skillSourcePath, "api-surface.json"),
            `${JSON.stringify(options.apiSurface ?? { schemaVersion: 1, ...identity, entries: [{ candidate: "export:@deepseek-ai/dsh-fixture:.", decision: "included" }], objects: [{ id: "fixture", entry: "export:@deepseek-ai/dsh-fixture:.", symbol: "Fixture", signature: "Fixture", source: "proof.ts", decision: "included", owner: "references/api-tools.md", section: "Tool contract", members: [{ name: "run", signature: "() => void", decision: "included" }] }] }, null, 4)}\n`,
        );
    }

    const sourceFiles = [
        {
            source: "entrypoint/SKILL.md",
            output: "SKILL.md",
            kind: "entrypoint",
            content:
                options.entrypoint ??
                "---\nname: dsh-plugin-development\ndescription: Fixture Skill\n---\n# @deepseek-ai/dsh-agent@9.9.9-rc.9\n\n[Section](#section)\n\n## Section\n",
        },
        {
            source: "metadata/openai.yaml",
            output: "agents/openai.yaml",
            kind: "metadata",
            content:
                options.metadata ??
                'interface:\n    display_name: "Fixture"\n    short_description: "Fixture"\n    default_prompt: "Fixture"\n',
        },
        {
            source: "indexes/routing.md",
            output: "references/plugin-development-routing.md",
            kind: "index",
            content:
                options.routing ??
                "# Routing\n\n[Tool contract](api-tools.md)\n[How-to](how-to.md)\n",
        },
        {
            source: "indexes/keyword.md",
            output: "references/keyword-index.md",
            kind: "index",
            content: "# Keywords\n",
        },
        {
            source: "concepts/terminology.md",
            output: "references/terminology.md",
            kind: "index",
            content: "# Terminology\n",
        },
        {
            source: "api-guardrails/tools.md",
            output: "references/api-tools.md",
            kind: "api-guardrail",
            content:
                "# API\n\n## Tool contract\n\nFixture.run registers a tool for a plugin task.\n",
        },
        {
            source: "how-to/example.md",
            output: "references/how-to.md",
            kind: "how-to",
            content:
                "# How-to\n\n## Complete task\n\nBuild and load the plugin.\n",
        },
        {
            source: "maintenance/source-map.md",
            output: "maintenance/source-map.md",
            kind: "maintenance",
            content: "# Source map\n\n@deepseek-ai/dsh-agent@9.9.9-rc.9\n",
        },
        {
            source: "maintenance/skill-maintenance.md",
            output: "maintenance/skill-maintenance.md",
            kind: "maintenance",
            content: "# Maintenance\n",
        },
        ...(options.extraFiles ?? []),
    ];
    for (const file of sourceFiles) {
        write(join(skillSourcePath, file.source), file.content);
    }
    write(
        join(skillSourcePath, "manifest.json"),
        `${JSON.stringify(
            {
                schemaVersion: options.schemaVersion ?? 1,
                ...identity,
                status: "draft",
                ...(options.taskNavigation
                    ? { taskNavigation: options.taskNavigation }
                    : {}),
                topics: ["tools"],
                files: sourceFiles.map(({ source, output, kind }) => ({
                    source,
                    output,
                    kind,
                })),
            },
            null,
            4,
        )}\n`,
    );
    write(
        join(skillSourcePath, "claims.json"),
        `${JSON.stringify(
            [
                {
                    id: "api",
                    kind: "implemented-behavior",
                    topic: "tools",
                    decision: "accepted",
                    owner: "references/api-tools.md",
                    summary: "API claim",
                    evidence: [{ category: "public-api", path: "proof.ts" }],
                },
                {
                    id: "how-to",
                    kind: "derived-guidance",
                    topic: "tools",
                    decision: "accepted",
                    owner: "references/how-to.md",
                    summary: "How-to claim",
                    evidence: [{ category: "public-api", path: "proof.ts" }],
                },
            ],
            null,
            4,
        )}\n`,
    );
    write(
        join(skillSourcePath, "coverage.json"),
        `${JSON.stringify({ schemaVersion: options.schemaVersion ?? 1, dispositions: [{ id: "fixture", decision: "included", candidates: ["package:fixture"], topics: ["tools"], owners: ["references/api-tools.md"], summary: "Fixture capability", pluginTask: "Register a plugin tool", ownerSections: { "references/api-tools.md": "Tool contract" } }], ...(options.schemaVersion >= 2 ? { taskPaths: options.taskPaths ?? [] } : {}), ...(options.schemaVersion === 3 ? { taskDiscoveries: options.taskDiscoveries ?? [] } : {}) }, null, 4)}\n`,
    );
    return { targetPath, checkoutPath, skillSourcePath };
}

test("omitted version selects the newest published RC numerically", () => {
    const versions = ["0.2.0-rc.9", "0.2.0-rc.10", "0.3.0-beta.1"];
    assert.equal(resolvePublishedVersion(versions), "0.2.0-rc.10");
    assert.equal(resolvePublishedVersion(versions, "0.2.0-rc.9"), "0.2.0-rc.9");
    assert.throws(
        () => resolvePublishedVersion(versions, "0.2.0-rc.11"),
        /not published/,
    );
});

test("capability discovery is target-only and drops fixture compositions", () => {
    const identity = {
        version: "1.0.0-rc.1",
        tag: "dsh-v1.0.0-rc.1",
        commit: "a".repeat(40),
        remote: "https://example.invalid/repository",
    };
    const candidates = buildCapabilityCandidates({
        ...identity,
        packageManifests: [
            {
                path: "packages/core/tool/package.json",
                name: "@example/tool",
                private: false,
                exports: { ".": "./index.js" },
                bin: null,
            },
        ],
        manifests: [
            { path: "packages/bundle/base/cordis.patch.yml" },
            { path: "packages/bundle/base/tests/fixtures/cordis.yml" },
        ],
        documentation: [
            { path: "docs/subsystems/tools.md" },
            { path: "docs/subsystems/tools.zh.md" },
            { path: "docs/cookbook/adding-a-tool.md" },
        ],
    });
    assert.deepEqual(
        candidates.candidates.map((candidate) => candidate.id),
        [
            "composition:packages/bundle/base/cordis.patch.yml",
            "cookbook:adding-a-tool",
            "package:@example/tool",
            "subsystems:tools",
        ],
    );
});

test("API entry and how-to discovery include exports and task headings", (t) => {
    const root = mkdtempSync(join(tmpdir(), "dsh-discovery-test-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    write(
        join(root, "docs/guide.md"),
        "# How to build a plugin\n\n```md\n## How to ignore this\n```\n\n## API details\n",
    );
    write(join(root, "website/webui.mdx"), "# 如何接入 WebUI\n");
    const inventory = {
        version: "1.0.0",
        tag: "dsh-v1.0.0",
        commit: "a".repeat(40),
        remote: "https://example.invalid",
        packageManifests: [
            {
                path: "packages/tool/package.json",
                name: "@deepseek-ai/dsh-tool",
                private: false,
                exports: {
                    ".": { types: "./lib/types/index.d.ts" },
                    "./client": "./lib/client.js",
                },
                bin: null,
            },
            {
                path: "packages/cordis/package.json",
                name: "@deepseek-ai/cordis",
                private: false,
                exports: { ".": "./lib/index.js" },
                bin: null,
            },
        ],
        documentation: [{ path: "docs/guide.md" }],
        readmes: [],
        website: [{ path: "website/webui.mdx" }],
    };
    assert.deepEqual(
        buildApiEntryCandidates(inventory).candidates.map((item) => item.id),
        [
            "export:@deepseek-ai/cordis:.",
            "export:@deepseek-ai/dsh-tool:.",
            "export:@deepseek-ai/dsh-tool:./client",
        ],
    );
    assert.deepEqual(
        buildTaskCandidates(inventory, root).candidates.map(
            (item) => item.title,
        ),
        ["How to build a plugin", "如何接入 WebUI"],
    );
});

test("public API discovery follows re-exports and lists members", (t) => {
    const root = mkdtempSync(join(tmpdir(), "dsh-api-test-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const checkoutPath = join(root, "checkout");
    const evidencePath = join(root, "evidence");
    write(
        join(checkoutPath, "packages/tool/src/index.ts"),
        "export * from './types.ts'\n",
    );
    write(
        join(checkoutPath, "packages/tool/src/types.ts"),
        "export interface Tool { name: string; run(input: string): Promise<void> }\nexport class Driver { private secret = 1; protected helper() {} public run() {} *[Symbol.iterator]() { yield 1 } }\n",
    );
    const provenance = {
        version: "1.0.0",
        tag: "dsh-v1.0.0",
        commit: "a".repeat(40),
        remote: "https://example.invalid",
    };
    write(
        join(evidencePath, "api-entry-candidates.json"),
        `${JSON.stringify({ schemaVersion: 1, ...provenance, candidates: [{ id: "export:@deepseek-ai/dsh-tool:.", package: "@deepseek-ai/dsh-tool", subpath: ".", path: "packages/tool/package.json", declaration: { types: "./lib/types/index.d.ts" } }] })}\n`,
    );
    const result = discoverPublicApiMembers({
        checkoutPath,
        evidencePath,
        provenance,
    });
    const tool = result.entries[0].symbols.find((item) => item.name === "Tool");
    assert.deepEqual(
        tool.members.map((member) => member.name),
        ["name", "run"],
    );
    const driver = result.entries[0].symbols.find(
        (item) => item.name === "Driver",
    );
    assert.deepEqual(
        driver.members.map((member) => member.name),
        ["run"],
    );
});

test("coverage work queue retains every candidate without deciding it", () => {
    const coverage = buildCoverageWorkQueue({
        candidates: [
            {
                id: "package:a",
                kind: "public-package",
                path: "packages/core/a/package.json",
            },
            {
                id: "package:b",
                kind: "public-package",
                path: "packages/core/b/package.json",
            },
            {
                id: "subsystems:a",
                kind: "subsystem",
                path: "docs/subsystems/a.md",
            },
        ],
    });
    assert.equal(coverage.dispositions.length, 2);
    assert.deepEqual(
        coverage.dispositions.flatMap((entry) => entry.candidates).sort(),
        ["package:a", "package:b", "subsystems:a"],
    );
    assert.ok(
        coverage.dispositions.every((entry) => entry.decision === "pending"),
    );
});

test("schema v3 initializer seeds API members and task discovery without adjudicating", (t) => {
    const fixture = createFixture(t, { schemaVersion: 3 });
    write(
        join(fixture.skillSourcePath, "coverage.json"),
        `${JSON.stringify({ schemaVersion: 3, dispositions: [], taskPaths: [], taskDiscoveries: [] })}\n`,
    );
    const surfacePath = join(fixture.skillSourcePath, "api-surface.json");
    const surface = JSON.parse(readFileSync(surfacePath, "utf8"));
    surface.entries = [];
    surface.objects = [];
    writeFileSync(surfacePath, `${JSON.stringify(surface, null, 4)}\n`);
    initializeCoverage(fixture.targetPath);
    const api = JSON.parse(readFileSync(surfacePath, "utf8"));
    const coverage = JSON.parse(
        readFileSync(join(fixture.skillSourcePath, "coverage.json"), "utf8"),
    );
    assert.equal(api.entries[0].decision, "pending");
    assert.equal(api.objects[0].members[0].decision, "pending");
    assert.equal(coverage.taskDiscoveries[0].decision, "pending");
    assert.throws(
        () => initializeCoverage(fixture.targetPath),
        /already contains work/,
    );
});

test("prepared checkout rejects untracked files", (t) => {
    const fixture = createFixture(t);
    write(join(fixture.checkoutPath, "untracked.ts"), "untracked\n");
    assert.throws(
        () => loadTarget(fixture.targetPath),
        /working-tree modifications/,
    );
});

test("claim evidence must be tracked by the target commit", (t) => {
    const fixture = createFixture(t);
    write(join(fixture.checkoutPath, "ignored-proof.ts"), "ignored\n");
    const claimsPath = join(fixture.skillSourcePath, "claims.json");
    const claims = JSON.parse(readFileSync(claimsPath, "utf8"));
    claims[0].evidence[0].path = "ignored-proof.ts";
    writeFileSync(claimsPath, `${JSON.stringify(claims, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath),
        /not tracked by the target commit/,
    );
});

test("every target capability candidate requires one disposition", (t) => {
    const fixture = createFixture(t);
    const coveragePath = join(fixture.skillSourcePath, "coverage.json");
    writeFileSync(
        coveragePath,
        `${JSON.stringify({ schemaVersion: 1, dispositions: [] }, null, 4)}\n`,
    );
    assert.throws(
        () => validateSkillSource(fixture.targetPath),
        /lack a disposition/,
    );
});

test("capability candidate cannot be disposed twice", (t) => {
    const fixture = createFixture(t);
    const coveragePath = join(fixture.skillSourcePath, "coverage.json");
    const coverage = JSON.parse(readFileSync(coveragePath, "utf8"));
    coverage.dispositions.push({
        id: "duplicate",
        decision: "excluded",
        candidates: ["package:fixture"],
        reason: "duplicate fixture",
    });
    writeFileSync(coveragePath, `${JSON.stringify(coverage, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath),
        /disposed more than once/,
    );
});

test("freeze requires plugin-task coverage at a real reference section", (t) => {
    const fixture = createFixture(t);
    const coveragePath = join(fixture.skillSourcePath, "coverage.json");
    const coverage = JSON.parse(readFileSync(coveragePath, "utf8"));
    delete coverage.dispositions[0].pluginTask;
    writeFileSync(coveragePath, `${JSON.stringify(coverage, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /pluginTask/,
    );
    coverage.dispositions[0].pluginTask = "Register a plugin tool";
    coverage.dispositions[0].ownerSections["references/api-tools.md"] =
        "Missing section";
    writeFileSync(coveragePath, `${JSON.stringify(coverage, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /no matching heading/,
    );
});

test("new source schema requires a routed plugin task path", (t) => {
    const fixture = createFixture(t, { schemaVersion: 2 });
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /coverage.taskPaths must contain adjudicated plugin tasks/,
    );
    const coveragePath = join(fixture.skillSourcePath, "coverage.json");
    const coverage = JSON.parse(readFileSync(coveragePath, "utf8"));
    coverage.taskPaths.push({
        id: "register-tool",
        outcome: "Plugin tool can be called",
        decision: "covered",
        candidates: ["package:fixture"],
        destinations: [
            { output: "references/how-to.md", section: "Complete task" },
        ],
    });
    writeFileSync(coveragePath, `${JSON.stringify(coverage, null, 4)}\n`);
    assert.doesNotThrow(() =>
        validateSkillSource(fixture.targetPath, { freeze: true }),
    );
});

test("new task coverage rejects unrouted and missing capability paths", (t) => {
    const fixture = createFixture(t, { schemaVersion: 2 });
    const coveragePath = join(fixture.skillSourcePath, "coverage.json");
    const coverage = JSON.parse(readFileSync(coveragePath, "utf8"));
    coverage.taskPaths = [
        {
            id: "unsupported-task",
            outcome: "Unsupported capability",
            decision: "excluded",
            candidates: ["package:fixture"],
            reason: "No public plugin path",
        },
    ];
    writeFileSync(coveragePath, `${JSON.stringify(coverage, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /Included capabilities lack a plugin task path/,
    );
    coverage.taskPaths.push({
        id: "register-tool",
        outcome: "Plugin tool can be called",
        decision: "covered",
        candidates: ["package:fixture"],
        destinations: [
            { output: "references/api-tools.md", section: "Tool contract" },
        ],
    });
    writeFileSync(coveragePath, `${JSON.stringify(coverage, null, 4)}\n`);
    write(join(fixture.skillSourcePath, "indexes/routing.md"), "# Routing\n");
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /is not routed to references\/api-tools.md/,
    );
});

test("featured task entry must link directly to its exact recipe", (t) => {
    const task = {
        id: "register-tool",
        outcome: "Plugin tool can be called",
        decision: "covered",
        candidates: ["package:fixture"],
        apiObjects: ["fixture"],
        destinations: [
            { output: "references/how-to.md", section: "Complete task" },
        ],
        entry: {
            output: "references/how-to.md",
            section: "Complete task",
            anchor: "complete-task",
        },
    };
    const fixture = createFixture(t, {
        schemaVersion: 3,
        taskPaths: [task],
        taskDiscoveries: [
            {
                candidate: "task:docs/how-to.md:1",
                decision: "included",
                taskId: "register-tool",
            },
        ],
    });
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /not linked directly from SKILL.md/,
    );
    write(
        join(fixture.skillSourcePath, "entrypoint/SKILL.md"),
        "---\nname: dsh-plugin-development\ndescription: Fixture Skill\n---\n# @deepseek-ai/dsh-agent@9.9.9-rc.9\n\n`[Register a tool](references/how-to.md#complete-task)`\n",
    );
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /not linked directly from SKILL.md/,
    );
    const coveragePath = join(fixture.skillSourcePath, "coverage.json");
    const coverage = JSON.parse(readFileSync(coveragePath, "utf8"));
    coverage.taskPaths[0].entry.anchor = "missing-task";
    writeFileSync(coveragePath, `${JSON.stringify(coverage, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /entry anchor does not identify its non-empty section/,
    );
    write(
        join(fixture.skillSourcePath, "how-to/example.md"),
        "# How-to\n\n## Complete task\n\nBuild and load the plugin.\n\n## Another task\n\nThis is a different task.\n",
    );
    coverage.taskPaths[0].entry.anchor = "another-task";
    writeFileSync(coveragePath, `${JSON.stringify(coverage, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /entry anchor does not identify its non-empty section/,
    );
    coverage.taskPaths[0].entry.anchor = "complete-task";
    writeFileSync(coveragePath, `${JSON.stringify(coverage, null, 4)}\n`);
    write(
        join(fixture.skillSourcePath, "entrypoint/SKILL.md"),
        "---\nname: dsh-plugin-development\ndescription: Fixture Skill\n---\n# @deepseek-ai/dsh-agent@9.9.9-rc.9\n\n```md\n[Register a tool](references/how-to.md#complete-task)\n```\n",
    );
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /not linked directly from SKILL.md/,
    );
    write(
        join(fixture.skillSourcePath, "entrypoint/SKILL.md"),
        "---\nname: dsh-plugin-development\ndescription: Fixture Skill\n---\n# @deepseek-ai/dsh-agent@9.9.9-rc.9\n\n[Register a tool](references/how-to.md#complete-task)\n",
    );
    assert.doesNotThrow(() =>
        validateSkillSource(fixture.targetPath, { freeze: true }),
    );
    assert.doesNotThrow(() => buildSkill(fixture.targetPath));
});

test("schema v3 freezes only with complete API and task candidate dispositions", (t) => {
    const task = {
        id: "register-tool",
        outcome: "Plugin tool can be called",
        decision: "covered",
        candidates: ["package:fixture"],
        apiObjects: ["fixture"],
        destinations: [
            { output: "references/how-to.md", section: "Complete task" },
        ],
    };
    const fixture = createFixture(t, {
        schemaVersion: 3,
        taskPaths: [task],
        taskDiscoveries: [
            {
                candidate: "task:docs/how-to.md:1",
                decision: "included",
                taskId: "register-tool",
            },
        ],
    });
    assert.doesNotThrow(() =>
        validateSkillSource(fixture.targetPath, { freeze: true }),
    );
    const apiPath = join(fixture.skillSourcePath, "api-surface.json");
    const surface = JSON.parse(readFileSync(apiPath, "utf8"));
    surface.objects[0].members = [];
    writeFileSync(apiPath, `${JSON.stringify(surface, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath),
        /Frozen source hash mismatch: apiSurfaceSha256/,
    );
});

test("schema v3 rejects a missing public member before freeze", (t) => {
    const fixture = createFixture(t, {
        schemaVersion: 3,
        taskPaths: [
            {
                id: "register-tool",
                outcome: "Plugin tool can be called",
                decision: "covered",
                candidates: ["package:fixture"],
                apiObjects: ["fixture"],
                destinations: [
                    {
                        output: "references/how-to.md",
                        section: "Complete task",
                    },
                ],
            },
        ],
        taskDiscoveries: [
            {
                candidate: "task:docs/how-to.md:1",
                decision: "included",
                taskId: "register-tool",
            },
        ],
    });
    const path = join(fixture.skillSourcePath, "api-surface.json");
    const surface = JSON.parse(readFileSync(path, "utf8"));
    surface.objects[0].members = [];
    writeFileSync(path, `${JSON.stringify(surface, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /Public API member lacks a disposition/,
    );
});

test("schema v3 rejects missing how-to task disposition", (t) => {
    const fixture = createFixture(t, {
        schemaVersion: 3,
        taskPaths: [
            {
                id: "register-tool",
                outcome: "Plugin tool can be called",
                decision: "covered",
                candidates: ["package:fixture"],
                apiObjects: ["fixture"],
                destinations: [
                    {
                        output: "references/how-to.md",
                        section: "Complete task",
                    },
                ],
            },
        ],
    });
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /Task candidates lack a disposition/,
    );
});

test("schema v3 rejects published deprecated members", (t) => {
    const fixture = createFixture(t, {
        schemaVersion: 3,
        taskPaths: [
            {
                id: "register-tool",
                outcome: "Plugin tool can be called",
                decision: "covered",
                candidates: ["package:fixture"],
                apiObjects: ["fixture"],
                destinations: [
                    {
                        output: "references/how-to.md",
                        section: "Complete task",
                    },
                ],
            },
        ],
        taskDiscoveries: [
            {
                candidate: "task:docs/how-to.md:1",
                decision: "included",
                taskId: "register-tool",
            },
        ],
    });
    const path = join(
        fixture.targetPath,
        "evidence",
        "api-symbol-candidates.json",
    );
    const symbols = JSON.parse(readFileSync(path, "utf8"));
    symbols.entries[0].symbols[0].members[0].deprecated = true;
    writeFileSync(path, `${JSON.stringify(symbols, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /Deprecated API member must be excluded/,
    );
});

test("schema v3 checks signatures and permits sourced module augmentations", (t) => {
    const task = {
        id: "register-tool",
        outcome: "Plugin tool can be called",
        decision: "covered",
        candidates: ["package:fixture"],
        apiObjects: ["fixture"],
        destinations: [
            { output: "references/how-to.md", section: "Complete task" },
        ],
    };
    const fixture = createFixture(t, {
        schemaVersion: 3,
        taskPaths: [task],
        taskDiscoveries: [
            {
                candidate: "task:docs/how-to.md:1",
                decision: "included",
                taskId: "register-tool",
            },
        ],
    });
    const path = join(fixture.skillSourcePath, "api-surface.json");
    const surface = JSON.parse(readFileSync(path, "utf8"));
    surface.objects[0].members[0].signature = "wrong";
    writeFileSync(path, `${JSON.stringify(surface, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /member signature differs/,
    );
    surface.objects[0].members[0].signature = "() => void";
    surface.objects.push({
        id: "context-fixture",
        entry: "export:@deepseek-ai/dsh-fixture:.",
        symbol: "Context.fixture",
        signature: "Fixture",
        source: "proof.ts",
        origin: "module-augmentation",
        decision: "included",
        owner: "references/api-tools.md",
        section: "Tool contract",
        members: [],
    });
    writeFileSync(path, `${JSON.stringify(surface, null, 4)}\n`);
    write(
        join(fixture.skillSourcePath, "api-guardrails/tools.md"),
        "# API\n\n## Tool contract\n\nFixture.run and Context.fixture are available.\n",
    );
    assert.doesNotThrow(() =>
        validateSkillSource(fixture.targetPath, { freeze: true }),
    );
});

test("schema v3 sends multi-object tasks to a how-to", (t) => {
    const fixture = createFixture(t, {
        schemaVersion: 3,
        taskPaths: [
            {
                id: "register-tool",
                outcome: "Plugin tool can be called",
                decision: "covered",
                candidates: ["package:fixture"],
                apiObjects: ["fixture", "second"],
                compositionSteps: ["Create Fixture", "Use Second"],
                destinations: [
                    {
                        output: "references/api-tools.md",
                        section: "Tool contract",
                    },
                ],
            },
        ],
        taskDiscoveries: [
            {
                candidate: "task:docs/how-to.md:1",
                decision: "included",
                taskId: "register-tool",
            },
        ],
    });
    const symbolsPath = join(
        fixture.targetPath,
        "evidence",
        "api-symbol-candidates.json",
    );
    const symbols = JSON.parse(readFileSync(symbolsPath, "utf8"));
    symbols.entries[0].symbols.push({
        name: "Second",
        signature: "Second",
        source: "proof.ts",
        members: [],
    });
    writeFileSync(symbolsPath, `${JSON.stringify(symbols, null, 4)}\n`);
    const surfacePath = join(fixture.skillSourcePath, "api-surface.json");
    const surface = JSON.parse(readFileSync(surfacePath, "utf8"));
    surface.objects.push({
        id: "second",
        entry: "export:@deepseek-ai/dsh-fixture:.",
        symbol: "Second",
        signature: "Second",
        source: "proof.ts",
        decision: "included",
        owner: "references/api-tools.md",
        section: "Tool contract",
        members: [],
    });
    writeFileSync(surfacePath, `${JSON.stringify(surface, null, 4)}\n`);
    write(
        join(fixture.skillSourcePath, "api-guardrails/tools.md"),
        "# API\n\n## Tool contract\n\nFixture.run and Second are available.\n",
    );
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /multi-object task must route to a HOW-TO/,
    );
});

test("frozen coverage ledger cannot change before build", (t) => {
    const fixture = createFixture(t);
    validateSkillSource(fixture.targetPath, { freeze: true });
    const coveragePath = join(fixture.skillSourcePath, "coverage.json");
    const coverage = JSON.parse(readFileSync(coveragePath, "utf8"));
    coverage.dispositions[0].summary = "Changed after freeze";
    writeFileSync(coveragePath, `${JSON.stringify(coverage, null, 4)}\n`);
    assert.throws(
        () => buildSkill(fixture.targetPath),
        /Frozen source hash mismatch: coverageSha256/,
    );
});

test("generated Skill accepts valid same-document anchors", (t) => {
    const fixture = createFixture(t);
    validateSkillSource(fixture.targetPath, { freeze: true });
    assert.doesNotThrow(() => buildSkill(fixture.targetPath));
});

test("generated Skill rejects the target commit in distributed text", (t) => {
    const fixture = createFixture(t);
    const provenance = JSON.parse(
        readFileSync(join(fixture.targetPath, "provenance.json"), "utf8"),
    );
    write(
        join(fixture.skillSourcePath, "maintenance/source-map.md"),
        `# Source map\n\n@deepseek-ai/dsh-agent@9.9.9-rc.9, commit ${provenance.commit}\n`,
    );
    validateSkillSource(fixture.targetPath, { freeze: true });
    assert.throws(
        () => buildSkill(fixture.targetPath),
        /target commit must stay in build evidence/,
    );
});

test("generated Skill keeps coverage status and private ledgers out of prose", (t) => {
    const fixture = createFixture(t);
    write(
        join(fixture.skillSourcePath, "maintenance/source-map.md"),
        "# Source map\n\n@deepseek-ai/dsh-agent@9.9.9-rc.9\n\n本次创建的浏览器检查为 Not Covered；见 `coverage.json`。\n",
    );
    validateSkillSource(fixture.targetPath, { freeze: true });
    assert.throws(
        () => buildSkill(fixture.targetPath),
        /creation or validation status belongs in build evidence/,
    );
});

test("all UTF-8 text assets receive offline-boundary checks", (t) => {
    const fixture = createFixture(t, {
        extraFiles: [
            {
                source: "assets/note.txt",
                output: "assets/note.txt",
                kind: "asset",
                content: "https://example.invalid\n",
            },
        ],
    });
    validateSkillSource(fixture.targetPath, { freeze: true });
    assert.throws(
        () => buildSkill(fixture.targetPath),
        /offline or local-path boundary violation/,
    );
});

test("Markdown example endpoints remain offline reference data", (t) => {
    const fixture = createFixture(t, {
        entrypoint:
            "---\nname: dsh-plugin-development\ndescription: Fixture Skill\n---\n# @deepseek-ai/dsh-agent@9.9.9-rc.9\n\n[Section](#section)\n\n## Section\n`https://example.invalid`\n```ts\nconst endpoint = 'http://127.0.0.1:9'\n```\n",
    });
    validateSkillSource(fixture.targetPath, { freeze: true });
    assert.doesNotThrow(() => buildSkill(fixture.targetPath));
});

test("generated Skill requires structured frontmatter and metadata", async (t) => {
    await t.test("frontmatter description is required", (child) => {
        const fixture = createFixture(child, {
            entrypoint:
                "---\nname: dsh-plugin-development\n---\n# @deepseek-ai/dsh-agent@9.9.9-rc.9\n",
        });
        validateSkillSource(fixture.targetPath, { freeze: true });
        assert.throws(() => buildSkill(fixture.targetPath), /description/);
    });
    await t.test("commented metadata fields do not count", (child) => {
        const fixture = createFixture(child, {
            metadata:
                "# interface:\n#     display_name: Fixture\n#     short_description: Fixture\n#     default_prompt: Fixture\n",
        });
        validateSkillSource(fixture.targetPath, { freeze: true });
        assert.throws(() => buildSkill(fixture.targetPath), /interface/);
    });
    await t.test("metadata fields must be strings", (child) => {
        const fixture = createFixture(child, {
            metadata:
                "interface:\n    display_name: 123\n    short_description: Fixture\n    default_prompt: Fixture\n",
        });
        validateSkillSource(fixture.targetPath, { freeze: true });
        assert.throws(() => buildSkill(fixture.targetPath), /display_name/);
    });
});

test("backup cleanup failure is reported after a committed replacement", (t) => {
    const root = mkdtempSync(join(tmpdir(), "create-dsh-replace-test-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const generated = join(root, "generated-skill");
    const formal = join(root, "dsh-plugin-development");
    write(join(generated, "value.txt"), "new\n");
    write(join(formal, "value.txt"), "old\n");
    const result = installGeneratedSkill(
        generated,
        formal,
        { files: 1 },
        {
            remove(path, options) {
                if (
                    path.includes("-replace-") &&
                    existsSync(join(path, "old"))
                ) {
                    throw new Error("simulated cleanup failure");
                }
                rmSync(path, options);
            },
        },
    );
    assert.equal(readFileSync(join(formal, "value.txt"), "utf8"), "new\n");
    assert.equal(result.replaced, true);
    assert.match(result.cleanupWarning, /Replacement committed/);
    assert.equal(
        readFileSync(join(result.backupPath, "value.txt"), "utf8"),
        "old\n",
    );
});

test("replacement creates a missing formal Skill parent", (t) => {
    const root = mkdtempSync(join(tmpdir(), "create-dsh-first-replace-test-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const generated = join(root, "generated-skill");
    const formal = join(root, "skills", "dsh-plugin-development");
    write(join(generated, "value.txt"), "new\n");

    const result = installGeneratedSkill(generated, formal, { files: 1 });

    assert.equal(result.replaced, true);
    assert.equal(readFileSync(join(formal, "value.txt"), "utf8"), "new\n");
});

test("replacement leaves a preexisting PID-style staging path untouched", (t) => {
    const root = mkdtempSync(join(tmpdir(), "create-dsh-collision-test-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const generated = join(root, "generated-skill");
    const formal = join(root, "dsh-plugin-development");
    const preexisting = join(root, ".dsh-plugin-development-new-123");
    write(join(generated, "value.txt"), "new\n");
    write(join(formal, "value.txt"), "old\n");
    write(join(preexisting, "keep.txt"), "user-data\n");
    installGeneratedSkill(generated, formal, { files: 1 });
    assert.equal(
        readFileSync(join(preexisting, "keep.txt"), "utf8"),
        "user-data\n",
    );
    assert.equal(readFileSync(join(formal, "value.txt"), "utf8"), "new\n");
});

test("prepared deletion is replaceable but remaining files are protected", (t) => {
    const root = mkdtempSync(join(tmpdir(), "create-dsh-deletion-test-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const formal = join(root, "skills", "dsh-plugin-development");
    write(join(formal, "SKILL.md"), "old\n");
    write(join(root, ".gitignore"), "ignored.txt\n");
    execFileSync("git", ["init", "-q"], { cwd: root });
    execFileSync("git", ["add", "."], { cwd: root });
    execFileSync(
        "git",
        [
            "-c",
            "user.name=Skill Test",
            "-c",
            "user.email=skill-test@example.invalid",
            "commit",
            "-qm",
            "fixture",
        ],
        { cwd: root },
    );
    rmSync(join(formal, "SKILL.md"));
    assert.doesNotThrow(() => assertReplaceableFormalSkill(root, formal));
    write(join(formal, "ignored.txt"), "keep\n");
    assert.throws(
        () => assertReplaceableFormalSkill(root, formal),
        /preserve them/,
    );
});

test("generated navigation routes a featured task to its own exact section", (t) => {
    const task = {
        id: "register-tool",
        outcome: "Plugin tool can be called",
        userIntents: ["Register a callable tool"],
        decision: "covered",
        candidates: ["package:fixture"],
        apiObjects: ["fixture"],
        destinations: [
            { output: "references/how-to.md", section: "Complete task" },
        ],
        entry: {
            output: "references/how-to.md",
            section: "Complete task",
            anchor: "complete-task",
        },
    };
    const fixture = createFixture(t, {
        schemaVersion: 3,
        taskNavigation: "generated",
        taskPaths: [task],
        taskDiscoveries: [
            {
                candidate: "task:docs/how-to.md:1",
                decision: "included",
                taskId: "register-tool",
            },
        ],
        entrypoint:
            "---\nname: dsh-plugin-development\ndescription: Fixture Skill\n---\n# @deepseek-ai/dsh-agent@9.9.9-rc.9\n\n<!-- BEGIN GENERATED TASK NAVIGATION -->\n<!-- END GENERATED TASK NAVIGATION -->\n",
        routing:
            "# Routing\n\n[Tool contract](api-tools.md)\n[How-to](how-to.md)\n\n<!-- BEGIN GENERATED TASK NAVIGATION -->\n<!-- END GENERATED TASK NAVIGATION -->\n",
    });
    const scenarioPath = join(
        fixture.targetPath,
        "evidence/task-scenarios.json",
    );
    const scriptPath = join(
        fixture.targetPath,
        "evidence/scenarios/register-tool.mjs",
    );
    write(
        scenarioPath,
        `${JSON.stringify({
            schemaVersion: 1,
            scenarios: [
                {
                    taskId: "register-tool",
                    script: "scenarios/register-tool.mjs",
                    checks: ["profile-load", "tool-call"],
                },
            ],
        })}\n`,
    );
    write(
        scriptPath,
        'console.log(JSON.stringify({taskId:"register-tool",checks:{"profile-load":true,"tool-call":true}}));\n',
    );
    syncTaskNavigation(fixture.targetPath);
    const entrypoint = readFileSync(
        join(fixture.skillSourcePath, "entrypoint/SKILL.md"),
        "utf8",
    );
    assert.match(
        entrypoint,
        /Register a callable tool.*references\/how-to\.md#complete-task/,
    );
    validateSkillSource(fixture.targetPath, { freeze: true });
    buildSkill(fixture.targetPath);
    assert.equal(verifyTaskScenarios(fixture.targetPath).passed.length, 1);
    write(
        scriptPath,
        'console.log(JSON.stringify({taskId:"register-tool",checks:{"profile-load":true,"tool-call":false}}));\n',
    );
    assert.throws(
        () => verifyTaskScenarios(fixture.targetPath),
        /hash mismatch/,
    );
    const manifestPath = join(fixture.skillSourcePath, "manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    manifest.status = "draft";
    write(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
    validateSkillSource(fixture.targetPath, { freeze: true });
    assert.throws(
        () => verifyTaskScenarios(fixture.targetPath),
        /did not pass tool-call/,
    );
});

test("generated navigation rejects a generic section shared by two tasks", (t) => {
    const fixture = createFixture(t);
    const destination = {
        output: "references/how-to.md",
        section: "Complete task",
    };
    assert.throws(
        () =>
            renderTaskNavigation(
                {
                    taskPaths: [
                        {
                            id: "one",
                            decision: "covered",
                            outcome: "First outcome",
                            destinations: [destination],
                            entry: { ...destination, anchor: "complete-task" },
                            userIntents: ["First intent"],
                        },
                        {
                            id: "two",
                            decision: "covered",
                            outcome: "Second outcome",
                            destinations: [destination],
                        },
                    ],
                },
                [
                    {
                        source: "how-to/example.md",
                        output: "references/how-to.md",
                    },
                ],
                fixture.skillSourcePath,
                {
                    entrypoint:
                        "<!-- BEGIN GENERATED TASK NAVIGATION -->\n<!-- END GENERATED TASK NAVIGATION -->",
                    routing:
                        "<!-- BEGIN GENERATED TASK NAVIGATION -->\n<!-- END GENERATED TASK NAVIGATION -->",
                },
            ),
        /shares the same destination section/,
    );
});

test("failed rebuild preserves previously generated output", (t) => {
    const fixture = createFixture(t);
    validateSkillSource(fixture.targetPath, { freeze: true });
    buildSkill(fixture.targetPath);
    const generatedEntry = join(fixture.targetPath, "generated-skill/SKILL.md");
    const previous = readFileSync(generatedEntry, "utf8");
    const sourceEntry = join(fixture.skillSourcePath, "entrypoint/SKILL.md");
    write(sourceEntry, `${previous}\nhttps://example.invalid\n`);
    const manifestPath = join(fixture.skillSourcePath, "manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    manifest.status = "draft";
    write(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
    validateSkillSource(fixture.targetPath, { freeze: true });
    assert.throws(
        () => buildSkill(fixture.targetPath),
        /offline or local-path boundary violation/,
    );
    assert.equal(readFileSync(generatedEntry, "utf8"), previous);
});

test("replacement digest permits repeat only while the prior output is intact", (t) => {
    const root = mkdtempSync(join(tmpdir(), "create-dsh-repeat-test-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const formal = join(root, "skills/dsh-plugin-development");
    const generated = join(root, "generated-skill");
    write(formal + "/SKILL.md", "old\n");
    write(generated + "/SKILL.md", "new\n");
    execFileSync("git", ["init", "-q"], { cwd: root });
    execFileSync("git", ["add", "."], { cwd: root });
    execFileSync(
        "git",
        [
            "-c",
            "user.name=Skill Test",
            "-c",
            "user.email=skill-test@example.invalid",
            "commit",
            "-qm",
            "fixture",
        ],
        { cwd: root },
    );
    const result = installGeneratedSkill(generated, formal, { files: 1 });
    assert.throws(
        () => assertReplaceableFormalSkill(root, formal),
        /preserve them/,
    );
    assert.doesNotThrow(() =>
        assertReplaceableFormalSkill(root, formal, result.installedDigest),
    );
    write(formal + "/SKILL.md", "user edit\n");
    assert.throws(
        () =>
            assertReplaceableFormalSkill(root, formal, result.installedDigest),
        /preserve them/,
    );
});
