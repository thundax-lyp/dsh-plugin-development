#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync } from "node:fs";
import { join, posix } from "node:path";
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
import { markdownSection, withoutFencedCode } from "./markdown-structure.mjs";
import { renderTaskNavigation } from "./task-navigation.mjs";
import { loadTaskScenarios } from "./task-scenarios.mjs";

const allowedKinds = new Set([
    "entrypoint",
    "metadata",
    "api-guardrail",
    "concept",
    "how-to",
    "example",
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
    "maintenance/source-map.md",
    "maintenance/skill-maintenance.md",
]);
const maxCandidatesPerSection = 12;

function requireString(value, label) {
    if (typeof value !== "string" || value.trim() === "") {
        throw new Error(`${label} must be a non-empty string.`);
    }
}

function readOwnedSection(files, root, output, section, label) {
    const entry = files.find((file) => file.output === output);
    if (!entry || entry.kind !== "api-guardrail") {
        throw new Error(`${label}.owner must be an API reference: ${output}`);
    }
    const body = readFileSync(resolveInside(root, entry.source, label), "utf8");
    const owned = markdownSection(body, section);
    if (!owned || owned.level < 2)
        throw new Error(`${label}.section is missing in ${output}: ${section}`);
    if (!owned.content)
        throw new Error(`${label}.section is empty in ${output}.`);
    return owned.content;
}

