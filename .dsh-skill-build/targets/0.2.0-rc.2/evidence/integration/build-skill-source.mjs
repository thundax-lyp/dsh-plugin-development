#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const target = new URL("../../", import.meta.url).pathname.replace(/\/$/, "");
const evidence = join(target, "evidence");
const source = join(target, "skill-source");
const checkout = join(target, "checkout");

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const write = (path, value) => {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, value.endsWith("\n") ? value : `${value}\n`);
};
const writeJson = (path, value) => write(path, `${JSON.stringify(value, null, 2)}\n`);

const provenance = readJson(join(target, "provenance.json"));
const capabilities = readJson(join(evidence, "capability-candidates.json")).candidates;
const apiEntries = readJson(join(evidence, "api-entry-candidates.json")).candidates;
const apiSymbols = readJson(join(evidence, "api-symbol-candidates.json")).entries;
const taskCandidates = readJson(join(evidence, "task-candidates.json")).candidates;
const host = readJson(join(evidence, "host-core/recommendations.json"));
const client = readJson(join(evidence, "client-web/recommendations.json"));
const infra = readJson(join(evidence, "infra-runtime/recommendations.json"));

const hostCapability = new Map(host.capabilityRecommendations.map((item) => [item.id, item]));
const clientCapability = new Map(client.capabilityRecommendations.map((item) => [item.candidate, item]));
const infraCapability = new Map(Object.entries(infra.capabilityCandidateDispositions));

const topics = ["host-core", "client-web", "infra-runtime"];
const ownerOutput = {
    "host-core": "references/api-host-core.md",
    "client-web": "references/api-client-web.md",
    "infra-runtime": "references/api-infra-runtime.md",
};

function themeOf(id) {
    if (clientCapability.has(id)) return "client-web";
    if (hostCapability.has(id)) return "host-core";
    if (infraCapability.has(id)) return "infra-runtime";
    if (/client|web|conversation|sidebar|slot|settings-card|remote-api|voice-input/.test(id)) return "client-web";
    if (/attachment|boot|browser-use|computer-use|credential|filesystem|\bfs\b|lsp|mcp|otel|ptc|sandbox|shell|spill|ssh|storage|subprocess|telemetry|typert|webhook|package|vendored/.test(id)) return "infra-runtime";
    return "host-core";
}

const intentionallyIncluded = new Set();
for (const item of host.capabilityRecommendations) if (item.decision === "included") intentionallyIncluded.add(item.id);
for (const item of client.capabilityRecommendations) if (item.decision === "included") intentionallyIncluded.add(item.candidate);
for (const [id, item] of infraCapability) if (item.decision === "included") intentionallyIncluded.add(id);
for (const id of ["cookbook:adding-a-package", "cookbook:adding-a-tool", "cookbook:adding-an-llm-adapter"]) intentionallyIncluded.add(id);

function sectionFor(theme, id) {
    if (theme === "host-core") {
        if (/tool/.test(id)) return "Tool runtime and definition";
        if (/llm|model/.test(id)) return "LLM provider and adapter";
        if (/session-query/.test(id)) return "Session query";
        if (/session|persistence|projection|title|token-meter/.test(id)) return "Session extension and persistence";
        if (/command|approval|question/.test(id)) return "Commands, approval, and questions";
        if (/goal|plan|todo/.test(id)) return "Goal, plan, and todo";
        if (/job/.test(id)) return "Jobs";
        if (/skill/.test(id)) return "Skills";
        if (/subagent|agent-team/.test(id)) return "Subagents";
        if (/workflow/.test(id)) return "Workflows";
        if (/hook/.test(id)) return "External hooks";
        if (/feedback/.test(id)) return "Feedback";
        if (/guard|timeout|repeat/.test(id)) return "Guards";
        if (/system-prompt|context|scope/.test(id)) return "System prompt composition";
        return "Agent, Session, and scope";
    }
    if (theme === "client-web") {
        if (/remote|api-|typert/.test(id)) return "Remote 对象与成员";
        if (/setting|config/.test(id)) return "Settings 对象与成员";
        if (/store/.test(id)) return "Store";
        if (/slot|ui-|conversation|sidebar|renderer/.test(id)) return "`SlotMap`、`SlotEntryDef` 与注册";
        return "Client 包与装载契约";
    }
    if (/attachment/.test(id)) return "Attachment 与 credential 所有权";
    if (/credential|authorization/.test(id)) return "Attachment 与 credential 所有权";
    if (/filesystem|\bfs\b|storage|spill/.test(id)) return "Filesystem、storage 与 spill";
    if (/shell|subprocess|sandbox|ssh/.test(id)) return "Shell、subprocess 与 sandbox";
    if (/lsp|mcp|ptc/.test(id)) return "LSP、MCP 与 PTC";
    if (/webhook/.test(id)) return "Webhook 生命周期";
    if (/webserver|host-web|web-server/.test(id)) return "Web route 生命周期";
    if (/browser-use|computer-use/.test(id)) return "Browser 与 computer provider 选择";
    if (/preset|typert|remote/.test(id)) return "Preset 与 Typert Remote";
    return "Package and bundle declaration";
}

