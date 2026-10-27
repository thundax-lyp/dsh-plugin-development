import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveValidationTarget } from "./example_validation_target.cjs";

test("frozen inventory follows the selected Skill, independently of checkout location", (t) => {
    const root = mkdtempSync(join(tmpdir(), "skill-target-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const repo = join(root, "repo");
    const owner = join(root, "separate-target");
    mkdirSync(owner);
    writeFileSync(
        join(owner, "provenance.json"),
        JSON.stringify({ version: "1.2.3" }),
    );
    assert.equal(
        resolveValidationTarget(repo, join(owner, "generated-skill"), "1.2.3"),
        owner,
    );
    assert.equal(
        resolveValidationTarget(repo, join(repo, "skills/plugin"), "1.2.3"),
        join(repo, ".dsh-skill-build/targets/1.2.3"),
    );
    assert.throws(
        () =>
            resolveValidationTarget(
                repo,
                join(owner, "generated-skill"),
                "2.0.0",
            ),
        /version/,
    );
});
