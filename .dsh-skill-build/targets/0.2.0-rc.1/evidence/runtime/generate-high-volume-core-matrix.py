#!/usr/bin/env python3
"""Reproducible, read-only adjudication of the seven pending rc.1 API groups."""
import collections
import json
from pathlib import Path

TARGET = Path(__file__).resolve().parents[2]
SURFACE = TARGET / 'skill-source/api-surface.json'
OUTPUT = Path(__file__).with_name('high-volume-core-api-decisions.json')
PACKAGES = ('dsh-llm', 'dsh-tools', 'dsh-session', 'dsh-typert-protocol',
            'dsh-subagent', 'dsh-api-gateway', 'dsh-api-remotes')
BASE = 'references/api-'

def route(name, section):
    return BASE + name + '.md', section

def classify(package, subpath, symbol, member=None, deprecated=False):
    """Return disposition, owner, section, source-grounded rationale."""
    if deprecated:
        return 'exclude', None, None, '目标公开声明标为 @deprecated；新插件不使用旧观察/投影入口。'
    if subpath == './invariant':
        return 'merge', *route('llm-providers' if package == 'dsh-llm' else
                               'tools' if package == 'dsh-tools' else
                               'session-log' if package == 'dsh-session' else
                               'subagent-provider', '对象类型与成员' if package in ('dsh-llm','dsh-subagent') else '契约与运行语义'), '可选 invariant 插件的 apply/inject/name 装载元数据，合并到本包 Profile 组合边界；不是新业务 SPI。'
    if package == 'dsh-llm':
        if subpath in ('./remote', './typert'):
            return 'merge', *route('remote-api','Host 声明与公开对象'), '生成的 Remote/typert 包子路径，按 Host 描述符与 Client 贡献组合，不手写生成产物。'
        if subpath in ('./brand','./message','./assistant-stream','./types'):
            section = '对象类型与成员'
            return 'merge', *route('llm-providers',section), '公开子路径的同名类型或消息/流辅助；归 LLM Provider 请求、流与消息契约，不另建独立任务。'
        if symbol in ('default','APP_IDENTITY','AppIdentity','userAgent','ACCOUNT_QUOTA_EXCEEDED_CODE','CONTEXT_WINDOW_EXCEEDED_CODE','EMPTY_RESPONSE_CODE','IMAGE_OFFLOAD_REQUIRED_CODE','INVALID_CREDENTIAL_CODE','QUOTA_EXCEEDED_CODE'):
            return 'merge', *route('llm-providers','对象类型与成员'), '根导出的 Service/常量或诊断元数据；用于现有 Provider 组合和错误分类。'
        if symbol.startswith(('project','resolve','required','textOnly','offloaded','fileHandle','requestImage','contentHas')) or symbol in ('ImageAttachmentAccess','ImageAttachmentAccessResolver','LlmImageRequestBudget','LlmImageRequestPrice','LlmImageRequestPricing'):
            return 'merge', *route('llm-providers','对象类型与成员'), '附件/图像请求投影属于 Provider 适配边界，保留单一规范消息事实。'
        if symbol in ('RetryPolicyConfig','NormalRetryPolicyConfig','AlwaysRetryPolicyConfig','ResolvedRetryPolicy','ResolvedNormalRetryPolicy','ResolvedAlwaysRetryPolicy','ResolvedRetryBackoff','BackoffConfig','RetryPolicySchema','resolveRetryPolicy'):
            return 'merge', *route('llm-builtins-retry-meter','对象类型与成员'), '重试策略配置/解析与调用计量专题合并，不能据此推定 Agent 级重试。'
        if symbol in ('LlmCallConfig','LlmCallConfigAdapterDefaults','PreparedAdapterCall','PreparedLlmCall','callConfigEquals','LlmModelContext','LlmModelDiscoveryOperation','LlmModelDiscoveryRequest','LlmDiscoveredModel'):
            return 'merge', *route('llm-model-routing','对象类型与成员'), '一次调用配置与模型发现归路由专题；代际和取消由注册/调用所有者承担。'
        if symbol in ('AssistantStreamAccumulator','BlockAssembler','assembleAssistantStream','assistantStreamChunks','expandAssistantStream','joinAssistantStreamText','lastAssistantStreamChunk','runFirstTokenTime','runFirstVisibleTime'):
            return 'merge', *route('llm-providers','对象类型与成员'), '公开的 chunk 装配/观察辅助，须遵守 StreamChunk 顺序；不提供独立模型状态源。'
        return 'merge', *route('llm-providers','对象类型与成员'), '根入口请求、消息、chunk、错误或 Provider 支持类型，归现有 LLM Provider 契约。'
    if package == 'dsh-tools':
        if symbol in ('TOOL_RUNTIME_SCHEDULER','ToolRuntimeScheduler','ScheduledToolPreparation','ScheduledToolDispatch'):
            return 'exclude', None, None, 'packages/core/tools/src/index.ts 的 scheduler 段显式 @internal，且注释说明不是插件扩展点。'
        if symbol in ('ContentToolFixtureOptions','defineContentToolFixture'):
            return 'exclude', None, None, '测试 fixture helper，不是生产插件注册入口。'
        if subpath == './presentation' or symbol.endswith(('CallView','ResultView')) or symbol in ('FileDiff','FileLocation','ReadFileLine','SearchFileMatches','SearchLineMatch','WebSource','ToolCallKind','ToolCallView','ToolResultView'):
            return 'merge', *route('tools','契约与运行语义'), 'Host 纯展示投影类型；ToolDefinition.presentCall/presentResult 拥有投影，不产生另一规范结果。'
        if subpath == './types' or symbol.startswith('PtcDispatch'):
            return 'merge', *route('ptc-runtime','请求、解析与结果'), 'PTC dispatch 事件/类型再导出，归 run_code 调度观察边界，不是手动调度 SPI。'
        return 'merge', *route('tools','契约与运行语义'), '根入口 schema/执行/策略/结果支持类型，归 defineTool 与 ToolRuntime 单一规范执行链。'
    if package == 'dsh-session':
        if subpath == './fork' or symbol in ('buildForkSeed','SessionForkError','SessionForkErrorCode','SessionForkSource','SessionSeedEventState'):
            return 'merge', *route('session-log','契约与运行语义'), 'fork seed/恢复校验辅助；继承 cut 与连续事件日志由 Session owner 维护。'
        if subpath == './surface' or symbol.startswith('Surface') or symbol in ('foldSurface','deriveEventMessage','isSurfaceEvent','isSurfaceEligibleType','isAppendSurfaceEvent','isReplacementSurfaceEvent','SessionSurface','SessionMessageProjectionContext'):
            return 'merge', *route('session-log','消息投影边界'), 'Surface fold/验证/消息投影支持类型；投影必须从持久日志重建。'
        if symbol in ('SessionPreparation','SessionPreparationOptions','PrepareSessionOptions','RestoredSessionOptions','interruptedTurnClosers','ToolCallRecovery','TOOL_OUTCOME_UNKNOWN','TOOL_NOT_STARTED'):
            return 'merge', *route('session-persistence','对象类型与成员'), 'Session 恢复/准备与未结算工具边界；只由持久化/Agent owner 执行，不当普通插件追加入口。'
        return 'merge', *route('session-log','契约与运行语义'), '根入口事件、header、request 或消息支持类型，归 Session append 与可重建历史契约。'
    if package == 'dsh-typert-protocol':
        if symbol in ('InvocationDescriptor','InvocationParameterDescriptor','InvocationSourceLocation','TypertCodec','TypertSchema','TypertRegistryContract','TypertRegistryChange','TypertForwardableEvent','TypertForwardableEventEntry','PeerId','PeerScope','TYPERT_OWNED_VALUE','TypertOwnedValue','isTypertOwnedValue','typertOwnedValue','isRemoteJsonValue','isRemoteUplinkItem','isTypertRemoteSegment'):
            return 'exclude', None, None, '生成器/codec/Gateway 的描述符、wire 检查或 registry 帧；业务插件不手写这些物理协议对象。'
        if subpath == '.' and symbol in ('TypertLookupMap','TypertLookupProvider','TypertLookupRegistry','TypertHostContextAdapter','TypertClientContextAdapter','TypertContextMap','TypertContextRegistry'):
            return 'include', *route('remote-api','Lookup 与 scoped Context 注册'), '真实 Host lookup/scoped Context adapter 注册与撤销契约；源码 packages/typert/protocol/src/types.ts，须同生成声明及应用 Client assembly 配合。'
        return 'merge', *route('remote-api','Host 声明与公开对象' if subpath != './types' else 'Client 调用与失败'), 'Remote 装饰器、lookup/context adapter、错误或生成类型；归 Host 声明和 Client assembly 契约；./types 为同名 type-only 再导出。'
    if package == 'dsh-subagent':
        if subpath == './internal':
            return 'exclude', None, None, '显式 ./internal 子路径的工具和 Host prompt queue 实现，不是 Provider SPI。'
        if subpath in ('./remote','./typert'):
            return 'merge', *route('remote-api','Host 声明与公开对象'), '生成的 Subagent Remote 贡献/描述符，归 Host/Client assembly。'
        if symbol in ('apply','inject','name'):
            return 'merge', *route('subagent-provider','对象类型与成员'), '可选 invariant 插件装载元数据，不是可调用委派服务。'
        if symbol in ('AgentMessageSource','SubagentSettledMessageSource'):
            return 'merge', *route('session-log','契约与运行语义'), '委派消息的 Session source 类型，事实依附持久事件。'
        return 'merge', *route('subagent-provider','对象类型与成员'), 'Provider、委派请求/状态/取消/恢复/辅助类型；权限与 run 所有权仍由 Provider 和父 Agent 承担。'
    if package == 'dsh-api-gateway':
        if subpath == './stream-protocol':
            return 'exclude', None, None, '物理 HTTP/WebSocket 端点、消息帧和 parse/project helper，属于 Gateway transport，不是业务 Remote SPI。'
        if symbol in ('apply','inject') and subpath == './client':
            return 'exclude', None, None, 'Client Gateway 组合插件装载元数据，由应用 assembly 持有。'
        if subpath == './client':
            return 'merge', *route('remote-api','Client 调用与失败'), 'ClientRemote 与流/Journal/载体失败类型，归已装配 Remote 调用；业务插件不自行 mount。'
        return 'merge', *route('remote-api','入口、侧别与适用条件'), 'Host Gateway service、调用与转发事件桥类型，归应用 transport 装配，不提供独立业务注册表。'
    if package == 'dsh-api-remotes':
        if subpath == './client' and symbol in ('apply','inject'):
            return 'merge', *route('remote-api','入口、侧别与适用条件'), '固定 Web Client assembly 的装载元数据；由应用 owner 选择贡献。'
        if subpath == './client' and symbol in ('ClientRemote','ApiRemoteForwardedEvent'):
            return 'merge', *route('remote-api','Client 调用与失败'), '固定 Client assembly 的合成类型/事件 allowlist；不是动态业务注册表。'
        if subpath == './client':
            return 'merge', *route('remote-api','Client 调用与失败'), '固定 assembly 再导出的 owner 包类型别名；消费时遵守原 owner 契约，不在此重复定义。'
        return 'merge', *route('remote-api','入口、侧别与适用条件'), '固定 Web BFF 转发事件表和 Host/Client assembly 元数据，不能自动扩充任意第三方 Remote。'
    raise AssertionError(package)

