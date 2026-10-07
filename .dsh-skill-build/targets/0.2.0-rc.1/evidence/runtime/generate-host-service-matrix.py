#!/usr/bin/env python3
"""Adjudicate nine pinned rc.1 Host/build/service API packages without editing ledgers."""
import collections
import hashlib
import json
from pathlib import Path

TARGET = Path(__file__).resolve().parents[2]
INPUT = TARGET / 'skill-source/api-surface.json'
OUTPUT = Path(__file__).with_name('host-service-api-decisions.json')
PACKAGES = ('dsh-typert-generator','dsh-app-boot','dsh-agent','dsh-storage-domain',
            'dsh-session-persistence','dsh-subprocess','dsh-attachment',
            'dsh-agent-preset-registry','dsh-experimental-agent-team')

def owner(name, section):
    return 'references/api-'+name+'.md', section

def classify(pkg, subpath, symbol, member=None, deprecated=False):
    if deprecated:
        return 'exclude',None,None,'目标公开声明标 @deprecated；新插件不使用旧入口。'
    if pkg == 'dsh-typert-generator':
        if subpath == './tsdown':
            return 'include',*owner('remote-api','构建时生成器入口'),'包作者构建阶段可调用 typertPlugin；mode/faces 与 tsc 验证、生成 exports/files 配套。'
        if symbol in ('WorkspaceTypertGenerator','WorkspaceAnalyzer','WorkspaceAnalyzerOptions','WorkspaceTypertGeneratorOptions','TypertFace','WorkspaceEmitResult','DiscoveredTypertPackage','TypertAnalysisError','TypertEmitError'):
            return 'merge',*owner('remote-api','构建时生成器入口'),'工作区级分析/生成 API，归包构建和错误诊断，不是运行时 Host Remote 服务。'
        return 'exclude',None,None,'类型图、反射模型、catalog/HTML 渲染或 emitter 中间表示；由目标生成器产生/消费，普通插件不手写。'
    if pkg == 'dsh-app-boot':
        if symbol in ('Profile','ProfileTemplate','ProfileLayer','ProfileContext','PluginPackage','PluginPackages','PluginPackagesConfig','PluginCompatibility','ProfileCompatibility','ProfileManifest','ProfilePluginInventory','ProfilePluginLocation','ProfilePluginDependency','ProfilePluginReconciliation','ProfilePnpmInvocation','LinkedRoot','RuntimeResolution','RuntimeResolutionEntry','RuntimeResolutionOptions','ConfigProjection','ConfigDumpLayer','ConfigSchemaDump','NativeConfigSchema'):
            return 'merge',*owner('loader-composition','配置行与 patch 语义'),'Profile/Loader 静态配置及诊断形状，由宿主启动 owner 解析；业务插件通过自身 Config/注入进入组合。'
        if symbol in ('boot','initProfile','loadProfile','loadProfileDirectory','prepareProfileEntries','prepareProfilePatches','loadOptionalPatches','loadOverlayPatches','bundlePatchFiles','bundlePatchPaths','composeEntries','mountRootInclude','reconcileProfilePatches','reconcileProfilePlugins','readProfilePatches','writeProfileBundles','writeProfileManifest','removeLinkProjections','setProfileVersionExemption','sanitizeProfile','loadEnv','loadLayeredEnv','auditStartupEntries','installFailLoud'):
            return 'exclude',None,None,'CLI/Profile 启动、patch 调和、环境加载或文件改写步骤由应用 boot 负责，不是 Cordis 插件内调用入口。'
        return 'exclude',None,None,'app-boot 的其余启动常量、schema/诊断、配置投影或 Profile 文件辅助归宿主 CLI/Profile 维护，不是 Cordis 插件运行入口。'
    if pkg == 'dsh-agent':
        if subpath == './invariant':
            return 'merge',*owner('workflow-agent-loop','Agent loop 的公开组合边界'),'可选 Agent invariant 的 apply/inject/name 装载元数据，不是替换 loop 的 SPI。'
        if subpath == './types':
            return 'merge',*owner('workflow-agent-loop','Agent loop 的公开组合边界'),'根入口同名 Agent/inbox 类型再导出，不复制运行时契约。'
        if symbol in ('AgentHandle','CreateAgentOptions','ResumeAgentOptions','AgentSetup','AgentSetupCommit','AgentOptions'):
            return 'include',*owner('workflow-agent-loop','Agent loop 的公开组合边界'),'已装载 agent-loop 暴露创建/恢复、setup 与句柄所有权；Provider/业务插件只能在可信生命周期所有者中组合。'
        if symbol in ('AgentFactory','AgentRegistry','Agent'):
            return 'merge',*owner('workflow-agent-loop','Agent loop 的公开组合边界'),'Factory/Registry/Agent Service 在现有创建与恢复任务中使用；setFactory/register 等由 loop owner 持有，普通调用方只拿 AgentHandle。'
        if symbol in ('assembleContextFor','agentCarrier','agentEvents','emitAgentEvent','AgentEventDispatch','AgentSubjectEvent','AssistantStreamFrame','TurnBoundaryProjection','ConsumedWork','foldConsumedWork','SessionStartSource'):
            return 'merge',*owner('workflow-agent-loop','Agent loop 的公开组合边界'),'Agent loop 事件/投影/上下文辅助，须由 Session 可重建事实驱动，不单独作为状态源。'
        return 'merge',*owner('workflow-agent-loop','Agent loop 的公开组合边界'),'Agent 状态、Inbox、取消、步进决策或 Service 别名，归已装载 loop 与 handle 所有权。'
    if pkg == 'dsh-storage-domain':
        if subpath == './invariant':
            return 'merge',*owner('storage-domain','对象类型与成员'),'可选 domain invariant 插件装载元数据，归 Profile 诊断组合。'
        if symbol in ('defineDomain','domainTable','DomainSpec','DomainTableSpec','DomainGlobalSpec','DomainFacility','KvTable','DomainChanged','DomainError'):
            return 'include',*owner('storage-domain','对象类型与成员'),'第三方领域插件的 schema、open handle、表读写和提交后通知/错误契约。'
        return 'merge',*owner('storage-domain','对象类型与成员'),'领域存储支持类型、配置或别名，归 DomainSpec 和 ctx.storageDomain 契约。'
    if pkg == 'dsh-session-persistence':
        if symbol in ('SessionHandleAppendOptions','SessionHandleFlushOptions','SessionHandleReadOptions','SessionPersistenceCreateOptions','SessionPersistenceOpenOptions','SessionPersistenceListOptions','SessionPersistenceStatOptions','SessionPersistenceRevision','SessionStorageMetadata','SessionInspection'):
            return 'merge',*owner('session-persistence','对象类型与成员'),'Session 持久化调用选项、快照/revision 与诊断形状，归 SessionHandle/SessionPersistence 的同一契约。'
        if symbol in ('assertContiguous','assertStoredId','assertVersion','materializeAppendBatch','materializeCreateHeader','validateStoredEvents','sessionFormatVersionRefusal'):
            return 'exclude',None,None,'Backend/格式实现校验与 materialize helper，普通只读插件通过 SessionPersistence handle 访问日志。'
        if symbol.endswith('Error') or symbol in ('SessionLocation','SessionHeader'):
            return 'merge',*owner('session-persistence','失败、权限与边界'),'格式、所有权、关闭/只读等稳定拒绝及诊断元数据；调用方显式处理失败。'
        return 'merge',*owner('session-persistence','对象类型与成员'),'SessionPersistence Service 或类型别名，归持久 handle 生命周期。'
    if pkg == 'dsh-subprocess':
        if subpath == './control':
            return 'exclude',None,None,'继承控制通道 FD/环境协议是受管子进程内部握手，不是业务 spawn API。'
        if symbol in ('DSH_ENV_PREFIX','DshEnvironment','DshEnvironmentKey','SENSITIVE_ENV_PATTERN','SubprocessTerminalEnvironment','SubprocessTerminalActivity','SubprocessTerminalForeground','SubprocessTerminalSignal'):
            return 'merge',*owner('subprocess','调用契约'),'执行世界环境清理与 PTY/前台观察类型，归 provider 的进程/终端契约。'
        return 'merge',*owner('subprocess','调用契约'),'受管进程的输入、输出、收集/溢出、终端或异常类型；消费通过 SubprocessRuntime 与句柄。'
    if pkg == 'dsh-attachment':
        if subpath == './types':
            return 'merge',*owner('attachment-store','公开成员'),'根入口同名附件 ref/入站类型再导出，不重复附件事实。'
        if symbol in ('ImageAttachmentLimits','ImageRequestTarget','SaveImageAttachment','SaveFileAttachment','SaveFileStreamAttachment','PromptContentPart','AdmittedPromptContentPart','AttachmentAdmissionPart','ImageAttachmentRef','FileAttachmentRef','RequestImageAttachment'):
            return 'include',*owner('attachment-store','公开成员'),'附件 provider/消费插件的入站校验、耐久 ref 与请求图像投影形状；写成功后才能写 Session 引用。'
        return 'merge',*owner('attachment-store','公开成员'),'附件媒体/尺寸/错误码或 Service helper，归 AttachmentStore 耐久引用与校验契约。'
    if pkg == 'dsh-agent-preset-registry':
        if subpath == './display':
            return 'merge',*owner('agent-presets-persona','公开入口'),'UI 文案显示 helper 与内建 preset key，归 preset 目录展示；不改变 Host 注册/修订租约。'
        if subpath == './invariant':
            return 'merge',*owner('agent-presets-persona','公开入口'),'可选 preset invariant 插件装载元数据，不是 preset 定义 SPI。'
        return 'merge',*owner('agent-presets-persona','对象类型与成员'),'AgentPresetDocument/roster/row 的类型再导出，归 Registry 声明、目录与修订租约。'
    if pkg == 'dsh-experimental-agent-team':
        return 'merge',*owner('experimental-agent-team','入口、版本与组合'),'实验 Team 包的 ./client、./remote、./typert 等入口是已选 Profile/生成贡献边界；Host service 的真实方法已归同页。'
    raise AssertionError(pkg)

