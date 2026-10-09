import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { checkBuildJsonFormat } from "./check_build_json_format.mjs";

test("versioned build JSON rejects indentation drift without checking legacy targets", (t) => {
    const root = mkdtempSync(join(tmpdir(), "dsh-ledger-format-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const current = join(root, "current");
    const legacy = join(root, "legacy");
    mkdirSync(join(current, "skill-source"), { recursive: true });
    mkdirSync(legacy);
    writeFileSync(
        join(current, "provenance.json"),
        `${JSON.stringify({ creationContract: "entrypoint" }, null, 4)}\n`,
    );
    writeFileSync(join(legacy, "provenance.json"), '{"version":"legacy"}\n');
    const ledger = join(current, "skill-source", "coverage.json");
    writeFileSync(ledger, '{\n  "schemaVersion": 3\n}\n');
    assert.throws(() => checkBuildJsonFormat(root), /coverage\.json/);
    writeFileSync(ledger, `${JSON.stringify({ schemaVersion: 3 }, null, 4)}\n`);
    assert.deepEqual(checkBuildJsonFormat(root), { targets: 1, files: 2 });
});
