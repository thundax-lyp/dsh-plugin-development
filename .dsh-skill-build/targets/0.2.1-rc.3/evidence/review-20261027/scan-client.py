from pathlib import Path
import re,json,posixpath
T=Path('.dsh-skill-build/targets/0.2.1-rc.3'); R=T/'evidence/review-20261027'; S=Path('skills/dsh-plugin-development')
files=(R/'client-files.txt').read_text().splitlines(); texts={str(p.relative_to(S)):p.read_text() for p in S.rglob('*.md')}
incoming={f:[] for f in files}
for origin,txt in texts.items():
 for dest in re.findall(r'\]\(([^)]+)\)',txt):
  if '://' in dest:continue
  target=posixpath.normpath(posixpath.join(posixpath.dirname(origin),dest.split('#')[0]))
  if target in incoming:incoming[target].append(origin)
source_map=(S/'maintenance/source-map.md').read_text().splitlines(); sources={}
for line in source_map:
 m=re.search(r'\]\(\.\./(references/client/[^)]+)\)',line)
 if m:sources[m[1]]=re.findall(r'`([^`]+)`',line)
full={
 'references/client/examples/example-client-overlay.md','references/client/examples/example-client-resource.md',
 'references/client/how-to/how-to-client-modules.md','references/client/how-to/how-to-client-ui-renderer.md','references/client/how-to/how-to-client-resources.md',
 'references/client/how-to/how-to-client-ui-settings.md','references/client/how-to/how-to-client-ui-settings-plugins.md',
 'references/client/api/api-client-resources-index.md','references/client/api/api-client-resources-contract.md',
 'references/client/api/api-client-ui-primitives-modal.md','references/client/api/api-client-ui-primitives-form-model.md',
 'references/client/api/api-client-ui-settings-config-form.md','references/client/api/api-client-ui-settings-config-form-types.md',
}
# 已审仅对应本轮人工逐段核查、同版源证据以及五维静态判断，不意味着完整浏览器运行。
rows=[];anomalies=[]
for f in files:
 txt=texts[f];title=txt.splitlines()[0].lstrip('# '); bare=[txt[:m.start()].count('\n')+1 for m in re.finditer(r'(?m)^any$',txt)]
 ellipsis=[i+1 for i,l in enumerate(txt.splitlines()) if re.search(r'\w\.\.\.(?:`?\s*\|)?$',l)]
 table_any=[i+1 for i,l in enumerate(txt.splitlines()) if re.search(r'\| `any` \|',l)]
 task=('实现并装载外部 Client factory' if any(x in f for x in ('modules','overlay')) else '复用现成对话框和 UI 原语' if 'primitives' in f else '暂存配置并带旧 revision 保存' if any(x in f for x in ('settings','form-model')) else '共享资源流、最后 holder 取消' if 'resources' in f or 'resource.md' in f else '右侧栏页面与 occurrence 生命周期' if 'sidebar-right' in f or 'sidebar-page' in f else '产物声称任务：'+title)
 findings=[]
 if bare or ellipsis or f.endswith('api-client-ui-renderer-registry.md') or f.endswith('api-client-ui-primitives-form-model.md') or f.endswith('api-client-resources-contract.md'):findings.append('C1')
 if f.endswith(('how-to-client-ui-settings.md','how-to-client-ui-settings-plugins.md','api-client-ui-primitives-form-model.md')):findings.append('C2')
 rows.append(dict(path=f,task=task,route={'incoming':sorted(set(incoming[f])),'checked':'完整文本扫描相对链接与对象标题；核心路径人工跟踪 HOW-TO → API → 示例'},startpoint=['精确 DSH checkout 内','独立已发布包消费项目'],execution='仅类型或契约支持；选中 upstream 测试不等于本文件插件场景已运行',status='已审' if f in full else '部分审核',evidence={'level':'同版本公开类型和实现＋人工五维静态核查' if f in full else '全文结构和类型异常扫描；来源路径存在性；尚未逐对象语义比对','sources':sources.get(f,[]),'missingSourcePaths':[p for p in sources.get(f,[]) if not (T/'checkout'/p).exists()],'bareAnyLines':bare,'truncatedSignatureLines':ellipsis,'anyMemberTableLines':table_any},findings=findings,unverified=['未运行真实 Web Profile/浏览器本文件端到端场景','未进行该文件决策性正文消融']+([] if f in full else ['未完成人工逐对象/API语义和所有适用生命周期分支核对','读取时机、决策价值、可用性与维护成本只有自动结构证据，尚未完成五维裁决'])))
 if bare or ellipsis:anomalies.append(dict(path=f,bareAnyLines=bare,truncatedSignatureLines=ellipsis))
result=dict(version='0.2.1-rc.3',tag='dsh-v0.2.1-rc.3',commit='1f81c047fc48fa190a683e469daa699857e9afe8',counts={'assigned':len(files),'reviewed':len(full),'partiallyReviewed':len(files)-len(full),'unreviewed':0},fiveDimensions='已审：人工检查读取路径、决策价值、同版准确性、可用性与维护成本；部分审核：只完成逐文件全文结构与异常扫描，不等同语义审核',files=rows)
(R/'client-status.json').write_text(json.dumps(result,ensure_ascii=False,indent=4)+'\n')
(R/'client-anomalies.json').write_text(json.dumps(anomalies,ensure_ascii=False,indent=4)+'\n')
print(json.dumps({'counts':result['counts'],'bareAnyDocuments':sum(bool(x['bareAnyLines']) for x in anomalies),'bareAnyBlocks':sum(len(x['bareAnyLines']) for x in anomalies),'truncatedDocuments':sum(bool(x['truncatedSignatureLines']) for x in anomalies)},ensure_ascii=False))