def package_of(identifier):
    return next((p for p in PACKAGES if identifier.startswith('export:@deepseek-ai/'+p+':')),None)

input_bytes = INPUT.read_bytes()
surface = json.loads(input_bytes)
roots = {}
for obj in surface['objects']:
    p = package_of(obj['id'])
    if p and '/src/' in obj['source']:
        roots[p] = obj['source'].split('/src/')[0]
rows=[]
for entry in surface['entries']:
    p=package_of(entry['candidate'])
    if p is None or entry['decision']!='pending':continue
    subpath=entry['candidate'].split(':')[-1]
    decision,own,section,reason=classify(p,subpath,'__entry__')
    rows.append(dict(id=entry['candidate'],kind='entry',package=p,decision=decision,owner=own,
                     section=section,source=roots[p]+'/package.json#exports['+subpath+']',reason=reason))
for obj in surface['objects']:
    p=package_of(obj['id'])
    if p is None:continue
    subpath=obj['entry'].split(':')[-1]
    if obj['decision']=='pending':
        decision,own,section,reason=classify(p,subpath,obj['symbol'])
        rows.append(dict(id=obj['id'],kind='object',package=p,decision=decision,owner=own,
                         section=section,source=obj['source'],signature=obj['signature'],reason=reason))
    seen=collections.Counter()
    for member in obj.get('members',[]):
        seen[member['name']]+=1
        if member['decision']!='pending':continue
        decision,own,section,reason=classify(p,subpath,obj['symbol'],member['name'],member.get('deprecated',False))
        suffix='#'+member['name']+((':'+str(seen[member['name']])) if seen[member['name']]>1 else '')
        rows.append(dict(id=obj['id']+suffix,kind='member',parent=obj['id'],member=member['name'],package=p,
                         decision=decision,owner=own,section=section,source=obj['source'],
                         signature=member['signature'],reason=reason))
counts={p:{'entry':0,'object':0,'member':0} for p in PACKAGES}
for row in rows:counts[row['package']][row['kind']]+=1
assert len({r['id'] for r in rows})==len(rows)
OUTPUT.write_text(json.dumps(dict(schemaVersion=1,inputSha256=hashlib.sha256(input_bytes).hexdigest(),version=surface['version'],tag=surface['tag'],
                                  commit=surface['commit'],scope=PACKAGES,counts=counts,rows=rows),
                             ensure_ascii=False,indent=2)+'\n')
print(json.dumps(counts,ensure_ascii=False))
