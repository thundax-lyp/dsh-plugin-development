from pathlib import Path
import re,json
base=Path(__file__).resolve().parents[2];source=base/'skill-source';checkout=base/'checkout'
text=(checkout/'packages/bundle/base/cordis.patch.yml').read_text()
by_package={}
for m in re.finditer(r'^    - id: (\S+)\n      name: [\'\"]?(@deepseek-ai/[^\s\'\"]+)',text,re.M):by_package.setdefault(m[2],[]).append(m[1])
canonical='../../infra/how-to/how-to-core-profile.md#在已有-profile-中复用或替换服务'
updated=[]
for p in sorted((source/'how-to').glob('capabilities-*.md')):
 if 'webworker-' in p.name:continue
 t=p.read_text();pkg=re.search(r'确认使用的是 `([^`]+)@0\.2\.1-rc\.3`',t)
 if not pkg:continue
 name=pkg[1]
 old='2. 对可执行插件行，按[配置 bundle 的完整文件结构](../examples/example-local-mcp.md#配置-bundle)创建独立包，保留 `dsh.bundle.patch`，把目标插件行放进 `cordis.patch.yml` 的 insert 数组；使用本任务的包名与配置替换示例 MCP 行。库、抽象接口和纯数据子路径不作为可执行插件行；为它们编写贡献插件，由 `inject` 声明所需服务并在其 scope 中调用。'
 new='2. 先按[已有 Profile 的组合检查]('+canonical+')核对目标服务、provider 和 entry id。已有实现时只添加自己的贡献插件，配置变化覆盖既有 id；只有确认组合缺失时才按[配置 bundle 文件结构](../examples/example-local-mcp.md#配置-bundle)提供该可执行插件行。不要把 API 页给空组合的配置片段再次 insert 到已有 Profile。库、抽象接口和纯数据子路径不作为可执行插件行；消费插件通过 `inject` 使用相应服务。'
 if old in t:t=t.replace(old,new)
 if name in by_package and '### 既有组合' not in t:
  ids='、'.join('`'+i+'`' for i in by_package[name]);t=t.replace('### 实现和装载','### 既有组合\n\n目标版本的 base 已声明本包的 '+ids+' 条目；基于默认 web/base 的项目应先复用它。条目存在仍须检查 disabled、条件与实际激活；本插件只管理自己的新增贡献，不卸载共享基础服务。\n\n### 实现和装载')
 if t!=p.read_text():p.write_text(t);updated.append(p.name)
canonical='../how-to/how-to-core-profile.md#在已有-profile-中复用或替换服务'
for p in sorted((source/'how-to').glob('runtime-*.md')):
 t=p.read_text();marker='### 实现与装载\n\n'
 if marker not in t:continue
 note='先执行[已有 Profile 的组合检查]('+canonical+')。默认 web/base 已有的服务直接注入使用；不要为调用服务再次插入同类实现。仅空组合或确认缺失时补足下列服务栈，替换 provider 前先停用原条目并保留其他消费者的依赖。\n\n'
 if note not in t:t=t.replace(marker,marker+note)
 if p.name=='runtime-shell.md':t=t.replace('1. 给 Profile 装载 subprocess-local 与 bash-local；需要限制执行时选 bash-sandbox 并满足 sandbox-policy，切勿将裸 backend 写成已隔离。','1. 默认 base 已有 `id: subprocess`，在非 Windows 上启用 `id: bash-sandbox`（Windows 使用 `pwsh-sandbox`）；消费插件声明 `inject = [\'shell\']` 并复用它，不再装载 bash-local。只有独立空组合才添加 subprocess-local 与一个 shell provider。若明确要改为裸本地执行，先停用原 shell provider，再启用 bash-local；这会改变隔离边界，不能把裸 backend 写成已隔离。')
 t=t.replace('await execution.result 判断','await execution.result() 判断')
 if t!=p.read_text():p.write_text(t);updated.append(p.name)
profile_page=source/'how-to/core-profile.md'
profile_section='''\n\n## 在已有 Profile 中复用或替换服务\n\n目标：在既有组合中添加消费者或 provider，而不重复创建同一服务。适用于默认 web/base 和用户已有 Profile；独立空组合需要另外提供它真正缺失的依赖。\n\n1. 在当前 Profile 所有者授权范围内运行 `dsh --profile development --dump-config`，读取合成条目的 id、name、disabled、配置和实际 Loader 状态。dump 只是配置，不代表激活；不要对已有 Profile 运行 `--from-default-profile` 初始化。\n2. 默认 web 复用 base。base 的 `subprocess` 已提供本地子进程，`bash-sandbox` 或 Windows 的 `pwsh-sandbox` 提供 shell，`goal` 提供 goals，`subagent-spawn-in-process` 提供 spawn 后端；同样已有 session、LLM、Skill、storage、Web 等基础服务。按目标 id 和运行侧核对，不因服务名相似改写另一个条目。消费者只声明 `inject` 并 insert 自己的唯一 id。\n3. 改配置使用对既有 id 的 patch。`config` 整体替换，必须重述要保留的字段；不要用带新 id 的 insert 来修改现有实例。已有可选 provider 只需启用/配置，未安装才安装缺失依赖。多个 registry provider 可以并存时也须遵守各 registry 的 id/选择规则，不能据此重复提供相同 Cordis Service。\n4. 替换互斥 provider 时，先停用原 owner，再激活新 owner；分别核对依赖方恢复和失败回滚。Loader 根据依赖可用性激活，列表先后不是时序保证。停用新 provider 不会自动恢复旧 provider；恢复须显式撤回替换 patch 并核对原条目。\n5. 卸载自己的贡献只撤回自己的注册；不能连带关闭共享的基础服务。空组合的最小栈配置与默认组合的覆盖 patch 分开维护。\n\n例如仅调整默认 shell 的时限：\n\n```yaml\n- id: bash-sandbox\n  config:\n    timeoutMs: 30000\n```\n\n这里 `config` 仅覆盖这个条目；完整 schema 默认值会继续解析未写字段，但既有自定义值不会被合并保留，先读取并重述它们。若明确选择无沙箱的独立本地后端，可在非 Windows 的开发组合使用下面替换；它不提供沙箱隔离：\n\n```yaml\n- id: bash-sandbox\n  disabled: true\n- insert:\n    - id: local-bash-replacement\n      name: '@deepseek-ai/dsh-bash-local'\n      config:\n        timeoutMs: 30000\n```\n\n前置是原组合只有该 bash shell provider，且已有 subprocess；Windows 或自定义组合先查实际条目后处理，不照搬 id。回退时先停用/移除自己的替换并重新启用原条目。\n\n完成判据：合成配置只含一个启用的互斥 provider、原服务无重复注册错误，自己的消费者可调用；禁用贡献后共享服务仍可用，恢复原 provider 后其他消费者重新激活。配置校验、Loader 装载和真实业务调用分别验证。\n'''
if '## 在已有 Profile 中复用或替换服务' not in profile_page.read_text():profile_page.write_text(profile_page.read_text()+profile_section)
(base/'evidence/fixes-20261027/profile-guidance-changes.json').write_text(json.dumps({'updated':updated,'baseEntries':by_package,'canonical':'how-to/core-profile.md#在已有-profile-中复用或替换服务'},ensure_ascii=False,indent=4)+'\n')
print('updated',len(updated),'defaultPackages',len(by_package))