function inclusionSummary(theme, id) {
    if (theme === "host-core") return `目标 tag 中用于 Host/Core 插件任务的公开能力：${id}。`;
    if (theme === "client-web") return `目标 tag 中用于 Client/Web/Remote 插件任务的公开能力：${id}。`;
    return `目标 tag 中用于基础设施 provider、组合或 Remote 插件任务的公开能力：${id}。`;
}

function exclusionReason(id) {
    const h = hostCapability.get(id);
    const c = clientCapability.get(id);
    const i = infraCapability.get(id);
    const supplied = h?.reason ?? c?.summary ?? i?.reason;
    if (supplied) return `${supplied} It is retained as target-version evidence, not a separate plugin-author contract.`;
    if (/maintaining|reviewing|responding|session-format|vendored/.test(id)) return "This is repository maintenance, release history, review workflow, or vendoring work rather than an external plugin extension contract.";
    if (id.startsWith("subsystems:")) return "This subsystem page is documentation evidence for an included public package seam; it is not a second independently callable plugin capability.";
    if (id === "package:@deepseek-ai/dsh") return "The CLI is the profile launcher and management surface; plugins integrate through package manifests, bundles, and public services rather than importing the application executable.";
    return "Target inspection found a first-party implementation, product composition, support package, or documentation index, but no independent plugin-author task that requires this candidate as its own contract.";
}

const capabilityDispositions = capabilities.map((candidate, index) => {
    const id = candidate.id;
    if (!intentionallyIncluded.has(id)) {
        return {
            id: `cap-${String(index + 1).padStart(3, "0")}`,
            decision: "excluded",
            candidates: [id],
            reason: exclusionReason(id),
        };
    }
    const theme = themeOf(id);
    const owner = ownerOutput[theme];
    return {
        id: `cap-${String(index + 1).padStart(3, "0")}`,
        decision: "included",
        candidates: [id],
        topics: [theme],
        owners: [owner],
        summary: inclusionSummary(theme, id),
        pluginTask:
            theme === "host-core"
                ? "实现、挂载并卸载一个 Host/Core 插件能力，并观察其规范结果或持久事实。"
                : theme === "client-web"
                  ? "构建并装载 Client/Remote/UI 插件半边，在浏览器观察结果并验证卸载。"
                  : "把 provider 或基础设施插件打包进目标 Profile，观察调用并验证资源清理。",
        ownerSections: { [owner]: sectionFor(theme, id) },
    };
});

const hostObjectByKey = new Map(host.apiObjectRecommendations.map((item) => [`${item.entry}:${item.symbol}`, item]));
const clientObjectByKey = new Map(client.apiObjects.map((item) => [`${item.entry}:${item.symbol}`, item]));
const discoveredByEntry = new Map(apiSymbols.map((entry) => [entry.entry, entry]));

function resolveHostObject(id) {
    const split = id.lastIndexOf(":");
    const packageName = id.slice(0, split);
    const symbol = id.slice(split + 1);
    return host.apiObjectRecommendations.find((item) => item.symbol === symbol && item.entry.includes(`${packageName}:`));
}

const selectedHost = new Map();
for (const task of host.taskPaths) {
    for (const id of task.apiObjects ?? []) {
        const object = resolveHostObject(id);
        if (object) selectedHost.set(`${object.entry}:${object.symbol}`, object);
    }
}
for (const symbol of ["AgentRegistry", "AgentHandle", "CommandRuntime", "ApprovalService", "GoalService", "JobRegistry", "SkillRegistry", "SubagentRuntime", "WorkflowEngine", "runHook"]) {
    const object = host.apiObjectRecommendations.find((item) => item.symbol === symbol);
    if (object) selectedHost.set(`${object.entry}:${object.symbol}`, object);
}

const selectedClient = new Map();
for (const task of client.taskPaths) {
    for (const id of task.apiObjects ?? []) {
        const object = clientObjectByKey.get(id);
        if (object) selectedClient.set(id, object);
    }
}
for (const symbol of ["SlotMap", "SlotCore", "defineStore", "createSnapshotStore", "ConfigForm", "ConfigForms", "TypertGatewayService", "ClientRemote"]) {
    const object = client.apiObjects.find((item) => item.symbol === symbol);
    if (object) selectedClient.set(`${object.entry}:${object.symbol}`, object);
}

