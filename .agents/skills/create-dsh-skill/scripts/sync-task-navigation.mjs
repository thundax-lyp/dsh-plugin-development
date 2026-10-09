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
        !["generated", "entrypoint"].includes(manifest.taskNavigation)
    ) {
        throw new Error("Target must opt into schema v3 task navigation.");
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
    const objectIndex = manifest.files.find(
        (file) => file.output === "references/object-index.md",
    );
    if (!entry || (manifest.taskNavigation === "generated" && !routing))
        throw new Error("Missing entrypoint or legacy task routing source.");
    if (manifest.taskNavigation === "entrypoint" && !objectIndex)
        throw new Error("Missing object index source.");
    const entryPath = resolveInside(
        target.skillSourcePath,
        entry.source,
        "SKILL.md",
    );
    const routingPath =
        routing &&
        resolveInside(target.skillSourcePath, routing.source, "task routing");
    const rendered = renderTaskNavigation(
        coverage,
        manifest.files,
        target.skillSourcePath,
        {
            entrypoint: readFileSync(entryPath, "utf8"),
            routing: routingPath && readFileSync(routingPath, "utf8"),
            objectIndex:
                objectIndex &&
                readFileSync(
                    resolveInside(
                        target.skillSourcePath,
                        objectIndex.source,
                        "object index",
                    ),
                    "utf8",
                ),
        },
        manifest.taskNavigation === "entrypoint"
            ? readJson(
                  resolveInside(
                      target.skillSourcePath,
                      "api-surface.json",
                      "API surface",
                  ),
              )
            : undefined,
    );
    writeFileSync(entryPath, rendered.entrypoint);
    if (manifest.taskNavigation === "generated")
        writeFileSync(routingPath, rendered.routing);
    if (manifest.taskNavigation === "entrypoint")
        writeFileSync(
            resolveInside(
                target.skillSourcePath,
                objectIndex.source,
                "object index",
            ),
            rendered.objectIndex,
        );
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
