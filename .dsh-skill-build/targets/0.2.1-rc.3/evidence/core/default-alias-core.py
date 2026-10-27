import json,re
from pathlib import Path
P=Path('.dsh-skill-build/targets/0.2.1-rc.3');r=json.loads((P/'evidence/core/result.json').read_text());S=P/'skill-source';fm={f['output']:f for f in r['files']};redirect={}
for o in r['objects']:
 if o['symbol']!='default' or o['decision']!='included':continue
 src=(P/'checkout'/o['source']).read_text();m=re.search(r'export\s+default\s+(\w+)\s*(?:;|\n|$)',src)
 if not m:continue
 same=next((x for x in r['objects'] if x['entry']==o['entry'] and x['symbol']==m[1] and x['source']==o['source'] and x['decision']=='included'),None)
 if same is None:continue
 o['decision']='excluded';o['reason']=f'源码显式 export default {m[1]}，且同入口具名导出同一对象；权威签名、成员与生命周期归 {same["owner"]} 的 {same["section"]}，不复制事实。';redirect[o['id']]=same['id']
 for member in o['members']:member['decision']='excluded';member['reason']='与同入口具名对象同一成员，契约在具名对象权威小节维护。'
 f=S/fm[o['owner']]['source'];txt=f.read_text();txt=re.sub(r'\n## '+re.escape(o['section'])+r'\n.*?(?=\n## |\Z)','',txt,flags=re.S);f.write_text(txt.rstrip()+'\n')
for t in r['taskPaths']:t['apiObjects']=list(dict.fromkeys(redirect.get(x,x) for x in t['apiObjects']))
empty={f['output'] for f in r['files'] if f.get('role')=='subject' and not any(o['decision']=='included' and o['owner']==f['output'] for o in r['objects'])};r['files']=[f for f in r['files'] if f['output'] not in empty];r['claims']=[c for c in r['claims'] if c['owner'] not in empty]
for f in r['files']:
 file=S/f['source'];txt=file.read_text()
 for path in empty:txt=re.sub(r'^.*\]\([^\n]*'+re.escape(Path(path).name)+r'[^\n]*\).*$','',txt,flags=re.M)
 # 被替代的default对象链接精确转为同一具名owner，保证任务对象可达。
 for oldid,newid in redirect.items():
  old=next(o for o in r['objects'] if o['id']==oldid);new=next(o for o in r['objects'] if o['id']==newid)
  oa=re.sub(r'[^\w\- ]','',old['section'].lower()).replace(' ','-');na=re.sub(r'[^\w\- ]','',new['section'].lower()).replace(' ','-');txt=txt.replace(Path(old['owner']).name+'#'+oa,Path(new['owner']).name+'#'+na)
 file.write_text(txt.rstrip()+'\n')
(P/'evidence/core/result.json').write_text(json.dumps(r,ensure_ascii=False,indent=4)+'\n');print('explicit named aliases',len(redirect))
