import fs from 'node:fs'
import path from 'node:path'

const target = path.resolve('.dsh-skill-build/targets/0.2.0-rc.2')
const evidence = path.join(target, 'evidence')
const output = path.join(evidence, 'host-core', 'recommendations.json')
const families = new Set(['core', 'context', 'llm', 'session', 'session-query', 'interaction', 'goal', 'plan', 'jobs', 'skill', 'workflow', 'subagent', 'hooks', 'guard', 'feedback', 'todo'])
const inScopePath = value => typeof value === 'string' && value.startsWith('packages/') && families.has(value.split('/')[1])
const read = name => JSON.parse(fs.readFileSync(path.join(evidence, name), 'utf8'))
const capabilities = read('capability-candidates.json').candidates.filter(item => inScopePath(item.path))
const entries = read('api-entry-candidates.json').candidates.filter(item => inScopePath(item.path))
const symbols = read('api-symbol-candidates.json').entries.filter(item => inScopePath(item.source))
const tasks = read('task-candidates.json').candidates.filter(item => inScopePath(item.path))

const packageName = item => item.package ?? item.id.match(/^package:(.+)$/)?.[1] ?? item.id.match(/^export:([^:]+):/)?.[1] ?? ''
const topicFor = item => {
  const pkg = packageName(item)
  const source = item.path ?? item.source ?? ''
  if (pkg.includes('system-prompt')) return ['host-core', 'system-prompt-composition']
  if (source.includes('/core/tools/') || pkg === '@deepseek-ai/dsh-tools') return ['host-core', 'tool-runtime-and-definition']
  if (source.includes('/core/agent') || pkg === '@deepseek-ai/dsh-agent' || pkg === '@deepseek-ai/dsh-scope') return ['host-core', 'agent-session-and-scope']
  if (source.includes('/core/session/') || pkg === '@deepseek-ai/dsh-session') return ['host-core', 'agent-session-and-scope']
  if (source.includes('/llm/') || /dsh-(?:llm|deepseek-llm|token-meter|plugin-package-inventory)/.test(pkg)) return ['host-core', 'llm-provider-and-adapter']
  if (source.includes('/context/') || /dsh-(?:agent-instructions|file-reference|session-reference|time-context|tmux-context)/.test(pkg)) return ['host-core', 'context-contributions']
  if (source.includes('/session-query/') || /dsh-(?:session-query|session-log-export)/.test(pkg)) return ['host-core', 'session-query']
  if (source.includes('/session/') || /dsh-session-(?:persistence|projection|checkpoint|format|log|stats|telemetry|title|turn)/.test(pkg)) return ['host-core', 'session-extension-and-persistence']
  if (source.includes('/interaction/') || /dsh-(?:commands|permission-presets|tool-ask-user|user-approval|user-questions)/.test(pkg)) return ['host-core', 'commands-approval-and-questions']
  if (source.includes('/goal/') || source.includes('/plan/') || source.includes('/todo/') || /dsh-(?:goal|command-goal|tool-goal|plan-mode|tool-todo)/.test(pkg)) return ['host-core', 'goal-plan-and-todo']
  if (source.includes('/jobs/') || /dsh-(?:jobs|tool-jobs)/.test(pkg)) return ['host-core', 'jobs']
  if (source.includes('/skill/') || /dsh-(?:skill|tool-skill|tool-workspace-dependencies)/.test(pkg)) return ['host-core', 'skills']
  if (source.includes('/subagent/') || /dsh-(?:subagent|tool-subagent)/.test(pkg)) return ['host-core', 'subagents']
  if (source.includes('/workflow/') || /dsh-(?:workflow|tool-workflow|tool-ralph)/.test(pkg)) return ['host-core', 'workflows']
  if (source.includes('/hooks/') || /dsh-(?:hook-protocol|hooks-)/.test(pkg)) return ['host-core', 'external-hooks']
  if (source.includes('/feedback/') || /dsh-(?:command-feedback|message-feedback)/.test(pkg)) return ['host-core', 'feedback']
  if (source.includes('/guard/') || /dsh-(?:repeat-tool-reminder|tool-call-timeout-policy)/.test(pkg)) return ['host-core', 'guards']
  return ['host-core', 'host-core']
}
const owner = item => {
  const [topic, section] = topicFor(item)
  return { topic, owner: 'api-guardrails/host-core.md', ownerSections: [`#${section}`] }
}