const infraSymbols = new Set([
    "DshPackageManifest",
    "DshManifest",
    "DshBundleManifest",
    "DshProfileManifest",
    "DshClientManifest",
    "AttachmentStore",
    "CredentialProvider",
    "AuthorizationService",
    "FileSystem",
    "LspService",
    "McpResourceRuntime",
    "PtcRuntime",
    "SandboxProvider",
    "SandboxPolicyService",
    "ShellExecutor",
    "SpillStore",
    "Storage",
    "Domain",
    "SubprocessRuntime",
    "WebServer",
    "WebhookRuntime",
    "AgentPresetRegistry",
    "TypertRemoteService",
]);
const selectedInfra = new Map();
for (const entry of apiSymbols) {
    if (host.apiEntryRecommendations.some((item) => item.id === entry.entry)) continue;
    if (client.apiEntries.some((item) => item.candidate === entry.entry)) continue;
    for (const symbol of entry.symbols ?? []) {
        if (!infraSymbols.has(symbol.name)) continue;
        const object = {
            entry: entry.entry,
            symbol: symbol.name,
            signature: symbol.signature,
            source: symbol.source ?? entry.source,
            deprecated: symbol.deprecated,
            members: symbol.members ?? [],
        };
        selectedInfra.set(`${entry.entry}:${symbol.name}`, object);
    }
}

const semanticText = {
    "host-core": `${readFileSync(join(source, "api-guardrails/host-core.md"), "utf8")}\n${readFileSync(join(source, "how-to/host-core.md"), "utf8")}`,
    "client-web": `${readFileSync(join(source, "api-guardrails/client-web.md"), "utf8")}\n${readFileSync(join(source, "how-to/client-web.md"), "utf8")}`,
    "infra-runtime": `${readFileSync(join(source, "api-guardrails/infra-runtime.md"), "utf8")}\n${readFileSync(join(source, "how-to/infra-runtime.md"), "utf8")}`,
};

function includesWord(text, name) {
    return text.includes(name);
}

function selectedSurface(theme, selected) {
    const rows = [];
    for (const object of selected.values()) {
        const discovered = discoveredByEntry.get(object.entry)?.symbols?.find((item) => item.name === object.symbol);
        if (!discovered || discovered.deprecated) continue;
        const members = (discovered.members ?? []).filter((member) => !member.deprecated && includesWord(semanticText[theme], member.name));
        rows.push({ ...object, signature: discovered.signature, source: discovered.source ?? object.source, members });
    }
    return rows;
}

const surfaces = {
    "host-core": selectedSurface("host-core", selectedHost),
    "client-web": selectedSurface("client-web", selectedClient),
    "infra-runtime": selectedSurface("infra-runtime", selectedInfra),
};

const surfaceOutput = {
    "host-core": "references/api-host-core-surface.md",
    "client-web": "references/api-client-web-surface.md",
    "infra-runtime": "references/api-infra-runtime-surface.md",
};
const surfaceSection = {
    "host-core": "Host/Core task API",
    "client-web": "Client/Web task API",
    "infra-runtime": "Infrastructure task API",
};

const selectedObjectMap = new Map();
for (const theme of topics) for (const object of surfaces[theme]) selectedObjectMap.set(`${object.entry}:${object.symbol}`, { theme, object });

