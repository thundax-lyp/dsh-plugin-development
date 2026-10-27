import json,re
from pathlib import Path
P=Path('.dsh-skill-build/targets/0.2.1-rc.3');r=json.loads((P/'evidence/core/result.json').read_text());S=P/'skill-source'
r['files'].append({'source':'how-to/core-advanced.md','output':'references/infra/how-to/how-to-core-advanced.md','kind':'how-to'})
def addtask(id,title,entries,symbols=None):
 obs=[o for o in r['objects'] if o['decision']=='included' and any(o['entry'].startswith(e) for e in entries) and (symbols is None or o['symbol'] in symbols)]
 out='references/infra/how-to/how-to-core-advanced.md';f=S/'how-to/core-advanced.md';txt=f.read_text();needle='## '+title+'\n';links='\n相关公开对象：\n\n'+'\n'.join('- ['+o['symbol']+'](../api/'+Path(o['owner']).name+'#'+re.sub(r'[^\w\- ]','',o['section'].lower()).replace(' ','-')+')。' for o in obs)+'\n';txt=txt.replace(needle,needle+links);f.write_text(txt)
 t={'id':id,'outcome':title,'decision':'covered','candidates':[],'apiObjects':[o['id'] for o in obs],'compositionSteps':['选择运行侧与契约','装配提供方','执行并核对结果','取消或卸载并核查清理'],'destinations':[{'output':out,'section':title}]};r['taskPaths'].append(t)
addtask('consume-remote','在 Client 消费已有 Remote 并处理失败',['export:@deepseek-ai/dsh-api-gateway:./client','export:@deepseek-ai/dsh-api-remotes:./client'],['ClientRemote','RemoteHostFacts','isRemoteFailure'])
addtask('use-sdk','使用 SDK 驱动独立 Harness 并回收子进程',['export:@deepseek-ai/dsh-sdk-client:.'],['DeepSeekHarness','HarnessClient','HarnessSession','HarnessClientOptions','RunResult'])
addtask('declare-agent-preset','声明 Agent preset 并保留运行代际',['export:@deepseek-ai/dsh-agent-preset-registry:.','export:@deepseek-ai/dsh-agent-preset:.'],['AgentPresetRegistry','AgentPresetDefinition','Config','default'])
addtask('run-dynamic-cordis','运行并停止会话隔离的动态 Cordis 包',['export:@deepseek-ai/dsh-cordis-host-runner:.','export:@deepseek-ai/dsh-cordis-client-runner:./client'],['DynamicCordisRunnerService','DefineInput','RunInput','DynamicCordisClientRunner','apply','Config'])
addtask('use-host-capability','选用 Host 目录与 Web 集成能力',['export:@deepseek-ai/dsh-host-directory-picker:.','export:@deepseek-ai/dsh-host-webserver:.'],['DirectoryPicker','DirectoryPickerCapability','DirectoryPickerNativeCapability','DirectoryPickerBrowseCapability','WebServer','WebRoute'])
base={t['id']:t for t in r['taskPaths'] if not t['id'].startswith('core-') or t['id'].startswith('core-profile-')}
def choose(entry):
 if 'dsh-sdk-' in entry:return 'use-sdk'
 if 'dsh-api-' in entry:return 'consume-remote'
 if 'dsh-typert-' in entry:return 'publish-remote'
 if any(s in entry for s in ['cordis-host-runner','cordis-client-runner','ui-cordis','tool-cordis']):return 'run-dynamic-cordis'
 if any(s in entry for s in ['agent-preset','dsh-persona']):return 'declare-agent-preset'
 if 'dsh-settings' in entry or 'config-editor' in entry:return 'mutate-settings'
 if 'dsh-host-' in entry:return 'use-host-capability'
 if any(s in entry for s in ['dsh-agent','dsh-session','dsh-scope']):return 'persist-session-facts'
 if any(s in entry for s in ['dsh-tools','system-prompt','agent-tool-presentation']):return 'register-tool'
 return 'register-service'
