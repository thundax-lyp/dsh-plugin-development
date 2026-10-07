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
                types: manifest.types ?? null,
            };
        });
    const categories = {
        documentation: existing.filter((path) => path.startsWith("docs/")),
        agentNotes: existing.filter((path) =>
            path.startsWith(".agents/notes/"),
        ),
        upstreamSkills: existing.filter((path) =>
            path.startsWith(".agents/skills/"),
        ),
        website: existing.filter((path) => path.startsWith("website/")),
        snapshots: existing.filter((path) => path.startsWith("snapshots/")),
        sdkAndNative: existing.filter((path) =>
            matches(path, [/^packages\/sdk\//, /^python\/sdk\//, /^native\//]),
        ),
        generatedReferences: existing.filter((path) =>
            matches(path, [
                /^docs\/cordis-api\//,
                /^docs\/(?:tool-catalog|config-catalog|persistence-catalog|module-graph)\.md$/,
            ]),
        ),
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

export function buildCapabilityCandidates(inventory) {
    const candidates = [];
    const ids = new Set();
    const add = (candidate) => {
        let id = candidate.id;
        if (ids.has(id)) id = `${id}:${candidate.path}`;
        if (ids.has(id))
            throw new Error(`Duplicate capability candidate id: ${id}`);
        ids.add(id);
        candidates.push({ ...candidate, id });
    };

    for (const manifest of inventory.packageManifests) {
        if (manifest.private || typeof manifest.name !== "string") continue;
        add({
            id: `package:${manifest.name}`,
            kind: "public-package",
            path: manifest.path,
            name: manifest.name,
            exports: manifest.exports,
            bin: manifest.bin,
        });
    }
    for (const entry of inventory.manifests) {
        if (entry.path.endsWith("package.json")) continue;
        if (
            /(^|\/)(?:tests?|fixtures|examples|snapshots)(?:\/|$)/.test(
                entry.path,
            )
        ) {
            continue;
        }
        add({
            id: `composition:${entry.path}`,
            kind: "composition-manifest",
            path: entry.path,
        });
    }
    for (const entry of inventory.documentation) {
        if (entry.path.endsWith(".zh.md")) continue;
        const match = entry.path.match(
            /^docs\/(subsystems|cookbook)\/(.+)\.md$/,
        );
        if (!match) continue;
        add({
            id: `${match[1]}:${match[2]}`,
            kind: match[1] === "subsystems" ? "subsystem" : "developer-task",
            path: entry.path,
        });
    }

    return {
        schemaVersion: 1,
        ...Object.fromEntries(identityKeys.map((key) => [key, inventory[key]])),
        candidates: candidates.sort((left, right) =>
            left.id.localeCompare(right.id),
        ),
    };
}

function exportPaths(exportsValue, prefix = ".") {
    if (
        !exportsValue ||
        typeof exportsValue !== "object" ||
        Array.isArray(exportsValue)
    ) {
        return [prefix];
    }
    const keys = Object.keys(exportsValue);
    const subpaths = keys.filter((key) => key.startsWith("."));
    if (subpaths.length > 0) return subpaths.sort();
    return [prefix];
}

export function buildApiEntryCandidates(inventory) {
    const candidates = [];
    for (const manifest of inventory.packageManifests) {
        if (manifest.private || !manifest.name?.startsWith("@deepseek-ai/"))
            continue;
        const paths =
            manifest.exports == null ? ["."] : exportPaths(manifest.exports);
        for (const subpath of paths) {
            if (/[＊*]|(?:package\.json|\.(?:json|css|ya?ml))$/i.test(subpath))
                continue;
            candidates.push({
                id: `export:${manifest.name}:${subpath}`,
                package: manifest.name,
                subpath,
                path: manifest.path,
                declaration:
                    manifest.exports?.[subpath] ??
                    manifest.exports ??
                    manifest.types ??
                    null,
            });
        }
    }
    return {
        schemaVersion: 1,
        ...Object.fromEntries(identityKeys.map((key) => [key, inventory[key]])),
        candidates: candidates.sort((a, b) => a.id.localeCompare(b.id)),
    };
}

const taskHeadingPattern =
    /(?:如何|怎样|怎么|how\s+to|adding|creating|building|implementing|配置|开发|构建|接入|编写)/i;

export function buildTaskCandidates(inventory, checkoutPath) {
    const paths = new Set([
        ...inventory.documentation.map((entry) => entry.path),
        ...inventory.readmes.map((entry) => entry.path),
        ...inventory.website.map((entry) => entry.path),
    ]);
    const candidates = [];
    for (const path of [...paths].sort()) {
        if (!/\.(?:md|mdx)$/i.test(path)) continue;
        const lines = readFileSync(
            resolveInside(checkoutPath, path, "task source"),
            "utf8",
        ).split(/\r?\n/);
        let fenced = false;
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            if (/^\s*(```|~~~)/.test(line)) {
                fenced = !fenced;
                continue;
            }
            if (fenced) continue;
            const heading = line.match(/^#{1,5}\s+(.+?)\s*#*\s*$/);
            if (!heading || !taskHeadingPattern.test(heading[1])) continue;
            candidates.push({
                id: `task:${path}:${index + 1}`,
                path,
                line: index + 1,
                title: heading[1],
            });
        }
    }
    return {
        schemaVersion: 1,
        ...Object.fromEntries(identityKeys.map((key) => [key, inventory[key]])),
        candidates,
    };
}

function ensureCandidateDocument(path, value) {
    if (existsSync(path)) {
        if (JSON.stringify(readJson(path)) !== JSON.stringify(value)) {
            throw new Error(
                `Existing candidates differ from target checkout: ${path}`,
            );
        }
    } else {
        writeJsonAtomic(path, value);
    }
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
    const capabilities = buildCapabilityCandidates(inventory);
    const capabilitiesPath = join(
        target.evidencePath,
        "capability-candidates.json",
    );
    ensureCandidateDocument(capabilitiesPath, capabilities);
    const apiEntries = buildApiEntryCandidates(inventory);
    const apiEntriesPath = join(
        target.evidencePath,
        "api-entry-candidates.json",
    );
    ensureCandidateDocument(apiEntriesPath, apiEntries);
    const tasks = buildTaskCandidates(inventory, target.checkoutPath);
    const tasksPath = join(target.evidencePath, "task-candidates.json");
    ensureCandidateDocument(tasksPath, tasks);
    process.stdout.write(
        `${JSON.stringify({ path, capabilitiesPath, capabilityCandidates: capabilities.candidates.length, apiEntriesPath, apiEntries: apiEntries.candidates.length, tasksPath, taskCandidates: tasks.candidates.length, counts: inventory.counts }, null, 2)}\n`,
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
