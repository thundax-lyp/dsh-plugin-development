import json,re,hashlib
from pathlib import Path
P=Path('.dsh-skill-build/targets/0.2.1-rc.3');C=P/'checkout'; S=P/'skill-source'
prefix=('vendor/','packages/core/','packages/boot/','packages/bundle/','packages/preset/','packages/extensions/','packages/settings/','packages/typert/','packages/api/','packages/host/','packages/sdk/','apps/cli/')
entries=json.loads((P/'evidence/api-entry-candidates.json').read_text())['candidates']; symbols=json.loads((P/'evidence/api-symbol-candidates.json').read_text())['entries']; symmap={x['entry']:x for x in symbols}
selected=[x for x in entries if x['path'].startswith(prefix)]; result={k:[] for k in ['files','topics','entries','objects','dispositions','taskPaths','taskDiscoveries','claims']}
def write(src,out,txt,kind,**kw):
 (S/src).parent.mkdir(parents=True,exist_ok=True);(S/src).write_text(txt.rstrip()+'\n');result['files'].append(dict(source=src,output=out,kind=kind,**kw))
def slug(s):return re.sub('[^a-z0-9]+','-',s.lower()).strip('-')
def cell(s): return s.replace('|','\\|').replace('\n',' ')
def summary(pkgdir):
 p=C/pkgdir/'README.zh.md'
 if not p.exists():return ''
 t=p.read_text();m=re.search(r'## 概述\s+(.+?)(?=\n##|\Z)',t,re.S)
 if not m:return ''
 t=m[1].strip();t=re.sub(r'\[([^\]]+)\]\([^\)]+\)',r'\1',t);return t