const canonicalPackages = new Set([
  '@deepseek-ai/dsh-agent', '@deepseek-ai/dsh-agent-loop', '@deepseek-ai/dsh-session', '@deepseek-ai/dsh-scope',
  '@deepseek-ai/dsh-system-prompt', '@deepseek-ai/dsh-tools', '@deepseek-ai/dsh-llm',
  '@deepseek-ai/dsh-session-projection', '@deepseek-ai/dsh-session-query', '@deepseek-ai/dsh-commands',
  '@deepseek-ai/dsh-user-approval', '@deepseek-ai/dsh-user-questions', '@deepseek-ai/dsh-goal',
  '@deepseek-ai/dsh-jobs', '@deepseek-ai/dsh-skill', '@deepseek-ai/dsh-subagent',
  '@deepseek-ai/dsh-workflow', '@deepseek-ai/dsh-hook-protocol', '@deepseek-ai/dsh-command-feedback',
])
const canonicalOwnerBySection = {
  'agent-session-and-scope': '@deepseek-ai/dsh-agent',
  'system-prompt-composition': '@deepseek-ai/dsh-system-prompt',
  'tool-runtime-and-definition': '@deepseek-ai/dsh-tools',
  'llm-provider-and-adapter': '@deepseek-ai/dsh-llm',
  'context-contributions': '@deepseek-ai/dsh-system-prompt',
  'session-query': '@deepseek-ai/dsh-session-query',
  'session-extension-and-persistence': '@deepseek-ai/dsh-session-projection',
  'commands-approval-and-questions': '@deepseek-ai/dsh-commands',
  'goal-plan-and-todo': '@deepseek-ai/dsh-goal',
  jobs: '@deepseek-ai/dsh-jobs',
  skills: '@deepseek-ai/dsh-skill',
  subagents: '@deepseek-ai/dsh-subagent',
  workflows: '@deepseek-ai/dsh-workflow',
  'external-hooks': '@deepseek-ai/dsh-hook-protocol',
  feedback: '@deepseek-ai/dsh-command-feedback',
  guards: '@deepseek-ai/dsh-tools',
}
const migrationPackage = /dsh-session-format-v\d-to-v\d$/
const pluginTask = item => `Use ${packageName(item) || item.path} as part of a target-version Host plugin composition; see the owning section for mounting, lifecycle, failure, and verification.`

const capabilityRecommendations = capabilities.map(item => {
  const pkg = packageName(item)
  const common = { id: item.id, kind: item.kind, path: item.path, ...owner(item) }
  if (migrationPackage.test(pkg)) return { ...common, decision: 'excluded', reason: 'Published historical session migration implementation. It is selected by the format catalog during restore, not a normal extension point or dependency for a new plugin.' }
  if (item.kind === 'composition-manifest') return { ...common, decision: 'merged', mergedInto: 'package:@deepseek-ai/dsh-subagent', pluginTask: 'Mount the corresponding out-of-process subagent provider with its required tool and runtime composition.', reason: 'The manifest is composition evidence for the provider package, not a separately callable API.' }
  if (canonicalPackages.has(pkg)) return { ...common, decision: 'included', pluginTask: pluginTask(item), reason: 'Canonical public Host service or extension contract used directly by plugin authors.' }
  return { ...common, decision: 'merged', mergedInto: `package:${canonicalOwnerBySection[topicFor(item)[1]] ?? '@deepseek-ai/dsh-agent'}`, pluginTask: pluginTask(item), reason: 'Public first-party provider, policy, projection, command, or tool package. Covered as a concrete mount/configuration option under its canonical subsystem contract rather than as a duplicate top-level topic.' }
})

