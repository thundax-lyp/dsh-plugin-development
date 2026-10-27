# @deepseek-ai/dsh-command-compact 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-command-compact` 为聊天 UI 添加 `/compact` 命令：输入它，对话就会按需压缩（compaction）——即使尚未触发自动压力，较早历史也会被替换为一条摘要。该命令适用于任何压缩后端，且不消耗模型轮次；完成后你会看到压缩了多少历史项以及估算节省的 token 数。当 agent（智能体）正在执行轮次或压缩已在运行时，它会告诉你压缩暂不可用。运行期间你发送的提示词会保持排队，并在压缩结束后才开始。

### 使用本包

当对话已经很长、想立即压缩时，在聊天 UI 中输入 `/compact`。随附 `dsh` 基础配置把该命令挂载在默认后端旁，因此它通常已经可用。

#### 使用命令

| 输入 | 结果 |
|---|---|
| `/compact` | 即使未达到自动压力，也压缩一段有效、平衡的较早范围，然后报告被替换的历史项数量与估算 token 数。 |
| `/compact`，但没有可压缩历史 | `No compactable history yet.`——不会有任何改变。 |
| `/compact <anything>` | `Usage: /compact (no arguments)`——该命令不接受参数。 |

#### 你会看到什么

命令会把每个预期失败转换为可直接展示的稳定消息；左列的情形产生右列的消息。

| 情形 | 你看到的消息 |
|---|---|
| 压缩已在运行，或 agent 正在轮次中 | `Compaction is unavailable because this process has an active compaction, or the agent is not idle.` |
| 压缩过程中历史发生了变化 | `The history selected for compaction changed before it could be replaced. The attempt is recorded in the session log.` |
| 无法产生有用的摘要 | `Compaction could not produce a useful summary. The attempt is recorded in the session log.` |
| 压缩未干净地完成 | `Compaction did not finish cleanly; some session history may have changed. Inspect the current session state before retrying.` |
| 会话无法保存 | `Compaction finished, but the session could not be saved.` |

取消命令会停止等待：后端完成必需的清理，命令以 `Compaction cancelled.` 结算，UI 停止等待。除这些预期情形外的失败会以错误形式呈现，而不会被静默转换。

#### 组合命令

挂载命令注册表、一个压缩后端与本插件：

```yaml
- id: commands
  name: '@deepseek-ai/dsh-commands'
- id: compaction-basic
  name: '@deepseek-ai/dsh-compaction-basic'
- id: command-compact
  name: '@deepseek-ai/dsh-command-compact'
```

随附 `dsh` 基础配置把它挂载在默认后端旁，Web 客户端提供命令适配器。未组合命令适配器的自动化接口只保留自动压缩。

#### 对话会发生什么

命令成功时，所选较早范围会被替换为一条摘要，近期历史不受影响；命令会报告压缩的项目数与估算 token 数。压缩运行期间你提交的提示词会被接受，并只在压缩结束后才开始——不会被丢失或重排。命令生命周期记录在会话日志中，但绝不进入模型历史。

-----

### 已知限制与延期工作

这些限制说明该命令何时不合适；它们是当前包约束。

- **仅限空闲状态**——当轮次或已获接纳的唤醒提示词拥有优先权时，`/compact` 会报告压缩暂不可用；命令本身不会排队。
- **不接受范围或策略参数**——无参数形式使各命令适配器的行为保持稳定。显式范围仍由编程接口 `compactRegion()` 处理。
- **仅限命令适配器**——没有 `ctx.commands` 的接口无法调用该命令，只能依赖自动压力压缩。

## apply（.）

公开导入：`@deepseek-ai/dsh-command-compact`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-command-compact.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-command-compact`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-command-compact.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-command-compact`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "command-compact";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-command-compact.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
