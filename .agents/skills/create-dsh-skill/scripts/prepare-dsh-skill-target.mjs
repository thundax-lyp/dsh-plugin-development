#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
    cpSync,
    existsSync,
    lstatSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    readdirSync,
    readlinkSync,
    realpathSync,
    renameSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryUrl = "https://github.com/deepseek-ai/deepseek-harness.git";
const packageName = "@deepseek-ai/dsh-agent";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(scriptDirectory, "../../../..");
const buildRoot = join(workspaceRoot, ".dsh-skill-build");
const repositoryPath = join(buildRoot, "repository");

function run(command, args, options = {}) {
    const output = execFileSync(command, args, {
        cwd: options.cwd,
        encoding: "utf8",
        stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    });
    return typeof output === "string" ? output.trim() : "";
}

function normalizeRemote(url) {
    return url.replace(/\/+$/, "").replace(/\.git$/, "");
}

function resolveVersion(requestedVersion) {
    const args = [
        join(scriptDirectory, "resolve-dsh-agent-version.mjs"),
        ...(requestedVersion === undefined ? [] : [requestedVersion]),
    ];
    return run(process.execPath, args, { capture: true });
}

function ensureRepository() {
    mkdirSync(buildRoot, { recursive: true });
    if (!existsSync(repositoryPath)) {
        run("git", ["clone", repositoryUrl, repositoryPath]);
    }

    const insideWorkTree = run("git", ["rev-parse", "--is-inside-work-tree"], {
        cwd: repositoryPath,
        capture: true,
    });
    if (insideWorkTree !== "true") {
        throw new Error(`${repositoryPath} is not a Git worktree.`);
    }

    const actualRemote = run("git", ["remote", "get-url", "origin"], {
        cwd: repositoryPath,
        capture: true,
    });
    if (normalizeRemote(actualRemote) !== normalizeRemote(repositoryUrl)) {
        throw new Error(
            `Unexpected origin for ${repositoryPath}: ${actualRemote}`,
        );
    }
    const shallow = run("git", ["rev-parse", "--is-shallow-repository"], {
        cwd: repositoryPath,
        capture: true,
    });
    run(
        "git",
        [
            "fetch",
            "origin",
            ...(shallow === "true" ? ["--unshallow"] : []),
            "--tags",
            "--prune",
        ],
        { cwd: repositoryPath },
    );
    return actualRemote;
}

function ensureCheckout(checkoutPath, commit) {
    if (!existsSync(checkoutPath)) {
        mkdirSync(dirname(checkoutPath), { recursive: true });
        const registrations = run("git", ["worktree", "list", "--porcelain"], {
            cwd: repositoryPath,
            capture: true,
        });
        const registered = registrations
            .split(/\n\s*\n/)
            .map((record) => record.split("\n"))
            .find((lines) => lines.includes(`worktree ${checkoutPath}`));
        if (
            registered &&
            (!registered.includes(`HEAD ${commit}`) ||
                !registered.some((line) => line.startsWith("prunable ")) ||
                registered.some((line) => line.startsWith("locked")))
        ) {
            throw new Error(
                `Existing worktree registration is not safely recoverable: ${checkoutPath}`,
            );
        }
        if (registered) {
            process.stderr.write(
                `Recovering missing worktree registered at ${checkoutPath}.\n`,
            );
        }
        run(
            "git",
            [
                "worktree",
                "add",
                ...(registered ? ["--force"] : []),
                "--detach",
                checkoutPath,
                commit,
            ],
            {
                cwd: repositoryPath,
            },
        );
    }

    const actualRoot = realpathSync(
        run("git", ["rev-parse", "--show-toplevel"], {
            cwd: checkoutPath,
            capture: true,
        }),
    );
    if (actualRoot !== realpathSync(checkoutPath)) {
        throw new Error(`${checkoutPath} is not the expected Git worktree.`);
    }
    const actualCommit = run("git", ["rev-parse", "HEAD"], {
        cwd: checkoutPath,
        capture: true,
    });
    if (actualCommit !== commit) {
        throw new Error(
            `Existing checkout points to ${actualCommit}, expected ${commit}.`,
        );
    }
    const status = run("git", ["status", "--porcelain"], {
        cwd: checkoutPath,
        capture: true,
    });
    if (status !== "") {
        throw new Error(`Existing checkout has local changes: ${checkoutPath}`);
    }
}

function verifyAgentPackageVersion(checkoutPath, version) {
    const manifestPath = join(
        checkoutPath,
        "packages",
        "core",
        "agent",
        "package.json",
    );
    if (!existsSync(manifestPath)) {
        throw new Error(
            `Target tag is missing ${relative(checkoutPath, manifestPath)}.`,
        );
    }
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    if (manifest.name !== packageName || manifest.version !== version) {
        throw new Error(
            `Target tag package identity is ${manifest.name}@${manifest.version}, expected ${packageName}@${version}.`,
        );
    }
}

