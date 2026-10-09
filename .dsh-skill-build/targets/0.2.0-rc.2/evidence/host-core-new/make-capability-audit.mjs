import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
const root = '.dsh-skill-build/targets/0.2.0-rc.2'
const all = JSON.parse(readFileSync(join(root, 'evidence/capability-candidates.json'), 'utf8')).candidates
const recommended = JSON.parse(readFileSync(join(root, 'evidence/host-core-new/recommendations.json'), 'utf8')).recommendations
const own = new Map(recommended.flatMap(r => r.capabilityCandidateIds.map(id => [id, r])))
const data = {
  'dsh-agent-default-model': ['merged','host-agent','choose-default-model','内置新 Agent 默认模型选择器；其配置影响 Agent 创建，但不定义新的 Agent 扩展契约。'],
  'dsh-agent-tool-presentation': ['merged','host-agent','choose-tool-presentation','内置 Agent 工具呈现模式选择器；属于 Agent 装载配置，具体模型可见形态须按此包核验。'],
  'dsh-credentials-local': ['merged','host-credentials','configure-local-credentials','文件型 CredentialProvider 具体实现，作为凭据 seam 的部署例子；不能把其文件布局当成所有 provider 的契约。'],
  'dsh-deepseek-account': ['merged','provider-authentication','use-deepseek-account','DeepSeek 账号消费服务和登录状态入口；是特定账号集成，不属于通用凭据 Service 定义。'],
  'dsh-deepseek-account-platform': ['merged','provider-authentication','configure-deepseek-login','系统浏览器登录与本地凭据存储的具体组合；具体 OAuth 协议归账号集成主题。'],
  'dsh-deepseek-llm-api-extensions': ['merged','provider-deepseek','extend-deepseek-request','官方 DeepSeek 请求扩展注册表是独立公开 provider 插件 seam；需独立对象与请求字段裁决，不应仅当内置适配器细节。'],
  'dsh-host-directory-picker-auto': ['merged','host-directory-picker','configure-directory-picker','原生与浏览后端的启动时选择器；归目录选择任务的组合变体。'],
  'dsh-host-directory-picker-browse': ['merged','host-directory-picker','configure-directory-picker','目录选择 browse 具体实现，同时装载匹配 Client 流程；现成组合见本组 example。'],
  'dsh-host-directory-picker-native': ['merged','host-directory-picker','configure-directory-picker','目录选择 native 具体实现；其 OS 对话框只适用于操作者可接触 Host 屏幕的部署。'],
  'dsh-host-frontend-static': ['merged','host-webserver','serve-web-frontend','SPA dist 的具体现成服务插件，建立在 Host webserver 回退席位上；不是静态资源通用 API owner。'],
  'dsh-host-open-in-app': ['merged','host-webserver','register-open-in-app','编辑器/终端启动器和 Web 路由的产品特定实现；需要独立路由与本机进程安全核验。'],
  'dsh-host-plugin-inventory': ['merged','client-remote','read-plugin-inventory','当前 Loader 状态的内置只读 Remote 投影；不把它误写为第三方 Client 插件注册 seam。'],
  'dsh-host-product-telemetry-otel': ['merged','telemetry','configure-product-telemetry','产品使用事件的 OTEL 后端实现；部署配置与发送边界归遥测主题。'],
  'dsh-host-webserver': ['merged','host-webserver','register-host-web-route','公开具名路由和 upgrade 注册服务是真实 Host 扩展 seam；本组未展开其请求/注销契约，需独立 API owner。'],
  'dsh-llm-deepseek': ['merged','provider-deepseek','configure-deepseek-llm','DeepSeek Messages/推理/图像的具体适配器；通用 LlmAdapter 契约归 dsh-llm。'],
  'dsh-llm-deepseek-account': ['merged','provider-deepseek','configure-deepseek-account-model','DeepSeek 账号的鉴权和模型发现具体路由；需账号集成主题验证。'],
  'dsh-llm-deepseek-api-key': ['merged','provider-deepseek','configure-deepseek-api-key-model','DeepSeek API key 鉴权和模型发现具体路由；需账号集成主题验证。'],
  'dsh-llm-pi-ai': ['merged','host-llm','configure-pi-ai-adapter','pi-ai 多 provider 具体 LlmAdapter 与模型目录；是通用适配器契约的实现样本。'],
  'dsh-llm-retry': ['merged','host-llm','configure-llm-retry','Agent step 边界的路由化重试执行器；不能由适配器单次 stream 契约推导其恢复语义。'],
  'dsh-permission-presets': ['merged','host-prompt-policy','configure-permission-preset','部署用沙箱与审批策略组合；具体 preset 不等同单次 ApprovalOutcome。'],
  'dsh-plugin-package-inventory-deepseek': ['merged','provider-deepseek','inspect-deepseek-package-inventory','向官方 DeepSeek 请求提供活跃 Loader 包元数据的产品特定实现。'],
  'dsh-scope': ['merged','host-scope','register-agent-scoped-service','公开 Agent/分组作用域注册库是真实插件扩展 seam；本组仅在 Agent 与工具事件中引用，需独立契约页。'],
  'dsh-session-checkpoint-policy': ['merged','host-persistence','configure-session-checkpoint','持久 Agent 的语义检查点服务；位于 Agent 调用与 SessionPersistence 之间，需独立恢复任务。'],
  'dsh-session-format': ['merged','session-format','migrate-session-format','公开纯函数格式规划与编解码分派；属于持久化后端的格式契约，不是 Session 日志写入 API。'],
  'dsh-session-format-catalog': ['merged','session-format','migrate-session-format','第一方格式编解码器与相邻迁移目录；为持久化冷读提供版本路径。'],
  'dsh-session-format-v0-to-v1': ['excluded','session-format','migrate-session-format','冻结的已发布历史 v0→v1 迁移实现；插件作者不应按此旧版本定义当前事件。'],
  'dsh-session-format-v1-to-v2': ['excluded','session-format','migrate-session-format','冻结的已发布历史 v1→v2 迁移实现；当前插件应发出目标版本事件。'],
  'dsh-session-format-v2-to-v3': ['excluded','session-format','migrate-session-format','冻结的已发布历史 v2→v3 迁移实现；不作为新增插件的公共任务入口。'],
  'dsh-session-format-v3-to-v4': ['excluded','session-format','migrate-session-format','冻结的已发布历史 v3→v4 迁移实现；不作为新增插件的公共任务入口。'],
  'dsh-session-log-deepseek': ['merged','telemetry','configure-deepseek-session-log','向官方 DeepSeek 端增量上传规范 Session 日志的具体部署实现；需独立外发数据边界核验。'],
  'dsh-session-persistence-jsonl': ['merged','host-persistence','configure-jsonl-persistence','产品自带 JSONL 存储后端；是 SessionPersistence 的具体实现，不能替代抽象单写者契约。'],
  'dsh-session-projection-cache': ['merged','host-session','configure-projection-cache','投影持久检查点和冷读加速的具体服务；投影定义仍由 dsh-session-projection 持有。'],
  'dsh-session-stats': ['merged','host-session','inspect-session-stats','基于日志的内置计数/时长投影单元；业务插件可消费，但新投影扩展契约归 dsh-session-projection。'],
  'dsh-session-telemetry': ['merged','telemetry','provide-session-telemetry','公开 Session 遥测捕获、脱敏与后端注册 seam；应有独立 Host API owner，不能整批排除。'],
  'dsh-session-telemetry-otel': ['merged','telemetry','configure-otel-session-telemetry','SessionTelemetry 的 OTEL 具体后端，负责导出配置与数据边界。'],
  'dsh-session-title': ['merged','host-session','provide-session-title','公开日志支持型标题来源服务；插件可贡献标题策略，需独立任务核验。'],
  'dsh-session-title-all-prompts-llm': ['merged','host-session','configure-session-title','基于所有提示词的现成 LLM 标题来源；属于标题策略实现。'],
  'dsh-session-title-first-prompt-llm': ['merged','host-session','configure-session-title','基于首条提示词的现成 LLM 标题来源；属于标题策略实现。'],
  'dsh-session-title-llm': ['merged','host-session','provide-session-title','共享 LLM 标题生成策略，可由具体标题来源组合。'],
  'dsh-session-turn-outline': ['merged','host-session','inspect-turn-outline','供 Client 导航的内置完整轮次大纲投影；自定义投影仍按 dsh-session-projection 契约。'],
  'dsh-token-meter': ['merged','host-llm','inspect-token-usage','回放感知 token/上下文压力服务，影响压缩与预算；需独立计量契约核验。'],
  'dsh-tool-ask-user': ['merged','host-user-questions','ask-user-from-tool','基于 user-questions seam 的现成模型工具；通用工具注册归 dsh-tools。'],
  'dsh-goal-round-driver': ['excluded','host-goal','configure-goal-round-driver','这是只消费 ctx.goals 与 Agent 事件的具体自动续行驱动，无公开 provider 注册或可替换抽象类；作为 Goal 组合选项，不单列第三方扩展 seam。'],
  'dsh-user-questions': ['merged','host-user-questions','register-user-question-answerer','公开 waterfall 问答 Service 与 answerer seam，供工具、权限和 Web 交互；本组尚未展开其独立对象契约。'],
}
const candidates = all.filter(x => x.kind === 'public-package' && (/packages\/(core|llm|session|credentials|interaction|host)\//.test(x.path) || /packages\/(compaction\/compaction|shell\/shell-env|jobs\/jobs|subagent\/subagent|workflow\/workflow|goal\/goal|goal\/goal-round-driver|session-query\/session-query)\//.test(x.path)))
const results = candidates.map(c => {
  const rec = own.get(c.id)
  if (rec) return {candidateId:c.id,path:c.path,decision:'included',owner:rec.owner,taskIds:rec.proposedTaskIds,reason:rec.reason}
  const spec = data[c.name.replace('@deepseek-ai/','')]
  if (!spec) throw new Error(`Unclassified ${c.id}`)
  const [decision,owner,taskId,reason] = spec
  return {candidateId:c.id,path:c.path,decision,owner,taskIds:[taskId],reason,coverageStatus:decision === 'merged' ? 'assigned-to-separate-owner; not documented in host-core draft' : 'excluded-from-new-plugin-task'}
})
writeFileSync(join(root,'evidence/host-core-new/capability-audit.json'),JSON.stringify({schemaVersion:1,tag:'dsh-v0.2.0-rc.2',commit:'639ed015397290b3745d163aafe02ffee4aa3f84',scope:'packages/core|llm|session|credentials|interaction|host and selected packages/compaction, shell, jobs, subagent, workflow, goal, session-query public-package candidates',decisionSemantics:{included:'本组已有对象与任务正文',merged:'归指定 owner 的独立任务；本组未声称其正文完成',excluded:'历史迁移实现，不是目标版本新增插件的任务入口'},candidates:results},null,2)+'\n')
console.log(results.length,results.reduce((m,x)=>(m[x.decision]=(m[x.decision]??0)+1,m),{}))
