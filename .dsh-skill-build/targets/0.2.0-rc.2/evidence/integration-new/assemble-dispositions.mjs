import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const target = process.argv[2];
if (!target) throw new Error("Pass the target directory.");
const read = (path) => JSON.parse(readFileSync(join(target, path), "utf8"));
const optional = (path) => existsSync(join(target, path)) ? read(path) : null;
const coverage = read("skill-source/coverage.json");
const manifest = read("skill-source/manifest.json");
const surface = read("skill-source/api-surface.json");
const host = read("evidence/host-core-new/recommendations.json");
const client = read("evidence/client-web-new/recommendations.json");
const infra = read("evidence/infra-runtime-new/recommendations.json");
const profile = read("evidence/integration-new/profile-recommendations.json");
const provider = optional("evidence/infra-runtime-new/provider-recommendations.json");
const inventory = read("evidence/integration-new/package-inventory.json");
const candidates = read("evidence/capability-candidates.json").candidates;
const byPackage = new Map(inventory.packages.map((item) => [item.candidate, item]));
const fileByOutput = new Map(manifest.files.map((file) => [file.output, file]));
const byTask = new Map(coverage.taskPaths.map((task) => [task.id, task]));
const aliases = new Map([
    ["register-host-prompt-section", "guard-host-tool-execution"],
    ["register-authorization-flow", "store-plugin-credential"],
]);
const selected = new Map();
const choose = (candidate, task, decision = "included", reason = "") => {
    task = aliases.get(task) ?? task;
    if (!byTask.has(task)) throw new Error(`Unknown task for ${candidate}: ${task}`);
    if (selected.has(candidate)) {
        if (selected.get(candidate).task === task) return;
        if (candidate.startsWith("composition:") && task === "ship-profile-bundle") {
            selected.set(candidate, { task, decision, reason });
            return;
        }
        throw new Error(`Conflicting task for ${candidate}: ${selected.get(candidate).task}, ${task}`);
    }
    selected.set(candidate, { task, decision, reason });
};
for (const record of host.recommendations) {
    for (const candidate of record.capabilityCandidateIds ?? []) choose(candidate, record.proposedTaskIds?.[0]);
}
for (const record of client.capabilityRecommendations) choose(record.candidate, record.taskId, record.decision);
for (const record of infra.capabilities) choose(record.candidate, record.task, record.decision);
for (const record of profile.capabilities) choose(record.candidate, record.task, record.decision);
for (const record of provider?.capabilities ?? []) {
    if (record.decision === "excluded" || record.decision === "needs-owner") continue;
    const task = record.task ?? ({
        "package:@deepseek-ai/dsh-web": "register-web-provider",
        "package:@deepseek-ai/dsh-lsp": "register-lsp-provider",
        "package:@deepseek-ai/dsh-skill": "register-skill-provider",
        "package:@deepseek-ai/dsh-mcp-resources": "register-mcp-resource-provider",
        "package:@deepseek-ai/dsh-fs": "consume-filesystem-service",
        "package:@deepseek-ai/dsh-subprocess": "execute-confined-command",
        "package:@deepseek-ai/dsh-sandbox": "execute-confined-command",
        "package:@deepseek-ai/dsh-shell": "execute-confined-command",
        "package:@deepseek-ai/dsh-terminal": "use-agent-pty",
        "package:@deepseek-ai/dsh-spill": "save-host-artifacts",
        "package:@deepseek-ai/dsh-attachment": "save-host-artifacts",
        "package:@deepseek-ai/dsh-ptc-runtime": "run-ptc-program",
        "package:@deepseek-ai/dsh-experimental-speech-to-text": "register-speech-provider",
        "package:@deepseek-ai/dsh-browser-use": "mount-browser-use-provider",
        "package:@deepseek-ai/dsh-computer-use": "mount-computer-use-provider",
    })[record.into];
    if (!task) throw new Error(`Provider task missing: ${record.candidate}`);
    choose(record.candidate, task, record.decision, record.reason);
}
for (const [candidate, task] of [
    ["cookbook:adding-a-package", "ship-profile-bundle"],
    ["cookbook:adding-a-tool", "register-host-tool"],
    ["cookbook:adding-an-llm-adapter", "register-llm-adapter"],
    ["cookbook:adding-a-remote-api", "host-publish-remote"],
    ["cookbook:adding-a-settings-card", "client-settings-card"],
]) if (byTask.has(task)) choose(candidate, task);
for (const object of surface.objects.filter((item) => item.decision === "included")) {
    const packageName = object.entry.match(/^export:([^:]+):/)?.[1];
    const candidate = `package:${packageName}`;
    if (!byPackage.has(candidate) || selected.has(candidate)) continue;
    const task = coverage.taskPaths.find((path) => path.apiObjects.includes(object.id));
    if (task) choose(candidate, task.id);
}
const clientAudit = optional("evidence/client-web-new/capability-audit.json");
const hostAudit = optional("evidence/host-core-new/capability-audit.json");
const infraAudit = optional("evidence/infra-runtime-new/capability-audit.json");
const externalAudits = [
    provider?.capabilities?.filter((item) => item.decision === "excluded"),
    optional("evidence/infra-runtime-new/extended-audit.json")?.capabilities,
    infraAudit?.candidates?.map((item) => ({ ...item, candidate: item.candidateId })),
    clientAudit?.dispositions?.map((item) => item.decision === "merged"
        ? { ...item, decision: "excluded", reason: `${item.reason} 本次由通用 Client 扩展契约指导，不以该内置功能包作为第三方插件入口。` }
        : item),
    hostAudit?.candidates?.map((item) => ({ ...item, candidate: item.candidateId })),
    optional("evidence/integration-new/root-capability-audit.json")?.capabilities,
    optional("evidence/integration-new/root-package-audit.json")?.capabilities,
].flatMap((items) => items ?? []);
const audit = new Map();
const auditConflicts = [];
for (const item of externalAudits) {
    if (!item.candidate) continue;
    if (audit.has(item.candidate) && audit.get(item.candidate).decision !== item.decision) {
        auditConflicts.push({ candidate: item.candidate, earlier: audit.get(item.candidate), final: item });
    }
    audit.set(item.candidate, item);
}
const primary = new Map([
    ["ship-profile-bundle", "package:@deepseek-ai/dsh"],
    ["expose-live-config", "package:@deepseek-ai/dsh-settings"],
    ["persist-plugin-records", "package:@deepseek-ai/dsh-storage"],
    ["register-web-provider", "package:@deepseek-ai/dsh-web"],
    ["register-lsp-provider", "package:@deepseek-ai/dsh-lsp"],
    ["register-skill-provider", "package:@deepseek-ai/dsh-skill"],
    ["register-mcp-resource-provider", "package:@deepseek-ai/dsh-mcp-resources"],
    ["consume-filesystem-service", "package:@deepseek-ai/dsh-fs"],
    ["execute-confined-command", "package:@deepseek-ai/dsh-subprocess"],
    ["use-agent-pty", "package:@deepseek-ai/dsh-terminal"],
    ["save-host-artifacts", "package:@deepseek-ai/dsh-spill"],
    ["run-ptc-program", "package:@deepseek-ai/dsh-ptc-runtime"],
    ["register-speech-provider", "package:@deepseek-ai/dsh-experimental-speech-to-text"],
    ["mount-browser-use-provider", "package:@deepseek-ai/dsh-browser-use"],
    ["mount-computer-use-provider", "package:@deepseek-ai/dsh-computer-use"],
]);
const dispositions = [];
const pending = [];
for (const candidate of candidates) {
    const chosen = selected.get(candidate.id);
    const reviewed = audit.get(candidate.id);
    if (!chosen && (!reviewed || reviewed.decision === "needs-entry-review" || reviewed.decision === "pending")) {
        pending.push(candidate);
        continue;
    }
    if (!chosen && reviewed.decision === "excluded") {
        dispositions.push({ id: `disposition-${dispositions.length + 1}`, candidates: [candidate.id], decision: "excluded", reason: reviewed.reason });
        continue;
    }
    const taskId = chosen?.task ?? reviewed.taskId ?? reviewed.task;
    const task = byTask.get(taskId);
    if (!task) {
        pending.push(candidate);
        continue;
    }
    if (!task.candidates.includes(candidate.id)) task.candidates.push(candidate.id);
    const object = surface.objects.find((item) => item.decision === "included" && item.entry.startsWith(`export:${candidate.id.replace(/^package:/, "")}:`));
    const composition = candidate.id.startsWith("composition:");
    const output = composition ? "references/api-infra-profile-manifest.md" : object?.owner ?? task.destinations[0].output;
    const section = composition ? "DshBundleManifest" : object?.section ?? task.destinations[0].section;
    const topic = fileByOutput.get(output)?.topic ?? (taskId.startsWith("client-") ? "client-web" : taskId.startsWith("infra-") || taskId === "ship-profile-bundle" || taskId === "install-profile-bundle" || taskId === "parse-app-args" ? "infra-profile" : "host-core");
    const description = byPackage.get(candidate.id)?.description;
    const decision = chosen?.decision === "merged" ? "merged" : "included";
    const record = {
        id: `disposition-${dispositions.length + 1}`,
        candidates: [candidate.id],
        decision,
        topics: [topic],
        owners: [output],
        summary: description ? `${candidate.id}：${description}` : `${candidate.id} 支持「${task.outcome}」任务。`,
        pluginTask: task.outcome,
        ownerSections: { [output]: section },
    };
    if (decision === "merged") {
        record.mergedInto = primary.get(taskId) ?? task.candidates.find((id) => id !== candidate.id && selected.get(id)?.decision !== "merged");
        record.relationship = `${candidate.id} 是「${task.outcome}」组合中的具体 Profile 层或后端实现；主候选记录共同装载步骤。`;
        if (!record.mergedInto) throw new Error(`No primary candidate for ${candidate.id}`);
    }
    dispositions.push(record);
}
coverage.dispositions = dispositions;
writeFileSync(join(target, "skill-source/coverage.json"), `${JSON.stringify(coverage, null, 4)}\n`);
writeFileSync(join(target, "evidence/integration-new/pending-capabilities.json"), `${JSON.stringify(pending, null, 4)}\n`);
writeFileSync(join(target, "evidence/integration-new/capability-audit-conflicts.json"), `${JSON.stringify(auditConflicts, null, 4)}\n`);
process.stdout.write(`${dispositions.length} dispositions; ${pending.length} capability candidates pending; ${auditConflicts.length} audit conflicts resolved by later audit\n`);