function hashDirectory(root) {
    const hash = createHash("sha256");

    function visit(path) {
        const entries = readdirSync(path, { withFileTypes: true }).sort(
            (a, b) => a.name.localeCompare(b.name),
        );
        for (const entry of entries) {
            const fullPath = join(path, entry.name);
            const name = relative(root, fullPath);
            const stats = lstatSync(fullPath);
            if (entry.isDirectory()) {
                hash.update(`directory\0${name}\0${stats.mode}\0`);
                visit(fullPath);
            } else if (entry.isSymbolicLink()) {
                hash.update(`symlink\0${name}\0${readlinkSync(fullPath)}\0`);
            } else if (entry.isFile()) {
                hash.update(`file\0${name}\0${stats.mode}\0`);
                hash.update(readFileSync(fullPath));
                hash.update("\0");
            } else {
                throw new Error(`Unsupported docs entry: ${fullPath}`);
            }
        }
    }

    visit(root);
    return hash.digest("hex");
}

function ensureDocsSnapshot(sourcePath, destinationPath) {
    if (!existsSync(sourcePath)) {
        throw new Error(`Target tag does not contain docs/: ${sourcePath}`);
    }

    mkdirSync(dirname(destinationPath), { recursive: true });
    const temporaryRoot = mkdtempSync(
        join(dirname(destinationPath), ".docs-snapshot-"),
    );
    const temporaryDocs = join(temporaryRoot, "upstream-docs");
    try {
        cpSync(sourcePath, temporaryDocs, {
            recursive: true,
            dereference: false,
            preserveTimestamps: true,
        });
        if (existsSync(destinationPath)) {
            if (
                hashDirectory(destinationPath) !== hashDirectory(temporaryDocs)
            ) {
                throw new Error(
                    `Existing docs snapshot differs from target tag: ${destinationPath}`,
                );
            }
            return;
        }
        renameSync(temporaryDocs, destinationPath);
    } finally {
        rmSync(temporaryRoot, { recursive: true, force: true });
    }
}

function ensureJsonFile(path, expected, initial = expected) {
    if (existsSync(path)) {
        const actual = JSON.parse(readFileSync(path, "utf8"));
        for (const [key, value] of Object.entries(expected)) {
            if (JSON.stringify(actual[key]) !== JSON.stringify(value)) {
                throw new Error(
                    `Existing ${path} has unexpected ${key}: ${actual[key]}`,
                );
            }
        }
        return;
    }
    writeFileSync(path, `${JSON.stringify(initial, null, 4)}\n`);
}

function main() {
    const args = process.argv.slice(2);
    if (args.length > 1) {
        throw new Error(
            "Usage: prepare-dsh-skill-target.mjs [exact-published-version]",
        );
    }

    const version = resolveVersion(args[0]);
    const tag = `dsh-v${version}`;
    const remote = ensureRepository();
    const commit = run(
        "git",
        ["rev-parse", "--verify", `refs/tags/${tag}^{commit}`],
        { cwd: repositoryPath, capture: true },
    );
    const targetPath = join(buildRoot, "targets", encodeURIComponent(version));
    const checkoutPath = join(targetPath, "checkout");

    ensureCheckout(checkoutPath, commit);
    verifyAgentPackageVersion(checkoutPath, version);
    ensureDocsSnapshot(
        join(checkoutPath, "docs"),
        join(targetPath, "upstream-docs"),
    );
    for (const path of [
        "evidence/public-api",
        "evidence/runtime",
        "evidence/exports",
        "evidence/gates",
        "evidence/tests",
        "evidence/documentation",
        "skill-source/api-guardrails",
        "skill-source/concepts",
        "skill-source/how-to",
        "skill-source/entrypoint",
        "skill-source/metadata",
        "skill-source/indexes",
        "skill-source/maintenance",
        "skill-source/assets",
        "generated-skill",
    ]) {
        mkdirSync(join(targetPath, path), { recursive: true });
    }

    ensureJsonFile(join(targetPath, "provenance.json"), {
        package: packageName,
        version,
        tag,
        commit,
        remote: normalizeRemote(remote),
    });
    const skillSourceIdentity = {
        version,
        tag,
        commit,
        remote: normalizeRemote(remote),
    };
    const skillSourceManifestPath = join(
        targetPath,
        "skill-source",
        "manifest.json",
    );
    ensureJsonFile(skillSourceManifestPath, skillSourceIdentity, {
        schemaVersion: 3,
        ...skillSourceIdentity,
        status: "draft",
        topics: [],
        files: [],
    });
    const skillSourceManifest = JSON.parse(
        readFileSync(skillSourceManifestPath, "utf8"),
    );
    if (
        skillSourceManifest.schemaVersion === undefined &&
        skillSourceManifest.status === "draft" &&
        Array.isArray(skillSourceManifest.topics) &&
        skillSourceManifest.topics.length === 0 &&
        skillSourceManifest.files === undefined
    ) {
        writeFileSync(
            skillSourceManifestPath,
            `${JSON.stringify(
                {
                    schemaVersion: 1,
                    ...skillSourceManifest,
                    files: [],
                },
                null,
                4,
            )}\n`,
        );
    }
    ensureJsonFile(join(targetPath, "skill-source", "claims.json"), {}, []);
    ensureJsonFile(
        join(targetPath, "skill-source", "coverage.json"),
        {},
        {
            schemaVersion: 3,
            dispositions: [],
            taskPaths: [],
            taskDiscoveries: [],
        },
    );
    ensureJsonFile(
        join(targetPath, "skill-source", "api-surface.json"),
        {},
        { schemaVersion: 1, ...skillSourceIdentity, entries: [], objects: [] },
    );

    process.stdout.write(
        `${JSON.stringify({ version, tag, commit, targetPath }, null, 2)}\n`,
    );
}

try {
    main();
} catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
}
