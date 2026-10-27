import json
from pathlib import Path
T=Path('.dsh-skill-build/targets/0.2.1-rc.3');E=T/'evidence';p=E/'capabilities/result.json';r=json.loads(p.read_text());caps=json.loads((E/'capability-candidates.json').read_text())['candidates'];tasks=json.loads((E/'task-candidates.json').read_text())['candidates']
mapdocs={'agent-team':'dsh-experimental-agent-team','approval':'dsh-user-approval','claude-code-mods':'dsh-experimental-claude-code-mods','commands':'dsh-commands','compaction':'dsh-compaction','goal':'dsh-goal','llm-streaming':'dsh-llm','mcp':'dsh-mcp-client','permission-presets':'dsh-permission-presets','plan':'dsh-plan-mode','ptc-runtime':'dsh-ptc-runtime','session-reference':'dsh-session-reference','skills':'dsh-skill','subagent':'dsh-subagent','token-meter':'dsh-token-meter','translation':'dsh-experimental-translator','user-questions':'dsh-user-questions','voice-input':'dsh-experimental-speech-to-text','webhook':'dsh-webhook','workflow':'dsh-workflow','worktrees':'dsh-experimental-worktree'}
for d,key in mapdocs.items():
 c=next(x for x in caps if x['id']=='subsystems:'+d);main=next(x for x in r['dispositions'] if x['id']=='use-'+key)
 r['dispositions'].append({'id':'cap-subsystem-'+d,'decision':'merged','candidates':[c['id']],'topics':main['topics'],'owners':main['owners'],'summary':f'{d} 子系统文档补充对应公开能力的类型与使用语义。','pluginTask':main['pluginTask'],'ownerSections':main['ownerSections'],'mergedInto':'package:@deepseek-ai/'+key,'relationship':f'该文档定义 {key} 已由代码导出确认的契约，实际可调用入口和任务由包专题承担；文档不单独提供新的服务实例。'})
 task=next(x for x in r['taskPaths'] if x['id']=='use-'+key);task['candidates'].append(c['id'])
 claim=next(x for x in r['claims'] if x['id']=='use-'+key+'-contract');claim['evidence'].append({'category':'documentation','path':c['path']})
 for t in tasks:
  if t['path'] in [c['path'],c['path'].replace('.md','.zh.md')]:r['taskDiscoveries'].append({'candidate':t['id'],'decision':'included','taskId':task['id']})
# adapter cookbook 是新适配器作者的操作路线，归属已给出完整 example 的 LLM 任务。
main=next(x for x in r['dispositions'] if x['id']=='use-dsh-llm');cid='cookbook:adding-an-llm-adapter';r['dispositions'].append({'id':'cap-add-llm-adapter','decision':'merged','candidates':[cid],'topics':main['topics'],'owners':main['owners'],'summary':'实现和挂载遵守流协议的 LlmAdapter。','pluginTask':'注册新的模型提供方并消费 terminal stream','ownerSections':main['ownerSections'],'mergedInto':'package:@deepseek-ai/dsh-llm','relationship':'cookbook 的新增 adapter 任务使用 llm 根导出、registerAdapter 和 StreamChunk 协议；本次消费包 example 给出全部构建与装载文件。'})
next(x for x in r['taskPaths'] if x['id']=='use-dsh-llm')['candidates'].append(cid)
for t in tasks:
 if t['path']=='docs/cookbook/adding-an-llm-adapter.md':r['taskDiscoveries'].append({'candidate':t['id'],'decision':'included','taskId':'use-dsh-llm'})
 if t['path']=='docs/user/guide/mcp-memory.zh.md':r['taskDiscoveries'].append({'candidate':t['id'],'decision':'included','taskId':'use-dsh-mcp-client'})
# 将实际已经检查的实现、测试和公开文档位置记入证据，不把测试存在写成测试通过。
for cl in r['claims']:
 key=cl['id'][4:-9];packageclaim=next((x for x in cl['evidence'] if x['category']=='exports'),None)
 if not packageclaim:continue
 pp=Path(packageclaim['path']).parent
 for pattern in ['src/index.ts','README.md','tests/service.spec.ts','tests/skill.spec.ts','tests/apply.spec.ts','tests/workflow.spec.ts','tests/goal.spec.ts','tests/approval.spec.ts']:
  f=T/'checkout'/pp/pattern
  if f.exists():
   cat='tests' if pattern.startswith('tests/') else 'runtime' if pattern.startswith('src/') else 'documentation'
   if not any(e['path']==str(pp/pattern) and e['category']==cat for e in cl['evidence']):cl['evidence'].append({'category':cat,'path':str(pp/pattern)})
# 去除重复发现，只保留唯一归属。
r['taskDiscoveries']=list({x['candidate']:x for x in r['taskDiscoveries']}.values())
p.write_text(json.dumps(r,ensure_ascii=False,indent=4)+'\n');print({k:len(v) for k,v in r.items()})
