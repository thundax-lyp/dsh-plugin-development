import re
from pathlib import Path
S=Path('.dsh-skill-build/targets/0.2.1-rc.3/skill-source')
for f in list((S/'api-guardrails').glob('capabilities-*.md'))+list((S/'how-to').glob('capabilities-*.md')):
 lines=f.read_text().splitlines();out=[];i=0;in_fence=False
 while i<len(lines):
  if lines[i].startswith('```'):
   in_fence=not in_fence;out.append(lines[i]);i+=1;continue
  if in_fence:
   out.append(lines[i]);i+=1;continue
  if lines[i].startswith('    '):
   block=[]
   while i<len(lines) and (lines[i].startswith('    ') or not lines[i].strip()):block.append(lines[i][4:] if lines[i].startswith('    ') else '');i+=1
   code='\n'.join(block).rstrip();first=next((x.strip() for x in block if x.strip()),'')
   if re.match(r'(?:- (?:name|id|insert|target):|[A-Za-z_][\w-]*:\s)',first) and not any(x in code for x in ['=>','const ','import ','function ','...','…']):out+=['```yaml',code,'```','']
   elif re.match(r'(?:pnpm |dsh |node |npm |python|uv )',first) and not any(x in code for x in ['...','…']):out+=['```sh',code,'```','']
   elif out and out[-1].endswith(('：',':')):out[-1]=out[-1].rstrip('：:')+'；实现代码以独立 example 为准。'
   continue
  out.append(lines[i]);i+=1
 t='\n'.join(out)
 t='\n'.join(line for line in t.splitlines() if not re.search(r'Agent ?Note|已删除|旧版|本开发备注|TODO|生成[^。\n]{0,50}(?:目录|真源)',line))
 t=re.sub(r'\n{3,}','\n\n',t);f.write_text(t.rstrip()+'\n')
