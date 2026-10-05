#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
    identityKeys,
    loadTarget,
    readJson,
    resolveInside,
    sha256File,
    writeJsonAtomic,
} from "./skill-build-contract.mjs";

function record(checkoutPath, path) {
    return {
        path,
        sha256: sha256File(resolveInside(checkoutPath, path, "tracked path")),
    };
}

function matches(path, patterns) {
    return patterns.some((pattern) => pattern.test(path));
}

export function buildInventory(target) {
    const tracked = execFileSync("git", ["ls-files", "-z"], {
        cwd: target.checkoutPath,
        encoding: "utf8",
    })
        .split("\0")
        .filter(Boolean)
        .sort();
    const existing = tracked.filter((path) =>
        existsSync(resolveInside(target.checkoutPath, path, "tracked path")),
    );
    const packageManifests = existing
        .filter((path) => path.endsWith("package.json"))
        .map((path) => {
            const manifest = JSON.parse(
                readFileSync(
                    resolveInside(
                        target.checkoutPath,
                        path,
                        "package manifest",
                    ),
                    "utf8",
                ),
            );
            return {
                ...record(target.checkoutPath, path),
                name: manifest.name ?? null,
                version: manifest.version ?? null,
                private: manifest.private === true,
                exports: manifest.exports ?? null,
                bin: manifest.bin ?? null,
            };
        });
    const categories = {
        documentation: existing.filter((path) => path.startsWith("docs/")),
        readmes: existing.filter((path) =>
            /(^|\/)README(?:\.[^/]+)?$/i.test(path),
        ),
        tests: existing.filter((path) =>
            matches(path, [/(^|\/)tests?\//, /\.(?:spec|test)\.[cm]?[jt]sx?$/]),
        ),
        gates: existing.filter((path) =>
            matches(path, [
                /(^|\/)AGENTS\.md$/,
                /^\.github\/workflows\//,
                /(^|\/)scripts\//,
                /(^|\/)(?:eslint|prettier|vitest|jest|tsconfig)[^/]*\.(?:js|cjs|mjs|json|ya?ml)$/,
            ]),
        ),
        manifests: existing.filter((path) =>
            matches(path, [
                /(^|\/)package\.json$/,
                /(^|\/)cordis(?:\.[^/]+)?\.ya?ml$/,
                /(^|\/)(?:profile|bundle|preset)(?:\.[^/]+)?\.ya?ml$/,
            ]),
        ),
        publicEntrypoints: existing.filter((path) =>
            matches(path, [
                /(^|\/)src\/index\.[cm]?[jt]sx?$/,
                /(^|\/)src\/(?:client|host)\/index\.[cm]?[jt]sx?$/,
                /\.d\.[cm]?ts$/,
            ]),
        ),
        configurations: existing.filter((path) =>
            matches(path, [
                /(^|\/)tsconfig[^/]*\.json$/,
                /(^|\/)[^/]*config\.[cm]?[jt]s$/,
                /(^|\/)[^/]*config\.json$/,
            ]),
        ),
    };
    const inventory = {
        schemaVersion: 1,
        ...Object.fromEntries(
            identityKeys.map((key) => [key, target.provenance[key]]),
        ),
        trackedFileCount: existing.length,
        packageManifests,
    };
    for (const [category, paths] of Object.entries(categories)) {
        inventory[category] = [...new Set(paths)]
            .sort()
            .map((path) => record(target.checkoutPath, path));
    }
    inventory.counts = Object.fromEntries(
        Object.entries(categories).map(([category]) => [
            category,
            inventory[category].length,
        ]),
    );
    inventory.counts.packageManifests = packageManifests.length;
    return inventory;
}

function main() {
    if (process.argv.length !== 3) {
        throw new Error(
            "Usage: inventory-dsh-surface.mjs <prepared-target-path>",
        );
    }
    const target = loadTarget(process.argv[2]);
    const inventory = buildInventory(target);
    mkdirSync(target.evidencePath, { recursive: true });
    const path = join(target.evidencePath, "inventory.json");
    if (existsSync(path)) {
        const current = readJson(path);
        if (JSON.stringify(current) !== JSON.stringify(inventory)) {
            throw new Error(
                `Existing inventory differs from target checkout: ${path}`,
            );
        }
    } else {
        writeJsonAtomic(path, inventory);
    }
    process.stdout.write(
        `${JSON.stringify({ path, counts: inventory.counts }, null, 2)}\n`,
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
