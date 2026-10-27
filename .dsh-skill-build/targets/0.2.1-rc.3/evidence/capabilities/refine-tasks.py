import json,re,posixpath
from pathlib import Path
T=Path('.dsh-skill-build/targets/0.2.1-rc.3');p=T/'evidence/capabilities/result.json';r=json.loads(p.read_text());S=T/'skill-source'
labels='''acp=用 ACP stdio 创建恢复和关闭持久 Agent
agent-instructions=让 AGENTS.md 指令按工作区和字节预算进入模型上下文
command-compact=提供不消耗模型轮次的手动压缩命令
command-goal=让用户用斜杠命令控制持久 Goal
a commands=为用户注册直接执行的斜杠命令
compaction=实现可重放的会话压缩后端
compaction-basic=用模型摘要压缩较早会话历史
compaction-image-offload=持久记录图片省略并重新执行模型请求
compaction-tool-result-pruner=在上下文压力下裁短超大工具文本
cua=通过授权对象 API 操作应用和窗口
deepseek-llm-api-extensions=向 DeepSeek 请求贡献有归属的顶层扩展字段
experimental-agent-team=创建具名 Teammate 并维护共享任务板
experimental-agent-team-profile=在 Web Profile 启用团队工具和成员看板
experimental-api-speech-to-text=通过认证 Remote 转写浏览器录音
experimental-auto-review=启用逐工具调用的模型权限审查
experimental-badge-skill-bundle=让预设加载随包徽章 Skill
experimental-browser-use-chrome-devtools-mcp=通过 Chrome DevTools MCP 启动或附加浏览器
experimental-browser-use-playwright-mcp=通过 Playwright MCP 启动或附加浏览器
experimental-browser-use-runtime=为浏览器提供方管理 Session 连接归属
experimental-browser-use-stagehand-native=用 Stagehand 原生提供方执行浏览器动作
experimental-claude-code-mods=为 Claude Code 兼容交互提供持久任务配置
experimental-computer-use-cua-driver-mcp=用 MCP CUA driver 执行 Computer Use 操作
experimental-computer-use-cua-driver-native=用原生 CUA driver 执行 Computer Use 操作
experimental-cot-translation-bundle=在 Web 中按需翻译展开的思考片段
experimental-cua-macos=在 macOS 提供应用窗口与辅助功能操作
experimental-inspector=为插件提供运行时检查与诊断入口
experimental-inspector-profile=启用隔离的 Inspector 调试组合
experimental-plugin-market-bundle=为 Web 启用插件市场组合
experimental-ptc-runtime-python=选择 CPython 后端运行模型程序
experimental-ralph-bundle=在 Profile 中显式启用 Ralph 迭代
experimental-session-inspector=在 Web 检查会话日志与投影
experimental-session-search=为模型显式启用全文会话检索
experimental-session-titles-bundle=为后续会话提示生成标题
experimental-speech-to-text=注册可取消的录音转写提供方
experimental-speech-to-text-sensevoice=准备 SenseVoice 本地模型并转写录音
experimental-terminal-bundle=启用持久终端工具组合
experimental-tool-agent-team=让模型创建成员并操作共享 Team 任务
experimental-tool-worktree=让模型创建受管理的 Git worktree
experimental-translator=注册或调用按需文本翻译提供方
experimental-voice-input-bundle=在 Web 提供录音转写输入
experimental-webworker-packer=打包可在 Web Worker 中执行的插件代码
experimental-webworker-runtime=运行并释放 Web Worker 插件环境
experimental-worktree=在插件中创建和释放受管理 worktree
file-reference=为 UI 提供不读取正文的文件补全候选
file-reference-local=按有效工作区搜索本地文件引用
 goal=维护有修订检查的持久 Goal
 goal-round-driver=驱动已激活 Goal 的后续轮次
harness-dev-context=为开发工作区注入 Harness 开发上下文
hook-protocol=把生命周期事件投影为外部 Hook 协议
hooks-claude-code=执行 Claude Code 格式的用户 Hook
hooks-codex=执行 Codex 格式的用户 Hook
llm=实现注册并调用模型提供方
llm-deepseek=配置 DeepSeek 原生模型适配器
llm-deepseek-account=使用账号授权激活 DeepSeek 模型路由
llm-deepseek-api-key=使用 API Key 激活 DeepSeek 模型路由
llm-pi-ai=通过 pi-ai 配置多提供方模型
llm-retry=按失败分类重试模型请求
mcp-client=发现并调用命名空间隔离的 MCP 工具
mcp-resources=向模型提供 MCP 资源列表和读取工具
permission-presets=为会话选择并持久记录权限预设
plan-mode=提供有确认流程的计划模式切换
plugin-package-inventory-deepseek=从官方来源发现可安装插件包
ptc-runtime=实现有显式结果与错误的程序执行提供方
ptc-runtime-node=在受管理 Node 进程中运行模型程序
repeat-tool-reminder=为重复无进展的工具调用发出提醒
session-reference=查询引用会话并提供可追溯摘要
session-title-all-prompts-llm=根据后续提示更新会话标题
skill=随插件提供可发现并加载的 Skill
skill-badge=提供徽章生成 Skill
skill-filesystem=从项目用户和自定义目录发现 Skill
skill-office=为 Office 文档任务提供受约束的 Skill 指引
subagent=启动受管理子任务并等待或中止执行
subagent-acp=通过 ACP 后端执行外部子任务
subagent-claude-code=通过 Claude Code 后端执行外部子任务
subagent-codex=通过 Codex 后端执行外部子任务
subagent-dsh-sdk=通过 DSH SDK 后端执行外部子任务
subagent-fork-in-process=以父级已完成轮次启动 Fork 子任务
subagent-spawn-in-process=以全新上下文启动本地子任务
time-context=将当前时间作为可重建上下文注入轮次
tmux-context=按轮次注入真实 tmux 位置变化
token-meter=估算重放后的请求用量与上下文压力
tool-ask-user=让模型提出可等待或延时回答的问题
tool-call-timeout-policy=为工具调用执行协作式时间上限
tool-goal=让模型按授权创建读取和更新 Goal
tool-ralph=运行显式请求的全新 Agent 迭代
tool-session-query=让模型按工作区授权检索会话历史
tool-skill=向模型公布目录并加载 Skill 内容
tool-subagent=为模型提供可配置的子任务委派工具
tool-subagent-control=向可继续子任务发送消息并中止轮次
tool-terminal=让模型复用有归属的持久终端
tool-workflow=让模型提交多 Agent 编排脚本
tool-workspace-dependencies=向模型公开随包脚本运行时路径
user-approval=为敏感操作请求一次性且失败关闭的审批
user-questions=为插件提供可取消的结构化问答
webhook=将认证外部事件按规则变成 Workspace 会话
webhook-github=验证 GitHub 签名并投递受信 webhook
workflow=运行并可靠释放调用方拥有的编排
workflow-ptc=在 Node PTC 中执行工作流与子任务'''
labels={k.strip().removeprefix('a '):v for k,v in (line.split('=',1) for line in labels.splitlines())}
for task in r['taskPaths']:
 key=task['id'].removeprefix('use-dsh-');label=labels[key];old=task['destinations'][0]['section'];new=label
 task['outcome']=new+'并观察结果及资源释放'
 for dest in task['destinations']:
  f=next(f for f in r['files'] if f['output']==dest['output']);doc=S/f['source'];text=doc.read_text().replace('## '+old+'\n','## '+new+'\n',1);doc.write_text(text);dest['section']=new
 # 配置文档曾作为该包候选 owner，同步其章节名。
 for d in r['dispositions']:
  if d['id']==task['id'] or any(c in task['candidates'] for c in d['candidates']):
   d['pluginTask']=new
   for output,sec in d['ownerSections'].items():
    if sec==old:d['ownerSections'][output]=new
