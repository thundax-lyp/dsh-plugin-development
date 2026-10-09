import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { buildSkill } from "../scripts/build-dsh-plugin-development-skill.mjs";
import { loadTarget } from "../scripts/skill-build-contract.mjs";
import { validateSkillSource } from "../scripts/validate-skill-source.mjs";
import { createFixture, write } from "./fixture.mjs";

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
