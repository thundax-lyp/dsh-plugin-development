import json,re
from pathlib import Path
P=Path('.dsh-skill-build/targets/0.2.1-rc.3');r=json.loads((P/'evidence/core/result.json').read_text());S=P/'skill-source';fmap={f['output']:f for f in r['files']};seen={};removed=set();empty=set()
for o in r['objects']:
 key=(o['source'],o['symbol'])
 if key in seen:
  first=seen[key];o['decision']='excluded';o['reason']=f'这是 {first["entry"]} 的同一声明重复导出；权威契约由 {first["owner"]} 的 {first["section"]} 提供，不再复制成员事实。'
  for m in o['members']:m['decision']='excluded';m['reason']='与主导出同一声明的重复成员，由权威对象正文统一维护。'
  removed.add(o['id']);file=S/fmap[o['owner']]['source'];txt=file.read_text();pattern=r'\n## '+re.escape(o['section'])+r'\n.*?(?=\n## |\Z)';txt=re.sub(pattern,'',txt,flags=re.S);file.write_text(txt.rstrip()+'\n')
 else:seen[key]=o
for f in r['files']:
 if f['kind']=='api-guardrail' and f.get('role')=='subject' and not any(o['owner']==f['output'] and o['decision']=='included' for o in r['objects']):empty.add(f['output'])
for e in r['entries']:
 obs=[o for o in r['objects'] if o['entry']==e['candidate']]
 if obs and not any(o['decision']=='included' for o in obs):e['decision']='excluded';e['reason']='此子路径仅重导出已由同包主入口维护的声明；独立契约均指向对象账本记录的唯一主入口。'
r['files']=[f for f in r['files'] if f['output'] not in empty]
for f in r['files']:
 file=S/f['source'];txt=file.read_text()
 for path in empty:txt=re.sub(r'^.*\]\([^\n]*'+re.escape(Path(path).name)+r'[^\n]*\).*$','',txt,flags=re.M)
 file.write_text(txt.rstrip()+'\n')
for t in r['taskPaths']:
 t['apiObjects']=[x for x in t['apiObjects'] if x not in removed]
 if not t['apiObjects'] and not t.get('configurationOnly'):t['decision']='excluded';t['reason']='此子路径只重新导出同包主入口，使用主入口任务即可完成相同操作。';t.pop('destinations',None);t.pop('compositionSteps',None)
r['claims']=[c for c in r['claims'] if c['owner'] not in empty]
(P/'evidence/core/result.json').write_text(json.dumps(r,ensure_ascii=False,indent=4)+'\n');print('deduplicated',len(removed),'empty',len(empty))