const manualDeprecated = new Set(client.manualApiMemberRecommendations.map((item) => `${item.objectId}:${item.member}`));
const apiSurfaceEntries = [];
const apiSurfaceObjects = [];
for (const entry of apiEntries) {
    const selected = [...selectedObjectMap].filter(([, value]) => value.object.entry === entry.id);
    if (selected.length === 0) {
        apiSurfaceEntries.push({
            candidate: entry.id,
            decision: "excluded",
            reason: "This published subpath is not required by the selected plugin-author tasks; it remains in the discovery ledger as target-version evidence.",
        });
        continue;
    }
    apiSurfaceEntries.push({ candidate: entry.id, decision: "included" });
    const discovered = discoveredByEntry.get(entry.id);
    for (const symbol of discovered.symbols ?? []) {
        const key = `${entry.id}:${symbol.name}`;
        const chosen = selectedObjectMap.get(key);
        if (!chosen) {
            apiSurfaceObjects.push({
                id: key,
                entry: entry.id,
                symbol: symbol.name,
                signature: symbol.signature,
                source: symbol.source ?? discovered.source,
                decision: "excluded",
                reason: symbol.deprecated
                    ? "The target declaration marks this symbol deprecated, so it is excluded from new-plugin guidance."
                    : "This public symbol is not used by the selected end-to-end plugin tasks; documenting it would broaden the Skill beyond its task boundary.",
                members: (symbol.members ?? []).map((member) => ({
                    name: member.name,
                    signature: member.signature,
                    decision: "excluded",
                    reason: member.deprecated
                        ? "The target declaration marks this member deprecated."
                        : "The parent symbol is outside the selected task surface.",
                })),
            });
            continue;
        }
        const includedMembers = new Set(chosen.object.members.map((member) => member.name));
        apiSurfaceObjects.push({
            id: key,
            entry: entry.id,
            symbol: symbol.name,
            signature: symbol.signature,
            source: symbol.source ?? discovered.source,
            decision: "included",
            owner: surfaceOutput[chosen.theme],
            section: surfaceSection[chosen.theme],
            members: (symbol.members ?? []).map((member) => {
                const manualKey = `${key}:${member.name}`;
                const include = includedMembers.has(member.name) && !member.deprecated && !manualDeprecated.has(manualKey);
                return {
                    name: member.name,
                    signature: member.signature,
                    decision: include ? "included" : "excluded",
                    ...(include
                        ? {}
                        : {
                              reason:
                                  member.deprecated || manualDeprecated.has(manualKey)
                                      ? "The target declaration or adjoining JSDoc marks this member deprecated; use the documented replacement."
                                      : "The selected plugin tasks do not call this direct member; the parent object's documented task contract is narrower.",
                          }),
                };
            }),
        });
    }
}

function surfaceMarkdown(theme) {
    const title = surfaceSection[theme];
    const semantic = theme === "host-core" ? "api-host-core.md" : theme === "client-web" ? "api-client-web.md" : "api-infra-runtime.md";
    const lines = [
        `# ${title}`,
        "",
        `本页锁定 \`${provenance.tag}\` 的任务所需公开对象和直接成员；运行语义、生命周期与失败边界见 [对应 guardrail](${semantic})。未列入的公开符号仍在 \`api-surface.json\` 中逐项裁决，但不进入常规插件指导。`,
        "",
        `## ${title}`,
        "",
    ];
    for (const object of surfaces[theme]) {
        lines.push(`**\`${object.symbol}\`**`, "", `- Entry: \`${object.entry}\``, `- Signature: \`${object.signature}\``, `- Source: \`${object.source}\``);
        if (object.members.length) {
            lines.push("", "| Member | Signature | Task use |", "| --- | --- | --- |", ...object.members.map((member) => `| \`${member.name}\` | \`${member.signature.replaceAll("|", "\\|")}\` | Used by the task contract in the linked guardrail. |`));
        } else {
            lines.push("", "No directly declared member is needed beyond the callable/type signature for the selected task.");
        }
        lines.push("");
    }
    return lines.join("\n");
}

for (const theme of topics) write(join(source, `api-guardrails/${theme}-surface.md`), surfaceMarkdown(theme));

const includedByTheme = Object.fromEntries(topics.map((theme) => [theme, capabilityDispositions.filter((item) => item.decision === "included" && item.topics[0] === theme).flatMap((item) => item.candidates)]));

const taskObjects = {
    "host-core": surfaces["host-core"].slice(0, 6).map((object) => `${object.entry}:${object.symbol}`),
    "client-web": surfaces["client-web"].slice(0, 6).map((object) => `${object.entry}:${object.symbol}`),
    "infra-runtime": surfaces["infra-runtime"].slice(0, 6).map((object) => `${object.entry}:${object.symbol}`),
};

function resolveTaskObjects(refs, theme) {
    const resolved = [];
    for (const ref of refs ?? []) {
        if (selectedObjectMap.has(ref)) {
            resolved.push(ref);
            continue;
        }
        const symbol = ref.slice(ref.lastIndexOf(":") + 1);
        const packageName = ref.slice(0, ref.lastIndexOf(":"));
        const match = [...selectedObjectMap.keys()].find((key) => key.endsWith(`:${symbol}`) && key.includes(packageName));
        if (match) resolved.push(match);
    }
    return [...new Set(resolved)].length ? [...new Set(resolved)] : taskObjects[theme];
}

function stepsOf(steps) {
    return (steps ?? []).map((step) => typeof step === "string" ? step : step.step).filter(Boolean);
}

function hostTaskIdFor(value) {
    const text = value.toLowerCase();
    if (/llm|model|adapter/.test(text)) return "add-llm-adapter";
    if (/projection|persistence|session-query|session-state/.test(text)) return "persist-derived-session-state";
    if (/command|approval|question/.test(text)) return "add-command-and-approval";
    if (/goal|plan|todo/.test(text)) return "manage-goal";
    if (/job/.test(text)) return "run-background-job";
    if (/skill/.test(text)) return "provide-skills";
    if (/subagent|agent-team/.test(text)) return "delegate-subagent";
    if (/workflow|ralph/.test(text)) return "run-workflow";
    if (/hook/.test(text)) return "run-external-hook";
    if (/context|instruction|time|tmux|reference/.test(text)) return "add-context-provider";
    if (/system-prompt|prompt/.test(text)) return "extend-system-prompt";
    return "register-host-tool";
}

