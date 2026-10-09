#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const targetRoot = join(".dsh-skill-build", "targets");
const ledgerPaths = [
    "provenance.json",
    "evidence/inventory.json",
    "evidence/capability-candidates.json",
    "evidence/api-entry-candidates.json",
    "evidence/api-symbol-candidates.json",
    "evidence/task-candidates.json",
    "skill-source/manifest.json",
    "skill-source/claims.json",
    "skill-source/coverage.json",
    "skill-source/api-surface.json",
];

export function checkBuildJsonFormat(root = targetRoot) {
    if (!existsSync(root)) return { targets: 0, files: 0 };
    let targets = 0;
    let files = 0;
    const invalid = [];
    for (const entry of readdirSync(root, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const target = join(root, entry.name);
        const provenancePath = join(target, "provenance.json");
        if (!existsSync(provenancePath)) continue;
        const provenance = JSON.parse(readFileSync(provenancePath, "utf8"));
        if (provenance.creationContract !== "entrypoint") continue;
        targets++;
        for (const relativePath of ledgerPaths) {
            const path = join(target, relativePath);
            if (!existsSync(path)) continue;
            files++;
            const actual = readFileSync(path, "utf8");
            const expected = `${JSON.stringify(JSON.parse(actual), null, 4)}\n`;
            if (actual !== expected) invalid.push(path);
        }
    }
    if (invalid.length) {
        throw new Error(
            `Build JSON must use 4 spaces and one final newline:\n${invalid.join("\n")}`,
        );
    }
    return { targets, files };
}

if (
    process.argv[1] &&
    pathToFileURL(process.argv[1]).href === import.meta.url
) {
    try {
        const result = checkBuildJsonFormat();
        process.stdout.write(
            `Checked ${result.files} build JSON files in ${result.targets} targets.\n`,
        );
    } catch (error) {
        process.stderr.write(`${error.message}\n`);
        process.exitCode = 1;
    }
}
