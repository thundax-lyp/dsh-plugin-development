import fs from 'node:fs'
import path from 'node:path'
import {execFileSync} from 'node:child_process'
const target=path.resolve('.dsh-skill-build/targets/0.2.1-rc.3'),source=path.join(target,'skill-source'),ev=path.join(target,'evidence/fixes-20261027')
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,4)+'\n')
const manifest=read(source+'/manifest.json'),surface=read(source+'/api-surface.json'),coverage=read(source+'/coverage.json'),claims=read(source+'/claims.json'),symbols=read(target+'/evidence/api-symbol-candidates.json')
const suggestion=read(ev+'/settings-worker-ledger-suggestions.json')
for(const f of suggestion.files)if(!manifest.files.some(x=>x.output===f.output))manifest.files.push(f)
manifest.files.sort((a,b)=>a.output.localeCompare(b.output));manifest.status='draft'
const tracked=new Set(execFileSync('git',['ls-files','-z'],{cwd:target+'/checkout',encoding:'utf8'}).split('\0'))
const byKey=new Map(surface.objects.map(o=>[o.entry+'\0'+o.symbol,o]));let newAliases=0,newMembers=0
for(const entry of symbols.entries){
 if(!surface.entries.some(e=>e.candidate===entry.entry&&e.decision==='included'))continue
 for(const symbol of entry.symbols){
  const key=entry.entry+'\0'+symbol.name;let object=byKey.get(key)
  if(!object){
   const canonical=surface.objects.find(o=>o.symbol===symbol.name&&o.decision==='included'&&o.entry!==entry.entry)
   if(!canonical)throw Error('需独立裁决新对象 '+key)
   const reason=`本入口从生成 Remote 再导出 ${symbol.name}，与 ${canonical.entry} 的 ${canonical.owner}#${canonical.section} 是同一契约；正文由原公开声明权威小节展开，避免为聚合重导出再复制一份。`
   object={id:entry.entry+':'+symbol.name,entry:entry.entry,symbol:symbol.name,signature:symbol.signature,source:canonical.source,decision:'excluded',reason,members:[]};surface.objects.push(object);byKey.set(key,object);newAliases++
  }
  object.signature=symbol.signature
  for(const member of symbol.members){
   let m=object.members.find(m=>m.name===member.name)
   if(m)m.signature=member.signature
   else{m={name:member.name,signature:member.signature,decision:object.decision==='excluded'||member.deprecated?'excluded':'included'};if(m.decision==='excluded')m.reason=member.deprecated?`${symbol.name}.${member.name} 的同版本公开声明标为 @deprecated，不作为常规插件入口。`:object.reason;object.members.push(m);newMembers++}
  }
  object.members.sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0)
 }
}
surface.objects.sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0)
for(const claim of suggestion.claims){claim.kind='derived-guidance';if(!manifest.topics.includes(claim.topic))claim.topic='capabilities-experimental';const i=claims.findIndex(c=>c.id===claim.id);if(i<0)claims.push(claim);else claims[i]=claim}
function ensureEvidence(owner,paths,summary){
 const existing=claims.find(c=>c.owner===owner&&c.decision==='accepted')
 const evidence=paths.filter(p=>tracked.has(p)).map(p=>({category:'public-api',path:p}))
 if(!evidence.length)throw Error('无跟踪证据 '+owner)
 if(existing){for(const item of evidence)if(!existing.evidence.some(e=>e.path===item.path&&e.category===item.category))existing.evidence.push(item)}
 else claims.push({id:'fix-'+path.basename(owner,'.md'),kind:'derived-guidance',topic:manifest.topics.includes('core-profile')?'core-profile':'core-packages',decision:'accepted',owner,summary,evidence})
}
for(const record of read(ev+'/api-declaration-observations.json').fixes){const o=surface.objects.find(o=>o.id===record.id);if(!o)throw Error(record.id);const origins=(Array.isArray(record.origin)?record.origin:[record.origin]).flatMap(p=>{const mapped=p.replace('/lib/types/','/src/').replace(/\.d\.[cm]?ts$/,'.ts');return [mapped,mapped.replace(/\.ts$/,'.tsx'),p]});ensureEvidence(o.owner,[o.source,...origins],'依据同版公开声明保留完整符号、类型和值空间。')}
if(fs.existsSync(ev+'/api-evidence-owners.json'))for(const item of read(ev+'/api-evidence-owners.json'))ensureEvidence(item.owner,[...item.trackedSources,...surface.objects.filter(o=>o.owner===item.owner).map(o=>o.source),...(item.generatedDeclarationOrigins.length?['packages/typert/generator/src/emitter.ts','packages/typert/generator/src/worker.ts']:[]),...(item.externalDeclarationOrigins.length?['pnpm-lock.yaml']:[])],'同版公开声明及其继承、联合和声明合并的实际来源。')
if(fs.existsSync(ev+'/api-merged-evidence.json'))for(const item of read(ev+'/api-merged-evidence.json'))ensureEvidence(item.owner,item.evidence,'声明合并的来源与条件按所属包展开。')
const remotePaths=['packages/typert/generator/src/workspace.ts','packages/typert/generator/src/tsdown-plugin.ts','packages/typert/generator/src/worker.ts','packages/typert/generator/src/emitter.ts','packages/api/remotes/src/client/index.ts','packages/client/tsdown.client.ts','packages/typert/loader/src/index.ts','packages/api/gateway/src/client/index.ts','vendor/cordis/src/fiber.ts','vendor/cordis/src/utils.ts']
for(const owner of ['references/infra/examples/example-core-remote.md','references/infra/how-to/how-to-core-remote.md'])ensureEvidence(owner,remotePaths,'自建Remote的真实生成、双侧装配、调用和逆序卸载。')
const profilePaths=['packages/bundle/base/cordis.patch.yml','packages/boot/app-boot/src/index.ts','vendor/include/src/index.ts','vendor/cordis/src/reflect.ts','packages/shell/bash-sandbox/src/index.ts','packages/shell/bash-local/src/index.ts']
for(const f of manifest.files.filter(f=>f.kind==='how-to'&&(f.source.startsWith('how-to/runtime-')||f.source.startsWith('how-to/capabilities-')||f.source==='how-to/core-profile.md')))if(fs.readFileSync(source+'/'+f.source,'utf8').includes('how-to-core-profile.md#在已有-profile-中复用或替换服务')||f.source==='how-to/core-profile.md')ensureEvidence(f.output,profilePaths,'根据已有Profile组合复用、覆盖或替换服务，不重复注册。')
for(const task of coverage.taskPaths){
 if(task.id==='client-ui-settings'){task.outcome='制作自有live Config或companion设置页，以首次编辑revision安全保存，冲突保留草稿并清理页面';task.navigationLabel='制作带草稿和revision栅栏的设置页';for(const symbol of ['SettingsFormModel','SettingsFormScope','settingsNumberField']){const o=surface.objects.find(o=>o.symbol===symbol&&o.decision==='included'&&o.entry==='export:@deepseek-ai/dsh-client-ui-primitives:.');if(o&&!task.apiObjects.includes(o.id))task.apiObjects.push(o.id)}task.compositionSteps=['Host以唯一entry id提供volatile Config，或复用已服务namespace','Client whileServed取得共享scope，页面owner持有SettingsFormModel与slot','首次编辑捕获baseline revision，显式save发送原子mutate','冲突保留草稿，用户显式协调后重新编辑；卸载取消订阅并撤页面']}
 if(task.id==='use-dsh-experimental-webworker-packer')task.navigationLabel='用公开packer库生成镜像，或在完整checkout构建Worker预览'
 if(task.id==='use-dsh-experimental-webworker-runtime')task.navigationLabel='按镜像和roster启动Worker页面，并终止其生命周期'
 if(task.compositionSteps)task.compositionSteps=task.compositionSteps.map(s=>s.replace('await execution.result 判断','await execution.result() 判断'))
}
claims.sort((a,b)=>a.id.localeCompare(b.id));write(source+'/manifest.json',manifest);write(source+'/api-surface.json',surface);write(source+'/coverage.json',coverage);write(source+'/claims.json',claims)
let map='# 公开契约源码映射\n\n适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。路径相对于匹配发布 tag 的 DSH 源码副本；源码、注释与文档依次裁决。声明、实现、组合及测试用于核查事实，不代表所有部署已运行验证。\n\n| 权威文件 | 事实范围 | 目标声明、实现与组合证据 |\n| --- | --- | --- |\n'
for(const f of manifest.files.filter(f=>['api-guardrail','how-to','concept','example'].includes(f.kind))){let paths=[...new Set(claims.filter(c=>c.owner===f.output).flatMap(c=>c.evidence.map(e=>e.path)))];if(!paths.length&&f.kind==='example'){const parents=manifest.files.filter(p=>p.kind==='how-to'&&fs.readFileSync(source+'/'+p.source,'utf8').includes(path.basename(f.output)));paths=[...new Set(parents.flatMap(p=>claims.filter(c=>c.owner===p.output).flatMap(c=>c.evidence.map(e=>e.path))))];}if(!paths.length)throw Error('source-map无证据 '+f.output);map+=`| [${path.basename(f.output)}](../${f.output}) | ${f.kind==='example'?'完整文件与装载、失败和清理路径':f.role==='topic'?'对象关系与共同使用边界':f.kind==='how-to'?'任务组成、操作与完成判据':'公开对象、成员与运行条件'} | ${paths.map(p=>'`'+p+'`').join('、')} |\n`}
fs.writeFileSync(source+'/maintenance/source-map.md',map)
write(ev+'/ledger-reconciliation.json',{newAliases,newMembers,totalObjects:surface.objects.length,files:manifest.files.length,claims:claims.length})
console.log(JSON.stringify({newAliases,newMembers,files:manifest.files.length}))
