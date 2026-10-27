import fs from 'node:fs';
import path from 'node:path';
import ts from '../../../../../node_modules/typescript/lib/typescript.js';
const target=path.resolve('.dsh-skill-build/targets/0.2.1-rc.3');
const root=path.join(target,'checkout'), src=path.join(target,'skill-source'), ev=path.join(target,'evidence');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const api=read(path.join(ev,'api-entry-candidates.json')).candidates;
const symbols=read(path.join(ev,'api-symbol-candidates.json')).entries;
const caps=read(path.join(ev,'capability-candidates.json')).candidates;
const notes=read(path.join(ev,'runtime/domain-notes.json'));
const assigned=new Set('client core boot bundle preset extensions settings typert api host sdk llm context compaction subagent workflow interaction goal plan guard skill mcp ptc-runtime acp experimental'.split(' '));
const ours=e=>(e.path.startsWith('packages/')&&!assigned.has(e.path.split('/')[1]))||e.path.startsWith('native/');
const result={files:[],topics:[],entries:[],objects:[],dispositions:[],taskPaths:[],taskDiscoveries:[],claims:[]};
const written=new Set();
function doc(source,output,kind,body,meta={}) {fs.mkdirSync(path.dirname(path.join(src,source)),{recursive:true});fs.writeFileSync(path.join(src,source),body.trim()+'\n');result.files.push({source,output,kind,...meta});written.add(output);}
const slug=s=>s.toLowerCase().replace(/[^\p{L}\p{N}\p{M} _-]/gu,'').replace(/ /g,'-');
const excludedReasons={util:'通用底层辅助库不定义 DSH 插件的注册、消费或装载契约；相应系统功能由服务契约拥有，本文不另行教授该辅助库实现。','test-support':'该包面向上游测试装配/fixture，并非产品默认能力或用户插件运行依赖；验证可以使用它，但不把测试启动器作为发布插件契约。',identity:'匿名产品标识生成只供遥测消费，不是认证身份或插件授权入口；不要求插件直接制造或持久化该标识。',native:'平台原生二进制/底层锁接口由 filesystem/sandbox provider 使用，不作为用户 Cordis 插件入口或可移植 API。'};
function groupOf(p){if(p.startsWith('native/'))return 'native';const a=p.split('/')[1];return a==='document'?'attachment':a==='telemetry'?'telemetry':a==='todo'?'jobs':a;}
const special={
 FileSystem:'由后端 subclass 提供 ctx.fs，消费者在 inject:[\'fs\'] 中调用。resolve/contains 的 target 必须来自同一 provider；不能手写 key。watch 完成后由调用方关闭 watcher，其他 IO 按 signal 取消。',
 FsObservation:'这是判别联合：present 必须带 readonly version: FsVersion，absent 不携带 version。负观察只允许 guarded create，不能编辑不存在的文件。',
 FsWriteIntent:'这是判别联合：{kind:\'createIfAbsent\'} 或 {kind:\'replaceIfVersion\',version:FsVersion}。省略整个参数表示无条件覆盖，而不是第三个分支。',
 FsEditRequest:'oldString 必须非空，newString 可空以删除；replaceAll=true 替换全部，否则必须唯一匹配。文本按后端规范化行尾后匹配。',
 FsWriteOutcome:'operation 区分 create/update，before 为规范化文本或 null；null 还可能表示无法提供上下文 diff 基础，不只表示新建。after 是写后文本，version 是不透明新版本。',
 FsTarget:'targetKey 只用于身份比较，不可解析；displayPath 只用于模型/UI 展示，不能假定可在 Host 打开。',
 FsVersion:'后端生产的不透明版本，消费者从 stat 或写入结果取得；品牌构造函数不执行验证，不可用自造版本绕过新鲜度检查。',
 FsTargetKey:'后端生产的不透明目标身份；消费者从 resolve 取得。品牌构造函数不校验字符串。',
 Storage:'ctx.storage 是注册中心；form/mount 不执行记录写入。backend.register 与 mount 的 disposer 只移除注册，backend owner 负责 close。storage.domain 由 storage-domain 的声明合并提供。',
 DomainFacility:'ctx.storageDomain.open 逐步预留名称、选择 route/backend、检查 kv、打开 unit、读取并校验全部数据；任一步失败关闭已打开 unit 并释放名称。get 用于诊断，typed consumer 保留 open 返回 handle。',
 Domain:'open 返回的 typed handle。调用者拥有 close；close 排空写队列后关闭 unit，完成后才释放 domain 名称。关闭后的读写报 closed。',
 DomainSpec:'name/table 名称匹配 UNIT_NAME_RE；version 是非负整数。global schema 不可接受 null。layout 默认 single；per-record 可声明更旧 compatibleVersions；backup-and-skip 仅当 backend 有 backupRecord 时将坏表记录备份并略过，global 校验失败仍拒绝。',
 KvTable:'get/entries 等同步读取校验过的内存值，put/delete/update 走同一 domain 写队列。update 在队列槽内执行 transform，缺失 key 报 missing-key；不得原地修改返回记录。',
 DomainGlobal:'get 读取内存 singleton，set 等耐久写入完成才发布内存变化；initial 在尚无持久值时使用但不会自动写入。',
 DomainChanged:'只在本进程持久提交后发通知；它不是跨实例 CDC、事务回滚点或权限证明。',
 JobSpec:'kind 由 JobKindMap 声明扩展，label 是单行说明；owner 可省略，省略会得到任何 caller 可见的无主任务。run 同步返回 JobHooks，启动抛错前必须自清理部分资源。',
 JobHooks:'cancel 同步、幂等且最终驱动 done 结算；done 应在资源释放后 resolve JobOutcome，不能拒绝。违反约定时 registry 只能记录失败，不证明资源已释放。',
 JobRegistry:'默认导出为契约 Service，执行由 jobs-local 提供。start/get/list/read/readAt/wait/kill/remove 的 caller 是 SessionId，owner 存在时进行归属检查；订阅通过 events.subscribe。',
 JobEvent:'按 type 判别：registered/progress/stopping/removed 携 job；settled 再携 cause 和 awaited；output 携 id、可选 owner、total，不推送内容。UI 自己维护 readAt 游标。',
 JobEventFilter:'{owner:SessionId} 包括指定 owner 和无主任务；{owners:\'scope\'} 限当前组合 owners；{owners:\'all\'} 是全部。不可把 all 用作面向任意用户的默认过滤。',
 JobOutcome:'status 为 completed/killed/failed；detail 是原因，result 是值型结果，只在结算后的首次模型 read 交付。原始流另走输出环。',
 JobOutputRead:'next 是累计 UTF-8 字节 offset，chunks 保持完整块边界；lossy=true 表示早期输出已丢失。它不消费模型游标。',
 SessionPersistence:'append-only 后端。create 返回 write handle；open(read) 不抢写权，open(write) 原子竞争唯一 writer。append 是 best-effort；flush 才是耐久屏障，并强制物化延迟创建的会话。',
 SessionPersistenceRevision:'只在同一服务实例和 SessionId 中比较的不透明变化 token；与 writer ownership churn、resume、open 权限无关。',
 SessionHandle:'调用者拥有 close 以释放 writer。flush 保证耐久，read 可指定 prefix/range；read-only handle 不得 append。取消只按对应方法 options 执行，写入结果不明时先读取核对序号。',
 WebRuntime:'Host Service，Config 提供 volatile searchProvider/fetchProvider。每次调用选择后端，不用注册顺序；provider 自己实现真实 IO 与 signal。',
 WebFetchBody:'封闭判别联合：html 或 text；调用方必须处理全部分支。响应状态是 fetch result 的一部分，非 2xx 不必抛出。',
 WebSearchProvider:'id 唯一，available 为便宜的本地能力检查，不做网络请求；search 执行真实请求并透传 signal。',
 WebFetchProvider:'id 在 fetch registry 唯一，available 只做本地检查，fetch 返回描述性 HTTP 结果并透传 signal。',
 Lsp:'Host ctx.lsp 服务，按 filePath 最后扩展选择 provider；注册时一次性检查 id 和全部 extensionToLanguage，失败不保留部分路由。',
 LspProvider:'实现 id、extensionToLanguage、query，provider 自己拥有 server 启动、同步文档与通信资源；卸载先撤销注册再关闭资源。',
 SpillStore:'抽象 ctx.spillStore，只提供 saveText；后端保存全文并返回 locator/bytes/retrievalHint，消费者决定预览与降级。',
 SpillSource:'kind=tool 带 toolName/callId/label，kind=session-reference 带源 sessionId/label；它不是读取权限凭证。',
 AttachmentStore:'ctx.attachments 后端，先验证并保存 binary 再追加 Session event；默认不支持的文件和图像派生操作显式拒绝。批量验证失败不开始写，存储失败可能留下不可达内容对象。',
 AuthorizationSession:'单次 attempt 提供 method/signal/commit/notify/prompt。commit 驱动 credentials 持久写入并协调取消，notify 不阻塞流程；prompt 返回文本或 option id。',
 AuthorizationFlow:'以 CredentialKey 注册协议，methods 为非空 tuple；run 必须完成该 key 的实际写入，服务核对运行中曾提交且结束时仍存在才返回成功。',
 CredentialRecord:'按 type 判别 api-key/grant，secret 只在服务内部及授权消费者使用；配置和 UI 使用引用或 info 投影，不能把 secret 写入模型日志。',
 SubprocessRuntime:'ctx.subprocess 定义执行世界原语，调用者提供完整 spawn spec；handle 发布后取消要等待 waitForExit/终止结算，不能仅发 signal 就释放资源。',
 ShellExecutor:'ctx.shell 的抽象 provider；先 resolve 再 execute。普通非零退出/超时/abort 是描述性 result，基础设施失败才 reject；done 不 reject。',
 TerminalSessionService:'ctx.terminals 精确绑定 Agent 对象且会话名在 owner 内唯一；未发布 spawn 也计为 owner activity。send 同步抢占单次活动发送，清理失败保留 tracked activity 并报告。'
};
const serviceGroups=new Map();
for(const e of api.filter(ours)){
 const g=groupOf(e.path), se=symbols.find(s=>s.entry===e.id), pkg=e.package.replace('@deepseek-ai/','');
 const reject=((g==='util'&&['dsh-http-proxy','dsh-output-retention','dsh-timeout','dsh-home-paths'].includes(pkg))?null:excludedReasons[g]) || (/session-format-v\d-to-v\d/.test(pkg)?'该包是持久格式历史迁移器，由 persistence 读路径驱动，不是新插件创建当前事件的入口；当前事件类型和 writer 契约另有权威页。':null);
 if(reject){result.entries.push({candidate:e.id,decision:'excluded',reason:`${e.package}${e.subpath}：${reject}`});continue;}
 if(!notes[g]) {result.entries.push({candidate:e.id,decision:'excluded',reason:`${e.package}${e.subpath} 是 ${g} 家族内部的配套实现，当前任务使用该家族公开 service 而不直接挂载其底层接口。`});continue;}
 if(!se || se.status!=='resolved'||!se.symbols.length){result.entries.push({candidate:e.id,decision:'excluded',reason:`${e.package}${e.subpath} 指向构建期生成的声明或执行器产物，源码候选无可直接逐成员解释的模块；生成/装载边界由所属服务任务说明，不以缺失文件捏造 API。`});continue;}
 const unique=se.symbols.filter(s=>!(s.name==='default'&&se.symbols.some(v=>v.name!=='default'&&v.source===s.source&&v.signature===s.signature))&&!s.deprecated&&!(e.subpath!=='.'&&symbols.find(x=>x.entry===`export:${e.package}:.`)?.symbols.some(v=>v.name===s.name&&v.source===s.source)));
 if(!unique.length){result.entries.push({candidate:e.id,decision:'excluded',reason:`${e.package}${e.subpath} 完整重导出主入口相同对象；主入口拥有相同声明的契约，避免重复 owner。`});continue;}
 result.entries.push({candidate:e.id,decision:'included'});
 const id=`runtime-${pkg}${e.subpath==='.'?'':e.subpath.replace(/[^a-z0-9-]/g,'-')}`;
 const output=`references/infra/api/api-${id}.md`, source=`api-guardrails/${id}.md`;
 let body=`# ${e.package}${e.subpath==='.'?'':e.subpath}：${notes[g].title}\n\n适用版本：\`@deepseek-ai/dsh-agent@0.2.1-rc.3\`。本页定义 Host 插件在${notes[g].title}任务中直接使用的对象。${e.subpath==='./client'?'本子路径仅在 Client 编译面导入。':'不要把代码导出存在等同于服务已经挂载。'}\n\n装配与公共失败边界见[${notes[g].title}](api-runtime-${g}-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-${g}.md)。\n`;
 for(const s of se.symbols){
  const reason=s.deprecated?'目标源码明确标记 @deprecated，不纳入常规插件指导。':s.name==='default'&&!unique.includes(s)?`默认导出与同文件具名 ${s.signature} 是同一构造器/对象，具名声明拥有契约。`:!unique.includes(s)?`由 ${e.package} 主入口的同源 ${s.name} 拥有契约，本子路径仅是重复重导出。`:null;
  const object={id:`${e.id}:${s.name}`,entry:e.id,symbol:s.name,signature:s.signature,source:s.source??se.source,decision:reason?'excluded':'included',members:s.members.map(m=>({...m,decision:reason||m.deprecated?'excluded':'included',...(reason||m.deprecated?{reason:reason??'目标声明明确标记该成员 @deprecated；保留父对象而排除此成员。'}:{})}))};
  if(reason)object.reason=reason;
  else {
   object.owner=output;object.section=`${s.name} 契约`;
   let shape=declarationShape(path.join(root,object.source),s.name);
   if(!shape&&s.name==='default'&&/^[A-Za-z_][A-Za-z0-9_]*$/.test(s.signature))shape=declarationShape(path.join(root,object.source),s.signature);
   body+=`\n## ${object.section}\n\n从 \`${e.package}${e.subpath==='.'?'':e.subpath.slice(1)}\` 导入 \`${s.name}\`。${special[s.name]??(s.name==='Config'?`这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。`:/^(apply|inject|name)$/.test(s.name)?`这是 Cordis 模块的 ${s.name} 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。`:`\`${s.name}\` 是${notes[g].title}的公开${s.members.length?'结构/调用对象':'类型或辅助函数'}；输入输出与合法分支以下面的声明为准。`)}\n\n`;
   if(shape) body+='```text\n'+shape+'\n```\n\n';
   if(s.members.length) body+='成员检索：'+s.members.filter(x=>!x.deprecated).map(m=>'`'+m.name+'`').join('、')+'。字段类型、必填/可选和分支关系见上方声明。\n\n';
   body+=`本对象的注册/资源责任由[${notes[g].title}](api-runtime-${g}-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-${g}.md)核对成功、拒绝与卸载结果。\n`;
  }
  result.objects.push(object);
 }
 doc(source,output,'api-guardrail',body,{role:'subject',topic:`runtime-${g}`,subject:id});
 const group=serviceGroups.get(g)??[];group.push({e,se,output,source,id});serviceGroups.set(g,group);
 result.claims.push({id:`${id}-contract`,kind:'implemented-behavior',topic:`runtime-${g}`,decision:'accepted',owner:output,summary:`${e.package}${e.subpath} 的公开对象、声明成员与服务接入边界。`,evidence:[...new Set([e.path,se.source,...se.symbols.map(s=>s.source).filter(x=>x&&x.startsWith('packages/'))])].map(p=>({category:p.endsWith('package.json')?'exports':p===se.source?'runtime':'public-api',path:p}))});
}
function memberMeaning(n){return ({signal:'透传调用取消；不要把取消等待当作底层资源已经释放。',close:'调用者在资源不再使用或插件卸载时等待关闭完成。',dispose:'释放该对象拥有的注册/资源；依对应返回类型等待完成。',owner:'归属标识；按所属服务的 owner 检查使用，不等同身份认证。',id:'服务或后端生成/声明的标识；在所属注册表范围内使用。',version:'版本或新鲜度 token；按所属类型契约比较，不自行解析。',type:'联合分支判别字段；同时处理相应分支的特有字段。',kind:'能力或记录的判别字段；不能省略分支独有输入。',status:'可观察状态；只有对应终态及清理完成才表示该操作结束。',done:'最终结果 Promise；按此对象的失败与清理约定消费。',read:'读取规定范围/游标的投影；按返回值判别缺失、截断和下一位置。',get:'读取当前状态或句柄；undefined/异常的意义由该服务决定。',register:'注册返回值包含清理责任；重复项按所属注册表约定拒绝。',run:'执行回调；按声明返回值及所属服务的取消/清理责任实现。',name:'本对象范围的名称；不当作全局稳定身份。',config:'经配置 schema 校验的初始化输入；配置可变性依公开 Volatile 声明。',result:'规范结果或结果 Promise；展示不另造第二份业务事实。',error:'结构化失败信息；不能当成功结果使用。',code:'稳定错误分类，按 code 路由而不解析 message。',content:'规范内容；写入模型上下文前按所属任务持久化和渲染。',query:'执行已声明的查询；透传 signal 并处理能力不可用。',root:'部署显式配置的存储/执行根，不随意回退到当前进程目录。'}[n]??'使用上方声明中的精确类型、可选性及联合分支；该字段不具有额外的隐式默认或授权语义。');}
function declarationShape(file,name){
 if(!fs.existsSync(file))return '';
 const text=fs.readFileSync(file,'utf8'),sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);
 let found=[];
 function clean(x){return x.replace(/\/\*[\s\S]*?\*\//g,'').replace(/^\s*\/\/.*$/gm,'').trim();}
 for(const n of sf.statements){
  if(n.name?.text===name || (name==='default' && n.modifiers?.some(m=>m.kind===ts.SyntaxKind.DefaultKeyword))){
   if(ts.isClassDeclaration(n)){
    const lines=n.members.filter(m=>!m.modifiers?.some(v=>[ts.SyntaxKind.PrivateKeyword,ts.SyntaxKind.ProtectedKeyword].includes(v.kind))).map(m=>{
      if(ts.isConstructorDeclaration(m))return 'constructor('+m.parameters.map(p=>clean(p.getText(sf)).replace(/^(private|public|protected|readonly) /g,'')).join(', ')+');';
      if(ts.isMethodDeclaration(m)||ts.isGetAccessorDeclaration(m)||ts.isSetAccessorDeclaration(m)){let s=clean(m.getText(sf));return (m.body?s.slice(0,s.lastIndexOf(m.body.getText(sf))).trim():s).replace(/^override /,'')+';';}
      let s=clean(m.getText(sf));return s.length>700?s.slice(0,s.indexOf('=')>0?s.indexOf('='):s.length).trim()+';':s;
    });
    found.push('class '+name+(n.typeParameters?'<'+n.typeParameters.map(t=>t.getText(sf)).join(', ')+'>':'')+' {\n'+lines.join('\n')+'\n}');
   }else if(ts.isFunctionDeclaration(n)){let s=clean(n.getText(sf));found.push((n.body?s.slice(0,s.lastIndexOf(n.body.getText(sf))).trim():s)+';');}
   else found.push(clean(n.getText(sf)));
  }else if(ts.isVariableStatement(n)){for(const d of n.declarationList.declarations){if(d.name.getText(sf)===name)found.push('const '+clean(d.getText(sf))+';');}}
 }
 return found.join('\n\n');
}
for(const [g,items] of serviceGroups){
 const n=notes[g],topic=`runtime-${g}`;result.topics.push(topic);
 doc(`api-guardrails/runtime-${g}-overview.md`,`references/infra/api/api-runtime-${g}-overview.md`,'api-guardrail',`# ${n.title}\n\n## 对象关系\n\n${n.notes}\n\n## 选型与使用\n\n${n.failure}\n\n${items.map(i=>`- [${i.e.package}${i.e.subpath}](api-${i.id}.md)：${i.e.subpath==='.'?'模块和公开对象':'子路径对象'}。`).join('\n')}\n\n[操作步骤](../how-to/how-to-runtime-${g}.md)说明配置、调用和清理顺序。`,{role:'topic',topic});
 const familyCaps=caps.filter(c=>ours(c)&&groupOf(c.path)===g);
 // 每个包拥有独立装配小节，操作性文档按其服务主题归并。
 let body=`# ${n.title}：操作与验证\n\n目标为 \`@deepseek-ai/dsh-agent@0.2.1-rc.3\`，消费项目版本不符时先停止套用。\n`;
 for(const cap of familyCaps){
  const base=path.dirname(cap.path);let item=items.find(i=>path.dirname(i.e.path)===base&&i.e.subpath==='.')??items[0];
  const h=`配置与验证 ${cap.id.replace(/^package:/,'')}`;
  const taskId=`runtime-task-${cap.id.replace(/[^\w-]/g,'-')}`;
  const objects=result.objects.filter(o=>o.decision==='included'&&o.entry===item.e.id);
  const pkg=cap.package??(cap.id.startsWith('package:')?cap.id.slice(8):item.e.package);
  body+=`\n## ${h}\n\n### 目标与前置\n\n${n.notes}\n\n依赖公开契约：[${item.e.package}](../api/api-${item.id}.md)。本任务使用的模块必须在消费项目依赖中解析到目标版本；${n.service?'所需服务是 `ctx.'+n.service+'`。':'本模块按实际 UI/命令消费路径组合，不自动新增服务。'}\n\n### 操作顺序\n\n1. 在独立包中固定需要的依赖为 \`0.2.1-rc.3\`；若只配置现成后端，不必建立新的代码包。按[公开对象](../api/api-${item.id}.md)的 Config/schema 填写必填字段，不把配置默认值从包名推断出来。\n2. 将所需模块加入 Profile 的 Cordis 组合，${n.setup.map(p=>'`'+p+'`').join('、')} 是本主题的基础组合线索。抽象 Service 定义不等于后端，按所选 provider 配齐 inject 所需服务；单个包不会自动带来本主题全部能力。\n3. 自定义包通过 \`dsh.bundle.patch\` 指向自己的 patch，将目标模块作为 insert 行加入组合，再运行 \`dsh plugin --profile <profile> add <本地包目录>\`。没有 HMR 的部署在完成安装后重启该 Profile；查看插件 fiber 是否 active，依赖未满足时先修复 inject，不重复执行 apply。\n4. 消费 ${n.service?'`ctx.'+n.service+'`':'该模块公开调用入口'} 时保留规范返回结果与结构化错误；异步调用按签名透传 signal。结果需供模型以后引用时，通过工具所属 Session 事件写入后再渲染，不把进程内变量当耐久事实。\n5. 撤销插件时解除本包注册，停止其创建的操作并等待关闭；现成 backend 由它自己的 Cordis scope 释放，不能销毁其他插件共享的 service。\n\n### 失败、观察与完成判据\n\n${n.failure}\n\n分别检查：配置/依赖正确时操作返回声明结果；非法输入或缺少后端时返回对应结构化错误；取消后不会留下本包持有的活动资源；卸载后注册不可再被选择。涉及持久记录时关闭后重新打开并核对记录；涉及 process-local 状态时不承诺重启恢复。声明编译与实际 Profile 装载是两个不同检查。\n`;
  const output=`references/infra/how-to/how-to-runtime-${g}.md`;
  result.taskPaths.push({id:taskId,outcome:`${pkg} 在指定 Profile 中按${n.title}契约可配置并完成一次操作与清理`,decision:'covered',candidates:[cap.id],apiObjects:objects.map(o=>o.id),compositionSteps:['配置并装载本主题依赖与具体后端','由消费插件调用公开对象并观察规范返回','撤销本包注册并等待操作资源清理'],destinations:[{output,section:h}]});
  result.dispositions.push({id:`runtime-cap-${cap.id.replace(/[^\w-]/g,'-')}`,decision:'included',candidates:[cap.id],topics:[topic],owners:[item.output],summary:`${pkg} 的${n.title}插件入口。`,pluginTask:`配置并验证 ${pkg} 的${n.title}能力`,ownerSections:{[item.output]:objects[0].section}});
 }
 doc(`how-to/runtime-${g}.md`,`references/infra/how-to/how-to-runtime-${g}.md`,'how-to',body);
}
const dealt=new Set(result.dispositions.flatMap(d=>d.candidates));
for(const c of caps.filter(ours)){if(dealt.has(c.id))continue;const g=groupOf(c.path);result.dispositions.push({id:`runtime-exclude-${c.id.replace(/[^\w-]/g,'-')}`,decision:'excluded',candidates:[c.id],reason:`${c.path}：${excludedReasons[g]??(/session-format-v\d-to-v\d/.test(c.path)?'历史持久格式迁移实现由 persistence 驱动；新插件使用当前 Session writer 与事件契约，不直接调用旧格式转换。':'该产物用于当前服务的底层实现/构建，不提供独立插件装载任务；在所属 service 对象和配置路径核查其影响。')}`});}
fs.writeFileSync(path.join(ev,'runtime/result.json'),JSON.stringify(result,null,4)+'\n');
console.log(JSON.stringify({entries:result.entries.length,objects:result.objects.length,files:result.files.length,topics:result.topics}));
