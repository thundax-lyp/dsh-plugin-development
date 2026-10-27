import json,re
from pathlib import Path
P=Path('.dsh-skill-build/targets/0.2.1-rc.3');S=P/'skill-source';r=json.loads((P/'evidence/core/result.json').read_text());caps=json.loads((P/'evidence/capability-candidates.json').read_text())['candidates'];cm={c['id']:c for c in caps};done={c for d in r['dispositions'] for c in d['candidates']}
def addtask(id,stem,section,entries,names):
 out='references/infra/how-to/how-to-core-'+stem+'.md';os=[o for o in r['objects'] if o['decision']=='included' and o['entry'] in entries and o['symbol'] in names];f=S/f'how-to/core-{stem}.md';tx=f.read_text();links='\n相关对象：\n\n'+'\n'.join('- ['+o['symbol']+'](../api/'+Path(o['owner']).name+'#'+re.sub(r'[^\w\- ]','',o['section'].lower()).replace(' ','-')+')。' for o in os)+'\n';tx=tx.replace('## '+section+'\n','## '+section+'\n'+links);f.write_text(tx)
 t={'id':id,'outcome':section,'decision':'covered','candidates':[],'apiObjects':[o['id'] for o in os],'compositionSteps':['读取公开契约','装配并注册','执行和观察','取消卸载并验证'],'destinations':[{'output':out,'section':section}]};r['taskPaths'].append(t)
addtask('add-tool-policy','tool','添加执行策略与纯展示投影',['export:@deepseek-ai/dsh-tools:.'],['ToolRuntime','ToolGuard','ToolExecution','PreToolDecision','PostToolDecision','ToolCallView','ToolResultView'])
addtask('contribute-prompt','tool','添加提示词段与动态上下文',['export:@deepseek-ai/dsh-system-prompt:.'],['SystemPrompt','PromptSection','PromptContext','PromptAssembly','Config','renderPrompt'])
addtask('submit-product-telemetry','advanced','提交选择过的产品遥测并区分入队与送达',['export:@deepseek-ai/dsh-host-product-telemetry-otel:.'],['default','ProductTelemetryRecord','ProductTelemetryScalar','Config'])
byid={t['id']:t for t in r['taskPaths']}
def merged(cid,main,tid,reason):
 if cid not in cm or cid in done:return
 task=byid[tid];dest=task['destinations'][0];dmain=next(d for d in r['dispositions'] if main in d['candidates'] and d['decision']=='included');topics=dmain['topics']
 r['dispositions'].append({'id':'core-doc-'+re.sub('[^a-z0-9]+','-',cid.lower()),'decision':'merged','candidates':[cid],'topics':topics,'owners':[dest['output']],'summary':reason,'pluginTask':task['outcome'],'ownerSections':{dest['output']:dest['section']},'mergedInto':main,'relationship':reason});task['candidates'].append(cid);done.add(cid)