# 每个子路径使用独立主题，按契约对象拆成可查的小组。
for en in selected:
 eid=en['id']; pkg=en['package']; sub=en['subpath']; key='core-'+slug(pkg.replace('@deepseek-ai/','')+'-'+(sub if sub!='.' else 'root')); topic=key
 result['topics'].append(topic); data=symmap.get(eid,{}); syms=data.get('symbols',[]); source=data.get('source'); pkgdir=str(Path(en['path']).parent)
 overview=f'references/infra/api/api-{key}-overview.md';how=f'references/infra/how-to/how-to-{key}.md';title=f'使用 {pkg}'+(' '+sub if sub!='.' else '')
 result['entries'].append({'candidate':eid,'decision':'included'})
 pages=[]; groups=[syms[i:i+8] for i in range(0,len(syms),8)]
 for idx,group in enumerate(groups):
  page=f'references/infra/api/api-{key}-{idx+1}.md';pages.append(page)
  text=f'# {pkg} {sub}：公开对象 {idx+1}\n\n适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [{pkg} 选型与组合](api-{key}-overview.md)。\n\n'
  sm=summary(pkgdir)
  if sm:text+=sm+'\n\n'
  text+='## 接入与所有权\n\n'+ ('本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。' if '/client' in sub else '按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。')+'返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。\n\n'
  for sy in group:
   oid='core-'+hashlib.sha256((eid+'#'+sy['name']).encode()).hexdigest()[:16];section=sy['name']+' 公开契约'
   obj={'id':oid,'entry':eid,'symbol':sy['name'],'signature':sy['signature'],'source':sy['source'],'decision':'included','owner':page,'section':section,'members':[]}
   text+=f"## {section}\n\n导入入口：`{pkg+('' if sub=='.' else sub[1:])}`；公开符号：`{sy['name']}`。\n\n"
   # 文本代码块作为签名检索材料，不伪装成可执行示例。
   text+='公开声明签名：\n\n```text\n'+sy['signature']+'\n```\n\n'
   if sy['members']:
    text+='| 成员 | 公开类型或调用签名 |\n| --- | --- |\n'
    for m in sy['members']:
     dec='excluded' if m.get('deprecated') else 'included';mr={k:m[k] for k in ['name','signature']};mr['decision']=dec
     if dec=='excluded':mr['reason']='目标声明明确标记此成员为待废弃，不作为新插件的实现入口。'
     else:text+='| `'+cell(m['name'])+'` | `'+cell(m['signature'])+'` |\n'
     obj['members'].append(mr)
    text+='\n可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。\n\n'
   else:text+='这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。\n\n'
   text+=f'使用顺序与完成判据见 [操作任务](../how-to/how-to-{key}.md)。\n\n';result['objects'].append(obj)
  write(f'api-guardrails/{key}-{idx+1}.md',page,text,'api-guardrail',role='subject',topic=topic,subject=f'objects-{idx+1}')
 if not pages:
  # 无对象的组合入口由配置任务承接，不伪造 API 对象。
  result['entries'][-1]={'candidate':eid,'decision':'excluded','reason':f'{pkg} 的该导出不声明可供直接调用的对象；本包通过 package manifest 与 Cordis 组合配置使用，见对应能力任务。'}
  result['topics'].pop();continue
 text=f'# {pkg} {sub}\n\n适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。\n\n## 对象关系\n\n'+(summary(pkgdir) or f'`{pkg}` 的此模块公开以下对象、配置和值。类型用于检查调用契约，运行时插件贡献仍须经 Loader 或 `ctx.plugin()` 装载。')+'\n\n'+ '\n'.join(f'- [公开对象组 {i+1}]({Path(p).name})。' for i,p in enumerate(pages))+'\n\n## 选型与使用\n\n根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-'+key+'.md) 给出装载和验证顺序。\n'
 write(f'api-guardrails/{key}-overview.md',overview,text,'api-guardrail',role='topic',topic=topic)
 objs=[x for x in result['objects'] if x['entry']==eid and x['decision']=='included']
 text=f'# {title}\n\n## {title}\n\n目标：在明确的运行侧消费 `{pkg}` 的公开契约，并使提供方装载、调用与清理可观察。适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。\n\n### 选择契约\n\n'
 for o in objs:text+=f'- [{o["symbol"]}](../api/{Path(o["owner"]).name}#{re.sub(r'[^\w\- ]','',o["section"].lower()).replace(' ','-')}): `{o["symbol"]}` 的权威契约。\n'
 text+='\n### 装配、失败与验证\n\n1. 在消费项目锁定 DSH 版本，安装所需包；已有 profile 不会因添加一个普通依赖自动装载插件。先选择上列需要的值和类型，保持 Client、Host 的编译入口分离。\n2. 若写 Cordis 插件，导出 `apply(ctx, config)` 或可挂载类；把所有服务键列入 `inject`。通过 [最小独立包](../examples/example-core-service.md) 的 bundle manifest 与 patch 装载。纯函数或数据类型只需导入，不要给它们添加服务键。\n3. 在 profile 的依赖图内解析该包。已发布包通过 `dsh plugin --profile <profile> add <package>` 安装 bundle；本地开发使用已构建的本地目录 spec。未启用 HMR 时重启 profile。\n4. 调用所选公开方法并核对返回值或事件。调用支持 signal 时传调用方持有的 AbortSignal；取消后等待该次工作落定。把 watcher、连接或异步清理注册到 `ctx.effect()`，并在一个 disposer 中保持有顺序要求的清理。\n5. 停用自己的 bundle，确认调用入口或注册消失，再启用确认没有重复注册；模块无法解析、配置校验失败、缺少 inject 服务分别检查路径、schema 与 PENDING 状态。纯转换测试有效/无效输入，不能用导入成功代表业务执行成功。\n\n完整基础包结构与卸载验证见 [Service 示例](../examples/example-core-service.md)。Remote 发布另见 [Remote 生成与装配](how-to-core-remote.md)，工具注册另见 [工具任务](how-to-core-tool.md)。\n'
 write(f'how-to/{key}.md',how,text,'how-to')
 result['taskPaths'].append({'id':key,'outcome':title+'并验证结果与清理','decision':'covered','candidates':[],'apiObjects':[o['id'] for o in objs],'compositionSteps':['选择公开对象和运行侧','安装提供方及依赖','按契约调用并验证','停用并核查释放'],'destinations':[{'output':how,'section':title}]})
 ev=[{'category':'exports','path':en['path']}]
 for s in dict.fromkeys(o['source'] for o in objs):ev.append({'category':'public-api','path':s})
 result['claims'].append({'id':key+'-contract','kind':'implemented-behavior','topic':topic,'decision':'accepted','owner':pages[0],'summary':f'{pkg} {sub} 的公开声明、直接成员及包级使用契约。','evidence':ev})
# 包级候选准确归入已有主入口；纯组合包在主Agent整合时处理。
cap=json.loads((P/'evidence/capability-candidates.json').read_text())['candidates']
for ca in cap:
 if not ca['path'].startswith(prefix):continue
 if ca['kind']=='public-package':
  es=[x for x in selected if x['package']==ca['name'] and x['subpath']=='.']; en=es[0] if es else None
  if en:
   key='core-'+slug(en['package'].replace('@deepseek-ai/','')+'-root'); ts=[t for t in result['taskPaths'] if t['id']==key]
   if ts:
    task=ts[0];task['candidates'].append(ca['id']);owner='references/infra/api/api-'+key+'-1.md';o=next(o for o in result['objects'] if o['owner']==owner)
    result['dispositions'].append({'id':key,'decision':'included','candidates':[ca['id']],'topics':[key],'owners':[owner],'summary':f'{ca["name"]} 公开模块与插件组合契约','pluginTask':task['outcome'],'ownerSections':{owner:o['section']}})
(P/'evidence/core/result.json').write_text(json.dumps(result,ensure_ascii=False,indent=4)+'\n')
print({k:len(v) for k,v in result.items()})
