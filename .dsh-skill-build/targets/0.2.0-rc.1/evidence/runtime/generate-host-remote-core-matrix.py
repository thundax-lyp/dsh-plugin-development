#!/usr/bin/env python3
"""Pending Host/Remote service-package decisions for the pinned rc.1 checkout."""
import collections
import json
from pathlib import Path

TARGET = Path(__file__).resolve().parents[2]
INPUT = TARGET / 'skill-source/api-surface.json'
OUTPUT = Path(__file__).with_name('host-remote-core-api-decisions.json')
PACKAGES = ('dsh-plugin-manager', 'cordis', 'dsh-client-connection',
            'dsh-host-webserver', 'dsh-typert-loader')

def owner(name, section):
    return 'references/api-' + name + '.md', section

def classify(pkg, subpath, symbol, member=None, deprecated=False):
    if deprecated:
        return 'exclude', None, None, '公开声明标 @deprecated，不作为新插件入口。'
    if pkg == 'dsh-plugin-manager':
        if subpath == './operations':
            return 'exclude', None, None, 'Profile 包操作、manifest 保存及 pnpm 命令执行为 Manager 的事务实现；第三方插件调用 PluginManager service，不直接运行低层操作。'
        if subpath == './registry':
            return 'exclude', None, None, 'registry URL 规划与失败归因是 Manager 的安装策略实现，不是插件自有 registry SPI。'
        if subpath == './tools':
            return 'merge', *owner('plugin-manager','契约与运行语义'), '内置管理工具插件的 apply/inject 装载元数据；插件作者使用 Manager service。'
        if subpath == './types':
            return 'merge', *owner('plugin-manager','对象类型与成员'), '根入口同名管理结果与状态类型的 type-only 再导出，不复制事实。'
        if symbol in ('parseInstallSpec','classifyInstallFailure','InvalidInstallSpecError','ParsedInstallSpec','InstallFailureFacts'):
            return 'exclude', None, None, '安装 spec 解析/归因是 PluginManager 内部事务步骤；业务调用 inspect/install API。'
        return 'merge', *owner('plugin-manager','对象类型与成员'), 'PluginManager 结果、身份与通知数据，归已有管理服务契约；通知不是持久安装事实。'
    if pkg == 'cordis':
        if symbol in ('buildOuterStack','c16','c256','composeError','createCallable','defaultFormatters','getPropertyDescriptor','getTraceable','isBailed','isConstructor','isObject','joinPrototype','symbols','withProps'):
            return 'exclude', None, None, 'Cordis 基础实现/格式化与反射辅助，不构成 DSH 插件生命周期或业务能力入口。'
        if symbol in ('Events','Disposable','DisposableList','Effect','EffectMeta','Hook','InjectKey','Intercept','RegistryService','Volatile','VolatileSnapshot','Logger','LoggerService','LoggerMethod','LoggerOptions','LoggerLevel','LoggerType','Message','Parameters','ReturnType','ThisType','Exporter','Tracker','FiberState','DispatchMode','CordisError','Formatter','resolveConfig'):
            return 'merge', *owner('cordis-core','插件声明与依赖'), 'Cordis 插件声明、effect/注入、事件或日志支持类型，归 Context/Service 生命周期契约。'
        return 'merge', *owner('cordis-core','插件声明与依赖'), 'Cordis 根公开类型/辅助，须遵守 Context fiber 与 Service owner 边界。'
    if pkg == 'dsh-client-connection':
        if symbol in ('API_PATH','clientRequestSchema','rpcErrorSchema','rpcIdSchema','rpcMessageSchema','rpcResultSchema','serverResponseSchema','transportError'):
            return 'exclude', None, None, '固定 /api carrier 的 envelope 常量、schema 或 transport 错误构造，不是业务鉴权和 RPC handler SPI。'
        if symbol in ('ConnectionFetchRoute','HostConnectionFetch','HostConnectionRpc','ConnectionRpcHandler','ConnectionRpcHandlerResult','ConnectionRpcEndpointMatcher'):
            return 'include', *owner('client-connection','对象类型与成员'), 'Host Connection 的受保护 fetch/RPC 注册契约；route 需显式 admission，注册 disposer 归插件 fiber。'
        if symbol in ('ConnectionIndexRequest','ConnectionIndexResponse','ConnectionTrustRequest','ConnectionRequestRejection','PeerAdmission','OperatorPeer','PeerId','PeerScope'):
            return 'merge', *owner('client-connection','契约与运行语义'), 'Host/Origin 信任、浏览器 index 认证与 operator peer 支持类型；业务身份仍由 handler 校验。'
        if symbol in ('ConnectionRpcAttachment','ConnectionRpcHandlerResult','ConnectionRpcFailure','ConnectionRpcResult','RpcMessage','RpcId','RemoteInvocation','ServerResponse'):
            return 'merge', *owner('client-connection','对象类型与成员'), 'RPC 规范结果/附件与 carrier 关联类型，归已注册 handler 的单一返回契约。'
        if symbol in ('apply','inject','name','Config','ConnectionConfig','HostConnectionService'):
            return 'merge', *owner('client-connection','对象类型与成员'), 'Connection service 配置和插件装载元数据；应用组合拥有 transport 启动。'
        return 'merge', *owner('client-connection','对象类型与成员'), 'Connection Host 请求、route、peer 或结果支持类型；消费由 HostConnectionHandle 及 Client handle 分侧执行。'
    if pkg == 'dsh-host-webserver':
        if symbol in ('WebRoute','WebUpgradeRoute','Config','IndexInjection','IndexInjectionPlacement'):
            return 'include', *owner('web-ingress','对象类型与成员'), 'WebServer 的 route/upgrade/index 注入和配置公开形状；handler 与注册 disposer 归插件 fiber。'
        return 'merge', *owner('web-ingress','对象类型与成员'), 'WebServer Service 别名或纯 index 渲染 helper，归现有 Web ingress 契约。'
    if pkg == 'dsh-typert-loader':
        if symbol in ('TYPERT_HOST_EXPORT','validateTypertManifest'):
            return 'merge', *owner('remote-api','Host 声明与公开对象'), 'Host Loader 的生成描述符包导出与 manifest 校验；自有包由生成器发布 ./typert，不直接装载或改写检查器。'
        return 'merge', *owner('remote-api','入口、侧别与适用条件'), 'Typert Loader apply/inject/name/Config 是应用 Profile 装载元数据，不是业务 Remote 注册 API。'
    raise AssertionError(pkg)

