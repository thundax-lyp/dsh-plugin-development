import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const target = process.argv[2];
if (!target) throw new Error("Pass the target directory.");
const candidates = JSON.parse(readFileSync(join(target, "evidence/capability-candidates.json"), "utf8")).candidates;
const task = new Map([
    ["approval", "guard-host-tool-execution"],
    ["boot", "ship-profile-bundle"],
    ["client-modules", "client-load-web-half"],
    ["client-resources", "client-resource-provider"],
    ["commands", "register-host-command"],
    ["conversation", "client-conversation-node"],
    ["core", "provide-host-service"],
    ["credentials", "store-plugin-credential"],
    ["extensions", "ship-profile-bundle"],
    ["llm-streaming", "register-llm-adapter"],
    ["persistence", "implement-session-persistence"],
    ["scope", "register-scoped-contribution"],
    ["session-query", "query-session-history"],
    ["session", "record-host-session-fact"],
    ["session-projection", "record-host-session-fact"],
    ["settings", "expose-live-config"],
    ["sidebar-right", "client-sidebar-tab"],
    ["slots", "client-contribute-slot"],
    ["storage", "persist-plugin-records"],
    ["system-prompt", "guard-host-tool-execution"],
    ["tools", "register-host-tool"],
    ["typert", "host-publish-remote"],
    ["web-client", "client-load-web-half"],
    ["web-server", "register-http-route"],
    ["webhook", "respond-to-webhook"],
    ["web", "register-web-provider"],
    ["lsp", "register-lsp-provider"],
    ["skills", "register-skill-provider"],
    ["mcp", "register-mcp-resource-provider"],
    ["filesystem", "consume-filesystem-service"],
    ["compaction", "provide-compaction-backend"],
    ["session-reference", "client-reference-candidates"],
    ["workspace", "host-workspace-registry"],
    ["goal", "manage-session-goal"],
    ["jobs", "register-background-job"],
    ["subagent", "provide-subagent-backend"],
    ["user-questions", "ask-user-question"],
    ["workflow", "run-host-workflow"],
    ["attachment", "save-host-artifacts"],
    ["sandbox", "execute-confined-command"],
    ["shell", "execute-confined-command"],
    ["spill", "save-host-artifacts"],
    ["subprocess", "execute-confined-command"],
    ["terminal", "use-agent-pty"],
]);
const excludedSubsystem = new Map([
    ["agent-team", "实验性 Agent Teams 的协作实现和预置 Profile，不作为稳定的第三方插件基础契约。"],
    ["browser-use", "实验性浏览器执行提供方的内部组合与生命周期，当前发布入口未给通用插件的稳定实现任务。"],
    ["computer-use", "实验性 computer-use driver 组合；需要额外 native/MCP driver，不能作为通用插件开发入口。"],
    ["deliverables", "内置交付视图对会话文件变化的消费，不提供独立于 Client slot/Conversation Node 的通用注册契约。"],
    ["feedback", "内置消息与命令反馈记录链路，扩展 UI 应通过 Client slot 和 Session 事件契约，而非复制内置反馈后端。"],
    ["office-to-pdf", "内置 Office 转 PDF 队列与缓存服务的架构说明，不定义插件作者可安装的新注册点。"],
    ["otel", "内置遥测 exporter 的部署与隐私链路，不属于插件作者需要实现的产品形态。"],
    ["product-telemetry", "匿名产品使用事件的内置遥测实现；插件任务不应直接挂载该官方事件出口。"],
    ["ptc-runtime", "受沙箱约束的 PTC 执行后端及隔离协议；当前 Skill 不指导替换它的安全边界。"],
    ["schedule", "内置提醒产品与任务管理，不是插件作者注册自有 Tool、Service、Client UI 或 Remote 的基础入口。"],
    ["session-telemetry", "会话日志遥测后端和授权上传链路，属于部署治理而非本 Skill 的插件实现任务。"],
    ["session-title", "内置标题 provider 及生成策略的专题架构；本次常规插件任务不修改会话标题策略。"],
    ["voice-input", "实验性语音输入和本地模型组合，不是稳定的通用 Client 扩展点。"],
    ["permission-presets", "内置权限选择器的配置与事件投影，不定义第三方插件提供新 Tool 或审批 service 的通用契约。"],
    ["plan", "Plan mode 的交互和 Session 状态是内置产品功能；自有插件的状态记录由 SessionEvent 契约承担。"],
    ["README", "子系统目录页仅汇总各专题，不描述一个独立可观察的插件开发任务。"],
    ["ssh", "共享 SSH transport 的内部架构，由已有 fs/sandbox/subprocess 后端消费；不注册新的 Cordis 插件能力。"],
    ["todo", "内置 todo 工具的事件与投影说明，不是第三方 Tool/Service 的独立注册入口。"],
    ["token-meter", "内置请求 token 计量与回放服务，插件作者应使用公开 LlmAdapter/Tool 结果契约，不直接提供计量后端。"],
]);
const excludedCookbook = new Map([
    ["adding-a-session-format-version", "维护 DSH 核心 Session 日志格式版本和迁移目录，不是独立插件作者的公开扩展任务。"],
    ["adding-a-vendored-package", "在 DSH 单仓中添加 vendored 源码与根工作区注册，属于上游仓库维护步骤。"],
    ["extension-cookbook", "Cookbook 目录页只聚合其他独立教程，不能当作一个可观察的插件任务。"],
    ["maintaining-dsh-code-review", "DSH 上游代码审查操作流程，不是插件的创建或装载契约。"],
    ["responding-to-pr-review-on-a-stack", "上游 stacked PR 审查流程，不定义插件作者可调用的 DSH 对象。"],
    ["reviewing-persistence-type-changes", "核心持久化类型变更的仓库维护流程，不是第三方插件使用路径。"],
]);
const capabilities = [];
for (const candidate of candidates) {
    if (candidate.kind === "subsystem") {
        const name = candidate.id.slice("subsystems:".length);
        if (task.has(name)) capabilities.push({ candidate: candidate.id, decision: "included", taskId: task.get(name), reason: `${name} 子系统描述本次纳入的公开插件对象关系与使用边界，归入对应 HOW-TO。`, evidence: candidate.path });
        else if (excludedSubsystem.has(name)) capabilities.push({ candidate: candidate.id, decision: "excluded", reason: excludedSubsystem.get(name), evidence: candidate.path });
    } else if (candidate.kind === "developer-task") {
        const name = candidate.id.slice("cookbook:".length);
        if (excludedCookbook.has(name)) capabilities.push({ candidate: candidate.id, decision: "excluded", reason: excludedCookbook.get(name), evidence: candidate.path });
    } else if (candidate.kind === "composition-manifest") {
        if (candidate.path.startsWith("packages/experimental/")) capabilities.push({ candidate: candidate.id, decision: "excluded", reason: `该 ${candidate.path} 是实验性产品组合的预置 patch；插件作者应在稳定 Profile/bundle 任务中声明自己包的 Cordis 行，不能把实验预置当作默认装载契约。`, evidence: candidate.path });
        else if (candidate.path.includes("/templates/")) capabilities.push({ candidate: candidate.id, decision: "excluded", reason: `${candidate.path} 是 agent-preset 内的示范模板，不是发布后的默认 Profile 或独立插件入口。`, evidence: candidate.path });
        else if (candidate.path.includes("packages/subagent/")) capabilities.push({ candidate: candidate.id, decision: "excluded", reason: `${candidate.path} 仅预组装特定外部 subagent 后端；第三方插件交付的共用 patch 规则由 Profile/bundle HOW-TO 拥有。`, evidence: candidate.path });
    }
}
const out = { schemaVersion: 1, version: "0.2.0-rc.2", capabilities };
writeFileSync(join(target, "evidence/integration-new/root-capability-audit.json"), `${JSON.stringify(out, null, 4)}\n`);
process.stdout.write(`${capabilities.length} root candidate decisions\n`);
