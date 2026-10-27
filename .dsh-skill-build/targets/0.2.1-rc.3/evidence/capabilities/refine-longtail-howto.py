import json,re,posixpath
from pathlib import Path
T=Path('.dsh-skill-build/targets/0.2.1-rc.3');S=T/'skill-source';p=T/'evidence/capabilities/result.json';r=json.loads(p.read_text());core={'dsh-llm','dsh-mcp-client','dsh-skill','dsh-commands','dsh-workflow','dsh-workflow-ptc','dsh-subagent','dsh-ptc-runtime'}
for task in r['taskPaths']:
 key=task['id'].removeprefix('use-');owner='references/host/api/api-capabilities-'+key+'.md'
 if key in core or not any(f['output']==owner for f in r['files']):continue
 file=next(f for f in r['files'] if f['output']==task['destinations'][0]['output']);old=(S/file['source']).read_text();api=next(f for f in r['files'] if f['output']==owner);apiText=(S/api['source']).read_text();title=task['destinations'][0]['section'];summary=next((cl['summary'] for cl in r['claims'] if cl['owner']==owner),'')
 # 精确包用法已在API页拥有；HOWTO只补任务顺序、装载与业务判据。
 hasuse=bool(re.search(r'^### (?:使用本包|使用此包|服务|提出问题|配置|规则接口|组合)',apiText,re.M))
 link='../api/'+Path(owner).name
 if hasuse:
  m=re.search(r'^### (使用本包|使用此包|服务|提出问题|配置|规则接口|组合)\s*$',apiText,re.M);section=m[1];anchor=section
 else:section='使用目的与组合';anchor='使用目的与组合'
 prereq=summary.split('。')[0]+'。' if summary else '本任务使用目标版本的公开包入口。'
 pkg='@deepseek-ai/'+key
 text=f'# {title}\n\n## {title}\n\n### 目标与前置\n\n{prereq}\n\n消费项目使用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。先阅读[{section}]({link}#{anchor})，该处拥有本包的具体配置、调用顺序和产品限制；不要以文件存在或安装成功推定依赖服务已挂载。\n\n### 实现和装载\n\n'
 text+=f'1. 确认使用的是 `{pkg}@0.2.1-rc.3`。按上述公开用法选择配置和提供方；配置字段与默认值以 API 页为准，不把其他后端的同名字段搬来。\n'
 text+='2. 对可执行插件行，按[配置 bundle 的完整文件结构](../examples/example-local-mcp.md#配置-bundle)创建独立包，保留 `dsh.bundle.patch`，把目标插件行放进 `cordis.patch.yml` 的 insert 数组；使用本任务的包名与配置替换示例 MCP 行。库、抽象接口和纯数据子路径不作为可执行插件行；为它们编写贡献插件，由 `inject` 声明所需服务并在其 scope 中调用。\n'
 text+=f'3. 从 bundle 父目录运行 `dsh plugin --profile demo add ./你的bundle目录`，随后运行 `dsh --profile demo`。若本任务需要 Web，先在全新隔离 home 用 `dsh --profile demo --from-default-profile web --dump-config` 初始化，再安装 bundle；该初始化会替换已有目标目录，不能对现有生产 Profile 直接套用。\n'
 text+=f'4. 按 [{section}]({link}#{anchor}) 给出的真实输入和触发路径执行“{title}”。先确认服务/提供方和必要认证可用，再触发；观察该页指定的工具结果、UI、目录或持久事件，不以空结果替代业务输出。\n'
 text+='5. 用本包公开的 signal/disposer/释放接口结束工作；移除贡献 bundle 后重启 Profile，确认该能力的自有注册与资源撤回。对仍被其他包共享的服务核对 owner，不能因本插件卸载而销毁它。\n\n'
 text+='### 失败与完成判据\n\n按 API 页列出的失败分支复现一次拒绝或不可用输入；有异步工作时另测取消和卸载，有持久业务状态时另测重启恢复。模型可见内容只能来自 consumer 写入 Session 的事实。依赖本机平台、外部认证或网络的提供方必须在对应环境验证；类型编译只证明声明可用，安装与 Profile 激活只证明组合入口，二者都不能替代业务结果。\n\n### 权威对象契约\n\n'
 for o in sorted(set(o['owner'] for o in r['objects'] if o['id'] in task['apiObjects'])):text+='- ['+Path(o).stem+']('+posixpath.relpath(o,posixpath.dirname(file['output']))+')。\n'
 # 保持合并后子任务正文可达；完整长代码只留独立example。
 for m in re.finditer(r'组合后的具体操作见\[([^]]*)\]\(([^)]*)\)',old):text+='\n组合后的具体操作见['+m[1]+']('+m[2]+')。\n'
 (S/file['source']).write_text(text)
# 每份知识页的 claim 说明事实所属，不把派生步骤冒充行为验证。
owned={cl['owner'] for cl in r['claims'] if cl.get('decision')=='accepted'}
for f in r['files']:
 if f['output'] in owned:continue
 if f['kind'] not in ['how-to','api-guardrail','example']:continue
 evidence=[]
 if f['kind']=='how-to':
  task=next((t for t in r['taskPaths'] if any(d['output']==f['output'] for d in t['destinations'])),None)
  if task:
   objectSources=sorted(set(o['source'] for o in r['objects'] if o['id'] in task['apiObjects']))
   evidence+=[{'category':'public-api','path':src} for src in objectSources]
   for candidate in task['candidates']:
    cap=next((x for x in json.loads((T/'evidence/capability-candidates.json').read_text())['candidates'] if x['id']==candidate),None)
    if cap and cap['kind']=='public-package':evidence.append({'category':'exports','path':cap['path']})
 if not evidence:evidence=[{'category':'runtime','path':'packages/bundle/base/cordis.patch.yml'},{'category':'documentation','path':'apps/cli/reference/README.md'}]
 elif f['kind']=='how-to':evidence.append({'category':'documentation','path':'apps/cli/reference/README.md'})
 r['claims'].append({'id':'guide-'+Path(f['output']).stem,'kind':'derived-guidance','topic':f.get('topic','capabilities-experimental' if 'experimental' in f['output'] else 'capabilities-llm'),'decision':'accepted','owner':f['output'],'summary':'基于本版本公开契约与 Profile 组合的选型、操作和验证步骤；步骤不表示创建期间已执行全部用户行为。','evidence':evidence})
p.write_text(json.dumps(r,ensure_ascii=False,indent=4)+'\n')
