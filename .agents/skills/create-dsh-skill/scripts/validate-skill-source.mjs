#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, lstatSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
    assertIdentity,
    loadTarget,
    normalizeRelativePath,
    readJson,
    resolveInside,
    sha256File,
    writeJsonAtomic,
} from "./skill-build-contract.mjs";

const allowedKinds = new Set([
    "entrypoint",
    "metadata",
    "api-guardrail",
    "concept",
    "how-to",
    "index",
    "maintenance",
    "asset",
]);
const allowedClaimKinds = new Set([
    "implemented-behavior",
    "repository-rule",
    "derived-guidance",
    "external-protocol",
    "excluded",
]);
const allowedEvidenceCategories = new Set([
    "public-api",
    "runtime",
    "exports",
    "gates",
    "tests",
    "documentation",
]);
const requiredOutputs = new Set([
    "SKILL.md",
    "agents/openai.yaml",
    "references/plugin-development-routing.md",
    "references/keyword-index.md",
    "references/terminology.md",
    "maintenance/source-map.md",
    "maintenance/skill-maintenance.md",
]);

function requireString(value, label) {
    if (typeof value !== "string" || value.trim() === "") {
        throw new Error(`${label} must be a non-empty string.`);
    }
}

export function validateSkillSource(targetArgument, options = {}) {
    const target = loadTarget(targetArgument);
    const manifest = target.manifest;
    if (manifest.schemaVersion !== 1) {
        throw new Error("skill-source manifest.schemaVersion must be 1.");
    }
    if (!Array.isArray(manifest.topics) || manifest.topics.length === 0) {
        throw new Error("skill-source manifest.topics must not be empty.");
    }
    if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
        throw new Error("skill-source manifest.files must not be empty.");
    }

    const inventoryPath = join(target.evidencePath, "inventory.json");
    const claimsPath = join(target.skillSourcePath, "claims.json");
    if (!existsSync(inventoryPath)) {
        throw new Error(
            "Missing evidence/inventory.json; run inventory first.",
        );
    }
    if (!existsSync(claimsPath)) {
        throw new Error("Missing skill-source/claims.json.");
    }
    assertIdentity(
        readJson(inventoryPath),
        target.provenance,
        "evidence inventory",
    );
    const claims = readJson(claimsPath);
    if (!Array.isArray(claims) || claims.length === 0) {
        throw new Error(
            "skill-source/claims.json must contain adjudicated claims.",
        );
    }
    const trackedEvidencePaths = new Set(
        execFileSync("git", ["ls-files", "-z"], {
            cwd: target.checkoutPath,
            encoding: "utf8",
        })
            .split("\0")
            .filter(Boolean)
            .map((path) => path.replaceAll("\\", "/")),
    );

    const sources = new Set();
    const outputs = new Set();
    const kinds = new Set();
    const files = manifest.files.map((entry, index) => {
        if (!entry || typeof entry !== "object") {
            throw new Error(`manifest.files[${index}] must be an object.`);
        }
        if (!allowedKinds.has(entry.kind)) {
            throw new Error(
                `manifest.files[${index}] has unsupported kind ${entry.kind}.`,
            );
        }
        requireString(entry.source, `manifest.files[${index}].source`);
        requireString(entry.output, `manifest.files[${index}].output`);
        const sourcePath = resolveInside(
            target.skillSourcePath,
            entry.source,
            `manifest.files[${index}].source`,
        );
        const output = entry.output.replaceAll("\\", "/");
        resolveInside(
            "/virtual-skill-root",
            output,
            `manifest.files[${index}].output`,
        );
        if (!existsSync(sourcePath))
            throw new Error(`Missing skill source file: ${entry.source}`);
        if (sources.has(entry.source))
            throw new Error(`Duplicate skill source: ${entry.source}`);
        if (outputs.has(output))
            throw new Error(`Duplicate generated output: ${output}`);
        sources.add(entry.source);
        outputs.add(output);
        kinds.add(entry.kind);
        const sha256 = sha256File(sourcePath);
        if (manifest.status === "frozen" && entry.sha256 !== sha256) {
            throw new Error(`Frozen source hash mismatch: ${entry.source}`);
        }
        return { ...entry, output, sha256 };
    });
    for (const output of requiredOutputs) {
        if (!outputs.has(output))
            throw new Error(`Missing required generated output: ${output}`);
    }
    for (const kind of ["api-guardrail", "how-to"]) {
        if (!kinds.has(kind))
            throw new Error(`Missing required ${kind} document.`);
    }

    const topicSet = new Set(manifest.topics);
    if (topicSet.size !== manifest.topics.length) {
        throw new Error("manifest.topics contains duplicates.");
    }
    for (const topic of topicSet) requireString(topic, "manifest topic");

    const claimIds = new Set();
    const claimedTopics = new Set();
    const claimedOutputs = new Set();
    for (const [index, claim] of claims.entries()) {
        const label = `claims[${index}]`;
        requireString(claim.id, `${label}.id`);
        if (claimIds.has(claim.id))
            throw new Error(`Duplicate claim id: ${claim.id}`);
        claimIds.add(claim.id);
        if (!allowedClaimKinds.has(claim.kind)) {
            throw new Error(`${label}.kind is unsupported: ${claim.kind}`);
        }
        requireString(claim.topic, `${label}.topic`);
        if (!topicSet.has(claim.topic)) {
            throw new Error(
                `${label}.topic is not listed in manifest.topics: ${claim.topic}`,
            );
        }
        claimedTopics.add(claim.topic);
        if (claim.kind === "excluded") {
            requireString(claim.reason, `${label}.reason`);
            if (claim.decision !== "excluded") {
                throw new Error(`${label} must use decision=excluded.`);
            }
            continue;
        }
        if (claim.decision !== "accepted") {
            throw new Error(
                `${label} is unresolved; expected decision=accepted.`,
            );
        }
        requireString(claim.summary, `${label}.summary`);
        requireString(claim.owner, `${label}.owner`);
        if (!outputs.has(claim.owner)) {
            throw new Error(
                `${label}.owner is not a generated output: ${claim.owner}`,
            );
        }
        claimedOutputs.add(claim.owner);
        if (!Array.isArray(claim.evidence) || claim.evidence.length === 0) {
            throw new Error(`${label}.evidence must not be empty.`);
        }
        const categories = new Set();
        for (const [evidenceIndex, evidence] of claim.evidence.entries()) {
            const evidenceLabel = `${label}.evidence[${evidenceIndex}]`;
            if (!evidence || typeof evidence !== "object") {
                throw new Error(`${evidenceLabel} must be an object.`);
            }
            if (!allowedEvidenceCategories.has(evidence.category)) {
                throw new Error(`${evidenceLabel}.category is unsupported.`);
            }
            requireString(evidence.path, `${evidenceLabel}.path`);
            const normalizedEvidencePath = normalizeRelativePath(
                evidence.path,
                `${evidenceLabel}.path`,
            );
            if (!trackedEvidencePaths.has(normalizedEvidencePath)) {
                throw new Error(
                    `${evidenceLabel}.path is not tracked by the target commit: ${evidence.path}`,
                );
            }
            categories.add(evidence.category);
            const evidencePath = resolveInside(
                target.checkoutPath,
                normalizedEvidencePath,
                `${evidenceLabel}.path`,
            );
            if (
                !existsSync(evidencePath) ||
                !lstatSync(evidencePath).isFile()
            ) {
                throw new Error(
                    `${evidenceLabel}.path is not a regular tracked file: ${evidence.path}`,
                );
            }
        }
        if (
            claim.kind === "implemented-behavior" &&
            [...categories].every((category) => category === "documentation")
        ) {
            throw new Error(
                `${label} treats documentation-only evidence as implementation.`,
            );
        }
        if (claim.kind === "repository-rule" && !categories.has("gates")) {
            throw new Error(`${label} repository rule lacks gate evidence.`);
        }
    }
    for (const topic of topicSet) {
        if (!claimedTopics.has(topic))
            throw new Error(`Topic has no claim: ${topic}`);
    }
    for (const entry of files.filter((file) =>
        ["api-guardrail", "concept", "how-to"].includes(file.kind),
    )) {
        if (!claimedOutputs.has(entry.output)) {
            throw new Error(
                `Generated knowledge document has no owning claim: ${entry.output}`,
            );
        }
    }

    if (options.freeze) {
        if (manifest.status !== "draft" && manifest.status !== "frozen") {
            throw new Error(
                `Cannot freeze manifest with status ${manifest.status}.`,
            );
        }
        const frozen = { ...manifest, status: "frozen", files };
        writeJsonAtomic(target.manifestPath, frozen);
        target.manifest = frozen;
    } else if (manifest.status !== "draft" && manifest.status !== "frozen") {
        throw new Error(`Unsupported manifest status: ${manifest.status}`);
    }

    return {
        ...target,
        manifest: options.freeze ? readJson(target.manifestPath) : manifest,
        claims,
        fileCount: files.length,
        claimCount: claims.length,
    };
}

function main() {
    const args = process.argv.slice(2);
    const freeze = args.includes("--freeze");
    const positional = args.filter((argument) => argument !== "--freeze");
    if (positional.length !== 1) {
        throw new Error(
            "Usage: validate-skill-source.mjs <prepared-target-path> [--freeze]",
        );
    }
    const result = validateSkillSource(positional[0], { freeze });
    process.stdout.write(
        `${JSON.stringify(
            {
                status: result.manifest.status,
                files: result.fileCount,
                claims: result.claimCount,
            },
            null,
            2,
        )}\n`,
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
