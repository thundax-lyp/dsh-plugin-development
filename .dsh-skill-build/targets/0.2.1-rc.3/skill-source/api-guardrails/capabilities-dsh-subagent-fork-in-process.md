# @deepseek-ai/dsh-subagent-fork-in-process 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-subagent-fork-in-process` 是一个进程内 subagent 后端：它以父级已完成的对话轮次作为每个子 agent 的初始内容——子 agent 能看到所有已完成轮次，但看不到进行中的轮次，因此后续工作可以在对话基础上继续，而无需重复提供对话内容。委派工具以 `fork` 提供方名称找到它，其行为与 spawn 后端一致，唯一差异是会话初始内容。当子任务延续当前对话时选择它；当子 agent 必须独立运行时选择 spawn。初始内容是 fork 时的一次性快照：此后父级记录的任何内容都不会到达子 agent。

### 使用本包

当委派的工作必须建立在父级对话之上时，挂载此后端。常用路径与 spawn 相同：加载 subagent 服务与本后端，再把 `dsh-tool-subagent` 之类的委派工具指向 `fork` 提供方。

#### 何时选择

当子 agent 需要对话的已完成轮次时——后续分析、审查、延续——选择 fork。当子 agent 应全新开始时选择 spawn；当子 agent 不能共享本进程时选择进程外后端。初始内容只传递对话历史：子 agent 仍获得全新的工具作用域，且不继承父级的任何权限。

#### 初始内容边界

初始内容止于父级最后一个已完成的轮次。subagent 启动时，父级当前的工具调用轮次仍在进行，因此该进行中的轮次绝不会被包含；在第一个已完成轮次之前，初始内容为空，子 agent 的行为与全新 spawn 相同。

#### 最小配置

先加载 subagent 服务与本后端，再配置一个委派工具。此组合暴露由 fork 支撑的 `subagent` 工具：

```yaml
- name: '@deepseek-ai/dsh-subagent'
- name: '@deepseek-ai/dsh-subagent-fork-in-process'
- name: '@deepseek-ai/dsh-tool-subagent'
  config:
    provider: fork
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `providerName` | `fork` | 注册到 `ctx.subagents` 的提供方名称 |

#### 一次 fork 委派会做什么

一次工具调用创建后台子 agent 并立即返回子会话 ID。子级在自己的会话中工作，父级通过完成通知收到其最终答案。子级也可以通过 `send_message` 发送消息。被拒绝的启动不会留下已发布的子 agent；工作流等程序调用方可以直接等待 activation 的结果。

-----

### 已知限制与延期工作

这些限制说明何时选择该后端是错误的；它们是当前包约束。

- **初始内容是一次性快照**——子 agent 只能看到 fork 时父级已完成的轮次，看不到父级此后记录的任何内容；不会实时共享上下文。
- **随附 fork 工具不公开子级 LLM（大语言模型）路由选择**——它们继承父级提供方与模型，使复制的历史仍有资格复用 KV Cache。在某项改动能保留复用或公开有界重算成本前，路由选择保持禁用。

## Config（.）

公开导入：`@deepseek-ai/dsh-subagent-fork-in-process`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    providerName: string;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-fork-in-process.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-subagent-fork-in-process`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-fork-in-process.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-subagent-fork-in-process`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-fork-in-process.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-subagent-fork-in-process`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "subagent-fork-in-process";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-fork-in-process.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
