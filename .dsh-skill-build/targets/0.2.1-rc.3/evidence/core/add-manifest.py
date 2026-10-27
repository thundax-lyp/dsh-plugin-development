import json,hashlib,re
from pathlib import Path
P=Path('.dsh-skill-build/targets/0.2.1-rc.3');S=P/'skill-source';r=json.loads((P/'evidence/core/result.json').read_text());data=next(e for e in json.loads((P/'evidence/api-symbol-candidates.json').read_text())['entries'] if e['entry']=='export:@deepseek-ai/dsh-package-manifest:.')
topic='core-package-manifest';owner='references/infra/api/api-core-package-manifest.md';overview='references/infra/api/api-core-package-manifest-overview.md'
r['entries'].append({'candidate':data['entry'],'decision':'included'});r['topics'].append(topic)
notes={
'DshPackageManifest':('发布包身份与npm字段','name、version必填；description、icon、private、dependencies、peerDependencies、engines、dsh可选。这不是完整npm schema；本地profile读取可接受Partial。icon是相对manifest所在目录的SVG/PNG/JPEG/WebP，最多256KiB，realpath后仍须在该目录内。private阻止npm发布，不决定Cordis可装载性。'),
'DshManifest':('一个包可同时声明的DSH角色','manifestVersion仅能声明1，独立于npm包与Session格式版本；bundle/profile/client可并存且可选。没有字段时不自行补默认角色，内部configTrees/sessionFormatMigration/moduleFallback不属于此公共作者类型。'),
'DshBundleManifest':('发布组合层','patch必填，为一个字符串路径或有序字符串数组，相对包根。launcher按声明顺序串接为同一bundle层；文件须发布且可读，空patch写[]。普通npm依赖不会自动成为已启用bundle。'),
'DshProfileManifest':('选择有序bundle','bundles可省略，否则是已安装包名的有序数组。顺序决定组合覆盖次序；已选中不代表可读、兼容或ACTIVE，加载失败进入skippedBundles。'),
'DshClientManifest':('声明浏览器模块装配','platform必填，Web消费者选择web；inject是包名信息依赖，不是Cordis服务inject。immediately标记phase-one注册屏障，省略进入共享批次；external给出隐式baseline之外的精确模块表请求，可含/pkg/client子路径，type-only import被擦除不会产生请求。'),
'DshEnginesManifest':('声明运行时要求','dsh、node、npm及额外runtime键的值都是可选字符串。dsh写SemVer范围或精确预发布；声明库本身不解析或拒绝JSON。DSH launcher拥有的profile/bundle/entry边界会检查兼容性：engines.dsh优先，否则检查DSH peer ranges；不把此声明当成沙箱，也不覆盖任意ctx.plugin embedder的边界。'),
'LocalizedText':('提供本地化展示文字','值可为字面字符串，或以小写language id为键且必含en回退的只读映射。翻译选择由消费者执行，本类型不读locale文件、加载插件或解析语言。'),
'PluginLocalizedMeta':('读取已验证展示信息','title/description为可选LocalizedText；icon为可选base64 image data URL，作为图片显示，不能注入为内联HTML；error保存原始本地诊断，不阻止插件继续被管理。类型不负责加载文件或执行fallback。')}
text='# DSH 包元数据\n\n适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。`@deepseek-ai/dsh-package-manifest` 仅导出类型，读取方分别拥有JSON校验、默认值、文件检查与兼容性执行。\n\n'
for sy in data['symbols']:
 n=sy['name'];title,body=notes[n];oid='core-'+hashlib.sha256((data['entry']+'#'+n).encode()).hexdigest()[:16];section=n+' 包元数据契约';o={'id':oid,'entry':data['entry'],'symbol':n,'signature':sy['signature'],'source':sy['source'],'decision':'included','owner':owner,'section':section,'members':[{'name':m['name'],'signature':m['signature'],'decision':'included'} for m in sy['members']]};r['objects'].append(o)
 text+='## '+section+'\n\n'+title+'。'+body+'\n\n公开类型：`'+sy['signature']+'`。\n\n'
 if sy['members']:
  text+='| 字段 | 类型 |\n| --- | --- |\n'+'\n'.join('| `'+m['name']+'` | `'+m['signature'].replace('|','\\|')+'` |' for m in sy['members'])+'\n\n'
 text+='操作路径见 [独立包与生命周期](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。\n\n'
(S/'api-guardrails/core-package-manifest.md').write_text(text);(S/'api-guardrails/core-package-manifest-overview.md').write_text('# 包声明与读取方\n\n## 对象关系\n\nDshPackageManifest包含DshManifest与DshEnginesManifest；dsh下再声明bundle、profile、client。展示类型与执行型声明独立，均无运行时导出。详见 [各字段契约](api-core-package-manifest.md)。\n\n## 选型与使用\n\n构建代码只检查自身对象时用devDependency；发布的.d.ts引用这些类型时列生产依赖。类型正确不能代替JSON文件检查、包导出检查、profile真实装载与Client构建。见 [完整独立Service包](../examples/example-core-service.md)。\n')
r['files'] += [{'source':'api-guardrails/core-package-manifest.md','output':owner,'kind':'api-guardrail','role':'subject','topic':topic,'subject':'metadata'},{'source':'api-guardrails/core-package-manifest-overview.md','output':overview,'kind':'api-guardrail','role':'topic','topic':topic}]
obs=[o for o in r['objects'] if o['entry']==data['entry']];t=next(t for t in r['taskPaths'] if t['id']=='register-service');t['apiObjects'] += [o['id'] for o in obs];t['candidates'].append('package:@deepseek-ai/dsh-package-manifest');f=S/'how-to/core-service.md';tx=f.read_text();links='\n包元数据对象：\n\n'+'\n'.join('- ['+o['symbol']+'](../api/api-core-package-manifest.md#'+re.sub(r'[^\w\- ]','',o['section'].lower()).replace(' ','-')+')。' for o in obs)+'\n';tx=tx.replace('## 注册并验证可卸载的 Service\n','## 注册并验证可卸载的 Service\n'+links);f.write_text(tx)
r['dispositions'].append({'id':'core-package-manifest','decision':'included','candidates':['package:@deepseek-ai/dsh-package-manifest'],'topics':[topic],'owners':[owner],'summary':'公开package.json作者字段、兼容范围与插件展示类型。','pluginTask':'编写可发布可装载的插件包元数据','ownerSections':{owner:'DshPackageManifest 包元数据契约'}})
r['claims'].append({'id':'core-package-manifest-contract','kind':'implemented-behavior','topic':topic,'decision':'accepted','owner':owner,'summary':'元数据类型本身无运行时校验；launcher的profile/entry边界拥有兼容检查。','evidence':[{'category':'public-api','path':'packages/util/package-manifest/src/types.ts'},{'category':'exports','path':'packages/util/package-manifest/package.json'},{'category':'runtime','path':'packages/boot/app-boot/src/compatibility-preflight.ts'},{'category':'runtime','path':'packages/boot/app-boot/src/profile.ts'}]})
(P/'evidence/core/result.json').write_text(json.dumps(r,ensure_ascii=False,indent=4)+'\n')
(P/'evidence/core/observations.json').write_text(json.dumps({'conflicts':[{'source':'packages/util/package-manifest/README.zh.md','claim':'读取方不强制 engines.dsh','ruling':'声明类型本身不强制；profile.ts与compatibility-preflight.ts实际对launcher拥有边界执行兼容性检查，代码优先。'}]},ensure_ascii=False,indent=4)+'\n')
