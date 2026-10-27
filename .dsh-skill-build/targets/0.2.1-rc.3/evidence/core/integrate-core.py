import json,re
from pathlib import Path
P=Path('.dsh-skill-build/targets/0.2.1-rc.3');r=json.loads((P/'evidence/core/result.json').read_text());S=P/'skill-source'
for stem in ['service','tool','remote']:
 r['files'].append({'source':f'examples/core-{stem}.md','output':f'references/infra/examples/example-core-{stem}.md','kind':'example'})
for stem in ['service','tool','remote','state']:
 r['files'].append({'source':f'how-to/core-{stem}.md','output':f'references/infra/how-to/how-to-core-{stem}.md','kind':'how-to'})
def task(id,stem,title,match):
 obs=[o for o in r['objects'] if match(o)]; section=title;out=f'references/infra/how-to/how-to-core-{stem}.md'
 t={'id':id,'outcome':title,'decision':'covered','candidates':[], 'apiObjects':[o['id'] for o in obs], 'compositionSteps':['核对版本与契约','构建并装载提供方','调用并观察业务结果','取消及卸载验证'],'destinations':[{'output':out,'section':section}]}
 # 任务小节逐对象直达，避免以主题页代替权威子主题。
 file=S/f'how-to/core-{stem}.md';tx=file.read_text();needle='## '+title+'\n';links='\n相关对象：\n\n'+'\n'.join('- ['+o['symbol']+'](../api/'+Path(o['owner']).name+'#'+re.sub(r'[^\w\- ]','',o['section'].lower()).replace(' ','-')+')。' for o in obs)+'\n';tx=tx.replace(needle,needle+links);file.write_text(tx);r['taskPaths'].append(t);return t
service=task('register-service','service','注册并验证可卸载的 Service',lambda o:o['entry']=='export:@deepseek-ai/cordis:.' and o['symbol'] in ['Context','Service','Fiber','FiberState','Plugin'])
# 稍后将真实场景与首屏 entry 一起绑定。
task('observe-cordis-events','service','选择事件调度并验证监听器清理',lambda o:o['entry']=='export:@deepseek-ai/cordis:.' and o['symbol'] in ['Events','EventsService','EventOptions','DispatchMode'])
task('register-tool','tool','注册并执行一个模型工具',lambda o:o['entry']=='export:@deepseek-ai/dsh-tools:.' and o['symbol'] in ['ToolRuntime','defineTool','ToolExecutionInput','ToolExecutionResult','DefineToolOptions','ToolRunContext'])
task('publish-remote','remote','发布带取消与失败码的 Remote',lambda o:o['entry']=='export:@deepseek-ai/dsh-typert-protocol:.' and o['symbol'] in ['Remote','RemoteError','TypertRemoteService','RemoteResult'])
task('secure-stream-remote','remote','为 Remote 声明完整资源与流所有权',lambda o:o['entry']=='export:@deepseek-ai/dsh-typert-protocol:.' and o['symbol'] in ['principalOf','RemoteScopeOptions','RemoteMethodOptions','RemoteStreamHandle','RemoteInvocation','typertOwnedValue'])
task('persist-session-facts','state','用 Session 事件记录可恢复的插件事实',lambda o:o['entry']=='export:@deepseek-ai/dsh-session:.' and o['symbol'] in ['Session','SessionStore','PluginRecordMap','SessionEvent'])
task('mutate-settings','state','修改配置表单并保护脱敏字段',lambda o:o['entry']=='export:@deepseek-ai/dsh-settings:.' and o['symbol'] in ['SettingsForms','SettingsConflictError','SettingsDescriptor','SettingsPathOp'])
(P/'evidence/core/result.json').write_text(json.dumps(r,ensure_ascii=False,indent=4)+'\n');print('integrated')