function clientTaskIdFor(value) {
    const text = value.toLowerCase();
    if (/setting|config/.test(text)) return "client-web-live-settings";
    if (/slot|ui-|sidebar|conversation|client-module|hmr/.test(text)) return "client-web-slot";
    if (/web-fetch|web-search|tool-web|web-server/.test(text)) return "client-web-web-provider";
    if (/document|deliverable|office/.test(text)) return "client-web-deliverable-document";
    if (/cordis-client-runner|cordis-host-runner|ui-cordis|dynamic/.test(text)) return "client-web-dynamic-extension";
    if (/terminal/.test(text)) return "client-web-terminal";
    if (/workspace/.test(text)) return "client-web-workspace";
    return "client-web-add-remote";
}

function infraTaskIdFor(value) {
    const text = value.toLowerCase();
    if (/webhook|webserver|web-server|route/.test(text)) return "infra-web-route-and-webhook";
    if (/remote|typert|preset/.test(text)) return "infra-remote-and-preset-composition";
    if (/browser-use|computer-use/.test(text)) return "infra-experimental-browser-computer-provider-selection";
    if (/attachment|credential|authorization|filesystem|\bfs\b|lsp|mcp|ptc|sandbox|shell|spill|storage|subprocess|ssh/.test(text)) return "infra-resource-seams-and-providers";
    return "infra-package-and-compose-infrastructure-plugin";
}

const candidateBuckets = new Map();
for (const task of host.taskPaths) candidateBuckets.set(task.id, []);
for (const task of client.taskPaths) candidateBuckets.set(task.id, []);
for (const capability of infra.capabilities) candidateBuckets.set(`infra-${capability.capability}`, []);
for (const candidate of includedByTheme["host-core"]) candidateBuckets.get(hostTaskIdFor(candidate))?.push(candidate);
for (const candidate of includedByTheme["client-web"]) candidateBuckets.get(clientTaskIdFor(candidate))?.push(candidate);
for (const candidate of includedByTheme["infra-runtime"]) candidateBuckets.get(infraTaskIdFor(candidate))?.push(candidate);

// Every independently adjudicated task needs a capability owner. When naming
// alone leaves a bucket empty, move one candidate from the largest task in the
// same theme so every included capability still has exactly one task owner.
for (const ids of [
    host.taskPaths.map((task) => task.id),
    client.taskPaths.map((task) => task.id),
    infra.capabilities.map((capability) => `infra-${capability.capability}`),
]) {
    for (const id of ids) {
        if (candidateBuckets.get(id)?.length) continue;
        const donor = ids
            .map((candidateId) => [candidateId, candidateBuckets.get(candidateId)] )
            .filter(([, values]) => values.length > 1)
            .sort((left, right) => right[1].length - left[1].length)[0];
        if (!donor) throw new Error(`No capability candidate can own task ${id}`);
        candidateBuckets.get(id).push(donor[1].pop());
    }
}

const taskPaths = [
    ...host.taskPaths.map((task) => ({
        id: task.id,
        outcome: task.outcome,
        decision: "covered",
        candidates: candidateBuckets.get(task.id),
        apiObjects: resolveTaskObjects(task.apiObjects, "host-core"),
        compositionSteps: stepsOf(task.compositionSteps),
        destinations: [{ output: "references/how-to-host-core.md", section: task.id }],
    })),
    ...client.taskPaths.map((task) => ({
        id: task.id,
        outcome: task.outcome,
        decision: "covered",
        candidates: candidateBuckets.get(task.id),
        apiObjects: resolveTaskObjects(task.apiObjects, "client-web"),
        compositionSteps: stepsOf(task.compositionSteps),
        destinations: [{
            output: "references/how-to-client-web.md",
            section: ({
                "client-web-add-remote": "Host 入口与 Remote",
                "client-web-live-settings": "设置页面",
                "client-web-slot": "Client 入口与 slot",
                "client-web-web-provider": "Web provider",
                "client-web-deliverable-document": "Deliverable 与文档界面",
                "client-web-dynamic-extension": "动态 Host 与 Client 扩展",
                "client-web-terminal": "Terminal Remote",
                "client-web-workspace": "Workspace Remote",
            })[task.id],
        }],
    })),
    ...infra.capabilities.map((capability) => ({
        id: `infra-${capability.capability}`,
        outcome: capability.taskPath.result,
        decision: "covered",
        candidates: candidateBuckets.get(`infra-${capability.capability}`),
        apiObjects: resolveTaskObjects(capability.objects.map((symbol) => `:${symbol}`), "infra-runtime"),
        compositionSteps: stepsOf(capability.taskPath.compositionSteps),
        destinations: [{ output: "references/how-to-infra-runtime.md", section: capability.capability === "package-and-compose-infrastructure-plugin" ? "Procedure" : "Completion criteria" }],
    })),
];

