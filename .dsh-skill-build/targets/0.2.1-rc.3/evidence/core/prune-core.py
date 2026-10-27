import json,re
from pathlib import Path
P=Path('.dsh-skill-build/targets/0.2.1-rc.3');r=json.loads((P/'evidence/core/result.json').read_text());S=P/'skill-source';fmap={f['output']:f for f in r['files']}
# 只排除具有明确非任务职责的导出；包公开不意味着所有内部支持结构都须分发。
cordis_keep=set('Context Service Fiber FiberState Plugin Inject InjectKey EventOptions Events EventsService Logger LoggerOptions LoggerService LoggerLevel LoggerType LoggerMethod Exporter Message Disposable Effect ValidationError resolveConfig Volatile VolatileSnapshot DispatchMode RegistryService'.split())
loader_keep=set('Entry EntryGroup EntryOptions EntryTree Group Loader default evaluate interpolate JsExpr isJsExpr'.split())
boot_keep=set('boot StartupError loadProfileDirectory loadProfile readProfilePatches readBundlePatches Profile ProfileContext ProfileLayer ProfileManifest SkippedBundle PluginPackages PluginPackage readPluginMeta resolvePluginResource getDshRuntimeVersion initProfile prepareProfileEntries prepareProfilePatches evaluatePluginCompatibility composeEntries bundlePatchFiles bundlePatchPaths reportSkippedBundles PROFILE_PATCH_FILENAME PROFILE_TEMPLATES'.split())
generator_keep=set('WorkspaceAnalyzer WorkspaceAnalyzerOptions WorkspaceTypertGenerator WorkspaceTypertGeneratorOptions WorkspaceEmitResult WorkspaceModel TypertFace TypertAnalysisError TypertEmitError findWorkspaceRoot writePackageArtifacts writeWorkspaceArtifacts'.split())
excluded=[]
for o in r['objects']:
 if o['decision']!='included':continue
 e=o['entry'];n=o['symbol'];reason=None
 if e=='export:@deepseek-ai/cosmokit:.':reason=f'通用 JavaScript 工具 `{n}` 不是 DSH 插件扩展契约；本产物不维护字符串、集合、编码等基础工具库百科，插件注册和生命周期使用 Cordis 公开入口。'
 elif e=='export:@deepseek-ai/cordis:.' and n not in cordis_keep:reason=f'`{n}` 是 Cordis 的反射/代理/诊断支持或通用类型助手；创建和消费插件使用 Context、Service、Fiber 与公开事件，不直接构造此支持结构。'
 elif e=='export:@deepseek-ai/cordis-plugin-loader:.' and n not in loader_keep:reason=f'`{n}` 描述 Loader 对 Node 模块 job/realm 的原生适配；插件包只提供公开入口并由 Loader 装载，不实现或替换 Node 内部模块加载器。'
 elif e=='export:@deepseek-ai/dsh-app-boot:.' and n not in boot_keep:reason=f'`{n}` 属于 launcher 的配置投影、运行时解析表、环境或恢复维护；离线插件制作遵循 profile/bundle 装配，不复制 launcher 管理状态或自行改写其解析器。'
 elif e=='export:@deepseek-ai/dsh-typert-generator:.' and n not in generator_keep:reason=f'`{n}` 是 Typert 编译模型/目录投影的内部数据或渲染结构；插件 Remote 发布调用 workspace 生成器或 typertPlugin，不编写自定义类型编译器和 Cordis 文档目录生成器。'
 elif e=='export:@deepseek-ai/dsh-api-gateway:./stream-protocol':reason=f'`{n}` 是 Connection 的 Remote 传输帧或解析器；插件通过生成的 Client Remote、流句柄与 Gateway 使用现成载体，不另实现兼容 wire multiplexer。'
 elif e=='export:@deepseek-ai/dsh-cmdline:.' and n=='internals':reason='这是 cmdline 宿主的测试与实现接缝；应用插件消费不可变 cmdlineArgs/AppReady，不重写其 Node stdin 实现。'
 elif e=='export:@deepseek-ai/dsh-web-app:.' and n=='internals':reason='这是 WebApp 实现的可替换测试接缝，插件装载到已有 Web surface，不重新实现 WebApp 启动内部过程。'
 elif 'directory-picker-browse' in e and n in ['ListingCandidate','boundedInsert','fullyQualified','raceAbort']:reason=f'`{n}` 是 browse provider 的路径校验、限量排序或取消实现；插件消费 DirectoryPickerBrowseCapability 的 list/createDirectory，不把 provider 算法作为新能力注册入口。'
 elif 'directory-picker-native:./worker' in e:reason=f'`{n}` 是 Windows 原生对话框 worker 的内部消息；跨平台消费 DirectoryPicker native capability，不直接启动其工作线程。'
 elif e=='export:@deepseek-ai/dsh-host-webserver:.' and n in ['bindUrlHost','isLoopbackHost','isWildcardHost','normalizeBindAddress','renderIndexInjections']:reason=f'`{n}` 是宿主绑定地址/HTML 合成的支持函数；插件通过 WebServer 的路由和 index injection 注册契约接入，不复制 WebServer 启动算法。'
 if reason:
  o['decision']='excluded';o['reason']=reason;excluded.append(o)
  for m in o['members']:m['decision']='excluded';m['reason']=reason
  file=S/fmap[o['owner']]['source'];txt=file.read_text();txt=re.sub(r'\n## '+re.escape(o['section'])+r'\n.*?(?=\n## |\Z)','',txt,flags=re.S);file.write_text(txt.rstrip()+'\n')
