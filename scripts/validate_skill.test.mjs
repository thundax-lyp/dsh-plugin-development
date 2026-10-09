import assert from "node:assert/strict";
import { spawnSync, execFileSync } from "node:child_process";
import {
    copyFileSync,
    mkdirSync,
    mkdtempSync,
    rmSync,
    unlinkSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const checker = fileURLToPath(new URL("./validate_skill.mjs", import.meta.url));

function write(path, content) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
}

function fixture(t) {
    const root = mkdtempSync(join(tmpdir(), "dsh-markdown-test-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    execFileSync("git", ["init", "-q", root]);
    const script = join(root, "scripts/validate_skill.mjs");
    mkdirSync(dirname(script), { recursive: true });
    copyFileSync(checker, script);
    const refs = join(root, "skills/dsh-plugin-development/references");
    write(join(refs, "../maintenance/source-map.md"), "# Evidence\n");
    write(join(root, ".gitignore"), "/tmp/\n");
    write(
        join(root, "tmp/ignored.md"),
        "[broken](missing.md)\n```json\ninvalid\n```\n",
    );
    return {
        root,
        refs,
        run(...args) {
            const env = { ...process.env };
            delete env.NODE_TEST_CONTEXT;
            return spawnSync(process.execPath, [script, ...args], {
                cwd: root,
                encoding: "utf8",
                env,
            });
        },
    };
}

test("Unicode duplicate headings and cross-file links", (t) => {
    const { root, refs, run } = fixture(t);
    write(
        join(refs, "topic.md"),
        "# 接口\n## 清理\n## 清理\n[重复](#清理-1)\n",
    );
    write(
        join(root, "README.md"),
        "[入口](skills/dsh-plugin-development/references/topic.md#%E6%B8%85%E7%90%86)\n",
    );
    const result = run();
    assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("missing same-file anchor fails", (t) => {
    const { refs, run } = fixture(t);
    write(join(refs, "topic.md"), "# 接口\n[错误](#不存在)\n");
    const result = run();
    assert.notEqual(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /missing anchor/);
});

test("missing cross-file anchor after rename fails", (t) => {
    const { root, refs, run } = fixture(t);
    write(join(refs, "topic.md"), "# 新标题\n");
    write(
        join(root, "README.md"),
        "[旧入口](skills/dsh-plugin-development/references/topic.md#旧标题)\n",
    );
    const result = run();
    assert.notEqual(result.status, 0);
    assert.match(result.stdout, /missing anchor/);
});

test("offline boundary in Skill source fails", (t) => {
    const { refs, run } = fixture(t);
    write(join(refs, "topic.md"), "# Reference\nhttps://example.com\n");
    const result = run();
    assert.notEqual(result.status, 0);
    assert.match(result.stdout, /offline\/local-path violation/);
});

test("example endpoint remains offline reference data", (t) => {
    const { refs, run } = fixture(t);
    write(
        join(refs, "topic.md"),
        '# Reference\n`https://example.invalid`\n```ts\nconst endpoint = "http://127.0.0.1:9"\n```\n',
    );
    const result = run();
    assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("invalid JSON code fence fails", (t) => {
    const { refs, run } = fixture(t);
    write(join(refs, "topic.md"), '# 示例\n```json\n{"broken":}\n```\n');
    const result = run();
    assert.notEqual(result.status, 0);
    assert.match(result.stdout, /JSON/);
});

test("build workspace links are validated by the build verifier", (t) => {
    const { root, run } = fixture(t);
    write(
        join(
            root,
            ".dsh-skill-build/targets/v/skill-source/entrypoint/SKILL.md",
        ),
        "[output-relative](references/topic.md)\n",
    );
    const result = run();
    assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("explicit generated Skill is checked without the formal Skill", (t) => {
    const { root, refs, run } = fixture(t);
    const generated = join(root, ".dsh-skill-build/targets/v/generated-skill");
    write(join(generated, "SKILL.md"), "[topic](references/topic.md#entry)\n");
    write(join(generated, "references/topic.md"), "# Entry\n");
    write(join(generated, "maintenance/source-map.md"), "# Evidence\n");
    write(join(refs, "topic.md"), "[broken](missing.md)\n");
    const first = run("--skill", generated);
    assert.equal(first.status, 0, first.stdout + first.stderr);
    write(join(generated, "references/topic.md"), "# Changed\n");
    const second = run("--skill", generated);
    assert.notEqual(second.status, 0);
    assert.match(second.stdout, /missing anchor/);
});

test("DSH source validation requires a generated source map", (t) => {
    const { root, refs, run } = fixture(t);
    unlinkSync(join(refs, "../maintenance/source-map.md"));
    const result = run("--dsh", root);
    assert.notEqual(result.status, 0);
    assert.match(result.stdout, /cannot validate DSH checkout/);
});

test("exact DSH tag and source-map paths are checked", (t) => {
    const { root, refs, run } = fixture(t);
    const source = join(root, "packages/feature.ts");
    write(source, "export const feature = true;\n");
    write(
        join(refs, "../maintenance/source-map.md"),
        "# Evidence\n\n@deepseek-ai/dsh-agent@9.9.9-rc.9\n\n`packages/feature.ts`\n",
    );
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
            "baseline",
        ],
        { cwd: root },
    );
    execFileSync("git", ["tag", "dsh-v9.9.9-rc.9"], { cwd: root });
    const skill = join(root, "skills/dsh-plugin-development");
    const valid = run("--skill", skill, "--dsh", root);
    assert.equal(valid.status, 0, valid.stdout + valid.stderr);
    unlinkSync(source);
    const missing = run("--skill", skill, "--dsh", root);
    assert.notEqual(missing.status, 0);
    assert.match(missing.stdout, /source map missing packages\/feature\.ts/);
    write(source, "export const feature = true;\n");
    write(join(root, "new-file.txt"), "next commit\n");
    execFileSync("git", ["add", "new-file.txt"], { cwd: root });
    execFileSync(
        "git",
        [
            "-c",
            "user.name=Skill Test",
            "-c",
            "user.email=skill-test@example.invalid",
            "commit",
            "-qm",
            "later",
        ],
        { cwd: root },
    );
    const mismatch = run("--skill", skill, "--dsh", root);
    assert.notEqual(mismatch.status, 0);
    assert.match(mismatch.stdout, /baseline mismatch/);
});
