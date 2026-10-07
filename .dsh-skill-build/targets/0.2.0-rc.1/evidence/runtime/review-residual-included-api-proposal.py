#!/usr/bin/env python3
"""Independent semantic review of the residual proposal; never writes the shared ledger."""
import collections
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
INPUT = Path(__file__).with_name('residual-included-api-proposal.json')
OUTPUT = Path(__file__).with_name('residual-included-api-independent-review.json')
SKIP_PACKAGES = {
    '@deepseek-ai/dsh-typert-registry', '@deepseek-ai/dsh-attachment-local',
    '@deepseek-ai/dsh-sdk-protocol', '@deepseek-ai/dsh-command-feedback',
    '@deepseek-ai/dsh-credentials', '@deepseek-ai/dsh-ptc-runtime',
    '@deepseek-ai/dsh-storage', '@deepseek-ai/dsh-settings',
}

def route(topic, section):
    return 'references/api-'+topic+'.md', section

def decide(row):
    pkg=row['package'].removeprefix('@deepseek-ai/')
    subpath=row['entry'].split(':')[-1]
    symbol=row['id'].split(':')[-1]
    if pkg=='dsh-browser-use':
        if symbol=='default':return 'merge',*route('browser-computer-use','两个独占能力槽'),'默认导出是已纳入的 BrowserUseRegistry 具名 Service 别名，不能重复计任务。'
        return 'include',*route('browser-computer-use','两个独占能力槽'),'BrowserUseRegistry.register/providerName 与 BrowserUseProviderName 是公开独占 provider 入口；根 Service 和 brand 源码均实际使用。'
    if pkg=='dsh-credentials':
        if subpath=='./invariant':return 'merge',*route('credentials','适用范围与入口'),'apply/inject/name 只是可选 invariant 的装载元数据，不是凭证操作。'
        if symbol=='default':return 'include',*route('credentials','对象类型与成员'),'默认导出 CredentialProvider 服务；resolve/describe/set/unset 与 record 方法由 Host 插件直接调用。'
        if subpath=='./types' and symbol in ('ApiKeyRecord','GrantRecord'):
            return 'merge',*route('credentials','对象类型与成员'),'与根入口同名记录的类型再导出，不重复纳入事实。'
        return 'include',*route('credentials','对象类型与成员'),'凭证引用/记录/安全描述是 Provider 调用的公开输入输出；值只留在 Host。'
    if pkg=='dsh-deepseek-llm-api-extensions':
        if subpath=='./types':return 'merge',*route('deepseek-request-extensions','字段所有权与准备'),'./types 与根入口同名的声明再导出，按根契约使用。'
        if symbol=='default':return 'merge',*route('deepseek-request-extensions','字段所有权与准备'),'默认导出是已纳入的 DeepSeekLlmApiExtensionRegistry 具名 Service 别名。'
        if symbol=='DeepSeekLlmApiJson':return 'merge',*route('deepseek-request-extensions','字段所有权与准备'),'扩展值的 JSON 类型边界，不能作为独立 provider 注册。'
        return 'include',*route('deepseek-request-extensions','字段所有权与准备'),'Registry.register、Provider.prepare/request、Prepared.accept 是自有 DeepSeek 请求字段的真实扩展与交付时序。'
    if pkg=='dsh-experimental-inspector':
        if symbol=='InspectorService':return 'include',*route('experimental-inspector','对象类型与成员'),'Inspector Client/Host 诊断服务的公开读取与发布面，需已装载实验 Profile。'
        if symbol in ('apply','inject','name'):return 'merge',*route('experimental-inspector','对象类型与成员'),'Client 固定 assembly 的装载元数据，不是诊断记录 SPI。'
        return 'merge',*route('experimental-inspector','对象类型与成员'),'Cordis runtime tree 是 Inspector 的只读诊断投影形状，非第三方可注册节点协议。'
    if pkg in ('dsh-hooks-claude-code','dsh-hooks-codex','dsh-repeat-tool-reminder','dsh-tool-call-timeout-policy'):
        return 'merge',*route('hook-bridges-guards','入口与归属'),'apply/inject/name 是具体 Hook/Guard 插件 Profile 装载元数据，不应逐个作为独立扩展 API。'
    if pkg=='dsh-host-directory-picker':
        if symbol=='default':return 'merge',*route('host-platform','能力和错误'),'默认导出是已纳入的 DirectoryPicker 具名抽象 Service 别名。'
        if subpath=='./types' and symbol=='DirectoryEntry':return 'merge',*route('host-platform','能力和错误'),'与根入口同名类型再导出。'
        return 'include',*route('host-platform','能力和错误'),'DirectoryPicker.capability 与 native/browse union、listing/error 是自有 backend 和 Host 消费的公开契约。'
    if pkg=='dsh-invariants':
        if symbol=='default':return 'merge',*route('runtime-diagnostics-telemetry','对象类型与成员'),'默认导出是已纳入的 InvariantRegistry 具名 Service 别名。'
        return 'include',*route('runtime-diagnostics-telemetry','对象类型与成员'),'InvariantRegistry.register、Config、installer/failure 类型是自有运行时诊断检查的公开扩展点。'
    if pkg=='dsh-lsp':
        if symbol=='default':return 'merge',*route('lsp','契约'),'默认导出是已纳入的 Lsp 具名 Service 别名。'
        return 'include',*route('lsp','契约'),'Lsp.registerProvider/query 与 provider/query/result/位置类型共同构成可运行的第三方 LSP provider 任务。'
    if pkg=='dsh-mcp-client':
        if symbol in ('apply','inject','name'):
            return 'merge',*route('mcp-client','配置与公开成员'),'桥接器插件装载元数据，不是独立 MCP 工具。'
        return 'include',*route('mcp-client','配置与公开成员'),'createMcpToolDefinition/Options、McpResult 与 stdio/HTTP/reconnect 配置均是公开桥接或自有工具定义契约。'
    if pkg=='dsh-package-manifest':
        if symbol=='PluginLocalizedMeta':
            return 'merge',*route('loader-composition','配置行与 patch 语义'),'Loader 解析后的展示/诊断结果，不是作者直接填写的 package.json.dsh 字段。'
        return 'include',*route('loader-composition','配置行与 patch 语义'),'DshPackageManifest/engine/本地化元数据是第三方包发布清单的公开类型，须按 Loader 解析规则填写。'
    if pkg=='dsh-permission-presets':
        if subpath=='./invariant':return 'merge',*route('permission-presets','适用范围与入口'),'可选 invariant 插件装载元数据。'
        if symbol=='default':return 'include',*route('permission-presets','对象类型与成员'),'默认 PermissionPresetService 的 set/current/catalog 等是 Host 插件真实消费入口。'
        if symbol=='Config':return 'include',*route('permission-presets','对象类型与成员'),'Profile 可配置的 presets/defaultPreset 公开契约。'
        return 'merge',*route('permission-presets','对象类型与成员'),'内建 auto/custom 标记与派生 knob/setting 状态归已有预设 Service，非新预设注册 SPI。'
    if pkg=='dsh-ptc-runtime':
        if symbol in ('DUNDER_MEMBER','PORTABLE_RESERVED_WORDS','RESERVED_BINDING_GLOBALS','RESERVED_ERROR_MEMBERS'):
            return 'merge',*route('ptc-runtime','请求、解析与结果'),'保留名检查常量只是 binding 命名约束，不是可注册的运行时能力。'
        return 'include',*route('ptc-runtime','请求、解析与结果'),'PtcRuntime.resolve/run、binding 函数/异常及 run failure/sandbox 类型是 Host 消费 PTC 的公开契约。'
    if pkg=='dsh-session-projection':
        if symbol=='default':return 'merge',*route('session-projection','对象类型与成员'),'默认导出是已纳入的 SessionProjectionRegistry 具名 Service 别名。'
        if subpath=='./types':return 'merge',*route('session-projection','适用范围与入口'),'./types 重导出同名 ProjectionMap/StateMap，不生成第二份事实。'
        return 'include',*route('session-projection','对象类型与成员'),'checkpoint/snapshot/订阅与声明合并是日志投影作者的公开读写形状。'
    if pkg=='dsh-settings':
        if subpath=='./types':return 'merge',*route('settings','对象类型与成员'),'./types 是 Client 安全描述的类型面，按 SettingsForms owner 解读。'
        return 'include',*route('settings','对象类型与成员'),'SettingsForms.describe/update/replace/mutate 与遮蔽结果是动态配置/安全展示的公开契约。'
    if pkg=='dsh-spill':
        return 'merge',*route('spill','保存契约与所有权'),'默认导出是已纳入的 SpillStore 具名抽象 Service 别名，saveText 契约已有唯一 owner。'
    if pkg=='dsh-storage':
        if symbol=='storageBackendServiceKey' or symbol=='UNIT_NAME_RE':
            return 'merge',*route('storage-domain','对象类型与成员'),'Backend 命名与内部 unit 名称约束，不单独形成领域插件任务。'
        return 'include',*route('storage-domain','对象类型与成员'),'Storage/BackendRegistry/KvFacet/KvUnit/descriptor/error/forms 是自定义 Backend 或领域 form 的公开组合契约。'
    if pkg=='dsh-token-meter':
        return 'merge',*route('llm-builtins-retry-meter','对象类型与成员'),'用量/压力投影与估算 helper 归 TokenMeter.measure 的派生读数，不独立写 Session。'
    if pkg=='dsh-tool-subagent':
        if subpath=='./invariant':return 'merge',*route('subagent-tools','适用范围与入口'),'invariant 插件 apply/inject/name 为可选诊断装载元数据。'
        if symbol=='default':return 'merge',*route('subagent-tools','对象类型与成员'),'默认导出是同子路径的 SubagentModelSelectionConfig 具名 Service 别名。'
        if symbol=='name':return 'merge',*route('subagent-tools','适用范围与入口'),'模型选择设置插件诊断名，不是模型工具名。'
        return 'include',*route('subagent-tools','对象类型与成员'),'model-selection-settings Config/Service/current 状态是 tool-subagent 模型选择的真实可装载扩展。'
    if pkg=='dsh-tool-todo':
        if symbol in ('apply','inject','name'):
            return 'merge',*route('planning','Todo 契约'),'todo 或 invariant 插件的装载元数据，真实模型工具由 apply 注册且以 Session 日志为事实。'
        return 'include',*route('planning','Todo 契约'),'Config 和 TodoItem 是 todo_write 完整清单的公开配置与值类型。'
    if pkg=='dsh-web':
        if symbol=='default':return 'merge',*route('web-provider','公开类型与成员'),'默认导出是已纳入的 WebRuntime 具名 Service 别名。'
        return 'include',*route('web-provider','公开类型与成员'),'WebRuntime.registerSearch/registerFetch 与请求/结果类型构成第三方搜索/抓取 provider 可运行路径。'
    if pkg=='dsh-webhook':
        if subpath=='./invariant':return 'merge',*route('webhook-rules','对象类型与成员'),'可选 webhook invariant 插件装载元数据，非投递鉴权/规则注册。'
        if subpath=='./types':return 'merge',*route('webhook-rules','对象类型与成员'),'与根入口同名类型再导出。'
        if symbol=='default':return 'merge',*route('webhook-rules','对象类型与成员'),'默认导出是已纳入的 WebhookRuntime 具名 Service 别名。'
        return 'include',*route('webhook-rules','对象类型与成员'),'WebhookRuntime.register、投递/来源品牌与模型选择是已验证投递规则的公开契约。'
    if pkg=='dsh':
        return 'exclude',None,None,'应用 CLI/启动 Profile 函数及部署常量，非第三方 Cordis 插件运行入口。'
    raise AssertionError(pkg)