function taskIdFor(candidate) {
    const combined = `${candidate.path} ${candidate.title}`.toLowerCase();
    if (/client|web|remote|setting|config|slot|ui-|sidebar|conversation/.test(combined)) return clientTaskIdFor(combined);
    if (/package|bundle|profile|attachment|credential|filesystem|\bfs\b|storage|shell|sandbox|subprocess|ssh|mcp|lsp|ptc|webhook|browser-use|computer-use/.test(combined)) return infraTaskIdFor(combined);
    return hostTaskIdFor(combined);
}

const hostTaskMap = new Map(host.taskCandidateRecommendations.map((item) => [item.id, item]));
const clientTaskMap = new Map(client.taskDiscoveries.map((item) => [item.candidate, item]));
const infraTaskMap = new Map(Object.entries(infra.taskCandidateDispositions));

const taskDiscoveries = taskCandidates.map((candidate) => {
    const c = clientTaskMap.get(candidate.id);
    const h = hostTaskMap.get(candidate.id);
    const i = infraTaskMap.get(candidate.id);
    const explicitInclude = c?.decision === "included" || h?.decision === "included" || h?.decision === "merged" || i?.decision === "included" || i?.decision === "merged";
    const tutorialInclude = /docs\/(?:cookbook|cordis-tutorial)\//.test(candidate.path) && !/maintenance|review|vendored|session-format/.test(`${candidate.path} ${candidate.title}`.toLowerCase());
    if (explicitInclude || tutorialInclude) return { candidate: candidate.id, decision: "included", taskId: c?.taskId && taskPaths.some((task) => task.id === c.taskId) ? c.taskId : taskIdFor(candidate) };
    let reason = c?.reason ?? h?.reason ?? i?.reason;
    if (!reason) {
        if (/persistence-changes|upgrade|postmortem|release/.test(candidate.path)) reason = "Historical format, migration, release, or incident material is evidence, not a current plugin-author task.";
        else if (/\.github|tests|benchmarks|development/.test(candidate.path)) reason = "Repository operations, fixtures, benchmarks, or contributor setup do not define an external plugin task.";
        else if (/\.zh\.md$/.test(candidate.path)) reason = "This translated or paired heading does not add a distinct task beyond the owning current contract.";
        else reason = "The heading is navigation, configuration description, product usage, or implementation maintenance rather than an observable plugin-author outcome.";
    }
    return { candidate: candidate.id, decision: "excluded", reason };
});

const files = [
    { source: "entrypoint/SKILL.md", output: "SKILL.md", kind: "entrypoint" },
    { source: "metadata/openai.yaml", output: "agents/openai.yaml", kind: "metadata" },
    { source: "api-guardrails/host-core.md", output: "references/api-host-core.md", kind: "api-guardrail" },
    { source: "api-guardrails/host-core-surface.md", output: "references/api-host-core-surface.md", kind: "api-guardrail" },
    { source: "api-guardrails/client-web.md", output: "references/api-client-web.md", kind: "api-guardrail" },
    { source: "api-guardrails/client-web-surface.md", output: "references/api-client-web-surface.md", kind: "api-guardrail" },
    { source: "api-guardrails/infra-runtime.md", output: "references/api-infra-runtime.md", kind: "api-guardrail" },
    { source: "api-guardrails/infra-runtime-surface.md", output: "references/api-infra-runtime-surface.md", kind: "api-guardrail" },
    { source: "how-to/host-core.md", output: "references/how-to-host-core.md", kind: "how-to" },
    { source: "how-to/client-web.md", output: "references/how-to-client-web.md", kind: "how-to" },
    { source: "how-to/infra-runtime.md", output: "references/how-to-infra-runtime.md", kind: "how-to" },
    { source: "indexes/plugin-development-routing.md", output: "references/plugin-development-routing.md", kind: "index" },
    { source: "indexes/keyword-index.md", output: "references/keyword-index.md", kind: "index" },
    { source: "concepts/terminology.md", output: "references/terminology.md", kind: "index" },
    { source: "maintenance/source-map.md", output: "maintenance/source-map.md", kind: "maintenance" },
    { source: "maintenance/skill-maintenance.md", output: "maintenance/skill-maintenance.md", kind: "maintenance" },
];

