#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { loadTaskScenarios } from "./task-scenarios.mjs";
import { validateSkillSource } from "./validate-skill-source.mjs";

export function verifyTaskScenarios(targetArgument) {
    const target = validateSkillSource(targetArgument);
    if (
        target.manifest.status !== "frozen" ||
        target.manifest.taskNavigation !== "generated"
    ) {
        throw new Error(
            "Task scenarios require frozen generated-navigation source.",
        );
    }
    const { scenarios } = loadTaskScenarios(target, target.coverage);
    const results = [];
    for (const scenario of scenarios) {
        const temporary = mkdtempSync(join(tmpdir(), "dsh-task-scenario-"));
        try {
            const environment = Object.fromEntries(
                Object.entries(process.env).filter(
                    ([key]) => !/(_API_KEY|_TOKEN|_SECRET)$/i.test(key),
                ),
            );
            const output = execFileSync(
                process.execPath,
                [scenario.scriptPath],
                {
                    cwd: target.checkoutPath,
                    encoding: "utf8",
                    timeout: scenario.timeoutMs ?? 120_000,
                    maxBuffer: 1024 * 1024,
                    env: {
                        ...environment,
                        DSH_HOME: temporary,
                        DSH_TARGET_CHECKOUT: target.checkoutPath,
                        DSH_TASK_VERIFICATION_OFFLINE: "1",
                    },
                },
            );
            let report;
            try {
                report = JSON.parse(output);
            } catch {
                throw new Error(
                    `${scenario.taskId} did not emit one JSON report.`,
                );
            }
            if (
                report.taskId !== scenario.taskId ||
                typeof report.checks !== "object"
            ) {
                throw new Error(
                    `${scenario.taskId} emitted an invalid task report.`,
                );
            }
            for (const check of scenario.checks) {
                if (report.checks[check] !== true) {
                    throw new Error(
                        `${scenario.taskId} did not pass ${check}.`,
                    );
                }
            }
            results.push({ taskId: scenario.taskId, checks: scenario.checks });
        } catch (error) {
            if (error?.killed || error?.signal === "SIGTERM") {
                throw new Error(`${scenario.taskId} timed out.`);
            }
            throw error;
        } finally {
            rmSync(temporary, { recursive: true, force: true });
        }
    }
    return { passed: results };
}

if (
    process.argv[1] &&
    pathToFileURL(process.argv[1]).href === import.meta.url
) {
    try {
        if (process.argv.length !== 3) {
            throw new Error(
                "Usage: verify-task-scenarios.mjs <prepared-target-path>",
            );
        }
        process.stdout.write(
            `${JSON.stringify(verifyTaskScenarios(process.argv[2]), null, 2)}\n`,
        );
    } catch (error) {
        process.stderr.write(
            `${error instanceof Error ? error.message : String(error)}\n`,
        );
        process.exitCode = 1;
    }
}
