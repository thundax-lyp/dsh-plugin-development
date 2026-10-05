#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { cpSync, existsSync, renameSync, rmSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { directoryDigest } from "./skill-build-contract.mjs";
import { verifyGeneratedSkill } from "./verify-generated-skill.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(scriptDirectory, "../../../..");
const formalSkillPath = join(workspaceRoot, "skills", "dsh-plugin-development");

export function installGeneratedSkill(
    generatedSkillPath,
    formalPath,
    result,
    options = {},
) {
    const remove = options.remove ?? rmSync;
    const processId = options.processId ?? process.pid;
    const parentPath = dirname(formalPath);
    const formalName = basename(formalPath);
    const stagedPath = join(parentPath, `.${formalName}-new-${processId}`);
    const backupPath = join(parentPath, `.${formalName}-old-${processId}`);
    try {
        cpSync(generatedSkillPath, stagedPath, {
            recursive: true,
            dereference: false,
            preserveTimestamps: true,
            errorOnExist: true,
            force: false,
        });
        if (
            directoryDigest(stagedPath) !== directoryDigest(generatedSkillPath)
        ) {
            throw new Error(
                "Staged Skill differs from verified generated output.",
            );
        }
    } catch (error) {
        remove(stagedPath, { recursive: true, force: true });
        throw error;
    }

    let oldMoved = false;
    try {
        if (existsSync(formalPath)) {
            renameSync(formalPath, backupPath);
            oldMoved = true;
        }
        renameSync(stagedPath, formalPath);
    } catch (error) {
        if (!existsSync(formalPath) && oldMoved && existsSync(backupPath)) {
            renameSync(backupPath, formalPath);
        }
        remove(stagedPath, { recursive: true, force: true });
        throw error;
    }

    let cleanupWarning;
    if (oldMoved) {
        try {
            remove(backupPath, { recursive: true, force: true });
        } catch (error) {
            cleanupWarning =
                `Replacement committed, but the old Skill backup could not be removed: ${backupPath}: ` +
                `${error instanceof Error ? error.message : String(error)}`;
        }
    }
    return {
        ...result,
        replaced: true,
        ...(cleanupWarning ? { cleanupWarning, backupPath } : {}),
    };
}

export function replaceGeneratedSkill(targetArgument) {
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
    return installGeneratedSkill(generatedSkillPath, formalSkillPath, result);
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