def package_of(identifier):
    return next((p for p in PACKAGES if identifier.startswith('export:@deepseek-ai/' + p + ':')), None)

surface = json.loads(INPUT.read_text())
roots = {}
for obj in surface['objects']:
    p = package_of(obj['id'])
    if p and '/src/' in obj['source']:
        roots[p] = obj['source'].split('/src/')[0]
rows = []
for entry in surface['entries']:
    p = package_of(entry['candidate'])
    if p is None or entry['decision'] != 'pending':
        continue
    subpath = entry['candidate'].split(':')[-1]
    decision, own, section, reason = classify(p, subpath, '__entry__')
    rows.append(dict(id=entry['candidate'],kind='entry',package=p,decision=decision,owner=own,
                     section=section,source=roots[p]+'/package.json#exports['+subpath+']',reason=reason))
for obj in surface['objects']:
    p = package_of(obj['id'])
    if p is None:
        continue
    subpath = obj['entry'].split(':')[-1]
    if obj['decision'] == 'pending':
        decision, own, section, reason = classify(p,subpath,obj['symbol'])
        rows.append(dict(id=obj['id'],kind='object',package=p,decision=decision,owner=own,
                         section=section,source=obj['source'],signature=obj['signature'],reason=reason))
    seen = collections.Counter()
    for member in obj.get('members',[]):
        seen[member['name']] += 1
        if member['decision'] != 'pending':
            continue
        decision, own, section, reason = classify(p,subpath,obj['symbol'],member['name'],member.get('deprecated',False))
        suffix = '#'+member['name']+((':'+str(seen[member['name']])) if seen[member['name']]>1 else '')
        rows.append(dict(id=obj['id']+suffix,kind='member',parent=obj['id'],member=member['name'],
                         package=p,decision=decision,owner=own,section=section,source=obj['source'],
                         signature=member['signature'],reason=reason))
counts = {p:{'entry':0,'object':0,'member':0} for p in PACKAGES}
for row in rows:
    counts[row['package']][row['kind']] += 1
assert len({r['id'] for r in rows}) == len(rows)
OUTPUT.write_text(json.dumps(dict(schemaVersion=1,version=surface['version'],tag=surface['tag'],
                                  commit=surface['commit'],scope=PACKAGES,counts=counts,rows=rows),
                             indent=2,ensure_ascii=False)+'\n')
print(json.dumps(counts,ensure_ascii=False))
