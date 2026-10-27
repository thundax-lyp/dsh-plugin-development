import fs from 'node:fs';import path from 'node:path';
const target=path.resolve('.dsh-skill-build/targets/0.2.1-rc.3'),ev=path.join(target,'evidence'),source=path.join(target,'skill-source');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,4)+'\n');
const fragments=['core','client','capabilities','runtime'].map(g=>({g,...read(path.join(ev,g,'result.json'))}));
const provenance=read(path.join(target,'provenance.json'));
const fileExtras=[['entrypoint/SKILL.md','SKILL.md','entrypoint'],['metadata/openai.yaml','agents/openai.yaml','metadata'],['indexes/object-index.md','references/object-index.md','index'],['maintenance/source-map.md','maintenance/source-map.md','maintenance'],['maintenance/skill-maintenance.md','maintenance/skill-maintenance.md','maintenance']].map(([source,output,kind])=>({source,output,kind}));
const files=[...fileExtras,...fragments.flatMap(r=>r.files)];
function unique(a,key,label){const seen=new Set();for(const v of a){if(seen.has(v[key]))throw Error('duplicate '+label+': '+v[key]);seen.add(v[key]);}return a;}
unique(files,'output','file');
let claims=fragments.flatMap(r=>r.claims);
// 各素材的事实仍按所属分组裁决，这里只给已审主题关系与步骤连接其相同领域证据。
for(const r of fragments){for(const f of r.files.filter(f=>['api-guardrail','how-to','concept'].includes(f.kind)&&!claims.some(c=>c.owner===f.output))){
 const topic=f.topic??(f.source.startsWith('how-to/runtime-')?'runtime-'+path.basename(f.source,'.md').slice(8):null);
 if(r.g!=='runtime') throw Error('missing owning claim '+r.g+' '+f.output);
 const sourceClaims=r.claims.filter(c=>c.topic===topic);if(!sourceClaims.length)throw Error('no evidence for '+f.output);
 const evidence=[...new Map(sourceClaims.flatMap(c=>c.evidence).map(e=>[e.category+':'+e.path,e])).values()];
 claims.push({id:'assembled-'+path.basename(f.output,'.md'),kind:f.kind==='how-to'?'derived-guidance':'implemented-behavior',topic,decision:'accepted',owner:f.output,summary:f.kind==='how-to'?'按本主题公开对象及资源所有权组合插件、装载并核查业务结果。':'本主题公开对象关系、选择条件和共同生命周期边界。',evidence});
}}
unique(claims,'id','claim');
const dispositions=fragments.flatMap(r=>r.dispositions), taskPaths=fragments.flatMap(r=>r.taskPaths), taskDiscoveries=fragments.flatMap(r=>r.taskDiscoveries);
unique(taskPaths,'id','task');
const capabilityCandidates=read(path.join(ev,'capability-candidates.json')).candidates;
const dispositionByCandidate=new Map();for(const d of dispositions)for(const c of d.candidates){if(dispositionByCandidate.has(c))throw Error('duplicate disposition '+c);dispositionByCandidate.set(c,d);}
const missing=capabilityCandidates.filter(c=>!dispositionByCandidate.has(c.id));if(missing.length)throw Error('missing capabilities '+missing.map(c=>c.id).join(', '));
unique(taskDiscoveries,'candidate','task discovery');
const tasks=read(path.join(ev,'task-candidates.json')).candidates;
const known=new Set(taskDiscoveries.map(v=>v.candidate));
for(const c of tasks.filter(c=>!known.has(c.id))){
 let reason;
 if(/开发备注|Dev Note/i.test(c.title))reason='该节记录维护备注/未决问题，不定义一个独立的当前插件操作；所属实际服务任务已单独判定。';
 else if(c.path.startsWith('.github/'))reason='GitHub issue/preview维护设施的配置，既非产品公开插件入口也非消费项目开发任务。';
 else if(c.path.startsWith('apps/desktop/'))reason='桌面应用构建、安装更新或平台签名流水线属于DSH产品维护，不是Cordis消费插件制作。';
 else if(c.path.startsWith('benchmarks/'))reason='基准语料/续写性能设施，不是目标运行时的公开插件操作。';
 else if(c.path.startsWith('docs/persistence-changes/')||c.path.includes('adding-a-session-format-version')||c.path.includes('reviewing-persistence-type-changes'))reason='历史格式或产品迁移维护，插件写当前Session/Domain契约，不修改产品格式历史。';
 else if(c.path.startsWith('docs/upgrade-guide/'))reason='旧版本迁移指南只提供历史定位，不能作为本版本插件当前操作的事实输入。';
 else if(c.path.startsWith('packages/test-support/'))reason='上游测试fixture或快照编写设施，不是发布消费插件的运行入口；代表验证另用隔离消费项目。';
 else if(c.path.startsWith('python/'))reason='Python runtime wheel构建和分发维护，不是Cordis插件包制作任务。';
 else if(c.path.includes('adding-a-vendored-package'))reason='增加上游vendor并重生成根配置属于DSH仓库维护，不是消费插件安装依赖的操作。';
 else if(c.path.includes('maintaining-dsh-code-review'))reason='DSH代码审查维护工作流，不是产品插件公开API。';
 else if(c.path==='docs/development.zh.md'||c.path==='docs/testing.zh.md'||c.path==='README.zh.md')reason='上游贡献/开发环境与测试运行总览，不作为插件作者必须执行的产品维护步骤。';
 else if(c.path==='packages/util/launch-environment/README.zh.md')reason='冻结launcher启动环境快照的实现解释，不提供插件改变全局环境的公开操作。';
 else if(c.path==='docs/session-format-status.zh.md')reason='持久格式版本状态的维护说明，当前插件使用Session公开类型而不维护版本历史。';
 else if(c.path.startsWith('docs/user/guide/'))reason='用户配置和使用内置产品功能的路径；本Skill只承接插件实现或其公开能力选择，不复制完整用户手册。';
 else if(c.path==='docs/config-catalog.zh.md')reason='生成配置目录是配置字段定位源；各插件任务按所属Config对象消费，不把整个目录变成独立插件任务。';
 else reason=null;
 // 未能具体裁决的标题由主维护者继续核查，不能静默排除。
 if(!reason) throw Error('unadjudicated task '+c.id+' '+c.title);
 taskDiscoveries.push({candidate:c.id,decision:'excluded',reason:`${c.path} 的「${c.title}」：${reason}`});
}
// 仅已真实运行的高价值任务进入首屏。
for(const task of taskPaths){delete task.entry;delete task.userIntents;}
const selected=[['register-service',['制作一个能被其他插件调用的Service并装载到Profile']],['client-ui-primitives',['DSH Web UI 提供对话框吗','查找并复用现成Web UI控件']]];
for(const [id,intents]of selected){const task=taskPaths.find(t=>t.id===id);if(!task)throw Error('missing selected '+id);const d=task.destinations[0];task.entry={...d,anchor:slug(d.section)};task.userIntents=intents;}
const entries=fragments.flatMap(r=>r.entries),objects=fragments.flatMap(r=>r.objects);unique(entries,'candidate','entry');unique(objects,'id','object');
const allEntries=read(path.join(ev,'api-entry-candidates.json')).candidates;
if(allEntries.length!==entries.length)throw Error('entry coverage '+entries.length+'/'+allEntries.length);
const identity=Object.fromEntries(['version','tag','commit','remote'].map(k=>[k,provenance[k]]));
const manifest={schemaVersion:3,taskNavigation:'entrypoint',...identity,status:'draft',topics:[...new Set(fragments.flatMap(r=>r.topics))].sort(),files:files.sort((a,b)=>a.output.localeCompare(b.output))};
write(path.join(source,'manifest.json'),manifest);write(path.join(source,'claims.json'),claims.sort((a,b)=>a.id.localeCompare(b.id)));write(path.join(source,'coverage.json'),{schemaVersion:3,dispositions,taskPaths,taskDiscoveries});write(path.join(source,'api-surface.json'),{schemaVersion:1,...identity,entries:entries.sort((a,b)=>a.candidate<b.candidate?-1:1),objects:objects.sort((a,b)=>a.id<b.id?-1:1).map(o=>({...o,members:o.members.sort((a,b)=>a.name<b.name?-1:1)}))});
let map='# 公开契约源码映射\n\n适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。下列路径相对于匹配发布 tag 的 DSH 源码副本。代码、注释与文档依次裁决，测试路径用于核查具体断言，不代表该行为已在所有部署验证。\n\n| 权威文件 | 事实范围 | 目标声明、实现与组合证据 |\n| --- | --- | --- |\n';
for(const f of files.filter(f=>['api-guardrail','how-to','concept','example'].includes(f.kind))){const owned=claims.filter(c=>c.owner===f.output),ps=[...new Set(owned.flatMap(c=>c.evidence.map(e=>e.path)))];if(!ps.length&&f.kind==='example'){const parents=files.filter(v=>v.kind==='how-to'&&fs.readFileSync(path.join(source,v.source),'utf8').includes(path.basename(f.output)));ps.push(...new Set(parents.flatMap(p=>claims.filter(c=>c.owner===p.output).flatMap(c=>c.evidence.map(e=>e.path)))));}map+=`| [${path.basename(f.output)}](../${f.output}) | ${f.kind==='example'?'完整插件实现与装载验证步骤':f.role==='topic'?'对象关系与共同边界':f.kind==='how-to'?'插件任务的操作和完成判据':'公开对象与成员契约'} | ${ps.map(p=>'`'+p+'`').join('、')} |\n`;}
fs.writeFileSync(path.join(source,'maintenance/source-map.md'),map);
write(path.join(ev,'task-scenarios.json'),{schemaVersion:1,scenarios:[{taskId:'register-service',script:'core/scenarios/register-service.mjs',checks:['package-resolution','package-build','package-types','profile-load','service-call','unload'],timeoutMs:120000},{taskId:'client-ui-primitives',script:'client/run-runtime.mjs',checks:['consumer-resolution','consumer-types','consumer-build','module-import','slot-mount','modal-interaction','unload'],timeoutMs:180000}]});
console.log(JSON.stringify({files:files.length,topics:manifest.topics.length,capabilities:capabilityCandidates.length,tasks:taskPaths.length,objects:objects.filter(o=>o.decision==='included').length}));
function slug(s){return [...s.toLowerCase().replace(/<[^>]*>/g,'')].filter(c=>/[\p{L}\p{N}\p{M} _-]/u.test(c)).join('').replaceAll(' ','-');}