const entryRecommendation = item => {
  const common = { id: item.id, package: item.package, subpath: item.subpath, path: item.path, ...owner(item) }
  if (item.subpath === './internal' || item.subpath === './invariant') return { ...common, decision: 'excluded', reason: item.subpath === './internal' ? 'Explicit internal transport helper; not a supported plugin entry point.' : 'Repository invariant plugin used by validation/test compositions; not a normal application plugin contract.' }
  if (migrationPackage.test(item.package)) return { ...common, decision: 'excluded', reason: 'Historical restoration migration entry; use the format catalog rather than importing it from a new plugin.' }
  if (item.subpath === '.') return { ...common, decision: canonicalPackages.has(item.package) ? 'included' : 'merged', ...(canonicalPackages.has(item.package) ? {} : { mergedInto: `package:${item.package}` }), reason: canonicalPackages.has(item.package) ? 'Primary published entry for the canonical extension contract.' : 'Primary published entry for a first-party implementation covered under its subsystem task.' }
  return { ...common, decision: 'merged', mergedInto: `export:${item.package}:.`, reason: 'Published secondary entry (types, client, remote, typert, view, brand, estimate, or other focused surface); document it with the package contract and its side boundary.' }
}
const apiEntryRecommendations = entries.map(entryRecommendation)
const entryDecision = new Map(apiEntryRecommendations.map(item => [item.id, item]))

const apiObjectRecommendations = []
const apiMemberRecommendations = []
for (const entry of symbols) {
  const parent = entryDecision.get(entry.entry)
  for (const symbol of entry.symbols ?? []) {
    const duplicateOrBoilerplate = entry.entry.split(':').at(-1) !== '.' || ['apply', 'inject', 'name', 'default'].includes(symbol.name)
    const decision = symbol.deprecated || parent?.decision === 'excluded' ? 'excluded' : duplicateOrBoilerplate || parent?.decision === 'merged' ? 'merged' : 'included'
    const reason = symbol.deprecated ? 'The target-tag declaration marks this symbol deprecated; do not use it in new plugin examples.' : parent?.decision === 'excluded' ? parent.reason : duplicateOrBoilerplate ? 'Secondary re-export or Cordis plugin metadata; covered by the package mounting contract instead of repeated as an independent API object.' : parent?.decision === 'merged' ? 'Public object belongs to a first-party implementation package and is covered under its canonical subsystem section.' : 'Direct public object on a canonical plugin extension entry.'
    apiObjectRecommendations.push({ entry: entry.entry, source: entry.source, symbol: symbol.name, signature: symbol.signature, deprecated: Boolean(symbol.deprecated), decision, reason, ...owner({ package: parent?.package, source: entry.source }) })
    for (const member of symbol.members ?? []) {
      apiMemberRecommendations.push({ entry: entry.entry, symbol: symbol.name, member: member.name, signature: member.signature, deprecated: Boolean(member.deprecated), decision: member.deprecated || decision === 'excluded' ? 'excluded' : decision === 'merged' ? 'merged' : 'included', reason: member.deprecated ? 'The target-tag declaration marks this member deprecated; excluded from new plugin usage.' : decision === 'excluded' ? reason : 'Direct declared member; its usable semantics, side, ownership, and errors are inherited from the owning object section.', ...owner({ package: parent?.package, source: entry.source }) })
    }
  }
}

const genericTask = /^(summary|table of contents|understand the implementation|design( philosophy| concept)?|source map|main flow|further exploration|model experience|known limitations and deferred work|dev note|role|invariants?|packages|related documentation|开发备注|实现原理|设计(理念|概念)?|源码地图|进一步探索|模型体验|已知限制.*|包|相关文档)$/i
const actionTask = /^(use |when to |configure|configur|register|create|mount|compose|add |ask |drive|read |write |run |enable|set |switch|choose|expos|install|finding|getting|pairing|observ|measur|restrict|enforce|contribute|suppress|intercept|fork|flush|append|define|persist|what you can do|what you get|failures and recovery|cancellation|change detection|配置|最小配置|挂载|注册|创建|读取|写入|运行|启用|设置|切换|选择|暴露|安装|查找|获取|配对|观察|度量|限制|执行|贡献|抑制|拦截|派生|持久|询问|驱动|评价如何|截止时间如何|钩子如何)/i
const taskRecommendations = tasks.map(item => {
  const common = { id: item.id, kind: item.kind, path: item.path, title: item.title, ...owner(item) }
  if (genericTask.test(item.title ?? '')) return { ...common, decision: 'excluded', reason: 'Generic navigation, internal explanation, rationale, or maintenance heading; it is not an observable plugin-author task.' }
  return { ...common, decision: actionTask.test(item.title ?? '') ? 'included' : 'merged', ...(actionTask.test(item.title ?? '') ? {} : { mergedInto: `task-path:${topicFor(item)[1]}` }), reason: actionTask.test(item.title ?? '') ? 'Action-oriented package task with an observable plugin result.' : 'Supporting behavior or boundary heading merged into the owning end-to-end plugin task.' }
})

