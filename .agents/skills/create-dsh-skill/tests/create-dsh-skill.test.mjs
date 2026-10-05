import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
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
import { installGeneratedSkill } from "../scripts/replace-generated-skill.mjs";
import { loadTarget } from "../scripts/skill-build-contract.mjs";
import { validateSkillSource } from "../scripts/validate-skill-source.mjs";

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
    write(join(checkoutPath, "proof.ts"), "export const proof = true;\n");
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

    const sourceFiles = [
        {
            source: "entrypoint/SKILL.md",
            output: "SKILL.md",
            kind: "entrypoint",
            content:
                options.entrypoint ??
                "---\nname: dsh-plugin-development\ndescription: Fixture Skill\n---\n# dsh-v9.9.9-rc.9\n\n[Section](#section)\n\n## Section\n",
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
            content: "# Routing\n",
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
            content: "# API\n",
        },
        {
            source: "how-to/example.md",
            output: "references/how-to.md",
            kind: "how-to",
            content: "# How-to\n",
        },
        {
            source: "maintenance/source-map.md",
            output: "maintenance/source-map.md",
            kind: "maintenance",
            content: `# Source map\n\ndsh-v9.9.9-rc.9 ${commit}\n`,
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
                schemaVersion: 1,
                ...identity,
                status: "draft",
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
    return { targetPath, checkoutPath, skillSourcePath };
}

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

test("generated Skill accepts valid same-document anchors", (t) => {
    const fixture = createFixture(t);
    validateSkillSource(fixture.targetPath, { freeze: true });
    assert.doesNotThrow(() => buildSkill(fixture.targetPath));
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

test("generated Skill requires structured frontmatter and metadata", async (t) => {
    await t.test("frontmatter description is required", (child) => {
        const fixture = createFixture(child, {
            entrypoint:
                "---\nname: dsh-plugin-development\n---\n# dsh-v9.9.9-rc.9\n",
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
            processId: "fixture",
            remove(path, options) {
                if (path.includes("-old-fixture")) {
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
