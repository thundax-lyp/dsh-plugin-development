import json,posixpath
from pathlib import Path
T=Path('.dsh-skill-build/targets/0.2.1-rc.3');r=json.loads((T/'evidence/capabilities/result.json').read_text());S=T/'skill-source'
plans={
'dsh-llm':('目标是交付一个有明确 provider 路由、模型目录、流终态和卸载行为的 Host 提供方。消费项目固定 DSH 为 `0.2.1-rc.3`。','''1. 按[本地提供方完整包](../examples/example-local-llm.md)创建 package、TS 构建配置、入口和 bundle patch；先用无外部 I/O 的 adapter 走通装载，再换成真实 provider wire。
2. 实现 `LlmAdapter.stream`，把 provider 输出转换成规范 `StreamChunk`。先明确哪些 GenerateOptions 可实现；不支持的选项要拒绝。需要 Web 模型选择时实现 `listModels`，每项包含 provider、id 和 name。
3. 在声明 `inject: ['llm']` 的插件 `apply` 中注册 provider 路由。注册 handle 属于当前插件 scope；动态设置变更用 handle.replace 原子替换，卸载使用其 disposer，不能向裸全局 map 注册。
4. 按 example 的隔离 home 初始化 Web Profile，构建并安装 bundle。在模型目录选择自己的路由并发起一次调用；另在服务层迭代 stream，确认一个 terminal finish。
5. 接入真实 HTTP/SDK 时传递 signal、加入 attribution headers、映射稳定失败码；将 replayState 限制为恢复 provider 协议必需的无损 JSON。模型可见请求必须可由 Session 重建，不在 waterfall 中秘密改写。''','''分别验证正常文本、预先取消、进行中取消、不支持选项和重复路由。真实网络失败由 runtime 形成 error/aborted terminal；不要以 Promise 未 reject 就判断成功。热卸载贡献插件后路由撤回，重新调用得到 NO_ADAPTER。独立编译、Profile 激活、GUI 目录可选和完整流顺序是四个不同判据。'''),
'dsh-mcp-client':('目标是在真实 Profile 内发现并调用一个受信 MCP server 的工具。需要 `tools`，资源能力另由 mcp-resources 接入；服务器命令在宿主运行。','''1. 按[本地 MCP 完整示例](../examples/example-local-mcp.md)先建立并安装加法 server，再创建配置 bundle。先确定 stdio 或 streamable-http；两分支分别提供 command 或 url，不能混用字段。
2. 为 server 选 `[A-Za-z0-9_-]{1,32}` 的唯一 serverName；同一注册 scope 内不可冲突。将超时、初始失败是否阻断及重连策略写入 config；stdio args 不经过 shell 插值。
3. 在隔离 home 的 Web Profile 安装 bundle 并启动。等首次 discovery 完成后观察 `mcp__localadd__add`，用 a=2、b=3 实际调用并检查规范内容为 5。不能只检查进程存活。
4. 调用示例 refuse 工具，确认 isError 保留。需要 resources 时先确认服务器宣告相应 capability，再使用资源列表/模板/读取接口；没有 tools capability 的资源服务器不应被误报为不可连接。
5. 中断 transport 并观察重连。新 generation 必须完整同步后发布；达到上限时旧工具和 server 指令撤回。卸载时确认 backoff 终止、transport 关闭、子进程退出。''','''初始连接失败在 failOnStartupError=true 时阻断实例激活；false 不能被当成工具已可用。慢请求取消须到达 SDK/server，不以快速完成代替取消检查。验证实际发现、规范成功、规范错误、断线恢复与卸载无残留；HTTP 认证与平台网络按部署另行验证。'''),
'dsh-skill':('目标是随插件提供可被用户和模型分别发现、加载的 Skill；runtime 注册与文件系统发现是两条不同输入路径。','''1. 按[runtime Skill 完整包](../examples/example-runtime-skill.md)建立插件；声明 skills 注入，准备 kebab-case 名称、非空 description、正文、source 和独立的用户/模型 invocation policy。
2. 在插件 scope 调用 register。不要依靠同层重复注册覆盖旧正文；first-wins 的重复注册 disposer 不会移除赢家。动态内容应使用 provider 工厂并在变更后 invalidate。
3. 构建并安装 bundle，启动隔离 Web Profile。服务层检查 list/snapshot 和 get；scope 选择观看层，cwd 决定工作区发现，signal 取消该次操作。
4. 要让模型加载内容，组合 tool-skill 消费者；需要磁盘 Skill 时另选 skill-filesystem，并明确 roots、优先级和 watch。目录是 invocation-neutral 数据，消费边界按调用方式过滤。
5. 分别通过模型加载和用户 `/check-evidence` 观察正文；确认目录和加载结果进入该 consumer 的持久 Session。卸载贡献后重查赢家的 provider/source，避免把其他层同名 Skill 误认为残留。''','''非法名称、空 description、provider 内容名称不匹配和被取消的 get 都不能作为成功加载。发现 complete=false 时保留上次良好目录并在后续边界重试；不要缓存不完整发现。纯常量 Skill 无独立异步资源，文件 provider 则要在 owner 结束时中止 watch/发现。'''),
'dsh-commands':('目标是在用户输入面提供一个直接执行的命令，其结果出现在 UI，且不会自动变成模型输入。','''1. 参考[工作流命令完整包](../examples/example-workflow-command.md)建立 Host bundle，声明 commands 注入，注册不带斜杠的小写名称、description 和 handler。
2. 明确 rawInput 的解析；它保留命令名后原始空白。需要附件才声明 input.attachments，并决定哪些子命令接受它。没有接纳附件的分支应返回 error 让 UI 保留原件。
3. 将有资源的执行归当前 invocation 和插件 scope：传递 invocation.signal，跟踪正在运行的活对象，在插件 effect 中取消并等待清理。注册返回值负责撤回命令发现，不自动停止已外逃副作用。
4. 构建并安装 bundle，在 Web 输入 `/review-pair` 或自己的命令；检查 list/find 和实际 dispatch。命令审计应有相同 commandId 的 run/done 对，不重复写一份模型工具结果。
5. 若命令需要让 Agent 接收内容，显式调用该 Agent 的公开输入路径；直接返回 success.text 只产生 UI 输出。跨 Agent 的局部命令挂在对应 agent context，避免覆盖其他 agent 的全局行为。''','''测试未知命令、非法输入、附件拒绝和取消。handler 的 error 是预期失败通道；卸载后命令从目录消失且自身运行资源结束。只有领域事件已拥有 payload 时才关闭 recordInput，否则保留输入审计。'''),
'dsh-workflow':('目标是让一个调用 Agent 拥有一次脚本编排，从子任务返回规范 JSON，并能取消和等待全部资源释放。','''1. 按[工作流命令完整包](../examples/example-workflow-command.md)创建调用入口。先确认 workflowEngine、subagents 和执行提供方可用；不要把抽象 WorkflowEngine 当作执行后端。
2. 准备纯 JavaScript 函数体和 JSON meta/args，传入真实 parent Agent。脚本以 return 产生最终 JSON；不把 meta 或 args 当代码执行。
3. 使用 agent、parallel、pipeline 等 hook 组合有界工作，给总子任务数和并发设定部署范围。普通 child 失败可得到 null，脚本必须决定业务是否允许部分结果。
4. start 返回的 WorkflowRun 由本次调用持有。传入 signal，在 try 内 await run.result 并检查 stopReason，在 finally 中 await run.dispose。
5. 安装 bundle 并通过显式命令或已授权的 workflow 工具触发；核对每个 child 的 parent 和 workspace，观察最终 UI/模型结果，结束后确认进程与 child 不再运行。''','''无效 meta/脚本在 run 发布前拒绝；运行失败的 result 仍会兑现。只有 stopReason=completed 的 value 才作为成功输出。cancel 发起中止，dispose 才等待清理；不能在取消后把未完成结果当成功。'''),
'dsh-workflow-ptc':('目标是把工作流编排交给 Node PTC 执行，同时保持调用 Agent 的目录、文件策略和取消归属。','''1. 先挂载 Node PTC provider、subagent runtime 与所选 provider，再挂载 workflow-ptc；base bundle 已提供该组合时不要重复添加服务。Python PTC 组合不兼容此 TypeScript 引擎。
2. 配置 provider、maxConcurrentAgents、maxTotalAgents 和 maxItemsPerCall；单次请求可以降低子任务总量，脚本 hook 不得扩大它。为 PTC maxPendingCalls 预留启动、等待和清理空间。
3. 用[完整工作流调用包](../examples/example-workflow-command.md)实际启动一次 run。引擎在开始时捕获 cwd 和文件策略，之后父级切目录不改变此 run 的环境。
4. 处理结果与取消时遵守 WorkflowRun 所有权；引擎使用 timeoutMs=null，不提供整体经过时间上限，最初同步片段仍受 syncTimeoutMs 约束。
5. 在当前文件策略下验证真实执行与取消；没有约束能力的 provider 只能用于 danger-full-access，read-only/workspace-write 应在执行前拒绝。''','''失去进程、输出或控制预算超限都应表现为失败。Node isolation/VM 标记不代表网络隔离；实际强制事实取决于所选 sandbox/subprocess provider。取消后等待子任务与进程清理，再卸载引擎。'''),
'dsh-subagent':('目标是在真实父 Agent 下启动受管理子任务，并按后端能力等待结果、发送消息或停止执行。','''1. 先按上下文需求选择 spawn 或 fork，再按运行位置选择 in-process 或外部 ACP/SDK/CLI 后端；核对 provider 公开能力，不向一次性外部后端发送继续消息。
2. 在父级所见 scope 注册 provider，保留 disposer。调用 startActivation 前准备 parent、prompt、provider、深度及输出约束；可继续任务还要求持久化和必要 runtime 服务。
3. 需要模型入口时配置 tool-subagent 的 provider、toolName、preset 和深度限制；只有明确请求大型编排时再采用[工作流完整包](../examples/example-workflow-command.md)。
4. 启动后核对返回 child identity 与父子归属。消息使用真实 sender/target 和已准入内容；interruptByParent 只控制对应直接子级。不要把 inbox acceptance 当成子级已处理完。
5. 父级结束时 drain 自己的子级/后代并等待 backend dispose。外部后端返回一次性最终结果，本地可继续后端通过持久描述冷恢复；不序列化活 Agent 对象。''','''分别测试启动前取消、接受后取消、provider 不存在、深度超限及清理失败。委派时捕获父策略并把 approval 固定为 never；不要从子级调用人类 answerer 升权。真实子任务必须走所选 provider，空 provider map 或仅类型编译不能证明委派成功。'''),
'dsh-ptc-runtime':('目标是消费或实现一个有显式解析、执行结果和 owner 释放的程序运行接口。','''1. 为消费选择 Node 或 Python 等实际 provider，确认 language、programFormat 和支持的 sandboxMode；这些描述不授予权限。
2. 构造程序与异步 bindings，调用 resolve 补齐并验证 cwd、deadline 与 sandbox，再把返回 spec 交给 run。名称使用跨语言标识符并避开保留全局。
3. 处理 result.value/logs 与 result.error.kind；程序异常属于结果，错误使用接口则可能 reject，两者不能合并成一个成功文本。
4. 需要 retained memory 时为一个逻辑 owner 复用同一对象身份，禁止重叠执行，在 finally 或 owner 卸载时 await release(owner)。无 owner 的执行使用临时环境。
5. 通过实际 provider 执行一个只调用本地 binding 并返回 JSON 的程序，再检查 timeout、abort、非法输出和释放；工作流消费者的完整调用例见[工作流示例](../examples/example-workflow-command.md)。''','''约束证据来自 result.sandbox，不能从返回值、language 或 isolation 推断。重启或 release 后 retained memory 丢失，Session 只保留 consumer 记录的模型可见程序与结果。Node 与 Python 的能力不同，应分别验证。''')
}
for key,(goal,steps,checks) in plans.items():
 task=next(x for x in r['taskPaths'] if x['id']=='use-'+key);output=task['destinations'][0]['output'];file=next(x for x in r['files'] if x['output']==output);title=task['destinations'][0]['section'];text='# '+title+'\n\n## '+title+'\n\n### 目标与前置\n\n'+goal+'\n\n### 实现和使用步骤\n\n'+steps+'\n\n### 失败、取消与完成判据\n\n'+checks+'\n\n### 权威对象契约\n\n'
 for owner in sorted(set(o['owner'] for o in r['objects'] if o['id'] in task['apiObjects'])):text+='- ['+Path(owner).stem+']('+posixpath.relpath(owner,posixpath.dirname(output))+')。\n'
 (S/file['source']).write_text(text)