raw=INPUT.read_bytes()
proposal=json.loads(raw)
surface_bytes=(ROOT/'skill-source/api-surface.json').read_bytes()
surface=json.loads(surface_bytes)
pending_ids={obj['id'] for obj in surface['objects'] if obj['decision']=='pending'}
scope_packages={row['package'] for row in proposal['rows']}-SKIP_PACKAGES
current_scope_ids={obj['id'] for obj in surface['objects']
                   if obj['decision']=='pending' and obj['id'].split(':')[1] in scope_packages}
rows=[]
for row in proposal['rows']:
    if row['package'] in SKIP_PACKAGES:
        continue
    if row['id'] not in pending_ids:
        continue
    decision,owner,section,reason=decide(row)
    section_has_symbol=None
    section_has_signature=None
    if owner is not None:
        document=(ROOT/'skill-source'/owner.replace('references/api-','api-guardrails/')).read_text()
        heading=re.search(r'^#{2,3} '+re.escape(section)+r'$',document,re.M)
        assert heading,(owner,section)
        content=document[heading.end():]
        next_heading=re.search(r'^#{1,3} ',content,re.M)
        content=content[:next_heading.start()] if next_heading else content
        section_has_symbol=row['id'].split(':')[-1] in content
        section_has_signature=row['signature'] in content
    rows.append({'id':row['id'],'package':row['package'],'source':row['source'],
                 'signature':row['signature'],
                 'proposal':row['recommendation'],'review':decision,'changed':decision!=row['recommendation'],
                 'owner':owner,'section':section,'ownerSectionContainsSymbol':section_has_symbol,
                 'ownerSectionContainsSignature':section_has_signature,'reason':reason,
                 'members':[{'name':m['name'],'signature':m['signature'],
                             'proposal':m['recommendation'],'review':decision,
                             'changed':decision!=m['recommendation']} for m in row['members']]})
assert len({r['id'] for r in rows})==len(rows)
assert {r['id'] for r in rows}==current_scope_ids, 'proposal is missing currently pending scoped objects'
counts=collections.Counter((r['package'],r['review']) for r in rows)
OUTPUT.write_text(json.dumps({'schemaVersion':1,'tag':proposal['tag'],
                              'proposalSha256':hashlib.sha256(raw).hexdigest(),
                              'currentSurfaceSha256':hashlib.sha256(surface_bytes).hexdigest(),
                              'counts':{p:{d:counts[(p,d)] for d in ('include','merge','exclude')}
                                        for p in sorted({r['package'] for r in rows})},
                              'rows':rows},ensure_ascii=False,indent=2)+'\n')
print('rows',len(rows),'changed objects',sum(r['changed'] for r in rows),
      'changed members',sum(m['changed'] for r in rows for m in r['members']))