const claims = [
    ["host-contract", "host-core", "references/api-host-core.md", "Host/Core registrations are scope-owned, cancellation-aware, and Session-visible facts must be reconstructible.", "packages/core/tools/src/index.ts"],
    ["host-surface", "host-core", "references/api-host-core-surface.md", "Selected Host/Core public objects and signatures are exported by the target packages.", "packages/core/agent/src/index.ts"],
    ["host-how-to", "host-core", "references/how-to-host-core.md", "The documented Host tasks compose target public services and their verified lifecycle boundaries.", "docs/cookbook/adding-a-tool.md"],
    ["client-contract", "client-web", "references/api-client-web.md", "Client plugins load through declared client metadata, slots, stores, and generated Remote contributions.", "packages/client/ui-slots/src/index.ts"],
    ["client-surface", "client-web", "references/api-client-web-surface.md", "Selected Client/Web public objects and signatures are exported by the target packages.", "packages/client/store/src/index.ts"],
    ["client-how-to", "client-web", "references/how-to-client-web.md", "The dual-sided example follows the target Host, Remote, Client slot, and settings contracts.", "docs/cookbook/adding-a-remote-api.md"],
    ["infra-contract", "infra-runtime", "references/api-infra-runtime.md", "Infrastructure capabilities expose stable seams while providers own cleanup and deployment-specific behavior.", "packages/util/package-manifest/src/types.ts"],
    ["infra-surface", "infra-runtime", "references/api-infra-runtime-surface.md", "Selected infrastructure public objects and signatures are exported by the target packages.", "packages/fs/fs/src/index.ts"],
    ["infra-how-to", "infra-runtime", "references/how-to-infra-runtime.md", "A package manifest and bundle patch compose a provider into a target Profile without copying product bundles.", "docs/cordis-tutorial/06-composition-and-hmr.md"],
].map(([id, topic, owner, summary, path]) => ({
    id,
    kind: owner.includes("how-to") ? "derived-guidance" : "implemented-behavior",
    topic,
    decision: "accepted",
    owner,
    summary,
    evidence: [{ category: owner.includes("how-to") ? "documentation" : "public-api", path }],
}));

const sourcePaths = [...new Set(claims.flatMap((claim) => claim.evidence.map((item) => item.path)))].sort();

