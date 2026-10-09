import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { buildApiSurfaceCandidates } from "../../../../../.agents/skills/create-dsh-skill/scripts/initialize-capability-coverage.mjs";

const target = process.argv[2];
if (!target) throw new Error("Pass the target directory.");
const read = (path) => JSON.parse(readFileSync(join(target, path), "utf8"));
const host = read("evidence/host-core-new/recommendations.json");
const client = read("evidence/client-web-new/recommendations.json");
const infra = read("evidence/infra-runtime-new/recommendations.json");
const profile = read("evidence/integration-new/profile-recommendations.json");
let provider = { entries: [] };
try { provider = read("evidence/infra-runtime-new/provider-recommendations.json"); } catch (error) { if (error.code !== "ENOENT") throw error; }
const discovered = read("evidence/api-symbol-candidates.json");
const candidates = read("evidence/api-entry-candidates.json");
for (const field of ["version", "tag", "commit", "remote"]) {
    if (discovered[field] !== candidates[field]) throw new Error(`API candidate identity mismatch: ${field}`);
}
const seed = {
    schemaVersion: 1,
    version: discovered.version,
    tag: discovered.tag,
    commit: discovered.commit,
    remote: discovered.remote,
    ...buildApiSurfaceCandidates(candidates, discovered),
};
const manifest = read("skill-source/manifest.json");
const files = new Map(manifest.files.map((file) => [file.output, file]));
const byEntry = new Map(discovered.entries.map((entry) => [entry.entry, entry]));
const byObject = new Map(seed.objects.map((object) => [object.id, object]));
const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: join(target, "checkout"), encoding: "utf8" }).split("\0").filter(Boolean);
const trackedSet = new Set(tracked);
const contentCache = new Map();
const sourceFor = (original, candidate, symbol) => {
    if (trackedSet.has(original)) return original;
    const base = candidate.path.replace(/\/package\.json$/, "");
    const direct = original.replace("/lib/types/", "/src/").replace(/\.d\.ts$/, ".ts");
    if (trackedSet.has(direct)) return direct;
    const files = tracked.filter((path) => path.startsWith(`${base}/src/`) && /\.[cm]?tsx?$/.test(path));
    const exact = files.find((path) => {
        let content = contentCache.get(path);
        if (content === undefined) {
            content = readFileSync(join(target, "checkout", path), "utf8");
            contentCache.set(path, content);
        }
        return new RegExp(`\\b${symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(content);
    });
    return exact ?? (trackedSet.has(`${base}/src/index.ts`) ? `${base}/src/index.ts` : candidate.path);
};
const selected = new Map();
const sectionOverrides = new Map([
    ["export:@deepseek-ai/dsh-agent-loop:.:Config", "AgentLoop Config"],
    ["export:@deepseek-ai/dsh-experimental-speech-to-text:.:default", "SpeechToText default"],
]);
const push = (id, record) => {
    if (selected.has(id)) throw new Error(`Duplicate entry recommendation: ${id}`);
    selected.set(id, record);
};
for (const record of host.recommendations) push(record.apiEntryCandidate, { ...record, group: "host" });
for (const record of client.entryRecommendations.filter((item) => item.decision === "included")) push(record.candidate, { ...record, group: "client" });
for (const record of infra.entries) push(record.candidate, { ...record, group: "infra" });
for (const record of provider.entries ?? []) push(record.candidate, { ...record, group: "infra-provider" });
for (const record of profile.entries) push(record.candidate, { ...record, group: "infra-profile-root" });

const entries = [];
const objects = [];
for (const candidate of candidates.candidates) {
    const rec = selected.get(candidate.id);
    if (!rec) {
        entries.push({ candidate: candidate.id, decision: "pending" });
        continue;
    }
    if (byEntry.get(candidate.id)?.status !== "resolved") throw new Error(`Unresolved selected entry: ${candidate.id}`);
    entries.push({ candidate: candidate.id, decision: "included" });
    const kept = new Map(rec.objects.map((object) => [object.symbol, object]));
    for (const symbol of byEntry.get(candidate.id).symbols) {
        const source = byObject.get(`${candidate.id}:${symbol.name}`);
        if (!source) throw new Error(`Missing symbol seed: ${candidate.id}:${symbol.name}`);
        const choice = kept.get(symbol.name);
        const object = structuredClone(source);
        object.source = sourceFor(object.source, candidate, symbol.name);
        if (!choice || symbol.deprecated) {
            object.decision = "excluded";
            object.reason = symbol.deprecated
                ? `${symbol.name} 在目标声明中标为 deprecated；常规插件任务不得使用。`
                : `${symbol.name} 不是本入口已核实插件任务直接调用、实现或挂载的对象；本次任务由同入口的已纳入对象承担。`;
            object.members = object.members.map((member) => ({
                ...member,
                decision: "excluded",
                reason: `所属 ${symbol.name} 对象未纳入常规插件任务。`,
            }));
            objects.push(object);
            continue;
        }
        const owner = choice.owner ?? choice.ownerSection?.split("#")[0] ?? `references/${rec.owner}`;
        if (!files.has(owner)) throw new Error(`Unknown object owner: ${owner}`);
        const section = choice.section ?? sectionOverrides.get(object.id) ?? choice.symbol;
        object.decision = "included";
        object.owner = owner;
        object.section = section;
        const wanted = new Set(choice.retainMembers ?? choice.members ?? []);
        object.members = object.members.map((member) => ({
            ...member,
            decision: !member.deprecated && wanted.has(member.name) ? "included" : "excluded",
            ...(!member.deprecated && wanted.has(member.name)
                ? {}
                : { reason: member.deprecated
                    ? `${symbol.name}.${member.name} 在目标声明中标为 deprecated。`
                    : `${symbol.name}.${member.name} 不参与该对象在本 Skill 已核实的插件任务契约。` }),
        }));
        objects.push(object);
    }
    for (const name of kept.keys()) {
        if (!byEntry.get(candidate.id).symbols.some((symbol) => symbol.name === name)) {
            throw new Error(`Recommended symbol not discovered: ${candidate.id}:${name}`);
        }
    }
}
const compareId = (left, right) => left < right ? -1 : left > right ? 1 : 0;
const out = {
    ...seed,
    entries: entries.sort((left, right) => compareId(left.candidate, right.candidate)),
    objects: objects.sort((left, right) => compareId(left.id, right.id)),
};
writeFileSync(join(target, "skill-source/api-surface.json"), `${JSON.stringify(out, null, 4)}\n`);
process.stdout.write(`${selected.size} included entries, ${objects.filter((object) => object.decision === "included").length} included objects; ${entries.filter((entry) => entry.decision === "pending").length} entry decisions pending\n`);