old={}
for t in r['taskPaths']:
 if t['id'] in base:continue
 # 旧逐包任务仅作归属线索，不能作为独立业务任务。
 os=[o for o in r['objects'] if o['id'] in t['apiObjects']];entry=os[0]['entry'] if os else ''
 target=base[choose(entry)];old[t['id']]=target
 for c in t.get('candidates',[]):
  if c not in target['candidates']:target['candidates'].append(c)
r['taskPaths']=list(base.values())
for f in r['files']:
 if f['kind']=='how-to' and f['source'].startswith('how-to/core-') and f['source'] not in ['how-to/core-'+x+'.md' for x in ['advanced','service','tool','remote','state','profile']]:continue
 file=S/f['source'];txt=file.read_text()
 for oldid,t in old.items():
  dest=t['destinations'][0];anchor=re.sub(r'[^\w\- ]','',dest['section'].lower()).replace(' ','-');txt=txt.replace('how-to-'+oldid+'.md','how-to-'+Path(dest['output']).stem.removeprefix('how-to-')+'.md#'+anchor)
 file.write_text(txt)
r['files']=[f for f in r['files'] if not(f['kind']=='how-to' and f['source'].startswith('how-to/core-') and f['source'] not in ['how-to/core-'+x+'.md' for x in ['advanced','service','tool','remote','state','profile']])]
# 删除没有纳入对象的空主题和 overview。
active={f['topic'] for f in r['files'] if f.get('role')=='subject'};r['topics']=[x for x in r['topics'] if x in active];r['files']=[f for f in r['files'] if f.get('role')!='topic' or f['topic'] in active]
# 首屏场景只承诺真实执行的操作。
serv=base['register-service'];serv['entry']={**serv['destinations'][0],'anchor':'注册并验证可卸载的-service'};serv['userIntents']=['注册一个可卸载的 Cordis Service','创建并安装一个 DSH 插件包']
# docs/tasks 的候选按所属操作入口分配，贡献者工作流明确排除。
tc=json.loads((P/'evidence/task-candidates.json').read_text())['candidates'];prefix=('vendor/','packages/core/','packages/boot/','packages/bundle/','packages/preset/','packages/extensions/','packages/settings/','packages/typert/','packages/api/','packages/host/','packages/sdk/','apps/cli/');docnames=('docs/cordis-','docs/subsystems/core','docs/subsystems/boot','docs/subsystems/scope','docs/subsystems/settings','docs/subsystems/typert','docs/subsystems/extensions','docs/cookbook/adding-a-package','docs/cookbook/adding-a-remote-api','docs/api-gateway')
for d in tc:
 if not d['path'].startswith(prefix+docnames):continue
 title=d['title'];path=d['path']
 if any(s in title for s in ['开发备注','Dev Note','理解实现','Understand','构建基准','Benchmark']):
  r['taskDiscoveries'].append({'candidate':d['id'],'decision':'excluded','reason':f'{path} 的“{title}”说明包维护或实现调查，不提供另一条插件消费任务；公开对象与实际使用入口由本包契约和对应操作任务承接。'});continue
 key=choose(path.replace('packages/core/','dsh-'))
 if 'adding-a-remote' in path or 'api-gateway' in path:key='publish-remote'
 elif 'adding-a-package' in path or 'cordis-tutorial' in path or 'cordis-api' in path:key='register-service'
 elif 'settings' in path:key='mutate-settings'
 elif 'typert' in path:key='publish-remote'
 elif 'extensions' in path:key='run-dynamic-cordis'
 r['taskDiscoveries'].append({'candidate':d['id'],'decision':'included','taskId':key})
# 只清理由本子任务生成、已从 manifest 删除的文档；保留实核文件。
keep={f['source'] for f in r['files']}
for folder in ['api-guardrails','how-to','examples']:
 for file in (S/folder).glob('core-*.md'):
  if str(file.relative_to(S)) not in keep:file.unlink()
(P/'evidence/core/result.json').write_text(json.dumps(r,ensure_ascii=False,indent=4)+'\n');print({k:len(v) for k,v in r.items()})
