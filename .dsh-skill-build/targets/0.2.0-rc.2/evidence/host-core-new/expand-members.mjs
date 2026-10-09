import fs from 'node:fs';
import path from 'node:path';
const root = '.dsh-skill-build/targets/0.2.0-rc.2';
const missing = JSON.parse(fs.readFileSync(`${root}/evidence/integration-new/missing-member-content.json`, 'utf8')).filter(x => x.owner?.startsWith('references/api-host'));
const descriptions = {
'Context.baseUrl':'可选的 Host 基础 URL；只有宿主配置后才有值。','Context.events':'Cordis 事件服务，供插件注册与发出生命周期事件。','Context.logger':'Cordis 日志服务；按插件作用域输出诊断。','Context.reflect':'Cordis 反射服务，查询服务和插件元信息。',
'AgentLoop.config':'当前 loop 配置；读取运行参数时使用。','AgentLoop.createAgent':'以 ownerCtx 创建 AgentHandle；调用方负责其生命周期。',
'AuthorizationFlow.key':'本次授权流程关联的 CredentialKey，用于定位应更新的凭据。',
'CommandDescriptor.name':'命令的注册名和路由键。','CommandDescriptor.description':'提供给命令发现界面的说明文字。',
'CompactionResult.startSeq':'被压缩区间起始 seq。','CompactionResult.endSeq':'被压缩区间结束 seq。','CompactionResult.shadowedRange':'被摘要遮蔽的连续日志范围，含起止 seq。','CompactionResult.shadowedSeqs':'实际被遮蔽的事件 seq 清单；不能用连续范围代替精确清单。','CompactionResult.shadowedTokenCount':'本次被遮蔽内容估算的 token 数。','CompactionResult.sourceCommandId':'触发手动压缩的命令 ID；自动压缩时可缺省。','CompactionResult.summarySeq':'写入摘要事件的 seq，可用于追溯摘要。',
'ManualCompactionError.name':'错误类型判别名；细分失败原因仍以 code 为准。',
'CreateGoalRequest.objective':'目标文本，创建时必须提供。','CreateGoalRequest.maxGoalRounds':'可选轮数上限，由服务校验并写入目标状态。','GoalService.remoteExportCreate':'供 Remote create 调用的适配入口；Host 插件直接调用 create。','GoalView.id':'目标标识。','GoalView.objective':'已保存的目标文本。','GoalView.maxGoalRounds':'当前轮数上限。','GoalView.roundsStarted':'已启动轮数，不能当作已完成轮数。','GoalView.blockedReason':'阻塞状态的原因；未阻塞时可缺省。','GoalView.createdAt':'创建时间戳。','GoalView.updatedAt':'最近更新时间戳。',
'DirectoryPickerError.path':'发生错误的目录路径；诊断时可显示，避免误作成功选择结果。',
'JobHandle.id':'运行中 job 的唯一 ID，供查询与取消。','JobRegistry.attachController':'按名称声明 controller 的存续；返回的 disposer 在卸载时调用。','JobSpec.outputLimitBytes':'可选输出保留上限；输出超限时不能假定内存视图含完整内容。','JobView.id':'job 标识。','JobView.kind':'job 类别。','JobView.label':'用户可读名称。','JobView.status':'当前状态。','JobView.detail':'可选状态细节。','JobView.progress':'可选进度文字。','JobView.startedAt':'开始时间戳。','JobView.finishedAt':'终止时间戳；未结束时为空。','JobView.output':'输出窗口的 total/earliest 偏移和可选溢出文件路径；读取片段须尊重窗口边界。','JobView.outputLimitBytes':'该 job 的可选输出上限。',
'AssistantStreamRecord.type':'流记录的判别字段，区分 chunk、文本、推理与工具调用分块。',
'LlmRuntime.listModels':'查询指定 provider 可列出的模型；结果由 provider 决定。','LlmRuntime.resolveModelInfo':'解析指定 provider/model 的实际能力与上下文元信息；支持取消。',
'ScopedLayers.global':'默认全局层。','ScopedLayers.peek':'读取指定 scope 的当前最高优先级层；没有时为空。','ScopedLayers.chainLayers':'按继承链返回适用层，供合成有效配置。',
'SessionPersistenceSnapshot.header':'与快照事件和投影对应的 SessionHeader；恢复时不可与其他快照头混用。',
'SessionEventResultFilter.kind':'事件过滤器判别字段；限定 text/type/time/seq/surface 五类。','SessionResultFilter.kind':'会话过滤器判别字段；限定 id/cwd/parent/created-at/availability。',
'SessionObservation.cursor':'本次固定日志 cut 的游标，继续读取须以此为边界。','SessionObservation.events':'观察 cut 中的只读事件序列，不是可变 Session 日志。','SessionObservation.header':'与本次事件 cut 一致的 SessionHeader。','SessionObservation.projections':'可选投影快照；缺省时不能假定投影已加载。','SessionObservation.retain':'为同一观察结果取得另一个由调用方释放的 lease。','SessionObservation.source':'标识结果取自 live Session 还是 prepared 冷读。',
'SessionQueryEngine.observeSession':'取得固定日志 cut 的观察 lease，调用完成后释放。','SessionQueryEngine.readTitle':'读取可用的标题快照；找不到可返回 undefined。','SessionQueryEngine.readTitleSnapshot':'读取单个 Session 的标题观察结果及来源状态。','SessionQueryEngine.readTitleSnapshots':'批量读取标题观察结果，按请求 Session IDs 对应。','SessionQueryEngine.traceEvent':'追踪指定事件的来源与继承关系；支持取消。','SessionQueryEngine.traceSession':'追踪 Session 的父子 lineage；支持取消。',
'SessionTitleProvider.automatic':'声明 provider 支持的自动标题模式，供调度端选择。',
'Session.deriveMessages':'从已记录事件派生模型消息；不要绕过日志写私有消息状态。','Session.requestHeader':'读取当前请求 epoch 头；不在请求 epoch 时可为空。','SessionEvent.seq':'Session 日志中的单调序号。','SessionEvent.time':'事件记录时间戳。','SessionStore.create':'创建可用 Session；可指定 id 与创建选项。','SessionStore.list':'列出当前 store 中的 Session 句柄。','SessionStore.registerMessageProjection':'按事件类型注册消息投影，返回异步注销函数；恢复前应完成注册。',
'SubagentProvider.agentRouteDefaults':'可选默认 provider/model 路由，供续接型 Agent 解析。','SubagentProvider.inheritsParentContext':'声明是否继承父 Agent 的上下文历史，不能由调用方臆断。',
'SubagentRuntime.drainContinuableChildren':'等待指定父 Agent 下的续接子会话停稳。','SubagentRuntime.drainContinuableDescendants':'递归等待给定父 Agent 的续接后代停稳。','SubagentRuntime.interruptByParent':'父会话对续接子会话发出中断，并返回接收回执。','SubagentRuntime.listChildren':'按父 Session 查询直接子 Agent 目录。','SubagentRuntime.listDescendants':'按根 Session 查询全部后代目录。','SubagentRuntime.prompt':'向续接子 Agent 发送下一条提示，返回接收回执；受 signal 取消。','SubagentRuntime.resolveMaxDepth':'解析配置的深度上限；provider-managed 可以不产生数值上限。',
'SubagentStartRequest.parent':'发起任务的父 Agent，决定所有权与路由上下文。','SubagentStartRequest.prompt':'传给子 Agent 的内容块序列。','SubagentStartRequest.agentOptions':'可选子 Agent 运行参数，须受 provider 能力约束。','SubagentStartRequest.label':'可选用户可读任务名。','SubagentStartRequest.outputSchema':'可选结构化输出 schema，provider 必须声明支持。','SubagentStartRequest.toolFilter':'可选工具限制，provider 必须声明支持。',
'ToolDefinition.finalizeContent':'在执行结果确定后生成最终模型内容；包括失败路径，回调必须完整且不得再执行工具。','ToolDefinition.isConcurrencySafe':'逐次判断参数是否允许并发；仅返回 true 时才能并行调度。','ToolDefinition.presentCall':'把调用参数映射为 UI 调用视图，不得修改执行状态。','ToolDefinition.presentResult':'把规范结果映射为 UI 结果视图，不得改变工具结果。','ToolDefinition.projectContent':'把规范执行结果投影为模型可见内容；保持唯一规范 JSON 结果。','ToolDefinition.timeoutMs':'可选执行预算，须为有限正数；由超时策略执行取消。','ToolRuntime.execute':'执行 ToolExecutionInput 并返回规范结果；调用方处理失败与取消。','ToolRuntime.presentAs':'临时切换工具展示模式，返回恢复函数并在作用域结束调用。',
'ApprovalRequest.agent':'提出授权请求的 Agent，用于确定会话与策略。','ApprovalRequest.callId':'可选工具调用 ID，把决策关联到具体调用。','ApprovalRequest.reason':'可选给审批方的原因说明。','ApprovalRequest.signal':'可选取消信号，取消时停止等待审批。','ApprovalRequest.toolName':'待审批工具名。','ApprovalService.overrideOf':'读取 Session 日志中显式设置的审批覆盖；未设置返回 undefined。',
'AskUserQuestionAnswer.answers':'按请求问题返回的答案列表；调用方应按问题 ID 匹配。',
'WorkflowStartRequest.parent':'启动工作流的父 Agent。','WorkflowStartRequest.script':'工作流脚本文本。','WorkflowStartRequest.maxTotalAgents':'可选整个工作流的 Agent 总量上限。','WorkflowStartRequest.subagentProvider':'可选委派 provider 名称，决定工作流调用哪个子 Agent 实现。'
};
const byFile = new Map();
for (const x of missing) {const k=`${x.section}.${x.member}`;if (!descriptions[k]) throw Error(`missing description ${k}`);let m=byFile.get(x.owner)||new Map();let v=m.get(x.section)||[];v.push(x);m.set(x.section,v);byFile.set(x.owner,m)}
for (const [owner,sections] of byFile){const file=path.join(root,'skill-source/api-guardrails',path.basename(owner).replace(/^api-/,''));let doc=fs.readFileSync(file,'utf8');for (const [section,items] of sections){const heading=`## ${section}\n`;const start=doc.indexOf(heading);if(start<0) throw Error(`no section ${file} ${section}`);let end=doc.indexOf('\n## ',start+heading.length);if(end<0)end=doc.length;const lines=items.map(x=>`- \`${x.member}: ${x.signature.replace(/\n/g,' ')}\`：${descriptions[`${x.section}.${x.member}`]}`);const insert=`\n以下成员是该对象的公开契约：\n\n${lines.join('\n')}\n`;doc=doc.slice(0,end)+insert+doc.slice(end)}fs.writeFileSync(file,doc)}
console.log(`expanded ${missing.length} members across ${byFile.size} Host files`);
