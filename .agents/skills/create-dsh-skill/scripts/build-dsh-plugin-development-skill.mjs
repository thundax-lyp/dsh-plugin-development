#!/usr/bin/env node

import {
    cpSync,
    existsSync,
    mkdirSync,
    mkdtempSync,
    renameSync,
    rmSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { resolveInside } from "./skill-build-contract.mjs";
import { validateSkillSource } from "./validate-skill-source.mjs";
import { verifyGeneratedSkill } from "./verify-generated-skill.mjs";

export function buildSkill(targetArgument) {
    const target = validateSkillSource(targetArgument);
    if (target.manifest.status !== "frozen") {
        throw new Error(
            "Skill construction requires a frozen skill-source manifest.",
        );
    }
    if (existsSync(target.generatedSkillPath)) {
        rmSync(target.generatedSkillPath, { recursive: true, force: true });
    }
    const temporary = mkdtempSync(join(target.targetPath, ".generated-skill-"));
    try {
        for (const entry of target.manifest.files) {
            const source = resolveInside(
                target.skillSourcePath,
                entry.source,
                "skill source",
            );
            const output = resolveInside(
                temporary,
                entry.output,
                "generated output",
            );
            mkdirSync(dirname(output), { recursive: true });
            cpSync(source, output, {
                dereference: false,
                preserveTimestamps: true,
            });
        }
        renameSync(temporary, target.generatedSkillPath);
        return verifyGeneratedSkill(target.targetPath);
    } finally {
        if (existsSync(temporary))
            rmSync(temporary, { recursive: true, force: true });
    }
}

function main() {
    if (process.argv.length !== 3) {
        throw new Error(
            "Usage: build-dsh-plugin-development-skill.mjs <prepared-target-path>",
        );
    }
    const result = buildSkill(process.argv[2]);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (
    process.argv[1] &&
    pathToFileURL(process.argv[1]).href === import.meta.url
) {
    try {
        main();
    } catch (error) {
        process.stderr.write(
            `${error instanceof Error ? error.message : String(error)}\n`,
        );
        process.exitCode = 1;
    }
}