for cid,main,tid,why in [
('cookbook:adding-a-package','package:@deepseek-ai/cordis','register-service','包创建清单转为独立包的完整文件、bundle插入、装载和生命周期任务；上游workspace贡献检查不强加给外部消费包。'),
('cookbook:adding-a-remote-api','package:@deepseek-ai/dsh-typert-protocol','publish-remote','五步Remote流程由协议、生成导出、两侧装配与取消/失败任务承接。'),
('cookbook:adding-a-tool','package:@deepseek-ai/dsh-tools','register-tool','工具作者契约由规范值、参数/输出schema、注册执行与卸载任务承接，策略与展示另有独占任务。'),
('cookbook:extension-cookbook','package:@deepseek-ai/dsh-tools','add-tool-policy','该文声明省略导入与helper的形态片段只作入口线索；真实hook任务展开选择、拒绝不变量、纯展示和验证。'),
('subsystems:boot','package:@deepseek-ai/dsh-app-boot','register-service','启动子系统提供profile/bundle与Loader证据，插件任务只展开装载和所有权，不复制launcher全部内部状态。'),
('subsystems:core','package:@deepseek-ai/dsh-agent','persist-session-facts','Agent/Session/scope协作由未发布setup、durable事件和释放任务解释。'),
('subsystems:extensions','package:@deepseek-ai/dsh-cordis-host-runner','run-dynamic-cordis','动态runner公开生命周期、审批、session隔离与重连边界纳入真实运行任务。'),
('subsystems:scope','package:@deepseek-ai/dsh-scope','persist-session-facts','scope层用于Agent特有注册与监听器过滤，持有/释放随Session事实任务展开。'),
('subsystems:session','package:@deepseek-ai/dsh-session','persist-session-facts','Session追加、发布、flush和恢复边界由耐久事实任务承接。'),
('subsystems:settings','package:@deepseek-ai/dsh-settings','mutate-settings','Config投影、revision和脱敏字段修改由配置任务承接。'),
('subsystems:system-prompt','package:@deepseek-ai/dsh-system-prompt','contribute-prompt','提示词段、变量、上下文、完整组装及作用域由贡献提示词任务承接。'),
('subsystems:tools','package:@deepseek-ai/dsh-tools','register-tool','工具注册与规范结果任务和附属策略/展示任务承接该子系统公开能力。'),
('subsystems:typert','package:@deepseek-ai/dsh-typert-protocol','publish-remote','只展开插件Remote声明、严格生成和跨侧装配所需机制，编译器IR不写成插件API。'),
('subsystems:web-server','package:@deepseek-ai/dsh-host-webserver','use-host-capability','WebServer/目录等Host集成按公开provider能力装配与失败边界说明。'),
('subsystems:product-telemetry','package:@deepseek-ai/dsh-host-product-telemetry-otel','submit-product-telemetry','产品遥测记录、同步入队与shutdown边界作为可复用Host提交能力，明确入队不等于送达。'),
]:merged(cid,main,tid,why)
# CLI安装与启用是实在的作者操作，但不展开launcher实现helpers。
cid='package:@deepseek-ai/dsh'
if cid not in done:
 t=byid['register-service'];owner=t['destinations'][0]['output'];r['dispositions'].append({'id':'core-dsh-cli','decision':'included','candidates':[cid],'topics':['core-dsh-app-boot-root'],'owners':[owner],'summary':'dsh plugin安装bundle及profile启动的作者入口。','pluginTask':t['outcome'],'ownerSections':{owner:t['destinations'][0]['section']}});t['candidates'].append(cid)
ex={
'cookbook:adding-a-vendored-package':'此文规定给DSH本仓库引入上游vendor源的复制、重定scope与根构建登记；外部插件应消费已发布Cordis包，不把修改DSH vendor目录当成插件安装方法。',
'cookbook:maintaining-dsh-code-review':'此文维护DSH仓库代码审核Skill和治理资产，不是插件运行或公开API使用任务。',
'cookbook:responding-to-pr-review-on-a-stack':'此文规定维护DSH堆叠PR的Git审查与回复流程，与离线插件制作无运行时契约关系。',
'composition:packages/preset/agent-preset/skills/cordis-plugin-development/templates/decoration/cordis.patch.yml':'这是@local/my-decoration占位模块的生成模板；目标tag没有该已发布包或可执行实现，不把模板名当默认组件。实际bundle插入格式由Service包任务提供。',
'composition:packages/preset/agent-preset/skills/cordis-plugin-development/templates/mcp/cordis.patch.yml':'这是指向localhost:3000/mcp的demo配置骨架，未附可启动的对应MCP server；不能作为默认已连接组件。真实MCP公开能力由MCP包契约与连接任务裁决。'}
for cid,why in ex.items():
 if cid in cm and cid not in done:r['dispositions'].append({'id':'core-excluded-'+re.sub('[^a-z0-9]+','-',cid.lower()),'decision':'excluded','candidates':[cid],'reason':why});done.add(cid)
# 重新把包能力放到真实主要任务，而非被删除的逐包入口。
redirect={'package:@deepseek-ai/dsh-system-prompt':'contribute-prompt','package:@deepseek-ai/dsh-host-product-telemetry-otel':'submit-product-telemetry'}
for cid,tid in redirect.items():
 for t in r['taskPaths']:t['candidates']=[c for c in t.get('candidates',[]) if c!=cid]
 byid[tid]['candidates'].append(cid)
# 新增文档事实各自有目标源码支持。
for tid,topic,paths in [
('add-tool-policy','core-dsh-tools-root',['packages/core/tools/src/index.ts','packages/core/tools/src/schema.ts','packages/core/tools/src/presentation.ts']),
('contribute-prompt','core-dsh-system-prompt-root',['packages/core/system-prompt/src/index.ts']),
('submit-product-telemetry','core-dsh-host-product-telemetry-otel-root',['packages/host/product-telemetry-otel/src/index.ts'])]:
 t=byid[tid];r['claims'].append({'id':'core-'+tid,'kind':'implemented-behavior','topic':topic,'decision':'accepted','owner':t['destinations'][0]['output'],'summary':t['outcome'],'evidence':[{'category':'runtime','path':p} for p in paths]})
(P/'evidence/core/result.json').write_text(json.dumps(r,ensure_ascii=False,indent=4)+'\n');print({k:len(v) for k,v in r.items()})
