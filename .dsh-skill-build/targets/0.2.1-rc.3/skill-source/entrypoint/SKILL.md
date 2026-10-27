---
name: dsh-plugin-development
description: 查询和选用 DeepSeek Harness 0.2.1-rc.3 可供插件使用的公开 API、扩展点及现成 Web UI 组件，回答是否提供对话框等控件及如何使用，并制作、装载和验证 Cordis 包、工具、Service、Provider、Client UI 与 Remote 组合时使用。
---

# DSH Plugin Development

## 适用范围

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。先读消费项目的 package.json、锁文件与已安装包元数据；版本不同就停止套用签名及示例，先取得对应版本的 Skill。Cordis、schemastery 等 vendor 包有自己的版本号，不随 DSH 版本号安装。

本 Skill 服务于插件作者的能力查询、选型、实现、装载与验证。回答“DSH Web UI 提供对话框吗”时也应进入公开控件路径，不需要提问者先说“开发插件”。公开导出不等于已经挂载，默认组合、可选组合及实验入口各有依赖条件。

## 插件形态

一个包可以同时交付以下多种能力，按使用结果选择；Host、Client、Remote 是运行或传输边界。

| 形态 | 提供的能力 | 呈现或发现位置 | 装载与使用 | 指南 |
| --- | --- | --- | --- | --- |
| 模型工具 | 参数校验、可取消业务执行和规范结果 | Agent 工具列表，模型调用后产生结果 | Host 注册工具，Profile 提供依赖与权限，Client 按结果渲染 | [工具制作](references/infra/how-to/how-to-core-tool.md) |
| Service 与 Provider | 为其他插件提供可替换的能力实现 | 无独立 UI，消费插件通过注入服务或 registry 调用 | 提供方先激活，消费方声明 inject，scope 拥有注册与清理 | [服务制作](references/infra/how-to/how-to-core-service.md)、[Web Provider](references/infra/how-to/how-to-runtime-web.md) |
| Agent 行为与上下文扩展 | 为模型调用提供 adapter、Skill、指令或执行策略 | 模型请求、可选 Skill 或其他服务消费路径 | 挂载相应服务与提供方，按会话和 Agent 作用域生效 | [LLM 提供方](references/host/how-to/how-to-capabilities-dsh-llm.md)、[Skill 提供方](references/host/how-to/how-to-capabilities-dsh-skill.md)、[动态上下文](references/infra/how-to/how-to-core-tool.md#添加提示词段与动态上下文) |
| Web UI 扩展 | 控件、slot 内容、侧栏或设置交互 | 对应 Web slot、页面、侧栏或设置表面 | Host 暴露 Client 模块；Client factory 注册组件并在卸载时清理，跨端业务通过 Remote | [Client 模块](references/client/how-to/how-to-client-modules.md)、[现成控件](references/client/how-to/how-to-client-ui-primitives.md) |
| Host 请求入口 | 为本地或远端调用方提供路由或 webhook 处理 | 已挂载 WebServer 路由及调用响应，无需独立 UI | Host 插件挂载公开路由；鉴权、请求验证与资源责任由该入口明确承担 | [Host 集成](references/infra/how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)、[webhook](references/host/how-to/how-to-capabilities-dsh-webhook.md) |
| 配置组合包 | 把已有模块、Provider 与 Client 组合为可启用能力 | Profile 插件列表及相应业务入口 | 包声明 dsh.bundle.patch，安装到目标 Profile 后由 Loader 应用 patch；普通依赖不自动激活 | [包与装载](references/infra/how-to/how-to-core-service.md) |

Remote 是跨 Host/Client 的组合方式，不单独保证用户可见功能。第三方插件预览图和实际浏览器权限均以各自公开入口为界，不能从内置页面或包名推断。

## 开发任务

先选任务，按步骤到契约或完整 example；只查某个对象时使用后面的对象索引。

<!-- BEGIN GENERATED TASK NAVIGATION -->
<!-- prettier-ignore -->
### 常用入口

- [制作一个能被其他插件调用的Service并装载到Profile](references/infra/how-to/how-to-core-service.md#注册并验证可卸载的-service)

- [DSH Web UI 提供对话框吗](references/client/how-to/how-to-client-ui-primitives.md#接入-ui-primitives)

### Host 与 Agent

| 开发任务 |
| --- |
| [用 ACP stdio 创建恢复和关闭持久 Agent并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-acp.md#用-acp-stdio-创建恢复和关闭持久-agent) |
| [让 AGENTS.md 指令按工作区和字节预算进入模型上下文并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-agent-instructions.md#让-agentsmd-指令按工作区和字节预算进入模型上下文) |
| [提供不消耗模型轮次的手动压缩命令并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-command-compact.md#提供不消耗模型轮次的手动压缩命令) |
| [让用户用斜杠命令控制持久 Goal并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-command-goal.md#让用户用斜杠命令控制持久-goal) |
| [为用户注册直接执行的斜杠命令并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-commands.md#为用户注册直接执行的斜杠命令) |
| [实现可重放的会话压缩后端并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-compaction.md#实现可重放的会话压缩后端) |
| [用模型摘要压缩较早会话历史并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-compaction-basic.md#用模型摘要压缩较早会话历史) |
| [持久记录图片省略并重新执行模型请求并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-compaction-image-offload.md#持久记录图片省略并重新执行模型请求) |
| [在上下文压力下裁短超大工具文本并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-compaction-tool-result-pruner.md#在上下文压力下裁短超大工具文本) |
| [通过授权对象 API 操作应用和窗口并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-cua.md#通过授权对象-api-操作应用和窗口) |
| [向 DeepSeek 请求贡献有归属的顶层扩展字段并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-deepseek-llm-api-extensions.md#向-deepseek-请求贡献有归属的顶层扩展字段) |
| [创建具名 Teammate 并维护共享任务板并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-agent-team.md#创建具名-teammate-并维护共享任务板) |
| [在 Web Profile 启用团队工具和成员看板并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-agent-team-profile.md#在-web-profile-启用团队工具和成员看板) |
| [通过认证 Remote 转写浏览器录音并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-api-speech-to-text.md#通过认证-remote-转写浏览器录音) |
| [启用逐工具调用的模型权限审查并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-auto-review.md#启用逐工具调用的模型权限审查) |
| [让预设加载随包徽章 Skill并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-badge-skill-bundle.md#让预设加载随包徽章-skill) |
| [通过 Chrome DevTools MCP 启动或附加浏览器并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-browser-use-chrome-devtools-mcp.md#通过-chrome-devtools-mcp-启动或附加浏览器) |
| [通过 Playwright MCP 启动或附加浏览器并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-browser-use-playwright-mcp.md#通过-playwright-mcp-启动或附加浏览器) |
| [为浏览器提供方管理 Session 连接归属并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-browser-use-runtime.md#为浏览器提供方管理-session-连接归属) |
| [用 Stagehand 原生提供方执行浏览器动作并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-browser-use-stagehand-native.md#用-stagehand-原生提供方执行浏览器动作) |
| [为 Claude Code 兼容交互提供持久任务配置并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md#为-claude-code-兼容交互提供持久任务配置) |
| [用 MCP CUA driver 执行 Computer Use 操作并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-computer-use-cua-driver-mcp.md#用-mcp-cua-driver-执行-computer-use-操作) |
| [用原生 CUA driver 执行 Computer Use 操作并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-computer-use-cua-driver-native.md#用原生-cua-driver-执行-computer-use-操作) |
| [在 Web 中按需翻译展开的思考片段并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-cot-translation-bundle.md#在-web-中按需翻译展开的思考片段) |
| [在 macOS 提供应用窗口与辅助功能操作并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-cua-macos.md#在-macos-提供应用窗口与辅助功能操作) |
| [为插件提供运行时检查与诊断入口并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-inspector.md#为插件提供运行时检查与诊断入口) |
| [启用隔离的 Inspector 调试组合并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-inspector-profile.md#启用隔离的-inspector-调试组合) |
| [为 Web 启用插件市场组合并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-plugin-market-bundle.md#为-web-启用插件市场组合) |
| [选择 CPython 后端运行模型程序并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-ptc-runtime-python.md#选择-cpython-后端运行模型程序) |
| [在 Profile 中显式启用 Ralph 迭代并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-ralph-bundle.md#在-profile-中显式启用-ralph-迭代) |
| [在 Web 检查会话日志与投影并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-session-inspector.md#在-web-检查会话日志与投影) |
| [为模型显式启用全文会话检索并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-session-search.md#为模型显式启用全文会话检索) |
| [为后续会话提示生成标题并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-session-titles-bundle.md#为后续会话提示生成标题) |
| [注册可取消的录音转写提供方并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-speech-to-text.md#注册可取消的录音转写提供方) |
| [准备 SenseVoice 本地模型并转写录音并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-speech-to-text-sensevoice.md#准备-sensevoice-本地模型并转写录音) |
| [启用持久终端工具组合并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-terminal-bundle.md#启用持久终端工具组合) |
| [让模型创建受管理的 Git worktree并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-tool-worktree.md#让模型创建受管理的-git-worktree) |
| [注册或调用按需文本翻译提供方并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-translator.md#注册或调用按需文本翻译提供方) |
| [在 Web 提供录音转写输入并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-voice-input-bundle.md#在-web-提供录音转写输入) |
| [用公开packer库生成镜像，或在完整checkout构建Worker预览](references/host/how-to/how-to-capabilities-dsh-experimental-webworker-packer.md#打包可在-web-worker-中执行的插件代码) |
| [按镜像和roster启动Worker页面，并终止其生命周期](references/host/how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md#运行并释放-web-worker-插件环境) |
| [在插件中创建和释放受管理 worktree并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-experimental-worktree.md#在插件中创建和释放受管理-worktree) |
| [为 UI 提供不读取正文的文件补全候选并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-file-reference.md#为-ui-提供不读取正文的文件补全候选) |
| [按有效工作区搜索本地文件引用并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-file-reference-local.md#按有效工作区搜索本地文件引用) |
| [维护有修订检查的持久 Goal并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-goal.md#维护有修订检查的持久-goal) |
| [驱动已激活 Goal 的后续轮次并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-goal-round-driver.md#驱动已激活-goal-的后续轮次) |
| [为开发工作区注入 Harness 开发上下文并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-harness-dev-context.md#为开发工作区注入-harness-开发上下文) |
| [把生命周期事件投影为外部 Hook 协议并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-hook-protocol.md#把生命周期事件投影为外部-hook-协议) |
| [执行 Claude Code 格式的用户 Hook并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-hooks-claude-code.md#执行-claude-code-格式的用户-hook) |
| [执行 Codex 格式的用户 Hook并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-hooks-codex.md#执行-codex-格式的用户-hook) |
| [实现注册并调用模型提供方并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-llm.md#实现注册并调用模型提供方) |
| [配置 DeepSeek 原生模型适配器并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-llm-deepseek.md#配置-deepseek-原生模型适配器) |
| [使用账号授权激活 DeepSeek 模型路由并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-llm-deepseek-account.md#使用账号授权激活-deepseek-模型路由) |
| [使用 API Key 激活 DeepSeek 模型路由并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-llm-deepseek-api-key.md#使用-api-key-激活-deepseek-模型路由) |
| [通过 pi-ai 配置多提供方模型并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-llm-pi-ai.md#通过-pi-ai-配置多提供方模型) |
| [按失败分类重试模型请求并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-llm-retry.md#按失败分类重试模型请求) |
| [发现并调用命名空间隔离的 MCP 工具并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-mcp-client.md#发现并调用命名空间隔离的-mcp-工具) |
| [向模型提供 MCP 资源列表和读取工具并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-mcp-resources.md#向模型提供-mcp-资源列表和读取工具) |
| [为会话选择并持久记录权限预设并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-permission-presets.md#为会话选择并持久记录权限预设) |
| [提供有确认流程的计划模式切换并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-plan-mode.md#提供有确认流程的计划模式切换) |
| [从官方来源发现可安装插件包并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-plugin-package-inventory-deepseek.md#从官方来源发现可安装插件包) |
| [实现有显式结果与错误的程序执行提供方并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-ptc-runtime.md#实现有显式结果与错误的程序执行提供方) |
| [在受管理 Node 进程中运行模型程序并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-ptc-runtime-node.md#在受管理-node-进程中运行模型程序) |
| [为重复无进展的工具调用发出提醒并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-repeat-tool-reminder.md#为重复无进展的工具调用发出提醒) |
| [查询引用会话并提供可追溯摘要并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-session-reference.md#查询引用会话并提供可追溯摘要) |
| [根据后续提示更新会话标题并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-session-title-all-prompts-llm.md#根据后续提示更新会话标题) |
| [随插件提供可发现并加载的 Skill并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-skill.md#随插件提供可发现并加载的-skill) |
| [从项目用户和自定义目录发现 Skill并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-skill-filesystem.md#从项目用户和自定义目录发现-skill) |
| [为 Office 文档任务提供受约束的 Skill 指引并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-skill-office.md#为-office-文档任务提供受约束的-skill-指引) |
| [启动受管理子任务并等待或中止执行并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-subagent.md#启动受管理子任务并等待或中止执行) |
| [通过 ACP 后端执行外部子任务并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-subagent-acp.md#通过-acp-后端执行外部子任务) |
| [通过 Claude Code 后端执行外部子任务并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-subagent-claude-code.md#通过-claude-code-后端执行外部子任务) |
| [通过 Codex 后端执行外部子任务并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-subagent-codex.md#通过-codex-后端执行外部子任务) |
| [通过 DSH SDK 后端执行外部子任务并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-subagent-dsh-sdk.md#通过-dsh-sdk-后端执行外部子任务) |
| [以父级已完成轮次启动 Fork 子任务并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-subagent-fork-in-process.md#以父级已完成轮次启动-fork-子任务) |
| [以全新上下文启动本地子任务并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-subagent-spawn-in-process.md#以全新上下文启动本地子任务) |
| [将当前时间作为可重建上下文注入轮次并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-time-context.md#将当前时间作为可重建上下文注入轮次) |
| [按轮次注入真实 tmux 位置变化并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-tmux-context.md#按轮次注入真实-tmux-位置变化) |
| [估算重放后的请求用量与上下文压力并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-token-meter.md#估算重放后的请求用量与上下文压力) |
| [让模型提出可等待或延时回答的问题并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-tool-ask-user.md#让模型提出可等待或延时回答的问题) |
| [为工具调用执行协作式时间上限并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-tool-call-timeout-policy.md#为工具调用执行协作式时间上限) |
| [让模型按授权创建读取和更新 Goal并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-tool-goal.md#让模型按授权创建读取和更新-goal) |
| [让模型按工作区授权检索会话历史并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-tool-session-query.md#让模型按工作区授权检索会话历史) |
| [向模型公布目录并加载 Skill 内容并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-tool-skill.md#向模型公布目录并加载-skill-内容) |
| [为模型提供可配置的子任务委派工具并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-tool-subagent.md#为模型提供可配置的子任务委派工具) |
| [向可继续子任务发送消息并中止轮次并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-tool-subagent-control.md#向可继续子任务发送消息并中止轮次) |
| [让模型提交多 Agent 编排脚本并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-tool-workflow.md#让模型提交多-agent-编排脚本) |
| [向模型公开随包脚本运行时路径并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-tool-workspace-dependencies.md#向模型公开随包脚本运行时路径) |
| [为敏感操作请求一次性且失败关闭的审批并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-user-approval.md#为敏感操作请求一次性且失败关闭的审批) |
| [为插件提供可取消的结构化问答并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-user-questions.md#为插件提供可取消的结构化问答) |
| [将认证外部事件按规则变成 Workspace 会话并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-webhook.md#将认证外部事件按规则变成-workspace-会话) |
| [验证 GitHub 签名并投递受信 webhook并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-webhook-github.md#验证-github-签名并投递受信-webhook) |
| [运行并可靠释放调用方拥有的编排并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-workflow.md#运行并可靠释放调用方拥有的编排) |
| [在 Node PTC 中执行工作流与子任务并观察结果及资源释放](references/host/how-to/how-to-capabilities-dsh-workflow-ptc.md#在-node-ptc-中执行工作流与子任务) |

### Web Client 与跨侧交互

| 开发任务 |
| --- |
| [区分 Host admission、浏览器连接代际与 RPC 失败契约](references/client/how-to/how-to-client-connection.md#接入-connection) |
| [查询上传进度、receipt 与草稿文件绑定的类型](references/client/how-to/how-to-client-file-upload.md#接入-file-upload) |
| [查询模块重建 frame 与浏览器热更新边界](references/client/how-to/how-to-client-hmr.md#接入-hmr) |
| [查询字典注册、语言回退与翻译函数](references/client/how-to/how-to-client-locale.md#接入-locale) |
| [独立浏览器包能经裸包名 Profile 行发现并以 lazy-CJS factory 装载与撤销](references/client/how-to/how-to-client-modules.md#接入-modules) |
| [查询可选产品事件的字段与不采集范围](references/client/how-to/how-to-client-product-analytics.md#接入-product-analytics) |
| [协议 provider 与资源控件共享同址 snapshot，并在最后 holder 退出后取消读取](references/client/how-to/how-to-client-resources.md#接入-resources) |
| [查询命令注册、有效键位与平台限制](references/client/how-to/how-to-client-shortcuts.md#接入-shortcuts) |
| [选择不可变 snapshot store 与 slot StoreHandle](references/client/how-to/how-to-client-store.md#接入-store) |
| [查询模式卡片、默认选择与标签的注入类型](references/client/how-to/how-to-client-ui-agent-preset.md#接入-ui-agent-preset) |
| [查询审批请求、用户决定与 composer 扩展数据](references/client/how-to/how-to-client-ui-approval.md#接入-ui-approval) |
| [查询 Chat 节点、轮次、工具与消息图片的呈现类型](references/client/how-to/how-to-client-ui-chat.md#接入-ui-chat) |
| [选择客户端动作或 popupSelect 命令表面](references/client/how-to/how-to-client-ui-commands.md#接入-ui-commands) |
| [业务持久事件能按稳定身份映射为可重放的节点、View 或分组](references/client/how-to/how-to-client-ui-conversation.md#接入-ui-conversation) |
| [查询停靠布局状态、纯 planner 与 React 宿主接口](references/client/how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) |
| [查询目标条带的数据与编辑暂停恢复回调](references/client/how-to/how-to-client-ui-goal.md#接入-ui-goal) |
| [查询触发源、候选、pick 与输入仲裁协议](references/client/how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) |
| [查询 job 列表动作与注入数据](references/client/how-to/how-to-client-ui-jobs.md#接入-ui-jobs) |
| [选择全局面板、底栏或浮层扩展位置](references/client/how-to/how-to-client-ui-layout.md#接入-ui-layout) |
| [查询反馈弹窗的目标、提交结果与错误类型](references/client/how-to/how-to-client-ui-message-feedback.md#接入-ui-message-feedback) |
| [查询模型标签扩展的 owner props 与目录](references/client/how-to/how-to-client-ui-model-selection.md#接入-ui-model-selection) |
| [查询在本地打开路径的动作与失败分支](references/client/how-to/how-to-client-ui-open-in-app.md#接入-ui-open-in-app) |
| [查询权限选择器与未来默认值的区分](references/client/how-to/how-to-client-ui-permission-presets.md#接入-ui-permission-presets) |
| [查询计划模式徽章的退出动作与显示类型](references/client/how-to/how-to-client-ui-plan.md#接入-ui-plan) |
| [选择插件配置页、附加 badge、操作或详情 section](references/client/how-to/how-to-client-ui-plugin-manager.md#接入-ui-plugin-manager) |
| [查询插件市场页面的数据与类型边界](references/client/how-to/how-to-client-ui-plugin-market.md#接入-ui-plugin-market) |
| [自有组件挂入公开 slot，贡献和等待随父声明及自身 fiber 回收](references/client/how-to/how-to-client-ui-renderer.md#接入-ui-renderer) |
| [查询 Session 标准 hooks、状态与 pending interaction](references/client/how-to/how-to-client-ui-session.md#接入-ui-session) |
| [制作带草稿和revision栅栏的设置页](references/client/how-to/how-to-client-ui-settings.md#接入-ui-settings) |
| [查询账号菜单与设置 section 的数据契约](references/client/how-to/how-to-client-ui-settings-account.md#接入-ui-settings-account) |
| [查询 Agent loop 配置卡片的状态与写入动作](references/client/how-to/how-to-client-ui-settings-agent-loop.md#接入-ui-settings-agent-loop) |
| [查询通用设置行与文档操作的 props](references/client/how-to/how-to-client-ui-settings-general.md#接入-ui-settings-general) |
| [查询模型配置卡片、提供方 extras 与写入结果](references/client/how-to/how-to-client-ui-settings-models.md#接入-ui-settings-models) |
| [查询只读插件清单 tab 的注入契约](references/client/how-to/how-to-client-ui-settings-plugin-inventory.md#接入-ui-settings-plugin-inventory) |
| [区分 Settings 插件分区与 Plugins 配置页面](references/client/how-to/how-to-client-ui-settings-plugins.md#接入-ui-settings-plugins) |
| [查询 shell 配置卡片的状态与写入动作](references/client/how-to/how-to-client-ui-settings-shell.md#接入-ui-settings-shell) |
| [查询子 Agent 配额与模型配置卡片类型](references/client/how-to/how-to-client-ui-settings-subagent.md#接入-ui-settings-subagent) |
| [查询网页搜索配置卡片的 scope 与 provider 类型](references/client/how-to/how-to-client-ui-settings-web-search.md#接入-ui-settings-web-search) |
| [选择品牌、导航面板动作或 footer 扩展位置](references/client/how-to/how-to-client-ui-sidebar.md#接入-ui-sidebar) |
| [查询浏览器 tab 的页面工厂、导航与错误类型](references/client/how-to/how-to-client-ui-sidebar-browser.md#接入-ui-sidebar-browser) |
| [查询文档预览定义、读取 bytes 与分页文本契约](references/client/how-to/how-to-client-ui-sidebar-documentpreview.md#接入-ui-sidebar-documentpreview) |
| [查询文件树目录列表与行内动作 props](references/client/how-to/how-to-client-ui-sidebar-files.md#接入-ui-sidebar-files) |
| [自有页面或资源查看器能经类型注册与 keyed Body 在右侧栏被打开和关闭](references/client/how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) |
| [能声明 children 或 Factory 并按类型组合、优先级和 scope 规则装配下游组件](references/client/how-to/how-to-client-ui-slots.md#接入-ui-slots) |
| [查询子会话标题、目录动作与只读 composer 匹配类型](references/client/how-to/how-to-client-ui-subagent.md#接入-ui-subagent) |
| [自有主题或 token 层随浅深色切换组合并在停用时撤销](references/client/how-to/how-to-client-ui-theme.md#接入-ui-theme) |
| [查询工具调用 phase、规范结果与 keyed renderer props](references/client/how-to/how-to-client-ui-tool.md#接入-ui-tool) |
| [查询 Trajectory 的快照、目标节点与图片席位](references/client/how-to/how-to-client-ui-trajectory.md#接入-ui-trajectory) |
| [查询用户问答、计划审阅与等待决定的数据](references/client/how-to/how-to-client-ui-user-questions.md#接入-ui-user-questions) |
| [查询工作区选择、新会话与列表行扩展契约](references/client/how-to/how-to-client-ui-workspace.md#接入-ui-workspace) |
| [查询 Web shell 共享模块 baseline 与 index injection](references/client/how-to/how-to-client-web.md#接入-web) |
| [查询可选 Agent team 界面的声明与装配条件](references/client/how-to/how-to-client-client-ui-agent-team.md#接入-client-ui-agent-team) |
| [查询可选 Claude Code 界面装配的声明](references/client/how-to/how-to-client-client-ui-claude-code-mods.md#接入-client-ui-claude-code-mods) |
| [查询可选推理翻译的设置与显示类型](references/client/how-to/how-to-client-client-ui-cot-translation.md#接入-client-ui-cot-translation) |

### 配置、运行时与 Provider

| 开发任务 |
| --- |
| [选择事件调度并验证监听器清理](references/infra/how-to/how-to-core-service.md#选择事件调度并验证监听器清理) |
| [注册并执行一个模型工具](references/infra/how-to/how-to-core-tool.md#注册并执行一个模型工具) |
| [发布带取消与失败码的 Remote](references/infra/how-to/how-to-core-remote.md#发布带取消与失败码的-remote) |
| [为 Remote 声明完整资源与流所有权](references/infra/how-to/how-to-core-remote.md#为-remote-声明完整资源与流所有权) |
| [用 Session 事件记录可恢复的插件事实](references/infra/how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实) |
| [修改配置表单并保护脱敏字段](references/infra/how-to/how-to-core-state.md#修改配置表单并保护脱敏字段) |
| [通过 ACP 使用组合的主层并验证插件可调用和卸载](references/infra/how-to/how-to-core-profile.md#通过-acp-使用组合的主层) |
| [提供基础插件组合的主层并验证插件可调用和卸载](references/infra/how-to/how-to-core-profile.md#提供基础插件组合的主层) |
| [运行无界面任务的主层并验证插件可调用和卸载](references/infra/how-to/how-to-core-profile.md#运行无界面任务的主层) |
| [运行 SDK 应用组合的主层并验证插件可调用和卸载](references/infra/how-to/how-to-core-profile.md#运行-sdk-应用组合的主层) |
| [运行独立最小 SDK 组合的主层并验证插件可调用和卸载](references/infra/how-to/how-to-core-profile.md#运行独立最小-sdk-组合的主层) |
| [运行 Web 插件组合的主层并验证插件可调用和卸载](references/infra/how-to/how-to-core-profile.md#运行-web-插件组合的主层) |
| [运行 Web 插件组合的预设层并验证插件可调用和卸载](references/infra/how-to/how-to-core-profile.md#运行-web-插件组合的预设层) |
| [在 Client 消费已有 Remote 并处理失败](references/infra/how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败) |
| [使用 SDK 驱动独立 Harness 并回收子进程](references/infra/how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程) |
| [声明 Agent preset 并保留运行代际](references/infra/how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际) |
| [运行并停止会话隔离的动态 Cordis 包](references/infra/how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包) |
| [选用 Host 目录与 Web 集成能力](references/infra/how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力) |
| [添加执行策略与纯展示投影](references/infra/how-to/how-to-core-tool.md#添加执行策略与纯展示投影) |
| [添加提示词段与动态上下文](references/infra/how-to/how-to-core-tool.md#添加提示词段与动态上下文) |
| [提交选择过的产品遥测并区分入队与送达](references/infra/how-to/how-to-core-advanced.md#提交选择过的产品遥测并区分入队与送达) |
| [定义 Config 并使配置错误在装载时失败](references/infra/how-to/how-to-core-service.md#定义-config-并使配置错误在装载时失败) |
| [交付预构建包与 Git 安装边界](references/infra/how-to/how-to-core-service.md#交付预构建包与-git-安装边界) |
| [文件读取、原子写入与观察保护入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-fs.md#完成文件读取原子写入与观察保护插件任务) |
| [非 Session 状态的持久化入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-storage.md#完成非-session-状态的持久化插件任务) |
| [后台任务的所有权与输出入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-jobs.md#完成后台任务的所有权与输出插件任务) |
| [受管理子进程与原始输出入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-subprocess.md#完成受管理子进程与原始输出插件任务) |
| [Shell 命令、期限与持久执行句柄入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-shell.md#完成shell-命令期限与持久执行句柄插件任务) |
| [沙箱能力、执行策略与升级审批入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-sandbox.md#完成沙箱能力执行策略与升级审批插件任务) |
| [持久终端后端与会话入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-terminal.md#完成持久终端后端与会话插件任务) |
| [插件凭证、引用与交互授权入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-credentials.md#完成插件凭证引用与交互授权插件任务) |
| [图片与文件附件的持久引用入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-attachment.md#完成图片与文件附件的持久引用插件任务) |
| [大结果落盘与可检索定位符入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-spill.md#完成大结果落盘与可检索定位符插件任务) |
| [搜索与抓取 Provider入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-web.md#完成搜索与抓取-provider插件任务) |
| [语言服务 Provider 与四类查询入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-lsp.md#完成语言服务-provider-与四类查询插件任务) |
| [Session 耐久句柄、格式与只读投影入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-session.md#完成session-耐久句柄格式与只读投影插件任务) |
| [检索与导出会话的只读视图入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-session-query.md#完成检索与导出会话的只读视图插件任务) |
| [定时任务的声明与投递入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-schedule.md#完成定时任务的声明与投递插件任务) |
| [工作区归属与会话管理入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-workspace.md#完成工作区归属与会话管理插件任务) |
| [交付物与工作区变更呈现入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-deliverables.md#完成交付物与工作区变更呈现插件任务) |
| [反馈记录与命令入口入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-feedback.md#完成反馈记录与命令入口插件任务) |
| [远程执行世界与配套后端入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-ssh.md#完成远程执行世界与配套后端插件任务) |
| [浏览器自动化能力注册入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-browser-use.md#完成浏览器自动化能力注册插件任务) |
| [桌面控制能力注册入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-computer-use.md#完成桌面控制能力注册插件任务) |
| [插件遥测通道与有界关闭入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-telemetry.md#完成插件遥测通道与有界关闭插件任务) |
| [工具输出预算、取消期限与进程代理入口可在目标 Profile 中完成操作并清理](references/infra/how-to/how-to-runtime-util.md#完成工具输出预算取消期限与进程代理插件任务) |

<!-- END GENERATED TASK NAVIGATION -->

## 关键对象索引

全部对象名称通过[对象契约索引](references/object-index.md)到达唯一权威 API 小节。相同符号名按包名区分，不能混用 Host 与 Client 的同名 Context。

<!-- BEGIN GENERATED OBJECT INDEX -->
<!-- prettier-ignore -->
### Host

- `ACCOUNT_QUOTA_EXCEEDED_CODE`、`AcpConfig`、`ActionResult`、`activeAtToken`、`ActiveAtToken`、`AdapterRegistrationHandle`、`AgentMessageSource`、`AlsCausality`、`AlsRuntime`、`AlsSnapshot`、`AlsToken`、`AlwaysRetryPolicyConfig`
- `AnonymousTranslationProvider`、`AnonymousTranslationSpec`、`AnyHook`、`API_PREFIX`、`ApiKeyCheck`、`ApiKeyRejection`、`APP_IDENTITY`、`appendDelegatedPolicyOverrides`、`appendHookInvoked`、`appendHookResult`、`AppIdentity`、`apply`
- `applyChildComposition`、`applyGoalProjection`、`applyIndexInjections`、`AppResult`、`APPROVAL_POLICIES`、`ApprovalOutcome`、`ApprovalPolicy`、`ApprovalRequest`、`ApprovalRequestEvent`、`ApprovalRequestId`、`ApprovalService`、`AppsResult`
- `AskOptions`、`AskUserQuestionAnswer`、`AskUserQuestionAnswerItem`、`AskUserQuestionIntent`、`AskUserQuestionItem`、`AskUserQuestionOption`、`AskUserQuestionRequest`、`AskUserQuestionRequestEvent`、`assembleAssistantStream`、`assertPositiveFinite`、`assertSubagentMaxDepth`、`assertUsableApiKey`
- `assertUsableCwd`、`AssistantMessage`、`AssistantOutputFold`、`AssistantProviderMetadata`、`AssistantStreamAccumulator`、`assistantStreamChunks`、`assistantStreamFirstTokenTime`、`assistantStreamHasVisibleContent`、`assistantStreamHasVisibleText`、`AssistantStreamRecord`、`AssistantStreamRun`、`attributionHeaders`
- `AUTO_PRESET`、`BackoffConfig`、`BasicCompactionConfig`、`BasicCompactionEngine`、`BlockAssembler`、`BootMessage`、`boundContextSummary`、`BoxProps`、`BrowserMcpAttachConfig`、`BrowserMcpConfig`、`BrowserMcpLaunchConfig`、`BUNDLED_SKILL_RANK`
- `ButtonProps`、`callConfigEquals`、`CapabilitiesResult`、`captureDelegatedPolicyOverrides`、`catalogModelFields`、`catalogModelInfo`、`CatalogRefusal`、`checkDoneValue`、`ChildComposition`、`ChildHandle`、`ChildPort`、`ChildResult`
- `childSessionMeta`、`ChildStartRequest`、`ChildToHost`、`chooseWorkerHostSource`、`chunkHasVisibleText`、`ClaudeCodeMods`、`ClientRequirement`、`codePointLength`、`collectModuleNames`、`CommandDefinition`、`CommandDefinitionId`、`CommandDescriptor`
- `CommandExecution`、`CommandFileReceiptResolver`、`CommandHook`、`CommandId`、`CommandInfo`、`CommandInputDescriptor`、`CommandInvocation`、`CommandResult`、`CommandRunInput`、`CommandRunResult`、`CommandRuntime`、`CommandSource`
- `CommandSourceMap`、`CommandSpec`、`CommandSubmitAttachment`、`compactCheckpointSource`、`CompactionAgentContext`、`CompactionCheckpointSource`、`CompactionEngine`、`CompactionId`、`CompactionPolicyConfig`、`CompactionResult`、`CompactionTrigger`、`Config`
- `ConfigTree`、`configTrees`、`ConfigureCall`、`connectCua`、`connectWorkerHost`、`ContentBlock`、`ContentBlockMap`、`ContentBlockType`、`contentHasFile`、`contentHasImage`、`Context`、`CONTEXT_SUMMARY_MAX_CHARS`
- `CONTEXT_WINDOW_EXCEEDED_CODE`、`ContextBreakdownProjection`、`contextBreakdownProjectionDefinition`、`ContextForm`、`ContextFormed`、`ContextPressureProjection`、`contextPressureProjectionDefinition`、`ContextSnapshotSection`、`ContinuableCreateRequest`、`ContinuableCreateSpec`、`ContinuableSubagentDescriptorData`、`ContinuableSubagentDescriptorInput`
- `copyPrimaryRuntime`、`CordisContextTreeNode`、`CordisFiberTreeNode`、`CordisRuntimeConnection`、`CordisRuntimeContext`、`CordisRuntimeFiber`、`CordisRuntimeNode`、`CordisRuntimeRealm`、`CordisRuntimeSource`、`CordisRuntimeTree`、`CordisRuntimeTreeReader`、`CordisTreeNode`
- `CordisTreeSnapshot`、`createAlsRuntime`、`createAssistantMessage`、`createCuaApi`、`createDetachedRuns`、`createDeveloperMessage`、`CreatedWorktree`、`CreateGoalRequest`、`CreateGoalResult`、`createMcpToolDefinition`、`createMessage`、`createSyntheticExchange`
- `createSystemMessage`、`CreateTeamTaskRequest`、`createToolResultMessage`、`createUserMessage`、`createWorkerHost`、`CreateWorktreeRequest`、`CuaActionResult`、`CuaApi`、`CuaApp`、`CuaAppHandle`、`CuaAppInfo`、`CuaAxOptions`
- `CuaBackend`、`CuaBounds`、`CuaCapabilities`、`CuaClickOptions`、`CuaConfig`、`CuaCoordinateOptions`、`CuaDispatch`、`CuaDragOptions`、`CuaFoundAppInfo`、`CuaHoverResult`、`CuaMouseButton`、`CuaObservation`
- `CuaObservationOptions`、`CuaObservationSink`、`CuaOperation`、`CuaPasteOptions`、`CuaPointerModifier`、`CuaScreenshot`、`CuaScrollOptions`、`CuaSelectTextOptions`、`CuaShowResult`、`CuaSnapshotId`、`CuaSurface`、`CuaToolBinding`
- `CuaWindow`、`CuaWindowInfo`、`CUSTOM_PRESET`、`decodeGoalChange`、`decodeSessionReferenceUri`、`DeepSeekAdapter`、`DeepSeekAdapterOptions`、`DeepSeekCatalogModel`、`deepSeekConfigFields`、`DeepSeekConnectionOptions`、`DeepSeekFileConnection`、`DeepSeekFileId`
- `DeepSeekFileIdType`、`DeepSeekFileObject`、`DeepSeekFilePage`、`DeepSeekFilePolicy`、`DeepSeekFileReference`、`DeepSeekFilesClient`、`deepSeekFileScope`、`DeepSeekFileStore`、`deepSeekImageRequestPricing`、`deepSeekImageTokens`、`DeepSeekLlmApiExtensionMap`、`DeepSeekLlmApiExtensionProvider`
- `DeepSeekLlmApiExtensionRegistry`、`DeepSeekLlmApiExtensionRequest`、`DeepSeekLlmApiJson`、`DeepSeekPluginPackageIdentity`、`DeepSeekPluginPackageInventoryExtension`、`DeepSeekRequestAuth`、`deepSeekRequestImageDimensions`、`DeepSeekUploadIndex`、`DeepSeekUploadRecord`、`default`、`DEFAULT_CANDIDATE_LIMIT`、`DEFAULT_CONDITIONS`
- `DEFAULT_CONTEXT_WINDOW`、`DEFAULT_FILE_EXPIRY_SECONDS`、`DEFAULT_FILE_QUOTA_CLEANUP_BATCH`、`DEFAULT_FILE_REFRESH_MARGIN_SECONDS`、`DEFAULT_FILE_SEARCH_EXCLUDED_DIRECTORIES`、`DEFAULT_FILE_SEARCH_MAX_ENTRIES`、`DEFAULT_FILE_SEARCH_MAX_RESULTS`、`DEFAULT_FILES_API_TIMEOUT_MS`、`DEFAULT_HOOK_TIMEOUT_MS`、`DEFAULT_IMAGE_OFFLOAD_BYTE_QUANTUM`、`DEFAULT_IMAGE_OFFLOAD_COUNT_QUANTUM`、`DEFAULT_INLINE_IMAGE_OFFLOAD_BYTE_QUANTUM`
- `DEFAULT_LOW_DETAIL_IMAGE_PIXEL_BUDGET`、`DEFAULT_MAX_IMAGES_PER_REQUEST`、`DEFAULT_MAX_INLINE_REQUEST_IMAGE_BYTES`、`DEFAULT_MAX_REFERENCE_BYTES`、`DEFAULT_MAX_REQUEST_FILES_BYTES`、`DEFAULT_MAX_RESULT_BYTES`、`DEFAULT_MAX_SEARCH_RESULTS`、`DEFAULT_MAX_TOKENS`、`DEFAULT_MODELS_MAX_AGE_MS`、`DEFAULT_MODELS_TIMEOUT_MS`、`DEFAULT_REQUEST_IMAGE_MAX_BYTES`、`DEFAULT_ROOT`
- `DEFAULT_SEARCH_TIMEOUT_MS`、`DEFAULT_STDERR_SUMMARY_MAX_CHARS`、`DEFAULT_STREAM_IDLE_TIMEOUT_MS`、`DEFAULT_TOOL_ALIASES`、`DEFAULTS`、`defineMod`、`DelegatedPolicyOverrides`、`delegationDepthOf`、`deriveTurnTokenUsage`、`describePack`、`DetachedRuns`、`detachResidual`
- `DeveloperMessage`、`DirectoryRegistrationHandle`、`discoverBaselineInstructionFiles`、`DUNDER_MEMBER`、`EditGoalRequest`、`EmitterWebhookEvent`、`EmitterWebhookEventName`、`EMPTY_RESPONSE_CODE`、`encodeJsonPlain`、`encodeSessionReferenceUri`、`errorChain`、`escapeText`
- `estimateContent`、`estimateMessage`、`estimateStructuralBlock`、`estimateSystemMessage`、`estimateToolsTokens`、`Events`、`EXIT_PLAN_MODE`、`expandAssistantStream`、`FILE_REFERENCE_PROMPT`、`FileBlock`、`fileHandleText`、`FileReferenceCandidate`
- `FileReferenceService`、`FileSearchConfig`、`FileSystemSkillProvider`、`finalAssistantOutput`、`FinishReason`、`FinishReasonMap`、`FoldedGoal`、`foldGoal`、`foldSubagentDescriptor`、`formatFileMention`、`formatSessionReferenceMention`、`FoundAppsResult`
- `freezeMessage`、`FsEntry`、`FsStat`、`GenerateOptions`、`GitHubJsonObject`、`GitHubWebhookEvent`、`GOAL_CHANGE_VERSION`、`GoalActivation`、`GoalActivationChanged`、`GoalBlockReason`、`GoalChanged`、`GoalChangeMeta`
- `goalChangeRef`、`GoalClearChangeMeta`、`GoalError`、`GoalErrorCode`、`GoalId`、`GoalMessageSource`、`GoalOperation`、`GoalPhase`、`GoalProjection`、`goalProjectionDefinition`、`GoalProjectionState`、`GoalRef`
- `GoalService`、`GoalSnapshot`、`GoalSnapshotChangeMeta`、`GoalView`、`GUIDANCE`、`HarnessError`、`hasNonLosslessNumber`、`hasUnsafeIntegerToken`、`HookBudget`、`HookDialect`、`HookFailure`、`HookInvocation`
- `HookMatcher`、`HookNext`、`HookOrigin`、`HookOutput`、`HookRegistration`、`HookResultRecord`、`hostFrameParseCeiling`、`HoverResult`、`HttpInit`、`HttpResponse`、`IMAGE_EMPTY_DIRECTORIES`、`IMAGE_FILE_NAME`
- `IMAGE_HOME_DIRECTORY`、`IMAGE_LAZY_DIRECTORY`、`IMAGE_MANIFEST_PATH`、`IMAGE_OFFLOAD_REQUIRED_CODE`、`IMAGE_OVERLAY_DIRECTORIES`、`ImageAttachmentAccess`、`ImageAttachmentAccessResolver`、`ImageBlock`、`ImageFiles`、`ImageInstallation`、`ImageLazyArchive`、`ImageLazyFile`
- `ImageManifest`、`imageOffloadProjection`、`ImageOffloadTarget`、`ImageTree`、`indexWorkspacePackages`、`inflateImage`、`inflateImageStream`、`inject`、`InspectorClientBootstrap`、`InspectorEndpoint`、`InspectorHandle`、`InspectorJsonObject`
- `InspectorJsonPrimitive`、`InspectorJsonValue`、`InspectorOptions`、`InspectorRecordInput`、`InspectorService`、`InspectorSourceDescriptor`、`InspectorSourceKind`、`InspectorSpec`、`installationManifest`、`installCua`、`installPrimaryRuntime`、`installProcessGlobal`
- `InstructionFile`、`INVALID_CREDENTIAL_CODE`、`isAgentLoopRequest`、`isBuiltInCatalog`、`isCompactCheckpointSource`、`isContextWindowExceededError`、`isFatalWorkflowError`、`isHarnessError`、`isModelInvocable`、`isQuotaExceededError`、`isSkillName`、`isTimedAskUserQuestionSchema`
- `isTokenDelta`、`isUserInvocable`、`isVisibleChunk`、`joinAssistantStreamText`、`KnobState`、`KNOWN_EVENTS`、`lastAssistantStreamChunk`、`LaunchConfig`、`ListedCapabilities`、`ListedCatalog`、`ListedCatalogInput`、`ListedFacts`
- `LISTING_TIMEOUT`、`ListingCacheDependencies`、`ListingEntry`、`ListingSettings`、`ListingTiming`、`ListingView`、`LlmAdapter`、`LlmAttemptId`、`LlmCallConfig`、`LlmCallConfigAdapterDefaults`、`LlmCallControls`、`LlmConfigurableProvider`
- `LlmDiscoveredModel`、`LlmError`、`LlmErrorOptions`、`LlmFailure`、`LlmImageRequestBudget`、`LlmImageRequestPrice`、`LlmImageRequestPricing`、`LlmModelContext`、`LlmModelDiscoveryOperation`、`LlmModelDiscoveryRequest`、`LlmModelInfo`、`LlmModelReasoningInfo`
- `LlmNativeAuth`、`LlmProviderInfo`、`LlmReasoningEffortInfo`、`LlmResolvedModelInfo`、`LlmRetryEventData`、`LlmRetryStartedEventData`、`LlmRuntime`、`loadBaselineInstructions`、`LoadedInstructionFile`、`loadVfsImage`、`loadVfsOverlay`、`LocalFileReferenceService`
- `logTruncationMarker`、`LoweredModule`、`LOWERING_VERSION`、`lowerModuleSource`、`MANIFEST_PATH`、`ManualCompactAgentContext`、`ManualCompactionError`、`ManualCompactionErrorCode`、`markAgentLoopRequest`、`matcherDiagnostic`、`MatcherGroup`、`MatcherMode`
- `MatcherValue`、`matchesMatcher`、`MaterializeError`、`materializeFromRealm`、`MAX_FILE_EXPIRY_SECONDS`、`MAX_FILE_UPLOAD_BYTES`、`MAX_IMAGE_BYTES`、`MAX_REFERENCES`、`MAX_STORED_FILE_BYTES`、`MAX_STORED_FILE_COUNT`、`McpResourceProvider`、`McpResourceRequest`
- `McpResourceRuntime`、`McpResult`、`McpToolDefinitionOptions`、`MemoryVfs`、`MergedDecision`、`MergedHookOutcome`、`mergeHookOutputs`、`Message`、`MessageId`、`MessageRoleMap`、`MessageSource`、`MessageSourceMap`
- `MIN_FILE_EXPIRY_SECONDS`、`MIN_MAX_RESULT_BYTES`、`ModConfig`、`ModDefinition`、`ModelCompactPolicyConfig`、`ModelListing`、`ModelListingCache`、`ModelListingConfig`、`modelListingConfigFields`、`ModelListingOptions`、`modelListingURL`、`ModelMessageSource`
- `ModelModality`、`ModelModalityMap`、`ModelOverride`、`ModEvents`、`ModHook`、`ModOn`、`ModPlugin`、`ModRegister`、`MODS_API_VERSION`、`ModsApi`、`ModSpec`、`ModTier`
- `ModTimer`、`MODULE_PROXIES`、`MODULE_PROXY_PREFIXES`、`mountSessionMcp`、`name`、`NativeChannel`、`NativeChannelFactory`、`NativeClient`、`NativeClientConfig`、`NativeError`、`NativeOnlyOperations`、`NativeResourceParameters`
- `NativeScreenshotResult`、`NO_START_CAPABILITIES`、`NodePtcRuntime`、`normalizeApiKey`、`NormalRetryPolicyConfig`、`offloadedImageText`、`OneShotSubagentDescriptorData`、`OpResult`、`Options`、`OwnedSessionResource`、`PackedLazyArchive`、`PackOptions`
- `PackOverlayResult`、`packPreviewFixture`、`packRepositoryImage`、`PackResult`、`packTar`、`packVfsImage`、`packVfsOverlay`、`PaidTranslationProvider`、`PaidTranslationSpec`、`PaneOpenArgs`、`PaneOpenResult`、`parentAgentOptionsForDelegation`
- `parseCommand`、`ParsedCommand`、`parseHookOutput`、`parseImageManifest`、`parseInboundFrame`、`parseModelListing`、`parsePreviewFixtureManifest`、`parsePrimaryRuntime`、`parseSessionReferenceText`、`parseTar`、`PendingUserQuestion`、`PermissionCatalog`
- `PermissionPresetService`、`PermissionSelection`、`PermissionSettings`、`PiAiAdapter`、`PiAiAdapterOptions`、`PiAiCompatProfile`、`PiAiModality`、`PiAiModelOverride`、`PiAiModelProfile`、`PiAiProviderProfile`、`PiAiReasoningEfforts`、`PiAiThinkingFormat`
- `plainOptions`、`PlanModeConfig`、`PlanModeController`、`PlanProjection`、`planProjectionDefinition`、`PlanUnitState`、`PLATFORM_ENTRY_CONFIG`、`PluginOptions`、`PluginOptionValue`、`PORTABLE_RESERVED_WORDS`、`posixPath`、`PreparedAdapterCall`
- `PreparedDeepSeekLlmApiExtension`、`PreparedDeepSeekLlmApiExtensions`、`PreparedLlmCall`、`PreparedReferencedMessage`、`PresetOption`、`PresetSpec`、`PREVIEW_FIXTURE_MANIFEST_FILE`、`PREVIEW_FIXTURE_MANIFEST_VERSION`、`PreviewFixture`、`PreviewFixtureManifest`、`PreviewFixtureManifestEntry`、`previewFixtures`
- `PrimaryRuntimeManifest`、`primaryRuntimePythonAliases`、`ProcessRunInit`、`ProcessRunResult`、`ProcessShim`、`ProcessShimOptions`、`profileRoster`、`ProfileRoster`、`ProjectedToolUpdates`、`projectFilesToText`、`projectImagesForTextModel`、`projectOffloadedImages`
- `projectToolUpdates`、`PromptOrigin`、`PromptSubmitArgs`、`PromptSubmitInput`、`PromptSubmitResult`、`ProviderRequestId`、`PRUNE_MARKER`、`PrunedEntry`、`PruneResult`、`PtcBindingErrorClass`、`PtcBindingFunction`、`PtcBindingNamespace`
- `PtcJsonValue`、`PtcRunFailure`、`PtcRunRequest`、`PtcRunResult`、`PtcRunSandbox`、`PtcRunSpec`、`PtcRuntime`、`PUBLIC_BASE_URL`、`PythonPtcRuntime`、`QUOTA_EXCEEDED_CODE`、`RawStreamChunkType`、`readPrimaryRuntime`
- `readProcessStart`、`ReasoningBlock`、`ReasoningEffortId`、`ReconnectConfig`、`recordKeyFor`、`ReferencedConversationItem`、`refuseListedModel`、`registerDeepSeekProvider`、`renderAgentInstructions`、`RenderedAgentInstructions`、`renderGoalRoundPrompt`、`renderSkillContent`
- `REPLACED_EXTERNAL_PACKAGES`、`ReplayEnvelope`、`ReplyMessage`、`Request`、`REQUEST_IMAGE_MAX_DIMENSION`、`RequestDefaults`、`requestImageHandleText`、`RequestListener`、`RequestMessage`、`requestModelListing`、`RequestUserInput`、`requireActiveModuleLoader`
- `requireActiveVfs`、`requiredImageOffload`、`RESERVED_BINDING_GLOBALS`、`RESERVED_ERROR_MEMBERS`、`Resolution`、`resolveAdapterOptions`、`resolveChildAgentOptions`、`resolveChildDepth`、`resolveConfig`、`ResolvedAlwaysRetryPolicy`、`ResolvedCompactSpec`、`ResolvedConfig`
- `ResolvedDeepSeekOptions`、`ResolvedNormalRetryPolicy`、`ResolvedPiAiProviderProfile`、`ResolvedReconnectPolicy`、`ResolvedRetention`、`ResolvedRetryBackoff`、`ResolvedRetryPolicy`、`ResolvedSubagentStartRequest`、`ResolvedTargetPolicy`、`resolveImageAttachmentAccess`、`resolveInspectorOptions`、`resolveListedCatalog`
- `resolveListingTiming`、`resolvePrimaryRuntime`、`resolvePythonBin`、`resolveRequestImageMaxBytes`、`resolveRequestImageTarget`、`resolveRetryPolicy`、`ResponseSink`、`RetryId`、`RetryInternals`、`RetryPolicyConfig`、`RetryPolicySchema`、`ROLE_OVERHEAD`
- `runFirstTokenTime`、`runFirstVisibleTime`、`runHook`、`RunHookOptions`、`RunHookResult`、`RunResultSettlement`、`ScreenshotResult`、`selectHookGroups`、`SendTeamMessageRequest`、`SendTeamMessageResult`、`SerializedElement`、`SerializedNode`
- `SERVED_EVENTS`、`SESSION_REFERENCE_SCHEME`、`SessionEndInput`、`SessionEndResult`、`SessionMcpOptions`、`SessionMessage`、`SessionReferenceCandidate`、`SessionReferenceError`、`SessionReferenceErrorCode`、`SessionReferenceInput`、`SessionReferenceMentionCandidate`、`SessionReferenceResolver`
- `SessionReferenceSource`、`SessionResourceOptions`、`SessionResources`、`SessionStartInput`、`SessionStartResult`、`SessionUsage`、`SessionVersion`、`setActiveModuleLoader`、`setActiveVfs`、`setApprovalPolicy`、`SettledUserQuestion`、`settleRunResult`
- `ShowResult`、`SkillCandidate`、`SkillCatalogSnapshot`、`SkillCatalogSource`、`SkillDefinition`、`SkillInvocationPolicy`、`SkillInvocationSource`、`SkillLookupOptions`、`SkillProvider`、`SkillProviderControl`、`SkillProviderObservation`、`SkillRegistration`
- `SkillRegistry`、`SkillResourceBase`、`SkillSource`、`SkillSummary`、`SkillViewOptions`、`snapshotSubagentDescriptor`、`SpawnTeammateRequest`、`SpawnTeammateResult`、`SpeechCatalog`、`SpeechDownloadFailure`、`SpeechInput`、`SpeechPreparation`
- `SpeechPreparationOptions`、`SpeechPreparationState`、`SpeechPreparationStep`、`SpeechPreparationStepKind`、`SpeechProvider`、`SpeechProviderId`、`SpeechProviderInfo`、`SpeechProviderView`、`SpeechRequest`、`SpeechSelection`、`SpeechSelectionPatch`、`SpeechSetupEstimate`
- `SpeechSnapshot`、`SpeechSpec`、`startInspector`、`StateRef`、`StateResult`、`StaticModuleFactory`、`StdioConfig`、`StreamableHttpConfig`、`StreamChunk`、`STRUCTURED_OUTPUT_TOOL`、`SUBAGENT_DESCRIPTOR_VERSION`、`SubagentActivation`
- `SubagentActivationSpec`、`SubagentAddress`、`SubagentCapabilities`、`SubagentCatalogEntry`、`SubagentCatalogRow`、`SubagentDelivery`、`SubagentDepthError`、`SubagentDescendantListEntry`、`SubagentDescriptorData`、`SubagentError`、`SubagentIdentityProjection`、`SubagentInterruptAuthority`
- `SubagentInterruptReceipt`、`SubagentListEntry`、`SubagentModelSelectionConfig`、`SubagentModelSelectionSettings`、`SubagentPromptReceipt`、`SubagentPromptRequest`、`SubagentPromptRequestId`、`SubagentProvider`、`SubagentResult`、`SubagentRun`、`SubagentRunEndInfo`、`SubagentRunId`
- `SubagentRunInfo`、`SubagentRuntime`、`SubagentSendMessageOptions`、`SubagentSettledMessageSource`、`SubagentStartRequest`、`SubagentStopReason`、`SubagentStopReasonMap`、`SubagentTimingProjection`、`subprocessRunHandle`、`SubprocessRunHandleParts`、`summarizeStderr`、`supportedProtocols`
- `SurfaceSnapshot`、`SYNTHETIC_HOST`、`SyntheticExchange`、`SystemMessage`、`SystemPromptMessageSource`、`SystemPromptUpdate`、`TarEntry`、`TeamError`、`TeamId`、`TeamMemberPhase`、`TeamMemberProjection`、`TeamMembership`
- `TeamMemberSnapshot`、`TeamMemberView`、`TeamMessageId`、`TeamMessageSnapshot`、`TeamMessageSource`、`TeamProjection`、`TeamService`、`TeamTaskAction`、`TeamTaskId`、`TeamTaskSnapshot`、`TeamTaskStatus`、`TeamTaskView`
- `TeamWaitResult`、`TextBlock`、`textOnlyImageText`、`TextProps`、`TIMED_WAIT_PARAMETER`、`TimedStreamChunk`、`TimedUserQuestionResult`、`ToastOptions`、`TokenMeasurement`、`TokenMeasurementBaseline`、`TokenMeter`、`TokenMeterConfig`
- `TokenSurfaceNode`、`TokenUsage`、`TokenUsageProjection`、`tokenUsageProjectionDefinition`、`TOOL_TIMEOUT`、`ToolAdditionBlock`、`ToolCallBlock`、`ToolCallId`、`ToolCallInput`、`ToolCallResult`、`ToolHistory`、`ToolInfo`
- `ToolMessageSource`、`toolPairingBalancedAfter`、`toolPairingBalancedBefore`、`ToolRemovalBlock`、`ToolResultMessage`、`ToolResultMessageInput`、`ToolResultPruneConfig`、`ToolResultPruner`、`ToolSchema`、`ToolSpec`、`ToolUpdate`、`ToolUseSummary`
- `ToolWorkflowAgentEndData`、`ToolWorkflowAgentStartData`、`ToolWorkflowRunEndData`、`ToolWorkflowRunStartData`、`Transcript`、`TranscriptionRequest`、`TransformOutcome`、`TranslationError`、`TranslationErrorCode`、`TranslationIdentity`、`TranslationProvider`、`TranslationRequest`
- `TranslationRequestRecord`、`TranslationResultRecord`、`TranslationSpec`、`TruncatedInstruction`、`TunnelAbortFrame`、`TunnelFetch`、`TunnelInboundFrame`、`TunnelOutboundFrame`、`TunnelPort`、`TunnelRequestFrame`、`TunnelRequestId`、`TunnelResponseChunkFrame`
- `TunnelResponseEndFrame`、`TunnelResponseErrorFrame`、`TunnelResponseFrame`、`TunnelResponseHeadFrame`、`TunnelSeams`、`TunnelServer`、`TunnelServerOptions`、`TunnelStreamEndFrame`、`TunnelStreamErrorFrame`、`TunnelStreamItemFrame`、`TunnelStreamOpenFrame`、`TunnelStreamUplinkEndFrame`
- `TunnelStreamUplinkItemFrame`、`TurnCompleteInput`、`TurnCompleteResult`、`TurnStartInput`、`TurnStartResult`、`TurnTokenUsage`、`TurnTokenUsageRoute`、`TurnUsage`、`UiElement`、`UiElements`、`UiLogOptions`、`UiNode`
- `UiRenderInput`、`UiRenderResult`、`UpdateTeamTaskRequest`、`userAgent`、`UserMessage`、`UserQuestionError`、`UserQuestionProjectionView`、`UserQuestionService`、`UserQuestionState`、`validateBrowserMcpConfig`、`validateChildFrame`、`validateMeta`
- `validateWave`、`VerifiedWebhookDelivery`、`VfsDeferredArchive`、`VfsDeferredFile`、`VfsDir`、`VfsDirent`、`VfsEncoding`、`VfsError`、`VfsFileHandle`、`VfsReadOptions`、`VfsStats`、`VfsWriteOptions`
- `WebhookDeliveryId`、`WebhookEventMap`、`WebhookEventOf`、`WebhookModelSelection`、`WebhookRule`、`WebhookRuleId`、`WebhookRuntime`、`WebhookSessionRequest`、`WebhookSourceId`、`WindowsResult`、`WorkerHost`、`WorkerHostConnection`
- `WorkerHostConnectOptions`、`WorkerHostOptions`、`WorkerHostSource`、`WorkerHostSourceOptions`、`WorkerInit`、`WorkerLimits`、`WorkerModuleLoader`、`WorkerModuleLoaderOptions`、`WorkerRequire`、`WorkerTunnel`、`WorkflowAgentEndInfo`、`WorkflowAgentInfo`
- `WorkflowAgentOutcome`、`WorkflowEngine`、`WorkflowError`、`WorkflowErrorCode`、`WorkflowEventName`、`WorkflowMeta`、`WorkflowPhase`、`WorkflowResult`、`WorkflowResultInfo`、`WorkflowRun`、`WorkflowRunId`、`WorkflowRunInfo`
- `WorkflowStartRequest`、`WorkflowStopReason`、`WorkspaceDependencies`、`workspaceDependencyPaths`、`WorkspaceFileSearch`、`WorktreeService`、`WRAPPER_CONTRACT`、`WRAPPER_PARAMS`

### Client

- `AccountKey`、`AccountMenuProps`、`AccountSectionInjected`、`AccountSectionProps`、`AccountSnapshot`、`ActionsDecl`、`ActionSpec`、`activeDockPaneId`、`AGENT_PRESET_SETTINGS_NS`、`AgentLoopCardFace`、`AgentLoopCardProps`、`AgentLoopCardState`
- `AgentLoopSettings`、`AgentLoopSettingsLocaleKey`、`AgentPresetLabelInjected`、`AgentPresetLabelProps`、`AgentPresetOption`、`AgentPresetSeatInjected`、`AgentPresetSeatProps`、`AgentPresetSeatState`、`AgentPresetSectionInjected`、`AgentPresetSectionProps`、`AgentPresetSectionState`、`AgentPresetSettingsState`
- `AgentResolver`、`AnalyticsPreset`、`AnchoredPositionOptions`、`API_PATH`、`AppearanceRowComponentProps`、`AppearanceRowInjected`、`AppearanceRowState`、`applyIndexInjections`、`applyOp`、`ApplyResult`、`ApprovalComposerProps`、`ApprovalDecision`
- `ApprovalDetailOwnerProps`、`ApprovalKey`、`ApprovalPresentationRequest`、`AppWebEntry`、`ArbitrateKey`、`ArbitrateOutcome`、`AssistantActionOwnerProps`、`AssistantBlock`、`AssistantChatData`、`AssistantMessageNode`、`AssistantProviderMetadataView`、`AssistantRequestConfig`
- `AssistantTiming`、`BakedActions`、`BandInjected`、`BandProps`、`BeginCommandRequest`、`bindingIssue`、`BindingIssue`、`bindingKey`、`bootInjections`、`BootManifest`、`BootModuleRow`、`BootPluginRow`
- `BootSeams`、`BoundActions`、`BrandWordmark`、`BrandWordmarkProps`、`BrowserAddressFailure`、`BrowserAddressResult`、`BrowserBodyProps`、`BrowserControllerState`、`BrowserFailure`、`BrowserFrame`、`BrowserFrameState`、`BrowserHistoryEntry`
- `BrowserInjected`、`BrowserLoadError`、`BrowserMountRequest`、`BrowserNavigationStatus`、`BrowserPage`、`BrowserPageFactory`、`BrowserPageOptions`、`BrowserPresentation`、`BrowserSandboxControl`、`BrowserState`、`BrowserTabState`、`BrowserTarget`
- `BuiltInLocaleId`、`BUSY_ENTER_BEHAVIORS`、`BUSY_ENTER_FIELD`、`BusyEnterBehavior`、`Button`、`ButtonVariant`、`CandidateRequest`、`canSplit`、`canStepBack`、`canStepForward`、`ChainKeysOf`、`ChainRenderOpts`
- `ChainSelect`、`CHAT_SETTINGS_NAMESPACE`、`ChatConversationViewNode`、`ChatFileMentions`、`ChatFlowDataInjected`、`ChatFlowHookContext`、`ChatFlowInjected`、`ChatFlowOwnerProps`、`ChatFlowSlotProps`、`ChatGroupTree`、`ChatKey`、`ChatLocationNodeIndex`
- `ChatNode`、`ChatNodeDataMap`、`ChatNodeHookContext`、`ChatNodeInjected`、`ChatNodeKind`、`ChatNodeOwnerProps`、`ChatNodeProcessSource`、`ChatNodeSource`、`ChatNodeStore`、`ChatNodeViewProps`、`ChatPresentationPolicy`、`ChatScrollPosition`
- `ChatSettings`、`ChatSnapshot`、`ChatStore`、`ChatStoreState`、`ChatTurnNavigationIndex`、`ChatTurnProcessPresentation`、`ChatViewInjected`、`ChatViewSlotProps`、`Checkbox`、`ChildrenDecl`、`clampSizes`、`classifyFileType`
- `classifyLinkPath`、`ClientArtifactBaseline`、`ClientBootstrapModule`、`ClientBundleRegistration`、`ClientConnectionRpc`、`ClientEntries`、`ClientEntryState`、`ClientFileUploadHooks`、`ClientModuleCreateOptions`、`ClientModuleLoader`、`ClientModuleLoaderTarget`、`ClientModuleRecord`
- `ClientModuleRegistry`、`ClientModuleSystem`、`ClientModuleSystemOptions`、`ClientReleaseChange`、`ClientRequest`、`clientRequestSchema`、`ClientSessionContext`、`ClientTransportHooks`、`CloseLabelProps`、`closeTopModal`、`CODE_HIGHLIGHT_EXTENSIONS`、`CodeBlock`
- `CodeBlockProps`、`CodeFileType`、`CodeHighlighter`、`CodeToolbarLabels`、`CommandClaim`、`CommandContribution`、`CommandDecoration`、`CommandDescriptor`、`CommandDirectory`、`CommandKey`、`CommandNode`、`CommandRowOwnerProps`
- `CommandRowProps`、`CommandText`、`CommandTextProps`、`CommandUiContract`、`CommandUiRuntime`、`CommandUiSpec`、`COMMON_NS`、`CommonKey`、`CommonKeyOf`、`CompactionSummaryNode`、`ComposedProps`、`ComposerAttachment`
- `ComposerAttachmentsOwnerProps`、`ComposerAttachmentsProps`、`ComposerBarInjected`、`ComposerBarOwnerProps`、`ComposerBarProps`、`ComposerBlock`、`ComposerBlocks`、`ComposerChainProps`、`ComposerFileAttachment`、`ComposerImageAttachment`、`Config`、`ConfigForm`
- `ConfigForms`、`ConfigFormSnapshot`、`ConfigLedger`、`ConfigPageForm`、`CONNECT_PATH`、`ConnectionAdmission`、`ConnectionConfig`、`ConnectionFetchHandler`、`ConnectionFetchMethod`、`ConnectionFetchRoute`、`ConnectionGeneration`、`ConnectionGenerationSource`
- `ConnectionGenerationState`、`ConnectionHandle`、`ConnectionHostInfo`、`ConnectionIndexRequest`、`ConnectionIndexResponse`、`ConnectionIndicator`、`ConnectionIndicatorState`、`ConnectionInstallOptions`、`ConnectionInteractions`、`ConnectionLocation`、`ConnectionLoop`、`ConnectionRecoveryConfig`
- `ConnectionRequestBodyMode`、`ConnectionRequestRejection`、`ConnectionRpcAttachment`、`ConnectionRpcEndpointMatcher`、`ConnectionRpcFailure`、`ConnectionRpcHandler`、`ConnectionRpcHandlerResult`、`ConnectionRpcResult`、`ConnectionSinks`、`ConnectionState`、`ConnectionStateSource`、`ConnectionTrustRequest`
- `ConnectionWebSocket`、`ConnectionWebSocketFactory`、`ConsumeTokenRequest`、`containsPoint`、`ContentBlock`、`ContextMessageNode`、`ContextProducerView`、`ContextRole`、`CONVERSATION_SETTINGS_NAMESPACE`、`ConversationBinding`、`ConversationConfig`、`ConversationContentInputProps`
- `ConversationContentProps`、`ConversationContext`、`ConversationContextOriginKind`、`ConversationContextReader`、`ConversationController`、`ConversationDefinitionRegistry`、`ConversationEventDefinitions`、`ConversationEventRegistry`、`ConversationGroupContext`、`ConversationGroupData`、`ConversationGroupDataMap`、`ConversationGroupDefinition`
- `ConversationGroupDefinitions`、`ConversationGroupedView`、`ConversationGroupInput`、`ConversationGroupRegistry`、`ConversationHeaderActionOwnerProps`、`ConversationHeaderCornerOwnerProps`、`ConversationHeaderLineageOwnerProps`、`ConversationInjected`、`ConversationKey`、`ConversationLocation`、`ConversationLocationData`、`ConversationLocationDataChange`
- `ConversationLocationDataScope`、`ConversationLocationDataSource`、`ConversationLocationDataStore`、`ConversationLocationIndex`、`ConversationMatch`、`ConversationMatchHandler`、`ConversationMatchResult`、`ConversationNode`、`ConversationNodeAssembler`、`ConversationNodeContext`、`ConversationNodeDefinition`、`ConversationNodeDefinitionInput`
- `conversationPhase`、`ConversationPhase`、`ConversationPreviousContext`、`ConversationPromptSnapshot`、`ConversationPublication`、`ConversationSessionHeaderInjected`、`ConversationSessionHeaderSlotProps`、`ConversationSessionInjected`、`ConversationSessionSlotProps`、`ConversationSettings`、`ConversationSlotProps`、`ConversationSnapshot`
- `ConversationStartMatch`、`ConversationStepDataMap`、`ConversationStore`、`ConversationStoreState`、`ConversationTimelineSnapshot`、`ConversationTurnDataMap`、`ConversationViewActionEntry`、`ConversationViewActionsOwnerProps`、`ConversationViewBuilder`、`ConversationViewDefinition`、`ConversationViewDefinitions`、`ConversationViewNode`
- `ConversationViewRegistry`、`ConversationViewRequest`、`ConversationViewSnapshotMap`、`ConversationViewSnapshotStore`、`ConversationViewsProps`、`ConversationWidthControlsInputProps`、`ConversationWidthControlsProps`、`ConvViewOwnerProps`、`ConvViewProps`、`CotTranslationKey`、`CotTranslationPreferences`、`CotTranslationSnapshot`
- `createClientModuleSystem`、`createIdMinter`、`createInitialState`、`createSnapshotStore`、`default`、`DEFAULT_BUSY_ENTER_BEHAVIOR`、`DEFAULT_DIFF_MAX_LINES`、`DEFAULT_FONT_SIZE`、`DEFAULT_PREFERENCE`、`DEFAULT_READ_MAX_LINES`、`DEFAULT_SEARCH_MAX_LINES`、`DEFAULT_TERMINAL_MAX_LINES`
- `DEFAULT_TRANSCRIPT_VIEW_MODE`、`defineStore`、`DefineStore`、`DesktopBrowserBridge`、`DesktopBrowserLeaseId`、`DesktopBrowserOpenRequest`、`DesktopBrowserReservation`、`DesktopKeyboardApi`、`DesktopShortcutInput`、`DesktopShortcutsApi`、`DesktopUpdateBridge`、`DesktopUpdateFailureKind`
- `DesktopUpdatePresentation`、`DesktopUpdateView`、`DetectTrigger`、`DiffBlock`、`DiffBlockLabels`、`DiffBlockProps`、`DiffHunk`、`diffTotals`、`DirectoryFlowOwnerProps`、`DirectoryFlowSlotName`、`DirectoryPickingHooks`、`DirectoryPickingInjected`
- `DirectoryStatus`、`DirLevel`、`DisclosureRow`、`DisclosureRowProps`、`DiscoverFace`、`DiscoverState`、`dividerSizes`、`DOCK_EDGE_FRACTION`、`DOCK_ZONES`、`DockController`、`DockControllerOptions`、`DockIntents`
- `DockLabels`、`DockLayout`、`DockLayoutProps`、`DockMode`、`dockPaneCount`、`dockPaneIds`、`DockSnapshot`、`DockSurface`、`DockSurfaceProps`、`DockZone`、`DocumentContent`、`DocumentFileBytes`
- `DocumentLoadMode`、`DocumentPreviewDefinition`、`DocumentPreviewProps`、`DocumentTextPage`、`DraftAttachmentId`、`DraftFileUpload`、`DraftFileUploads`、`DraftInitializationOptions`、`DraftInitializationResult`、`DraftInput`、`DraftReference`、`DraftSnapshot`
- `DRAG_THRESHOLD`、`DropTarget`、`DshWindow`、`editShortcutDocument`、`EffectiveShortcut`、`effectiveShortcuts`、`EMPTY_CHAT_SNAPSHOT`、`EMPTY_CONVERSATION_SNAPSHOT`、`EMPTY_HISTORY`、`EmptyWorkspaceOwnerProps`、`EncodedFileUploadRequest`、`EngineStoreHandle`
- `EngineStoreInstance`、`EntryAnalyticsRegion`、`EntryKeyOf`、`EVENTS_ENDPOINT`、`ExactMatch`、`exactPackageSpecifier`、`ExpandButtonProps`、`extractMarkdownPlainText`、`FactoryComponentPropsOf`、`FactoryInjectParams`、`FactoryLocalComponent`、`FactoryLocalComponentPropsOf`
- `FactoryLocalSlotDef`、`FactoryRegistrationPropsOf`、`FALLBACK_LOCALE`、`FeedbackDialogInjected`、`FeedbackDialogProps`、`FeedbackDialogState`、`FeedbackDialogTarget`、`FeedbackSubmit`、`FeedbackUi`、`fileExtension`、`FilesBodyProps`、`FilesInjected`
- `fileSizeText`、`FilesState`、`FilesTabState`、`FileType`、`FileTypeIcon`、`FileTypeIconProps`、`FileTypeKind`、`FileTypeProjectContext`、`FileUploadFetch`、`FileUploadProgress`、`FileUploadReceiptId`、`FileUploads`
- `FileUploadService`、`FileUploadValue`、`filterOptions`、`FinalAssistantChatData`、`findContentTab`、`findPaneContentTab`、`findParent`、`findTabPane`、`FISH_LOGO_PATH`、`FISH_LOGO_VIEWBOX`、`FishLogo`、`FLOAT_DEFAULT_SIZE`
- `FLOAT_MIN_SIZE`、`FloatLayer`、`FloatLayerProps`、`FloatRect`、`floatRectAt`、`focusWithoutRing`、`FONT_SIZE_FIELD`、`FONT_SIZE_MAX`、`FONT_SIZE_MIN`、`FontFamilies`、`FontRole`、`FontRowState`
- `FontSettingsGroupProps`、`FontSettingsInjected`、`FontSizes`、`GeneralSectionComponentProps`、`getNode`、`getPane`、`getSplit`、`getStaticModules`、`getTab`、`GlobalStandardProps`、`GoalActionResult`、`GoalBar`
- `GoalBarActions`、`GoalDock`、`GoalKey`、`GroupKey`、`GroupNodePosition`、`GroupReference`、`GroupSnapshot`、`GroupUpdate`、`GuideArtworkBrowser`、`GuideArtworkFiles`、`GuideBodyProps`、`GuideInjected`
- `halvesFit`、`HalvesFit`、`HandleOf`、`HeaderContentProps`、`HeaderRequest`、`HeroAgentPresetOwnerProps`、`HeroBrandMarkOwnerProps`、`HighlightSpan`、`History`、`HistoryEntry`、`HistoryStep`、`HookContextOf`
- `HooksSources`、`HostConnectionFetch`、`HostConnectionHandle`、`HostConnectionRpc`、`HostConnectionService`、`HostObservable`、`HoverCard`、`HoverCardGroup`、`ICON_MEDIUM_STROKE`、`ICON_REGULAR_STROKE`、`IconAgentPresetOutlineMedium`、`IconAgentPresetOutlineRegular`
- `IconAlarmClockOutlineMedium`、`IconAlarmClockOutlineRegular`、`IconApiOutlineMedium`、`IconApiOutlineRegular`、`IconAppsAddOutlineMedium`、`IconAppsAddOutlineRegular`、`IconArchiveCheckOutlineMedium`、`IconArchiveCheckOutlineRegular`、`IconArchiveOffOutlineMedium`、`IconArchiveOffOutlineRegular`、`IconArchiveOutlineMedium`、`IconArchiveOutlineRegular`
- `IconBranchOutlineMedium`、`IconBranchOutlineRegular`、`IconBrowseOutlineMedium`、`IconBrowseOutlineRegular`、`IconCheckCircleFillMedium`、`IconCheckCircleFillRegular`、`IconCheckCircleOutlineMedium`、`IconCheckCircleOutlineRegular`、`IconChecklistOutlineMedium`、`IconChecklistOutlineRegular`、`IconCheckOutlineMedium`、`IconCheckOutlineRegular`
- `IconChevronDownOutlineMedium`、`IconChevronDownOutlineRegular`、`IconChevronLeftOutlineMedium`、`IconChevronLeftOutlineRegular`、`IconChevronRightOutlineMedium`、`IconChevronRightOutlineRegular`、`IconChevronsUpDownOutlineMedium`、`IconChevronsUpDownOutlineRegular`、`IconChevronUpOutlineMedium`、`IconChevronUpOutlineRegular`、`IconClockOutlineMedium`、`IconClockOutlineRegular`
- `IconCloseCircleFillMedium`、`IconCloseCircleFillRegular`、`IconCloseFillMedium`、`IconCloseFillRegular`、`IconCloseOutlineMedium`、`IconCloseOutlineRegular`、`IconCodeOutlineMedium`、`IconCodeOutlineRegular`、`IconCompactOutlineMedium`、`IconCompactOutlineRegular`、`IconCompareSplitOutlineMedium`、`IconCompareSplitOutlineRegular`
- `IconContextInjectionOutlineMedium`、`IconContextInjectionOutlineRegular`、`IconCopyOutlineMedium`、`IconCopyOutlineRegular`、`IconCordisPluginOutlineMedium`、`IconCordisPluginOutlineRegular`、`IconDarkOutlineMedium`、`IconDarkOutlineRegular`、`IconDatabaseOutlineMedium`、`IconDatabaseOutlineRegular`、`IconDataOutlineMedium`、`IconDataOutlineRegular`
- `IconDeliverDocMedium`、`IconDeliverDocRegular`、`IconDislikeFillMedium`、`IconDislikeFillRegular`、`IconDislikeOutlineMedium`、`IconDislikeOutlineRegular`、`IconDownloadOutlineMedium`、`IconDownloadOutlineRegular`、`IconEditOutlineMedium`、`IconEditOutlineRegular`、`IconEllipsisOutlineMedium`、`IconEllipsisOutlineRegular`
- `IconEnhanceOutlineMedium`、`IconEnhanceOutlineRegular`、`IconFlatListOutlineMedium`、`IconFlatListOutlineRegular`、`IconFolderCloseMedium`、`IconFolderCloseRegular`、`IconFolderOpenMedium`、`IconFolderOpenOutlineMedium`、`IconFolderOpenOutlineRegular`、`IconFolderOpenRegular`、`IconFollowsystemOutlineMedium`、`IconFollowsystemOutlineRegular`
- `IconFullscreenOutlineMedium`、`IconFullscreenOutlineRegular`、`IconGaugeOutlineMedium`、`IconGaugeOutlineRegular`、`IconGlobeOutlineMedium`、`IconGlobeOutlineRegular`、`IconGoalOutlineMedium`、`IconGoalOutlineRegular`、`IconInfoOutlineMedium`、`IconInfoOutlineRegular`、`IconInspectOutlineMedium`、`IconInspectOutlineRegular`
- `IconLightOutlineMedium`、`IconLightOutlineRegular`、`IconLikeFillMedium`、`IconLikeFillRegular`、`IconLikeOutlineMedium`、`IconLikeOutlineRegular`、`IconLinkOutlineMedium`、`IconLinkOutlineRegular`、`IconListPenOutlineMedium`、`IconListPenOutlineRegular`、`IconLoadingOutlineMedium`、`IconLoadingOutlineRegular`
- `IconMicrophoneOutlineMedium`、`IconMicrophoneOutlineRegular`、`IconNewChatOutlineMedium`、`IconNewChatOutlineRegular`、`IconNowrapFillMedium`、`IconNowrapFillRegular`、`IconPanelLeftOutlineMedium`、`IconPanelLeftOutlineRegular`、`IconPaperclipOutlineMedium`、`IconPaperclipOutlineRegular`、`IconPaperPlaneOutlineMedium`、`IconPaperPlaneOutlineRegular`
- `IconPauseOutlineMedium`、`IconPauseOutlineRegular`、`IconPersonalizationOutlineMedium`、`IconPersonalizationOutlineRegular`、`IconPinFillMedium`、`IconPinFillRegular`、`IconPinOutlineMedium`、`IconPinOutlineRegular`、`IconPlanOutlineMedium`、`IconPlanOutlineRegular`、`IconPlayOutlineMedium`、`IconPlayOutlineRegular`
- `IconPluginPinwheelOutlineMedium`、`IconPluginPinwheelOutlineRegular`、`IconPlusOutlineMedium`、`IconPlusOutlineRegular`、`IconProjectAddOutlineMedium`、`IconProjectAddOutlineRegular`、`IconProps`、`IconQuestionOutlineMedium`、`IconQuestionOutlineRegular`、`IconQueueOutlineMedium`、`IconQueueOutlineRegular`、`IconRefreshOutlineMedium`
- `IconRefreshOutlineRegular`、`IconRightUpOutlineMedium`、`IconRightUpOutlineRegular`、`IconSearchOutlineMedium`、`IconSearchOutlineRegular`、`IconSendOutlineMedium`、`IconSendOutlineRegular`、`IconSettingsOutlineMedium`、`IconSettingsOutlineRegular`、`IconShareOutlineMedium`、`IconShareOutlineRegular`、`IconShieldOutlineMedium`
- `IconShieldOutlineRegular`、`IconSkillOutlineMedium`、`IconSkillOutlineRegular`、`IconSlidersTwoOutlineMedium`、`IconSlidersTwoOutlineRegular`、`IconSparkleMedium`、`IconSparkleRegular`、`IconStopFillMedium`、`IconStopFillRegular`、`IconThinkOutlineMedium`、`IconThinkOutlineRegular`、`IconTrashOutlineMedium`
- `IconTrashOutlineRegular`、`IconTreeCornerMedium`、`IconTreeCornerRegular`、`IconTriangleRightFillMedium`、`IconTriangleRightFillRegular`、`IconUnarchiveOutlineMedium`、`IconUnarchiveOutlineRegular`、`IconUserOutlineMedium`、`IconUserOutlineRegular`、`IconUsersOutlineMedium`、`IconUsersOutlineRegular`、`IConversation`
- `IconWarningOutlineMedium`、`IconWarningOutlineRegular`、`IconWarningTriangleOutlineMedium`、`IconWarningTriangleOutlineRegular`、`IconWorkspaceTreeOutlineMedium`、`IconWorkspaceTreeOutlineRegular`、`IconWrapFillMedium`、`IconWrapFillRegular`、`IconWrapLinesOutlineMedium`、`IconWrapLinesOutlineRegular`、`IdMinter`、`ILayout`
- `ImageLightbox`、`ImageLightboxLabels`、`initialShortcutConfig`、`InjectFace`、`InjectParams`、`InlineEditor`、`Input`、`InputActions`、`InputControlOwnerProps`、`InputState`、`InputTriggerCandidate`、`InputTriggerController`
- `InputTriggerControllerDeps`、`InputTriggerCrumb`、`InputTriggerPick`、`InputTriggerService`、`InputTriggerServiceContract`、`InputTriggerSource`、`InputZone`、`insertionIndex`、`InsertReferenceRequest`、`InsertTextRequest`、`inspectRequestPrompt`、`installConnection`
- `isBehindModal`、`isDarwinDesktop`、`isFocusOp`、`ISidebarRight`、`isRunningTool`、`isSettledTool`、`isWebBindingAllowed`、`JobListActionProps`、`JobListInjected`、`JsonBlock`、`JsonTree`、`JsonTreeLabels`
- `JsonTreeProps`、`KeyedHooksSources`、`KeyedSnapshotSelectorHook`、`KeyedStandardSource`、`KeyPropsOf`、`KindOptions`、`KnownContextForm`、`languageForPath`、`LanguageOptionRow`、`LanguageRegistration`、`LanguageRowComponentProps`、`LanguageRowInjected`
- `LanguageRowState`、`LayoutController`、`LayoutNode`、`LayoutOp`、`LayoutState`、`LEGACY_EXPANDED_TRANSCRIPT_VIEW_MODE`、`LEGACY_TRANSCRIPT_VIEW_MODE`、`LegacyConversationSlice`、`LevelState`、`LinkIconKind`、`LinkIconMedium`、`LinkIconProps`
- `LinkIconRegular`、`ListWorkspaceDirectory`、`LiveCompositionNode`、`LiveFactoryNode`、`LiveSlotNode`、`LiveSlotOccupant`、`LOCALE_IDS`、`LOCALE_PREFERENCE_FIELD`、`LOCALE_SETTINGS_NAMESPACE`、`LocaleDefinition`、`LocaleDict`、`LocaleDictOf`
- `LocaleFace`、`LocaleId`、`LocaleKeysOf`、`LocaleNamespaceMap`、`LocaleRuntime`、`LocaleSettings`、`LocaleSnapshot`、`MainPanelId`、`ManualCompactionChatData`、`MarkdownCodeLabels`、`MarkdownDelegate`、`MarkdownDelegateProvider`
- `MarkdownDelegateProviderProps`、`MarkdownExternalLinkHandler`、`MarkdownFileMentions`、`MarkdownLabels`、`MarkdownPathImages`、`MarkdownPlainTextMode`、`MarkdownPlainTextOptions`、`MarkdownText`、`MatchedShare`、`MAX_DOCK_PANES`、`MaybeSnapshotSelectorHook`、`Menu`
- `MenuEntry`、`MenuEvent`、`MenuGroup`、`MenuItem`、`MenuItemButton`、`MenuItemButtonProps`、`MenuKey`、`MenuLabel`、`MenuOpenState`、`MenuReduce`、`MenuSeparator`、`MenuState`
- `MenuSurface`、`MenuSurfaceProps`、`MenuViewInjected`、`MenuViewProps`、`MessageFeedbackActionFailure`、`MessageFeedbackActionProps`、`MessageFeedbackActionResult`、`MessageFeedbackInjected`、`MessageFeedbackKey`、`MessageFeedbackStatus`、`MessageFeedbackView`、`MessageId`
- `MessageImageLabels`、`MessageImageLoader`、`MessageImagesContentInput`、`MessageImageSource`、`MessageImagesOwnerProps`、`MessageImagesProps`、`MIN_PANE_FRACTION`、`Mint`、`Modal`、`modalSelector`、`ModelDirectory`、`ModelDirectoryResolver`
- `ModelDirectoryState`、`ModelDiscoveryOutcome`、`ModelKey`、`ModelLabelOwner`、`ModelRetryNode`、`ModelSelectInjected`、`ModelsFooterOwnerProps`、`ModelsKey`、`ModelsOperations`、`ModelsSectionInjected`、`ModelsSectionProps`、`ModelsSettingsState`
- `ModsBandKey`、`movedRect`、`NodeChange`、`NodeId`、`NodeKey`、`NodeReference`、`normalizeBinding`、`NormalizedBinding`、`notifySubscribers`、`NS`、`ObservableSnapshot`、`observeComposition`
- `observeStickyMenuGroups`、`OfficialItem`、`OnboardingPage`、`OpenContentInput`、`OpenContentIntent`、`OpenFileOptions`、`OpenInAppActionInjected`、`OpenInAppActionProps`、`OpenInAppPathAction`、`OpenInAppPathFailure`、`OpenInAppPathRemote`、`OpenPathActionProps`
- `OpenPathEmptyActionProps`、`OpenPathInjected`、`orderByModuleGraph`、`overlappingBindings`、`OwnerOf`、`PaneAttachment`、`PaneHost`、`PaneId`、`PANEL_ID`、`PanelInfo`、`PaneMeasure`、`PaneNode`
- `parseBinding`、`parseBootManifest`、`parseDshClient`、`parseShortcutDefinitions`、`parseShortcutDocument`、`parseShortcutEdit`、`PartialAssistant`、`passedThreshold`、`PathLabel`、`Peer`、`PeerAdmission`、`PeerId`
- `PeerOptions`、`PeerScope`、`PendingApproval`、`PendingInteractionPublisher`、`PendingQuestion`、`PermissionCatalogState`、`PermissionDefaultOption`、`PermissionIconAutoReviewMedium`、`PermissionIconAutoReviewRegular`、`PermissionIconFullAccessMedium`、`PermissionIconFullAccessRegular`、`PermissionIconReadOnlyMedium`
- `PermissionIconReadOnlyRegular`、`PermissionIconWorkspaceWriteMedium`、`PermissionIconWorkspaceWriteRegular`、`PermissionRowInjected`、`PermissionRowProps`、`PermissionSelectInjected`、`PermissionSelectProps`、`PermissionSettingsState`、`PickOutcome`、`PickVia`、`Pill`、`PinResource`
- `planAddTab`、`PlanChipInjected`、`planDropTab`、`planDuplicateTab`、`planFloatTab`、`PlanKey`、`PlannedTab`、`planOpenContent`、`planPlaceTab`、`planResizeSplit`、`PlanReview`、`planSetExpanded`
- `planSetMode`、`planSettle`、`planSplitPane`、`planUnfloatPane`、`PLATFORM_MODULES`、`PlatformModule`、`PluginActivationOwnerProps`、`PluginAddActionsProps`、`PluginArtworkDefault`、`PluginArtworkLoop`、`PluginArtworkSearch`、`PluginArtworkSubagent`
- `PluginArtworkTerminal`、`PluginConfigViewProps`、`PluginDetailProps`、`PluginInventoryLocaleKey`、`PluginInventorySettingsTabInjected`、`PluginInventorySettingsTabProps`、`PluginManagerFace`、`PluginManagerLocaleKey`、`PluginManagerPageProps`、`PluginMarketLocaleKey`、`PluginPackageRef`、`PluginRowRef`
- `PluginsEventFrame`、`PluginsSettingsSectionInjected`、`PluginsSettingsSectionProps`、`PluginsSubject`、`PluginTabInstall`、`PluginTabProps`、`pointerModality`、`PopupSearchLabels`、`PopupSearchMode`、`PopupSelectController`、`PopupSelectDeps`、`PopupSelectInjected`
- `PopupSelectSpec`、`PopupSelectViewProps`、`PopupSpec`、`PopupState`、`PRELOADED_CLIENT_EXTERNALS`、`PreparingToolCall`、`PresentationInjected`、`presentBinding`、`PresetView`、`Principal`、`ProcessActivity`、`ProcessActivitySummary`
- `ProcessGroupData`、`ProductEvent`、`ProductEventMap`、`PromptFileBinding`、`PropsHooks`、`PropsKeyedHooks`、`PropsLocale`、`PropsRenderFactories`、`PropsRenderSlots`、`PropsRuntime`、`PropsSlotHooks`、`PropsStore`
- `ProviderCardExtrasOwnerProps`、`ProviderDirectoryEntry`、`ProviderRow`、`QuestionAnswer`、`QuestionComposerProps`、`QuestionKey`、`QuestionWait`、`QuotaNoticeCode`、`QuotaNoticeHostProps`、`QuotaNoticeInjected`、`QuotaNoticeOwnerProps`、`QuotaNoticeState`
- `rankByName`、`ReadBlock`、`ReadBlockLabels`、`ReadBlockLine`、`ReadBlockProps`、`ReadDocumentBytes`、`ReadWorkspaceFilePage`、`ReasoningBodyOwnerProps`、`ReasoningContentInput`、`record`、`recordedOps`、`Rect`
- `ReferenceChip`、`ReferenceChipProps`、`ReferenceCodec`、`ReferenceIconKind`、`ReferenceIconMedium`、`ReferenceIconProps`、`ReferenceIconRegular`、`ReferenceInsert`、`refreshIfLoaded`、`RegisterFactory`、`RegisterFactoryOptions`、`relativeTime`
- `RelativeTime`、`RelativeTimeUnit`、`RemoteInvocation`、`RenderEntry`、`RenderFactorySlot`、`RenderOpts`、`replay`、`RequestInspectionSnapshot`、`RequestPromptChange`、`RequestPromptInspection`、`RequestPromptInspector`、`RequestView`
- `resizedRect`、`resolveShortcutDefault`、`resolveSlotLabel`、`ResourceOpenContext`、`ResourceProtocol`、`ResourceProtocolMap`、`ResourceProvider`、`Resources`、`ResourceSnapshot`、`ResourceStatus`、`RetryChatData`、`RightbarOwnerProps`
- `RightbarSeatProps`、`RiskConfirmation`、`RiskConfirmationProps`、`RootOwnerProps`、`RootStandardSourceContribution`、`RowToast`、`rpcErrorSchema`、`RpcFetch`、`RpcId`、`rpcIdSchema`、`RpcMessage`、`rpcMessageSchema`
- `RpcRequest`、`RpcResponse`、`RpcResult`、`rpcResultSchema`、`RunningToolCall`、`SchemaNode`、`ScopedStandardSourceBinding`、`ScopeOf`、`ScopeStandardProps`、`SearchBlock`、`SearchBlockLabels`、`SearchBlockLineMatch`
- `SearchBlockProps`、`SearchFileGroup`、`SearchMatchesBlockProps`、`SearchPathsBlockProps`、`SegmentedControl`、`SegmentedControlOption`、`SegmentedTab`、`SegmentedTabs`、`SelectConfirmation`、`SelectOption`、`SelectOptionGroup`、`Sequencer`
- `ServerResponse`、`serverResponseSchema`、`SessionAreaProps`、`SessionEvent`、`SessionFile`、`SessionId`、`SessionIdOf`、`SessionInput`、`SessionInputResolver`、`SessionMaybeStandardProps`、`SessionPendingInteraction`、`SessionPendingInteractionBase`
- `SessionPendingInteractionMap`、`SessionProviderComponent`、`SessionRenameTarget`、`SessionRowOwnerProps`、`SessionRowScheduleOwnerProps`、`SessionSnapshotSelector`、`SessionSourceContribution`、`SessionSourceDescriptor`、`SessionStandardProps`、`SessionStatus`、`SessionStatusSnapshot`、`SETTINGS_NS`
- `SettingsDescribeFace`、`SettingsDescribeView`、`SettingsDocumentActionInjected`、`SettingsDocumentActionProps`、`SettingsDocumentState`、`SettingsDocumentStore`、`SettingsFieldProps`、`SettingsFieldSpec`、`SettingsFieldState`、`SettingsFieldWrite`、`SettingsForm`、`SettingsFormActions`
- `SettingsFormLabels`、`SettingsFormModel`、`SettingsFormPathOp`、`SettingsFormProps`、`SettingsFormScope`、`SettingsFormScopeSnapshot`、`SettingsFormShell`、`SettingsGeneralItemOwnerProps`、`SettingsHeaderOwnerProps`、`SettingsKey`、`SettingsLauncherOwnerProps`、`SettingsMirrorSnapshot`
- `settingsNumberField`、`SettingsOnboardingOwnerProps`、`SettingsPluginsTabOwnerProps`、`SettingsSchemaService`、`SettingsSecretField`、`SettingsSecretSpec`、`SettingsSectionOwnerProps`、`settingsTextField`、`SettingsTriggerOwnerProps`、`SettingsValueField`、`SettingsWriteOutcome`、`shallowEqual`
- `ShellCardFace`、`ShellCardProps`、`ShellCardState`、`ShellSettings`、`ShellSettingsLocaleKey`、`SHIELD_OUTLINE_PATH`、`ShortcutBinding`、`ShortcutCatalogEntry`、`ShortcutCommand`、`ShortcutCommandId`、`ShortcutConfigSnapshot`、`ShortcutContext`
- `ShortcutDefinition`、`ShortcutDocument`、`ShortcutEdit`、`ShortcutFixedCatalogEntry`、`ShortcutFixedCommand`、`ShortcutFixedInput`、`ShortcutGesture`、`ShortcutKeys`、`ShortcutModifier`、`ShortcutPersistence`、`ShortcutPlatform`、`ShortcutProfile`
- `ShortcutRevision`、`ShortcutRuntime`、`Shortcuts`、`ShortcutSaveResult`、`ShortcutStorage`、`SidebarAnalyticsEntry`、`SidebarAnalyticsPosition`、`SidebarBrandMarkOwnerProps`、`SidebarBrandNameOwnerProps`、`SidebarBrowserKey`、`SidebarDocumentPreviewKey`、`SidebarFilesKey`
- `SidebarFooterActionOwnerProps`、`SidebarKey`、`SidebarOwnerProps`、`SidebarPanelActionEntry`、`SidebarPanelActionsOwnerProps`、`SidebarPanelIconOwnerProps`、`SidebarPanelMetadata`、`SidebarRightCloseHandler`、`SidebarRightGuideActionEntry`、`SidebarRightGuideActionsOwnerProps`、`SidebarRightGuideBox`、`SidebarRightGuideEntry`
- `SidebarRightGuideEntryOwnerProps`、`SidebarRightInjected`、`SidebarRightKey`、`SidebarRightNavigationParams`、`SidebarRightNavigator`、`SidebarRightOccurrenceId`、`SidebarRightOpenResourceOptions`、`SidebarRightOpenTab`、`SidebarRightOpenTabOptions`、`SidebarRightPlacement`、`SidebarRightPresentation`、`SidebarRightResourceParams`
- `SidebarRightResourceParamsMap`、`SidebarRightState`、`SidebarRightTabActions`、`SidebarRightTabClaim`、`SidebarRightTabDefinition`、`SidebarRightTabInfo`、`SidebarRightTabInjected`、`SidebarRightTabMenuOwnerProps`、`SidebarRightTabNavigation`、`SidebarRightTabParams`、`SidebarRightTabParamsFor`、`SidebarRightTabParamsMap`
- `SidebarRightTabPlacement`、`SidebarRightTabPriority`、`SidebarRightTarget`、`SidebarRootComponentProps`、`SidebarRootInjected`、`SidebarSectionOwnerProps`、`SidebarSettingsOwnerProps`、`Size`、`SlotComponent`、`SlotCore`、`SlotEntryDef`、`SlotFactoryDef`
- `SlotFactoryMap`、`SlotHookFactory`、`SlotInjectFace`、`SlotInjectOf`、`SlotKind`、`SlotLabel`、`SlotMap`、`SlotOwnershipError`、`SlotRegistry`、`SlotRenderer`、`SlotRendererHost`、`SlotScope`
- `SlotScopeAdapter`、`SlotScopeTargetMap`、`SlotSpec`、`SnapshotSelectorHook`、`SnapshotStore`、`SourceRoster`、`SPLIT_MINIMUMS`、`SplitAxis`、`SplitDirection`、`SplitId`、`SplitMinimums`、`SplitNode`
- `StaleAuthorizationError`、`standardHookPropName`、`StandardPropsOf`、`StandardSourceBinding`、`StartedToolCall`、`StartedToolCallViewProps`、`StartSessionOptions`、`StateDot`、`StateDotState`、`SteeringMessageNode`、`stepBack`、`stepForward`
- `StepLocation`、`StoreDecl`、`StoredEntry`、`StoredFactory`、`StoreFactory`、`StoreHandle`、`StoreInstance`、`StoreInstanceLike`、`StoreSpec`、`StreamChunk`、`stripClientSuffix`、`SUBAGENT_NS`
- `SubagentCardFace`、`SubagentCardProps`、`SubagentCatalogActionProps`、`SubagentCatalogInjected`、`SubagentHeaderLineageProps`、`SubagentLimitsCardFace`、`SubagentLimitsCardState`、`SubagentLimitsSettings`、`SubagentModelSelectionCardFace`、`SubagentModelSelectionCardState`、`SubagentModelSelectionSettings`、`SubagentReadOnlyComposerProps`
- `SubagentReadOnlyMatch`、`SubagentSettingsLocaleKey`、`SubmitAttachment`、`SubmitEnvelope`、`SubmitOutcome`、`SurfaceActions`、`SurfaceState`、`Switch`、`SystemPromptInspector`、`SystemPromptNode`、`SystemPromptState`、`TabFactory`
- `TabId`、`TabMenuExtras`、`TabOccurrence`、`TabRecord`、`TabRenderer`、`Tag`、`TagTone`、`TeamActionInjected`、`TeamActionProps`、`TeamKey`、`tearDownEntryFiber`、`TerminalBlock`
- `TerminalBlockLabels`、`TerminalBlockProps`、`TextInjected`、`TextPage`、`TextPreviewProps`、`TextShimmer`、`TextShimmerProps`、`TextState`、`TextStore`、`TextTabState`、`THEME_PREFERENCE_FIELD`、`THEME_PREFERENCES`
- `THEME_SETTINGS_NAMESPACE`、`ThemeDefinition`、`ThemeKey`、`ThemePreference`、`ThemeRuntime`、`ThemeSettings`、`ThemeSnapshot`、`ThemeTokenInspection`、`ThemeTokenModes`、`ThemeTokenOverrides`、`ThemeTokens`、`Toast`
- `TodoItem`、`TokenSegment`、`TokenSpan`、`ToolArgs`、`ToolCallBlock`、`ToolCallCommonProps`、`ToolCallId`、`ToolCallOwnerProps`、`ToolCallPhaseProps`、`ToolCallViewProps`、`ToolChatData`、`ToolHostInfoInjected`
- `ToolResultNode`、`Tooltip`、`TooltipSide`、`ToolTreeProps`、`topRightPaneId`、`TrackProductEvent`、`TrajectoryContribution`、`TrajectoryConversationViewNode`、`TrajectoryKey`、`TrajectoryRequestHeaderState`、`TrajectorySnapshot`、`TRANSCRIPT_VIEW_FIELD`
- `TRANSCRIPT_VIEW_MODES`、`TranscriptViewMode`、`TranscriptViewRowInjected`、`TranscriptViewRowProps`、`Translate`、`TranslateNS`、`TranslationBodyInjected`、`TranslationBodyProps`、`TranslationFormInjected`、`TranslationFormState`、`transportError`、`TriggerChar`
- `TriggerContentProps`、`TriggerGuard`、`TriggerHit`、`TriggerPosition`、`TurnErrorNode`、`TurnLocation`、`TurnMaxTokensNode`、`TurnNavigationItem`、`TurnProcessChatData`、`TurnProcessOwnerProps`、`TurnProcessSpec`、`TurnProcessViewEntry`
- `TurnTailChatData`、`TurnTailOwnerProps`、`UiConversation`、`UiRendererService`、`UiSession`、`UiWorkspace`、`UnknownSurfaceNode`、`UnsupportedImageMediaTypeError`、`useAnchoredMaxHeight`、`useAnchoredPosition`、`UseChat`、`UseChatNodeTurnData`
- `useCodeHighlighter`、`UseConversation`、`UseConversationViews`、`UseDisclosure`、`useDismissOnOutsidePointer`、`UseFactorySlot`、`UseGroupAction`、`UseGroupHeaderAction`、`UseMenuOpenState`、`useModalLayer`、`UsePanelInfo`、`UsePresentation`
- `UserContentAttachment`、`UserContentData`、`UserContentInput`、`UseResource`、`UserMessageNode`、`UserQuestionPanels`、`UserQuestionRecord`、`UserTextDataMap`、`UserTextDocumentInput`、`UserTextEvaluator`、`UserTextFacts`、`UserTextId`
- `UserTextInjected`、`UserTextInput`、`UserTextNode`、`UserTextNodeOwnerProps`、`UserTextNodeProps`、`UserTextRegistry`、`UserTextRule`、`UserTextRun`、`UserTextRunProps`、`UserTextTransformContext`、`UseSession`、`UseSessionRetainInfo`
- `UseSessions`、`UseSessionStatus`、`UseSidebarRightTabInfo`、`UseTrajectory`、`ViewTab`、`WebApiSettings`、`WebBlock`、`WebBlockLabels`、`WebBlockProps`、`WebBootBatch`、`WebBootBatchPhase`、`WebBootEntry`
- `WebBootGraph`、`WebBootRelease`、`WebFetchBlockProps`、`WebProviderSelection`、`WebSearchBlockProps`、`WebSearchCardFace`、`WebSearchCardProps`、`WebSearchCardScopes`、`WebSearchCardState`、`WebSearchSettings`、`WebSearchSettingsLocaleKey`、`WebSourceView`
- `WorkspaceBrowserInjected`、`WorkspaceBrowserProps`、`WorkspaceFilesListRemote`、`WorkspaceFilesReadRemote`、`WorkspaceKey`、`WorkspacePickerInjected`、`WorkspacePickerProps`、`writeClipboard`、`writeDefaultPreset`、`zoneAt`、`zoneInRect`、`zoneSplit`

### Infra

- `acceptedThrough`、`AccountBonusBatch`、`AccountBonusNotification`、`AccountBonusOrderId`、`AccountClientMetadata`、`AccountController`、`AccountDetails`、`AccountLinks`、`AccountProfile`、`AccountUserId`、`AccountView`、`AccountWallet`
- `ACL_DIAGNOSIS_SKILL`、`AclSandbox`、`AclSandboxChild`、`AclSandboxChildResult`、`AclSandboxOptions`、`AclSandboxSpawnOptions`、`AclWriteGrant`、`ACP_APP_STARTUP_SERVICE`、`admitEncodedFile`、`admitEncodedImages`、`AdmittedPromptContentPart`、`adoptSessionEvent`
- `AfterScheduleRecord`、`Agent`、`AgentCancelCause`、`agentCarrier`、`AgentContext`、`AgentDefaultModelConfig`、`AgentEventDispatch`、`agentEvents`、`AgentFactory`、`AgentHandle`、`AgentLoop`、`AgentOptions`
- `AgentPreset`、`AgentPresetDocument`、`AgentPresetInspection`、`AgentPresetPluginGroup`、`AgentPresetPluginRow`、`agentPresetProjectionDefinition`、`AgentPresetRegistry`、`AgentPresetRoster`、`AgentPresetRow`、`AgentRegistry`、`AGENTS_HOME_DIR_NAME`、`AGENTS_HOME_ENV`
- `AgentScopeHandle`、`AgentSetup`、`AgentSetupCommit`、`agentsHomeDisplay`、`AgentStatus`、`AgentSubjectEvent`、`allocPtrSlot`、`allocUint32`、`anchorPathSpec`、`AnonymousEntries`、`API_REMOTE_FORWARDED_EVENTS`、`ApiKeyRecord`
- `ApiRemoteForwardedEvent`、`ApiSessionNotFound`、`appendPluginRecord`、`AppExit`、`apply`、`applyEntryPatches`、`applyGlobTool`、`applyGrepTool`、`applyWebFetchTool`、`applyWebSearchTool`、`AppReady`、`ApprovalRequestId`
- `approveEscalation`、`AppStdin`、`ArchiveSessionOptions`、`ArrayValueSchemaSpec`、`AssembleContext`、`assembleContextFor`、`AssembledContext`、`AssembledSection`、`assertContiguous`、`assertObjectJsonSchema`、`assertServiceableBashConfig`、`assertServiceablePwshConfig`
- `assertSessionHeadersCompatible`、`assertStoredId`、`assertSupportedJsonSchema`、`assertTempRootOutsideWorkspace`、`assertVersion`、`AssistantLiveChunkEvent`、`AssistantMessage`、`AssistantStreamFrame`、`AtInput`、`AtScheduleRecord`、`AttachmentAdmissionPart`、`AttachmentError`
- `AttachmentErrorCode`、`AttachmentId`、`AttachmentIdType`、`AttachmentStore`、`attributeFailure`、`auditRows`、`AuthorizationDeclinedError`、`AuthorizationEntry`、`AuthorizationError`、`AuthorizationFlow`、`AuthorizationInteraction`、`AuthorizationMethod`
- `AuthorizationNotice`、`AuthorizationOutcome`、`AuthorizationPrompt`、`AuthorizationPromptOption`、`AuthorizationRequest`、`AuthorizationService`、`AuthorizationSession`、`AuthorizationSettlement`、`AuthorizationStatus`、`BACKEND_PACKAGES`、`BackendRegistry`、`BashEnvContributor`
- `BashEnvVariable`、`BashEnvVariableInfo`、`BashTerminalBackend`、`BeginSubmissionInput`、`bindScopeParent`、`bindTypertRemote`、`BooleanValueSchemaSpec`、`boot`、`BrowserUseProviderName`、`BrowserUseRegistry`、`buildForkSeed`、`buildGlobCommand`
- `buildGrepCommand`、`buildModelCatalog`、`buildSessionEventRecords`、`buildSessionEventSearchDocuments`、`BuiltInPresetCopyKey`、`BundleInfo`、`bundleManifest`、`bundlePatchFiles`、`bundlePatchPaths`、`BundleRowInfo`、`cancelledFailure`、`CancelOptions`
- `candidatePwshPaths`、`canExecute`、`canonicalHeader`、`canonicalizeCronExpression`、`canonicalizeWatchPath`、`canonicalizeWorkspace`、`canonicalPath`、`canPassThroughNormalization`、`carrierFailure`、`carrierKeyOf`、`ChangeResult`、`checkpointIdentity`
- `CheckpointIdentity`、`checkpointRecord`、`CheckpointRecord`、`checkpointRow`、`clampTimeout`、`classifyInstallFailure`、`classifyRunnerFailure`、`clearedProxyEnv`、`ClientCordisInspectHost`、`ClientCordisInspectProviderRegistration`、`ClientCordisInspectQueryContext`、`ClientCordisInspectRegistry`
- `ClientRemote`、`ClientRemoteAccess`、`ClientSessionPageRequest`、`ClientTerminals`、`ClientTimerService`、`ClientWorkspaceModel`、`closeHandleChecked`、`CmdlineArgs`、`CmdlineHost`、`CodeRunFailedError`、`ColdSessionLog`、`CollectedOutput`
- `ColorSupportLevel`、`commitPreparedImageFile`、`compileSessionTextFilter`、`CompletionDelivery`、`composeEntries`、`ComputerUseProviderName`、`ComputerUseRegistry`、`Config`、`ConfigEditor`、`CONFIGURED_AGENT_IDENTITIES_KEY`、`ConfiguredAgentIdentities`、`ConfinedArgv`
- `ConfinedSandboxMode`、`ConnectionHandle`、`ConnectionSinks`、`ConsoleExporter`、`ConsumedWork`、`ContentBlock`、`ContentToolFixtureOptions`、`Context`、`CordisActionResult`、`CordisActionRowProps`、`CordisCardFace`、`CordisDefineRowProps`
- `CordisDynamicPackageId`、`CordisDynamicPluginId`、`CordisDynamicPluginRunId`、`CordisDynamicPort`、`CordisDynamicRunMode`、`CordisErrorDetails`、`CordisHalfState`、`CordisInspectMethodManifest`、`CordisInspectPlatform`、`CordisInspectProviderManifest`、`CordisInspectProviderView`、`CordisInspectQueryRequest`
- `CordisInspectQueryResolution`、`CordisInspectQueryResolved`、`CordisInspectRegistryService`、`CordisInspectRequestId`、`CordisInspectResolveAck`、`CordisInventoryRow`、`CordisKey`、`CordisObservable`、`CordisPanelFace`、`CordisRunActivity`、`CordisRunCardFace`、`CordisRunCardPointer`
- `CordisRunCardStore`、`CordisRunDiagnostic`、`CordisRunFailure`、`CordisRunHostSeam`、`CordisRunnerFace`、`CordisRunOrchestrator`、`CordisRunOrchestratorEnv`、`CordisRunRequest`、`CordisRunRowProps`、`CordisRunStatus`、`CordisToolViewKey`、`CordisToolViewOwnerProps`
- `CordisUserRunRequest`、`createAfterScheduleRecord`、`CreateAgentOptions`、`createAtScheduleRecord`、`createCronScheduleRecord`、`createDailyScheduleRecord`、`createEveryScheduleRecord`、`createScope`、`CreateScopeOptions`、`createSessionControlStream`、`createSessionFormatCatalog`、`createSessionFormatCatalogWithChildren`
- `createSessionFormatChain`、`CreateSessionOptions`、`createTypertRemoteInfo`、`createWeeklyScheduleRecord`、`createWorkspaceStateStream`、`CredentialInfo`、`credentialKey`、`CredentialKey`、`credentialKeyId`、`credentialKeyScope`、`CredentialProvider`、`CredentialRecord`
- `CredentialRecordEntry`、`CredentialRecordInfo`、`credentialRef`、`CredentialRef`、`CREDENTIALS_FILENAME`、`CredentialsController`、`CredentialsDocument`、`CronInput`、`CronScheduleRecord`、`currentSessionMessageProjections`、`CurrentTokenProcessBindings`、`CurrentTokenProcessSpawnOptions`
- `CurrentTokenStdioFileDescriptors`、`DailyInput`、`DailyScheduleRecord`、`deadline`、`Deadline`、`decodePtr`、`decodeScheduleChange`、`decodeScheduleRecord`、`decodeSeqRanges`、`decodeUint32`、`DEEPSEEK_DEFAULT_API_VERSION`、`DEEPSEEK_DEFAULT_BASE_URL`
- `DEEPSEEK_DEFAULT_COUNT`、`DEEPSEEK_DEFAULT_MAX_TOKENS`、`DEEPSEEK_DEFAULT_MAX_USES`、`DEEPSEEK_DEFAULT_MODEL`、`DEEPSEEK_FETCH_API_PROVIDER_ID`、`DEEPSEEK_PROVIDER_ID`、`DEEPSEEK_SEARCH_API_PROVIDER_ID`、`DEEPSEEK_WEB_API_BASE_URL`、`DeepSeekAccount`、`DeepSeekFetchApiOptions`、`DeepSeekFetchApiProvider`、`DeepSeekHarness`
- `DeepSeekHarnessOptions`、`DeepSeekSearchApiOptions`、`DeepSeekSearchApiProvider`、`DeepSeekSearchLlmRequest`、`DeepSeekSearchProvider`、`DeepSeekSearchProviderOptions`、`DeepSeekSessionLogExtension`、`DeepSeekSessionLogWireEvent`、`DeepSeekSessionLogWireHeader`、`DeepSeekSessionLogWireSurfaceOp`、`default`、`DEFAULT_AGENTS_HOME_DISPLAY`
- `DEFAULT_DSH_HOME_DISPLAY`、`DEFAULT_FETCH_MAX_OUTPUT_CHARS`、`DEFAULT_IMAGE_COMPRESSION_CONCURRENCY`、`DEFAULT_LSP_TOOL_TIMEOUT_MS`、`DEFAULT_MAX_IMAGE_BYTES`、`DEFAULT_MAX_IMAGE_DIMENSION`、`DEFAULT_MAX_IMAGE_PIXELS`、`DEFAULT_MAX_IMAGES_PER_MESSAGE`、`DEFAULT_MAX_LOCATIONS`、`DEFAULT_MAX_MESSAGE_IMAGE_BYTES`、`DEFAULT_MAX_PARALLEL_TOOL_CALLS`、`DEFAULT_MAX_RESULT_CHARS`
- `DEFAULT_NORMALIZED_IMAGE_MAX_BYTES`、`DEFAULT_NORMALIZED_IMAGE_MAX_DIMENSION`、`DEFAULT_NORMALIZED_IMAGE_MAX_PIXELS`、`DEFAULT_ROOT_PREFIX`、`DEFAULT_SESSION_LOG_COMPRESSION_LEVEL`、`DEFAULT_SHUTDOWN_TIMEOUT_MILLIS`、`DEFAULT_TELEMETRY_MODE`、`DEFAULT_USER_AGENT`、`DEFAULT_WEB_TOOL_TIMEOUT_MS`、`DEFAULT_WORKSPACE_DIRECTORY`、`defaultAgentsHome`、`defaultDshHome`
- `defineContentToolFixture`、`defineDomain`、`defineSessionFormatMigration`、`defineTool`、`DefineToolOptions`、`DeliveryRetentionBounds`、`deriveEventMessage`、`describeOmitted`、`descriptorOf`、`desktopClientHeaders`、`DeveloperMessage`、`DiffCallView`
- `DiffResultView`、`DirectoryEntry`、`DirectoryListing`、`DirectoryPicker`、`DirectoryPickerBackendKind`、`DirectoryPickerBrowseCapability`、`DirectoryPickerCapabilities`、`DirectoryPickerCapability`、`DirectoryPickerController`、`DirectoryPickerEnv`、`DirectoryPickerError`、`DirectoryPickerErrorCode`
- `DirectoryPickerHostFacts`、`DirectoryPickerInternals`、`DirectoryPickerNativeCapability`、`DirectoryPickerRunner`、`discoverDefaultRoots`、`DispatchMode`、`Disposable`、`DOCUMENT_VERSION`、`Domain`、`DomainChanged`、`DomainError`、`DomainErrorCode`
- `DomainErrorOptions`、`DomainFacility`、`DomainGlobal`、`DomainGlobalHandleOf`、`DomainGlobalSpec`、`DomainSpec`、`domainTable`、`DomainTableSpec`、`doneSchema`、`drainPipe`、`DSH_ENV_PREFIX`、`DSH_HOME_DIR_NAME`
- `DSH_HOME_ENV`、`DshBundleManifest`、`dshCachePath`、`DshClientManifest`、`DshEnginesManifest`、`DshEnvironment`、`DshEnvironmentKey`、`dshHomeDisplay`、`dshHomePath`、`DshManifest`、`DshPackageManifest`、`DshProfileManifest`
- `DynamicCordisClientHalf`、`DynamicCordisClientSource`、`DynamicCordisClosureEnv`、`dynamicCordisContext`、`DynamicCordisDefineReceipt`、`DynamicCordisDefineRequest`、`DynamicCordisDefinition`、`DynamicCordisEvaluatedPlugin`、`DynamicCordisGuardEnv`、`DynamicCordisHandler`、`DynamicCordisHostHalfResult`、`DynamicCordisInventoryPackage`
- `DynamicCordisInventoryRow`、`DynamicCordisInvokeResult`、`DynamicCordisLivePackage`、`DynamicCordisLoadErrorCause`、`DynamicCordisLoadResult`、`DynamicCordisPackage`、`DynamicCordisPackageInspection`、`DynamicCordisPackageRunner`、`DynamicCordisPlugin`、`DynamicCordisPluginInspection`、`DynamicCordisReference`、`DynamicCordisRenderFailure`
- `DynamicCordisRequestResolved`、`DynamicCordisResolveAck`、`DynamicCordisRetracted`、`DynamicCordisRun`、`DynamicCordisRunAttempt`、`DynamicCordisRunnerEnv`、`DynamicCordisRunnerService`、`DynamicCordisRunRequest`、`DynamicCordisRunResolution`、`DynamicCordisRunResponse`、`DynamicCordisSlotLedgerRow`、`DynamicCordisSnapshotRow`
- `DynamicCordisStopResponse`、`DynamicCordisStyles`、`DynamicCordisUndefineReceipt`、`editResultSchema`、`editSchema`、`Effect`、`emitAgentEvent`、`EncodedFileAttachment`、`EncodedImageAttachment`、`encodeMessage`、`encodeSegment`、`encodeSeqRanges`
- `ENCODING_PREAMBLE`、`entriesSchema`、`Entry`、`EntryGroup`、`entryListProblem`、`entryListSchema`、`EntryOptions`、`EntryTree`、`ENV_OVERRIDES`、`environmentSchema`、`EpochHeader`、`ERROR_INSUFFICIENT_BUFFER`
- `ESCALATION_TARGETS`、`EscalationApproval`、`EscalationApprover`、`escalationHintMarker`、`EscalationOutcome`、`EscalationRequest`、`evaluate`、`evaluateClientHalf`、`evaluatePluginCompatibility`、`EventLogOptions`、`EventLogReporter`、`EventOptions`
- `Events`、`EventsService`、`EveryScheduleDispatchChange`、`EveryScheduleRecord`、`EXA_DEFAULT_BASE_URL`、`EXA_DEFAULT_HIGHLIGHTS_PER_RESULT`、`EXA_DEFAULT_SEARCH_TYPE`、`EXA_PROVIDER_ID`、`ExaSearchProvider`、`ExaSearchProviderOptions`、`executeSessionTitleLlm`、`exitOnStdinEnd`
- `expandHomePath`、`Exporter`、`extendWin32ProcessBindings`、`extractSessionEventText`、`fallbackSessionTitle`、`FEEDBACK_CATEGORIES`、`FeedbackCategory`、`FeedbackRecord`、`fetchMetaFromResult`、`fetchMetaFromValue`、`Fiber`、`FiberState`
- `FileAttachmentRef`、`FileDiff`、`FileLocation`、`FileReferenceCandidate`、`FileSystem`、`filterSessionEventDocuments`、`filterSessionResults`、`finalExtension`、`findWorkspaceRoot`、`flushLiveSessionLog`、`foldConsumedWork`、`foldRequestHeader`
- `foldScheduleEvents`、`foldSessionTitle`、`foldSurface`、`foregroundSchema`、`formatFetchOutput`、`formatGlobOutput`、`formatGrepMatches`、`formatGrepOutput`、`formatHover`、`formatLocations`、`formatRetentionNotice`、`formatSearchOutput`
- `formatSpillNotice`、`FrequencyTooHighError`、`FsDirEntry`、`FsEditOutcome`、`FsEditRequest`、`FsError`、`FsErrorCode`、`FsInfo`、`FsObservation`、`FsObservationActor`、`FsPathInfo`、`FsTarget`
- `FsTargetKey`、`FsVersion`、`FsWriteIntent`、`FsWriteOutcome`、`GenericCallView`、`GenericResultView`、`getDshRuntimeVersion`、`GLOB_MAX_RESULTS`、`GLOB_VCS_EXCLUDES`、`GlobalValueOf`、`GlobInput`、`GlobSample`
- `GlobToolCaps`、`GrantRecord`、`GREP_MAX_LINE_BYTES`、`GREP_MAX_MATCHES`、`GrepInput`、`GrepMatch`、`GrepToolCaps`、`Group`、`HarnessClient`、`HarnessClientOptions`、`HarnessNotification`、`HarnessSdkJsonRpcServer`
- `HarnessSdkJsonRpcServerOptions`、`HarnessSdkNotificationMap`、`HarnessSdkRequestMap`、`HarnessSession`、`hasLinuxChooserBinary`、`hasSpillNotice`、`headerEquals`、`HEADLESS_STARTUP_SERVICE`、`HeadlessStartupValues`、`helloSchema`、`HelperLaunch`、`historicalSessionFormatCatalog`
- `HmrConfig`、`homePatchPath`、`HostCordisInspectProviderRegistration`、`HttpFetchLimits`、`HttpFetchProvider`、`HttpFetchResolver`、`idleWatchdog`、`IdleWatchdog`、`IJobs`、`ImageAdmissionErrorCode`、`ImageAttachmentLimits`、`ImageAttachmentRef`
- `ImageMediaType`、`ImageRequestTarget`、`ImageVariantId`、`Inbox`、`InboxState`、`InboxTarget`、`InboxWireState`、`Include`、`IncompatiblePlugin`、`IndexInjection`、`IndexInjectionPlacement`、`InferArgs`
- `InferValue`、`infoSchema`、`InitializeParams`、`initializeProfileFromDefault`、`InitializeResult`、`initProfile`、`inject`、`Inject`、`InjectKey`、`InspectOptions`、`inspectSessionFormatVersion`、`INSTALL_ANCHOR`
- `installAccountTaskCancellation`、`InstallBundleOptions`、`InstallFailureFacts`、`installModelSelection`、`installProxyFromEnvironment`、`InstallSpecKind`、`IntegerValueSchemaSpec`、`intentSchema`、`InternalScheduleError`、`interpolate`、`interruptedTurnClosers`、`InvalidInstallSpecError`
- `InvalidPromptError`、`InvalidRecordDetail`、`InvalidRuleError`、`InvalidSelectorError`、`InvalidTimeZoneError`、`InvocationDescriptor`、`InvocationParameterDescriptor`、`InvocationSourceLocation`、`InvokeRemoteRequest`、`isAppendSurfaceEvent`、`isAttachmentError`、`isBuiltInPreset`
- `isCredentialKeySegment`、`isCredentialRefName`、`isDynamicCordisPlugin`、`isErrno`、`ISession`、`ISessions`、`isImageAdmissionError`、`isJobEmpty`、`isJsExpr`、`isNullPtr`、`isRecurringScheduleRecord`、`isRemoteFailure`
- `isRemoteJsonValue`、`isRemoteUplinkItem`、`isReplacementSurfaceEvent`、`isRunnerSpawnFailure`、`isRunningAccountTask`、`isScopeCarrier`、`isSessionFormatJsonObject`、`isSurfaceEligibleType`、`isSurfaceEvent`、`isTypertOwnedValue`、`isTypertRemoteMethod`、`isTypertRemoteSegment`
- `ItemRetainer`、`ItemRetentionStrategy`、`IWorkspaces`、`JobAppendOptions`、`JobChannel`、`JobChunk`、`JobController`、`JobEvent`、`JobEventFilter`、`JobEventListener`、`JobEvents`、`JobFollowFrame`
- `JobFollowRequest`、`JobHandle`、`JobHooks`、`JobId`、`JobKillRequest`、`JobKillValue`、`JobKind`、`JobKindMap`、`JobListFrame`、`JobListRequest`、`JobOutcome`、`JobOutputRead`
- `JobOutputSource`、`JobRead`、`JobRegisteredData`、`JobRegistry`、`JobSettleCause`、`JobSettledData`、`JobSourceRead`、`JobSpec`、`JobsSnapshot`、`JobStatus`、`JobToolCall`、`JobView`
- `joinContextSections`、`JournalMode`、`JsExpr`、`JsonlCompression`、`JsonlCompressionSchema`、`JsonRpcConfig`、`JsonRpcLineTransport`、`JsonRpcResponseError`、`JsonRpcTransportPeer`、`JsonSchemaError`、`JsonSchemaNode`、`JsonSchemaScalar`
- `jsonSchemaToPy`、`jsonSchemaToTs`、`JsonSchemaType`、`JsonStorageBackend`、`JsonValueSchemaSpec`、`KNOWN_SESSION_EVENT_TYPES`、`KvFacet`、`KvTable`、`KvUnit`、`KvUnitDescriptor`、`LabelStyle`、`LauncherAgentIdentity`
- `leakedServices`、`LegacyAfterScheduleRecord`、`LegacyAtScheduleRecord`、`LegacyEveryScheduleRecord`、`LegacyScheduleRecord`、`LlmConfigurableProvider`、`LlmDiscoveredModel`、`LlmModelDiscoveryRequest`、`LlmNativeAuth`、`LlmProviderInfo`、`Loader`、`loadProfile`
- `loadProfileDirectory`、`loadWin32ProcessBindings`、`LOCAL_FETCH_PROVIDER_ID`、`LocalAtInput`、`LocalAttachmentStore`、`LocalBashExecutor`、`LocalCredentialProvider`、`LocalFileSystem`、`LocalizedText`、`LocalJobRegistry`、`LocalSandboxProvider`、`LocalSpillStore`
- `LocalSubprocessRuntime`、`LogExporterOptions`、`Logger`、`LoggerLevel`、`LoggerMethod`、`LoggerOptions`、`LoggerService`、`LoggerType`、`logSpillFailure`、`longEdgeDimensions`、`Lsp`、`LSP_OPERATIONS`
- `LSP_PROMPT_TEXT`、`LspConnection`、`LspError`、`LspHover`、`LspInstance`、`LspLocalServerConfig`、`LspLocation`、`LspOperation`、`LspPosition`、`LspProvider`、`LspProviderId`、`LspProviderQuery`
- `LspQueryRequest`、`LspQueryResult`、`LspRange`、`LspService`、`ManagedProcessBinding`、`ManagementError`、`mapSearchResponse`、`MarketCompatibility`、`MarketIndexSummary`、`MarketInstallation`、`MarketInstallationStatus`、`MarketListingEntry`
- `MarketListingVersion`、`MarketQuery`、`MarketSearchResult`、`MarketSort`、`matchesSignature`、`materializeAppendBatch`、`materializeCreateHeader`、`materializeSessionEventResultFilters`、`materializeSessionResultFilters`、`MAX_IMAGE_COMPRESSION_CONCURRENCY`、`MAX_TIMER_DELAY_MS`、`MAX_TITLE_LENGTH`
- `mergePlatformCookies`、`Message`、`MessageDecoder`、`MessageFeedbackDelete`、`MessageFeedbackDeleteRequest`、`MessageFeedbackDeleteResult`、`MessageFeedbackDeleteValue`、`MessageFeedbackFailure`、`MessageFeedbackItem`、`MessageFeedbackListRequest`、`MessageFeedbackListResult`、`MessageFeedbackListValue`
- `MessageFeedbackNoteBlank`、`MessageFeedbackNoteTooLarge`、`MessageFeedbackPut`、`MessageFeedbackPutRequest`、`MessageFeedbackPutResult`、`MessageFeedbackRating`、`MessageFeedbackRejected`、`MessageFeedbackService`、`MessageFeedbackSessionNotFound`、`MessageFeedbackSuccess`、`MessageFeedbackTargetNotFound`、`MessageFeedbackVersion`
- `MessageFeedbackVersionConflict`、`MessageId`、`MIN_EVERY_INTERVAL_SECONDS`、`ModelCatalog`、`ModelCatalogFailure`、`ModelCatalogModel`、`ModelProviderGroup`、`ModelReasoning`、`ModelReasoningEffort`、`ModelSelection`、`ModelSelectionProjection`、`ModelSelectionProjectionState`
- `ModelSelectionRef`、`MutableSessionEventSource`、`name`、`NamedEntries`、`NativePtr`、`negotiatePositionEncoding`、`NormalizationPolicy`、`NormalizedImage`、`normalizeHover`、`normalizeImage`、`normalizeLocations`、`normalizeRegistry`
- `normalizeSessionTitle`、`normalizeWeekdays`、`NotFutureError`、`NotificationFilter`、`NotificationSubscription`、`NPMMIRROR_REGISTRY`、`NullValueSchemaSpec`、`NumberValueSchemaSpec`、`ObjectJsonSchema`、`ObjectValueSchemaSpec`、`ObservedJob`、`OfficeExtension`
- `OfficeSourceKey`、`OfficeToPdf`、`OfficeToPdfError`、`OfficeToPdfErrorCode`、`OfficeToPdfGeneration`、`OfficeToPdfKey`、`OfficeToPdfPriority`、`OfficeToPdfRequest`、`OfficeToPdfResult`、`OFFICIAL_NPM_REGISTRY`、`Omitted`、`OneOfValueSchemaSpec`
- `OneShotScheduleDispatchChange`、`OneShotScheduleRecord`、`OPEN_IN_APP_APPS_PATH`、`OPEN_IN_APP_APPS_ROUTE`、`OPEN_IN_APP_ICON_PREFIX_PATH`、`OPEN_IN_APP_ICON_PREFIX_ROUTE`、`OPEN_IN_APP_OPEN_PATH`、`OPEN_IN_APP_OPEN_ROUTE`、`OpenAt`、`OpenInAppAppsPayload`、`OpenInAppOpenPayload`、`openInheritedControlChannel`
- `OpenState`、`OpenTelemetrySessionBackend`、`OptionalSessionSeq`、`OTelEventRecord`、`OTelEventScalar`、`outcomeSchema`、`OutputCollector`、`outputSnapshotFrameLimit`、`outputSnapshotSchema`、`PackageOperationContext`、`PackageOperationOptions`、`PackageResult`
- `PackageViewOptions`、`PackageViewResult`、`ParameterJsonSchema`、`ParameterPropertySpec`、`ParameterSchemaSpec`、`parameterSchemaSpecToJsonSchema`、`parseCmdline`、`parseCredentialKey`、`parseCredentialsDocument`、`parseCronInput`、`ParsedExitStatus`、`ParsedInstallSpec`
- `parseExitStatus`、`parseFetchArgs`、`parseGlobArgs`、`parseGrepArgs`、`parseGrepMatches`、`parseInstallSpec`、`parseLspArgs`、`parseSessionFormatLogFilename`、`parseWeeklyInput`、`PatchOptions`、`pathInfoSchema`、`PeerId`
- `PeerScope`、`PendingModule`、`PendingSubmission`、`PendingSubmissionAttachment`、`PendingSubmissionFileAttachment`、`PendingSubmissionImage`、`PendingSubmissionImageAttachment`、`PendingSubmissionPlacement`、`PendingSubmissionRetirement`、`PERPLEXITY_DEFAULT_BASE_URL`、`PERPLEXITY_DEFAULT_MAX_TOKENS`、`PERPLEXITY_DEFAULT_MODEL`
- `PERPLEXITY_PROVIDER_ID`、`PerplexityRecency`、`PerplexitySearchProvider`、`PerplexitySearchProviderOptions`、`PERSONA_PREFIX_SECTION`、`PERSONA_SUFFIX_SECTION`、`pickNativeDirectory`、`PlatformAccount`、`platformClientHeaders`、`PlatformSession`、`platformWireLocale`、`Plugin`
- `PluginChange`、`pluginEntryId`、`PluginEntryId`、`PluginFiberPhase`、`PluginInfo`、`PluginInspectProblem`、`PluginInstallCancellation`、`PluginInstallFailureKind`、`PluginInstallLogChunk`、`PluginInstallProgress`、`PluginInstallRequestId`、`PluginInventoryEntry`
- `PluginInventoryGateway`、`PluginInventorySnapshot`、`PluginLocalizedMeta`、`PluginManager`、`PluginPackage`、`PluginPackages`、`PluginRecord`、`PluginRecordMap`、`pluginRecordOf`、`PluginRecordType`、`PluginRegistries`、`PluginSpecInspection`
- `policySchema`、`pollProcessExit`、`PostToolDecision`、`PreparedImageFile`、`preparedSchema`、`prepareImageFile`、`prepareManagedProcessBinding`、`prepareProfile`、`prepareProfileEntries`、`prepareProfilePatches`、`PrepareSessionOptions`、`PresentedFile`
- `presentFetchCall`、`presentFetchResult`、`presentGlobCall`、`presentGlobResult`、`presentGrepCall`、`presentGrepResult`、`presentLspCall`、`presentSearchCall`、`presentSearchResult`、`PresetDefinition`、`PresetDisplaySource`、`presetDisplayText`
- `PresetDisplayText`、`PresetMount`、`PresetPluginEnablement`、`PreStepDecision`、`PreToolDecision`、`previewLine`、`Principal`、`PrincipalMap`、`principalOf`、`privateRoot`、`probeCurrentTokenJobSupport`、`processIdSchema`
- `ProductTelemetryRecord`、`ProductTelemetryScalar`、`Profile`、`PROFILE_PATCH_FILENAME`、`PROFILE_ROOT_FILENAME`、`PROFILE_TEMPLATES`、`ProfileContext`、`ProfileLayer`、`ProfileManifest`、`ProfileReconciliation`、`ProjectedDimensions`、`projectionCacheDomainSpec`
- `ProjectionChangeListener`、`ProjectionCheckpoint`、`ProjectionCheckpointRow`、`ProjectionDefinition`、`ProjectionsBaseline`、`ProjectionsFace`、`ProjectionSnapshot`、`ProjectionValueStore`、`PromptAssembly`、`PromptContentPart`、`PromptContext`、`PromptContextOrderName`
- `PromptError`、`PromptSection`、`PromptSectionOrderName`、`provideCmdline`、`proxyEnvironmentForChild`、`ProxyRoute`、`proxyRouteFor`、`PtcDispatchEventData`、`PtcDispatchLog`、`PtcDispatchStartEventData`、`PushDecision`、`PWSH_PROMPT_SETUP`
- `PwshLocalExecutor`、`QueueAction`、`RAW_OUTPUT_MAX_BYTES`、`readBundlePatches`、`readColdSessionLog`、`ReadFileLine`、`readHostSource`、`readImageFile`、`ReadOnlyReason`、`readPluginInventory`、`readPluginMeta`、`readProfilePatches`
- `readProfileRegistry`、`readProfileVersionExemptions`、`readRequestImageFile`、`ReadResultView`、`readSessionLogText`、`realpathNormalize`、`recordFeedback`、`RecurringOccurrence`、`RecurringScheduleRecord`、`RedactedSecret`、`RedactedValue`、`redactSecrets`
- `registerAclDiagnosisSkill`、`Registry`、`REGISTRY_URL`、`registryArguments`、`registryPlan`、`RegistryService`、`Reload`、`Remote`、`REMOTE_ACCESS_SNAPSHOT_KEY`、`RemoteAccessAction`、`RemoteAccessBaseline`、`RemoteAccessBinding`
- `RemoteAccessCondition`、`RemoteAccessDecision`、`RemoteAccessDeniedDetails`、`RemoteAccessEndpoint`、`RemoteAccessFrame`、`RemoteAccessGrant`、`RemoteAccessPolicy`、`RemoteAccessRequest`、`RemoteAccessResource`、`RemoteAccessResourceKind`、`RemoteAccessResourceOf`、`RemoteAccessRole`
- `RemoteAccessService`、`RemoteDecoded`、`RemoteEndpoint`、`RemoteError`、`RemoteErrorCode`、`RemoteErrorDetailsMap`、`remoteErrorOf`、`RemoteEventHostInfo`、`RemoteFailure`、`RemoteHostFacts`、`RemoteInvocation`、`RemoteInvocationMarker`
- `RemoteJournalChange`、`RemoteJournalFrame`、`RemoteJournalStream`、`RemoteJournalStreamOptions`、`RemoteMethodMarker`、`RemoteMethodOptions`、`remoteMethods`、`RemoteOperationError`、`remotePath`、`RemoteResult`、`RemoteScope`、`RemoteScopeOptions`
- `RemoteSnapshotStream`、`RemoteSnapshotStreamOptions`、`RemoteStream`、`RemoteStreamCarrierError`、`RemoteStreamFactory`、`RemoteStreamHandle`、`RemoteStreamItem`、`RemoteStreamOptions`、`RemoteUplinkWindow`、`RemoteWireArgs`、`RemoteWireValue`、`renderContextSections`
- `renderContextSnapshot`、`RenderedDocumentBytes`、`renderFlatLayoutMigration`、`renderPrompt`、`renderRecurringReminderBatchFraming`、`renderReminderFraming`、`renderToolsSdk`、`renderToolsSdkPy`、`renderUri`、`reportSkippedBundles`、`RequestContext`、`RequestErrorAction`
- `RequestHeaderReason`、`RequestImageAttachment`、`requestImageDimensions`、`requestImageVariantId`、`requestMethod`、`RequestRunOutcome`、`RequestTimeoutError`、`REQUIRED_TITLE_MESSAGE`、`resolveAgentsHome`、`resolveConfig`、`resolveCronOccurrence`、`resolveDailyOccurrence`
- `ResolvedCredential`、`resolveDirectoryPickerBackend`、`ResolvedProfileRuntime`、`ResolvedSessionTitleLlmConfig`、`resolveDshHome`、`resolveEveryOccurrence`、`resolvePluginResource`、`resolvePwshPath`、`resolveRecurringOccurrence`、`resolveRgPath`、`resolveSessionTitleLlmConfig`、`resolveSpec`
- `resolveWeeklyOccurrence`、`RestartReason`、`RestoredSessionOptions`、`ResumeAgentOptions`、`RetainedItems`、`RetainedText`、`RetentionNotice`、`RipgrepRun`、`RowAudit`、`RpcId`、`RpcRequest`、`RpcResponse`
- `RpcResult`、`RUN_CODE_NAME`、`RunnerFailureRule`、`RunOptions`、`runPluginCommand`、`runProfile`、`RunProfileOptions`、`runProfilePnpm`、`RunResult`、`runRipgrep`、`runSelectedSubprocessRunner`、`sampleAcrossTopLevel`
- `SANDBOX_MODES`、`SANDBOX_UNAVAILABLE`、`SandboxBashExecutor`、`sandboxDenialMarker`、`SandboxedFileSystem`、`SandboxEnforcement`、`SandboxExecutionPolicy`、`SandboxInternals`、`SandboxMode`、`sandboxPermissionsDescription`、`SandboxPolicy`、`SandboxPolicyRequest`
- `SandboxPolicyService`、`SandboxProvider`、`SandboxPwshExecutor`、`SandboxUnavailableError`、`SavedText`、`SaveFileAttachment`、`SaveFileStreamAttachment`、`SaveImageAttachment`、`saveImageFile`、`saveManifest`、`saveTextFile`、`SaveTextOptions`
- `SaveTextSpill`、`SCHEDULE_CHANGE_VERSION`、`ScheduleCatalogEntry`、`ScheduleChange`、`ScheduleCreateChange`、`ScheduleCreateRequest`、`ScheduleCreateValue`、`ScheduleDeleteChange`、`ScheduleDeleteRequest`、`ScheduleDeleteResult`、`ScheduleDeleteValue`、`ScheduleDeliveryHistoryRequest`
- `ScheduleDeliveryHistoryResult`、`ScheduleDeliveryMode`、`ScheduleDeliveryReceipt`、`ScheduleDeliveryRecord`、`ScheduleDispatchChange`、`scheduleDomain`、`ScheduledToolDispatch`、`ScheduledToolPreparation`、`ScheduleId`、`ScheduleInputError`、`ScheduleListRequest`、`ScheduleListValue`
- `ScheduleLogError`、`ScheduleRecord`、`ScheduleService`、`ScheduleState`、`ScheduleTask`、`ScheduleTimingChange`、`scheduleTitle`、`ScheduleToolError`、`ScheduleUpdateContent`、`ScheduleUpdateMiss`、`ScheduleUpdateRequest`、`ScheduleUpdateResult`
- `ScheduleUpdateValue`、`scheduleView`、`ScheduleView`、`Scope`、`scopeChainOf`、`Scoped`、`ScopedLayers`、`ScopeKey`、`ScopeLayer`、`scopeOf`、`ScopeParentBinding`、`scopeParentOf`
- `scopeTarget`、`scrubbedParentEnv`、`SDK_APP_STARTUP_SERVICE`、`SdkEncodedImageBlock`、`SdkPromptContentBlock`、`SdkProtocolError`、`SdkRunStatus`、`SEARCH_GRACE_MS`、`SEARCH_META_MAX_BYTES`、`SEARCH_STDERR_MAX_BYTES`、`SEARCH_TIMEOUT_MS`、`SearchError`
- `SearchErrorCode`、`SearchFileMatches`、`SearchLineMatch`、`SearchMatchesResultView`、`searchMetaFromResult`、`searchMetaFromValue`、`SearchPathsResultView`、`SearchResultView`、`SENSITIVE_ENV_PATTERN`、`serializeSessionLog`、`serveStatic`、`Service`
- `Session`、`SESSION_FORMAT_VERSION`、`SESSION_LOG_EXPORT_PATH`、`SESSION_LOG_FILENAME`、`SESSION_QUERY_DEFAULT_PERSISTED_INSPECT_CONCURRENCY`、`SESSION_QUERY_DEFAULT_PREPARED_SESSION_CACHE_SIZE`、`SESSION_QUERY_READ_WINDOW_MAX`、`SESSION_QUERY_SQLITE_APPLICATION_ID`、`SESSION_QUERY_SQLITE_DEFAULT_LIMIT`、`SESSION_QUERY_SQLITE_MAX_LIMIT`、`SESSION_QUERY_SQLITE_PATH_KEY`、`SESSION_QUERY_SQLITE_SCHEMA_VERSION`
- `SESSION_QUERY_SQLITE_SNIPPET_CHARS`、`SESSION_SEARCH_RESULT_LIMIT`、`SESSION_SEARCH_SNIPPET_MAX_CODE_POINTS`、`SESSION_TITLE_TIMEOUT_CODE`、`SessionAccess`、`SessionActivity`、`SessionActivityItem`、`SessionActivityKind`、`SessionActivityKindMap`、`SessionActivityRequest`、`SessionAddress`、`SessionAlreadyExistsError`
- `SessionAlreadyOwnedError`、`SessionAssistantSettlementEntry`、`SessionAssistantStreamAttempt`、`SessionAssistantStreamBaseline`、`SessionAssistantStreamFrame`、`SessionAttachmentRequest`、`SessionAttachmentValue`、`SessionAvailability`、`SessionBinding`、`SessionCancelRequest`、`SessionCancelValue`、`SessionControlBaseline`
- `SessionControlFrame`、`SessionController`、`SessionControllerInternals`、`SessionControlStream`、`SessionControlStreamOptions`、`SessionCreateError`、`SessionCreateRequest`、`SessionCreateValue`、`sessionDir`、`SessionEvent`、`SessionEventChange`、`SessionEventEntry`
- `SessionEventLike`、`SessionEventLikeEntry`、`SessionEventMap`、`SessionEventMetadataFilter`、`SessionEventNotification`、`SessionEventReadRequest`、`SessionEventRecord`、`SessionEventResultFilter`、`SessionEventSearchDocument`、`SessionEventSearchHit`、`SessionEventSearchPage`、`SessionEventSearchRequest`
- `SessionEventSource`、`SessionEventStream`、`SessionEventStreamOptions`、`SessionEventSurface`、`SessionEventTrace`、`SessionEventTraceObservation`、`SessionEventTraceRequest`、`SessionEventType`、`SessionEventWindow`、`SessionFace`、`SessionFeedbackRecordRequest`、`SessionFeedbackRecordResult`
- `SessionFeedbackRecordValue`、`SessionFeedbackService`、`SessionFeedbackSessionNotFound`、`SessionFileReferences`、`SessionFollowFrame`、`SessionFollowRequest`、`SessionForkError`、`SessionForkErrorCode`、`SessionForkRequest`、`SessionForkSource`、`SessionForkValue`、`SessionFormatArtifact`
- `SessionFormatArtifactDecoder`、`sessionFormatCatalog`、`SessionFormatCatalog`、`SessionFormatCatalogOptions`、`SessionFormatChain`、`SessionFormatChainOptions`、`SessionFormatCodec`、`sessionFormatCount`、`SessionFormatCurrentEncoder`、`SessionFormatError`、`SessionFormatEvent`、`SessionFormatEventCollector`
- `SessionFormatEventRun`、`SessionFormatHeader`、`SessionFormatHeaderReadResult`、`SessionFormatJsonObject`、`SessionFormatJsonPrimitive`、`SessionFormatJsonValue`、`sessionFormatLogFilename`、`SessionFormatMigration`、`SessionFormatMigrationContext`、`SessionFormatMigrationStage`、`SessionFormatMigrationStageInput`、`SessionFormatMigrationStream`
- `SessionFormatRecovery`、`SessionFormatRestore`、`SessionFormatRestoreOptions`、`sessionFormatSafeInteger`、`SessionFormatUnsupportedError`、`SessionFormatUnsupportedMigrationError`、`sessionFormatVersion`、`sessionFormatVersionRefusal`、`SessionHandle`、`SessionHandleAppendOptions`、`SessionHandleClosedError`、`SessionHandleFlushOptions`
- `SessionHandleReadOptions`、`SessionHandleReadResult`、`SessionHeader`、`SessionHistoryRecord`、`SessionId`、`SessionInspection`、`SessionJournalChange`、`SessionLineageNode`、`SessionLineageTrace`、`SessionListMetadata`、`SessionListPhase`、`SessionListRequest`
- `SessionListSnapshot`、`SessionListState`、`SessionListValue`、`SessionLiveEventEntry`、`SessionLocation`、`SessionLogCompressionLevel`、`SessionLogDownloadDialogInjected`、`SessionLogDownloadDialogProps`、`SessionLogDownloadEntry`、`SessionLogDownloadState`、`sessionLogExportDeps`、`SessionLogExportDeps`
- `SessionLogExportReady`、`SessionLogOffset`、`SessionLogOptions`、`SessionLogProcessorOptions`、`SessionLogRecord`、`SessionLogReporter`、`SessionLogSnapshot`、`sessionLogZipEntries`、`SessionLogZipEntry`、`sessionLogZipFilename`、`SessionMessageProjection`、`SessionMessageProjectionContext`
- `SessionObservation`、`SessionObservationOptions`、`SessionOpenWorkspacePathRequest`、`SessionOpenWorkspacePathValue`、`SessionOwnershipLostError`、`SessionPage`、`SessionPageRequest`、`SessionPersistence`、`SessionPersistenceCorruptionError`、`SessionPersistenceCreateOptions`、`SessionPersistenceListOptions`、`SessionPersistenceNotFoundError`
- `SessionPersistenceOpenOptions`、`SessionPersistenceRevision`、`SessionPersistenceSnapshot`、`SessionPersistenceStatOptions`、`SessionPreparation`、`SessionPreparationOptions`、`SessionProjectionBaseline`、`SessionProjectionCache`、`SessionProjectionHints`、`SessionProjectionMap`、`SessionProjectionRegistry`、`SessionProjectionSnapshot`
- `SessionProjectionsRequest`、`SessionProjectionStateMap`、`SessionProjectionsValue`、`SessionProjectionUpdate`、`SessionProjectionValue`、`SessionProjectionValues`、`SessionPromptParams`、`SessionPromptRequest`、`SessionPromptResult`、`SessionPromptValue`、`SessionQueryEngine`、`SessionQueryError`
- `SessionQueryErrorCode`、`SessionReadOnlyError`、`SessionRecord`、`SessionReference`、`SessionReferenceMentionCandidate`、`SessionReferenceSource`、`SessionReferenceSourceMap`、`SessionRemote`、`SessionRenameRequest`、`SessionRenameValue`、`SessionRequestId`、`SessionResultFilter`
- `SessionResultRange`、`SessionResumeParams`、`SessionRetainInfo`、`SessionRetainOptions`、`SessionSearchCursor`、`SessionSearchExecContext`、`SessionSearchHit`、`SessionSearchItem`、`SessionSearchPage`、`SessionSearchRequest`、`SessionSearchResultItem`、`SessionSearchValue`
- `SessionSeedEventState`、`SessionSelectModelRequest`、`SessionSelectModelValue`、`SessionSeq`、`SessionSeqCursor`、`SessionSkillCatalog`、`SessionSnapshot`、`SessionStartSource`、`SessionStatsProjection`、`SessionStatusNotification`、`SessionStorageMetadata`、`SessionStore`
- `SessionSummary`、`SessionSurface`、`SessionSurfaceSnapshot`、`SessionTarget`、`SessionTelemetryBackend`、`SessionTelemetryCapture`、`SessionTelemetryCaptureOptions`、`SessionTelemetryCoordinator`、`SessionTelemetryMode`、`SessionTelemetryRecord`、`SessionTelemetrySeverity`、`SessionTelemetrySharingStatus`
- `SessionTelemetrySink`、`SessionTitleAutomaticMode`、`SessionTitleEventData`、`SessionTitleInvalidError`、`SessionTitleLlmConfig`、`SessionTitleLlmConfigFields`、`SessionTitleLlmConfigSchema`、`SessionTitleLlmFinish`、`SessionTitleLlmPreparedRequest`、`SessionTitleLlmRequestEventData`、`SessionTitleLlmResponse`、`SessionTitleModelIdentity`
- `SessionTitleObservation`、`SessionTitleObservationResult`、`SessionTitleProvider`、`SessionTitleProviderId`、`SessionTitleProviderRequest`、`SessionTitleProviderResult`、`SessionTitleService`、`SessionTitleSnapshot`、`SessionTitleSource`、`SessionTitleUserMessage`、`SessionTransientEventEntry`、`SessionUpdateQueueRequest`
- `SessionUpdateQueueValue`、`SessionWaitParams`、`SessionWireEvent`、`SessionWireHeader`、`SessionWireSurfaceOp`、`SessionWorkingDirectoryParams`、`SessionWorkingDirectoryResult`、`SessionWorkingDirectorySetParams`、`SessionWorkspacePathApplication`、`setProfileVersionExemption`、`setSandboxMode`、`SettingsConflictError`
- `SettingsController`、`SettingsControllerInternals`、`SettingsDescribeOptions`、`SettingsDescribeValue`、`SettingsDescriptor`、`SettingsDocumentOpenValue`、`SettingsForms`、`SettingsNamespace`、`SettingsNamespaceView`、`SettingsPathOp`、`SettingsPathOpView`、`SettingsSecretView`
- `ShellEnvRegistry`、`ShellExecRequest`、`ShellExecSpec`、`ShellExecution`、`ShellExecutor`、`ShellExpiryPolicy`、`ShellProcess`、`ShellProcessRead`、`ShellProcessStatus`、`ShellRunResult`、`ShellSandboxInfo`、`SignInAttemptId`
- `SignInAttemptView`、`SignInErrorCode`、`SkillEntry`、`SkillListRequest`、`SkillListValue`、`SkippedBundle`、`snapshotSessionEvent`、`snapshotSessionFormatHeader`、`snapshotSessionFormatJson`、`spawnCurrentTokenJobProcess`、`SpawnedJobProcess`、`SpawnedPipedProcess`
- `spawnInheritedJobProcess`、`spawnPipedProcess`、`spawnSchema`、`SpillFailureReporter`、`SpillLocator`、`SpillOptions`、`SpillOwner`、`SpillPolicyExec`、`SpillRef`、`SpillSource`、`SpillStore`、`SqliteSessionQueryEngine`
- `SqliteStorageBackend`、`SSH_MAX_PROCESS_HANDLES`、`SSH_MAX_TEXT_STREAMS`、`SSH_PROTOCOL_VERSION`、`SshConnection`、`SshFileSystem`、`SshProcessId`、`SshRpcPeer`、`SshSandboxProvider`、`SshStreamEndpoint`、`SshSubprocessRuntime`、`SshTextStreamId`
- `StartupError`、`Storage`、`STORAGE_SQLITE_SCHEMA_VERSION`、`StorageBackend`、`storageBackendServiceKey`、`StorageError`、`StorageErrorCode`、`StorageForms`、`StoredImageAttachment`、`StreamChunk`、`streamEndpointSchema`、`streamSessionLogZip`
- `StringValueSchemaSpec`、`SubagentFinishedNotification`、`SubagentSessionError`、`SubagentStartedNotification`、`SubmissionHandle`、`SUBPROCESS_CONTROL_ENV`、`SUBPROCESS_CONTROL_FD`、`SubprocessCollect`、`SubprocessCollectedOutputs`、`SubprocessExecutableNotFoundError`、`SubprocessHandle`、`SubprocessOutcome`
- `SubprocessOutputMode`、`SubprocessOutputRead`、`SubprocessOutputReader`、`SubprocessRuntime`、`SubprocessSpawnSpec`、`SubprocessStdinMode`、`SubprocessStdio`、`SubprocessTerminalActivity`、`SubprocessTerminalEnvironment`、`SubprocessTerminalForeground`、`SubprocessTerminalHandle`、`SubprocessTerminalSignal`
- `SubprocessTerminalSpawnSpec`、`supportsOperation`、`supportsTransientOpen`、`SURFACE_PACKAGES`、`SurfaceEvent`、`SurfaceEventType`、`SurfaceFoldReplacement`、`SurfaceFoldResult`、`SurfaceIntent`、`SurfaceManager`、`SurfaceOp`、`SweepOptions`
- `SweepRoot`、`sweepSpillRoots`、`SystemMessage`、`SystemPrompt`、`TableKeyOf`、`TableValueOf`、`targetSchema`、`TASK_WAIT_TIMEOUT`、`tempWriteSid`、`terminalActivitySchema`、`TerminalBackend`、`TerminalBackendCleanupError`
- `TerminalBackendSession`、`TerminalBackendSpawnSpec`、`TerminalCallView`、`TerminalCloseFailure`、`TerminalController`、`TerminalCreateRequest`、`TerminalEnvironment`、`TerminalError`、`TerminalErrorCode`、`TerminalFrame`、`TerminalInput`、`TerminalLaunchShells`
- `TerminalLocalConfig`、`TerminalReadRequest`、`TerminalReadResult`、`TerminalRemote`、`TerminalRenderFrame`、`TerminalResultView`、`TerminalRetentionFrame`、`TerminalSendOperation`、`TerminalSendRead`、`TerminalSendRequest`、`TerminalSendResult`、`TerminalSessionId`
- `TerminalSessionService`、`TerminalSessionSnapshot`、`TerminalSessionStatus`、`TerminalShell`、`TerminalSignal`、`TerminalSignalResult`、`TerminalSpawnRequest`、`TerminalSpawnResult`、`TerminalView`、`TerminalViewIssue`、`TerminalViewState`、`TerminalWaitReason`
- `terminateJob`、`TextRetainer`、`TextRetentionStrategy`、`textStreamIdSchema`、`throwLastError`、`throwWin32`、`timeoutOf`、`TimeOutOfRangeError`、`TimeoutReason`、`TimerService`、`TitleInputState`、`TitleProjection`
- `titleProjectionDefinition`、`TlsConfig`、`TodoItem`、`TOOL_ABORTED`、`TOOL_ABORTED_BEFORE_DISPATCH`、`TOOL_NOT_STARTED`、`TOOL_ORDER_REST`、`TOOL_OUTCOME_UNKNOWN`、`TOOL_RUNTIME_SCHEDULER`、`ToolArgsError`、`ToolCallKind`、`ToolCallRecovery`
- `ToolCallView`、`ToolDefinition`、`ToolDispatchExecution`、`ToolErrorInfo`、`ToolExecution`、`ToolExecutionFailure`、`ToolExecutionInput`、`ToolExecutionMode`、`ToolExecutionResult`、`ToolExecutionSuccess`、`ToolExecutionToken`、`ToolFailure`
- `ToolGuard`、`ToolNotFoundError`、`ToolOutputDefinition`、`ToolOutputError`、`ToolPresentationMode`、`ToolProviderResult`、`ToolRestriction`、`ToolResult`、`ToolResultMessage`、`ToolResultView`、`ToolRunContext`、`ToolRuntime`
- `ToolRuntimeScheduler`、`toWorkdirRelative`、`TransportClosedError`、`truncateTitleUtf8`、`truncateWithoutSplittingSurrogatePair`、`trySaveFormattedResult`、`TurnBoundaryProjection`、`turnBoundaryProjectionDefinition`、`TurnEndCancelCause`、`TurnEndReason`、`TurnEndReasonMap`、`TurnOutlineEntry`
- `TurnOutlineState`、`TYPERT_HOST_EXPORT`、`TYPERT_OWNED_VALUE`、`TypertAnalysisError`、`TypertClientContextAdapter`、`TypertClientEventListener`、`TypertClientRemote`、`TypertCodec`、`TypertContext`、`TypertContextMap`、`TypertContextRegistry`、`TypertContextWire`
- `TypertContribution`、`TypertDisposer`、`TypertDocTag`、`TypertDocumentation`、`TypertEmitError`、`typertEndpoint`、`TypertEventModel`、`TypertFace`、`TypertForwardableEvent`、`TypertForwardableEventEntry`、`TypertGateway`、`TypertGatewayBinding`
- `TypertGatewayBindingOptions`、`TypertGatewayError`、`TypertGatewayErrorCode`、`TypertGatewayFaultDetails`、`TypertGatewayService`、`TypertGatewayWireStream`、`TypertHostContextAdapter`、`TypertHostContextResolver`、`typertKey`、`TypertLocalRegistry`、`TypertLookup`、`TypertLookupDefinition`
- `TypertLookupHost`、`TypertLookupMap`、`TypertLookupProvider`、`TypertLookupRegistry`、`TypertLookupResolver`、`TypertLookupWire`、`TypertMemberModel`、`TypertObjectModel`、`typertOwnedValue`、`TypertOwnedValue`、`TypertPackageFilter`、`typertPackageKey`
- `TypertPackageModel`、`TypertPackageRecord`、`typertPlugin`、`TypertPluginOptions`、`TypertRegistry`、`TypertRegistryChange`、`TypertRegistryContract`、`TypertRegistryListener`、`TypertRemoteCodecSpec`、`TypertRemoteContribution`、`TypertRemoteEvent`、`TypertRemoteEventContext`
- `TypertRemoteEventDispatch`、`TypertRemoteEventFrame`、`TypertRemoteEventInvocation`、`TypertRemoteEventOutcome`、`TypertRemoteEventSelection`、`TypertRemoteEventSource`、`TypertRemoteInfo`、`TypertRemoteInputOptions`、`TypertRemoteMap`、`TypertRemoteMethod`、`TypertRemoteMethodSpec`、`TypertRemoteNamespace`
- `TypertRemoteNamespaceMap`、`TypertRemoteParameterSpec`、`TypertRemoteRegistry`、`TypertRemoteScopeApi`、`TypertRemoteScopeMap`、`TypertRemoteScopeNamespace`、`TypertRemoteService`、`TypertRemoteSpec`、`TypertRemoteValue`、`TypertResource`、`TypertResourceDeclaration`、`TypertResourceEntry`
- `TypertResourceId`、`TypertResourceKind`、`TypertResourceMap`、`TypertResourceReader`、`TypertResourceReaders`、`TypertResourceRegistry`、`TypertSchema`、`TypertSchemaFactory`、`TypertSchemaFilter`、`TypertSchemaRecord`、`TypertServiceModel`、`TypertTypeModel`
- `TypertWorkerError`、`UNIT_NAME_RE`、`UseProjection`、`UserMessage`、`validateArgs`、`validatedSessionEvent`、`validateEscalationArgs`、`validateImageFile`、`validateJsonSchemaValue`、`validateSessionEventData`、`validateStoredEvents`、`validateSurfaceMetadata`
- `validateTypertManifest`、`ValidationError`、`ValueSchemaAnnotations`、`ValueSchemaSpec`、`valueSchemaSpecToJsonSchema`、`viewProfilePackage`、`Volatile`、`VolatileSnapshot`、`waitForProcessExit`、`WarnFn`、`WEB_SEARCH_DEEPSEEK_SETTINGS_NAMESPACE`、`WEB_SEARCH_MAX_QUERIES`
- `WEB_SEARCH_MAX_RESULTS`、`WEB_STARTUP_SERVICE`、`WebApp`、`WebError`、`WebFetchBody`、`WebFetchMeta`、`WebFetchProvider`、`WebFetchRequest`、`WebFetchResult`、`WebFetchResultView`、`WebResultView`、`WebRoute`
- `WebRouteKind`、`WebRuntime`、`WebRuntimeConfig`、`WebSearchMeta`、`WebSearchProvider`、`WebSearchRequest`、`WebSearchResult`、`WebSearchResultView`、`WebSearchSource`、`WebServer`、`WebSource`、`WebStartupValues`
- `WebTerminalId`、`WebTerminalInfo`、`WebUpgradeRoute`、`WeeklyInput`、`WeeklyScheduleRecord`、`weeklyTime`、`WIDER_MODES`、`Win32Error`、`Win32ProcessBindings`、`WorkingDirectoryService`、`Workspace`、`WorkspaceActiveSessionError`
- `WorkspaceAnalyzer`、`WorkspaceAnalyzerOptions`、`WorkspaceArchivedSessionPinError`、`WorkspaceArchiveError`、`WorkspaceArchiveSessionRequest`、`WorkspaceArchiveValue`、`WorkspaceBaseline`、`WorkspaceByteRange`、`WorkspaceByteReadOptions`、`WorkspaceChangedFile`、`WorkspaceChanges`、`WorkspaceChangesSummary`
- `WorkspaceController`、`WorkspaceCreateError`、`WorkspaceCreateRequest`、`WorkspaceCreateValue`、`WorkspaceDeleteRequest`、`WorkspaceDeleteValue`、`WorkspaceDiffHunk`、`WorkspaceDirectoryEntry`、`WorkspaceDirectoryListing`、`workspaceDisplayTitle`、`workspaceDomainSpec`、`workspaceDomainState`
- `WorkspaceDomainState`、`WorkspaceEmitResult`、`WorkspaceFileBytes`、`WorkspaceFileChange`、`WorkspaceFileDiff`、`WorkspaceFileParams`、`WorkspaceFileRange`、`WorkspaceFiles`、`WorkspaceFileScope`、`WorkspaceFileStat`、`WorkspaceFileText`、`WorkspaceFileWatchFrame`
- `WorkspaceFollowFrame`、`WorkspaceFollowIncrement`、`WorkspaceFollowSink`、`WorkspaceId`、`WorkspaceInsertBeforeRequest`、`WorkspaceInsertSessionBeforeRequest`、`WorkspaceListPhase`、`WorkspaceModel`、`WorkspaceMoveInvalidError`、`WorkspaceOrderInvalidError`、`WorkspaceOrderValue`、`WorkspacePinSessionRequest`
- `WorkspacePinValue`、`workspaceRecord`、`WorkspaceRecord`、`WorkspaceRegistry`、`WorkspaceRemote`、`WorkspaceRenameRequest`、`WorkspaceSnapshot`、`WorkspaceSource`、`WorkspaceStateStream`、`WorkspaceStateStreamOptions`、`WorkspaceTypertGenerator`、`WorkspaceTypertGeneratorOptions`
- `WorkspaceUnarchiveSessionRequest`、`WorkspaceUnknownSessionError`、`WorkspaceUnpinSessionRequest`、`WorkspaceValue`、`WorkspaceView`、`workspaceWriteSid`、`writableRoots`、`writePackageArtifacts`、`writeResultSchema`、`writeWorkspaceArtifacts`

<!-- END GENERATED OBJECT INDEX -->

## 术语与边界

| 术语 | 含义与使用边界 |
| --- | --- |
| Cordis 模块、fiber、Service | 模块是装配单元，fiber 拥有生命周期和 effects，Service 是注入能力；function/object/class 只是模块写法 |
| Provider 与 consumer | Provider 提供实现或向 registry 注册能力，consumer 注入并调用；接口包本身不一定实现后端 |
| Profile 与 bundle | Profile 确定运行组合；bundle patch 插入或修改条目。安装 package 和激活 module 是不同步骤 |
| Host、Client、Remote | Host 执行业务与持久事实，Client 在浏览器注册 UI，Remote 提供生成类型/编解码的跨端调用；传输连通不证明请求授权正确 |
| Session、Agent 与 job | Session 拥有日志，Agent 拥有活动执行，job 拥有后台工作状态；fork 复制日志不转移活资源所有权 |
| Config、Volatile 与设置 | Config schema 校验输入，Volatile 决定 live 字段，设置表单与配置编辑需保留 revision 和脱敏字段 |
| Session 事实与 Domain | Session 日志保存可重建的模型可见事实；Domain 保存非会话业务数据，不自动进入模型请求 |
| 导出、挂载、默认、实验 | exports 决定能导入什么，Loader/manifest 决定何时装载，默认和实验状态需各自组合证据；四者不可互推 |

## 关键词索引

- 对话框、弹窗、Modal：[公开 Modal 契约](references/client/api/api-client-ui-primitives-modal.md)，[控件选型步骤](references/client/how-to/how-to-client-ui-primitives.md)。
- Web UI 组件、共享控件、按钮、标签、分段选择：[组件选择与导出边界](references/client/how-to/how-to-client-ui-primitives.md)；弹层定位、useAnchoredPosition：[共享控件定位契约](references/client/api/api-client-ui-primitives-useanchoredposition.md)。
- Cordis、Context、Service、inject、effect、bundle、Profile、包安装：[服务与装载](references/infra/how-to/how-to-core-service.md)。
- Tool、defineTool、规范 JSON 结果、纯渲染、取消：[工具任务](references/infra/how-to/how-to-core-tool.md)。
- Remote、Typert、生成声明、Host/Client：[跨端任务](references/infra/how-to/how-to-core-remote.md)。
- FileSystem、fs、版本冲突、已读才写：[文件任务](references/infra/how-to/how-to-runtime-fs.md)。
- Storage、Domain、zod、重启恢复：[持久业务状态](references/infra/how-to/how-to-runtime-storage.md)。
- WebSearchProvider、WebFetchProvider、搜索、抓取：[Web 提供方](references/infra/how-to/how-to-runtime-web.md)。
- LLM、Skill、MCP、Workflow、Subagent、Commands、Settings、Terminal、Schedule：[按公开对象名查找](references/object-index.md)。

## 跨主题不变量

每项注册和异步资源只有一个 owner：失败时回滚未发布资源，取消后等待实际清理，卸载后不遗留可调用入口。模型可见内容必须能由所属 Session 的规范事件重建，工具只交付一份规范 JSON 结果，渲染函数不执行 IO。持久化 append、flush、投影和缓存具有不同完成语义；不能以已写入内存或拿到 id 代替耐久完成。

先核对精确版本、运行侧、导出与依赖，再用公开签名编写代码。废弃入口不作为常规实现路径。权限、配置、生命周期与恢复分别验证，不以类型检查或注册成功推断业务行为。

## 完成边界

完成代码后先构建，确认独立包解析、exports 与产物；再安装到隔离 Profile，观察插件激活、一次成功业务行为，以及适用的拒绝、取消、卸载和重启恢复。Client 需实际走到对应页面或 slot，Remote 需生成声明并打通两侧。没有执行到的行为不能声称已验证；真实浏览器、平台权限和外部协议按任务实际需要检查。

[源码映射](maintenance/source-map.md)列出目标版本声明、实现和测试的相对位置，供维护者在对应源码副本复核；[维护规则](maintenance/skill-maintenance.md)说明版本边界与重新创建要求。
