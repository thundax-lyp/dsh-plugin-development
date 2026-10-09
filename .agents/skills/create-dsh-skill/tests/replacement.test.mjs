import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
    assertReplaceableFormalSkill,
    installGeneratedSkill,
} from "../scripts/replace-generated-skill.mjs";
import { createFixture, write } from "./fixture.mjs";

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
