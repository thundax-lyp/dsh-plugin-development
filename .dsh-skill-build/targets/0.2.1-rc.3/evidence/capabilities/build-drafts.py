import json,re,hashlib
from pathlib import Path
T=Path('.dsh-skill-build/targets/0.2.1-rc.3'); C=T/'checkout'; E=T/'evidence'; S=T/'skill-source'
roots=['llm','context','compaction','subagent','workflow','interaction','goal','plan','guard','skill','mcp','ptc-runtime','acp','experimental']
def mine(path): return any(path.startswith('packages/'+r+'/') for r in roots) and not re.search(r'packages/experimental/client-',path)
entries=[e for e in json.loads((E/'api-entry-candidates.json').read_text())['candidates'] if mine(e['path'])]
sy={x['entry']:x for x in json.loads((E/'api-symbol-candidates.json').read_text())['entries']}
caps=json.loads((E/'capability-candidates.json').read_text())['candidates']; tasks=json.loads((E/'task-candidates.json').read_text())['candidates']
result={k:[] for k in ['files','topics','entries','objects','dispositions','taskPaths','taskDiscoveries','claims']}
def write(path,text): (S/path).write_text(text.rstrip()+'\n')
def plainlinks(text):
 text=re.sub(r'!\[([^]]*)\]\([^)]*\)',r'\1',text)
 text=re.sub(r'\[([^]]*)\]\([^)]*\)',r'\1',text)
 return text

def prose(txt):
 txt=plainlinks(txt); txt=re.sub(r'<a\s[^>]*>\s*</a>','',txt); txt=re.sub(r'<!--[\s\S]*?-->','',txt)
 # 完整源码示例独立维护；上游片段不伪装为已编译的独立包。
 txt=re.sub(r'```[^\n]*\n([\s\S]*?)```',lambda m:'\n'+ '\n'.join('    '+x for x in m[1].splitlines())+'\n',txt)
 return txt.strip()

def readme_parts(pkgpath):
 f=C/pkgpath/'README.zh.md'
 if not f.exists(): return ('该包通过目标版本公开导出参与插件组合。','')
 t=f.read_text(); sm=re.search(r'## (?:概述|摘要)\n([\s\S]*?)(?=\n## |\Z)',t)
 summary=prose(sm[1]) if sm else ''
 # 仅保留公开使用与已知限制，不转写内部实现、设计历史、模型体验。
 sections=[]
 headings=list(re.finditer(r'^## ([^\n]+)\n',t,re.M))
 for i,h in enumerate(headings):
  title=h[1]; body=t[h.end():headings[i+1].start() if i+1<len(headings) else len(t)]
  if title.startswith(('使用','服务','提出问题','配置','HTTP','专用监听器','规则接口','会话请求','组合','已知限制','提供方','运行','注册','公开','客户端')):
   sections.append('### '+title+'\n\n'+prose(body).replace('\n### ','\n#### '))
 return summary,'\n\n'.join(sections)

def table(v):return str(v).replace('|','&#124;').replace('\n',' ')
def slug(s):return re.sub('[^a-z0-9]+','-',s.lower()).strip('-')
packages={}
for e in entries: packages.setdefault(e['package'],[]).append(e)
# 同源重导出优先根入口；每个发现对象仍保留显式裁决。
canonical={}
for es in packages.values():
 for e in sorted(es,key=lambda x:(x['subpath']!='.',len(x['subpath']))):
  for s in sy[e['id']]['symbols']:
   if s['name']!='default':canonical.setdefault((e['package'],s['source'],s['name']),e['id'])