removed={o['id'] for o in excluded}
for t in r['taskPaths']:t['apiObjects']=[x for x in t['apiObjects'] if x not in removed]
empty={f['output'] for f in r['files'] if f.get('role')=='subject' and not any(o['owner']==f['output'] and o['decision']=='included' for o in r['objects'])}
r['files']=[f for f in r['files'] if f['output'] not in empty];r['claims']=[c for c in r['claims'] if c['owner'] not in empty]
for e in r['entries']:
 os=[o for o in r['objects'] if o['entry']==e['candidate']]
 if os and not any(o['decision']=='included' for o in os):e['decision']='excluded';e['reason']=os[0]['reason']
# 排除不再有正式topic的能力包，或把 owner 定位到第一项实际纳入对象。
for d in r['dispositions']:
 if d['id']=='core-cosmokit-root':
  d.clear();d.update({'id':'core-cosmokit-library','decision':'excluded','candidates':['package:@deepseek-ai/cosmokit'],'reason':'通用 JavaScript 类型、字符串、集合、时间与编码函数不构成 DSH 专有插件能力；Cordis 生命周期文档解释其所需的 Volatile 类型，不扩展为该工具库全量百科。'});continue
 if 'topics' not in d or d['owners'][0] not in empty:continue
 objs=[o for o in r['objects'] if o['entry'].startswith('export:'+d['candidates'][0].removeprefix('package:')+':') and o['decision']=='included'] if d['candidates'][0].startswith('package:') else []
 if objs:d['owners']=[objs[0]['owner']];d['ownerSections']={objs[0]['owner']:objs[0]['section']}
 else:print('needs disposition owner',d['id'])
# 剔除空主题，并删去其主题页链接。
active={f['topic'] for f in r['files'] if f.get('role')=='subject'};gone={f['output'] for f in r['files'] if f.get('role')=='topic' and f['topic'] not in active};r['files']=[f for f in r['files'] if f['output'] not in gone];r['topics']=[x for x in r['topics'] if x in active]
for f in r['files']:
 file=S/f['source'];txt=file.read_text()
 for out in empty|gone:txt=re.sub(r'^.*\]\([^\n]*'+re.escape(Path(out).name)+r'[^\n]*\).*$','',txt,flags=re.M)
 file.write_text(txt.rstrip()+'\n')
# 工具库候选不再挂到注册Service任务。
for t in r['taskPaths']:t['candidates']=[c for c in t.get('candidates',[]) if c!='package:@deepseek-ai/cosmokit']
keep={f['source'] for f in r['files']}
for folder in ['api-guardrails','how-to','examples']:
 for f in (S/folder).glob('core-*.md'):
  if str(f.relative_to(S)) not in keep:f.unlink()
(P/'evidence/core/result.json').write_text(json.dumps(r,ensure_ascii=False,indent=4)+'\n');print('pruned',len(excluded),'included',sum(o['decision']=='included' for o in r['objects']))
