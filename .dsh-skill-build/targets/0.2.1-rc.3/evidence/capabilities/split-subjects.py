import json,re,hashlib
from pathlib import Path
T=Path('.dsh-skill-build/targets/0.2.1-rc.3');p=T/'evidence/capabilities/result.json';r=json.loads(p.read_text());S=T/'skill-source'
for f in list(r['files']):
 if f.get('role')!='subject':continue
 objs=[o for o in r['objects'] if o['decision']=='included' and o['owner']==f['output']]
 if len(objs)<=30:continue
 doc=(S/f['source']).read_text();starts=sorted([(doc.index('## '+o['section']+'\n'),o) for o in objs],key=lambda x:x[0]);prefix=doc[:starts[0][0]]
 tailpos=doc.find('\n## 验证边界');note=re.search(r'\n### (?:模型调用与适配器|Skill 提供方与目录|子任务的权限|Workflow 活对象|PTC 执行|MCP 连接|命令输入|一次审批|Goal 的持久)',doc)
 if note:tailpos=min(tailpos,note.start())
 tail=doc[tailpos:];groups={}
 for i,(pos,o) in enumerate(starts):
  end=starts[i+1][0] if i+1<len(starts) else tailpos
  chunk=doc[pos:end];source=o['source'];leaf=Path(source).stem
  group=leaf if leaf!='index' or source.endswith('/src/index.ts') else leaf+'-'+hashlib.sha256(source.encode()).hexdigest()[:5]
  groups.setdefault(group,[]).append((o,chunk))
 # 主入口保留 root index 的对象与包级公共约束。
 main=groups.pop('index',[])
 if not main:
  first=next(iter(groups));main=groups.pop(first)
 (S/f['source']).write_text(prefix+''.join(c for _,c in main)+tail)
 for group,pairs in groups.items():
  subject=f['subject']+'-'+group;newsource='api-guardrails/capabilities-'+subject+'.md';newout='references/host/api/api-capabilities-'+subject+'.md'
  text=f'# {subject} 对象契约\n\n适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 {group} 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束]({Path(f["output"]).name})；本页逐项保留对象的参数、字段和判别分支。\n\n'
  for o,chunk in pairs:o['owner']=newout;text+=chunk
  (S/newsource).write_text(text.rstrip()+'\n')
  r['files'].append({'source':newsource,'output':newout,'kind':'api-guardrail','role':'subject','topic':f['topic'],'subject':subject})
  sourcepaths=sorted(set(o['source'] for o,_ in pairs));r['claims'].append({'id':'contract-'+subject,'kind':'implemented-behavior','topic':f['topic'],'decision':'accepted','owner':newout,'summary':f'{group} 对象的公开声明、成员和嵌套分支。','evidence':[{'category':'public-api','path':x} for x in sourcepaths]})
  howsource='how-to/capabilities-'+f['subject']+'.md';hp=S/howsource;ht=hp.read_text();ht+='\n对象子主题：['+group+'](../api/'+Path(newout).name+')。\n';hp.write_text(ht)
  # topic 必须链接每个新增 subject。
  topicfile=next(x for x in r['files'] if x.get('role')=='topic' and x['topic']==f['topic']);tp=S/topicfile['source'];tp.write_text(tp.read_text()+'\n- ['+subject+']('+Path(newout).name+')：公开对象的独占契约。\n')
  root=S/f['source'];root.write_text(root.read_text()+'\n相关对象：['+group+']('+Path(newout).name+')。\n')
p.write_text(json.dumps(r,ensure_ascii=False,indent=4)+'\n');print('files',len(r['files']))