for pkg,es in sorted(packages.items()):
 pp=Path(es[0]['path']).parent; key=pkg.removeprefix('@deepseek-ai/'); topic='capabilities-'+pp.parts[1]
 if topic not in result['topics']:result['topics'].append(topic)
 owner=f'references/host/api/api-capabilities-{key}.md'; source=f'api-guardrails/capabilities-{key}.md'; how=f'references/host/how-to/how-to-capabilities-{key}.md'; howsource=f'how-to/capabilities-{key}.md'; title=f'接入 {pkg}'
 summary,usage=readme_parts(pp)
 md=f'# {pkg} 插件契约\n\n适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。\n\n## 使用目的与组合\n\n{summary}\n\n{usage}\n\n'
 incl=[]; packageobjects=[]; evidence_paths={str(pp/'package.json')}
 for e in es:
  ent={'candidate':e['id'],'decision':'included'}
  if e['subpath'] in ['./testing','./internal']:
   ent={'candidate':e['id'],'decision':'excluded','reason':f"{e['subpath']} 明确承载测试夹具或同包内部协作；插件使用根入口的受管理 API，不能借此绕过 owner 的注册、日志与清理。"}
  result['entries'].append(ent)
  if ent['decision']=='excluded':continue
  for s in sy[e['id']]['symbols']:
   objid='cap-'+hashlib.sha256((e['id']+'#'+s['name']).encode()).hexdigest()[:18]
   sec=f"{s['name']}（{e['subpath']}）"
   o={'id':objid,'entry':e['id'],'symbol':s['name'],'signature':s['signature'],'source':s['source'],'decision':'included','owner':owner,'section':sec,'members':[]}
   reason=None
   if s.get('deprecated'):reason=f"{s['source']} 对 {s['name']} 明确标记 @deprecated；常规插件契约不推荐此入口。"
   elif s['name']=='default' and any(x['name']==s['signature'] for x in sy[e['id']]['symbols']):reason=f"default 是同入口 {s['signature']} 的默认导出别名；权威契约归命名导出，避免复制同一对象。"
   elif canonical.get((pkg,s['source'],s['name']),e['id'])!=e['id']:reason=f"该符号从 {s['source']} 重导出；同包 {canonical[(pkg,s['source'],s['name'])]} 已纳入完全相同的对象契约。"
   if reason:
    o={k:v for k,v in o.items() if k not in ['owner','section','members']};o.update(decision='excluded',reason=reason);result['objects'].append(o);continue
   incl.append(objid);packageobjects.append((s['name'],sec));evidence_paths.add(s['source'])
   md+=f'## {sec}\n\n公开导入：`{pkg+("" if e["subpath"]=="." else e["subpath"][1:])}`；公开符号：`{s["name"]}`。'
   if e['subpath']=='./client':md+=' 此子路径用于 Client 编译面；不把它的运行对象传到 Host。'
   elif e['subpath'] in ['./types','./message','./brand','./grammar','./protocol']:md+=' 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。'
   else:md+=' Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。'
   md+='\n\n'
   sig=s['signature'];md+=f'公开类型：`{table(sig)}`。\n\n'
   if s['members']:
    md+='| 成员 | 公开类型 |\n| --- | --- |\n'
    for m in s['members']:
     mm={k:m[k] for k in ['name','signature']};mm['decision']='excluded' if m.get('deprecated') else 'included'
     if m.get('deprecated'):mm['reason']=f"{s['source']} 的 {s['name']}.{m['name']} 标有 @deprecated；不作为新插件实现入口。"
     else:md+=f"| `{m['name']}` | `{table(m['signature'])}` |\n"
     o['members'].append(mm)
   # 类型实体之间的必要关系由包级使用节与源码声明补充；成员不臆测默认值。
   if any(m['name'] in ['register','registerProvider','registerAdapter'] for m in s['members']):
    md+='\n注册在调用方 Cordis scope 中完成。保留返回的 disposer，在插件不再提供该能力时释放；不要让异步任务在 owner 结束后继续写入注册表。服务实现与消费者各自承担其资源，注册回调不是持久化记录。\n'
   elif any(m['name'] in ['cancel','dispose','release'] for m in s['members']):
    md+='\n这是调用方持有的运行时对象。按上文公开使用路径结束任务；取消和释放不同于业务成功，等待异步清理后才能认定资源已退出。跨进程恢复须读取业务拥有的持久数据，不能序列化此活对象。\n'
   elif s['members']:
    md+='\n这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。\n'
   else:
    md+='\n此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。\n'
   md+=f'\n操作路径见[接入指南](../how-to/how-to-capabilities-{key}.md)。\n\n'
   result['objects'].append(o)
 # 每包保留引用关系与自己独占的操作任务。
 md+='## 验证边界\n\n将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。\n'
 write(source,md)
 result['files'].append({'source':source,'output':owner,'kind':'api-guardrail','role':'subject','topic':topic,'subject':key})
 howmd=f'# {pkg} 使用路径\n\n## {title}\n\n### 目标与前置\n\n{summary}\n\n使用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`，安装同一版本的公开包；本任务的 API 契约由[包专题](../api/api-capabilities-{key}.md)维护。\n\n### 操作与装载\n\n1. 在消费项目用 `pnpm add {pkg}@0.2.1-rc.3` 固定依赖；不要把源码 monorepo 的 `workspace:` 依赖直接复制给消费项目。\n2. 按下列公开使用步骤选择配置、注入依赖与运行侧；服务声明与具体提供方分别挂载，不把纯类型子路径当成可执行插件。\n3. 将插件加入消费项目现有 Profile 的 Cordis 配置后重新装载。为代码扩展创建独立插件包，由其 `inject` 声明依赖，再在该插件 scope 内注册；返回的清理函数归此 scope 所有。\n\n{usage}\n\n### 对象入口\n\n'
 for name,sec in packageobjects:
  # 链接文件即可；对象索引提供精确唯一小节。
  howmd+=f'- `{name}`：[权威契约](../api/api-capabilities-{key}.md)。\n'
 howmd+='\n### 失败、取消与完成判据\n\n先观察 Profile 的依赖与配置错误，再执行上文最小业务输入。按该能力公开的结果或错误码判断，不把日志没有异常当成业务成功。中止一项进行中的调用并确认调用方能结束；卸载贡献插件后，确认其注册、连接和持有资源已撤销。需要持久状态的能力另外重启并核对业务记录；纯辅助函数没有后台清理或恢复步骤。\n'
 write(howsource,howmd);result['files'].append({'source':howsource,'output':how,'kind':'how-to'})
 cand=[x['id'] for x in caps if x['id']=='package:'+pkg or (x['kind']=='composition-manifest' and x['path'].startswith(str(pp)+'/'))]
 taskid='use-'+key
 if cand:
  # 组合清单超过 12 的情况按每份清单拆分，常见每包 1-2。
  result['dispositions'].append({'id':taskid,'decision':'included','candidates':cand,'topics':[topic],'owners':[owner],'summary':summary or f'{pkg} 公开组合入口。','pluginTask':title,'ownerSections':{owner:'使用目的与组合'}})
 result['taskPaths'].append({'id':taskid,'outcome':f'{pkg} 在目标 Profile 中完成其公开调用并可撤销贡献','decision':'covered','candidates':cand,'apiObjects':incl,'destinations':[{'output':how,'section':title}],'compositionSteps':['固定消费包版本并挂载依赖服务','在所属运行侧配置或注册能力','发起一次公开调用并观察业务结果','取消进行中工作并卸载贡献'],'navigationGroup':'host'})
 for t in tasks:
  if t['path'].startswith(str(pp)+'/'):
   if any(x in t['title'] for x in ['开发备注','Dev Note','理解实现','Understand the implementation']):
    result['taskDiscoveries'].append({'candidate':t['id'],'decision':'excluded','reason':f"{t['path']} 的“{t['title']}”是该包维护实现或未定设计工作，不是消费插件的使用任务；其公开使用路径由 {taskid} 承接。"})
   else:result['taskDiscoveries'].append({'candidate':t['id'],'decision':'included','taskId':taskid})
 result['claims'].append({'id':taskid+'-contract','kind':'implemented-behavior','topic':topic,'decision':'accepted','owner':owner,'summary':summary or f'{pkg} 的公开模块契约。','evidence':[{'category':'exports','path':str(pp/'package.json')}]+[{'category':'public-api','path':p} for p in sorted(evidence_paths) if p!=str(pp/'package.json')]})
