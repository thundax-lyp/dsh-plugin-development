# 向可继续子任务发送消息并中止轮次操作指南

## 向可继续子任务发送消息并中止轮次

目标结果：向可继续子任务发送消息并中止轮次并观察结果及资源释放。

### 目标与前置

`dsh-tool-subagent-control` 为可继续子级添加全局控制工具：`send_message` 在直接父级与子级之间进行 steering（中途引导），`interrupt_agent` 停止子级当前轮次但保留其收件箱与后代，`list_agents`（来自可单独加载的 `list-agents` 插件）按持久化 ID 与标签列出可继续子级。

消费项目使用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。先阅读[使用本包](../api/api-capabilities-dsh-tool-subagent-control.md#使用本包)，该处拥有本包的具体配置、调用顺序和产品限制；不要以文件存在或安装成功推定依赖服务已挂载。

### 既有组合

目标版本的 base 已声明本包的 `tool-subagent-control` 条目；基于默认 web/base 的项目应先复用它。条目存在仍须检查 disabled、条件与实际激活；本插件只管理自己的新增贡献，不卸载共享基础服务。

### 实现和装载

1. 确认使用的是 `@deepseek-ai/dsh-tool-subagent-control@0.2.1-rc.3`。按上述公开用法选择配置和提供方；配置字段与默认值以 API 页为准，不把其他后端的同名字段搬来。
2. 先按[已有 Profile 的组合检查](../../infra/how-to/how-to-core-profile.md#在已有-profile-中复用或替换服务)核对目标服务、provider 和 entry id。已有实现时只添加自己的贡献插件，配置变化覆盖既有 id；只有确认组合缺失时才按[配置 bundle 文件结构](../examples/example-local-mcp.md#配置-bundle)提供该可执行插件行。不要把 API 页给空组合的配置片段再次 insert 到已有 Profile。库、抽象接口和纯数据子路径不作为可执行插件行；消费插件通过 `inject` 使用相应服务。
3. 从 bundle 父目录运行 `dsh plugin --profile demo add ./你的bundle目录`，随后运行 `dsh --profile demo`。若本任务需要 Web，先在全新隔离 home 用 `dsh --profile demo --from-default-profile web --dump-config` 初始化，再安装 bundle；该初始化会替换已有目标目录，不能对现有生产 Profile 直接套用。
4. 按 [使用本包](../api/api-capabilities-dsh-tool-subagent-control.md#使用本包) 给出的真实输入和触发路径执行“向可继续子任务发送消息并中止轮次”。先确认服务/提供方和必要认证可用，再触发；观察该页指定的工具结果、UI、目录或持久事件，不以空结果替代业务输出。
5. 用本包公开的 signal/disposer/释放接口结束工作；移除贡献 bundle 后重启 Profile，确认该能力的自有注册与资源撤回。对仍被其他包共享的服务核对 owner，不能因本插件卸载而销毁它。

### 失败与完成判据

按 API 页列出的失败分支复现一次拒绝或不可用输入；有异步工作时另测取消和卸载，有持久业务状态时另测重启恢复。模型可见内容只能来自 consumer 写入 Session 的事实。依赖本机平台、外部认证或网络的提供方必须在对应环境验证；类型编译只证明声明可用，安装与 Profile 激活只证明组合入口，二者都不能替代业务结果。

### 权威对象契约

- [api-capabilities-dsh-tool-subagent-control](../api/api-capabilities-dsh-tool-subagent-control.md)。
