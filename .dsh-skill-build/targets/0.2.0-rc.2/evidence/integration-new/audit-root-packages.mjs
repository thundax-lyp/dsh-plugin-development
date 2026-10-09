import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const target = process.argv[2];
if (!target) throw new Error("Pass the target directory.");
const inventory = JSON.parse(readFileSync(join(target, "evidence/integration-new/package-inventory.json"), "utf8")).packages;
const capabilities = [];
const include = new Map([
    ["@deepseek-ai/dsh-agent-preset", "ship-profile-bundle"],
    ["@deepseek-ai/dsh-agent-preset-registry", "ship-profile-bundle"],
    ["@deepseek-ai/dsh-typert-generator", "host-publish-remote"],
    ["@deepseek-ai/dsh-typert-loader", "host-publish-remote"],
    ["@deepseek-ai/dsh-typert-registry", "host-publish-remote"],
    ["@deepseek-ai/dsh-api-gateway", "host-publish-remote"],
]);
const concreteExperimental = new Set([
    "dsh-experimental-agent-team-profile", "dsh-experimental-auto-review",
    "dsh-experimental-browser-use-chrome-devtools-mcp", "dsh-experimental-browser-use-playwright-mcp", "dsh-experimental-browser-use-stagehand-native",
    "dsh-experimental-client-ui-agent-team", "dsh-experimental-client-ui-voice-input",
    "dsh-experimental-computer-use-cua-driver-mcp", "dsh-experimental-computer-use-cua-driver-native",
    "dsh-experimental-inspector", "dsh-experimental-ptc-runtime-python", "dsh-experimental-schedule-bundle",
    "dsh-experimental-speech-to-text-sensevoice", "dsh-experimental-tool-agent-team",
    "dsh-experimental-voice-input-bundle", "dsh-experimental-webworker-packer",
]);
const concreteBackends = new Map([
    ["dsh-attachment-local", "AttachmentStore"],
    ["dsh-compaction-basic", "Compaction"], ["dsh-compaction-image-offload", "Compaction"], ["dsh-compaction-tool-result-pruner", "Compaction"],
    ["dsh-file-reference-local", "FileReferenceService"],
    ["dsh-fs-local", "FileSystem"], ["dsh-fs-sandbox", "FileSystem"], ["dsh-fs-ssh", "FileSystem"],
    ["dsh-jobs-local", "Jobs"],
    ["dsh-ptc-runtime-node", "PtcRuntime"],
    ["dsh-pwsh-local", "Shell"], ["dsh-pwsh-sandbox", "Shell"], ["dsh-bash-local", "Shell"], ["dsh-bash-sandbox", "Shell"],
    ["dsh-sandbox-local", "SandboxProvider"], ["dsh-sandbox-policy", "SandboxProvider"], ["dsh-sandbox-ssh", "SandboxProvider"], ["dsh-sandbox-windows-acl", "SandboxProvider"],
    ["dsh-session-persistence-jsonl", "SessionPersistence"], ["dsh-session-projection-cache", "SessionProjectionRegistry"],
    ["dsh-session-query-sqlite", "SessionQuery"],
    ["dsh-session-title-all-prompts-llm", "SessionTitleService"], ["dsh-session-title-first-prompt-llm", "SessionTitleService"], ["dsh-session-title-llm", "SessionTitleService"],
    ["dsh-skill-badge", "SkillRegistry"], ["dsh-skill-filesystem", "SkillRegistry"], ["dsh-skill-office", "SkillRegistry"],
    ["dsh-spill-local", "SpillStore"], ["dsh-spill-policy", "SpillStore"],
    ["dsh-subagent-acp", "Subagent"], ["dsh-subagent-claude-code", "Subagent"], ["dsh-subagent-codex", "Subagent"], ["dsh-subagent-dsh-sdk", "Subagent"], ["dsh-subagent-fork-in-process", "Subagent"], ["dsh-subagent-in-process-driver", "Subagent"], ["dsh-subagent-spawn-in-process", "Subagent"],
    ["dsh-subprocess-local", "Subprocess"], ["dsh-subprocess-ssh", "Subprocess"], ["dsh-terminal-bash", "Terminal"],
    ["dsh-workflow-ptc", "WorkflowEngine"],
]);
const productPackages = new Set([
    "dsh-agent-default-model", "dsh-agent-instructions", "dsh-agent-tool-presentation", "dsh-anonymous-user-id",
    "dsh-client-ui-cordis", "dsh-cordis-client-runner", "dsh-cordis-host-runner", "dsh-deepseek-llm-api-extensions",
    "dsh-hmr", "dsh-hook-protocol", "dsh-host-plugin-inventory", "dsh-office-to-pdf", "dsh-otel",
    "dsh-permission-presets", "dsh-plan-mode", "dsh-plugin-package-inventory-deepseek", "dsh-repeat-tool-reminder",
    "dsh-schedule", "dsh-session-checkpoint-policy", "dsh-session-format", "dsh-session-format-catalog",
    "dsh-session-log-deepseek", "dsh-session-log-export", "dsh-session-stats", "dsh-session-telemetry", "dsh-session-telemetry-otel", "dsh-session-turn-outline",
    "dsh-time-context", "dsh-tmux-context", "dsh-token-meter", "dsh-tool-cordis", "dsh-web-frontend",
]);
const specificExclusions = new Map([
    ["dsh-experimental-agent-team", "预置的 Agent Team roster、mailbox 与 DAG 协作产品；其权限和角色需要专用实验性组合，不是普通插件可独立注册的 Tool/Service/Remote 入口。"],
    ["dsh-experimental-api-speech-to-text", "这是实验语音输入的现成 Host Remote 网关；新语音 provider 应实现 SpeechToText 抽象服务，不复制该产品专用网关。"],
    ["dsh-experimental-webworker-runtime", "它把整棵 Host 运行树装进浏览器 Worker，是替代部署运行时和构建链；不提供第三方 Cordis 包的独立产品形态。"],
    ["dsh-fs-observation-policy", "它是内置 fs/* read-before-edit 与版本写入政策的具体监听器，不实现新的 FileSystem provider；自有文件服务使用 FileSystem 抽象契约。"],
    ["dsh-mcp-client", "它把外部 MCP Server 的 Tool 接入 ctx.tools，是现成协议桥接器；自有资源 Provider 的注册契约由 dsh-mcp-resources 拥有。"],
    ["dsh-persona", "它是 agent preset 内的现成人设行；自有插件注册提示词段落应使用 SystemPrompt，不能在全局复制该 preset 行以免冲突。"],
    ["dsh-ssh", "共享 OpenSSH 连接和 POSIX helper 供已发布的 fs/sandbox/subprocess 后端使用；它不注册独立的 DSH 插件 Service。"],
]);
for (const item of inventory) {
    const name = item.name.replace("@deepseek-ai/", "");
    const path = item.path;
    const description = item.description || name;
    if (include.has(item.name)) {
        capabilities.push({ candidate: item.candidate, decision: "included", taskId: include.get(item.name), reason: `${description}；公开组合/生成环节用于该任务。`, evidence: path });
        continue;
    }
    let reason;
    if (specificExclusions.has(name)) {
        reason = specificExclusions.get(name);
    } else if (concreteBackends.has(name)) {
        reason = `${description}。这是已发布的 ${concreteBackends.get(name)} 具体实现或策略；自定义插件应从对应抽象 service 合约注册，不能复制该产品后端的内部状态与副作用。`;
    } else if (productPackages.has(name)) {
        reason = `${description}。它属于产品预装的配置、状态、遥测、迁移、界面或运行策略，不提供独立于已纳入 Tool/Service/Remote/Client/Profile 契约的第三方插件注册任务。`;
    } else if (item.candidate === "package:Search plugin") {
        reason = "该候选来自包介绍文本的非 npm 包名片段；目标 checkout 不存在对应的 @deepseek-ai 发布包或可导入插件入口。";
    } else if (path.startsWith("packages/util/") || path.startsWith("vendor/cosmokit/") || path.startsWith("vendor/schemastery/")) {
        reason = `${description}。它提供通用值、路径、时间、网络或文件辅助函数，不负责将新 Cordis 插件的 Tool、Service、Remote 或 UI 挂入 Profile。`;
    } else if (path.startsWith("packages/test-support/") || name.endsWith("-testkit") || name.endsWith("-mock") || name.endsWith("-smoke")) {
        reason = `${description}。这是测试 fixture、模拟 transport 或 smoke harness；可作为核验证据，不能作为分发插件的运行时入口。`;
    } else if (path.startsWith("native/system/")) {
        reason = `${description}。该平台二进制包提供底层进程与文件锁 primitive，由沙箱/子进程后端消费，第三方插件不在此注册 DSH 能力。`;
    } else if (path.startsWith("packages/api/") && !["dsh-api-remotes", "dsh-api-gateway"].includes(name)) {
        reason = `${description}。这是产品现有 Remote namespace 的 Host controller；新增业务 Remote 使用 Typert service、生成物与 Client assembly，不复制或修改该内置 controller。`;
    } else if (path.startsWith("packages/bundle/") && !["dsh", "dsh-app-boot"].includes(name)) {
        reason = `${description}。这是已发布的具体 Profile/bundle 组合层；自有包应按 Profile/bundle HOW-TO 声明新的 patch 和装载顺序，不能把本包的预置行当作第三方 API。`;
    } else if (path.startsWith("vendor/") && name.startsWith("cordis-plugin-")) {
        reason = `${description}。此包实现 Cordis 基础装载、日志、热更新或定时机制；插件作者的公开接入由 Context 与 Profile patch 指导，不要求直接实现或复制该基础插件。`;
    } else if (concreteExperimental.has(name)) {
        reason = `${description}。这是特定实验功能的预制 driver、UI、Profile 或构建工具；没有独立于该实验组合的通用插件注册契约。`;
    } else if (path.startsWith("packages/feedback/")) {
        reason = `${description}。这是内置反馈命令及记录实现；自定义插件的模型调用和可回放事实由 Tool/Session 契约指导，而非复制官方反馈流程。`;
    } else if (path.startsWith("packages/hooks/") && name !== "dsh-hook-protocol") {
        reason = `${description}。该包桥接现成 Claude Code/Codex hook 格式，不定义第三方 DSH 插件的新注册点；Hook wire 协议需单独核查时再读源码。`;
    } else if (path.startsWith("packages/host/") && /directory-picker-(auto|browse|native)|frontend-static|open-in-app|product-telemetry/.test(name)) {
        reason = `${description}。它是已选 Host seam 的一种具体产品后端或静态页面/遥测实现；第三方后端以抽象 service 合约接入。`;
    } else if (path.startsWith("packages/credentials/") && /credentials-local|deepseek-account/.test(name)) {
        reason = `${description}。它是本地或官方 DeepSeek 凭据实现；插件自有凭据与授权应通过 Credentials/Authorization 服务契约，不复用该官方 provider 的内部记录。`;
    } else if (path.startsWith("packages/llm/") && /llm-(deepseek|pi-ai|replay|retry|mock)/.test(name)) {
        reason = `${description}。它是现成模型 adapter、恢复策略或测试 provider；新模型集成由 LlmAdapter 注册契约和自己的 provider 包负责。`;
    } else if (name.startsWith("dsh-tool-") && name !== "dsh-tool-cordis") {
        reason = `${description}。这是产品预装的具体模型工具，创建自有 Tool 应按 defineTool/ToolRuntime 契约实现，不能把该包的业务工具当作可继承模板。`;
    } else if (name.startsWith("dsh-command-") && name !== "dsh-commands") {
        reason = `${description}。这是产品预装的具体 slash command，创建自有命令应通过 CommandRuntime 注册而非修改官方命令实现。`;
    } else if (path.startsWith("packages/sdk/") || path.startsWith("packages/acp/")) {
        reason = `${description}。这是进程外 SDK/ACP 驱动和其默认 Profile；当前 Skill 面向 Cordis 插件包的 Host/Client/Remote 接入，SDK 调用方不提供新的进程内插件注册契约。`;
    }
    if (reason) capabilities.push({ candidate: item.candidate, decision: "excluded", reason, evidence: path });
}
writeFileSync(join(target, "evidence/integration-new/root-package-audit.json"), `${JSON.stringify({ schemaVersion: 1, version: "0.2.0-rc.2", capabilities }, null, 4)}\n`);
process.stdout.write(`${capabilities.length} root package decisions\n`);
