import json,re
from pathlib import Path
T=Path('.dsh-skill-build/targets/0.2.1-rc.3'); S=T/'skill-source'; E=T/'evidence/client'; C=T/'checkout'
api=json.loads((S/'api-surface.json').read_text()); entries=json.loads((T/'evidence/api-entry-candidates.json').read_text())['candidates'];syms=json.loads((T/'evidence/api-symbol-candidates.json').read_text())['entries']; caps=json.loads((T/'evidence/capability-candidates.json').read_text())['candidates'];tasks=json.loads((T/'evidence/task-candidates.json').read_text())['candidates'];decl=json.loads((E/'declarations.json').read_text())
owned=lambda p:p.startswith(('packages/client/','apps/web/','packages/experimental/client-'))
ours=[e for e in entries if owned(e['path'])]; ids={e['id'] for e in ours};objs=[o for o in api['objects'] if o['entry'] in ids]
result={k:[] for k in ['files','topics','entries','objects','dispositions','taskPaths','taskDiscoveries','claims']}
notes={
'ui-primitives':'这些是 React 展示原语，不读取 Cordis、Session 或应用语言；文案必须由调用方以 labels 等 props 传入。控件本身不会注册 slot，直接导入组件也不会让它出现在 DSH 页面。打开状态、表单值和业务请求由调用方持有；React 卸载清理原语自己的 DOM 监听、观察器和 portal，调用方仍须取消自己的异步任务。样式使用 `--dsw-*` tokens，应在现有 DSH Web shell 中呈现。',
'ui-slots':'纯注册表没有 React 依赖。普通 Slots 通过 `SlotMap` 声明合并；`single` 按优先级取一个占位者，`list` 按 id 与 order 组合，`keyed` 按 key 分派，`chain` 依次调用纯 select 直到首个非 null。数字 priority 越小越先。同一单元的同一 priority 冲突、未声明的键、重复 children 声明、跨 scope 共享 Store handle 和缺少 select 的 chain 注册都会抛错。注册 disposer 递归收回 children 声明、贡献与 Store 挂载。Factory 在 `SlotFactoryMap` 声明，通过 registerFactory 安装，局部 slots 逐 occurrence 选择组件；children 仍为全局 Slots。',
'ui-renderer':'浏览器 `apply` 提供 `ctx.slots: SlotRegistry` 与 `ctx.uiRenderer`。插件使用服务代理方法 register/inject，不新建 SlotRegistry；代理将注册 effect 归入调用插件的 fiber。inject 等待目标 slot 的声明生命周期，声明消失就清理，重新声明再安装；回调必须同步返回 disposer 或 disposer iterable。不要注册 root：它是框架 AppFrame 的 single slot，覆盖它会移除整个页面；全局浮层使用 shell.overlay。',
'modules':'Host 从 enabled Loader 的裸包名行发现 dsh.client，./client 子路径行不携带浏览器半部。声明 platform:web、导出 ./client、预先构建 lib/client.js；普通 ESM 文件不是可加载 bundle。浏览器执行脚本只登记 factory，首次 materialization 才执行正文。baseline requests 由 shell 冻结模块表提供；external 只列精确的非 baseline request。缺供应者、同步循环和自请求使组合失败。删除 Host 行会等待异步清理，再淘汰无人引用的模块与样式。跨 Host release 的图不应用，改版需刷新页面。',
'store':'createSnapshotStore 提供裸 getSnapshot/subscribe/update/set；defineStore 将 init/persist/actions 绑定为可装入 slot 的 StoreHandle。selector hook 由 renderer 注入，而非引擎产物自带。默认同步通知；raf 是显式选择，帧内多写合并通知。persist 是 localStorage 客户端偏好，不替代 Session 模型事实；一个 handle 只能挂同一 scope，session scope 为各 Session 分开实例。',
'ui-sidebar-right':'新增 tab 分两步：ctx.sidebarRightTabs.register 注册静态定义，再在 sidebar.right.pane.tab 用 definition.id 为 key 注册 Body。kind 表示内容类别，id 表示实现身份，两者不能混用。类型默认 extension，排序为 extension、builtin、fallback，再按匹配模式长度与注册顺序；同 kind 仅允许一个 builtin 加一个 extension。正文通过 useTabInfo 获取 sidebar、panel、tab；tab.signal 在记录消失或插件卸载时中止，切 Session 与收起不销毁它。openResource 需要 dsh-resource:// URI；openTab 按已注册 kind 打开。布局保存 localStorage，导航 params、资源内容与活动连接不在布局中。',
'ui-theme':'ThemeRuntime 由浏览器插件提供，不由消费者直接构造。getTheme 读稳定快照；register 注册主题并返回 disposer，重复 id 与 system id 抛错；移除当前主题回退默认偏好。overrideTokens 按 source 叠加 light/dark 值对，后注册层逐 token 覆盖，旧层 disposer 不会删除同 source 的新层。设置操作通过 Host settings scope 持久化；CSS tokens 本身不产生模型可见事实。',
'locale':'LocaleRuntime 管理字典与语言偏好。插件把自己的中英字典注册到唯一 namespace，并通过 bind 得到翻译函数；组件以 locale 声明让 renderer 注入 t，不能依赖 primitives 读取应用语言。字典注册返回清理入口，必须随插件退出释放。',
'resources':'ctx.resources 通过协议注册 ResourceProvider，source(address) 返回可订阅快照，pin 用 AbortSignal 管理引用。useResource 是 renderer 注入的全局标准 hook，不由组件自行手写跨实例订阅。资源地址与读取行为须由协议 provider 明确，不把地址字符串当成文件访问权限。',
'connection':'Host connection 负责请求 admission、Peer 身份和 transport 交互，浏览器通过 installConnection 安装连接循环并交给指定 hooks/sinks。RPC 失败是结构化通道，连接代际隔离旧响应；断线与恢复需通过状态 source 观察，不从 WebSocket 打开推定 Remote 或 Session 已恢复。',
'ui-settings':'ConfigForms 是浏览器读取与编辑 Host 配置的入口。通过 namespace/entryId 取得表单，订阅不可变 snapshot，再使用 set/mutate 提交；Host 验证成功才接受持久值。配置无效或 revision 不匹配应保留错误与重新读取，不能把本地表单 staging 当已保存状态。',
'ui-settings-plugins':'插件配置页由 Host 公开的 schema 与配置作用域驱动。自定义页使用 ConfigPageForm 的 state/mutate，不自行写 profile 文件。对其它插件页面的附加内容注册 plugins.detail.actions、plugins.detail.badge 或 plugins.detail.section，并按 subject.kind 的 bundle、row、item 分支处理；不相关 subject 返回 null。',
'ui-tool':'工具 UI 读取工具调用与规范结果，仅负责纯展示。工具 execute 的模型结果由 Host 工具契约负责；不要为 UI 另造一份工具 JSON 结果，也不要由组件改变 Session 日志。按运行、已结算等 phase 判别 props 后渲染。',
'web':'Web shell 的 baseline module table 共享 react、react/jsx-runtime、react-dom、react-dom/client、@deepseek-ai/cordis、zod、@tanstack/react-virtual、dsh-client-store、dsh-client-ui-slots、dsh-client-ui-primitives、dsh-client-ui-dockkit。动态插件复用这些身份，不能把另一个 React 或 Cordis bundle 进自己的 factory。',
'ui-dockkit':'这是与 DSH 宿主无关的纯停靠布局套件。状态/操作/planner 与 React 呈现分离；planner 返回操作而不修改原状态，由宿主记录与应用。制作 DSH 右侧栏内容优先使用 sidebarRight 注册 tab，不为增加一个 tab 复制整套 DockController。',
'ui-conversation':'会话内容、输入与呈现分别由注册表和标准 source 装配；SlotMap 的 owner props 只描述父级提供的数据，不等于可任意构造的运行时对象。读取 Session 投影与已持久结果后展示；不要在组件 render 期间提交消息或创建连接。自定义节点、视图、分组与输入命令须挂入各自的 definition registry，随插件清理。',
'ui-input-trigger':'输入触发器区分检测、候选、选择和提交。匹配源、选中值与文本插入在 controller 中仲裁；检测不应发送业务请求。候选加载失败、输入变化和取消需要使用各调用给定的 signal/结果分支，不能让陈旧菜单结果提交到新输入。',
'shortcuts':'命令 owner 注册语义命令与有效键位，显示方读取同一 binding 描述。web 与 desktop 的可用修饰键与保留键不同，不能直接监听一个全局 keydown 绕过 modal/terminal/composition 仲裁。注册结果或订阅必须随 ctx.effect 清理。',
'file-upload':'文件上传以 receipt/binding 交给提交路径；浏览器进度不等于 Session 已采纳附件。上传失败或取消不应保留可提交的伪 receipt；临时资源归上传服务与调用信号所有，业务持久事实须经 Host 的提交链建立。',
}
# 同一主题下按源码声明文件分组，避免把 100 多个对象塞入一张成员表。
byPkg={}
for e in ours:
 p=e['path'].split('/package.json')[0];slug=p.split('/')[-1];byPkg.setdefault((p,slug),[]).append(e)
