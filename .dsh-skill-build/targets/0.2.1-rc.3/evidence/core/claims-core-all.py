import json,hashlib
from pathlib import Path
P=Path('.dsh-skill-build/targets/0.2.1-rc.3');r=json.loads((P/'evidence/core/result.json').read_text());owned={c['owner'] for c in r['claims']};fm={f['output']:f for f in r['files']}
manual={
'how-to/core-service.md':['vendor/cordis/src/context.ts','vendor/cordis/src/service.ts','vendor/cordis/src/fiber.ts','vendor/cordis/src/registry.ts','vendor/cordis/src/events.ts','packages/boot/app-boot/src/profile.ts','packages/util/package-manifest/src/types.ts'],
'how-to/core-tool.md':['packages/core/tools/src/index.ts','packages/core/tools/src/schema.ts','packages/core/tools/src/presentation.ts','packages/core/system-prompt/src/index.ts','packages/core/session/src/index.ts'],
'how-to/core-remote.md':['packages/typert/protocol/src/index.ts','packages/typert/protocol/src/types.ts','packages/typert/generator/src/tsdown-plugin.ts','packages/typert/generator/src/workspace.ts','packages/typert/loader/src/index.ts','packages/api/gateway/src/index.ts','packages/api/gateway/src/client/index.ts','packages/api/remote-access/src/index.ts'],
'how-to/core-state.md':['packages/core/session/src/index.ts','packages/core/session/src/types.ts','packages/core/agent/src/index.ts','packages/core/scope/src/index.ts','packages/settings/settings/src/index.ts'],
'how-to/core-profile.md':['packages/boot/app-boot/src/profile.ts','packages/boot/app-boot/src/profile-context.ts','packages/boot/plugin-manager/src/index.ts','apps/cli/src/plugin.ts'],
'how-to/core-advanced.md':['packages/api/gateway/src/client/index.ts','packages/sdk/client/src/api.ts','packages/sdk/client/src/client.ts','packages/preset/agent-preset/src/index.ts','packages/extensions/cordis-host-runner/src/index.ts','packages/host/directory-picker/src/index.ts','packages/host/webserver/src/index.ts','packages/host/product-telemetry-otel/src/index.ts'],
'examples/core-service.md':['vendor/cordis/src/service.ts','vendor/cordis/src/fiber.ts','packages/boot/app-boot/src/profile.ts','packages/util/package-manifest/src/types.ts'],
'examples/core-tool.md':['packages/core/tools/src/index.ts','packages/core/tools/src/schema.ts','packages/boot/app-boot/src/profile.ts'],
'examples/core-remote.md':['packages/typert/protocol/src/index.ts','packages/typert/protocol/src/remote-error.ts','packages/typert/generator/src/tsdown-plugin.ts','packages/typert/generator/src/workspace.ts','docs/cookbook/adding-a-remote-api.md']}
for f in r['files']:
 if f['output'] in owned:continue
 topic=f.get('topic','core-dsh-app-boot-root');paths=[]
 if f.get('role')=='topic':
  os=[o for o in r['objects'] if o['decision']=='included' and fm.get(o['owner'],{}).get('topic')==topic];paths=sorted(set(o['source'] for o in os));summary='本主题公开对象的关系、运行侧与插件接入路径。'
 else:
  paths=manual.get(f['source'],[]);summary='基于目标版本公开原语形成的插件制作、装配、取消和卸载步骤。'
 if not paths:print('missing evidence',f['source']);continue
 ev=[{'category':'documentation' if p.startswith('docs/') else 'runtime','path':p} for p in paths]
 r['claims'].append({'id':'core-page-'+hashlib.sha256(f['output'].encode()).hexdigest()[:16],'kind':'derived-guidance','topic':topic,'decision':'accepted','owner':f['output'],'summary':summary,'evidence':ev})
(P/'evidence/core/result.json').write_text(json.dumps(r,ensure_ascii=False,indent=4)+'\n');print('claims',len(r['claims']))
