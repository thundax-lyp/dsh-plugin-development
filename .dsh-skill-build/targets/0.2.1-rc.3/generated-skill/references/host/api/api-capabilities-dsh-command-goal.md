# @deepseek-ai/dsh-command-goal 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-command-goal` 为用户提供 `/goal` 命令，以便直接在交互式 UI 中创建、编辑、暂停、恢复、清除并查看当前 goal。命令及其直接输出留在 UI 中，不进入模型请求。接受的变更会持久化；create 或 edit 携带的有序图片或文件附件会成为一条普通用户消息，供后续 Goal Round 读取。此包适用于带命令适配器的交互式部署；没有适配器的无头与自动化应用不需要它。

### 使用本包

在挂载了命令适配器的交互式部署中使用 `dsh-command-goal`——随附的 Web 客户端是参考实现。它让用户无需模型轮次即可直接控制 goal 生命周期：命令在 UI 命令平面执行，适配器直接渲染其结果。

#### 命令参考

每个子命令都针对调用 agent（智能体）的当前 goal 执行；没有 goal 时，裸 `/goal` 显示用法。

| 输入 | 结果 |
|---|---|
| `/goal` | 显示当前目标、持久 phase、Round 数量与上限、进程本地续行启用状态与有效的下一步命令；被阻塞的 goal 还会显示其策略代码与说明 |
| `/goal <objective>` | 创建 goal 并启用续行，或用全新身份替换已完成 goal |
| `/goal edit <objective>` | 编辑当前目标，不改变其 phase 或续行启用状态 |
| `/goal pause` | 暂停 active goal 并停用续行 |
| `/goal resume` | 恢复已停止 goal，或在会话 resume 或 fork 后重新启用 active goal；仍受剩余 Round 上限约束 |
| `/goal clear` | 清除当前 goal，同时保留其持久历史 |

#### 输入语法

只有控制词（`clear`、`pause`、`resume`、`edit`）占据完整输入时才被识别；其他任何非空后缀都是目标，因此 `/goal pause after verification` 会创建该字面目标。`edit` 内联接收替换内容，并拒绝直接替换未完成的 goal。可预期的领域拒绝会变成稳定的直接命令错误，不暴露带品牌类型的 id 或 revision；意外实现失败仍会让分发失败，使适配器能将其报告为命令失败。

#### 附件

`/goal` 声明附件支持。附件只随目标本身：create 或 edit 成功后，命令提交一条用户 followup 消息，按选择顺序携带已准入的图片块与文件块，再附加固定文本 `Reference attachments for the goal objective.`。后续 Goal Round 从普通会话历史读取这些内容，goal 领域不存储附件状态。其他任何子命令以及被拒绝的 create 或 edit，都会在领域变更前返回直接错误，并保留 composer 的草稿和附件卡。

#### 组合方式

命令注入命令注册表与 goal 服务。自定义应用会挂载它们的所有者与此插件；自动续行仍是独立选择：

```yaml
- id: commands
  name: '@deepseek-ai/dsh-commands'
- id: goal
  name: '@deepseek-ai/dsh-goal'
- id: command-goal
  name: '@deepseek-ai/dsh-command-goal'
```

随附的 `dsh` 基础配置启用持久 goal 栈与此命令。Web bundle 把 goal 服务与 driver 保留在 Host，禁用基础命令 producer，并在 `standard`、`code` 和 `cordis` agent preset 中挂载 producer；`minimal` 会省略它。ACP（Agent Client Protocol）自动化应用启用领域与模型工具，但不挂载命令适配器。独立的 `sdk-minimal` profile 省略完整 goal 栈，因此其结果 API 仍在一个关联的物理轮次后结束。

-----

### 已知限制与延期工作

这些限制说明命令何时不合适或需要特别注意。它们是当前包约束，不是任务积压。

- **仅纯文本交互**——通用命令注册表没有模态编辑表单或替换确认回调；内联 edit 与显式 clear 能在不同适配器中保持明确且一致的破坏性意图。
- **没有逐命令 Round 上限参数**——`defaultMaxGoalRounds` 仍是部署配置；用户直接请求时，可以要求模型通过另行授权的 goal 工具编辑 `max_goal_rounds`。
- **没有持续状态组件**——裸 `/goal` 是可移植的观察接口；不提供适配器专用徽标或重连后可恢复的命令输出。
- **随附应用中只有 Web 命令适配器使用此命令**——无头、ACP 自动化和 JSON-RPC 适配器不消费 `ctx.commands`。如果组合中包含面向模型的 goal 工具，普通提示词仍能授权它们。

## apply（.）

公开导入：`@deepseek-ai/dsh-command-goal`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-command-goal.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-command-goal`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-command-goal.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-command-goal`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "command-goal";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-command-goal.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
