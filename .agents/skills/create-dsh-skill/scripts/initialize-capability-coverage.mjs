#!/usr/bin/env node

import { existsSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
    assertIdentity,
    loadTarget,
    readJson,
} from "./skill-build-contract.mjs";

function bucketOf(candidate) {
    const parts = candidate.path.split("/");
    if (candidate.kind === "public-package") {
        return parts.slice(0, 2).join("/");
    }
    if (candidate.kind === "composition-manifest") {
        return parts.slice(0, 3).join("/");
    }
    return candidate.id;
}

function safeId(value) {
    return value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-|-$/g, "");
}

export function buildCoverageWorkQueue(candidateDocument, schemaVersion = 1) {
    const groups = new Map();
    for (const candidate of candidateDocument.candidates) {
        const bucket = `${candidate.kind}:${bucketOf(candidate)}`;
        const list = groups.get(bucket) ?? [];
        list.push(candidate.id);
        groups.set(bucket, list);
    }
    return {
        schemaVersion,
        ...(schemaVersion >= 2 ? { taskPaths: [] } : {}),
        ...(schemaVersion >= 3 ? { taskDiscoveries: [] } : {}),
        dispositions: [...groups.entries()]
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([bucket, candidates]) => ({
                id: `review-${safeId(bucket)}`,
                decision: "pending",
                candidates: candidates.sort(),
            })),
    };
}

export function buildApiSurfaceCandidates(apiEntries, apiSymbols) {
    const compareId = (left, right) =>
        left < right ? -1 : left > right ? 1 : 0;
    return {
        entries: apiEntries.candidates
            .map((candidate) => ({
                candidate: candidate.id,
                decision: "pending",
            }))
            .sort((left, right) => compareId(left.candidate, right.candidate)),
        objects: apiSymbols.entries
            .flatMap((entry) =>
                entry.symbols.map((symbol) => ({
                    id: `${entry.entry}:${symbol.name}`,
                    entry: entry.entry,
                    symbol: symbol.name,
                    signature: symbol.signature,
                    source: symbol.source ?? entry.source,
                    decision: "pending",
                    members: symbol.members
                        .map((member) => ({
                            ...member,
                            decision: "pending",
                        }))
                        .sort((left, right) =>
                            compareId(left.name, right.name),
                        ),
                })),
            )
            .sort((left, right) => compareId(left.id, right.id)),
    };
}

function writeJsonReplacing(path, value) {
    const temporary = `${path}.tmp-${process.pid}`;
    writeFileSync(temporary, `${JSON.stringify(value, null, 4)}\n`, {
        flag: "wx",
    });
    renameSync(temporary, path);
}

export function initializeCoverage(targetArgument) {
    const target = loadTarget(targetArgument);
    const candidatesPath = join(
        target.evidencePath,
        "capability-candidates.json",
    );
    if (!existsSync(candidatesPath)) {
        throw new Error(
            "Run inventory before initializing capability coverage.",
        );
    }
    const candidateDocument = readJson(candidatesPath);
    assertIdentity(
        candidateDocument,
        target.provenance,
        "capability candidates",
    );
    const coveragePath = join(target.skillSourcePath, "coverage.json");
    const current = readJson(coveragePath);
    if (
        ![1, 2, 3].includes(current.schemaVersion) ||
        !Array.isArray(current.dispositions)
    ) {
        throw new Error("Existing coverage.json is not a supported document.");
    }
    if (current.dispositions.length > 0) {
        throw new Error(
            "Existing coverage.json already contains work; refusing to replace it.",
        );
    }
    const coverage = buildCoverageWorkQueue(
        candidateDocument,
        current.schemaVersion,
    );
    if (current.schemaVersion === 3) {
        const tasksPath = join(target.evidencePath, "task-candidates.json");
        const apiEntriesPath = join(
            target.evidencePath,
            "api-entry-candidates.json",
        );
        const apiSymbolsPath = join(
            target.evidencePath,
            "api-symbol-candidates.json",
        );
        if (
            !existsSync(tasksPath) ||
            !existsSync(apiEntriesPath) ||
            !existsSync(apiSymbolsPath)
        ) {
            throw new Error(
                "Run inventory and public API discovery before initializing coverage.",
            );
        }
        const tasks = readJson(tasksPath);
        const apiEntries = readJson(apiEntriesPath);
        const apiSymbols = readJson(apiSymbolsPath);
        assertIdentity(tasks, target.provenance, "task candidates");
        assertIdentity(apiEntries, target.provenance, "API entry candidates");
        assertIdentity(apiSymbols, target.provenance, "API symbol candidates");
        coverage.taskDiscoveries = tasks.candidates.map((candidate) => ({
            candidate: candidate.id,
            decision: "pending",
        }));
        const apiSurfacePath = join(target.skillSourcePath, "api-surface.json");
        const apiSurface = readJson(apiSurfacePath);
        assertIdentity(apiSurface, target.provenance, "API surface");
        if (apiSurface.entries.length || apiSurface.objects.length) {
            throw new Error(
                "Existing api-surface.json already contains work; refusing to replace it.",
            );
        }
        writeJsonReplacing(apiSurfacePath, {
            ...apiSurface,
            ...buildApiSurfaceCandidates(apiEntries, apiSymbols),
        });
    }
    writeJsonReplacing(coveragePath, coverage);
    return {
        coveragePath,
        candidates: candidateDocument.candidates.length,
        reviewGroups: coverage.dispositions.length,
    };
}

function main() {
    if (process.argv.length !== 3) {
        throw new Error(
            "Usage: initialize-capability-coverage.mjs <prepared-target-path>",
        );
    }
    process.stdout.write(
        `${JSON.stringify(initializeCoverage(process.argv[2]), null, 2)}\n`,
    );
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
