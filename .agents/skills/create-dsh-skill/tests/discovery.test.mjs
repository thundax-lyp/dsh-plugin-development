import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
    buildApiEntryCandidates,
    buildCapabilityCandidates,
    buildTaskCandidates,
} from "../scripts/inventory-dsh-surface.mjs";
import { discoverPublicApiMembers } from "../scripts/discover-public-api-members.mjs";
import {
    buildApiSurfaceCandidates,
    buildCoverageWorkQueue,
    initializeCoverage,
} from "../scripts/initialize-capability-coverage.mjs";
import { resolvePublishedVersion } from "../scripts/resolve-dsh-agent-version.mjs";
import { createFixture, write } from "./fixture.mjs";

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

test("API surface candidates are reproducible from discovery data", () => {
    const entries = {
        candidates: [{ id: "export:z" }, { id: "export:a" }],
    };
    const symbols = {
        entries: [
            {
                entry: "export:z",
                source: "z.ts",
                symbols: [
                    {
                        name: "Z",
                        signature: "Z",
                        source: "z.ts",
                        members: [
                            { name: "later", signature: "string" },
                            { name: "earlier", signature: "number" },
                        ],
                    },
                ],
            },
            {
                entry: "export:a",
                source: "a.ts",
                symbols: [{ name: "A", signature: "A", members: [] }],
            },
        ],
    };
    const expected = buildApiSurfaceCandidates(entries, symbols);
    assert.deepEqual(
        expected.entries.map((entry) => entry.candidate),
        ["export:a", "export:z"],
    );
    assert.deepEqual(
        expected.objects.map((object) => object.id),
        ["export:a:A", "export:z:Z"],
    );
    assert.deepEqual(
        expected.objects[1].members.map((member) => member.name),
        ["earlier", "later"],
    );
    assert.deepEqual(
        buildApiSurfaceCandidates(
            { candidates: [...entries.candidates].reverse() },
            { entries: [...symbols.entries].reverse() },
        ),
        expected,
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
