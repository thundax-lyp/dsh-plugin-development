# @deepseek-ai/dsh-tool-subagent-control 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-tool-subagent-control` 为可继续子级添加全局控制工具：`send_message` 在直接父级与子级之间进行 steering（中途引导），`interrupt_agent` 停止子级当前轮次但保留其收件箱与后代，`list_agents`（来自可单独加载的 `list-agents` 插件）按持久化 ID 与标签列出可继续子级。父级与可继续子级继承相同的 `send_message` 定义和顺序，因此模型通信不会增加子级专属工具 schema。是否加载这些工具不会决定委派工具是否启动可继续工作。

### 使用本包

在模型需要对可继续子级发消息、中断或列出的任何组合中挂载本包。根插件只需要 subagent 服务；列表工具是独立插件，部署方可以省略。

#### 最小配置

先加载 subagent 服务、一个后端、委派工具与本包。加上独立的列表插件即可公开全部三个工具：

```yaml
- name: '@deepseek-ai/dsh-subagent'
- name: '@deepseek-ai/dsh-subagent-spawn-in-process'
- name: '@deepseek-ai/dsh-tool-subagent'
  config:
    provider: spawn
- name: '@deepseek-ai/dsh-tool-subagent-control'
- name: '@deepseek-ai/dsh-tool-subagent-control/list-agents'
```

本包不接收任何配置：根插件提供 `send_message` 与 `interrupt_agent`，列表插件提供 `list_agents`。

#### send_message

向 `agent_id` 指定的 Agent 发送消息：任何确切在线 Agent 都可以向自己的直接可继续子级发送消息，驻留的可继续子级还可以向自己的直接父级发送消息。正在工作的目标通过 Steer 在最近的步骤边界接收消息；非活跃目标会通过继续执行生命周期启动或恢复一个轮次。调用只返回接受结果（被接受消息的稳定 `messageId`），绝不返回回复。失败——不受支持的目标、不可用的父级、未知子级、缺少描述符而无法恢复的子级，或准入被拒——会明确说明消息未送达。

#### interrupt_agent

外部执行会永久停止，不能接收后续消息。本地目标只停止当前轮次：已排队消息保持暂停，直到之后调用 `send_message`；后代继续运行，子级仍可接受后续消息。调用在停止请求被接受后立即返回，不等待目标完全停稳；中断已结束的 agent 会被接受并按空操作处理，而自身、同级、陈旧及非祖先调用方会收到出错结果。

#### list_agents

列出调用方 agent 下方的可继续子级：`children`（默认）从父目录读取直接子级，不打开子日志；`descendants` 按稳定前序递归读取子级目录，并为每个条目标注其持久化直接父级会话 ID 与深度。状态来自在线 Agent 注册表——`running` 或 `inactive`。外部条目被省略，不读取子 Session。可读取的一次性子级不出现在输出中，但其目录仍是遍历节点。未知模式与无法读取的子级目录（包括一次性子级）仅在 `descendants` 作用域中以诊断信息呈现。普通 Session fork 不是目录条目，因此从源 Session 列表中既无法发现这些 fork，也无法发现其后代。

-----

### 已知限制与延期工作

这些限制说明控制工具无法观察或引导什么；它们是当前包约束。

- **已投递消息没有独立结果**——接受时只返回其 inbox `messageId`；目标后续工作会落入该目标的持久化会话，绝不会通过本工具收集。回复是另一条显式指定地址的 `send_message`，而非本次调用的结果。
- **只有受支持的相邻 Agent 可以通信**——每个发送方都可以向直接可继续子级发送消息；只有具备驻留可继续 Activation 的发送方可以向自己的直接父级发送消息，且该父级必须仍在线；同级与更深的后代不能作为消息目标，只有向直接子级投递才支持冷激活。
- **列表是快照，而非投递承诺**——它可能与发布、dispose（资源释放）或后续消息发生竞态，另一个进程也可能激活当前进程报告为 `inactive` 的子级；跨进程准确性需要共享租约。`interrupt_agent` 自己执行权威的在线 lineage 检查，因此过期的发现结果不会授予权限。
- **没有分页或删除**——系统返回完整且稳定排序的集合；只要子级会话仍在持久化存储中，它就会继续出现在列表中，服务级上限或删除操作留待后续产品决策。

## apply（.）

公开导入：`@deepseek-ai/dsh-tool-subagent-control`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-subagent-control.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-tool-subagent-control`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-subagent-control.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-tool-subagent-control`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "tool-subagent-control";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-subagent-control.md)。

## apply（./list-agents）

公开导入：`@deepseek-ai/dsh-tool-subagent-control/list-agents`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-subagent-control.md)。

## inject（./list-agents）

公开导入：`@deepseek-ai/dsh-tool-subagent-control/list-agents`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-subagent-control.md)。

## name（./list-agents）

公开导入：`@deepseek-ai/dsh-tool-subagent-control/list-agents`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "tool-subagent-list-agents";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-subagent-control.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
