from pathlib import Path
import json
T=Path('.dsh-skill-build/targets/0.2.1-rc.3');S=T/'skill-source';p=T/'evidence/client/result.json';r=json.loads(p.read_text())
implement={'modules','ui-primitives','ui-slots','ui-renderer','ui-sidebar-right','ui-conversation','ui-theme','resources'}
purposes={
'connection':'区分 Host admission、浏览器连接代际与 RPC 失败契约',
'file-upload':'查询上传进度、receipt 与草稿文件绑定的类型',
'hmr':'查询模块重建 frame 与浏览器热更新边界',
'locale':'查询字典注册、语言回退与翻译函数',
'product-analytics':'查询可选产品事件的字段与不采集范围',
'shortcuts':'查询命令注册、有效键位与平台限制',
'store':'选择不可变 snapshot store 与 slot StoreHandle',
'ui-agent-preset':'查询模式卡片、默认选择与标签的注入类型',
'ui-approval':'查询审批请求、用户决定与 composer 扩展数据',
'ui-chat':'查询 Chat 节点、轮次、工具与消息图片的呈现类型',
'ui-commands':'选择客户端动作或 popupSelect 命令表面',
'ui-dockkit':'查询停靠布局状态、纯 planner 与 React 宿主接口',
'ui-goal':'查询目标条带的数据与编辑暂停恢复回调',
'ui-input-trigger':'查询触发源、候选、pick 与输入仲裁协议',
'ui-jobs':'查询 job 列表动作与注入数据',
'ui-layout':'选择全局面板、底栏或浮层扩展位置',
'ui-message-feedback':'查询反馈弹窗的目标、提交结果与错误类型',
'ui-model-selection':'查询模型标签扩展的 owner props 与目录',
'ui-open-in-app':'查询在本地打开路径的动作与失败分支',
'ui-permission-presets':'查询权限选择器与未来默认值的区分',
'ui-plan':'查询计划模式徽章的退出动作与显示类型',
'ui-plugin-manager':'选择插件配置页、附加 badge、操作或详情 section',
'ui-plugin-market':'查询插件市场页面的数据与类型边界',
'ui-session':'查询 Session 标准 hooks、状态与 pending interaction',
'ui-settings-account':'查询账号菜单与设置 section 的数据契约',
'ui-settings-agent-loop':'查询 Agent loop 配置卡片的状态与写入动作',
'ui-settings-general':'查询通用设置行与文档操作的 props',
'ui-settings-models':'查询模型配置卡片、提供方 extras 与写入结果',
'ui-settings-plugin-inventory':'查询只读插件清单 tab 的注入契约',
'ui-settings-plugins':'区分 Settings 插件分区与 Plugins 配置页面',
'ui-settings-shell':'查询 shell 配置卡片的状态与写入动作',
'ui-settings-subagent':'查询子 Agent 配额与模型配置卡片类型',
'ui-settings-web-search':'查询网页搜索配置卡片的 scope 与 provider 类型',
'ui-settings':'查询 Host 配置表单的快照、revision 与写入通道',
'ui-sidebar-browser':'查询浏览器 tab 的页面工厂、导航与错误类型',
'ui-sidebar-documentpreview':'查询文档预览定义、读取 bytes 与分页文本契约',
'ui-sidebar-files':'查询文件树目录列表与行内动作 props',
'ui-sidebar':'选择品牌、导航面板动作或 footer 扩展位置',
'ui-subagent':'查询子会话标题、目录动作与只读 composer 匹配类型',
'ui-tool':'查询工具调用 phase、规范结果与 keyed renderer props',
'ui-trajectory':'查询 Trajectory 的快照、目标节点与图片席位',
'ui-user-questions':'查询用户问答、计划审阅与等待决定的数据',
'ui-workspace':'查询工作区选择、新会话与列表行扩展契约',
'web':'查询 Web shell 共享模块 baseline 与 index injection',
'client-ui-agent-team':'查询可选 Agent team 界面的声明与装配条件',
'client-ui-claude-code-mods':'查询可选 Claude Code 界面装配的声明',
'client-ui-cot-translation':'查询可选推理翻译的设置与显示类型',
}
for task in r['taskPaths']:
 slug=task['id'][7:]
 if slug in implement:continue
 purpose=purposes[slug];objects=[o for o in r['objects'] if o.get('decision')=='included' and o['id'] in task['apiObjects']];owners=sorted({o['owner'] for o in objects});task['outcome']=purpose+'，能指出精确公开声明、运行侧和接入前置';task['navigationLabel']=purpose;task.pop('compositionSteps',None)
 section='接入 '+slug
 body=f'# {purpose}\n\n## {section}\n\n### 查询目标与前置\n\n适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本任务用于{purpose}，完成结果是一份可核对的公开契约选择，不以安装整个内置页面代替实现自己的插件。\n\n### 查询步骤\n\n'
 body+='1. 先区分自己要调用的方法、要实现的回调、要传给组件的 props，以及仅供状态读取的类型。以下每份权威子主题都保留精确签名、成员与联合分支；按公开符号进入对象独占小节。\n\n'
 for own in owners:body+='   - ['+Path(own).stem.removeprefix('api-client-')+'](../api/'+Path(own).name+')。\n'
 body+='\n2. 核对导入子路径：Host 根入口与浏览器 /client 不能混用；纯类型依赖使用 import type，不能因此推定服务已挂载。若对象是 props 或 snapshot，它只描述数据形状，不自动创建页面、Session、连接或权限。\n'
 body+='3. 核对签名中的判别字段与可选项，再读其所在页的资源归属和失败通道。存在 status/phase/kind/ok 等联合分支时先判别再取分支字段；undefined 不等于成功空值。方法返回 disposer 或 unsubscribe 时记录由谁释放；带 signal 的请求记录谁拥有取消。\n'
 body+='4. 将选中的公开对象用于自己的真实任务：新增页面贡献走 [slot 装配](how-to-client-ui-renderer.md#接入-ui-renderer)，浏览器包交付走 [独立 factory 构建](how-to-client-modules.md#接入-modules)，右侧内容走 [tab 注册](how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right)。内置产品自己的状态与组件实现不作为可随意复制的包模板。\n'
 body+='\n### 验证与完成边界\n\n回答必须给出精确包名、export 子路径、符号与所需成员，指出 Host/Client 侧、启用前置以及失败/清理责任。只出现内部组件名、图标名或文件名，不能回答“提供了公开能力”。选择之后分别编译消费项目的 Host 与 Client；需要运行的插件按对应实施任务验证装载、一次真实动作与卸载。这个查询任务本身不声称已经独立重建该内置功能。\n'
 (S/'how-to'/('client-'+slug+'.md')).write_text(body)
 for disp in r['dispositions']:
  if disp['id']==task['id'] and disp['decision']=='included':disp['pluginTask']=purpose
p.write_text(json.dumps(r,ensure_ascii=False,indent=4)+'\n')
