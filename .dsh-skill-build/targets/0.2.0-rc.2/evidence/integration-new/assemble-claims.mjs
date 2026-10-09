import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const target = process.argv[2];
if (!target) throw new Error("Pass the target directory.");
const read = (path) => JSON.parse(readFileSync(join(target, path), "utf8"));
const manifest = read("skill-source/manifest.json");
const surface = read("skill-source/api-surface.json");
const candidates = read("evidence/api-entry-candidates.json");
const host = read("evidence/host-core-new/recommendations.json");
const client = read("evidence/client-web-new/recommendations.json");
const infra = read("evidence/infra-runtime-new/recommendations.json");
let provider = { entries: [] };
try { provider = read("evidence/infra-runtime-new/provider-recommendations.json"); } catch (error) { if (error.code !== "ENOENT") throw error; }
const entries = new Map(candidates.candidates.map((candidate) => [candidate.id, candidate]));
const recs = new Map([
    ...host.recommendations.map((record) => [record.apiEntryCandidate, record]),
    ...client.entryRecommendations.map((record) => [record.candidate, record]),
    ...infra.entries.map((record) => [record.candidate, record]),
    ...(provider.entries ?? []).map((record) => [record.candidate, record]),
]);
const outputEvidence = new Map();
const topicEvidence = new Map();
for (const object of surface.objects.filter((item) => item.decision === "included")) {
    const path = object.source;
    if (!outputEvidence.has(object.owner)) outputEvidence.set(object.owner, path);
    const topic = manifest.files.find((file) => file.output === object.owner)?.topic;
    if (topic && !topicEvidence.has(topic)) topicEvidence.set(topic, path);
}
const claims = [];
for (const [index, file] of manifest.files.entries()) {
    if (!["api-guardrail", "how-to", "concept"].includes(file.kind)) continue;
    const body = readFileSync(join(target, "skill-source", file.source), "utf8");
    let topic = file.topic;
    let path = outputEvidence.get(file.output);
    if (!topic || !path) {
        const related = [...body.matchAll(/\]\((api-[^)#]+\.md)(?:#[^)]+)?\)/g)]
            .map((match) => `references/${match[1]}`)
            .find((output) => outputEvidence.has(output));
        topic ??= manifest.files.find((entry) => entry.output === related)?.topic;
        path ??= outputEvidence.get(related);
    }
    topic ??= file.kind === "how-to" && file.source.includes("infra-")
        ? file.source.includes("persistence") ? "infra-persistence" : file.source.includes("webhook") || file.source.includes("http-route") ? "infra-integration" : "infra-profile"
        : file.source.includes("client-") ? "client-web" : "host-core";
    path ??= topicEvidence.get(topic);
    if (!path) throw new Error(`Missing evidence: ${file.output}`);
    const heading = body.match(/^#\s+(.+)$/m)?.[1] ?? file.output;
    claims.push({
        id: `claim-${String(index + 1).padStart(3, "0")}`,
        kind: file.kind === "api-guardrail" ? "implemented-behavior" : "derived-guidance",
        decision: "accepted",
        topic,
        owner: file.output,
        summary: `${heading}：依据目标版本公开入口及实现整理插件使用契约。`,
        evidence: [{ category: "public-api", path }],
    });
}
writeFileSync(join(target, "skill-source/claims.json"), `${JSON.stringify(claims, null, 4)}\n`);
process.stdout.write(`${claims.length} owner claims\n`);
