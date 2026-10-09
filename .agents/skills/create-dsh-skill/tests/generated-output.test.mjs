import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { buildSkill } from "../scripts/build-dsh-plugin-development-skill.mjs";
import { validateSkillSource } from "../scripts/validate-skill-source.mjs";
import { createFixture, write } from "./fixture.mjs";

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
