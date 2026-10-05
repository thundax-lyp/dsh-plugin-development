#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { cpSync, existsSync, renameSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { directoryDigest } from "./skill-build-contract.mjs";
import { verifyGeneratedSkill } from "./verify-generated-skill.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(scriptDirectory, "../../../..");
const formalSkillPath = join(workspaceRoot, "skills", "dsh-plugin-development");

function replaceGeneratedSkill(targetArgument) {
    const result = verifyGeneratedSkill(targetArgument);
    const targetPath = resolve(targetArgument);
    const generatedSkillPath = join(targetPath, "generated-skill");
    const repositoryStatus = execFileSync(
        "git",
        [
            "status",
            "--porcelain",
            "--untracked-files=all",
            "--",
            "skills/dsh-plugin-development",
        ],
        { cwd: workspaceRoot, encoding: "utf8" },
    ).trim();
    if (repositoryStatus !== "") {
        throw new Error(
            "Formal Skill has working-tree changes; preserve them before whole-directory replacement.",
        );
    }

    const stagedPath = join(
        workspaceRoot,
        "skills",
        `.dsh-plugin-development-new-${process.pid}`,
    );
    const backupPath = join(
        workspaceRoot,
        "skills",
        `.dsh-plugin-development-old-${process.pid}`,
    );
    cpSync(generatedSkillPath, stagedPath, {
        recursive: true,
        dereference: false,
        preserveTimestamps: true,
        errorOnExist: true,
        force: false,
    });
    if (directoryDigest(stagedPath) !== directoryDigest(generatedSkillPath)) {
        rmSync(stagedPath, { recursive: true, force: true });
        throw new Error("Staged Skill differs from verified generated output.");
    }

    let oldMoved = false;
    try {
        if (existsSync(formalSkillPath)) {
            renameSync(formalSkillPath, backupPath);
            oldMoved = true;
        }
        renameSync(stagedPath, formalSkillPath);
        if (oldMoved) rmSync(backupPath, { recursive: true, force: true });
    } catch (error) {
        if (
            !existsSync(formalSkillPath) &&
            oldMoved &&
            existsSync(backupPath)
        ) {
            renameSync(backupPath, formalSkillPath);
        }
        rmSync(stagedPath, { recursive: true, force: true });
        throw error;
    }
    return result;
}

function main() {
    if (process.argv.length !== 3) {
        throw new Error(
            "Usage: replace-generated-skill.mjs <prepared-target-path>",
        );
    }
    const result = replaceGeneratedSkill(process.argv[2]);
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
