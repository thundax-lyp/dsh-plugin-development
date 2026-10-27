import json,re
from pathlib import Path
T=Path('.dsh-skill-build/targets/0.2.1-rc.3');S=T/'skill-source';E=T/'evidence';r=json.loads((E/'capabilities/result.json').read_text());decl=json.loads((E/'capabilities/type-declarations.json').read_text())
# 展开判别联合和嵌套结构，候选签名留在账本原样。
for o in r['objects']:
 if o['decision']!='included':continue
 text=decl.get(o['source']+'#'+o['symbol'])
 if text and (' =\n' in text or text.startswith('type ') and (' | ' in text or '\n  |' in text)):
  f=S/next(x['source'] for x in r['files'] if x['output']==o['owner']);md=f.read_text();head='## '+o['section']+'\n';md=md.replace(head,head+'\n判别与嵌套结构如下；先按联合判别字段选择分支，再使用该分支的字段：\n\n```text\n'+text+'\n```\n',1);f.write_text(md)
notes={
'dsh-llm':'''### 模型调用与适配器的关键约束

`LlmAdapter.stream(options)` 是唯一必须实现的方法。它接收完整 `GenerateOptions`，返回 `AsyncIterable<StreamChunk>`。循环产生的请求经过深冻结，`llm/stream` waterfall 只能读取而不能改写模型可见输入；自行构造请求的调用方也必须在流结束前保持输入不变。模型可见信息应能由 Session 重建。

`registerAdapter(providers, adapter)` 首次必须提供非空路由。候选路由整体验证，冲突抛出 `DUPLICATE_ADAPTER`，不留下半套注册。返回的可调用 handle 释放全部当前路由；`replace(providers)` 同步原子替换，允许空数组，已释放后抛 `REGISTRATION_DISPOSED`。provider 目录与 adapter 路由是两份不同注册，`registerConfigurableProviders` 不会自动实现 wire 调用。

`prepareCall(config, signal, configure)` 将精确模型能力、默认配置、重试策略和 adapter generation 绑定。纯同步 `configure` 接收冻结副本，失败或取消在 dispatch 前拒绝。返回对象的 `stream` 只能调用一次，调用的配置字段必须匹配其 `config`，否则为 `INVALID_PREPARED_CALL`。不要先读取一代模型能力，再用新一代 endpoint 发起调用。

流中按首次出现分配 block index，同一 block 的 delta 和 end 保持 index。工具 arguments 始终是原始 JSON 字符串；`usage` 在 `finish` 前，terminal `finish` 后不得再产出。runtime 将 adapter 抛错归一化为 `finish.reason.kind: error/aborted`；消费者按 `failure.code` 判断，不解析错误文字。service 不自行重试；`dsh-llm-retry` 处理 failed-step 重试。

`listModels` 是建议目录，基础实现返回空列表；核心路由仍可接受未列出的模型 ID，GUI 选择与提交要求目录成员。为 GUI 提供模型的 adapter 须实现目录。`resolveModel` 的异步查询必须响应传入 signal。图片和文件仍使用持久引用；请求投影不允许静默丢失模型输入。
''',
'dsh-skill':'''### Skill 提供方与目录的关键约束

`ctx.skills.register(skill)` 为当前层注册借用的只读 runtime skill；名称为 kebab-case，description 非空，省略 invocation 则允许模型与用户调用，省略 provider 则标记 runtime。同层 runtime 同名条目先到者生效，重复注册返回空操作 disposer，不能移除先到者。

`registerProvider(create)` 向工厂提供 `signal` 和 `invalidate()`。provider 的名字不能是保留的 runtime；owner 卸载会撤销注册并中止生命周期。provider 必须在内容改变后调用 invalidate，不能依赖 consumer 猜测目录变化。`list(options)` 返回候选数组，或 `{ candidates, complete }`；发现不完整时不缓存，并允许 consumer 保留上次良好状态。

层间最近 scope 覆盖远层；同一层按较小 rank、provider 顺序和本地顺序选赢家。项目、runtime、用户的优先级不由 `source` 文本本身决定。`scope` 选择观看层，`cwd` 选择工作区，`signal` 取消发现与加载；遗漏 scope 只读取全局层。不要在 provider 中改写借用的 options 或候选。

`get(name, options)` 把发现时的 opaque locator 原样交还 provider，随后验证完整定义和名称。取消会在缓存命中后再次检查，并停止等待不合作的加载。目录本身与用户/模型调用资格无关，实际加载边界使用 invocation policy 分别过滤。资源基址有 directory、url、opaque 三分支；只有类型声明不能证明文件可以访问。
''',
'dsh-subagent':'''### 子任务的权限与所有权

`SubagentRuntime` 注册 provider；具体 provider 决定 fresh/fork、可继续或外部一次性执行的能力。不要把所有后端都视为可发消息的本地 Agent。可继续启动依赖持久化和运行时服务；缺失时公开操作拒绝，而非创建一个假 child。

`startActivation` 的启动过程归调用方取消控制；接受后的子级执行、最终结果投递和清理归 runtime。外部后端只有一次性结果，不支持继续消息；关闭须等待 backend handle 的 `dispose()` 完成。父级等待与取消不能把仍在清理的资源视为已结束。

子级继承委派时捕获的 sandbox 策略并固定 approval 为 never，不能让子级通过父级的应答者升级权限。独立 preset 选择与继承 preset 不同；同 ID 的显式选择也可能取得不同 generation。跨重启通过 Session 描述恢复，不序列化活 Agent 对象。

`sendMessage` 按真实 sender 和 target 身份执行，附件先被准入为持久引用。`interruptByParent` 要核对直接父子关系；`drainChildren` 与 `drainDescendants` 服务于 owner 的卸载，须等待停止完成。`listChildren` 从持久目录读取；外部子级是叶节点，不应尝试打开不存在的子 Session。
''',
'dsh-workflow':'''### Workflow 活对象与持久结果

`WorkflowEngine.start(request)` 接收纯 JavaScript 函数体，允许顶层 await，以 `return` 返回 JSON 值；不是 TypeScript 文件。`meta` 和 `args` 都是数据，不执行其中内容。`parent` 必填，脚本创建的每个 child 都归这个调用 Agent。

启动先验证 meta 与脚本，非法输入会在 run 创建前失败。`WorkflowRun.result` 以 `WorkflowResult` 兑现，不因脚本失败或取消而 reject；调用方检查 stopReason。无返回值按 null 处理。持有者在 `finally` 中 `await run.dispose()`；它幂等，取消未结束工作并等待脚本及子任务清理。`cancel()` 发起取消，不等同于清理完成。

脚本 hook 为 `agent`、`parallel`、`pipeline`、`phase`、`log`。schema 子任务输出需要经过验证；前台 workflow 工具等待最终结果。选择执行引擎时挂载 `dsh-workflow-ptc` 和实际 `ptcRuntime` provider，抽象 seam 不提供脚本执行环境。
''',
'dsh-ptc-runtime':'''### PTC 执行、失效与释放

`resolve(request)` 验证 cwd、timeout 与 sandbox，补充 provider 默认值，得到可传给 `run(spec)` 的完整输入；不把未解析请求直接交给 run。`programFormat` 区分 async function body 与 repl statements。语言和 isolation 是诊断描述，不是权限或隔离证明。

`run` 将程序异常、timeout、abort、worker-exit、invalid-output、output-limit、protocol、sandbox-unavailable 放入 `result.error.kind`；错误使用（如无效绑定名、未解析输入、dispose 后调用）则 reject。结果的 `sandbox` 独立说明实际强制事实，不能从成功值推断文件隔离。

bindings 的 global 与 error 名称使用跨语言标识符 `[A-Za-z_][A-Za-z0-9_]*`，避开 exported reserved 集合；`$tools`、`lambda`、`console` 不可用。host async bindings 需要自己实现取消与结果序列化。

支持 retained memory 的 provider 用对象身份 `stateOwner` 隔离状态；同 owner 不得重叠运行，owner 结束必须等待 `release(owner)`。省略 owner 使用临时环境。重启、release 和特定 provider 失败会丢失内存，Session 不恢复这些活对象。消费者负责持久记录模型看到的程序和结果。
''',
'dsh-mcp-client':'''### MCP 连接代际与清理

`Config` 是 transport 判别联合。stdio 分支需要 `serverName`、`command`；HTTP 分支需要 `serverName`、`url`。schema 补充 args/env/headers 与 deadline 等默认值，不能把已规范化接口的必填字段误作配置文件必填。serverName 匹配 `[A-Za-z0-9_-]{1,32}`，同一注册 scope 不允许两个活动实例持有同名；不同 Agent 的独立 scope 可重用。

远端工具名按 `mcp__<serverName>__<rawName>` 命名；非法字符或过长名称规范化并附 identity hash。工具发现和 generation 替换整体完成后发布；失败不把半套工具暴露给模型。资源能力与工具能力分别协商，只有 resources 的服务器也可连接。

初次连接/同步失败是否阻断激活由 `failOnStartupError` 控制。重连等待旧连接确认关闭，达到尝试上限则撤回工具。owner 卸载取消 backoff、关闭 transport、撤回工具和指令；不能在 shutdown 后重新发布迟到 generation。stdio command 是受信宿主程序，不受 Agent 文件 sandbox 约束。

工具调用和资源请求传递 caller signal 并应用 `toolCallTimeoutMs`；MCP `isError` 是规范工具结果的一部分，不能将其包装成成功。图像须先进入附件持久引用，再形成有序规范内容；界面渲染不生成第二份事实。
''',
'dsh-commands':'''### 命令输入、模型边界与卸载

`CommandDefinition.name` 为不带 `/` 的小写名称；description 用于 UI 发现，handler 接收 invocation 并返回 success/error 判别结果。`rawInput` 保留命令名后的精确分隔空白。未声明 `input.attachments` 的命令拒绝附件；声明后 registry 准入持久附件，handler 决定是否以及怎样形成模型内容。

注册在 calling scope 内，同层同名冲突；agent 层命令可覆盖全局而不影响其他 Agent。`recordInput` 默认 true，只有已有权威 domain event 拥有 payload 时才关闭，以免失去审计。`execute` 在接收 Agent 上记录 command/run 和 command/done 并用 commandId 配对；命令文字和直接结果不自动成为模型消息。

handler 应响应 invocation.signal。调度在 abort 时停止等待，已经外逃的外部副作用仍要求 handler 自己停止；这不是硬中断。注册返回 disposer，卸载后 `find/list` 不再展示贡献命令。需要驱动模型的生产者必须显式调用 Agent 的公开入口，不能依赖 UI 输出隐式进入模型。
''',
'dsh-user-approval':'''### 一次审批的失败关闭边界

请求必须在活动 turn 内，审计写入 asked/decided 成对事件。`ask` 策略分派给应答者，`never` 直接拒绝；没有应答者或应答失败产生 unavailable，调用方不得将其视为允许。审批仅对应当前请求，不能缓存成未来动作授权。审计 append 失败向调用方传播，不把未记账动作当作已批准。
''',
'dsh-goal':'''### Goal 的持久状态与激活状态

goal 的修订与轮次是持久事实，自动运行是否 armed 是活状态。恢复和 Session start 会解除自动激活，不能因日志里仍为 active 就开始后台工作。mutation 必须引用精确 goal id 与 revision，冲突先重读再裁决。projection registry 是必须前置，卸载服务同时撤回 projection，不能继续读取旧服务实例的状态。
'''
}
for key,note in notes.items():
 f=S/f'api-guardrails/capabilities-{key}.md';m=f.read_text();m=m.replace('\n## 验证边界', '\n'+note+'\n## 验证边界');f.write_text(m)
# 精确安装入口修正所有 HOWTO；普通包没有 bundle 声明不能自动启用。
for f in (S/'how-to').glob('capabilities-*.md'):
 m=f.read_text().replace('3. 将插件加入消费项目现有 Profile 的 Cordis 配置后重新装载。为代码扩展创建独立插件包，由其 `inject` 声明依赖，再在该插件 scope 内注册；返回的清理函数归此 scope 所有。', '3. 交付代码扩展时，把本包作为插件的 peer/dev 依赖，在插件入口用 `inject` 声明所需服务。bundle 的 `package.json` 声明 `dsh.bundle.patch`，patch 用 `- insert:` 加入插件行。从包的父目录运行 `dsh plugin --profile demo add ./你的插件包`，再运行 `dsh --profile demo`；已安装普通依赖没有 bundle patch 时不会自动激活。注册在贡献插件 scope 内完成，返回的清理函数归此 scope 所有。')
 f.write_text(m)
(E/'capabilities/result.json').write_text(json.dumps(r,ensure_ascii=False,indent=4)+'\n')