const claims = [
  ['tool-canonical-output', 'Every ToolDefinition declares one output.schema, returns a canonical JSON value from execute(), and derives model content with the pure output.render(); execution must forward exec.signal and settle owned work.', ['packages/core/tools/src/index.ts', 'packages/core/tools/tests/tools.spec.ts', 'docs/cookbook/adding-a-tool.md']],
  ['tool-scope-disposal', 'ToolRuntime.register(), restrict(), guard(), and presentAs() are scoped registrations that return Cordis effect disposers; plugin teardown must let the scope dispose them.', ['packages/core/tools/src/index.ts', 'packages/core/tools/tests/scoped.spec.ts']],
  ['tool-timeout-cooperative', 'ToolDefinition.timeoutMs is enforced only when dsh-tool-call-timeout-policy is mounted and remains cooperative rather than a hard kill.', ['packages/core/tools/src/index.ts', 'packages/guard/timeout-policy/src/index.ts', 'packages/guard/timeout-policy/tests/timeout-policy.spec.ts']],
  ['agent-factory-required', 'AgentRegistry.create/resume fail when no agent-loop factory is registered; dsh-agent-loop owns the concrete loop and cancellation/drain behavior.', ['packages/core/agent/src/index.ts', 'packages/core/agent-loop/src/index.ts', 'packages/core/agent-loop/tests/shutdown-drain.spec.ts']],
  ['session-log-source-of-truth', 'Session.append validates and snapshots lossless JSON and surface metadata before committing; observer failures after acceptance are contained and do not roll back the event.', ['packages/core/session/src/index.ts', 'packages/core/session/tests/json.spec.ts', 'packages/core/session/tests/surface.spec.ts']],
  ['session-sync-read-deprecated', 'Session.eventAt(), snapshotEvents(), and ownEvents() are deprecated for new calls; new plugins should use SessionQuery/session projections instead of synchronous log inspection.', ['packages/core/session/src/index.ts', 'packages/session-query/session-query/src/index.ts', '.agents/notes/implemented/architecture/2026-09-09-deprecate-synchronous-session-event-reads.md']],
  ['system-prompt-scoped', 'SystemPrompt section/context/tools/variable registrations are scope-aware and disposable; same-name scoped entries shadow global entries and assembly is deterministic.', ['packages/core/system-prompt/src/index.ts', 'packages/core/system-prompt/tests/system-prompt.spec.ts']],
  ['llm-registration', 'LlmRuntime adapter and directory registrations return handles/disposers; provider selection and prepareCall/stream errors are reported on the LLM failure path.', ['packages/llm/llm/src/index.ts', 'packages/llm/llm/tests/service.spec.ts', 'docs/cookbook/adding-an-llm-adapter.md']],
  ['session-projection-pure', 'SessionProjection definitions are pure folds registered with the projection registry; persistent cache is an optimization and must not become the source of truth.', ['packages/session/session-projection/src/index.ts', 'packages/session/session-projection-cache/src/index.ts', 'packages/session/session-projection/tests/registry.spec.ts']],
  ['commands-cancel', 'CommandRuntime registrations are scoped; command execution receives agent, attachments, source, and AbortSignal, and cancellation remains an explicit failure path.', ['packages/interaction/commands/src/index.ts', 'packages/interaction/commands/tests/commands.spec.ts']],
  ['approval-fail-closed', 'Approval policy never rejects escalation without prompting; ask still fails closed when no answerer is available, and requests carry a cancellation signal.', ['packages/interaction/user-approval/src/index.ts', 'packages/interaction/user-approval/tests/approval.spec.ts', 'docs/subsystems/approval.md']],
  ['question-service', 'UserQuestionService ask/askTimed owns a durable pending question and resolves, times out, or aborts explicitly; tool-ask-user is only the model-facing consumer.', ['packages/interaction/user-questions/src/index.ts', 'packages/interaction/tool-ask-user/src/index.ts', 'packages/interaction/user-questions/tests/user-questions.spec.ts']],
  ['goal-durable', 'Goal lifecycle mutations are session events folded into GoalProjection; services and tools must not keep an independent authoritative copy.', ['packages/goal/goal/src/index.ts', 'packages/goal/goal/src/types.ts', 'packages/goal/goal/tests/goal.spec.ts']],
  ['jobs-owner', 'JobRegistry requires an owner, provides bounded output reads and explicit wait/kill/remove operations, and jobs-local enforces concurrency and retention.', ['packages/jobs/jobs/src/index.ts', 'packages/jobs/jobs-local/src/index.ts', 'packages/jobs/jobs/tests/service.spec.ts']],
  ['skill-provider', 'SkillRegistry supports runtime registrations and observable providers; provider control and returned disposers own invalidation and cleanup.', ['packages/skill/skill/src/index.ts', 'packages/skill/skill/tests/skill.spec.ts']],
  ['subagent-provider', 'SubagentRuntime providers declare one-shot or continuable capabilities; depth, active-capacity, cancellation, child drain, and disposal are runtime-owned gates.', ['packages/subagent/subagent/src/index.ts', 'packages/subagent/subagent/src/lifecycle.ts', 'packages/subagent/subagent/tests/service.spec.ts']],
  ['subagent-acp-one-shot', 'The ACP provider is one-shot and process-owned; it does not provide continuable messaging/interrupt semantics.', ['packages/subagent/subagent-acp/src/index.ts', 'packages/subagent/subagent-acp/src/run.ts', 'packages/subagent/subagent-acp/tests/subagent-acp.spec.ts']],
  ['workflow-engine', 'WorkflowEngine starts a run from script/meta/args, exposes cancellation and disposal, and bounds agent creation through maxTotalAgents and provider selection.', ['packages/workflow/workflow/src/index.ts', 'packages/workflow/workflow/src/runtime-types.ts', 'packages/workflow/workflow/tests/workflow.spec.ts']],
  ['hooks-external-process', 'Hook protocol runs external commands with timeout, AbortSignal, bounded stderr summaries, detached-run draining, and explicit output parsing/merge semantics.', ['packages/hooks/hook-protocol/src/index.ts', 'packages/hooks/hook-protocol/src/runner.ts', 'packages/hooks/hook-protocol/tests/runner.spec.ts']],
  ['profile-composition', 'The base and web-app bundle patch files demonstrate actual Host combinations; package export or README presence alone does not prove default mounting.', ['packages/bundle/base/cordis.patch.yml', 'packages/bundle/web-app/cordis.patch.yml', 'packages/bundle/web-app/presets/standard.patch.yml']],
].map(([id, statement, evidencePaths]) => ({ id, statement, category: 'implemented-behavior', evidence: evidencePaths.map(path => ({ path, tag: 'dsh-v0.2.0-rc.2', commit: '639ed015397290b3745d163aafe02ffee4aa3f84' })) }))