for (pkg,slug), es in sorted(byPkg.items()):
 topic='client-'+slug;result['topics'].append(topic); outtop=f'references/client/api/api-client-{slug}.md'; src=f'api-guardrails/client-{slug}.md'
 result['files'].append(dict(source=src,output=outtop,kind='api-guardrail',role='topic',topic=topic))
 selected=[o for o in objs if o['entry'] in {e['id'] for e in es}];groups={}; included=[]
 for o in selected:
  o=json.loads(json.dumps(o)); n=o['symbol']
  if o.get('deprecated') or any(s['name']==n and s.get('deprecated') for e in syms if e['entry']==o['entry'] for s in e['symbols']):
   o.update(decision='excluded',reason=f'{n} 在目标声明标注 deprecated，不作为新插件依赖。'); result['objects'].append(o);continue
  if n in ('apply','inject','name','default') and not(n=='default' and o['members']):
   o.update(decision='excluded',reason=f'{pkg} 的 {n} 是 Loader 调用的包安装钩子或安装元数据；消费者装载包而不手动调用或复制该字段。');result['objects'].append(o);continue
  f=Path(o['source']).stem;f=re.sub(r'[^a-zA-Z0-9-]','-',f).lower(); group=f
  if slug=='ui-primitives' and '/icons/' in o['source']:group='icons'
  groups.setdefault(group,[]).append(o);included.append(o)
 for group,os in sorted(groups.items()):
  output=f'references/client/api/api-client-{slug}-{group}.md';source=f'api-guardrails/client-{slug}-{group}.md'
  result['files'].append(dict(source=source,output=output,kind='api-guardrail',role='subject',topic=topic,subject=group))
  body=f'# {slug}：{group} 契约\n\n适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。\n\n'+notes.get(slug,f'本页定义 {slug} 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。')+'\n\n'
  for o in os:
   label=o['entry'].split(':')[-1].replace('./','').replace('.','root');section=f"{o['symbol']} {label}";o.update(decision='included',owner=output,section=section)
   for m in o['members']:
    m['decision']='excluded' if m.get('deprecated') else 'included'
    if m['decision']=='excluded':m['reason']=f"{o['symbol']}.{m['name']} 在当前声明标注 deprecated。"
   subpath=o['entry'].split(':')[-1];package=next(e['package'] for e in es if e['id']==o['entry']);imp=package+(subpath[1:] if subpath!='.' else '')
   contract=decl.get(o['entry']+':'+o['symbol'],o['signature'])
   body+=f"## {section}\n\n入口 `{imp}`，公开符号 `{o['symbol']}`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。\n\n```text\n{contract}\n```\n\n"
   if o['members']:
    body+='| 成员 | 公开类型 |\n| --- | --- |\n'+''.join('| `'+m['name']+'` | `'+m['signature'].replace('|','\\|').replace('\n',' ')+'` |\n' for m in o['members'] if m['decision']=='included')+'\n'
   if slug=='ui-primitives' and o['symbol']=='Modal':body+='这是现成的对话框／弹窗控件。`open`、`onClose`、`title` 必填；默认带头部且必须提供本地化 `closeLabel`。`headless:true` 分支禁止 closeLabel 并直接呈现 children；遮罩、aria-label 和 Escape 仍保留。`open:false` 返回 null，开启时 portal 到 document.body；初始焦点用 `data-modal-autofocus`，不用 React autoFocus。关闭时恢复先前焦点；嵌套菜单先消费 Escape。`backdropBlur` 默认 true，仅设置样式；实际 mask 样式不额外模糊背景。此控件不持有 open 状态，onClose 必须由 owner 将状态设为 false。\n\n'
   if slug=='ui-primitives' and o['symbol'].startswith('Icon'):body+='这是导出的 SVG 图形组件；用途由符号名区分，Regular/Medium 表示线重。它不会创建对应业务功能；例如麦克风图标不提供录音。继承 IconProps 的尺寸、className 与 SVG 属性，交互按钮的可访问名称由外层 owner 提供。\n\n'
   body+=f"生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-{slug}.md#接入-{slug}) 在真实装载路径检验成功、失败与卸载。\n\n"
   result['objects'].append(o)
  (S/source).parent.mkdir(parents=True,exist_ok=True);(S/source).write_text(body)
  result['claims'].append(dict(id=f'{topic}-{group}',kind='implemented-behavior',topic=topic,decision='accepted',owner=output,summary=f'{slug} 的 {group} 公开类型与成员形状。',evidence=[dict(category='public-api',path=p) for p in sorted({o['source'] for o in os})]+[dict(category='exports',path=pkg+'/package.json')]))
 topicbody=f'# {slug}：插件接入\n\n## 对象关系\n\n'+notes.get(slug,f'`{next(iter(es))["package"]}` 提供 {slug} 的界面或浏览器组合。下列子主题分别维护其公开对象，类型与运行入口按子路径区分。')+'\n\n## 选型与使用\n\n'
 for group in sorted(groups):topicbody+=f'- [{group} 对象契约](api-client-{slug}-{group}.md)。\n'
 topicbody+=f'\n完整操作见 [接入 {slug}](../how-to/how-to-client-{slug}.md#接入-{slug})。\n'
 (S/src).write_text(topicbody)
 for e in es:result['entries'].append(dict(candidate=e['id'],decision='included'))
 # 包候选只归该包；docs 另由主 agent 分配。
 pc=[c['id'] for c in caps if c.get('path','').startswith(pkg+'/') or c['id']==f'package:{es[0]["package"]}']; tid=f'client-{slug}';how=f'references/client/how-to/how-to-client-{slug}.md';hsrc=f'how-to/client-{slug}.md'
 if not groups: # 纯装载包仍拥有产品行为章节
  topicbody+='\n## 装载行为\n\n此包通过 Profile 的裸包名行启动，安装函数不作为消费者调用接口。浏览器部分通过 dsh.client 自动装配，随该行卸载。\n';(S/src).write_text(topicbody)
 owner=outtop; sec='对象关系' if groups else '装载行为'
 if pc:result['dispositions'].append(dict(id=tid,decision='included',candidates=pc,topics=[topic],owners=[owner],summary=f'{slug} 的 Client 装配与公开扩展入口。',pluginTask=f'在目标 Web Profile 中装载并使用 {slug}',ownerSections={owner:sec}))
 result['taskPaths'].append(dict(id=tid,outcome=f'目标 Web Profile 能使用 {slug} 的公开组合并在停用时回收其贡献',decision='covered',candidates=pc,apiObjects=[o['id'] for o in included],configurationOnly=not included,destinations=[dict(output=how,section='接入 '+slug)],compositionSteps=['Host Profile 启用裸包名行并准备其依赖。','Client 声明选择导出并构建 factory，等待服务与 slot 声明。','安装贡献并观察结果，停用插件检查资源收回。'] if len(included)>1 else []))
 result['files'].append(dict(source=hsrc,output=how,kind='how-to'))
 hb=f'# 使用 {slug}\n\n## 接入 {slug}\n\n### 目标与前置\n\n适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。'+notes.get(slug,f'使用包 `{es[0]["package"]}` 的公开入口组合该功能，先区分 Host 和浏览器侧。')+'\n\n'
 hb+='相关对象的权威契约：\n\n'+''.join(f'- [{group}](../api/api-client-{slug}-{group}.md)。\n' for group in sorted(groups))
 hb+='\n### 实现步骤\n\n1. 先准备 [完整 Client 包与构建](../examples/example-client-overlay.md) 所列文件，复用示例的 Host 空入口、manifest、factory 构建和 Profile 装载路径；按上面的对象契约选择本任务的运行侧与依赖。\n2. 在 Client apply 中声明需要的服务 inject；运行时依赖必须存在，类型导入不会替你挂载服务。通过 ctx.effect 安装产生 disposer 的订阅或注册；slot 贡献通过 ctx.slots.inject 等待声明，再 register，避免与父级加载顺序竞争。\n3. 将读取与写入分开：组件接收不可变快照，通过 owner 提供的动作修改状态。异步任务使用 owner 的中止信号，晚到结果不得写入已卸载或切换后的作用域；临时 UI 状态不冒充 Session 持久事实。\n4. 将构建后的包放入 Profile 的裸包名行，重启目标 Web Host 并刷新浏览器。确认页面无 bundle 404、缺 external 或注入服务错误，再触发上面定义的可见结果。\n\n### 验证与完成边界\n\n先分别检查 Host 与 Client 类型、构建产物和模块解析。随后在页面执行一次正常操作、一次拒绝或失败以及停用/重新启用；停用后贡献消失，重新启用只产生一份。涉及 Session 的状态至少切换两个 Session 并刷新，区分持久状态和临时界面状态；只读类型、纯组件与纯函数无需网络取消或持久化。TypeScript 通过只证明声明相容，完成仍需要实际 Web 页面中观察本任务。\n'
 (S/hsrc).parent.mkdir(parents=True,exist_ok=True);(S/hsrc).write_text(hb)
 for t in tasks:
  if t.get('path','').startswith(pkg+'/'):
   result['taskDiscoveries'].append(dict(candidate=t['id'],decision='included',taskId=tid))
(E/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=4)+'\n')
print({k:len(v) for k,v in result.items()})
