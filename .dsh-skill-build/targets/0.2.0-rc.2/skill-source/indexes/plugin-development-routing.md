# Plugin development routing

<!-- BEGIN GENERATED TASK NAVIGATION -->
| 用户任务 | 起点 |
| --- | --- |
| 添加供 Agent 调用的 Host Tool | [register-host-tool](how-to-host-core.md#register-host-tool) |
| Add scoped prompt sections, variables, context, or tool schema providers. | [extend-system-prompt](how-to-host-core.md#extend-system-prompt) |
| Register an LLM adapter and optional model directory. | [add-llm-adapter](how-to-host-core.md#add-llm-adapter) |
| Define a pure Session projection and optional checkpoint cache. | [persist-derived-session-state](how-to-host-core.md#persist-derived-session-state) |
| Register a human command that requests policy-controlled approval. | [add-command-and-approval](how-to-host-core.md#add-command-and-approval) |
| Create and drive a durable session goal from Host code or model tools. | [manage-goal](how-to-host-core.md#manage-goal) |
| Start a bounded Host job and expose wait/read/kill through tool-jobs. | [run-background-job](how-to-host-core.md#run-background-job) |
| Register runtime skills or a filesystem Skill provider. | [provide-skills](how-to-host-core.md#provide-skills) |
| Add one-shot or continuable subagent delegation. | [delegate-subagent](how-to-host-core.md#delegate-subagent) |
| Expose a bounded multi-agent workflow through tool-workflow. | [run-workflow](how-to-host-core.md#run-workflow) |
| Adapt Claude Code or Codex hooks through the common hook protocol. | [run-external-hook](how-to-host-core.md#run-external-hook) |
| Contribute time, instruction, file-reference, session-reference, or tmux context. | [add-context-provider](how-to-host-core.md#add-context-provider) |
| Host exposes a generated typed Remote with structured failure/cancellation | [Host 入口与 Remote](how-to-client-web.md#host-入口与-remote) |
| Config uses revision-fenced live writes and unset restores inheritance | [设置页面](how-to-client-web.md#设置页面) |
| Client half loads, contributes through a typed slot, and withdraws on unload | [Client 入口与 slot](how-to-client-web.md#client-入口与-slot) |
| Web provider runs with validated config and redirect boundary | [Web provider](how-to-client-web.md#web-provider) |
| Client presents persisted deliverable/document facts | [Deliverable 与文档界面](how-to-client-web.md#deliverable-与文档界面) |
| Approved Host/Client halves run and report load/render failures | [动态 Host 与 Client 扩展](how-to-client-web.md#动态-host-与-client-扩展) |
| Client consumes terminal stream and disposes it | [Terminal Remote](how-to-client-web.md#terminal-remote) |
| Client consumes scoped workspace/file APIs and recovers after reconnect | [Workspace Remote](how-to-client-web.md#workspace-remote) |
| packed plugin installs into an isolated Profile and activates | [Package and activate a bundle](how-to-infra-runtime.md#package-and-activate-a-bundle) |
| provider replaces or extends infrastructure without changing consumers | [Implement or consume an infrastructure provider](how-to-infra-runtime.md#implement-or-consume-an-infrastructure-provider) |
| authenticated external event starts plugin work without callbacks surviving unload | [Register a web route and webhook rule](how-to-infra-runtime.md#register-a-web-route-and-webhook-rule) |
| Host API reaches Client through generated Remote binding | [Compose a preset and a Host to Client Remote](how-to-infra-runtime.md#compose-a-preset-and-a-host-to-client-remote) |
| one explicitly selected provider contributes tools for the intended environment | [Select an experimental browser or computer provider](how-to-infra-runtime.md#select-an-experimental-browser-or-computer-provider) |
<!-- END GENERATED TASK NAVIGATION -->

具体契约见 [Host/Core](api-host-core.md)、[Client/Web](api-client-web.md) 和[基础设施](api-infra-runtime.md) 的 API reference。

每条路径都以真实 Profile 装载和卸载为完成边界；静态导出或声明存在只用于定位。
