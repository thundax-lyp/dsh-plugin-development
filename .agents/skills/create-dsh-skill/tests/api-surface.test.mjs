import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { buildSkill } from "../scripts/build-dsh-plugin-development-skill.mjs";
import { validateSkillSource } from "../scripts/validate-skill-source.mjs";
import { createFixture, write } from "./fixture.mjs";

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
