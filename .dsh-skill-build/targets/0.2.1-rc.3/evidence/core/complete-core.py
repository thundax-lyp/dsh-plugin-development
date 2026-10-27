import json,re
from pathlib import Path
P=Path('.dsh-skill-build/targets/0.2.1-rc.3');r=json.loads((P/'evidence/core/result.json').read_text());S=P/'skill-source';caps=json.loads((P/'evidence/capability-candidates.json').read_text())['candidates'];done={x for d in r['dispositions'] for x in d['candidates']};out='references/infra/how-to/how-to-core-profile.md';topic='core-dsh-app-boot-root'
sections={
'base':('提供基础插件组合','基础 bundle 为其余 app surface 提供共享服务和插件。它本身不是一个单独用户界面，也不创建自己的启动 bin；选择它之后还需要所需 mode bundle 或消费方。'),
'acp-app':('通过 ACP 使用组合','ACP surface 装配协议适配与其 app 入口；它运行在 Host，通过 profile 的依赖和 transport 暴露给外部消费方。不要把 ACP endpoint 当作浏览器 Remote。'),
'headless':('运行无界面任务','headless surface 以非交互方式驱动 Agent；执行与持久 Session 仍由共享服务负责。默认组合是否包含某个 provider 以实际 profile 层为准。'),
'sdk-app':('运行 SDK 应用组合','SDK app 是 JSON-RPC app surface，服务于独立 SDK 客户端。客户端/服务器协议与 Web ctx.remote 是不同边界，不复用两者的 wire 类型。'),
'sdk-minimal':('运行独立最小 SDK 组合','sdk-minimal 的 bundle patch 插入完整树，独立于 dsh-base；不要再因名称相似机械追加 base 导致重复服务。组合包含 JSON-RPC、单一模型适配、持久 shell 与 JSONL Session。'),
'web-app':('运行 Web 插件组合','Web surface 提供 Host 服务与 Client 装配；Host package 能安装不代表 Client 插件已进入其 bundle。需要浏览器真实装配、交互和重连验证。'),
}
text='# 选择、安装与核对 Profile bundle\n\n适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。profile 的 package.json 选择有序的 dsh.profile.bundles；bundle 的 dsh.bundle.patch 指定一个文件或有序文件列表。bundle 层之后应用 profile patch、home patch 与调用覆盖。\n\n'
comps=[c for c in caps if c['path'].startswith('packages/bundle/') and c['kind']=='composition-manifest']
for i,c in enumerate(comps):
 slug=c['path'].split('/')[2];name,body=sections.get(slug,('配置 bundle','选择所需的现成组合。'));title=name+('的预设层' if '/presets/' in c['path'] else '的主层');ids=[c['id']]
 package=next((p for p in caps if p['kind']=='public-package' and p['path']=='packages/bundle/'+slug+'/package.json'),None)
 if package and package['id'] not in done:ids.append(package['id']);done.add(package['id'])
 text+='## '+title+'\n\n'+body+'\n\n1. 在信任的开发 profile 读取依赖与有序 bundle 列表，区分 installed、enabled 和实际加载成功。已保存 enabled 不证明 bundle 可读或其条目 ACTIVE。\n2. 通过 `dsh plugin --profile <profile> add <package>` 安装自建 bundle，或在受控 profile 中选择已安装 bundle；包中应发布 patch 和编译入口。普通依赖不会自动加入 Cordis 树。\n3. 在 `cordis.patch.yml` 用 insert 创建自己的唯一 id，服务用 inject 排序；替换 config 时重述需要保留的字段。空或只有注释的 patch 会失败，不需要覆盖时用 `[]`。\n4. 启动 profile，检查 skippedBundles 和 Loader ACTIVE/FAILED/PENDING。缺少 HMR 时改配置后重启；HMR 可用时也要等待 reload 落定再判断功能。\n5. 调用自己的一个可观察行为，停用后确认注销；卸载依赖前先停止对应插件。安装成功但激活失败可以保留 dependency 和 selection，按操作返回状态重试，不把安装回滚规则当成运行时回滚。\n\n完成判据：所需 surface 启动，插件入口实际可调用，禁用后资源释放；源码路径线索 `'+c['path']+'` 只说明组合 owner，不替代该验证。基础结构见 [独立 Service bundle](../examples/example-core-service.md)。\n\n'
 r['dispositions'].append({'id':'core-profile-'+str(i),'decision':'included','candidates':ids,'topics':[topic],'owners':[out],'summary':title,'pluginTask':title+'并装载自建插件','ownerSections':{out:title}})
 r['taskPaths'].append({'id':'core-profile-'+str(i),'outcome':title+'并验证插件可调用和卸载','decision':'covered','candidates':ids,'configurationOnly':True,'apiObjects':[],'destinations':[{'output':out,'section':title}]})
(S/'how-to/core-profile.md').write_text(text);r['files'].append({'source':'how-to/core-profile.md','output':out,'kind':'how-to'})
# 各正式 API 子主题都具有自己的声明事实来源。
fmap={f['output']:f for f in r['files']}
for owner in sorted(set(o['owner'] for o in r['objects'])):
 if any(c['owner']==owner for c in r['claims']):continue
 obs=[o for o in r['objects'] if o['owner']==owner];ev=[{'category':'public-api','path':s} for s in sorted(set(o['source'] for o in obs))]
 r['claims'].append({'id':'core-contract-'+str(len(r['claims'])),'kind':'implemented-behavior','topic':fmap[owner]['topic'],'decision':'accepted','owner':owner,'summary':'本子主题公开对象和直接成员的类型契约。','evidence':ev})
(P/'evidence/core/result.json').write_text(json.dumps(r,ensure_ascii=False,indent=4)+'\n')
print({k:len(v) for k,v in r.items()})