def package_of(id):
    return next((p for p in PACKAGES if id.startswith('export:@deepseek-ai/' + p + ':')), None)

data = json.loads(SURFACE.read_text())
rows = []
package_roots = {}
for obj in data['objects']:
    package = package_of(obj['id'])
    if package and '/src/' in obj['source']:
        package_roots[package] = obj['source'].split('/src/')[0]
for entry in data['entries']:
    package = package_of(entry['candidate'])
    if package is None or entry['decision'] != 'pending':
        continue
    subpath = entry['candidate'].split(':')[-1]
    decision, owner, section, reason = classify(package, subpath, '__entry__')
    rows.append({'id':entry['candidate'],'kind':'entry','package':package,'decision':decision,
                 'owner':owner,'section':section,'source':package_roots[package]+'/package.json#exports['+subpath+']','reason':reason})
for obj in data['objects']:
    package = package_of(obj['id'])
    if package is None:
        continue
    subpath = obj['entry'].split(':')[-1]
    if obj['decision'] == 'pending':
        decision, owner, section, reason = classify(package, subpath, obj['symbol'])
        rows.append({'id':obj['id'],'kind':'object','package':package,'decision':decision,
                     'owner':owner,'section':section,'source':obj['source'],
                     'signature':obj['signature'],'reason':reason})
    seen = collections.Counter()
    for member in obj.get('members', []):
        seen[member['name']] += 1
        if member['decision'] != 'pending':
            continue
        decision, owner, section, reason = classify(package, subpath, obj['symbol'], member['name'], member.get('deprecated',False))
        suffix = '#'+member['name']
        if seen[member['name']] > 1:
            suffix += ':'+str(seen[member['name']])
        rows.append({'id':obj['id']+suffix,'kind':'member','parent':obj['id'],'member':member['name'],
                     'package':package,'decision':decision,'owner':owner,'section':section,
                     'source':obj['source'],'signature':member['signature'],'reason':reason})

counts = {p:{'entry':0,'object':0,'member':0} for p in PACKAGES}
for row in rows:
    counts[row['package']][row['kind']] += 1
assert len({r['id'] for r in rows}) == len(rows), 'duplicate row id'
assert all((r['owner'] and r['section']) if r['decision'] != 'exclude' else True for r in rows)
OUTPUT.write_text(json.dumps({'schemaVersion':1,'version':data['version'],'tag':data['tag'],
                              'commit':data['commit'],'scope':list(PACKAGES),'counts':counts,'rows':rows},
                             ensure_ascii=False,indent=2)+'\n')
print(json.dumps(counts,ensure_ascii=False))
