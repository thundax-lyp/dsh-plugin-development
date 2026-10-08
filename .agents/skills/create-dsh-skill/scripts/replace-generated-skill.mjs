#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import {
    cpSync,
    existsSync,
    mkdirSync,
    mkdtempSync,
    renameSync,
    rmSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { directoryDigest, listFiles } from "./skill-build-contract.mjs";
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
    const parentPath = dirname(formalPath);
    const formalName = basename(formalPath);
    mkdirSync(parentPath, { recursive: true });
    const transactionPath = mkdtempSync(
        join(parentPath, `.${formalName}-replace-`),
    );
    const stagedPath = join(transactionPath, "new");
    const backupPath = join(transactionPath, "old");
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
        remove(transactionPath, { recursive: true, force: true });
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
            try {
                renameSync(backupPath, formalPath);
                oldMoved = false;
            } catch (rollbackError) {
                throw new AggregateError(
                    [error, rollbackError],
                    `Skill replacement and rollback failed; old Skill remains at ${backupPath}.`,
                );
            }
        }
        if (!oldMoved)
            remove(transactionPath, { recursive: true, force: true });
        throw error;
    }

    let cleanupWarning;
    try {
        remove(transactionPath, { recursive: true, force: true });
    } catch (error) {
        cleanupWarning =
            `Replacement committed, but the transaction directory could not be removed: ${transactionPath}: ` +
            `${error instanceof Error ? error.message : String(error)}`;
    }
    return {
        ...result,
        replaced: true,
        installedDigest: directoryDigest(formalPath),
        ...(cleanupWarning ? { cleanupWarning, backupPath } : {}),
    };
}

export function assertReplaceableFormalSkill(
    rootPath,
    formalPath,
    expectedDigest,
) {
    const relativeSkillPath = relative(rootPath, formalPath);
    const repositoryStatus = execFileSync(
        "git",
        [
            "status",
            "--porcelain",
            "-z",
            "--ignored=matching",
            "--untracked-files=all",
            "--",
            relativeSkillPath,
        ],
        { cwd: rootPath, encoding: "utf8" },
    );
    const statuses = repositoryStatus.split("\0").filter(Boolean);
    const preparedDeletion =
        statuses.length > 0 &&
        statuses.every((entry) => ["D ", " D"].includes(entry.slice(0, 2))) &&
        (!existsSync(formalPath) || listFiles(formalPath).length === 0);
    const verifiedPriorOutput =
        typeof expectedDigest === "string" &&
        /^[0-9a-f]{64}$/.test(expectedDigest) &&
        existsSync(formalPath) &&
        directoryDigest(formalPath) === expectedDigest;
    if (statuses.length > 0 && !preparedDeletion && !verifiedPriorOutput) {
        throw new Error(
            "Formal Skill has changes other than an empty directory with deleted tracked files; preserve them before whole-directory replacement.",
        );
    }
}

export function replaceGeneratedSkill(targetArgument, options = {}) {
    const result = verifyGeneratedSkill(targetArgument);
    const targetPath = resolve(targetArgument);
    const generatedSkillPath = join(targetPath, "generated-skill");
    assertReplaceableFormalSkill(
        workspaceRoot,
        formalSkillPath,
        options.expectedFormalDigest,
    );
    return installGeneratedSkill(generatedSkillPath, formalSkillPath, result);
}

function main() {
    if (
        process.argv.length !== 3 &&
        !(
            process.argv.length === 5 &&
            process.argv[3] === "--expected-formal-digest"
        )
    ) {
        throw new Error(
            "Usage: replace-generated-skill.mjs <prepared-target-path> [--expected-formal-digest <sha256>]",
        );
    }
    const result = replaceGeneratedSkill(process.argv[2], {
        expectedFormalDigest: process.argv[4],
    });
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
