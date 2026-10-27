import json,re
from pathlib import Path
T=Path('.dsh-skill-build/targets/0.2.1-rc.3');S=T/'skill-source';E=T/'evidence/client';r=json.loads((E/'result.json').read_text());ts=json.loads((T/'evidence/task-candidates.json').read_text())['candidates'];cs=json.loads((T/'evidence/capability-candidates.json').read_text())['candidates'];by={t['id']:t for t in ts}
for d in r['taskDiscoveries']:
 t=by[d['candidate']]
 if t['title'] in ['开发备注','Dev Note','开发者备注']:
  d.clear();d.update(candidate=t['id'],decision='excluded',reason=f"{t['path']} 的此标题是包维护者工作备注，不定义可执行的插件作者任务；实际公开使用路径由对应包的使用契约裁决。")
# 只有 Loader 安装钩子的包没有可纳入 API 对象：保留装载说明，按概念页而非虚造 API 子主题。
for f in r['files']:
 if f.get('role')=='topic' and not any(x.get('role')=='subject' and x.get('topic')==f['topic'] for x in r['files']):
  f['kind']='concept';f.pop('role',None)
for t in r['taskPaths']:
 if not t['compositionSteps']:t.pop('compositionSteps')
# 额外调查的 docs 任务归属。
extra={'subsystems:client-modules':'modules','subsystems:client-resources':'resources','subsystems:sidebar-right':'ui-sidebar-right','subsystems:slots':'ui-slots','subsystems:web-client':'web','cookbook:adding-a-settings-card':'ui-settings-plugins'}
for cid,slug in extra.items():
 c=next(c for c in cs if c['id']==cid);disp=next(d for d in r['dispositions'] if d['id']=='client-'+slug);disp['candidates'].append(cid);next(t for t in r['taskPaths'] if t['id']=='client-'+slug)['candidates'].append(cid)
for t in ts:
 if t['path']=='docs/cookbook/adding-a-settings-card.zh.md':r['taskDiscoveries'].append(dict(candidate=t['id'],decision='included',taskId='client-ui-settings-plugins'))
 if t['path']=='docs/subsystems/slots.zh.md':r['taskDiscoveries'].append(dict(candidate=t['id'],decision='included',taskId='client-ui-slots'))
preview=next(c for c in cs if c['id']=='cookbook:adding-a-plugin-preview');r['dispositions'].append(dict(id='client-builtin-preview',decision='excluded',candidates=[preview['id']],reason='该 cookbook 明确只修改 Plugin Manager 私有 BUNDLE_PREVIEWS；第三方包无法经 manifest 或 exports 声明预览图，故不作为制作第三方插件的公开任务。'))
# 独立的共享组件选型任务。
ui=next(t for t in r['taskPaths'] if t['id']=='client-ui-primitives');ui['kind']='shared-ui-component-selection';ui['outcome']='能按对话框、菜单、表单和输出等用途选择并复用目标版本的公开 Web UI 控件';ui['userIntents']=['DSH Web UI 提供对话框吗','查找现成 Web UI 组件或控件'];
for t in ts:
 if t.get('kind')=='shared-ui-component-selection':r['taskDiscoveries'].append(dict(candidate=t['id'],decision='included',taskId=ui['id']))
r['files'].append(dict(source='examples/client-overlay.md',output='references/client/examples/example-client-overlay.md',kind='example'))
r['claims'].append(dict(id='client-factory-build',kind='derived-guidance',topic='client-modules',decision='accepted',owner='references/client/examples/example-client-overlay.md',summary='使用单入口 CJS 包装复现公开 factory 交接，保留 Host/Client 两个 export 和裸包名 Profile 行。',evidence=[dict(category='runtime',path='packages/client/tsdown.client.ts'),dict(category='runtime',path='packages/client/modules/src/client/system.ts'),dict(category='documentation',path='docs/cookbook/adding-a-settings-card.md')]))
# 源码定位页只作取证：不把内部预览能力写成第三方 API。
(E/'observations.json').write_text(json.dumps({'version':'0.2.1-rc.3','observations':[{'fact':'Modal 公开，FoldToggle 未从 root export 导出。','paths':['packages/client/ui-primitives/src/index.ts','packages/client/ui-primitives/src/Modal.tsx','packages/client/ui-primitives/src/Modal.module.css','packages/client/ui-primitives/src/useModalLayer.ts']},{'fact':'dsh.client.inject 是 informational package dependencies，非 Cordis service injection；external 才是精确模块请求。','paths':['packages/util/package-manifest/src/types.ts','packages/client/modules/src/client/manifest.ts']},{'fact':'外部包不能导入未发布 clientBundle preset，需要独立构建 lazy-CJS factory。','paths':['packages/client/tsdown.client.ts','docs/cookbook/adding-a-settings-card.md']},{'fact':'插件预览图为内置 BUNDLE_PREVIEWS，第三方没有声明入口。','paths':['docs/cookbook/adding-a-plugin-preview.md','packages/client/ui-plugin-manager/src/client/PluginManagerPage.tsx']}],'validation':{'clientExampleCompile':'pending: target Client declarations not yet emitted','browserMount':'not-run','semanticReview':'core concepts checked; long-tail generated object/task drafts still need individual semantic refinement'}},ensure_ascii=False,indent=4)+'\n')
(E/'result.json').write_text(json.dumps(r,ensure_ascii=False,indent=4)+'\n')
print({k:len(v) for k,v in r.items()})
