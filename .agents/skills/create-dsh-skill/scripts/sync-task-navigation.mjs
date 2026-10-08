#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import {
    loadTarget,
    readJson,
    resolveInside,
} from "./skill-build-contract.mjs";
import { renderTaskNavigation } from "./task-navigation.mjs";

export function syncTaskNavigation(targetArgument) {
    const target = loadTarget(targetArgument);
    const manifest = target.manifest;
    if (
        manifest.schemaVersion !== 3 ||
        manifest.taskNavigation !== "generated"
    ) {
        throw new Error(
            "Target must opt into schema v3 generated task navigation.",
        );
    }
    if (manifest.status !== "draft") {
        throw new Error(
            "Set the source manifest to draft before syncing navigation.",
        );
    }
    const coverage = readJson(
        resolveInside(target.skillSourcePath, "coverage.json", "coverage"),
    );
    const entry = manifest.files.find((file) => file.output === "SKILL.md");
    const routing = manifest.files.find(
        (file) => file.output === "references/plugin-development-routing.md",
    );
    if (!entry || !routing)
        throw new Error("Missing entrypoint or task routing source.");
    const entryPath = resolveInside(
        target.skillSourcePath,
        entry.source,
        "SKILL.md",
    );
    const routingPath = resolveInside(
        target.skillSourcePath,
        routing.source,
        "task routing",
    );
    const rendered = renderTaskNavigation(
        coverage,
        manifest.files,
        target.skillSourcePath,
        {
            entrypoint: readFileSync(entryPath, "utf8"),
            routing: readFileSync(routingPath, "utf8"),
        },
    );
    writeFileSync(entryPath, rendered.entrypoint);
    writeFileSync(routingPath, rendered.routing);
    return {
        featuredTasks: rendered.featuredIds.length,
        routedTasks: coverage.taskPaths.filter(
            (task) => task.decision === "covered",
        ).length,
    };
}

if (
    process.argv[1] &&
    pathToFileURL(process.argv[1]).href === import.meta.url
) {
    try {
        if (process.argv.length !== 3) {
            throw new Error(
                "Usage: sync-task-navigation.mjs <prepared-target-path>",
            );
        }
        process.stdout.write(
            `${JSON.stringify(syncTaskNavigation(process.argv[2]))}\n`,
        );
    } catch (error) {
        process.stderr.write(
            `${error instanceof Error ? error.message : String(error)}\n`,
        );
        process.exitCode = 1;
    }
}
