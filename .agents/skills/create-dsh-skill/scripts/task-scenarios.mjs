import { createHash } from "node:crypto";
import { existsSync, lstatSync, realpathSync } from "node:fs";
import { join, sep } from "node:path";
import {
    readJson,
    resolveInside,
    sha256File,
} from "./skill-build-contract.mjs";

export function loadTaskScenarios(target, coverage) {
    const specPath = join(target.evidencePath, "task-scenarios.json");
    if (!existsSync(specPath)) {
        throw new Error(
            "Generated task navigation needs evidence/task-scenarios.json.",
        );
    }
    const spec = readJson(specPath);
    if (spec.schemaVersion !== 1 || !Array.isArray(spec.scenarios)) {
        throw new Error(
            "task-scenarios.json needs schemaVersion 1 and scenarios array.",
        );
    }
    const featured = new Set(
        coverage.taskPaths
            .filter((task) => task.decision === "covered" && task.entry)
            .map((task) => task.id),
    );
    const covered = new Set(
        coverage.taskPaths
            .filter((task) => task.decision === "covered")
            .map((task) => task.id),
    );
    const seen = new Set();
    const scriptHashes = createHash("sha256");
    const scenarios = [];
    for (const scenario of spec.scenarios) {
        if (!covered.has(scenario?.taskId) || seen.has(scenario.taskId)) {
            throw new Error(
                `Unknown or duplicate task scenario: ${scenario?.taskId}`,
            );
        }
        seen.add(scenario.taskId);
        if (
            !Array.isArray(scenario.checks) ||
            scenario.checks.length === 0 ||
            new Set(scenario.checks).size !== scenario.checks.length ||
            scenario.checks.some(
                (check) =>
                    typeof check !== "string" ||
                    !/^[a-z][a-z0-9-]*$/.test(check),
            )
        ) {
            throw new Error(
                `${scenario.taskId}.checks needs distinct check IDs.`,
            );
        }
        if (
            typeof scenario.script !== "string" ||
            !scenario.script.endsWith(".mjs")
        ) {
            throw new Error(
                `${scenario.taskId}.script must be an evidence .mjs file.`,
            );
        }
        if (
            scenario.timeoutMs !== undefined &&
            (!Number.isSafeInteger(scenario.timeoutMs) ||
                scenario.timeoutMs < 1 ||
                scenario.timeoutMs > 300_000)
        ) {
            throw new Error(`${scenario.taskId}.timeoutMs must be 1..300000.`);
        }
        const scriptPath = resolveInside(
            target.evidencePath,
            scenario.script,
            `${scenario.taskId}.script`,
        );
        if (!existsSync(scriptPath) || !lstatSync(scriptPath).isFile()) {
            throw new Error(
                `${scenario.taskId}.script must be a regular file.`,
            );
        }
        if (
            !realpathSync(scriptPath).startsWith(
                `${realpathSync(target.evidencePath)}${sep}`,
            )
        ) {
            throw new Error(
                `${scenario.taskId}.script escapes evidence via symlink.`,
            );
        }
        scriptHashes.update(`${scenario.script}\0${sha256File(scriptPath)}\0`);
        scenarios.push({ ...scenario, scriptPath });
    }
    for (const taskId of featured) {
        if (!seen.has(taskId))
            throw new Error(
                `Featured task lacks a runnable scenario: ${taskId}`,
            );
    }
    return {
        scenarios,
        hashes: {
            taskScenariosSha256: sha256File(specPath),
            taskScenarioScriptsSha256: scriptHashes.digest("hex"),
        },
    };
}
