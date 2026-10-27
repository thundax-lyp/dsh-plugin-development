import json,re
from pathlib import Path
P=Path('.dsh-skill-build/targets/0.2.1-rc.3');S=P/'skill-source';r=json.loads((P/'evidence/core/result.json').read_text());fm={f['output']:f['source'] for f in r['files']}
N={
'Agent':'''这是公开的live Agent句柄；id与session身份一致，session是耐久事实owner，ctx是Agent作用域、卸载后拒绝新注册。send显式选择target与wakeup，followup/steer/inject是固定路由别名，不代表任意消息已经执行。cancel在当前活动上保留首个cause，默认清除排队和steering工作，keepInbox保留待处理项；没有活动时不为未来工作预先设置取消。whenIdle等整个Agent活动静止，包括当前driver退出前替换的新活动，不保证某个特定message结算。只持有Agent不拥有销毁能力；创建者持有AgentHandle。''',
'AgentHandle':'''create/resume返回拥有型句柄，agent是可调用对象，dispose是销毁能力；get(id)只返回裸Agent，不能据此取得另一owner的销毁权。dispose停止loop并等待退出、注销Agent、从store移除Session，最后拆除其scoped world。factory provider也是结构owner，provider卸载会停止其全部live handles。配置创建Agent归loop fiber，不另向任意消费方暴露销毁句柄。''',
'CreateAgentOptions':'''sessionId是调用方给出的唯一live Agent/Session身份；parentAgent表达运行时owner关系，meta表达durable cwd、fork lineage、来源和深度。seed从seq0连续且数据可无损JSON，inheritedEventCount记录精确fork切点。signal仅创建期有效，成功句柄可见前解除该关联。setup在公布前接收(agentCtx,agent)，可注册子插件和scoped工具；不运行Agent。setup返回的同步commit紧邻公布点执行，任一步失败回滚且两个id不公布。''',
'ResumeAgentOptions':'''resumeSessionId指定既有持久Session身份，不是新建seed；parentAgent、agentOptions、创建取消signal和未发布setup具有与create一致的所有权边界。失败必须保留原持久记录，并拒绝用全新Session伪装恢复成功。resume只恢复当前协议与持久化provider支持的会话，不自动复原外部进程。''',
'AgentSetup':'''此回调装配未发布的Agent世界，返回void或AgentSetupCommit，也可异步。所有经agentCtx注册的scope资源先于session/created、agent/created和第一次prompt assembly存在。异步setup落定后才运行可选同步commit；回调不是Agent driver，不应在未公布阶段发送并驱动轮次。''',
'AgentSetupCommit':'''commit只允许同步返回void，执行点在所有setup awaits落定之后且紧邻registry发布；用途是对可变provision状态做最终校验。throw阻止发布并回滚未公布scope，不能把返回Promise当成等待的commit。''',
'AgentFactory':'''这是registry委派的创建/恢复接口，具体loop provider经setFactory注册。消费插件仍调用ctx.agents以保持loop可替换；factory接收caller Context与options，不从parentAgent暗推调用方作用域，provider卸载负责停止其创建的live handles。''',
'AgentStatus':'''表示live Agent生命周期的状态值；观察agent/status获取状态变化。idle是当前活动静止，不是某条message的因果回执；忙碌/取消和耐久入队结果须结合inbox与Session事件，不通过单个状态字符串推断业务已完成。''',
'CancelOptions':'''keepInbox控制取消当前活动时是否保留待处理inbox；省略则清除排队和steering工作。取消不撤销已提交的Session事实或已经发生的外部副作用，同一活动的首个cause保持不变。''',
'CreateSessionOptions':'''创建选项承载可验证的创建header/meta和可选seed。cwd为绝对路径；fork seed必须连续且明确继承前缀。数据在异步setup前做snapshot，不能让调用方后续修改输入对象改变已经接纳的创建事实。不要把仅内存创建等同磁盘持久化。''',
'PluginRecordMap':'''由拥有插件记录格式的包通过声明合并扩展，键决定plugin record的类型化payload。这里只声明领域事实，追加使用公开Session API；模型可见状态必须由日志重建，不在map里放Service或运行资源。新的格式与迁移责任归记录owner。''',
'PluginRecord':'''插件耐久事实的类型化记录，payload必须是可无损JSON的数据。使用对应PluginRecordMap键保持读写一致；重复投影不重复追加同一业务副作用，恢复时从记录推导状态而非重放外部动作。''',
'SessionId':'''品牌化的会话身份；同一live Agent/Session共享此id。编译品牌帮助防止混淆，并不验证会话存在、ownership或跨进程权限；运行时存在性与授权由store、controller和Peer资源判定。''',
'SessionSeq':'''单条Session事件的零基序号；表示具体事件，不是日志末尾边界。与SessionLogOffset分开，不把某事件seq直接当成已消费事件数量或fork前缀长度。''',
'SessionLogOffset':'''Session日志边界位置，表示从起点算的事件数量或切点；它可以指向末尾而不对应实际事件。切prefix、恢复游标和fork继承数用此类型，不与事件seq互换。''',
'appendPluginRecord':'''这是向Session追加有类型plugin事实的辅助函数，按PluginRecordMap选payload。它遵守同一Session追加/校验边界，不能用于绕过事件规范或直接把任意运行对象持久化。observer失败不回滚已经提交的记录，耐久完成仍通过flush确认。''',
'ScopeKey':'''不透明object身份，按引用比较而不是字段值比较。两个结构相同的新对象是不同scope，不能序列化一个key后期望自动恢复其identity关系。''',
'Scoped':'''scopeTarget返回的routing-only事件接收者品牌；泛型只帮助dispatch检查，不暴露真实subject属性。真实subject必须显式放在事件参数里，不能把carrier强转后当Agent或Session读取。''',
'Scope':'''ctx用于注册归该scope所有的贡献；rawDispose是精确Cordis disposer，适合放入有序复合effect；dispose是共享的quiescent边界，竞态调用等待同一次清理完成。调用方必须最终释放scope，不能仅删除自己的key映射而保留子fiber。''',
'createScope':'''在活动ctx下挂一个scope子插件，继承创建者依赖API并标记opaque key。options.parent在scope可用前绑定祖先，所有经返回ctx的注册归该scope。dispose等待fiber及其后续异步inertia静止；把scope包含在原owner的effect链。''',
'CreateScopeOptions':'''parent为可选的祖先ScopeKey，创建时通过bindScopeParent绑定且binding不暴露给普通调用方。它建立注册向下继承和事件向上传播关系，不提供权限或多租户进程隔离。''',
'bindScopeParent':'''一个key只允许首次绑定parent；重复绑定throw，形成环也throw。返回ScopeParentBinding是唯一可重设该关系的能力，不向其他调用方开放任意relink。''',
'ScopeParentBinding':'''rebind(parent)再次检查环；只有原binder持有此能力。调用方必须保证旧parent下未保留任何已产生的内容，即blank-session重新组合前提；关系表本身无法知道Session日志是否已经留存事实。''',
'scopeOf':'''从Context原型继承链读取最近scope tag；未标记返回undefined。不要用默认全局scope覆盖undefined来规避隔离，未标记就是全局贡献的语义。''',
'scopeTarget':'''保留base原Cordis filter，再允许未标记监听器全局接收；有tag监听器只能匹配dispatch key或其祖先。祖先监听器可观察后代事件，后代监听器不能收到向祖先dispatch的事件。返回carrier不暴露base属性，原subject在payload中传递。''',
'scopeParentOf':'''查询一个key的直接祖先，根scope返回undefined；只读查询不拥有rebind能力。''',
'scopeChainOf':'''返回[key,parent,grandparent,...]，最近者在前，undefined给空链。调用方可据此构造继承视图，但不能假定该快照未来仍未被合法binder重设。''',
'AnonymousEntries':'''匿名注册表保留同层多条贡献和各自disposer；没有按名字遮蔽的选择语义。effect登记的条目归调用scope，移除只撤销该次注册，不删除其他owner的贡献。''',
'NamedEntries':'''命名注册表在layer间按名字选择有效贡献，Agent层可以遮蔽全局同名默认。owner卸载后应恢复可见的祖先项，而不是把祖先永久删除；对重复同层名字遵循该registry拒绝规则。''',
'ScopedLayers':'''注册按当前Context scope路由，视图沿scope chain继承祖先layer；全局和局部资源各有owner。创建新layer不代表建立全局service，也不提供durable状态存储；dispose应撤销其贡献并恢复祖先视图。''',
'SystemPrompt':'''ctx.systemPrompt是有作用域的section、variable、context与tool schema registry。section顺序先order再name；局部同名贡献遮蔽全局，卸载后恢复。assemble求值，renderPrompt严格插值；未解析模板或多个complete段拒绝组装。refreshContext只刷新动态事实，suppressRuntimeContext不删除required事实。不要把context快照当成system段，也不在动态provider里执行未知外部副作用。''',
'PromptSection':'''name是注册身份，order是有限数位置，text可静态或按上下文求值；interpolate:false原样保留花括号，complete:true声明精确完整提示词且有效条目只能有一个。外部插件可选有限order，无需冒用第一方集中名称。''',
'PromptContext':'''运行时动态事实贡献；按order确定顺序，required贡献不会被suppressRuntimeContext屏蔽。与system section不同，它由loop作为带来源user快照进入历史，必须由事实owner提供，并在实际组装时刷新。''',
'PromptAssembly':'''组装阶段的可变协作结果，包含已求值但尚未严格插值的段、有序工具schema与变量值。waterfall追加项要自己保证确定性；不得把正在构造的assembly共享给并行请求作为全局缓存。''',
'renderPrompt':'''渲染已组装段：除interpolate:false外执行严格{{variable}}插值，删除空段，用空行连接。未知变量、已注册但无值或畸形完整模板都会throw；这发生在模型请求前，不以空字符串掩盖配置错误。''',
'DeepSeekHarness':'''SDK高层owner，首次使用惰性spawn且在多次run间持有子进程。run等待prompt的durable入队回执并收集到首次Agent idle，finalResponse是该活动区间最后提交根助手文本；不是单prompt因果保证。resumeSession从持久home恢复，session(id)仅当前进程懒句柄。close/await using回收进程；初始化与清理均失败保留AggregateError，不在退出未知时另开运行时。''',
'HarnessClient':'''低层JSON-RPC进程owner：start/initialize/prompt/request/close与通知订阅。prompt仅确认入队message id，不等任务完成；完整任务可先订阅再prompt并请求session/wait。Options.env给定时整体替换子进程环境。close先有界shutdown，再EOF→SIGTERM→SIGKILL，必须等真实退出，关闭后不能复用。''',
'HarnessSession':'''绑定SessionId的高层句柄；run的活动区间终点是首次idle，get/setWorkingDirectory读写有效目录并可创建未知Session但不启动模型轮次。相对目录按Session当前目录解析，不修改已启动外部进程、权限或最初cwd元数据。恢复既有持久会话应调用harness.resumeSession，而不是把session(id)当成磁盘加载。''',
'RunResult':'''sessionId是保存后续继续或恢复用的身份；finalResponse是活动区间最后提交根助手文本；events与notifications保留观察证据。steering或其他工作可在idle前加入，因此结果不承诺只对应某条prompt。没有finalResponse也不能直接判定进程或持久化失败，应结合事件和协议结果。''',
'NotificationSubscription':'''订阅owner可await next、tryNext非阻塞取出排队项，或异步迭代。session tree过滤在客户端跟随subagent.started血缘；不代表服务器只发送该树的通知。任务完成后释放订阅，close终止进程并结束所有接收等待。''',
'SessionCreateRequest':'''workspaceId与cwd互斥；未选Workspace时cwd决定独立Session目录。sessionId可请求复用仍空白且可复用的Session，或提供未存储的新身份；实际返回id可能不同，必须使用SessionCreateValue。agentPreset选择声明过preset并替换复用Session记录；省略使用配置默认。''',
'SessionCreateValue':'''sessionId是实际创建或复用后的身份，可能不同于请求值；agentPreset仅在部署有preset roster时给出。后续prompt、订阅与持久恢复使用此返回身份，不继续假设请求中的id被接纳。''',
'SessionPromptRequest':'''requestId由Client铸造并持久到确切接纳的user message；sessionId指定目标，mode为queue或steer。content必须至少有一个非空白text part或attachment，不能发送纯空输入。clientTimeZone是可选时区提示，非法值按领域码拒绝。输入接纳回执不保证模型轮次完成。''',
'SessionPromptValue':'''accepted:true只确认prompt已进入目标Agent inbox，不含模型最终响应。要跟踪执行，使用durable回执、Session事件或等待相应活动边界；未知网络结果先查requestId对应的持久消息，避免重复发送。''',
'SessionForkRequest':'''sessionId为源；atSeq是包含该事件在内的精确source seq，省略选择最近完成turn前缀。allowMigration默认true；false要求Host先检查所需迁移，不能静默以不兼容格式fork。fork只继承耐久前缀，不复制运行中的外部进程资源。''',
'SessionForkValue':'''返回新fork Session身份；后续操作使用新id，不修改源Session。不要把源atSeq误当新会话日志偏移或重新编号已有闭合事件。''',
'SessionRenameRequest':'''sessionId选择目标，title为待标准化标题。业务校验失败使用session/title-invalid而非静默接受空标题；确认成功后用返回的normalized title和seq更新本地视图。''',
'SessionRenameValue':'''title是Host规范化后的持久标题，seq是提交该变更的事件位置。它是完成提交证据，不应以发起请求时的本地title覆盖该规范值。''',
'SessionListRequest':'''cursor可省略，表达列表分页边界，不是SessionSeq；按返回契约处理分页，不把当前live Agent列表冒充完整持久目录。''',
'SessionSearchRequest':'''query是搜索文本；结果受Host上限与snippet截断约束。客户端呈现时使用hasMore标示未完全返回，不能把一个有限结果页当作完整无匹配证明。''',
'SessionSearchValue':'''items是当前有限搜索结果，hasMore标示存在更多结果而非服务错误。snippet有code-point限额，不能将其截断显示当完整原文用于后续业务改写。''',
'SettingsController':'''Host拥有settings Remote namespace，所有读取均要求redactSecrets:true并逐字段投影wire view，避免provider额外属性泄漏。update/replace/mutate委派settings provider，provider拒绝按settings/conflict或settings/rejected分类；缺provider返回明确配置诊断。构造时并列挂载credentials namespace，但这不代表任意凭据provider存在。''',
'CredentialsController':'''与settings controller一起装载的凭据Remote owner；具体凭据读写provider缺失时应明确报告，不把namespace存在当凭据配置完成。Secret值不能进入普通settings描述或模型上下文，身份与授权仍由Peer/RemoteAccess控制。''',
'ClientRemote':'''浏览器远端调用装配，声明由生成贡献扩展；$mount登记贡献并返回可等待disposer，owner卸载撤销namespace。$host仅plain facts，home首个ready frame前undefined；$on只允许assembly选择的转发事件。方法用RemoteResult分支，载体失败/取消归error而非任意reject，装配缺陷仍可throw。''',
'RemoteHostFacts':'''home是Host home，可在首个ready frame前undefined；isLoopback固定描述页面与Host关系。getter保持未变化facts的identity稳定；重连后刷新业务视图通过connection/reset或领域事件，不为这些plain字段虚构generation订阅API。''',
'RemoteAccessService':'''对每个非owner调用按endpoint/action/全部资源判定；principal从Host创建Peer固定，wire不能设定。global与session/workspace等资源独立，global允许不蕴含任意session允许。所有实际访问资源必须由默认推导或resources reader列全；遗漏的资源不会自动被检查。owner成功不证明非owner可用。''',
'TypertRegistry':'''现成生成贡献的进程内索引，注册归调用fiber；Host local descriptor使Gateway获得严格codec，卸载后记录definition-unavailable，不能悄悄退回宽松源码猜测。Client装配也消费生成contribution；读取metadata不会激活Host Service或发网络。''',
'TypertContribution':'''一份具有package与face身份的生成贡献，包含schema、model与invocations。由构建器生成并随包发布；运行期registry只登记已有数据，不运行TypeScript分析或从函数.toString恢复类型。不能手写弱codec假装通过严格生成。''',
'TypertClientRemote':'''协议最小Client界面只有$mount和$on，业务namespace由生成声明合并。$mount的disposer归调用owner，$on的事件键集由TypertRemoteEventSelection收窄；传输socket和event carrier由Gateway私有持有。''',
'TypertRemoteInfo':'''普通./remote生成的可挂载贡献，保留静态spec，首次descriptors/methods访问建立并缓存共享索引。methods只含直接方法，Context-only接收器留在descriptors与scoped声明。input视图、parser和projection各自懒缓存，不发网络、不激活Service。''',
'TypertRemoteMethod':'''生成的直接端点描述符同时给input(options?)和invoke(remote,input,signal?)；保持namespace receiver、可选位置空位、signal，并转发原Promise或完整stream handle。input strict影响消费方parser，不修改Host dispatch；result是唯一结果codec/可选投影。''',
'RemoteResult':'''判别式结果：ok:true携value，ok:false携真实RemoteError的失败union。先分支再读字段，按error.code收窄details；caller abort被归一为gateway/cancelled。不要通过instanceof识别跨独立bundle的失败。''',
'RemoteStreamHandle':'''Client下行可异步迭代，另外拥有send/end/dispose控制同一逻辑流的上行与生命周期。提前终止消费、组件卸载或cancel时dispose；send发的每项必须符合生成的uplink codec。one-way stream不凭空有可发送的In类型。''',
'principalOf':'''只在Remote invocation存在且principal为非owner时返回该JSON身份；owner或非Remote调用返回undefined。它不解析wire token，不把可持久化principal当凭据；需要记录发起者的领域事实只在返回有值时写字段。''',
'ProductTelemetryRecord':'''要求event name、string body与Unix毫秒timestamp；attributes只允许scalar string/number/boolean和一层这类值对象。severity可选且默认INFO，observed time在本地入队赋值。由consumer显式选择字段，不能自动带Session文本或隐式标识。''',
'ProductTelemetryScalar':'''产品attribute的scalar词汇；不允许用任意JSON嵌套对象绕过字段选择。即使类型能容纳字符串，也不代表允许加入凭据或用户消息内容。''',
}
entries={
 'Agent':'export:@deepseek-ai/dsh-agent:.','AgentHandle':'export:@deepseek-ai/dsh-agent:.','AgentFactory':'export:@deepseek-ai/dsh-agent:.','AgentStatus':'export:@deepseek-ai/dsh-agent:.','CancelOptions':'export:@deepseek-ai/dsh-agent:.','CreateAgentOptions':'export:@deepseek-ai/dsh-agent:.','ResumeAgentOptions':'export:@deepseek-ai/dsh-agent:.','AgentSetup':'export:@deepseek-ai/dsh-agent:.','AgentSetupCommit':'export:@deepseek-ai/dsh-agent:.',
 'CreateSessionOptions':'export:@deepseek-ai/dsh-session:.','PluginRecordMap':'export:@deepseek-ai/dsh-session:.','PluginRecord':'export:@deepseek-ai/dsh-session:.','SessionId':'export:@deepseek-ai/dsh-session:.','SessionSeq':'export:@deepseek-ai/dsh-session:.','SessionLogOffset':'export:@deepseek-ai/dsh-session:.','appendPluginRecord':'export:@deepseek-ai/dsh-session:.',
}
for name in ['ScopeKey','Scoped','Scope','createScope','CreateScopeOptions','bindScopeParent','ScopeParentBinding','scopeOf','scopeTarget','scopeParentOf','scopeChainOf','AnonymousEntries','NamedEntries','ScopedLayers']:entries[name]='export:@deepseek-ai/dsh-scope:.'
for name in ['SystemPrompt','PromptSection','PromptContext','PromptAssembly','renderPrompt']:entries[name]='export:@deepseek-ai/dsh-system-prompt:.'
for name in ['DeepSeekHarness','HarnessClient','HarnessSession','RunResult','NotificationSubscription']:entries[name]='export:@deepseek-ai/dsh-sdk-client:.'
for name in list(N):
 if name.startswith('Session') and name not in entries:entries[name]='export:@deepseek-ai/dsh-api-session-controller:.'