export function validateSkillSource(targetArgument, options = {}) {
    const target = loadTarget(targetArgument);
    const manifest = target.manifest;
    if (![1, 2, 3].includes(manifest.schemaVersion)) {
        throw new Error(
            "skill-source manifest.schemaVersion must be 1, 2 or 3.",
        );
    }
    if (
        manifest.taskNavigation !== undefined &&
        (manifest.schemaVersion !== 3 ||
            !["generated", "entrypoint"].includes(manifest.taskNavigation))
    ) {
        throw new Error(
            "taskNavigation requires schema v3 and value generated or entrypoint.",
        );
    }
    if (
        target.provenance.creationContract !== undefined &&
        target.provenance.creationContract !== "entrypoint"
    ) {
        throw new Error("Unsupported prepared target creation contract.");
    }
    if (
        target.provenance.creationContract === "entrypoint" &&
        (manifest.schemaVersion !== 3 ||
            manifest.taskNavigation !== "entrypoint")
    ) {
        throw new Error(
            "Newly prepared targets require schema v3 taskNavigation=entrypoint.",
        );
    }
    if (!Array.isArray(manifest.topics) || manifest.topics.length === 0) {
        throw new Error("skill-source manifest.topics must not be empty.");
    }
    if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
        throw new Error("skill-source manifest.files must not be empty.");
    }

    const inventoryPath = join(target.evidencePath, "inventory.json");
    const candidatesPath = join(
        target.evidencePath,
        "capability-candidates.json",
    );
    const claimsPath = join(target.skillSourcePath, "claims.json");
    const coveragePath = join(target.skillSourcePath, "coverage.json");
    const apiEntriesPath = join(
        target.evidencePath,
        "api-entry-candidates.json",
    );
    const apiSymbolsPath = join(
        target.evidencePath,
        "api-symbol-candidates.json",
    );
    const taskCandidatesPath = join(
        target.evidencePath,
        "task-candidates.json",
    );
    const apiSurfacePath = join(target.skillSourcePath, "api-surface.json");
    if (!existsSync(inventoryPath)) {
        throw new Error(
            "Missing evidence/inventory.json; run inventory first.",
        );
    }
    if (!existsSync(claimsPath)) {
        throw new Error("Missing skill-source/claims.json.");
    }
    if (!existsSync(candidatesPath)) {
        throw new Error(
            "Missing evidence/capability-candidates.json; run inventory first.",
        );
    }
    if (!existsSync(coveragePath)) {
        throw new Error("Missing skill-source/coverage.json.");
    }
    if (manifest.schemaVersion === 3) {
        for (const path of [
            apiEntriesPath,
            apiSymbolsPath,
            taskCandidatesPath,
            apiSurfacePath,
        ]) {
            if (!existsSync(path))
                throw new Error(
                    `Missing ${path}; run inventory and complete API adjudication.`,
                );
        }
    }
    assertIdentity(
        readJson(inventoryPath),
        target.provenance,
        "evidence inventory",
    );
    const claims = readJson(claimsPath);
    const candidateDocument = readJson(candidatesPath);
    assertIdentity(
        candidateDocument,
        target.provenance,
        "capability candidates",
    );
    if (
        candidateDocument.schemaVersion !== 1 ||
        !Array.isArray(candidateDocument.candidates) ||
        candidateDocument.candidates.length === 0
    ) {
        throw new Error(
            "Capability candidates must be a non-empty schema v1 list.",
        );
    }
    const coverage = readJson(coveragePath);
    if (
        coverage.schemaVersion !== manifest.schemaVersion ||
        !Array.isArray(coverage.dispositions)
    ) {
        throw new Error(
            "skill-source/coverage.json must match the manifest schema with dispositions.",
        );
    }
    const taskScenarios = ["generated", "entrypoint"].includes(
        manifest.taskNavigation,
    )
        ? loadTaskScenarios(target, coverage)
        : undefined;
    const controlHashes = {
        claimsSha256: sha256File(claimsPath),
        coverageSha256: sha256File(coveragePath),
        capabilityCandidatesSha256: sha256File(candidatesPath),
        ...(manifest.schemaVersion === 3
            ? {
                  apiEntriesSha256: sha256File(apiEntriesPath),
                  apiSymbolsSha256: sha256File(apiSymbolsPath),
                  taskCandidatesSha256: sha256File(taskCandidatesPath),
                  apiSurfaceSha256: sha256File(apiSurfacePath),
              }
            : {}),
        ...taskScenarios?.hashes,
    };
    if (manifest.status === "frozen") {
        for (const [key, value] of Object.entries(controlHashes)) {
            if (manifest[key] !== value) {
                throw new Error(`Frozen source hash mismatch: ${key}`);
            }
        }
    }
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
        if (
            entry.kind === "example" &&
            (manifest.taskNavigation !== "entrypoint" ||
                !/^references\/example-[^/]+\.md$/.test(output))
        ) {
            throw new Error(
                `Example must be a top-level references/example-*.md in entrypoint mode: ${output}`,
            );
        }
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
    const legacyIndexes = [
        "references/plugin-development-routing.md",
        "references/keyword-index.md",
        "references/terminology.md",
    ];
    if (
        manifest.taskNavigation !== "entrypoint" &&
        legacyIndexes.some((output) => !outputs.has(output))
    ) {
        throw new Error(
            `Missing required generated output: ${legacyIndexes.find((output) => !outputs.has(output))}`,
        );
    }
    if (
        manifest.taskNavigation === "entrypoint" &&
        legacyIndexes.some((output) => outputs.has(output))
    ) {
        throw new Error(
            `Entrypoint must not distribute a separate index: ${legacyIndexes.find((output) => outputs.has(output))}`,
        );
    }
    if (
        manifest.taskNavigation === "entrypoint" &&
        files.some((file) => file.kind === "index")
    ) {
        throw new Error(
            "Entrypoint must keep navigation, terms and keywords in SKILL.md, not separate index files.",
        );
    }
    for (const kind of ["api-guardrail", "how-to"]) {
        if (!kinds.has(kind))
            throw new Error(`Missing required ${kind} document.`);
    }
    const linkedExamples = new Set();

    const topicSet = new Set(manifest.topics);
    if (topicSet.size !== manifest.topics.length) {
        throw new Error("manifest.topics contains duplicates.");
    }
    for (const topic of topicSet) requireString(topic, "manifest topic");

    const subjectReferences = new Map();
    if (manifest.taskNavigation === "entrypoint") {
        const overviews = new Map();
        const subjectsByTopic = new Map();
        for (const file of files.filter(
            (item) => item.kind === "api-guardrail",
        )) {
            requireString(file.topic, `${file.output}.topic`);
            if (!topicSet.has(file.topic)) {
                throw new Error(
                    `${file.output}.topic is not listed in manifest.topics.`,
                );
            }
            if (file.role === "topic") {
                if (overviews.has(file.topic)) {
                    throw new Error(
                        `Duplicate API topic overview: ${file.topic}`,
                    );
                }
                overviews.set(file.topic, file);
            } else if (file.role === "subject") {
                requireString(file.subject, `${file.output}.subject`);
                const siblings = subjectsByTopic.get(file.topic) ?? [];
                if (siblings.some((item) => item.subject === file.subject)) {
                    throw new Error(
                        `Duplicate API subject in ${file.topic}: ${file.subject}`,
                    );
                }
                siblings.push(file);
                subjectsByTopic.set(file.topic, siblings);
                subjectReferences.set(file.output, file);
            } else {
                throw new Error(
                    `${file.output}.role must be topic or subject.`,
                );
            }
        }
        for (const [topic, subjects] of subjectsByTopic) {
            const overview = overviews.get(topic);
            if (!overview)
                throw new Error(
                    `API subject topic needs an overview: ${topic}`,
                );
            const body = readFileSync(
                resolveInside(target.skillSourcePath, overview.source, topic),
                "utf8",
            );
            for (const heading of ["对象关系", "选型与使用"]) {
                if (!markdownSection(body, heading)?.content) {
                    throw new Error(
                        `${overview.output} needs a non-empty ${heading} section.`,
                    );
                }
            }
            for (const subject of subjects) {
                const link = posix.relative(
                    posix.dirname(overview.output),
                    subject.output,
                );
                if (
                    !body.includes(`](${link})`) &&
                    !body.includes(`](${link}#`)
                ) {
                    throw new Error(
                        `${overview.output} must link API subject ${subject.output}.`,
                    );
                }
            }
        }
        for (const topic of overviews.keys()) {
            if (!subjectsByTopic.has(topic))
                throw new Error(`API topic has no subjects: ${topic}`);
        }
    }

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
        if (manifest.taskNavigation === "entrypoint") {
            const apiFile = files.find(
                (file) =>
                    file.output === claim.owner &&
                    file.kind === "api-guardrail",
            );
            if (apiFile && apiFile.topic !== claim.topic) {
                throw new Error(
                    `${label}.topic must match its API reference topic.`,
                );
            }
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

    const candidateIds = new Set();
    for (const [index, candidate] of candidateDocument.candidates.entries()) {
        requireString(candidate?.id, `capability candidates[${index}].id`);
        if (candidateIds.has(candidate.id)) {
            throw new Error(
                `Duplicate capability candidate id: ${candidate.id}`,
            );
        }
        candidateIds.add(candidate.id);
    }
    const disposed = new Set();
    const dispositionIds = new Set();
    const decisionsByCandidate = new Map();
    const sectionLoads = new Map();
    const enforceContentCoverage =
        options.freeze || manifest.status === "frozen";
    const allowedDecisions = new Set(["included", "merged", "excluded"]);
    for (const [index, disposition] of coverage.dispositions.entries()) {
        const label = `coverage.dispositions[${index}]`;
        requireString(disposition?.id, `${label}.id`);
        if (dispositionIds.has(disposition.id)) {
            throw new Error(
                `Duplicate capability disposition id: ${disposition.id}`,
            );
        }
        dispositionIds.add(disposition.id);
        if (!allowedDecisions.has(disposition.decision)) {
            throw new Error(
                `${label}.decision is unsupported: ${disposition.decision}`,
            );
        }
        if (
            !Array.isArray(disposition.candidates) ||
            disposition.candidates.length === 0
        ) {
            throw new Error(`${label}.candidates must not be empty.`);
        }
        for (const candidateId of disposition.candidates) {
            requireString(candidateId, `${label}.candidate`);
            if (!candidateIds.has(candidateId)) {
                throw new Error(
                    `${label} references unknown candidate: ${candidateId}`,
                );
            }
            if (disposed.has(candidateId)) {
                throw new Error(
                    `Capability candidate is disposed more than once: ${candidateId}`,
                );
            }
            disposed.add(candidateId);
            decisionsByCandidate.set(candidateId, disposition.decision);
        }
        if (disposition.decision === "excluded") {
            requireString(disposition.reason, `${label}.reason`);
            continue;
        }
        requireString(disposition.summary, `${label}.summary`);
        if (
            !Array.isArray(disposition.topics) ||
            disposition.topics.length === 0
        ) {
            throw new Error(`${label}.topics must not be empty.`);
        }
        for (const topic of disposition.topics) {
            if (!topicSet.has(topic)) {
                throw new Error(
                    `${label}.topic is not listed in manifest.topics: ${topic}`,
                );
            }
        }
        if (
            !Array.isArray(disposition.owners) ||
            disposition.owners.length === 0
        ) {
            throw new Error(`${label}.owners must not be empty.`);
        }
        for (const owner of disposition.owners) {
            if (!outputs.has(owner)) {
                throw new Error(
                    `${label}.owner is not a generated output: ${owner}`,
                );
            }
            if (!claimedOutputs.has(owner)) {
                throw new Error(
                    `${label}.owner has no accepted claim: ${owner}`,
                );
            }
        }
        if (enforceContentCoverage) {
            requireString(disposition.pluginTask, `${label}.pluginTask`);
            const sections = disposition.ownerSections;
            if (
                !sections ||
                typeof sections !== "object" ||
                Array.isArray(sections)
            ) {
                throw new Error(
                    `${label}.ownerSections must map each owner to a heading.`,
                );
            }
            if (Object.keys(sections).length !== disposition.owners.length) {
                throw new Error(
                    `${label}.ownerSections must match owners exactly.`,
                );
            }
            for (const owner of disposition.owners) {
                requireString(
                    sections[owner],
                    `${label}.ownerSections[${owner}]`,
                );
                const entry = files.find((file) => file.output === owner);
                if (!["api-guardrail", "how-to"].includes(entry.kind)) {
                    throw new Error(
                        `${label}.owner must be an API reference or how-to: ${owner}`,
                    );
                }
                const body = readFileSync(
                    resolveInside(
                        target.skillSourcePath,
                        entry.source,
                        `${label}.owner`,
                    ),
                    "utf8",
                );
                const headings = [
                    ...body.matchAll(/^#{2,6}\s+(.+?)\s*#*\s*$/gm),
                ];
                const headingIndex = headings.findIndex(
                    (match) => match[1] === sections[owner],
                );
                if (headingIndex < 0) {
                    throw new Error(
                        `${label}.ownerSections has no matching heading in ${owner}: ${sections[owner]}`,
                    );
                }
                const start =
                    headings[headingIndex].index +
                    headings[headingIndex][0].length;
                const end = headings[headingIndex + 1]?.index ?? body.length;
                if (body.slice(start, end).trim() === "") {
                    throw new Error(
                        `${label}.ownerSections points to an empty section: ${owner}`,
                    );
                }
                const key = `${owner}\0${sections[owner]}`;
                sectionLoads.set(
                    key,
                    (sectionLoads.get(key) ?? 0) +
                        disposition.candidates.length,
                );
            }
        }
        if (disposition.decision === "merged") {
            requireString(disposition.mergedInto, `${label}.mergedInto`);
            if (enforceContentCoverage) {
                requireString(
                    disposition.relationship,
                    `${label}.relationship`,
                );
            }
        }
    }
    if (enforceContentCoverage) {
        for (const disposition of coverage.dispositions) {
            if (
                disposition.decision === "merged" &&
                decisionsByCandidate.get(disposition.mergedInto) !== "included"
            ) {
                throw new Error(
                    `${disposition.id}.mergedInto must name an included candidate.`,
                );
            }
        }
        for (const [section, count] of sectionLoads) {
            if (count > maxCandidatesPerSection) {
                throw new Error(
                    `Content coverage is too broad: ${count} candidates share ${section.replace("\0", "#")}; split into specific plugin-task sections.`,
                );
            }
        }
    }
    const apiObjects = new Map();
    const objectSections = new Set();
    const subjectObjectCounts = new Map();
    let apiSurface;
    let taskCandidateIds = new Set();
    if (manifest.schemaVersion === 3) {
        const apiEntries = readJson(apiEntriesPath);
        const apiSymbols = readJson(apiSymbolsPath);
        const taskCandidates = readJson(taskCandidatesPath);
        apiSurface = readJson(apiSurfacePath);
        for (const [document, label] of [
            [apiEntries, "API entry candidates"],
            [apiSymbols, "API symbol candidates"],
            [taskCandidates, "task candidates"],
            [apiSurface, "API surface"],
        ]) {
            assertIdentity(document, target.provenance, label);
            if (document.schemaVersion !== 1)
                throw new Error(`${label} must use schema v1.`);
        }
        if (
            !Array.isArray(apiEntries.candidates) ||
            !Array.isArray(apiSymbols.entries) ||
            !Array.isArray(taskCandidates.candidates) ||
            !Array.isArray(apiSurface.entries) ||
            !Array.isArray(apiSurface.objects)
        ) {
            throw new Error(
                "API and task candidate ledgers must contain arrays.",
            );
        }
        const apiCandidateIds = new Set(
            apiEntries.candidates.map((candidate) => candidate.id),
        );
        const symbolEntries = new Map(
            apiSymbols.entries.map((entry) => [entry.entry, entry]),
        );
        if (
            symbolEntries.size !== apiSymbols.entries.length ||
            symbolEntries.size !== apiCandidateIds.size ||
            [...apiCandidateIds].some((id) => !symbolEntries.has(id))
        ) {
            throw new Error(
                "API symbol discovery must cover every API entry candidate exactly once.",
            );
        }
        taskCandidateIds = new Set(
            taskCandidates.candidates.map((candidate) => candidate.id),
        );
        if (
            apiCandidateIds.size !== apiEntries.candidates.length ||
            taskCandidateIds.size !== taskCandidates.candidates.length
        ) {
            throw new Error("API or task candidate ids are duplicated.");
        }
        const apiDecisions = new Map();
        for (const [index, entry] of apiSurface.entries.entries()) {
            const label = `api-surface.entries[${index}]`;
            requireString(entry?.candidate, `${label}.candidate`);
            if (!apiCandidateIds.has(entry.candidate))
                throw new Error(
                    `${label} references unknown API entry: ${entry.candidate}`,
                );
            if (apiDecisions.has(entry.candidate))
                throw new Error(
                    `API entry is disposed more than once: ${entry.candidate}`,
                );
            if (!["included", "excluded"].includes(entry.decision))
                throw new Error(
                    `${label}.decision must be included or excluded.`,
                );
            if (entry.decision === "excluded")
                requireString(entry.reason, `${label}.reason`);
            apiDecisions.set(entry.candidate, entry.decision);
        }
        if (enforceContentCoverage) {
            const missing = [...apiCandidateIds].filter(
                (id) => !apiDecisions.has(id),
            );
            if (missing.length)
                throw new Error(
                    `API entries lack a disposition: ${missing.slice(0, 5).join(", ")}`,
                );
        }
        const objectCounts = new Map();
        const objectsByEntry = new Map();
        for (const [index, object] of apiSurface.objects.entries()) {
            const label = `api-surface.objects[${index}]`;
            requireString(object?.id, `${label}.id`);
            requireString(object.entry, `${label}.entry`);
            requireString(object.symbol, `${label}.symbol`);
            requireString(object.signature, `${label}.signature`);
            requireString(object.source, `${label}.source`);
            if (apiObjects.has(object.id))
                throw new Error(`Duplicate API object id: ${object.id}`);
            if (!apiCandidateIds.has(object.entry))
                throw new Error(
                    `${label} references unknown API entry: ${object.entry}`,
                );
            const source = normalizeRelativePath(
                object.source,
                `${label}.source`,
            );
            if (
                !trackedEvidencePaths.has(source) ||
                !existsSync(
                    resolveInside(target.checkoutPath, source, label),
                ) ||
                !lstatSync(
                    resolveInside(target.checkoutPath, source, label),
                ).isFile()
            ) {
                throw new Error(
                    `${label}.source must be a tracked target file: ${source}`,
                );
            }
            if (!["included", "excluded"].includes(object.decision))
                throw new Error(
                    `${label}.decision must be included or excluded.`,
                );
            if (object.decision === "excluded")
                requireString(object.reason, `${label}.reason`);
            if (!Array.isArray(object.members))
                throw new Error(`${label}.members must be an array.`);
            const memberNames = new Set();
            let content = "";
            if (object.decision === "included") {
                if (apiDecisions.get(object.entry) !== "included")
                    throw new Error(
                        `${label} belongs to an excluded API entry.`,
                    );
                requireString(object.owner, `${label}.owner`);
                requireString(object.section, `${label}.section`);
                if (manifest.taskNavigation === "entrypoint") {
                    if (!subjectReferences.has(object.owner)) {
                        throw new Error(
                            `${label}.owner must be an API subject reference.`,
                        );
                    }
                    if (!object.section.includes(object.symbol)) {
                        throw new Error(
                            `${label}.section must name its API object: ${object.symbol}`,
                        );
                    }
                    const location = `${object.owner}\0${object.section}`;
                    if (objectSections.has(location)) {
                        throw new Error(
                            `${label} shares an API object section: ${object.owner}#${object.section}`,
                        );
                    }
                    objectSections.add(location);
                    subjectObjectCounts.set(
                        object.owner,
                        (subjectObjectCounts.get(object.owner) ?? 0) + 1,
                    );
                }
                if (enforceContentCoverage) {
                    content = readOwnedSection(
                        files,
                        target.skillSourcePath,
                        object.owner,
                        object.section,
                        label,
                    );
                    if (!content.includes(object.symbol))
                        throw new Error(
                            `${label}.symbol is absent from its API reference section: ${object.symbol}`,
                        );
                }
                objectCounts.set(
                    object.entry,
                    (objectCounts.get(object.entry) ?? 0) + 1,
                );
            }
            for (const [memberIndex, member] of object.members.entries()) {
                const memberLabel = `${label}.members[${memberIndex}]`;
                requireString(member?.name, `${memberLabel}.name`);
                requireString(member.signature, `${memberLabel}.signature`);
                if (memberNames.has(member.name))
                    throw new Error(
                        `Duplicate API member: ${object.id}.${member.name}`,
                    );
                memberNames.add(member.name);
                if (!["included", "excluded"].includes(member.decision))
                    throw new Error(
                        `${memberLabel}.decision must be included or excluded.`,
                    );
                if (member.decision === "excluded")
                    requireString(member.reason, `${memberLabel}.reason`);
                if (
                    member.decision === "included" &&
                    object.decision !== "included"
                )
                    throw new Error(
                        `${memberLabel} belongs to an excluded object.`,
                    );
                if (
                    member.decision === "included" &&
                    enforceContentCoverage &&
                    !content.includes(member.name)
                ) {
                    throw new Error(
                        `${memberLabel} is absent from its API reference section: ${member.name}`,
                    );
                }
            }
            apiObjects.set(object.id, object);
            const byName = objectsByEntry.get(object.entry) ?? new Map();
            if (byName.has(object.symbol))
                throw new Error(
                    `Duplicate API symbol adjudication: ${object.entry}:${object.symbol}`,
                );
            byName.set(object.symbol, object);
            objectsByEntry.set(object.entry, byName);
        }
        if (
            enforceContentCoverage &&
            manifest.taskNavigation === "entrypoint"
        ) {
            for (const output of subjectReferences.keys()) {
                if (!subjectObjectCounts.has(output)) {
                    throw new Error(
                        `API subject has no included objects: ${output}`,
                    );
                }
            }
        }
        if (enforceContentCoverage) {
            const empty = [...apiDecisions].filter(
                ([id, decision]) =>
                    decision === "included" && !objectCounts.has(id),
            );
            if (empty.length)
                throw new Error(
                    `Included API entries have no documented objects: ${empty
                        .slice(0, 5)
                        .map(([id]) => id)
                        .join(", ")}`,
                );
            for (const [entryId, decision] of apiDecisions) {
                if (decision !== "included") continue;
                const discovered = symbolEntries.get(entryId);
                if (discovered.status !== "resolved")
                    throw new Error(
                        `Included API entry has unresolved source: ${entryId}`,
                    );
                const objects = objectsByEntry.get(entryId) ?? new Map();
                for (const symbol of discovered.symbols) {
                    const object = objects.get(symbol.name);
                    if (!object)
                        throw new Error(
                            `Public API symbol lacks a disposition: ${entryId}:${symbol.name}`,
                        );
                    if (object.signature !== symbol.signature)
                        throw new Error(
                            `Public API symbol signature differs from target code: ${entryId}:${symbol.name}`,
                        );
                    if (symbol.deprecated && object.decision !== "excluded")
                        throw new Error(
                            `Deprecated API symbol must be excluded: ${entryId}:${symbol.name}`,
                        );
                    const members = new Set(
                        object.members.map((member) => member.name),
                    );
                    for (const member of symbol.members) {
                        if (!members.has(member.name))
                            throw new Error(
                                `Public API member lacks a disposition: ${entryId}:${symbol.name}.${member.name}`,
                            );
                        if (
                            object.members.find(
                                (item) => item.name === member.name,
                            )?.signature !== member.signature
                        ) {
                            throw new Error(
                                `Public API member signature differs from target code: ${entryId}:${symbol.name}.${member.name}`,
                            );
                        }
                        if (
                            member.deprecated &&
                            object.members.find(
                                (item) => item.name === member.name,
                            )?.decision !== "excluded"
                        ) {
                            throw new Error(
                                `Deprecated API member must be excluded: ${entryId}:${symbol.name}.${member.name}`,
                            );
                        }
                    }
                }
                for (const name of objects.keys()) {
                    if (
                        !discovered.symbols.some(
                            (symbol) => symbol.name === name,
                        ) &&
                        objects.get(name).origin !== "module-augmentation"
                    )
                        throw new Error(
                            `API surface contains a symbol absent from discovered exports: ${entryId}:${name}`,
                        );
                }
            }
        }
    }
    if (manifest.schemaVersion >= 2 && enforceContentCoverage) {
        if (
            !Array.isArray(coverage.taskPaths) ||
            coverage.taskPaths.length === 0
        ) {
            throw new Error(
                "coverage.taskPaths must contain adjudicated plugin tasks.",
            );
        }
        const taskIds = new Set();
        const coveredTaskIds = new Set();
        const taskCoveredCandidates = new Set();
        const routing = files.find(
            (file) =>
                file.output === "references/plugin-development-routing.md",
        );
        const routingBody =
            routing &&
            readFileSync(
                resolveInside(
                    target.skillSourcePath,
                    routing.source,
                    "task routing",
                ),
                "utf8",
            );
        const entrypointFile = files.find((file) => file.output === "SKILL.md");
        const entrypointBody = readFileSync(
            resolveInside(
                target.skillSourcePath,
                entrypointFile.source,
                "Skill entrypoint",
            ),
            "utf8",
        );
        if (manifest.taskNavigation === "entrypoint") {
            const headings = [
                "适用范围",
                "插件形态",
                "开发任务",
                "关键对象索引",
                "术语与边界",
                "关键词索引",
                "跨主题不变量",
                "完成边界",
            ];
            let previous = -1;
            for (const heading of headings) {
                const marker = `## ${heading}`;
                const position = entrypointBody.indexOf(marker);
                if (position <= previous) {
                    throw new Error(
                        `SKILL.md needs ordered entrypoint section: ${heading}`,
                    );
                }
                previous = position;
            }
            for (const heading of [
                "适用范围",
                "插件形态",
                "术语与边界",
                "关键词索引",
                "跨主题不变量",
                "完成边界",
            ]) {
                if (!markdownSection(entrypointBody, heading)?.content) {
                    throw new Error(
                        `SKILL.md needs non-empty entrypoint section: ${heading}`,
                    );
                }
            }
            const formSection = markdownSection(
                entrypointBody,
                "插件形态",
            ).content;
            if (
                !files.some(
                    (file) =>
                        file.kind === "how-to" &&
                        formSection.includes(`](${file.output}`),
                )
            ) {
                throw new Error("SKILL.md plugin forms must link to a HOW-TO.");
            }
            if (
                !/\]\(references\/[^)]+\)/.test(
                    markdownSection(entrypointBody, "关键词索引").content,
                )
            ) {
                throw new Error(
                    "SKILL.md keyword index must link to a reference.",
                );
            }
            if (
                !markdownSection(entrypointBody, "开发任务")?.content.includes(
                    "<!-- BEGIN GENERATED TASK NAVIGATION -->",
                ) ||
                !markdownSection(
                    entrypointBody,
                    "关键对象索引",
                )?.content.includes("<!-- BEGIN GENERATED OBJECT INDEX -->")
            ) {
                throw new Error(
                    "SKILL.md must place task and object tables in their named sections.",
                );
            }
        }
        const entrypointLinks = new Set(
            [
                ...withoutFencedCode(entrypointBody)
                    .replace(/`[^`\n]*`/g, "")
                    .matchAll(/\]\(([^)]+)\)/g),
            ].map((match) => decodeURIComponent(match[1])),
        );
        for (const [index, task] of coverage.taskPaths.entries()) {
            const label = `coverage.taskPaths[${index}]`;
            requireString(task?.id, `${label}.id`);
            if (taskIds.has(task.id))
                throw new Error(`Duplicate plugin task id: ${task.id}`);
            taskIds.add(task.id);
            requireString(task.outcome, `${label}.outcome`);
            if (
                !Array.isArray(task.candidates) ||
                task.candidates.length === 0
            ) {
                throw new Error(`${label}.candidates must not be empty.`);
            }
            for (const candidateId of task.candidates) {
                if (!candidateIds.has(candidateId)) {
                    throw new Error(
                        `${label} references unknown candidate: ${candidateId}`,
                    );
                }
            }
            if (task.decision === "excluded") {
                requireString(task.reason, `${label}.reason`);
                continue;
            }
            if (task.decision !== "covered") {
                throw new Error(
                    `${label}.decision must be covered or excluded.`,
                );
            }
            coveredTaskIds.add(task.id);
            if (manifest.schemaVersion === 3) {
                if (
                    !Array.isArray(task.apiObjects) ||
                    (task.apiObjects.length === 0 &&
                        task.configurationOnly !== true)
                )
                    throw new Error(`${label}.apiObjects must not be empty.`);
                for (const objectId of task.apiObjects) {
                    if (apiObjects.get(objectId)?.decision !== "included")
                        throw new Error(
                            `${label} references unknown or excluded API object: ${objectId}`,
                        );
                }
                if (task.apiObjects.length > 1) {
                    if (
                        !Array.isArray(task.compositionSteps) ||
                        task.compositionSteps.length < 2
                    )
                        throw new Error(
                            `${label}.compositionSteps must describe the multi-object sequence.`,
                        );
                    for (const [
                        stepIndex,
                        step,
                    ] of task.compositionSteps.entries())
                        requireString(
                            step,
                            `${label}.compositionSteps[${stepIndex}]`,
                        );
                }
            }
            for (const candidateId of task.candidates) {
                if (
                    !["included", "merged"].includes(
                        decisionsByCandidate.get(candidateId),
                    )
                ) {
                    throw new Error(
                        `${label} references an excluded candidate: ${candidateId}`,
                    );
                }
                taskCoveredCandidates.add(candidateId);
            }
            if (
                !Array.isArray(task.destinations) ||
                task.destinations.length === 0
            ) {
                throw new Error(`${label}.destinations must not be empty.`);
            }
            if (task.entry !== undefined) {
                if (
                    task.entry === null ||
                    typeof task.entry !== "object" ||
                    Array.isArray(task.entry)
                ) {
                    throw new Error(`${label}.entry must be an object.`);
                }
                requireString(task.entry.output, `${label}.entry.output`);
                requireString(task.entry.section, `${label}.entry.section`);
                requireString(task.entry.anchor, `${label}.entry.anchor`);
                if (
                    !task.destinations.some(
                        (destination) =>
                            destination.output === task.entry.output &&
                            destination.section === task.entry.section,
                    )
                ) {
                    throw new Error(
                        `${label}.entry must match one task destination.`,
                    );
                }
                const entryFile = files.find(
                    (file) => file.output === task.entry.output,
                );
                if (entryFile?.kind !== "how-to") {
                    throw new Error(`${label}.entry must point to a HOW-TO.`);
                }
                const entryBody = readFileSync(
                    resolveInside(
                        target.skillSourcePath,
                        entryFile.source,
                        `${label}.entry`,
                    ),
                    "utf8",
                );
                const linkedSection = markdownSection(
                    entryBody,
                    task.entry.section,
                    task.entry.anchor,
                );
                if (!linkedSection || !linkedSection.content) {
                    throw new Error(
                        `${label}.entry anchor does not identify its non-empty section: ${task.entry.output}#${task.entry.anchor}`,
                    );
                }
                const link = `${task.entry.output}#${task.entry.anchor}`;
                if (!entrypointLinks.has(link)) {
                    throw new Error(
                        `${label}.entry is not linked directly from SKILL.md: ${link}`,
                    );
                }
            }
            for (const [
                destinationIndex,
                destination,
            ] of task.destinations.entries()) {
                const destinationLabel = `${label}.destinations[${destinationIndex}]`;
                requireString(
                    destination?.output,
                    `${destinationLabel}.output`,
                );
                requireString(
                    destination.section,
                    `${destinationLabel}.section`,
                );
                const entry = files.find(
                    (file) => file.output === destination.output,
                );
                if (
                    !entry ||
                    !["api-guardrail", "how-to"].includes(entry.kind)
                ) {
                    throw new Error(
                        `${destinationLabel}.output must be an API reference or how-to.`,
                    );
                }
                if (
                    manifest.taskNavigation === "entrypoint" &&
                    entry.kind !== "how-to"
                ) {
                    throw new Error(
                        `${destinationLabel}.output must point to a HOW-TO.`,
                    );
                }
                if (
                    manifest.schemaVersion === 3 &&
                    task.apiObjects.length > 1 &&
                    entry.kind !== "how-to"
                ) {
                    throw new Error(
                        `${label} multi-object task must route to a HOW-TO.`,
                    );
                }
                const body = readFileSync(
                    resolveInside(
                        target.skillSourcePath,
                        entry.source,
                        destinationLabel,
                    ),
                    "utf8",
                );
                const section = markdownSection(body, destination.section);
                if (!section) {
                    throw new Error(
                        `${destinationLabel}.section needs one matching heading in ${destination.output}.`,
                    );
                }
                if (!section.content) {
                    throw new Error(
                        `${destinationLabel}.section is empty in ${destination.output}.`,
                    );
                }
                if (manifest.taskNavigation === "entrypoint") {
                    for (const example of files.filter(
                        (file) => file.kind === "example",
                    )) {
                        const relativeExample = example.output.replace(
                            /^references\//,
                            "",
                        );
                        if (
                            section.content.includes(`](${relativeExample})`) ||
                            section.content.includes(`](${relativeExample}#`)
                        ) {
                            linkedExamples.add(example.output);
                        }
                    }
                }
                const routeBody =
                    manifest.taskNavigation === "entrypoint"
                        ? entrypointBody
                        : routingBody;
                const relative =
                    manifest.taskNavigation === "entrypoint"
                        ? destination.output
                        : destination.output.replace(/^references\//, "");
                if (!routeBody.includes(`](${relative}`)) {
                    throw new Error(
                        `${label} is not routed to ${destination.output}.`,
                    );
                }
            }
            if (
                manifest.schemaVersion === 3 &&
                task.apiObjects.length > 0 &&
                (manifest.taskNavigation === "entrypoint" ||
                    task.apiObjects.length > 1)
            ) {
                const howToSections = task.destinations.map((destination) => {
                    const entry = files.find(
                        (file) => file.output === destination.output,
                    );
                    const body = readFileSync(
                        resolveInside(
                            target.skillSourcePath,
                            entry.source,
                            label,
                        ),
                        "utf8",
                    );
                    return manifest.taskNavigation === "entrypoint"
                        ? markdownSection(body, destination.section).content
                        : body;
                });
                for (const objectId of task.apiObjects) {
                    const object = apiObjects.get(objectId);
                    const relative = object.owner.replace(/^references\//, "");
                    if (
                        !howToSections.some((body) =>
                            body.includes(`](${relative}`),
                        )
                    ) {
                        throw new Error(
                            `${label} HOW-TO does not link API reference for ${objectId}: ${object.owner}`,
                        );
                    }
                }
            }
        }
        if (manifest.taskNavigation === "entrypoint") {
            for (const example of files.filter(
                (file) => file.kind === "example",
            )) {
                if (!linkedExamples.has(example.output)) {
                    throw new Error(
                        `Example must be linked from a task HOW-TO section: ${example.output}`,
                    );
                }
                const exampleBody = readFileSync(
                    resolveInside(
                        target.skillSourcePath,
                        example.source,
                        "example",
                    ),
                    "utf8",
                );
                if (!/^```\w+/m.test(exampleBody)) {
                    throw new Error(
                        `Example must include a fenced code block: ${example.output}`,
                    );
                }
            }
        }
        if (["generated", "entrypoint"].includes(manifest.taskNavigation)) {
            const rendered = renderTaskNavigation(
                coverage,
                files,
                target.skillSourcePath,
                { entrypoint: entrypointBody, routing: routingBody },
                manifest.taskNavigation === "entrypoint"
                    ? apiSurface
                    : undefined,
            );
            if (entrypointBody !== rendered.entrypoint) {
                throw new Error(
                    "SKILL.md task navigation differs from taskPaths; run sync-task-navigation.mjs.",
                );
            }
            if (
                manifest.taskNavigation === "generated" &&
                routingBody !== rendered.routing
            ) {
                throw new Error(
                    "Task routing differs from taskPaths; run sync-task-navigation.mjs.",
                );
            }
        }
        if (manifest.schemaVersion === 3) {
            if (!Array.isArray(coverage.taskDiscoveries))
                throw new Error("coverage.taskDiscoveries must be an array.");
            const discovered = new Set();
            for (const [index, item] of coverage.taskDiscoveries.entries()) {
                const label = `coverage.taskDiscoveries[${index}]`;
                requireString(item?.candidate, `${label}.candidate`);
                if (!taskCandidateIds.has(item.candidate))
                    throw new Error(
                        `${label} references unknown task candidate: ${item.candidate}`,
                    );
                if (discovered.has(item.candidate))
                    throw new Error(
                        `Task candidate is disposed more than once: ${item.candidate}`,
                    );
                discovered.add(item.candidate);
                if (item.decision === "excluded")
                    requireString(item.reason, `${label}.reason`);
                else if (item.decision === "included") {
                    requireString(item.taskId, `${label}.taskId`);
                    if (!coveredTaskIds.has(item.taskId))
                        throw new Error(
                            `${label} references an unknown or excluded task path: ${item.taskId}`,
                        );
                } else
                    throw new Error(
                        `${label}.decision must be included or excluded.`,
                    );
            }
            const missing = [...taskCandidateIds].filter(
                (id) => !discovered.has(id),
            );
            if (missing.length)
                throw new Error(
                    `Task candidates lack a disposition: ${missing.slice(0, 5).join(", ")}`,
                );
        }
        const missingTaskCandidates = [...decisionsByCandidate]
            .filter(
                ([, decision]) =>
                    decision === "included" || decision === "merged",
            )
            .map(([id]) => id)
            .filter((id) => !taskCoveredCandidates.has(id));
        if (missingTaskCandidates.length) {
            throw new Error(
                `Included capabilities lack a plugin task path: ${missingTaskCandidates.slice(0, 5).join(", ")}`,
            );
        }
    }
    const undisposed = [...candidateIds].filter((id) => !disposed.has(id));
    if (undisposed.length > 0) {
        throw new Error(
            `Capability candidates lack a disposition (${undisposed.length}): ${undisposed.slice(0, 5).join(", ")}`,
        );
    }
    const coverageCounts = Object.fromEntries(
        [...allowedDecisions].map((decision) => [
            decision,
            coverage.dispositions
                .filter((entry) => entry.decision === decision)
                .reduce((total, entry) => total + entry.candidates.length, 0),
        ]),
    );

    if (options.freeze) {
        if (manifest.status !== "draft" && manifest.status !== "frozen") {
            throw new Error(
                `Cannot freeze manifest with status ${manifest.status}.`,
            );
        }
        const frozen = {
            ...manifest,
            ...controlHashes,
            status: "frozen",
            files,
        };
        writeJsonAtomic(target.manifestPath, frozen);
        target.manifest = frozen;
    } else if (manifest.status !== "draft" && manifest.status !== "frozen") {
        throw new Error(`Unsupported manifest status: ${manifest.status}`);
    }

    return {
        ...target,
        manifest: options.freeze ? readJson(target.manifestPath) : manifest,
        claims,
        coverage,
        coverageCounts,
        capabilityCount: candidateIds.size,
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
                capabilities: result.capabilityCount,
                coverage: result.coverageCounts,
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
