#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const packageName = "@deepseek-ai/dsh-agent";
const stableRcPattern = /^(\d+)\.(\d+)\.(\d+)-rc\.(\d+)$/;

export function selectLatestStableRc(versions) {
    const candidates = versions.flatMap((version) => {
        const match = stableRcPattern.exec(version);
        if (!match) return [];
        return [
            {
                version,
                order: match.slice(1).map(Number),
            },
        ];
    });

    candidates.sort((left, right) => {
        for (let index = 0; index < left.order.length; index += 1) {
            const difference = left.order[index] - right.order[index];
            if (difference !== 0) return difference;
        }
        return 0;
    });

    const latest = candidates.at(-1);
    if (!latest) {
        throw new Error(
            `No ${packageName} version matches X.Y.Z-rc.N in the npm registry.`,
        );
    }
    return latest.version;
}

export function resolvePublishedVersion(versions, requestedVersion) {
    if (requestedVersion === undefined) {
        return selectLatestStableRc(versions);
    }
    if (!versions.includes(requestedVersion)) {
        throw new Error(
            `${packageName} version "${requestedVersion}" is not published in the npm registry.`,
        );
    }
    return requestedVersion;
}

function fetchPublishedVersions() {
    const output = execFileSync(
        "npm",
        ["view", packageName, "versions", "--json"],
        {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "inherit"],
        },
    );
    const parsed = JSON.parse(output);
    const versions = Array.isArray(parsed) ? parsed : [parsed];
    if (!versions.every((version) => typeof version === "string")) {
        throw new Error(`Unexpected npm versions response for ${packageName}.`);
    }
    return versions;
}

function main() {
    const args = process.argv.slice(2);
    if (args.length > 1) {
        throw new Error(
            "Usage: resolve-dsh-agent-version.mjs [exact-published-version]",
        );
    }
    process.stdout.write(
        `${resolvePublishedVersion(fetchPublishedVersions(), args[0])}\n`,
    );
}

if (
    process.argv[1] &&
    pathToFileURL(process.argv[1]).href === import.meta.url
) {
    try {
        main();
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        process.stderr.write(`${message}\n`);
        process.exitCode = 1;
    }
}
