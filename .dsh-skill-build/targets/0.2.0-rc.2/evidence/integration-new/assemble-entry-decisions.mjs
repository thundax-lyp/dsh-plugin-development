import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const target = process.argv[2];
if (!target) throw new Error("Pass the target directory.");
const read = (path) => JSON.parse(readFileSync(join(target, path), "utf8"));
const optional = (path) => existsSync(join(target, path)) ? read(path) : null;
const surface = read("skill-source/api-surface.json");
const coverage = read("skill-source/coverage.json");
const candidates = new Map(read("evidence/api-entry-candidates.json").candidates.map((candidate) => [candidate.id, candidate]));
const packageDecision = new Map();
for (const disposition of coverage.dispositions) {
    for (const candidate of disposition.candidates) if (candidate.startsWith("package:")) packageDecision.set(candidate, disposition);
}
const host = read("evidence/host-core-new/recommendations.json");
const client = read("evidence/client-web-new/recommendations.json");
const infra = read("evidence/infra-runtime-new/recommendations.json");
const provider = optional("evidence/infra-runtime-new/provider-recommendations.json");
const audits = [
    ...(infra.entryDispositions ?? []),
    ...(provider?.entryDispositions ?? []),
    ...(optional("evidence/infra-runtime-new/extended-audit.json")?.entries ?? []),
    ...(host.relatedEntryAudit ?? []),
    ...client.entryRecommendations.filter((item) => item.decision === "merged" || item.decision === "excluded"),
    ...(optional("evidence/client-web-new/entry-audit.json")?.entries ?? []),
    ...(optional("evidence/integration-new/root-entry-audit.json")?.entries ?? []),
];
const byAudit = new Map(audits.map((record) => [record.candidate, record]));
const unresolved = [];
for (const entry of surface.entries) {
    if (entry.decision === "included" || entry.decision === "excluded") continue;
    const candidate = candidates.get(entry.candidate);
    const disposition = packageDecision.get(`package:${candidate.package}`);
    const audit = byAudit.get(entry.candidate);
    if (disposition?.decision === "excluded") {
        entry.decision = "excluded";
        entry.reason = `${candidate.package}${candidate.subpath}：所属包已裁决为不承担独立插件作者入口。${disposition.reason}`;
        continue;
    }
    if (audit?.decision === "excluded") {
        entry.decision = "excluded";
        entry.reason = audit.reason;
        continue;
    }
    if (audit?.decision === "merged") {
        entry.decision = "excluded";
        entry.reason = `${audit.reason} 重复或辅助子路径归入 ${audit.mergedInto ?? audit.owner ?? "关联入口"}，不另设权威对象小节。`;
        continue;
    }
    if (disposition && ["included", "merged"].includes(disposition.decision)) {
        if (/^\.\/(?:types|invariant|typert|brand|protocol|stream-protocol|presentation)$/.test(candidate.subpath)) {
            entry.decision = "excluded";
            entry.reason = `${candidate.package}${candidate.subpath} 是所属包的类型、生成、门禁或呈现辅助子路径；本 Skill 的插件任务以已纳入的公开主入口和正文契约为权威，不将该辅助子路径重复写成独立对象。`;
            continue;
        }
        if (candidate.subpath === "./remote") {
            entry.decision = "excluded";
            entry.reason = `${candidate.package} 的 ./remote 是 Typert 生成的 Client artifact，消费时按 Remote 发布 HOW-TO 接入；不是可手写的独立 Host/Client 对象契约。`;
            continue;
        }
        if (candidate.subpath === "./worker/profile-resolution-bootstrap") {
            entry.decision = "excluded";
            entry.reason = "Profile resolution worker bootstrap 是 dsh-app-boot 的内部启动工件；插件作者通过 Profile manifest 和 bundle patch 装载，不直接导入 worker 入口。";
            continue;
        }
        if (candidate.subpath === ".") {
            entry.decision = "excluded";
            entry.reason = `${candidate.package} 的包根只暴露构建/Host 侧入口；插件任务使用已纳入的 ${candidate.package}/client 或其他子路径。`;
            continue;
        }
    }
    unresolved.push(candidate);
}
writeFileSync(join(target, "skill-source/api-surface.json"), `${JSON.stringify(surface, null, 4)}\n`);
writeFileSync(join(target, "evidence/integration-new/pending-api-entries.json"), `${JSON.stringify(unresolved, null, 4)}\n`);
process.stdout.write(`${surface.entries.filter((entry) => entry.decision === "included").length} included, ${surface.entries.filter((entry) => entry.decision === "excluded").length} excluded, ${unresolved.length} pending API entries\n`);