const taskPaths = [
  ['register-host-tool', 'Register a cancellable tool with one canonical JSON result and pure rendering.', ['@deepseek-ai/dsh-system-prompt:SystemPrompt', '@deepseek-ai/dsh-tools:ToolRuntime', '@deepseek-ai/dsh-tools:ToolDefinition'], ['Mount system-prompt and tools services.', 'Register ToolDefinition in the plugin context and retain the returned disposer.', 'Validate args through the declared schema, forward exec.signal, return canonical JSON only.', 'Render/present from args plus canonical value without side effects.', 'Invoke through a real agent and verify tool/call plus tool/result Session events; unload and confirm the registration disappears.']],
  ['extend-system-prompt', 'Add scoped prompt sections, variables, context, or tool schema providers.', ['@deepseek-ai/dsh-system-prompt:SystemPrompt'], ['Mount system-prompt.', 'Register a uniquely named contribution in the intended Cordis scope.', 'Use the returned effect disposer or scope lifetime for cleanup.', 'Assemble in global and scoped contexts and verify deterministic text/tool visibility.']],
  ['add-llm-adapter', 'Register an LLM adapter and optional model directory.', ['@deepseek-ai/dsh-llm:LlmRuntime', '@deepseek-ai/dsh-llm:LlmAdapter'], ['Mount LlmRuntime.', 'Register adapter and directory entries; retain handles.', 'Implement prepareCall/stream with abort and typed LlmError failures.', 'Create an agent-loop request against the provider and verify streaming, cancellation, and handle disposal.']],
  ['persist-derived-session-state', 'Define a pure Session projection and optional checkpoint cache.', ['@deepseek-ai/dsh-session:Session', '@deepseek-ai/dsh-session-projection:SessionProjectionRegistry', '@deepseek-ai/dsh-session-query:SessionQuery'], ['Define the projection fold from canonical Session events.', 'Register it before sessions are opened.', 'Read through the projection/query service, not deprecated synchronous Session log methods.', 'Restart from JSONL persistence and verify the same derived value; treat cache loss as recomputation.']],
  ['add-command-and-approval', 'Register a human command that requests policy-controlled approval.', ['@deepseek-ai/dsh-commands:CommandRuntime', '@deepseek-ai/dsh-user-approval:ApprovalService'], ['Mount commands and approval services plus an answerer.', 'Register the command in the intended scope.', 'Forward CommandExecution.signal into ApprovalService.request.', 'Return a command result for allowed/rejected/cancelled/unavailable and verify the session audit events.', 'Dispose scope and confirm the command is no longer listed.']],
  ['manage-goal', 'Create and drive a durable session goal from Host code or model tools.', ['@deepseek-ai/dsh-goal:GoalService', '@deepseek-ai/dsh-tool-goal:default'], ['Mount goal before its command/tool/round-driver consumers.', 'Create or edit through GoalService for the target Session.', 'Use pause/resume/block/complete with explicit authority.', 'Reload the Session and verify GoalProjection reconstructs the same state.']],
  ['run-background-job', 'Start a bounded Host job and expose wait/read/kill through tool-jobs.', ['@deepseek-ai/dsh-jobs:JobRegistry', '@deepseek-ai/dsh-jobs-local:LocalJobRegistry'], ['Mount jobs-local as the registry implementation and tool-jobs as the model surface.', 'Start with an explicit owner and cancellation controller.', 'Append bounded output and settle outcome.', 'Read/wait, kill on cancellation, and remove when retention is no longer needed.']],
  ['provide-skills', 'Register runtime skills or a filesystem Skill provider.', ['@deepseek-ai/dsh-skill:SkillRegistry', '@deepseek-ai/dsh-skill-filesystem:FileSystemSkillProvider'], ['Mount skill registry.', 'Register one runtime skill or provider and retain its disposer/control.', 'Mount tool-skill if the model needs discovery/invocation.', 'List/get in the intended cwd and verify explicit invocation, invalidation, provider failure, and unload cleanup.']],
  ['delegate-subagent', 'Add one-shot or continuable subagent delegation.', ['@deepseek-ai/dsh-subagent:SubagentRuntime', '@deepseek-ai/dsh-tool-subagent:default'], ['Choose a provider whose capabilities match one-shot or continuable use.', 'Mount runtime, provider, and tool surface with a finite maxDepth.', 'Forward parent cancellation; collect or drain children according to provider mode.', 'Verify depth/capacity refusal, normal settlement, interruption, unload disposal, and durable child/parent Session links.']],
  ['run-workflow', 'Expose a bounded multi-agent workflow through tool-workflow.', ['@deepseek-ai/dsh-workflow:WorkflowEngine', '@deepseek-ai/dsh-workflow-ptc:default'], ['Mount workflow engine, runtime, and selected subagent provider.', 'Provide script/meta/args and explicit maxTotalAgents.', 'Start through Host or tool-workflow and retain the run.', 'Verify progress events, result/error, cancellation, child cleanup, and result-size bounds.']],
  ['run-external-hook', 'Adapt Claude Code or Codex hooks through the common hook protocol.', ['@deepseek-ai/dsh-hook-protocol:runHook'], ['Parse the external configuration into a dialect-specific invocation.', 'Run with cwd/env, finite timeout, AbortSignal, and stderr bound.', 'Parse and merge outputs; append invocation/result events.', 'Drain detached work during unload and verify timeout/nonzero/malformed-output paths.']],
  ['add-context-provider', 'Contribute time, instruction, file-reference, session-reference, or tmux context.', ['@deepseek-ai/dsh-system-prompt:SystemPrompt'], ['Mount the specific context plugin after its required services.', 'Configure roots, budgets, polling, or time zone explicitly.', 'Assemble a request in the intended Session/agent scope.', 'Verify source metadata in Session-visible context, updates, cancellation, and watcher/timer disposal.']],
].map(([id, outcome, apiObjects, compositionSteps]) => ({ id, outcome, decision: 'included', owner: 'how-to/host-core.md', ownerSections: [`#${id}`], apiObjects, compositionSteps, completionCriteria: compositionSteps.at(-1) }))