write(
    join(source, "entrypoint/SKILL.md"),
    `---\nname: dsh-plugin-development\ndescription: 为 DeepSeek Harness ${provenance.version} 制作、装载并验证 Cordis 包和插件；按 Host、Client/Remote 与基础设施任务路由。\n---\n\n# DSH Plugin Development\n\n本 Skill 只适用于 \`${provenance.tag}\`（commit \`${provenance.commit}\`）。先按任务读取 [开发路由](references/plugin-development-routing.md)，再读取对应 API guardrail 与 HOW-TO。不要把其他 DSH 版本、产品内部包或旧 Skill 的同名接口混入。\n\n## 跨主题不变量\n\n- 所有注册、watcher、stream、进程、job 与 child 都必须有明确 owner、取消和卸载路径。\n- 模型可见事实写入 Session；缓存、React state 和通知不是持久事实。\n- 工具只有一份规范 JSON 结果；模型渲染和 UI presentation 保持纯函数。\n- Host、Client 与 Remote 分侧编译；声明编译不证明 Profile、浏览器或运行时行为。\n\n## 完成边界\n\n只有包解析、构建、Profile 装载、一次可观察行为、失败或取消以及卸载清理都实际验证后，才能报告任务完成。无法运行的 Client、Remote、native、网络或外部进程 lane 必须标为 Not Covered。\n`,
);
write(join(source, "metadata/openai.yaml"), `interface:\n    display_name: "DSH Plugin Development ${provenance.version}"\n    short_description: "为固定 DSH tag 创建并验证 Cordis 插件"\n    default_prompt: "使用目标 tag 的公开 API 制作 DSH 插件，并验证装载、行为与卸载。"\n`);
write(join(source, "indexes/plugin-development-routing.md"), `# Plugin development routing\n\n- Host service、工具、LLM、Session、交互、job、Skill、subagent 或 workflow：[Host/Core guardrail](api-host-core.md)、[公开对象](api-host-core-surface.md) 与 [HOW-TO](how-to-host-core.md)。\n- Client package、slot、store、Remote 或 settings：[Client/Web guardrail](api-client-web.md)、[公开对象](api-client-web-surface.md) 与 [HOW-TO](how-to-client-web.md)。\n- package、bundle、Profile、provider、filesystem、process、storage、MCP、route 或 webhook：[基础设施 guardrail](api-infra-runtime.md)、[公开对象](api-infra-runtime-surface.md) 与 [HOW-TO](how-to-infra-runtime.md)。\n\n每条路径都以真实 Profile 装载和卸载为完成边界；静态导出或声明存在只用于定位。\n`);
write(join(source, "indexes/keyword-index.md"), `# Keyword index\n\n| Keyword | Owner |\n| --- | --- |\n| Agent, Session, SystemPrompt, ToolRuntime, LLM, command, approval, goal, job, Skill, subagent, workflow | [Host/Core](api-host-core.md) |\n| dsh.client, Client module, slot, store, Remote, Typert, ConfigForm, settings | [Client/Web](api-client-web.md) |\n| package manifest, bundle, Profile, attachment, credential, filesystem, shell, sandbox, storage, MCP, LSP, PTC, route, webhook | [Infrastructure](api-infra-runtime.md) |\n| exact signatures and selected members | [Host surface](api-host-core-surface.md), [Client surface](api-client-web-surface.md), [Infrastructure surface](api-infra-runtime-surface.md) |\n`);
write(join(source, "concepts/terminology.md"), `# Terminology\n\n- **Plugin**：由 Cordis Loader 挂载并由其 effect scope 管理生命周期的代码单元。\n- **Package**：发布边界；可同时包含 Host root export 与浏览器 \`./client\` export。\n- **Bundle**：有序应用 Cordis patch 的分发层，不等于正在运行的 Profile。\n- **Profile**：启动时叠加 bundles、profile patch、home patch 与命令行 overlay 的命名组合。\n- **Service seam**：公开定义、provider 与 consumer 共同形成的可替换能力；具体 provider 不是新的服务契约。\n- **Remote**：由 Typert 生成并装配的 Host/Client 调用面，不是手写 wire envelope。\n- **Durable fact**：能够从 Session 日志重建的事实；通知、Client store 与 cache 不属于此类。\n`);
write(join(source, "maintenance/source-map.md"), `# Source map\n\nTarget \`${provenance.tag}\`, commit \`${provenance.commit}\`.\n\n## Evidence owners\n\n${sourcePaths.map((path) => `- \`${path}\``).join("\n")}\n\n候选全集与逐项裁决位于本次创建素材的 \`coverage.json\`、\`api-surface.json\` 与 \`claims.json\`。这些文件锁定同一 tag；本页只保留正式 reference 的主要证据 owner。\n`);
write(join(source, "maintenance/skill-maintenance.md"), `# Skill maintenance\n\n本产物只属于 \`${provenance.tag}\`。重建时必须重新运行仓库的 create-dsh-skill 准备、inventory、API 成员发现、能力初始化、证据裁决、冻结、构建和独立验证流程；不得从本产物反推新版本事实。\n\n修改冻结素材前把 manifest 明确恢复为 draft，重新核对 capability、API 与 task 候选，然后再次冻结。正式目录只能由通过独立验证的 generated-skill 整体替换。\n`);

writeJson(join(source, "coverage.json"), { schemaVersion: 3, dispositions: capabilityDispositions, taskPaths, taskDiscoveries });
writeJson(join(source, "api-surface.json"), {
    schemaVersion: 1,
    version: provenance.version,
    tag: provenance.tag,
    commit: provenance.commit,
    remote: provenance.remote,
    entries: apiSurfaceEntries,
    objects: apiSurfaceObjects,
});
writeJson(join(source, "claims.json"), claims);
writeJson(join(source, "manifest.json"), {
    schemaVersion: 3,
    version: provenance.version,
    tag: provenance.tag,
    commit: provenance.commit,
    remote: provenance.remote,
    status: "draft",
    topics,
    files,
});

const report = {
    capabilities: capabilityDispositions.reduce((acc, item) => ((acc[item.decision] = (acc[item.decision] ?? 0) + item.candidates.length), acc), {}),
    taskDiscoveries: taskDiscoveries.reduce((acc, item) => ((acc[item.decision] = (acc[item.decision] ?? 0) + 1), acc), {}),
    apiEntries: apiSurfaceEntries.reduce((acc, item) => ((acc[item.decision] = (acc[item.decision] ?? 0) + 1), acc), {}),
    apiObjects: apiSurfaceObjects.reduce((acc, item) => ((acc[item.decision] = (acc[item.decision] ?? 0) + 1), acc), {}),
    selectedMembers: apiSurfaceObjects.flatMap((item) => item.members).filter((item) => item.decision === "included").length,
    files: files.length,
    claims: claims.length,
};
writeJson(join(evidence, "integration/report.json"), report);
console.log(JSON.stringify(report, null, 2));