# 仅归并实际同一任务的组合开关；不同运行语言和独立失败路径继续保留。
groups=[('use-dsh-experimental-agent-team-profile',['use-dsh-experimental-tool-agent-team']),('use-dsh-experimental-terminal-bundle',['use-dsh-tool-terminal']),('use-dsh-experimental-ralph-bundle',['use-dsh-tool-ralph']),('use-dsh-experimental-badge-skill-bundle',['use-dsh-skill-badge'])]
for rootid,childids in groups:
 root=next(t for t in r['taskPaths'] if t['id']==rootid);rootfile=next(f for f in r['files'] if f['output']==root['destinations'][0]['output']);path=S/rootfile['source'];text=path.read_text()
 for cid in childids:
  child=next(t for t in r['taskPaths'] if t['id']==cid)
  root['candidates']+=child['candidates'];root['apiObjects']+=child['apiObjects'];root.pop('configurationOnly',None)
  dest=child['destinations'][0];text+='\n组合后的具体操作见['+dest['section']+']('+posixpath.relpath(dest['output'],posixpath.dirname(rootfile['output']))+')。\n'
  for discovery in r['taskDiscoveries']:
   if discovery.get('taskId')==cid:discovery['taskId']=rootid
  r['taskPaths'].remove(child)
 root['candidates']=list(dict.fromkeys(root['candidates']));root['apiObjects']=list(dict.fromkeys(root['apiObjects']))
 if not root['apiObjects']:root['configurationOnly']=True
 owners=sorted(set(o['owner'] for o in r['objects'] if o['id'] in root['apiObjects']))
 for owner in owners:text+='\n对象契约：['+Path(owner).stem+']('+posixpath.relpath(owner,posixpath.dirname(rootfile['output']))+')。\n'
 path.write_text(text)
p.write_text(json.dumps(r,ensure_ascii=False,indent=4)+'\n');print('tasks',len(r['taskPaths']))