# 主题页逐个链接所有子主题，避免将独立能力当成一个成员列表。
for topic in result['topics']:
 fs=[f for f in result['files'] if f.get('role')=='subject' and f['topic']==topic]
 src=f'api-guardrails/{topic}-overview.md';out=f'references/host/api/api-{topic}-overview.md'
 text=f'# {topic.removeprefix("capabilities-")} 能力选型\n\n## 对象关系\n\n服务声明定义插件可以调用或实现的接口，具体提供方决定环境和运行能力，工具与界面消费者把结果呈现给用户或模型。配置与类型对象不能代替服务装载，Client 子路径与 Host 活对象不可跨侧混用。每个子主题说明对应包的公开关系和资源所有权。\n\n## 选型与使用\n\n先按任务选择一个具体包，再按该包的公开配置和依赖接入。实验包需显式启用；它的公开导出可供组合，并不意味着基础 Profile 默认提供。\n\n'
 for f in fs:text+=f'- [{f["subject"]}]({Path(f["output"]).name})：查看用途、导入、对象成员、生命周期和使用步骤。\n'
 write(src,text);result['files'].append({'source':src,'output':out,'kind':'api-guardrail','role':'topic','topic':topic})
(E/'capabilities/result.json').write_text(json.dumps(result,ensure_ascii=False,indent=4)+'\n')
print({k:len(v) for k,v in result.items()})
