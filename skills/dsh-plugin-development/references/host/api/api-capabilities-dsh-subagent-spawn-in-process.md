# @deepseek-ai/dsh-subagent-spawn-in-process 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-subagent-spawn-in-process` 是一个进程内 subagent 后端：它在当前进程中运行每个委派任务，子 agent（智能体）是一个全新子 `Agent`，复用宿主的 agent 工厂及 LLM（大语言模型）/工具服务。子 agent 以空对话开始，因此任务提示词必须自足；除非 `request.agentOptions` 覆盖，否则它继承父 agent 的工作目录、会话谱系、提供方、模型、推理强度与输出 token 上限。委派工具或 API 调用以 `spawn` 提供方名称找到它。需要成本最低的委派传输时选择它；需要子 agent 建立在父级已完成对话轮次之上时，请选择 fork 后端。

### 使用本包

在需要把工作委派给全新进程内子 agent 的组合中挂载此后端。常用配置路径很明确：加载 subagent 服务与本后端，再把 `dsh-tool-subagent` 之类的委派工具指向 `spawn` 提供方。

#### 何时选择

当子 agent 不需要父级对话、且可以接受在本进程内运行时，选择 spawn 后端。当子 agent 必须建立在已完成父级轮次之上时——fork 后端会提供这些历史——或必须在本进程之外运行时（进程外后端提供此能力），请避免使用它。由于子 agent 默认继承父级的工作目录与 LLM 选择，自足的提示词会按原样生效。

#### 最小配置

先加载 subagent 服务与本后端，再为每个目标配置一个委派工具。这是暴露由 spawn 支撑的 `subagent` 工具的最小组合：

```yaml
- name: '@deepseek-ai/dsh-subagent'
- name: '@deepseek-ai/dsh-subagent-spawn-in-process'
- name: '@deepseek-ai/dsh-tool-subagent'
  config:
    provider: spawn
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `providerName` | `spawn` | 注册到 `ctx.subagents` 的提供方名称 |

#### 一次委派会做什么

一次工具调用创建后台子 agent 并立即返回子会话 ID。子级在自己的会话中工作，父级通过完成通知收到其最终答案。子级也可以通过 `send_message` 发送消息。被拒绝的启动不会留下已发布的子 agent；工作流等程序调用方可以直接等待 activation 的结果。

显式 `agentPreset` 独立选择当前注册的 preset；省略时加入父方的活跃代际。只有 spawn 支持此选择。persona 与工具放在 preset 定义中。冷恢复遵守共享的子级组装规则。

-----

### 已知限制与延期工作

这些限制说明何时选择该后端是错误的；它们是当前包约束。

- **全新表示不含父级 transcript（文本记录）**——子 agent 继承 cwd、谱系、提供方、模型、推理强度及输出 token 上限，但不继承父级的任何对话；需要已完成轮次上下文时，请使用 fork 后端。

## Config（.）

公开导入：`@deepseek-ai/dsh-subagent-spawn-in-process`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    providerName: string;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-spawn-in-process.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-subagent-spawn-in-process`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-spawn-in-process.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-subagent-spawn-in-process`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-spawn-in-process.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-subagent-spawn-in-process`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "subagent-spawn-in-process";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-spawn-in-process.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
