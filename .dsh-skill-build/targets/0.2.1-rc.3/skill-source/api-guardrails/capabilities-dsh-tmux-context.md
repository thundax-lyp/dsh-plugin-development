# @deepseek-ai/dsh-tmux-context 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-tmux-context` 让模型识别其 agent 进程所在的 tmux 会话、window、pane 和 pane 树布局。它仅在位置发生变化时，于每轮的第一个步骤追加一条持久、带来源的读数。若终端只继承了 tmux 环境变量，却并未在所指名的 pane 中运行，则不添加任何内容；查询失败同样不添加内容，也不会使该轮失败。本包需主动启用，且不包含在随附的 Web 或无头 profile 中。

### 使用本包

当 agent 进程运行在 tmux 内、且模型需要知道其 window 与 pane 位置时，挂载此插件。每条读数都是持久历史中额外的一条 user 角色消息；位置未变化时不添加任何内容，因此长时会话累积很少。

#### 模型能得到什么

在 tmux 状态发生变化的每一轮，模型会收到一条带来源标记的上下文消息，包含会话名称、window 索引与名称、pane 索引与 id、活动标志，以及紧凑的 pane 树布局。读数只发生在每轮的第一个步骤；轮次中途移动或缩放的 pane 会在下一轮反映。像素尺寸有意省略，相邻 pane 的可见内容从不采集。

#### 配置

最小挂载无需任何配置。`refreshIntervalMs` 为正值时，会额外抑制距最近一次注入不足该毫秒数的注入；省略或设为 `0` 时，只要 tmux 状态自上次注入以来发生变化就注入。

```yaml
- name: '@deepseek-ai/dsh-tmux-context'
  config:
    refreshIntervalMs: 60000
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `refreshIntervalMs` | `0`（每个变化轮次） | 同一会话中两次持久注入之间的最小毫秒数 |

#### 何时知道位置

只有当进程的控制终端与 pane 的 `#{pane_tty}` 一致时，才视为位于 tmux 中；从 tmux shell 启动的终端（VS Code 集成终端、桌面启动器）会继承变量但不在 pane 内，因此被视为不在 tmux 中。`ctx.shell` 缺失、环境变量不存在或读数格式非法时是空操作；执行器拒绝会被兜住并记录为警告，而不会使该轮失败。

-----

### 已知限制与延期工作

这些限制说明 tmux 位置上下文何时不合适。它们是当前包约束。

- **仅第一个步骤**——轮次中途移动或缩放的 pane 会在下一轮反映，而非在步骤之间。
- **仅自身位置**——插件从不采集相邻 pane 的可见文本。
- **只有布局，没有尺寸**——省略 pane/window 像素尺寸；仅报告布局树与活动标志。
- **制表符分隔字段**——若 tmux window 名称包含字面两字符序列 `\t`，会使读数分割错误并作为非法读数跳过；常规名称不受影响。
- **基于 tty 的 pane 判定**——只有当进程的控制终端与 `$TMUX_PANE` 的 `#{pane_tty}` 一致时，才视为「位于 tmux 中」。这会有意排除从 tmux 祖先进程继承 `$TMUX`／`$TMUX_PANE` 的终端（如 VS Code 集成终端）。`ps -o tty=` 属于 POSIX；在其或 `#{pane_tty}` 不可用的环境中，该检查即为空操作。

## Config（.）

公开导入：`@deepseek-ai/dsh-tmux-context`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    refreshIntervalMs?: number;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tmux-context.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-tmux-context`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tmux-context.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-tmux-context`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tmux-context.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-tmux-context`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "tmux-context";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tmux-context.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
