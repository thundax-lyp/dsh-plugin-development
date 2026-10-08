# 插件开发任务路由

先识别起点。目标 DSH checkout 内的源码、生成器和构建脚本不等于独立消费项目可用的发布包路径。独立项目若要实现生成的 Host Remote 或 Client UI，先读 [Client/Remote 的结果与组成](how-to-client-web.md#结果与组成)：`0.2.0-rc.2` 发布版 Typert 生成器在所述独立 npm 路径未生成 Remote 工件，且没有发布通用 Client bundle builder；下表的直达小节只提供相应契约与待满足的构建条件。实现基础设施 provider 时，先从已安装公开包的类型声明核查完整抽象接口，再进入任务步骤。

<!-- BEGIN GENERATED TASK NAVIGATION -->
<!-- prettier-ignore -->
| 用户任务 | 起点 |
| --- | --- |
| 添加供 Agent 调用的 Host Tool | [register-host-tool](how-to-host-core.md#register-host-tool) |
| 一个 Host 插件提供 Cordis service，另一个在注入后消费，并验证激活和卸载。 | [provide-and-consume-cordis-service](how-to-host-core.md#provide-and-consume-cordis-service) |
| 添加有作用域的提示词章节、变量、上下文或 Tool schema provider。 | [extend-system-prompt](how-to-host-core.md#extend-system-prompt) |
| 注册 LLM 适配器和可选的模型目录。 | [add-llm-adapter](how-to-host-core.md#add-llm-adapter) |
| 定义纯函数 Session 投影及可选的 checkpoint 缓存。 | [persist-derived-session-state](how-to-host-core.md#persist-derived-session-state) |
| 注册人工命令，并在打开的 turn 中用审批保护模型 Tool 操作。 | [add-command-and-approval](how-to-host-core.md#add-command-and-approval) |
| 从 Host 代码或模型 Tool 创建并驱动持久 Session goal。 | [manage-goal](how-to-host-core.md#manage-goal) |
| 启动有边界的 Host job，并通过 tool-jobs 提供等待、读取和终止操作。 | [run-background-job](how-to-host-core.md#run-background-job) |
| 注册运行时 Skill 或文件系统 Skill provider。 | [provide-skills](how-to-host-core.md#provide-skills) |
| 添加一次性或可继续的 subagent 委派。 | [delegate-subagent](how-to-host-core.md#delegate-subagent) |
| 通过 tool-workflow 提供有边界的多 Agent workflow。 | [run-workflow](how-to-host-core.md#run-workflow) |
| 通过通用 hook 协议适配 Claude Code 或 Codex hook。 | [run-external-hook](how-to-host-core.md#run-external-hook) |
| 提供时间、指令、文件引用、Session 引用或 tmux 上下文。 | [add-context-provider](how-to-host-core.md#add-context-provider) |
| Host 提供生成的类型化 Remote，并处理结构化失败和取消。 | [Host 入口与 Remote](how-to-client-web.md#host-入口与-remote) |
| Config 使用 revision fence 实时写入，unset 恢复继承值。 | [设置页面](how-to-client-web.md#设置页面) |
| Client 装载后提供类型化 slot，并在卸载时撤销。 | [Client 入口与 slot](how-to-client-web.md#client-入口与-slot) |
| Web provider 使用验证后的配置并遵守重定向边界。 | [Web provider 集成](how-to-client-web.md#web-provider-集成) |
| Client 展示已持久化的 deliverable 和文档事实。 | [交付物与文档界面](how-to-client-web.md#交付物与文档界面) |
| 获准的 Host/Client 两侧运行并报告装载或渲染失败。 | [动态 Host 与 Client 扩展](how-to-client-web.md#动态-host-与-client-扩展) |
| Client 消费 Terminal stream 并负责释放。 | [Terminal Remote 集成](how-to-client-web.md#terminal-remote-集成) |
| Client 消费有作用域的 workspace/file API，并在重连后恢复。 | [Workspace Remote 集成](how-to-client-web.md#workspace-remote-集成) |
| 将打包的插件安装到隔离 Profile 并激活。 | [打包并启用 bundle](how-to-infra-runtime.md#打包并启用-bundle) |
| 替换或扩展基础设施 provider，同时保持 consumer 不变。 | [实现或使用基础设施 provider](how-to-infra-runtime.md#实现或使用基础设施-provider) |
| 由已认证的外部事件启动插件工作，卸载后不残留回调。 | [注册 Web 路由与 webhook 规则](how-to-infra-runtime.md#注册-web-路由与-webhook-规则) |
| 通过生成的 Remote binding 将 Host API 提供给 Client。 | [组合 preset 与 Host 到 Client 的 Remote](how-to-infra-runtime.md#组合-preset-与-host-到-client-的-remote) |
| 显式选择一个 provider，为目标环境提供 Tool。 | [选择实验性 browser 或 computer provider](how-to-infra-runtime.md#选择实验性-browser-或-computer-provider) |
| Client 异步插入结果而不覆盖后续草稿，并在显式启用 bundle 后给出引导。 | [输入框异步插入与显式启用引导](how-to-client-web.md#输入框异步插入与显式启用引导) |

<!-- END GENERATED TASK NAVIGATION -->

先按任务表进入 HOW-TO；需要核查具体类型和生命周期时，再读 [Host/Core](api-host-core.md)、[Client/Web](api-client-web.md) 或[基础设施](api-infra-runtime.md) 契约。按符号查入口可用[关键词索引](keyword-index.md)，区分包、Bundle、Profile 和 Remote 可用[术语](terminology.md)。

实现与接入以适用的真实 Profile 装载、行为和卸载为完成边界；排错可在根因查实后交付定位结论，评审可交付有证据边界的静态结论。分别报告未运行的验证，不能把静态导出或声明当作运行结果。
