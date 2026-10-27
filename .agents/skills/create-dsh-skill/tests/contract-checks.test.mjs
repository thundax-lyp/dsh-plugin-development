import assert from "node:assert/strict";
import {
    mkdtempSync,
    mkdirSync,
    writeFileSync,
    rmSync,
    readFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
    loadContractChecks,
    assertContractText,
    runContractExamples,
} from "../scripts/contract-checks.mjs";
import { validateSkillSource } from "../scripts/validate-skill-source.mjs";
import { createFixture, write } from "./fixture.mjs";

function setup(t) {
    const root = mkdtempSync(join(tmpdir(), "dsh-contract-checks-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const evidencePath = join(root, "evidence");
    const skillPath = join(root, "generated");
    mkdirSync(evidencePath);
    mkdirSync(skillPath);
    const target = {
        evidencePath,
        manifest: {
            status: "draft",
            files: [{ output: "references/example.md", kind: "example" }],
        },
        checkoutPath: root,
    };
    const data = {
        schemaVersion: 1,
        assertions: [],
        examples: [
            {
                id: "compile",
                outputs: ["references/example.md"],
                script: "compile.mjs",
                args: ["{example}"],
                timeoutMs: 10000,
            },
        ],
    };
    write(join(skillPath, "references/example.md"), "generated input");
    write(
        join(evidencePath, "compile.mjs"),
        `import assert from 'node:assert/strict';import{readFileSync}from'node:fs';assert.equal(readFileSync(process.argv[2],'utf8'),'generated input');console.log(JSON.stringify({hostBlocks:1,clientBlocks:0,checks:{compiled:true}}));`,
    );
    write(join(evidencePath, "contract-checks.json"), JSON.stringify(data));
    return { root, target, data, skillPath };
}

test("contract assertions preserve indexed access and reject explicit fallbacks", () => {
    const checks = {
        assertions: [
            {
                id: "register",
                output: "api.md",
                section: "Registry",
                includes: ["SlotCore['register']"],
                excludes: ["readonly register: SlotCore;"],
            },
        ],
    };
    assert.doesNotThrow(() =>
        assertContractText(
            checks,
            () =>
                "# API\n## Registry\n```text\nreadonly register: SlotCore['register'];\n```\n",
        ),
    );
    assert.throws(
        () =>
            assertContractText(
                checks,
                () => "## Registry\nreadonly register: SlotCore;",
            ),
        /Contract content missing/,
    );
    assert.throws(
        () =>
            assertContractText(
                checks,
                () =>
                    "## Registry\nSlotCore['register']\nreadonly register: SlotCore;",
            ),
        /content regressed/,
    );
});

test("example validators read the explicitly selected generated file", (t) => {
    const { target, skillPath } = setup(t);
    Object.assign(target.manifest, loadContractChecks(target).hashes, {
        status: "frozen",
    });
    assert.equal(
        runContractExamples(target, skillPath)[0].checks.compiled,
        true,
    );
    write(join(skillPath, "references/example.md"), "wrong generated input");
    assert.throws(
        () => runContractExamples(target, skillPath),
        /Example check failed/,
    );
});

test("frozen example script and auxiliary inputs cannot silently drift", (t) => {
    const { target, data, skillPath } = setup(t);
    write(join(target.evidencePath, "input.json"), "{}");
    data.examples[0].inputs = ["input.json"];
    write(
        join(target.evidencePath, "contract-checks.json"),
        JSON.stringify(data),
    );
    Object.assign(target.manifest, loadContractChecks(target).hashes, {
        status: "frozen",
    });
    write(join(target.evidencePath, "input.json"), '{"changed":true}');
    assert.throws(
        () => runContractExamples(target, skillPath),
        /contractInputsSha256/,
    );
});

test("a validator boolean failure is rejected", (t) => {
    const { target, skillPath } = setup(t);
    write(
        join(target.evidencePath, "compile.mjs"),
        "console.log(JSON.stringify({hostBlocks:1,clientBlocks:0,checks:{compiled:false}}))",
    );
    Object.assign(target.manifest, loadContractChecks(target).hashes, {
        status: "frozen",
    });
    assert.throws(
        () => runContractExamples(target, skillPath),
        /Example assertions failed/,
    );
});

test("contract validator rejects path escapes and non-example outputs", (t) => {
    const { target, data } = setup(t);
    data.examples[0].script = "../outside.mjs";
    write(
        join(target.evidencePath, "contract-checks.json"),
        JSON.stringify(data),
    );
    assert.throws(
        () => loadContractChecks(target),
        /relative|escape|inside|traversal/i,
    );
    data.examples[0].script = "compile.mjs";
    data.examples[0].outputs = ["SKILL.md"];
    write(
        join(target.evidencePath, "contract-checks.json"),
        JSON.stringify(data),
    );
    assert.throws(() => loadContractChecks(target), /mapped example/);
});

test("freeze locks contract inventory and cannot lose it later", (t) => {
    const fixture = createFixture(t);
    const path = join(fixture.targetPath, "evidence/contract-checks.json");
    write(
        path,
        JSON.stringify({
            schemaVersion: 1,
            assertions: [
                {
                    id: "fixture",
                    output: "references/api-tools.md",
                    includes: ["Fixture.run"],
                },
            ],
            examples: [],
        }),
    );
    validateSkillSource(fixture.targetPath, { freeze: true });
    const manifest = JSON.parse(
        readFileSync(join(fixture.skillSourcePath, "manifest.json")),
    );
    assert.equal(manifest.contractChecksSha256.length, 64);
    rmSync(path);
    assert.throws(
        () => validateSkillSource(fixture.targetPath),
        /contract checks are missing/,
    );
});

test("fenced API members count as owned content without accepting fenced headings", async (t) => {
    const { markdownSectionWithCode } =
        await import("../scripts/markdown-structure.mjs");
    const body =
        "## API\n```text\n## not a Markdown heading\nexport interface Fixture { run(): void }\n```\n## Other\nrun is elsewhere\n";
    assert(
        markdownSectionWithCode(body, "API").content.includes("run(): void"),
    );
    assert.equal(
        markdownSectionWithCode(body, "not a Markdown heading"),
        undefined,
    );
    assert(
        !markdownSectionWithCode(body, "API").content.includes(
            "run is elsewhere",
        ),
    );
    const fixture = createFixture(t, {
        schemaVersion: 3,
        taskPaths: [
            {
                id: "register-tool",
                outcome: "Call tool",
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
    write(
        join(fixture.skillSourcePath, "api-guardrails/tools.md"),
        "# API\n## Tool contract\n```text\nexport interface Fixture { run(): void }\n```\n",
    );
    assert.doesNotThrow(() =>
        validateSkillSource(fixture.targetPath, { freeze: true }),
    );
});
