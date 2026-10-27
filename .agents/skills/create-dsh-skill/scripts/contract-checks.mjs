import { existsSync, lstatSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { markdownSectionWithCode } from "./markdown-structure.mjs";
import {
    loadTarget,
    readJson,
    resolveInside,
    sha256File,
} from "./skill-build-contract.mjs";

const normalize = (text) => text.replace(/\s+/g, " ").trim();
// Optional for historical frozen targets. Once present, its inventory and all
// executable/input hashes are part of the frozen control material.
export function loadContractChecks(target) {
    const path = join(target.evidencePath, "contract-checks.json");
    if (!existsSync(path)) {
        if (target.manifest.contractChecksSha256 !== undefined)
            throw new Error("Frozen contract checks are missing.");
        return { assertions: [], examples: [], hashes: {} };
    }
    const data = readJson(path);
    if (
        data.schemaVersion !== 1 ||
        !Array.isArray(data.assertions) ||
        !Array.isArray(data.examples)
    )
        throw new Error(
            "contract-checks.json requires schemaVersion 1, assertions and examples.",
        );
    const files = new Set();
    const ids = new Set();
    for (const check of [...data.assertions, ...data.examples]) {
        if (
            typeof check.id !== "string" ||
            !check.id.trim() ||
            ids.has(check.id)
        )
            throw new Error("Contract check IDs must be unique and non-empty.");
        ids.add(check.id);
    }
    for (const check of data.assertions) {
        const file = target.manifest.files.find(
            (file) => file.output === check.output,
        );
        if (
            !file ||
            !["api-guardrail", "how-to", "example"].includes(file.kind)
        )
            throw new Error(
                `Contract assertion has no source output: ${check.output}`,
            );
        if (
            !Array.isArray(check.includes) ||
            !check.includes.length ||
            check.includes.some(
                (value) => typeof value !== "string" || !value.trim(),
            )
        )
            throw new Error(
                `Contract assertion needs non-empty includes: ${check.id}`,
            );
        if (
            check.excludes !== undefined &&
            (!Array.isArray(check.excludes) ||
                check.excludes.some(
                    (value) => typeof value !== "string" || !value.trim(),
                ))
        )
            throw new Error(`Invalid contract excludes: ${check.id}`);
    }
    for (const check of data.examples) {
        if (!Array.isArray(check.outputs) || !check.outputs.length)
            throw new Error(`Example check has no outputs: ${check.id}`);
        for (const output of check.outputs) {
            if (
                !target.manifest.files.some(
                    (file) =>
                        file.output === output &&
                        ["api-guardrail", "how-to", "example"].includes(
                            file.kind,
                        ),
                )
            )
                throw new Error(
                    `Example validator requires a mapped example or contract: ${output}`,
                );
        }
        if (
            !Array.isArray(check.args) ||
            check.args.some((value) => typeof value !== "string")
        )
            throw new Error(`Invalid example arguments: ${check.id}`);
        if (
            !Number.isInteger(check.timeoutMs) ||
            check.timeoutMs < 1 ||
            check.timeoutMs > 300000
        )
            throw new Error(`Invalid example timeout: ${check.id}`);
        for (const input of [check.script, ...(check.inputs ?? [])]) {
            const resolved = resolveInside(
                target.evidencePath,
                input,
                "contract check input",
            );
            if (!existsSync(resolved) || !lstatSync(resolved).isFile())
                throw new Error(
                    `Contract check input is not a regular file: ${input}`,
                );
            files.add(input);
        }
        if (!check.script.endsWith(".mjs"))
            throw new Error("Example validator must be .mjs.");
    }
    const executableInputs = [...files]
        .sort()
        .map((file) => [
            file,
            sha256File(
                resolveInside(
                    target.evidencePath,
                    file,
                    "contract check input",
                ),
            ),
        ]);
    return {
        ...data,
        hashes: {
            contractChecksSha256: sha256File(path),
            contractInputsSha256: createHash("sha256")
                .update(JSON.stringify(executableInputs))
                .digest("hex"),
        },
    };
}

export function assertContractText(checks, readOutput) {
    for (const check of checks.assertions) {
        const body = readOutput(check.output);
        const section = check.section
            ? markdownSectionWithCode(body, check.section)?.content
            : body;
        if (!section) throw new Error(`Contract section missing: ${check.id}`);
        const text = normalize(section);
        for (const expected of check.includes)
            if (!text.includes(normalize(expected)))
                throw new Error(
                    `Contract content missing: ${check.id}: ${expected}`,
                );
        for (const forbidden of check.excludes ?? [])
            if (text.includes(normalize(forbidden)))
                throw new Error(
                    `Contract content regressed: ${check.id}: ${forbidden}`,
                );
    }
}

export function runContractExamples(target, skillPath) {
    const checks = loadContractChecks(target);
    if (target.manifest.status !== "frozen")
        throw new Error("Example checks require frozen source.");
    for (const [key, value] of Object.entries(checks.hashes))
        if (target.manifest[key] !== value)
            throw new Error(`Frozen contract hash mismatch: ${key}`);
    assertContractText(checks, (output) =>
        readFileSync(
            resolveInside(skillPath, output, "checked output"),
            "utf8",
        ),
    );
    const results = [];
    for (const check of checks.examples) {
        const args = check.args.map((arg) =>
            arg === "{skill}"
                ? skillPath
                : arg === "{example}"
                  ? resolveInside(
                        skillPath,
                        check.outputs[0],
                        "checked example",
                    )
                  : arg,
        );
        const env = {
            ...process.env,
            DSH_TARGET_CHECKOUT: target.checkoutPath,
            DSH_TASK_VERIFICATION_OFFLINE: "1",
        };
        for (const key of Object.keys(env))
            if (/(?:TOKEN|API_KEY|SECRET|PASSWORD)$/.test(key)) delete env[key];
        const result = spawnSync(
            process.execPath,
            [
                resolveInside(
                    target.evidencePath,
                    check.script,
                    "example script",
                ),
                ...args,
            ],
            {
                cwd: target.repositoryRoot ?? process.cwd(),
                env,
                encoding: "utf8",
                timeout: check.timeoutMs,
                maxBuffer: 16 * 1024 * 1024,
            },
        );
        if (result.status !== 0)
            throw new Error(
                `Example check failed: ${check.id}\n${result.stdout}\n${result.stderr}`,
            );
        let report;
        try {
            report = JSON.parse(result.stdout.trim());
        } catch {
            throw new Error(
                `Example check must emit one JSON object: ${check.id}`,
            );
        }
        if (
            !report.checks ||
            !Object.keys(report.checks).length ||
            Object.values(report.checks).some((value) => value !== true)
        )
            throw new Error(`Example assertions failed: ${check.id}`);
        for (const field of ["hostBlocks", "clientBlocks"])
            if (!Number.isInteger(report[field]) || report[field] < 0)
                throw new Error(`Invalid ${field}: ${check.id}`);
        results.push({ id: check.id, outputs: check.outputs, ...report });
    }
    return results;
}

if (process.argv[1]?.endsWith("/contract-checks.mjs")) {
    try {
        const [targetPath, skillPath, checkoutPath] = process.argv.slice(2);
        if (!targetPath || !skillPath)
            throw new Error(
                "Usage: contract-checks.mjs <target> <skill> [checkout]",
            );
        const target = loadTarget(targetPath, { checkoutPath });
        process.stdout.write(
            JSON.stringify(runContractExamples(target, skillPath)) + "\n",
        );
    } catch (error) {
        process.stderr.write(error.message + "\n");
        process.exitCode = 1;
    }
}
