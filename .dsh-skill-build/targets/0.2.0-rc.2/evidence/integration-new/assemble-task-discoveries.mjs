import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const target = process.argv[2];
if (!target) throw new Error("Pass the target directory.");
const read = (path) => JSON.parse(readFileSync(join(target, path), "utf8"));
const coverage = read("skill-source/coverage.json");
const candidates = read("evidence/task-candidates.json").candidates;
const inventory = read("evidence/integration-new/package-inventory.json").packages;
const client = read("evidence/client-web-new/recommendations.json");
const infra = read("evidence/infra-runtime-new/recommendations.json");
const provider = read("evidence/infra-runtime-new/provider-recommendations.json");
const profile = read("evidence/integration-new/profile-recommendations.json");
const byPackagePath = new Map(inventory.map((item) => [item.path.replace(/\/package\.json$/, ""), item]));
const byTask = new Set(coverage.taskPaths.filter((task) => task.decision === "covered").map((task) => task.id));
const exact = new Map([
    ...read("evidence/host-core-new/recommendations.json").recommendations.flatMap((record) => (record.taskCandidateIds ?? []).map((candidate) => [candidate, record.proposedTaskIds?.[0]])),
    ...client.taskRecommendations.map((item) => [item.candidate, item.taskId]),
    ...infra.tasks.filter((item) => item.candidate).map((item) => [item.candidate, item.task]),
    ...provider.tasks.map((item) => [item.candidate, item.task]),
    ...profile.tasks.map((item) => [item.candidate, item.task]),
]);
const docs = [
    [/docs\/cookbook\/adding-a-tool/, "register-host-tool"],
    [/docs\/cookbook\/adding-an-llm-adapter/, "register-llm-adapter"],
    [/docs\/cookbook\/adding-a-package/, "ship-profile-bundle"],
    [/docs\/cookbook\/adding-a-settings-card/, "client-settings-card"],
    [/docs\/cookbook\/adding-a-remote-api/, "host-publish-remote"],
    [/docs\/cordis-tutorial\/01-first-plugin/, "provide-host-service"],
    [/docs\/cordis-tutorial\/05-config/, "expose-live-config"],
    [/docs\/cordis-tutorial\/06-composition-and-hmr/, "ship-profile-bundle"],
    [/docs\/user\/develop\/basic\/config/, "expose-live-config"],
    [/docs\/user\/develop\/basic\/tool/, "register-host-tool"],
    [/docs\/user\/develop\/basic\/publish/, "ship-profile-bundle"],
    [/docs\/user\/develop\/practice\/index/, "provide-host-service"],
    [/docs\/user\/develop\/practice\/dynamic-cordis/, "ship-profile-bundle"],
    [/docs\/subsystems\/slots/, "client-contribute-slot"],
    [/docs\/subsystems\/settings/, "expose-live-config"],
    [/docs\/subsystems\/mcp/, "register-mcp-resource-provider"],
    [/docs\/subsystems\/skills/, "register-skill-provider"],
    [/docs\/subsystems\/web-server/, "register-http-route"],
    [/docs\/subsystems\/session/, "record-host-session-fact"],
    [/docs\/subsystems\/persistence/, "implement-session-persistence"],
    [/docs\/cordis-primer\.zh\.md/, "ship-profile-bundle"],
    [/packages\/compaction\/compaction-basic\/README/, "provide-compaction-backend"],
    [/packages\/core\/scope\/README/, "scope-agent-capability"],
    [/packages\/goal\/goal\/README/, "manage-session-goal"],
    [/packages\/host\/directory-picker-(?:auto|browse)\/README/, "provide-directory-picker"],
    [/packages\/mcp\/mcp-resources\/README/, "register-mcp-resource-provider"],
    [/packages\/runtime-diagnostics\/invariants\/README/, "install-invariant-companion"],
    [/packages\/session\/session-title\/README/, "register-session-title-provider"],
    [/packages\/settings\/README/, "expose-live-config"],
    [/packages\/shell\/shell-env\/README/, "register-shell-environment-fact"],
    [/packages\/skill\/(?:skill|skill-filesystem|tool-skill)\/README/, "register-skill-provider"],
    [/packages\/typert\/generator\/README/, "host-publish-remote"],
];
const nonAuthoring = [
    [/docs\/api-gateway/, "Gateway 文档的开发回退/开发模式是上游调试入口；第三方 Remote 发布按 Typert 生成与 Client assembly 任务执行。"],
    [/docs\/config-catalog/, "生成的配置目录列出已有插件的 schema，不是新增插件的单项操作任务；自有配置由 Settings/Profile HOW-TO 指导。"],
    [/docs\/cookbook\/adding-a-session-format-version/, "这是 DSH 核心日志格式版本与迁移表维护，不是第三方插件通过当前 Session API 写入事件。"],
    [/docs\/cookbook\/adding-a-vendored-package/, "这是上游 monorepo 增加 vendored workspace 包的维护步骤，不是消费项目安装 Cordis 插件的路径。"],
    [/docs\/cookbook\/maintaining-dsh-code-review/, "上游代码审查候选 diff 的操作员流程，不定义插件安装或运行结果。"],
    [/docs\/subsystems\/plan/, "Plan 子系统配置用于内置交互模式，不定义独立插件注册任务。"],
    [/docs\/user\/guide\//, "用户指南的模型/MCP 配置帮助终端用户启用现成服务，插件作者的 Provider/Remote 接入由各自 HOW-TO 拥有。"],
    [/packages\/boot\/app-boot\/README.*待定/, "标题明确是尚待定的 YAML dump 稳定性，不能写成当前插件开发契约。"],
    [/packages\/client\/ui-directory-picker-browse\//, "这是内置目录浏览界面的用户操作，新的目录选择后端由 Host DirectoryPicker 契约拥有。"],
    [/packages\/client\/ui-dockkit\//, "DockKit 是无 Cordis 的布局组件库，嵌入说明不等于一个可安装的 DSH Client 插件任务。"],
    [/packages\/client\/ui-settings-(?:general|models)\//, "这是内置设置页面的用户操作；自有设置卡片和模型 provider 分别由 Client Settings/Host LlmAdapter 任务拥有。"],
    [/packages\/core\/agent-default-model\//, "现成默认模型选择器的配置，不是创建 Agent 作用域扩展或新模型 adapter 的独立任务。"],
    [/packages\/experimental\/agent-team\//, "实验性 Agent Team 预置配置需要专用团队运行时，不能由普通 Cordis 插件步骤推导为稳定产品形态。"],
    [/packages\/extensions\/cordis-client-runner\//, "动态双半包的一次 run 内部流程由预装 runner 实现，不是新 Client UI 包的公开装载步骤。"],
    [/packages\/extensions\/ui-cordis\//, "现成动态插件面板的刷新实现，不是第三方 Client slot 或 Remote 的注册契约。"],
    [/packages\/feedback\//, "官方反馈事件的记录流程属于内置产品功能，插件的自有可回放事实应通过 Session 事件契约实现。"],
    [/packages\/fs\/(?:fs-sandbox|tool-fs-search|tool-str-replace-editor)\//, "内置文件策略/模型工具的执行说明，不是自有 FileSystem provider 或 Tool 的独立公开注册任务。"],
    [/packages\/guard\/timeout-policy\//, "内置超时策略如何融合 deadline 的实现说明；自有 Tool 的取消与失败由 ToolRunContext 契约约束。"],
    [/packages\/hooks\//, "Claude Code/Codex hook 桥接器的运行与失败协议，不是新 Cordis 插件的通用注册入口。"],
    [/packages\/interaction\/permission-presets\//, "用户权限预设的现成配置，不是第三方工具权限或 approval service 的独立实现路径。"],
    [/packages\/llm\/llm-(?:deepseek|pi-ai)\//, "已有 LLM provider 的配置或热更新，创建新 provider 以 LlmAdapter HOW-TO 为准。"],
    [/packages\/preset\//, "预置 agent/preset 包的内部行注册或开发笔记，不是自有 Profile bundle 的独立任务。"],
    [/packages\/ptc-runtime\//, "PTC Node bootstrap 的源码/构建差异属于内置隔离运行时维护，不是通用插件装载步骤。"],
    [/packages\/session\/session-projection-cache\//, "内置 projection cache 的 checkpoint 策略，不是插件写入可回放事实或定义投影的直接入口。"],
    [/packages\/skill\/tool-workspace-dependencies\//, "内置工作区依赖 payload 的构建过程，不是注册自有 Skill provider 的步骤。"],
    [/packages\/spill\/spill-policy\//, "标题标记未来的逐工具配置，目标版本没有可用的当前配置任务。"],
    [/packages\/util\//, "通用 proxy、启动快照、输出保留或 deadline 工具的内部使用说明；本 Skill 的可安装插件任务由相应 DSH Service/Tool 契约承担。"],
    [/packages\/workspace\/workspace\//, "Workspace 项目的创建和排序是内置产品管理操作；插件消费 Workspace 服务由 Workspace Registry 契约指导。"],
];
const capabilityTask = new Map();
for (const task of coverage.taskPaths.filter((item) => item.decision === "covered")) {
    for (const candidate of task.candidates) {
        if (candidate.startsWith("package:") && !capabilityTask.has(candidate)) capabilityTask.set(candidate, task.id);
    }
}
const decisions = new Map(coverage.taskDiscoveries.filter((item) => item.decision !== "pending").map((item) => [item.candidate, item]));
const pending = [];
for (const candidate of candidates) {
    if (decisions.has(candidate.id)) continue;
    if (candidate.id === "task:packages/boot/app-boot/README.zh.md:215") {
        decisions.set(candidate.id, { candidate: candidate.id, decision: "excluded", reason: "该标题明确标记为待定的 YAML 配置 dump 稳定性；目标版本没有可验证的当前插件开发任务。" });
        continue;
    }
    let taskId = exact.get(candidate.id);
    taskId ??= docs.find(([pattern]) => pattern.test(candidate.path))?.[1];
    if (taskId && byTask.has(taskId)) {
        decisions.set(candidate.id, { candidate: candidate.id, decision: "included", taskId });
        continue;
    }
    const root = [...byPackagePath.keys()].find((path) => candidate.path.startsWith(`${path}/`));
    const pack = root ? byPackagePath.get(root) : null;
    if (pack && capabilityTask.has(pack.candidate) && !/待定|未来|开发备注/.test(candidate.title)) {
        decisions.set(candidate.id, { candidate: candidate.id, decision: "included", taskId: capabilityTask.get(pack.candidate) });
        continue;
    }
    if (pack && /^(配置|最小配置|进阶配置|配置示例|构建要求|构建形态|启动过程是怎样的)$/.test(candidate.title)) {
        decisions.set(candidate.id, {
            candidate: candidate.id,
            decision: "excluded",
            reason: `${pack.name} 的「${candidate.title}」说明现成包的参数或构建启动条件；它不描述新插件通过公开入口注册自己的对象、组合包或 UI。`,
        });
        continue;
    }
    const notTask = nonAuthoring.find(([pattern]) => pattern.test(candidate.id));
    if (notTask) {
        decisions.set(candidate.id, { candidate: candidate.id, decision: "excluded", reason: notTask[1] });
        continue;
    }
    pending.push(candidate);
}
coverage.taskDiscoveries = candidates
    .map((candidate) => decisions.get(candidate.id) ?? { candidate: candidate.id, decision: "pending" })
    .sort((left, right) => left.candidate < right.candidate ? -1 : left.candidate > right.candidate ? 1 : 0);
writeFileSync(join(target, "skill-source/coverage.json"), `${JSON.stringify(coverage, null, 4)}\n`);
writeFileSync(join(target, "evidence/integration-new/pending-task-titles.json"), `${JSON.stringify(pending, null, 4)}\n`);
process.stdout.write(`${candidates.length - pending.length} task title decisions; ${pending.length} pending\n`);