for name in ['SettingsController','CredentialsController']:entries[name]='export:@deepseek-ai/dsh-api-settings-controller:.'
entries['ClientRemote']='export:@deepseek-ai/dsh-api-gateway:./client';entries['RemoteHostFacts']='export:@deepseek-ai/dsh-api-gateway:./client';entries['RemoteAccessService']='export:@deepseek-ai/dsh-api-remote-access:.';entries['TypertRegistry']='export:@deepseek-ai/dsh-typert-registry:.';entries['TypertContribution']='export:@deepseek-ai/dsh-typert-registry:.'
for name in ['TypertClientRemote','TypertRemoteInfo','TypertRemoteMethod','RemoteResult','RemoteStreamHandle','principalOf']:entries[name]='export:@deepseek-ai/dsh-typert-protocol:.'
for name in ['ProductTelemetryRecord','ProductTelemetryScalar']:entries[name]='export:@deepseek-ai/dsh-host-product-telemetry-otel:.'
count=0
for n,entry in entries.items():
 os=[o for o in r['objects'] if o['symbol']==n and o['entry']==entry and o['decision']=='included']
 if not os:continue
 o=os[0];p=S/fm[o['owner']];t=p.read_text();t=t.replace('## '+o['section']+'\n','## '+o['section']+'\n\n'+N[n]+'\n');p.write_text(t);count+=1
print('specific semantics',count)