const dispositionCounts = items => Object.fromEntries(
  Object.entries(Object.groupBy(items, item => item.decision)).map(([decision, values]) => [decision, values.length]),
)

const report = {
  schemaVersion: 1,
  target: { version: '0.2.0-rc.2', tag: 'dsh-v0.2.0-rc.2', commit: '639ed015397290b3745d163aafe02ffee4aa3f84' },
  scope: { families: [...families], generatedFrom: ['evidence/capability-candidates.json', 'evidence/api-entry-candidates.json', 'evidence/api-symbol-candidates.json', 'evidence/task-candidates.json'], warning: 'Recommendations only. The main agent owns shared coverage/api-surface/claims/manifest integration and final semantic adjudication.' },
  statistics: {
    capabilityCandidates: capabilityRecommendations.length,
    capabilityDisposition: dispositionCounts(capabilityRecommendations),
    apiEntries: apiEntryRecommendations.length,
    apiEntryDisposition: dispositionCounts(apiEntryRecommendations),
    apiObjects: apiObjectRecommendations.length,
    apiMembers: apiMemberRecommendations.length,
    taskCandidates: taskRecommendations.length,
    taskDisposition: dispositionCounts(taskRecommendations),
    claims: claims.length,
    taskPaths: taskPaths.length,
  },
  capabilityRecommendations,
  apiEntryRecommendations,
  apiObjectRecommendations,
  apiMemberRecommendations,
  claims,
  taskCandidateRecommendations: taskRecommendations,
  taskPaths,
  evidencePaths: [
    'packages/core/**', 'packages/context/**', 'packages/llm/**', 'packages/session/**', 'packages/session-query/**',
    'packages/interaction/**', 'packages/goal/**', 'packages/plan/**', 'packages/jobs/**', 'packages/skill/**',
    'packages/workflow/**', 'packages/subagent/**', 'packages/hooks/**', 'packages/guard/**', 'packages/feedback/**', 'packages/todo/**',
    'docs/architecture.md', 'docs/subsystems/{core,scope,session,system-prompt,tools,llm-streaming,session-projection,session-query,commands,approval,user-questions,goal,jobs,skills,subagent,workflow,todo,plan,feedback}.md',
    'docs/cookbook/{adding-a-tool,adding-an-llm-adapter,adding-a-remote-api,extension-cookbook}.md',
    'packages/bundle/{base,sdk-app,sdk-minimal,web-app}/**/*.yml', 'packages/bundle/web-app/presets/*.patch.yml',
  ],
  notCovered: [
    'No isolated consumer project was built for these drafts.',
    'No real LLM provider request, account credential flow, or network-backed model discovery was run.',
    'No real Claude Code, Codex, ACP, or DSH SDK child process was launched.',
    'No browser Client or Typert Remote round trip was run for commands, goals, feedback, questions, projections, or subagents.',
    'No crash/restart test was run against a real JSONL directory; conclusions are code/test-backed only.',
    'The recommendation generator conservatively merges first-party packages and translated task headings; the main agent must review the shared ledgers before freezing.',
  ],
}

fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`)
