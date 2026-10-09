import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const target = process.argv[2];
if (!target) throw new Error("Pass the target directory.");
const read = (path) => JSON.parse(readFileSync(join(target, path), "utf8"));
const manifest = read("skill-source/manifest.json");
const surface = read("skill-source/api-surface.json");
const coverage = read("skill-source/coverage.json");
const host = read("evidence/host-core-new/recommendations.json");
const client = read("evidence/client-web-new/recommendations.json");
const infra = read("evidence/infra-runtime-new/recommendations.json");
const profile = read("evidence/integration-new/profile-recommendations.json");
const taskCandidates = read("evidence/task-candidates.json").candidates;
const candidateIds = new Set(read("evidence/capability-candidates.json").candidates.map((candidate) => candidate.id));
const fileByOutput = new Map(manifest.files.map((file) => [file.output, file]));
const routes = new Map([
    ["provide-host-service", "host-service.md"],
    ["register-host-tool", "host-tool.md"],
    ["guard-host-tool-execution", "host-prompt-policy.md"],
    ["register-host-prompt-section", "host-prompt-policy.md"],
    ["scope-agent-capability", "host-agent-scope.md"],
    ["register-host-command", "host-command.md"],
    ["record-host-session-fact", "host-session-event.md"],
    ["register-llm-adapter", "host-llm-adapter.md"],
    ["store-plugin-credential", "host-credentials.md"],
    ["register-authorization-flow", "host-credentials.md"],
    ["implement-session-persistence", "host-persistence.md"],
    ["provide-directory-picker", "host-directory-picker.md"],
    ["provide-compaction-backend", "host-compaction.md"],
    ["register-session-title-provider", "host-session-title.md"],
    ["register-shell-environment-fact", "host-shell-env.md"],
    ["manage-session-goal", "host-goal.md"],
    ["register-background-job", "host-jobs.md"],
    ["provide-subagent-backend", "host-subagent.md"],
    ["ask-user-question", "host-user-questions.md"],
    ["run-host-workflow", "host-workflow.md"],
    ["register-scoped-contribution", "host-scope.md"],
    ["query-session-history", "host-session-query.md"],
    ["register-session-message-projection", "host-session-surface.md"],
    ["fork-host-session", "host-session-fork.md"],
    ["replay-assistant-stream", "host-llm-message.md"],
    ["client-load-web-half", "client-web-package.md"],
    ["client-contribute-slot", "client-slot-contribution.md"],
    ["client-call-remote", "client-remote-call.md"],
    ["host-publish-remote", "client-publish-remote.md"],
    ["client-settings-card", "client-settings-card.md"],
    ["ship-profile-bundle", "infra-profile-bundle.md#1"],
    ["install-profile-bundle", "infra-profile-bundle.md#2"],
    ["expose-live-config", "infra-live-config.md"],
    ["persist-plugin-records", "infra-persistence.md"],
    ["respond-to-webhook", "infra-webhook.md"],
    ["register-http-route", "infra-http-route.md"],
    ["parse-app-args", "infra-app-args.md"],
    ["register-web-provider", "infra-provider-web.md"],
    ["register-lsp-provider", "infra-provider-lsp.md"],
    ["register-skill-provider", "infra-provider-skill.md"],
    ["register-mcp-resource-provider", "infra-provider-mcp-resources.md"],
    ["consume-filesystem-service", "infra-provider-fs.md"],
    ["install-invariant-companion", "infra-invariants.md"],
    ["host-file-reference-provider", "client-file-reference-provider.md"],
    ["host-workspace-registry", "client-workspace-registry.md"],
    ["host-workspace-changes", "client-workspace-changes.md"],
    ["execute-confined-command", "infra-provider-execution.md"],
    ["use-agent-pty", "infra-provider-terminal.md"],
    ["save-host-artifacts", "infra-provider-artifacts.md"],
    ["run-ptc-program", "infra-provider-ptc.md"],
    ["register-speech-provider", "infra-provider-speech.md"],
    ["mount-browser-use-provider", "infra-provider-browser-use.md"],
    ["mount-computer-use-provider", "infra-provider-computer-use.md"],
]);
const normalize = (taskId) => routes.get(taskId) ?? `${taskId}.md`;
const byRoute = new Map();
const addCandidate = (taskId, candidate) => {
    if (!candidateIds.has(candidate)) return;
    const route = normalize(taskId).replace(/#\d+$/, "");
    const list = byRoute.get(route) ?? new Set();
    list.add(candidate);
    byRoute.set(route, list);
};
for (const record of host.recommendations) {
    for (const candidate of record.capabilityCandidateIds ?? []) {
        for (const task of record.proposedTaskIds ?? []) addCandidate(task, candidate);
    }
}
for (const record of client.capabilityRecommendations) addCandidate(record.taskId, record.candidate);
for (const record of infra.capabilities) addCandidate(record.task, record.candidate);
for (const record of profile.capabilities) addCandidate(record.task, record.candidate);
for (const record of JSON.parse(readFileSync(join(target, "evidence/infra-runtime-new/provider-recommendations.json"), "utf8")).capabilities ?? []) {
    if (record.task) addCandidate(record.task, record.candidate);
}
const cookbookTask = new Map([
    ["cookbook:adding-a-package", "ship-profile-bundle"],
    ["cookbook:adding-a-tool", "register-host-tool"],
    ["cookbook:adding-an-llm-adapter", "register-llm-adapter"],
    ["cookbook:adding-a-remote-api", "host-publish-remote"],
    ["cookbook:adding-a-settings-card", "client-settings-card"],
]);
for (const [candidate, task] of cookbookTask) addCandidate(task, candidate);

const taskPaths = [];
const byTask = new Map();
const provider = JSON.parse(readFileSync(join(target, "evidence/infra-runtime-new/provider-recommendations.json"), "utf8"));
for (const file of manifest.files.filter((entry) => entry.kind === "how-to")) {
    const body = readFileSync(join(target, "skill-source", file.source), "utf8");
    const headings = [...body.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim());
    for (const [index, heading] of headings.entries()) {
        const route = file.source.replace(/^how-to\//, "");
        const taskId = [...routes].find(([, value]) => value === `${route}#${index + 1}`)?.[0]
            ?? [...routes].find(([, value]) => value === route)?.[0]
            ?? route.replace(/\.md$/, "");
        if (byTask.has(taskId)) continue;
        const start = body.indexOf(`## ${heading}`);
        const next = body.indexOf("\n## ", start + 4);
        const section = body.slice(start, next < 0 ? undefined : next);
        const linked = [...section.matchAll(/\]\((?:\.\/)?(api-[^)#]+\.md)(?:#([^)]+))?\)/g)];
        const selectedObjects = [];
        for (const [, basename, anchor] of linked) {
            const owner = `references/${basename}`;
            const options = surface.objects.filter((object) => object.decision === "included" && object.owner === owner);
            const exact = options.find((object) => anchor && anchor.toLowerCase() === object.section.replace(/`/g, "").toLowerCase());
            const object = exact ?? options[0];
            if (object && !selectedObjects.includes(object.id)) selectedObjects.push(object.id);
        }
        const candidates = [...(byRoute.get(route) ?? [])];
        if (candidates.length === 0) {
            const fallback = surface.objects.find((object) => selectedObjects.includes(object.id));
            if (fallback) {
                const packageName = fallback.entry.match(/^export:([^:]+):/)?.[1];
                const candidate = `package:${packageName}`;
                if (candidateIds.has(candidate)) candidates.push(candidate);
            }
        }
        const task = {
            id: taskId,
            decision: "covered",
            outcome: heading,
            candidates,
            apiObjects: selectedObjects,
            ...(selectedObjects.length === 0 ? { configurationOnly: true } : {}),
            ...(selectedObjects.length > 1 ? { compositionSteps: ["在对应运行侧装载所需服务并确认依赖可用。", "按 HOW-TO 顺序注册对象、调用功能并在卸载时清理。"] } : {}),
            destinations: [{ output: file.output, section: heading }],
        };
        if (taskId === "register-host-tool") {
            task.entry = { output: file.output, section: heading, anchor: "让-agent-调用一个可取消的模型工具" };
            task.userIntents = ["注册一个可取消的 Agent Tool", "创建 DSH 模型工具"];
        }
        taskPaths.push(task);
        byTask.set(taskId, task);
    }
}
const taskRecommendations = [
    ...client.taskRecommendations.map((item) => ({ candidate: item.candidate, task: item.taskId })),
    ...infra.tasks.filter((item) => item.candidate).map((item) => ({ candidate: item.candidate, task: item.task })),
    ...profile.tasks.map((item) => ({ candidate: item.candidate, task: item.task })),
    ...((JSON.parse(readFileSync(join(target, "evidence/infra-runtime-new/provider-recommendations.json"), "utf8")).tasks ?? []).filter((item) => item.candidate).map((item) => ({ candidate: item.candidate, task: item.task }))),
];
for (const item of taskRecommendations) {
    const path = taskPaths.find((task) => task.id === item.task);
    if (!path) continue;
    const disposition = coverage.taskDiscoveries.find((entry) => entry.candidate === item.candidate);
    if (disposition) Object.assign(disposition, { decision: "included", taskId: path.id });
}
coverage.taskPaths = taskPaths;
for (const manual of provider.manualTaskPaths ?? []) {
    const task = byTask.get(manual.task);
    if (!task) throw new Error(`Manual task has no HOW-TO section: ${manual.task}`);
    if (task.destinations[0].output !== manual.destination) throw new Error(`Manual task destination mismatch: ${manual.task}`);
    task.candidates = [...new Set([...task.candidates, ...manual.candidates])];
    task.apiObjects = [...new Set([...task.apiObjects, ...manual.apiObjects])];
    delete task.configurationOnly;
    if (task.apiObjects.length > 1 && !task.compositionSteps) task.compositionSteps = ["按 HOW-TO 的运行侧和依赖顺序取得对象。", "按顺序调用、验证结果并在卸载时清理。"];
}
writeFileSync(join(target, "skill-source/coverage.json"), `${JSON.stringify(coverage, null, 4)}\n`);
process.stdout.write(`${taskPaths.length} task paths; ${taskPaths.filter((task) => !task.candidates.length).length} lack a capability candidate; ${taskPaths.filter((task) => !task.apiObjects.length).length} configuration-only\n`);
